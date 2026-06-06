// GL891 — VTE in Pregnancy & Postnatal
// Two pathways: antenatal risk assessment / prophylaxis, and postnatal risk assessment

export const GL891_ANTENATAL_FLOWCHART = {
  id: "GL891_ANTENATAL",
  title: "Antenatal VTE Risk Pathway",
  subtitle: "GL891 · VTE in Pregnancy — Antenatal Prophylaxis",
  startId: "assess",
  nodes: {

    "assess": {
      type: "action",
      title: "Perform VTE Risk Assessment",
      text: "Assess at booking, on every admission, with new intercurrent problems, and post-delivery.",
      items: [
        "Document risk assessment in the maternity record",
        "Reassess if clinical circumstances change (admission, hyperemesis, infection, surgery)",
        "Known antithrombin deficiency or APS may need 50–75% above prophylactic dose — manage with haematology",
      ],
      next: "previous-vte",
    },

    "previous-vte": {
      type: "decision",
      title: "Previous VTE or on anticoagulation?",
      text: "Highest-priority criteria — check these first.",
      options: [
        { label: "Yes — previous VTE or on long-term oral anticoagulant", sublabel: "Any previous VTE (except single event from major surgery) · already on oral anticoagulation", next: "high-risk" },
        { label: "No", sublabel: "Continue to intermediate-risk assessment", next: "intermediate-check" },
      ],
    },

    "high-risk": {
      type: "alert",
      title: "High Risk — LMWH Throughout + 6 Weeks Postnatal",
      text: "Antenatal LMWH for the whole pregnancy and 6 weeks postnatal.",
      items: [
        "Already on long-term oral anticoagulation: switch immediately to therapeutic enoxaparin",
        "GP gives 2-week bridging LMWH after positive test; DAU arranges ongoing supply",
        "Refer to Miss Fayyaz or Miss Gajree's antenatal clinic",
      ],
      next: "dosing",
    },

    "intermediate-check": {
      type: "decision",
      title: "Any intermediate-risk factor?",
      text: "ANY one of the following indicates antenatal prophylaxis.",
      items: [
        "Hospital admission",
        "Single previous VTE related to major surgery",
        "High-risk thrombophilia: antithrombin, Protein C, or Protein S deficiency; or > 1 thrombophilia",
        "Medical comorbidity: cancer, heart failure, active SLE, IBD, nephrotic syndrome, T1DM with nephropathy, sickle cell, current IVDU",
        "Any surgical procedure during pregnancy",
        "OHSS (first trimester only)",
      ],
      options: [
        { label: "Yes — any factor above applies", sublabel: "Consider antenatal LMWH; seek senior input", next: "intermediate-risk" },
        { label: "No — none apply", sublabel: "Score cumulative risk factors instead", next: "cumulative" },
      ],
    },

    "intermediate-risk": {
      type: "action",
      title: "Intermediate Risk — Consider Antenatal Prophylaxis",
      text: "Consider antenatal LMWH; seek senior input.",
      items: [
        "Refer to Friday am Haematology-Obstetrics clinic if required",
        "OHSS: prophylaxis in first trimester only",
      ],
      next: "dosing",
    },

    "cumulative": {
      type: "decision",
      title: "Count cumulative risk factors",
      text: "Each factor = 1 point. BMI > 40 counts as 2 points.",
      items: [
        "BMI > 30 kg/m²",
        "BMI > 40 kg/m² (= 2 risk factors)",
        "Age > 35",
        "Parity ≥ 3",
        "Smoker",
        "Gross varicose veins",
        "Current pre-eclampsia",
        "Immobility (paraplegia, PGP)",
        "Family history of unprovoked or oestrogen-provoked VTE in 1st degree relative",
        "Multiple pregnancy",
        "IVF / ART",
        "Low-risk thrombophilia",
        "Transient: dehydration/hyperemesis (if admitted), current systemic infection, long-distance travel",
      ],
      options: [
        { label: "≥ 4 risk factors", sublabel: "Thromboprophylaxis from 1st trimester", next: "from-first" },
        { label: "3 risk factors", sublabel: "Thromboprophylaxis from 28 weeks", next: "from-28" },
        { label: "< 3 risk factors", sublabel: "Mobilisation and avoid dehydration", next: "mobilise" },
      ],
    },

    "from-first": {
      type: "action",
      title: "Prophylaxis from 1st Trimester",
      text: "≥ 4 cumulative risk factors.",
      items: [
        "Start thromboprophylaxis in the first trimester",
        "Arrange supply through DAU",
      ],
      next: "dosing",
    },

    "from-28": {
      type: "action",
      title: "Prophylaxis from 28 Weeks",
      text: "3 cumulative risk factors.",
      items: [
        "Start thromboprophylaxis from 28 weeks",
        "Refer to any consultant antenatal clinic",
      ],
      next: "dosing",
    },

    "mobilise": {
      type: "end",
      title: "Mobilisation & Hydration Only",
      text: "< 3 cumulative risk factors and no high/intermediate criteria.",
      items: [
        "Encourage mobilisation",
        "Avoid dehydration",
        "Reassess on any admission or change in circumstances",
      ],
    },

    "dosing": {
      type: "end",
      title: "Prophylactic Enoxaparin Dosing (CrCl ≥ 30)",
      text: "Dose by booking/most recent weight. For CrCl < 30: discuss with Consultant Haematologist.",
      items: [
        "< 50 kg: 20 mg OD",
        "50–89.9 kg: 40 mg OD",
        "90–129.9 kg: 60 mg OD",
        "130–169.9 kg: 80 mg OD",
        "≥ 170 kg: 0.6 mg/kg/day",
        "Complete a postnatal VTE assessment after delivery (separate pathway)",
      ],
    },

  },
};

