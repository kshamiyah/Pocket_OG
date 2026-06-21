export const HYPEREMESIS_PROTOCOL = {
  id: "hyperemesis",
  title: "Hyperemesis Gravidarum",
  subtitle: "Nausea & vomiting in pregnancy",
  category: "antenatal",
  guideline: "RCOG GTG69",
  color: "emerald",
  startId: "history",
  nodes: {

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
        "Previous hyperemesis gravidarum in this or prior pregnancies",
        "Medications already tried at home",
        "⚠ Red flags: abdominal pain, fever, dysuria, headache, visual changes, confusion, neurological symptoms",
      ],
      next: "examination",
    },

    "examination": {
      type: "checklist",
      title: "Examine the patient",
      subtitle: "Check and document the following",
      items: [
        "BP, HR, RR, temperature, SpO₂",
        "Weight — compare to booking weight, calculate % loss",
        "Signs of dehydration: dry mucous membranes, reduced skin turgor, sunken eyes",
        "Jaundice",
        "Epigastric or abdominal tenderness — exclude surgical cause",
        "Neurological: nystagmus, confusion, ataxia — signs of Wernicke's if severe or prolonged",
      ],
      next: "investigations",
    },

    "investigations": {
      type: "checklist",
      title: "Investigations",
      subtitle: "Request the following",
      alert: "Do NOT give IV dextrose — precipitates Wernicke's encephalopathy in thiamine-deficient patients",
      items: [
        "Urine dip — ketones, protein, nitrites, leucocytes",
        "MSU if any urinary symptoms",
        "FBC",
        "U&E — Na, K, Cl, Creatinine, eGFR",
        "LFTs — ALT raised in ~50% of HG cases",
        "TFTs — biochemical hyperthyroidism in ~60% (transient, usually resolves spontaneously)",
        "Urinary ketones: 2+ or more indicates significant dehydration",
        "USS — confirm viability, exclude molar pregnancy or multiple gestation if not done",
      ],
      next: "puqe",
    },

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
            { label: "Not at all", score: 1 },
            { label: "≤1 hour", score: 2 },
            { label: "2–3 hrs", score: 3 },
            { label: "4–6 hrs", score: 4 },
            { label: ">6 hrs", score: 5 },
          ],
        },
        {
          id: "vomiting",
          question: "How many times have you vomited or thrown up?",
          options: [
            { label: "Not at all", score: 1 },
            { label: "1–2 times", score: 2 },
            { label: "3–4 times", score: 3 },
            { label: "5–6 times", score: 4 },
            { label: "7 or more", score: 5 },
          ],
        },
        {
          id: "retching",
          question: "How many times have you had retching or dry heaves without bringing anything up?",
          options: [
            { label: "Not at all", score: 1 },
            { label: "1–2 times", score: 2 },
            { label: "3–4 times", score: 3 },
            { label: "5–6 times", score: 4 },
            { label: "7 or more", score: 5 },
          ],
        },
      ],
      scoring: [
        { min: 3, max: 6,  label: "Mild NVP",     color: "green", next: "mild_management"     },
        { min: 7, max: 12, label: "Moderate HG",  color: "amber", next: "moderate_management" },
        { min: 13, max: 15, label: "Severe HG",   color: "red",   next: "severe_management"   },
      ],
    },

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
            { drug: "Cyclizine", dose: "50 mg TDS oral", note: "First line — antihistamine" },
            { drug: "Prochlorperazine", dose: "5 mg TDS oral or 3 mg buccal BD", note: "Buccal useful if actively vomiting" },
            { drug: "Promethazine", dose: "25 mg nocte or TDS oral", note: "Sedating — advise patient before prescribing" },
          ],
        },
        {
          title: "If first-line inadequate — add",
          drugs: [
            { drug: "Ondansetron", dose: "4 mg BD–TDS oral", note: "Discuss risk/benefit; very small teratogenic signal; preferred after 10 weeks. Do not use as first line without discussion." },
            { drug: "Pyridoxine + Doxylamine", dose: "Xonvea 10/10 mg — 2 tabs nocte, titrate to max 4 tabs/day", note: "Licensed in UK 2020 for NVP" },
          ],
        },
        {
          title: "Always prescribe",
          drugs: [
            { drug: "Thiamine", dose: "25–50 mg TDS oral", note: "Mandatory in HG — prevents Wernicke's encephalopathy" },
          ],
        },
      ],
      next: "escalation_criteria",
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
            "Correct electrolyte abnormalities — K⁺ < 3.0 needs urgent replacement",
          ],
        },
        {
          title: "IV / IM Antiemetics",
          drugs: [
            { drug: "Ondansetron", dose: "4 mg IV over 15 min TDS", note: "Slow IV infusion — fast bolus risks QTc prolongation" },
            { drug: "Cyclizine", dose: "50 mg IV or IM TDS", note: "" },
            { drug: "Metoclopramide", dose: "10 mg IV or IM TDS", note: "Max 5 days — extrapyramidal side effect risk" },
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
      next: "escalation_criteria",
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
        "Consider nasogastric or nasoenteral feeding if unable to tolerate anything orally",
        "Dietitian referral",
        "VTE risk assessment + LMWH + TEDS",
        "⚠ If Wernicke's suspected (nystagmus, confusion, ataxia): Pabrinex 2 pairs IV TDS + urgent ophthalmology review + MRI brain",
      ],
      next: "escalation_criteria",
    },

    "escalation_criteria": {
      type: "escalation",
      title: "Call the registrar if…",
      subtitle: "Any of the following warrant senior review",
      items: [
        "Suspected Wernicke's encephalopathy — any neurological symptoms (nystagmus, confusion, ataxia)",
        "Severe electrolyte disturbance — Na⁺ < 130 mmol/L or K⁺ < 3.0 mmol/L",
        "ALT > 3× upper limit of normal",
        "No improvement after 24 hours of IV treatment",
        "Urinary ketones remain 3+ after 24 hours",
        "Weight loss > 10% of pre-pregnancy weight",
        "Suspected concurrent sepsis — fever, tachycardia, RR > 20",
        "Patient requesting termination of pregnancy due to HG — senior counselling required",
      ],
      next: "documentation",
    },

    "documentation": {
      type: "end",
      title: "Document on EPR",
      subtitle: "Before you leave the patient — record the following",
      items: [
        "PUQE score (record the number, not just 'mild/moderate/severe')",
        "Current weight vs booking weight — document % loss",
        "Urinary ketones (1+, 2+, 3+)",
        "Fluid balance plan and target urine output (> 0.5 ml/kg/hr)",
        "Antiemetics prescribed — drug name, dose, route",
        "Thiamine prescribed — dose, route, planned duration",
        "VTE risk assessment completed",
        "Informed patient of medication safety profile in pregnancy (esp. ondansetron)",
        "Review plan — time and by whom",
        "Safety-netting: criteria to return or escalate communicated to patient",
      ],
    },

  },
};
