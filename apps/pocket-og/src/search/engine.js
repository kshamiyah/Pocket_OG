import { SYNONYMS } from "./synonyms";
import {
  GL952_SECTIONS, GL787_SECTIONS, GL895_SECTIONS, GL861_SECTIONS,
  GL783_SECTIONS, GL880_SECTIONS, GL891_SECTIONS, GL983_SECTIONS,
  CG565_SECTIONS, CG621_SECTIONS, CG623_SECTIONS,
  QS22_SECTIONS,
  GTG57_SECTIONS, GTG63_SECTIONS,
  NG88_SECTIONS,
  GTG67_SECTIONS,
  NHSCSP20_SECTIONS,
  GTG52_SECTIONS, GTG69_SECTIONS, NG25_SECTIONS,
  GTG31_SECTIONS, GTG17_SECTIONS, CG192_SECTIONS,
  NG133_SECTIONS,
  NG229_SECTIONS,
  BASHH_PID_SECTIONS,
  BASHH_HSV_SECTIONS,
  NG73_SECTIONS,
  GTG5_SECTIONS,
  GTG56_SECTIONS,
  GTG22_SECTIONS,
  GTG42_SECTIONS,
  GTG64_SECTIONS,
  GTG27A_SECTIONS,
  GTG27B_SECTIONS,
  NG192_SECTIONS,
  GTG26_SECTIONS,
  GTG45_SECTIONS,
  GTG36_SECTIONS,
  NG137_SECTIONS,
  GTG72_SECTIONS,
  GTG20A_SECTIONS,
  GTG20B_SECTIONS,
  NG194_SECTIONS,
} from "@pocket-og/guidelines";
import { QUICKREF_SECTIONS } from "../data/quickref";
import { APPROACH_SECTIONS } from "../data/approaches";
import { TOG_SECTIONS } from "../data/tog";
import { TRIAL_SECTIONS } from "../data/trials";
import { EXTRA_SEARCH_SECTIONS } from "./extraIndex";

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ─── Forgiving matching helpers ───────────────────────────────────────────────

// Singular/plural (and common -y/-ies) variants of a word, so "antibiotic" and
// "antibiotics", or "pregnancy" and "pregnancies", match each other.
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

// Whole-word regex that matches a term or any of its singular/plural variants.
function termRegex(term) {
  const alt = variants(term).map(escapeRe).join("|");
  return new RegExp(`(?<![\\w-])(?:${alt})(?![\\w-])`);
}

// Bounded Levenshtein — returns the distance, or max+1 as soon as it is exceeded.
function levWithin(a, b, max) {
  const la = a.length, lb = b.length;
  if (Math.abs(la - lb) > max) return max + 1;
  let prev = Array.from({ length: lb + 1 }, (_, i) => i);
  for (let i = 1; i <= la; i++) {
    const cur = [i];
    let best = i;
    const ca = a.charCodeAt(i - 1);
    for (let j = 1; j <= lb; j++) {
      const cost = ca === b.charCodeAt(j - 1) ? 0 : 1;
      const val = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      cur[j] = val;
      if (val < best) best = val;
    }
    if (best > max) return max + 1;
    prev = cur;
  }
  return prev[lb];
}

const _tokenRe = /[a-z0-9]+/g;
function tokenize(str) {
  return str.toLowerCase().match(_tokenRe) ?? [];
}

// Pre-compute multi-word synonym patterns once at load time
const _multiWordSynonyms = Object.entries(SYNONYMS)
  .filter(([k]) => k.includes(" "))
  .map(([key, vals]) => ({
    pattern: new RegExp(`(?<![\\w-])${escapeRe(key)}(?![\\w-])`),
    vals,
  }));

const _expandCache = new Map();

export function expandQuery(q) {
  const normalized = q.toLowerCase().trim();
  if (_expandCache.has(normalized)) return _expandCache.get(normalized);
  const terms = normalized.split(/\s+/).filter(Boolean);
  const expanded = new Set(terms);
  for (const term of terms) {
    // synonym lookup is plural-insensitive (checks singular/plural variants too)
    for (const v of variants(term)) {
      if (SYNONYMS[v]) SYNONYMS[v].forEach(s => expanded.add(s));
    }
  }
  for (const { pattern, vals } of _multiWordSynonyms) {
    if (pattern.test(normalized)) vals.forEach(v => expanded.add(v));
  }
  const result = [...expanded];
  _expandCache.set(normalized, result);
  return result;
}

