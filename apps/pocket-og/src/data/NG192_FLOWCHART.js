// NG192 — Caesarean Birth: Category of Urgency
// (NICE Guideline NG192, March 2021, updated September 2024)
// Triage aid for assigning the urgency category at the point of decision.

export const NG192_CATEGORY_FLOWCHART = {
  id: "NG192_CATEGORY",
  title: "Caesarean Birth: Category of Urgency",
  subtitle: "NG192 · Assigning the category at decision",
  startId: "life-threat",
  nodes: {

    "life-threat": {
      type: "decision",
      title: "Immediate Threat to the Life of the Woman or Fetus?",
      text: "e.g. suspected uterine rupture, major placental abruption, cord prolapse, prolonged fetal bradycardia.",
      options: [
        { label: "Yes", next: "cat1" },
        { label: "No", next: "compromise" },
      ],
    },

    "cat1": {
      type: "end",
      title: "Category 1",
      text: "As soon as possible — in most situations within 30 minutes of the decision.",
      items: [
        "Use the individual emergency pathway for the specific cause (e.g. cord prolapse, maternal collapse) alongside this",
        "Document time of decision and time of birth",
      ],
    },

    "compromise": {
      type: "decision",
      title: "Maternal or Fetal Compromise, Not Immediately Life-Threatening?",
      options: [
        { label: "Yes", next: "cat2" },
        { label: "No — no compromise, but early birth needed", next: "cat3" },
      ],
    },

    "cat2": {
      type: "end",
      title: "Category 2",
      text: "As soon as possible — in most situations within 75 minutes of the decision.",
      items: [
        "Document time of decision and time of birth",
      ],
    },

    "cat3": {
      type: "decision",
      title: "Is There a Reason Birth Needs to Happen Early?",
      text: "No maternal or fetal compromise, but the clinical picture means birth shouldn't simply wait for a routine elective slot.",
      options: [
        { label: "Yes — category 3", next: "cat3-end" },
        { label: "No — this is a planned, elective birth", next: "cat4" },
      ],
    },

    "cat3-end": {
      type: "end",
      title: "Category 3",
      text: "No fixed decision-to-delivery target — plan around theatre availability and the clinical picture.",
    },

    "cat4": {
      type: "end",
      title: "Category 4",
      text: "Birth timed to suit the woman or the maternity team — planned/elective date.",
    },

  },
};
