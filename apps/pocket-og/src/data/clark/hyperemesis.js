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
    },

    "investigations": {
      type: "checklist",
      title: "Investigations",
      alert: "Do NOT give IV dextrose — precipitates Wernicke's encephalopathy in thiamine-deficient patients",
      items: [
        "Urine dip — ketones, protein, nitrites, leucocytes",
        "MSU if any urinary symptoms",
        "FBC, U&E — Na, K, Cl, Creatinine",
        "LFTs — ALT raised in ~50% of HG cases",
        "TFTs — biochemical hyperthyroidism in ~60% (transient, resolves spontaneously)",
        "USS — confirm viability, exclude molar pregnancy or multiple gestation if not done",
      ],
      next: "fluids_q",
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
            { label: "Not at all",  score: 1 },
            { label: "≤1 hour",     score: 2 },
            { label: "2–3 hours",   score: 3 },
            { label: "4–6 hours",   score: 4 },
            { label: ">6 hours",    score: 5 },
          ],
        },
        {
          id: "vomiting",
          question: "How many times have you vomited or thrown up?",
          options: [
            { label: "Not at all",  score: 1 },
            { label: "1–2 times",   score: 2 },
            { label: "3–4 times",   score: 3 },
            { label: "5–6 times",   score: 4 },
            { label: "7 or more",   score: 5 },
          ],
        },
        {
          id: "retching",
          question: "How many times have you had retching or dry heaves?",
          options: [
            { label: "Not at all",  score: 1 },
            { label: "1–2 times",   score: 2 },
            { label: "3–4 times",   score: 3 },
            { label: "5–6 times",   score: 4 },
            { label: "7 or more",   score: 5 },
          ],
        },
      ],
      scoring: [
        { min: 3,  max: 6,  label: "Mild NVP",    color: "green", next: "mild_management"     },
        { min: 7,  max: 12, label: "Moderate HG",  color: "amber", next: "moderate_management" },
        { min: 13, max: 15, label: "Severe HG",    color: "red",   next: "severe_management"   },
      ],
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
            "Small, frequent, bland meals — avoid trigger smells and rich food",
            "Rest and avoid excessive heat",
            "Ginger — tea, biscuits, capsules (evidence-supported)",
            "Acupressure wristbands (P6 point) — low risk, limited evidence",
          ],
        },
        {
          title: "First-line antiemetics",
          note: "All are safe at standard doses in pregnancy",
          drugs: [
            { drug: "Cyclizine",        dose: "50 mg TDS oral",                      note: "First line — antihistamine"                                             },
            { drug: "Prochlorperazine", dose: "5 mg TDS oral or 3 mg buccal BD",     note: "Buccal useful if actively vomiting"                                     },
            { drug: "Promethazine",     dose: "25 mg nocte or TDS oral",              note: "Sedating — advise patient before prescribing"                           },
          ],
        },
        {
          title: "If first-line inadequate — add",
          drugs: [
            { drug: "Ondansetron",             dose: "4 mg BD–TDS oral",                         note: "Discuss risk/benefit; small teratogenic signal; preferred after 10 weeks" },
            { drug: "Pyridoxine + Doxylamine", dose: "Xonvea 10/10 mg — 2 tabs nocte, titrate",  note: "Licensed in UK 2020 for NVP"                                             },
          ],
        },
        {
          title: "Always prescribe",
          drugs: [
            { drug: "Thiamine", dose: "25–50 mg TDS oral", note: "Mandatory in HG — prevents Wernicke's encephalopathy" },
          ],
        },
      ],
      next: "improving_q",
    },

    "moderate_management": {
      type: "treatment",
      title: "Moderate HG — Consider Admission",
      badge: { label: "PUQE 7–12 · Moderate", color: "amber" },
      sections: [
        {
          title: "IV Fluids",
          alert: "Use 0.9% NaCl + KCl — NEVER dextrose (precipitates Wernicke's)",
          items: [
            "0.9% NaCl + 20 mmol KCl at 125 ml/hr — adjust to urine output",
            "Target urine output > 0.5 ml/kg/hr",
            "Correct K⁺ urgently if < 3.0 mmol/L",
          ],
        },
        {
          title: "IV / IM Antiemetics",
          drugs: [
            { drug: "Ondansetron",      dose: "4 mg IV over 15 min TDS",  note: "Slow IV — fast bolus risks QTc prolongation"         },
            { drug: "Cyclizine",        dose: "50 mg IV or IM TDS",        note: ""                                                    },
            { drug: "Metoclopramide",   dose: "10 mg IV or IM TDS",        note: "Max 5 days — extrapyramidal side effect risk"        },
          ],
        },
        {
          title: "Thiamine — Essential",
          drugs: [
            { drug: "Thiamine (Pabrinex)", dose: "100 mg IV TDS for ≥3 days if not eating", note: "Do not omit — Wernicke's risk is serious and preventable" },
          ],
        },
        {
          title: "VTE Prophylaxis",
          items: [
            "Anti-embolism stockings (TEDS) on admission",
            "Assess RCOG VTE risk score — start LMWH if score ≥3",
          ],
        },
      ],
      next: "improving_q",
    },

    "severe_management": {
      type: "escalation",
      title: "Severe HG — Admit & Escalate",
      badge: { label: "PUQE 13–15 · Severe", color: "red" },
      alert: "Call the registrar. Do not manage severe HG alone.",
      items: [
        "Admit — IV access, strict fluid balance chart, daily weights",
        "IV fluids: 0.9% NaCl + KCl — correct electrolytes urgently",
        "Pabrinex (IV thiamine) immediately — 1 pair TDS for minimum 3 days",
        "IV ondansetron 4 mg (slow, over 15 min) TDS",
        "Consider nasogastric or nasoenteral feeding if nothing tolerated orally",
        "Dietitian referral",
        "VTE risk assessment + LMWH + TEDS",
        "If Wernicke's suspected (nystagmus, confusion, ataxia): Pabrinex 2 pairs IV TDS + MRI brain",
      ],
      next: "improving_q",
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
        "Recheck U&E, urinary ketones — persist 3+ after 24h = senior urgency",
        "Consider nasogastric or nasoenteral feeding",
        "Request dietitian review",
        "Discuss with patient if requesting termination of pregnancy due to HG — senior counselling required",
      ],
      next: "escalation_criteria",
    },

    "escalation_criteria": {
      type: "escalation",
      title: "Call the registrar if…",
      subtitle: "Any of the following warrant senior review",
      items: [
        "Suspected Wernicke's encephalopathy — any neurological symptoms",
        "Na⁺ < 130 mmol/L or K⁺ < 3.0 mmol/L",
        "ALT > 3× upper limit of normal",
        "No improvement after 24 hours of IV treatment",
        "Urinary ketones remain 3+ after 24 hours",
        "Weight loss > 10% of pre-pregnancy weight",
        "Suspected concurrent sepsis — fever, tachycardia, RR > 20",
        "Patient requesting termination due to HG — senior counselling required",
      ],
      next: "documentation",
    },

    "documentation": {
      type: "end",
      title: "Document on EPR",
      subtitle: "Before you leave the patient",
      items: [
        "PUQE score — record the number, not just mild/moderate/severe",
        "Current weight vs booking weight — document % loss",
        "Urinary ketones (1+, 2+, 3+)",
        "Fluid balance plan and target urine output (> 0.5 ml/kg/hr)",
        "Antiemetics prescribed — drug, dose, route",
        "Thiamine prescribed — dose, route, planned duration",
        "VTE risk assessment completed",
        "Informed patient of medication safety profile in pregnancy",
        "Review plan — time and by whom",
        "Safety-netting: criteria to return communicated to patient",
      ],
    },

  },
};
