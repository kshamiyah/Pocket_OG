export const RESUSCITATION_DRUGS = [
  {
    id: "adrenaline",
    name: "Adrenaline",
    class: "Sympathomimetic — cardiac arrest & anaphylaxis",
    color: "red",
    routes: [
      {
        type: "iv",
        shortLabel: "IV — cardiac arrest",
        label: "IV — obstetric cardiac arrest",
        dose: "1 mg",
        frequency: "every 3–5 minutes in a non-shockable rhythm, or after the 3rd shock in a shockable rhythm",
        notes: "GTG56 / OAA Maternal Cardiac Arrest QRH: no change to standard Resuscitation Council (UK) algorithm doses in pregnancy.",
      },
      {
        type: "im",
        shortLabel: "IM — anaphylaxis",
        label: "IM — anaphylaxis",
        dose: "500 micrograms (0.5 mL of 1:1000)",
        frequency: "repeat after 5 minutes if no effect",
        notes: "This dose is for intramuscular use only. In experienced hands, a 50 microgram IV bolus (0.5 mL of 1:10,000) can be titrated instead.",
      },
    ],
    cautions: [
      "IV and IM concentrations and doses are different — do not confuse 1:1000 (IM) with 1:10,000 (IV)",
      "In anaphylaxis, give adjuvant chlorphenamine 10 mg and hydrocortisone 200 mg, IM or slow IV",
    ],
    pregnancySafety: "Standard resuscitation and anaphylaxis doses apply unchanged in pregnancy.",
    sources: [
      { label: "RCOG GTG56", href: "https://obgyn.onlinelibrary.wiley.com/doi/10.1111/1471-0528.15995" },
    ],
  },
  {
    id: "amiodarone",
    name: "Amiodarone",
    class: "Antiarrhythmic — cardiac arrest",
    color: "red",
    routes: [
      {
        type: "iv",
        shortLabel: "IV — cardiac arrest",
        label: "IV — shockable rhythm (VF / pulseless VT)",
        dose: "300 mg",
        frequency: "after the 3rd shock",
        notes: "GTG56 / OAA QRH: no change to standard Resuscitation Council (UK) algorithm doses in pregnancy.",
      },
    ],
    pregnancySafety: "Standard cardiac arrest dose applies unchanged in pregnancy.",
    sources: [
      { label: "RCOG GTG56", href: "https://obgyn.onlinelibrary.wiley.com/doi/10.1111/1471-0528.15995" },
    ],
  },
  {
    id: "atropine",
    name: "Atropine",
    class: "Antimuscarinic — cardiac arrest",
    color: "red",
    routes: [
      {
        type: "iv",
        shortLabel: "IV — vagal-mediated arrest",
        label: "IV — if vagal tone is the likely cause",
        dose: "0.5–1 mg",
        maxDose: "3 mg",
        frequency: "titrated to effect",
        notes: "OAA Maternal Cardiac Arrest QRH: use if vagal tone is the likely cause of the arrest.",
      },
    ],
    pregnancySafety: "Standard resuscitation dose applies unchanged in pregnancy.",
    sources: [
      { label: "RCOG GTG56", href: "https://obgyn.onlinelibrary.wiley.com/doi/10.1111/1471-0528.15995" },
    ],
  },
  {
    id: "calcium_gluconate",
    name: "Calcium gluconate",
    class: "Antidote — magnesium toxicity / hyperkalaemia",
    color: "red",
    routes: [
      {
        type: "iv",
        shortLabel: "IV — magnesium toxicity",
        label: "Slow IV injection",
        dose: "10 mL of 10% solution",
        frequency: "single dose, given slowly",
        notes: "GTG56: antidote for magnesium sulphate toxicity, low calcium, or hyperkalaemia. Calcium chloride 10% 10 mL IV is an equally valid alternative.",
      },
    ],
    pregnancySafety: "Standard antidote dose, unchanged in pregnancy.",
    sources: [
      { label: "RCOG GTG56", href: "https://obgyn.onlinelibrary.wiley.com/doi/10.1111/1471-0528.15995" },
    ],
  },
  {
    id: "calcium_chloride",
    name: "Calcium chloride",
    class: "Antidote — magnesium toxicity / hyperkalaemia",
    color: "red",
    routes: [
      {
        type: "iv",
        shortLabel: "IV — magnesium toxicity",
        label: "Slow IV injection",
        dose: "10 mL of 10% solution",
        frequency: "single dose, given slowly",
        notes: "OAA QRH: for magnesium overdose, low calcium, or hyperkalaemia. Calcium gluconate 10% 10 mL IV is an equally valid alternative.",
      },
    ],
    pregnancySafety: "Standard antidote dose, unchanged in pregnancy.",
    sources: [
      { label: "RCOG GTG56", href: "https://obgyn.onlinelibrary.wiley.com/doi/10.1111/1471-0528.15995" },
    ],
  },
  {
    id: "intralipid",
    name: "Intralipid 20% (lipid emulsion)",
    class: "Lipid rescue — local anaesthetic toxicity",
    color: "red",
    routes: [
      {
        type: "iv",
        shortLabel: "IV — LA toxicity",
        label: "IV bolus then infusion",
        dose: "1.5 mL/kg bolus over 1 minute, then 15 mL/kg/hr infusion",
        maxDose: "12 mL/kg cumulative dose",
        frequency: "bolus may repeat twice at 5-minute intervals; increase infusion to 30 mL/kg/hr if circulation not restored after a further 5 minutes",
        notes: "GTG56: for cardiovascular collapse due to local anaesthetic toxicity. CPR should continue throughout — recovery may take over an hour. Report all cases to NHS Improvement and the Lipid Rescue site.",
      },
    ],
    cautions: [
      "Stop injecting the local anaesthetic immediately if toxicity is suspected",
      "Intralipid 20% should be available in all hospitals offering maternity services",
    ],
    pregnancySafety: "Standard lipid rescue protocol, unchanged in pregnancy.",
    sources: [
      { label: "RCOG GTG56", href: "https://obgyn.onlinelibrary.wiley.com/doi/10.1111/1471-0528.15995" },
    ],
  },
];
