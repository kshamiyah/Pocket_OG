export const SWOLLEN_LEGS_PROTOCOL = {
  id: "swollen_legs",
  title: "Swollen Legs in Pregnancy",
  subtitle: "DVT screen & VTE risk assessment",
  category: "antenatal",
  guideline: "RBH GL891",
  color: "violet",
  startId: "laterality_q",
  nodes: {

    // ─── Opening question ──────────────────────────────────────────────────────

    "laterality_q": {
      type: "question",
      question: "Is it one leg or both?",
      subtitle: "The single most important initial question",
      options: [
        { label: "One leg only",  sublabel: "Unilateral — DVT until proven otherwise",   next: "tenderness_q"  },
        { label: "Both legs",     sublabel: "Bilateral — more likely physiological",      next: "bilateral_q"   },
      ],
    },

    // ─── Bilateral path ────────────────────────────────────────────────────────

    "bilateral_q": {
      type: "question",
      question: "Any shortness of breath, chest pain, or haemoptysis?",
      subtitle: "These suggest pulmonary embolism — a medical emergency",
      options: [
        { label: "No — no respiratory symptoms",     next: "bilateral_assessment" },
        { label: "Yes — one or more of the above",   next: "pe_concern"           },
      ],
    },

    "pe_concern": {
      type: "escalation",
      title: "Possible PE — escalate immediately",
      alert: "PE is a leading cause of maternal death. Do not delay senior involvement.",
      items: [
        "Call the registrar immediately",
        "ECG and chest X-ray — do not withhold imaging due to pregnancy",
        "SpO₂ monitoring and oxygen if < 94%",
        "FBC, U&E, LFTs — baseline before LMWH",
        "If high clinical suspicion: start therapeutic LMWH now, do not wait for imaging",
        "Discuss with senior and radiology: CTPA vs V/Q scan — both acceptable in pregnancy",
        "Do not leave the patient alone",
      ],
      source: { gl: "GL891", sectionId: "vte-risk-assessment", label: "VTE Risk Assessment & Antenatal Prophylaxis" },
      next: "documentation",
    },

    "bilateral_assessment": {
      type: "treatment",
      title: "Bilateral swelling — likely physiological",
      sections: [
        {
          title: "Features of physiological oedema",
          items: [
            "Bilateral, symmetrical, pitting oedema",
            "Worse at end of day, improves with rest and elevation",
            "No calf tenderness, redness, or warmth",
            "Gradual onset — common from second trimester",
          ],
        },
        {
          title: "Still check for VTE risk",
          items: [
            "Complete VTE risk scoring before discharge",
            "Advise mobilisation and avoidance of dehydration",
          ],
        },
      ],
      source: { gl: "GL891", sectionId: "vte-risk-assessment", label: "VTE Risk Assessment & Antenatal Prophylaxis" },
      next: "vte_risk_q",
    },

    // ─── Unilateral / DVT suspect path ────────────────────────────────────────

    "tenderness_q": {
      type: "question",
      question: "Is there calf tenderness, redness, or warmth?",
      subtitle: "Deep palpation of the calf — compare to the other side",
      options: [
        { label: "Yes — tender, red, or warm",    next: "dvt_high_risk"  },
        { label: "No — none of those",            next: "dvt_lower_risk" },
      ],
    },

    "dvt_high_risk": {
      type: "checklist",
      title: "High suspicion of DVT — act now",
      alert: "Do NOT use Wells score — not validated in pregnancy. Do NOT request D-dimer — physiologically elevated, do not use.",
      items: [
        "Start therapeutic LMWH empirically — do not wait for USS",
        "Refer urgently for compression duplex ultrasound of the leg",
        "FBC, U&E, LFTs — baseline before LMWH",
        "Measure calf circumference bilaterally — document difference",
        "Call registrar — therapeutic anticoagulation in pregnancy requires senior input",
      ],
      source: { gl: "GL891", sectionId: "vte-dosing-antenatal", label: "VTE — Enoxaparin Dosing (Prophylactic & Therapeutic)" },
      next: "uss_q",
    },

    "dvt_lower_risk": {
      type: "checklist",
      title: "Lower suspicion — still investigate",
      alert: "Do NOT request D-dimer — physiologically elevated in pregnancy. Does not exclude DVT.",
      items: [
        "Refer for compression duplex ultrasound — still required with unilateral swelling",
        "FBC, U&E, LFTs — baseline",
        "Measure calf circumference bilaterally — document in notes",
        "Do not withhold LMWH if clinical concern is high — discuss with registrar",
      ],
      source: { gl: "GL891", sectionId: "vte-risk-assessment", label: "VTE Risk Assessment & Antenatal Prophylaxis" },
      next: "uss_q",
    },

    // ─── USS result ───────────────────────────────────────────────────────────

    "uss_q": {
      type: "question",
      question: "What did the duplex USS show?",
      options: [
        { label: "DVT confirmed",                   next: "confirmed_dvt"      },
        { label: "Negative — but still concerned",  next: "negative_concerned" },
        { label: "Negative — low risk",             next: "vte_risk_q"         },
      ],
    },

    "confirmed_dvt": {
      type: "treatment",
      title: "DVT confirmed — therapeutic LMWH",
      sections: [
        {
          title: "Therapeutic dose — high risk BD (1 mg/kg) — CrCl ≥ 30 mL/min",
          drugs: [
            { drug: "Enoxaparin", dose: "1 mg/kg BD SC", note: "Refer to weight-banded BD dosing table in GL891 vte-dosing-antenatal" },
          ],
        },
        {
          title: "Next steps",
          items: [
            "Haematology review — therapeutic anticoagulation in pregnancy requires specialist input",
            "Continue therapeutic LMWH throughout pregnancy and for at least 6 weeks postnatally",
            "Issue entire LMWH course in secondary care (MBRRACE 2023)",
            "Educate patient on injection technique and what to report",
          ],
        },
      ],
      source: { gl: "GL891", sectionId: "vte-dosing-antenatal", label: "VTE — Enoxaparin Dosing (Prophylactic & Therapeutic)" },
      next: "escalation",
    },

    "negative_concerned": {
      type: "escalation",
      title: "Negative leg USS but still concerned",
      items: [
        "USS pelvis — pelvic DVT can be missed on leg scan",
        "Consider MRI pelvis if pelvic DVT suspected",
        "Discuss with haematology and senior obstetrician",
        "If clinical suspicion remains high: continue empirical LMWH",
      ],
      source: { gl: "GL891", sectionId: "vte-risk-assessment", label: "VTE Risk Assessment & Antenatal Prophylaxis" },
      next: "vte_risk_q",
    },

    // ─── VTE risk scoring ──────────────────────────────────────────────────────

    "vte_risk_q": {
      type: "question",
      question: "Any VTE risk factors?",
      subtitle: "Covers all patients — bilateral physiological and lower-risk unilateral",
      options: [
        { label: "Previous VTE or on long-term anticoagulation",     next: "high_risk_vte"          },
        { label: "Intermediate risk factors present",                 next: "intermediate_risk_vte"  },
        { label: "Scoring 3–4 cumulative risk factors",              next: "cumulative_risk_vte"    },
        { label: "Low risk — <3 factors, no prior VTE",              next: "low_risk_vte"           },
      ],
    },

    "high_risk_vte": {
      type: "treatment",
      title: "High VTE risk — prophylactic LMWH throughout",
      sections: [
        {
          title: "LMWH — prophylactic dosing by booking weight (CrCl ≥ 30 mL/min)",
          drugs: [
            { drug: "Enoxaparin", dose: "20 mg OD SC",       note: "< 50 kg"       },
            { drug: "Enoxaparin", dose: "40 mg OD SC",       note: "50–89.9 kg"    },
            { drug: "Enoxaparin", dose: "60 mg OD SC",       note: "90–129.9 kg"   },
            { drug: "Enoxaparin", dose: "80 mg OD SC",       note: "130–169.9 kg"  },
            { drug: "Enoxaparin", dose: "0.6 mg/kg/day SC",  note: "≥ 170 kg"      },
          ],
        },
        {
          title: "Duration",
          items: [
            "LMWH throughout pregnancy + 6 weeks postnatal",
            "Issue entire course in secondary care — do not rely on GP to prescribe",
          ],
        },
      ],
      source: { gl: "GL891", sectionId: "vte-dosing-antenatal", label: "VTE — Enoxaparin Dosing (Prophylactic & Therapeutic)" },
      next: "escalation",
    },

    "intermediate_risk_vte": {
      type: "treatment",
      title: "Intermediate VTE risk — seek senior input",
      sections: [
        {
          title: "Risk factors",
          items: [
            "Hospital admission",
            "Single previous VTE related to major surgery",
            "High-risk thrombophilia with no VTE: antithrombin deficiency, Protein C deficiency, Protein S deficiency, or > 1 thrombophilia",
            "Medical co-morbidities: cancer, heart failure, active SLE, IBD, nephrotic syndrome, Type 1 DM with nephropathy, sickle cell disease, current IVDU",
            "Any surgical procedure during pregnancy",
            "OHSS (first trimester only)",
          ],
        },
        {
          title: "Management",
          items: [
            "Refer to Friday am Haematology-Obstetrics clinic if required",
            "Discuss with registrar or consultant — prophylactic LMWH likely indicated",
            "Known antithrombin deficiency or APS may need 50–75% above prophylactic dose — manage in collaboration with haematologists",
          ],
        },
      ],
      source: { gl: "GL891", sectionId: "vte-risk-assessment", label: "VTE Risk Assessment & Antenatal Prophylaxis" },
      next: "escalation",
    },

    "cumulative_risk_vte": {
      type: "treatment",
      title: "Cumulative risk factors — scoring",
      sections: [
        {
          title: "1 point each (BMI >40 = 2 points)",
          items: [
            "BMI > 30 kg/m² · BMI > 40 kg/m² (= 2 risk factors) · Age > 35 · Parity ≥ 3 · Smoker",
            "Gross varicose veins · Current pre-eclampsia · Immobility (paraplegia, PGP)",
            "Family history of unprovoked or oestrogen-provoked VTE in 1st degree relative",
            "Multiple pregnancy · IVF/ART · Low-risk thrombophilia",
            "Transient risk factors: dehydration/hyperemesis (if admitted), current systemic infection, long-distance travel",
          ],
        },
        {
          title: "What the score means",
          items: [
            "≥ 4 cumulative risk factors → thromboprophylaxis from 1st trimester — arrange through DAU",
            "3 cumulative risk factors → thromboprophylaxis from 28 weeks — refer to any consultant ANC",
            "< 3 cumulative risk factors → mobilisation and avoidance of dehydration only",
          ],
        },
      ],
      source: { gl: "GL891", sectionId: "vte-risk-assessment", label: "VTE Risk Assessment & Antenatal Prophylaxis" },
      next: "escalation",
    },

    "low_risk_vte": {
      type: "treatment",
      title: "Low VTE risk — general advice",
      sections: [
        {
          title: "Advice",
          items: [
            "Mobilisation and avoidance of dehydration — key measures in any pregnancy",
            "Reassure: bilateral pitting oedema at this gestation is common and physiological",
            "Return if swelling becomes unilateral, painful, or develops redness",
          ],
        },
      ],
      source: { gl: "GL891", sectionId: "vte-risk-assessment", label: "VTE Risk Assessment & Antenatal Prophylaxis" },
      next: "escalation",
    },

    // ─── Escalation & documentation ───────────────────────────────────────────

    "escalation": {
      type: "escalation",
      title: "Escalate — call the senior if…",
      items: [
        "DVT confirmed on duplex — therapeutic LMWH and haematology input required",
        "PE suspected — chest pain, dyspnoea, haemoptysis, tachycardia",
        "Leg USS negative but clinical suspicion remains high — pelvic DVT, MRI",
        "Known antithrombin deficiency or APS — 50–75% above prophylactic dose required, manage with haematologists",
        "CrCl < 30 mL/min — discuss dose adjustment with Consultant Haematologist",
        "No clinical improvement on LMWH after 48–72 hours",
      ],
      source: { gl: "GL891", sectionId: "vte-risk-assessment", label: "VTE Risk Assessment & Antenatal Prophylaxis" },
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
        "Duplex USS referred — date and urgency",
        "VTE risk score — total score and risk category",
        "LMWH prescribed — drug, dose, route, frequency; first dose given",
        "Haematology or senior review if required",
        "Safety-netting: worsening swelling, SOB, chest pain → attend ED immediately",
      ],
      source: { gl: "GL891", sectionId: "vte-postnatal", label: "VTE — Postnatal Risk Scoring & Prophylaxis Duration" },
    },

  },
};
