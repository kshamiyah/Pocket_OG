// GTG63 — Antepartum Haemorrhage (RCOG Green-Top Guideline No. 63, November 2011)
// Flowchart 1: APH Initial Triage & Assessment
// Flowchart 2: APH Delivery Decision
// Flowchart 3: Anti-D Ig in RhD-Negative Women with APH

export const GTG63_TRIAGE_FLOWCHART = {
  id: "GTG63_TRIAGE",
  title: "APH Initial Triage & Assessment",
  subtitle: "GTG63: Antepartum Haemorrhage",
  startId: "present",
  nodes: {

    "present": {
      type: "action",
      title: "Woman Presents With Antepartum Haemorrhage",
      text: "Bleeding from or into the genital tract at ≥24+0 weeks. Record pulse and blood pressure immediately. Assess severity of bleeding.",
      items: [
        "Document time of presentation and amount of blood loss",
        "Classify severity: spotting / minor (<50 ml settled) / major (50–1000 ml) / massive (>1000 ml or clinical shock)",
        "Check: is she haemodynamically compromised?",
      ],
      next: "severity-check",
    },

    "severity-check": {
      type: "decision",
      title: "Initial severity, is there maternal compromise?",
      text: "Assess immediately for haemodynamic compromise and clinical shock.",
      options: [
        { label: "Massive / Major persisting / Clinical shock / Unable to give history", sublabel: "Activate major haemorrhage protocol immediately", next: "immediate-resus" },
        { label: "No maternal compromise, spotting or minor, bleeding settled", sublabel: "Proceed to full history and examination", next: "full-history" },
      ],
    },

    "immediate-resus": {
      type: "alert",
      title: "IMMEDIATE RESUSCITATION: Major Haemorrhage Protocol",
      text: "Four pillars: Communication — Resuscitation — Monitoring and Investigation — Arrest Bleeding by Delivery.\n\n• A + B: Airway + O₂ 10–15 L/min via non-rebreather facemask\n• C: 2× 14G IV access; take 20 ml blood (FBC, coag screen, crossmatch ×4, U&E, LFTs; Kleihauer if RhD-neg)\n• Call: consultant obstetrician + consultant anaesthetist + haematologist + blood bank\n• Catheterise; monitor urine output ≥30 ml/hour\n• Mother is always the priority — stabilise before assessing fetus",
      next: "fh-check",
    },

    "fh-check": {
      type: "decision",
      title: "Fetal heart assessment, once resuscitation commenced",
      text: "Assess fetal wellbeing as part of D (Disability) of ABCD.",
      options: [
        { label: "Fetal heart absent on auscultation", sublabel: "Urgent USS to confirm/exclude IUFD", next: "iufd-path" },
        { label: "CTG abnormal / signs of fetal compromise", sublabel: "Expedite delivery urgently", next: "emergency-delivery" },
        { label: "CTG normal / fetal heart confirmed", sublabel: "Continue stabilisation", next: "stabilise" },
      ],
    },

    "iufd-path": {
      type: "alert",
      title: "Fetal Heart Absent: Confirm with USS",
      text: "Perform USS immediately to confirm or exclude IUFD. Do not leave the woman alone while awaiting scan.\n\nIf IUFD confirmed: manage per GTG55 Late Intrauterine Fetal Death & Stillbirth. Vaginal birth recommended for most women (CS if specific maternal indication).",
      next: "stabilise-iufd",
    },

    "stabilise-iufd": {
      type: "end",
      title: "IUFD Confirmed",
      text: "Stabilise mother. Counsel regarding fetal loss with senior obstetrician and bereavement midwife. Manage per RCOG GTG55 Late IUFD & Stillbirth.",
      items: [
        "Continue maternal resuscitation as required",
        "Senior obstetrician and bereavement midwife to be involved",
        "Discuss mode of birth: vaginal birth recommended unless maternal contraindication",
      ],
    },

    "emergency-delivery": {
      type: "alert",
      title: "Fetal Compromise with APH: Obstetric Emergency",
      text: "Arrange immediate caesarean section with concurrent maternal resuscitation. Do not delay delivery to achieve full maternal stabilisation if the fetus is compromised.",
      next: "delivery-end",
    },

    "delivery-end": {
      type: "end",
      title: "Expedite Delivery",
      text: "Immediate CS. Senior obstetrician and anaesthetist present. Neonatal team alerted and present at delivery.",
      items: [
        "Regional anaesthesia if haemodynamically stable; general anaesthesia if unstable or rapid delivery required",
        "Continue maternal resuscitation throughout",
        "Anticipate PPH — blood products available",
        "Active management of third stage; consider ergometrine-oxytocin if no hypertension",
      ],
    },

    "stabilise": {
      type: "end",
      title: "Stabilise: Continue Monitoring",
      text: "CTG monitoring ongoing. Investigations underway. See Delivery Decision flowchart for timing and mode of birth.",
      items: [
        "Continuous EFM in major APH",
        "Serial haemodynamic observations",
        "USS to confirm placental site if not already done",
        "Consider corticosteroids if 24+0–34+6 weeks",
      ],
    },

    "full-history": {
      type: "action",
      title: "Take Full History",
      text: "Establish likely cause and guide management pathway.",
      items: [
        "Pain: continuous = suspect abruption; intermittent = consider labour; painless = suspect praevia",
        "Fetal movements — attempt auscultation",
        "Rupture of membranes? Consider vasa praevia (fresh bleeding at SROM)",
        "Risk factors for abruption: previous abruption, pre-eclampsia, smoking, trauma, cocaine",
        "Previous USS for placental site — known low-lying placenta?",
        "Cervical smear history and any instrumentation (to exclude lower genital tract cause)",
      ],
      next: "examination",
    },

    "examination": {
      type: "action",
      title: "Clinical Examination",
      text: "Systematic examination to identify likely cause.",
      items: [
        "Abdominal palpation: tender/woody/board-like uterus = significant abruption; contractions present?",
        "Soft non-tender uterus = praevia or lower genital tract cause likely",
        "Speculum examination: amount of bleeding, cervical dilatation, ectropion, lower genital tract source",
        "Digital VE: ONLY after USS has EXCLUDED placenta praevia — never perform blind",
      ],
      next: "cause",
    },

    "cause": {
      type: "decision",
      title: "Likely cause based on history and examination?",
      text: "Classify the likely cause to direct the next management steps.",
      options: [
        { label: "Placenta praevia suspected", sublabel: "Painless, high head, known low placenta, or posterior USS not done", next: "praevia" },
        { label: "Placental abruption suspected", sublabel: "Continuous pain, tender/woody uterus, abruption risk factors", next: "abruption" },
        { label: "Lower genital tract cause or unexplained APH", sublabel: "Normal examination, ectropion on speculum, no uterine tenderness", next: "lower-gt" },
      ],
    },

    "praevia": {
      type: "action",
      title: "Placenta Praevia Pathway",
      text: "USS is required to confirm placental site before any further vaginal assessment.",
      items: [
        "No digital vaginal examination until USS confirms/excludes praevia",
        "Urgent USS to confirm placental site",
        "CTG once stable",
        "If confirmed praevia: manage per RCOG GTG27 (Placenta Praevia & Accreta)",
        "Admit until bleeding settles; if ongoing/recurrent — remain inpatient",
      ],
      next: "investigations-end",
    },

    "abruption": {
      type: "alert",
      title: "Placental Abruption: Clinical Diagnosis",
      text: "Placental abruption is a CLINICAL DIAGNOSIS. Ultrasound sensitivity is only 24% — a normal USS does NOT exclude abruption.\n\nConcealed abruption (no visible bleeding) can be the most dangerous: uterus may be tense, fetal heart absent, and coagulopathy already established.",
      next: "abruption-investigations",
    },

    "abruption-investigations": {
      type: "action",
      title: "Abruption: Investigations & Monitoring",
      text: "Investigations proportionate to severity.",
      items: [
        "FBC + coagulation screen + crossmatch 4 units (even minor abruption can evolve rapidly)",
        "Kleihauer test if RhD-negative",
        "CTG immediately — abnormal in 69% of significant abruptions",
        "If CTG abnormal: expedite delivery (see Delivery Decision flowchart)",
        "Suspect DIC if fibrinogen falling, PT/aPTT prolonged — liaise with haematologist",
      ],
      next: "investigations-end",
    },

    "lower-gt": {
      type: "action",
      title: "Lower Genital Tract / Unexplained APH",
      text: "Lower genital tract causes (ectropion, polyp, cervicitis) are usually benign but require appropriate follow-up.",
      items: [
        "Ectropion: no change to antenatal care required; offer reassurance",
        "Unexplained APH: reclassify as high risk; serial USS for fetal growth (FGR risk)",
        "Consider referral for colposcopy if suspicious cervical appearance",
        "FBC + G&S for any episode heavier than spotting",
      ],
      next: "investigations-end",
    },

    "investigations-end": {
      type: "end",
      title: "Investigations & Ongoing Plan",
      text: "Investigations based on severity and likely cause. Determine ongoing management.",
      items: [
        "Consider corticosteroids if 24+0–34+6 weeks and preterm birth is a realistic risk",
        "Anti-D Ig + Kleihauer if RhD-negative (regardless of routine anti-D schedule)",
        "Admit if APH heavier than spotting or ongoing — discharge only when bleeding stopped",
        "See Delivery Decision flowchart for timing and mode of birth decisions",
      ],
    },

  },
};

