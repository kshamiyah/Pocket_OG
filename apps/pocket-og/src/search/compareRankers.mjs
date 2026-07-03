// Side-by-side comparison of the live ranker (search) vs the prototype (searchV2).
// Run:  node src/search/compareRankers.mjs           (text table to stdout)
//       node src/search/compareRankers.mjs --html     (writes ranker-compare.html)
// Requires the guidelines workspace to be built/resolvable (same as the app).

import { search, SEARCH_INDEX } from "./engine.js";
import { searchV2 } from "./rankV2.js";
import { writeFileSync } from "node:fs";

// Realistic clinical queries: exact terms, lay phrasing, multi-word, and typos.
const QUERIES = [
  "pprom antibiotics",
  "waters broken",
  "leaking fluid",
  "heavy bleeding ed",
  "acute menorrhagia",
  "eclampsia magnesium",
  "magnesium dose",
  "ectopic methotrexate",
  "cord prolapse",
  "reduced fetal movements",
  "gbs prophylaxis",
  "twin delivery",
  "postmenopausal bleeding",
  "ohss",
  "cholestasis itching",
  "ctg classification",
  "magneisum",          // typo
  "ectopc pregnancy",   // typo
  "pre eclampsia bp",
  "iron anaemia pregnancy",
];

const label = (p) => `${p.gl ? p.gl + " · " : ""}${p.title}`;
const top = (res, n = 5) => (res.primary.length ? res.primary : res.fallback).slice(0, n).map(label);

function firstDiff(a, b) {
  const n = Math.max(a.length, b.length);
  for (let i = 0; i < n; i++) if (a[i] !== b[i]) return i;
  return -1;
}

const rows = QUERIES.map(q => {
  const v1 = top(search(q, SEARCH_INDEX));
  const v2 = top(searchV2(q, SEARCH_INDEX));
  return { q, v1, v2, changed: firstDiff(v1, v2) !== -1, diffAt: firstDiff(v1, v2) };
});

if (process.argv.includes("--html")) {
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const list = (arr, other, hi) => "<ol>" + arr.map((x, i) => {
    const moved = other[i] !== x;
    const isTop = i === hi;
    return `<li class="${moved ? "moved" : ""} ${isTop ? "topdiff" : ""}">${esc(x)}</li>`;
  }).join("") + "</ol>";
  const body = rows.map(r => `
    <section class="${r.changed ? "changed" : "same"}">
      <h2>${esc(r.q)} ${r.changed ? `<span class="tag">reordered from #${r.diffAt + 1}</span>` : `<span class="tag same">unchanged</span>`}</h2>
      <div class="cols">
        <div><h3>Live (V1)</h3>${list(r.v1, r.v2, r.diffAt)}</div>
        <div><h3>Prototype (V2)</h3>${list(r.v2, r.v1, r.diffAt)}</div>
      </div>
    </section>`).join("");
  writeFileSync(new URL("./ranker-compare.html", import.meta.url), `<!doctype html><meta charset="utf8"><title>Ranker comparison</title>
  <style>body{font:15px system-ui;margin:0;background:#f6f7f9;color:#15202b}.wrap{max-width:960px;margin:0 auto;padding:32px}
  h1{font-size:24px}section{background:#fff;border:1px solid #e3e8ee;border-radius:12px;padding:16px 20px;margin:14px 0}
  section.same{opacity:.6}h2{font-size:16px;margin:0 0 12px;display:flex;gap:10px;align-items:center}
  .tag{font-size:11px;font-weight:700;background:#fde4cf;color:#b4531a;padding:2px 8px;border-radius:999px}
  .tag.same{background:#e6eef0;color:#5a6b70}.cols{display:grid;grid-template-columns:1fr 1fr;gap:20px}
  h3{font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:#8b95a1;margin:0 0 6px}
  ol{margin:0;padding-left:20px}li{padding:2px 0;font-size:13.5px}li.moved{background:#fff5ec}li.topdiff{font-weight:700}
  @media(max-width:640px){.cols{grid-template-columns:1fr}}</style>
  <div class="wrap"><h1>Search ranking — Live vs Prototype</h1>
  <p>${rows.filter(r => r.changed).length} of ${rows.length} queries reorder. Highlighted rows moved position; bold marks the first changed rank.</p>
  ${body}</div>`);
  console.log("wrote src/search/ranker-compare.html");
} else {
  let changed = 0;
  for (const r of rows) {
    if (r.changed) changed++;
    console.log("\n\x1b[1m" + r.q + "\x1b[0m" + (r.changed ? `  (reordered from #${r.diffAt + 1})` : "  (unchanged)"));
    const w = 42;
    console.log("  " + "V1 (live)".padEnd(w) + "V2 (prototype)");
    for (let i = 0; i < 5; i++) {
      const a = r.v1[i] ?? "", b = r.v2[i] ?? "";
      const mark = a !== b ? "→ " : "  ";
      console.log("  " + a.slice(0, w - 2).padEnd(w) + mark + b.slice(0, 40));
    }
  }
  console.log(`\n${changed}/${rows.length} queries reordered.`);
}
