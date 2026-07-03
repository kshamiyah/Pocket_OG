// Comparison harness run through Vitest (so Vite resolves the workspace + aliases).
//   npx vitest run src/search/rankCompare.test.js
// Prints a V1-vs-V2 table and writes ranker-compare.html next to this file.
import { test, expect } from "vitest";
import { writeFileSync } from "node:fs";
import { search, SEARCH_INDEX } from "./engine";
import { searchV2 } from "./rankV2";

const QUERIES = [
  "pprom antibiotics", "waters broken", "leaking fluid", "heavy bleeding ed",
  "acute menorrhagia", "eclampsia magnesium", "magnesium dose", "ectopic methotrexate",
  "cord prolapse", "reduced fetal movements", "gbs prophylaxis", "twin delivery",
  "postmenopausal bleeding", "ohss", "cholestasis itching", "ctg classification",
  "magneisum", "ectopc pregnancy", "pre eclampsia bp", "iron anaemia pregnancy",
];

const label = (p) => `${p.gl ? p.gl + " · " : ""}${p.title}`;
const top = (res, n = 5) => (res.primary.length ? res.primary : res.fallback).slice(0, n).map(label);
const firstDiff = (a, b) => { const n = Math.max(a.length, b.length); for (let i = 0; i < n; i++) if (a[i] !== b[i]) return i; return -1; };

test("compare rankers on realistic queries", () => {
  const rows = QUERIES.map(q => {
    const v1 = top(search(q, SEARCH_INDEX));
    const v2 = top(searchV2(q, SEARCH_INDEX));
    const diffAt = firstDiff(v1, v2);
    return { q, v1, v2, changed: diffAt !== -1, diffAt };
  });

  let out = "";
  for (const r of rows) {
    out += `\n${r.q}${r.changed ? `  (reordered from #${r.diffAt + 1})` : "  (unchanged)"}\n`;
    for (let i = 0; i < 5; i++) {
      const a = r.v1[i] ?? "", b = r.v2[i] ?? "";
      out += `  ${(a !== b ? "→ " : "  ")}${a.slice(0, 40).padEnd(42)}${b.slice(0, 40)}\n`;
    }
  }
  const changed = rows.filter(r => r.changed).length;
  out += `\n${changed}/${rows.length} queries reordered.\n`;
  console.log(out);

  // write reviewable HTML
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const list = (arr, other) => "<ol>" + arr.map((x, i) => `<li class="${other[i] !== x ? "moved" : ""}">${esc(x)}</li>`).join("") + "</ol>";
  const body = rows.map(r => `<section class="${r.changed ? "changed" : "same"}"><h2>${esc(r.q)} <span class="tag ${r.changed ? "" : "same"}">${r.changed ? "reordered from #" + (r.diffAt + 1) : "unchanged"}</span></h2><div class="cols"><div><h3>Live (V1)</h3>${list(r.v1, r.v2)}</div><div><h3>Prototype (V2)</h3>${list(r.v2, r.v1)}</div></div></section>`).join("");
  writeFileSync(new URL("./ranker-compare.html", import.meta.url),
    `<!doctype html><meta charset="utf8"><title>Ranker comparison</title><style>body{font:15px system-ui;margin:0;background:#f6f7f9;color:#15202b}.wrap{max-width:960px;margin:0 auto;padding:32px}h1{font-size:24px}section{background:#fff;border:1px solid #e3e8ee;border-radius:12px;padding:16px 20px;margin:14px 0}section.same{opacity:.55}h2{font-size:16px;margin:0 0 12px;display:flex;gap:10px;align-items:center}.tag{font-size:11px;font-weight:700;background:#fde4cf;color:#b4531a;padding:2px 8px;border-radius:999px}.tag.same{background:#e6eef0;color:#5a6b70}.cols{display:grid;grid-template-columns:1fr 1fr;gap:20px}h3{font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:#8b95a1;margin:0 0 6px}ol{margin:0;padding-left:20px}li{padding:2px 0;font-size:13.5px}li.moved{background:#fff5ec}@media(max-width:640px){.cols{grid-template-columns:1fr}}</style><div class="wrap"><h1>Search ranking — Live vs Prototype</h1><p>${changed} of ${rows.length} queries reorder. Highlighted rows moved position.</p>${body}</div>`);

  expect(rows.length).toBe(QUERIES.length);
});
