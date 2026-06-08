// All risk data verbatim from cited sources. No inference.
// RCOG frequency terminology: Very common 1/1–10, Common 1/10–100,
// Uncommon 1/100–1,000, Rare 1/1,000–10,000, Very rare <1/10,000

export const FREQ = {
  VERY_COMMON: { label: "Very common", short: "Very common",  bg: "bg-red-50",    text: "text-red-700",    border: "border-red-100",    dot: "bg-red-400" },
  COMMON:      { label: "Common",      short: "Common",       bg: "bg-orange-50",  text: "text-orange-700", border: "border-orange-100",  dot: "bg-orange-400" },
  UNCOMMON:    { label: "Uncommon",    short: "Uncommon",     bg: "bg-yellow-50",  text: "text-yellow-700", border: "border-yellow-100",  dot: "bg-yellow-400" },
  RARE:        { label: "Rare",        short: "Rare",         bg: "bg-gray-50",    text: "text-gray-600",   border: "border-gray-100",    dot: "bg-gray-300" },
  VERY_RARE:   { label: "Very rare",   short: "Very rare",    bg: "bg-slate-50",   text: "text-slate-500",  border: "border-slate-100",   dot: "bg-slate-300" },
};

// ─── OPERATIVE VAGINAL DELIVERY ──────────────────────────────────────────────
// Source: RCOG Consent Advice No. 11 — Operative Vaginal Delivery (2010)

export const OVD_MATERNAL_RISKS = [
  {
    id: "episiotomy",
    name: "Episiotomy",
    category: "maternal",
    note: null,
    byInstrument: {
      ventouse: { freq: "VERY_COMMON", rate: "5–6 in 10" },
      forceps:  { freq: "VERY_COMMON", rate: "9 in 10" },
    },
  },
  {
    id: "pph",
    name: "Postpartum haemorrhage",
    category: "maternal",
    note: null,
    byInstrument: {
      ventouse: { freq: "VERY_COMMON", rate: "1–4 in 10" },
      forceps:  { freq: "VERY_COMMON", rate: "1–4 in 10" },
    },
  },
  {
    id: "vaginal_tear",
    name: "Significant vaginal, vulval or labial tear",
    category: "maternal",
    note: null,
    byInstrument: {
      ventouse: { freq: "VERY_COMMON", rate: "1 in 10" },
      forceps:  { freq: "VERY_COMMON", rate: "1 in 5" },
    },
  },
  {
    id: "third_fourth_degree",
    name: "3rd or 4th degree perineal tear",
    category: "maternal",
    note: "Involving the anal sphincter",
    byInstrument: {
      ventouse: { freq: "COMMON",      rate: "1–4 in 100" },
      forceps:  { freq: "VERY_COMMON", rate: "8–12 in 100" },
    },
  },
  {
    id: "urinary_retention",
    name: "Short-term difficulty emptying bladder",
    category: "maternal",
    note: null,
    byInstrument: {
      ventouse: { freq: "UNCOMMON", rate: null },
      forceps:  { freq: "UNCOMMON", rate: null },
    },
  },
  {
    id: "failed_attempt",
    name: "Failed attempt — requires caesarean section",
    category: "maternal",
    note: null,
    byInstrument: {
      ventouse: { freq: "COMMON", rate: null },
      forceps:  { freq: "UNCOMMON", rate: null },
    },
  },
];

