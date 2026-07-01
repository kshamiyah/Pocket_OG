// GTG5 — The Management of Ovarian Hyperstimulation Syndrome
// (RCOG Green-Top Guideline No. 5, 4th edition, BJOG 2026;133:e50–e69,
// DOI 10.1111/1471-0528.70195)

export const GTG5_SECTIONS = [
  {
    id: "gtg5-overview",
    gl: "GTG5",
    condition: "Ovarian Hyperstimulation Syndrome",
    setting: "Fertility Treatment / Gynaecology Emergency",
    title: "OHSS — Overview, Pathophysiology & Incidence",
    tags: [
      "ohss", "ovarian hyperstimulation syndrome", "ivf complication", "fertility treatment complication",
      "hcg trigger", "vegf", "ascites ivf", "early ohss", "late ohss", "freeze all", "elective frozen embryo transfer",
    ],
    flowchartId: "GTG5_OHSS",
    content: [
      { type: "text", value: "OHSS is a systemic complication of fertility treatment involving pharmacological ovarian stimulation. Exposure of hyperstimulated ovaries to hCG and/or LH triggers release of pro-inflammatory mediators — vascular endothelial growth factor (VEGF) predominates — causing increased vascular permeability and a prothrombotic state. In the absence of hCG/LH-induced luteinisation, OHSS is rare." },
      { type: "alert", value: "Fluid shifts into the extravascular space (ascites, occasionally pleural/pericardial effusion) while the intravascular space becomes hypovolaemic and haemoconcentrated — a typical loss of 20% of calculated blood volume in the acute phase of severe OHSS. Paradoxically, serum osmolality and sodium fall too — a 'reset' of the osmotic thresholds for thirst and vasopressin, not electrolyte loss. Don't chase this biochemistry with electrolyte replacement." },

      { type: "subheading", value: "Timing — early vs late OHSS" },
      { type: "list", items: [
        "Early OHSS: presents within 7 days of the hCG trigger, usually reflecting an excessive ovarian response to stimulation.",
        "Late OHSS: presents ≥10 days after the hCG trigger, usually driven by endogenous hCG from an early pregnancy — the preceding ovarian response may have looked unremarkable. Late OHSS tends to be more prolonged and severe; early paracentesis is associated with quicker improvement.",
      ]},

      { type: "subheading", value: "Incidence & risk factors" },
      { type: "list", items: [
        "Incidence 3–6% of fertility treatment overall; mild OHSS in roughly a third of conventional IVF cycles; moderate-to-severe 3.1–8%, lower with GnRH antagonist regimens (~6% moderate, ~3% severe).",
        "UK HFEA data: 66 reported severe/critical cases in 2021–22, <0.1% of IVF cycles. A UK single-centre study using antagonist protocols with liberal preventive measures reported 1.6% moderate-to-severe OHSS per cycle.",
        "Risk factors: previous OHSS, PCOS/polycystic ovarian morphology, high antral follicle count, high AMH, younger age, Black ethnicity.",
        "Risk rises further if conception occurs, and rises again with multiple pregnancy — driven by ongoing/rising hCG. Conditions causing very high hCG (e.g. molar pregnancy) also raise risk.",
        "Rare with clomifene citrate, aromatase inhibitors or mono-follicular gonadotropin induction, but can still occur — and very rarely occurs spontaneously in a natural conception.",
        "Obesity has been associated with lower complication rates in hospitalised women with OHSS — mechanism unclear.",
      ]},

      { type: "subheading", value: "Key prevention point relevant to fresh transfer" },
      { type: "alert", value: "Women undergoing fresh IVF who develop early OHSS symptoms before embryo transfer should be advised against fresh transfer — freeze all embryos and plan an interval frozen embryo replacement instead. [Grade D]" },
      { type: "text", value: "A meta-analysis of 11 studies (n=5379) found elective interval frozen embryo transfer significantly reduced moderate/severe OHSS versus fresh transfer (RR 0.42, 95% CI 0.19–0.96) and increased live birth rates overall (RR 1.12, 95% CI 1.01–1.24), with the benefit greatest in hyper-responders (RR 1.16, 95% CI 1.05–1.28)." },
    ],
  },

  {
    id: "gtg5-diagnosis",
    gl: "GTG5",
    condition: "Ovarian Hyperstimulation Syndrome",
    setting: "Gynaecology Emergency",
    title: "Diagnosis of OHSS & Differential Diagnosis",
    tags: [
      "ohss diagnosis", "abdominal pain fertility treatment", "ohss differential diagnosis",
      "ovarian torsion ivf", "ectopic pregnancy ivf", "haematocrit ohss", "serum osmolality",
    ],
    content: [
      { type: "alert", value: "There is no specific diagnostic test for OHSS. Diagnosis is clinical, supported by objective assessment — physical examination, bloods and imaging. The combination of elevated haematocrit with reduced serum osmolality and sodium is characteristic." },
      { type: "text", value: "The typical presentation is abdominal distension and discomfort following the hCG trigger. A preceding history of excessive ovarian response is common but its absence does not rule out OHSS." },

      { type: "subheading", value: "Important — OHSS itself rarely causes severe pain, pyrexia or peritonism" },
      { type: "alert", value: "Severe pain, fever or peritonism in a woman with suspected OHSS should prompt active exclusion of other serious conditions — do not assume it is 'just OHSS'. Get advice from the fertility specialists." },
      { type: "list", items: [
        "Pelvic infection or pelvic abscess",
        "Appendicitis",
        "Ovarian torsion or cyst rupture",
        "Bowel perforation",
        "Ectopic pregnancy",
      ]},

      { type: "subheading", value: "History to take" },
      { type: "list", items: [
        "Time of symptom onset relative to the hCG trigger",
        "Down-regulation regimen (long GnRH agonist vs GnRH antagonist) and trigger agent used (hCG carries higher risk than GnRH agonist trigger)",
        "Number of follicles on final monitoring scan (≥20) and oocytes collected (≥15) — both raise risk",
        "Whether embryo transfer occurred and how many embryos were replaced",
        "History of PCOS / polycystic ovarian morphology",
        "Symptoms: bloating, abdominal pain/discomfort, constipation or diarrhoea, nausea/vomiting, breathlessness or inability to lie flat/talk in full sentences, reduced urine output, leg or vulval swelling, syncope, dizziness",
      ]},

      { type: "subheading", value: "Examination & investigations" },
      { type: "list", items: [
        "General: dehydration, oedema (pedal, pre-tibial, vulval, sacral), heart rate, respiratory rate, BP, weight, temperature. Muffled heart sounds may suggest pericardial effusion.",
        "Abdominal: ascites, palpable mass, peritonism, girth measurement.",
        "Respiratory: pleural effusion, pneumonia, pulmonary oedema.",
        "Bloods: FBC (haematocrit — high if >0.45 L/L), U&E (sodium <135 mmol/L, potassium >5.0 mmol/L), serum osmolality (<282 mOsm/kg = hypo-osmolar), LFTs, serum albumin (<35 g/L), coagulation profile (raised fibrinogen, reduced antithrombin), CRP, hCG if relevant.",
        "Ultrasound: ovarian size, pelvic/abdominal free fluid.",
        "If suspected PE/effusion: ABG, D-dimer, ECG/echo, CXR, CTPA or V/Q scan.",
        "If suspected torsion: clinical assessment ± pelvic ultrasound or MRI.",
        "Unusual neurological symptoms — headache, unilateral neck pain — should prompt consideration of internal jugular vein thrombosis.",
      ]},
    ],
  },

  {
    id: "gtg5-classification",
    gl: "GTG5",
    condition: "Ovarian Hyperstimulation Syndrome",
    setting: "Gynaecology Emergency",
    title: "Classifying Severity & Reporting Requirements",
    tags: [
      "ohss classification", "ohss severity", "ohss grading", "hfea reporting", "mbrrace ohss",
      "mild ohss", "moderate ohss", "severe ohss", "critical ohss",
    ],
    flowchartId: "GTG5_OHSS",
    content: [
      { type: "text", value: "Several classification schemes exist; this guideline uses the classification adopted by the RCOG and the Human Fertilisation and Embryology Authority (HFEA)." },
      { type: "table",
        headers: ["Category", "Symptoms", "Ultrasound", "Haematological", "Fluid homeostasis"],
        rows: [
          ["Mild", "Mild abdominal pain, bloating", "Ovarian size <8 cm", "HCT <0.40 L/L", "—"],
          ["Moderate", "Moderate abdominal pain, nausea ± vomiting", "Ovarian size 8–12 cm, ultrasound evidence of ascites", "HCT <0.45 L/L", "—"],
          ["Severe", "Clinical ascites", "Ovarian size usually >12 cm", "HCT >0.45 L/L", "Na <135 mmol/L, osmolality <282 mOsm/kg, K >5.0 mmol/L, albumin <35 g/L, oliguria <300 mL/day or <30 mL/h"],
          ["Critical", "Tense ascites, pleural effusion", "—", "HCT >0.55 L/L, WCC >25,000/mL", "Anuria, thrombosis, ARDS"],
        ],
      },
      { type: "text", value: "Ovarian size may not correlate well with severity after follicular aspiration — interpret within the clinical context." },

      { type: "subheading", value: "Life-threatening complications (rare)" },
      { type: "list", items: [
        "Renal failure, ARDS, intra-abdominal haemorrhage from a ruptured ovarian cyst/follicle, thromboembolism.",
        "No maternal deaths from OHSS have been reported to the HFEA since 2016, and none were identified in the 2022 MBRRACE triennial report (2018–2021) in the UK.",
      ]},

      { type: "subheading", value: "Reporting requirements" },
      { type: "list", items: [
        "Licensed UK clinics must report severe or critical OHSS to the HFEA regardless of whether hospitalisation was needed — verbally within 12 working hours, an incident form within 24 working hours, and a specific proforma within 25 working days.",
        "If a woman presents to a hospital other than her treating fertility clinic, that hospital should inform the treating clinic so it can meet its HFEA reporting duty.",
        "Any death related to OHSS in the UK should be reported to MBRRACE-UK, irrespective of pregnancy status — good practice, though not currently a specified requirement.",
      ]},
    ],
  },

  {
    id: "gtg5-outpatient",
    gl: "GTG5",
    condition: "Ovarian Hyperstimulation Syndrome",
    setting: "Outpatient / Ambulatory Care",
    title: "Outpatient Care of OHSS",
    tags: [
      "ohss outpatient management", "ohss fluid advice", "ohss analgesia", "ohss thromboprophylaxis",
      "outpatient paracentesis", "ohss monitoring",
    ],
    flowchartId: "GTG5_OHSS",
    content: [
      { type: "alert", value: "Outpatient care is appropriate for mild or moderate OHSS, and for selected cases of severe OHSS — with clear patient-selection criteria and access to admission if needed." },

      { type: "subheading", value: "Fluid advice" },
      { type: "list", items: [
        "Oral fluid replacement is as effective as parenteral for correcting hypovolaemia in severe OHSS — advise women to drink to thirst rather than a fixed target; there's no proven benefit to a minimum or maximum intake.",
        "Don't routinely replace electrolytes or albumin to 'correct' the biochemistry — the hypo-osmolar, hyponatraemic picture reflects a reset osmostat, not true losses.",
        "Urine output <1000 mL/24h, or a positive fluid balance >1000 mL/24h, should prompt medical review (consider adjusting the threshold if the woman weighs <60 kg).",
      ]},

      { type: "subheading", value: "Symptom control" },
      { type: "list", items: [
        "Paracetamol and oral opioids (including codeine) are appropriate for pain.",
        "Avoid NSAIDs — risk of compromising renal function.",
        "Severe pain should prompt medical review to exclude ovarian torsion, cyst rupture, ectopic pregnancy or pelvic infection.",
      ]},

      { type: "subheading", value: "Thromboprophylaxis" },
      { type: "list", items: [
        "Moderate OHSS: evaluate for thrombosis risk factors, prescribe anti-embolism stockings, and consider LMWH thromboprophylaxis. [Grade C]",
        "Severe OHSS managed as an outpatient: anti-embolism stockings AND LMWH thromboprophylaxis — duration individualised to risk factors and whether conception occurs.",
      ]},

      { type: "subheading", value: "Outpatient paracentesis" },
      { type: "text", value: "Ascitic drainage can be performed as an outpatient, by the abdominal or transvaginal route under ultrasound guidance, to reduce hospital admission. Case series report outpatient transvaginal paracentesis (mean ~2.2 L drained per session) with no procedure-related complications; systematic review evidence shows outpatient care is safe in appropriately selected women, with early ascitic drainage associated with shorter treatment/follow-up duration." },

      { type: "subheading", value: "Monitoring & follow-up" },
      { type: "list", items: [
        "Urgent review for any worsening symptoms/signs; otherwise review every 2–3 days is likely adequate.",
        "Repeat FBC, LFTs and renal function if severity appears to be worsening.",
        "Follow up until resolution — ideally in the treating clinic/fertility service. Most cases resolve over 7–10 days; recovery is delayed if conception occurs (endogenous hCG can worsen OHSS), and usually complete by the withdrawal bleed if it doesn't.",
      ]},
      { type: "subheading", value: "Signs of worsening OHSS to watch for" },
      { type: "list", items: [
        "Increasing abdominal distension and pain",
        "Nausea and vomiting",
        "Shortness of breath",
        "Tachycardia or hypotension",
        "Urine output <1000 mL/24h (or <300 mL/24h — suspect severe OHSS)",
        "Weight gain, increasing abdominal girth",
        "Rising haematocrit (>0.45 L/L)",
        "Abnormal LFTs/renal function",
      ]},
    ],
  },

  {
    id: "gtg5-inpatient",
    gl: "GTG5",
    condition: "Ovarian Hyperstimulation Syndrome",
    setting: "Inpatient / Emergency",
    title: "Inpatient Care of OHSS",
    tags: [
      "ohss admission criteria", "ohss inpatient management", "ohss fluid balance", "human albumin ohss",
      "paracentesis ohss", "pleural effusion ohss", "ohss mdt",
    ],
    flowchartId: "GTG5_OHSS",
    content: [
      { type: "subheading", value: "When to admit" },
      { type: "list", items: [
        "Unable to attend regular outpatient follow-up",
        "Unable to achieve satisfactory pain control",
        "Unable to maintain adequate fluid intake because of nausea/vomiting",
        "Worsening OHSS symptoms despite outpatient intervention",
      ]},
      { type: "text", value: "There's no absolute threshold — consider clinical features, social factors (geography, out-of-hours support) and local expertise. The need for paracentesis alone is not an automatic reason for admission if outpatient drainage is available." },

      { type: "subheading", value: "Daily monitoring for inpatients" },
      { type: "list", items: [
        "Body weight, abdominal girth, heart rate, respiratory rate, BP, temperature, fluid balance, oxygen saturations",
        "FBC (haematocrit), U&E/renal function, LFTs, clotting",
        "As indicated: ABG, pelvic/abdominal ultrasound, ECG, CXR",
      ]},
      { type: "text", value: "Recovery is signalled by diuresis, normalising haematocrit/electrolytes/osmolality, and falling abdominal girth/weight. CRP tracks with other severity markers (girth, weight) and may help monitor progress." },

      { type: "subheading", value: "Fluid balance regimen" },
      { type: "alert", value: "Oral fluid, guided by thirst, is the most physiological approach. Vigorous IV crystalloid can worsen ascites given the increased capillary permeability of OHSS — use crystalloids mainly for initial correction in women who can't maintain oral intake." },
      { type: "list", items: [
        "Human albumin 20% (50–100 g in 100 mL, infused over 4h, repeatable 4–12-hourly) can be used for persistent haemoconcentration despite crystalloid replacement.",
        "Hydroxyethyl starch (HES) has been withdrawn in the UK — associated with increased mortality in critically ill/septic patients compared with crystalloids. Do not use it.",
        "Persistent haemoconcentration or oliguria despite adequate colloid replacement → escalate for multidisciplinary input and consider invasive haemodynamic monitoring.",
        "Diuretics: only in a multidisciplinary setting with central venous monitoring in place — they can worsen intravascular hypovolaemia if dehydration hasn't first been corrected.",
      ]},

      { type: "subheading", value: "Managing ascites and effusions" },
      { type: "list", items: [
        "Paracentesis indicated for: severe abdominal distension/pain, breathlessness/respiratory compromise, or oliguria despite adequate volume replacement.",
        "Always under ultrasound guidance (abdominal or transvaginal) to avoid trauma to the enlarged, vascular ovaries. An indwelling abdominal catheter can reduce the need for repeat procedures.",
        "Consider IV colloid after large-volume drainage to replenish intravascular volume.",
        "Pleural effusion: often right-sided (fluid tracks via the thoracic duct); mediastinal shift or tachypnoea >15/min warrants anaesthetic/respiratory input and possibly HDU care. A chest drain may be needed if symptomatic; decisions to remove it are made jointly once drainage is minimal (e.g. <200 mL/24h) and imaging confirms resolution.",
      ]},

      { type: "subheading", value: "When to call the MDT" },
      { type: "alert", value: "Seek anaesthetic/ITU/renal/respiratory/haematology input for critical OHSS, and for severe OHSS with persistent haemoconcentration/dehydration despite treatment. Features of critical OHSS should prompt consideration of intensive care." },

      { type: "subheading", value: "Surgical indications" },
      { type: "list", items: [
        "Suspected adnexal torsion, internal bleeding from a ruptured ovarian cyst, or ectopic pregnancy.",
        "Detorsion has been described successfully even 72h after symptom onset, and can be performed in early pregnancy.",
        "Foul-smelling turbid ascitic drainage with rising pyrexia/pain → suspect bowel perforation.",
        "Enlarged ovaries compressing the ureters/kidneys can cause obstructive uropathy (rarely needing percutaneous nephrostomy) — get a urology opinion if hydronephrosis appears on scan.",
        "Bilateral oophorectomy or termination of pregnancy have very rarely been used as last-resort, lifesaving measures in critical, intractable OHSS — these are not routine treatment options.",
      ]},
    ],
  },

  {
    id: "gtg5-thrombosis",
    gl: "GTG5",
    condition: "Ovarian Hyperstimulation Syndrome",
    setting: "Inpatient / Emergency",
    title: "Thromboembolism Risk in OHSS",
    tags: [
      "ohss vte risk", "ohss thrombosis", "ohss anticoagulation", "lmwh ohss", "ohss pregnancy vte",
    ],
    content: [
      { type: "alert", value: "OHSS is a prothrombotic state (haemoconcentration + vascular endothelial dysfunction). Thrombosis incidence in OHSS is estimated at 0.7–10% — and it can present in unusual, non-lower-limb sites." },
      { type: "table",
        headers: ["Population", "First-trimester VTE incidence"],
        rows: [
          ["Non-IVF pregnancy", "0.2 per 1000"],
          ["IVF pregnancy, no OHSS", "0.8 per 1000 (OR 4.8 vs non-IVF)"],
          ["IVF pregnancy with OHSS", "16.8 per 1000 (OR 99.7 vs non-IVF)"],
        ],
      },
      { type: "text", value: "(Swedish national cohort, 1999–2008, 964,532 births including 19,162 IVF pregnancies.)" },

      { type: "subheading", value: "Prophylaxis" },
      { type: "list", items: [
        "All women with OHSS: evaluate thrombosis risk factors and consider anti-embolism stockings/LMWH.",
        "Hospital admission with OHSS: prescribe anti-embolism stockings AND LMWH prophylaxis. [Grade C]",
        "Additional risk factors warranting prophylaxis: reduced mobility, obesity, pre-existing thrombophilia, hospital admission for OHSS, pregnancy.",
        "Pregnant women with OHSS: continue LMWH thromboprophylaxis at least to the end of the first trimester — most delayed thrombosis events occur in this window. [Grade C]",
        "Duration overall is individualised to risk factors and whether conception occurs; involve haematology for individualised advice.",
      ]},

      { type: "subheading", value: "Atypical presentation — stay alert" },
      { type: "alert", value: "Thrombosis in OHSS often affects upper-body sites and can involve the arterial system. Unusual symptoms — dizziness, visual loss, neck pain — should raise suspicion, even several weeks after apparent OHSS resolution. If suspected, start therapeutic anticoagulation while arranging imaging, and involve haematology/maternal medicine." },
    ],
  },

  {
    id: "gtg5-pregnancy-support",
    gl: "GTG5",
    condition: "Ovarian Hyperstimulation Syndrome",
    setting: "Antenatal / Patient Support",
    title: "OHSS in Pregnancy & Patient Support",
    tags: [
      "ohss pregnancy outcome", "ohss pre-eclampsia risk", "ohss preterm birth risk", "ohss patient support",
      "ohss counselling",
    ],
    content: [
      { type: "subheading", value: "Additional risks when OHSS coincides with pregnancy" },
      { type: "list", items: [
        "No clear increase in miscarriage risk overall, though some reports suggest more early (biochemical) loss with early (not late) OHSS.",
        "Increased risk of pre-eclampsia and preterm birth reported: one study found pre-eclampsia in 21.2% vs 9.2%, and preterm birth in 36% vs 10.7%, comparing OHSS pregnancies with matched IVF controls.",
        "Increased prematurity/low birthweight in singleton pregnancies with OHSS, and an increased risk of second-trimester loss in twin pregnancies with OHSS (US NASS registry data).",
      ]},

      { type: "subheading", value: "Supporting women through OHSS" },
      { type: "list", items: [
        "All women undergoing fertility treatment should receive verbal and written information about OHSS symptoms and risk before starting, plus a 24-hour contact number.",
        "Women at higher background risk should be told so explicitly before treatment starts.",
        "Manage expectations — symptoms can take a few weeks to fully settle, and delays to treatment (e.g. cancelling fresh transfer) understandably cause distress given the emotional/financial investment involved.",
        "Signpost to fertility counselling or peer support — the physical symptoms and the disruption to a treatment cycle both carry real psychological weight.",
      ]},
    ],
  },
];
