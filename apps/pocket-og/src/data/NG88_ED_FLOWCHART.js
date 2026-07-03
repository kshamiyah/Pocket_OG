// NG88 — Acute Heavy Menstrual Bleeding presenting to the Emergency Department.
// Assessment-and-treat triage: resuscitate first, exclude pregnancy, then assess
// cause and control bleeding before handing off to the NG88 primary-care pathway.
//
// Anchored to NICE NG88 (assessment, red flags, pharmacological treatment).
// Acute resuscitation / transfusion is NOT covered by NG88 — those nodes follow
// standard practice and local major-haemorrhage policy, and every acute figure is
// marked "verify against local protocol". Drug doses are common UK defaults only.

export const NG88_ED_ACUTE_FLOWCHART = {
  id: "NG88_ED_ACUTE",
  title: "Acute HMB in ED — Triage & Treat",
  subtitle: "NG88 · acute presentation",
  startId: "start",
  nodes: {

    "start": {
      type: "action",
      title: "Acute Heavy Menstrual Bleeding — Immediate Assessment (A–E)",
      text: "Resuscitate first, diagnose second. Assess and stabilise before working through the cause.",
      items: [
        "ABCDE; pulse, blood pressure, shock index (HR ÷ SBP); estimate ongoing loss (pads, clots, flooding)",
        "Two large-bore IV cannulae",
        "Bloods: FBC, group & save / crossmatch, coagulation screen, ferritin",
        "βhCG on every woman of reproductive age — always exclude pregnancy",
      ],
      next: "stable",
    },

    "stable": {
      type: "decision",
      title: "Haemodynamically stable?",
      text: "Shock index > 0.9, hypotension, or ongoing heavy loss indicates instability.",
      options: [
        { label: "Unstable — shock or ongoing heavy loss", sublabel: "Resuscitate now", next: "resus" },
        { label: "Stable", sublabel: "Proceed to assess cause", next: "pregnancy" },
      ],
    },

    "resus": {
      type: "alert",
      title: "Resuscitate — Major Haemorrhage",
      text: "Not covered by NG88 — follow your local major-haemorrhage protocol. Do not wait for a diagnosis to resuscitate.",
      items: [
        "Activate the major-haemorrhage protocol; give O-negative or crossmatched blood per local transfusion trigger (verify against local protocol)",
        "IV tranexamic acid 1 g (common UK default — verify dose and route against local protocol)",
        "Urgent senior gynaecology and anaesthetic review; consider theatre",
        "Continuous monitoring and repeat bloods (FBC, coagulation)",
      ],
      next: "resus-escalate",
    },

    "resus-escalate": {
      type: "end",
      title: "Escalated — Senior & Theatre",
      text: "Ongoing resuscitation with senior obstetric/gynaecology and anaesthetic input.",
      items: [
        "If βhCG positive: treat as an ectopic or miscarriage emergency — divert to the relevant pathway",
        "Definitive haemostasis (examination under anaesthesia, uterine tamponade, or surgery) as directed by the senior team",
        "Once stabilised, resume the assessment of cause and definitive management",
      ],
    },

    "pregnancy": {
      type: "decision",
      title: "Could she be pregnant? (βhCG)",
      text: "The most important branch — a bleeding early pregnancy is a different emergency, and NG88 assumes a non-pregnant woman.",
      options: [
        { label: "βhCG positive / possible pregnancy", sublabel: "Not primary HMB — pregnancy pathway", next: "preg" },
        { label: "βhCG negative — not pregnant", sublabel: "True HMB pathway", next: "redflags" },
      ],
    },

    "preg": {
      type: "end",
      title: "Pregnancy-Related Bleeding — Not Primary HMB",
      text: "This ED-HMB pathway does not apply. Divert to the relevant early-pregnancy pathway.",
      items: [
        "Exclude ectopic pregnancy before assuming miscarriage",
        "Check rhesus status — give anti-D if indicated",
      ],
    },

    "redflags": {
      type: "decision",
      title: "Red flag features? (NG88)",
      text: "Screen before routine management — the same red-flag branch as the NG88 assessment pathway.",
      options: [
        { label: "Postmenopausal bleeding", sublabel: "Any bleeding >12 months after last period — 2-week-wait referral", next: "pmb" },
        { label: "Persistent intermenstrual or postcoital bleeding", sublabel: "Investigate before treating", next: "imb" },
        { label: "None — heavy menstrual bleeding only", sublabel: "Assess cause", next: "cause" },
      ],
    },

    "pmb": {
      type: "end",
      title: "Postmenopausal Bleeding — Urgent 2-Week-Wait Referral",
      text: "Postmenopausal bleeding requires a 2WW gynaecology referral to exclude endometrial and cervical cancer. Do not delay referral to trial treatment.",
      items: [
        "Refer under 2-week wait for unexplained bleeding after menopause",
        "Treat iron-deficiency anaemia while awaiting the appointment",
        "Safety-net: advise re-attendance if symptoms worsen",
      ],
    },

    "imb": {
      type: "end",
      title: "IMB / PCB — Investigate Before Treating",
      text: "Intermenstrual and postcoital bleeding may indicate endometrial or cervical pathology and should not be treated empirically.",
      items: [
        "Speculum examination; ensure cervical smear is up to date; colposcopy if the cervix is suspicious or the smear abnormal",
        "Pelvic ultrasound ± hysteroscopy and endometrial biopsy",
        "Refer to gynaecology if no cause found or the ultrasound is abnormal",
      ],
    },

    "cause": {
      type: "action",
      title: "Assess Cause — Structural vs Non-Structural (NG88)",
      text: "History and examination to characterise the bleeding and identify any underlying structural pathology.",
      items: [
        "Structural pathology (refer if suspected): palpable / enlarged uterus, bulk symptoms (urinary frequency, pressure), fibroids, endometrial thickening or polyp, adenomyosis",
        "Pelvic ultrasound (transvaginal preferred) if structural pathology suspected or examination abnormal",
        "Coagulation screen (VWF, FVIII) if HMB since menarche or a personal / family bleeding history",
        "No structural pathology identified: proceed to pharmacological treatment",
      ],
      next: "acute",
    },

    "acute": {
      type: "action",
      title: "Acute Medical Management — Control the Bleeding",
      text: "Control acute loss now; definitive management follows via the NG88 pathway. Doses below are common UK defaults — verify against local protocol.",
      items: [
        "Tranexamic acid 1 g (IV if severe, then oral) — non-hormonal, does not affect fertility (verify against local protocol)",
        "High-dose oral norethisterone (commonly 5 mg three times daily) to arrest acute bleeding (verify against local protocol)",
        "NSAID (e.g. mefenamic acid 500 mg TDS) for lighter cases with pain — avoid if bleeding risk or contraindication",
        "Treat iron-deficiency anaemia; transfuse per local threshold",
      ],
      next: "dispo",
    },

    "dispo": {
      type: "end",
      title: "Disposition & Handoff to NG88",
      text: "Decide admission versus discharge, then route to definitive HMB management.",
      items: [
        "Admit if: ongoing instability, transfusion required, or failed acute control",
        "Discharge if: bleeding settling, safe haemoglobin, follow-up arranged and safety-net advice given",
        "Route to the NG88 assessment and pharmacological-treatment pathways for definitive care (LNG-IUS, CHC, non-hormonal options)",
      ],
    },

  },
};
