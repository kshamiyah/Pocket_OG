export const DIABETES_DRUGS = [
  {
    id: "insulin_vrii",
    name: "Insulin (VRII)",
    class: "Variable rate insulin infusion",
    color: "pink",
    routes: [
      {
        type: "iv",
        shortLabel: "IV — Algorithm 1 (most women)",
        label: "IV infusion — Algorithm 1 (most women)",
        dose: "0.2–4.0 units/hr, titrated by hourly CBG",
        frequency: "target CBG 4.0–7.8 mmol/L; check hourly",
        notes: "GL983: soluble insulin (e.g. Novorapid) 50 units in 50 mL 0.9% NaCl via infusion pump, alongside substrate solution (0.45% saline + 5% glucose + 0.15% KCl, or 5% glucose alone) at 50 mL/hr. Algorithms 2 (>80 units/day or uncontrolled on Alg 1) and 3 (specialist advice only) run higher rates per CBG band — see the full table in the Diabetes guide.",
      },
    ],
    contraindications: [],
    cautions: [
      "STOP infusion 20 minutes if CBG <4.0 mmol/L, treat the hypo, recheck CBG in 10 minutes",
      "Steroids: increase insulin 10–20% from administration and for the next 48 hours; continue VRII for 24 hours after the 2nd steroid dose",
      "Add 10% dextrose alongside normal saline when BG ≤14 mmol/L (125 mL/hr, or 250 mL/hr if BG <7 mmol/L)",
      "Intrapartum: continue long-acting insulin only alongside VRII; avoid short-acting if not eating normally",
      "DKA is a real risk in Type 1, metformin-controlled and diet-controlled diabetics receiving steroids",
    ],
    pregnancySafety: "Insulin is the first-line pharmacological treatment for diabetes in pregnancy and does not cross the placenta in clinically significant amounts.",
    sources: [
      { label: "BNF", href: "https://bnf.nice.org.uk/drugs/insulin-soluble-human/" },
      { label: "RBH GL983", href: "/guidelines/GL983.pdf" },
    ],
  },
  {
    id: "metformin",
    name: "Metformin",
    class: "Biguanide — oral antidiabetic",
    color: "pink",
    routes: [
      {
        type: "oral",
        shortLabel: "Oral — diabetes in pregnancy",
        label: "Oral",
        dose: "500 mg once or twice daily, increased in steps of 500 mg at intervals of ≥1 week",
        maxDose: "2 g/day (standard licensed maximum)",
        frequency: "with or after meals",
        notes: "GL983: continue metformin until active labour or after ARM; discontinue if not eating in labour. May be started alongside insulin at GDM diagnosis if fasting BG ≥7.0 mmol/L, or considered if fasting BG 6.0–6.9 mmol/L with macrosomia or hydramnios.",
      },
    ],
    cautions: [
      "Discontinue if the woman is not eating normally in labour, or if DKA/acute illness develops",
      "Renal function should be checked periodically per standard practice",
    ],
    pregnancySafety: "Widely used in gestational and type 2 diabetes in pregnancy alongside insulin; crosses the placenta but is not teratogenic at standard doses.",
    sources: [
      { label: "BNF", href: "https://bnf.nice.org.uk/drugs/metformin-hydrochloride/" },
      { label: "RBH GL983", href: "/guidelines/GL983.pdf" },
    ],
  },
];
