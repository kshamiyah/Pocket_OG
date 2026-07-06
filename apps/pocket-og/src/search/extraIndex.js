// Synthetic search entries so the Calculator, Rx (drugs) and Consent sections are
// findable from the unified search — not just guideline reader content.
// Each entry conforms to the same page shape the search index expects (title,
// condition, setting, tags, content) plus a `kind` + `navId` the results renderer
// uses to deep-link into the right tab.

import { CALCULATOR_SCENARIOS } from "../data/calculator";
import { CONSENT_PROCEDURES } from "../data/consent";
import { sourceFromLabel } from "../data/glColors";
import { ANTIHYPERTENSIVES } from "../data/rx/antihypertensives";
import { UTEROTONICS } from "../data/rx/uterotonics";
import { ANTIEMETICS } from "../data/rx/antiemetics";
import { ANTIBIOTICS } from "../data/rx/antibiotics";
import { ANTIVIRALS } from "../data/rx/antivirals";
import { TOCOLYTICS } from "../data/rx/tocolytics";
import { ANTICOAGULANTS } from "../data/rx/anticoagulants";
import { ANALGESIA } from "../data/rx/analgesia";
import { ENDOMETRIOSIS_DRUGS } from "../data/rx/endometriosis";
import { CONTRACEPTION } from "../data/rx/contraception";
import { CYTOTOXICS } from "../data/rx/cytotoxics";
import { RESUSCITATION_DRUGS } from "../data/rx/resuscitation";
import { DIABETES_DRUGS } from "../data/rx/diabetes";
import { ANAEMIA_DRUGS } from "../data/rx/anaemia";
import { MENTAL_HEALTH_DRUGS } from "../data/rx/mentalHealth";

const words = (s) => (s ? s.toLowerCase().match(/[a-z0-9]+/g) ?? [] : []);
const uniq = (arr) => [...new Set(arr.filter(Boolean))];

// ── Calculators ───────────────────────────────────────────────────────────────
export const CALCULATOR_SECTIONS = CALCULATOR_SCENARIOS.map(s => ({
  id: `calc-${s.id}`,
  kind: "calculator",
  navId: s.id,
  gl: null,
  source: sourceFromLabel(s.source),
  condition: "Calculator",
  setting: s.subtitle ?? "Decision support",
  title: s.title,
  tags: uniq(["calculator", "calc", "score", "tool", ...words(s.title), ...words(s.subtitle), ...words(s.source)]),
  content: [
    { type: "text", value: s.subtitle ?? "" },
    { type: "text", value: `Decision-support calculator. Source: ${s.source}` },
  ],
}));

// ── Drugs (Rx) ────────────────────────────────────────────────────────────────
const DRUG_GROUPS = [
  [ANTIHYPERTENSIVES, "Antihypertensive"],
  [UTEROTONICS, "Uterotonic"],
  [ANTIEMETICS, "Antiemetic"],
  [ANTIBIOTICS, "Antibiotic"],
  [ANTIVIRALS, "Antiviral"],
  [TOCOLYTICS, "Tocolytic"],
  [ANTICOAGULANTS, "Anticoagulant"],
  [ANALGESIA, "Analgesia"],
  [ENDOMETRIOSIS_DRUGS, "Endometriosis"],
  [CONTRACEPTION, "Contraception"],
  [CYTOTOXICS, "Cytotoxic"],
  [RESUSCITATION_DRUGS, "Resuscitation"],
  [DIABETES_DRUGS, "Diabetes"],
  [ANAEMIA_DRUGS, "Anaemia"],
  [MENTAL_HEALTH_DRUGS, "Mental Health"],
];

export const DRUG_SECTIONS = DRUG_GROUPS.flatMap(([drugs, category]) =>
  drugs.map(d => ({
    id: `drug-${d.id}`,
    kind: "drug",
    navId: d.id,
    gl: null,
    source: null, // drugs sit in their own colour zone; neutral accent in search
    condition: category,
    setting: "Medication",
    title: d.name,
    tags: uniq([
      "drug", "medication", "rx", "dose", category.toLowerCase(),
      ...words(d.name), ...words(d.class),
      ...(d.routes ?? []).flatMap(r => [r.type, ...words(r.shortLabel), ...words(r.label)]),
    ]),
    content: [
      { type: "subheading", value: d.class ?? category },
      { type: "list", items: (d.routes ?? []).map(r => `${r.label}: ${r.dose}${r.frequency ? " — " + r.frequency : ""}`) },
      ...(d.pregnancySafety ? [{ type: "text", value: d.pregnancySafety }] : []),
    ],
  }))
);

// ── Consent procedures ────────────────────────────────────────────────────────
export const CONSENT_SECTIONS = CONSENT_PROCEDURES.map(p => ({
  id: `consent-${p.id}`,
  kind: "consent",
  navId: p.id,
  gl: null,
  source: sourceFromLabel(p.source),
  condition: "Consent",
  setting: p.subtypes ?? "Patient information",
  title: p.title,
  tags: uniq(["consent", "risks", "patient information", ...words(p.title), ...words(p.subtypes), ...words(p.source)]),
  content: [
    { type: "text", value: p.subtypes ? `Consent & risk information — ${p.subtypes}.` : "Consent & risk information." },
    { type: "text", value: `Source: ${p.source}` },
  ],
}));

export const EXTRA_SEARCH_SECTIONS = [
  ...CALCULATOR_SECTIONS,
  ...DRUG_SECTIONS,
  ...CONSENT_SECTIONS,
];
