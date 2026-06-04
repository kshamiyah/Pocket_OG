import { SYNONYMS } from "./synonyms";

export function expandQuery(q) {
  const terms = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const expanded = new Set(terms);
  for (const term of terms) {
    if (SYNONYMS[term]) SYNONYMS[term].forEach(v => expanded.add(v));
  }
  const full = q.toLowerCase().trim();
  for (const [key, vals] of Object.entries(SYNONYMS)) {
    if (key.includes(" ") && full.includes(key)) vals.forEach(v => expanded.add(v));
  }
  return [...expanded];
}

export function scoreResult(page, terms) {
  const searchText = [
    page.title, page.setting, page.condition, ...page.tags,
    ...page.content.flatMap(b => {
      if (b.type === "text" || b.type === "alert" || b.type === "subheading") return [b.value];
      if (b.type === "list") return b.items;
      if (b.type === "table") return [...b.headers, ...b.rows.flat()];
      return [];
    })
  ].join(" ").toLowerCase();

  let score = 0;
  for (const term of terms) {
    if (page.tags.some(t => t === term)) score += 12;
    else if (page.tags.some(t => t.includes(term) || term.includes(t))) score += 7;
    if (page.title.toLowerCase().includes(term)) score += 7;
    if (page.setting.toLowerCase().includes(term)) score += 5;
    if (page.condition.toLowerCase().includes(term)) score += 5;
    if (searchText.includes(term)) score += 2;
  }
  return score;
}
