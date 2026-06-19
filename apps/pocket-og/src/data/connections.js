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
};

// Per-flowchart, per-node connections.
// whatsNext: rendered on end nodes as a "What's next" block.
// inlineLinks: { phrase, type, id, gl } — phrases in node.text that become tappable.
export const FLOWCHART_NODE_CONNECTIONS = {

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
