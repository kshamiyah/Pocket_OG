// GTG20a — External Cephalic Version and Reducing the Incidence of Term
// Breech Presentation (RCOG Green-top Guideline No. 20a, 2nd edition, 2017)
//
// The existing Counsel "External Cephalic Version (ECV)" page already
// carries the patient-facing numbers (success rates, timing, outcome
// comparison) — this guideline adds the clinical/procedural detail behind
// it: contraindications and technique.

export const GTG20A_SECTIONS = [
  {
    id: "gtg20a-eligibility",
    gl: "GTG20A",
    condition: "External Cephalic Version",
    setting: "Antenatal",
    title: "Who ECV Is For & Contraindications",
    tags: [
      "ecv eligibility", "ecv contraindications", "external cephalic version timing",
      "breech ecv",
    ],
    flowchartId: "GTG20_BREECH",
    content: [
      { type: "text", value: "Offer ECV to any woman with an uncomplicated breech pregnancy at term, from 36 weeks for a first baby and 37 weeks for a woman who has given birth before — a successful attempt turns a caesarean-leaning pregnancy back into a straightforward vaginal birth prospect." },
      { type: "subheading", value: "Absolute contraindications" },
      { type: "list", items: [
        "An independent indication for caesarean birth already exists (e.g. major placenta praevia) — there's no point turning the baby if delivery will be by caesarean regardless.",
        "Antepartum haemorrhage within the last 7 days.",
        "Abnormal cardiotocograph.",
        "Ruptured membranes.",
        "Multiple pregnancy (except version of the second twin after the first has delivered).",
        "Major uterine anomaly.",
      ]},
      { type: "subheading", value: "Relative contraindications — discuss and individualise rather than automatically exclude" },
      { type: "list", items: [
        "Small for gestational age with abnormal Dopplers.",
        "Pre-eclampsia.",
        "Oligohydramnios.",
        "Major fetal anomaly.",
        "Unstable lie.",
        "Scarred uterus (e.g. previous caesarean) — not an absolute bar, but factor it into the discussion and who performs the attempt.",
      ]},
    ],
  },

  {
    id: "gtg20a-technique",
    gl: "GTG20A",
    condition: "External Cephalic Version",
    setting: "Antenatal",
    title: "Technique",
    tags: [
      "ecv technique", "ecv tocolysis", "terbutaline ecv", "ecv procedure",
    ],
    content: [
      { type: "alert", value: "Perform ECV where facilities for immediate caesarean section are available — a small proportion of attempts precipitate fetal compromise requiring urgent delivery." },
      { type: "list", items: [
        "Confirm presentation, liquor volume and placental site on ultrasound immediately before the attempt.",
        "CTG before the procedure to confirm fetal wellbeing, and again afterwards to confirm no compromise resulted.",
        "A tocolytic (terbutaline is the agent generally used) improves the success rate and is recommended as part of the standard procedure, not reserved for difficult attempts.",
        "The procedure can be stopped at any point at the woman's request — consent is ongoing, not a one-off signature.",
        "Give anti-D to RhD-negative women after the procedure, whether or not it succeeds (see GTG22).",
      ]},
    ],
  },
];