export const GTG63_DELIVERY_FLOWCHART = {
  id: "GTG63_DELIVERY",
  title: "APH: Delivery Decision",
  subtitle: "GTG63: Antepartum Haemorrhage",
  startId: "start",
  nodes: {

    "start": {
      type: "action",
      title: "APH: Determine Timing and Mode of Delivery",
      text: "Senior obstetrician must be involved in all delivery decisions following APH. Consider: gestation, fetal condition, maternal condition, cause of APH, and placental site.",
      items: [
        "Confirm fetal viability with auscultation or CTG",
        "Confirm placental site with USS if not already done",
        "Involve consultant obstetrician",
      ],
      next: "fetal-death",
    },

    "fetal-death": {
      type: "decision",
      title: "Fetal death confirmed (IUFD)?",
      text: "Fetal death changes the priorities of management — maternal stabilisation becomes the primary goal.",
      options: [
        { label: "Yes: IUFD confirmed on USS", sublabel: "Vaginal birth usually recommended", next: "vaginal-birth" },
        { label: "No, fetus alive", sublabel: "Proceed to assess maternal/fetal compromise", next: "compromise-check" },
      ],
    },

    "vaginal-birth": {
      type: "end",
      title: "IUFD: Vaginal Birth Recommended",
      text: "Vaginal birth is the recommended mode of delivery for most women with IUFD, provided maternal condition is satisfactory.",
      items: [
        "CS should be considered where there is a specific maternal indication",
        "Manage per RCOG GTG55 (Late Intrauterine Fetal Death & Stillbirth)",
        "Senior obstetrician and bereavement midwife to be involved",
        "Treat DIC urgently — fibrinogen <1 g/l, PT/aPTT prolonged",
      ],
    },

    "compromise-check": {
      type: "decision",
      title: "Is there maternal and/or fetal compromise?",
      text: "Assess maternal haemodynamics and fetal wellbeing on CTG.",
      options: [
        { label: "Yes, maternal shock OR fetal compromise (abnormal CTG)", sublabel: "Obstetric emergency, immediate CS", next: "immediate-cs" },
        { label: "No, mother and fetus stable", sublabel: "Consider gestation and clinical picture", next: "gestation-check" },
      ],
    },

    "immediate-cs": {
      type: "alert",
      title: "APH with Compromise: Obstetric Emergency",
      text: "Immediate caesarean section with concurrent maternal resuscitation.\n\nDo not delay delivery to achieve full maternal stabilisation if the fetus is compromised.\n\n• Consultant obstetrician + consultant anaesthetist immediately\n• Neonatal team to be present at delivery\n• Regional anaesthesia if stable; general anaesthesia if unstable or rapid delivery required",
      next: "cs-end",
    },

    "cs-end": {
      type: "end",
      title: "Expedite Delivery",
      text: "Deliver fetus and placenta to arrest haemorrhage and prevent DIC.",
      items: [
        "Four pillars maintained throughout: Communication, Resuscitation, Monitoring, Deliver",
        "Active management of third stage: ergometrine-oxytocin (Syntometrine) if no hypertension",
        "Anticipate PPH — blood products at hand; haematologist involved",
        "Postnatal: thromboprophylaxis, debrief, incident reporting",
      ],
    },

    "gestation-check": {
      type: "decision",
      title: "Gestation and clinical picture?",
      text: "Stable mother and fetus — determine timing of delivery based on gestation and APH severity.",
      options: [
        { label: "<37+0 weeks, bleeding settled, no compromise", sublabel: "Conservative expectant management", next: "conservative" },
        { label: "≥37+0 weeks, spotting or blood-streaked show only", sublabel: "Likely blood-stained show; assess carefully", next: "show-assessment" },
        { label: "≥37+0 weeks, minor or major APH (not just spotting)", sublabel: "Consider IOL for vaginal delivery", next: "iol-consider" },
      ],
    },

    "conservative": {
      type: "end",
      title: "Conservative (Expectant) Management <37 Weeks",
      text: "No evidence to support elective preterm delivery when bleeding has settled and there is no compromise.",
      items: [
        "Admit and monitor until bleeding has stopped — do not discharge with ongoing bleeding",
        "Serial USS for fetal growth (increased risk of FGR, oligohydramnios, placental dysfunction)",
        "Offer corticosteroids 24+0–34+6 weeks if preterm birth remains a risk",
        "Anti-D Ig + Kleihauer if RhD-negative",
        "Re-assess immediately if further bleeding, pain, or reduced fetal movements",
        "Tocolysis: contraindicated in abruption; relatively contraindicated in praevia; consider only in very preterm with incomplete steroids or NICU transfer needed",
      ],
    },

    "show-assessment": {
      type: "end",
      title: "Likely Blood-Stained Show ≥37 Weeks",
      text: "Spotting streaked through mucus at term is unlikely to represent true APH and may not require active intervention.",
      items: [
        "Spotting streaked through mucus plug = likely physiological show",
        "Establish membranes intact; speculum if uncertain",
        "If uncertain whether true APH: observe and monitor",
        "If bleeding progresses to minor or major APH — see IOL pathway",
        "Normal CTG and no other concerns: can usually await spontaneous onset of labour",
      ],
    },

    "iol-consider": {
      type: "end",
      title: "Consider IOL at ≥37+0 Weeks",
      text: "Induction of labour with the aim of vaginal delivery avoids the adverse consequences potentially associated with ongoing or recurrent abruption.",
      items: [
        "Induction of labour is preferred over CS in most cases at ≥37 weeks without fetal compromise",
        "Continuous EFM in labour — ongoing APH risk",
        "Active management of third stage: Syntometrine if no hypertension (high PPH risk)",
        "Have blood products available: crossmatch, FFP, platelets",
        "Neonatal team briefed",
        "Senior obstetrician review throughout",
      ],
    },

  },
};

