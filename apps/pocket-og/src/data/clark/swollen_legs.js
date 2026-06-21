export const SWOLLEN_LEGS_PROTOCOL = {
  id: "swollen_legs",
  title: "Swollen Legs in Pregnancy",
  subtitle: "DVT screen & VTE risk assessment",
  category: "antenatal",
  guideline: "RBH GL891",
  color: "violet",
  startId: "history",
  nodes: {

    "history": {
      type: "checklist",
      title: "Take a focused history",
      subtitle: "Distinguish physiological oedema from DVT",
      alert: "Unilateral swelling, calf tenderness, or redness should raise suspicion of DVT until proven otherwise",
      items: [
        "Onset — acute vs gradual; unilateral vs bilateral",
        "Calf pain, tenderness, or warmth",
        "Redness or skin changes over the leg",
        "Shortness of breath, chest pain, or haemoptysis — may indicate concurrent PE",
        "Gestation and recent mobility",
        "Recent long-haul travel or prolonged immobility",
        "Previous VTE or thrombophilia",
        "Risk factors: BMI >30, age >35, parity ≥3, smoking, family history of VTE, multiple pregnancy",
      ],
      next: "examination",
    },

    "examination": {
      type: "checklist",
      title: "Examine the patient",
      items: [
        "BP, HR, SpO₂, temperature",
        "Inspect both legs — compare for asymmetry in swelling",
        "Measure calf circumference bilaterally — 10 cm below tibial tuberosity",
        "Calf tenderness on deep palpation",
        "Skin: warmth, erythema, palpable cord along vessel",
        "Varicosities vs deep vein tenderness — superficial varicosities are common in pregnancy",
        "Respiratory assessment if dyspnoea present",
      ],
      next: "clinical_assessment",
    },

    "clinical_assessment": {
      type: "treatment",
      title: "Clinical assessment",
      sections: [
        {
          title: "Features suggesting DVT — investigate urgently",
          items: [
            "Unilateral leg swelling (>3 cm difference in calf circumference)",
            "Calf tenderness on deep palpation",
            "Redness, warmth, or erythema over the affected limb",
            "Acute, asymmetrical onset",
          ],
        },
        {
          title: "Features suggesting physiological oedema — common in pregnancy",
          items: [
            "Bilateral pitting oedema, worse at end of day",
            "No calf tenderness or skin changes",
            "Improves with rest and leg elevation",
            "Gradual onset — common from second trimester",
          ],
        },
        {
          title: "Key rules if DVT suspected",
          items: [
            "Do NOT use standard Wells score — not validated in pregnancy",
            "Do NOT request D-dimer — physiologically elevated in pregnancy; unreliable",
            "Refer urgently for compression duplex ultrasound",
            "If clinical suspicion is high — start therapeutic LMWH empirically; do not wait for USS",
          ],
        },
      ],
      next: "investigations",
    },

    "investigations": {
      type: "checklist",
      title: "Investigations",
      items: [
        "Compression duplex ultrasound of the leg — definitive investigation for DVT",
        "FBC, U&E, LFTs — baseline before starting LMWH",
        "Do NOT request D-dimer — physiologically elevated in pregnancy; do not use to exclude DVT",
        "If PE suspected: chest X-ray, ECG — discuss with senior before further imaging",
        "If first unprovoked VTE: thrombophilia screen — ideally pre-treatment or 3 months after (not whilst on LMWH)",
        "USS pelvis if leg USS negative but clinical concern persists — pelvic DVT may be missed on leg scan",
      ],
      next: "vte_risk",
    },

    "vte_risk": {
      type: "treatment",
      title: "VTE risk scoring (GL891)",
      sections: [
        {
          title: "High risk — LMWH throughout pregnancy + 6 weeks postnatal",
          items: [
            "Previous VTE (any, except single event from major surgery)",
            "On long-term anticoagulation before pregnancy",
            "Confirmed DVT at this presentation → therapeutic LMWH (see dosing below)",
          ],
        },
        {
          title: "Intermediate risk — consider prophylactic LMWH (seek senior input)",
          items: [
            "Hospital admission",
            "Single previous VTE from major surgery",
            "High-risk thrombophilia: antithrombin, Protein C, or Protein S deficiency",
            "Medical comorbidity: cancer, heart failure, active SLE, IBD, sickle cell, IVDU",
          ],
        },
        {
          title: "Cumulative risk scoring (1 point each; BMI >40 = 2 points)",
          items: [
            "BMI >30, age >35, parity ≥3, smoker, gross varicose veins, current pre-eclampsia",
            "Immobility, family history of VTE, multiple pregnancy, IVF/ART",
            "Low-risk thrombophilia (factor V Leiden, prothrombin gene mutation)",
            "≥4 factors → prophylaxis from 1st trimester",
            "3 factors → prophylaxis from 28 weeks",
            "<3 factors → mobilisation and hydration only",
          ],
        },
      ],
      next: "lmwh",
    },

    "lmwh": {
      type: "treatment",
      title: "Enoxaparin dosing",
      sections: [
        {
          title: "Prophylactic dose (CrCl ≥30 ml/min) — by booking weight",
          drugs: [
            { drug: "Enoxaparin", dose: "20 mg OD SC",       note: "<50 kg" },
            { drug: "Enoxaparin", dose: "40 mg OD SC",       note: "50–89.9 kg" },
            { drug: "Enoxaparin", dose: "60 mg OD SC",       note: "90–129.9 kg" },
            { drug: "Enoxaparin", dose: "80 mg OD SC",       note: "130–169.9 kg" },
            { drug: "Enoxaparin", dose: "0.6 mg/kg/day SC",  note: "≥170 kg" },
          ],
        },
        {
          title: "Therapeutic dose — confirmed DVT (discuss with haematology)",
          drugs: [
            { drug: "Enoxaparin", dose: "1 mg/kg BD SC", note: "Monitor anti-Xa 4h post-dose; target 0.5–1.0 IU/ml" },
          ],
        },
        {
          title: "Important",
          items: [
            "CrCl <30 ml/min — discuss dose with consultant haematologist",
            "Antithrombin deficiency or APS — may need 50–75% above standard prophylactic dose",
            "Issue entire LMWH course in secondary care (MBRRACE 2023 recommendation)",
          ],
        },
      ],
      next: "escalation",
    },

    "escalation": {
      type: "escalation",
      title: "Escalate — call the senior if…",
      items: [
        "DVT confirmed on duplex USS — therapeutic LMWH required; liaise with haematology",
        "PE suspected — chest pain, dyspnoea, haemoptysis, tachycardia → senior urgently",
        "Leg USS negative but clinical suspicion remains high — pelvic DVT, consider MRI",
        "Known antithrombin deficiency or APS — above-standard dosing required",
        "Known thrombophilia — manage with haematology input",
        "CrCl <30 ml/min — dose adjustment required",
        "No clinical improvement on LMWH after 48–72 hours",
      ],
      next: "documentation",
    },

    "documentation": {
      type: "end",
      title: "Document on EPR",
      subtitle: "Before you leave the patient",
      items: [
        "Presentation — unilateral vs bilateral, duration, associated symptoms",
        "Calf circumference measurements — both legs",
        "Clinical findings — tenderness, erythema, skin changes",
        "DVT suspected — yes/no and clinical basis",
        "Duplex USS referred — date, urgency",
        "VTE risk score — total score and risk category",
        "LMWH prescribed — drug, dose, route, frequency; first dose given",
        "Haematology or senior review if required",
        "Safety-netting: worsening swelling, SOB, chest pain → attend ED immediately",
      ],
    },

  },
};
