// GTG50 — Umbilical Cord Prolapse (RCOG Green-top Guideline No. 50, Nov 2014)
// Emergency action pathway. Decision support only — call for senior help early
// and follow your local major-obstetric-emergency protocol.

export const GTG50_CORD_FLOWCHART = {
  id: "GTG50_CORD",
  title: "Cord Prolapse: Emergency",
  subtitle: "GTG50 · Umbilical Cord Prolapse",
  startId: "diagnose",
  nodes: {

    "diagnose": {
      type: "alert",
      title: "Cord Prolapse: Call for Help Now",
      text: "Cord palpable/visible past the presenting part with ruptured membranes, or fetal bradycardia / abnormal FHR immediately after rupture of membranes. This is an obstetric emergency.",
      items: [
        "Pull the emergency buzzer — summon senior obstetrician, anaesthetist, theatre team and neonatal team",
        "Note the time; prepare for urgent birth",
        "Suspect occult prolapse if FHR deteriorates after ROM even with no palpable cord",
      ],
      next: "relieve",
    },

    "relieve": {
      type: "action",
      title: "Relieve Pressure on the Cord",
      text: "Minimise cord compression while preparing for birth.",
      items: [
        "Elevate the presenting part — manually (gloved hand in the vagina) push it up off the cord, and/or fill the bladder",
        "Position: knee–chest (face-down) or exaggerated left-lateral / head-down (Trendelenburg) tilt",
        "Handle the cord as little as possible; keep it warm and moist — do NOT try to force it back inside",
        "Fill the bladder (≈500–750 mL via catheter) if delivery is likely to be delayed (e.g. transfer) — remember to empty it before delivery",
        "Continuous fetal heart rate monitoring throughout",
      ],
      next: "tocolysis",
    },

    "tocolysis": {
      type: "action",
      title: "Consider Tocolysis",
      text: "If there are persistent fetal heart rate abnormalities after the above measures — particularly while preparing for caesarean — consider acute tocolysis.",
      items: [
        "e.g. terbutaline 0.25 mg subcutaneously",
        "Tocolysis does not replace the need to expedite birth",
      ],
      next: "mode",
    },

    "mode": {
      type: "decision",
      title: "Is Immediate Safe Vaginal Birth Possible?",
      text: "Mode of birth depends on whether vaginal delivery is imminent and safe.",
      options: [
        { label: "Fully dilated, birth imminent and safe", sublabel: "Experienced operator; e.g. instrumental birth", next: "vaginal" },
        { label: "Not fully dilated / birth not imminent", sublabel: "Category 1 caesarean section", next: "cs" },
      ],
    },

    "vaginal": {
      type: "end",
      title: "Expedite Vaginal Birth",
      text: "Vaginal birth — usually operative — can be attempted at full dilatation if it is safe and can be achieved quickly, by an experienced operator.",
      items: [
        "If vaginal birth is not rapidly achievable, proceed to caesarean section",
        "Neonatal team present for the birth",
        "Document timings, decisions and cord gases",
      ],
    },

    "cs": {
      type: "alert",
      title: "Category 1 Caesarean Section",
      text: "Aim for the fastest safe birth. Continue cord-relief measures (manual elevation and/or filled bladder) until delivery.",
      items: [
        "Empty the bladder immediately before skin incision if it was filled",
        "Neonatal team present; anticipate the need for resuscitation",
        "Outcome is usually good when delivery is expedited — document decision-to-delivery interval and cord gases",
      ],
    },

  },
};
