export const GL952_SECTIONS = [
  {
    id: "pet-definition", gl: "GL952", condition: "Pre-Eclampsia", setting: "General",
    flowchartId: "GL952_TRIAGE",
    title: "Definition & Classification",
    tags: ["definition","diagnosis","criteria","what is","classify","preeclampsia","pet","severe","hellp","proteinuria","gestational","chronic"],
    content: [
      { type: "text", value: "New hypertension (≥20 weeks) with one or more of:" },
      { type: "list", items: ["Proteinuria — PCR >30 mg/mmol or ≥2+ on dipstick","Renal insufficiency — Creatinine ≥90 µmol/L","Liver involvement — ALT >40 IU/L ± RUQ/epigastric pain","Neurological — eclampsia, altered mental status, blindness, stroke, clonus, severe headache, persistent visual scotomata","Haematological — thrombocytopenia, DIC, haemolysis","Uteroplacental dysfunction — FGR, abnormal umbilical artery Doppler, stillbirth"] },
      { type: "subheading", value: "BP Severity Thresholds" },
      { type: "table", headers: ["Severity","Systolic","Diastolic"], rows: [["Mild","140–149 mmHg","90–99 mmHg"],["Moderate","150–159 mmHg","100–109 mmHg"],["Severe","≥160 mmHg","≥110 mmHg"]] },
      { type: "subheading", value: "HELLP Syndrome" },
      { type: "text", value: "Haemolysis + Elevated Liver enzymes + Low Platelets. Do NOT use steroids to treat HELLP." },
    ]
  },
  {
    id: "pet-postnatal-inpatient", gl: "GL952", condition: "Pre-Eclampsia", setting: "Postnatal — Inpatient",
    flowchartId: "GL952_POSTNATAL",
    title: "Postnatal Inpatient Management",
    tags: ["postnatal","post natal","after birth","postpartum","ward","iffley","inpatient","discharge","blood pressure","bp","medication","bloods","blood tests","pet screen","stay","how long","length of stay","discharge criteria","methyldopa","labetalol","nifedipine"],
    content: [
      { type: "alert", value: "PET features commonly worsen in the 24 hrs after delivery. Remain vigilant." },
      { type: "subheading", value: "BP Monitoring" },
      { type: "list", items: ["4 hourly while inpatient","Alternate days up to 2 weeks post-discharge","Ask about symptoms (headache, epigastric pain) at every check"] },
      { type: "subheading", value: "BP Targets & Actions" },
      { type: "table", headers: ["BP","Action"], rows: [["≥150/100 mmHg","Start or increase antihypertensive"],["≤149/99 mmHg","Maintain current treatment"],["<130/80 mmHg for >24hrs","Reduce antihypertensive dose"],["Target","≤149/99 mmHg"]] },
      { type: "subheading", value: "Medication" },
      { type: "list", items: ["Stop methyldopa within 2 days — switch to labetalol, nifedipine, or ACE inhibitor","Offer enalapril as first choice postnatal agent (check U+Es at 1 week)","Black African/Caribbean: consider nifedipine or amlodipine","Avoid diuretics and ARBs if breastfeeding","Labetalol and nifedipine safe for breastfeeding"] },
      { type: "subheading", value: "Blood Tests" },
      { type: "table", headers: ["Severity","Timing"], rows: [["Mild PET","Once at 48–72 hrs unless clinical concern"],["Moderate/Severe PET","48 hrs post-delivery; repeat if abnormal; again at 6–8 week check"]] },
      { type: "subheading", value: "Length of Stay" },
      { type: "table", headers: ["Severity","Minimum Stay"], rows: [["Mild PET","24–48 hours"],["Moderate/Severe PET","3–5 days; must be >24 hrs since last medication increase"]] },
      { type: "subheading", value: "Discharge Criteria" },
      { type: "list", items: ["No symptoms of PET","BP ≤150/100 mmHg (with or without antihypertensive)","Blood results stable or improving","Generate postnatal BP management plan on EPR","Prescribe 2 weeks of antihypertensive on TTO"] },
    ]
  },
  {
    id: "pet-postnatal-community", gl: "GL952", condition: "Pre-Eclampsia", setting: "Postnatal — Community",
    title: "Postnatal Community Care (Post-Discharge)",
    tags: ["community","home","gp","midwife","after discharge","follow up","day 3","day 4","readmit","dau","2 weeks","6 weeks","specialist"],
    content: [
      { type: "subheading", value: "Mild PET (not on medication)" },
      { type: "list", items: ["Discharged day 2","Community midwife: BP + symptoms on days 3, 4, 6","If symptom-free and BP <150/100: no action","If raised BP or symptoms: review at hospital (DAU)"] },
      { type: "subheading", value: "Moderate/Severe PET (on medication)" },
      { type: "list", items: ["Alternate day BP checks until off medication","Reduce antihypertensives per discharge plan until BP <130/80 off treatment","Still on medication at day 12 → GP appointment day 13/14","BP >149/99 or symptoms at any check → back to hospital"] },
      { type: "subheading", value: "Follow-Up Schedule" },
      { type: "table", headers: ["Timepoint","Action"], rows: [["2 weeks","Medical review if still on antihypertensive"],["6–8 weeks","Review ALL women with PET"],["6–8 weeks (still on AHT)","Refer to hypertension specialist"],["6–8 weeks (still proteinuric)","GP/specialist review at 3 months for kidney function"]] },
    ]
  },
  {
    id: "pet-antenatal-inpatient", gl: "GL952", condition: "Pre-Eclampsia", setting: "Antenatal — Inpatient",
    flowchartId: "GL952_ACUTE",
    title: "Antenatal Inpatient Management",
    tags: ["antenatal","ante natal","inpatient","admit","admission","bloods","ctg","scan","ultrasound","vte","lmwh","monitoring","timing delivery","when to deliver"],
    content: [
      { type: "alert", value: "Women with PET and PCR ≥1 g/mmol should be admitted regardless of BP and remain inpatient until after delivery." },
      { type: "subheading", value: "Quick Reference" },
      { type: "list", items: ["VTE assessment — LMWH at 22:00 if indicated","BP 4 hourly","Urine dipstick NOT required; repeat PCR NOT required once PET diagnosed","PET screen: twice weekly if BP ≤149/99; three times weekly if BP >149/99","Clotting only if platelets <100,000","CTG on admission then weekly","USS (growth, liquor, umbilical Doppler) within 2 days, then ≤every 2 weeks if normal"] },
      { type: "subheading", value: "Timing of Delivery" },
      { type: "table", headers: ["Gestation","Recommendation"], rows: [["<34 weeks","Manage conservatively unless refractory severe HT or maternal/fetal indication"],["34–36+6 (severe HT)","Recommend delivery once BP controlled"],["34–36+6 (mild/moderate)","Offer delivery only if concern about maternal/fetal condition"],["≥37 weeks","Timing decided with consultant — document on EPR"]] },
    ]
  },
  {
    id: "pet-medications", gl: "GL952", condition: "Pre-Eclampsia", setting: "General",
    title: "Antihypertensive Medications",
    tags: ["medication","drug","labetalol","nifedipine","methyldopa","hydralazine","enalapril","amlodipine","captopril","atenolol","antihypertensive","treatment","dose","prescribe","which drug","breastfeeding","bp target","blood pressure target"],
    content: [
      { type: "subheading", value: "Oral — Antenatal First Line" },
      { type: "table", headers: ["Drug","Starting Dose","Max","Notes"], rows: [["Labetalol (1st)","100 mg BD","800 mg/day","CI: asthma, bradycardia, pulmonary oedema. Caution DM."],["Nifedipine MR (2nd)","10 mg BD","80 mg/day","Not licensed in pregnancy. CI: advanced aortic stenosis."],["Methyldopa (3rd)","500 mg loading → 250 mg TDS","3 g/day","Stop within 2 days of birth. CI: liver disease, depression."]] },
      { type: "subheading", value: "BP Targets" },
      { type: "table", headers: ["Setting","Target"], rows: [["Antenatal — GH/PET","≤135/85 mmHg"],["Postnatal — GH/PET","130/80–149/99 mmHg"],["Chronic hypertension","<140/90 mmHg"]] },
      { type: "subheading", value: "IV — Severe Hypertension (Labour Ward)" },
      { type: "table", headers: ["Drug","Bolus","Maintenance"], rows: [["Labetalol IV","50 mg over 5 mins; ↑40–80 mg every 10 mins to max 200 mg","100 mg in 100 ml 5% glucose at 20 ml/hr, doubling every 30 mins to max 160 ml/hr"],["Hydralazine IV","5–20 mg slow bolus over 10–20 mins","60 mg in 60 ml 0.9% NaCl at 1–12 ml/hr"],["Nifedipine oral","10 mg stat; repeat once after 30 mins if still ≥160/110","Then switch to IV labetalol or hydralazine"]] },
      { type: "subheading", value: "Safe for Breastfeeding" },
      { type: "list", items: ["Labetalol 100 mg BD → max 800 mg/day","Nifedipine (Adalat Retard) 10 mg BD → max 40 mg BD","Enalapril 5 mg OD → max 20 mg OD (check U+Es at 1 week)","Captopril 12.5 mg BD → max 25 mg BD","Atenolol 25–50 mg OD → max 100 mg/day","Avoid: ARBs, amlodipine, other ACE inhibitors (insufficient evidence)"] },
    ]
  },
  {
    id: "pet-severe-lw", gl: "GL952", condition: "Pre-Eclampsia", setting: "Labour Ward — Severe",
    flowchartId: "GL952_SEVERE_LW",
    title: "Severe PET / Eclampsia — Labour Ward",
    tags: ["severe","labour ward","eclampsia","magnesium","mgso4","fit","seizure","convulsion","emergency","hellp","deteriorating","fluid balance","restrict fluids"],
    content: [
      { type: "alert", value: "EMERGENCY: Call LW co-ordinator, Obs registrar, Anaesthetic registrar, Consultant obstetrician, Consultant anaesthetist, Neonatal team." },
      { type: "subheading", value: "Immediate Actions" },
      { type: "list", items: ["BP every 5 minutes","IV access + continuous CTG","PET screen + Group & Save","Strict fluid balance (40 ml/hr + previous hour's urine output, max 80 ml/hr)","NBM + omeprazole + cyclizine","Anaesthetic review","Inform NICU if <36 weeks","Do NOT give LMWH in labour"] },
      { type: "subheading", value: "MgSO4 — Loading & Maintenance" },
      { type: "list", items: ["Loading: 4 g (2 × 10 ml vials 20% MgSO4 in one 20 ml syringe) IV over 5–10 minutes","Maintenance: 1 g/hr — 5 × 10 ml vials in 50 ml syringe at 5 ml/hr for ≥24 hrs after last seizure or delivery","If anuric: loading dose only"] },
      { type: "subheading", value: "MgSO4 Monitoring (every 15 mins × 2 hrs, then hourly)" },
      { type: "list", items: ["Continuous ECG + pulse oximetry","BP","Patellar reflexes (or biceps if epidural)","Respiratory rate","Conscious level","Hourly urine output"] },
      { type: "subheading", value: "Toxicity — Act Immediately" },
      { type: "table", headers: ["Sign","Action"], rows: [["Urine output <100 ml/4 hrs","Reduce infusion to 0.5 g/hr"],["Absent patellar reflex","Stop MgSO4 until reflexes return"],["Respiratory depression <10 breaths/min","O2, stop MgSO4, calcium gluconate 10 ml 10% IV over 5–10 mins"],["Respiratory arrest","Intubate, ventilate, stop MgSO4, calcium gluconate IV"]] },
      { type: "subheading", value: "MgSO4 Levels" },
      { type: "table", headers: ["Level (mmol/L)","Action"], rows: [["2.0–3.5","Therapeutic — continue"],["3.55–5.0","Stop 15 mins; restart at half rate if urine ≥20 ml/hr"],[">5.0","Stop — urgent consultant review"],["<2.0","Increase to 10 ml/hr (2 g/hr) for 2 hours, recheck at 3 hours"]] },
    ]
  },
];
