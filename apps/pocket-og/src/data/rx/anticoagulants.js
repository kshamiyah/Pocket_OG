// Aspirin and low molecular weight heparins, checked against national
// guidance (7 Oct 2026): NICE NG133 (aspirin for pre-eclampsia prevention),
// RCOG Green-top Guideline 37a (reducing the risk of VTE, 2015; table 3 for
// prophylactic doses) and 37b (acute management of VTE, 2015; tables 1a to 1c
// for treatment doses).

const GTG37A = { label: "RCOG GTG37a", href: "/guidelines/gtg-37a.pdf" };
const GTG37B = { label: "RCOG GTG37b", href: "/guidelines/gtg-37b.pdf" };

// Shared by all three LMWHs.
const LMWH_CAUTIONS = [
  "Labour or vaginal bleeding: no further injections; reassess on admission (RCOG GTG37a, GTG37b)",
  "Prophylactic dose: avoid regional techniques if possible until at least 12 hr after the last dose (RCOG GTG37a)",
  "Treatment dose: no regional technique until at least 24 hr after the last dose; stop 24 hr before planned birth (RCOG GTG37b)",
  "No LMWH for 4 hr after spinal anaesthesia or after the epidural catheter is removed; do not remove the catheter within 12 hr of the last injection (RCOG GTG37a)",
  "Elective caesarean on antenatal prophylaxis: give the prophylactic dose the day before, omit any morning dose on the day (RCOG GTG37a)",
  "Platelet count: monitor only if previously exposed to unfractionated heparin (RCOG GTG37a); not routinely during treatment (RCOG GTG37b)",
  "Reduce the dose if creatinine clearance is under 30 mL/min for enoxaparin and dalteparin, or under 20 mL/min for tinzaparin (RCOG GTG37a)",
];

const LMWH_CONTRAINDICATIONS = [
  "Active major haemorrhage",
  "Heparin-induced thrombocytopenia (HIT)",
];

const LMWH_SAFETY = "LMWHs are the agents of choice for antenatal and postnatal thromboprophylaxis (RCOG GTG37a). There is evidence that they do not cross the placenta (RCOG GTG37b), and they are safe in breastfeeding (RCOG GTG37a).";

const PROPHYLAXIS_NOTE = "Dose by booking or most recent weight. No anti-Xa monitoring is needed for prophylaxis (RCOG GTG37a).";

const TREATMENT_NOTE = "Dose by booking or early pregnancy weight. Routine peak anti-Xa measurement is not recommended, except under 50 kg or 90 kg and over, or with other complicating factors such as renal impairment or recurrent VTE (RCOG GTG37b).";

