// β-hCG calculator data
//
// Every threshold, interpretation, and clinical instruction below is taken
// verbatim or directly cited from:
//   - NICE NG126 (Ectopic pregnancy and miscarriage: diagnosis and initial
//     management, last updated 23 August 2023)
//   - RCOG/AEPU Green-top Guideline No. 21 (Diagnosis and Management of
//     Ectopic Pregnancy, November 2016; BJOG 2016;123:e15–e55)
//
// Section numbers refer to the source recommendations. Where text is
// reproduced from the guideline it is marked with a leading citation.

export const CALCULATOR_SCENARIOS = [
  {
    id: "PUL",
    title: "Pregnancy of unknown location",
    subtitle: "2 serum hCG levels ≥48 h apart",
    source: "NICE NG126 §1.4.27–1.4.31",
    color: { accent: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
    description: "Use serial hCG to determine subsequent management of a pregnancy of unknown location.",
  },
  {
    id: "ECTOPIC_DECISION",
    title: "Tubal ectopic — initial management",
    subtitle: "Decide expectant / methotrexate / surgery",
    source: "NICE NG126 §1.6.3–1.6.10 · RCOG GTG21 §5.1",
    color: { accent: "bg-rose-500", text: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200" },
    description: "Allocate a woman with an ultrasound-diagnosed tubal ectopic pregnancy to expectant, medical or surgical management.",
  },
  {
    id: "EXPECTANT_SURVEILLANCE",
    title: "Expectant management — surveillance",
    subtitle: "Serial hCG on days 2, 4 and 7",
    source: "NICE NG126 §1.6.5",
    color: { accent: "bg-teal-500", text: "text-teal-700", bg: "bg-teal-50", border: "border-teal-200" },
    description: "Interpret serial hCG during expectant management of a tubal ectopic pregnancy.",
  },
  {
    id: "MTX_SURVEILLANCE",
    title: "Post-methotrexate surveillance",
    subtitle: "Day 4 and day 7 hCG after MTX",
    source: "NICE NG126 §1.6.11 · RCOG GTG21 Appendix II",
    color: { accent: "bg-violet-500", text: "text-violet-700", bg: "bg-violet-50", border: "border-violet-200" },
    description: "Interpret day 4 → day 7 hCG following single-dose methotrexate for tubal ectopic pregnancy.",
  },
  {
    id: "VTE_RISK",
    title: "VTE risk score",
    subtitle: "Antenatal & postnatal thromboprophylaxis",
    source: "RCOG GTG37a Appendix III (April 2015)",
    color: { accent: "bg-indigo-500", text: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-200" },
    description: "Formal VTE risk assessment with numerical scoring for pregnant and postpartum women.",
  },
];

// ──────────────────────────────────────────────────────────────────────
// Scenario 1 — PUL serial hCG (NG126 §1.4.27–1.4.32)
// ──────────────────────────────────────────────────────────────────────

export function interpretPUL({ hcg1, hcg2, hoursBetween }) {
  // NG126 1.4.27: "Take 2 serum hCG measurements as near as possible to
  // 48 hours apart (but no earlier) to determine subsequent management
  // of a pregnancy of unknown location."
  if (hoursBetween < 48) {
    return {
      category: "INVALID",
      title: "Repeat sample taken too early",
      color: "text-gray-700",
      bg: "bg-gray-50",
      border: "border-gray-200",
      summary: "Samples must be taken at least 48 hours apart.",
      detail:
        "NICE NG126 §1.4.27: take 2 serum hCG measurements as near as possible to 48 hours apart (but no earlier) to determine subsequent management of a pregnancy of unknown location.",
      actions: [],
      citation: "NICE NG126 §1.4.27",
    };
  }

  const percentChange = ((hcg2 - hcg1) / hcg1) * 100;

  if (percentChange > 63) {
    // NG126 1.4.29
    return {
      category: "LIKELY_IUP",
      title: "Likely developing intrauterine pregnancy",
      color: "text-emerald-700",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      summary: `Rise of ${percentChange.toFixed(0)}% in ${hoursBetween.toFixed(0)} h (>63% threshold).`,
      detail:
        "NICE NG126 §1.4.29: she is likely to have a developing intrauterine pregnancy (although the possibility of an ectopic pregnancy cannot be excluded).",
      actions: [
        "Offer a transvaginal ultrasound scan to determine the location of the pregnancy between 7 and 14 days later.",
        hcg2 >= 1500
          ? "hCG ≥1,500 IU/L — consider an earlier scan (NG126 §1.4.29)."
          : "Consider an earlier scan if hCG reaches ≥1,500 IU/L.",
        "If a viable intrauterine pregnancy is confirmed, offer routine antenatal care.",
        "If a viable intrauterine pregnancy is not confirmed, refer for immediate clinical review by a senior gynaecologist.",
      ],
      citation: "NICE NG126 §1.4.29",
    };
  }

  if (percentChange < -50) {
    // NG126 1.4.30
    return {
      category: "LIKELY_FAILING",
      title: "Pregnancy unlikely to continue",
      color: "text-blue-700",
      bg: "bg-blue-50",
      border: "border-blue-200",
      summary: `Fall of ${Math.abs(percentChange).toFixed(0)}% in ${hoursBetween.toFixed(0)} h (>50% threshold).`,
      detail:
        "NICE NG126 §1.4.30: inform her that the pregnancy is unlikely to continue but that this is not confirmed.",
      actions: [
        "Provide oral and written information about where she can access support and counselling services.",
        "Ask her to take a urine pregnancy test 14 days after the second serum hCG test.",
        "If the test is negative, no further action is necessary.",
        "If the test is positive, she should return to the early pregnancy assessment service for clinical review within 24 hours.",
      ],
      citation: "NICE NG126 §1.4.30",
    };
  }

  // NG126 1.4.31: fall <50% OR rise <63%
  return {
    category: "SUSPICIOUS",
    title: "Refer for clinical review within 24 hours",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    summary:
      percentChange >= 0
        ? `Rise of ${percentChange.toFixed(0)}% in ${hoursBetween.toFixed(0)} h (<63% threshold).`
        : `Fall of ${Math.abs(percentChange).toFixed(0)}% in ${hoursBetween.toFixed(0)} h (<50% threshold).`,
    detail:
      "NICE NG126 §1.4.31: for a woman with a decrease in serum hCG levels less than 50%, or an increase less than 63%, refer her for clinical review in the early pregnancy assessment service within 24 hours.",
    actions: [
      "Refer for clinical review in the early pregnancy assessment service within 24 hours.",
      "Regardless of serum hCG levels, give written information about what to do if new or worsening symptoms occur, including how to access emergency care 24 hours a day (§1.4.28).",
    ],
    citation: "NICE NG126 §1.4.31",
  };
}

export const PUL_CAVEATS = [
  "NICE NG126 §1.4.24: do not use serum hCG measurements to determine the location of the pregnancy.",
  "NICE NG126 §1.4.25: place more importance on clinical symptoms than on serum hCG results; review the woman's condition if any symptoms change.",
  "NICE NG126 §1.4.32: do not use serum progesterone measurements as an adjunct.",
];

// ──────────────────────────────────────────────────────────────────────
// Scenario 2 — Tubal ectopic, initial management decision
// (NG126 §1.6.3, §1.6.4, §1.6.8, §1.6.9, §1.6.10; GTG21 §5.1)
// ──────────────────────────────────────────────────────────────────────

export function interpretEctopicDecision({
  hcg,
  massSize,            // mm
  significantPain,     // bool
  fetalHeartbeat,      // bool
  iupExcluded,         // bool — confirmed no IUP on ultrasound
  canReturnFollowUp,   // bool
}) {
  // NG126 §1.6.9 — surgery first-line if ANY of:
  //   significant pain
  //   adnexal mass ≥35 mm
  //   fetal heartbeat visible
  //   hCG ≥5,000 IU/L
  //   unable to return for follow-up
  const surgeryReasons = [];
  if (significantPain) surgeryReasons.push("Significant pain");
  if (massSize >= 35) surgeryReasons.push(`Adnexal mass ${massSize} mm (≥35 mm)`);
  if (fetalHeartbeat) surgeryReasons.push("Fetal heartbeat visible on ultrasound scan");
  if (hcg >= 5000) surgeryReasons.push(`Serum hCG ${hcg} IU/L (≥5,000)`);
  if (!canReturnFollowUp) surgeryReasons.push("Unable to return for follow-up after methotrexate");

  if (surgeryReasons.length > 0) {
    return {
      pathways: [
        {
          id: "SURGERY",
          title: "Surgery — first-line",
          color: "text-rose-700",
          bg: "bg-rose-50",
          border: "border-rose-300",
          rationale: surgeryReasons,
          detail:
            "NICE NG126 §1.6.9: offer surgery as a first-line treatment to women who are unable to return for follow-up after methotrexate treatment or who have an ectopic pregnancy and significant pain, or an adnexal mass of 35 mm or larger, or a fetal heartbeat visible on ultrasound, or a serum hCG level of 5,000 IU/L or more.",
          actions: [
            "RCOG GTG21 §5.1.1: when surgery is indicated, perform laparoscopically whenever possible, taking into account the condition of the woman and complexity of the procedure (NG126 §1.6.12).",
            "RCOG GTG21: in the presence of a healthy contralateral tube, salpingectomy should be performed in preference to salpingotomy.",
            "Consider salpingotomy if the contralateral tube is damaged or there are other risk factors for infertility (NG126 §1.6.16).",
          ],
          citation: "NICE NG126 §1.6.9",
        },
      ],
      citation: "NICE NG126 §1.6.9",
    };
  }

  // Beyond this point: stable, pain-free, mass <35 mm, no FH, can follow up.
  // Now stratify by hCG.

  if (!iupExcluded) {
    return {
      pathways: [
        {
          id: "EXCLUDE_IUP",
          title: "Exclude intrauterine pregnancy before treatment",
          color: "text-amber-700",
          bg: "bg-amber-50",
          border: "border-amber-300",
          rationale: ["No intrauterine pregnancy confirmed on ultrasound"],
          detail:
            "NICE NG126 §1.6.8: methotrexate is offered only when there is no intrauterine pregnancy as confirmed on ultrasound scan. RCOG GTG21 §5.1.2: methotrexate should never be given at the first visit unless the diagnosis of ectopic pregnancy is absolutely clear and a viable intrauterine pregnancy has been excluded.",
          actions: [
            "Confirm absence of intrauterine pregnancy on ultrasound scan before considering medical management.",
            "If diagnosis is uncertain, repeat hCG in 48 hours (GTG21 §5.1.2) — if hCG falls, expectant management may be appropriate; if it rises at a rate consistent with a viable IUP, repeat scan before any methotrexate is given.",
          ],
          citation: "NICE NG126 §1.6.8 / RCOG GTG21 §5.1.2",
        },
      ],
      citation: "NICE NG126 §1.6.8",
    };
  }

  // hCG ≤1,000 — Expectant OFFER (NG126 §1.6.3) + MTX OFFER (§1.6.8)
  if (hcg <= 1000) {
    return {
      pathways: [
        {
          id: "EXPECTANT_OFFER",
          title: "Expectant management — offer",
          color: "text-teal-700",
          bg: "bg-teal-50",
          border: "border-teal-300",
          rationale: [
            "Clinically stable and pain-free",
            `Tubal ectopic <35 mm with no visible heartbeat`,
            `Serum hCG ${hcg} IU/L (≤1,000)`,
            "Able to return for follow-up",
          ],
          detail:
            "NICE NG126 §1.6.3: offer expectant management to women who are clinically stable and pain free, have a tubal ectopic pregnancy measuring less than 35 mm with no visible heartbeat on transvaginal ultrasound, have serum hCG levels of 1,000 IU/L or less, and are able to return for follow-up.",
          actions: [
            "Repeat hCG on days 2, 4 and 7 (NG126 §1.6.5).",
            "If hCG drops by 15% or more from the previous value, repeat weekly until <20 IU/L.",
            "If hCG does not fall by 15%, stays the same, or rises — review clinical condition and seek senior advice.",
          ],
          citation: "NICE NG126 §1.6.3",
        },
        {
          id: "MTX_ALSO_OPTION",
          title: "Methotrexate — also an option",
          color: "text-violet-700",
          bg: "bg-violet-50",
          border: "border-violet-300",
          rationale: [
            "Meets all NG126 §1.6.8 criteria",
            `Serum hCG ${hcg} IU/L (<1,500)`,
          ],
          detail:
            "NICE NG126 §1.6.8: offer systemic methotrexate to women who have no significant pain, an unruptured tubal ectopic <35 mm with no visible heartbeat, serum hCG <1,500 IU/L, no intrauterine pregnancy, and are able to return for follow-up.",
          actions: [
            "Methotrexate 50 mg/m² IM (single-dose protocol — RCOG GTG21 App II).",
            "Repeat hCG on days 4 and 7 after treatment (NG126 §1.6.11).",
            "Advise: avoid alcohol and folate-containing vitamins during treatment (GTG21 §5.1.2).",
            "Advise: wait at least 3 months before trying to conceive (GTG21 §8).",
          ],
          citation: "NICE NG126 §1.6.8",
        },
      ],
      citation: "NICE NG126 §1.6.3 and §1.6.8",
    };
  }

  // hCG 1,001–1,499 — Expectant CONSIDER (§1.6.4) + MTX OFFER (§1.6.8)
  if (hcg < 1500) {
    return {
      pathways: [
        {
          id: "EXPECTANT_CONSIDER",
          title: "Expectant management — consider",
          color: "text-teal-700",
          bg: "bg-teal-50",
          border: "border-teal-300",
          rationale: [
            "Clinically stable and pain-free",
            "Tubal ectopic <35 mm with no visible heartbeat",
            `Serum hCG ${hcg} IU/L (1,000–1,500)`,
            "Able to return for follow-up",
          ],
          detail:
            "NICE NG126 §1.6.4: consider expectant management as an option for women who are clinically stable and pain free, have a tubal ectopic pregnancy <35 mm with no visible heartbeat, have serum hCG above 1,000 IU/L and below 1,500 IU/L, and are able to return for follow-up.",
          actions: [
            "Repeat hCG on days 2, 4 and 7 (NG126 §1.6.5).",
            "If drop ≥15% from previous value, repeat weekly until <20 IU/L.",
            "If does not fall by 15%, plateau, or rises — senior review.",
          ],
          citation: "NICE NG126 §1.6.4",
        },
        {
          id: "MTX_OFFER",
          title: "Methotrexate — offer",
          color: "text-violet-700",
          bg: "bg-violet-50",
          border: "border-violet-300",
          rationale: [
            "Meets all NG126 §1.6.8 criteria",
            `Serum hCG ${hcg} IU/L (<1,500)`,
          ],
          detail:
            "NICE NG126 §1.6.8: offer systemic methotrexate. Offer surgery where treatment with methotrexate is not acceptable to the woman.",
          actions: [
            "Methotrexate 50 mg/m² IM (single-dose protocol — RCOG GTG21 App II).",
            "Repeat hCG on days 4 and 7 after treatment.",
            "Avoid alcohol and folate-containing vitamins.",
            "Wait at least 3 months before trying to conceive.",
          ],
          citation: "NICE NG126 §1.6.8",
        },
      ],
      citation: "NICE NG126 §1.6.4 and §1.6.8",
    };
  }

  // hCG 1,500–<5,000 — choice MTX or surgery (§1.6.10)
  return {
    pathways: [
      {
        id: "MTX_CHOICE",
        title: "Methotrexate or surgery — woman's choice",
        color: "text-violet-700",
        bg: "bg-violet-50",
        border: "border-violet-300",
        rationale: [
          "No significant pain",
          "Unruptured ectopic <35 mm with no visible heartbeat",
          "No intrauterine pregnancy on ultrasound",
          `Serum hCG ${hcg} IU/L (1,500–<5,000)`,
          "Able to return for follow-up",
        ],
        detail:
          "NICE NG126 §1.6.10: offer the choice of either methotrexate or surgical management to women who have a serum hCG of at least 1,500 IU/L and less than 5,000 IU/L. Advise women who choose methotrexate that their chance of needing further intervention is increased and they may need to be urgently admitted if their condition deteriorates.",
        actions: [
          "Discuss methotrexate vs surgical management; document her informed choice.",
          "If methotrexate: 50 mg/m² IM; repeat hCG days 4 and 7 (NG126 §1.6.11).",
          "If surgery: laparoscopic salpingectomy is preferred where contralateral tube is healthy (NG126 §1.6.15).",
        ],
        citation: "NICE NG126 §1.6.10",
      },
    ],
    citation: "NICE NG126 §1.6.10",
  };
}

export const MTX_CONTRAINDICATIONS = [
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
];
// Source: RCOG GTG21 Appendix III.

// ──────────────────────────────────────────────────────────────────────
// Scenario 3 — Expectant management surveillance (NG126 §1.6.5)
// ──────────────────────────────────────────────────────────────────────

export function interpretExpectantStep({ previous, current, dayLabel }) {
  if (!previous || !current) return null;
  const pctChange = ((current - previous) / previous) * 100;
  const drop = -pctChange; // positive number if fallen

  if (current < 20) {
    return {
      category: "RESOLVED",
      title: "Resolution",
      color: "text-emerald-700",
      bg: "bg-emerald-50",
      border: "border-emerald-300",
      summary: `${dayLabel}: hCG ${current} IU/L (<20).`,
      detail:
        "NICE NG126 §1.6.5: repeat weekly until a negative result (<20 IU/L) is obtained.",
      citation: "NICE NG126 §1.6.5",
    };
  }

  if (drop >= 15) {
    return {
      category: "FALLING_OK",
      title: "Falling appropriately — continue",
      color: "text-teal-700",
      bg: "bg-teal-50",
      border: "border-teal-300",
      summary: `${dayLabel}: ${drop.toFixed(0)}% fall from previous value (≥15%).`,
      detail:
        "NICE NG126 §1.6.5: if hCG levels drop by 15% or more from the previous value on days 2, 4 and 7, then repeat weekly until a negative result (less than 20 IU/L) is obtained.",
      citation: "NICE NG126 §1.6.5",
    };
  }

  return {
    category: "SENIOR_REVIEW",
    title: "Senior review needed",
    color: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-300",
    summary:
      pctChange >= 0
        ? `${dayLabel}: ${pctChange.toFixed(0)}% rise from previous value.`
        : `${dayLabel}: only ${drop.toFixed(0)}% fall (<15%).`,
    detail:
      "NICE NG126 §1.6.5: if hCG levels do not fall by 15%, stay the same or rise from the previous value, review the woman's clinical condition and seek senior advice to help decide further management.",
    citation: "NICE NG126 §1.6.5",
  };
}

// ──────────────────────────────────────────────────────────────────────
// Scenario 4 — Post-MTX surveillance
// (NG126 §1.6.11, RCOG GTG21 Appendix II)
// ──────────────────────────────────────────────────────────────────────

export function interpretMtxStep({ day1, day4, day7 }) {
  if (day1 == null || day4 == null || day7 == null) return null;
  const pctChange = ((day7 - day4) / day4) * 100;
  const drop = -pctChange;

  if (day7 < 15) {
    return {
      category: "RESOLVING",
      title: "Approaching resolution",
      color: "text-emerald-700",
      bg: "bg-emerald-50",
      border: "border-emerald-300",
      summary: `Day 7 hCG ${day7} IU/L (<15).`,
      detail:
        "RCOG GTG21 Appendix II: continue weekly hCG until levels less than 15 IU/L.",
      citation: "RCOG GTG21 Appendix II",
    };
  }

  if (drop > 15) {
    return {
      category: "DROP_OK",
      title: "Falling appropriately — continue weekly",
      color: "text-teal-700",
      bg: "bg-teal-50",
      border: "border-teal-300",
      summary: `Day 4 → Day 7: ${drop.toFixed(0)}% fall (>15%).`,
      detail:
        "RCOG GTG21 Appendix II: if β-hCG decrease >15% days 4–7, repeat β-hCG weekly until levels <15 IU/L. NICE NG126 §1.6.11: take 1 serum hCG measurement per week until a negative result is obtained.",
      citation: "NICE NG126 §1.6.11 · RCOG GTG21 App II",
    };
  }

  if (pctChange >= 0) {
    return {
      category: "PLATEAU_RISE",
      title: "Plateau or rise — reassess",
      color: "text-rose-700",
      bg: "bg-rose-50",
      border: "border-rose-300",
      summary: `Day 4 → Day 7: ${pctChange.toFixed(0)}% ${pctChange === 0 ? "no change" : "rise"}.`,
      detail:
        "NICE NG126 §1.6.11: if hCG levels plateau or rise, reassess the woman's condition for further treatment.",
      citation: "NICE NG126 §1.6.11",
    };
  }

  // Drop ≤15%
  return {
    category: "INADEQUATE_DROP",
    title: "Inadequate fall — consider second dose",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-300",
    summary: `Day 4 → Day 7: only ${drop.toFixed(0)}% fall (≤15%).`,
    detail:
      "RCOG GTG21 Appendix II: if β-hCG decrease <15% days 4–7, repeat TVS and methotrexate 50 mg/m² if still fulfils criteria for medical management.",
    citation: "RCOG GTG21 Appendix II",
  };
}

export const MTX_GENERAL_ADVICE = [
  "RCOG GTG21 §5.1.2: avoid alcohol and folate-containing vitamins during treatment.",
  "RCOG GTG21 §8: wait at least 3 months before trying to conceive again.",
  "NICE NG126 §1.6.11: take 2 serum hCG measurements in the first week (days 4 and 7) after treatment, then 1 per week until a negative result is obtained.",
];

// ──────────────────────────────────────────────────────────────────────
// Scenario 5 — VTE risk score (RCOG GTG37a, April 2015)
// Risk factors and scores taken verbatim from Appendix III, page 36.
// Thresholds for management from the box at the top of Appendix III.
// ──────────────────────────────────────────────────────────────────────

// Group labels and risk factors exactly as listed in GTG37a Appendix III.
// Items marked phase-specific match the parenthetical notes in the table
// or the antenatal vs postnatal columns of Appendix I (pages 33).

export const VTE_RISK_FACTORS = [
  // ─── Pre-existing risk factors ────────────────────────────────────
  {
    group: "Pre-existing",
    id: "previous_vte_not_major_surgery",
    label: "Previous VTE (except a single event related to major surgery)",
    score: 4,
    phases: ["antenatal", "postnatal"],
  },
  {
    group: "Pre-existing",
    id: "previous_vte_major_surgery",
    label: "Previous VTE provoked by major surgery",
    score: 3,
    phases: ["antenatal", "postnatal"],
  },
  {
    group: "Pre-existing",
    id: "high_risk_thrombophilia",
    label: "Known high-risk thrombophilia",
    note: "Antithrombin / protein C / protein S deficiency; compound or homozygous for low-risk thrombophilias.",
    score: 3,
    phases: ["antenatal", "postnatal"],
  },
  {
    group: "Pre-existing",
    id: "medical_comorbidities",
    label: "Medical comorbidities",
    note: "Cancer; heart failure; active SLE, inflammatory polyarthropathy or IBD; nephrotic syndrome; type I diabetes mellitus with nephropathy; sickle cell disease; current intravenous drug user.",
    score: 3,
    phases: ["antenatal", "postnatal"],
  },
  {
    group: "Pre-existing",
    id: "family_history_vte",
    label: "Family history of unprovoked or estrogen-related VTE in first-degree relative",
    score: 1,
    phases: ["antenatal", "postnatal"],
  },
  {
    group: "Pre-existing",
    id: "low_risk_thrombophilia",
    label: "Known low-risk thrombophilia (no VTE)",
    note: "Heterozygous for factor V Leiden or prothrombin G20210A. If a first-degree relative has had VTE, postpartum prophylaxis should be continued for 6 weeks (Appendix III, footnote a).",
    score: 1,
    phases: ["antenatal", "postnatal"],
  },
  {
    group: "Pre-existing",
    id: "age_over_35",
    label: "Age > 35 years",
    score: 1,
    phases: ["antenatal", "postnatal"],
  },
  {
    group: "Pre-existing",
    id: "bmi_30_to_39",
    label: "Obesity — BMI ≥ 30 kg/m² (below 40)",
    note: "Based on booking weight. BMI ≥ 30 scores 1; BMI ≥ 40 scores 2 (only tick one).",
    score: 1,
    phases: ["antenatal", "postnatal"],
    exclusiveWith: ["bmi_40_plus"],
  },
  {
    group: "Pre-existing",
    id: "bmi_40_plus",
    label: "Obesity — BMI ≥ 40 kg/m²",
    note: "Based on booking weight.",
    score: 2,
    phases: ["antenatal", "postnatal"],
    exclusiveWith: ["bmi_30_to_39"],
  },
  {
    group: "Pre-existing",
    id: "parity_3_plus",
    label: "Parity ≥ 3",
    note: "A woman becomes para 3 after her third delivery.",
    score: 1,
    phases: ["antenatal", "postnatal"],
  },
  {
    group: "Pre-existing",
    id: "smoker",
    label: "Smoker",
    score: 1,
    phases: ["antenatal", "postnatal"],
  },
  {
    group: "Pre-existing",
    id: "gross_varicose_veins",
    label: "Gross varicose veins",
    note: "Symptomatic, above knee or with associated phlebitis/oedema/skin changes.",
    score: 1,
    phases: ["antenatal", "postnatal"],
  },

  // ─── Obstetric risk factors ───────────────────────────────────────
  {
    group: "Obstetric",
    id: "pre_eclampsia",
    label: "Pre-eclampsia in current pregnancy",
    score: 1,
    phases: ["antenatal", "postnatal"],
  },
  {
    group: "Obstetric",
    id: "art_ivf",
    label: "ART / IVF",
    note: "Antenatal only.",
    score: 1,
    phases: ["antenatal"],
  },
  {
    group: "Obstetric",
    id: "multiple_pregnancy",
    label: "Multiple pregnancy",
    score: 1,
    phases: ["antenatal", "postnatal"],
  },
  {
    group: "Obstetric",
    id: "cs_in_labour",
    label: "Caesarean section in labour",
    score: 2,
    phases: ["postnatal"],
  },
  {
    group: "Obstetric",
    id: "elective_cs",
    label: "Elective caesarean section",
    score: 1,
    phases: ["postnatal"],
  },
  {
    group: "Obstetric",
    id: "mid_cavity_rotational",
    label: "Mid-cavity or rotational operative delivery",
    score: 1,
    phases: ["postnatal"],
  },
  {
    group: "Obstetric",
    id: "prolonged_labour",
    label: "Prolonged labour (> 24 hours)",
    score: 1,
    phases: ["postnatal"],
  },
  {
    group: "Obstetric",
    id: "pph",
    label: "PPH (> 1 litre or transfusion)",
    score: 1,
    phases: ["postnatal"],
  },
  {
    group: "Obstetric",
    id: "preterm_birth",
    label: "Preterm birth < 37+0 weeks in current pregnancy",
    score: 1,
    phases: ["postnatal"],
  },
  {
    group: "Obstetric",
    id: "stillbirth",
    label: "Stillbirth in current pregnancy",
    score: 1,
    phases: ["postnatal"],
  },

  // ─── Transient risk factors ───────────────────────────────────────
  {
    group: "Transient",
    id: "surgical_procedure",
    label: "Any surgical procedure in pregnancy or puerperium except immediate repair of the perineum (e.g. appendicectomy, postpartum sterilisation)",
    score: 3,
    phases: ["antenatal", "postnatal"],
  },
  {
    group: "Transient",
    id: "hyperemesis",
    label: "Hyperemesis",
    score: 3,
    phases: ["antenatal"],
  },
  {
    group: "Transient",
    id: "ohss",
    label: "OHSS (first trimester only)",
    score: 4,
    phases: ["antenatal"],
  },
  {
    group: "Transient",
    id: "current_systemic_infection",
    label: "Current systemic infection",
    score: 1,
    phases: ["antenatal", "postnatal"],
  },
  {
    group: "Transient",
    id: "immobility_dehydration",
    label: "Immobility, dehydration",
    score: 1,
    phases: ["antenatal", "postnatal"],
  },
];

// GTG37a Appendix III — additional admission-based recommendations
export const VTE_ADMISSION_NOTES = [
  "If admitted to hospital antenatally, consider thromboprophylaxis.",
  "If prolonged admission (≥ 3 days) or readmission to hospital within the puerperium, consider thromboprophylaxis.",
];

export function interpretVteAntenatal(total) {
  // GTG37a Appendix III thresholds, verbatim:
  // "If total score ≥ 4 antenatally, consider thromboprophylaxis from the first trimester."
  // "If total score 3 antenatally, consider thromboprophylaxis from 28 weeks."
  // (else mobilisation and avoidance of dehydration — Appendix I, "LOWER RISK")
  if (total >= 4) {
    return {
      category: "HIGH",
      title: "Consider thromboprophylaxis from the first trimester",
      color: "text-rose-700",
      bg: "bg-rose-50",
      border: "border-rose-300",
      summary: `Antenatal score ${total} (≥ 4).`,
      detail:
        "RCOG GTG37a Appendix III: if total score ≥ 4 antenatally, consider thromboprophylaxis from the first trimester. Recommendation 4.1 also states: any woman with four or more current risk factors (other than previous VTE or thrombophilia) should be considered for prophylactic LMWH throughout the antenatal period and will usually require prophylactic LMWH for 6 weeks postnatally, but a postnatal risk reassessment should be made.",
      actions: [
        "Start LMWH from the first trimester at weight-appropriate prophylactic dose.",
        "Continue antenatally throughout pregnancy.",
        "Reassess postnatally — usually requires 6 weeks of postnatal LMWH.",
      ],
      citation: "RCOG GTG37a Appendix III · §4.1",
    };
  }
  if (total === 3) {
    return {
      category: "INTERMEDIATE_28W",
      title: "Consider thromboprophylaxis from 28 weeks",
      color: "text-amber-700",
      bg: "bg-amber-50",
      border: "border-amber-300",
      summary: "Antenatal score 3.",
      detail:
        "RCOG GTG37a Appendix III: if total score 3 antenatally, consider thromboprophylaxis from 28 weeks. Recommendation 4.1: any woman with three current risk factors (other than previous VTE or thrombophilia) should be considered for prophylactic LMWH from 28 weeks and will usually require prophylactic LMWH for 6 weeks postnatally.",
      actions: [
        "Start LMWH at 28 weeks at weight-appropriate prophylactic dose.",
        "Reassess postnatally — usually requires 6 weeks of postnatal LMWH.",
      ],
      citation: "RCOG GTG37a Appendix III · §4.1",
    };
  }
  return {
    category: "LOW",
    title: "Lower risk — mobilisation and avoidance of dehydration",
    color: "text-teal-700",
    bg: "bg-teal-50",
    border: "border-teal-300",
    summary: `Antenatal score ${total} (< 3).`,
    detail:
      "RCOG GTG37a Appendix I: lower-risk women should be advised on mobilisation and avoidance of dehydration. Risk assessment should be repeated if she is admitted to hospital or develops other intercurrent problems, and again intrapartum or immediately postpartum.",
    actions: [
      "No routine pharmacological thromboprophylaxis.",
      "Repeat risk assessment on admission and postpartum.",
    ],
    citation: "RCOG GTG37a Appendix I · §4.1",
  };
}

export function interpretVtePostnatal(total) {
  // GTG37a Appendix III:
  // "If total score ≥ 2 postnatally, consider thromboprophylaxis for at least 10 days."
  // 6 weeks (high-risk) vs 10 days (intermediate) distinction comes from §7.5 / Appendix IV.
  if (total >= 4) {
    return {
      category: "HIGH",
      title: "Consider at least 6 weeks of postnatal prophylactic LMWH",
      color: "text-rose-700",
      bg: "bg-rose-50",
      border: "border-rose-300",
      summary: `Postnatal score ${total} (≥ 4).`,
      detail:
        "RCOG GTG37a Appendix I categorises women requiring antenatal LMWH or with previous VTE / high-risk thrombophilia as HIGH RISK requiring at least 6 weeks of postnatal prophylactic LMWH. §7.5: thromboprophylaxis should be continued for 6 weeks in high-risk women and for 10 days in intermediate-risk women.",
      actions: [
        "Postnatal LMWH at weight-appropriate prophylactic dose for at least 6 weeks.",
        "Extend up to 6 weeks (or until risk factors resolve) if additional persistent risk factors lasting >10 days postpartum (prolonged admission, wound infection, surgery).",
      ],
      citation: "RCOG GTG37a §7.5 · Appendix I",
    };
  }
  if (total >= 2) {
    return {
      category: "INTERMEDIATE",
      title: "Consider thromboprophylaxis for at least 10 days postpartum",
      color: "text-amber-700",
      bg: "bg-amber-50",
      border: "border-amber-300",
      summary: `Postnatal score ${total} (≥ 2).`,
      detail:
        "RCOG GTG37a Appendix III: if total score ≥ 2 postnatally, consider thromboprophylaxis for at least 10 days. Recommendation 4.1: any woman with two current risk factors (other than previous VTE or thrombophilia) should be considered for prophylactic LMWH for at least 10 days postpartum.",
      actions: [
        "Postnatal LMWH at weight-appropriate prophylactic dose for at least 10 days.",
        "If risk factors persist or there are > 3 risk factors, consider extending thromboprophylaxis (Appendix I).",
      ],
      citation: "RCOG GTG37a Appendix III · §4.1",
    };
  }
  return {
    category: "LOW",
    title: "Lower risk — early mobilisation and avoidance of dehydration",
    color: "text-teal-700",
    bg: "bg-teal-50",
    border: "border-teal-300",
    summary: `Postnatal score ${total} (< 2).`,
    detail:
      "RCOG GTG37a Appendix I: early mobilisation and avoidance of dehydration.",
    actions: ["No routine pharmacological thromboprophylaxis."],
    citation: "RCOG GTG37a Appendix I",
  };
}

// LMWH prophylactic dosing — Table 3, GTG37a §8.1, verbatim.
// Weight bands and doses copied exactly.
export const LMWH_DOSE_BANDS = [
  { max: 50,  enoxaparin: "20 mg daily",     dalteparin: "2,500 units daily",  tinzaparin: "3,500 units daily" },
  { max: 90,  enoxaparin: "40 mg daily",     dalteparin: "5,000 units daily",  tinzaparin: "4,500 units daily" },
  { max: 130, enoxaparin: "60 mg daily*",    dalteparin: "7,500 units daily",  tinzaparin: "7,000 units daily*" },
  { max: 170, enoxaparin: "80 mg daily*",    dalteparin: "10,000 units daily", tinzaparin: "9,000 units daily*" },
  { max: Infinity, enoxaparin: "0.6 mg/kg/day*", dalteparin: "75 u/kg/day",   tinzaparin: "75 u/kg/day*" },
];
// * may be given in 2 divided doses (GTG37a Table 3 footnote).

export const LMWH_HIGH_PROPHYLACTIC_50_TO_90 = {
  enoxaparin: "40 mg 12-hourly",
  dalteparin: "5,000 units 12-hourly",
  tinzaparin: "4,500 units 12-hourly",
};
// Source: GTG37a Table 3, "High prophylactic dose for women weighing 50–90 kg".

export function lmwhDoseForWeight(weightKg) {
  if (!weightKg || weightKg <= 0) return null;
  for (const band of LMWH_DOSE_BANDS) {
    if (weightKg < band.max || band.max === Infinity) return band;
  }
  return null;
}

// GTG37a Appendix III — contraindications / cautions to LMWH, verbatim.
export const LMWH_CONTRAINDICATIONS = [
  "Known bleeding disorder (e.g. haemophilia, von Willebrand's disease or acquired coagulopathy)",
  "Active antenatal or postpartum bleeding",
  "Women considered at increased risk of major haemorrhage (e.g. placenta praevia)",
  "Thrombocytopenia (platelet count < 75 × 10⁹/L)",
  "Acute stroke in previous 4 weeks (haemorrhagic or ischaemic)",
  "Severe renal disease (GFR < 30 ml/minute/1.73m²)",
  "Severe liver disease (prothrombin time above normal range or known varices)",
  "Uncontrolled hypertension (blood pressure > 200 mmHg systolic or > 120 mmHg diastolic)",
];
