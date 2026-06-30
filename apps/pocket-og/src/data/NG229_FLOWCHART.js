// NG229 — Fetal monitoring in labour: CTG interpretation & action pathway
// Mirrors the NG229 reader (packages/guidelines/src/NG229.js) and the tested
// classifyCTGEntry engine in apps/ward-manager. NICE NG229 §1.4–1.5 [2022].
//
// ⚠ Two threshold cells (baseline upper band, increased-variability timing) are
//   flagged for verbatim verification against the NG229 PDF — see the reader.

export const NG229_CTG_FLOWCHART = {
  id: "NG229_CTG",
  title: "CTG Interpretation & Action",
  subtitle: "NG229 · Fetal Monitoring in Labour",
  startId: "assess",
  nodes: {

    "assess": {
      type: "action",
      title: "Assess the Three Features",
      text: "Read the CTG systematically (DR C BRAVADO) and classify each feature as reassuring, non-reassuring or abnormal.",
      items: [
        "Baseline: reassuring 110–160 · non-reassuring 100–109 (⚠ also 161–180, verify vs NG229) · abnormal <100 or >180",
        "Variability: reassuring 5–25 · non-reassuring <5 for 30–50 min or >25 for a short period · abnormal <5 for >50 min, sinusoidal, or sustained >25",
        "Decelerations: reassuring none/early/variable without concerning features · non-reassuring variable with concerning features <30 min · abnormal concerning ≥30 min, late, or prolonged ≥3 min",
        "Always interpret with the whole clinical picture — risk factors, progress, maternal observations.",
      ],
      next: "categorise",
    },

    "categorise": {
      type: "decision",
      title: "Overall Category?",
      text: "Combine the three features into one overall category.",
      options: [
        { label: "All three reassuring", sublabel: "Normal", next: "normal" },
        { label: "1 non-reassuring feature", sublabel: "Suspicious", next: "suspicious" },
        { label: "≥2 non-reassuring OR ≥1 abnormal", sublabel: "Pathological", next: "pathological" },
        { label: "Acute bradycardia / prolonged decel ≥3 min", sublabel: "Need for urgent intervention", next: "urgent" },
      ],
    },

    "normal": {
      type: "end",
      title: "Normal CTG",
      text: "Continue CTG and routine care.",
      items: [
        "Keep reviewing — reassess and document regularly",
        "Re-evaluate if any risk factor or clinical change develops",
      ],
    },

    "suspicious": {
      type: "action",
      title: "Suspicious — Conservative Measures",
      text: "Start conservative (intrauterine resuscitation) measures, correct reversible causes, inform the coordinating midwife and obstetric team, and reassess within 30 minutes.",
      items: [
        "Reposition (left lateral); avoid supine",
        "Correct hypotension — IV fluid bolus, especially after regional analgesia",
        "Reduce or stop oxytocin",
        "Exclude cord prolapse / treat fever, sepsis or bleeding",
      ],
      next: "reassess30",
    },

    "reassess30": {
      type: "decision",
      title: "Reassess Within 30 Minutes",
      text: "After conservative measures, has the trace improved?",
      options: [
        { label: "Improved — now all reassuring", sublabel: "Return to normal pathway", next: "normal" },
        { label: "Persists or worsens", sublabel: "Treat as pathological", next: "pathological" },
      ],
    },

    "pathological": {
      type: "alert",
      title: "Pathological — Immediate Senior Review",
      text: "Continue conservative measures and obtain immediate review by an obstetrician (senior/consultant). Offer digital fetal scalp stimulation.",
      items: [
        "≥2 non-reassuring features, or ≥1 abnormal feature",
        "Escalate now — do not keep re-reading the trace alone",
        "Document category, features, time, actions and plan",
      ],
      next: "fss",
    },

    "fss": {
      type: "decision",
      title: "Fetal Scalp Stimulation Response?",
      text: "Is there an acceleration in response to digital fetal scalp stimulation?",
      options: [
        { label: "Acceleration — reassuring", sublabel: "Continue close monitoring", next: "fss-ok" },
        { label: "No response", sublabel: "FBS or expedite birth", next: "expedite" },
      ],
    },

    "fss-ok": {
      type: "end",
      title: "Reassuring Response",
      text: "An acceleration with scalp stimulation is reassuring.",
      items: [
        "Continue continuous CTG and conservative measures",
        "Keep the senior team informed; reassess frequently and re-escalate if it deteriorates",
      ],
    },

    "expedite": {
      type: "alert",
      title: "FBS or Expedite Birth",
      text: "With no reassuring response, consider fetal blood sampling where appropriate and available, or expedite birth — decision guided by the clinical picture and senior obstetrician.",
      items: [
        "Choose the fastest safe route to delivery if birth is indicated",
        "Continue conservative measures throughout",
      ],
    },

    "urgent": {
      type: "alert",
      title: "Urgent — Acute Bradycardia / Prolonged Deceleration",
      text: "A single prolonged deceleration ≥3 minutes is an obstetric emergency. Call for help immediately and start conservative measures.",
      items: [
        "Pull the emergency call bell; summon senior obstetric and neonatal teams",
        "Reposition, stop oxytocin, give IV fluids, exclude cord prolapse",
        "Consider acute tocolysis if uterine hypertonus/tachysystole is contributing",
      ],
      next: "urgent-time",
    },

    "urgent-time": {
      type: "decision",
      title: "Recovered by 9 Minutes?",
      text: "Has the fetal heart rate recovered with conservative measures?",
      options: [
        { label: "Recovered", sublabel: "Continue monitoring; review plan", next: "urgent-ok" },
        { label: "Not recovered by ~9 min", sublabel: "Prepare for urgent birth", next: "urgent-deliver" },
      ],
    },

    "urgent-ok": {
      type: "end",
      title: "Recovered",
      text: "Continue continuous CTG and reassess.",
      items: [
        "Keep the senior team aware and review the ongoing plan",
        "Re-escalate immediately if the pattern recurs",
      ],
    },

    "urgent-deliver": {
      type: "alert",
      title: "Prepare for Urgent Birth",
      text: "If the deceleration does not recover by around 9 minutes, prepare to expedite birth by the fastest safe route while continuing resuscitation measures.",
      items: [
        "Mobilise theatre / neonatal team",
        "Continue conservative measures en route",
      ],
    },

  },
};
