// GTG42 — Shoulder Dystocia (RCOG Green-top Guideline No. 42, 2nd edition, March 2012)
// Emergency action pathway. Decision support only — call for senior help
// immediately and follow your local major-obstetric-emergency protocol.

export const GTG42_SHOULDER_FLOWCHART = {
  id: "GTG42_SHOULDER",
  title: "Shoulder Dystocia",
  subtitle: "GTG42 · Impacted shoulders after the head delivers",
  startId: "diagnose",
  nodes: {

    "diagnose": {
      type: "alert",
      title: "Shoulder Dystocia: Call for Help Now",
      text: "Head delivered, restitution fails, chin retracts against the perineum ('turtle sign'), and gentle traction does not deliver the anterior shoulder.",
      items: [
        "Pull the emergency buzzer — senior midwife, senior obstetrician, anaesthetist and neonatal team",
        "Note the time the head delivered",
        "Stop the mother pushing",
      ],
      next: "position",
    },

    "position": {
      type: "action",
      title: "McRoberts' Position",
      text: "Lie the mother flat, remove leg supports, buttocks to the edge of the bed. Hyperflex both hips, bringing the thighs to the abdomen.",
      items: [
        "Do NOT apply fundal pressure — worsens impaction and risks uterine rupture",
        "Avoid excessive traction or lateral/downward flexion of the head and neck — risks brachial plexus injury",
      ],
      next: "mcroberts-check",
    },

    "mcroberts-check": {
      type: "decision",
      title: "Delivered With McRoberts' Alone?",
      options: [
        { label: "Yes — delivered", next: "delivered" },
        { label: "No — still obstructed", next: "suprapubic" },
      ],
    },

    "suprapubic": {
      type: "action",
      title: "Add Suprapubic Pressure",
      text: "Assistant applies pressure just above the symphysis pubis, directed to push the anterior shoulder towards the fetal chest, away from the symphysis. Consider an episiotomy if it will help access for internal manoeuvres.",
      next: "suprapubic-check",
    },

    "suprapubic-check": {
      type: "decision",
      title: "Delivered With Suprapubic Pressure?",
      options: [
        { label: "Yes — delivered", next: "delivered" },
        { label: "No — still obstructed", next: "internal" },
      ],
    },

    "internal": {
      type: "action",
      title: "Internal Manoeuvres / All-Fours",
      text: "Move to internal manoeuvres or an all-fours (Gaskin) position — choose based on maternal mobility and operator experience. Keep moving through the sequence rather than repeating a failed manoeuvre.",
      items: [
        "Deliver the posterior arm: follow the posterior arm to the elbow, flex it, sweep it across the chest",
        "Rubin manoeuvre: pressure on the posterior aspect of the accessible shoulder, adducting and rotating it",
        "Woods screw manoeuvre: pressure on the anterior aspect of the posterior shoulder's clavicle, rotating towards the fetal back — reverse direction if unsuccessful",
        "All-fours (Gaskin): turn the mother onto hands and knees",
      ],
      next: "internal-check",
    },

    "internal-check": {
      type: "decision",
      title: "Delivered With Internal Manoeuvres / All-Fours?",
      options: [
        { label: "Yes — delivered", next: "delivered" },
        { label: "No — still obstructed after repeated attempts", next: "last-resort" },
      ],
    },

    "last-resort": {
      type: "alert",
      title: "Last Resort — Most Senior Help Now",
      text: "Rarely needed — reserve for when all standard manoeuvres fail, usually because the posterior arm can't be accessed.",
      items: [
        "Cleidotomy — deliberate fracture of the anterior clavicle",
        "Zavanelli manoeuvre — cephalic replacement + immediate caesarean section",
        "Symphysiotomy — surgical division of the symphyseal ligament",
        "Abdominal rescue — hysterotomy, rotate shoulders from above with traction from below",
      ],
      next: "delivered",
    },

    "delivered": {
      type: "end",
      title: "Delivered — Document & Examine",
      text: "Document immediately: head-to-body interval, fetal position, every manoeuvre used and in what order, staff present, blood loss/perineal trauma, cord gases and Apgars.",
      items: [
        "Full neonatal examination for clavicle/humerus fracture and brachial plexus function before the baby leaves the room",
        "Offer the woman and her partner a debrief",
        "Report through local incident-reporting systems",
      ],
    },

  },
};