export const OVD_FETAL_RISKS = [
  {
    id: "retinal_haemorrhage",
    name: "Retinal haemorrhage",
    category: "fetal",
    note: "Usually resolves without treatment",
    byInstrument: {
      ventouse: { freq: "VERY_COMMON", rate: "17–38 in 100" },
      forceps:  { freq: "VERY_COMMON", rate: null },
    },
  },
  {
    id: "cephalhaematoma",
    name: "Cephalhaematoma",
    category: "fetal",
    note: "Blood under scalp, usually resolves",
    byInstrument: {
      ventouse: { freq: "COMMON", rate: "1–12 in 100" },
      forceps:  { freq: "COMMON", rate: null },
    },
  },
  {
    id: "subgaleal",
    name: "Subgaleal haematoma",
    category: "fetal",
    note: "Blood beneath the scalp aponeurosis — can be severe",
    byInstrument: {
      ventouse: { freq: "UNCOMMON", rate: "3–6 in 1,000" },
      forceps:  { freq: "UNCOMMON", rate: null },
    },
  },
  {
    id: "intracranial",
    name: "Intracranial haemorrhage",
    category: "fetal",
    note: null,
    byInstrument: {
      ventouse: { freq: "UNCOMMON", rate: "5–15 in 10,000" },
      forceps:  { freq: "UNCOMMON", rate: null },
    },
  },
  {
    id: "facial_nerve",
    name: "Facial nerve palsy",
    category: "fetal",
    note: "Usually transient",
    byInstrument: {
      ventouse: { freq: "RARE", rate: null },
      forceps:  { freq: "RARE", rate: null },
    },
  },
];

// ─── PLANNED CAESAREAN SECTION ────────────────────────────────────────────────
// Source: NICE NG192 Caesarean Birth, Appendix A (2021)
// Comparison: planned CS vs unassisted vaginal birth (unless noted)

export const PLANNED_CS_COMPARISON = [
  {
    section: "Maternal — serious risks",
    rows: [
      {
        id: "maternal_death",
        name: "Maternal death",
        cs:       { rate: "~25 per 100,000", note: null },
        vaginal:  { rate: "~4 per 100,000",  note: null },
        cs_higher: true,
      },
      {
        id: "hysterectomy",
        name: "Peripartum hysterectomy",
        cs:       { rate: "~200 per 100,000", note: null },
        vaginal:  { rate: "~100 per 100,000", note: null },
        cs_higher: true,
      },
      {
        id: "cardiac_arrest",
        name: "Cardiac arrest",
        cs:       { rate: "~20 per 100,000", note: null },
        vaginal:  { rate: "~8 per 100,000",  note: null },
        cs_higher: true,
      },
      {
        id: "blood_transfusion",
        name: "Blood transfusion",
        cs:       { rate: "~340 per 100,000", note: null },
        vaginal:  { rate: "~250 per 100,000", note: null },
        cs_higher: true,
      },
    ],
  },
  {
    section: "Maternal — future pregnancy",
    rows: [
      {
        id: "uterine_rupture",
        name: "Uterine rupture in future pregnancy",
        cs:       { rate: "~200 per 100,000", note: null },
        vaginal:  { rate: "~7 per 100,000",   note: null },
        cs_higher: true,
      },
      {
        id: "placenta_praevia",
        name: "Placenta praevia in future pregnancy",
        cs:       { rate: "~310 per 100,000", note: null },
        vaginal:  { rate: "~190 per 100,000", note: null },
        cs_higher: true,
      },
      {
        id: "placenta_accreta",
        name: "Placenta accreta spectrum in future pregnancy",
        cs:       { rate: "~60 per 100,000", note: null },
        vaginal:  { rate: "~3 per 100,000",  note: null },
        cs_higher: true,
      },
    ],
  },
  {
    section: "Maternal — pelvic floor",
    rows: [
      {
        id: "urinary_incontinence",
        name: "Urinary incontinence >1 year",
        cs:       { rate: "~19,600 per 100,000", note: "vs unassisted VB" },
        vaginal:  { rate: "~48,700 per 100,000", note: "unassisted VB" },
        cs_higher: false,
      },
      {
        id: "perineal_pain",
        name: "Perineal pain at 3 days",
        cs:       { rate: "lower",           note: null },
        vaginal:  { rate: "higher",          note: null },
        cs_higher: false,
      },
    ],
  },
  {
    section: "Recovery",
    rows: [
      {
        id: "hospital_stay",
        name: "Hospital stay",
        cs:       { rate: "~4 days",   note: null },
        vaginal:  { rate: "~2.5 days", note: null },
        cs_higher: true,
      },
      {
        id: "return_activity",
        name: "Return to usual activities",
        cs:       { rate: "Longer",   note: null },
        vaginal:  { rate: "Shorter",  note: null },
        cs_higher: true,
      },
    ],
  },
  {
    section: "Neonatal",
    rows: [
      {
        id: "neonatal_mortality",
        name: "Neonatal mortality",
        cs:       { rate: "~58 per 100,000", note: null },
        vaginal:  { rate: "~30 per 100,000", note: "term, cephalic, singleton" },
        cs_higher: true,
      },
      {
        id: "neonatal_resp",
        name: "Transient tachypnoea of newborn / respiratory morbidity",
        cs:       { rate: "Higher",  note: "especially <39 weeks" },
        vaginal:  { rate: "Lower",   note: null },
        cs_higher: true,
      },
      {
        id: "breastfeeding",
        name: "Not breastfeeding at 6 months",
        cs:       { rate: "More likely",  note: null },
        vaginal:  { rate: "Less likely",  note: null },
        cs_higher: true,
      },
      {
        id: "asthma",
        name: "Childhood asthma",
        cs:       { rate: "~1,809 per 100,000", note: null },
        vaginal:  { rate: "~1,500 per 100,000", note: null },
        cs_higher: true,
      },
    ],
  },
];

