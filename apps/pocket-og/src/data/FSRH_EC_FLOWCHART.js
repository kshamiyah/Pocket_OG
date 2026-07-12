// FSRH Guideline: Emergency Contraception (2017, amended 2023/2026)
// Method choice.

export const FSRH_EC_METHOD_CHOICE_FLOWCHART = {
  id: "FSRH_EC_METHOD_CHOICE",
  title: "Emergency Contraception: Method Choice",
  subtitle: "FSRH · Timing since unprotected sex",
  startId: "timing",
  nodes: {

    "timing": {
      type: "action",
      title: "Establish Timing",
      text: "Time since the earliest unprotected sex this cycle, and cycle day (to estimate proximity to ovulation).",
      next: "iud-eligible",
    },

    "iud-eligible": {
      type: "decision",
      title: "Within 5 Days of Sex (or 5 Days After Earliest Estimated Ovulation) and IUD Suitable?",
      options: [
        { label: "Yes", next: "offer-iud" },
        { label: "No — declines IUD or outside window/eligibility", next: "oral-window" },
      ],
    },

    "offer-iud": {
      type: "end",
      title: "Copper IUD",
      text: "Most effective option; also gives ongoing contraception if left in place.",
    },

    "oral-window": {
      type: "decision",
      title: "How Long Since Sex?",
      options: [
        { label: "Within 72 hours", next: "either-oral" },
        { label: "72–120 hours", next: "upa-only" },
        { label: ">120 hours", next: "iud-only-late" },
      ],
    },

    "either-oral": {
      type: "decision",
      title: "Weight/BMI Consideration",
      options: [
        { label: "BMI <26 / weight <70 kg", next: "lng-or-upa" },
        { label: "BMI ≥26 / weight ≥70 kg", next: "upa-preferred" },
      ],
    },

    "lng-or-upa": {
      type: "end",
      title: "LNG-EC or UPA-EC",
      text: "Either is reasonable; UPA-EC is somewhat more effective and has a longer window.",
    },

    "upa-preferred": {
      type: "end",
      title: "UPA-EC Preferred Over LNG-EC",
      text: "LNG efficacy falls with higher weight/BMI — do not double the LNG dose. Re-offer the copper IUD as the most effective option regardless of weight.",
    },

    "upa-only": {
      type: "end",
      title: "UPA-EC",
      text: "Outside the LNG-EC licensed window (72 hours) — ulipristal acetate, licensed to 120 hours.",
    },

    "iud-only-late": {
      type: "end",
      title: "Copper IUD Only",
      text: "Beyond the oral EC window — the copper IUD remains effective up to 5 days after the earliest estimated ovulation date, whichever is later.",
    },

  },
};
