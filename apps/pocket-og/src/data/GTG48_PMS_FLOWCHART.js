// RCOG GTG48 — Management of Premenstrual Syndrome
// Stepwise escalation ladder.

export const GTG48_PMS_LADDER_FLOWCHART = {
  id: "GTG48_PMS_LADDER",
  title: "PMS Management Ladder",
  subtitle: "GTG48 · Stepwise escalation",
  startId: "diagnosis",
  nodes: {

    "diagnosis": {
      type: "action",
      title: "Confirm the Diagnosis",
      text: "Prospective symptom diary (e.g. DRSP) over at least 2 cycles.",
      items: [
        "Core PMS: luteal-phase symptoms with a clear symptom-free follicular week",
        "PMDD: severe psychological symptoms dominate",
        "Premenstrual exacerbation: no symptom-free week — treat the underlying condition too",
      ],
      next: "first-line",
    },

    "first-line": {
      type: "action",
      title: "First-Line",
      items: [
        "Lifestyle: exercise, regular meals, reduced caffeine/alcohol, sleep",
        "CBT for psychological symptoms",
        "SSRI — continuous or luteal-phase only",
      ],
      next: "first-line-check",
    },

    "first-line-check": {
      type: "decision",
      title: "Adequate Response?",
      options: [
        { label: "Yes", next: "continue" },
        { label: "No", next: "hormonal" },
      ],
    },

    "hormonal": {
      type: "action",
      title: "Hormonal Ovulation Suppression",
      items: [
        "Drospirenone-containing COCP, used continuously (no 7-day break)",
        "Or transdermal oestrogen + endometrial protection (cyclical progestogen or LNG-IUS)",
      ],
      next: "hormonal-check",
    },

    "hormonal-check": {
      type: "decision",
      title: "Adequate Response?",
      options: [
        { label: "Yes", next: "continue" },
        { label: "No — most severe/refractory symptoms", next: "gnrh" },
      ],
    },

    "gnrh": {
      type: "action",
      title: "GnRH Analogue",
      text: "Reserved for the most severe, refractory symptoms, or diagnostic confirmation.",
      items: ["Add-back HRT if continued beyond 6 months"],
      next: "gnrh-check",
    },

    "gnrh-check": {
      type: "decision",
      title: "Symptoms Resolve on GnRH (Test of Cure)?",
      options: [
        { label: "Yes, but need long-term suppression", next: "surgical" },
        { label: "No meaningful response", next: "reassess" },
      ],
    },

    "surgical": {
      type: "end",
      title: "Consider Hysterectomy + BSO",
      text: "Last resort, after a GnRH trial confirms diagnosis and HRT tolerance.",
      items: ["Irreversible — counsel fully", "HRT will usually be needed afterwards"],
    },

    "reassess": {
      type: "end",
      title: "Reassess the Diagnosis",
      text: "A poor response to ovarian suppression should prompt review for an alternative or additional cause.",
    },

    "continue": {
      type: "end",
      title: "Continue Current Treatment",
      text: "Review periodically; step down if sustained control allows.",
    },

  },
};