// Build search index once at module load — content is never flattened again
const _WIKI = [
  ...GL952_SECTIONS, ...GL787_SECTIONS, ...CG565_SECTIONS,
  ...CG621_SECTIONS, ...CG623_SECTIONS, ...GL895_SECTIONS, ...GL861_SECTIONS,
  ...GL783_SECTIONS, ...GL880_SECTIONS, ...GL891_SECTIONS, ...GL983_SECTIONS,
  ...QS22_SECTIONS, ...GTG57_SECTIONS, ...GTG63_SECTIONS,
  ...NG88_SECTIONS,
  ...GTG67_SECTIONS,
  ...NHSCSP20_SECTIONS,
  ...GTG52_SECTIONS, ...GTG69_SECTIONS, ...NG25_SECTIONS,
  ...GTG31_SECTIONS, ...GTG17_SECTIONS, ...CG192_SECTIONS,
  ...NG133_SECTIONS,
  ...NG229_SECTIONS,
  ...BASHH_PID_SECTIONS,
  ...BASHH_HSV_SECTIONS,
  ...NG73_SECTIONS,
  ...GTG5_SECTIONS,
  ...GTG56_SECTIONS,
  ...GTG22_SECTIONS,
  ...GTG42_SECTIONS,
  ...GTG64_SECTIONS,
  ...GTG27A_SECTIONS,
  ...GTG27B_SECTIONS,
  ...NG192_SECTIONS,
  ...GTG26_SECTIONS,
  ...GTG45_SECTIONS,
  ...GTG36_SECTIONS,
  ...NG137_SECTIONS,
  ...GTG72_SECTIONS,
  ...GTG20A_SECTIONS,
  ...GTG20B_SECTIONS,
  ...NG194_SECTIONS,
  ...QUICKREF_SECTIONS,
  ...APPROACH_SECTIONS,
  ...TOG_SECTIONS,
  ...TRIAL_SECTIONS,
  ...EXTRA_SEARCH_SECTIONS,
];

export const SEARCH_INDEX = _WIKI.map(page => {
  const tagsLower = page.tags.map(t => t.toLowerCase());
  const searchableContent = page.content.flatMap(b => {
    if (b.type === "text" || b.type === "alert" || b.type === "subheading") return [b.value ?? ""];
    if (b.type === "list") return b.items;
    if (b.type === "table") return [...b.headers, ...b.rows.flat()];
    return [];
  }).join(" ").toLowerCase();
  const fallbackText = [page.title, page.condition, page.setting, ...page.tags].join(" ").toLowerCase();
  return {
    page,
    titleLower: page.title.toLowerCase(),
    settingLower: page.setting.toLowerCase(),
    conditionLower: page.condition.toLowerCase(),
    tagsLower,
    tagsSet: new Set(tagsLower),
    tagsJoined: tagsLower.join(" · "),
    searchableContent,
    fallbackText,
    // high-signal short tokens for prefix + fuzzy (typo) matching
    tokens: [...new Set(tokenize([page.title, page.condition, page.setting, ...page.tags].join(" ")))],
  };
});

// Exact / plural-tolerant scoring for one term matcher.
function _scoreExact(entry, m) {
  let score = 0;
  if (m.variants.some(v => entry.tagsSet.has(v))) score += 12;
  else if (m.re.test(entry.tagsJoined)) score += 7;
  if (m.re.test(entry.titleLower)) score += 7;
  if (m.re.test(entry.settingLower)) score += 5;
  if (m.re.test(entry.conditionLower)) score += 5;
  if (m.re.test(entry.searchableContent)) score += 2;
  return score;
}

export function search(query, pool) {
  const q = query.trim();
  if (!q) return { primary: [], fallback: [] };

  const terms = expandQuery(q);
  const matchers = terms.map(term => ({ term, variants: variants(term), re: termRegex(term) }));

  // Raw user words drive the forgiving layer (prefix / fuzzy) — kept small so it stays fast
  const rawMatchers = q.toLowerCase().split(/\s+/)
    .filter(t => t.length >= 2)
    .map(term => ({ term, re: termRegex(term) }));

  let hasPrimary = false;
  const scored = pool.map(entry => {
    let score = 0;
    for (const m of matchers) score += _scoreExact(entry, m);

    // Forgiving layer: only rescue a raw word that wasn't found exactly in this entry
    for (const rm of rawMatchers) {
      if (rm.re.test(entry.fallbackText) || rm.re.test(entry.searchableContent)) continue;
      if (rm.term.length >= 3 && entry.tokens.some(tok => tok.startsWith(rm.term))) {
        score += 4; // prefix, e.g. "gent" → gentamicin
        continue;
      }
      if (rm.term.length >= 4) {
        const thr = rm.term.length >= 7 ? 2 : 1;
        if (entry.tokens.some(tok => levWithin(rm.term, tok, thr) <= thr)) {
          score += 3; // typo, e.g. "magneisum" → magnesium
        }
      }
    }

    if (score > 0) hasPrimary = true;
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

  // Last-resort fallback: loose prefix match on the pre-built fallback text
  const rawTerms = q.toLowerCase().split(/\s+/);
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
