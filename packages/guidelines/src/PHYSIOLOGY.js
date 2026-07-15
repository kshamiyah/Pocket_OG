// Physiological Changes in Pregnancy: a reader guide.
//
// This is NOT a single national guideline; it is a systems-based synthesis of
// peer-reviewed review literature (source: "REVIEW"), hand-authored for Pocket
// O&G. Every figure is drawn from the sources cited in the closing section:
//   - Soma-Pillay P, Nelson-Piercy C, Tolppanen H, Mebazaa A. Physiological
//     changes in pregnancy. Cardiovasc J Afr 2016;27(2):89–94
//     (doi:10.5830/CVJA-2016-021); primary anchor, open access.
//   - Tan EK, Tan EL. Alterations in physiology and anatomy during pregnancy.
//     Best Pract Res Clin Obstet Gynaecol 2013;27(6):791–802
//     (doi:10.1016/j.bpobgyn.2013.08.001).
//   - Abu-Raya B, Michalski C, Sadarangani M, Lavoie PM. Maternal immunological
//     adaptation during normal pregnancy. Front Immunol 2020;11:575197
//     (doi:10.3389/fimmu.2020.575197).
// Decision aid only; interpret against local pregnancy-specific reference ranges.
export const PHYSIOLOGY_SECTIONS = [
  {
    id: "physiology-overview", gl: "PHYSIOLOGY",
    condition: "Physiological Changes in Pregnancy", setting: "Overview",
    title: "Normal Maternal Adaptation in Pregnancy",
    tags: [
      "physiology", "physiological changes", "physiology of pregnancy", "maternal physiology",
      "maternal adaptation", "adaptation to pregnancy", "normal changes in pregnancy", "normal pregnancy",
    ],
    content: [
      { type: "alert", value: "Every organ system adapts in normal pregnancy to nurture the fetus and prepare for labour and delivery. Some changes shift 'normal' biochemistry; others mimic disease. Knowing the physiological range is what lets you recognise the pathological deviation. Decision aid only: interpret against local pregnancy-specific ranges." },
      { type: "subheading", value: "How to use this guide" },
      { type: "list", items: [
        "Each section covers one system: the direction and size of the normal change, then a 'why it matters' note on how that change can mask or mimic pathology.",
        "For the corresponding laboratory reference ranges (Hb, platelets, LFTs, urate, bile acids, D-dimer, TSH thresholds), see the 'Normal Values in Pregnancy' quick-reference card.",
        "Figures are from the review sources listed in the final section; verify against local protocols.",
      ]},
      { type: "text", value: "Most changes begin very early (some before conception is confirmed) and resolve after delivery with minimal residual effect. The cardiovascular and renal adaptations are largely proactive: they precede, rather than react to, the demands of the growing fetus." },
    ],
  },

  {
    id: "physiology-cardiovascular", gl: "PHYSIOLOGY",
    condition: "Physiological Changes in Pregnancy", setting: "Cardiovascular",
    title: "Cardiovascular Adaptation",
    tags: [
      "cardiovascular", "cardiac output", "cardiac output pregnancy", "stroke volume", "heart rate pregnancy",
      "systemic vascular resistance", "svr", "blood pressure pregnancy", "plasma volume", "aortocaval compression",
      "supine hypotension", "physiological murmur", "ejection systolic murmur", "ecg changes pregnancy", "pulmonary oedema",
    ],
    content: [
      { type: "subheading", value: "Haemodynamics" },
      { type: "text", value: "The primary event is peripheral vasodilatation, mediated by endothelium-dependent factors (nitric oxide, upregulated by oestradiol, and vasodilatory prostaglandins). This drops systemic vascular resistance, and cardiac output rises to compensate." },
      { type: "table",
        headers: ["Change", "Direction", "Detail"],
        rows: [
          ["Cardiac output", "↑ ~40%", "Already up ~20% by 8 weeks; peak at 20–28 weeks; minimal fall at term"],
          ["Stroke volume", "↑", "Main driver of the rise in cardiac output"],
          ["Heart rate", "↑ 10–20 bpm", "Increase maintained to term, preserving cardiac output as stroke volume declines"],
          ["Systemic vascular resistance", "↓ ~25–30%", "Peripheral vasodilatation"],
          ["Blood pressure", "↓ then normalises", "Falls in 1st/2nd trimester, returns to non-pregnant levels by the 3rd"],
          ["Plasma volume", "↑ ~50%", "Most of the rise complete by ~34 weeks"],
          ["Colloid osmotic pressure", "↓ 10–15%", "COP/PCWP gradient falls ~30%: susceptibility to pulmonary oedema"],
        ],
      },
      { type: "subheading", value: "Labour and the puerperium" },
      { type: "list", items: [
        "Cardiac output rises further in labour: about +15% in the first stage and +50% in the second.",
        "Each uterine contraction auto-transfuses 300–500 mL of blood into the circulation.",
        "Immediately after delivery, relief of IVC obstruction and uterine contraction raise cardiac output by 60–80%, then it falls to pre-labour values within about an hour.",
        "Cardiac output returns to pre-pregnancy levels roughly 2 weeks after delivery.",
      ]},
      { type: "subheading", value: "Findings that mimic disease" },
      { type: "list", items: [
        "An ejection systolic (flow) murmur in over 90% of women, sometimes loud across the precordium, with a loud first heart sound and sometimes a third heart sound.",
        "Bounding or collapsing pulse, ectopic beats and peripheral oedema.",
        "Normal ECG changes: left-axis shift of the QRS, a small Q wave and inverted T in lead III, and ST-segment depression / T-wave inversion in the inferior and lateral leads.",
      ]},
      { type: "alert", value: "Why it matters: near term, the supine position lets the gravid uterus compress the IVC (aortocaval compression), which can cut cardiac output by up to 25% and reduce uteroplacental perfusion, so nurse in left-lateral tilt. Reduced colloid osmotic pressure means fluid loading or increased capillary permeability (e.g. pre-eclampsia) precipitates pulmonary oedema more readily, especially in the second stage and immediate postpartum period." },
    ],
  },

  {
    id: "physiology-haematological", gl: "PHYSIOLOGY",
    condition: "Physiological Changes in Pregnancy", setting: "Haematological & coagulation",
    title: "Haematological and Coagulation Adaptation",
    tags: [
      "haematological", "dilutional anaemia", "physiological anaemia", "haemodilution", "plasma volume",
      "gestational thrombocytopenia", "platelets pregnancy", "hypercoagulable", "hypercoagulable state", "prothrombotic",
      "fibrinogen", "clotting factors", "antithrombin", "protein s", "vte", "d-dimer pregnancy", "iron", "folate",
    ],
    content: [
      { type: "subheading", value: "Volume and red cells" },
      { type: "text", value: "Because plasma volume expands more than red cell mass, there is a dilutional fall in haemoglobin, haematocrit and red cell count, without a change in MCV or MCHC. This is physiological ('dilutional') anaemia, not iron deficiency, though the two can coexist." },
      { type: "list", items: [
        "Iron requirement rises 2–3 fold; folate requirement 10–20 fold; vitamin B12 about 2 fold.",
        "MCV and MCHC stay normal, so a low MCV still points to genuine iron deficiency.",
      ]},
      { type: "subheading", value: "Platelets" },
      { type: "text", value: "The platelet count falls progressively but usually stays within normal limits. In 5–10% of women it reaches 100–150 ×10⁹/L by term with no pathology (gestational thrombocytopenia). A woman is not considered thrombocytopenic in pregnancy until the count is below 100 ×10⁹/L." },
      { type: "subheading", value: "Coagulation: a physiological hypercoagulable state" },
      { type: "table",
        headers: ["Change", "Direction", "Detail"],
        rows: [
          ["Fibrinogen", "↑ up to 50%", "A low-normal level during PPH is concerning"],
          ["Factors VIII, IX, X", "↑", "Prepares for haemostasis after delivery"],
          ["Fibrinolytic activity", "↓", "Shifts the balance toward clotting"],
          ["Antithrombin, protein S", "↓", "Reduced endogenous anticoagulation"],
          ["PT, APTT, TT", "Unchanged", "Standard clotting tests stay normal without a coagulopathy"],
        ],
      },
      { type: "alert", value: "Why it matters: pregnancy is prothrombotic from the first trimester and for at least 12 weeks postpartum, hence formal VTE risk assessment and thromboprophylaxis. D-dimer rises physiologically and cannot be used to exclude VTE. Venous stasis is more marked in the left leg (the left iliac vein is compressed by the overlying artery), which is why most pregnancy DVTs are left-sided." },
    ],
  },

  {
    id: "physiology-respiratory", gl: "PHYSIOLOGY",
    condition: "Physiological Changes in Pregnancy", setting: "Respiratory",
    title: "Respiratory Adaptation",
    tags: [
      "respiratory", "minute ventilation", "tidal volume", "respiratory alkalosis", "compensated respiratory alkalosis",
      "physiological dyspnoea", "breathlessness in pregnancy", "functional residual capacity", "frc",
      "paco2", "bicarbonate pregnancy", "oxygen consumption", "arterial blood gas pregnancy",
    ],
    content: [
      { type: "subheading", value: "Ventilation and blood gases" },
      { type: "text", value: "Oxygen demand rises (metabolic rate up ~15%, oxygen consumption up ~20%). Minute ventilation increases 40–50%, driven by a larger tidal volume rather than a faster respiratory rate. The resulting hyperventilation lowers arterial PaCO₂ and raises PaO₂, with renal compensation (lower bicarbonate): a mild, fully compensated respiratory alkalosis is normal." },
      { type: "table",
        headers: ["Investigation", "Pregnant", "Non-pregnant"],
        rows: [
          ["pH", "7.40–7.47", "7.35–7.45"],
          ["PaCO₂", "≤30 mmHg (3.6–4.3 kPa)", "35–40 mmHg (4.7–6.0 kPa)"],
          ["PaO₂", "100–104 mmHg (12.6–14.0 kPa)", "90–100 mmHg"],
          ["Bicarbonate", "18–22 mmol/L", "20–28 mmol/L"],
        ],
      },
      { type: "subheading", value: "Lung volumes" },
      { type: "list", items: [
        "Functional residual capacity falls in late pregnancy (diaphragmatic elevation), reducing oxygen reserve.",
        "Vital capacity is unchanged, and peak expiratory flow rate and FEV₁ are unaffected by pregnancy.",
      ]},
      { type: "alert", value: "Why it matters: mild breathlessness is common and physiological (often present at rest or while talking, and paradoxically easing with gentle activity), but reduced FRC means a pregnant woman desaturates faster during apnoea, which is critical at induction of anaesthesia. A 'normal' non-pregnant PaCO₂ (35–40 mmHg) in a breathless pregnant woman is actually raised for pregnancy and may signal a tiring patient or impending respiratory failure. Because PEFR and FEV₁ do not change, they remain valid for assessing asthma." },
    ],
  },

  {
    id: "physiology-renal", gl: "PHYSIOLOGY",
    condition: "Physiological Changes in Pregnancy", setting: "Renal & urinary",
    title: "Renal and Urinary Adaptation",
    tags: [
      "renal", "renal changes pregnancy", "gfr", "gfr pregnancy", "renal plasma flow", "creatinine pregnancy",
      "urea pregnancy", "physiological hydronephrosis", "glycosuria", "glycosuria pregnancy", "proteinuria pregnancy",
      "uric acid", "urate", "asymptomatic bacteriuria", "pyelonephritis", "plasma osmolality",
    ],
    content: [
      { type: "subheading", value: "Renal haemodynamics" },
      { type: "text", value: "Renal vasodilatation raises both renal plasma flow and glomerular filtration rate. Afferent and efferent arteriolar resistance both fall, so glomerular hydrostatic pressure stays stable (no glomerular hypertension) despite the huge rise in flow." },
      { type: "table",
        headers: ["Change", "Direction", "Detail"],
        rows: [
          ["Renal plasma flow", "↑ 40–65%", "Driven by renal vasodilatation"],
          ["Glomerular filtration rate", "↑ 50–85%", "Serum creatinine and urea fall as a result"],
          ["Serum creatinine", "↓ (mean ~44 µmol/L)", "A 'normal' non-pregnant value may be abnormal in pregnancy"],
          ["Serum urea", "↓ (mean ~3.2 mmol/L)", ""],
          ["Plasma osmolality", "↓ ~10 mosmol/kg", "Reset thirst and vasopressin thresholds (hypo-osmolar state)"],
        ],
      },
      { type: "subheading", value: "Anatomy and tubular handling" },
      { type: "list", items: [
        "Renal size increases 1–1.5 cm; the collecting system dilates (progesterone-mediated), giving physiological hydronephrosis in over 80% of women, more marked on the right.",
        "Glycosuria is common: about 90% of women with normal blood glucose excrete 1–10 g/day because tubular reabsorption of glucose is less complete.",
        "Protein excretion can rise to ~300 mg/day, though total urinary protein stays within the normal range.",
        "Uric acid excretion increases with the rise in GFR.",
      ]},
      { type: "alert", value: "Why it matters: because creatinine and urea fall, a 'normal-range' non-pregnant value can mask significant renal impairment: use pregnancy-appropriate expectations. Glycosuria is common and does not diagnose gestational diabetes. Urinary stasis in the dilated collecting system means asymptomatic bacteriuria carries a real risk of ascending to pyelonephritis, so it is screened for and treated." },
    ],
  },

  {
    id: "physiology-gastrointestinal", gl: "PHYSIOLOGY",
    condition: "Physiological Changes in Pregnancy", setting: "Gastrointestinal",
    title: "Gastrointestinal Adaptation",
    tags: [
      "gastrointestinal", "nausea and vomiting", "nvp", "hyperemesis", "reflux in pregnancy", "heartburn pregnancy",
      "oesophageal sphincter", "gastroparesis", "gastric emptying", "aspiration risk",
    ],
    content: [
      { type: "subheading", value: "Nausea and vomiting" },
      { type: "text", value: "Nausea and vomiting affect 50–90% of pregnancies, peaking with hCG at the end of the first trimester and usually settling by around 20 weeks. About 0.5–3% develop hyperemesis gravidarum (severe vomiting with dehydration, electrolyte disturbance, ketonuria and weight loss), where thiamine supplementation matters to avoid Wernicke's encephalopathy." },
      { type: "subheading", value: "Mechanical and motility changes" },
      { type: "list", items: [
        "The growing uterus displaces the stomach upwards and raises intra-gastric pressure.",
        "Lower oesophageal sphincter tone falls, predisposing to reflux.",
        "Oestrogen and progesterone slow gastric neural activity and smooth-muscle function, which can cause gastric dysrhythmia or delayed emptying, more so with pre-existing GI disease.",
      ]},
      { type: "alert", value: "Why it matters: reflux and heartburn are common, but new epigastric or right upper quadrant pain, especially with hypertension, should prompt thought about pre-eclampsia or HELLP rather than being dismissed as reflux. Reduced sphincter tone plus delayed gastric emptying raise the risk of aspiration at induction of general anaesthesia, which underpins aspiration prophylaxis for caesarean." },
    ],
  },

  {
    id: "physiology-endocrine", gl: "PHYSIOLOGY",
    condition: "Physiological Changes in Pregnancy", setting: "Endocrine & metabolic",
    title: "Endocrine and Metabolic Adaptation",
    tags: [
      "endocrine", "thyroid changes pregnancy", "tbg", "tsh pregnancy", "diabetogenic", "insulin resistance pregnancy",
      "hypercortisolism pregnancy", "aldosterone pregnancy", "prolactin pregnancy", "lipids in pregnancy",
      "calcium in pregnancy", "glucose metabolism pregnancy", "gestational diabetes physiology",
    ],
    content: [
      { type: "subheading", value: "Thyroid" },
      { type: "text", value: "Thyroxine-binding globulin rises, so total T4 and T3 rise; free T4 and T3 are only slightly altered and fall a little in the 2nd and 3rd trimesters. TSH falls in the first trimester (hCG cross-reacts with the TSH receptor), then rises again. Pregnancy causes a relative iodine deficiency. Use trimester-specific reference ranges." },
      { type: "table",
        headers: ["Test", "Non-pregnant", "1st trimester", "2nd trimester", "3rd trimester"],
        rows: [
          ["Free T4 (pmol/L)", "9–26", "10–16", "9–15.5", "8–14.5"],
          ["Free T3 (pmol/L)", "2.6–5.7", "3–7", "3–5.5", "2.5–5.5"],
          ["TSH (mU/L)", "0.3–4.2", "0–5.5", "0.5–3.5", "0.5–3.5"],
        ],
      },
      { type: "subheading", value: "Adrenal, pituitary and other axes" },
      { type: "list", items: [
        "Aldosterone rises about 3-fold in the first trimester and up to 10-fold by the third; progesterone (an aldosterone antagonist) allows natriuresis to balance sodium retention.",
        "A physiological hypercortisolism develops (total cortisol about 3× non-pregnant values by term), which can produce striae, facial plethora, rising blood pressure and impaired glucose tolerance.",
        "The pituitary enlarges (prolactin-producing cells); prolactin rises to about 10× at term; FSH and LH are suppressed.",
      ]},
      { type: "subheading", value: "Glucose, lipids and calcium" },
      { type: "list", items: [
        "Pregnancy is a diabetogenic state: insulin resistance begins in the second trimester and peaks in the third (placental hormones), while fasting glucose falls.",
        "Total cholesterol and triglycerides rise; LDL rises by about 50% at term; HDL is about 15% higher than non-pregnant levels.",
        "Total serum calcium falls (lower albumin), but ionised calcium is unchanged; intestinal calcium absorption doubles from 12 weeks, and hypercalciuria makes pregnancy a risk factor for kidney stones.",
      ]},
      { type: "alert", value: "Why it matters: interpret thyroid function with trimester-specific reference ranges, not non-pregnant ones. The diabetogenic shift is why gestational diabetes emerges and is screened for. Physiological hypercortisolism can mimic Cushingoid features that are benign in pregnancy." },
    ],
  },

  {
    id: "physiology-immune", gl: "PHYSIOLOGY",
    condition: "Physiological Changes in Pregnancy", setting: "Immune",
    title: "Immunological Adaptation",
    tags: [
      "immune", "immune changes pregnancy", "maternal immune adaptation", "immunology pregnancy",
      "immune tolerance", "infection risk pregnancy", "vaccination in pregnancy",
    ],
    content: [
      { type: "text", value: "Pregnancy is not global immunosuppression but a coordinated, re-tuned and tolerant state that lets the mother carry a semi-allogeneic fetus while still defending against infection." },
      { type: "list", items: [
        "Coordinated shifts across innate and adaptive immunity and in the T-helper balance maintain maternal-fetal tolerance.",
        "The net effect is altered susceptibility to, and severity of, certain infections (for example influenza, varicella and listeria).",
        "This altered risk, together with transfer of antibody to the infant, underpins vaccination in pregnancy (e.g. influenza and pertussis).",
      ]},
      { type: "text", value: "Source: Abu-Raya et al, Front Immunol 2020 (doi:10.3389/fimmu.2020.575197)." },
    ],
  },

  {
    id: "physiology-msk", gl: "PHYSIOLOGY",
    condition: "Physiological Changes in Pregnancy", setting: "Skin, musculoskeletal & bone",
    title: "Skin, Musculoskeletal and Bone Changes",
    tags: [
      "skin changes pregnancy", "melasma", "chloasma", "linea nigra", "striae gravidarum", "spider naevi",
      "palmar erythema", "musculoskeletal changes pregnancy", "symphysis pubis", "sacroiliac joint", "relaxin",
      "lordosis", "back pain pregnancy", "bone density pregnancy",
    ],
    content: [
      { type: "list", items: [
        "Skin: hyperpigmentation (melasma/chloasma, linea nigra), striae gravidarum, and oestrogen-driven spider naevi and palmar erythema; generally benign and regress after delivery.",
        "Posture: exaggerated lumbar lordosis, forward flexion of the neck and downward movement of the shoulders, a common cause of backache.",
        "Joints: generalised ligament laxity with widening and increased mobility of the sacroiliac joints and pubic symphysis (relaxin).",
        "Bone: turnover is low in the first trimester and rises in the third as fetal calcium demand peaks (met largely from previously stored skeletal calcium); the micro-architectural changes are largely reversible and parity is not associated with later osteoporosis.",
      ]},
      { type: "alert", value: "Why it matters: spider naevi and palmar erythema overlap with the stigmata of chronic liver disease, so read them in the pregnancy context. Symphysis pubis and sacroiliac laxity underlie pregnancy-related pelvic girdle pain." },
    ],
  },

  {
    id: "physiology-sources", gl: "PHYSIOLOGY",
    condition: "Physiological Changes in Pregnancy", setting: "Sources",
    title: "Sources and Framing",
    tags: ["sources", "references", "citations", "physiology sources"],
    content: [
      { type: "alert", value: "Decision aid only. This guide is a synthesis of review literature, not a single national guideline. Interpret against your local pregnancy-specific laboratory reference ranges; clinical responsibility remains with the treating clinician." },
      { type: "list", items: [
        "Soma-Pillay P, Nelson-Piercy C, Tolppanen H, Mebazaa A. Physiological changes in pregnancy. Cardiovasc J Afr 2016;27(2):89–94 (doi:10.5830/CVJA-2016-021). Primary anchor; open access.",
        "Tan EK, Tan EL. Alterations in physiology and anatomy during pregnancy. Best Pract Res Clin Obstet Gynaecol 2013;27(6):791–802 (doi:10.1016/j.bpobgyn.2013.08.001).",
        "Abu-Raya B, Michalski C, Sadarangani M, Lavoie PM. Maternal immunological adaptation during normal pregnancy. Front Immunol 2020;11:575197 (doi:10.3389/fimmu.2020.575197).",
      ]},
      { type: "text", value: "For laboratory reference ranges in pregnancy, see the 'Normal Values in Pregnancy' quick-reference card." },
    ],
  },
];
