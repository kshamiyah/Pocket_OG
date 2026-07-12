// NICE NG123 — Urinary Incontinence and Pelvic Organ Prolapse in Women
// New presentation: which track (UI vs POP) and first steps down each.

export const NG123_UI_POP_PATHWAY_FLOWCHART = {
  id: "NG123_UI_POP_PATHWAY",
  title: "New Urinary Incontinence / Prolapse Symptoms",
  subtitle: "NG123 · Assessment and first-line management",
  startId: "assess",
  nodes: {

    "assess": {
      type: "action",
      title: "Assess",
      text: "Bladder diary (minimum 3 days) and vaginal examination for both leakage type and prolapse.",
      items: [
        "Classify UI: stress, urgency, or mixed — ask which component bothers the woman most",
        "Examine for prolapse and stage by compartment if present (POP-Q)",
        "Urodynamics not routinely needed before conservative treatment",
      ],
      next: "predominant-problem",
    },

    "predominant-problem": {
      type: "decision",
      title: "Predominant Problem?",
      options: [
        { label: "Stress or mixed UI (stress-predominant)", next: "pfmt" },
        { label: "Urgency UI / overactive bladder", next: "bladder-training" },
        { label: "Pelvic organ prolapse", next: "pop-stage" },
      ],
    },

    "pfmt": {
      type: "action",
      title: "Pelvic Floor Muscle Training",
      text: "First-line for stress or mixed UI.",
      items: ["Supervised, at least 3 months", "At least 8 contractions, 3 times a day"],
      next: "ui-surgical-check",
    },

    "ui-surgical-check": {
      type: "decision",
      title: "Improved After an Adequate Trial?",
      options: [
        { label: "Yes", next: "continue" },
        { label: "No — consider surgery", next: "ui-surgery" },
      ],
    },

    "ui-surgery": {
      type: "end",
      title: "Surgical Options for Stress UI",
      items: [
        "Colposuspension (open or laparoscopic) or autologous fascial sling",
        "Synthetic mesh sling not routinely offered — verify against local protocol/national mesh position",
        "Duloxetine only if surgery declined or unsuitable, after discussing side effects",
      ],
    },

    "bladder-training": {
      type: "action",
      title: "Bladder Training",
      text: "First-line for urgency or mixed UI.",
      items: ["Minimum 6 weeks"],
      next: "ui-drug-check",
    },

    "ui-drug-check": {
      type: "decision",
      title: "Improved After 6 Weeks?",
      options: [
        { label: "Yes", next: "continue" },
        { label: "No — add drug treatment", next: "ui-drugs" },
      ],
    },

    "ui-drugs": {
      type: "action",
      title: "Add Antimuscarinic or Mirabegron",
      items: [
        "Avoid immediate-release oxybutynin in older or frail women — anticholinergic burden",
        "Review effectiveness and tolerability within 4 weeks",
      ],
      next: "ui-specialist-check",
    },

    "ui-specialist-check": {
      type: "decision",
      title: "Improved on Drug Treatment?",
      options: [
        { label: "Yes", next: "continue" },
        { label: "No — refer to specialist urogynaecology", next: "ui-specialist" },
      ],
    },

    "ui-specialist": {
      type: "end",
      title: "Specialist / Third-Line Options",
      items: ["Botulinum toxin A bladder injections", "Sacral nerve stimulation or percutaneous tibial nerve stimulation"],
    },

    "pop-stage": {
      type: "decision",
      title: "POP-Q Stage?",
      options: [
        { label: "Stage 1–2, symptomatic", next: "pop-conservative" },
        { label: "Stage 3–4, or conservative declined/failed", next: "pop-surgery" },
      ],
    },

    "pop-conservative": {
      type: "action",
      title: "Conservative Management",
      items: [
        "Supervised PFMT for at least 16 weeks",
        "Vaginal pessary alone or alongside PFMT",
        "Pessary clinic review every 6 months if higher risk of complications",
      ],
      next: "continue",
    },

    "pop-surgery": {
      type: "end",
      title: "Surgical Referral",
      items: [
        "Compartment-specific repair (anterior/posterior: native tissue; apical/vault: sacrospinous fixation or sacrocolpopexy)",
        "Colpocleisis an option if no longer sexually active",
        "Transvaginal mesh only within a research context — serious safety concerns",
      ],
    },

    "continue": {
      type: "end",
      title: "Continue Conservative Management",
      text: "Reinforce technique and adherence; review again if symptoms recur or change.",
    },

  },
};
