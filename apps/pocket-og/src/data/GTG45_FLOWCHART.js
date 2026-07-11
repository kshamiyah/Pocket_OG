// GTG45 — Birth After Previous Caesarean Birth (RCOG Green-top Guideline
// No. 45, October 2015). Intrapartum monitoring and scar-rupture
// recognition pathway for planned VBAC labour.

export const GTG45_VBAC_FLOWCHART = {
  id: "GTG45_VBAC",
  title: "VBAC Labour: Monitoring & Scar Rupture",
  subtitle: "GTG45 · Planned vaginal birth after caesarean",
  startId: "monitoring-check",
  nodes: {

    "monitoring-check": {
      type: "decision",
      title: "Continuous CTG & IV Access in Place?",
      text: "Required for the whole of a VBAC labour — a change in the fetal heart pattern is often the earliest sign of a scar problem.",
      options: [
        { label: "Yes — established", next: "red-flags" },
        { label: "No — not yet established", next: "establish" },
      ],
    },

    "establish": {
      type: "action",
      title: "Establish Monitoring Now",
      text: "Continuous CTG for the remainder of labour, and consider IV access. Confirm birth is planned in a unit with immediate caesarean and transfusion access.",
      next: "red-flags",
    },

    "red-flags": {
      type: "decision",
      title: "Any Red Flags for Scar Rupture?",
      text: "Abnormal CTG, atypical or persistent abdominal pain, scar tenderness, new vaginal bleeding, sudden cessation of effective contractions, maternal tachycardia, or loss of station of the presenting part.",
      options: [
        { label: "Yes — one or more present", next: "emergency" },
        { label: "No — none present", next: "continue" },
      ],
    },

    "continue": {
      type: "end",
      title: "Continue Routine VBAC Care",
      text: "Keep continuous CTG running throughout labour and reassess regularly — a normal picture now doesn't remove the need for ongoing vigilance.",
    },

    "emergency": {
      type: "alert",
      title: "Suspected Uterine Rupture — Category 1 Caesarean",
      text: "Call for senior help immediately. An abnormal CTG alone in a VBAC labour is enough to act on — do not wait for every feature to be present.",
      items: [
        "This is an obstetric emergency: proceed to category 1 caesarean section",
        "Alert anaesthetic, neonatal and senior obstetric teams",
      ],
    },

  },
};
