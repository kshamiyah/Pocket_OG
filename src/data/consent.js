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
      body: "A caesarean section is an operation to deliver your baby through a cut made in your abdomen and womb. It is performed in an operating theatre.\n\nMost planned caesareans are done under a spinal anaesthetic — you are awake but numb from the waist down and will not feel pain. Your birth partner is usually able to be present.\n\nThe operation itself takes around 40–50 minutes. Your baby is usually delivered within the first 10 minutes.",
    },
    why: {
      heading: "Why is this being recommended?",
      body: "A planned caesarean is recommended when vaginal birth is considered to carry a higher risk for you or your baby than surgical delivery. The specific reason will have been discussed with your consultant.\n\nCommon reasons include: placenta praevia, previous caesarean sections, breech presentation, or maternal preference following counselling about the risks and benefits of each mode of delivery.",
    },
    decline: {
      heading: "If you decide not to proceed",
      body: "You have the right to decline a caesarean section. No procedure can be performed without your consent.\n\nIf you decline, your doctor will discuss the alternative options available to you, which may include a planned vaginal birth, induction of labour, or continued monitoring — depending on your clinical situation.\n\nYour doctor will explain the specific risks of not proceeding in your case. Please ask any questions you have before making your decision.",
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
    decline: {
      heading: "If you decide not to proceed",
      body: "You have the right to decline any procedure, including an emergency caesarean, provided you have the capacity to make that decision.\n\nYour doctor will clearly explain what the risks to you and your baby are if delivery does not happen urgently. This is important information for your decision.\n\nIf you have questions or concerns, please say so now — the team will take the time to answer them.",
    },
  },
};

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
    decline: {
      heading: "If you decide not to proceed",
      body: "You have the right to decline an instrumental delivery.\n\nYour doctor will explain the alternative options — which may include continuing to push, or proceeding directly to a caesarean section — and the risks associated with each, so you can make an informed decision.\n\nPlease ask any questions you have before deciding.",
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
    decline: {
      heading: "If you decide not to proceed",
      body: "You have the right to decline an instrumental delivery.\n\nYour doctor will explain the alternative options — which may include continuing to push, or proceeding directly to a caesarean section — and the risks associated with each, so you can make an informed decision.\n\nPlease ask any questions you have before deciding.",
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

export const SURG_MISC_PAGES = {
  what: {
    heading: "Surgical Management of Miscarriage",
    body: "Surgical management of miscarriage involves a procedure to remove the pregnancy tissue from the uterus. This is performed using vacuum aspiration — either electric (EVA) or manual (MVA) — under general or local anaesthetic. The procedure typically takes 5–15 minutes.\n\nSharp curettage (scraping) is no longer used routinely. You will usually be able to go home the same day.",
  },
  why: {
    heading: "Why is this being recommended?",
    body: "Surgical management may be recommended when:\n\n• There is heavy or persistent bleeding from retained pregnancy tissue\n• The pregnancy has not passed on its own (missed miscarriage)\n• Expectant or medical management has not been successful\n• There are signs of infection with retained tissue\n• You are haemodynamically unstable\n• It is your preference after being counselled about all three options (expectant, medical, and surgical)",
  },
  decline: {
    heading: "If you decide not to proceed",
    body: "You have the right to decline surgical management.\n\nAlternatives include:\n\n• Expectant management — waiting for the tissue to pass naturally (successful in around 50–80% of women within 2 weeks)\n• Medical management — misoprostol tablets to stimulate the uterus to empty (successful in around 85 in 100 women)\n\nIf you decline all treatment, retained products carry ongoing risk of bleeding, infection, and rarely coagulopathy. Your team will explain what to watch for and how to access help.",
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

export const MED_MISC_PAGES = {
  what: {
    heading: "Medical Management of Miscarriage",
    body: "Medical management of miscarriage uses a tablet called misoprostol to help your uterus contract and expel the pregnancy tissue. The standard dose is 800 micrograms given vaginally (inserted in the vagina) — this can be self-administered at home in many units.\n\nBleeding and cramping usually begin within a few hours and the process typically takes 24–48 hours. A follow-up ultrasound scan is arranged 1–2 weeks later to confirm the uterus is empty.",
  },
  why: {
    heading: "Why is this being recommended?",
    body: "Medical management may be recommended when:\n\n• You have a missed miscarriage (the pregnancy has stopped developing but has not passed)\n• You have an incomplete miscarriage and prefer medication to surgery\n• Expectant management has not been successful\n• You wish to avoid a surgical procedure and general anaesthetic\n\nMisoprostol is successful in approximately 85 in 100 women. If treatment is not complete, a further dose of medication or a surgical procedure may be needed.",
  },
  decline: {
    heading: "If you decide not to proceed",
    body: "You have the right to decline medical management.\n\nAlternatives include:\n\n• Expectant management — waiting for the tissue to pass naturally (successful in around 50–80% of women within 2 weeks)\n• Surgical management — vacuum aspiration to remove the tissue under local or general anaesthetic (success rate approximately 95–99%)\n\nIf you decline all treatment, retained products carry ongoing risk of bleeding, infection, and rarely coagulopathy. Your team will advise on what to watch for.",
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

export const LAPAROSCOPY_PAGES = {
  what: {
    heading: "Diagnostic Laparoscopy",
    body: "Diagnostic laparoscopy is a minimally invasive surgical procedure performed under general anaesthetic. A thin telescope (laparoscope) is inserted through a small incision, usually at the umbilicus, to directly inspect the pelvic and abdominal organs.\n\nCarbon dioxide gas is used to inflate the abdomen and create a working space. Additional small incisions (ports) may be made to allow instruments to be passed to move structures during the examination.\n\nThe procedure usually takes 15–30 minutes. Most women go home the same day.",
  },
  why: {
    heading: "Why is this being recommended?",
    body: "A diagnostic laparoscopy may be recommended to investigate:\n\n• Pelvic pain (acute or chronic)\n• Suspected endometriosis\n• Suspected pelvic inflammatory disease\n• Infertility — including tubal patency testing (dye test)\n• Adnexal (ovarian) masses\n• Suspected ectopic pregnancy\n\nLaparoscopy allows direct visualisation of the pelvis and is more accurate than imaging alone for conditions such as endometriosis and adhesions.",
  },
  decline: {
    heading: "If you decide not to proceed",
    body: "You have the right to decline this procedure.\n\nAlternatives that may provide some information include:\n\n• Transvaginal ultrasound\n• MRI of the pelvis\n• Empirical medical treatment (e.g. for suspected endometriosis)\n• HSG (dye test via X-ray) for tubal assessment\n\nHowever, these cannot replace the direct visualisation that laparoscopy provides. Some conditions — particularly peritoneal endometriosis and pelvic adhesions — can only be reliably diagnosed laparoscopically.",
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
    decline: {
      heading: "If you decide not to proceed",
      body: "You have the right to decline this procedure.\n\nAlternatives include:\n\n• Transvaginal ultrasound — useful first-line test but may miss small or flat intrauterine lesions\n• Saline infusion sonography (SIS) — can identify polyps and fibroids\n• Endometrial biopsy (Pipelle) — samples the lining but has a miss rate of up to 30% for focal lesions\n\nIf you decline, intrauterine pathology may go undiagnosed and treatment cannot be tailored to a confirmed diagnosis.",
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
    decline: {
      heading: "If you decide not to proceed",
      body: "You have the right to decline this procedure.\n\nAlternatives depend on your condition:\n\n• Medical management (e.g. hormonal treatment for heavy bleeding)\n• Endometrial ablation (for bleeding, if fertility is not required)\n• Observation — for small polyps that may resolve spontaneously\n• Open or laparoscopic surgery for larger fibroids not accessible hysteroscopically\n\nUntreated intrauterine pathology may continue to cause symptoms and, in some cases, may affect fertility.",
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
    decline: {
      heading: "If you decide not to proceed",
      body: "You have the right to decline a membrane sweep, and your decision will be respected.\n\nIf you decline, your usual antenatal care will continue and the options of formal induction or expectant management can be discussed at later appointments. (NICE NG207 §1.1.5)",
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
    decline: {
      heading: "If you decide not to proceed",
      body: "You have the right to decide not to proceed with induction, to delay it, or to stop the process at any stage — even if the healthcare team disagrees with the decision. (NICE NG207 §1.1.5)\n\nThe alternative options — expectant management with additional fetal monitoring, or planned caesarean birth — will be discussed with you. Your decision will be recorded in your notes.",
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
    decline: {
      heading: "If you decide not to proceed",
      body: "You have the right to decline mechanical induction. The alternatives — expectant management with monitoring, or planned caesarean birth — will be discussed with you. (NICE NG207 §1.1.5, §1.2.18)\n\nYour decision will be recorded in your notes.",
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
    decline: {
      heading: "If you decide not to proceed",
      body: "You can choose to have the ARM only and delay or decline the oxytocin infusion. You can also stop the induction process at any stage. (NICE NG207 §1.1.5, §1.3.10)\n\nThe alternative options — expectant management or caesarean birth — will be discussed with you and your decision recorded.",
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
    id: "SURG_MISC",
    title: "Surgical Miscarriage",
    subtypes: "EVA · MVA",
    source: "RCOG CA10",
    color: { accent: "bg-rose-500", text: "text-rose-700" },
  },
  {
    id: "MED_MISC",
    title: "Medical Miscarriage",
    subtypes: "Misoprostol",
    source: "RCOG GTG25",
    color: { accent: "bg-pink-500", text: "text-pink-700" },
  },
  {
    id: "LAPAROSCOPY",
    title: "Diagnostic Laparoscopy",
    subtypes: "General anaesthetic",
    source: "RCOG CA2",
    color: { accent: "bg-amber-500", text: "text-amber-700" },
  },
  {
    id: "HYSTEROSCOPY",
    title: "Hysteroscopy",
    subtypes: "Diagnostic · Operative",
    source: "RCOG CA1 · GTG59",
    color: { accent: "bg-violet-500", text: "text-violet-700" },
  },
];

