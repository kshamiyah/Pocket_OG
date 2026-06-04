export const GL895_SECTIONS = [
  {
    id: "pprom-assessment", gl: "GL895", condition: "PPRoM", setting: "Initial Assessment",
    title: "PPRoM — Initial Assessment",
    tags: ["pprom","pprom assessment","rupture of membranes","preterm","speculum","amni-sure","liquor","gestational age","ctg","fbc","crp","ultrasound","digital examination","hvs","sterile speculum","meows","urinalysis","dawes redman"],
    content: [
      { type: "subheading", value: "Assessment Steps" },
      { type: "list", items: ["Maternal vital signs — temperature, heart rate, blood pressure, respiratory rate and MEOWS calculation","Confirm gestational age using ultrasound CRL (scanned between 8–13+6 weeks) or HC thereafter","History and examination; bedside ultrasound to determine presentation","Sterile speculum examination with HVS — avoid digital examinations (increase risk of infection and release of prostaglandins, which may stimulate uterine contractions)","If presence of liquor is in doubt and mother reports fluid loss within last 12 hours — perform Amni-Sure test","Urinalysis including culture","Dawes Redman CTG (from 26 weeks)","Bloods for FBC and CRP for baseline results","Ultrasound scan to assess liquor volume, confirm presentation and estimate fetal weight"] },
      { type: "alert", value: "Normal amniotic fluid measurement on ultrasound does NOT exclude rupture of membranes." },
    ]
  },
  {
    id: "pprom-antibiotics", gl: "GL895", condition: "PPRoM", setting: "Antibiotic Selection",
    title: "PPRoM — Antibiotic Selection",
    tags: ["pprom","antibiotics","amoxicillin","azithromycin","penicillin allergy","chorioamnionitis","infection","antibiotic","10 days","benzylpenicillin","loading dose","magnesium sulphate","in utero transfer","erythromycin"],
    content: [
      { type: "subheading", value: "Standard Antibiotic Regimen" },
      { type: "table", headers: ["Scenario","Antibiotic"], rows: [["No penicillin allergy","Oral Amoxicillin 1000mg three times a day for 10 days"],["Penicillin allergy","Oral Azithromycin 500mg once a day for 10 days"],["Signs of maternal sepsis","IV antibiotics within 1 hour + septic screen — see GL787"],["In-utero transfer (threatened preterm labour)","IV Benzylpenicillin 3g loading dose + Magnesium sulphate 4g slow IV over 10–15 mins"]] },
      { type: "text", value: "Antibiotic use reduces the risk of chorioamnionitis in women with PPRoM and is associated with a significant reduction in the number of babies born at 48 hours and 7 days from diagnosis." },
      { type: "subheading", value: "Infection" },
      { type: "text", value: "Infection may cause and complicate rupture of the membranes. If there are clinical features of maternal sepsis, intravenous antibiotics should be given within one hour and a septic screen performed (see antibiotic guideline GL787). Delivery should be expedited if appropriate. If there are no overt signs of infection, oral antibiotics should be given for 7 days." },
    ]
  },
  {
    id: "pprom-admission", gl: "GL895", condition: "PPRoM", setting: "Admission & Inpatient Care",
    title: "PPRoM — Admission & Inpatient Monitoring",
    tags: ["pprom","admission","inpatient","48 hours","monitoring","steroids","ctg","mews","in-utero transfer","transfer","level 3 neonatal","27 weeks","28 weeks","multiple pregnancy","singleton","cephalic"],
    content: [
      { type: "subheading", value: "Who to Admit" },
      { type: "list", items: ["Women ≥27+0 weeks (singleton) or ≥28+0 weeks (multiple pregnancies) — admit for observation for 48–72 hours","4 hourly maternal pulse, temperature and respiratory rate and MEOWS (recorded on in-patient observation chart)","Daily observation of liquor","CTG if maternal observations suggest developing systemic infection, or if there is uterine activity","Steroid administration"] },
      { type: "text", value: "After 48–72 hours, women with a normal growth scan and no evidence of chorioamnionitis who are confirmed to have a baby in cephalic presentation may be suitable for outpatient monitoring until delivery." },
      { type: "subheading", value: "In-Utero Transfer" },
      { type: "list", items: ["Women with PPRoM <27+0 weeks (singleton) or <28+0 weeks (multiple pregnancies) — advise transfer to a maternity unit able to provide Level-3 neonatal care","Exceptions: signs of severe maternal sepsis, delivery imminent or expected within 3–4 hours after being assessed","Loading dose before transfer: IV Benzylpenicillin 3g + Magnesium sulphate 4g slow IV over 10–15 mins","All in-utero transfers should be organised in accordance with In-utero transfer protocol (CG508)"] },
    ]
  },
  {
    id: "pprom-outpatient", gl: "GL895", condition: "PPRoM", setting: "Outpatient Management",
    title: "PPRoM — Outpatient Management",
    tags: ["pprom","outpatient","community","discharge","monitoring","temperature","vaginal loss","self-referral","mau","weekly review","scan","fetal growth","liquor","pulmonary hypoplasia","wbc","crp","genital swab","37.5"],
    content: [
      { type: "subheading", value: "Patient Advice on Discharge" },
      { type: "list", items: ["Monitoring vaginal loss — self-refer if any change in colour or odour","Twice daily temperature measurement using a thermometer — refer with any single measurement ≥37.5°C","Not to bathe in water of any kind (including swimming pools) and to avoid vaginal sexual intercourse","Importance of self-referral in the case of lower abdominal pain or contractions, if concerned about fetal movements, or if develops any non-specific symptoms such as feeling 'unwell' (can reflect underlying infection)"] },
      { type: "subheading", value: "Outpatient Review Schedule" },
      { type: "list", items: ["Weekly review on MAU — bloods for WBC and CRP + genital swab","Ultrasound scan every two weeks to assess fetal growth","Women <24 weeks' gestation — at risk of fetal pulmonary hypoplasia; offer weekly scans to assess liquor volume"] },
    ]
  },
  {
    id: "pprom-birth", gl: "GL895", condition: "PPRoM", setting: "Planning Birth",
    title: "PPRoM — Planning Birth & GBS",
    tags: ["pprom","delivery","birth planning","37 weeks","gbs","group b strep","infection","chorioamnionitis","benzylpenicillin","intravenous antibiotics","delivery suite","continuous monitoring","consultant","34 weeks","pph","postpartum haemorrhage","preterm"],
    content: [
      { type: "subheading", value: "Timing of Delivery" },
      { type: "list", items: ["Current recommendation: offer delivery at 37 weeks' gestation (no history of GBS colonisation)","Appointment at consultant obstetric clinic at 34 weeks to plan birth","Delivery <37 weeks should be considered in women with objective evidence of infection — senior obstetrician to review and agree individualised care plan considering previous and current obstetric risk factors including malpresentation","Women should deliver on Delivery Suite with continuous electronic fetal monitoring","IV antibiotics (Benzylpenicillin) recommended at delivery","Chorioamnionitis is independently associated with PPH — management should reflect this"] },
      { type: "subheading", value: "Women with Group B Streptococcus (GBS)" },
      { type: "list", items: ["Women known to be colonised with GBS in current or any previous pregnancy:","Preterm birth <34+0 weeks — balance of risks associated with preterm birth likely to outweigh risk of perinatal GBS infection","≥34+0 weeks — may be more beneficial to recommend delivery","Individualised plan of care should be developed by a senior obstetrician after discussion of risks with the woman"] },
    ]
  },
];
