// RCOG GTG38 — Management of Gestational Trophoblastic Disease
// Evacuation through to follow-up and GTN triage.

export const GTG38_GTD_PATHWAY_FLOWCHART = {
  id: "GTG38_GTD_PATHWAY",
  title: "Molar Pregnancy Pathway",
  subtitle: "GTG38 · Evacuation to follow-up",
  startId: "suspected",
  nodes: {

    "suspected": {
      type: "action",
      title: "Suspected Molar Pregnancy",
      text: "Irregular bleeding, uterus large for dates, hyperemesis, or early pre-eclampsia (<20 weeks).",
      items: ["USS may show the classic vesicular pattern, but is often normal/non-specific — histology confirms"],
      next: "evacuation",
    },

    "evacuation": {
      type: "action",
      title: "Uterine Evacuation",
      items: [
        "Suction curettage — method of choice, whatever the uterine size",
        "Avoid medical evacuation where possible — risk of trophoblastic embolisation",
        "Anti-D if Rh-negative",
        "Send all tissue for histology",
      ],
      next: "histology",
    },

    "histology": {
      type: "decision",
      title: "Histology Confirms GTD?",
      options: [
        { label: "Yes", next: "register" },
        { label: "No", next: "routine-care" },
      ],
    },

    "routine-care": {
      type: "end",
      title: "Routine Post-Miscarriage Care",
      text: "No GTD follow-up needed.",
    },

    "register": {
      type: "action",
      title: "Register with a Screening Centre",
      text: "Charing Cross, Sheffield, or Dundee — centralised hCG follow-up.",
      next: "hcg-monitoring",
    },

    "hcg-monitoring": {
      type: "decision",
      title: "hCG Trend",
      options: [
        { label: "Falls and normalises", next: "normalises" },
        { label: "Plateaus or rises — GTN", next: "gtn-risk" },
      ],
    },

    "normalises": {
      type: "end",
      title: "Follow-Up Duration",
      items: [
        "Normalised within 8 weeks: follow up 6 months from evacuation",
        "Normalised after 8 weeks: follow up 6 months from the first normal result",
        "Avoid pregnancy, barrier contraception, and avoid an IUD until hCG is normal",
      ],
    },

    "gtn-risk": {
      type: "decision",
      title: "FIGO/WHO Risk Score",
      options: [
        { label: "Low risk", next: "low-risk-gtn" },
        { label: "High risk", next: "high-risk-gtn" },
      ],
    },

    "low-risk-gtn": {
      type: "end",
      title: "Low-Risk GTN",
      text: "Single-agent chemotherapy (typically methotrexate) at the specialist centre.",
    },

    "high-risk-gtn": {
      type: "end",
      title: "High-Risk GTN",
      text: "Multi-agent chemotherapy at the specialist centre — cure rates remain very high.",
    },

  },
};
