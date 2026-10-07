// Endometriosis medicines, checked against NICE NG73 (endometriosis,
// updated 2025) and NICE technology appraisals TA1057 and TA1067 on
// 7 Oct 2026. NG73 sets when hormonal treatment is used but names no product
// doses; doses without a national source are kept until checked against the
// BNF, and the TAs refer to each product's summary of product characteristics.

const NG73 = { label: "NICE NG73", href: "https://www.nice.org.uk/guidance/ng73" };
const NO_NATIONAL_DOSE = "Not given in national guidance: refer to local guidelines";
const FERTILITY = [
  "Hormonal treatment can reduce pain and has no permanent negative effect on subsequent fertility (NICE NG73 1.4.5)",
  "Do not offer hormonal treatment to women trying to conceive: it does not improve spontaneous pregnancy rates (NICE NG73 1.10.4)",
];

export const ENDOMETRIOSIS_DRUGS = [
  {
    id: "dienogest",
    name: "Dienogest",
    class: "Progestogen (Visanne®)",
    color: "purple",
    routes: [
      {
        type: "oral",
        shortLabel: "Oral: endometriosis",
        label: "Oral: endometriosis-related pain",
        dose: "2 mg",
        frequency: "Once daily continuously",
        maxDose: "2 mg/day",
        notes: "A progestogen. NICE NG73 offers hormonal treatment, for example the combined oral contraceptive pill or a progestogen, for suspected, confirmed or recurrent endometriosis (1.4.6), and suggests considering it after surgery to prolong the benefit (1.9.7). First-line pain relief is a short trial (for example 3 months) of paracetamol or an NSAID (1.4.2).",
      },
    ],
    contraindications: [
      "Active thromboembolic disorder",
      "Severe hepatic disease",
      "Hormone-sensitive malignancy",
      "Undiagnosed vaginal bleeding",
      "Pregnancy",
    ],
    cautions: [
      ...FERTILITY,
      "Not licensed as a contraceptive: additional contraception required",
      "Discontinue if jaundice or liver function deteriorates significantly",
    ],
    pregnancySafety: "Contraindicated in pregnancy.",
    sources: [
      { label: "BNF: Dienogest", href: "https://bnf.nice.org.uk/drugs/dienogest/" },
      NG73,
    ],
  },
  {
    id: "goserelin",
    name: "Goserelin",
    class: "GnRH agonist (Zoladex®)",
    color: "purple",
    routes: [
      {
        type: "sc",
        shortLabel: "SC implant: before surgery",
        label: "SC implant: before surgery for deep endometriosis",
        dose: "3.6 mg (monthly) or 10.8 mg (3-monthly)",
        frequency: "Monthly (3.6 mg) or every 12 weeks (10.8 mg)",
        notes: "NICE NG73 recommends considering 3 months of a GnRH agonist before surgery, as an adjunct, for deep endometriosis involving the bowel, bladder or ureter (1.9.5; off-label for some GnRH agonists).",
      },
    ],
    contraindications: [
      "Pregnancy or breastfeeding",
      "Undiagnosed vaginal bleeding",
      "Previous hypersensitivity to GnRH analogues",
    ],
    cautions: [
      ...FERTILITY,
      "Add-back HRT (e.g. norethisterone 5 mg daily or combined HRT) from the start of treatment, to reduce menopausal effects and bone density loss",
      "Without add-back: limit treatment to 6 months because of bone density loss",
      "Non-contraceptive: advise barrier contraception during treatment",
    ],
    pregnancySafety: "Contraindicated in pregnancy.",
    sources: [
      { label: "BNF: Goserelin", href: "https://bnf.nice.org.uk/drugs/goserelin/" },
      NG73,
    ],
  },
  {
    id: "leuprorelin",
    name: "Leuprorelin",
    class: "GnRH agonist (Prostap®)",
    color: "purple",
    routes: [
      {
        type: "im",
        shortLabel: "IM depot: before surgery",
        label: "IM depot: before surgery for deep endometriosis",
        dose: "3.75 mg (monthly) or 11.25 mg (3-monthly)",
        frequency: "Monthly (3.75 mg) or every 3 months (11.25 mg)",
        notes: "NICE NG73 recommends considering 3 months of a GnRH agonist before surgery, as an adjunct, for deep endometriosis involving the bowel, bladder or ureter (1.9.5; off-label for some GnRH agonists).",
      },
    ],
    contraindications: [
      "Pregnancy or breastfeeding",
      "Undiagnosed vaginal bleeding",
    ],
    cautions: [
      ...FERTILITY,
      "Add-back HRT from the start of treatment, to reduce menopausal effects and bone density loss",
      "Without add-back: limit treatment to 6 months because of bone density loss",
      "Non-contraceptive: advise barrier contraception",
    ],
    pregnancySafety: "Contraindicated in pregnancy.",
    sources: [
      { label: "BNF: Leuprorelin", href: "https://bnf.nice.org.uk/drugs/leuprorelin-acetate/" },
      NG73,
    ],
  },
  {
    id: "linzagolix",
    name: "Linzagolix",
    class: "GnRH antagonist, with hormonal add-back",
    color: "purple",
    routes: [
      {
        type: "oral",
        shortLabel: "Oral: after previous treatment",
        label: "Oral: symptoms of endometriosis after previous treatment",
        dose: NO_NATIONAL_DOSE,
        frequency: "with hormonal add-back therapy",
        notes: "An option for treating symptoms of endometriosis in adults of reproductive age who have had medical or surgical treatment for their endometriosis (NICE TA1067, June 2025). Dosage is set out in the summary of product characteristics.",
      },
    ],
    contraindications: [],
    cautions: [
      ...FERTILITY,
    ],
    pregnancySafety: "For adults of reproductive age who have had previous medical or surgical treatment (NICE TA1067).",
    sources: [
      { label: "NICE TA1067", href: "https://www.nice.org.uk/guidance/ta1067" },
      NG73,
    ],
  },
  {
    id: "relugolix_ct",
    name: "Relugolix–estradiol–norethisterone",
    class: "GnRH antagonist combination therapy (relugolix CT)",
    color: "purple",
    routes: [
      {
        type: "oral",
        shortLabel: "Oral: after previous treatment",
        label: "Oral: symptoms of endometriosis after previous treatment",
        dose: NO_NATIONAL_DOSE,
        notes: "An option for treating symptoms of endometriosis in adults of reproductive age who have had medical or surgical treatment for endometriosis (NICE TA1057, April 2025). Dosage is set out in the summary of product characteristics.",
      },
    ],
    contraindications: [],
    cautions: [
      ...FERTILITY,
    ],
    pregnancySafety: "For adults of reproductive age who have had previous medical or surgical treatment (NICE TA1057).",
    sources: [
      { label: "NICE TA1057", href: "https://www.nice.org.uk/guidance/ta1057" },
      NG73,
    ],
  },
];
