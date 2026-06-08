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
  {
    id: "elective",
    label: "Elective",
    description: "Planned, not urgent",
    color: "text-emerald-600",
    dot: "bg-emerald-500",
  },
  {
    id: "emergency",
    label: "Emergency",
    description: "Delivery needed now",
    color: "text-red-600",
    dot: "bg-red-500",
  },
];

export const CS_PATIENT_FACTORS = [
  { id: "prev_cs_1",        label: "Previous caesarean ×1" },
  { id: "prev_cs_2plus",    label: "Previous caesarean ×2 or more" },
  { id: "placenta_praevia", label: "Placenta praevia / accreta" },
  { id: "bmi_40",           label: "BMI > 40" },
  { id: "anticoagulation",  label: "On anticoagulation" },
  { id: "general_anaes",    label: "General anaesthetic needed" },
];

// Source: NICE NG192 Caesarean Birth, Appendix A (2021)
// Source: RCOG Consent Advice No. 12 — CS for Placenta Praevia (2010)
export const CS_RISKS = {
  common: [
    {
      id: "wound_infection",
      name: "Wound infection",
      freq: "COMMON",
      rate: null,
      source: "NICE NG192",
      plain: "The wound on your abdomen can become infected, causing redness, pain, or discharge. Most infections are treated with antibiotics.",
      conditions: [],
    },
    {
      id: "heavy_bleeding",
      name: "Heavy bleeding (haemorrhage)",
      freq: "COMMON",
      rate: "~340 per 100,000 require transfusion",
      source: "NICE NG192 Appendix A",
      plain: "Some bleeding is expected. In some cases it can be heavy enough to need a blood transfusion.",
      conditions: [],
    },
    {
      id: "baby_cut",
      name: "Baby cut during surgery",
      freq: "COMMON",
      rate: "2 in 100",
      source: "NICE NG192",
      plain: "Small cuts to the baby's skin can happen when opening the uterus. Most heal quickly without long-term effects.",
      conditions: [],
    },
    {
      id: "pain_recovery",
      name: "Pain and slow recovery",
      freq: "COMMON",
      rate: null,
      source: "NICE NG192",
      plain: "Most women need pain relief for several days. Full recovery usually takes 6 weeks. Driving and heavy lifting should be avoided during this time.",
      conditions: [],
    },
    {
      id: "longer_stay",
      name: "Longer hospital stay",
      freq: "COMMON",
      rate: "~4 days vs ~2.5 days for vaginal birth",
      source: "NICE NG192 Appendix A",
      plain: "A caesarean usually means staying in hospital longer than after a vaginal birth.",
      conditions: [],
    },
  ],
  serious: [
    {
      id: "bladder_injury",
      name: "Bladder injury",
      freq: "UNCOMMON",
      rate: "1 in 1,000",
      source: "NICE NG192",
      plain: "The bladder lies close to the uterus and can occasionally be nicked. This usually requires repair during the same operation.",
      conditions: [],
    },
    {
      id: "vte",
      name: "Blood clot (DVT / pulmonary embolism)",
      freq: "COMMON",
      rate: "Up to 3 in 100",
      source: "RCOG Consent Advice No. 12",
      plain: "Clots can form in the leg (DVT) or travel to the lung (PE). You will be given blood-thinning injections and stockings to reduce this risk.",
      conditions: [],
    },
    {
      id: "hysterectomy",
      name: "Emergency hysterectomy",
      freq: "RARE",
      rate: "~200 per 100,000",
      source: "NICE NG192 Appendix A",
      plain: "Very rarely, heavy bleeding cannot be controlled and the uterus needs to be removed. This would mean you could not have further pregnancies.",
      conditions: [],
      modifiers: {
        placenta_praevia: {
          rate: "Up to 11 in 100",
          freq: "VERY_COMMON",
          source: "RCOG Consent Advice No. 12",
          note: "Risk significantly increased with placenta praevia",
        },
        placenta_praevia_prev_cs: {
          rate: "Up to 27 in 100",
          freq: "VERY_COMMON",
          source: "RCOG Consent Advice No. 12",
          note: "Risk further increased with placenta praevia + previous caesarean",
        },
      },
    },
    {
      id: "massive_haemorrhage_pp",
      name: "Massive obstetric haemorrhage",
      freq: "VERY_COMMON",
      rate: "21 in 100",
      source: "RCOG Consent Advice No. 12",
      plain: "Life-threatening bleeding requiring emergency treatment. Risk is significantly higher with placenta praevia.",
      conditions: ["placenta_praevia"],
    },
    {
      id: "bladder_injury_pp",
      name: "Bladder or ureteric injury",
      freq: "COMMON",
      rate: "Up to 6 in 100",
      source: "RCOG Consent Advice No. 12",
      plain: "The bladder and the tube connecting kidney to bladder (ureter) are at higher risk of injury when there is placenta praevia.",
      conditions: ["placenta_praevia"],
    },
    {
      id: "cardiac_arrest",
      name: "Cardiac arrest",
      freq: "VERY_RARE",
      rate: "~20 per 100,000",
      source: "NICE NG192 Appendix A",
      plain: "Extremely rare but serious complication. The theatre team is trained to respond immediately.",
      conditions: [],
    },
    {
      id: "maternal_death",
      name: "Maternal death",
      freq: "VERY_RARE",
      rate: "~25 per 100,000 (CS) vs ~4 per 100,000 (vaginal birth)",
      source: "NICE NG192 Appendix A",
      plain: "Caesarean carries a higher risk of maternal death compared with vaginal birth, though both are very rare.",
      conditions: [],
    },
  ],
  future: [
    {
      id: "uterine_rupture",
      name: "Uterine rupture in future labour",
      freq: "RARE",
      rate: "~200 per 100,000 (CS) vs ~7 per 100,000 (no CS)",
      source: "NICE NG192 Appendix A",
      plain: "The scar on your womb can occasionally open during a future labour. This is a reason why future labours may be monitored more closely.",
      conditions: [],
    },
    {
      id: "placenta_praevia_future",
      name: "Placenta praevia in future pregnancy",
      freq: "RARE",
      rate: "~310 per 100,000 (CS) vs ~190 per 100,000 (no CS)",
      source: "NICE NG192 Appendix A",
      plain: "The caesarean scar slightly increases the chance of the placenta lying low in a future pregnancy.",
      conditions: [],
    },
    {
      id: "placenta_accreta_future",
      name: "Placenta accreta spectrum in future pregnancy",
      freq: "VERY_RARE",
      rate: "~60 per 100,000 (CS) vs ~3 per 100,000 (no CS)",
      source: "NICE NG192 Appendix A",
      plain: "The placenta can grow into the caesarean scar in a future pregnancy, which can cause severe bleeding and may require hysterectomy.",
      conditions: [],
    },
  ],
};

