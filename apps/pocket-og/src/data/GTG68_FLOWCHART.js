// GTG68 — Epilepsy in Pregnancy (RCOG Green-top Guideline No. 68, June 2016)
// Managing a seizure in a pregnant woman on the ward/labour ward.

export const GTG68_SEIZURE_FLOWCHART = {
  id: "GTG68_SEIZURE",
  title: "Seizure in Pregnancy",
  subtitle: "GTG68 · Ward / labour ward management",
  startId: "seizure",
  nodes: {

    "seizure": {
      type: "alert",
      title: "Seizure Occurring — Immediate Actions",
      text: "Managed the same as any seizure — pregnancy changes the position and the team you call, not the emergency basics.",
      items: [
        "Protect from injury; do not restrain",
        "Left lateral position — reduces aortocaval compression and aspiration risk",
        "Call for help: obstetric, anaesthetic, and neonatal (if intrapartum) teams",
        "Note the time; time the seizure",
      ],
      next: "duration-check",
    },

    "duration-check": {
      type: "decision",
      title: "Seizure Still Ongoing at 5 Minutes?",
      options: [
        { label: "Yes — ongoing", next: "benzodiazepine" },
        { label: "No — self-terminated", next: "recovery" },
      ],
    },

    "benzodiazepine": {
      type: "action",
      title: "Give Benzodiazepine",
      text: "Treat as status epilepticus per usual protocol — pregnancy does not change first-line treatment.",
      items: [
        "IV lorazepam (or buccal/rectal diazepam if no IV access)",
        "Continuous monitoring; prepare for escalation if it doesn't settle",
        "Involve neurology/ITU early if seizures recur or don't respond",
      ],
      next: "recovery",
    },

    "recovery": {
      type: "end",
      title: "Recovery — Review & Plan",
      text: "Once safe, review the AED regimen and recent adherence/levels with the epilepsy team.",
      items: [
        "Check for a missed dose, sleep deprivation, or another trigger",
        "Check AED level if on lamotrigine, levetiracetam, oxcarbazepine or topiramate — pregnancy clearance changes are a common, correctable cause",
        "Document fully and debrief the woman",
        "Continue fetal monitoring as clinically indicated",
      ],
    },

  },
};
