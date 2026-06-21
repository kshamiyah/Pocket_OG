export const HYPEREMESIS_PROTOCOL = {
  id: "hyperemesis",
  title: "Hyperemesis Gravidarum",
  subtitle: "Nausea & vomiting in pregnancy",
  category: "antenatal",
  guideline: "RCOG GTG69",
  color: "emerald",
  startId: "red_flags_q",
  nodes: {

    // ─── Opening ───────────────────────────────────────────────────────────────

    "red_flags_q": {
      type: "question",
      question: "Any red flag symptoms?",
      subtitle: "Neurological signs, fever, abdominal pain, confusion, headache, visual changes",
      options: [
        { label: "No — nausea and vomiting only",    next: "history"       },
        { label: "Yes — one or more red flags",       next: "red_flag_now"  },
      ],
    },

    "red_flag_now": {
      type: "escalation",
      title: "Red flag symptoms — call the senior now",
      alert: "Do not manage red flag HG alone. Neurological symptoms may indicate Wernicke's encephalopathy.",
      items: [
        "Neurological symptoms (nystagmus, confusion, ataxia) → Wernicke's until proven otherwise",
        "Give Pabrinex 2 pairs IV TDS immediately if Wernicke's suspected — do not wait for thiamine level",
        "Fever or abdominal pain → exclude sepsis, appendicitis, pancreatitis, UTI",
        "Headache or visual changes → exclude pre-eclampsia and HELLP syndrome",
        "Call registrar now — do not complete assessment alone",
      ],
      next: "history",
      source: { gl: "GTG69", sectionId: "gtg69-complications", label: "Complications" },
    },

    // ─── History & exam ────────────────────────────────────────────────────────

    "history": {
      type: "checklist",
      title: "Take a focused history",
      subtitle: "Work through these with the patient",
      items: [
        "Duration and onset of symptoms",
        "Number of vomiting episodes per 24 hours",
        "Ability to keep fluids or food down",
        "Last oral intake — food and drink",
        "Urine output — dark urine, reduced frequency, any oliguria",
        "Weight loss — compare to booking weight if known",
        "Gestational age and singleton vs multiple pregnancy",
        "Previous HG in this or prior pregnancies",
        "Medications already tried at home",
      ],
      next: "examination",
      source: { gl: "GTG69", sectionId: "gtg69-assessment", label: "Assessment & Admission Criteria" },
    },

    "examination": {
      type: "checklist",
      title: "Examine the patient",
      items: [
        "BP, HR, RR, temperature, SpO₂",
        "Weight — compare to booking weight, calculate % loss",
        "Signs of dehydration: dry mucous membranes, reduced skin turgor, sunken eyes",
        "Jaundice",
        "Epigastric or abdominal tenderness — exclude surgical cause",
        "Neurological: nystagmus, confusion, ataxia — signs of Wernicke's",
      ],
      next: "investigations",
      source: { gl: "GTG69", sectionId: "gtg69-assessment", label: "Assessment & Admission Criteria" },
    },

    "investigations": {
      type: "checklist",
      title: "Investigations",
      alert: "Do NOT give IV dextrose — precipitates Wernicke's encephalopathy in thiamine-deficient patients",
      items: [
        "Urine dip — ketones (2+ or more suggests significant dehydration), protein, nitrites, leucocytes",
        "MSU (urine MC&S) — to exclude UTI as a cause",
        "FBC — raised haematocrit suggests haemoconcentration",
        "U&E — hypokalaemia and hyponatraemia are common in HG",
        "LFTs — transaminase elevation in up to 50% of HG (usually mild and transient)",
        "TFTs — gestational transient thyrotoxicosis in up to 60% of HG; usually resolves spontaneously",
        "USS — confirm viability, exclude molar pregnancy or multiple gestation if not done",
      ],
      next: "fluids_q",
      source: { gl: "GTG69", sectionId: "gtg69-assessment", label: "Assessment & Admission Criteria" },
    },

    // ─── Key branch: can she keep fluids down? ─────────────────────────────────

    "fluids_q": {
      type: "question",
      question: "Is she keeping any fluids down at all?",
      options: [
        { label: "Yes — sips tolerated",                            next: "puqe" },
        { label: "No — nothing staying down",                       next: "puqe" },
      ],
    },

    // ─── PUQE scoring ─────────────────────────────────────────────────────────

    "puqe": {
      type: "calculator",
      title: "PUQE Score",
      subtitle: "Pregnancy-Unique Quantification of Emesis · last 24 hours",
      description: "Ask the patient each of the following three questions",
      fields: [
        {
          id: "nausea",
          question: "How long have you felt nauseated or sick to your stomach?",
          options: [
            { label: "≤1 hour",     score: 1 },
            { label: "1–3 hours",   score: 2 },
            { label: "3–6 hours",   score: 3 },
            { label: "6–9 hours",   score: 4 },
            { label: ">9 hours",    score: 5 },
          ],
        },
        {
          id: "vomiting",
          question: "How many times have you vomited or thrown up?",
          options: [
            { label: "None",        score: 1 },
            { label: "1–2 times",   score: 2 },
            { label: "3–4 times",   score: 3 },
            { label: "5–6 times",   score: 4 },
            { label: ">6 times",    score: 5 },
          ],
        },
        {
          id: "retching",
          question: "How many times have you had retching or dry heaves?",
          options: [
            { label: "None",        score: 1 },
            { label: "1–2 times",   score: 2 },
            { label: "3–4 times",   score: 3 },
            { label: "5–6 times",   score: 4 },
            { label: ">6 times",    score: 5 },
          ],
        },
      ],
      scoring: [
        { min: 3,  max: 6,  label: "Mild NVP",    color: "green", next: "mild_management"     },
        { min: 7,  max: 12, label: "Moderate HG",  color: "amber", next: "moderate_management" },
        { min: 13, max: 15, label: "Severe HG",    color: "red",   next: "severe_management"   },
      ],
      source: { gl: "GTG69", sectionId: "gtg69-overview", label: "NVP & HG — Overview and PUQE Scoring" },
    },

    // ─── Management nodes ──────────────────────────────────────────────────────

    "mild_management": {
      type: "treatment",
      title: "Mild NVP — Outpatient Management",
      badge: { label: "PUQE 3–6 · Mild", color: "green" },
      sections: [
        {
          title: "Lifestyle advice",
          items: [
            "Small, frequent meals — avoid large meals, fatty or spicy foods",
            "Rest and avoid triggers",
            "Ginger — tea, biscuits, capsules (modest evidence of benefit)",
            "Pyridoxine (vitamin B6) 10–25 mg TDS — safe and modestly effective",
            "Acupressure wristbands (P6 point) — low-quality evidence but harmless",
          ],
        },
        {
          title: "First-line antiemetics",
          note: "All are safe at standard doses in pregnancy",
          drugs: [
            { drug: "Cyclizine",        dose: "50 mg PO/IV/IM TDS",                      note: "First line — antihistamine; safe and well tolerated"        },
            { drug: "Promethazine",     dose: "12.5–25 mg PO/IV/IM QDS",                 note: "Good evidence; sedating — useful at night"                  },
            { drug: "Prochlorperazine", dose: "5–10 mg PO TDS, or 3 mg buccal (Buccastem)", note: "Phenothiazine; buccal useful if actively vomiting"       },
          ],
        },
        {
          title: "Second-line — if first-line inadequate",
          drugs: [
            { drug: "Metoclopramide",   dose: "10 mg PO/IV/IM TDS",                       note: "Max 5 days continuous — risk of tardive dyskinesia with prolonged use" },
            { drug: "Ondansetron",      dose: "4–8 mg PO/IV BD–TDS",                      note: "Effective; 2022 evidence shows no significant teratogenicity at therapeutic doses; counsel and document" },
          ],
        },
        {
          title: "Thiamine — prescribe in all women with prolonged vomiting",
          drugs: [
            { drug: "Thiamine (oral)", dose: "25–50 mg TDS", note: "Outpatient supplementation to prevent Wernicke's encephalopathy in women at risk" },
          ],
        },
      ],
      next: "improving_q",
      source: { gl: "GTG69", sectionId: "gtg69-antiemetics", label: "Antiemetic Management" },
    },

    "moderate_management": {
      type: "treatment",
      title: "Moderate HG — Consider Admission",
      badge: { label: "PUQE 7–12 · Moderate", color: "amber" },
      sections: [
        {
          title: "IV Fluids",
          alert: "NEVER administer dextrose before thiamine (Pabrinex) — precipitates Wernicke's encephalopathy",
          items: [
            "Give Pabrinex IV first, before any IV fluids",
            "Hartmann's solution (lactated Ringer's): first choice — physiological, corrects metabolic alkalosis",
            "0.9% NaCl + 20–40 mmol KCl per litre if significant hypokalaemia (K⁺ <3.5 mmol/L)",
            "Rate: 1 L over 4 hours initially, then reassess",
            "Monitor U&E every 24 hours while on IV fluids",
            "Correct Na⁺ <130 mmol/L cautiously — seek specialist advice; risk of central pontine myelinolysis with rapid correction",
          ],
        },
        {
          title: "Thiamine — give before IV fluids",
          drugs: [
            { drug: "Pabrinex (IV thiamine)", dose: "2 pairs (component I + II) in 100 ml NaCl over 30 min — repeat if admission >48 hours or if Wernicke's suspected", note: "Give before any glucose-containing fluids" },
          ],
        },
        {
          title: "IV / IM Antiemetics",
          drugs: [
            { drug: "Cyclizine",        dose: "50 mg IV or IM TDS",        note: "First line"                                               },
            { drug: "Promethazine",     dose: "12.5–25 mg IV or IM QDS",   note: "Sedating — useful at night"                               },
            { drug: "Metoclopramide",   dose: "10 mg IV or IM TDS",        note: "Max 5 days — tardive dyskinesia risk with prolonged use"   },
            { drug: "Ondansetron",      dose: "4–8 mg IV BD–TDS",          note: "Administer slowly — fast bolus risks QTc prolongation"     },
          ],
        },
        {
          title: "VTE Prophylaxis",
          items: [
            "All hospitalised women with HG have increased VTE risk (dehydration + immobility)",
            "Prescribe LMWH (enoxaparin) as per VTE risk assessment — start on admission",
            "TED stockings when mobile",
          ],
        },
      ],
      next: "improving_q",
      source: { gl: "GTG69", sectionId: "gtg69-fluids", label: "IV Fluid Management & Thiamine" },
    },

    "severe_management": {
      type: "escalation",
      title: "Severe HG — Admit & Escalate",
      badge: { label: "PUQE 13–15 · Severe", color: "red" },
      alert: "Call the registrar. Do not manage severe HG alone.",
      items: [
        "Admit — IV access, strict fluid balance chart, daily weights",
        "Give Pabrinex 2 pairs IV (in 100 ml NaCl over 30 min) before any IV fluids",
        "IV fluids: Hartmann's solution first choice; 0.9% NaCl + KCl if significant hypokalaemia — correct electrolytes urgently",
        "IV antiemetics: cyclizine 50 mg TDS, or ondansetron 4–8 mg (administer slowly) BD–TDS",
        "If Wernicke's suspected (confusion, ataxia, ophthalmoplegia/nystagmus): Pabrinex 2 pairs IV TDS × 3 days, then OD until oral intake established + MRI brain",
        "Enteral nutrition (NG feed) if weight loss >10% of pre-pregnancy weight or inadequate intake despite antiemetics",
        "Dietitian referral",
        "VTE risk assessment: LMWH on admission + TED stockings when mobile",
      ],
      next: "improving_q",
      source: { gl: "GTG69", sectionId: "gtg69-complications", label: "Complications" },
    },

    // ─── Response to treatment ─────────────────────────────────────────────────

    "improving_q": {
      type: "question",
      question: "Is she improving after initial management?",
      subtitle: "Assess after 24 hours of treatment",
      options: [
        { label: "Yes — improving, tolerating fluids",    next: "escalation_criteria" },
        { label: "No — not improving after 24 hours",     next: "no_improvement"      },
      ],
    },

    "no_improvement": {
      type: "escalation",
      title: "Not improving — escalate",
      alert: "No improvement after 24 hours of IV treatment requires senior review",
      items: [
        "Call the registrar — reassess and modify management plan",
        "Recheck U&E and urinary ketones — ketonuria 2+ or more persisting after 24 h warrants urgent senior review",
        "Consider enteral nutrition (NG feed) if weight loss >10% or inadequate intake despite antiemetics",
        "Request dietitian review",
        "Explore psychological impact — up to 50% of women with HG report significant depression or anxiety",
        "Termination of pregnancy for HG is not uncommon — explore and support all options; refer to perinatal mental health team if required",
      ],
      next: "escalation_criteria",
      source: { gl: "GTG69", sectionId: "gtg69-complications", label: "Complications" },
    },

    "escalation_criteria": {
      type: "escalation",
      title: "Call the registrar if…",
      subtitle: "Any of the following warrant senior review",
      items: [
        "Suspected Wernicke's encephalopathy — confusion, ataxia, or ophthalmoplegia (classic triad present in <20% of cases)",
        "Na⁺ <130 mmol/L or K⁺ <3.0 mmol/L",
        "ALT elevation (transaminase raised in up to 50% of HG — escalate if marked or rising)",
        "No improvement after 24 hours of IV treatment",
        "Ketonuria 2+ or more persisting after 24 hours",
        "Weight loss >5% of pre-pregnancy body weight (admission criterion); enteral nutrition if >10%",
        "Inability to keep down oral fluids or antiemetics",
        "Suspected concurrent sepsis — fever, tachycardia",
        "Patient requesting termination due to HG — senior counselling required",
      ],
      next: "documentation",
      source: { gl: "GTG69", sectionId: "gtg69-assessment", label: "Assessment & Admission Criteria" },
    },

    "documentation": {
      type: "end",
      title: "Document on EPR",
      subtitle: "Before you leave the patient",
      items: [
        "PUQE score — record the number, not just mild/moderate/severe",
        "Current weight vs booking weight — document % loss",
        "Urinary ketones (2+ or more = significant)",
        "IV fluid choice, rate, and volume given",
        "Thiamine (Pabrinex) given — dose, route, timing",
        "Antiemetics prescribed — drug, dose, route",
        "VTE risk assessment completed — LMWH and TED stockings documented",
        "Informed patient of medication safety profile in pregnancy",
        "Review plan — time and by whom",
        "Safety-netting: criteria to return communicated to patient",
      ],
      source: { gl: "GTG69", sectionId: "gtg69-assessment", label: "Assessment & Admission Criteria" },
    },

  },
};
