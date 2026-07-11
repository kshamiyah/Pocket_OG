// GTG26 — Assisted Vaginal Birth (RCOG Green-top Guideline No. 26, 4th
// edition, April 2020). Decision support only — an operator trained and
// competent in the chosen instrument should lead, with senior/theatre
// backup for any trial attempt.

export const GTG26_ASSISTED_BIRTH_FLOWCHART = {
  id: "GTG26_ASSISTED_BIRTH",
  title: "Assisted Vaginal Birth",
  subtitle: "GTG26 · Prerequisites through to conduct of the attempt",
  startId: "prerequisites",
  nodes: {

    "prerequisites": {
      type: "decision",
      title: "Prerequisites Met?",
      text: "Fully dilated, membranes ruptured, adequate analgesia, bladder empty, head position/station assessed, consent discussed, competent operator with a backup plan.",
      options: [
        { label: "Yes — all met", next: "station" },
        { label: "No — not yet met", next: "not-ready" },
      ],
    },

    "not-ready": {
      type: "end",
      title: "Address Before Proceeding",
      text: "Do not start until prerequisites are met — correct what's missing (analgesia, bladder, confirmed position/station) or reconsider the plan with a senior.",
    },

    "station": {
      type: "decision",
      title: "Station & Rotation?",
      text: "Outlet: scalp visible, ≤45° rotation. Low: ≥station +2cm. Mid-cavity: station 0 to +1cm, ≤1/5 palpable abdominally. High: >1/5 palpable, above station 0.",
      options: [
        { label: "Outlet or low", next: "risk-check" },
        { label: "Mid-cavity", next: "trial-theatre" },
        { label: "High", next: "high-station" },
      ],
    },

    "high-station": {
      type: "end",
      title: "Not Appropriate for Assisted Vaginal Birth",
      text: "Head >1/5 palpable, above station 0 — this is a caesarean birth, not a vaginal instrumental attempt.",
    },

    "risk-check": {
      type: "decision",
      title: "Any Factors Favouring a Trial in Theatre?",
      text: "EFW >4kg / clinically large baby, maternal BMI >30, OP position, or an operator with limited experience of the anticipated difficulty.",
      options: [
        { label: "Yes — one or more present", next: "trial-theatre" },
        { label: "No", next: "choose-instrument" },
      ],
    },

    "trial-theatre": {
      type: "alert",
      title: "Conduct as a Trial in Theatre",
      text: "Immediate recourse to caesarean birth must be available — do not attempt on the labour ward and transfer only after failure.",
      next: "choose-instrument",
    },

    "choose-instrument": {
      type: "action",
      title: "Choose Forceps or Ventouse",
      text: "Weigh the clinical scenario against operator experience with the specific instrument.",
      items: [
        "Ventouse: somewhat higher failure rate, more neonatal cephalhaematoma/retinal haemorrhage; less maternal perineal trauma. Avoid <34 weeks, face presentation, or suspected fetal bleeding disorder.",
        "Forceps: higher success rate; higher risk of significant maternal perineal trauma including OASI.",
        "Rotational delivery (Kielland's/rotational ventouse) only by an operator specifically trained in it.",
      ],
      next: "conduct",
    },

    "conduct": {
      type: "decision",
      title: "Descent With Each Traction?",
      text: "Expect visible descent with correctly applied traction/each contraction.",
      options: [
        { label: "Yes — progressive descent", next: "success" },
        { label: "No descent, or not progressing", next: "abandon" },
      ],
    },

    "abandon": {
      type: "alert",
      title: "Abandon — Move to Caesarean",
      text: "No fixed 'number of pulls' rule — absence of progressive descent is the signal to stop, not a pull count.",
      items: [
        "Planned sequential use of a second instrument is NOT recommended — higher neonatal trauma risk",
        "Default next step is caesarean birth, decided by a senior obstetrician",
      ],
      next: "document",
    },

    "success": {
      type: "end",
      title: "Birth Achieved — Assess & Document",
      text: "Systematically examine for perineal trauma including OASI (rectal exam), assess for PPH, and check the baby's condition.",
    },

    "document": {
      type: "end",
      title: "Document Fully",
      text: "Indication, consent discussion, position/station assessed, instrument, pulls/duration, operator seniority, baby's condition, maternal perineal findings.",
    },

  },
};
