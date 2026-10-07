// Shelved antiemetic cards: hidden from the app, stored so they can be put back.
//
// Dexamethasone for hyperemesis (shelved 7 Oct 2026): RCOG GTG69 (2024) names
// hydrocortisone then prednisolone as the third-line corticosteroid regimen,
// not dexamethasone, and finds no increase in orofacial clefting with
// first-trimester corticosteroids. Card kept exactly as it was.
//
// To restore: move the card back into ANTIEMETICS in antiemetics.js.
// Nothing imports this file.

export const SHELVED_ANTIEMETICS = [
  {
    id: "dexamethasone",
    name: "Dexamethasone",
    class: "Corticosteroid",
    color: "amber",
    iconColor: "#FF9F0A",
    routes: [
      {
        type: "iv",
        shortLabel: "IV — refractory HG",
        label: "IV — refractory hyperemesis gravidarum",
        dose: "4 mg",
        frequency: "every 8 hours for 24–48 hours",
        maxDose: "12 mg/day (initial phase)",
        notes: "For refractory HG when other antiemetics have failed and patient is admitted. Follow with oral taper: 4 mg BD → 4 mg OD → 2 mg OD → stop over ~2 weeks. Avoid if possible before 10 weeks.",
      },
    ],
    contraindications: [
      "Systemic infection (without appropriate cover)",
      "Live vaccines within 3 months",
    ],
    cautions: [
      "Avoid before 10 weeks if possible — theoretical cleft palate risk (evidence weak but present)",
      "Risk of adrenal suppression with prolonged use — taper dose",
      "Monitor blood glucose — can precipitate gestational diabetes / worsen existing diabetes",
      "Rebound vomiting on stopping — ensure adequate taper",
    ],
    pregnancySafety: "Use only for refractory HG unresponsive to other antiemetics. Avoid in first trimester if possible. Monitor blood glucose closely.",
    sources: [
      { label: "BNF", href: "https://bnf.nice.org.uk/drugs/dexamethasone/" },
    ],
  },
];
