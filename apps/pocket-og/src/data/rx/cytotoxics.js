export const CYTOTOXICS = [
  {
    id: "methotrexate",
    name: "Methotrexate",
    class: "Antimetabolite: medical management of ectopic pregnancy",
    color: "orange",
    // National sources only: RCOG GTG21 (2016) section 5.1.2 and Appendices II
    // and III; NICE NG126 1.15.1 to 1.15.4. Local CG623 detail (trust cytotoxic
    // policy, 1-hour observation, 2-dose maximum, lifestyle advice) shelved
    // with CG623 on 6 Oct 2026.
    routes: [
      {
        type: "im",
        shortLabel: "IM: ectopic pregnancy",
        label: "IM: ectopic pregnancy (single dose)",
        dose: "50 mg/m² body surface area (RCOG GTG21)",
        frequency: "Single dose. Serum hCG on days 4 and 7: if it falls by less than 15% between days 4 and 7, consider repeat transvaginal scan and a second dose of 50 mg/m² if she still meets the criteria for medical management (RCOG GTG21 Appendix II)",
        notes: "If hCG falls by more than 15% between days 4 and 7, measure weekly until negative (NICE NG126 1.15.4; RCOG GTG21: until below 15 IU/L). If hCG plateaus or rises, reassess for further treatment (NICE NG126 1.15.4). Off-label use (NICE NG126).",
      },
    ],
    contraindications: [
      "Haemodynamic instability",
      "Presence of an intrauterine pregnancy",
      "Breastfeeding",
      "Unable to comply with follow-up",
      "Known sensitivity to methotrexate",
      "Chronic liver disease",
      "Pre-existing blood dyscrasia",
      "Active pulmonary disease",
      "Immunodeficiency",
      "Peptic ulcer disease",
    ],
    cautions: [
      "Contraindications above are RCOG GTG21 Appendix III",
      "First line (NICE NG126 1.15.1): no significant pain, unruptured tubal ectopic with adnexal mass smaller than 35 mm and no visible heartbeat, serum hCG below 1,500 IU/L, no intrauterine pregnancy, and able to return for follow-up",
      "hCG 1,500 to below 5,000 IU/L: offer a choice of methotrexate or surgery (NICE NG126 1.15.3)",
      "Offer surgery first line with significant pain, adnexal mass 35 mm or larger, a visible fetal heartbeat, hCG 5,000 IU/L or more, or inability to return for follow-up (NICE NG126 1.15.2)",
      "Avoid alcohol and folate-containing vitamins during treatment (RCOG GTG21)",
      "Most common adverse effects: flatulence and bloating, transient mild rise in liver enzymes, stomatitis (RCOG GTG21)",
      "Do not give anti-D for medical management of ectopic pregnancy (NICE NG126, updated June 2026: not offered up to and including 11+6 weeks)",
    ],
    pregnancySafety: "Wait at least 3 months after methotrexate before trying to conceive (RCOG GTG21). Contraindicated in breastfeeding (RCOG GTG21 Appendix III).",
    sources: [
      { label: "RCOG GTG21", href: "/guidelines/BJOG - 2016 -  - Diagnosis and Management of Ectopic Pregnancy.pdf" },
      { label: "NICE NG126", href: "/guidelines/ectopic-pregnancy-and-miscarriage-diagnosis-and-initial-management-pdf-66141662244037.pdf" },
    ],
  },
];
