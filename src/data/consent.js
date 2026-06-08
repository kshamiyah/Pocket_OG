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

// Absolute CS risks from NICE NG192 Appendix A (2021)
export const CS_RISK_SECTIONS = [
  {
    id: "cs_maternal",
    heading: "Risks to you",
    type: "list",
    risks: [
      {
        id: "hysterectomy",
        name: "Peripartum hysterectomy",
        freq: "UNCOMMON",
        rate: "About 200 per 100,000 (1 in 500)",
        source: "NICE NG192",
        plain: "Very rarely, heavy bleeding cannot be controlled and the uterus needs to be removed. This would mean you could not have further pregnancies.",
      },
      {
        id: "maternal_death",
        name: "Maternal death",
        freq: "RARE",
        rate: "About 25 per 100,000 (1 in 4,000)",
        source: "NICE NG192",
        plain: "Death from caesarean section is very rare. The theatre team is trained to manage serious complications.",
      },
      {
        id: "urinary_incontinence",
        name: "Urinary incontinence >1 year after birth",
        freq: "VERY_COMMON",
        rate: "About 19,600 per 100,000 (1 in 5)",
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
      {
        id: "wound_infection",
        name: "Wound infection",
        freq: "COMMON",
        rate: "Up to 1 in 10",
        source: "RCOG CA7",
        plain: "Infection of the abdominal wound or uterus is common. It is usually treated with antibiotics. Prophylactic antibiotics are given routinely at the time of surgery.",
      },
      {
        id: "bladder_injury",
        name: "Bladder injury",
        freq: "UNCOMMON",
        rate: "1 in 1,000",
        source: "RCOG CA7",
        plain: "Injury to the bladder can occur, particularly if there has been a previous caesarean or other pelvic surgery. It usually requires repair at the time of the operation.",
      },
      {
        id: "vte",
        name: "Thromboembolic disease (DVT / PE)",
        freq: "RARE",
        rate: null,
        source: "RCOG CA7",
        plain: "Blood clots in the legs (DVT) or lungs (PE) are a risk after any major surgery. Preventative measures including compression stockings and blood-thinning injections are used routinely.",
      },
      {
        id: "readmission",
        name: "Readmission to hospital",
        freq: "COMMON",
        rate: "1 in 14",
        source: "RCOG CA7",
        plain: "Some women need to be readmitted to hospital after discharge, most commonly for infection or wound problems.",
      },
    ],
  },
  {
    id: "cs_baby",
    heading: "Risks to your baby",
    type: "list",
    risks: [
      {
        id: "fetal_laceration",
        name: "Accidental fetal laceration",
        freq: "COMMON",
        rate: "1–2 in 100",
        source: "RCOG CA7",
        plain: "A small cut to the baby's skin can occasionally occur when the uterus is opened. Usually minor and heals without complication.",
      },
      {
        id: "respiratory_morbidity",
        name: "Transient tachypnoea of the newborn (TTN)",
        freq: "COMMON",
        rate: null,
        source: "RCOG CA7",
        plain: "Babies born by elective caesarean before labour have a higher risk of breathing difficulties in the first hours after birth, as the fluid in their lungs has not been expelled during labour. Usually self-limiting and managed in a neonatal unit if needed.",
      },
      {
        id: "nicu_admission",
        name: "Neonatal unit admission",
        freq: "COMMON",
        rate: null,
        source: "RCOG CA7",
        plain: "Babies born by caesarean are more likely to be admitted to a neonatal unit, often for observation of breathing. The risk is higher with elective caesarean before 39 weeks.",
      },
      {
        id: "neonatal_mortality",
        name: "Neonatal mortality",
        freq: "RARE",
        rate: "About 58 per 100,000 (1 in 1,700)",
        source: "NICE NG192",
        plain: "Neonatal death following caesarean is rare. These figures reflect the overall population including cases where caesarean was performed because of serious complications.",
      },
      {
        id: "asthma",
        name: "Childhood asthma",
        freq: "COMMON",
        rate: "About 1,809 per 100,000 (1 in 55)",
        source: "NICE NG192",
        plain: "There is a small increase in the risk of childhood asthma in babies born by caesarean. The reason is not fully understood but may relate to differences in gut microbiome colonisation.",
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
        freq: "UNCOMMON",
        rate: "About 200 per 100,000 (1 in 500)",
        source: "NICE NG192",
        plain: "The scar on your womb can occasionally open during a future labour. Future pregnancies will be monitored more closely as a result.",
      },
      {
        id: "placenta_accreta_future",
        name: "Placenta accreta in future pregnancy",
        freq: "RARE",
        rate: "About 100 per 100,000 (1 in 1,000)",
        source: "NICE NG192",
        plain: "The placenta can grow into the caesarean scar in a future pregnancy, which can cause severe bleeding and may require hysterectomy.",
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
    type: "simple",
    source: "RCOG Consent Advice No. 12 (2010)",
    items: ["Admission to intensive care", "Infection", "Blood transfusion"],
  },
  {
    id: "frequent_fetal_pp",
    heading: "Frequent risks — Fetal",
    type: "simple",
    source: "RCOG Consent Advice No. 12 (2010)",
    items: ["Admission to neonatal intensive care"],
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
export const OVD_RISK_SECTIONS = [
  {
    id: "serious_maternal",
    heading: "Serious risks — Maternal",
    type: "list",
    source: "RCOG Consent Advice No. 11 (2010)",
    risks: [
      {
        id: "third_fourth_degree",
        name: "3rd and 4th degree perineal tear",
        source: "RCOG CA11",
        byInstrument: {
          ventouse: { freq: "COMMON",      rate: "1–4 in 100" },
          forceps:  { freq: "VERY_COMMON", rate: "8–12 in 100" },
        },
        plain: "A tear that extends into or through the anal sphincter. Repaired by a specialist surgeon. Can cause short-term bowel symptoms in some women.",
      },
      {
        id: "vaginal_vulval_tear",
        name: "Extensive or significant vaginal/vulval tear",
        source: "RCOG CA11",
        byInstrument: {
          ventouse: { freq: "VERY_COMMON", rate: "1 in 10" },
          forceps:  { freq: "VERY_COMMON", rate: "1 in 5" },
        },
        plain: "A significant tear to the vaginal area requiring repair with stitches.",
      },
    ],
  },
  {
    id: "serious_fetal",
    heading: "Serious risks — Fetal",
    type: "list",
    source: "RCOG Consent Advice No. 11 (2010)",
    risks: [
      {
        id: "subgaleal",
        name: "Subgaleal haematoma",
        freq: "UNCOMMON",
        rate: "3–6 in 1,000",
        source: "RCOG CA11",
        plain: "Serious bleeding beneath the scalp aponeurosis. Rarer than cephalhaematoma but can be significant. The baby will be closely monitored after delivery.",
      },
      {
        id: "intracranial",
        name: "Intracranial haemorrhage",
        freq: "UNCOMMON",
        rate: "5–15 in 10,000",
        source: "RCOG CA11",
        plain: "Bleeding inside the skull. Uncommon but serious — the baby would need specialist neonatal review.",
      },
      {
        id: "facial_nerve",
        name: "Facial nerve palsy",
        freq: "RARE",
        rate: null,
        source: "RCOG CA11",
        plain: "Temporary weakness of the muscles on one side of the baby's face. Usually resolves within a few weeks.",
      },
    ],
  },
  {
    id: "frequent_maternal",
    heading: "Frequent risks — Maternal",
    type: "list",
    source: "RCOG Consent Advice No. 11 (2010)",
    risks: [
      {
        id: "pph",
        name: "Postpartum haemorrhage",
        freq: "VERY_COMMON",
        rate: "1–4 in 10",
        source: "RCOG CA11",
        plain: "Heavy bleeding after delivery. Ten times more common than after a normal delivery. The team is trained to manage this.",
      },
      {
        id: "vaginal_tear_abrasion",
        name: "Vaginal tear / abrasion",
        freq: "VERY_COMMON",
        rate: null,
        source: "RCOG CA11",
        plain: "Minor tears and grazes to the vaginal area are very common and are repaired with stitches.",
      },
      {
        id: "sphincter_voiding",
        name: "Anal sphincter dysfunction / voiding dysfunction",
        freq: null,
        rate: null,
        source: "RCOG CA11",
        plain: "Some women experience short-term difficulty with bladder or bowel control following instrumental delivery. This usually improves with time and physiotherapy.",
      },
    ],
  },
  {
    id: "frequent_fetal",
    heading: "Frequent risks — Fetal",
    type: "list",
    source: "RCOG Consent Advice No. 11 (2010)",
    risks: [
      {
        id: "forceps_marks",
        name: "Forceps marks on face",
        freq: "VERY_COMMON",
        rate: null,
        source: "RCOG CA11",
        instrumentOnly: "forceps",
        plain: "Temporary marks or bruising on the baby's face from the forceps blades. These almost always resolve within a few days.",
      },
      {
        id: "chignon",
        name: "Chignon / cup marking on scalp",
        freq: "VERY_COMMON",
        rate: "Practically all cases",
        source: "RCOG CA11",
        instrumentOnly: "ventouse",
        plain: "A temporary swelling on the scalp at the site of the suction cup. This resolves on its own within a few days.",
      },
      {
        id: "cephalhaematoma",
        name: "Cephalhaematoma",
        freq: "COMMON",
        rate: "1–12 in 100",
        source: "RCOG CA11",
        plain: "A collection of blood under the scalp that looks like a firm swelling. Usually resolves without treatment over a few weeks.",
      },
      {
        id: "lacerations",
        name: "Facial or scalp lacerations",
        freq: "COMMON",
        rate: "1 in 10",
        source: "RCOG CA11",
        plain: "Small cuts to the face or scalp. Most heal quickly without treatment.",
      },
      {
        id: "jaundice",
        name: "Neonatal jaundice / hyperbilirubinaemia",
        freq: "COMMON",
        rate: "5–15 in 100",
        source: "RCOG CA11",
        plain: "Yellowing of the skin and eyes in the newborn, more common after instrumental delivery. Usually treated with phototherapy (light therapy) if needed.",
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

// ─── PROCEDURE LIST ───────────────────────────────────────────────────────────

export const CONSENT_PROCEDURES = [
  {
    id: "CS",
    title: "Caesarean Section",
    subtypes: "Elective · Emergency",
    source: "NICE NG192 · RCOG CA No. 12",
    color: { accent: "bg-teal-500", text: "text-teal-700" },
  },
  {
    id: "OVD",
    title: "Instrumental Delivery",
    subtypes: "Forceps · Ventouse",
    source: "RCOG Consent Advice No. 11",
    color: { accent: "bg-blue-500", text: "text-blue-700" },
  },
];
