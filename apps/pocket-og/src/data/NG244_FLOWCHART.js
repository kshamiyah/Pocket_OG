// NG244 — Managing Asthma in Pregnancy (BTS/NICE/SIGN asthma pathway,
// updated November 2024). Acute exacerbation in pregnancy — treated the
// same as a non-pregnant adult; do not under-treat.

export const NG244_ACUTE_ASTHMA_FLOWCHART = {
  id: "NG244_ACUTE_ASTHMA",
  title: "Acute Asthma in Pregnancy",
  subtitle: "NG244 · Managed the same as non-pregnant — don't under-treat",
  startId: "assess",
  nodes: {

    "assess": {
      type: "alert",
      title: "Acute Asthma Exacerbation",
      text: "Maternal hypoxia is the greater threat to the fetus than any medication used to treat it — treat fully, not cautiously.",
      items: [
        "High-flow oxygen to maintain normal saturations for pregnancy",
        "Nebulised salbutamol ± ipratropium",
        "Oral prednisolone (typically 40 mg) started early, not held in reserve",
      ],
      next: "severity",
    },

    "severity": {
      type: "decision",
      title: "Severe or Life-Threatening Features?",
      text: "Same thresholds as a non-pregnant adult — inability to complete sentences, silent chest, exhaustion, reduced consciousness, saturations not responding.",
      options: [
        { label: "Yes — severe/life-threatening", next: "escalate" },
        { label: "No — responding to initial treatment", next: "monitor" },
      ],
    },

    "escalate": {
      type: "alert",
      title: "Escalate Immediately",
      text: "Senior obstetric, anaesthetic and respiratory/ITU input — same urgency as outside pregnancy.",
      items: [
        "Continuous maternal monitoring",
        "Continuous fetal monitoring once at a viable gestation — but do not let this delay maternal resuscitation",
      ],
      next: "review",
    },

    "monitor": {
      type: "action",
      title: "Continue Treatment & Monitor Response",
      text: "Repeat nebulisers as needed, reassess regularly for deterioration.",
      next: "review",
    },

    "review": {
      type: "end",
      title: "Review Before Discharge",
      text: "Confirm the woman continues her usual inhaled therapy — an acute attack is not a reason to step down maintenance treatment.",
      items: [
        "Early asthma review, and again postnatally",
        "Safety-net for recurrence",
      ],
    },

  },
};
