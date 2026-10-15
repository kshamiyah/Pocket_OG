// Regenerates src/data/sources.js: the verbatim guideline text behind every
// alert rule, for the Rules and sources page.
//
// Usage: node scripts/build-sources.mjs <recs.json>
// recs.json maps "ng235-1_8_19" → recommendation text, extracted from the NICE
// pages (each recommendation is an element with that id). Local guideline text
// is read from @pocket-og/guidelines so it matches what Pocket O&G shows.

import { readFileSync, writeFileSync } from "node:fs";
import { GL787_SECTIONS } from "../../../packages/guidelines/src/GL787.js";
import { GL983_SECTIONS } from "../../../packages/guidelines/src/GL983.js";
import { GTG52_SECTIONS } from "../../../packages/guidelines/src/GTG52.js";

const ACCESSED = "15 Oct 2026";
const recs = JSON.parse(readFileSync(process.argv[2], "utf8"));

const DOCS = {
  NG235: { title: "Intrapartum care", chapter: "Recommendations" },
  NG229: { title: "Fetal monitoring in labour", chapter: "Recommendations" },
  NG25: { title: "Preterm labour and birth", chapter: "Recommendations" },
  NG195: { title: "Neonatal infection: antibiotics for prevention and treatment", chapter: "Prevention-and-risk-reduction" },
  NG133: { title: "Hypertension in pregnancy: diagnosis and management", chapter: "Recommendations" },
  NG3: { title: "Diabetes in pregnancy: management from preconception to the postnatal period", chapter: "Recommendations" },
  NG255: { title: "Suspected sepsis in pregnant or recently pregnant people", chapter: "Evaluating-risk-level" },
};

const WANT = {
  NG235: ["1.6.34", "1.7.6", "1.7.7", "1.8.1", "1.8.19", "1.8.20", "1.8.33", "1.8.36", "1.8.42", "1.8.45", "1.8.48", "1.8.49", "1.8.50", "1.8.54", "1.8.55", "1.8.56", "1.9.8", "1.9.25", "1.9.26", "1.9.27", "1.9.28"],
  NG229: ["1.2.9", "1.3.2", "1.3.3", "1.3.5", "1.3.6", "1.3.8", "1.3.11", "1.4.12", "1.4.14", "1.4.32", "1.5.5", "1.5.6", "1.5.7", "1.5.8"],
  NG25: ["1.8.1", "1.8.4", "1.9.1", "1.9.2", "1.9.3", "1.10.1", "1.10.2", "1.10.3"],
  NG195: ["1.6.1", "1.6.4"],
  NG133: ["1.7.3"],
  NG3: ["1.4.10", "1.4.12"],
  NG255: ["1.5.1", "1.5.2"],
};

const clean = (text, rec) => text
  .replace(new RegExp(`^\\s*${rec.replace(/\./g, "\\.")}\\s*`), "")
  .replace(/\n•\n/g, "\n• ")
  .replace(/[ \t]+\n/g, "\n")
  .trim();

const out = {};
for (const [doc, list] of Object.entries(DOCS)) {
  for (const rec of WANT[doc]) {
    const anchor = `${doc.toLowerCase()}-${rec.replace(/\./g, "_")}`;
    const text = recs[anchor];
    if (!text) throw new Error(`Missing ${anchor}`);
    out[`${doc} ${rec}`] = {
      issuer: "NICE", doc, docTitle: list.title, rec: `Recommendation ${rec}`,
      url: `https://www.nice.org.uk/guidance/${doc.toLowerCase()}/chapter/${list.chapter}#${anchor}`,
      text: clean(text, rec),
    };
  }
}

// NG255 table 1 rows used by the engine, copied from the published table.
out["NG255 table 1"] = {
  issuer: "NICE", doc: "NG255", docTitle: DOCS.NG255.title, rec: "Table 1 (rows used)",
  url: "https://www.nice.org.uk/guidance/ng255/chapter/Evaluating-risk-level",
  text: [
    "Criteria for stratification of risk of severe illness or death from sepsis in people who are or have recently been pregnant",
    "Blood pressure. High risk: Systolic blood pressure 90 mmHg or less or systolic blood pressure more than 40mmHg below normal. Moderate to high risk: Systolic blood pressure 91 to 100 mmHg",
    "Circulation and hydration. High risk: Raised heart rate: more than 130 beats per minute. Moderate to high risk: Raised heart rate: 100 to 130 beats per minute or new-onset arrhythmia",
    "Temperature. High risk: none. Moderate to high risk: Tympanic temperature less than 36°C",
    "Respiratory. High risk: Raised respiratory rate: 25 breaths per minute or more. Moderate to high risk: Raised respiratory rate: 21 to 24 breaths per minute",
  ].join("\n"),
};

// Local guidelines: the text Pocket O&G holds, item by item.
const items = section => section.content.flatMap(c =>
  c.type === "subheading" ? [`${c.value}:`]
  : c.type === "list" ? c.items.map(x => `• ${x}`)
  : c.type === "table" ? c.rows.map(r => `• ${r.join(": ")}`)
  : c.value ? [c.value] : []);
const local = (key, doc, docTitle, sections, id, issuer) => {
  const s = sections.find(x => x.id === id);
  if (!s) throw new Error(`Missing ${doc} ${id}`);
  out[key] = { issuer, doc, docTitle, rec: s.title, url: null, readerCode: doc, text: items(s).join("\n") };
};
local("GL787 GBS", "GL787", "Antimicrobial guideline (local)", GL787_SECTIONS, "abx-gbs", "Local");
local("GL787 PROM", "GL787", "Antimicrobial guideline (local)", GL787_SECTIONS, "abx-pprom", "Local");
local("GL983 intrapartum", "GL983", "Diabetes in pregnancy (local)", GL983_SECTIONS, "dm-preexisting-intrapartum", "Local");
local("GTG52 definitions", "GTG52", "Prevention and management of postpartum haemorrhage", GTG52_SECTIONS, "gtg52-overview", "RCOG");
out["GTG52 definitions"].url = "https://www.rcog.org.uk/guidance/browse-all-guidance/green-top-guidelines/prevention-and-management-of-postpartum-haemorrhage-green-top-guideline-no-52/";
out["GTG52 definitions"].note = "Text as summarised in Pocket O&G; check the full guideline.";

const header = `// GENERATED by scripts/build-sources.mjs. Do not edit by hand.
// Verbatim guideline text behind each alert rule (NICE text accessed ${ACCESSED}).
`;
writeFileSync(new URL("../src/data/sources.js", import.meta.url),
  `${header}\nexport const SOURCES_ACCESSED = ${JSON.stringify(ACCESSED)};\n\nexport const SOURCES = ${JSON.stringify(out, null, 2)};\n`);
console.log(`Wrote ${Object.keys(out).length} sources`);
