// ── Prototype ranker (V2) ─────────────────────────────────────────────────────
// A drop-in alternative to search() in engine.js, kept SEPARATE so the two can be
// compared before anything goes live. Same signature and return shape as search().
//
// What it changes vs the current engine:
//   1. IDF weighting — a rare, discriminating word (e.g. "methotrexate") counts for
//      far more than a common one (e.g. "pregnancy"), instead of every term being
//      worth a flat amount. This is the single biggest ranking win.
//   2. BM25 term-frequency saturation with per-field length normalisation, so a long
//      section doesn't win just by being long, and repeated words show diminishing
//      returns.
//   3. Query-term coverage — a page matching MORE of the words you typed is boosted
//      above a page matching one word very strongly.
//   4. Phrase proximity — an exact phrase match in the title/content gets a bonus.
//
// It reuses the exact same SEARCH_INDEX and synonym set as the live engine, so recall
// (which pages can be found) is unchanged; only the ORDER improves.

import { SEARCH_INDEX } from "./engine";
import { SYNONYMS } from "./synonyms";

// ── small helpers (duplicated from engine.js so engine.js stays untouched) ──
function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

function variants(term) {
  const v = new Set([term]);
  if (term.length >= 4) {
    if (term.endsWith("ies")) v.add(term.slice(0, -3) + "y");
    else if (term.endsWith("es")) v.add(term.slice(0, -2));
    if (term.endsWith("s") && !term.endsWith("ss")) v.add(term.slice(0, -1));
  }
  if (term.length >= 3 && !term.endsWith("s")) {
    v.add(term + "s");
    if (/[^aeiou]y$/.test(term)) v.add(term.slice(0, -1) + "ies");
    else v.add(term + "es");
  }
  return [...v];
}

const _tokenRe = /[a-z0-9]+/g;
function tokenize(str) { return str.toLowerCase().match(_tokenRe) ?? []; }

function levWithin(a, b, max) {
  const la = a.length, lb = b.length;
  if (Math.abs(la - lb) > max) return max + 1;
  let prev = Array.from({ length: lb + 1 }, (_, i) => i);
  for (let i = 1; i <= la; i++) {
    const cur = [i]; let best = i; const ca = a.charCodeAt(i - 1);
    for (let j = 1; j <= lb; j++) {
      const cost = ca === b.charCodeAt(j - 1) ? 0 : 1;
      const val = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      cur[j] = val; if (val < best) best = val;
    }
    if (best > max) return max + 1;
    prev = cur;
  }
  return prev[lb];
}

// ── field model ───────────────────────────────────────────────────────────────
const FIELDS = ["tags", "title", "condition", "setting", "content"];
const FIELD_WEIGHT = { tags: 5.0, title: 4.0, condition: 3.0, setting: 2.5, content: 1.0 };
const TAG_EXACT_BONUS = 6.0; // whole-tag match (e.g. tag "pprom" for query "pprom")
const K1 = 1.2;
const B = 0.6;

// term-frequency map for a token list
function tf(tokens) {
  const m = new Map();
  for (const t of tokens) m.set(t, (m.get(t) ?? 0) + 1);
  return m;
}

// Build the per-document field model + corpus statistics once, from the FULL index
// (IDF must be corpus-wide even when a filtered pool is searched).
const DOCS = new Map(); // page  -> { fields: {field: {tf:Map, len}}, tagsSet }
const DF = new Map();   // token -> document frequency
const FIELD_LEN_SUM = { tags: 0, title: 0, condition: 0, setting: 0, content: 0 };

for (const entry of SEARCH_INDEX) {
  const fieldTokens = {
    tags:      tokenize(entry.tagsLower.join(" ")),
    title:     tokenize(entry.titleLower),
    condition: tokenize(entry.conditionLower),
    setting:   tokenize(entry.settingLower),
    content:   tokenize(entry.searchableContent),
  };
  const fields = {};
  const seenInDoc = new Set();
  for (const f of FIELDS) {
    const toks = fieldTokens[f];
    fields[f] = { tf: tf(toks), len: toks.length };
    FIELD_LEN_SUM[f] += toks.length;
    for (const t of toks) seenInDoc.add(t);
  }
  for (const t of seenInDoc) DF.set(t, (DF.get(t) ?? 0) + 1);
  DOCS.set(entry.page, { fields, tagsSet: entry.tagsSet, tokens: entry.tokens });
}

const N = SEARCH_INDEX.length;
const AVG_LEN = {};
for (const f of FIELDS) AVG_LEN[f] = FIELD_LEN_SUM[f] / Math.max(N, 1);

function idf(token) {
  const df = DF.get(token) ?? 0;
  return Math.log(1 + (N - df + 0.5) / (df + 0.5));
}

// BM25 contribution of one token within one field of one doc
function bm25Field(token, field, doc) {
  const fd = doc.fields[field];
  const f = fd.tf.get(token);
  if (!f) return 0;
  const denom = f + K1 * (1 - B + B * (fd.len / (AVG_LEN[field] || 1)));
  return FIELD_WEIGHT[field] * idf(token) * (f * (K1 + 1)) / denom;
}

