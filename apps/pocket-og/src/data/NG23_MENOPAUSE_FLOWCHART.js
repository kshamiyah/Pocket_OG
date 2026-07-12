// NICE NG23 — Menopause: Identification and Management
// New menopausal symptoms: assessment and first steps.

export const NG23_MENOPAUSE_PATHWAY_FLOWCHART = {
  id: "NG23_MENOPAUSE_PATHWAY",
  title: "New Menopausal Symptoms",
  subtitle: "NG23 · Assessment and first steps",
  startId: "presentation",
  nodes: {

    "presentation": {
      type: "decision",
      title: "Age and Symptom Pattern",
      text: "Vasomotor symptoms, mood change, irregular periods, or genitourinary symptoms.",
      options: [
        { label: "Age >45, typical pattern", next: "clinical-diagnosis" },
        { label: "Age 40–45, typical pattern", next: "consider-fsh" },
        { label: "Age <40", next: "poi-pathway" },
      ],
    },

    "clinical-diagnosis": {
      type: "action",
      title: "Diagnose Clinically",
      text: "No blood tests needed.",
      items: [
        "No uterus: vasomotor symptoms alone are enough to diagnose menopause",
        "Uterus present: vasomotor symptoms + no period for ≥12 months = menopause; vasomotor symptoms + irregular periods = perimenopause",
      ],
      next: "discuss-options",
    },

    "consider-fsh": {
      type: "action",
      title: "Consider FSH",
      text: "Age 40–45 with menopausal symptoms including a change in cycle.",
      items: [
        "FSH can support the diagnosis but is not mandatory",
        "Consider other causes of amenorrhoea or irregular bleeding before attributing symptoms to perimenopause",
      ],
      next: "discuss-options",
    },

    "poi-pathway": {
      type: "action",
      title: "Suspected Premature Ovarian Insufficiency",
      text: "Age <40 with menopause-associated symptoms.",
      items: [
        "Check FSH on two occasions, 4–6 weeks apart",
        "If elevated on both: diagnose POI",
      ],
      next: "poi-treatment",
    },

    "poi-treatment": {
      type: "end",
      title: "Offer Sex Steroid Replacement",
      text: "HRT or a combined hormonal contraceptive, unless contraindicated.",
      items: [
        "Continue until at least the average age of natural menopause — protects bone and cardiovascular health",
        "Discuss fertility implications sensitively",
      ],
    },

    "discuss-options": {
      type: "decision",
      title: "HRT Suitable and Wanted?",
      options: [
        { label: "Yes", next: "start-hrt" },
        { label: "No / unsuitable", next: "non-hormonal" },
      ],
    },

    "start-hrt": {
      type: "action",
      title: "Start HRT",
      items: [
        "No uterus: oestrogen-only",
        "Uterus, <12 months since last period: cyclical combined",
        "Uterus, ≥12 months since last period: continuous combined",
        "Prefer transdermal oestrogen if BMI >30, VTE risk factors, or migraine with aura",
      ],
      next: "review",
    },

    "non-hormonal": {
      type: "action",
      title: "Non-Hormonal Options",
      items: [
        "Menopause-specific CBT",
        "Fezolinetant for moderate-severe vasomotor symptoms if HRT unsuitable",
        "SSRIs, SNRIs and clonidine are not routine first-line, but can be considered",
      ],
      next: "review",
    },

    "review": {
      type: "end",
      title: "Review and Ongoing Care",
      items: [
        "Address genitourinary symptoms with vaginal oestrogen regardless of systemic HRT use",
        "Review at 3 months, then annually",
        "Reassess ongoing need and risk factors at each review",
      ],
    },

  },
};
