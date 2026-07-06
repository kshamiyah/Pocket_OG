export const ANAEMIA_DRUGS = [
  {
    id: "oral_iron",
    name: "Oral iron",
    class: "Ferrous salts — iron deficiency anaemia",
    color: "amber",
    routes: [
      {
        type: "oral",
        shortLabel: "Ferrous fumarate",
        label: "Oral — Ferrous fumarate",
        dose: "200 mg (65 mg elemental iron)",
        frequency: "once daily or on alternate days",
        notes: "GL783: alternate-day dosing reduces GI side effects and improves compliance without reducing absorption.",
      },
      {
        type: "oral",
        shortLabel: "Ferrous sulphate",
        label: "Oral — Ferrous sulphate",
        dose: "200 mg (60 mg elemental iron)",
        frequency: "once daily or on alternate days",
      },
      {
        type: "oral",
        shortLabel: "Ferrous gluconate",
        label: "Oral — Ferrous gluconate",
        dose: "300 mg (35 mg elemental iron)",
        frequency: "once daily or on alternate days",
      },
    ],
    cautions: [
      "Do not take with food, tea or coffee — reduces absorption",
      "Hb should rise by 0.1–0.2 g/dL per day with adequate treatment",
      "Continue for 3 months after Hb normalises to replenish iron stores",
      "Stop 24 hours before an IV iron infusion; do not restart until at least 5 days after the last infusion",
    ],
    pregnancySafety: "First-line treatment for iron deficiency anaemia in pregnancy at standard elemental iron doses.",
    sources: [
      { label: "BNF", href: "https://bnf.nice.org.uk/drugs/ferrous-fumarate/" },
      { label: "RBH GL783", href: "/guidelines/GL783.pdf" },
    ],
  },
  {
    id: "ferric_carboxymaltose",
    name: "Ferric carboxymaltose (Ferinject)",
    class: "IV iron — iron deficiency anaemia",
    color: "amber",
    routes: [
      {
        type: "iv",
        shortLabel: "IV — 100–200 mg",
        label: "IV — 100–200 mg dose",
        dose: "100–200 mg",
        frequency: "in 50 mL 0.9% NaCl, pump rate 210 mL/hr, no minimum infusion time",
      },
      {
        type: "iv",
        shortLabel: "IV — 200–500 mg",
        label: "IV — 200–500 mg dose",
        dose: "200–500 mg",
        frequency: "in 100 mL 0.9% NaCl, over 6 minutes",
      },
      {
        type: "iv",
        shortLabel: "IV — 500–1000 mg",
        label: "IV — 500–1000 mg dose",
        dose: "500–1000 mg",
        maxDose: "1000 mg per week (15 mg/kg)",
        frequency: "in up to 250 mL 0.9% NaCl, over 15 minutes",
        notes: "GL783: dose calculated by the Ganzoni formula — cumulative iron deficit (mg) = 500 + (weight [kg] × ((target Hb 110 g/L − actual Hb) ÷ 10) × 2.4). Round to the nearest 100 mg vial.",
      },
    ],
    contraindications: [
      "Hb <70 g/L — transfuse instead (aim to raise Hb to 70 g/L only; even 1 unit is acceptable)",
    ],
    cautions: [
      "Indicated for Hb 80–100 g/L due to iron deficiency, or asymptomatic Hb 70–80 g/L, in preference to transfusion",
      "Check Hb, ferritin, red cell folate and B12 within 2 weeks before prescribing",
      "IV chlorpheniramine, hydrocortisone and adrenaline must be available for anaphylaxis, which is very rare",
      "Common side effects: headache (~3%), GI symptoms, rash",
      "Repeat FBC 7–14 days after treatment (rise in MCV/MCH confirms uptake), then again 7 days later",
    ],
    pregnancySafety: "Preferred over blood transfusion for moderate iron deficiency anaemia in pregnancy — safer and more cost-effective.",
    sources: [
      { label: "BNF", href: "https://bnf.nice.org.uk/drugs/ferric-carboxymaltose/" },
      { label: "RBH GL783", href: "/guidelines/GL783.pdf" },
    ],
  },
];