// Expand a single raw query word to the set of tokens that should count for it
// (its own plural variants + synonyms). Ties coverage back to the words the user
// actually typed.
const _expandTermCache = new Map();
function expandTerm(raw) {
  if (_expandTermCache.has(raw)) return _expandTermCache.get(raw);
  const out = new Set();
  for (const v of variants(raw)) {
    out.add(v);
    const syn = SYNONYMS[v];
    if (syn) for (const s of syn) tokenize(s).forEach(tok => out.add(tok));
  }
  const arr = [...out];
  _expandTermCache.set(raw, arr);
  return arr;
}

// Multi-word synonym phrases that fire on the whole query string
const _multiWordSynonyms = Object.entries(SYNONYMS)
  .filter(([k]) => k.includes(" "))
  .map(([key, vals]) => ({
    pattern: new RegExp(`(?<![\\w-])${escapeRe(key)}(?![\\w-])`),
    tokens: vals.flatMap(tokenize),
  }));

export function searchV2(query, pool) {
  const q = query.trim();
  if (!q) return { primary: [], fallback: [] };
  const lowerQ = q.toLowerCase();

  const rawTerms = [...new Set(tokenize(lowerQ).filter(t => t.length >= 2))];
  if (!rawTerms.length) return { primary: [], fallback: [] };

  // per raw term: the tokens that satisfy it
  const termExpansions = rawTerms.map(raw => ({ raw, tokens: expandTerm(raw) }));

  // query-level multi-word synonym tokens (not tied to a single raw word)
  const extraTokens = new Set();
  for (const { pattern, tokens } of _multiWordSynonyms) {
    if (pattern.test(lowerQ)) tokens.forEach(t => extraTokens.add(t));
  }

  const avgIdf = rawTerms.reduce((a, t) => a + idf(t), 0) / rawTerms.length;

  let hasPrimary = false;
  const scored = pool.map(entry => {
    const doc = DOCS.get(entry.page);
    if (!doc) return { entry, score: 0 };

    let base = 0;
    let covered = 0;

    for (const { tokens } of termExpansions) {
      let termScore = 0;
      let matched = false;
      // best BM25 across this term's acceptable tokens, summed over fields
      for (const tok of tokens) {
        let tokScore = 0;
        for (const f of FIELDS) tokScore += bm25Field(tok, f, doc);
        if (doc.tagsSet.has(tok)) tokScore += TAG_EXACT_BONUS * idf(tok);
        if (tokScore > 0) { matched = true; termScore = Math.max(termScore, tokScore); }
      }
      // forgiving rescue only if no exact/synonym hit for this term.
      // Scan the high-signal tokens (title/condition/setting/tags) only, and score by
      // the IDF of the token actually matched — so "ectopc" rescuing the rare word
      // "ectopic" (a tag) counts for far more than rescuing a common word. This keeps
      // typos landing on the topically-right page instead of a long incidental one.
      if (!matched) {
        const raw = termExpansions.find(te => te.tokens === tokens).raw;
        let best = 0;
        for (const tk of doc.tokens) {
          let factor = 0;
          if (raw.length >= 3 && tk.startsWith(raw)) factor = 0.6;         // prefix
          else if (raw.length >= 4) {
            const thr = raw.length >= 7 ? 2 : 1;
            if (levWithin(raw, tk, thr) <= thr) factor = 0.4;              // typo
          }
          if (factor) {
            let s = factor * FIELD_WEIGHT.title * idf(tk);
            if (doc.tagsSet.has(tk)) s += factor * TAG_EXACT_BONUS * idf(tk);
            if (s > best) best = s;
          }
        }
        if (best > 0) { termScore = best; matched = true; }
      }
      if (matched) covered += 1;
      base += termScore;
    }

    // query-level multiword synonym contribution
    for (const tok of extraTokens) {
      for (const f of FIELDS) base += 0.5 * bm25Field(tok, f, doc);
    }

    if (base <= 0) return { entry, score: 0 };

    // coverage multiplier — reward matching more of the typed words
    const coverage = covered / rawTerms.length;
    let score = base * (0.4 + 0.6 * coverage);

    // phrase proximity — exact multi-word query appearing verbatim
    if (rawTerms.length >= 2) {
      if (entry.titleLower.includes(lowerQ)) score += 8 * avgIdf;
      else if (entry.searchableContent.includes(lowerQ)) score += 3 * avgIdf;
    }

    hasPrimary = true;
    return { entry, score };
  });

  if (hasPrimary) {
    return {
      primary: scored
        .filter(s => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(s => s.entry.page),
      fallback: [],
    };
  }

  // same last-resort loose fallback as V1
  return {
    primary: [],
    fallback: pool
      .map(entry => ({
        entry,
        fScore: rawTerms.reduce((acc, t) => acc + (entry.fallbackText.includes(t.slice(0, 4)) ? 1 : 0), 0),
      }))
      .filter(s => s.fScore > 0)
      .sort((a, b) => b.fScore - a.fScore)
      .slice(0, 5)
      .map(s => s.entry.page),
  };
}