export const GTG63_ANTID_FLOWCHART = {
  id: "GTG63_ANTID",
  title: "Anti-D Ig in RhD-Negative Women with APH",
  subtitle: "GTG63: Antepartum Haemorrhage",
  startId: "start",
  nodes: {

    "start": {
      type: "action",
      title: "Non-Sensitised RhD-Negative Woman with APH",
      text: "Anti-D Ig must be given after any episode of APH, independent of whether routine antenatal prophylactic anti-D has already been administered.",
      items: [
        "Confirm RhD status from booking blood group",
        "Confirm non-sensitised (no anti-D antibodies)",
        "Do NOT delay anti-D Ig while awaiting Kleihauer result",
      ],
      next: "gestation-check",
    },

    "gestation-check": {
      type: "decision",
      title: "Gestation at presentation?",
      text: "The minimum dose and requirement for Kleihauer testing depends on gestation.",
      options: [
        { label: "APH at any gestation from 24+0 weeks onwards", sublabel: "≥500 iu anti-D Ig + Kleihauer test required", next: "kleihauer-antid" },
      ],
    },

    "kleihauer-antid": {
      type: "action",
      title: "Give Anti-D Ig + Kleihauer Test Simultaneously",
      text: "Both must be done together — do not wait for Kleihauer before giving anti-D.",
      items: [
        "1. Kleihauer test — to quantify fetomaternal haemorrhage (FMH)",
        "2. ≥500 iu anti-D Ig IM immediately — do not delay awaiting Kleihauer result",
        "Kleihauer test is NOT sensitive for diagnosing abruption — it quantifies FMH only",
        "Document dose, time, lot number in maternity records",
      ],
      next: "fmh-result",
    },

    "fmh-result": {
      type: "decision",
      title: "Kleihauer result: FMH quantification",
      text: "Interpret Kleihauer result to determine if additional anti-D Ig is required.",
      options: [
        { label: "FMH ≤4 ml red blood cells", sublabel: "500 iu anti-D Ig is sufficient", next: "standard-done" },
        { label: "FMH >4 ml red blood cells", sublabel: "Additional anti-D Ig required, calculate dose", next: "extra-antid" },
      ],
    },

    "standard-done": {
      type: "decision",
      title: "Is this recurrent APH after 20+0 weeks?",
      text: "Recurrent bleeding requires repeat anti-D Ig at regular intervals.",
      options: [
        { label: "Yes, recurrent vaginal bleeding episodes", sublabel: "Repeat anti-D Ig at minimum 6-weekly intervals", next: "repeat-antid" },
        { label: "No, first or isolated episode", sublabel: "Document and continue routine prophylaxis schedule", next: "done" },
      ],
    },

    "extra-antid": {
      type: "action",
      title: "FMH >4 ml: Additional Anti-D Ig Required",
      text: "Liaise with haematology/transfusion laboratory to calculate the exact additional dose of anti-D Ig required.",
      items: [
        "Additional anti-D Ig dose is calculated from Kleihauer result",
        "Contact haematology or blood transfusion lab for dosing guidance",
        "Administer additional dose within 72 hours of the sensitising event",
        "Document all doses given",
      ],
      next: "recurrent-check",
    },

    "recurrent-check": {
      type: "decision",
      title: "Is this recurrent APH after 20+0 weeks?",
      text: "Recurrent bleeding requires repeat prophylaxis at minimum 6-weekly intervals.",
      options: [
        { label: "Yes, recurrent episodes of vaginal bleeding", next: "repeat-antid" },
        { label: "No, first or isolated episode", next: "done" },
      ],
    },

    "repeat-antid": {
      type: "end",
      title: "Recurrent APH: Repeat Anti-D Ig at 6-Weekly Intervals",
      text: "Each episode of vaginal bleeding after 20+0 weeks requires anti-D Ig + Kleihauer at a minimum of 6-weekly intervals.",
      items: [
        "Repeat ≥500 iu anti-D Ig with each further episode of APH",
        "Repeat Kleihauer test with each episode to quantify FMH",
        "Minimum interval between routine doses: 6 weeks",
        "Continue scheduled antenatal prophylactic anti-D programme",
        "Document all doses and dates in maternity records",
      ],
    },

    "done": {
      type: "end",
      title: "Anti-D Ig Given: Episode Complete",
      text: "Anti-D Ig administered. FMH quantified with Kleihauer. Documentation complete.",
      items: [
        "Continue routine antenatal anti-D prophylaxis schedule as planned",
        "Advise woman to report any further vaginal bleeding immediately",
        "If further episodes: repeat anti-D Ig + Kleihauer",
      ],
    },

  },
};
