// Shelved tocolytic cards: hidden from the app, stored so they can be put back.
//
// Indomethacin (shelved 7 Oct 2026): NICE NG25 names only nifedipine and
// oxytocin receptor antagonists (atosiban) for tocolysis, and no national
// guideline gives an indomethacin regimen. Card kept exactly as it was.
//
// To restore: move the card back into TOCOLYTICS in tocolytics.js.
// Nothing imports this file.

export const SHELVED_TOCOLYTICS = [
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
];
