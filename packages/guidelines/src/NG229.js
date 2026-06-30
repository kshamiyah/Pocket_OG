// NICE NG229 — Fetal monitoring in labour (published 14 December 2022, updated 2026)
//
// Source: NICE NG229 §1.2–1.6. The CTG feature classification and overall
// categorisation reproduced here mirror the tested classification engine in
// apps/ward-manager (classifyCTGEntry, NG229 §1.4.16–1.4.31) so both apps stay
// consistent. Management/escalation wording is taken from NG229 §1.5.
//
// ⚠ VERIFY-BEFORE-PUBLISH (NICE is network-blocked in the build environment, so
//   two cells below were carried over from the ward-manager engine's operational
//   simplification and must be reconciled against the NG229 PDF):
//     1. Baseline upper band — engine treats >160 as abnormal; NG229's published
//        table is understood to split this (≈161–180 non-reassuring, >180
//        abnormal). Flagged inline in the classification table.
//     2. "Rising baseline" — the ≥20 bpm rise is a LOCAL threshold, not an NG229
//        number. Flagged inline.
//   The increased-variability timing (>25 bpm) should also be confirmed.

export const NG229_SECTIONS = [
  {
    id: "ng229-overview",
    gl: "NG229",
    condition: "Fetal Monitoring in Labour",
    setting: "Intrapartum — General",
    title: "Choosing the Method of Monitoring",
    tags: [
      "ctg", "cardiotocography", "cardiotocograph", "fetal monitoring",
      "electronic fetal monitoring", "efm", "fetal heart rate", "fhr",
      "intermittent auscultation", "continuous ctg", "ng229", "nice",
      "fetal wellbeing", "intrapartum monitoring", "doppler", "pinard",
    ],
    content: [
      { type: "text", value: "NICE NG229 (Fetal monitoring in labour, 2022) covers how to monitor the baby's wellbeing in labour: choosing between intermittent auscultation and continuous cardiotocography (CTG), and interpreting and acting on the findings." },
      { type: "alert", value: "Monitoring is one part of the picture. NG229 stresses assessing the whole clinical situation — risk factors, progress in labour, maternal observations — not the CTG trace in isolation. Categorising a trace does not replace senior review." },
      { type: "subheading", value: "Offer intermittent auscultation (IA) when" },
      { type: "list", items: [
        "Low-risk labour with no maternal or fetal risk factors for fetal compromise",
        "Use a Pinard stethoscope or handheld Doppler",
        "Auscultate immediately after a contraction for at least 1 minute, at least every 15 minutes in the first stage and every 5 minutes (or after every contraction) in the active second stage",
        "Record the fetal heart rate as a single rate; record accelerations and decelerations if heard",
      ]},
      { type: "subheading", value: "Offer continuous CTG when there is an intrapartum or pre-existing risk factor, e.g." },
      { type: "list", items: [
        "Suspected fetal compromise (e.g. abnormality on IA, significant meconium)",
        "Maternal pyrexia (≥38.0°C once, or ≥37.5°C on two occasions)",
        "Sepsis or suspected chorioamnionitis",
        "Severe hypertension (≥160/110) or pre-eclampsia",
        "Oxytocin use for augmentation",
        "Significant fresh bleeding in labour, or suspected abruption",
        "Confirmed delay in the first or second stage",
      ]},
      { type: "text", value: "Reference: NICE NG229 §1.2–1.3 [2022]. If continuous CTG was started for a transient reason and both mother and baby are well after a defined period, NG229 supports returning to intermittent auscultation." },
    ],
  },

  {
    id: "ng229-classification",
    gl: "NG229",
    condition: "Fetal Monitoring in Labour",
    setting: "Intrapartum — CTG Interpretation",
    title: "CTG Feature Classification",
    tags: [
      "ctg classification", "cardiotocography", "baseline", "baseline rate",
      "baseline variability", "variability", "decelerations", "deceleration",
      "accelerations", "reassuring", "non-reassuring", "abnormal",
      "late decelerations", "variable decelerations", "early decelerations",
      "prolonged deceleration", "sinusoidal", "reduced variability", "fhr",
      "fetal heart rate", "ng229", "ctg features",
    ],
    content: [
      { type: "text", value: "Assess and document each feature individually — baseline rate, baseline variability and decelerations — then derive the overall category. NICE NG229 §1.4.16–1.4.31 [2022]." },
      { type: "table",
        headers: ["Feature", "Reassuring", "Non-reassuring", "Abnormal"],
        rows: [
          ["Baseline (bpm)", "110–160", "100–109  ⚠ also 161–180*", "Below 100  ⚠ or above 180*"],
          ["Variability (bpm)", "5–25", "<5 for 30–50 min, or >25 for ≤10 min*", "<5 for >50 min, >25 for >10 min*, or sinusoidal"],
          ["Decelerations", "None, early, or variable without concerning features", "Variable with concerning features for <30 min", "Variable with concerning features ≥30 min, late, or prolonged (≥3 min)"],
        ],
      },
      { type: "alert", value: "⚠ VERIFY vs NG229 PDF before publishing. The cells marked * were carried over from the ward-manager engine's simplified scoring (it treats >160 as abnormal and uses a ≤10/>10 min cut for increased variability). NG229's published table is understood to split the baseline upper end (161–180 non-reassuring, >180 abnormal) — confirm against the source and update both this reader and classifyCTGEntry together." },
      { type: "subheading", value: "Accelerations" },
      { type: "text", value: "The presence of accelerations is reassuring. Their absence in an otherwise normal CTG is of uncertain significance and is not classified as a feature on its own." },
      { type: "subheading", value: "Rising baseline" },
      { type: "text", value: "A baseline that is rising — even within the normal range — can be an early sign of compromise and should prompt closer review in clinical context. (Note: the ≥20 bpm rise used as a prompt in the ward-manager engine is a LOCAL threshold, not an NG229-specified number.)" },
      { type: "subheading", value: "Concerning features of variable decelerations" },
      { type: "list", items: [
        "Lasting more than 60 seconds",
        "Reduced baseline variability within the deceleration",
        "Failure to return to baseline",
        "Biphasic (W) shape",
        "No shouldering",
      ]},
    ],
  },

  {
    id: "ng229-categorisation",
    gl: "NG229",
    condition: "Fetal Monitoring in Labour",
    setting: "Intrapartum — CTG Interpretation",
    title: "Overall Categorisation & Action",
    flowchartId: "NG229_CTG",
    tags: [
      "normal ctg", "suspicious ctg", "pathological ctg", "ctg category",
      "categorisation", "urgent intervention", "fetal scalp stimulation",
      "fetal blood sampling", "fbs", "escalation", "expedite birth",
      "cardiotocography", "ng229", "ctg management", "reassess",
    ],
    content: [
      { type: "text", value: "Combine the three individual features into an overall category, then act on it. NICE NG229 §1.4 / §1.5 [2022]." },
      { type: "table",
        headers: ["Category", "Features", "Action"],
        rows: [
          ["Normal", "All three features reassuring", "Continue CTG and normal care; reassess regularly."],
          ["Suspicious", "1 non-reassuring feature (both others reassuring)", "Start conservative measures, find and correct any reversible cause, and reassess within 30 minutes. Inform a senior."],
          ["Pathological", "≥2 non-reassuring features, OR ≥1 abnormal feature", "Immediate senior/consultant review. Conservative measures. Offer fetal scalp stimulation; if no acceleration, consider fetal blood sampling or expedite birth."],
          ["Need for urgent intervention", "Acute bradycardia or single prolonged deceleration ≥3 min", "Call for help. Conservative measures. If it persists ≥9 min, prepare for urgent birth. If it recovers, continue monitoring and review the plan."],
        ],
      },
      { type: "alert", value: "A pathological CTG, or any single prolonged deceleration of 3 minutes or more, mandates urgent senior involvement — escalate, do not wait." },
      { type: "subheading", value: "Fetal scalp stimulation" },
      { type: "text", value: "An acceleration in response to digital fetal scalp stimulation is reassuring and can support continued monitoring. Absence of a response is a further concern and should prompt consideration of fetal blood sampling or expediting birth, depending on the clinical picture. NICE NG229 §1.5.3 [2022]." },
    ],
  },

  {
    id: "ng229-conservative",
    gl: "NG229",
    condition: "Fetal Monitoring in Labour",
    setting: "Intrapartum — Acting on Concern",
    title: "Conservative Measures & Escalation",
    tags: [
      "conservative measures", "intrauterine resuscitation", "reposition",
      "left lateral", "iv fluids", "stop oxytocin", "reduce oxytocin",
      "tachysystole", "hyperstimulation", "tocolysis", "terbutaline",
      "ctg escalation", "ng229", "fetal resuscitation", "cardiotocography",
    ],
    content: [
      { type: "text", value: "When a CTG becomes suspicious or pathological, identify and correct reversible causes while escalating. NICE NG229 §1.5 [2022]." },
      { type: "subheading", value: "Conservative (intrauterine resuscitation) measures" },
      { type: "list", items: [
        "Reposition the woman — left lateral is often first-line; avoid the supine position",
        "Correct maternal hypotension (e.g. IV fluid bolus, particularly after regional analgesia)",
        "Reduce or stop oxytocin if it is running",
        "If uterine tachysystole/hyperstimulation is contributing, consider acute tocolysis (e.g. terbutaline) per local protocol",
        "Look for and treat an underlying cause — fever/sepsis, bleeding, cord prolapse",
      ]},
      { type: "alert", value: "If a vaginal examination has not been done and the FHR pattern is acutely abnormal, perform one to exclude cord prolapse and assess progress." },
      { type: "subheading", value: "Escalation timing" },
      { type: "list", items: [
        "Suspicious CTG — reassess within 30 minutes; inform the coordinating midwife and obstetric team",
        "Pathological CTG — immediate review by an obstetrician (senior/consultant)",
        "Prolonged deceleration ≥3 min — call for senior help immediately; if not recovered by ~9 min, prepare for urgent birth",
      ]},
      { type: "text", value: "Document the category, the features, the time, the actions taken and the plan at each review. Reference: NICE NG229 §1.5 [2022]." },
    ],
  },

  {
    id: "ng229-systematic-read",
    gl: "NG229",
    condition: "Fetal Monitoring in Labour",
    setting: "Intrapartum — Bedside Aid",
    title: "Systematic CTG Read (DR C BRAVADO)",
    tags: [
      "dr c bravado", "bravado", "systematic ctg", "how to read a ctg",
      "ctg interpretation aid", "ctg mnemonic", "contractions", "tone",
      "cardiotocography", "ng229", "bedside", "structured assessment",
    ],
    content: [
      { type: "text", value: "A widely taught structure for presenting a CTG. It is a teaching mnemonic (not part of NG229) but the individual features map onto the NG229 classification table." },
      { type: "list", items: [
        "DR — Define Risk: why is this woman on continuous CTG? (risk factors / indication)",
        "C — Contractions: frequency in 10 minutes and duration; watch for tachysystole",
        "BRa — Baseline Rate: 110–160 is reassuring (see classification table)",
        "V — Variability: 5–25 bpm is reassuring",
        "A — Accelerations: present is reassuring",
        "D — Decelerations: none / early / variable / late / prolonged — and any concerning features",
        "O — Overall impression: normal, suspicious, pathological, or need for urgent intervention → then act",
      ]},
      { type: "alert", value: "Always close the loop with the overall category and a documented plan — and escalate a suspicious or pathological trace rather than re-reading it alone." },
    ],
  },
];
