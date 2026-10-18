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
  NG207: { title: "Inducing labour", chapter: "Recommendations" },
};

const WANT = {
  NG235: ["1.6.34", "1.7.6", "1.7.7", "1.7.11", "1.8.1", "1.8.19", "1.8.20", "1.8.33", "1.8.36", "1.8.42", "1.8.45", "1.8.46", "1.8.48", "1.8.49", "1.8.50", "1.8.54", "1.8.55", "1.8.56", "1.8.58", "1.8.59", "1.9.8", "1.9.25", "1.9.26", "1.9.27", "1.9.28"],
  NG229: ["1.2.9", "1.3.2", "1.3.3", "1.3.5", "1.3.6", "1.3.8", "1.3.11", "1.4.12", "1.4.14", "1.4.15", "1.4.18", "1.4.24", "1.4.32", "1.4.37", "1.5.5", "1.5.6", "1.5.7", "1.5.8"],
  NG25: ["1.4.1", "1.4.2", "1.8.1", "1.8.4", "1.9.1", "1.9.2", "1.9.3", "1.10.1", "1.10.2", "1.10.3"],
  NG195: ["1.6.1", "1.6.4", "1.7.1"],
  NG133: ["1.5.15", "1.5.16", "1.7.3", "1.8.1", "1.8.2", "1.8.3", "1.8.4", "1.8.5"],
  NG3: ["1.4.10", "1.4.12"],
  NG255: ["1.5.1", "1.5.2"],
  NG207: ["1.2.12", "1.2.16"],
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

// NG195 table 1 rows used by the GBS alert, copied from the published table.
out["NG195 table 1"] = {
  issuer: "NICE", doc: "NG195", docTitle: DOCS.NG195.title, rec: "Table 1: Intrapartum antibiotics (without chorioamnionitis)",
  url: "https://www.nice.org.uk/guidance/ng195/chapter/Prevention-and-risk-reduction",
  text: [
    "No penicillin allergy: Use benzylpenicillin sodium.",
    "Penicillin allergy that is not severe: Use cephalosporin with activity against group B streptococcus (for example, cefotaxime). Use with caution. In April 2021 this was an off-label use of cephalosporins.",
    "Severe penicillin allergy: Consider: Vancomycin or An alternative antibiotic that would be expected to be active against group B streptococcus based on either sensitivity testing performed on the woman's, trans man's or non-binary person's isolate or on local antibiotic susceptibility surveillance data. In April 2021 this was an off-label use of vancomycin.",
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
// RCOG Green-top text copied from the published guidelines (BJOG full text).
const GTG36_URL = "https://www.rcog.org.uk/guidance/browse-all-guidance/green-top-guidelines/prevention-of-early-onset-group-b-streptococcal-disease-green-top-guideline-no-36/";
const GTG52_URL = "https://www.rcog.org.uk/guidance/browse-all-guidance/green-top-guidelines/prevention-and-management-of-postpartum-haemorrhage-green-top-guideline-no-52/";
const gtg = (key, doc, docTitle, rec, url, text) => { out[key] = { issuer: "RCOG", doc, docTitle, rec, url, text }; };
const T36 = "Prevention of early-onset neonatal group B streptococcal disease (2017)";
gtg("GTG36 5.3", "GTG36", T36, "Section 5.3", GTG36_URL,
  "Explain to women that the likelihood of maternal GBS carriage in this pregnancy is 50%. Discuss the options of IAP, or bacteriological testing in late pregnancy and the offer of IAP if still positive.\nIf performed, bacteriological testing should ideally be carried out at 35–37 weeks of gestation or 3–5 weeks prior to the anticipated delivery date, e.g. 32–34 weeks of gestation for women with twins.");
gtg("GTG36 5.4", "GTG36", T36, "Section 5.4", GTG36_URL,
  "IAP should be offered to women with a previous baby with early- or late-onset GBS disease.");
gtg("GTG36 9.4", "GTG36", T36, "Section 9.4", GTG36_URL,
  "For women who have agreed to IAP, benzylpenicillin should be administered. Once commenced, treatment should be given regularly until delivery.\nIt is recommended that 3 g intravenous benzylpenicillin be given as soon as possible after the onset of labour and 1.5 g 4 hourly until delivery. To optimise the efficacy of IAP, the first dose should be given at least 4 hours prior to delivery.");
gtg("GTG36 9.5", "GTG36", T36, "Section 9.5", GTG36_URL,
  "Provided a woman has not had severe allergy to penicillin, a cephalosporin should be used. If there is any evidence of severe allergy to penicillin, vancomycin should be used.\nIf the history suggests an allergy to beta-lactams, but one that is not severe (i.e. no anaphylaxis, angioedema, respiratory distress or urticaria), then a cephalosporin can be administered intravenously (e.g. cefuroxime, 1.5 g loading dose followed by 750 mg every 8 hours). If the allergy to beta-lactams is severe then intravenous vancomycin (1 g every 12 hours) is recommended.");
gtg("GTG36 7.1", "GTG36", T36, "Section 7.1", GTG36_URL,
  "Women who are known GBS carriers should be offered immediate IAP and induction of labour as soon as reasonably possible.\nIn women where the carrier status is negative or unknown, offer induction of labour immediately or expectant management up to 24 hours. Beyond 24 hours, induction of labour is appropriate.");
gtg("GTG36 8.1.1", "GTG36", T36, "Section 8.1.1", GTG36_URL,
  "Bacteriological testing for GBS carriage is not recommended for women with preterm rupture of membranes. IAP should be given once labour is confirmed or induced irrespective of GBS status.\nFor those with evidence of colonisation in the current pregnancy or in previous pregnancies, the perinatal risks associated with preterm delivery at less than 34+0 weeks of gestation are likely to outweigh the risk of perinatal infection. For those at more than 34+0 weeks of gestation it may be beneficial to expedite delivery if a woman is a known GBS carrier.");
const T52 = "Prevention and management of postpartum haemorrhage (2016)";
gtg("GTG52 definitions", "GTG52", T52, "Definitions and first measures", GTG52_URL, [
  "The traditional definition of primary PPH is the loss of 500 ml or more of blood from the genital tract within 24 hours of the birth of a baby. PPH can be minor (500–1000 ml) or major (more than 1000 ml). Major can be further subdivided into moderate (1001–2000 ml) and severe (more than 2000 ml).",
  "The midwife in charge and the first-line obstetric and anaesthetic staff should be alerted when women present with minor PPH (blood loss 500–1000 ml) without clinical shock.",
  "A multidisciplinary team involving senior members of staff should be summoned to attend to women with major PPH (blood loss of more than 1000 ml) and ongoing bleeding or clinical shock.",
  "Measures for minor PPH (blood loss 500–1000 ml) without clinical shock: intravenous access (one 14-gauge cannula); urgent venepuncture (20 ml) for group and screen, full blood count, coagulation screen, including fibrinogen; pulse, respiratory rate and blood pressure recording every 15 minutes; commence warmed crystalloid infusion.",
  "All cases of PPH involving a blood loss of greater than 1500 ml should be the subject of a formal clinical incident review.",
].join("\n"));

const header = `// GENERATED by scripts/build-sources.mjs. Do not edit by hand.
// Verbatim guideline text behind each alert rule (NICE text accessed ${ACCESSED}).
`;
writeFileSync(new URL("../src/data/sources.js", import.meta.url),
  `${header}\nexport const SOURCES_ACCESSED = ${JSON.stringify(ACCESSED)};\n\nexport const SOURCES = ${JSON.stringify(out, null, 2)};\n`);
console.log(`Wrote ${Object.keys(out).length} sources`);
