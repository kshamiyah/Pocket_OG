// Checks Rx doses that cite the BNF against BNF pages saved locally.
//
// The BNF is UK-only and copyrighted, so pages are saved by hand
// ("Web Page, HTML Only") into bnf-sources/, which git ignores. This script
// finds each page by the bnf.nice.org.uk URL inside it, strips it to text,
// and checks every figure in the app's dose against the BNF wording for the
// same indication. It fails if a page is missing, a figure is not found, or
// nothing was checked.
//
// Run from the repo root: node scripts/check-bnf-doses.mjs

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC_DIR = join(ROOT, "bnf-sources");

// Each check: an app card route, the BNF page, the indication heading as the
// BNF prints it, and the BNF dose text for that indication. Every number in
// the app's dose and frequency must appear in that BNF dose text.
const CHECKS = [
  {
    file: "apps/pocket-og/src/data/rx/antibiotics.js",
    exportName: "ANTIBIOTICS",
    drug: "benzylpenicillin",
    route: 0,
    slug: "benzylpenicillin-sodium",
    indication: "Intrapartum prophylaxis against group B streptococcal infection",
    bnfDose: "Initially 3 g for 1 dose, then 1.5 g every 4 hours until delivery.",
  },
];

function pageText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/\s+/g, " ");
}

function loadPages() {
  if (!existsSync(SRC_DIR)) throw new Error(`No ${SRC_DIR}: save the BNF pages there first.`);
  const pages = {};
  for (const f of readdirSync(SRC_DIR)) {
    if (!/\.html?$/.test(f)) continue;
    const html = readFileSync(join(SRC_DIR, f), "utf8");
    const m = html.match(/https:\/\/bnf\.nice\.org\.uk\/drugs\/([a-z0-9-]+)\//);
    if (!m) continue;
    const text = pageText(html);
    if (/only available (to eligible users )?(with)?in the UK/i.test(text) && !/Indications and dose/.test(text)) {
      throw new Error(`${f} is the BNF UK-block page, not a monograph.`);
    }
    pages[m[1]] = text;
  }
  return pages;
}

const numbers = (s) => (s.match(/\d+(?:\.\d+)?/g) ?? []);

const pages = loadPages();
let checked = 0;
const failures = [];

for (const c of CHECKS) {
  const mod = await import(pathToFileURL(join(ROOT, c.file)).href);
  const card = mod[c.exportName].find((d) => d.id === c.drug);
  const route = card?.routes?.[c.route];
  const label = `${c.drug} route ${c.route}`;
  if (!route) { failures.push(`${label}: card or route not found`); continue; }

  const text = pages[c.slug];
  if (!text) { failures.push(`${label}: no saved BNF page for ${c.slug}`); continue; }

  const at = text.indexOf(c.indication);
  if (at < 0) { failures.push(`${label}: indication "${c.indication}" not on the BNF page`); continue; }
  // The dose must sit under this indication, before the next one starts.
  const doseAt = text.indexOf(c.bnfDose, at);
  if (doseAt < 0 || doseAt - at > 400) {
    failures.push(`${label}: BNF dose text not found under "${c.indication}"`);
    continue;
  }

  const appFigures = numbers(`${route.dose ?? ""} ${route.frequency ?? ""}`);
  if (appFigures.length === 0) { failures.push(`${label}: app dose has no figures to check`); continue; }
  const bnfFigures = new Set(numbers(c.bnfDose));
  const before = failures.length;
  for (const n of appFigures) {
    checked++;
    if (!bnfFigures.has(n)) failures.push(`${label}: figure ${n} in the app is not in the BNF dose`);
  }
  if (!/\(BNF\)/.test(`${route.dose} ${route.frequency} ${route.notes}`) && !/BNF/.test(route.notes ?? "")) {
    failures.push(`${label}: dose is not cited to the BNF`);
  }
  if (failures.length === before) console.log(`ok  ${label}: ${appFigures.join(", ")} found in BNF "${c.indication}"`);
}

if (failures.length) {
  console.error("\nFAILED:\n" + failures.map((f) => "  " + f).join("\n"));
  process.exit(1);
}
if (checked === 0) {
  console.error("FAILED: nothing was checked.");
  process.exit(1);
}
console.log(`\n${checked} figures checked against ${Object.keys(pages).length} saved BNF pages.`);
