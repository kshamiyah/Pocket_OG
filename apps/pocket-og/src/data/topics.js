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
        heading: "Consent",
        entries: [
          { type: "consent", id: "IOL", gl: "GL861", label: "Induction of labour, consent", sublabel: "Risks by method" },
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
        heading: "Consent",
        entries: [
          { type: "consent", id: "ACS", gl: "NG25", label: "Antenatal corticosteroids, consent", sublabel: "Benefits & harms by gestation band" },
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
