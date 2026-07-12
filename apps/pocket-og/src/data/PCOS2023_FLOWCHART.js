// 2023 International Evidence-based Guideline for PCOS
// Diagnostic algorithm.

export const PCOS2023_DIAGNOSIS_FLOWCHART = {
  id: "PCOS2023_DIAGNOSIS",
  title: "PCOS Diagnosis",
  subtitle: "2023 International Guideline",
  startId: "presentation",
  nodes: {

    "presentation": {
      type: "action",
      title: "Suspected PCOS",
      text: "Irregular periods, hirsutism/acne, or subfertility.",
      items: ["Exclude other causes first: hypothyroidism, hyperprolactinaemia, congenital adrenal hyperplasia, androgen-secreting tumour"],
      next: "age-check",
    },

    "age-check": {
      type: "decision",
      title: "Adult or Adolescent?",
      options: [
        { label: "Adult", next: "adult-criteria" },
        { label: "Adolescent", next: "adolescent-criteria" },
      ],
    },

    "adult-criteria": {
      type: "decision",
      title: "How Many of: Ovulatory Dysfunction / Hyperandrogenism / PCOM (or Raised AMH)?",
      options: [
        { label: "2 or more present", next: "diagnosis-confirmed" },
        { label: "Only 1 present", next: "not-pcos" },
      ],
    },

    "adolescent-criteria": {
      type: "decision",
      title: "Both Ovulatory Dysfunction AND Hyperandrogenism Present?",
      text: "Ultrasound and AMH are not used in adolescents — physiological multifollicular ovaries would cause overdiagnosis.",
      options: [
        { label: "Yes, both present", next: "diagnosis-confirmed" },
        { label: "No", next: "not-pcos" },
      ],
    },

    "diagnosis-confirmed": {
      type: "end",
      title: "PCOS Confirmed",
      items: [
        "Screen for metabolic risk (BMI, waist circumference, OGTT if additional risk factors)",
        "Screen for anxiety/depression",
        "Address endometrial protection if withdrawal bleeds are infrequent",
      ],
    },

    "not-pcos": {
      type: "end",
      title: "Reconsider the Diagnosis",
      text: "Criteria not met — review for an alternative cause of the presenting symptoms.",
    },

  },
};
