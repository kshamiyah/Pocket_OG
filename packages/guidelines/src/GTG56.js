export const GTG56_SECTIONS = [
  {
    id: "collapse-overview", gl: "GTG56", condition: "Maternal Collapse", setting: "Definition & Causes",
    flowchartId: "MATERNAL_COLLAPSE_ARREST",
    title: "Maternal Collapse — Definition & Causes",
    tags: ["maternal collapse", "cardiac arrest", "obstetric cardiac arrest", "4hs", "4ts", "hypoxia", "hypovolaemia", "haemorrhage", "amniotic fluid embolism", "afe", "thromboembolism", "cardiac disease", "sepsis", "eclampsia", "anaphylaxis", "collapse causes"],
    content: [
      { type: "text", value: "Maternal collapse: an acute event involving the cardiorespiratory and/or central nervous systems, resulting in reduced or absent conscious level (and potentially cardiac arrest and death), at any stage in pregnancy and up to 6 weeks after birth. If not treated effectively, collapse can progress to maternal cardiac arrest." },
      { type: "subheading", value: "Incidence" },
      { type: "list", items: [
        "Cardiac arrest in pregnancy: around 1 in 36,000 maternities; UKOSS 2011–14 found 2.78 per 100,000 maternities, with a 42% case fatality rate",
        "25% of cardiac arrests in pregnancy were secondary to anaesthesia, all with 100% survival",
        "Major obstetric haemorrhage: estimated incidence 6 in 1000 maternities, among the most common causes of collapse",
        "Thromboembolism was the most common cause of direct maternal death (MBRRACE-UK 2016)",
        "Cardiac disease was the most common cause of indirect maternal death; almost 1 in 5 of these deaths occurred in an ambulance or A&E",
        "Amniotic fluid embolism (AFE): incidence 1.7 per 100,000 maternities; survival has improved over time (14% in 1979 to ~81% by 2014); perinatal mortality 67 per 1000 total births",
      ] },
      { type: "subheading", value: "Causes: the obstetric 4H's and 4T's" },
      { type: "table", headers: ["Category", "Obstetric causes"], rows: [
        ["Hypoxia", "Pulmonary embolus, failed intubation, aspiration, heart failure, anaphylaxis, eclampsia/PET (pulmonary oedema, seizure)"],
        ["Hypovolaemia", "Haemorrhage (remember concealed), abnormal placentation, uterine rupture, atony, splenic/hepatic rupture, aneurysm rupture; cardiac arrhythmia or MI; distributive (sepsis, high regional block, anaphylaxis)"],
        ["Hypo/hyperkalaemia", "Also consider blood glucose, sodium, calcium and magnesium levels"],
        ["Hypothermia", "No more likely in pregnancy"],
        ["Tamponade", "Aortic dissection, peripartum cardiomyopathy, trauma"],
        ["Thrombosis", "Amniotic fluid embolus, pulmonary embolus, myocardial infarction, air embolism"],
        ["Toxins", "Local anaesthetic, magnesium, illicit drugs"],
        ["Tension pneumothorax", "Entonox in pre-existing pneumothorax, trauma"],
      ] },
      { type: "alert", value: "Eclampsia and intracranial haemorrhage must be added to the standard 4H's/4T's when considering obstetric collapse. Vasovagal attacks and epileptic seizures remain the most common causes of maternal collapse overall." },
      { type: "subheading", value: "Sepsis and drug toxicity" },
      { type: "list", items: [
        "Bacteraemia can be present without pyrexia or a raised white cell count, and can progress rapidly to severe sepsis and septic shock",
        "Most common organisms in obstetric sepsis: streptococcal groups A, B and D, pneumococcus and E. coli",
        "The two obstetric drugs most associated with toxic collapse: magnesium sulphate (especially with renal impairment) and local anaesthetic agents",
      ] },
    ]
  },

  {
    id: "collapse-physiology", gl: "GTG56", condition: "Maternal Collapse", setting: "Physiological Changes Affecting Resuscitation",
    title: "Maternal Collapse — Why Resuscitation Is Different in Pregnancy",
    tags: ["aortocaval compression", "physiological changes pregnancy", "cardiac output", "functional residual capacity", "difficult intubation", "aspiration risk", "resuscitation physiology"],
    content: [
      { type: "subheading", value: "Aortocaval compression" },
      { type: "list", items: [
        "From around 20 weeks, the gravid uterus reduces venous return in the supine position, reducing cardiac output by up to 30–40%",
        "Chest compressions normally achieve ~30% of normal cardiac output; aortocaval compression reduces this further to ~10% of non-pregnant cardiac output",
        "CPR is therefore less likely to be effective from 20 weeks of gestation onwards unless aortocaval compression is relieved",
      ] },
      { type: "subheading", value: "Respiratory and airway changes" },
      { type: "list", items: [
        "Increased oxygen consumption and reduced functional residual capacity (diaphragmatic splinting) mean pregnant women become hypoxic more rapidly during hypoventilation",
        "Difficult intubation is more likely (weight gain, breast tissue, laryngeal oedema); a failed intubation drill should always be considered",
        "Increased risk of regurgitation and aspiration (progesterone relaxes the lower oesophageal sphincter; raised intra-abdominal pressure; delayed gastric emptying in labour or after opioids)",
      ] },
      { type: "subheading", value: "Circulation" },
      { type: "list", items: [
        "The uterus receives ~10% of cardiac output at term, so large volumes of blood can be lost rapidly",
        "Healthy women can lose up to 35% of circulating volume before becoming symptomatic; maternal tachycardia may be the only sign of hypovolaemia until very late",
        "Blood loss is tolerated less well with pre-existing anaemia, and concealed bleeding is easily underestimated",
      ] },
    ]
  },

  {
    id: "collapse-resuscitation", gl: "GTG56", condition: "Maternal Collapse", setting: "Initial Resuscitation",
    flowchartId: "MATERNAL_COLLAPSE_ARREST",
    title: "Maternal Collapse — Initial Resuscitation (ABCDE)",
    tags: ["resuscitation", "abcde", "aortocaval compression relief", "manual uterine displacement", "left lateral tilt", "airway", "chest compressions", "defibrillation", "cardiac arrest drugs", "adrenaline", "amiodarone", "intralipid"],
    content: [
      { type: "text", value: "Maternal collapse resuscitation follows the Resuscitation Council (UK) ABCDE approach, with adaptations for maternal physiology. There is no change to algorithm drugs or doses." },
      { type: "subheading", value: "Relieving aortocaval compression" },
      { type: "list", items: [
        "From 20 weeks' gestation, or where the uterus is palpable at or above the umbilicus: manual uterine displacement is preferred — place a hand below the uterus on the maternal right and push slightly upwards and to the left ('up, off and over'), keeping the woman supine for effective compressions",
        "Alternative: left lateral tilt of 15–30° from head to toe on a firm surface (tilting table, wedge or spinal board) — soft surfaces such as a bed, pillows or blankets are not effective and should not be used",
        "In major trauma, protect the spine with a spinal board before tilting; in its absence, use manual uterine displacement",
      ] },
      { type: "subheading", value: "Airway and breathing" },
      { type: "list", items: [
        "Intubation with a cuffed endotracheal tube should be performed immediately by an experienced anaesthetist",
        "Failed intubation drill: maintain oxygenation, call for help, supraglottic airway device, front-of-neck access",
        "Supplemental high-flow oxygen (10–15 L/min) as soon as possible; bag-mask or a simple supraglottic airway until intubation is achieved",
        "Waveform capnography must be used to confirm and monitor tracheal tube placement",
      ] },
      { type: "subheading", value: "Circulation" },
      { type: "list", items: [
        "Chest compressions immediately if the airway is clear and there is no breathing — 30 compressions (rate 100–120/min, depress 5–6 cm centre of chest) to 2 ventilations before intubation",
        "After intubation: continuous compressions at 100–120/min, desynchronised with ventilation at 10 breaths/min",
        "Two wide-bore cannulae (minimum 16 gauge), sited above the diaphragm where possible; consider central, intraosseous or cutdown access early if peripheral access fails",
        "Same defibrillation energies as a non-pregnant adult; adhesive pads preferred, left pad lateral to the left breast (anterior/posterior placement if breasts are large or engorged); remove uterine monitors before shock",
      ] },
      { type: "subheading", value: "Drugs for use during cardiac arrest" },
      { type: "table", headers: ["Drug", "Dose"], rows: [
        ["Fluids", "500 mL IV crystalloid bolus"],
        ["Adrenaline", "1 mg IV every 3–5 minutes in non-shockable rhythm, or after the 3rd shock in a shockable rhythm"],
        ["Amiodarone", "300 mg IV after the 3rd shock"],
        ["Atropine", "0.5–1 mg IV, up to 3 mg, if vagal tone is the likely cause"],
        ["Calcium chloride 10%", "10 mL IV for magnesium overdose, low calcium or hyperkalaemia"],
        ["Magnesium sulphate", "2 g IV for polymorphic VT / hypomagnesaemia; 4 g IV for eclampsia"],
        ["Thrombolysis / PCI", "For suspected massive pulmonary embolus or MI"],
        ["Tranexamic acid", "1 g if haemorrhage is the cause"],
        ["Intralipid 20%", "1.5 mL/kg IV bolus, then 15 mL/kg/hr IV infusion"],
      ] },
      { type: "alert", value: "Source: OAA/Resuscitation Council UK/MBRRACE-UK Maternal Cardiac Arrest QRH V1.1 (2021), consistent with RCOG Green-top Guideline No. 56." },
    ]
  },

  {
    id: "collapse-pmcs", gl: "GTG56", condition: "Maternal Collapse", setting: "Perimortem Caesarean Section",
    flowchartId: "MATERNAL_COLLAPSE_ARREST",
    title: "Perimortem Caesarean Section (Emergency Hysterotomy)",
    tags: ["perimortem caesarean section", "pmcs", "resuscitative hysterotomy", "emergency hysterotomy", "20 weeks", "4 minutes", "5 minutes", "scalpel"],
    content: [
      { type: "alert", value: "Over 20 weeks of gestation: if there is no response to correctly performed CPR within 4 minutes of collapse, or resuscitation continues beyond this, perform PMCS to assist maternal resuscitation. Aim to complete delivery within 5 minutes of collapse." },
      { type: "list", items: [
        "PMCS should not be delayed by moving the woman — perform it where the collapse and resuscitation are taking place",
        "Use whichever incision gives the most rapid access: midline vertical or suprapubic transverse",
        "Only a scalpel and umbilical cord clamps (or alternative ligatures) are required; these must be available on the resuscitation trolley in all areas where collapse may occur, including the emergency department",
        "No anaesthesia is required if there is no circulation; the doctrine of 'best interests of the patient' applies to performing the procedure without consent",
        "Manual uterine displacement can stop immediately before the incision",
        "Below 20 weeks there is no proven benefit from delivering the fetus and placenta",
      ] },
      { type: "subheading", value: "Why it helps" },
      { type: "text", value: "The gravid uterus reduces cardiac output by around 60% through aortocaval compression. Delivery reduces oxygen consumption, improves venous return and cardiac output, facilitates chest compressions, and allows internal cardiac compression if the abdomen is already open." },
      { type: "subheading", value: "Outcomes (evidence base)" },
      { type: "list", items: [
        "UKOSS: time from collapse to PMCS was significantly shorter in women who survived than those who died (median 3 vs 12 minutes)",
        "Maternal outcomes were more favourable when PMCS was performed within 10 minutes of arrest",
        "MBRRACE-UK 2016: overall neonatal survival after PMCS was 38% — 9 of 19 babies survived when delivered after 32 weeks, 3 of 13 when delivered at 32 weeks or less",
        "Terminology note: emergency medicine and paramedic teams may use 'resuscitative hysterotomy' — the procedure is primarily to aid maternal resuscitation, not fetal survival",
      ] },
    ]
  },

  {
    id: "collapse-cause-specific", gl: "GTG56", condition: "Maternal Collapse", setting: "Cause-Specific Management",
    title: "Maternal Collapse — Managing the Specific Cause",
    tags: ["amniotic fluid embolism management", "afe management", "sepsis six", "surviving sepsis", "magnesium toxicity antidote", "local anaesthetic toxicity", "lipid rescue", "anaphylaxis treatment", "adrenaline dose anaphylaxis", "eclampsia management", "intracranial haemorrhage"],
    content: [
      { type: "subheading", value: "Haemorrhage" },
      { type: "list", items: [
        "Deliver the fetus and placenta promptly if collapse is secondary to antepartum haemorrhage",
        "In massive placental abruption, caesarean section may occasionally be indicated even if the fetus is dead, to allow rapid control of haemorrhage",
        "IV tranexamic acid significantly reduces mortality from postpartum haemorrhage, particularly if given within 3 hours (WOMAN trial)",
        "See the PPH and antepartum haemorrhage guides for full ongoing management",
      ] },
      { type: "subheading", value: "Amniotic fluid embolism (AFE)" },
      { type: "list", items: [
        "Management is supportive rather than specific — there is no proven effective therapy",
        "Early involvement of senior staff (obstetricians, anaesthetists, haematologists, intensivists) is essential",
        "Coagulopathy needs early, aggressive treatment, including fresh frozen plasma",
        "Recombinant factor VIIa should only be used if coagulopathy cannot be corrected by massive blood component replacement — it is associated with poorer outcomes in AFE",
        "If undelivered, deliver the fetus and placenta as soon as possible; uterine atony is more common and contributes to PPH",
      ] },
      { type: "subheading", value: "Sepsis and septic shock" },
      { type: "text", value: "Manage according to the Surviving Sepsis Campaign. Apply the following within 6 hours:" },
      { type: "list", items: [
        "Measure serum lactate",
        "Obtain blood cultures before giving antibiotics",
        "Give broad-spectrum antibiotics within 1 hour of recognising severe sepsis/septic shock, per local protocol",
        "If hypotensive and/or lactate >4 mmol/L: give a minimum 30 mL/kg crystalloid within 3 hours of diagnosis",
        "Once volume replaced, use a vasopressor (noradrenaline ± vasopressin/adrenaline) and/or inotrope (e.g. dobutamine) to keep MAP >65 mmHg",
        "Consider steroids if unresponsive to fluid and vasopressors",
        "Target SpO2 >94% (88–92% if at risk of hypercapnic respiratory failure); transfuse if haemoglobin <70 g/L",
      ] },
      { type: "subheading", value: "Magnesium sulphate toxicity" },
      { type: "alert", value: "Antidote: 10 mL 10% calcium gluconate or 10 mL 10% calcium chloride, given by slow IV injection." },
      { type: "subheading", value: "Local anaesthetic toxicity" },
      { type: "list", items: [
        "Stop injecting immediately if toxicity is suspected",
        "Lipid rescue (Intralipid 20%): 1.5 mL/kg IV bolus over 1 minute, then 15 mL/kg/hr infusion",
        "Repeat the bolus up to twice more at 5-minute intervals if circulation is not restored",
        "If still not restored after a further 5 minutes, increase the infusion to 30 mL/kg/hr",
        "Maximum cumulative dose 12 ml/kg. Continue CPR throughout — recovery may take over an hour",
        "Intralipid 20% should be available in all hospitals offering maternity services; report all cases of lipid rescue to NHS Improvement and the Lipid Rescue site",
      ] },
      { type: "subheading", value: "Eclampsia and intracranial haemorrhage" },
      { type: "list", items: [
        "Eclampsia: manage per NICE NG133 / GL952 (see the Pre-eclampsia guide)",
        "Intracranial haemorrhage: involve neuroradiology and neurosurgery at the earliest opportunity",
      ] },
      { type: "subheading", value: "Anaphylaxis" },
      { type: "list", items: [
        "Remove all potential causative agents; follow the ABCDE approach",
        "Treatment: adrenaline 1:1000, 500 micrograms (0.5 mL) intramuscularly — for IM use only; repeat after 5 minutes if no effect",
        "Adjuvant therapy: chlorphenamine 10 mg and hydrocortisone 200 mg, IM or slow IV",
        "Mast cell tryptase levels support the diagnosis — ideally 3 timed samples: as soon as possible after resuscitation starts, 1–2 hours after symptom onset, and 24 hours later",
      ] },
    ]
  },

  {
    id: "collapse-team-governance", gl: "GTG56", condition: "Maternal Collapse", setting: "Team, Documentation & Training",
    title: "Maternal Collapse — Team, Governance & Training",
    tags: ["arrest team", "senior obstetrician", "obstetric anaesthetist", "mbrrace-uk reporting", "incident reporting", "debriefing", "resuscitation training", "documentation"],
    content: [
      { type: "subheading", value: "Who should be on the team" },
      { type: "list", items: [
        "In addition to the general arrest team: a senior midwife, an obstetrician and an obstetric anaesthetist",
        "The most senior obstetrician and senior anaesthetist should be called at the time of the cardiopulmonary arrest call",
        "The neonatal team should be called early if delivery is likely (antepartum collapse over 22+0 weeks)",
        "A consultant intensivist should be involved as soon as possible if the woman survives",
      ] },
      { type: "subheading", value: "Governance" },
      { type: "list", items: [
        "Accurate documentation is essential in all cases, whether or not resuscitation is successful",
        "Every case of maternal collapse should generate a clinical incident form and be reviewed through the clinical governance process",
        "All cases of maternal death must be reported to MBRRACE-UK",
        "Debriefing is recommended for the woman, her family, and the staff involved",
      ] },
      { type: "subheading", value: "Training" },
      { type: "list", items: [
        "All maternity staff should have annual formal multidisciplinary training in generic life support and the management of maternal collapse",
        "Small-group, multidisciplinary, interactive practical training is recommended",
      ] },
    ]
  },
];