export const ANTICOAGULANTS = [
  {
    id: "aspirin_prophylaxis",
    name: "Aspirin",
    class: "Antiplatelet: pre-eclampsia prophylaxis",
    color: "fuchsia",
    routes: [
      {
        type: "oral",
        shortLabel: "Oral: pre-eclampsia prophylaxis",
        label: "Oral: pre-eclampsia prophylaxis",
        dose: "75–150 mg",
        frequency: "once daily from 12 weeks until the birth of the baby",
        maxDose: "150 mg/day",
        notes: "For women at high risk of pre-eclampsia (any one of: hypertensive disease in a previous pregnancy, chronic kidney disease, autoimmune disease such as SLE or antiphospholipid syndrome, type 1 or type 2 diabetes, chronic hypertension), or with more than 1 moderate risk factor (nulliparity, age 40 or older, pregnancy interval over 10 years, BMI 35 or more at first visit, family history of pre-eclampsia, multi-fetal pregnancy) (NICE NG133 1.1.2, 1.1.3).",
      },
    ],
    contraindications: [
      "Active peptic ulcer disease",
      "Bleeding disorders",
      "Aspirin or NSAID hypersensitivity",
    ],
    cautions: [
      "Do not use low molecular weight heparin to prevent hypertensive disorders of pregnancy (NICE NG133 1.1.4)",
    ],
    pregnancySafety: "Taken from 12 weeks until the birth of the baby (NICE NG133 1.1.2, 1.1.3).",
    sources: [
      { label: "BNF", href: "https://bnf.nice.org.uk/drugs/aspirin/" },
      { label: "NICE NG133", href: "https://www.nice.org.uk/guidance/ng133" },
    ],
  },
  {
    id: "enoxaparin",
    name: "Enoxaparin",
    class: "Low molecular weight heparin (Clexane®)",
    color: "fuchsia",
    routes: [
      {
        type: "sc",
        shortLabel: "SC: VTE prophylaxis",
        label: "Subcutaneous: VTE prophylaxis",
        dose: "<50 kg: 20 mg; 50–90 kg: 40 mg; 91–130 kg: 60 mg; 131–170 kg: 80 mg; >170 kg: 0.6 mg/kg/day",
        frequency: "once daily (91 kg and over may be given in 2 divided doses)",
        maxDose: "High prophylactic dose (50–90 kg): 40 mg 12-hourly",
        notes: `${PROPHYLAXIS_NOTE} Doses from RCOG GTG37a table 3.`,
      },
      {
        type: "sc",
        shortLabel: "SC: VTE treatment",
        label: "Subcutaneous: VTE treatment (confirmed DVT/PE)",
        dose: "<50 kg: 40 mg BD or 60 mg OD; 50–69 kg: 60 mg BD or 90 mg OD; 70–89 kg: 80 mg BD or 120 mg OD; 90–109 kg: 100 mg BD or 150 mg OD; 110–125 kg: 120 mg BD or 180 mg OD",
        frequency: "twice daily or once daily",
        maxDose: ">125 kg: discuss with haematologist",
        notes: `${TREATMENT_NOTE} Doses from RCOG GTG37b table 1a.`,
      },
    ],
    contraindications: [
      ...LMWH_CONTRAINDICATIONS,
      "Severe thrombocytopenia (platelets <50 × 10⁹/L)",
    ],
    cautions: LMWH_CAUTIONS,
    pregnancySafety: LMWH_SAFETY,
    sources: [
      { label: "BNF", href: "https://bnf.nice.org.uk/drugs/enoxaparin-sodium/" },
      GTG37A,
      GTG37B,
    ],
  },
  {
    id: "dalteparin",
    name: "Dalteparin",
    class: "Low molecular weight heparin (Fragmin®)",
    color: "fuchsia",
    routes: [
      {
        type: "sc",
        shortLabel: "SC: VTE prophylaxis",
        label: "Subcutaneous: VTE prophylaxis",
        dose: "<50 kg: 2500 units; 50–90 kg: 5000 units; 91–130 kg: 7500 units; 131–170 kg: 10 000 units; >170 kg: 75 units/kg/day",
        frequency: "once daily",
        maxDose: "High prophylactic dose (50–90 kg): 5000 units 12-hourly",
        notes: `${PROPHYLAXIS_NOTE} Doses from RCOG GTG37a table 3.`,
      },
      {
        type: "sc",
        shortLabel: "SC: VTE treatment",
        label: "Subcutaneous: VTE treatment (confirmed DVT/PE)",
        dose: "<50 kg: 5000 units BD or 10 000 units OD; 50–69 kg: 6000 units BD or 12 000 units OD; 70–89 kg: 8000 units BD or 16 000 units OD; 90–109 kg: 10 000 units BD or 20 000 units OD; 110–125 kg: 12 000 units BD or 24 000 units OD",
        frequency: "twice daily or once daily",
        maxDose: ">125 kg: discuss with haematologist",
        notes: `${TREATMENT_NOTE} Doses from RCOG GTG37b table 1b.`,
      },
    ],
    contraindications: LMWH_CONTRAINDICATIONS,
    cautions: LMWH_CAUTIONS,
    pregnancySafety: LMWH_SAFETY,
    sources: [
      { label: "BNF", href: "https://bnf.nice.org.uk/drugs/dalteparin-sodium/" },
      GTG37A,
      GTG37B,
    ],
  },
  {
    id: "tinzaparin",
    name: "Tinzaparin",
    class: "Low molecular weight heparin (Innohep®)",
    color: "fuchsia",
    routes: [
      {
        type: "sc",
        shortLabel: "SC: VTE prophylaxis",
        label: "Subcutaneous: VTE prophylaxis",
        dose: "<50 kg: 3500 units; 50–90 kg: 4500 units; 91–130 kg: 7000 units; 131–170 kg: 9000 units; >170 kg: 75 units/kg/day",
        frequency: "once daily (91 kg and over may be given in 2 divided doses)",
        maxDose: "High prophylactic dose (50–90 kg): 4500 units 12-hourly",
        notes: `${PROPHYLAXIS_NOTE} Doses from RCOG GTG37a table 3.`,
      },
      {
        type: "sc",
        shortLabel: "SC: VTE treatment",
        label: "Subcutaneous: VTE treatment (confirmed DVT/PE)",
        dose: "175 units/kg",
        frequency: "once daily",
        notes: `${TREATMENT_NOTE} Dose from RCOG GTG37b table 1c.`,
      },
    ],
    contraindications: LMWH_CONTRAINDICATIONS,
    cautions: LMWH_CAUTIONS,
    pregnancySafety: LMWH_SAFETY,
    sources: [
      { label: "BNF", href: "https://bnf.nice.org.uk/drugs/tinzaparin-sodium/" },
      GTG37A,
      GTG37B,
    ],
  },
];
