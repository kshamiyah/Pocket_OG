// Bidirectional link map between calculators, flowcharts, and consent pages.
// Each entry defines what appears in "See also" / "What's next" blocks.

export const CALCULATOR_CONNECTIONS = {
  PUL: [
    { type: "flowchart", id: "CG623_MTX", gl: "CG623", label: "Ectopic pregnancy pathway", sublabel: "CG623 — step through the pathway" },
    { type: "calculator", id: "ECTOPIC_DECISION", gl: "CG623", label: "Tubal ectopic — initial management", sublabel: "Calculator — expectant / MTX / surgery" },
  ],
  ECTOPIC_DECISION: [
    { type: "flowchart", id: "CG623_MTX", gl: "CG623", label: "Ectopic pregnancy pathway", sublabel: "CG623 — step through the pathway" },
    { type: "calculator", id: "MTX_SURVEILLANCE", gl: "CG623", label: "Post-methotrexate surveillance", sublabel: "Calculator — day 4 & day 7 hCG" },
    { type: "calculator", id: "EXPECTANT_SURVEILLANCE", gl: "CG623", label: "Expectant management — surveillance", sublabel: "Calculator — serial hCG days 2, 4, 7" },
  ],
  EXPECTANT_SURVEILLANCE: [
    { type: "flowchart", id: "CG623_MTX", gl: "CG623", label: "Ectopic pregnancy pathway", sublabel: "CG623 — step through the pathway" },
    { type: "calculator", id: "ECTOPIC_DECISION", gl: "CG623", label: "Tubal ectopic — initial management", sublabel: "Calculator — expectant / MTX / surgery" },
    { type: "calculator", id: "MTX_SURVEILLANCE", gl: "CG623", label: "Post-methotrexate surveillance", sublabel: "Calculator — day 4 & day 7 hCG" },
  ],
  MTX_SURVEILLANCE: [
    { type: "flowchart", id: "CG623_MTX", gl: "CG623", label: "Ectopic pregnancy pathway", sublabel: "CG623 — step through the pathway" },
    { type: "calculator", id: "ECTOPIC_DECISION", gl: "CG623", label: "Tubal ectopic — initial management", sublabel: "Calculator — expectant / MTX / surgery" },
    { type: "calculator", id: "EXPECTANT_SURVEILLANCE", gl: "CG623", label: "Expectant management — surveillance", sublabel: "Calculator — serial hCG days 2, 4, 7" },
  ],
  VTE_RISK: [
    { type: "flowchart", id: "GL891_ANTENATAL", gl: "GL891", label: "Antenatal VTE pathway", sublabel: "GL891 — risk assessment & prophylaxis" },
    { type: "flowchart", id: "GL891_POSTNATAL", gl: "GL891", label: "Postnatal VTE pathway", sublabel: "GL891 — risk assessment & prophylaxis" },
  ],
  PUQE: [
    { type: "reader", id: "GTG69", gl: "GTG69", label: "GTG69 — NVP & HG guideline", sublabel: "Full guideline text" },
  ],
};

