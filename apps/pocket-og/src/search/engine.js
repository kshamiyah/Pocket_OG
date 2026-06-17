import { SYNONYMS } from "./synonyms";
import {
  GL952_SECTIONS, GL787_SECTIONS, GL895_SECTIONS, GL861_SECTIONS,
  GL783_SECTIONS, GL880_SECTIONS, GL891_SECTIONS, GL983_SECTIONS,
  CG565_SECTIONS, CG621_SECTIONS, CG623_SECTIONS,
  QS46_SECTIONS, QS22_SECTIONS,
  GTG57_SECTIONS, GTG63_SECTIONS,
  NG88_SECTIONS,
} from "@pocket-og/guidelines";

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
    if (SYNONYMS[term]) SYNONYMS[term].forEach(v => expanded.add(v));
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
  ...QS46_SECTIONS, ...QS22_SECTIONS, ...GTG57_SECTIONS, ...GTG63_SECTIONS,
  ...NG88_SECTIONS,
];

export const SEARCH_INDEX = _WIKI.map(page => ({
  page,
  titleLower: page.title.toLowerCase(),
  settingLower: page.setting.toLowerCase(),
  conditionLower: page.condition.toLowerCase(),
  tagsLower: page.tags.map(t => t.toLowerCase()),
  searchableContent: page.content.flatMap(b => {
    if (b.type === "text" || b.type === "alert" || b.type === "subheading") return [b.value ?? ""];
    if (b.type === "list") return b.items;
    if (b.type === "table") return [...b.headers, ...b.rows.flat()];
    return [];
  }).join(" ").toLowerCase(),
  fallbackText: [page.title, page.condition, page.setting, ...page.tags].join(" ").toLowerCase(),
}));

function _scoreEntry(entry, termPatterns) {
  let score = 0;
  for (const { term, re } of termPatterns) {
    if (entry.tagsLower.some(t => t === term)) score += 12;
    else if (entry.tagsLower.some(t => re.test(t))) score += 7;
    if (re.test(entry.titleLower)) score += 7;
    if (re.test(entry.settingLower)) score += 5;
    if (re.test(entry.conditionLower)) score += 5;
    if (re.test(entry.searchableContent)) score += 2;
  }
  return score;
}

export function search(query, pool) {
  const q = query.trim();
  if (!q) return { primary: [], fallback: [] };

  const terms = expandQuery(q);
  // Build word-boundary regexes once per search, reused across all entries
  const termPatterns = terms.map(term => ({
    term,
    re: new RegExp(`(?<![\\w-])${escapeRe(term)}(?![\\w-])`),
  }));

  let hasPrimary = false;
  const scored = pool.map(entry => {
    const score = _scoreEntry(entry, termPatterns);
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

  // Fallback: prefix match on pre-built fallbackText — single pass, no second scan
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
      .slice(0, 3)
      .map(s => s.entry.page),
  };
}
