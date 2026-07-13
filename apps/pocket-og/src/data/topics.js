// Curated topic pages, surfaced as a card above search results when the query
// matches one of the topic's terms. A topic page states no clinical facts of
// its own: every row is a link into existing, cited content (guides,
// flowcharts, drugs, trials), so there is nothing here to clinically verify
// beyond the labels.
//
// Shape:
//   terms       — normalised queries that trigger the card (lower-case)
//   gl          — owning guideline code, drives the accent colour via glColors
//   description — one sentence, paraphrased from the anchor guideline's own
//                 overview/definition section (already-cited content, not new
//                 clinical prose), purely for orientation.
//   sections    — groups of link rows. Entry types:
//     reader (id = gl code, optional sectionId to scroll to)
//     flowchart / calculator / drug / consent (id = navId)
//     trial (id = trials.js page id, opens Library > Articles > Trials)

export const TOPICS = {
  "pre-eclampsia": {
    id: "pre-eclampsia",
    title: "Pre-eclampsia",
    subtitle: "Hypertensive disorders of pregnancy",
    description: "New hypertension after 20 weeks with proteinuria or other organ involvement, renal, liver, neurological, haematological, or uteroplacental (GL952).",
    gl: "GL952",
    terms: [
      "pet", "pe", "pih", "pre-eclampsia", "preeclampsia", "pre eclampsia",
      "eclampsia", "severe pet", "severe pre-eclampsia", "severe preeclampsia",
      "hypertension in pregnancy", "pregnancy induced hypertension",
      "pregnancy-induced hypertension", "gestational hypertension",
      "hypertensive disorders of pregnancy",
    ],
    sections: [
      {
        heading: "Guides",
        entries: [
          { type: "reader", id: "GL952", gl: "GL952", label: "Hypertensive disorders (local guideline)", sublabel: "GL952: definitions, thresholds, management" },
          { type: "reader", id: "GL952", sectionId: "pet-severe-lw", gl: "GL952", label: "Severe PET on labour ward", sublabel: "GL952: severe disease section" },
          { type: "reader", id: "GL952", sectionId: "pet-medications", gl: "GL952", label: "Antihypertensive choices & doses", sublabel: "GL952: medications section" },
          { type: "reader", id: "NG133", gl: "NG133", label: "Hypertension in pregnancy (NICE)", sublabel: "NG133: full guideline" },
        ],
      },
      {
        heading: "Pathways",
        entries: [
          { type: "flowchart", id: "GL952_TRIAGE", gl: "GL952", label: "Triage: raised BP in pregnancy", sublabel: "GL952 flowchart" },
          { type: "flowchart", id: "GL952_ACUTE", gl: "GL952", label: "Acute BP management", sublabel: "GL952 flowchart" },
          { type: "flowchart", id: "GL952_SEVERE_LW", gl: "GL952", label: "Severe PET on labour ward", sublabel: "GL952 flowchart" },
          { type: "flowchart", id: "GL952_POSTNATAL", gl: "GL952", label: "Postnatal hypertension", sublabel: "GL952 flowchart" },
          { type: "flowchart", id: "GL952_POSTNATAL_WARD", gl: "GL952", label: "Postnatal ward round", sublabel: "GL952 flowchart" },
        ],
      },
      {
        heading: "Drugs",
        entries: [
          { type: "drug", id: "labetalol", gl: "GL952", label: "Labetalol", sublabel: "Rx: doses & routes" },
          { type: "drug", id: "nifedipine", gl: "GL952", label: "Nifedipine", sublabel: "Rx: doses & routes" },
          { type: "drug", id: "magnesium_sulphate", gl: "GL952", label: "Magnesium sulphate", sublabel: "Rx: seizure prophylaxis & treatment" },
        ],
      },
      {
        heading: "Evidence",
        entries: [
          { type: "trial", id: "trial-magpie", gl: "GL952", label: "Magpie", sublabel: "MgSO4 to prevent eclampsia" },
          { type: "trial", id: "trial-aspre", gl: "GL952", label: "ASPRE", sublabel: "Aspirin to prevent preterm pre-eclampsia" },
        ],
      },
      {
        heading: "Don't miss",
        entries: [
          { type: "reader", id: "NG133", sectionId: "ng133-prevention", gl: "NG133", label: "Aspirin prophylaxis & risk stratification", sublabel: "NG133: prevention section" },
          { type: "consent", id: "ASPIRIN", gl: "NG133", label: "Aspirin, counsel", sublabel: "Benefits, practical points & declining" },
          { type: "reader", id: "GL952", sectionId: "pet-postnatal-community", gl: "GL952", label: "Postnatal follow-up after discharge", sublabel: "GL952: community section" },
        ],
      },
    ],
  },
  "pph": {
    id: "pph",
    title: "Postpartum haemorrhage",
    subtitle: "PPH: the 4 Ts, minor to massive",
    description: "Blood loss ≥500 mL from the genital tract within 24 hours of birth; severity runs minor → major → massive, which activates the MHP (GTG52).",
    gl: "GTG52",
    terms: [
      "pph", "postpartum haemorrhage", "post partum haemorrhage",
      "primary pph", "massive pph", "massive obstetric haemorrhage", "moh",
    ],
    sections: [
      {
        heading: "Guides",
        entries: [
          { type: "reader", id: "GTG52", gl: "GTG52", label: "Postpartum haemorrhage (RCOG)", sublabel: "GTG52: overview & the 4 Ts" },
          { type: "reader", id: "GTG52", sectionId: "gtg52-major", gl: "GTG52", label: "Major PPH management", sublabel: "GTG52: major PPH section" },
          { type: "reader", id: "GTG52", sectionId: "gtg52-massive", gl: "GTG52", label: "Massive PPH / MHP activation", sublabel: "GTG52: massive haemorrhage protocol" },
        ],
      },
      {
        heading: "Pathways",
        entries: [
          { type: "flowchart", id: "GTG52_PPH", gl: "GTG52", label: "PPH management pathway", sublabel: "GTG52 flowchart: minor to major" },
        ],
      },
      {
        heading: "Drugs",
        entries: [
          { type: "drug", id: "oxytocin", gl: "GTG52", label: "Oxytocin", sublabel: "Rx: prevention & first-line treatment" },
          { type: "drug", id: "ergometrine", gl: "GTG52", label: "Ergometrine", sublabel: "Rx: uterotonic" },
          { type: "drug", id: "carboprost", gl: "GTG52", label: "Carboprost", sublabel: "Rx: uterotonic" },
          { type: "drug", id: "misoprostol", gl: "GTG52", label: "Misoprostol", sublabel: "Rx: uterotonic" },
          { type: "drug", id: "tranexamic_acid", gl: "GTG52", label: "Tranexamic acid", sublabel: "Rx: antifibrinolytic" },
        ],
      },
      {
        heading: "Evidence",
        entries: [
          { type: "trial", id: "trial-woman", gl: "GTG52", label: "WOMAN", sublabel: "Tranexamic acid for PPH" },
        ],
      },
      {
        heading: "Don't miss",
        entries: [
          { type: "reader", id: "GTG52", sectionId: "gtg52-prevention", gl: "GTG52", label: "Active management of the third stage", sublabel: "GTG52: prevention (AMTSL)" },
        ],
      },
    ],
  },

  "iol": {
    id: "iol",
    title: "Induction of labour",
    subtitle: "Indications, methods & timing",
    description: "Starting labour artificially, most often for post-maturity, reduced fetal movements, or a maternal or fetal indication that outweighs the risk of continuing (GL861).",
    gl: "GL861",
    terms: [
      "iol", "induction", "induction of labour", "induction of labor",
      "labour induction", "labor induction",
    ],
    sections: [
      {
        heading: "Guides",
        entries: [
          { type: "reader", id: "GL861", gl: "GL861", label: "Induction of labour & term PLRoM (local)", sublabel: "GL861: full guideline" },
          { type: "reader", id: "GL861", sectionId: "gl861-iol-timing", gl: "GL861", label: "Timing by indication", sublabel: "GL861: timing table" },
          { type: "reader", id: "GL861", sectionId: "gl861-crb", gl: "GL861", label: "Cervical ripening balloon", sublabel: "GL861: mechanical method" },
          { type: "reader", id: "GL861", sectionId: "gl861-propess", gl: "GL861", label: "Propess / dinoprostone", sublabel: "GL861: prostaglandin method" },
        ],
      },
      {
        heading: "Pathways",
        entries: [
          { type: "flowchart", id: "GL861_IOL", gl: "GL861", label: "Induction of labour pathway", sublabel: "GL861 flowchart" },
          { type: "flowchart", id: "GL861_TIMING", gl: "GL861", label: "Timing by indication", sublabel: "GL861 flowchart" },
        ],
      },
      {
        heading: "Drugs",
        entries: [
          { type: "drug", id: "dinoprostone", gl: "GL861", label: "Dinoprostone (Propess)", sublabel: "Rx: prostaglandin ripening" },
          { type: "drug", id: "oxytocin", gl: "GL861", label: "Oxytocin", sublabel: "Rx: after ARM" },
        ],
      },
      {
        heading: "Counsel",
        entries: [
          { type: "consent", id: "IOL", gl: "GL861", label: "Induction of labour, counsel", sublabel: "Risks by method" },
        ],
      },
      {
        heading: "Evidence",
        entries: [
          { type: "trial", id: "trial-arrive", gl: "GL861", label: "ARRIVE", sublabel: "Elective induction at 39 weeks" },
          { type: "trial", id: "trial-big-baby", gl: "GL861", label: "Big Baby Trial", sublabel: "Induction at 38 weeks for suspected macrosomia" },
        ],
      },
      {
        heading: "Don't miss",
        entries: [
          { type: "reader", id: "GL861", sectionId: "gl861-unsuccessful", gl: "GL861", label: "Unsuccessful induction / declining IOL", sublabel: "GL861: escalation & documentation" },
        ],
      },
    ],
  },

  "ectopic": {
    id: "ectopic",
    title: "Ectopic pregnancy",
    subtitle: "Expectant, medical & surgical management",
    description: "A pregnancy outside the uterine cavity, usually tubal; MTX eligibility depends on BHCG level, mass size and haemodynamic stability (CG623).",
    gl: "CG623",
    terms: [
      "ectopic", "ectopic pregnancy", "tubal ectopic", "methotrexate pregnancy",
      "pul", "pregnancy of unknown location",
    ],
    sections: [
      {
        heading: "Guides",
        entries: [
          { type: "reader", id: "CG623", gl: "CG623", label: "Ectopic pregnancy: medical management (local)", sublabel: "CG623: full guideline" },
          { type: "reader", id: "CG623", sectionId: "ep-criteria", gl: "CG623", label: "MTX selection & exclusion criteria", sublabel: "CG623: eligibility for methotrexate" },
          { type: "reader", id: "CG623", sectionId: "ep-protocol", gl: "CG623", label: "MTX treatment protocol", sublabel: "CG623: dosing & surveillance schedule" },
        ],
      },
      {
        heading: "Pathways",
        entries: [
          { type: "flowchart", id: "CG623_MTX", gl: "CG623", label: "Ectopic pregnancy pathway", sublabel: "CG623 flowchart" },
        ],
      },
      {
        heading: "Calculators",
        entries: [
          { type: "calculator", id: "PUL", gl: "CG623", label: "PUL calculator", sublabel: "Pregnancy of unknown location" },
          { type: "calculator", id: "ECTOPIC_DECISION", gl: "CG623", label: "Tubal ectopic, initial management", sublabel: "Expectant / MTX / surgery" },
          { type: "calculator", id: "EXPECTANT_SURVEILLANCE", gl: "CG623", label: "Expectant management surveillance", sublabel: "Serial hCG days 2, 4, 7" },
          { type: "calculator", id: "MTX_SURVEILLANCE", gl: "CG623", label: "Post-methotrexate surveillance", sublabel: "Day 4 & day 7 hCG" },
        ],
      },
      {
        heading: "Drugs",
        entries: [
          { type: "drug", id: "methotrexate", gl: "CG623", label: "Methotrexate", sublabel: "Rx: dose, contraindications, monitoring" },
        ],
      },
      {
        heading: "Don't miss",
        entries: [
          { type: "reader", id: "CG623", sectionId: "ep-patientinfo", gl: "CG623", label: "Patient information for MTX", sublabel: "CG623: what to tell her before treatment" },
          { type: "consent", id: "ECTOPIC", gl: "CG623", label: "Ectopic pregnancy, counsel", sublabel: "Methotrexate / surgery / expectant: benefits, risks & alternatives" },
        ],
      },
    ],
  },

  "hyperemesis": {
    id: "hyperemesis",
    title: "Hyperemesis gravidarum",
    subtitle: "Nausea & vomiting of pregnancy",
    description: "NVP affects up to 90% of pregnancies; HG is the severe end of the spectrum (0.3–3.6%) and a leading cause of first-trimester admission (GTG69).",
    gl: "GTG69",
    terms: [
      "hg", "hyperemesis", "hyperemesis gravidarum", "nvp",
      "nausea and vomiting of pregnancy", "nausea vomiting pregnancy",
    ],
    sections: [
      {
        heading: "Guides",
        entries: [
          { type: "reader", id: "GTG69", gl: "GTG69", label: "Nausea & vomiting of pregnancy (RCOG)", sublabel: "GTG69: full guideline" },
          { type: "reader", id: "GTG69", sectionId: "gtg69-antiemetics", gl: "GTG69", label: "Antiemetic ladder", sublabel: "GTG69: stepwise drug choice" },
          { type: "reader", id: "GTG69", sectionId: "gtg69-fluids", gl: "GTG69", label: "IV fluids & thiamine", sublabel: "GTG69: fluid management, Wernicke's prevention" },
        ],
      },
      {
        heading: "Calculators",
        entries: [
          { type: "calculator", id: "PUQE", gl: "GTG69", label: "PUQE score", sublabel: "Severity of nausea & vomiting in pregnancy" },
        ],
      },
      {
        heading: "Drugs",
        entries: [
          { type: "drug", id: "cyclizine", gl: "GTG69", label: "Cyclizine", sublabel: "Rx: first-line antiemetic" },
          { type: "drug", id: "prochlorperazine", gl: "GTG69", label: "Prochlorperazine", sublabel: "Rx: first-line antiemetic" },
          { type: "drug", id: "ondansetron", gl: "GTG69", label: "Ondansetron", sublabel: "Rx: second-line antiemetic" },
          { type: "drug", id: "metoclopramide", gl: "GTG69", label: "Metoclopramide", sublabel: "Rx: second-line, prokinetic" },
        ],
      },
      {
        heading: "Don't miss",
        entries: [
          { type: "reader", id: "GTG69", sectionId: "gtg69-complications", gl: "GTG69", label: "Complications", sublabel: "GTG69: Wernicke's, refeeding, thromboprophylaxis" },
        ],
      },
    ],
  },

  "pprom": {
    id: "pprom",
    title: "PPROM & preterm labour",
    subtitle: "Preterm prelabour rupture of membranes",
    description: "Rupture of membranes before 37 weeks and before labour starts; management balances infection risk against the risks of prematurity (GL895, NG25).",
    gl: "GL895",
    terms: [
      "pprom", "preterm prom", "preterm rupture of membranes",
      "preterm labour", "preterm labor", "preterm birth",
    ],
    sections: [
      {
        heading: "Guides",
        entries: [
          { type: "reader", id: "GL895", gl: "GL895", label: "PPRoM (local guideline)", sublabel: "GL895: full guideline" },
          { type: "reader", id: "GL895", sectionId: "pprom-antibiotics", gl: "GL895", label: "Antibiotic selection", sublabel: "GL895: erythromycin regimen" },
          { type: "reader", id: "NG25", gl: "NG25", label: "Preterm labour & birth (NICE)", sublabel: "NG25: full guideline" },
          { type: "reader", id: "NG25", sectionId: "ng25-steroids", gl: "NG25", label: "Antenatal corticosteroids", sublabel: "NG25: fetal lung maturation" },
          { type: "reader", id: "NG25", sectionId: "ng25-mgso4", gl: "NG25", label: "Magnesium sulphate", sublabel: "NG25: fetal neuroprotection" },
          { type: "reader", id: "NG25", sectionId: "ng25-tocolysis", gl: "NG25", label: "Tocolysis", sublabel: "NG25: delaying birth" },
        ],
      },
      {
        heading: "Pathways",
        entries: [
          { type: "flowchart", id: "GL895_ROM_TRIAGE", gl: "GL895", label: "Rupture of membranes triage", sublabel: "GL895 flowchart" },
        ],
      },
      {
        heading: "Drugs",
        entries: [
          { type: "drug", id: "erythromycin", gl: "GL895", label: "Erythromycin", sublabel: "Rx: PPROM antibiotic" },
          { type: "drug", id: "betamethasone", gl: "NG25", label: "Betamethasone", sublabel: "Rx: antenatal corticosteroid" },
          { type: "drug", id: "atosiban", gl: "NG25", label: "Atosiban", sublabel: "Rx: tocolysis" },
          { type: "drug", id: "magnesium_sulphate", gl: "NG25", label: "Magnesium sulphate", sublabel: "Rx: fetal neuroprotection" },
        ],
      },
      {
        heading: "Counsel",
        entries: [
          { type: "consent", id: "ACS", gl: "NG25", label: "Antenatal corticosteroids, counsel", sublabel: "Benefits & harms by gestation band" },
        ],
      },
      {
        heading: "Evidence",
        entries: [
          { type: "trial", id: "trial-oracle", gl: "GL895", label: "ORACLE I & II", sublabel: "Antibiotics in PPROM & preterm labour" },
          { type: "trial", id: "trial-antenatal-steroids", gl: "NG25", label: "Antenatal corticosteroids", sublabel: "Fetal lung maturation trial" },
          { type: "trial", id: "trial-mgso4-neuroprotection", gl: "NG25", label: "MgSO4 neuroprotection", sublabel: "Magnesium sulfate before preterm birth" },
        ],
      },
      {
        heading: "Don't miss",
        entries: [
          { type: "reader", id: "GL895", sectionId: "pprom-outpatient", gl: "GL895", label: "Outpatient management", sublabel: "GL895: who can go home" },
        ],
      },
    ],
  },

  "hmb": {
    id: "hmb",
    title: "Heavy menstrual bleeding",
    subtitle: "Assessment & management",
    description: "A clinical diagnosis: her own assessment of the impact on quality of life matters more than measured blood loss (NG88).",
    gl: "NG88",
    terms: [
      "hmb", "heavy menstrual bleeding", "menorrhagia",
    ],
    sections: [
      {
        heading: "Guides",
        entries: [
          { type: "reader", id: "NG88", gl: "NG88", label: "Heavy menstrual bleeding (NICE)", sublabel: "NG88: full guideline" },
          { type: "reader", id: "NG88", sectionId: "ng88-pharmacological", gl: "NG88", label: "Pharmacological management", sublabel: "NG88: medical treatment ladder" },
          { type: "reader", id: "NG88", sectionId: "ng88-surgical", gl: "NG88", label: "Surgical management", sublabel: "NG88: when medical treatment isn't enough" },
          { type: "reader", id: "NG88", sectionId: "ng88-fibroids", gl: "NG88", label: "Fibroids", sublabel: "NG88: fibroid-specific management" },
        ],
      },
      {
        heading: "Pathways",
        entries: [
          { type: "flowchart", id: "NG88_ED_ACUTE", gl: "NG88", label: "Acute HMB in ED", sublabel: "NG88 flowchart" },
          { type: "flowchart", id: "NG88_ASSESSMENT", gl: "NG88", label: "Assessment pathway", sublabel: "NG88 flowchart" },
          { type: "flowchart", id: "NG88_TREATMENT", gl: "NG88", label: "Treatment pathway", sublabel: "NG88 flowchart" },
          { type: "flowchart", id: "NG88_SURGICAL", gl: "NG88", label: "Surgical pathway", sublabel: "NG88 flowchart" },
        ],
      },
      {
        heading: "Drugs",
        entries: [
          { type: "drug", id: "tranexamic_acid", gl: "NG88", label: "Tranexamic acid", sublabel: "Rx: non-hormonal first-line" },
          { type: "drug", id: "lng_ius", gl: "NG88", label: "LNG-IUS (Mirena)", sublabel: "Rx: first-line if no structural/histological abnormality" },
        ],
      },
      {
        heading: "Evidence",
        entries: [
          { type: "trial", id: "trial-eclipse", gl: "NG88", label: "ECLIPSE", sublabel: "LNG-IUS vs medical therapy for HMB" },
        ],
      },
      {
        heading: "Don't miss",
        entries: [
          { type: "reader", id: "NG88", sectionId: "ng88-referral", gl: "NG88", label: "Referral criteria", sublabel: "NG88: red flags & when to refer" },
        ],
      },
    ],
  },

  "maternal-collapse": {
    id: "maternal-collapse",
    title: "Maternal collapse & cardiac arrest",
    subtitle: "ABCDE, aortocaval compression, perimortem caesarean",
    description: "An acute cardiorespiratory or CNS event causing reduced or absent consciousness, at any stage of pregnancy up to 6 weeks postpartum; from 20 weeks it can progress to cardiac arrest unless aortocaval compression is relieved (GTG56).",
    gl: "GTG56",
    terms: [
      "maternal collapse", "cardiac arrest", "obstetric cardiac arrest",
      "cardiac arrest pregnancy", "collapse in pregnancy", "cpr pregnancy",
      "pmcs", "perimortem caesarean", "perimortem caesarean section",
      "emergency hysterotomy", "resuscitative hysterotomy",
    ],
    sections: [
      {
        heading: "Guides",
        entries: [
          { type: "reader", id: "GTG56", gl: "GTG56", label: "Maternal collapse (RCOG)", sublabel: "GTG56: full guideline" },
          { type: "reader", id: "GTG56", sectionId: "collapse-resuscitation", gl: "GTG56", label: "Initial resuscitation (ABCDE)", sublabel: "GTG56: aortocaval relief, airway, drugs" },
          { type: "reader", id: "GTG56", sectionId: "collapse-pmcs", gl: "GTG56", label: "Perimortem caesarean section", sublabel: "GTG56: the 4-minute / 5-minute rule" },
          { type: "reader", id: "GTG56", sectionId: "collapse-cause-specific", gl: "GTG56", label: "Cause-specific management", sublabel: "GTG56: AFE, sepsis, LA and Mg toxicity, anaphylaxis" },
        ],
      },
      {
        heading: "Pathways",
        entries: [
          { type: "flowchart", id: "MATERNAL_COLLAPSE_ARREST", gl: "GTG56", label: "Obstetric cardiac arrest", sublabel: "GTG56 flowchart, step through the algorithm" },
        ],
      },
      {
        heading: "Drugs",
        entries: [
          { type: "drug", id: "adrenaline", gl: "GTG56", label: "Adrenaline", sublabel: "Rx: cardiac arrest & anaphylaxis doses" },
          { type: "drug", id: "amiodarone", gl: "GTG56", label: "Amiodarone", sublabel: "Rx: shockable rhythm" },
          { type: "drug", id: "atropine", gl: "GTG56", label: "Atropine", sublabel: "Rx: vagal-mediated arrest" },
          { type: "drug", id: "calcium_gluconate", gl: "GTG56", label: "Calcium gluconate", sublabel: "Rx: magnesium toxicity antidote" },
          { type: "drug", id: "intralipid", gl: "GTG56", label: "Intralipid 20%", sublabel: "Rx: local anaesthetic toxicity" },
          { type: "drug", id: "tranexamic_acid", gl: "GTG56", label: "Tranexamic acid", sublabel: "Rx: if haemorrhage is the cause" },
          { type: "drug", id: "magnesium_sulphate", gl: "GTG56", label: "Magnesium sulphate", sublabel: "Rx: eclampsia dose during arrest" },
        ],
      },
      {
        heading: "Evidence",
        entries: [
          { type: "trial", id: "trial-woman", gl: "GTG56", label: "WOMAN", sublabel: "Tranexamic acid reduces PPH mortality" },
        ],
      },
      {
        heading: "Don't miss",
        entries: [
          { type: "reader", id: "GTG56", sectionId: "collapse-team-governance", gl: "GTG56", label: "Team, documentation & MBRRACE-UK reporting", sublabel: "GTG56: who to call, what to record" },
          { type: "reader", id: "GTG56", sectionId: "collapse-physiology", gl: "GTG56", label: "Why resuscitation differs in pregnancy", sublabel: "GTG56: aortocaval compression, airway, aspiration risk" },
        ],
      },
    ],
  },

  "pelvic-organ-prolapse": {
    id: "pelvic-organ-prolapse",
    title: "Pelvic organ prolapse",
    subtitle: "POP-Q staging, pessaries & surgical options",
    description: "Descent of one or more of the anterior vaginal wall, posterior vaginal wall, uterus or vaginal vault; graded by POP-Q staging (0 to 4) relative to the hymen, and managed conservatively (pelvic floor muscle training, pessary) or surgically (NICE NG123).",
    gl: "NG123",
    terms: [
      "pop-q", "popq", "pop q", "prolapse staging", "pelvic organ prolapse",
      "vaginal prolapse", "uterine prolapse", "vault prolapse", "cystocele",
      "rectocele", "vaginal pessary", "pessary",
    ],
    sections: [
      {
        heading: "Guides",
        entries: [
          { type: "reader", id: "NG123", gl: "NG123", label: "Urinary incontinence & pelvic organ prolapse (NICE)", sublabel: "NG123: full guideline" },
          { type: "reader", id: "NG123", sectionId: "ng123-assessment", gl: "NG123", label: "Assessment & POP-Q classification", sublabel: "NG123: staging & examination" },
          { type: "reader", id: "NG123", sectionId: "ng123-pop-conservative", gl: "NG123", label: "Prolapse: conservative management", sublabel: "NG123: PFMT & pessaries" },
          { type: "reader", id: "NG123", sectionId: "ng123-pop-surgical", gl: "NG123", label: "Prolapse: surgical management", sublabel: "NG123: procedures & mesh" },
        ],
      },
      {
        heading: "Pathways",
        entries: [
          { type: "flowchart", id: "NG123_UI_POP_PATHWAY", gl: "NG123", label: "New incontinence / prolapse symptoms", sublabel: "NG123 flowchart, assessment & first-line management" },
        ],
      },
    ],
  },

  "sickle-cell-pregnancy": {
    id: "sickle-cell-pregnancy",
    title: "Sickle cell disease in pregnancy",
    subtitle: "Preconception, antenatal, crisis & delivery",
    description: "A high-risk pregnancy with more frequent painful crises and higher rates of pre-eclampsia, growth restriction, VTE and stillbirth; care is shared between haematology and obstetrics (BSH 2021, which supersedes RCOG GTG61).",
    gl: "BSH_SCD",
    terms: [
      "sickle cell", "sickle cell disease", "sickle cell pregnancy", "scd",
      "scd pregnancy", "hbss", "sickle cell crisis", "vaso-occlusive crisis",
      "acute chest syndrome", "gtg61",
    ],
    sections: [
      {
        heading: "Guides",
        entries: [
          { type: "reader", id: "BSH_SCD", gl: "BSH_SCD", label: "Sickle cell disease in pregnancy (BSH)", sublabel: "BSH 2021: full guideline" },
          { type: "reader", id: "BSH_SCD", sectionId: "bsh-scd-preconception", gl: "BSH_SCD", label: "Preconception care & medication review", sublabel: "BSH: folic acid, penicillin, stop hydroxycarbamide" },
          { type: "reader", id: "BSH_SCD", sectionId: "bsh-scd-antenatal", gl: "BSH_SCD", label: "Antenatal care & monitoring", sublabel: "BSH: aspirin, LMWH, 4-weekly growth scans" },
          { type: "reader", id: "BSH_SCD", sectionId: "bsh-scd-crisis", gl: "BSH_SCD", label: "Acute painful (vaso-occlusive) crisis", sublabel: "BSH: analgesia, avoid pethidine" },
          { type: "reader", id: "BSH_SCD", sectionId: "bsh-scd-intrapartum", gl: "BSH_SCD", label: "Intrapartum care", sublabel: "BSH: delivery 38-40 weeks" },
        ],
      },
      {
        heading: "Pathways",
        entries: [
          { type: "flowchart", id: "SCD_CRISIS", gl: "BSH_SCD", label: "Sickle cell painful crisis", sublabel: "BSH 2021 flowchart, step through the algorithm" },
        ],
      },
    ],
  },

  "fibroids": {
    id: "fibroids",
    title: "Uterine fibroids",
    subtitle: "Medical, interventional & surgical options",
    description: "Benign smooth-muscle tumours of the uterus, a common cause of heavy menstrual bleeding and bulk (pressure) symptoms; management depends on symptoms, cavity distortion and fertility plans (NICE NG88).",
    gl: "NG88",
    terms: [
      "fibroid", "fibroids", "uterine fibroid", "uterine fibroids", "leiomyoma",
      "leiomyomata", "myoma", "submucosal fibroid", "intramural fibroid",
    ],
    sections: [
      {
        heading: "Guides",
        entries: [
          { type: "reader", id: "NG88", sectionId: "ng88-fibroids", gl: "NG88", label: "HMB with uterine fibroids", sublabel: "NG88: fibroid-specific management" },
          { type: "reader", id: "NG88", sectionId: "ng88-pharmacological", gl: "NG88", label: "Pharmacological treatment", sublabel: "NG88: TXA, GnRH agonists & antagonists, ulipristal" },
          { type: "reader", id: "NG88", sectionId: "ng88-surgical", gl: "NG88", label: "Surgical & interventional treatment", sublabel: "NG88: ablation, UAE, myomectomy, hysterectomy" },
        ],
      },
      {
        heading: "Pathways",
        entries: [
          { type: "flowchart", id: "NG88_FIBROID", gl: "NG88", label: "HMB with fibroids", sublabel: "NG88 flowchart, step through the options" },
        ],
      },
      {
        heading: "Drugs",
        entries: [
          { type: "drug", id: "tranexamic_acid", gl: "NG88", label: "Tranexamic acid", sublabel: "Rx: non-hormonal, oral HMB dose" },
          { type: "drug", id: "goserelin", gl: "NG88", label: "Goserelin (GnRH agonist)", sublabel: "Rx: pre-operative fibroid shrinkage" },
        ],
      },
    ],
  },

  "endometrial-cancer": {
    id: "endometrial-cancer",
    title: "Endometrial (uterine) cancer",
    subtitle: "Diagnosis, molecular classification & management",
    description: "The most common gynaecological cancer in the UK, usually presenting with postmenopausal bleeding; managed by a specialist gynae-oncology MDT with surgery, molecular classification and risk-adapted adjuvant therapy (BGCS 2022).",
    gl: "BGCS_EC",
    terms: [
      "endometrial cancer", "uterine cancer", "womb cancer", "endometrial carcinoma",
      "endometrial adenocarcinoma", "uterine carcinoma",
    ],
    sections: [
      {
        heading: "Guides",
        entries: [
          { type: "reader", id: "BGCS_EC", sectionId: "bgcs-ec-diagnosis", gl: "BGCS_EC", label: "Presentation & diagnosis", sublabel: "BGCS: PMB, TVUSS 4 mm, Lynch testing" },
          { type: "reader", id: "BGCS_EC", sectionId: "bgcs-ec-classification", gl: "BGCS_EC", label: "Histological & molecular classification", sublabel: "BGCS: TCGA POLE/MMRd/p53abn/NSMP" },
          { type: "reader", id: "BGCS_EC", sectionId: "bgcs-ec-surgery", gl: "BGCS_EC", label: "Surgery & staging", sublabel: "BGCS: TH+BSO, sentinel node" },
          { type: "reader", id: "BGCS_EC", sectionId: "bgcs-ec-adjuvant", gl: "BGCS_EC", label: "Adjuvant treatment", sublabel: "BGCS: brachytherapy, EBRT, chemo" },
          { type: "reader", id: "BGCS_EC", sectionId: "bgcs-ec-fertility", gl: "BGCS_EC", label: "Fertility-sparing management", sublabel: "BGCS: progestin, LNG-IUS" },
        ],
      },
      {
        heading: "Don't miss",
        entries: [
          { type: "reader", id: "GTG67", sectionId: "gtg67-diagnosis", gl: "GTG67", label: "Postmenopausal bleeding pathway", sublabel: "GTG67: how EC is investigated" },
          { type: "reader", id: "GTG67", gl: "GTG67", label: "Endometrial hyperplasia", sublabel: "GTG67: the precursor lesion" },
        ],
      },
    ],
  },

  "postmenopausal-bleeding": {
    id: "postmenopausal-bleeding",
    title: "Postmenopausal bleeding",
    subtitle: "2WW pathway: image, sample, triage",
    description: "Any vaginal bleeding 12 months or more after the last period; treat as suspected endometrial cancer until proven otherwise, with urgent 2-week-wait referral and transvaginal ultrasound to guide sampling (RCOG/BSGE GTG67).",
    gl: "GTG67",
    terms: [
      "postmenopausal bleeding", "post menopausal bleeding", "pmb",
      "bleeding after menopause", "endometrial thickness", "post-menopausal bleeding",
    ],
    sections: [
      {
        heading: "Guides",
        entries: [
          { type: "reader", id: "GTG67", sectionId: "gtg67-diagnosis", gl: "GTG67", label: "Diagnosis & investigation", sublabel: "GTG67: 2WW, TVUSS 4 mm, pipelle, hysteroscopy" },
          { type: "reader", id: "GTG67", gl: "GTG67", label: "Endometrial hyperplasia (RCOG/BSGE)", sublabel: "GTG67: full guideline" },
          { type: "reader", id: "GTG67", sectionId: "gtg67-lynch-tamoxifen", gl: "GTG67", label: "Lynch syndrome & tamoxifen", sublabel: "GTG67: special situations" },
          { type: "reader", id: "BGCS_EC", sectionId: "bgcs-ec-diagnosis", gl: "BGCS_EC", label: "Endometrial cancer (BGCS)", sublabel: "BGCS 2022: if cancer is confirmed" },
        ],
      },
      {
        heading: "Pathways",
        entries: [
          { type: "flowchart", id: "GTG67_PMB", gl: "GTG67", label: "Postmenopausal bleeding: triage", sublabel: "GTG67 flowchart, image then sample" },
          { type: "flowchart", id: "GTG67_MANAGEMENT", gl: "GTG67", label: "Endometrial hyperplasia: management", sublabel: "GTG67 flowchart" },
        ],
      },
    ],
  },

  "cervical-screening": {
    id: "cervical-screening",
    title: "Cervical screening & colposcopy",
    subtitle: "HPV primary screening, abnormal results & colposcopy referral",
    description: "England screens with high-risk HPV as the primary test, with reflex cytology on HPV-positive samples deciding routine recall, early repeat or colposcopy referral; colposcopy assesses and grades CIN and guides treatment (NHSCSP 2020, updated 2025).",
    gl: "NHSCSP20",
    terms: [
      "abnormal smear", "abnormal smear result", "abnormal cervical screening",
      "abnormal cervical screening result", "smear result", "colposcopy referral",
      "hpv positive", "high risk hpv", "hrhpv", "cin", "cervical screening",
      "smear test", "cervical smear",
    ],
    sections: [
      {
        heading: "Guides",
        entries: [
          { type: "reader", id: "NHSCSP20", gl: "NHSCSP20", label: "Cervical screening & colposcopy (NHSCSP)", sublabel: "NHSCSP20: full guideline" },
          { type: "reader", id: "NHSCSP20", sectionId: "nhscsp20-pathway", gl: "NHSCSP20", label: "HPV primary screening pathway", sublabel: "NHSCSP20: what each result means" },
          { type: "reader", id: "NHSCSP20", sectionId: "nhscsp20-colposcopy", gl: "NHSCSP20", label: "Colposcopy: referral & assessment", sublabel: "NHSCSP20: who to refer & when" },
          { type: "reader", id: "NHSCSP20", sectionId: "nhscsp20-cin", gl: "NHSCSP20", label: "CIN grading & management", sublabel: "NHSCSP20: CIN1/2/3" },
          { type: "reader", id: "NHSCSP20", sectionId: "nhscsp20-toc", gl: "NHSCSP20", label: "Test of cure & follow-up", sublabel: "NHSCSP20: post-treatment surveillance" },
        ],
      },
      {
        heading: "Pathways",
        entries: [
          { type: "flowchart", id: "NHSCSP20_SCREENING", gl: "NHSCSP20", label: "HPV primary screening pathway", sublabel: "NHSCSP20 flowchart, step through the result" },
          { type: "flowchart", id: "NHSCSP20_COLPOSCOPY", gl: "NHSCSP20", label: "Colposcopy referral & assessment", sublabel: "NHSCSP20 flowchart" },
          { type: "flowchart", id: "NHSCSP20_TOC", gl: "NHSCSP20", label: "Test of cure pathway", sublabel: "NHSCSP20 flowchart" },
        ],
      },
    ],
  },

  "cord-prolapse": {
    id: "cord-prolapse",
    title: "Cord prolapse",
    subtitle: "Obstetric emergency: relieve pressure, expedite birth",
    description: "Descent of the umbilical cord through the cervix alongside (occult) or past (overt) the presenting part after membrane rupture; cord compression and vasospasm threaten the fetus, so it is an obstetric emergency requiring immediate delivery (GTG50).",
    gl: "GTG50",
    terms: [
      "cord prolapse", "umbilical cord prolapse", "prolapsed cord",
      "cord presentation", "cord prolapse emergency", "overt cord prolapse",
      "occult cord prolapse",
    ],
    sections: [
      {
        heading: "Pathways",
        entries: [
          { type: "flowchart", id: "GTG50_CORD", gl: "GTG50", label: "Cord prolapse: emergency pathway", sublabel: "GTG50 flowchart, step through the algorithm" },
        ],
      },
    ],
  },

  "diabetes-in-pregnancy": {
    id: "diabetes-in-pregnancy",
    title: "Diabetes in pregnancy",
    subtitle: "Pre-existing, GDM, VRII & DKA",
    description: "Type 1, type 2 and gestational diabetes all raise the risk of macrosomia, stillbirth and neonatal hypoglycaemia; management centres on glucose targets, insulin titration and DKA vigilance (GL983).",
    gl: "GL983",
    terms: [
      "diabetes", "diabetes in pregnancy", "gdm", "gestational diabetes",
      "type 1 diabetes", "type 2 diabetes", "vrii", "sliding scale",
      "dka", "diabetic ketoacidosis", "insulin pregnancy",
    ],
    sections: [
      {
        heading: "Guides",
        entries: [
          { type: "reader", id: "GL983", gl: "GL983", label: "Diabetes in pregnancy (local guideline)", sublabel: "GL983: full guideline" },
          { type: "reader", id: "GL983", sectionId: "dm-gdm", gl: "GL983", label: "GDM: screening, diagnosis & management", sublabel: "GL983: gestational diabetes" },
          { type: "reader", id: "GL983", sectionId: "dm-vrii", gl: "GL983", label: "Variable rate insulin infusion (VRII)", sublabel: "GL983: full algorithm table" },
          { type: "reader", id: "GL983", sectionId: "dm-dka", gl: "GL983", label: "Diabetic ketoacidosis (DKA)", sublabel: "GL983: diagnosis & treatment" },
        ],
      },
      {
        heading: "Pathways",
        entries: [
          { type: "flowchart", id: "GL983_DKA", gl: "GL983", label: "DKA in pregnancy", sublabel: "GL983 flowchart" },
        ],
      },
      {
        heading: "Drugs",
        entries: [
          { type: "drug", id: "insulin_vrii", gl: "GL983", label: "Insulin (VRII)", sublabel: "Rx: variable rate infusion" },
          { type: "drug", id: "metformin", gl: "GL983", label: "Metformin", sublabel: "Rx: dose & pregnancy management" },
        ],
      },
      {
        heading: "Don't miss",
        entries: [
          { type: "reader", id: "GL983", sectionId: "dm-steroid", gl: "GL983", label: "Steroid prophylaxis and hyperglycaemia", sublabel: "GL983: insulin adjustment & DKA risk after steroids" },
        ],
      },
    ],
  },

  "anaemia-in-pregnancy": {
    id: "anaemia-in-pregnancy",
    title: "Anaemia in pregnancy",
    subtitle: "Iron deficiency: diagnosis & treatment",
    description: "Haemoglobin below 110 g/L in the first trimester or 105 g/L thereafter defines anaemia in pregnancy; treatment escalates from oral iron to IV iron to transfusion depending on severity and response (GL783).",
    gl: "GL783",
    terms: [
      "anaemia", "anemia", "ida", "iron deficiency", "iron deficiency anaemia",
      "low haemoglobin", "low hb", "ferinject", "iv iron",
    ],
    sections: [
      {
        heading: "Guides",
        entries: [
          { type: "reader", id: "GL783", gl: "GL783", label: "Iron deficiency anaemia (local guideline)", sublabel: "GL783: full guideline" },
          { type: "reader", id: "GL783", sectionId: "ida-diagnosis", gl: "GL783", label: "Diagnostic thresholds & monitoring", sublabel: "GL783: Hb, ferritin, MCV/MCH thresholds" },
          { type: "reader", id: "GL783", sectionId: "ida-screening", gl: "GL783", label: "Who to screen with ferritin at booking", sublabel: "GL783: at-risk groups" },
        ],
      },
      {
        heading: "Drugs",
        entries: [
          { type: "drug", id: "oral_iron", gl: "GL783", label: "Oral iron", sublabel: "Rx: ferrous fumarate, sulphate, gluconate" },
          { type: "drug", id: "ferric_carboxymaltose", gl: "GL783", label: "Ferric carboxymaltose (Ferinject)", sublabel: "Rx: IV iron, Ganzoni dose calculation" },
        ],
      },
      {
        heading: "Don't miss",
        entries: [
          { type: "reader", id: "GL783", sectionId: "ida-diagnosis", gl: "GL783", label: "Thalassaemia / sickle cell: never give routine iron", sublabel: "GL783: refer to haematology instead" },
        ],
      },
    ],
  },

  "perinatal-mental-health": {
    id: "perinatal-mental-health",
    title: "Perinatal mental health",
    subtitle: "Screening, EPDS & medication in pregnancy",
    description: "Perinatal mental illness affects 10-20% of women antenatally or in the first postnatal year; suicide is the leading cause of direct maternal death in the first postnatal year, so screening and continuity of specialist care matter (CG192).",
    gl: "CG192",
    terms: [
      "perinatal mental health", "postnatal depression", "antenatal depression",
      "epds", "postpartum psychosis", "antidepressants pregnancy",
      "ssri pregnancy", "mental health pregnancy",
    ],
    sections: [
      {
        heading: "Guides",
        entries: [
          { type: "reader", id: "CG192", gl: "CG192", label: "Perinatal mental health (NICE)", sublabel: "CG192: full guideline" },
          { type: "reader", id: "CG192", sectionId: "cg192-overview", gl: "CG192", label: "Overview & risk identification", sublabel: "CG192: screening & risk factors" },
          { type: "reader", id: "CG192", sectionId: "cg192-epds", gl: "CG192", label: "EPDS scoring", sublabel: "CG192: Edinburgh Postnatal Depression Scale" },
          { type: "reader", id: "CG192", sectionId: "cg192-medications", gl: "CG192", label: "Medications in pregnancy & breastfeeding", sublabel: "CG192: SSRIs, mood stabilisers, antipsychotics" },
        ],
      },
      {
        heading: "Drugs",
        entries: [
          { type: "drug", id: "sertraline", gl: "CG192", label: "Sertraline", sublabel: "Rx: first-line SSRI" },
          { type: "drug", id: "fluoxetine", gl: "CG192", label: "Fluoxetine", sublabel: "Rx: second-choice SSRI" },
          { type: "drug", id: "lithium", gl: "CG192", label: "Lithium", sublabel: "Rx: mood stabiliser, specialist-guided" },
        ],
      },
      {
        heading: "Don't miss",
        entries: [
          { type: "reader", id: "CG192", sectionId: "cg192-medications", gl: "CG192", label: "Sodium valproate is contraindicated", sublabel: "CG192: MHRA Pregnancy Prevention Programme" },
          { type: "reader", id: "CG192", sectionId: "cg192-postnatal", gl: "CG192", label: "Postnatal care & future pregnancy planning", sublabel: "CG192: relapse prevention" },
        ],
      },
    ],
  },
};

const normalise = (q) =>
  (q ?? "")
    .toLowerCase()
    .replace(/[?!.,;:]/g, "")
    .replace(/\s+/g, " ")
    .trim();

// Exact match of the normalised query against a topic's terms. Deliberately
// strict for now: the card should feel curated, not fuzzy.
export function topicForQuery(query) {
  const q = normalise(query);
  if (!q) return null;
  return Object.values(TOPICS).find(t => t.terms.includes(q)) ?? null;
}
