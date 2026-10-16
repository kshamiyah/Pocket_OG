// NICE NG229 — Fetal monitoring in labour (published 14 December 2022, updated 2026)
//
// Source: NICE NG229 1.2–1.6. The classification table below follows the
// current NG229 feature tables (checked against nice.org.uk, 16 Oct 2026):
//   Baseline (1.4.15)    reassuring 110–160; non-reassuring 100–109, a rise of
//                        20 bpm or more from the start of labour or since the
//                        last hourly review, or unable to determine; abnormal
//                        below 100 or above 160. A 20 bpm rise is abnormal in
//                        the active second stage (1.4.37).
//   Variability (1.4.18) reassuring 5–25; non-reassuring <5 for 30–50 min or
//                        >25 for up to 10 min; abnormal <5 for >50 min, >25 for
//                        >10 min, or sinusoidal.
//   Decelerations (1.4.24) and contractions (1.4.12) as in the table.
// Management/escalation wording is taken from NG229 1.5.
// ward-manager's classifyCTGEntry (ctg.js) uses these same bands.

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
      { type: "text", value: "Reference: NICE NG229 1.2–1.3 [2022]. If continuous CTG was started for a transient reason and both mother and baby are well after a defined period, NG229 supports returning to intermittent auscultation." },
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
      { type: "text", value: "Assess and document each of the 4 features individually (contractions, baseline rate, baseline variability, decelerations), then derive the overall category. NICE NG229 1.4.12 to 1.4.32." },
      { type: "table",
        headers: ["Feature", "Reassuring", "Non-reassuring", "Abnormal"],
        rows: [
          ["Contractions", "Fewer than 5 in 10 min", "5 or more in 10 min, or hypertonus", "None"],
          ["Baseline (bpm)", "Stable 110–160", "Rise of 20 or more from the start of labour or since the last hourly review; 100–109; or unable to determine", "Below 100, or above 160"],
          ["Variability (bpm)", "5–25", "<5 for 30–50 min, or >25 for up to 10 min", "<5 for >50 min, >25 for >10 min, or sinusoidal"],
          ["Decelerations", "None, early, or variable not evolving to have concerning characteristics", "Repetitive variable with any concerning characteristics for under 30 min, or non-repetitive variable with concerning characteristics for over 30 min", "Repetitive variable with concerning characteristics for over 30 min, late, acute bradycardia, or a single prolonged deceleration of 3 min or more"],
        ],
      },
      { type: "subheading", value: "Accelerations" },
      { type: "text", value: "The presence of accelerations is reassuring. Their absence in an otherwise normal CTG is of uncertain significance and is not classified as a feature on its own." },
      { type: "subheading", value: "Rising baseline" },
      { type: "text", value: "A rise of 20 bpm or more from the start of labour, or since the last hourly review, is a non-reassuring feature even within 110–160 (NG229 1.4.15). A rise may represent developing infection or hypoxia (1.4.16). In the active second stage, where hypoxia is more common and more rapid, treat a 20 bpm rise as an abnormal (red) feature (1.4.37)." },
      { type: "subheading", value: "Concerning features of variable decelerations" },
      { type: "list", items: [
        "Lasting more than 60 seconds",
        "Reduced variability within the deceleration",
        "Failure or slow return to baseline fetal heart rate",
        "Loss of previously present shouldering",
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
      { type: "text", value: "Combine the 4 individual features into an overall category, then act on it. NICE NG229 1.4.32 and 1.5." },
      { type: "table",
        headers: ["Category", "Features", "Action"],
        rows: [
          ["Normal", "All 4 features reassuring", "Continue CTG and normal care; reassess regularly."],
          ["Suspicious", "1 non-reassuring feature (all others reassuring)", "Full risk assessment and conservative measures, correcting any reversible cause; urgent obstetric or senior midwife review if there are other risk factors (NG229 1.5.5, 1.5.6). A 30 minute reassessment is local practice; NICE sets no interval."],
          ["Pathological", "≥2 non-reassuring features, OR ≥1 abnormal feature", "Urgent obstetric and senior midwife review, exclude acute events, conservative measures (NG229 1.5.7). If still pathological after conservative measures, further urgent review and consider expediting birth (1.5.8). NICE makes no recommendation on fetal blood sampling (1.7.1)."],
          ["Need for urgent intervention", "Acute bradycardia or single prolonged deceleration ≥3 min", "Acute bradycardia or a single prolonged deceleration of 3 min or more: urgent obstetric review, prepare for urgent birth with neonatal support, and expedite the birth if it persists for 9 minutes, or sooner with significant risk factors (NG229 1.5.9)."],
        ],
      },
      { type: "alert", value: "A pathological CTG, or any single prolonged deceleration of 3 minutes or more, mandates urgent senior involvement — escalate, do not wait." },
      { type: "subheading", value: "Fetal scalp stimulation" },
      { type: "text", value: "Consider digital fetal scalp stimulation if the trace is suspicious with risk factors for fetal compromise. An acceleration with a sustained improvement in the trace supports continued monitoring; no acceleration is a worrying sign that expedited birth may be necessary. NICE NG229 1.6.1, 1.6.2." },
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
      { type: "text", value: "When a CTG becomes suspicious or pathological, identify and correct reversible causes while escalating. NICE NG229 1.5 [2022]." },
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
        "Acute bradycardia or a prolonged deceleration of 3 min or more: urgent obstetric review and prepare for urgent birth; expedite if it persists for 9 min, or sooner with significant risk factors (NG229 1.5.9)",
      ]},
      { type: "text", value: "Document the category, the features, the time, the actions taken and the plan at each review. Reference: NICE NG229 1.5 [2022]." },
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