export const CS_ALTERNATIVES = [
  { id: "instrumental", label: "Instrumental delivery (forceps or ventouse)" },
  { id: "expectant",    label: "Continued expectant management" },
  { id: "none",         label: "Not appropriate in this clinical situation" },
];

// ─── OPERATIVE VAGINAL DELIVERY ───────────────────────────────────────────────
// Source: RCOG Consent Advice No. 11 — Operative Vaginal Delivery (2010)

export const OVD_CONTEXT_OPTIONS = [
  {
    id: "ventouse",
    label: "Ventouse",
    description: "Vacuum-assisted delivery",
    color: "text-blue-600",
    dot: "bg-blue-500",
  },
  {
    id: "forceps",
    label: "Forceps",
    description: "Instrument-assisted delivery",
    color: "text-indigo-600",
    dot: "bg-indigo-500",
  },
];

export const OVD_PATIENT_FACTORS = [
  { id: "prev_3rd_degree", label: "Previous 3rd/4th degree tear" },
  { id: "coagulopathy",    label: "Fetal coagulopathy" },
  { id: "prematurity",     label: "Preterm (< 34 weeks)" },
];

export const OVD_RISKS = {
  common: [
    {
      id: "episiotomy",
      name: "Episiotomy",
      freq: { ventouse: "VERY_COMMON", forceps: "VERY_COMMON" },
      rate: { ventouse: "5–6 in 10", forceps: "9 in 10" },
      source: "RCOG Consent Advice No. 11",
      plain: "A cut to the perineum (skin between the vagina and anus) to help deliver the baby. It is stitched under local anaesthetic after delivery.",
    },
    {
      id: "pph",
      name: "Postpartum haemorrhage",
      freq: { ventouse: "VERY_COMMON", forceps: "VERY_COMMON" },
      rate: { ventouse: "1–4 in 10", forceps: "1–4 in 10" },
      source: "RCOG Consent Advice No. 11",
      plain: "Heavy bleeding after delivery. The team is trained to manage this and blood transfusion is available if needed.",
    },
    {
      id: "vaginal_tear",
      name: "Significant vaginal, vulval or labial tear",
      freq: { ventouse: "VERY_COMMON", forceps: "VERY_COMMON" },
      rate: { ventouse: "1 in 10", forceps: "1 in 5" },
      source: "RCOG Consent Advice No. 11",
      plain: "Tears to the vaginal area are common and are repaired with stitches. Most heal well.",
    },
    {
      id: "retinal_haemorrhage",
      name: "Baby — retinal haemorrhage",
      freq: { ventouse: "VERY_COMMON", forceps: "VERY_COMMON" },
      rate: { ventouse: "17–38 in 100", forceps: null },
      source: "RCOG Consent Advice No. 11",
      plain: "Bleeding behind the eye is common but almost always resolves on its own without treatment or lasting effect.",
    },
    {
      id: "cephalhaematoma",
      name: "Baby — cephalhaematoma",
      freq: { ventouse: "COMMON", forceps: "COMMON" },
      rate: { ventouse: "1–12 in 100", forceps: null },
      source: "RCOG Consent Advice No. 11",
      plain: "A collection of blood under the scalp. It looks like a swelling on the head and usually resolves without treatment over a few weeks.",
    },
  ],
  serious: [
    {
      id: "third_fourth_degree",
      name: "3rd or 4th degree perineal tear",
      freq: { ventouse: "COMMON", forceps: "VERY_COMMON" },
      rate: { ventouse: "1–4 in 100", forceps: "8–12 in 100" },
      source: "RCOG Consent Advice No. 11",
      plain: "A tear that extends into or through the anal sphincter. Repaired by a specialist surgeon. Can cause short-term bowel symptoms in some women.",
    },
    {
      id: "failed_attempt",
      name: "Failed attempt — requires caesarean section",
      freq: { ventouse: "COMMON", forceps: "UNCOMMON" },
      rate: { ventouse: null, forceps: null },
      source: "RCOG Consent Advice No. 11",
      plain: "If the instrument delivery is not successful, a caesarean section will be performed.",
    },
    {
      id: "subgaleal",
      name: "Baby — subgaleal haematoma",
      freq: { ventouse: "UNCOMMON", forceps: "UNCOMMON" },
      rate: { ventouse: "3–6 in 1,000", forceps: null },
      source: "RCOG Consent Advice No. 11",
      plain: "Serious bleeding beneath the scalp. Rarer than cephalhaematoma but can be significant. The baby will be closely monitored after delivery.",
    },
    {
      id: "intracranial",
      name: "Baby — intracranial haemorrhage",
      freq: { ventouse: "UNCOMMON", forceps: "UNCOMMON" },
      rate: { ventouse: "5–15 in 10,000", forceps: null },
      source: "RCOG Consent Advice No. 11",
      plain: "Bleeding inside the skull. Uncommon but serious — the baby would need specialist neonatal review.",
    },
    {
      id: "facial_nerve",
      name: "Baby — facial nerve palsy",
      freq: { ventouse: "RARE", forceps: "RARE" },
      rate: { ventouse: null, forceps: null },
      source: "RCOG Consent Advice No. 11",
      plain: "Temporary weakness of the muscles on one side of the baby's face. Usually resolves within a few weeks.",
    },
  ],
};

export const OVD_ALTERNATIVES = [
  { id: "cs",        label: "Caesarean section" },
  { id: "expectant", label: "Continued pushing — if appropriate" },
];

// ─── PROCEDURE LIST ───────────────────────────────────────────────────────────

export const CONSENT_PROCEDURES = [
  {
    id: "CS",
    title: "Caesarean Section",
    subtypes: "Elective · Emergency",
    source: "NICE NG192 · RCOG CA No. 12",
    pdf: null,
    color: { accent: "bg-teal-500", bg: "bg-white", text: "text-teal-700" },
  },
  {
    id: "OVD",
    title: "Instrumental Delivery",
    subtypes: "Forceps · Ventouse",
    source: "RCOG Consent Advice No. 11",
    pdf: null,
    color: { accent: "bg-blue-500", bg: "bg-white", text: "text-blue-700" },
  },
];
