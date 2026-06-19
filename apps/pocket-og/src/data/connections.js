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
};
