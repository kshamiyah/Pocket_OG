// Tocolytics and antenatal corticosteroids, checked against national
// guidance (7 Oct 2026): NICE NG25 (preterm labour and birth), RCOG Green-top
// Guideline 74 (antenatal corticosteroids, 2022) and NICE NG3 (diabetes in
// pregnancy). Nifedipine, NICE's first-line tocolytic, is on its card in
// antihypertensives.js. Indomethacin is shelved in tocolytics.shelved.js.

export const TOCOLYTICS = [
  {
    id: "atosiban",
    name: "Atosiban",
    class: "Oxytocin receptor antagonist (Tractocile®)",
    color: "sky",
    routes: [
      {
        type: "iv",
        shortLabel: "IV: preterm labour",
        label: "IV: tocolysis when nifedipine is contraindicated",
        dose: "Phase 1: 6.75 mg bolus over 1 min → Phase 2: 18 mg/hr × 3 hr → Phase 3: 6 mg/hr up to 45 hr",
        frequency: "Three-phase infusion",
        maxDose: "330 mg per treatment course; maximum 3 courses",
        notes: "NICE NG25 offers nifedipine first-line for tocolysis (1.8.2, 1.8.3) and oxytocin receptor antagonists such as atosiban if nifedipine is contraindicated (1.8.4). Do not offer betamimetics (1.8.5).",
      },
    ],
    contraindications: [
      "Gestational age <24 or >33+6 weeks",
      "Ruptured membranes <24 weeks",
      "Placenta praevia / antepartum haemorrhage",
      "Severe pre-eclampsia or eclampsia",
      "Chorioamnionitis / intrauterine infection",
      "Fetal compromise or intrauterine fetal death",
    ],
    cautions: [
      "Confirm gestational age and exclude fetal compromise before starting",
      "Monitor uterine contractions and fetal heart rate continuously",
      "Before starting tocolysis, weigh: suspected or diagnosed preterm labour, features such as bleeding or infection that make stopping labour inadvisable, gestational age, the likely benefit of maternal corticosteroids, the availability of neonatal care, and the woman's preference (NICE NG25 1.8.1)",
    ],
    pregnancySafety: "Second-line tocolytic in NICE NG25: offered when nifedipine is contraindicated (1.8.4).",
    sources: [
      { label: "BNF", href: "https://bnf.nice.org.uk/drugs/atosiban/" },
      { label: "NICE NG25", href: "https://www.nice.org.uk/guidance/ng25" },
    ],
  },
  {
    id: "betamethasone",
    name: "Antenatal corticosteroids",
    class: "Dexamethasone or betamethasone: fetal lung maturation",
    color: "sky",
    routes: [
      {
        type: "im",
        shortLabel: "IM dexamethasone (first choice)",
        label: "IM dexamethasone: first choice in the UK",
        dose: "24 mg dexamethasone phosphate per course",
        frequency: "12 mg × 2 doses, 24 hr apart, or 6 mg × 4 doses, 12 hr apart",
        maxDose: "No more than 2 courses in total (NICE NG25 1.9.5)",
        notes: "RCOG Green-top Guideline 74 (2022) recommends dexamethasone in the UK.",
      },
      {
        type: "im",
        shortLabel: "IM betamethasone (alternative)",
        label: "IM betamethasone: alternative",
        dose: "12 mg",
        frequency: "2 doses, 24 hr apart (24 mg per course)",
        maxDose: "No more than 2 courses in total (NICE NG25 1.9.5)",
        notes: "Betamethasone sodium phosphate/acetate mix, the alternative to dexamethasone (RCOG Green-top Guideline 74, 2022).",
      },
    ],
    contraindications: [],
    cautions: [
      "Gestation, NICE NG25: discuss at 22+0 to 23+6 weeks, offer at 24+0 to 33+6, consider at 34+0 to 35+6 (1.9.1 to 1.9.3)",
      "Gestation, RCOG GTG74 (2022): discuss before 24+0 weeks, offer at 24+0 to 34+6, consider at 35+0 to 36+6",
      "Repeat course: consider a single repeat course under 34+0 weeks if the first course was more than 7 days ago and birth is very likely in the next 48 hr (NICE NG25 1.9.4)",
      "Systemic infection: balance the benefit for the baby against the risk of worsening the infection for the woman and her baby (RCOG GTG74)",
      "Do not delay birth for steroids when the reason for birth is affecting the health of the woman or baby (RCOG GTG74)",
      "Diabetes is not a contraindication. With insulin-treated diabetes, give additional insulin by an agreed protocol and monitor closely (NICE NG3 1.3.41, 1.3.42)",
    ],
    pregnancySafety: "Offered when preterm birth is anticipated (preterm labour, P-PROM or planned preterm birth). A course given within 7 days before preterm birth reduces perinatal and neonatal death and respiratory distress syndrome (RCOG GTG74).",
    sources: [
      { label: "RCOG GTG74", href: "/guidelines/BJOG - 2022 - Stock - Antenatal corticosteroids to reduce neonatal morbidity and mortality.pdf" },
      { label: "NICE NG25", href: "https://www.nice.org.uk/guidance/ng25" },
      { label: "NICE NG3", href: "https://www.nice.org.uk/guidance/ng3" },
    ],
  },
];
