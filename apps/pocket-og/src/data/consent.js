// All risk figures verbatim from cited sources. No inference.
// RCOG frequency terminology:
//   Very common  1 in 1–10
//   Common       1 in 10–100
//   Uncommon     1 in 100–1,000
//   Rare         1 in 1,000–10,000
//   Very rare    < 1 in 10,000

export const FREQ = {
  VERY_COMMON: { label: "Very common", bg: "bg-red-50",    text: "text-red-700",    dot: "bg-red-400",    border: "border-red-100" },
  COMMON:      { label: "Common",      bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-400", border: "border-orange-100" },
  UNCOMMON:    { label: "Uncommon",    bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-400", border: "border-yellow-100" },
  RARE:        { label: "Rare",        bg: "bg-gray-50",   text: "text-gray-500",   dot: "bg-gray-300",   border: "border-gray-100" },
  VERY_RARE:   { label: "Very rare",   bg: "bg-slate-50",  text: "text-slate-400",  dot: "bg-slate-200",  border: "border-slate-100" },
};

// ─── CAESAREAN SECTION ────────────────────────────────────────────────────────

export const CS_CONTEXT_OPTIONS = [
  { id: "elective",  label: "Elective",   description: "Planned, not urgent",     color: "text-emerald-600", dot: "bg-emerald-500" },
  { id: "emergency", label: "Emergency",  description: "Delivery needed now",     color: "text-red-600",     dot: "bg-red-500" },
];

export const CS_PATIENT_FACTORS = [
  { id: "prev_cs_1",        label: "Previous caesarean ×1" },
  { id: "prev_cs_2plus",    label: "Previous caesarean ×2 or more" },
  { id: "placenta_praevia", label: "Placenta praevia / accreta" },
  { id: "bmi_40",           label: "BMI > 40" },
  { id: "anticoagulation",  label: "On anticoagulation" },
  { id: "general_anaes",    label: "General anaesthetic needed" },
];

// ─── CS RISK SECTIONS ─────────────────────────────────────────────────────────
// Standard CS: NICE NG192 Appendix A (2021) structure
// PP CS overlay: RCOG Consent Advice No. 12 (2010) structure

// type "comparison" — side-by-side CS vs vaginal birth (NICE NG192 App A)
// type "list"       — risk rows with freq badges (RCOG format)
// type "simple"     — plain bullet list (no freq data given in source)

// CS risks — RCOG Consent Advice No. 14 (2024) + NICE NG192 Appendix A (2021)
export const CS_RISK_SECTIONS = [
  {
    id: "cs_maternal",
    heading: "Risks to you",
    type: "list",
    risks: [
      {
        id: "haemorrhage_transfusion",
        name: "Heavy bleeding requiring blood transfusion",
        freq: "COMMON",
        rate: "1–6 in 100",
        source: "RCOG CA14",
        plain: "Significant bleeding can occur during or after a caesarean and may require a blood transfusion. This is more likely in emergency than planned procedures.",
      },
      {
        id: "wound_uterine_infection",
        name: "Wound or uterine infection",
        freq: "COMMON",
        rate: "2–7 in 100",
        source: "RCOG CA14",
        plain: "Infection of the abdominal wound or uterus is common. It is usually treated with antibiotics. Prophylactic antibiotics are given routinely at the time of surgery.",
      },
      {
        id: "uti",
        name: "Urinary tract infection",
        freq: "COMMON",
        rate: null,
        source: "RCOG CA14",
        plain: "Urinary tract infections are common after caesarean, partly related to catheterisation during surgery. Usually treated with a short course of antibiotics.",
      },
      {
        id: "wound_pain",
        name: "Persistent wound or abdominal discomfort",
        freq: "COMMON",
        rate: "9 in 100",
        source: "RCOG CA14",
        plain: "Around 1 in 11 women experience ongoing wound or abdominal discomfort in the first few months after surgery.",
      },
      {
        id: "readmission",
        name: "Readmission to hospital",
        freq: "COMMON",
        rate: "1 in 14",
        source: "RCOG CA14",
        plain: "Some women need to be readmitted to hospital after discharge, most commonly for infection or wound problems.",
      },
      {
        id: "bladder_injury",
        name: "Bladder injury",
        freq: "UNCOMMON",
        rate: "1 in 1,000",
        source: "RCOG CA14",
        plain: "Injury to the bladder can occur, particularly if there has been a previous caesarean or other pelvic surgery. It usually requires repair at the time of the operation.",
      },
      {
        id: "ureteric_injury",
        name: "Ureteric injury",
        freq: "RARE",
        rate: null,
        source: "RCOG CA14",
        plain: "Injury to the ureter (the tube connecting the kidney to the bladder) is rare but can occur, particularly with repeat or complex caesareans.",
      },
      {
        id: "bowel_injury",
        name: "Bowel injury",
        freq: "RARE",
        rate: null,
        source: "RCOG CA14",
        plain: "Injury to the bowel is rare but can occur during caesarean, especially if there are adhesions from previous abdominal surgery.",
      },
      {
        id: "return_to_theatre",
        name: "Return to theatre / further surgery",
        freq: "UNCOMMON",
        rate: "5 in 1,000",
        source: "RCOG CA14",
        plain: "A small number of women need to return to theatre after their caesarean, most commonly to manage bleeding or other complications.",
      },
      {
        id: "icu_admission",
        name: "Admission to intensive care unit",
        freq: "UNCOMMON",
        rate: "9 in 1,000",
        source: "RCOG CA14",
        plain: "A small number of women require intensive care following caesarean, usually due to severe bleeding or anaesthetic complications.",
      },
      {
        id: "vte",
        name: "Thromboembolic disease (DVT / PE)",
        freq: "UNCOMMON",
        rate: null,
        source: "RCOG CA14",
        plain: "Blood clots in the legs (DVT) or lungs (PE) are a risk after any major surgery. Preventative measures including compression stockings and blood-thinning injections are used routinely.",
      },
      {
        id: "adhesions",
        name: "Adhesions (internal scarring)",
        freq: "COMMON",
        rate: null,
        source: "RCOG CA14",
        plain: "Scar tissue (adhesions) can form inside the abdomen after caesarean and may increase with each repeat procedure. Adhesions can cause pain, affect future surgery, and rarely affect the bowel or bladder.",
      },
      {
        id: "hysterectomy",
        name: "Peripartum hysterectomy",
        freq: "UNCOMMON",
        rate: "1 in 500",
        source: "RCOG CA14",
        plain: "Very rarely, heavy bleeding cannot be controlled and the uterus needs to be removed. This would mean you could not have further pregnancies.",
      },
      {
        id: "maternal_death",
        name: "Maternal death",
        freq: "RARE",
        rate: "1 in 12,000",
        source: "RCOG CA14",
        plain: "Death from caesarean section is very rare. The theatre team is trained to manage serious complications.",
      },
      {
        id: "urinary_incontinence",
        name: "Urinary incontinence >1 year after birth",
        freq: "COMMON",
        rate: "1 in 5",
        source: "NICE NG192",
        plain: "Around 1 in 5 women experience urinary incontinence more than a year after a caesarean. This is lower than after unassisted vaginal birth.",
      },
      {
        id: "hospital_stay",
        name: "Longer hospital stay",
        freq: null,
        rate: "About 4 days on average",
        source: "NICE NG192",
        plain: "A caesarean usually means staying in hospital around 4 days — approximately 1 to 2 days longer than after a vaginal birth.",
      },
    ],
  },
  {
    id: "cs_baby",
    heading: "Risks to your baby",
    type: "list",
    risks: [
      {
        id: "respiratory_morbidity",
        name: "Breathing problems / TTN",
        freq: "COMMON",
        rate: "1 in 24 at 38 weeks; 1 in 56 at ≥39 weeks",
        source: "RCOG CA14",
        plain: "Babies born by elective caesarean before labour have a higher risk of breathing difficulties in the first hours of life (transient tachypnoea of the newborn). Risk falls significantly if delivery is at or after 39 weeks.",
      },
      {
        id: "nicu_admission",
        name: "Neonatal unit admission",
        freq: "COMMON",
        rate: null,
        source: "RCOG CA14",
        plain: "Babies born by caesarean are more likely to need a neonatal unit admission, most commonly for observation of breathing. Risk is higher before 39 weeks.",
      },
      {
        id: "fetal_laceration",
        name: "Accidental fetal laceration",
        freq: "RARE",
        rate: null,
        source: "RCOG CA14",
        plain: "A small cut to the baby's skin can occasionally occur when the uterus is opened. Usually minor and heals without complication.",
      },
      {
        id: "neonatal_mortality",
        name: "Neonatal mortality",
        freq: "RARE",
        rate: "1 in 1,700",
        source: "NICE NG192",
        plain: "Neonatal death following caesarean is rare. These figures reflect the overall population including cases where caesarean was performed because of serious complications.",
      },
      {
        id: "asthma",
        name: "Childhood asthma",
        freq: "COMMON",
        rate: "1 in 55",
        source: "NICE NG192",
        plain: "There is a small increase in the risk of childhood asthma in babies born by caesarean. The reason is not fully understood but may relate to differences in gut microbiome colonisation.",
      },
      {
        id: "obesity",
        name: "Childhood obesity",
        freq: "COMMON",
        rate: "1 in 22",
        source: "NICE NG192",
        plain: "There is a small increase in the risk of childhood obesity in babies born by caesarean compared with vaginal birth (1 in 25). The mechanism is not fully understood.",
      },
    ],
  },
  {
    id: "cs_future",
    heading: "Future pregnancies",
    type: "list",
    risks: [
      {
        id: "uterine_rupture_future",
        name: "Uterine rupture in future pregnancy",
        freq: "RARE",
        rate: "2–7 in 1,000",
        source: "RCOG CA14",
        plain: "The scar on your womb can occasionally open during a future labour. Future pregnancies will be monitored more closely as a result.",
      },
      {
        id: "placenta_accreta_future",
        name: "Placenta accreta in future pregnancy",
        freq: "RARE",
        rate: "1 in 1,000",
        source: "RCOG CA14",
        plain: "The placenta can grow into the caesarean scar in a future pregnancy, which can cause severe bleeding and may require hysterectomy.",
      },
      {
        id: "placenta_praevia_future",
        name: "Placenta praevia in future pregnancy",
        freq: "UNCOMMON",
        rate: "23 in 1,000",
        source: "RCOG CA14",
        plain: "There is an increased chance that the placenta will lie low (covering the cervix) in a future pregnancy, which would require careful monitoring and likely another caesarean.",
      },
      {
        id: "stillbirth_future",
        name: "Stillbirth in future pregnancy",
        freq: "UNCOMMON",
        rate: "1–4 in 1,000",
        source: "RCOG CA14",
        plain: "There is a small increased risk of stillbirth in future pregnancies following caesarean birth. The absolute risk remains low.",
      },
    ],
  },
];

// Comparison sections — shown only when user taps "Compare with vaginal birth"
export const CS_COMPARISON_SECTIONS = [
  {
    id: "more_likely_women",
    heading: "More likely with caesarean — Women",
    type: "comparison",
    source: "NICE NG192 Appendix A (2021)",
    risks: [
      {
        id: "hysterectomy",
        name: "Peripartum hysterectomy",
        cs: "About 200 per 100,000 (1 in 500)",
        vaginal: "About 100 per 100,000 (1 in 1,000)",
        cs_higher: true,
        plain: "Very rarely, heavy bleeding cannot be controlled and the uterus needs to be removed. This would mean you could not have further pregnancies.",
      },
      {
        id: "maternal_death",
        name: "Maternal death",
        cs: "About 25 per 100,000 (1 in 4,000)",
        vaginal: "About 4 per 100,000 (1 in 25,000)",
        cs_higher: true,
        plain: "Caesarean carries a higher risk of maternal death compared with vaginal birth, though both are very rare.",
      },
      {
        id: "hospital_stay",
        name: "Length of hospital stay",
        cs: "About 4 days on average",
        vaginal: "About 2½ days on average",
        cs_higher: true,
        plain: "A caesarean usually means a longer stay in hospital than after a vaginal birth.",
      },
      {
        id: "placenta_accreta_future",
        name: "Placenta accreta in any future pregnancy",
        cs: "About 100 per 100,000 (1 in 1,000)",
        vaginal: "About 30 per 100,000 (1 in 3,300)",
        cs_higher: true,
        plain: "The placenta can grow into the caesarean scar in a future pregnancy, which can cause severe bleeding and may require hysterectomy.",
      },
      {
        id: "uterine_rupture_future",
        name: "Uterine rupture in any future pregnancy",
        cs: "About 200 per 100,000 (1 in 500)",
        vaginal: "About 7 per 100,000 (1 in 14,000)",
        cs_higher: true,
        plain: "The scar on your womb can occasionally open during a future labour. Future labours will be monitored more closely as a result.",
      },
    ],
  },
  {
    id: "more_likely_baby",
    heading: "More likely with caesarean — Baby",
    type: "comparison",
    source: "NICE NG192 Appendix A (2021)",
    risks: [
      {
        id: "neonatal_mortality",
        name: "Neonatal mortality",
        cs: "About 58 per 100,000 (1 in 1,700)",
        vaginal: "About 30 per 100,000 (1 in 3,300)",
        cs_higher: true,
        plain: "Neonatal death is rare with either mode of birth. The figures reflect the overall population and include cases where caesarean was performed because of serious complications.",
      },
      {
        id: "asthma",
        name: "Childhood asthma",
        cs: "About 1,809 per 100,000 (1 in 55)",
        vaginal: "About 1,500 per 100,000 (1 in 67)",
        cs_higher: true,
        plain: "There is a small increase in the risk of childhood asthma in babies born by caesarean. The reason for this is not fully understood.",
      },
    ],
  },
  {
    id: "less_likely_women",
    heading: "Less likely with caesarean — Women",
    type: "comparison",
    source: "NICE NG192 Appendix A (2021)",
    risks: [
      {
        id: "urinary_incont_unassisted",
        name: "Urinary incontinence >1 year (vs unassisted vaginal birth)",
        cs: "About 19,600 per 100,000 (1 in 5)",
        vaginal: "About 48,700 per 100,000 (1 in 2)",
        cs_higher: false,
        plain: "Caesarean birth is associated with a lower risk of long-term urinary incontinence compared with unassisted vaginal birth.",
      },
      {
        id: "urinary_incont_assisted",
        name: "Urinary incontinence >1 year (vs assisted vaginal birth)",
        cs: "About 7,300 per 100,000 (1 in 14)",
        vaginal: "About 19,800 per 100,000 (1 in 5)",
        cs_higher: false,
        plain: "Compared with forceps or ventouse delivery, caesarean carries a lower risk of long-term urinary incontinence.",
      },
      {
        id: "faecal_incont",
        name: "Faecal incontinence >1 year (vs assisted vaginal birth)",
        cs: "About 7,800 per 100,000 (1 in 13)",
        vaginal: "About 15,100 per 100,000 (1 in 7)",
        cs_higher: false,
        plain: "Compared with assisted vaginal birth, caesarean carries a lower risk of long-term faecal incontinence.",
      },
      {
        id: "vaginal_tear",
        name: "Vaginal tear",
        cs: "About 0 per 100,000",
        vaginal: "About 560 per 100,000 (1 in 180)",
        cs_higher: false,
        plain: "Vaginal tears do not occur with caesarean birth.",
      },
      {
        id: "perineal_pain",
        name: "Perineal/abdominal pain during birth",
        cs: "Median pain score 1.0",
        vaginal: "Median pain score 7.3",
        cs_higher: false,
        plain: "Pain during the birth itself is much lower with caesarean under spinal anaesthetic. However, abdominal wound pain afterwards is common.",
      },
    ],
  },
  {
    id: "similar",
    heading: "Likely to be similar for both",
    type: "simple",
    source: "NICE NG192 Appendix A (2021)",
    items: [
      "Thromboembolic disease",
      "Major obstetric haemorrhage",
      "Postnatal depression",
      "Faecal incontinence >1 year (vs unassisted vaginal birth)",
      "Admission to neonatal unit",
      "Infection",
    ],
  },
];

// Benefits of planned CS vs planned vaginal birth — figures verbatim from
// NICE NG192 Appendix A (2021). Population averages; comparator named per row.
export const CS_BENEFITS_ELECTIVE = [
  {
    id: "pain_during_birth",
    name: "Far less pain during the birth itself",
    rate: "Pain score 1.0 vs 7.3",
    detail: "median, vs vaginal birth",
    source: "NICE NG192 App A",
    plain: "Pain during the birth itself is much lower with caesarean under spinal anaesthetic (median pain score 1.0 vs 7.3). However, abdominal wound pain afterwards is common.",
  },
  {
    id: "no_vaginal_tear",
    name: "No vaginal tears",
    rate: "0 vs 560 per 100,000",
    detail: "vs vaginal birth",
    source: "NICE NG192 App A",
    plain: "Vaginal tears do not occur with caesarean birth.",
  },
  {
    id: "urinary_incont_benefit",
    name: "Lower risk of urinary incontinence lasting more than a year",
    rate: "1 in 5 vs 1 in 2",
    detail: "vs unassisted vaginal birth",
    source: "NICE NG192 App A",
    plain: "Caesarean birth is associated with a lower risk of long-term urinary incontinence: about 19,600 per 100,000 vs 48,700 per 100,000 after unassisted vaginal birth, and about 7,300 vs 19,800 per 100,000 compared with assisted (forceps or ventouse) birth.",
  },
  {
    id: "faecal_incont_benefit",
    name: "Lower risk of faecal incontinence lasting more than a year",
    rate: "1 in 13 vs 1 in 7",
    detail: "vs assisted vaginal birth",
    source: "NICE NG192 App A",
    plain: "Compared with assisted (forceps or ventouse) vaginal birth, caesarean carries a lower risk of long-term faecal incontinence: about 7,800 vs 15,100 per 100,000. Compared with unassisted vaginal birth the risk is similar.",
  },
];

// Emergency CS benefits are qualitative: the guideline gives no comparative
// figures for "operate now vs continue labour", so no rates are stated.
export const CS_BENEFITS_EMERGENCY = [
  {
    id: "cs_em_prompt",
    name: "Delivers your baby promptly when there is concern",
    source: "NICE NG192",
    plain: "An emergency caesarean achieves birth quickly when continuing labour is judged to carry significant risk to you or your baby. How quickly depends on the urgency, which the team will explain.",
  },
  {
    id: "cs_em_avoids",
    name: "Avoids the risks of continuing labour in your situation",
    source: "NICE NG192",
    plain: "The operation is recommended because, in your specific situation, waiting or continuing labour is considered more risky than surgical delivery. The team will explain the reason in your case.",
  },
];

// RCOG Consent Advice No. 12 — shown when placenta praevia factor active
export const CS_PP_RISK_SECTIONS = [
  {
    id: "serious_maternal_pp",
    heading: "Serious risks — Maternal",
    type: "list",
    source: "RCOG Consent Advice No. 12 (2010)",
    note: "These risks apply specifically because of placenta praevia and differ from those of a caesarean with a normally sited placenta.",
    risks: [
      {
        id: "massive_haem",
        name: "Massive obstetric haemorrhage",
        freq: "VERY_COMMON",
        rate: "21 in 100",
        source: "RCOG CA12",
        plain: "Life-threatening bleeding requiring emergency treatment including blood transfusion.",
      },
      {
        id: "hysterectomy_all_pp",
        name: "Emergency hysterectomy",
        freq: "VERY_COMMON",
        rate: "Up to 11 in 100",
        source: "RCOG CA12",
        plain: "Heavy bleeding that cannot be controlled may require removal of the uterus. This would mean you could not have further pregnancies.",
      },
      {
        id: "hysterectomy_pp_prev_cs",
        name: "Emergency hysterectomy (with previous caesarean)",
        freq: "VERY_COMMON",
        rate: "Up to 27 in 100",
        source: "RCOG CA12",
        conditions: ["prev_cs_1", "prev_cs_2plus"],
        plain: "The risk of needing a hysterectomy increases further if you have had a previous caesarean section.",
      },
      {
        id: "hysterectomy_accreta",
        name: "Emergency hysterectomy (abnormally adherent placenta / accreta)",
        freq: null,
        rate: null,
        source: "RCOG CA12",
        note: "Hysterectomy is highly likely",
        conditions: ["placenta_praevia"],
        plain: "If the placenta has grown into the wall of the womb, a hysterectomy is almost always required to prevent life-threatening bleeding.",
      },
      {
        id: "further_laparotomy",
        name: "Need for further laparotomy during recovery",
        freq: "COMMON",
        rate: "75 in 1,000",
        source: "RCOG CA12",
        plain: "A return to theatre for a further open operation may be needed to manage ongoing bleeding or other complications.",
      },
      {
        id: "vte_pp",
        name: "Thromboembolic disease",
        freq: "COMMON",
        rate: "Up to 3 in 100",
        source: "RCOG CA12",
        plain: "Clots can form in the leg (DVT) or travel to the lung (PE). Blood-thinning injections and stockings reduce this risk.",
      },
      {
        id: "bladder_ureteric",
        name: "Bladder or ureteric injury",
        freq: "COMMON",
        rate: "Up to 6 in 100",
        source: "RCOG CA12",
        plain: "The bladder and the tube connecting the kidney to the bladder are at higher risk of injury when there is placenta praevia.",
      },
      {
        id: "future_pp",
        name: "Placenta praevia in a future pregnancy",
        freq: "COMMON",
        rate: "23 in 1,000",
        source: "RCOG CA12",
        plain: "There is an increased chance that the placenta will lie low in a future pregnancy.",
      },
      {
        id: "death_pp",
        name: "Death (all caesarean sections)",
        freq: "VERY_RARE",
        rate: "1 in 12,000",
        source: "RCOG CA12",
        plain: "The risk of maternal death from caesarean section is very rare.",
      },
    ],
  },
  {
    id: "frequent_maternal_pp",
    heading: "Frequent risks — Maternal",
    type: "list",
    risks: [
      {
        id: "transfusion_pp",
        name: "Blood transfusion",
        freq: "VERY_COMMON",
        rate: null,
        source: "RCOG CA12",
        plain: "Blood transfusion is frequently required due to the extent of haemorrhage associated with placenta praevia.",
      },
      {
        id: "icu_pp",
        name: "Admission to intensive care unit",
        freq: "COMMON",
        rate: null,
        source: "RCOG CA12",
        plain: "ICU admission may be needed to manage severe haemorrhage and its consequences.",
      },
      {
        id: "infection_pp",
        name: "Wound infection / endometritis",
        freq: "COMMON",
        rate: null,
        source: "RCOG CA12",
        plain: "Infection of the wound or uterus is common after caesarean for placenta praevia, particularly following prolonged surgery or significant blood loss.",
      },
      {
        id: "bowel_injury_pp",
        name: "Bowel injury",
        freq: "RARE",
        rate: null,
        source: "RCOG CA12",
        plain: "Injury to the bowel can occur, particularly if there are adhesions from previous surgery or if the placenta has invaded nearby structures.",
      },
    ],
  },
  {
    id: "frequent_fetal_pp",
    heading: "Frequent risks — Fetal",
    type: "list",
    risks: [
      {
        id: "preterm_pp",
        name: "Preterm delivery",
        freq: "COMMON",
        rate: null,
        source: "RCOG CA12",
        plain: "Delivery is often planned before term to avoid catastrophic bleeding, meaning the baby may be born preterm and require neonatal unit care.",
      },
      {
        id: "nicu_pp",
        name: "Neonatal unit admission",
        freq: "COMMON",
        rate: null,
        source: "RCOG CA12",
        plain: "Admission to a neonatal unit is common, related to preterm birth and respiratory morbidity.",
      },
      {
        id: "stillbirth_future_pp",
        name: "Stillbirth in future pregnancy",
        freq: "UNCOMMON",
        rate: "1–4 in 1,000",
        source: "RCOG CA12",
        plain: "There is a small increased risk of stillbirth in future pregnancies following caesarean birth.",
      },
    ],
  },
];

// ─── OPERATIVE VAGINAL DELIVERY ───────────────────────────────────────────────
// Source: RCOG Consent Advice No. 11 (2010)
// Structure follows: Serious risks (Maternal / Fetal) → Frequent risks (Maternal / Fetal)

export const OVD_CONTEXT_OPTIONS = [
  { id: "ventouse", label: "Ventouse", description: "Vacuum-assisted delivery",   color: "text-blue-600",   dot: "bg-blue-500" },
  { id: "forceps",  label: "Forceps",  description: "Instrument-assisted delivery", color: "text-indigo-600", dot: "bg-indigo-500" },
];

export const OVD_PATIENT_FACTORS = [
  { id: "high_bmi",         label: "High maternal BMI" },
  { id: "large_baby",       label: "Estimated fetal weight > 4,000 g" },
  { id: "op_position",      label: "Occipitoposterior position" },
  { id: "mid_cavity",       label: "Mid-cavity delivery" },
];

// Risk items use `byInstrument` where rates differ; plain `freq`/`rate` where they are the same.
// `instrumentOnly` marks risks that apply to one instrument only.
// Source: RCOG Green-top Guideline No. 26 — Assisted Vaginal Birth (2020), supersedes CA11
export const OVD_RISK_SECTIONS = [
  {
    id: "serious_maternal",
    heading: "Serious risks — Maternal",
    type: "list",
    risks: [
      {
        id: "third_fourth_degree",
        name: "3rd and 4th degree perineal tear (OASI)",
        source: "RCOG GTG26",
        byInstrument: {
          ventouse: { freq: "COMMON",      rate: "1–4 in 100" },
          forceps:  { freq: "VERY_COMMON", rate: "8–12 in 100" },
        },
        plain: "A tear that extends into or through the anal sphincter. Repaired by a specialist surgeon. Can cause short-term bowel and bladder symptoms. Risk is significantly higher with forceps.",
      },
      {
        id: "vaginal_vulval_tear",
        name: "Significant vaginal or vulval tear",
        source: "RCOG GTG26",
        byInstrument: {
          ventouse: { freq: "COMMON",      rate: "1 in 10" },
          forceps:  { freq: "VERY_COMMON", rate: "1 in 5" },
        },
        plain: "A significant tear to the vaginal area requiring repair with stitches.",
      },
      {
        id: "cervical_tear",
        name: "Cervical tear",
        freq: "UNCOMMON",
        rate: null,
        source: "RCOG GTG26",
        plain: "A tear to the cervix can occasionally occur during instrumental delivery and may require suturing.",
      },
      {
        id: "failed_ovd",
        name: "Failed instrumental delivery → emergency caesarean",
        source: "RCOG GTG26",
        byInstrument: {
          ventouse: { freq: "COMMON", rate: "About 8 in 100" },
          forceps:  { freq: "UNCOMMON", rate: "About 3 in 100" },
        },
        plain: "If the instrument fails to achieve delivery, an emergency caesarean section will be needed. Failure is more common with ventouse than forceps.",
      },
    ],
  },
  {
    id: "serious_fetal",
    heading: "Serious risks — Fetal",
    type: "list",
    risks: [
      {
        id: "subgaleal",
        name: "Subgaleal haematoma",
        freq: "UNCOMMON",
        rate: "3–6 in 1,000",
        source: "RCOG GTG26",
        instrumentOnly: "ventouse",
        plain: "Serious bleeding beneath the scalp aponeurosis — predominantly associated with ventouse. Can be life-threatening. The baby will be closely monitored after delivery.",
      },
      {
        id: "intracranial",
        name: "Intracranial haemorrhage",
        freq: "RARE",
        rate: "5–15 in 10,000",
        source: "RCOG GTG26",
        plain: "Bleeding inside the skull. Rare but serious — the baby would need specialist neonatal review.",
      },
      {
        id: "skull_fracture",
        name: "Skull fracture",
        freq: "RARE",
        rate: null,
        source: "RCOG GTG26",
        plain: "Skull fracture is rare but can occur, particularly with mid-cavity or rotational deliveries.",
      },
      {
        id: "cervical_spine",
        name: "Cervical spine / spinal cord injury",
        freq: "VERY_RARE",
        rate: null,
        source: "RCOG GTG26",
        instrumentOnly: "forceps",
        plain: "Very rarely, injury to the baby's neck or spinal cord can occur, particularly associated with rotational forceps (Kielland's).",
      },
      {
        id: "perinatal_death",
        name: "Perinatal death",
        freq: "RARE",
        rate: null,
        source: "RCOG GTG26",
        plain: "Perinatal death is a rare but recognised outcome, particularly associated with mid-cavity, rotational, or failed instrumental delivery.",
      },
      {
        id: "facial_nerve",
        name: "Facial nerve palsy",
        freq: "RARE",
        rate: null,
        source: "RCOG GTG26",
        instrumentOnly: "forceps",
        plain: "Temporary weakness of the muscles on one side of the baby's face, more commonly associated with forceps. Usually resolves within a few weeks.",
      },
      {
        id: "brachial_plexus",
        name: "Brachial plexus injury (Erb's palsy)",
        freq: "RARE",
        rate: null,
        source: "RCOG GTG26",
        plain: "Injury to the nerves controlling arm movement. Primarily associated with shoulder dystocia at delivery rather than the instrument itself. Usually improves over time.",
      },
    ],
  },
  {
    id: "frequent_maternal",
    heading: "Frequent risks — Maternal",
    type: "list",
    risks: [
      {
        id: "episiotomy",
        name: "Episiotomy",
        source: "RCOG GTG26",
        byInstrument: {
          ventouse: { freq: "VERY_COMMON", rate: "50–60 in 100" },
          forceps:  { freq: "VERY_COMMON", rate: "≥90 in 100" },
        },
        plain: "A surgical cut to widen the vaginal opening is very commonly performed during instrumental delivery, particularly with forceps.",
      },
      {
        id: "pph",
        name: "Postpartum haemorrhage",
        freq: "VERY_COMMON",
        rate: "10–40 in 100",
        source: "RCOG GTG26",
        plain: "Heavy bleeding after delivery is significantly more common after instrumental delivery than after normal birth. The team is trained to manage this.",
      },
      {
        id: "vaginal_tear_abrasion",
        name: "Vaginal tear / abrasion",
        freq: "VERY_COMMON",
        rate: null,
        source: "RCOG GTG26",
        plain: "Minor tears and grazes to the vaginal area are very common and are repaired with stitches.",
      },
      {
        id: "urinary_retention",
        name: "Urinary retention",
        freq: "COMMON",
        rate: null,
        source: "RCOG GTG26",
        plain: "Difficulty passing urine is common after instrumental delivery. A catheter is usually in place during and after the procedure.",
      },
      {
        id: "perineal_pain",
        name: "Perineal pain and dyspareunia",
        freq: "COMMON",
        rate: null,
        source: "RCOG GTG26",
        plain: "Perineal pain is common after instrumental delivery, particularly with forceps. Painful intercourse (dyspareunia) can persist for several months, especially after a significant tear.",
      },
      {
        id: "sphincter_dysfunction",
        name: "Anal sphincter or bladder dysfunction",
        freq: "UNCOMMON",
        rate: null,
        source: "RCOG GTG26",
        plain: "Some women experience difficulty with bladder or bowel control following instrumental delivery. Usually improves with time and pelvic floor physiotherapy.",
      },
    ],
  },
  {
    id: "frequent_fetal",
    heading: "Frequent risks — Fetal",
    type: "list",
    risks: [
      {
        id: "forceps_marks",
        name: "Forceps marks on face",
        freq: "VERY_COMMON",
        rate: null,
        source: "RCOG GTG26",
        instrumentOnly: "forceps",
        plain: "Temporary marks or bruising on the baby's face from the forceps blades. These almost always resolve within a few days.",
      },
      {
        id: "chignon",
        name: "Chignon / scalp swelling",
        freq: "VERY_COMMON",
        rate: "Practically all cases",
        source: "RCOG GTG26",
        instrumentOnly: "ventouse",
        plain: "A temporary swelling on the scalp at the site of the suction cup. This resolves on its own within a few days.",
      },
      {
        id: "retinal_haemorrhage",
        name: "Retinal haemorrhage",
        freq: "VERY_COMMON",
        rate: "17–38 in 100",
        source: "RCOG GTG26",
        instrumentOnly: "ventouse",
        plain: "Bleeding into the retina of the eye is common after ventouse delivery. It is usually transient and resolves without treatment, with no long-term effect on vision.",
      },
      {
        id: "cephalhaematoma",
        name: "Cephalhaematoma",
        freq: "COMMON",
        rate: "1–12 in 100",
        source: "RCOG GTG26",
        plain: "A collection of blood under the scalp that appears as a firm swelling. More common after ventouse. Usually resolves without treatment over a few weeks.",
      },
      {
        id: "lacerations",
        name: "Facial or scalp lacerations",
        freq: "COMMON",
        rate: "1 in 10",
        source: "RCOG GTG26",
        plain: "Small cuts to the face or scalp from the instrument. Most heal quickly without treatment.",
      },
      {
        id: "jaundice",
        name: "Neonatal jaundice / hyperbilirubinaemia",
        freq: "COMMON",
        rate: "5–15 in 100",
        source: "RCOG GTG26",
        plain: "Yellowing of the skin and eyes in the newborn, more common after instrumental delivery, related to bruising and cephalhaematoma. Usually treated with phototherapy if needed.",
      },
      {
        id: "retinal_haem",
        name: "Retinal haemorrhage",
        freq: "VERY_COMMON",
        rate: "17–38 in 100",
        plain: "Bleeding behind the eye is very common but almost always resolves on its own without treatment or lasting effect.",
      },
    ],
  },
];

// ─── WHAT / WHY / DECLINE ────────────────────────────────────────────────────

export const CS_PAGES = {
  elective: {
    what: {
      heading: "Elective Caesarean Section",
      body: "A caesarean section is an operation to deliver your baby through a cut made in your abdomen and womb. It is performed in an operating theatre. A planned caesarean is not usually carried out before 39 weeks, because babies born earlier are more likely to have temporary breathing problems.\n\nBefore the operation\n\n• You will be seen beforehand to confirm the plan, have blood tests and go through the consent form.\n• You will be asked not to eat for several hours before surgery, and given medicine to reduce stomach acid.\n• Most planned caesareans are done under a spinal anaesthetic: you are awake but numb from the chest down. You will feel pressure, pulling and tugging, but not pain. A general anaesthetic is occasionally needed and your anaesthetist will discuss this.\n• A thin tube (catheter) is placed into your bladder to keep it empty and protect it during the operation.\n• Antibiotics are given through a drip before the first cut, to reduce the chance of infection.\n• Your birth partner can usually be with you in theatre, and a screen is placed so you do not see the operation.\n\nThe operation\n\n• The skin cut is almost always horizontal, along the bikini line just above the pubic bone.\n• A second cut is made in the lower part of the womb and your baby is delivered through it, usually within the first 10 minutes.\n• You are given an injection of oxytocin to help the womb contract and reduce bleeding, and the placenta is delivered through the same cut.\n• If all is well, you can usually have skin-to-skin contact with your baby in theatre.\n• The womb and the layers of the tummy are closed with dissolvable stitches; the skin is closed with stitches or clips. The whole operation takes around 40–50 minutes.\n\nAfterwards\n\n• You and your baby are observed closely in a recovery area, and feeding is supported as soon as possible.\n• The bladder catheter is removed once you are up and walking, usually within a day.\n• You will be offered regular pain relief, and assessed for blood-thinning injections to reduce the risk of clots.\n• Most women stay in hospital around 4 days; full recovery usually takes about 6 weeks.",
    },
    why: {
      heading: "Why is this being recommended?",
      body: "A planned caesarean is recommended when vaginal birth is considered to carry a higher risk for you or your baby than surgical delivery. The specific reason will have been discussed with your consultant.\n\nCommon reasons include: placenta praevia, previous caesarean sections, breech presentation, or maternal preference following counselling about the risks and benefits of each mode of delivery.",
    },
    alternatives: {
      heading: "Alternatives and your right to decline",
      body: "No caesarean can be performed without your consent, and you have the right to decline one even where it has been recommended. Declining does not affect your right to good care.\n\nThe main alternative is a planned vaginal birth. How the two compare depends on why a caesarean has been offered; the Options tab shows the outcomes side by side for an average pregnancy.\n\nDepending on your situation, other options may include:\n\n• Vaginal birth after caesarean (VBAC): many women with a previous caesarean can plan a vaginal birth. Your consultant can discuss your individual chance of success.\n• Turning a breech baby (ECV): if your baby is breech, an attempt to turn the baby by pressing on your abdomen can be offered from around 36 weeks. If it works, vaginal birth becomes possible.\n• Waiting and monitoring: in some situations it is reasonable to continue the pregnancy with closer monitoring and revisit the decision.\n\nYour doctor will explain which of these genuinely apply in your case and what each would mean for you. Take the time you need and ask any questions before deciding.",
    },
  },
  emergency: {
    what: {
      heading: "Emergency Caesarean Section",
      body: "An emergency caesarean section is an operation to deliver your baby through a cut in your abdomen and womb, performed urgently because of a concern for your safety or your baby's safety.\n\nMost emergency caesareans are performed under a spinal anaesthetic — you are awake but numb from the waist down. In some situations a general anaesthetic (fully asleep) is needed, and your anaesthetist will explain which applies to you.\n\nThe speed of the operation depends on the urgency. The team will move as quickly as is safe.",
    },
    why: {
      heading: "Why is this needed now?",
      body: "An emergency caesarean is recommended when there is a concern that continuing labour carries a significant risk to you or your baby that requires prompt delivery.\n\nYour doctor will explain the specific reason in your case. Common reasons include fetal heart rate concerns, failure to progress in labour, heavy bleeding, or cord prolapse.",
    },
    alternatives: {
      heading: "Alternatives and your right to decline",
      body: "You have the right to decline any procedure, including an emergency caesarean, provided you have the capacity to make that decision.\n\nThe alternatives depend on your situation and how urgent the concern is:\n\n• Continuing labour with close monitoring: possible in some situations, but the team has recommended caesarean because they judge the risk of waiting to be higher in your case.\n• Assisted vaginal birth (forceps or ventouse): sometimes possible instead, if the cervix is fully dilated and the baby is low enough. The team will tell you if this applies.\n\nYour doctor will clearly explain what the risks to you and your baby are if delivery does not happen urgently. If you have questions or concerns, please say so now; the team will take the time to answer them.",
    },
  },
};

// Qualitative benefits: RCOG GTG26 / CA11 give no comparative success figures
// suitable for patient-facing rates, so none are stated.
export const OVD_BENEFITS = [
  {
    id: "ovd_sooner",
    name: "Your baby is born sooner",
    source: "RCOG GTG26",
    plain: "An assisted birth is offered when the baby needs to be born more quickly than pushing alone can achieve, for example because of concerns about the heart rate, slow progress, or exhaustion.",
  },
  {
    id: "ovd_avoid_cs",
    name: "Avoids an emergency caesarean",
    source: "RCOG GTG26",
    plain: "When successful, an assisted vaginal birth avoids a caesarean section late in labour, which is a bigger operation with a longer recovery and implications for future births.",
  },
];

export const OVD_PAGES = {
  ventouse: {
    what: {
      heading: "Ventouse (Vacuum) Delivery",
      body: "A ventouse delivery uses a small suction cup attached to your baby's head to help guide the baby out during contractions. It is used when your baby needs to be delivered quickly or when pushing alone has not been enough.\n\nThe procedure is usually performed in the delivery room. A local anaesthetic or epidural top-up is used so you do not feel pain.\n\nIf the ventouse is not successful after a small number of attempts, a forceps delivery or caesarean section will be performed.",
    },
    why: {
      heading: "Why is this being recommended?",
      body: "A ventouse delivery is recommended when your baby needs to be delivered sooner than pushing alone can achieve — this may be because of concerns about your baby's heart rate, because labour has not been progressing, or because you are too tired to push effectively.\n\nInstrumental delivery, when it is safe to attempt, avoids the risks and longer recovery associated with an emergency caesarean section.",
    },
    alternatives: {
      heading: "Alternatives and your right to decline",
      body: "You have the right to decline an instrumental birth.\n\nThe alternatives depend on your situation:\n\n• Continuing to push: possible when there is no immediate concern for the baby; the team will say whether it is safe to wait.\n• Caesarean birth: possible at any stage, but a caesarean at full dilatation is itself a bigger operation with a longer recovery.\n\nYour doctor will explain the risks of each option in your case so you can make an informed decision. Please ask any questions you have before deciding.",
    },
  },
  forceps: {
    what: {
      heading: "Forceps Delivery",
      body: "Forceps are two smooth curved metal instruments that are placed gently around the sides of your baby's head to help guide the baby out during contractions. They are used when your baby needs to be delivered quickly or when pushing alone has not been enough.\n\nThe procedure is usually performed in the delivery room or theatre. A local anaesthetic, epidural top-up, or spinal anaesthetic is used so you do not feel pain.\n\nIf forceps delivery is not successful, a caesarean section will be performed.",
    },
    why: {
      heading: "Why is this being recommended?",
      body: "Forceps delivery is recommended when your baby needs to be delivered sooner than pushing alone can achieve — this may be because of concerns about your baby's heart rate, because labour has not been progressing, or because you are too tired to push effectively.\n\nForceps may be preferred over ventouse in certain situations, such as when the baby is in a particular position or when a more controlled delivery is needed.",
    },
    alternatives: {
      heading: "Alternatives and your right to decline",
      body: "You have the right to decline an instrumental birth.\n\nThe alternatives depend on your situation:\n\n• Continuing to push: possible when there is no immediate concern for the baby; the team will say whether it is safe to wait.\n• Caesarean birth: possible at any stage, but a caesarean at full dilatation is itself a bigger operation with a longer recovery.\n\nYour doctor will explain the risks of each option in your case so you can make an informed decision. Please ask any questions you have before deciding.",
    },
  },
};

// ─── FAQ ─────────────────────────────────────────────────────────────────────

export const CS_FAQ = [
  {
    q: "Is it safe?",
    a: "Caesarean section is a very common operation and is generally safe. Like all surgery it carries risks, which is why we go through them with you now. The team is experienced and trained to manage complications if they arise.",
  },
  {
    q: "What are my chances of dying?",
    a: "Maternal death from caesarean section is very rare — around 25 per 100,000. That is less than a 1 in 4,000 chance. For context, the risk from vaginal birth is also very low, around 4 per 100,000. (NICE NG192 Appendix A)",
  },
  {
    q: "Will it affect future pregnancies?",
    a: "Yes, in some ways. The scar on your womb slightly increases the risk of the placenta lying low or growing into the scar in a future pregnancy, and the risk of the scar opening during a future labour — though all of these remain uncommon. Future pregnancies will be monitored more closely. (NICE NG192 Appendix A)",
  },
  {
    q: "Can I refuse?",
    a: "Yes. Every patient with capacity has the right to refuse any procedure, even if that decision carries risk. If you are unsure, please say so — we want you to have time to ask questions and feel comfortable before signing.",
  },
  {
    q: "What is the alternative?",
    a: "The alternatives depend on your situation and will have been discussed with your consultant. They may include vaginal birth, instrumental delivery, or continued monitoring — your doctor can explain which apply to you.",
  },
  {
    q: "Will I be awake?",
    a: "Most caesareans are performed under a spinal anaesthetic, which means you are awake but numb from the waist down. You will feel pressure but not pain. A general anaesthetic (fully asleep) is sometimes needed and your anaesthetist will explain which is planned for you.",
  },
  {
    q: "How long is the recovery?",
    a: "Most women stay in hospital around 4 days. Full recovery usually takes about 6 weeks. You should avoid driving and heavy lifting during this time. (NICE NG192 Appendix A)",
  },
];

export const OVD_FAQ = [
  {
    q: "Why can't I just have a caesarean?",
    a: "An instrumental delivery, when it is safe to attempt, avoids the risks and longer recovery of abdominal surgery. If the attempt is not successful, a caesarean will be performed.",
  },
  {
    q: "Will it hurt my baby?",
    a: "Most babies do very well after instrumental delivery. Some marks or swelling on the head are common and almost always resolve within days. Serious injury to the baby is uncommon. (RCOG Consent Advice No. 11)",
  },
  {
    q: "What is the difference between forceps and ventouse?",
    a: "A ventouse is a small cup attached to the baby's head by suction. Forceps are two curved metal instruments placed around the sides of the baby's head. Your doctor will recommend whichever is most appropriate for your situation.",
  },
  {
    q: "What if it doesn't work?",
    a: "If the instrument delivery is not successful, a caesarean section will be performed. This is planned for in advance — the theatre team is ready. (RCOG Consent Advice No. 11)",
  },
  {
    q: "Can I refuse?",
    a: "Yes. You have the right to refuse any procedure. Your doctor will explain the risks of not proceeding so you can make an informed decision.",
  },
  {
    q: "Will I need stitches?",
    a: "Most women need some stitches — either from an episiotomy (a cut to help delivery) or a natural tear. These are repaired straight after delivery under local anaesthetic. (RCOG Consent Advice No. 11)",
  },
];

// ─── SURGICAL MANAGEMENT OF MISCARRIAGE ──────────────────────────────────────
// Source: RCOG Consent Advice No. 10 (2018)

export const SURG_MISC_PATIENT_FACTORS = [
  { id: "prev_cs_surg",    label: "Previous caesarean section" },
  { id: "repeat_erpc",     label: "Repeat surgical evacuation" },
  { id: "prev_uterine_sx", label: "Other previous uterine surgery" },
];

export const SURG_MISC_RISK_SECTIONS = [
  {
    id: "surg_misc_maternal",
    heading: "Risks",
    type: "list",
    risks: [
      {
        id: "surg_misc_bleeding",
        name: "Bleeding for up to 2 weeks",
        freq: "VERY_COMMON",
        rate: null,
        source: "RCOG CA10",
        plain: "Some vaginal bleeding lasting up to 2 weeks is expected after the procedure. This is normal. Contact your unit if bleeding is heavier than a normal period.",
      },
      {
        id: "surg_misc_infection",
        name: "Pelvic infection",
        freq: "COMMON",
        rate: "Up to 40 in 1,000",
        source: "RCOG CA10",
        plain: "Infection of the pelvis or uterus can occur. It is usually treated successfully with antibiotics. Signs include fever, pelvic pain, or offensive discharge.",
      },
      {
        id: "surg_misc_adhesions",
        name: "Intrauterine adhesions (Asherman syndrome)",
        freq: "COMMON",
        rate: "Up to 190 in 1,000",
        source: "RCOG CA10",
        plain: "Scar tissue can form inside the uterus after the procedure. This can occasionally affect future periods or fertility. The risk is higher with repeat procedures and with sharp curettage (which is no longer used routinely).",
      },
      {
        id: "surg_misc_repeat",
        name: "Need for repeat surgical procedure",
        freq: "UNCOMMON",
        rate: "3 in 1,000",
        source: "RCOG CA10",
        plain: "Occasionally, not all tissue is removed at the first procedure and a further operation is needed.",
      },
      {
        id: "surg_misc_transfusion",
        name: "Blood transfusion",
        freq: "UNCOMMON",
        rate: "0–3 in 1,000",
        source: "RCOG CA10",
        plain: "Significant bleeding requiring a blood transfusion is uncommon. Risk is higher with abnormal placentation or if haemodynamically unstable at the time of surgery.",
      },
      {
        id: "surg_misc_perforation",
        name: "Uterine perforation",
        freq: "UNCOMMON",
        rate: "Up to 1 in 1,000",
        source: "RCOG CA10",
        plain: "The instrument can occasionally make a small hole in the wall of the uterus. Most perforations are small, heal without treatment, and are managed conservatively. Larger perforations may need a laparoscopy to check for internal damage.",
      },
      {
        id: "surg_misc_cervical",
        name: "Significant cervical laceration",
        freq: "RARE",
        rate: "Less than 0.1 in 1,000",
        source: "RCOG CA10",
        plain: "A tear to the cervix requiring stitches is rare. The risk is reduced by using cervical preparation (misoprostol) before the procedure.",
      },
      {
        id: "surg_misc_organ",
        name: "Damage to bowel, bladder or other organs",
        freq: "RARE",
        rate: null,
        source: "RCOG CA10",
        plain: "If a perforation occurs, nearby structures can rarely be damaged. This would usually be identified and repaired at the time, often requiring a laparoscopy or open surgery.",
      },
      {
        id: "surg_misc_hysterectomy",
        name: "Hysterectomy",
        freq: "VERY_RARE",
        rate: null,
        source: "RCOG CA10",
        plain: "Very rarely, uncontrolled bleeding may require removal of the uterus as a life-saving measure.",
      },
      {
        id: "surg_misc_anaes",
        name: "Serious anaesthetic complications",
        freq: "VERY_RARE",
        rate: null,
        source: "RCOG CA10",
        plain: "Serious complications from the anaesthetic are very rare. Your anaesthetist will discuss the specific anaesthetic risks with you separately.",
      },
      {
        id: "surg_misc_preterm",
        name: "Increased risk of preterm birth in future pregnancies",
        freq: "UNCOMMON",
        rate: null,
        conditions: ["repeat_erpc"],
        source: "RCOG CA10",
        plain: "Repeated surgical uterine procedures are associated with a small increased risk of preterm birth in future pregnancies.",
      },
    ],
  },
];

// Benefits: success figures as already quoted in this file (RCOG GTG25/CA10).
export const SURG_MISC_BENEFITS = [
  {
    id: "surg_misc_success",
    name: "Highest chance of completing treatment in one step",
    rate: "95–99 in 100",
    detail: "success rate",
    source: "RCOG GTG25",
    plain: "Surgical management succeeds in around 95–99 in 100 cases, compared with about 85 in 100 for medical management and 50–80 in 100 for expectant management within 2 weeks.",
  },
  {
    id: "surg_misc_quick",
    name: "Quick and at a planned time",
    source: "RCOG CA10",
    plain: "The procedure typically takes 5–15 minutes and most women go home the same day. It happens at a planned time rather than waiting for the miscarriage to complete on its own.",
  },
  {
    id: "surg_misc_anaes_choice",
    name: "Choice of anaesthetic",
    source: "RCOG CA10",
    plain: "It can be done under general anaesthetic, or awake under local anaesthetic (manual vacuum aspiration), which is safe and effective for most women with early miscarriage.",
  },
];

export const SURG_MISC_PAGES = {
  what: {
    heading: "Surgical Management of Miscarriage",
    body: "Surgical management of miscarriage is a short procedure to remove the pregnancy tissue from the uterus using gentle suction (vacuum aspiration), either electric (EVA) or manual (MVA).\n\nBefore the procedure\n\n• You may be given a tablet (misoprostol) beforehand to soften the cervix, which reduces the chance of injury to the cervix.\n• It can be done under general anaesthetic (fully asleep), or awake under local anaesthetic, which is usual for MVA.\n\nThe procedure\n\n• The cervix is gently opened and a small suction tube is passed into the uterus to remove the tissue.\n• Sharp scraping (curettage) is no longer used routinely.\n• It typically takes 5–15 minutes.\n\nAfterwards\n\n• Most women go home the same day.\n• Some vaginal bleeding for up to 2 weeks is normal and expected.",
  },
  why: {
    heading: "Why is this being recommended?",
    body: "Surgical management may be recommended when:\n\n• There is heavy or persistent bleeding from retained pregnancy tissue\n• The pregnancy has not passed on its own (missed miscarriage)\n• Expectant or medical management has not been successful\n• There are signs of infection with retained tissue\n• You are haemodynamically unstable\n• It is your preference after being counselled about all three options (expectant, medical, and surgical)",
  },
  alternatives: {
    heading: "Alternatives and your right to decline",
    body: "You have the right to decline surgical management. The three options for miscarriage care are usually all reasonable, and the choice is yours:\n\n• Expectant management: waiting for the tissue to pass naturally; successful in around 50–80 in 100 women within 2 weeks\n• Medical management: misoprostol tablets to help the uterus empty; successful in around 85 in 100 women\n\nIf you decline all treatment, retained tissue carries an ongoing risk of bleeding and infection, and rarely clotting problems. Your team will explain what to watch for and how to access help, and you can change your mind at any time.",
  },
};

export const SURG_MISC_FAQ = [
  {
    q: "Do I need a general anaesthetic?",
    a: "Not necessarily. The procedure can be done under general anaesthetic (fully asleep) or under local anaesthetic while you are awake. Manual vacuum aspiration (MVA) under local anaesthetic is safe and effective for most women with early miscarriage.",
  },
  {
    q: "Will it affect my ability to have a baby in the future?",
    a: "The procedure is generally safe for future fertility. However, there is a risk of intrauterine scarring (Asherman syndrome) in up to 190 in 1,000 women, which can occasionally affect future periods or fertility. This risk is higher with repeat procedures. (RCOG CA10)",
  },
  {
    q: "How long will I bleed afterwards?",
    a: "Bleeding for up to 2 weeks is normal. Contact your unit if you are soaking more than one pad per hour for 2 hours, develop a fever, or have severe pain — these may be signs of infection or retained tissue.",
  },
  {
    q: "What are the chances of needing a second procedure?",
    a: "Around 3 in 1,000 women need a repeat surgical procedure because not all tissue was removed at the first attempt. (RCOG CA10)",
  },
  {
    q: "What is the alternative?",
    a: "The alternatives are expectant management (waiting) and medical management (misoprostol tablets). Expectant management is successful in around 50–80% of women; medical management in around 85 in 100 women. If these fail, surgery may still be needed.",
  },
];

// ─── MEDICAL MANAGEMENT OF MISCARRIAGE ───────────────────────────────────────
// Source: RCOG Green-top Guideline No. 25 (Management of Early Pregnancy Loss)

export const MED_MISC_PATIENT_FACTORS = [
  { id: "prev_cs_med",     label: "Previous caesarean section or uterine scar" },
  { id: "gestation_gt12",  label: "Gestation ≥12 weeks" },
];

export const MED_MISC_RISK_SECTIONS = [
  {
    id: "med_misc_maternal",
    heading: "Risks and side effects",
    type: "list",
    risks: [
      {
        id: "med_misc_pain",
        name: "Uterine cramping / pain",
        freq: "VERY_COMMON",
        rate: null,
        source: "RCOG GTG25",
        plain: "Cramping more severe than a normal period is expected and occurs in virtually all women. Regular analgesia (ibuprofen and paracetamol) should be taken before the bleeding starts. Stronger pain relief may be prescribed.",
      },
      {
        id: "med_misc_bleeding",
        name: "Vaginal bleeding",
        freq: "VERY_COMMON",
        rate: null,
        source: "RCOG GTG25",
        plain: "Heavier bleeding than a normal period, with clots, is expected and indicates the treatment is working. Bleeding typically lasts up to 2 weeks.",
      },
      {
        id: "med_misc_nausea",
        name: "Nausea",
        freq: "COMMON",
        rate: null,
        source: "RCOG GTG25",
        plain: "Nausea is common with misoprostol. Anti-sickness medication will be prescribed.",
      },
      {
        id: "med_misc_vomiting",
        name: "Vomiting",
        freq: "COMMON",
        rate: null,
        source: "RCOG GTG25",
        plain: "Vomiting can occur after misoprostol, particularly with the oral or sublingual route. Anti-sickness medication will be prescribed.",
      },
      {
        id: "med_misc_diarrhoea",
        name: "Diarrhoea",
        freq: "COMMON",
        rate: null,
        source: "RCOG GTG25",
        plain: "Diarrhoea is common, especially with the oral route. It is usually short-lived.",
      },
      {
        id: "med_misc_fever",
        name: "Fever and chills",
        freq: "COMMON",
        rate: null,
        source: "RCOG GTG25",
        plain: "A low-grade temperature and shivering are caused by misoprostol itself and are usually short-lived. A persistent high temperature may indicate infection and should be assessed.",
      },
      {
        id: "med_misc_failure",
        name: "Treatment failure — need for further treatment",
        freq: "COMMON",
        rate: "15 in 100",
        source: "RCOG GTG25",
        plain: "Around 15 in 100 women will not pass the pregnancy completely with one dose of misoprostol and will need a second dose or a surgical procedure. A follow-up ultrasound is performed 1–2 weeks after treatment.",
      },
      {
        id: "med_misc_infection",
        name: "Pelvic infection",
        freq: "COMMON",
        rate: "Up to 40 in 1,000",
        source: "RCOG GTG25",
        plain: "Infection of the pelvis or uterus can occur. Signs include fever, pelvic pain, or offensive discharge. Usually treated successfully with antibiotics.",
      },
      {
        id: "med_misc_transfusion",
        name: "Blood transfusion",
        freq: "UNCOMMON",
        rate: "0–3 in 1,000",
        source: "RCOG GTG25",
        plain: "Heavy bleeding requiring a blood transfusion is uncommon. Seek emergency help if you are soaking more than one pad per hour for 2 hours.",
      },
      {
        id: "med_misc_rupture",
        name: "Uterine rupture",
        freq: "RARE",
        rate: null,
        conditions: ["prev_cs_med", "gestation_gt12"],
        source: "RCOG GTG25",
        plain: "In women with a previous uterine scar or at later gestations, there is a rare risk of the uterus rupturing. This risk is very low in the first trimester but increases at later gestations.",
      },
    ],
  },
];

export const MED_MISC_BENEFITS = [
  {
    id: "med_misc_no_surgery",
    name: "Avoids an operation and anaesthetic",
    source: "RCOG GTG25",
    plain: "Medical management uses tablets rather than a surgical procedure, so it avoids the risks of surgery and of a general anaesthetic.",
  },
  {
    id: "med_misc_home",
    name: "Can often be managed at home",
    source: "RCOG GTG25",
    plain: "In many units the misoprostol can be self-administered at home, with written instructions, emergency contact numbers and clear guidance on when to come to hospital.",
  },
  {
    id: "med_misc_success",
    name: "Successful for most women",
    rate: "85 in 100",
    detail: "success rate",
    source: "RCOG GTG25",
    plain: "Around 85 in 100 women pass the pregnancy completely with medical management. Around 15 in 100 need a further dose or a surgical procedure.",
  },
];

export const MED_MISC_PAGES = {
  what: {
    heading: "Medical Management of Miscarriage",
    body: "Medical management of miscarriage uses a tablet called misoprostol to help your uterus contract and expel the pregnancy tissue. The standard dose is 800 micrograms given vaginally (inserted in the vagina) — this can be self-administered at home in many units.\n\nBleeding and cramping usually begin within a few hours and the process typically takes 24–48 hours. A follow-up ultrasound scan is arranged 1–2 weeks later to confirm the uterus is empty.",
  },
  why: {
    heading: "Why is this being recommended?",
    body: "Medical management may be recommended when:\n\n• You have a missed miscarriage (the pregnancy has stopped developing but has not passed)\n• You have an incomplete miscarriage and prefer medication to surgery\n• Expectant management has not been successful\n• You wish to avoid a surgical procedure and general anaesthetic\n\nMisoprostol is successful in approximately 85 in 100 women. If treatment is not complete, a further dose of medication or a surgical procedure may be needed.",
  },
  alternatives: {
    heading: "Alternatives and your right to decline",
    body: "You have the right to decline medical management. The other options are:\n\n• Expectant management: waiting for the tissue to pass naturally; successful in around 50–80 in 100 women within 2 weeks\n• Surgical management: vacuum aspiration under local or general anaesthetic; successful in around 95–99 in 100 cases\n\nIf you decline all treatment, retained tissue carries an ongoing risk of bleeding and infection, and rarely clotting problems. Your team will advise on what to watch for, and you can change your mind at any time.",
  },
};

export const MED_MISC_FAQ = [
  {
    q: "How will I know it has worked?",
    a: "Misoprostol is successful in approximately 85 in 100 women. A follow-up ultrasound scan will be arranged 1–2 weeks after treatment to confirm the uterus is empty. Around 15 in 100 women need further treatment. (RCOG GTG25)",
  },
  {
    q: "Can I be at home when I take it?",
    a: "Yes, in many units misoprostol can be self-administered at home. You will be given detailed written instructions, emergency contact numbers, and clear guidance on when to go to hospital.",
  },
  {
    q: "How painful will it be?",
    a: "Most women experience cramping more severe than a normal period. Take your prescribed pain relief (ibuprofen and paracetamol) regularly, starting before the bleeding begins. Stronger pain relief is available if needed.",
  },
  {
    q: "What side effects should I expect?",
    a: "Nausea, vomiting, diarrhoea, chills, and a low-grade temperature are common and caused by the medication. They are usually short-lived. Anti-sickness medication will be prescribed.",
  },
  {
    q: "What signs should prompt me to go to hospital?",
    a: "Seek urgent medical help if you: soak more than one pad per hour for 2 hours; develop a fever above 38°C; have severe pain not controlled by your pain relief; or have foul-smelling discharge.",
  },
];

// ─── DIAGNOSTIC LAPAROSCOPY ───────────────────────────────────────────────────
// Source: RCOG Consent Advice No. 2 (2017) · GIRFT/RCOG Best Practice Guide (2026)

export const LAPAROSCOPY_PATIENT_FACTORS = [
  { id: "prev_abdo_sx",  label: "Previous abdominal or pelvic surgery" },
  { id: "high_bmi_lap",  label: "High BMI" },
  { id: "prev_lap",      label: "Previous laparoscopy" },
];

export const LAPAROSCOPY_RISK_SECTIONS = [
  {
    id: "lap_frequent",
    heading: "Frequent risks",
    type: "list",
    risks: [
      {
        id: "lap_shoulder",
        name: "Shoulder tip pain",
        freq: "VERY_COMMON",
        rate: null,
        source: "RCOG CA2",
        plain: "Pain at the tip of the shoulder after the procedure is very common and is caused by residual carbon dioxide gas used to inflate the abdomen irritating the diaphragm. It resolves on its own, usually within 24–48 hours.",
      },
      {
        id: "lap_bruising",
        name: "Bruising at port sites",
        freq: "COMMON",
        rate: null,
        source: "RCOG CA2",
        plain: "Bruising around the small incision sites is common and settles without treatment.",
      },
      {
        id: "lap_wound_infection",
        name: "Wound infection",
        freq: "COMMON",
        rate: null,
        source: "RCOG CA2",
        plain: "Infection at the port site incisions can occur. Usually minor and treated with a short course of antibiotics.",
      },
      {
        id: "lap_wound_gaping",
        name: "Wound gaping",
        freq: "COMMON",
        rate: null,
        source: "RCOG CA2",
        plain: "Small port site wounds can occasionally open or fail to heal cleanly. Usually managed with wound care.",
      },
    ],
  },
  {
    id: "lap_serious",
    heading: "Serious risks",
    type: "list",
    risks: [
      {
        id: "lap_serious_overall",
        name: "Serious complications (overall)",
        freq: "UNCOMMON",
        rate: "2 in 1,000",
        source: "RCOG CA2",
        plain: "Serious complications requiring further treatment occur in approximately 2 in every 1,000 women. These include the specific risks listed below.",
      },
      {
        id: "lap_organ_damage",
        name: "Damage to bowel, bladder, ureter or blood vessels",
        freq: "UNCOMMON",
        rate: null,
        source: "RCOG CA2",
        plain: "Injury to internal organs or major blood vessels can occur when the instruments are inserted or used. If this happens it is repaired immediately, usually by laparoscopy or open surgery. Importantly, up to 15% of bowel injuries may not be recognised at the time and may present later.",
      },
      {
        id: "lap_hernia",
        name: "Port-site hernia",
        freq: "UNCOMMON",
        rate: "Less than 1 in 100",
        source: "RCOG CA2",
        plain: "A hernia can develop at one of the port site incisions, requiring surgical repair.",
      },
      {
        id: "lap_failed_entry",
        name: "Failure to complete the procedure",
        freq: "UNCOMMON",
        rate: null,
        source: "RCOG CA2",
        plain: "Occasionally it is not possible to gain entry to the abdominal cavity or complete the intended procedure safely. This may be due to adhesions from previous surgery.",
      },
      {
        id: "lap_vte",
        name: "Thromboembolic disease (DVT / PE)",
        freq: "RARE",
        rate: null,
        source: "RCOG CA2",
        plain: "Blood clots in the legs or lungs are rare but possible after any surgical procedure. Preventative measures are used routinely.",
      },
      {
        id: "lap_death",
        name: "Death",
        freq: "VERY_RARE",
        rate: "3–8 in 100,000",
        source: "RCOG CA2",
        plain: "Death as a direct result of laparoscopy is very rare. It is most commonly associated with unrecognised injury to a major blood vessel or bowel.",
      },
    ],
  },
];

export const LAPAROSCOPY_BENEFITS = [
  {
    id: "lap_definitive",
    name: "A definitive look at the pelvis",
    source: "RCOG CA2",
    plain: "Laparoscopy allows direct visualisation of the pelvic and abdominal organs and is more accurate than imaging alone for conditions such as endometriosis and adhesions.",
  },
  {
    id: "lap_recovery",
    name: "Small cuts and a quick recovery",
    source: "RCOG CA2",
    plain: "Incisions are usually 5–10 mm. Most women return to light activities within 1–2 days and normal activities within 1–2 weeks.",
  },
  {
    id: "lap_treat_same_time",
    name: "Treatment may be possible at the same time",
    source: "RCOG CA2",
    plain: "If a treatable condition is found, the surgeon may be able to deal with it during the same operation if you have consented to this in advance.",
  },
];

export const LAPAROSCOPY_PAGES = {
  what: {
    heading: "Diagnostic Laparoscopy",
    body: "Diagnostic laparoscopy is a minimally invasive surgical procedure performed under general anaesthetic. A thin telescope (laparoscope) is inserted through a small incision, usually at the umbilicus, to directly inspect the pelvic and abdominal organs.\n\nCarbon dioxide gas is used to inflate the abdomen and create a working space. Additional small incisions (ports) may be made to allow instruments to be passed to move structures during the examination.\n\nThe procedure usually takes 15–30 minutes. Most women go home the same day.",
  },
  why: {
    heading: "Why is this being recommended?",
    body: "A diagnostic laparoscopy may be recommended to investigate:\n\n• Pelvic pain (acute or chronic)\n• Suspected endometriosis\n• Suspected pelvic inflammatory disease\n• Infertility — including tubal patency testing (dye test)\n• Adnexal (ovarian) masses\n• Suspected ectopic pregnancy\n\nLaparoscopy allows direct visualisation of the pelvis and is more accurate than imaging alone for conditions such as endometriosis and adhesions.",
  },
  alternatives: {
    heading: "Alternatives and your right to decline",
    body: "You have the right to decline this procedure. Alternatives that may provide some information include:\n\n• Transvaginal ultrasound\n• MRI of the pelvis\n• Empirical medical treatment (for example, for suspected endometriosis)\n• HSG (an X-ray dye test) for tubal assessment\n\nThese cannot fully replace the direct view that laparoscopy provides: some conditions, particularly peritoneal endometriosis and pelvic adhesions, can only be reliably diagnosed laparoscopically. Your doctor can discuss how useful each alternative would be in your case.",
  },
};

export const LAPAROSCOPY_FAQ = [
  {
    q: "Will I be awake?",
    a: "No. Diagnostic laparoscopy is always performed under general anaesthetic. You will be completely asleep throughout.",
  },
  {
    q: "How long will recovery take?",
    a: "Most women feel well enough to return to light activities within 1–2 days and to normal activities within 1–2 weeks. You may have abdominal discomfort and shoulder tip pain for 24–48 hours after the procedure.",
  },
  {
    q: "Will there be visible scars?",
    a: "The incisions are small — usually 5–10 mm. They are typically at the umbilicus and occasionally in the lower abdomen. Scars are usually minimal and fade over time.",
  },
  {
    q: "What if something is found and needs treating?",
    a: "If a treatable condition is found (such as an endometriotic cyst), the surgeon may be able to treat it during the same operation if you have consented to this in advance. Unexpected findings will be discussed with you afterwards and a treatment plan made.",
  },
  {
    q: "What is the risk of serious injury?",
    a: "Serious complications occur in approximately 2 in every 1,000 women. These include rare damage to the bowel, bladder, or blood vessels. Death as a direct result is very rare — approximately 3–8 in every 100,000 women. (RCOG CA2)",
  },
];

// ─── HYSTEROSCOPY ─────────────────────────────────────────────────────────────
// Source: RCOG Consent Advice No. 1 (2009/2011) · RCOG GTG59 · BSGE/ESGE (2016)
// GIRFT/RCOG Best Practice Guide (2026)

export const HYSTEROSCOPY_CONTEXT_OPTIONS = [
  { id: "diagnostic", label: "Diagnostic",  description: "Visual inspection only",       color: "text-violet-600", dot: "bg-violet-500" },
  { id: "operative",  label: "Operative",   description: "With treatment (e.g. polyp removal)", color: "text-purple-600", dot: "bg-purple-500" },
];

export const HYSTEROSCOPY_PATIENT_FACTORS = [
  { id: "nulliparous",   label: "Nulliparous (never given birth)" },
  { id: "postmenopausal", label: "Postmenopausal" },
  { id: "prev_cx_sx",    label: "Previous cervical surgery or stenosis" },
];

export const HYSTEROSCOPY_RISK_SECTIONS = [
  {
    id: "hyst_frequent",
    heading: "Frequent risks",
    type: "list",
    risks: [
      {
        id: "hyst_cramping",
        name: "Uterine cramping / pelvic pain",
        freq: "VERY_COMMON",
        rate: null,
        source: "RCOG CA1",
        plain: "Cramping similar to period pain is very common during and after the procedure. It is usually brief and managed with over-the-counter analgesia.",
      },
      {
        id: "hyst_spotting",
        name: "Vaginal spotting or light bleeding",
        freq: "COMMON",
        rate: null,
        source: "RCOG CA1",
        plain: "Light vaginal bleeding or spotting after the procedure is common and usually settles within a few days.",
      },
      {
        id: "hyst_vasovagal",
        name: "Vasovagal response (outpatient)",
        freq: "COMMON",
        rate: "Up to 1–2 in 100",
        source: "RCOG CA1",
        plain: "Feeling faint, dizzy, or nauseous during or after the procedure is common, particularly in outpatient settings. It usually resolves quickly with rest.",
      },
    ],
  },
  {
    id: "hyst_serious",
    heading: "Serious risks",
    type: "list",
    risks: [
      {
        id: "hyst_serious_overall",
        name: "Serious complications (overall)",
        freq: "UNCOMMON",
        rate: "2 in 1,000",
        source: "RCOG CA1",
        plain: "Serious complications requiring further treatment occur in approximately 2 in every 1,000 diagnostic hysteroscopies.",
      },
      {
        id: "hyst_perforation",
        name: "Uterine perforation",
        freq: "UNCOMMON",
        rate: "Less than 1 in 200",
        source: "RCOG CA1",
        plain: "A small hole can occasionally be made in the wall of the uterus. Most small perforations heal without treatment. If a larger perforation occurs, a laparoscopy or open surgery may be needed to check for and repair any internal damage. Risk is higher with operative procedures.",
      },
      {
        id: "hyst_infection",
        name: "Pelvic infection",
        freq: "COMMON",
        rate: "Less than 3 in 100",
        source: "RCOG CA1",
        plain: "Infection of the uterus or pelvis can occur. Usually treated successfully with antibiotics.",
      },
      {
        id: "hyst_cervical",
        name: "Cervical trauma / false passage",
        freq: "UNCOMMON",
        rate: null,
        source: "RCOG CA1",
        plain: "Difficulty or injury during passage of the telescope through the cervix can occur, particularly in nulliparous or postmenopausal women with a narrow cervix.",
      },
      {
        id: "hyst_haematometra",
        name: "Haematometra",
        freq: "RARE",
        rate: null,
        source: "RCOG CA1",
        plain: "Rarely, blood can accumulate inside the uterine cavity. This may require drainage.",
      },
      {
        id: "hyst_fluid_overload",
        name: "Clinically significant fluid overload",
        freq: "RARE",
        rate: "0.1–0.2 in 100",
        source: "BSGE/ESGE",
        instrumentOnly: "operative",
        plain: "During operative hysteroscopy, fluid used to distend the uterine cavity can be absorbed into the bloodstream. Significant absorption occurs in approximately 1 in 100 operative procedures and can, in rare cases, cause serious changes in blood sodium levels. Fluid balance is carefully monitored throughout.",
      },
      {
        id: "hyst_haemorrhage",
        name: "Excessive bleeding / haemorrhage",
        freq: "UNCOMMON",
        rate: "3 in 100",
        source: "RCOG GTG59",
        instrumentOnly: "operative",
        plain: "Significant bleeding can occur during operative hysteroscopy, particularly with fibroid resection. It may require further treatment.",
      },
      {
        id: "hyst_incomplete",
        name: "Incomplete treatment — repeat procedure needed",
        freq: "COMMON",
        rate: "Up to 15–20 in 100",
        source: "RCOG GTG59",
        instrumentOnly: "operative",
        plain: "For large fibroids in particular, full resection may not be possible in one procedure and a further operation may be required.",
      },
      {
        id: "hyst_hysterectomy",
        name: "Emergency hysterectomy",
        freq: "UNCOMMON",
        rate: "2 in 100",
        source: "RCOG GTG59",
        instrumentOnly: "operative",
        plain: "Very rarely, uncontrolled bleeding or perforation requires emergency removal of the uterus.",
      },
      {
        id: "hyst_air_embolism",
        name: "Air embolism",
        freq: "VERY_RARE",
        rate: null,
        source: "RCOG GTG59",
        plain: "Air entering the bloodstream is a very rare but serious complication. Fatalities have been reported.",
      },
      {
        id: "hyst_electrosurgical",
        name: "Electrosurgical injury",
        freq: "VERY_RARE",
        rate: null,
        source: "RCOG GTG59",
        instrumentOnly: "operative",
        plain: "Burns or injuries from the electrical instruments used during operative procedures are very rare.",
      },
      {
        id: "hyst_death",
        name: "Death",
        freq: "RARE",
        rate: "Approximately 0.1 in 100",
        source: "RCOG GTG59",
        instrumentOnly: "operative",
        plain: "Death related to operative hysteroscopy is rare and most commonly associated with sepsis or severe fluid overload.",
      },
    ],
  },
];

export const HYSTEROSCOPY_BENEFITS = {
  diagnostic: [
    {
      id: "hyst_direct_view",
      name: "Direct view of the inside of the womb",
      source: "RCOG CA1",
      plain: "Hysteroscopy allows direct visual inspection of the uterine cavity and is more accurate than ultrasound alone for identifying polyps, fibroids and adhesions.",
    },
    {
      id: "hyst_quick",
      name: "Quick, with same-day discharge",
      source: "RCOG CA1",
      plain: "The procedure itself usually takes 5–10 minutes, as an outpatient without anaesthetic or as a day case under general anaesthetic, and you usually go home the same day.",
    },
    {
      id: "hyst_see_and_treat",
      name: "Small problems can sometimes be treated at the same visit",
      source: "RCOG CA1",
      plain: "If a small polyp is found, it may be possible to remove it during the same procedure if you have consented to this in advance.",
    },
  ],
  operative: [
    {
      id: "hyst_op_no_cuts",
      name: "Treats the problem without any cuts",
      source: "RCOG CA1 · GTG59",
      plain: "Operative hysteroscopy treats polyps, fibroids and adhesions through the cervix, avoiding the need for open or keyhole abdominal surgery.",
    },
    {
      id: "hyst_op_daycase",
      name: "Day-case surgery",
      source: "RCOG CA1",
      plain: "The procedure typically takes 20–45 minutes depending on what is being treated, and most women go home the same day.",
    },
  ],
};

export const HYSTEROSCOPY_PAGES = {
  diagnostic: {
    what: {
      heading: "Diagnostic Hysteroscopy",
      body: "Hysteroscopy is a procedure in which a thin telescope (hysteroscope) is passed through the cervix into the uterine cavity to allow direct visual inspection of the lining of the womb (endometrium).\n\nIt can be performed under general anaesthetic as a day-case procedure, or as an outpatient procedure without anaesthetic. A fluid medium is used to distend the cavity and provide a clear view.\n\nThe procedure itself usually takes 5–10 minutes. You can usually go home the same day.",
    },
    why: {
      heading: "Why is this being recommended?",
      body: "A diagnostic hysteroscopy may be recommended to investigate:\n\n• Abnormal uterine bleeding (heavy, irregular, or postmenopausal)\n• Suspected intrauterine pathology (polyps, fibroids, adhesions)\n• Recurrent miscarriage or infertility\n• Abnormal endometrial thickness seen on ultrasound\n• Assessment before IVF\n\nHysteroscopy allows direct visualisation of the uterine cavity and is more accurate than ultrasound alone for identifying intrauterine conditions.",
    },
    alternatives: {
      heading: "Alternatives and your right to decline",
      body: "You have the right to decline this procedure.\n\nAlternatives include:\n\n• Transvaginal ultrasound: a useful first-line test, but it may miss small or flat intrauterine lesions\n• Saline infusion sonography (SIS): can identify polyps and fibroids\n• Endometrial biopsy (Pipelle): samples the lining, but has a miss rate of up to 30% for focal lesions\n\nIf you decline, intrauterine pathology may go undiagnosed and treatment cannot be tailored to a confirmed diagnosis. Your doctor can discuss how useful each alternative would be in your case.",
    },
  },
  operative: {
    what: {
      heading: "Operative Hysteroscopy",
      body: "Operative hysteroscopy is a procedure in which a thin telescope (hysteroscope) is passed through the cervix into the uterine cavity to visualise and treat intrauterine conditions.\n\nInstruments are passed alongside or through the hysteroscope to remove polyps, fibroids, or adhesions, or to perform other treatments. It is usually performed under general anaesthetic as a day-case.\n\nThe procedure typically takes 20–45 minutes depending on what is being treated.",
    },
    why: {
      heading: "Why is this being recommended?",
      body: "Operative hysteroscopy may be recommended to treat:\n\n• Endometrial polyps\n• Submucous fibroids causing symptoms or affecting fertility\n• Intrauterine adhesions (Asherman syndrome)\n• Removal of a lost or displaced intrauterine device\n\nOperative hysteroscopy is a minimally invasive approach to treating intrauterine conditions that avoids the need for open surgery.",
    },
    alternatives: {
      heading: "Alternatives and your right to decline",
      body: "You have the right to decline this procedure.\n\nAlternatives depend on your condition:\n\n• Medical management (for example, hormonal treatment for heavy bleeding)\n• Endometrial ablation (for bleeding, if fertility is not required)\n• Observation: small polyps may resolve spontaneously\n• Open or laparoscopic surgery for larger fibroids not accessible hysteroscopically\n\nUntreated intrauterine pathology may continue to cause symptoms and, in some cases, may affect fertility. Your doctor can discuss which of these genuinely apply to you.",
    },
  },
};

export const HYSTEROSCOPY_FAQ = [
  {
    q: "Will it be painful?",
    a: "Under general anaesthetic there is no pain during the procedure. As an outpatient without anaesthetic, most women experience period-like cramping during and briefly after the procedure. Pain is usually short-lived and manageable. You always have the option to stop.",
  },
  {
    q: "Can I go home the same day?",
    a: "Yes, in most cases — both under general anaesthetic (day-case) and as an outpatient. Arrange for someone to take you home, especially if a general anaesthetic is used.",
  },
  {
    q: "What if a polyp or fibroid is found?",
    a: "If a small polyp is found during a diagnostic hysteroscopy, the surgeon may be able to remove it at the same time if you have consented to this. Larger lesions typically require a separate planned operative hysteroscopy.",
  },
  {
    q: "Is there a risk of the womb being perforated?",
    a: "Yes, but it is uncommon — less than 1 in 200 for a diagnostic procedure and slightly higher for operative procedures. Most small perforations heal without treatment. (RCOG CA1)",
  },
  {
    q: "What is the fluid risk during operative hysteroscopy?",
    a: "During operative procedures, fluid used to distend the cavity can occasionally be absorbed into the bloodstream. Clinically significant fluid overload occurs in approximately 0.1–0.2 in 100 operative cases and is carefully monitored throughout. (BSGE/ESGE)",
  },
];

// ─── ANTENATAL CORTICOSTEROIDS ────────────────────────────────────────────────
// Source: RCOG Green-top Guideline (Stock et al., BJOG 2022;129:e35–e60)
// Antenatal corticosteroids to reduce neonatal morbidity and mortality.
// All numerical risk figures verbatim from Table 1 of the guideline.

export const ACS_CONTEXT_OPTIONS = [
  { id: "preterm",       label: "22⁺⁰–34⁺⁶ weeks (preterm)" },
  { id: "late_preterm",  label: "35⁺⁰–36⁺⁶ weeks (late preterm)" },
  { id: "term_cs",       label: "37⁺⁰–38⁺⁶ weeks (planned caesarean)" },
  { id: "rescue",        label: "Rescue course (>7 days since last)" },
];

export const ACS_PATIENT_FACTORS = [
  { id: "acs_diabetes",     label: "Diabetes (pre-existing or gestational)" },
  { id: "acs_multiple",     label: "Multiple pregnancy" },
];

// GRADE certainty mapping from RCOG GTG (Stock 2022):
//   HIGH     — "Highly likely"
//   MODERATE — "Likely"
//   LOW      — "May"
export const CERTAINTY = {
  HIGH:     { label: "Highly likely",   short: "High certainty"     },
  MODERATE: { label: "Likely",          short: "Moderate certainty" },
  LOW:      { label: "May",             short: "Low certainty"      },
};

export const ACS_BENEFITS = {
  preterm: [
    { id: "acs_perinatal_death", name: "Perinatal death", certainty: "HIGH",
      rate: "2.3 in 100 fewer", detail: "NNT 43.5",
      source: "RCOG GTG (Stock 2022) Table 1",
      plain: "Highly likely to reduce perinatal mortality — RR 0.85 (95% CI 0.77–0.93). About 2.3 in 100 fewer babies will die around the time of birth. 43.5 women need to be treated to prevent one death." },
    { id: "acs_neonatal_death", name: "Neonatal death", certainty: "HIGH",
      rate: "2.6 in 100 fewer", detail: "NNT 38.5",
      source: "RCOG GTG (Stock 2022) Table 1",
      plain: "Highly likely to reduce neonatal death — RR 0.78 (95% CI 0.70–0.87). About 2.6 in 100 fewer babies will die in the newborn period. 38.5 women need to be treated to prevent one death." },
    { id: "acs_rds", name: "Respiratory distress syndrome", certainty: "HIGH",
      rate: "4.3 in 100 fewer", detail: "NNT 23.3",
      source: "RCOG GTG (Stock 2022) Table 1",
      plain: "Highly likely to reduce neonatal respiratory distress — RR 0.71 (95% CI 0.65–0.78). About 4.3 in 100 fewer babies will develop RDS. 23.3 women need to be treated to prevent one case." },
    { id: "acs_ivh", name: "Intraventricular haemorrhage", certainty: "MODERATE",
      rate: "1.4 in 100 fewer", detail: "NNT 71.4",
      source: "RCOG GTG (Stock 2022) Table 1",
      plain: "Likely to reduce bleeding into the brain ventricles — RR 0.58 (95% CI 0.45–0.75). 71.4 women need to be treated to prevent one case." },
    { id: "acs_dev_delay", name: "Developmental delay in childhood", certainty: "MODERATE",
      rate: "NNT 27", detail: null,
      source: "RCOG GTG (Stock 2022) Table 1",
      plain: "Likely to reduce developmental delay in childhood — RR 0.51 (95% CI 0.27–0.97)." },
  ],
  late_preterm: [
    { id: "acs_late_resp_support", name: "Need for respiratory support", certainty: "MODERATE",
      rate: "146 → 116 / 1,000", detail: "NNT 33.3",
      source: "RCOG GTG (Stock 2022) Table 1",
      plain: "Likely to reduce the need for respiratory support — RR 0.80 (95% CI 0.66–0.97). The rate falls from 146 to 116 per 1,000. 33.3 women need to be treated to prevent one case." },
  ],
  term_cs: [
    { id: "acs_term_nnu", name: "NNU admission for respiratory morbidity", certainty: "LOW",
      rate: "51 → 23 / 1,000", detail: "NNT 35.7",
      source: "RCOG GTG (Stock 2022) Table 1",
      plain: "May decrease NNU admission with respiratory morbidity — RR 0.45 (95% CI 0.22–0.90). Single-centre trial with high risk of bias, so low certainty around the estimate." },
  ],
  rescue: [
    { id: "acs_rescue_resp", name: "Need for respiratory support", certainty: "MODERATE",
      rate: "395 → 311 / 1,000", detail: "NNT 11.9",
      source: "RCOG GTG (Stock 2022) Table 1",
      plain: "Likely to reduce the need for respiratory support — RR 0.91 (95% CI 0.85–0.97). The rate falls from 395 to 311 per 1,000. 11.9 women need to be treated to prevent one case." },
  ],
};

export const ACS_RISK_SECTIONS = {
  preterm: [
    {
      id: "acs_preterm_harms",
      heading: "Possible harms",
      type: "list",
      risks: [
        {
          id: "acs_mat_glucose",
          name: "Maternal hyperglycaemia for up to 5 days",
          freq: "COMMON",
          rate: null,
          conditions: ["acs_diabetes"],
          source: "RCOG GTG (Stock 2022) Table 1",
          plain: "Likely to affect maternal glucose tolerance for up to 5 days after administration, with a higher risk in diabetic women. Blood sugars will be monitored and your insulin or treatment may need adjusting.",
        },
        {
          id: "acs_birthweight",
          name: "Lower birthweight if birth >7 days after steroids",
          freq: "COMMON",
          rate: null,
          source: "RCOG GTG (Stock 2022) Table 1",
          plain: "Likely to reduce birthweight by about 147 g (95% CI -291.97 to -2.05) if birth occurs more than 7 days after steroids were given.",
        },
        {
          id: "acs_no_benefit_late",
          name: "No benefit if birth >7 days after starting treatment",
          freq: null,
          rate: null,
          source: "RCOG GTG (Stock 2022) Table 1",
          plain: "Reductions in mortality and respiratory morbidity are most likely if birth occurs 24–48 hours after starting treatment. No benefits are likely to be seen if birth is more than 7 days after starting treatment.",
        },
        {
          id: "acs_psych",
          name: "Possible increase in psychiatric/behavioural diagnoses if born at term",
          freq: "UNCOMMON",
          rate: "NNH 38.8",
          source: "RCOG GTG (Stock 2022) Table 1",
          plain: "If the baby is ultimately born at term despite the steroids, there may be a small increase in psychiatric and behavioural diagnoses (number needed to harm 38.8, 95% CI 30–52.4).",
        },
      ],
    },
    {
      id: "acs_preterm_unknowns",
      heading: "What we don't yet know",
      type: "simple",
      items: [
        "There is less evidence for women with multiple pregnancy.",
        "Effects of unnecessary antenatal corticosteroids (if birth is more than 7 days after steroids) are not well described.",
        "While no long-term harms have been proven, large-scale observational studies needed for pharmacovigilance are lacking.",
      ],
    },
  ],

  late_preterm: [
    {
      id: "acs_late_harms",
      heading: "Possible harms",
      type: "list",
      risks: [
        {
          id: "acs_late_hypo",
          name: "Neonatal hypoglycaemia",
          freq: "VERY_COMMON",
          rate: "from 150 to 240 in 1,000 (NNH 11.1)",
          source: "RCOG GTG (Stock 2022) Table 1",
          plain: "Likely to increase neonatal low blood sugar (RR 1.60, 95% CI 1.37–1.87). The rate rises from 150 to 240 per 1,000, with 11.1 women treated for each extra case of hypoglycaemia.",
        },
        {
          id: "acs_late_psych",
          name: "Possible increase in psychiatric/behavioural diagnoses if born at term",
          freq: "UNCOMMON",
          rate: "NNH 38.8",
          source: "RCOG GTG (Stock 2022) Table 1",
          plain: "If the baby is ultimately born at term, there may be a small increase in psychiatric and behavioural diagnoses (NNH 38.8, 95% CI 30.5–52.4).",
        },
      ],
    },
    {
      id: "acs_late_unknowns",
      heading: "What we don't yet know",
      type: "simple",
      items: [
        "Benefits seem unlikely if birth is more than 7 days after starting treatment, but this has not been studied in women at this gestation.",
        "Large-scale observational studies needed for pharmacovigilance are lacking.",
      ],
    },
  ],

  term_cs: [
    {
      id: "acs_term_harms",
      heading: "Possible harms",
      type: "list",
      risks: [
        {
          id: "acs_term_school",
          name: "Possible reduction in school-age educational attainment",
          freq: null,
          rate: null,
          source: "RCOG GTG (Stock 2022) Table 1",
          plain: "May reduce educational attainment at school age — in one observational study, the proportion ranked in the lower quartile of academic ability rose from 9% to 18%, and the proportion obtaining English proficiency fell from 13% to 7%.",
        },
        {
          id: "acs_term_hypo",
          name: "Likely neonatal hypoglycaemia",
          freq: null,
          rate: null,
          source: "RCOG GTG (Stock 2022) Table 1",
          plain: "Short-term complications such as hypoglycaemia have not been rigorously studied at these gestations, but are likely to apply (as for late preterm).",
        },
      ],
    },
    {
      id: "acs_term_unknowns",
      heading: "What we don't yet know",
      type: "simple",
      items: [
        "There is uncertainty as to whether there is any reduction in RDS, TTN or NNU admission overall.",
        "Risk of bias in the single-centre trial means there is low certainty around the estimates.",
        "Benefits seem unlikely if birth is more than 7 days after starting treatment, but this has not been studied at this gestation.",
        "Large-scale observational studies needed for pharmacovigilance are lacking.",
      ],
    },
  ],

  rescue: [
    {
      id: "acs_rescue_harms",
      heading: "Possible harms",
      type: "list",
      risks: [
        {
          id: "acs_rescue_growth",
          name: "Reduced birthweight, head circumference and length",
          freq: "COMMON",
          rate: "mean difference -80 g",
          source: "RCOG GTG (Stock 2022) Table 1",
          plain: "Likely to reduce birthweight (mean difference about 80 g lower), head circumference and length, and neonatal blood pressure. Dose effects are seen for harms.",
        },
      ],
    },
  ],
};

export const ACS_PAGES = {
  preterm: {
    what: {
      heading: "Antenatal Corticosteroids (preterm)",
      body: "Antenatal corticosteroids are steroid injections given to you before your baby is born to help your baby's lungs and other organs mature. The UK regimen is either:\n\n• Dexamethasone phosphate 24 mg IM — two 12 mg doses 24 hours apart (or four 6 mg doses 12 hours apart), or\n• Betamethasone sodium phosphate/acetate 24 mg IM — two 12 mg doses 24 hours apart.\n\nThe injections work best if the baby is born between 24 hours and 7 days after starting the course.",
    },
    why: {
      heading: "Why are they being offered?",
      body: "Corticosteroids are offered to women between 24⁺⁰ and 34⁺⁶ weeks in whom imminent preterm birth is anticipated (established preterm labour, PPROM, or planned preterm birth). At 22⁺⁰–23⁺⁶ weeks they are discussed in the context of individual circumstances and the wider decision about active care for the baby.\n\nA Cochrane review of 27 studies (11,272 women and 11,925 babies) found high-certainty evidence that they reduce perinatal death, neonatal death and respiratory distress syndrome, with moderate-certainty evidence for reductions in intraventricular haemorrhage and developmental delay.",
    },
    alternatives: {
      heading: "Alternatives and your right to decline",
      body: "You have the right to decline antenatal corticosteroids. There is no alternative medicine that does the same job; the alternative is expectant care without steroids.\n\nIf you decline, the risk of neonatal death, respiratory distress syndrome, intraventricular haemorrhage and developmental delay is higher than it would be with treatment. The size of these risks depends on how preterm your baby is born.\n\nYour obstetric and neonatal team will continue to support you and your baby whatever you decide.",
    },
  },
  late_preterm: {
    what: {
      heading: "Antenatal Corticosteroids (late preterm)",
      body: "Antenatal corticosteroids are steroid injections (dexamethasone or betamethasone, 24 mg IM total over 24 hours) given before birth to help your baby's lungs mature.",
    },
    why: {
      heading: "Why are they being offered?",
      body: "Between 35⁺⁰ and 36⁺⁶ weeks the benefits and harms are more finely balanced. They may reduce the need for respiratory support, but they also increase the risk of low blood sugar in the newborn. The discussion should cover both — the guideline recommends an individualised, informed decision.",
    },
    alternatives: {
      heading: "Alternatives and your right to decline",
      body: "You have the right to decline. The alternative is expectant care without steroids: the risk of the baby needing respiratory support is higher, but the risk of low blood sugar in the newborn is lower. Either choice is reasonable at this gestation; the guideline recommends an individualised decision.\n\nYour team will continue routine monitoring of the baby's breathing and blood sugars after birth whatever you decide.",
    },
  },
  term_cs: {
    what: {
      heading: "Antenatal Corticosteroids (term caesarean)",
      body: "Antenatal corticosteroids are steroid injections (dexamethasone or betamethasone, 24 mg IM total over 24 hours) given before a planned caesarean at term to reduce the chance of breathing problems in the newborn.",
    },
    why: {
      heading: "Why are they being discussed?",
      body: "NICE CG132 recommends planned caesarean birth should not routinely be carried out before 39⁺⁰ weeks. For women undergoing a planned caesarean between 37⁺⁰ and 38⁺⁶ weeks, the guideline recommends an informed discussion about steroids.\n\nThe evidence is uncertain: steroids may reduce neonatal unit admission for respiratory morbidity (5.1% → 2.3%) but it is unclear if they reduce RDS, transient tachypnoea of the newborn or overall NNU admissions, and they may cause harm (hypoglycaemia, possible developmental effects).",
    },
    alternatives: {
      heading: "Alternatives and your right to decline",
      body: "You have the right to decline, and here there is a genuine alternative:\n\n• Planning the caesarean at or after 39⁺⁰ weeks, where possible, reduces the chance of breathing problems without using steroids.\n• Declining steroids and keeping the planned date: the risk of respiratory morbidity at term is low overall (around 5 in 100) and decreases with advancing gestation.\n\nEither approach is reasonable; the evidence for steroids at this gestation is uncertain.",
    },
  },
  rescue: {
    what: {
      heading: "Rescue course of antenatal corticosteroids",
      body: "A rescue (repeat) course is a second course of antenatal corticosteroids given when more than 7 days have passed since the original course and there is renewed concern about imminent preterm birth.",
    },
    why: {
      heading: "Why is it being offered?",
      body: "The benefit of a single course of antenatal corticosteroids fades after about 7 days. If preterm birth is again anticipated and the previous course was given more than 7 days ago, a rescue course is likely to reduce the baby's need for respiratory support (395 → 311 per 1,000).",
    },
    alternatives: {
      heading: "Alternatives and your right to decline",
      body: "You have the right to decline a rescue course. The alternative is expectant care: without a repeat course, the protective effect of the first course is likely to have largely worn off, and the baby's risk of needing respiratory support is higher.\n\nIt is also reasonable to weigh repeat dosing carefully. Dose effects are seen for harms: every additional course may further reduce birthweight, head circumference, length and neonatal blood pressure.",
    },
  },
};

export const ACS_FAQ = [
  {
    q: "When do the steroids start working?",
    a: "The protective effects begin to appear within 24 hours of the first injection and are greatest if the baby is born between 24 hours and 7 days after starting treatment. (RCOG GTG, Stock 2022)",
  },
  {
    q: "What if my baby is born within 24 hours of the first dose?",
    a: "There is still likely to be some benefit even if the full course has not been completed, particularly for respiratory distress. Your team will give the second dose if there is time.",
  },
  {
    q: "What if my baby isn't born for more than 7 days?",
    a: "If birth happens more than 7 days after the course, the benefits are largely lost. The baby may also be smaller (mean about 147 g lower birthweight). A rescue course may be considered if there is renewed concern about imminent preterm birth.",
  },
  {
    q: "I have diabetes — will the steroids affect my blood sugars?",
    a: "Yes — antenatal corticosteroids are likely to affect glucose tolerance for up to 5 days, and the effect is greater in women with diabetes. Your blood sugars will be monitored closely and you may need a variable-rate intravenous insulin infusion. (RCOG GTG, Stock 2022)",
  },
  {
    q: "Are there long-term effects on my baby?",
    a: "No long-term harms have been proven, but large-scale observational studies needed for pharmacovigilance are lacking. There is some evidence of a small increase in psychiatric and behavioural diagnoses if the baby is ultimately born at term (NNH 38.8). At term, one observational study suggested a possible reduction in school-age educational attainment.",
  },
  {
    q: "Which steroid will I be given?",
    a: "In the UK, either dexamethasone phosphate 24 mg IM (two 12 mg doses 24 hours apart, or four 6 mg doses 12 hours apart) or betamethasone sodium phosphate/acetate 24 mg IM (two 12 mg doses 24 hours apart). Oral and transplacental routes are not recommended.",
  },
];

// ─── INDUCTION OF LABOUR ──────────────────────────────────────────────────────
// Source: NICE NG207 — Inducing labour (Nov 2021)

export const IOL_CONTEXT_OPTIONS = [
  { id: "membrane_sweep", label: "Membrane sweep",   description: "Cervical sweep at antenatal visit",      color: "text-emerald-600", dot: "bg-emerald-500" },
  { id: "prostaglandin",  label: "Prostaglandin",    description: "Vaginal dinoprostone / oral misoprostol", color: "text-rose-600",    dot: "bg-rose-500" },
  { id: "balloon",        label: "Balloon catheter", description: "Mechanical cervical ripening",           color: "text-amber-600",   dot: "bg-amber-500" },
  { id: "arm_oxytocin",   label: "ARM + oxytocin",   description: "Amniotomy and oxytocin infusion",        color: "text-purple-600",  dot: "bg-purple-500" },
];

export const IOL_PATIENT_FACTORS = [
  { id: "previous_cs",        label: "Previous caesarean birth" },
  { id: "gbs_positive",       label: "Group B Streptococcus positive" },
  { id: "multiple_pregnancy", label: "Multiple pregnancy" },
  { id: "pprom",              label: "Preterm prelabour rupture of membranes" },
  { id: "prom_term",          label: "Prelabour rupture of membranes at term" },
  { id: "macrosomia",         label: "Suspected fetal macrosomia" },
  { id: "post_dates",         label: "Pregnancy ≥ 41+0 weeks" },
];

export const IOL_RISK_SECTIONS = [
  {
    id: "iol_general",
    heading: "General risks of induction",
    type: "simple",
    items: [
      "Induced labour may be more painful than spontaneous labour. (NICE NG207 §1.1.3, §1.5.6)",
      "Choice of place of birth will be limited — interventions recommended (oxytocin infusion, continuous CTG, epidural) are not available for home birth or in midwife-led units. (NICE NG207 §1.1.3)",
      "There may be limitations on the use of a birthing pool. (NICE NG207 §1.1.3)",
      "Hospital stay may be longer than with a spontaneous labour. (NICE NG207 §1.1.3)",
      "Increased likelihood of assisted vaginal birth (forceps or ventouse), with associated increased risk of obstetric anal sphincter injury (3rd/4th degree tears). (NICE NG207 §1.1.3)",
      "Induction may not be successful, and a caesarean section may then be needed. (NICE NG207 §1.1.4)",
      "Vaginal examinations to assess the cervix are required before and during induction. (NICE NG207 §1.1.3)",
    ],
  },
  {
    id: "iol_method",
    heading: "Risks of the chosen method",
    type: "simple",
    items: [
      "MEMBRANE SWEEP: pain, discomfort and vaginal bleeding are possible from the procedure. (NICE NG207 §1.3.1)",
      "PHARMACOLOGICAL (dinoprostone / misoprostol): can cause uterine hyperstimulation — the uterus contracts too frequently or contractions last too long, which can lead to changes in fetal heart rate and fetal compromise. (NICE NG207 §1.1.3, §1.3.5)",
      "PHARMACOLOGICAL: hyperstimulation caused by misoprostol may be more difficult to reverse than that from dinoprostone. (NICE NG207 §1.3.5)",
      "MECHANICAL (balloon catheter): less likely to cause hyperstimulation than pharmacological methods, but carries a risk of infection. (NICE NG207 §1.2.17, §1.3.5)",
      "ARM (amniotomy): if oxytocin is delayed after amniotomy, labour may take longer and there may be an increased risk of neonatal infection. (NICE NG207 §1.3.10)",
      "OXYTOCIN infusion: continuous cardiotocography is required because of the risk of hyperstimulation and fetal compromise. (NICE NG207 §1.5.3)",
    ],
  },
  {
    id: "iol_previous_cs",
    heading: "If you have had a previous caesarean",
    type: "simple",
    factorOnly: "previous_cs",
    items: [
      "Induction of labour can lead to an increased risk of emergency caesarean birth. (NICE NG207 §1.2.17)",
      "Induction of labour can lead to a risk of uterine rupture (the scar on the womb opening). (NICE NG207 §1.2.17)",
      "Dinoprostone and misoprostol are contraindicated for induction in women with a uterine scar because they increase the risk of uterine rupture. A mechanical method (balloon catheter) is usually preferred. (NICE NG207 §1.2.17)",
    ],
  },
];

// Shared row: why induction is offered at all. Method rows follow NG207.
const IOL_BENEFIT_PROLONGED = {
  id: "iol_prolonged",
  name: "Reduces the risks of prolonged pregnancy",
  source: "NICE NG207 §1.2",
  plain: "Beyond 41+0 weeks the risks of stillbirth, neonatal death, neonatal unit admission and caesarean birth increase with time; induction is offered to avoid these risks. If induction has been offered for a different reason, that reason will have been discussed with you.",
};

export const IOL_BENEFITS = {
  membrane_sweep: [
    {
      id: "iol_sweep_natural",
      name: "Makes labour more likely to start on its own",
      source: "NICE NG207 §1.3.1",
      plain: "A sweep increases the chance that labour starts naturally, which can avoid the need for a formal induction with drugs or a balloon.",
    },
    {
      id: "iol_sweep_simple",
      name: "Simple and done at a routine visit",
      source: "NICE NG207 §1.3.2",
      plain: "It is performed during a vaginal examination at an antenatal appointment, with verbal consent, and can be repeated if labour does not start.",
    },
  ],
  prostaglandin: [
    IOL_BENEFIT_PROLONGED,
    {
      id: "iol_pg_firstline",
      name: "First-line and effective at preparing the cervix",
      source: "NICE NG207 §1.3.7",
      plain: "Prostaglandins soften and open the cervix when it is not yet ready for labour (Bishop score 6 or less), allowing the waters to be broken and labour to be established.",
    },
  ],
  balloon: [
    IOL_BENEFIT_PROLONGED,
    {
      id: "iol_balloon_gentle",
      name: "Lower chance of hyperstimulation than drug methods",
      source: "NICE NG207 §1.3.5",
      plain: "Mechanical methods are less likely than prostaglandins to make the uterus contract too frequently, and are the usual choice after a previous caesarean because prostaglandins are contraindicated with a uterine scar.",
    },
  ],
  arm_oxytocin: [
    IOL_BENEFIT_PROLONGED,
    {
      id: "iol_arm_establish",
      name: "Establishes labour once the cervix is ready",
      source: "NICE NG207 §1.3.9",
      plain: "When the cervix is favourable (Bishop score more than 6), breaking the waters and starting oxytocin is the recommended way to bring on contractions and establish labour.",
    },
  ],
};

export const IOL_PAGES = {
  membrane_sweep: {
    what: {
      heading: "Membrane sweep",
      body: "A membrane sweep is a vaginal examination during which a finger is gently passed through the cervix to separate the membranes from the lower part of the womb. It is usually offered at antenatal visits from 39+0 weeks onwards.\n\nA sweep is not the same as a formal induction — it can make it more likely that labour will start on its own, without the need for additional drugs or mechanical methods.\n\nVerbal consent is obtained before the procedure. You can have more than one sweep if the first does not start labour. (NICE NG207 §1.3.1–1.3.3)",
    },
    why: {
      heading: "Why is this being offered?",
      body: "A membrane sweep is offered to try to start labour naturally and reduce the chance that you will need a formal induction with drugs or a balloon.\n\nIt is usually offered from 39+0 weeks onwards in uncomplicated pregnancies, or earlier if there is a clinical reason to expedite labour. (NICE NG207 §1.3.2)",
    },
    alternatives: {
      heading: "Alternatives and your right to decline",
      body: "You have the right to decline a membrane sweep, and your decision will be respected. The options remain open:\n\n• Waiting for labour to start naturally, with the offer of a sweep at a later visit\n• Formal induction of labour, discussed and booked in the usual way\n• Expectant management with additional monitoring if the pregnancy continues past 41+0 weeks\n\nYour usual antenatal care continues whatever you decide. (NICE NG207 §1.1.5)",
    },
  },
  prostaglandin: {
    what: {
      heading: "Prostaglandin induction",
      body: "A prostaglandin (vaginal dinoprostone tablet, gel, controlled-release pessary, or low-dose oral misoprostol) is given to help the cervix soften and open. It is the first-line method when the Bishop score is 6 or less.\n\nYour baby's heart rate and your contractions are monitored regularly. If hyperstimulation occurs (contractions that are too frequent or too long), the treatment is stopped and the pessary removed if possible. Hyperstimulation can be treated with a tocolytic medication.\n\nOnce the cervix is favourable, an amniotomy (breaking the waters) and oxytocin infusion may be needed to establish labour. (NICE NG207 §1.3.5–1.3.7)",
    },
    why: {
      heading: "Why is this being recommended?",
      body: "Prostaglandin is recommended as the first-line method of induction for women with a Bishop score of 6 or less and no contraindication to pharmacological induction. (NICE NG207 §1.3.7)\n\nThe reason for offering induction in your case will have been discussed with you separately — common reasons include pregnancy lasting beyond 41+0 weeks, prelabour rupture of the membranes, or other obstetric indications. (NICE NG207 §1.2)",
    },
    alternatives: {
      heading: "Alternatives and your right to decline",
      body: "You have the right to decide not to proceed with induction, to delay it, or to stop the process at any stage, even if the healthcare team disagrees with the decision. (NICE NG207 §1.1.5)\n\nThe alternatives will be discussed with you:\n\n• Expectant management: waiting, with additional fetal monitoring; the risks of continuing the pregnancy in your situation will be explained\n• A different method of induction, where one is suitable\n• Planned caesarean birth (NICE NG207 §1.2.18)\n\nYour decision will be respected and recorded in your notes.",
    },
  },
  balloon: {
    what: {
      heading: "Balloon catheter (mechanical induction)",
      body: "A balloon catheter (sometimes a double balloon, or an osmotic cervical dilator) is placed through the cervix and inflated to gently stretch and ripen the cervix. It is left in for up to 12–24 hours.\n\nThe balloon usually falls out when the cervix has opened enough, after which an amniotomy and oxytocin infusion may be needed to establish labour.\n\nMechanical methods are less likely to cause uterine hyperstimulation than pharmacological methods, but there is a small risk of infection. (NICE NG207 §1.3.5, §1.3.8)",
    },
    why: {
      heading: "Why is this being recommended?",
      body: "A mechanical method is offered when pharmacological methods (dinoprostone, misoprostol) are not suitable — for example, if there is a higher risk of hyperstimulation, or in women who have had a previous caesarean birth (because dinoprostone and misoprostol are contraindicated in women with a uterine scar).\n\nIt may also be offered when you choose a mechanical method over a pharmacological one. (NICE NG207 §1.2.17, §1.3.8)",
    },
    alternatives: {
      heading: "Alternatives and your right to decline",
      body: "You have the right to decline mechanical induction, to delay it, or to stop the process at any stage. (NICE NG207 §1.1.5)\n\nThe alternatives will be discussed with you:\n\n• Expectant management: waiting, with additional fetal monitoring\n• A pharmacological method (dinoprostone or misoprostol), where suitable; not an option with a previous caesarean because of the uterine scar\n• Planned caesarean birth (NICE NG207 §1.2.18)\n\nYour decision will be respected and recorded in your notes.",
    },
  },
  arm_oxytocin: {
    what: {
      heading: "ARM + oxytocin",
      body: "When the cervix is favourable (Bishop score >6), induction is started by breaking the waters (artificial rupture of membranes — ARM) and starting an intravenous oxytocin infusion to bring on contractions.\n\nContinuous CTG monitoring is required during the oxytocin infusion because of the risk of hyperstimulation and fetal compromise.\n\nYou can choose to have the ARM and either delay or decline the oxytocin infusion, but this may mean labour takes longer and there may be an increased risk of infection for the baby. (NICE NG207 §1.3.9, §1.3.10)",
    },
    why: {
      heading: "Why is this being recommended?",
      body: "ARM and oxytocin is recommended as the method of induction once the cervix is favourable (Bishop score more than 6). (NICE NG207 §1.3.9)",
    },
    alternatives: {
      heading: "Alternatives and your right to decline",
      body: "You have the right to decline, and you can stop the induction process at any stage. (NICE NG207 §1.1.5)\n\nThe alternatives will be discussed with you:\n\n• Having the ARM only and delaying or declining the oxytocin infusion, accepting that labour may take longer and there may be an increased risk of infection for the baby (NICE NG207 §1.3.10)\n• Expectant management: waiting, with additional fetal monitoring\n• Planned caesarean birth (NICE NG207 §1.2.18)\n\nYour decision will be respected and recorded in your notes.",
    },
  },
};

export const IOL_FAQ = [
  {
    q: "Why are you offering induction?",
    a: "The most common reasons are: pregnancy lasting beyond 41+0 weeks (where the risks of stillbirth, neonatal death, NICU admission and caesarean birth increase over time), prelabour rupture of the membranes, suspected fetal macrosomia, intrauterine fetal death, or other obstetric/medical reasons specific to you. Your doctor will explain the reason in your case. (NICE NG207 §1.2)",
  },
  {
    q: "Can induction fail?",
    a: "Yes. Sometimes induction does not bring on labour, and a caesarean section is then needed. This is one of the things we discuss before starting. (NICE NG207 §1.1.4)",
  },
  {
    q: "What is hyperstimulation?",
    a: "Hyperstimulation is when the uterus contracts too frequently or contractions last too long (defined as 5 or more contractions in 10 minutes for at least 20 minutes). This can lead to changes in the baby's heart rate. If it happens, the induction medication is stopped or the pessary removed, and a relaxing medication (tocolytic) can be given. (NICE NG207 §1.1.3, §1.3.5)",
  },
  {
    q: "Will it be more painful than a normal labour?",
    a: "Induced labour may be more painful than spontaneous labour. You will be offered the full range of pain relief — simple analgesia, labour in water (where suitable), and epidural. (NICE NG207 §1.1.3, §1.5.6–1.5.8)",
  },
  {
    q: "I've had a previous caesarean — is induction safe?",
    a: "Induction is possible but carries an increased risk of emergency caesarean birth and a small risk of uterine rupture. Prostaglandins (dinoprostone and misoprostol) are not used in women with a previous caesarean because they increase the rupture risk — a mechanical method (balloon catheter) is usually preferred. The risks will be discussed with you in detail. (NICE NG207 §1.2.17)",
  },
  {
    q: "Can I change my mind?",
    a: "Yes — at any stage. You can decline induction at the outset, delay it, or stop the process once it has started. Your decision will be respected and recorded in your notes. (NICE NG207 §1.1.5)",
  },
];

// ─── BIRTH AFTER CAESAREAN (VBAC vs ERCS) ────────────────────────────────────
// Source: RCOG Green-top Guideline No. 45 (Birth After Previous Caesarean, 2015)
// and its patient information. Figures describe women with one previous
// lower-segment caesarean unless stated.

export const VBAC_PATIENT_FACTORS = [
  { id: "prev_vaginal_birth", label: "Previous vaginal birth" },
  { id: "two_plus_cs",        label: "Two or more previous caesareans" },
  { id: "vbac_iol",           label: "Induction of labour likely" },
];

export const VBAC_RISK_SECTIONS = [
  {
    id: "vbac_maternal",
    heading: "Risks of planned VBAC",
    type: "list",
    risks: [
      {
        id: "vbac_em_cs",
        name: "Emergency caesarean during labour",
        freq: "VERY_COMMON",
        rate: "About 1 in 4",
        source: "RCOG GTG45",
        plain: "Around 1 in 4 women planning VBAC need an emergency caesarean during labour, most often for slow progress or concerns about the baby's heart rate. This is similar to the rate for a woman labouring for the first time.",
      },
      {
        id: "vbac_rupture",
        name: "Uterine rupture (scar opening in labour)",
        freq: "UNCOMMON",
        rate: "About 1 in 200",
        source: "RCOG GTG45",
        plain: "The scar on the womb opens during labour in about 1 in 200 planned VBAC labours. This is an emergency: it is why continuous monitoring and birth in a unit with immediate access to caesarean are recommended.",
      },
      {
        id: "vbac_transfusion",
        name: "Blood transfusion or uterine infection",
        freq: "COMMON",
        rate: "≈1 in 100 extra",
        source: "RCOG GTG45",
        plain: "Planned VBAC carries about a 1 in 100 additional risk of needing a blood transfusion or developing infection of the womb, compared with a planned repeat caesarean.",
      },
      {
        id: "vbac_hie",
        name: "Brain injury from lack of oxygen (HIE)",
        freq: "RARE",
        rate: "8 in 10,000",
        source: "RCOG GTG45",
        plain: "The risk of the baby developing hypoxic-ischaemic encephalopathy with planned VBAC is about 8 in 10,000, compared with less than 1 in 10,000 for a planned repeat caesarean.",
      },
      {
        id: "vbac_perinatal_death",
        name: "Delivery-related perinatal death",
        freq: "RARE",
        rate: "4 in 10,000",
        source: "RCOG GTG45",
        plain: "The risk of the baby dying around the time of birth with planned VBAC is about 4 in 10,000. This is very low, and comparable to the risk for a woman labouring with her first baby.",
      },
      {
        id: "vbac_iol_row",
        name: "Induced VBAC labour: higher risks",
        freq: "COMMON",
        rate: null,
        note: "Applies if induced",
        source: "RCOG GTG45",
        conditions: ["vbac_iol"],
        plain: "Induction of a VBAC labour increases the risks of emergency caesarean and of uterine rupture compared with waiting for spontaneous labour. Mechanical methods are preferred; the balance of risks should be discussed with a senior obstetrician.",
      },
      {
        id: "vbac_two_plus_row",
        name: "Two or more previous caesareans",
        freq: "COMMON",
        rate: null,
        note: "Consultant decision",
        source: "RCOG GTG45",
        conditions: ["two_plus_cs"],
        plain: "VBAC after two previous caesareans can be supported after senior review: the success rate is similar, but the uterine rupture risk is uncertain and may be higher. This decision should be made with a consultant.",
      },
    ],
  },
];

export const VBAC_COMPARISON_SECTIONS = [
  {
    id: "vbac_vs_ercs",
    heading: "Planned VBAC vs planned repeat caesarean",
    type: "comparison",
    labels: { a: "VBAC", b: "ERCS" },
    source: "RCOG GTG45",
    risks: [
      {
        id: "cmp_rupture",
        name: "Uterine rupture",
        a: "About 1 in 200",
        b: "About 1 in 5,000",
        a_higher: true,
        plain: "The scar is under strain during labour, so rupture is more likely with planned VBAC. With a planned repeat caesarean before labour it is very rare.",
      },
      {
        id: "cmp_perinatal",
        name: "Delivery-related perinatal death",
        a: "About 4 in 10,000",
        b: "Less than 1 in 10,000",
        a_higher: true,
        plain: "Both risks are very small. The planned VBAC figure is comparable to the risk for a woman labouring with her first baby.",
      },
      {
        id: "cmp_hie",
        name: "Brain injury from lack of oxygen (HIE)",
        a: "About 8 in 10,000",
        b: "Less than 1 in 10,000",
        a_higher: true,
        plain: "Hypoxic-ischaemic encephalopathy is rare with either plan but more likely with labour.",
      },
      {
        id: "cmp_maternal_death",
        name: "Maternal death",
        a: "About 4 in 100,000",
        b: "About 13 in 100,000",
        a_higher: false,
        plain: "Maternal death is very rare with either choice, and slightly more likely with planned repeat caesarean.",
      },
      {
        id: "cmp_recovery",
        name: "Recovery and hospital stay",
        a: "Usually shorter",
        b: "Longer",
        a_higher: false,
        plain: "A successful VBAC usually means a shorter hospital stay and quicker recovery. A repeat caesarean is abdominal surgery with the usual surgical recovery.",
      },
      {
        id: "cmp_future",
        name: "Risks in future pregnancies",
        a: "Lower",
        b: "Higher",
        a_higher: false,
        plain: "Each additional caesarean increases the risk of placenta praevia and accreta in future pregnancies and makes future surgery more difficult. A successful VBAC makes future vaginal births more likely.",
      },
    ],
  },
];

export const VBAC_BENEFITS = [
  {
    id: "vbac_success",
    name: "Good chance of a straightforward vaginal birth",
    rate: "72–75 in 100",
    detail: "85–90 in 100 if previous vaginal birth",
    source: "RCOG GTG45",
    plain: "About 72–75 in 100 planned VBAC labours end in vaginal birth. If you have had a vaginal birth before, the chance rises to about 85–90 in 100.",
  },
  {
    id: "vbac_recovery",
    name: "Quicker recovery than repeat surgery",
    source: "RCOG GTG45",
    plain: "A successful VBAC avoids abdominal surgery, usually meaning a shorter hospital stay, an easier recovery, and an earlier return to normal activities.",
  },
  {
    id: "vbac_future",
    name: "Better outlook for future pregnancies",
    source: "RCOG GTG45",
    plain: "Avoiding another caesarean means the risks of placenta praevia and accreta do not accumulate, and future vaginal births become more likely.",
  },
];

export const VBAC_PAGES = {
  what: {
    heading: "Birth After Caesarean",
    body: "After a caesarean, there are usually two good options for the next birth: planning a vaginal birth (VBAC) or planning a repeat caesarean (ERCS). For most women with one previous lower-segment caesarean, both are safe choices, and the decision is yours after counselling.\n\nWhat planned VBAC involves\n\n• Labour in a unit with immediate access to caesarean, with intravenous access considered on admission.\n• Continuous monitoring of the baby's heart rate throughout labour, because a change in the heart pattern is often the first sign of a problem with the scar.\n• The full range of pain relief, including epidural.\n\nWhat planned repeat caesarean involves\n\n• A planned operation, usually from 39 weeks, as described in the Caesarean Section entry.\n\nThe Options tab compares the two side by side.",
  },
  why: {
    heading: "Why is this a choice?",
    body: "Most women with one previous lower-segment caesarean and no other complications can safely plan either a VBAC or a repeat caesarean, so national guidance recommends offering both and supporting your informed choice.\n\nPlanned VBAC is not advised where vaginal birth itself is contraindicated (for example placenta praevia), after a previous uterine rupture, or after a previous classical (vertical) uterine incision. Your consultant will confirm which options apply to you.",
  },
  alternatives: {
    heading: "The other option: planned repeat caesarean",
    body: "Choosing a planned repeat caesarean (ERCS) is not declining care; it is one of the two recommended options, and either choice will be supported.\n\n• ERCS is usually planned from 39 weeks. If labour starts before the date, the plan is reviewed: some women choose to labour at that point, others have the caesarean brought forward.\n• ERCS virtually eliminates the risk of scar rupture in labour and carries the lowest risk to the baby around birth, but it is abdominal surgery, with a longer recovery and a small increase in maternal risks, and it adds surgical risk to any future pregnancies.\n\nYou can change your decision in either direction at any point in the pregnancy, and the plan can be revisited with your consultant.",
  },
};

export const VBAC_FAQ = [
  {
    q: "What are my chances of a successful VBAC?",
    a: "About 72–75 in 100 overall, rising to 85–90 in 100 if you have had a vaginal birth before. Your consultant can personalise this using your history. (RCOG GTG45)",
  },
  {
    q: "What happens if the scar opens?",
    a: "Uterine rupture happens in about 1 in 200 planned VBAC labours. It is an emergency: the team performs an immediate caesarean. This is why continuous monitoring and birth in a unit with theatre access are recommended. (RCOG GTG45)",
  },
  {
    q: "Can I have an epidural?",
    a: "Yes. An epidural is not contraindicated in VBAC labour, and the full range of pain relief is available.",
  },
  {
    q: "Can I have a VBAC after two caesareans?",
    a: "Sometimes. The success rate is similar, but the uterine rupture risk is uncertain and may be higher, so this decision is made with a consultant. (RCOG GTG45)",
  },
  {
    q: "What if I go into labour before my planned caesarean date?",
    a: "Around 1 in 10 women labour before 39 weeks. Your plan should cover this: contact the unit as soon as labour starts, and the team will either proceed to caesarean or support labour depending on your wishes and the situation.",
  },
  {
    q: "Can I give birth at home or in a midwife-led unit?",
    a: "Planned VBAC is recommended to take place in a unit with continuous monitoring and immediate access to caesarean, so home birth and midwife-led settings carry additional risk. Your team will discuss this honestly if you are considering it. (RCOG GTG45)",
  },
];

// ─── EXTERNAL CEPHALIC VERSION (ECV) ─────────────────────────────────────────
// Source: RCOG Green-top Guideline No. 20 (ECV and Breech, 2017) and its
// patient information.

export const ECV_PATIENT_FACTORS = [
  { id: "ecv_first_baby", label: "First baby" },
  { id: "ecv_prev_cs",    label: "Previous caesarean section" },
];

export const ECV_RISK_SECTIONS = [
  {
    id: "ecv_risks",
    heading: "Risks",
    type: "list",
    risks: [
      {
        id: "ecv_unsuccessful",
        name: "Attempt unsuccessful",
        freq: "VERY_COMMON",
        rate: "About 50 in 100",
        source: "RCOG GTG20",
        plain: "About half of ECV attempts do not turn the baby. If that happens, the options are a planned caesarean or, for some women, a vaginal breech birth; both will be discussed.",
      },
      {
        id: "ecv_discomfort",
        name: "Discomfort during the procedure",
        freq: "VERY_COMMON",
        rate: null,
        source: "RCOG GTG20",
        plain: "Firm pressure on the abdomen is uncomfortable for most women. Tell the doctor if it is too much; the attempt can be paused or stopped at any time.",
      },
      {
        id: "ecv_fhr",
        name: "Temporary changes in the baby's heart rate",
        freq: "VERY_COMMON",
        rate: null,
        source: "RCOG GTG20",
        plain: "Short-lived changes in the baby's heart rate during or just after the attempt are common and almost always settle. The heart rate is monitored before and after the procedure.",
      },
      {
        id: "ecv_reversion",
        name: "Baby turns back to breech",
        freq: "COMMON",
        rate: "Fewer than 5 in 100",
        source: "RCOG GTG20",
        plain: "After a successful ECV, fewer than 5 in 100 babies turn back to breech.",
      },
      {
        id: "ecv_em_cs",
        name: "Emergency caesarean after the attempt",
        freq: "UNCOMMON",
        rate: "About 1 in 200",
        source: "RCOG GTG20",
        plain: "About 1 in 200 women need an emergency caesarean shortly after ECV, usually because of bleeding or changes in the baby's heart rate. ECV is therefore performed where a caesarean can be done immediately.",
      },
    ],
  },
];

export const ECV_BENEFITS = [
  {
    id: "ecv_success",
    name: "About half of babies turn",
    rate: "50 in 100",
    detail: "≈40 first babies · ≈60 after previous birth",
    source: "RCOG GTG20",
    plain: "ECV is successful in about 50 in 100 attempts overall: around 40 in 100 for first babies and 60 in 100 for women who have given birth before. A medicine to relax the womb (tocolysis) improves the success rate.",
  },
  {
    id: "ecv_vaginal_birth",
    name: "Makes vaginal birth possible",
    source: "RCOG GTG20",
    plain: "If the baby turns head-down, the pregnancy can continue to normal labour, and most women who have a successful ECV go on to have a vaginal birth.",
  },
  {
    id: "ecv_avoids_cs",
    name: "Avoids a planned caesarean",
    source: "RCOG GTG20",
    plain: "Successful ECV avoids the surgical risks and longer recovery of a caesarean, and the implications another caesarean would carry for future pregnancies.",
  },
];

export const ECV_PAGES = {
  what: {
    heading: "External Cephalic Version (ECV)",
    body: "ECV is a procedure to turn a breech baby head-down by applying firm pressure on your abdomen. It is offered from around 36 weeks for a first baby and 37 weeks if you have given birth before.\n\nWhat happens\n\n• The baby's heart rate is monitored (CTG) before the attempt, and the position confirmed on ultrasound.\n• You are usually given an injection to relax the womb (a tocolytic); it can make your heart race for a few minutes, which is expected and settles.\n• The obstetrician places their hands on your abdomen and encourages the baby to do a forward or backward roll. An attempt takes a few minutes and can be stopped at any time if you ask.\n• The heart rate is monitored again afterwards, and the scan repeated to confirm the position.\n• If your blood group is RhD negative, anti-D is offered after the procedure.\n\nYou can usually go home the same day, whatever the result.",
  },
  why: {
    heading: "Why is this being offered?",
    body: "Around 3–4 in 100 babies are breech (bottom-first) at term. A breech baby usually means a planned caesarean or a vaginal breech birth, both of which carry different risks from a head-down birth.\n\nTurning the baby head-down makes a normal labour and vaginal birth possible, which is why national guidance recommends offering ECV to women with a breech baby at term where there is no contraindication (for example bleeding, ruptured membranes, or concerns about the baby). (RCOG GTG20)",
  },
  alternatives: {
    heading: "Alternatives and your right to decline",
    body: "ECV is entirely optional. If you decline, or if the attempt is unsuccessful, the options are:\n\n• Planned caesarean birth: for a persistent breech baby at term, planned caesarean carries a small reduction in the risk to the baby around birth compared with a planned vaginal breech birth (about 0.5 in 1,000 vs about 2 in 1,000), at the cost of surgical risks to you and implications for future pregnancies.\n• Vaginal breech birth: a reasonable option for some women with an experienced team; your obstetrician will discuss the selection criteria and what would make it safer or less safe in your case.\n\nWhichever you choose, the decision will be respected and the plan documented. (RCOG GTG20)",
  },
};

export const ECV_FAQ = [
  {
    q: "Does ECV hurt?",
    a: "It is uncomfortable rather than painful for most women; some do find it painful. The attempt only lasts a few minutes, and you can ask the doctor to stop at any time.",
  },
  {
    q: "Is it safe for the baby?",
    a: "ECV is generally safe. Short-lived heart rate changes are common and settle; about 1 in 200 women need an emergency caesarean soon after the attempt, which is why it is done where a caesarean can happen immediately. (RCOG GTG20)",
  },
  {
    q: "What is the injection I am given?",
    a: "A tocolytic, a medicine that relaxes the womb and improves the chance of success. It commonly makes your heart race for a few minutes; this is expected and wears off quickly.",
  },
  {
    q: "What if it doesn't work?",
    a: "About half of attempts are unsuccessful. A second attempt is sometimes reasonable. Otherwise, the options are a planned caesarean or, for some women, a vaginal breech birth; both will be discussed with you.",
  },
  {
    q: "Can I have ECV after a previous caesarean?",
    a: "It can be considered after one previous caesarean; the evidence suggests it is reasonably safe, and the decision is made with a senior obstetrician. (RCOG GTG20)",
  },
];

// ─── GBS ANTIBIOTICS IN LABOUR ───────────────────────────────────────────────
// Source: RCOG Green-top Guideline No. 36 (2017) and the RCOG group B
// Streptococcus patient information.

export const GBS_PATIENT_FACTORS = [
  { id: "gbs_urine",     label: "GBS found in urine this pregnancy" },
  { id: "gbs_prev_baby", label: "Previous baby affected by GBS disease" },
  { id: "gbs_preterm",   label: "Labour before 37 weeks" },
];

export const GBS_RISK_SECTIONS = [
  {
    id: "gbs_risks",
    heading: "Risks and practical implications",
    type: "simple",
    items: [
      "Severe allergic reaction (anaphylaxis) to penicillin is rare; tell the team about any allergy so an alternative antibiotic can be planned. (RCOG GTG36)",
      "You will need a cannula (a small plastic tube in the hand or arm) during labour for the antibiotic doses.",
      "Birth in an obstetric unit is advised so the antibiotics can be given, which may affect plans for home or midwife-led birth. (RCOG GTG36)",
      "Possible effects of antibiotics on the baby's gut bacteria (microbiome) are uncertain; no long-term harm has been shown. (RCOG GTG36)",
      "Antibiotics in labour do not prevent late-onset GBS infection (after the first week), which is not related to labour.",
    ],
  },
];

export const GBS_BENEFITS = [
  {
    id: "gbs_reduction",
    name: "Greatly reduces the chance of early GBS infection",
    rate: "1 in 400 → 1 in 4,000",
    source: "RCOG GTG36",
    plain: "If GBS has been found and no antibiotics are given in labour, about 1 in 400 babies develops early-onset GBS infection. With intravenous antibiotics in labour, this falls to about 1 in 4,000.",
  },
  {
    id: "gbs_why_matters",
    name: "Protects against a serious infection",
    source: "RCOG GTG36",
    plain: "Most babies who develop early-onset GBS infection recover fully, but about 1 in 19 affected babies dies and about 1 in 14 of the survivors has a long-term disability. Preventing the infection avoids these outcomes.",
  },
];

export const GBS_PAGES = {
  what: {
    heading: "Antibiotics in Labour for GBS",
    body: "Group B Streptococcus (GBS) is a common bacterium carried by roughly 1 in 4 women. Carrying it is harmless to you and usually to the baby, but a small number of babies develop a serious infection around birth (early-onset GBS disease).\n\nIf GBS has been found in this pregnancy, or you have another reason for prophylaxis, you are offered antibiotics through a drip during labour:\n\n• A penicillin drip is started when labour begins or your waters break, and repeated at intervals until the baby is born; the exact drug and doses follow the obstetric antibiotics guideline.\n• Between doses you are not attached to the drip and can usually move around freely.\n• Ideally the first dose is given at least 4 hours before birth, so let the unit know as soon as labour starts.\n\nAfter birth, a well baby who received adequate prophylaxis needs no special tests or treatment.",
  },
  why: {
    heading: "Why is this being offered?",
    body: "Antibiotics in labour are offered when the chance of early-onset GBS infection is higher than average:\n\n• GBS found on a swab or in urine during this pregnancy\n• A previous baby who had GBS disease\n• Labour before 37 weeks\n\nEarly-onset GBS disease affects about 1 in 1,750 babies overall in the UK. Routine testing of all pregnant women is not currently recommended in the UK; antibiotics are targeted at higher-chance situations instead. (RCOG GTG36)",
  },
  alternatives: {
    heading: "Alternatives and your right to decline",
    body: "You have the right to decline antibiotics in labour. If you do:\n\n• Your baby will be observed closely for the first 12 hours after birth (at birth, then regularly), watching for early signs of infection so treatment can start promptly if needed. (RCOG GTG36)\n• You should know the warning signs after going home: poor feeding, unusual drowsiness or irritability, fast or noisy breathing, and a temperature that is high or low all need urgent review.\n\nThere is no tablet alternative in labour: antibiotics by mouth are not effective for preventing early-onset GBS disease, and antibiotics before labour do not prevent it either, because carriage returns.",
  },
};

export const GBS_FAQ = [
  {
    q: "Will I be stuck on a drip through labour?",
    a: "No. The antibiotic is given as short infusions at intervals; between doses the drip is disconnected and you can move around, use the shower, and labour normally.",
  },
  {
    q: "Can I still have a water birth?",
    a: "Often yes: the cannula can be capped and covered between doses. Policies vary, so ask your unit.",
  },
  {
    q: "I'm allergic to penicillin, what then?",
    a: "Tell the team. An alternative antibiotic is used depending on the nature of your allergy. (RCOG GTG36)",
  },
  {
    q: "What if my labour is too quick for the antibiotics?",
    a: "The first dose ideally runs at least 4 hours before birth, but a shorter interval still gives some protection. If the baby is born very soon after or before the dose, the baby is observed for 12 hours as a precaution.",
  },
  {
    q: "Do I need antibiotics for a planned caesarean?",
    a: "Not for GBS: if the caesarean happens before labour with the waters intact, the baby's risk of early-onset GBS disease is extremely low. You still receive the routine single dose of antibiotics that accompanies any caesarean. (RCOG GTG36)",
  },
  {
    q: "Will I carry GBS forever?",
    a: "Carriage comes and goes. Having GBS in this pregnancy makes carriage next time more likely but not certain; testing or antibiotics in a future pregnancy will be discussed at the time.",
  },
];

// ─── ECTOPIC PREGNANCY: TREATMENT CHOICE ─────────────────────────────────────
// Sources: local guideline CG623 (Ectopic Pregnancy: Medical Management, 2025),
// NICE NG126, RCOG GTG21. Methotrexate figures verbatim from CG623.

export const ECTOPIC_CONTEXT_OPTIONS = [
  { id: "methotrexate", label: "Methotrexate", description: "Injection, avoids surgery",  color: "text-orange-600",  dot: "bg-orange-500" },
  { id: "surgery",      label: "Surgery",      description: "Keyhole operation",          color: "text-red-600",     dot: "bg-red-500" },
  { id: "expectant",    label: "Expectant",    description: "Monitoring, no treatment",   color: "text-emerald-600", dot: "bg-emerald-500" },
];

export const ECTOPIC_PATIENT_FACTORS = [
  { id: "ect_prev_ectopic", label: "Previous ectopic pregnancy" },
  { id: "ect_single_tube",  label: "Only one fallopian tube" },
  { id: "ect_fertility",    label: "Future fertility a priority" },
];

export const ECTOPIC_RISK_SECTIONS = {
  methotrexate: [
    {
      id: "ect_mtx_risks",
      heading: "Risks and what to expect",
      type: "list",
      risks: [
        {
          id: "ect_mtx_pain",
          name: "Abdominal pain on days 3–7",
          freq: "VERY_COMMON",
          rate: "Up to 75 in 100",
          source: "CG623",
          plain: "Worsening abdominal pain on days 3–7 is common and thought to be due to tubal miscarriage; it usually lasts 4–12 hours. Attend the emergency department urgently if pain is severe or comes with dizziness or shoulder-tip pain.",
        },
        {
          id: "ect_mtx_hcg_rise",
          name: "Hormone level rises at first",
          freq: "VERY_COMMON",
          rate: "Up to 86 in 100",
          source: "CG623",
          plain: "The pregnancy hormone (bhCG) often rises between days 1 and 4 before falling. This is expected and does not mean the treatment has failed.",
        },
        {
          id: "ect_mtx_bleeding",
          name: "Vaginal bleeding",
          freq: "VERY_COMMON",
          rate: null,
          source: "CG623",
          plain: "Bleeding ranging from dark spotting to a heavier red loss can last from days to weeks. Contact the early pregnancy unit if it is heavy or concerning.",
        },
        {
          id: "ect_mtx_second_dose",
          name: "Second dose of methotrexate needed",
          freq: "COMMON",
          rate: "14 in 100",
          source: "CG623",
          plain: "About 14 in 100 women need more than one dose, decided from the day 4 and day 7 blood tests.",
        },
        {
          id: "ect_mtx_surgery",
          name: "Surgery needed after all",
          freq: "COMMON",
          rate: "10 in 100",
          source: "CG623",
          plain: "About 10 in 100 women go on to need surgery, either because the hormone level does not fall as expected or because the tube ruptures.",
        },
        {
          id: "ect_mtx_rupture",
          name: "Tubal rupture during follow-up",
          freq: "COMMON",
          rate: "7 in 100",
          source: "CG623",
          plain: "While any pregnancy hormone remains, the tube can still rupture; the risk is about 7 in 100. Severe pain, dizziness, fainting or shoulder-tip pain need emergency review, day or night.",
        },
      ],
    },
  ],
  surgery: [
    {
      id: "ect_surg_risks",
      heading: "Risks",
      type: "list",
      risks: [
        {
          id: "ect_surg_serious",
          name: "Serious complications of laparoscopy",
          freq: "UNCOMMON",
          rate: "2 in 1,000",
          source: "RCOG CA2",
          plain: "Serious complications of keyhole surgery, including damage to bowel, bladder or blood vessels, occur in about 2 in 1,000 procedures.",
        },
        {
          id: "ect_surg_open",
          name: "Conversion to open surgery",
          freq: "UNCOMMON",
          rate: null,
          source: "RCOG CA2",
          plain: "Occasionally the operation cannot be completed by keyhole, most often because of bleeding or adhesions, and a larger incision is needed.",
        },
        {
          id: "ect_surg_infection",
          name: "Wound infection or bruising",
          freq: "COMMON",
          rate: null,
          source: "RCOG CA2",
          plain: "Bruising and minor infection at the small incisions are common and usually settle with simple treatment.",
        },
        {
          id: "ect_surg_persistent",
          name: "Further treatment after salpingotomy",
          freq: "COMMON",
          rate: "Up to 1 in 5",
          source: "NICE NG126",
          conditions: ["ect_single_tube", "ect_fertility"],
          plain: "If the tube is opened and preserved (salpingotomy) rather than removed, up to 1 in 5 women need further treatment, methotrexate and/or later removal of the tube, because pregnancy tissue persists. Follow-up blood tests are needed.",
        },
      ],
    },
  ],
  expectant: [
    {
      id: "ect_exp_risks",
      heading: "Risks and practical implications",
      type: "simple",
      items: [
        "The tube can rupture at any point while pregnancy hormone remains; severe pain, dizziness, fainting or shoulder-tip pain need emergency review. (RCOG GTG21)",
        "If the hormone level plateaus or rises, treatment with methotrexate or surgery will be needed after all.",
        "Repeated blood tests over days to weeks are required, and you must be able to return quickly if unwell.",
        "Success rates vary with the starting hormone level; your team will quote the local figures for your situation.",
      ],
    },
  ],
};

export const ECTOPIC_BENEFITS = {
  methotrexate: [
    {
      id: "ect_mtx_success",
      name: "Usually avoids an operation",
      rate: "65–94 in 100",
      detail: "success, single dose",
      source: "CG623",
      plain: "A single dose resolves the ectopic in 65–94 in 100 cases. About 14 in 100 women need a second dose, and about 10 in 100 need surgery.",
    },
    {
      id: "ect_mtx_no_ga",
      name: "No surgery or general anaesthetic",
      source: "CG623",
      plain: "Treatment is a single injection into a muscle, with observation for up to an hour afterwards, avoiding an operation and anaesthetic.",
    },
    {
      id: "ect_mtx_fertility",
      name: "Future fertility is preserved",
      source: "CG623",
      plain: "The tube is not removed. Tubal patency afterwards is about 80 in 100, and there is no difference in later fertility rates between medical and surgical treatment.",
    },
  ],
  surgery: [
    {
      id: "ect_surg_definitive",
      name: "Definitive, immediate treatment",
      source: "NICE NG126",
      plain: "Surgery removes the ectopic pregnancy in one step, without weeks of blood-test follow-up, and is the recommended option when there is significant pain, a larger mass, a heartbeat in the ectopic, or a high hormone level.",
    },
    {
      id: "ect_surg_keyhole",
      name: "Keyhole surgery with quick recovery",
      source: "RCOG CA2",
      plain: "The operation is almost always laparoscopic, through small cuts, and most women go home the same day or the next day, returning to normal activities within 1–2 weeks.",
    },
    {
      id: "ect_surg_fertility",
      name: "Fertility is usually unaffected",
      source: "CG623",
      plain: "Even when a tube is removed, most women conceive naturally afterwards, and there is no difference in later fertility rates between surgical and medical treatment. If the other tube is damaged, opening and preserving the tube (salpingotomy) can be considered.",
    },
  ],
  expectant: [
    {
      id: "ect_exp_no_treatment",
      name: "No medication or surgery",
      source: "NICE NG126",
      plain: "For a small, unruptured ectopic with a low and falling hormone level, the body often resolves the pregnancy by itself; watching and waiting avoids the side effects of methotrexate and the risks of surgery.",
    },
    {
      id: "ect_exp_reversible",
      name: "Other options stay open",
      source: "NICE NG126",
      plain: "Expectant management is closely monitored with blood tests; if the hormone does not fall, methotrexate or surgery can still be used.",
    },
  ],
};

export const ECTOPIC_PAGES = {
  methotrexate: {
    what: {
      heading: "Methotrexate for Ectopic Pregnancy",
      body: "Methotrexate is a medicine that stops the pregnancy tissue growing, allowing the body to absorb it.\n\nWhat happens\n\n• A single injection into a muscle, with the dose calculated from your height and weight.\n• You rest for up to an hour afterwards and are checked before going home.\n• Blood tests on day 4 and day 7 check the pregnancy hormone (bhCG) is falling; if it falls well, weekly tests continue until it is back to normal. The average follow-up is about 35 days.\n• A second dose is needed in about 14 in 100 women.\n\nDuring follow-up\n\n• Avoid alcohol and vitamins containing folic acid, as they interfere with the treatment.\n• Avoid sexual intercourse until the ectopic has resolved, and avoid strong sunlight.\n• Avoid pregnancy for 3 months after the injection because of a possible effect on a new pregnancy; use barrier contraception.",
    },
    why: {
      heading: "Why is this an option for me?",
      body: "Methotrexate is offered when the ectopic pregnancy is suitable for medical treatment:\n\n• No significant pain and no signs of rupture\n• The mass is smaller than 35 mm with no heartbeat seen\n• The pregnancy hormone is below 5,000 IU/L (below 1,500, watching and waiting may also be possible)\n• Normal blood tests, and you can attend the follow-up appointments\n\nIf these are not met, for example there is significant pain, a heartbeat, or a higher hormone level, surgery is the recommended option instead. (CG623 · NICE NG126)",
    },
    alternatives: {
      heading: "Alternatives and your right to decline",
      body: "The choice between the treatment routes is yours, within what is safe for your situation:\n\n• Surgery: keyhole removal of the ectopic, usually with the tube; definitive and avoids weeks of follow-up. Recommended if you cannot attend follow-up or your results are borderline.\n• Expectant management: if your hormone level is low and falling, watching and waiting with blood tests may be possible.\n\nAn ectopic pregnancy cannot move to the womb or survive, and left entirely untreated it can rupture and become life-threatening, so some form of management and follow-up is always advised. Seek emergency help at any time for severe pain, dizziness, fainting or shoulder-tip pain.",
    },
  },
  surgery: {
    what: {
      heading: "Surgery for Ectopic Pregnancy",
      body: "Surgery removes the ectopic pregnancy through keyhole (laparoscopic) surgery under general anaesthetic.\n\nWhat happens\n\n• Small cuts are made in the abdomen; a camera and instruments are used to find and remove the ectopic pregnancy.\n• Usually the affected tube is removed with the pregnancy (salpingectomy). If your other tube is damaged or absent, the surgeon may instead open the tube, remove the pregnancy, and preserve the tube (salpingotomy).\n• The operation is usually a day case or one-night stay; most women return to normal activities within 1–2 weeks.\n• After salpingotomy, blood tests follow the hormone level down, because up to 1 in 5 women need further treatment.\n\nIf the ectopic has ruptured, the same operation is done urgently and open surgery is sometimes needed.",
    },
    why: {
      heading: "Why is this being recommended?",
      body: "Surgery is the recommended option when:\n\n• There is significant pain or evidence of bleeding inside the abdomen\n• The mass is 35 mm or larger, or a heartbeat is seen in the ectopic\n• The pregnancy hormone is above 5,000 IU/L\n• Medical treatment has failed, or follow-up attendance would be difficult\n\nIt may also simply be your preference after hearing the options; between 1,500 and 5,000 IU/L, national guidance offers a choice between methotrexate and surgery. (CG623 · NICE NG126)",
    },
    alternatives: {
      heading: "Alternatives and your right to decline",
      body: "Where your results allow, the alternatives are:\n\n• Methotrexate: a single injection, avoiding an operation, suitable when there is no significant pain, the mass is under 35 mm with no heartbeat, and the hormone level is under 5,000 IU/L\n• Expectant management: watching and waiting with blood tests, when the hormone level is low and falling\n\nIf there are signs of rupture or significant bleeding, surgery is the only safe option and is done urgently. An untreated ectopic pregnancy can rupture and become life-threatening, so some form of management is always advised.",
    },
  },
  expectant: {
    what: {
      heading: "Expectant Management of Ectopic Pregnancy",
      body: "Expectant management means close monitoring while the body resolves the ectopic pregnancy by itself, with no medication or surgery.\n\nWhat happens\n\n• Blood tests measure the pregnancy hormone (bhCG) repeatedly, typically every few days at first, then weekly until it returns to normal.\n• You must be able to return quickly if you become unwell, and to attend all the blood tests.\n• If the hormone level plateaus or rises, or symptoms develop, treatment moves to methotrexate or surgery.\n\nSeek emergency help immediately, day or night, for severe abdominal pain, dizziness or fainting, shoulder-tip pain, or heavy bleeding.",
    },
    why: {
      heading: "Why is this an option for me?",
      body: "Watching and waiting is considered when the ectopic appears to be resolving on its own:\n\n• You are well, with no significant pain\n• The ectopic is small and unruptured\n• The pregnancy hormone is low (below about 1,500 IU/L) and falling on repeat testing\n\nIn this situation many ectopics resolve without treatment, and monitoring simply confirms that is happening. (CG623 · NICE NG126)",
    },
    alternatives: {
      heading: "Alternatives and your right to decline",
      body: "If you would rather not wait, or waiting stops being safe:\n\n• Methotrexate: a single injection to resolve the ectopic, with blood-test follow-up\n• Surgery: keyhole removal, the definitive option and the recommended one if pain develops or the hormone level rises\n\nDeclining monitoring altogether is not recommended: an ectopic pregnancy can rupture while any pregnancy hormone remains, which is life-threatening. Whatever you choose, keep the emergency advice in mind and contact the early pregnancy unit with any concerns.",
    },
  },
};

export const ECTOPIC_FAQ = [
  {
    q: "Could the pregnancy still be saved?",
    a: "No. A pregnancy growing outside the womb can never move to the womb or survive, and it endangers your life as it grows. Treatment is about protecting you and your future fertility. Support is available, and it is normal to grieve this pregnancy.",
  },
  {
    q: "Will this affect my chances of having a baby?",
    a: "For most women, no. After methotrexate, the tube remains open in about 80 in 100 cases, and fertility rates are the same after medical and surgical treatment. Even after losing one tube, most women conceive naturally. (CG623)",
  },
  {
    q: "What are the chances it happens again?",
    a: "The risk of another ectopic pregnancy is about 10–20 in 100. In your next pregnancy, contact the early pregnancy unit for an early scan to confirm the pregnancy is in the womb. (CG623)",
  },
  {
    q: "When can we try again?",
    a: "After methotrexate, avoid pregnancy for 3 months because of a possible effect on a new pregnancy. After surgery or expectant management, your team will advise, often once you feel physically and emotionally ready and any follow-up is complete.",
  },
  {
    q: "Which symptoms are an emergency?",
    a: "Severe abdominal pain, feeling faint or dizzy, shoulder-tip pain, or heavy bleeding. These can mean the tube has ruptured; go to the emergency department immediately, day or night.",
  },
];

// ─── LLETZ (COLPOSCOPY TREATMENT) ────────────────────────────────────────────
// Source: NHSCSP colposcopy guidance (in-app NHSCSP20 guide). Bleeding and
// aftercare advice is standard patient information; verify against the local
// leaflet.

export const LLETZ_PATIENT_FACTORS = [
  { id: "lletz_future_preg", label: "Planning pregnancy in future" },
  { id: "lletz_repeat",      label: "Repeat (second) treatment" },
];

export const LLETZ_RISK_SECTIONS = [
  {
    id: "lletz_common",
    heading: "Common effects",
    type: "list",
    risks: [
      {
        id: "lletz_bleeding",
        name: "Bleeding and discharge for a few weeks",
        freq: "VERY_COMMON",
        rate: null,
        source: "Patient info (verify local)",
        plain: "Light bleeding and a watery, sometimes dark discharge are expected for up to about 4 weeks while the cervix heals. Contact the clinic if bleeding becomes heavier than a period or smells offensive.",
      },
      {
        id: "lletz_pain",
        name: "Period-like cramping",
        freq: "VERY_COMMON",
        rate: null,
        source: "Patient info (verify local)",
        plain: "Cramping on the day of treatment is common and usually settles with simple pain relief.",
      },
      {
        id: "lletz_infection",
        name: "Infection",
        freq: "COMMON",
        rate: null,
        source: "Patient info (verify local)",
        plain: "Infection of the healing cervix can occur, causing offensive discharge, heavier bleeding or pain, and is treated with antibiotics.",
      },
    ],
  },
  {
    id: "lletz_future",
    heading: "Future pregnancy and follow-up",
    type: "simple",
    items: [
      "LLETZ is associated with an increased risk of preterm birth in future pregnancies; excision deeper than 10 mm roughly triples the risk of spontaneous preterm birth, and repeat excisions multiply the risk further. The colposcopist limits the depth where possible. (NHSCSP20)",
      "Preconception counselling is advised after deep or repeat excisions. (NHSCSP20)",
      "Narrowing of the cervix (stenosis) can occasionally occur and make future smears or periods more difficult.",
      "If the margins of the removed tissue are not clear, options range from the routine test of cure to re-excision, decided with you. (NHSCSP20)",
      "A test of cure smear is taken 6 months after treatment; if it is normal and HPV negative, you return to routine recall. (NHSCSP20)",
    ],
  },
];

export const LLETZ_BENEFITS = [
  {
    id: "lletz_cure",
    name: "Treats the abnormality in one visit",
    rate: "≈95 in 100",
    detail: "cure at first treatment",
    source: "NHSCSP20",
    plain: "LLETZ cures CIN2/3 in about 95 in 100 women at the first treatment, removing the abnormal cells before they can ever become a cancer.",
  },
  {
    id: "lletz_quick",
    name: "Quick, outpatient, awake",
    source: "NHSCSP20",
    plain: "The treatment takes a few minutes in the colposcopy clinic under local anaesthetic; most women go straight home and return to work the same or next day.",
  },
  {
    id: "lletz_histology",
    name: "The tissue is fully examined",
    source: "NHSCSP20",
    plain: "Unlike heat-destruction (ablative) treatments, LLETZ removes the tissue intact so the laboratory can confirm the diagnosis and check the abnormality has been completely removed.",
  },
];

export const LLETZ_PAGES = {
  what: {
    heading: "LLETZ (Large Loop Excision)",
    body: "LLETZ removes the area of the cervix containing abnormal cells (the transformation zone) using a thin heated wire loop.\n\nWhat happens\n\n• It is usually done in the colposcopy clinic while you are awake. A speculum is passed, as for a smear, and the colposcope (a magnifying camera that stays outside the body) is used to see the cervix.\n• Local anaesthetic is injected into the cervix; this can sting briefly and may make your heart flutter for a moment.\n• The loop removes the abnormal area in a few seconds to minutes. You may notice a warm sensation and hear the equipment, but should not feel pain.\n• The removed tissue is sent to the laboratory; the depth of the excision is kept to what is needed, usually no more than 10–12 mm where possible.\n\nAfterwards\n\n• Expect light bleeding and discharge for a few weeks. To reduce the chance of infection, avoid tampons, swimming and sex for about 4 weeks (follow your local leaflet).\n• Results arrive by letter, and a test of cure smear follows at 6 months.",
  },
  why: {
    heading: "Why is this being recommended?",
    body: "LLETZ is offered when colposcopy has found high-grade abnormal cells (CIN2 or CIN3) on the cervix. These are not cancer, but without treatment they carry a significant risk of developing into cervical cancer over years. CIN3 should always be treated rather than watched.\n\nRemoving the transformation zone removes the abnormal cells, and the laboratory then confirms the diagnosis and whether the removal is complete. (NHSCSP20)",
  },
  alternatives: {
    heading: "Alternatives and your right to decline",
    body: "The right option depends on the grade of abnormality:\n\n• For low-grade change (CIN1), surveillance is usually preferred: many CIN1 changes regress on their own, and treatment is discussed only if it persists at 24 months. (NHSCSP20)\n• Ablative treatment (destroying rather than removing the area) is suitable in selected cases, but needs an adequate biopsy first and leaves no tissue for the laboratory. (NHSCSP20)\n• For high-grade change (CIN2/3), declining treatment means accepting a significant risk of progression to cervical cancer over time; if you are considering this, discuss the specific risks in your case with the colposcopist, and keep under close surveillance.\n\nWhatever you decide, you remain in the screening programme and your decision will be respected.",
  },
};

export const LLETZ_FAQ = [
  {
    q: "Does it hurt?",
    a: "The local anaesthetic injection stings briefly; after that most women feel pressure or warmth rather than pain, with period-like cramping afterwards. Tell the colposcopist if you are uncomfortable; treatment under general anaesthetic can be arranged if needed.",
  },
  {
    q: "Do I have cancer?",
    a: "No. CIN is not cancer; it means some cells on the cervix could become cancer over years if untreated. Treating them now is precisely how screening prevents cancer.",
  },
  {
    q: "Can I still have children afterwards?",
    a: "Yes. LLETZ does not affect fertility. There is an increased risk of preterm birth in future pregnancies, mainly after deep or repeated excisions, so tell your midwife about the treatment when you are pregnant. (NHSCSP20)",
  },
  {
    q: "What should I avoid afterwards?",
    a: "Tampons, swimming and sex for about 4 weeks, to let the cervix heal and reduce the chance of infection. Follow your local leaflet, and contact the clinic for heavy or offensive bleeding.",
  },
  {
    q: "What happens after the results?",
    a: "The letter confirms the diagnosis and whether the edges of the removed tissue were clear. Nearly everyone then has a test of cure smear at 6 months; if it is normal and HPV negative, you go back to routine screening. (NHSCSP20)",
  },
];

// ─── ASPIRIN FOR PRE-ECLAMPSIA PREVENTION ────────────────────────────────────
// Source: NICE NG133 (Hypertension in pregnancy). Qualitative benefit framing;
// NG133 does not give a single patient-facing effect size.

export const ASPIRIN_PATIENT_FACTORS = [
  { id: "asp_prev_pet",    label: "Previous pre-eclampsia or pregnancy hypertension" },
  { id: "asp_ckd",         label: "Chronic kidney disease" },
  { id: "asp_autoimmune",  label: "Autoimmune disease (SLE / antiphospholipid syndrome)" },
  { id: "asp_diabetes",    label: "Type 1 or type 2 diabetes" },
  { id: "asp_htn",         label: "Chronic hypertension" },
  { id: "asp_first_preg",  label: "First pregnancy (moderate factor)" },
  { id: "asp_age40",       label: "Age 40 or over (moderate factor)" },
  { id: "asp_interval",    label: "More than 10 years since last pregnancy (moderate factor)" },
  { id: "asp_bmi35",       label: "BMI 35 or more at booking (moderate factor)" },
  { id: "asp_fh",          label: "Mother or sister had pre-eclampsia (moderate factor)" },
  { id: "asp_multiple",    label: "Multiple pregnancy (moderate factor)" },
];

export const ASPIRIN_RISK_SECTIONS = [
  {
    id: "asp_risks",
    heading: "Risks and practical points",
    type: "simple",
    items: [
      "Low-dose aspirin (75–150 mg) is recommended by NICE in pregnancy for this purpose; it is different from the higher doses used for pain relief, which should be avoided. (NICE NG133)",
      "Indigestion or heartburn can occur; taking the tablet with food helps.",
      "Aspirin can slightly increase minor bruising or bleeding. Mention it to any clinician treating you, and to the anaesthetist if you need one.",
      "Tell the team about asthma triggered by aspirin, previous stomach ulcers, or aspirin allergy; an individual decision is made in those cases.",
      "Aspirin reduces the chance of pre-eclampsia but does not remove it, so your blood pressure and urine are still checked at every antenatal visit.",
    ],
  },
];

export const ASPIRIN_BENEFITS = [
  {
    id: "asp_prevention",
    name: "Reduces the chance of pre-eclampsia",
    source: "NICE NG133",
    plain: "In higher-risk pregnancies, low-dose aspirin started from 12 weeks reduces the likelihood of developing pre-eclampsia, particularly the earlier, more severe form. This is why NICE recommends it for your risk profile.",
  },
  {
    id: "asp_downstream",
    name: "Protects against pre-eclampsia's complications",
    source: "NICE NG133",
    plain: "Preventing pre-eclampsia also prevents what follows from it: severe hypertension, effects on the baby's growth, early induced or caesarean birth, and admission to the neonatal unit.",
  },
  {
    id: "asp_simple",
    name: "One small tablet a day",
    source: "NICE NG133",
    plain: "The treatment is a single low-dose tablet daily from 12 weeks until birth, with no routine extra monitoring needed because of the aspirin itself.",
  },
];

export const ASPIRIN_PAGES = {
  what: {
    heading: "Aspirin to Prevent Pre-eclampsia",
    body: "Pre-eclampsia is a condition of the second half of pregnancy involving high blood pressure and effects on organs such as the kidneys, and on the placenta. Low-dose aspirin helps the placenta establish and function better, which is why it is started early.\n\nThe practical details\n\n• The dose is 75–150 mg once daily; your unit will specify which (check your local policy).\n• Start from 12 weeks of pregnancy, and continue every day until the baby is born.\n• Take it at whatever time of day you will remember, with food if it upsets your stomach.\n• It is prescribed for this purpose in pregnancy even though the packet may say otherwise; this is a recommended, evidence-based use. (NICE NG133)",
  },
  why: {
    heading: "Why is this being offered to me?",
    body: "NICE recommends aspirin for women with any one high-risk factor, or two or more moderate-risk factors:\n\nHigh-risk factors (one is enough)\n\n• Pre-eclampsia or hypertension in a previous pregnancy\n• Chronic kidney disease\n• Autoimmune disease (SLE or antiphospholipid syndrome)\n• Type 1 or type 2 diabetes\n• Chronic hypertension\n\nModerate-risk factors (two or more)\n\n• First pregnancy · age 40 or over · more than 10 years since the last pregnancy · BMI 35 or more at booking · mother or sister had pre-eclampsia · multiple pregnancy\n\n(NICE NG133)",
  },
  alternatives: {
    heading: "Alternatives and your right to decline",
    body: "You can decline aspirin; it is your decision, and your antenatal care does not change either way.\n\n• There is no alternative medicine recommended for routine prevention. Calcium supplements are suggested only for women with a low dietary calcium intake, and vitamin C and E supplements do not work and are not recommended. (NICE NG133)\n• If you decline, the emphasis falls on surveillance: blood pressure and urine checks at every visit pick up pre-eclampsia early so it can be managed.\n\nKnow the symptoms that need same-day review at any point: severe headache, visual disturbance, pain below the ribs, sudden swelling of the face, hands or feet, or reduced fetal movements.",
  },
};

export const ASPIRIN_FAQ = [
  {
    q: "Is aspirin safe for my baby?",
    a: "At this low dose, aspirin is recommended by NICE in pregnancy and is in wide use for this purpose. The doses to avoid in pregnancy are the higher, pain-relief doses. (NICE NG133)",
  },
  {
    q: "What if I forget a dose?",
    a: "Take the next dose as normal; do not double up. The benefit comes from regular use over months, so a single missed tablet does not undo it.",
  },
  {
    q: "I'm already past 12 weeks, is it too late to start?",
    a: "No. Start as soon as the recommendation is made; earlier is better, but there is still benefit later in pregnancy. Discuss timing with your midwife or doctor.",
  },
  {
    q: "Does taking aspirin guarantee I won't get pre-eclampsia?",
    a: "No. It reduces the chance but does not remove it, which is why your blood pressure and urine are still checked at every visit, and why you should report warning symptoms promptly.",
  },
  {
    q: "When do I stop taking it?",
    a: "NICE advises continuing until the baby is born. If a planned birth is scheduled, your team will confirm the plan for the final doses. (NICE NG133)",
  },
];

// ─── PROCEDURE LIST ───────────────────────────────────────────────────────────

export const CONSENT_PROCEDURES = [
  {
    id: "CS",
    title: "Caesarean Section",
    subtypes: "Elective · Emergency",
    source: "NICE NG192 · RCOG CA14",
    color: { accent: "bg-teal-500", text: "text-teal-700" },
    pdfs: [
      { label: "NICE NG192", file: "NG192.pdf" },
      { label: "NG192 Appendix A", file: "NG192-appendix-a.pdf" },
      { label: "RCOG CA12", file: "CA12.pdf" },
    ],
  },
  {
    id: "OVD",
    title: "Instrumental Delivery",
    subtypes: "Forceps · Ventouse",
    source: "RCOG GTG26",
    color: { accent: "bg-blue-500", text: "text-blue-700" },
    pdfs: [],
  },
  {
    id: "IOL",
    title: "Induction of Labour",
    subtypes: "Sweep · Prostaglandin · Balloon · ARM+Oxytocin",
    source: "NICE NG207",
    color: { accent: "bg-fuchsia-500", text: "text-fuchsia-700" },
    pdfs: [
      { label: "NICE NG207", file: "NG207.pdf" },
    ],
  },
  {
    id: "SURG_MISC",
    title: "Surgical Miscarriage",
    subtypes: "EVA · MVA",
    source: "RCOG CA10",
    color: { accent: "bg-rose-500", text: "text-rose-700" },
    pdfs: [],
  },
  {
    id: "MED_MISC",
    title: "Medical Miscarriage",
    subtypes: "Misoprostol",
    source: "RCOG GTG25",
    color: { accent: "bg-pink-500", text: "text-pink-700" },
    pdfs: [],
  },
  {
    id: "LAPAROSCOPY",
    title: "Diagnostic Laparoscopy",
    subtypes: "General anaesthetic",
    source: "RCOG CA2",
    color: { accent: "bg-amber-500", text: "text-amber-700" },
    pdfs: [
      { label: "RCOG CA2", file: "CA2.pdf" },
    ],
  },
  {
    id: "HYSTEROSCOPY",
    title: "Hysteroscopy",
    subtypes: "Diagnostic · Operative",
    source: "RCOG CA1 · GTG59",
    color: { accent: "bg-violet-500", text: "text-violet-700" },
    pdfs: [
      { label: "RCOG CA1", file: "CA1.pdf" },
      { label: "GTG59", file: "GTG59.pdf" },
    ],
  },
  {
    id: "ACS",
    title: "Antenatal Corticosteroids",
    subtypes: "Preterm · Late preterm · Term CS · Rescue",
    source: "RCOG GTG (Stock 2022)",
    color: { accent: "bg-sky-500", text: "text-sky-700" },
    pdfs: [
      {
        label: "RCOG GTG (ACS)",
        url: "/guidelines/BJOG - 2022 - Stock - Antenatal corticosteroids to reduce neonatal morbidity and mortality.pdf",
      },
    ],
  },
  {
    id: "VBAC",
    title: "Birth After Caesarean (VBAC)",
    subtypes: "Planned VBAC · Repeat caesarean",
    source: "RCOG GTG45",
    color: { accent: "bg-emerald-500", text: "text-emerald-700" },
    pdfs: [],
  },
  {
    id: "ECV",
    title: "External Cephalic Version (ECV)",
    subtypes: "Turning a breech baby",
    source: "RCOG GTG20",
    color: { accent: "bg-indigo-500", text: "text-indigo-700" },
    pdfs: [],
  },
  {
    id: "GBS",
    title: "GBS Antibiotics in Labour",
    subtypes: "Group B Streptococcus prophylaxis",
    source: "RCOG GTG36",
    color: { accent: "bg-green-500", text: "text-green-700" },
    pdfs: [],
  },
  {
    id: "ECTOPIC",
    title: "Ectopic Pregnancy",
    subtypes: "Methotrexate · Surgery · Expectant",
    source: "CG623 · NICE NG126",
    color: { accent: "bg-orange-500", text: "text-orange-700" },
    pdfs: [],
  },
  {
    id: "LLETZ",
    title: "LLETZ (Cervical Treatment)",
    subtypes: "Large loop excision",
    source: "NHSCSP20",
    color: { accent: "bg-cyan-500", text: "text-cyan-700" },
    pdfs: [],
  },
  {
    id: "ASPIRIN",
    title: "Aspirin (Pre-eclampsia Prevention)",
    subtypes: "75–150 mg from 12 weeks",
    source: "NICE NG133",
    color: { accent: "bg-blue-500", text: "text-blue-700" },
    pdfs: [],
  },
];