// ─── CS FOR PLACENTA PRAEVIA ──────────────────────────────────────────────────
// Source: RCOG Consent Advice No. 12 — Caesarean Section for Placenta Praevia,
// Placenta Praevia Accreta and Vasa Praevia (2010)

export const PLACENTA_PRAEVIA_CS_RISKS = [
  {
    section: "Haemorrhage",
    risks: [
      {
        id: "massive_haemorrhage",
        name: "Massive obstetric haemorrhage",
        freq: "VERY_COMMON",
        rate: "21 in 100",
        note: null,
      },
      {
        id: "blood_transfusion_pp",
        name: "Blood transfusion required",
        freq: "VERY_COMMON",
        rate: null,
        note: "Closely associated with massive haemorrhage",
      },
    ],
  },
  {
    section: "Surgery",
    risks: [
      {
        id: "hysterectomy_pp",
        name: "Emergency hysterectomy — placenta praevia",
        freq: "VERY_COMMON",
        rate: "Up to 11 in 100",
        note: null,
      },
      {
        id: "hysterectomy_pp_prev_cs",
        name: "Emergency hysterectomy — PP + previous caesarean",
        freq: "VERY_COMMON",
        rate: "Up to 27 in 100",
        note: "Risk increases with each previous caesarean",
      },
      {
        id: "bladder_injury",
        name: "Bladder or ureteric injury",
        freq: "COMMON",
        rate: "Up to 6 in 100",
        note: null,
      },
      {
        id: "return_theatre",
        name: "Return to theatre",
        freq: "COMMON",
        rate: null,
        note: null,
      },
    ],
  },
  {
    section: "Thromboembolic & other",
    risks: [
      {
        id: "vte_pp",
        name: "Thromboembolic disease (DVT/PE)",
        freq: "COMMON",
        rate: "Up to 3 in 100",
        note: null,
      },
      {
        id: "death_pp",
        name: "Death",
        freq: "VERY_RARE",
        rate: "1 in 12,000",
        note: "All caesarean sections",
      },
    ],
  },
];

export const CONSENT_PROCEDURES = [
  {
    id: "OVD",
    title: "Operative Vaginal Delivery",
    subtitle: "Ventouse or Forceps",
    source: "RCOG Consent Advice No. 11",
    sourceYear: "2010",
    icon: "forceps",
    color: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-100", accent: "bg-blue-500" },
  },
  {
    id: "PLANNED_CS",
    title: "Planned Caesarean Section",
    subtitle: "vs vaginal birth",
    source: "NICE NG192 Appendix A",
    sourceYear: "2021",
    icon: "cs",
    color: { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-100", accent: "bg-teal-500" },
  },
  {
    id: "PLACENTA_PRAEVIA_CS",
    title: "CS for Placenta Praevia",
    subtitle: "Including PP accreta",
    source: "RCOG Consent Advice No. 12",
    sourceYear: "2010",
    icon: "cs",
    color: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-100", accent: "bg-rose-500" },
  },
];
