export const GL880_SECTIONS = [
  {
    id: "icp-overview", gl: "GL880", condition: "Intrahepatic Cholestasis of Pregnancy", setting: "Overview & Risks",
    title: "ICP — Overview, Symptoms & Risks",
    tags: ["icp","intrahepatic cholestasis","obstetric cholestasis","oc","bile acids","pruritus","itch","itching","palms","soles","jaundice","dark urine","pale stools","stillbirth","preterm","meconium","bile acid","neonatal","nicu","pre-eclampsia","gestational diabetes","recurrence"],
    content: [
      { type: "subheading", value: "Overview" },
      { type: "text", value: "ICP is characterised by intense pruritus in the absence of a skin rash with abnormal maternal bile acid (BA) concentrations. Onset is most common in the third trimester. Affects ~7 per 1000 women in the UK (higher in South Asian population: 1.2–1.5%)." },
      { type: "subheading", value: "Presenting Symptoms" },
      { type: "list", items: [
        "Intense generalised itching — classically palms and/or soles, worse at night",
        "No associated rash",
        "Dark urine and/or pale stools (infrequent)",
        "Jaundice is rare (< 1%)",
        "Most itching in pregnancy (3 in 4 cases) is due to other benign causes",
      ]},
      { type: "subheading", value: "Fetal & Maternal Risks" },
      { type: "list", items: [
        "Stillbirth risk is correlated to PEAK BA level — significantly increased only when BA > 100 µmol/L (risk 3.5%); no increased risk when BA < 100 µmol/L compared to population",
        "Increased risk of spontaneous and iatrogenic preterm birth with BA > 40 µmol/L",
        "Increased risk of meconium-stained liquor — more common with moderate/severe ICP",
        "Small increase in neonatal unit admission (30% respiratory problems; median stay 7 days)",
        "Incidence of pre-eclampsia higher in ICP (12.2% vs 3.4%) — check BP and urine at all reviews",
        "Higher incidence of gestational diabetes — follow national guidance for screening",
        "No increased risk of postpartum haemorrhage",
        "Women with previous COCP-induced cholestasis or previous OC pregnancy are at increased risk",
      ]},
    ]
  },
  {
    id: "icp-diagnosis", gl: "GL880", condition: "Intrahepatic Cholestasis of Pregnancy", setting: "Diagnosis & Monitoring",
    title: "ICP — Diagnosis & Monitoring",
    tags: ["icp","bile acids","diagnosis","lft","liver function tests","19 umol","40 umol","100 umol","mild","moderate","severe","weekly testing","35 weeks","38 weeks","coagulation","hepatitis c","iugr","ctg","epr","dau","antenatal clinic","brooks","oc start","monitoring frequency","blood tests"],
    content: [
      { type: "subheading", value: "Diagnosis" },
      { type: "list", items: [
        "History of itching (often palms/soles, worse at night, no rash) is suggestive — send LFTs and bile acids (BA)",
        "BA should be non-fasting; level > 19 µmol/L is diagnostic of ICP",
        "If mildly raised, recheck BA 1 week later (may normalise, making ICP obsolete)",
        "If BA and LFTs within normal range with ongoing itching — repeat both at 1–2 week intervals",
        "Routine testing to exclude other causes NOT recommended unless atypical features (excessively elevated LFTs, rapidly progressive, presentation in 1st/2nd trimester) — consider hepatologist referral",
        "Routine coagulation testing NOT recommended for uncomplicated ICP (no prolonged prothrombin time in cohort studies)",
        "Testing for hepatitis C no longer recommended",
        "No additional scans required — ICP not associated with IUGR; scans do not predict stillbirth",
      ]},
      { type: "subheading", value: "Monitoring Frequency by Severity" },
      { type: "table", headers: ["Severity", "BA Level", "Monitoring"], rows: [
        ["Mild ICP", "BA 19–39 µmol/L", "Weekly testing from 38 weeks"],
        ["Moderate ICP", "BA 40–99 µmol/L", "Weekly testing from 35 weeks (in case levels rise > 100)"],
        ["Severe ICP", "BA ≥ 100 µmol/L", "Further routine testing may not impact decision-making"],
      ]},
      { type: "subheading", value: "Referral" },
      { type: "list", items: [
        "BA > 40 µmol/L — refer to ANC to discuss management and timing of delivery",
        "BA > 100 µmol/L — refer specifically to Miss Brooks' ANC",
        "On diagnosis: invite patient for DAU 'ICP Start' appointment — seen by obstetric team, prescription if indicated, blood test forms issued. DAU team update results and manage weekly, informing patients by phone",
      ]},
    ]
  },
  {
    id: "icp-treatment", gl: "GL880", condition: "Intrahepatic Cholestasis of Pregnancy", setting: "Treatment",
    title: "ICP — Treatment (UDCA & Symptomatic)",
    tags: ["icp","ursodeoxycholic acid","udca","treatment","symptoms","antihistamine","chlorphenamine","loratadine","cetirizine","aqueous cream","menthol","emollient","vitamin k","menadiol","rifampicin","itching relief","12mg/kg","licensed","off label","middle grade","34 weeks","36 weeks"],
    content: [
      { type: "subheading", value: "Ursodeoxycholic Acid (UDCA)" },
      { type: "text", value: "Evidence from RCTs shows NO reduction in adverse perinatal outcomes (stillbirth or early preterm birth) with UDCA. Late spontaneous preterm birth < 37 weeks is reduced. Routine UDCA use is NOT recommended." },
      { type: "list", items: [
        "UDCA can be considered if BA > 40 µmol/L from 34–36 weeks (may reduce late spontaneous preterm birth)",
        "Dose: 12 mg/kg/day",
        "Must only be prescribed after consultation with a senior clinician (middle grade or above) — not licensed in pregnancy",
        "If clotting is abnormal: prescribe Vitamin K (Menadiol 10 mg daily)",
        "No evidence from RCTs for routine use of Rifampicin",
      ]},
      { type: "subheading", value: "Symptomatic Treatment of Itching" },
      { type: "text", value: "Treatments improve maternal symptoms only — itching is unrelated to BA levels and these do not improve BA or prevent stillbirth." },
      { type: "list", items: [
        "Topical emollients: aqueous cream with or without menthol",
        "Antihistamines: chlorphenamine (sedative; useful at night)",
        "Non-sedative antihistamines: loratadine or cetirizine",
      ]},
    ]
  },
  {
    id: "icp-delivery", gl: "GL880", condition: "Intrahepatic Cholestasis of Pregnancy", setting: "Timing of Delivery & Labour",
    flowchartId: "GL880_DELIVERY",
    title: "ICP — Timing of Delivery & Labour Monitoring",
    tags: ["icp","delivery","timing","induction","planned birth","40 weeks","38 weeks","39 weeks","35 weeks","36 weeks","bile acid","ba","100 umol","40 umol","cefm","continuous monitoring","meconium","birth centre","homebirth","intermittent auscultation","labour","neonatal care","comorbidities"],
    content: [
      { type: "subheading", value: "Timing of Planned Delivery" },
      { type: "table", headers: ["Peak BA Level", "Recommendation"], rows: [
        ["19–39 µmol/L", "Consider planned birth by 40 weeks (if no other risk factors)"],
        ["40–99 µmol/L", "Consider planned birth at 38–39 weeks (if no other risk factors)"],
        ["> 100 µmol/L", "Consider planned birth at 35–36 weeks. If already past this gestation — arrange IOL imminently"],
      ]},
      { type: "alert", value: "Co-morbidities (pre-eclampsia, diabetes, multifetal pregnancy) with BA > 40 µmol/L may increase stillbirth risk — consider earlier delivery." },
      { type: "subheading", value: "Monitoring in Labour" },
      { type: "table", headers: ["BA Level", "Recommendation"], rows: [
        ["19–39 µmol/L", "Intermittent auscultation acceptable; homebirth and birth centre NOT contraindicated (if no other indication for CEFM)"],
        ["≥ 40 µmol/L", "CEFM recommended — higher likelihood of meconium and neonatal care needed"],
        ["> 100 µmol/L", "CEFM must be offered"],
      ]},
      { type: "text", value: "Women with moderate/severe ICP are more likely to pass meconium during labour — manage as per usual practice. Advise women that their baby is more likely to require neonatal care." },
    ]
  },
  {
    id: "icp-postnatal", gl: "GL880", condition: "Intrahepatic Cholestasis of Pregnancy", setting: "Postnatal",
    title: "ICP — Postnatal Management",
    tags: ["icp","postnatal","resolution","bile acids","lfts","4 weeks","gp","contraception","cocp","combined pill","oestrogen","progesterone","recurrence","subsequent pregnancy","hepatobiliary","gallstones","ba","lft"],
    content: [
      { type: "subheading", value: "Postnatal Resolution" },
      { type: "list", items: [
        "Repeat BA and LFTs 4 weeks after delivery to confirm resolution — arrange via GP",
        "Check sooner if patient is unwell or additional diagnosis suspected",
      ]},
      { type: "subheading", value: "Contraception" },
      { type: "list", items: [
        "Women can use any contraception of their choice including the COCP",
        "Exception: women with history of combined hormonal contraception (oestrogen-containing) related cholestasis — advise progesterone-only or non-hormonal methods",
      ]},
      { type: "subheading", value: "Future Pregnancies" },
      { type: "list", items: [
        "High risk of recurrence in subsequent pregnancies — counsel accordingly",
        "In subsequent pregnancies: check baseline LFT and BA to establish they are normal; only repeat if clinically indicated",
      ]},
    ]
  },
];
