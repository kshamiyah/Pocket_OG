// GTG38 — Management of Gestational Trophoblastic Disease
// RCOG Green-top Guideline No. 38 (September 2020)

export const GTG38_SECTIONS = [
  {
    id: "gtg38-classification-presentation",
    gl: "GTG38",
    condition: "Gestational Trophoblastic Disease",
    setting: "Gynaecology / Early Pregnancy",
    title: "Classification, Presentation & Diagnosis",
    tags: [
      "gestational trophoblastic disease", "gtd", "gtg38", "rcog",
      "molar pregnancy", "hydatidiform mole", "complete mole", "partial mole",
      "gestational trophoblastic neoplasia", "gtn", "choriocarcinoma",
      "placental site trophoblastic tumour", "pstt",
    ],
    content: [
      { type: "text", value: "RCOG Green-top Guideline No. 38 (September 2020) covers gestational trophoblastic disease (GTD) — a spectrum from premalignant molar pregnancies to malignant gestational trophoblastic neoplasia (GTN)." },
      { type: "table", headers: ["Category", "Conditions"], rows: [
        ["Premalignant (molar pregnancy)", "Complete hydatidiform mole; partial hydatidiform mole"],
        ["Malignant (GTN)", "Invasive mole; choriocarcinoma; placental site trophoblastic tumour (PSTT); epithelioid trophoblastic tumour (ETT) — the last two are very rare"],
      ]},
      { type: "text", value: "GTN is defined by persistence of GTD — most commonly a plateaued or rising serum βhCG after evacuation of a molar pregnancy, but it can also follow a non-molar pregnancy." },
      { type: "subheading", value: "Risk Factors" },
      { type: "list", items: [
        "Age at extremes of reproductive life — under 20 or over 35–40 years",
        "Previous molar pregnancy — increases the risk of a further molar pregnancy in a subsequent pregnancy",
        "Complete mole carries a higher risk of progression to GTN than partial mole",
      ]},
      { type: "subheading", value: "Presentation" },
      { type: "list", items: [
        "Irregular vaginal bleeding in early pregnancy — the most common presentation",
        "Uterus large for dates, hyperemesis, or early-onset pre-eclampsia (before 20 weeks — a red flag for molar pregnancy in an otherwise routine hypertension work-up)",
        "Rarely, hyperthyroidism (very high hCG cross-reacts with the TSH receptor) or theca lutein ovarian cysts",
      ]},
      { type: "subheading", value: "Diagnosis" },
      { type: "list", items: [
        "Ultrasound may show the classic vesicular ('snowstorm') pattern, but this is not always present, especially in early or partial moles — many are only identified on histology after presenting as a missed or incomplete miscarriage",
        "Diagnosis is confirmed histologically on the products of conception after evacuation",
      ]},
    ],
  },

  {
    id: "gtg38-initial-management",
    gl: "GTG38",
    condition: "Gestational Trophoblastic Disease",
    setting: "Gynaecology / Early Pregnancy",
    title: "Initial Management & Registration",
    tags: [
      "molar pregnancy evacuation", "suction curettage mole", "anti-d molar pregnancy",
      "gtd registration", "charing cross hospital gtd", "hcg screening centre",
    ],
    flowchartId: "GTG38_GTD_PATHWAY",
    content: [
      { type: "alert", value: "Suction curettage is the method of choice for uterine evacuation of a complete mole, whatever the uterine size — avoid medical evacuation (prostaglandins/oxytocin) where possible, as it may increase the risk of embolisation of trophoblastic tissue and the need for chemotherapy." },
      { type: "list", items: [
        "Anti-D prophylaxis is given following evacuation in Rh-negative women, as for any pregnancy loss",
        "Send all products of conception from any evacuation for histology — this is how most cases are actually diagnosed",
      ]},
      { type: "alert", value: "Register every confirmed case with one of the UK's specialist GTD screening centres (Charing Cross, Sheffield, or Dundee) for centralised hCG follow-up — this centralisation is what allows the UK's excellent outcomes for this rare disease group." },
    ],
  },

  {
    id: "gtg38-followup-future-pregnancy",
    gl: "GTG38",
    condition: "Gestational Trophoblastic Disease",
    setting: "Gynaecology / Early Pregnancy",
    title: "hCG Follow-Up, Contraception & Future Pregnancy",
    tags: [
      "hcg follow up molar pregnancy", "molar pregnancy contraception",
      "gtn chemotherapy", "methotrexate gtn", "future pregnancy after molar pregnancy",
    ],
    content: [
      { type: "subheading", value: "hCG Follow-Up" },
      { type: "list", items: [
        "Serial urine and/or serum hCG monitoring after evacuation, via the registered screening centre",
        "If hCG normalises within 8 weeks of evacuation: follow up for 6 months from the date of evacuation",
        "If hCG takes longer than 8 weeks to normalise: follow up for 6 months from the date of the first normal result",
      ]},
      { type: "subheading", value: "Contraception During Follow-Up" },
      { type: "list", items: [
        "Advise against pregnancy until follow-up is complete — a new pregnancy makes a rising hCG impossible to interpret",
        "Barrier contraception (or abstinence) is preferred until hCG has normalised",
        "Hormonal contraception can generally be started once hCG has normalised — confirm current advice with the registered screening centre",
        "Avoid an intrauterine device until hCG has normalised, because of perforation and bleeding risk in a uterus that may still contain trophoblastic tissue",
      ]},
      { type: "subheading", value: "Gestational Trophoblastic Neoplasia (GTN)" },
      { type: "text", value: "GTN is managed with chemotherapy at a specialist centre, risk-stratified by a validated scoring system (FIGO/WHO)." },
      { type: "list", items: [
        "Low-risk GTN: single-agent chemotherapy, typically methotrexate",
        "High-risk GTN: multi-agent chemotherapy",
        "Cure rates are very high even in high-risk disease, reflecting how chemosensitive GTN is and the benefit of centralised specialist management",
        "Placental site trophoblastic tumour (PSTT) and epithelioid trophoblastic tumour (ETT) behave differently from choriocarcinoma — they are relatively chemo-resistant and slower-growing, so hysterectomy is often the primary treatment rather than chemotherapy alone",
      ]},
      { type: "subheading", value: "Twin Pregnancy with a Coexisting Mole" },
      { type: "text", value: "A molar pregnancy coexisting with a normal twin is rare but not automatically an indication for termination — refer to a specialist fetal medicine and GTD centre jointly, since ongoing pregnancy is possible with appropriate counselling and surveillance for pre-eclampsia and haemorrhage risk." },
      { type: "subheading", value: "Future Pregnancy" },
      { type: "text", value: "A future pregnancy is not otherwise restricted once follow-up is complete, though early ultrasound in the next pregnancy is advised to confirm normal placentation, and the placenta/products should again be sent for histology after that pregnancy." },
    ],
  },
];
