// FSRH_UKMEC — UK Medical Eligibility Criteria for Contraceptive Use
// FSRH UKMEC 2025 (updates UKMEC 2016, amended 2019)

export const FSRH_UKMEC_SECTIONS = [
  {
    id: "fsrh-ukmec-categories",
    gl: "FSRH_UKMEC",
    condition: "Contraception Method Choice",
    setting: "Sexual & Reproductive Health",
    title: "UKMEC — Categories & How to Use Them",
    tags: [
      "ukmec", "fsrh_ukmec", "contraception eligibility", "medical eligibility criteria",
      "method choice contraception", "ukmec categories",
    ],
    content: [
      { type: "text", value: "The UK Medical Eligibility Criteria for Contraceptive Use (UKMEC), published by the FSRH, gives a category (1–4) for each contraceptive method against a wide range of medical conditions and characteristics — covering intrauterine contraception (IUC), progestogen-only contraception (POC), combined hormonal contraception (CHC) and emergency contraception (EC)." },
      { type: "table", headers: ["Category", "Meaning"], rows: [
        ["1", "No restriction on use"],
        ["2", "Advantages generally outweigh theoretical or proven risks"],
        ["3", "Theoretical or proven risks usually outweigh the advantages — use requires expert clinical judgement and/or specialist referral, and is not usually recommended unless more appropriate methods are unavailable or unacceptable"],
        ["4", "Unacceptable health risk"],
      ]},
      { type: "text", value: "The 2025 update reviewed VTE-related conditions throughout UKMEC, upgrading several categories, and added a new entry for multiple risk factors for VTE occurring together." },
    ],
  },

  {
    id: "fsrh-ukmec-worked-examples",
    gl: "FSRH_UKMEC",
    condition: "Contraception Method Choice",
    setting: "Sexual & Reproductive Health",
    title: "Worked Examples",
    tags: [
      "migraine with aura contraception", "chc migraine", "dmpa vte",
      "breastfeeding contraception", "postpartum contraception", "lng-ius stroke",
    ],
    content: [
      { type: "alert", value: "Migraine with aura + combined hormonal contraception (COC, patch or ring) is UKMEC 4 — an unacceptable health risk — regardless of age or other risk factors, because oestrogen compounds the stroke risk that aura itself carries." },
      { type: "list", items: [
        "Depot medroxyprogesterone acetate (DMPA): the 2025 update recognises a higher VTE risk than previously understood — still lower than CHC, but a relevant factor in someone with other VTE risk factors",
        "Breastfeeding: CHC is now UKMEC 2 from 6 weeks to 6 months postpartum in breastfeeding women, reflecting an absence of evidence for harm to the breastfed infant",
        "LNG-IUS continuation after stroke: no longer UKMEC 3 — recent observational data found no increased risk, so continuation is UKMEC 2",
      ]},
      { type: "text", value: "These examples illustrate how UKMEC categories can move as new evidence emerges — always check the current edition rather than relying on memorised categories for anything outside routine, low-risk prescribing." },
    ],
  },
];
