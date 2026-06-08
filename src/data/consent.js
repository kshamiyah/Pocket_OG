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
