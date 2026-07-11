// NG194 — Postnatal Care (NICE Guideline NG194, April 2021)
// Maternal red-flag recognition in the postnatal period.

export const NG194_POSTNATAL_FLOWCHART = {
  id: "NG194_POSTNATAL",
  title: "Postnatal Red Flags",
  subtitle: "NG194 · Maternal symptoms needing urgent assessment",
  startId: "symptom",
  nodes: {

    "symptom": {
      type: "decision",
      title: "Which Symptom Is Present?",
      text: "None of these are 'normal after birth' by default — each needs assessment.",
      options: [
        { label: "Sudden/heavy or persistent vaginal bleeding", next: "pph" },
        { label: "Abdo/pelvic/perineal pain, fever, or offensive discharge", next: "infection" },
        { label: "Leg swelling/tenderness, or shortness of breath", next: "vte" },
        { label: "Chest pain", next: "chest" },
        { label: "Persistent or severe headache", next: "headache" },
      ],
    },

    "pph": {
      type: "end",
      title: "Assess for Secondary PPH",
      text: "Sudden, very heavy, or persistent/increasing vaginal bleeding — assess urgently, do not manage by reassurance alone.",
    },

    "infection": {
      type: "end",
      title: "Assess for Genital Tract / Wound Infection",
      text: "Fever, shivering, or offensive discharge alongside pain — manage as possible maternal sepsis (see GTG64).",
    },

    "vte": {
      type: "end",
      title: "Assess for Venous Thromboembolism",
      text: "Leg swelling/tenderness or shortness of breath — assess for VTE (see GL891); do not attribute breathlessness to deconditioning without assessment.",
    },

    "chest": {
      type: "end",
      title: "Assess for VTE or Cardiac Cause",
      text: "Chest pain postnatally needs assessment for pulmonary embolism or a cardiac cause — do not default to an anxiety diagnosis.",
    },

    "headache": {
      type: "end",
      title: "Assess for Pre-Eclampsia and Other Causes",
      text: "Persistent or severe headache may signal pre-eclampsia (see GL952), post-dural puncture headache, migraine, intracranial pathology, or infection — assess before reassuring.",
    },

  },
};
