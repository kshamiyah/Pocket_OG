// NG194 — Postnatal Care
// (NICE Guideline NG194, published 20 April 2021)

export const NG194_SECTIONS = [
  {
    id: "ng194-overview-contacts",
    gl: "NG194",
    condition: "Postnatal Care",
    setting: "Postnatal",
    title: "Scope & Routine Contact Schedule",
    tags: [
      "postnatal care", "postnatal contacts", "postnatal care plan", "midwife visit",
      "health visitor", "6 week check", "8 week check", "postnatal schedule",
    ],
    content: [
      { type: "text", value: "NG194 covers routine care for women and babies from birth to 8 weeks after birth — the day-to-day content of postnatal care, not the management of specific complications (which have their own guidelines, cross-referenced throughout)." },
      { type: "subheading", value: "Individualised postnatal care plan" },
      { type: "text", value: "Discuss and develop a postnatal care plan with the woman, ideally starting antenatally and finalised after birth — covering her physical, emotional and social needs, and the needs of the baby, rather than assuming a single default pathway fits everyone." },
      { type: "subheading", value: "Contact schedule" },
      { type: "list", items: [
        "First midwife contact within 36 hours of transfer of care from the place of birth (or after a home birth) — face-to-face, usually at home, depending on circumstances and preference.",
        "Further midwife contacts as clinically indicated and agreed in the care plan — not a fixed number for everyone.",
        "First health visitor contact between 7 and 14 days after transfer of care from midwifery care.",
        "GP postnatal check at 6–8 weeks — a dedicated maternal check, not to be folded silently into the baby's 6-week check.",
      ]},
    ],
  },

  {
    id: "ng194-maternal-assessment",
    gl: "NG194",
    condition: "Postnatal Care",
    setting: "Postnatal",
    title: "Maternal Assessment & Red Flags",
    tags: [
      "postnatal red flags", "postnatal bleeding", "postnatal infection", "postnatal vte",
      "postnatal headache", "postnatal chest pain", "6 week check contents",
      "8 week check contents",
    ],
    content: [
      { type: "alert", value: "Tell every woman, at the first postnatal contact, which symptoms need medical advice without delay — don't assume this is obvious or that she'll remember being told once in labour." },
      { type: "table",
        headers: ["Symptom", "What it may signal"],
        rows: [
          ["Sudden or very heavy vaginal bleeding, or persistent/increasing bleeding", "Secondary postpartum haemorrhage"],
          ["Abdominal, pelvic or perineal pain, fever, shivering, or offensive vaginal discharge", "Genital tract or wound infection — see GTG64"],
          ["Leg swelling and tenderness, or shortness of breath", "Venous thromboembolism — see GL891"],
          ["Chest pain", "VTE or a cardiac cause — do not attribute to anxiety without assessment"],
          ["Persistent or severe headache", "Pre-eclampsia, post-dural puncture headache, migraine, intracranial pathology, or infection — see GL952"],
        ],
      },
      { type: "text", value: "None of these are 'normal after birth and nothing to worry about' — each has a specific differential that needs assessment, not reassurance by default." },
      { type: "subheading", value: "The 6–8 week maternal check — what it should cover" },
      { type: "list", items: [
        "Mental health and general emotional wellbeing — actively ask, don't wait to be told (see CG192).",
        "Physical recovery — perineal/wound healing, bladder and bowel function, resumption of intercourse if relevant.",
        "Contraception and family planning — this is the point to have the conversation properly, not just mention it in passing.",
        "Ongoing management of any pregnancy-related condition — hypertension, diabetes, VTE, mental health — confirming what follow-up has actually been arranged, not assuming it's happening elsewhere.",
      ]},
    ],
  },

  {
    id: "ng194-baby-assessment",
    gl: "NG194",
    condition: "Postnatal Care",
    setting: "Postnatal",
    title: "Assessing the Baby",
    tags: [
      "newborn weight loss", "newborn examination", "baby postnatal check",
      "feeding assessment", "hip examination", "barlow ortolani",
    ],
    content: [
      { type: "subheading", value: "Growth" },
      { type: "list", items: [
        "Weigh the baby, and measure head circumference, in the first week and again around 8 weeks — not routinely in between unless there's a specific concern.",
        "Expected weight loss: around 6% in exclusively breastfed babies, around 3.5% in formula-fed babies — typically greatest around day 2–3, with birthweight usually regained by day 10–14.",
        "Weight loss beyond this pattern is a prompt to review feeding and consider the baby's wellbeing more broadly, not just to keep weighing more often.",
      ]},
      { type: "subheading", value: "Examination" },
      { type: "list", items: [
        "Hips — check for symmetry, using Barlow's and Ortolani's manoeuvres.",
        "Reflexes — assess if there's a specific concern, not as a routine screen at every contact.",
        "Cry, tone, colour and responsiveness as part of the general look of the baby at each contact.",
        "Jaundice — assess and act per the separate NICE guideline on neonatal jaundice; don't manage it as an NG194 topic in isolation.",
      ]},
      { type: "subheading", value: "Feeding support" },
      { type: "text", value: "Give parents clear information on feeding (breast or formula) and on recognising a baby who isn't feeding well or isn't well in general — this is proactive information, not something to wait and see if they ask about." },
    ],
  },

  {
    id: "ng194-safety-netting",
    gl: "NG194",
    condition: "Postnatal Care",
    setting: "Postnatal",
    title: "Safety-Netting for Baby Before Discharge",
    tags: [
      "newborn red flags", "baby not feeding", "baby temperature", "unusual cry",
      "postnatal discharge advice",
    ],
    content: [
      { type: "alert", value: "Give parents explicit red-flag advice for the baby before discharge — don't assume common sense covers it, since normal newborn behaviour is unfamiliar territory for many parents." },
      { type: "list", items: [
        "Poor feeding, or a marked change in feeding pattern.",
        "Unusual drowsiness, difficulty waking, or reduced responsiveness.",
        "Temperature that's too high or too low, or looks unwell to touch.",
        "Fast, laboured, or noisy breathing.",
        "An unusual or high-pitched cry, or a baby who is inconsolable.",
        "Jaundice that's worsening or appears in the first 24 hours (always needs urgent assessment).",
      ]},
      { type: "text", value: "Make sure parents know exactly who to contact and how, out of hours as well as in — a safety-net that only works 9-to-5 isn't a safety-net." },
    ],
  },
];