// Per-flowchart, per-node connections.
// whatsNext: rendered on end nodes as a "What's next" block.
// inlineLinks: { phrase, type, id, gl } — phrases in node.text that become tappable.
export const FLOWCHART_NODE_CONNECTIONS = {

  // ── Rupture of Membranes triage (GL895 + GL861) ─────────────────────
  GL895_ROM_TRIAGE: {
    "pprom-admit": {
      inlineLinks: [
        { phrase: "Antenatal corticosteroids", type: "consent", id: "ACS", gl: "GL895" },
      ],
    },
    "pprom-transfer": {
      inlineLinks: [
        { phrase: "Antenatal corticosteroids", type: "consent", id: "ACS", gl: "GL895" },
      ],
      whatsNext: [
        { type: "consent", id: "ACS", gl: null, label: "Consent — antenatal corticosteroids", sublabel: "Benefits, risks & patient information" },
        { type: "reader", id: "GL895", gl: "GL895", label: "GL895 — PPRoM guideline", sublabel: "Full guideline text" },
      ],
    },
    "pprom-birth": {
      whatsNext: [
        { type: "reader", id: "GL895", gl: "GL895", label: "GL895 — PPRoM guideline", sublabel: "Full guideline text" },
        { type: "flowchart", id: "GL861_IOL", gl: "GL861", label: "Induction of labour pathway", sublabel: "GL861 — step through the pathway" },
      ],
    },
    "term-immediate": {
      whatsNext: [
        { type: "flowchart", id: "GL861_IOL", gl: "GL861", label: "Induction of labour pathway", sublabel: "GL861 — step through the pathway" },
        { type: "reader", id: "GL861", gl: "GL861", label: "GL861 — IOL & Term PLRoM guideline", sublabel: "Full guideline text" },
      ],
    },
    "term-expectant": {
      whatsNext: [
        { type: "reader", id: "GL861", gl: "GL861", label: "GL861 — IOL & Term PLRoM guideline", sublabel: "Full guideline text" },
      ],
    },
    "term-iol": {
      whatsNext: [
        { type: "flowchart", id: "GL861_IOL", gl: "GL861", label: "Induction of labour pathway", sublabel: "GL861 — step through the pathway" },
        { type: "reader", id: "GL861", gl: "GL861", label: "GL861 — IOL & Term PLRoM guideline", sublabel: "Full guideline text" },
      ],
    },
    "cord-emergency": {
      inlineLinks: [
        { phrase: "GTG50 cord prolapse pathway", type: "flowchart", id: "GTG50_CORD", gl: "GTG50" },
      ],
      whatsNext: [
        { type: "flowchart", id: "GTG50_CORD", gl: "GTG50", label: "Cord prolapse — emergency pathway", sublabel: "GTG50 — step through the pathway" },
      ],
    },
    "sepsis": {
      inlineLinks: [
        { phrase: "GL787", type: "reader", id: "GL787", gl: "GL787" },
      ],
      whatsNext: [
        { type: "reader", id: "GL787", gl: "GL787", label: "GL787 — Obstetric antibiotics", sublabel: "Empirical sepsis treatment" },
        { type: "reader", id: "GL895", gl: "GL895", label: "GL895 — PPRoM guideline", sublabel: "Full guideline text" },
      ],
    },
    "not-confirmed": {
      whatsNext: [
        { type: "reader", id: "GL895", gl: "GL895", label: "GL895 — PPRoM guideline", sublabel: "Full guideline text" },
        { type: "reader", id: "GL861", gl: "GL861", label: "GL861 — IOL & Term PLRoM guideline", sublabel: "Full guideline text" },
      ],
    },
  },

  // ── PPH (GTG52) ─────────────────────────────────────────────────────
  GTG52_PPH: {
    "normal": {
      whatsNext: [
        { type: "reader", id: "GTG52", gl: "GTG52", label: "GTG52 — PPH guideline", sublabel: "Full guideline text" },
      ],
    },
    "minor_resolved": {
      whatsNext: [
        { type: "reader", id: "GTG52", gl: "GTG52", label: "GTG52 — PPH guideline", sublabel: "Full guideline text" },
      ],
    },
    "major_resolved": {
      whatsNext: [
        { type: "reader", id: "GTG52", gl: "GTG52", label: "GTG52 — PPH guideline", sublabel: "Full guideline text" },
      ],
    },
    "end_massive": {
      whatsNext: [
        { type: "reader", id: "GTG52", gl: "GTG52", label: "GTG52 — PPH guideline", sublabel: "Full guideline text" },
      ],
    },
  },

  // ── SGA / FGR (GTG31) ───────────────────────────────────────────────
  GTG31_SURVEILLANCE: {
    "minor_normal": {
      whatsNext: [
        { type: "reader", id: "GTG31", gl: "GTG31", label: "GTG31 — SGA guideline", sublabel: "Full guideline text" },
      ],
    },
    "major_normal": {
      whatsNext: [
        { type: "reader", id: "GTG31", gl: "GTG31", label: "GTG31 — SGA guideline", sublabel: "Full guideline text" },
      ],
    },
    "deliver_34": {
      whatsNext: [
        { type: "reader", id: "GTG31", gl: "GTG31", label: "GTG31 — SGA guideline", sublabel: "Full guideline text" },
        { type: "reader", id: "NG25",  gl: "NG25",  label: "NG25 — Preterm Labour & Birth", sublabel: "Corticosteroids, MgSO₄, tocolysis" },
      ],
    },
    "deliver_32": {
      whatsNext: [
        { type: "reader", id: "GTG31", gl: "GTG31", label: "GTG31 — SGA guideline", sublabel: "Full guideline text" },
        { type: "reader", id: "NG25",  gl: "NG25",  label: "NG25 — Preterm Labour & Birth", sublabel: "Corticosteroids, MgSO₄, tocolysis" },
      ],
    },
    "deliver_now": {
      whatsNext: [
        { type: "reader", id: "NG25",  gl: "NG25",  label: "NG25 — Preterm Labour & Birth", sublabel: "Corticosteroids, MgSO₄" },
      ],
    },
    "emergency": {
      whatsNext: [
        { type: "reader", id: "NG25",  gl: "NG25",  label: "NG25 — Preterm Labour & Birth", sublabel: "Corticosteroids, MgSO₄" },
      ],
    },
  },

  // ── Ectopic pregnancy (CG623) ────────────────────────────────────────
  CG623_MTX: {
    "end-monitoring": {
      whatsNext: [
        { type: "calculator", id: "MTX_SURVEILLANCE", gl: "CG623", label: "Post-MTX surveillance calculator", sublabel: "Track your day 4 & day 7 hCG" },
      ],
      inlineLinks: [
        { phrase: "Weekly βhCG until level <20 IU/L", type: "calculator", id: "MTX_SURVEILLANCE", gl: "CG623" },
      ],
    },
    "end-surgery": {
      whatsNext: [
        { type: "consent", id: "LAPAROSCOPY", gl: null, label: "Consent — laparoscopy", sublabel: "Risks, benefits & patient information" },
      ],
    },
    "mtx-admin": {
      inlineLinks: [
        { phrase: "Day 4 and Day 7", type: "calculator", id: "MTX_SURVEILLANCE", gl: "CG623" },
      ],
    },
  },

  // ── VTE (GL891) ──────────────────────────────────────────────────────
  GL891_ANTENATAL: {
    "dosing": {
      whatsNext: [
        { type: "calculator", id: "VTE_RISK", gl: "GL891", label: "VTE risk score calculator", sublabel: "Formal scoring — RCOG GTG37a" },
      ],
    },
    "mobilise": {
      whatsNext: [
        { type: "calculator", id: "VTE_RISK", gl: "GL891", label: "VTE risk score calculator", sublabel: "Formal scoring — RCOG GTG37a" },
      ],
    },
  },
  GL891_POSTNATAL: {
    "high-6wk": {
      whatsNext: [
        { type: "calculator", id: "VTE_RISK", gl: "GL891", label: "VTE risk score calculator", sublabel: "Formal scoring — RCOG GTG37a" },
      ],
    },
    "intermediate-10d": {
      whatsNext: [
        { type: "calculator", id: "VTE_RISK", gl: "GL891", label: "VTE risk score calculator", sublabel: "Formal scoring — RCOG GTG37a" },
      ],
    },
    "lowrisk": {
      whatsNext: [
        { type: "calculator", id: "VTE_RISK", gl: "GL891", label: "VTE risk score calculator", sublabel: "Formal scoring — RCOG GTG37a" },
      ],
    },
  },

  // ── IOL (GL861) ──────────────────────────────────────────────────────
  GL861_TIMING: {
    "end": {
      whatsNext: [
        { type: "iol-prioritizer", id: null, gl: "GL861", label: "IOL priority list", sublabel: "Add this patient to the induction queue" },
      ],
    },
  },
  GL861_IOL: {
    "end-unsuccessful": {
      whatsNext: [
        { type: "iol-prioritizer", id: null, gl: "GL861", label: "IOL priority list", sublabel: "Review and requeue for induction" },
      ],
    },
  },

  // ── Miscarriage (CG565 + CG621) ─────────────────────────────────────
  CG565_TRIAGE: {
    "end-smm": {
      whatsNext: [
        { type: "consent", id: "SURG_MISC", gl: null, label: "Consent — surgical miscarriage", sublabel: "EVA / MVA — risks & patient information" },
      ],
    },
    "end-medical-incomplete": {
      whatsNext: [
        { type: "consent", id: "MED_MISC", gl: null, label: "Consent — medical miscarriage", sublabel: "Misoprostol — risks & patient information" },
      ],
    },
    "end-medical-missed": {
      whatsNext: [
        { type: "consent", id: "MED_MISC", gl: null, label: "Consent — medical miscarriage", sublabel: "Mifepristone + Misoprostol" },
        { type: "flowchart", id: "CG621_OUTPATIENT", gl: "CG621", label: "Medical management — outpatient", sublabel: "CG621 — step through the pathway" },
      ],
    },
  },
  CG621_OUTPATIENT: {
    "end-surgical": {
      whatsNext: [
        { type: "consent", id: "SURG_MISC", gl: null, label: "Consent — surgical miscarriage", sublabel: "EVA / MVA — risks & patient information" },
      ],
    },
  },
  CG621_INPATIENT: {
    "end-surgical-inpatient": {
      whatsNext: [
        { type: "consent", id: "SURG_MISC", gl: null, label: "Consent — surgical miscarriage", sublabel: "EVA / MVA — risks & patient information" },
      ],
    },
  },

  // ── Pre-eclampsia / Hypertension (GL952) ────────────────────────────
  GL952_TRIAGE: {
    "chronic-htn": {
      whatsNext: [
        { type: "flowchart", id: "GL952_ACUTE", gl: "GL952", label: "Acute BP management", sublabel: "GL952 — manage an acute BP episode" },
      ],
    },
    "gest-htn": {
      whatsNext: [
        { type: "flowchart", id: "GL952_ACUTE", gl: "GL952", label: "Acute BP management", sublabel: "GL952 — manage an acute BP episode" },
      ],
    },
    "mild-pet": {
      whatsNext: [
        { type: "flowchart", id: "GL952_ACUTE", gl: "GL952", label: "Acute BP management", sublabel: "GL952 — manage an acute BP episode" },
      ],
    },
    "severe-pet": {
      whatsNext: [
        { type: "flowchart", id: "GL952_ACUTE", gl: "GL952", label: "Acute BP management", sublabel: "GL952 — manage an acute BP episode" },
        { type: "flowchart", id: "GL952_SEVERE_LW", gl: "GL952", label: "Severe PET — labour ward", sublabel: "GL952 — MgSO4 & escalation pathway" },
      ],
    },
  },
  GL952_ACUTE: {
    "end-monitor": {
      whatsNext: [
        { type: "flowchart", id: "GL952_TRIAGE", gl: "GL952", label: "Hypertension classification", sublabel: "GL952 — re-classify if BP recurs" },
      ],
    },
    "end-controlled": {
      whatsNext: [
        { type: "flowchart", id: "GL952_SEVERE_LW", gl: "GL952", label: "Severe PET — labour ward", sublabel: "GL952 — if escalation is needed" },
        { type: "flowchart", id: "GL952_POSTNATAL", gl: "GL952", label: "Postnatal BP management", sublabel: "GL952 — after delivery" },
      ],
    },
    "end-lw-monitor": {
      whatsNext: [
        { type: "flowchart", id: "GL952_SEVERE_LW", gl: "GL952", label: "Severe PET — labour ward", sublabel: "GL952 — MgSO4 & escalation pathway" },
        { type: "flowchart", id: "GL952_POSTNATAL", gl: "GL952", label: "Postnatal BP management", sublabel: "GL952 — after delivery" },
      ],
    },
  },
  GL952_SEVERE_LW: {
    "end-controlled-lw": {
      whatsNext: [
        { type: "flowchart", id: "GL952_POSTNATAL", gl: "GL952", label: "Postnatal BP management", sublabel: "GL952 — after delivery" },
      ],
    },
    "end-no-mgso4": {
      whatsNext: [
        { type: "flowchart", id: "GL952_POSTNATAL", gl: "GL952", label: "Postnatal BP management", sublabel: "GL952 — after delivery" },
      ],
    },
    "end-mgso4": {
      whatsNext: [
        { type: "flowchart", id: "GL952_POSTNATAL", gl: "GL952", label: "Postnatal BP management", sublabel: "GL952 — after delivery" },
      ],
    },
  },

};

