export const TOCOLYTICS = [
  {
    id: "atosiban",
    name: "Atosiban",
    class: "Oxytocin receptor antagonist (Tractocile®)",
    color: "sky",
    routes: [
      {
        type: "iv",
        shortLabel: "IV — preterm labour",
        label: "IV — preterm labour (24–33+6 weeks)",
        dose: "Phase 1: 6.75 mg bolus over 1 min → Phase 2: 18 mg/hr × 3 hr → Phase 3: 6 mg/hr up to 45 hr",
        frequency: "Three-phase infusion",
        maxDose: "330 mg per treatment course; maximum 3 courses",
        notes: "Three-phase regimen: 1) 6.75 mg IV bolus over 1 min; 2) 18 mg/hr loading infusion for 3 hr; 3) 6 mg/hr maintenance for up to 45 hr. Maximum 3 courses. Licensed 24+0 to 33+6 weeks. Give betamethasone for fetal lung maturation alongside.",
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
      "Inform neonatology team — arrange appropriate neonatal care",
      "Always give betamethasone concurrently for fetal lung maturation",
    ],
    pregnancySafety: "Licensed tocolytic for 24–33+6 weeks. Preferred first-line tocolytic in UK (NICE NG25). Does not cross placenta significantly.",
    sources: [
      { label: "BNF", href: "https://bnf.nice.org.uk/drugs/atosiban/" },
      { label: "NICE NG25", href: "https://www.nice.org.uk/guidance/ng25" },
    ],
  },
  {
    id: "indomethacin",
    name: "Indomethacin",
    class: "NSAID / COX inhibitor tocolytic",
    color: "sky",
    routes: [
      {
        type: "rectal",
        shortLabel: "PR — preterm labour <32 wk",
        label: "PR / Oral — preterm labour (before 32 weeks)",
        dose: "100 mg loading; then 25–50 mg every 4–6 hr",
        frequency: "Loading dose, then every 4–6 hr for maximum 48 hours",
        maxDose: "200 mg/day; maximum treatment duration 48 hr",
        notes: "Use ONLY before 32 weeks — increasing risk of premature ductus arteriosus closure and oligohydramnios after 32 weeks. Rectal suppository (100 mg) preferred; oral: 50–100 mg loading then 25 mg every 4–6 hr. Strictly limit to 48 hours.",
      },
    ],
    contraindications: [
      "Gestational age ≥32 weeks",
      "Renal dysfunction",
      "Oligohydramnios",
      "Platelet dysfunction or coagulopathy",
      "Peptic ulcer disease",
    ],
    cautions: [
      "RESTRICT TO <32 WEEKS — risk of premature ductus arteriosus closure increases rapidly after 32 weeks",
      "DO NOT exceed 48 hours of treatment",
      "Monitor amniotic fluid volume if used beyond 24 hours",
      "Doppler assessment of ductus arteriosus if used >48 hr or >28 weeks",
    ],
    pregnancySafety: "Only use before 32 weeks. Risk of premature ductus arteriosus closure and oligohydramnios increases with gestation and treatment duration.",
    sources: [
      { label: "BNF", href: "https://bnf.nice.org.uk/drugs/indometacin/" },
    ],
  },
  {
    id: "betamethasone",
    name: "Betamethasone",
    class: "Corticosteroid — antenatal fetal lung maturation",
    color: "sky",
    routes: [
      {
        type: "im",
        shortLabel: "IM — antenatal steroids",
        label: "IM — antenatal corticosteroids (fetal lung maturation)",
        dose: "12 mg",
        frequency: "Two doses, 24 hours apart",
        maxDose: "24 mg (one course); single rescue course may be offered ≥7 days after first",
        notes: "Offer to all women at risk of preterm delivery 24+0 to 34+6 weeks. Two doses of 12 mg IM given 24 hr apart. A single rescue course may be offered if >7 days since first course and <34 weeks. Do NOT give more than two courses total. Dexamethasone 6 mg IM every 6 hr × 4 doses is an alternative.",
      },
    ],
    contraindications: [
      "Active systemic infection without adequate antimicrobial cover",
    ],
    cautions: [
      "Monitor blood glucose closely — transient hyperglycaemia, especially in diabetics",
      "Increase insulin doses in diabetic women during steroid course",
      "Transient fetal heart rate variability changes expected",
      "May temporarily mask clinical signs of infection",
    ],
    pregnancySafety: "Strongly recommended 24–34+6 weeks for all women at risk of preterm delivery. Reduces respiratory distress syndrome (RDS), intraventricular haemorrhage (IVH), and neonatal mortality.",
    sources: [
      { label: "BNF", href: "https://bnf.nice.org.uk/drugs/betamethasone/" },
      { label: "NICE NG25", href: "https://www.nice.org.uk/guidance/ng25" },
    ],
  },
];
