// NG229 — Fetal monitoring in labour: CTG interpretation & action pathway
// Mirrors the NG229 reader (packages/guidelines/src/NG229.js) and the tested
// classifyCTGEntry engine in apps/ward-manager. NICE NG229 1.4–1.5 [2022].
//
// Feature bands checked against the current NG229 tables on nice.org.uk
// (16 Oct 2026); see packages/guidelines/src/ctg.js.

export const NG229_CTG_FLOWCHART = {
  id: "NG229_CTG",
  title: "CTG Interpretation & Action",
  subtitle: "NG229 · Fetal Monitoring in Labour",
  startId: "classify",
  nodes: {

    "classify": {
      type: "classifier",
      title: "Classify the Trace",
      text: "Grade each feature one at a time (DR C BRAVADO) — the overall category is calculated for you, then continue to the action pathway. Always interpret with the whole clinical picture.",
      resultMap: {
        normal: "normal",
        suspicious: "suspicious",
        pathological: "pathological",
        urgent: "urgent",
      },
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
      title: "Suspicious: Risk Assessment and Conservative Measures",
      text: "Full risk assessment including a full set of maternal observations, taking the whole clinical picture into account, and document the findings. If the trace was previously normal, consider why it has changed. Accelerations make fetal acidosis unlikely. NICE NG229 1.5.5.",
      items: [
        "Encourage mobilising or a different position; avoid supine",
        "IV fluids only if she is hypotensive or has signs of sepsis (NG229 1.5.11)",
        "Reduce or stop oxytocin if contractions are 5 or more in 10",
        "No maternal facial oxygen for fetal heart rate concerns (NG229 1.5.12)",
      ],
      next: "suspicious-risk",
    },

    "suspicious-risk": {
      type: "decision",
      title: "Other Intrapartum Risk Factors?",
      text: "For example slow progress, sepsis or meconium.",
      options: [
        { label: "Yes", sublabel: "Urgent review, consider scalp stimulation", next: "suspicious-review" },
        { label: "No", sublabel: "Continue and reassess", next: "reassess30" },
      ],
    },

    "suspicious-review": {
      type: "action",
      title: "Urgent Review",
      text: "Obtain an urgent review by an obstetrician or a senior midwife, and consider fetal scalp stimulation or expediting birth. NICE NG229 1.5.6, 1.6.1.",
      items: [
        "Consider underlying causes and continue conservative measures",
      ],
      next: "fss",
    },

    "reassess30": {
      type: "decision",
      title: "Reassess the Trace",
      text: "After conservative measures, has the trace improved? Reassessing within 30 minutes is local practice; NICE sets no interval, and asks for a full risk assessment at least hourly (NG229 1.5.4).",
      options: [
        { label: "Improved, now all reassuring", sublabel: "Return to normal pathway", next: "normal" },
        { label: "Persists or worsens", sublabel: "Reclassify the trace", next: "classify" },
      ],
    },

    "pathological": {
      type: "alert",
      title: "Pathological: Urgent Review",
      text: "Obtain an urgent review by an obstetrician and a senior midwife. Exclude acute events needing immediate intervention (cord prolapse, suspected abruption, suspected uterine rupture). NICE NG229 1.5.7.",
      items: [
        "Full risk assessment with a full set of maternal observations; document",
        "Consider underlying causes and start conservative measures",
        "1 red feature, or 2 or more amber features",
      ],
      next: "path-persist",
    },

    "path-persist": {
      type: "decision",
      title: "Still Pathological After Conservative Measures?",
      text: "Re-evaluate the whole clinical picture.",
      options: [
        { label: "Improved", sublabel: "Reclassify the trace", next: "classify" },
        { label: "Still pathological", sublabel: "Further urgent review", next: "expedite" },
      ],
    },

    "fss": {
      type: "decision",
      title: "Fetal Scalp Stimulation Response?",
      text: "Is there an acceleration and a sustained improvement in the CTG after digital fetal scalp stimulation?",
      options: [
        { label: "Acceleration and sustained improvement", sublabel: "Continue to monitor", next: "fss-ok" },
        { label: "No acceleration", sublabel: "Worrying sign", next: "expedite" },
      ],
    },

    "fss-ok": {
      type: "end",
      title: "Reassuring Response",
      text: "Continue to monitor the fetal heart rate and the clinical picture. NICE NG229 1.6.1.",
      items: [
        "Keep the senior team informed; re-escalate if the trace deteriorates",
      ],
    },

    "expedite": {
      type: "alert",
      title: "Consider Expediting Birth",
      text: "Obtain a further urgent review by an obstetrician and a senior midwife, evaluate the whole clinical picture and consider expediting birth; have a very low threshold if intrapartum risk factors for fetal compromise are evolving. No acceleration after scalp stimulation is a worrying sign. NICE NG229 1.5.8, 1.6.2. NICE makes no recommendation on fetal blood sampling (1.7.1).",
      items: [
        "If birth is expedited, document the time urgent review was sought and the time of the decision (1.5.10)",
        "Continue conservative measures throughout",
      ],
    },

    "urgent": {
      type: "alert",
      title: "Urgent: Acute Bradycardia / Prolonged Deceleration",
      text: "Acute bradycardia, or a single prolonged deceleration of 3 minutes or more: urgently seek obstetric review. If there has been an acute event (cord prolapse, suspected abruption, suspected uterine rupture), expedite the birth. NICE NG229 1.5.9.",
      items: [
        "Consider underlying causes and start conservative measures",
        "Prepare for an urgent birth, including paediatric or neonatal support",
        "Consider acute tocolysis if hypertonus or 5+ contractions in 10 is contributing (local practice)",
      ],
      next: "urgent-time",
    },

    "urgent-time": {
      type: "decision",
      title: "Recovered by 9 Minutes?",
      text: "Has the fetal heart rate recovered? NICE: expedite the birth if the acute bradycardia persists for 9 minutes, or sooner if there are significant risk factors for fetal compromise (NG229 1.5.9).",
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
      text: "Expedite the birth if the bradycardia persists for 9 minutes (sooner with significant risk factors), by the fastest safe route, continuing conservative measures. NICE NG229 1.5.9.",
      items: [
        "Mobilise theatre / neonatal team",
        "Continue conservative measures en route",
      ],
    },

  },
};