export const GL891_POSTNATAL_FLOWCHART = {
  id: "GL891_POSTNATAL",
  title: "Postnatal VTE Risk Pathway",
  subtitle: "GL891 · VTE Postnatal — Prophylaxis Duration",
  startId: "assess",
  nodes: {

    "assess": {
      type: "action",
      title: "Complete Postnatal VTE Assessment",
      text: "Complete on EPR as soon after delivery as possible — within the first 6 hours.",
      items: [
        "Prescriptions for the entire postnatal LMWH course must be issued in secondary care (MBRRACE 2023)",
        "Give first dose as soon as possible after delivery",
        "Withhold 4–6 hours after insertion or removal of an epidural catheter",
      ],
      next: "high-check",
    },

    "high-check": {
      type: "decision",
      title: "Any high-risk criterion?",
      text: "ANY one indicates ≥ 6 weeks postnatal thromboprophylaxis.",
      items: [
        "Any previous VTE",
        "Required antenatal LMWH during this pregnancy",
        "High-risk thrombophilia: antithrombin, Protein S, or Protein C deficiency",
        "Low-risk thrombophilia + family history of VTE",
      ],
      options: [
        { label: "Yes — any criterion above applies", sublabel: "≥ 6 weeks postnatal LMWH", next: "high-6wk" },
        { label: "No — none apply", sublabel: "Assess intermediate-risk criteria", next: "intermediate-check" },
      ],
    },

    "high-6wk": {
      type: "end",
      title: "High Risk — ≥ 6 Weeks LMWH",
      text: "At least 6 weeks of postnatal thromboprophylaxis.",
      items: [
        "Prophylactic enoxaparin by weight (same tables as antenatal)",
        "Issue entire course in secondary care",
        "For CrCl < 30: discuss with Consultant Haematologist",
      ],
    },

    "intermediate-check": {
      type: "decision",
      title: "Any intermediate-risk criterion?",
      text: "ANY one — OR 2 or more cumulative risk factors — indicates ≥ 10 days.",
      items: [
        "Caesarean section in labour",
        "BMI > 40 kg/m²",
        "Readmission or prolonged admission (≥ 3 days) in puerperium",
        "Surgical procedure in puerperium (except immediate perineal repair)",
        "Medical comorbidity: cancer, heart failure, active SLE, IBD, nephrotic syndrome, T1DM with nephropathy, sickle cell, current IVDU",
        "2 or more cumulative risk factors",
      ],
      options: [
        { label: "Yes — any criterion or ≥ 2 cumulative factors", sublabel: "≥ 10 days postnatal LMWH", next: "intermediate-10d" },
        { label: "No — none apply", sublabel: "Early mobilisation and hydration only", next: "lowrisk" },
      ],
    },

    "intermediate-10d": {
      type: "end",
      title: "Intermediate Risk — ≥ 10 Days LMWH",
      text: "At least 10 days of postnatal thromboprophylaxis.",
      items: [
        "Prophylactic enoxaparin by weight (same tables as antenatal)",
        "Cumulative factors: age >35, BMI ≥30, parity ≥3, smoker, elective CS, family history, low-risk thrombophilia, gross varicose veins, systemic infection, immobility, pre-eclampsia, multiple pregnancy, preterm <37 wks, stillbirth, mid-cavity/rotational delivery, prolonged labour >24h, PPH >1 L / transfusion",
      ],
    },

    "lowrisk": {
      type: "end",
      title: "Low Risk — Mobilisation & Hydration",
      text: "No high/intermediate criteria and < 2 cumulative factors.",
      items: [
        "Encourage early mobilisation",
        "Avoid dehydration",
        "Reassess if readmitted or circumstances change",
      ],
    },

  },
};