// Keywords that become inline tappable links in the guideline reader.
// Case-insensitive matching; only the first occurrence per section is linked.
// Only phrases that appear in text / list blocks are listed (subheadings and
// table cells render as plain text and do not receive RichText treatment).
export const GUIDELINE_KEYWORD_LINKS = {
  GL861: [
    { phrase: "pre-eclampsia",         type: "reader", id: "GL952", gl: "GL952", label: "Hypertension in Pregnancy" },
    { phrase: "diabetes",              type: "reader", id: "GL983", gl: "GL983", label: "Diabetes in Pregnancy" },
    { phrase: "GDM",                   type: "reader", id: "GL983", gl: "GL983", label: "Diabetes in Pregnancy" },
    { phrase: "obstetric cholestasis", type: "reader", id: "GL880", gl: "GL880", label: "Intrahepatic Cholestasis of Pregnancy" },
    { phrase: "anticoagulation",       type: "reader", id: "GL891", gl: "GL891", label: "VTE in Pregnancy & Postnatal" },
    { phrase: "VTE",                   type: "reader", id: "GL891", gl: "GL891", label: "VTE in Pregnancy & Postnatal" },
    { phrase: "Fetal growth restriction", type: "reader", id: "GTG31", gl: "GTG31", label: "SGA & Fetal Growth Restriction" },
  ],

  GL952: [
    { phrase: "VTE",                   type: "reader", id: "GL891", gl: "GL891", label: "VTE in Pregnancy & Postnatal" },
    { phrase: "aspirin",               type: "reader", id: "NG133", gl: "NG133", label: "Hypertension in Pregnancy (NICE NG133)" },
    { phrase: "gestational hypertension", type: "reader", id: "NG133", gl: "NG133", label: "Hypertension in Pregnancy (NICE NG133)" },
    { phrase: "chronic hypertension",  type: "reader", id: "NG133", gl: "NG133", label: "Hypertension in Pregnancy (NICE NG133)" },
  ],

  GL891: [
    { phrase: "pre-eclampsia", type: "reader", id: "GL952", gl: "GL952", label: "Hypertension in Pregnancy" },
    { phrase: "hyperemesis",   type: "reader", id: "GTG69", gl: "GTG69", label: "Nausea & Vomiting of Pregnancy" },
    { phrase: "PPH",           type: "reader", id: "GTG52", gl: "GTG52", label: "Postpartum Haemorrhage" },
  ],

  GL983: [
    { phrase: "pre-eclampsia",       type: "reader", id: "GL952", gl: "GL952", label: "Hypertension in Pregnancy" },
    { phrase: "hyperemesis gravidarum", type: "reader", id: "GTG69", gl: "GTG69", label: "Nausea & Vomiting of Pregnancy" },
  ],

  GL880: [
    { phrase: "pre-eclampsia",       type: "reader", id: "GL952", gl: "GL952", label: "Hypertension in Pregnancy" },
    { phrase: "diabetes",            type: "reader", id: "GL983", gl: "GL983", label: "Diabetes in Pregnancy" },
    { phrase: "preterm birth",       type: "reader", id: "NG25",  gl: "NG25",  label: "Preterm Labour & Birth" },
    { phrase: "postpartum haemorrhage", type: "reader", id: "GTG52", gl: "GTG52", label: "Postpartum Haemorrhage" },
  ],

  GL895: [
    { phrase: "GBS",     type: "reader", id: "GL787", gl: "GL787", label: "Obstetric Antibiotics" },
    { phrase: "preterm", type: "reader", id: "NG25",  gl: "NG25",  label: "Preterm Labour & Birth" },
    { phrase: "PPH",     type: "reader", id: "GTG52", gl: "GTG52", label: "Postpartum Haemorrhage" },
  ],

  CG565: [
    { phrase: "ectopic",               type: "reader", id: "CG623", gl: "CG623", label: "Ectopic Pregnancy" },
  ],

  CG623: [
    { phrase: "anaemia",               type: "reader", id: "GL783", gl: "GL783", label: "Iron Deficiency Anaemia" },
  ],

  QS22: [
    { phrase: "VTE",                  type: "reader", id: "GL891", gl: "GL891", label: "VTE in Pregnancy & Postnatal" },
    { phrase: "pre-eclampsia",        type: "reader", id: "GL952", gl: "GL952", label: "Hypertension in Pregnancy" },
    { phrase: "GDM",                  type: "reader", id: "GL983", gl: "GL983", label: "Diabetes in Pregnancy" },
    { phrase: "anaemia",              type: "reader", id: "GL783", gl: "GL783", label: "Iron Deficiency Anaemia" },
    { phrase: "Fetal growth restriction", type: "reader", id: "GTG31", gl: "GTG31", label: "SGA & Fetal Growth Restriction" },
    { phrase: "mental health",        type: "reader", id: "CG192", gl: "CG192", label: "Perinatal Mental Health" },
    { phrase: "preterm",              type: "reader", id: "NG25",  gl: "NG25",  label: "Preterm Labour & Birth" },
  ],

  GTG57: [
    { phrase: "IOL",           type: "reader", id: "GL861", gl: "GL861", label: "Induction of Labour" },
    { phrase: "pre-eclampsia", type: "reader", id: "GL952", gl: "GL952", label: "Hypertension in Pregnancy" },
    { phrase: "diabetes",      type: "reader", id: "GL983", gl: "GL983", label: "Diabetes in Pregnancy" },
    { phrase: "SGA",           type: "reader", id: "GTG31", gl: "GTG31", label: "SGA & Fetal Growth Restriction" },
  ],

  GTG63: [
    { phrase: "IOL",                  type: "reader", id: "GL861", gl: "GL861", label: "Induction of Labour" },
    { phrase: "VTE",                  type: "reader", id: "GL891", gl: "GL891", label: "VTE in Pregnancy & Postnatal" },
    { phrase: "PPH",                  type: "reader", id: "GTG52", gl: "GTG52", label: "Postpartum Haemorrhage" },
    { phrase: "preterm",              type: "reader", id: "NG25",  gl: "NG25",  label: "Preterm Labour & Birth" },
    { phrase: "Fetal growth restriction", type: "reader", id: "GTG31", gl: "GTG31", label: "SGA & Fetal Growth Restriction" },
  ],

  NG88: [
    { phrase: "anaemia",               type: "reader", id: "GL783", gl: "GL783", label: "Iron Deficiency Anaemia" },
  ],

  NHSCSP20: [
    { phrase: "preterm birth", type: "reader", id: "NG25", gl: "NG25", label: "Preterm Labour & Birth" },
  ],

  GTG52: [
    { phrase: "pre-eclampsia",    type: "reader",    id: "GL952",    gl: "GL952", label: "Hypertension in Pregnancy" },
    { phrase: "VTE",              type: "reader",    id: "GL891",    gl: "GL891", label: "VTE in Pregnancy & Postnatal" },
    { phrase: "chorioamnionitis", type: "reader",    id: "GL895",    gl: "GL895", label: "PPRoM" },
  ],

  GTG69: [
    { phrase: "VTE",      type: "reader",     id: "GL891", gl: "GL891", label: "VTE in Pregnancy & Postnatal" },
    { phrase: "diabetes", type: "reader",     id: "GL983", gl: "GL983", label: "Diabetes in Pregnancy" },
  ],

  NG25: [
    { phrase: "pre-eclampsia",    type: "reader", id: "GL952", gl: "GL952", label: "Hypertension in Pregnancy" },
    { phrase: "chorioamnionitis", type: "reader", id: "GL895", gl: "GL895", label: "PPRoM" },
    { phrase: "diabetes",         type: "reader", id: "GL983", gl: "GL983", label: "Diabetes in Pregnancy" },
  ],

  GTG31: [
    { phrase: "pre-eclampsia", type: "reader", id: "GL952", gl: "GL952", label: "Hypertension in Pregnancy" },
    { phrase: "VTE",           type: "reader", id: "GL891", gl: "GL891", label: "VTE in Pregnancy & Postnatal" },
    { phrase: "anaemia",       type: "reader", id: "GL783", gl: "GL783", label: "Iron Deficiency Anaemia" },
    { phrase: "diabetes",      type: "reader", id: "GL983", gl: "GL983", label: "Diabetes in Pregnancy" },
  ],

  GTG17: [
    { phrase: "VTE",         type: "reader", id: "GL891", gl: "GL891", label: "VTE in Pregnancy & Postnatal" },
    { phrase: "ectopic",     type: "reader", id: "CG623", gl: "CG623", label: "Ectopic Pregnancy" },
    { phrase: "miscarriage", type: "reader", id: "CG565", gl: "CG565", label: "First Trimester Miscarriage" },
  ],

  CG192: [
    { phrase: "VTE",           type: "reader", id: "GL891", gl: "GL891", label: "VTE in Pregnancy & Postnatal" },
    { phrase: "pre-eclampsia", type: "reader", id: "GL952", gl: "GL952", label: "Hypertension in Pregnancy" },
    { phrase: "diabetes",      type: "reader", id: "GL983", gl: "GL983", label: "Diabetes in Pregnancy" },
  ],

  NG133: [
    { phrase: "VTE",                      type: "reader", id: "GL891", gl: "GL891", label: "VTE in Pregnancy & Postnatal" },
    { phrase: "diabetes",                 type: "reader", id: "GL983", gl: "GL983", label: "Diabetes in Pregnancy" },
    { phrase: "fetal growth restriction", type: "reader", id: "GTG31", gl: "GTG31", label: "SGA & Fetal Growth Restriction" },
    { phrase: "antiphospholipid",         type: "reader", id: "GTG17", gl: "GTG17", label: "Recurrent Miscarriage" },
    { phrase: "small for gestational age",type: "reader", id: "GTG31", gl: "GTG31", label: "SGA & Fetal Growth Restriction" },
    { phrase: "postpartum haemorrhage",   type: "reader", id: "GTG52", gl: "GTG52", label: "Postpartum Haemorrhage" },
  ],
};
