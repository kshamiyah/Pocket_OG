// NICE NG257 — Fertility Problems: Assessment and Treatment
// Initial pathway: when to investigate, and where results lead.

export const NG257_SUBFERTILITY_PATHWAY_FLOWCHART = {
  id: "NG257_SUBFERTILITY_PATHWAY",
  title: "Subfertility: Initial Pathway",
  subtitle: "NG257 · Assessment and first steps",
  startId: "presentation",
  nodes: {

    "presentation": {
      type: "decision",
      title: "Trying to Conceive",
      options: [
        { label: "1 year without conception, no known risk factor", next: "assess" },
        { label: "Known risk factor (age ≥36, amenorrhoea, prior pelvic surgery/infection, known cause in either partner)", next: "assess" },
        { label: "<1 year, no risk factor", next: "reassure" },
      ],
    },

    "reassure": {
      type: "end",
      title: "Reassure & Advise",
      text: "Continue trying; lifestyle advice (BMI, smoking, alcohol); revisit if 1 year passes without conception.",
    },

    "assess": {
      type: "action",
      title: "Full History & Baseline Investigations",
      items: [
        "History from both partners: cycle regularity, coital frequency, past pelvic infection/surgery, relevant drug history",
        "Semen analysis (repeat to confirm if abnormal)",
        "Mid-luteal progesterone to confirm ovulation",
      ],
      next: "findings",
    },

    "findings": {
      type: "decision",
      title: "What Do the Results Show?",
      options: [
        { label: "Anovulation", next: "anovulation" },
        { label: "Abnormal semen analysis", next: "male-factor" },
        { label: "All normal — check tubal patency", next: "tubal-test" },
      ],
    },

    "anovulation": {
      type: "end",
      title: "Investigate the Cause of Anovulation",
      items: ["Thyroid disease, hyperprolactinaemia, PCOS (see the separate PCOS guideline)", "Treat the underlying cause; ovulation induction where appropriate"],
    },

    "male-factor": {
      type: "end",
      title: "Refer for Male Factor Assessment",
      text: "Specialist review — further hormonal, imaging or genetic tests as indicated by the pattern of abnormality.",
    },

    "tubal-test": {
      type: "action",
      title: "Tubal Patency Testing",
      items: ["HSG or HyCoSy first-line", "Laparoscopy and dye test if higher likelihood of pelvic pathology"],
      next: "tubal-result",
    },

    "tubal-result": {
      type: "decision",
      title: "Tubal Result?",
      options: [
        { label: "Patent, everything else normal", next: "unexplained" },
        { label: "Blocked / abnormal", next: "tubal-factor" },
      ],
    },

    "tubal-factor": {
      type: "end",
      title: "Tubal Factor Infertility",
      text: "Refer directly for IVF — tubal surgery is rarely appropriate first-line where IVF is available.",
    },

    "unexplained": {
      type: "end",
      title: "Unexplained Infertility",
      items: [
        "Do not offer oral ovarian stimulation agents (clomiphene, anastrozole, letrozole) — no live birth benefit, increases multiple pregnancy",
        "Offer IVF directly if no conception after 2 years of trying (including time spent under investigation)",
      ],
    },

  },
};
