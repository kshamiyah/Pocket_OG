export const GL983_DKA_FLOWCHART = {
  id: "GL983_DKA",
  title: "DKA Emergency Pathway",
  subtitle: "GL983 · Diabetic Ketoacidosis in Pregnancy",
  startId: "suspect",
  nodes: {
    "suspect": {
      type: "alert",
      title: "Suspect DKA — Medical Emergency",
      text: "Any woman known to have diabetes who feels unwell should be invited in for assessment at whatever gestation. DKA may present with normal or only modestly raised glucose — do NOT rely on glucose alone.",
      items: [
        "Stillbirth rate 160 per 1000 births; maternal mortality 5–10% in T1D",
        "Occurs in T1D, T2D and gestational diabetes",
        "Symptoms: nausea, vomiting, abdominal pain, polyuria, polydipsia, tachypnoea, dehydration, distinct breath smell",
        "Causes: infection, hyperemesis, neglect of diabetes care, steroids, faulty equipment",
      ],
      next: "diagnose",
    },
    "diagnose": {
      type: "decision",
      title: "DKA diagnostic criteria met?",
      text: "Known diabetes (any type) PLUS ketones AND acidosis (use venous gas).",
      options: [
        { label: "Yes — criteria met", sublabel: "Ketones ≥ 2+ urine or > 3.0 mmol/L blood · pH < 7.3 and/or bicarbonate < 15 mmol/L", next: "escalate" },
        { label: "No — criteria not met", sublabel: "Not DKA — treat underlying cause, monitor", next: "not-dka" },
      ],
    },
    "not-dka": {
      type: "end",
      title: "Not DKA — Treat Cause & Monitor",
      text: "Investigate and treat the precipitant; keep diabetes team involved.",
      items: [
        "Repeat ketones/gas if clinical picture worsens",
        "Consider VRII if glucose persistently elevated (see VRII protocol)",
        "Low threshold to re-evaluate — DKA can evolve",
      ],
    },
    "escalate": {
      type: "action",
      title: "Escalate & Investigate",
      text: "Assess ABC; site 2 × IV cannulae (grey, 16G). If on insulin pump: discontinue and start FRII.",
      items: [
        "Inform obstetric registrar, obstetric consultant and anaesthetic consultant early",
        "Request medical review and endocrine registrar (bleep 199/192)",
        "Bloods: FBC, U&Es, glucose + ketones, bicarbonate, venous lactate, cultures; G&S; ABG if SpO₂ low; urine MC&S; consider CXR/ECG",
        "Consider ITU/HDU; CTG once stabilised",
        "15-min BP/pulse; hourly respiration & MOWS; 4-hourly temperature",
      ],
      next: "fluids",
    },
    "fluids": {
      type: "action",
      title: "IV Fluid Replacement (0.9% NaCl)",
      text: "Replace ~5 litres over the schedule below. Give a 500 mL bolus first if SBP < 90 mmHg.",
      items: [
        "1 litre over 1 hour", "1 litre over 2 hours", "1 litre over 2 hours",
        "1 litre over 4 hours", "1 litre over 6–8 hours",
        "Add potassium from the second bag onwards per level below",
      ],
      next: "potassium",
    },
    "potassium": {
      type: "decision",
      title: "Serum potassium level?",
      text: "Aim 4.0–5.5 mmol/L. KCl must NOT be infused faster than 10 mmol/hr.",
      options: [
        { label: "< 3.5 mmol/L", sublabel: "40 mmol KCl per litre + refer endocrine/outreach", next: "frii" },
        { label: "3.5–5.5 mmol/L", sublabel: "20 mmol KCl per litre", next: "frii" },
        { label: "> 5.5 mmol/L", sublabel: "No potassium this bag", next: "frii" },
      ],
    },
    "frii": {
      type: "action",
      title: "Fixed Rate Insulin Infusion (FRII)",
      text: "50 units soluble insulin (Humulin S or Actrapid) in 49.5 mL NaCl 0.9% via syringe driver. Weight-based hourly rate.",
      items: [
        "60–69 kg: 6 u/hr · 70–79: 7 · 80–89: 8 · 90–99: 9 · 100–109: 10 · 110–119: 11 · 120–129: 12 · 130–139: 13 · ≥140 kg: 14 u/hr",
        "When BG ≤ 14 mmol/L: add 10% Dextrose at 125 mL/hr (250 mL/hr if BG < 7)",
        "Continue long-acting insulin at usual dose and time",
        "Increase rate by 1 mL/hr if target not met and no pump malfunction",
      ],
      next: "resolution",
    },
    "resolution": {
      type: "decision",
      title: "DKA resolved?",
      text: "First 6 hours: BG and ketones at least hourly; blood gas at 1, 2, 4, 6, 8 hours.",
      options: [
        { label: "Yes — blood ketones < 0.3 AND pH > 7.3", sublabel: "Resolution criteria met", next: "resolved" },
        { label: "No — not yet resolved", sublabel: "Continue FRII and monitoring", next: "continue" },
      ],
    },
    "continue": {
      type: "action",
      title: "Continue Treatment & Monitoring",
      text: "Keep going until resolution criteria are met.",
      items: [
        "Hourly BG and ketones; gas at 1/2/4/6/8 hours for pH and potassium",
        "Monitor fluid status and urine output",
        "CTG continuously — FHR abnormalities may improve as the mother improves",
        "Re-titrate potassium and FRII as values change",
      ],
      next: "resolution",
    },
    "resolved": {
      type: "end",
      title: "Resolved — Convert Insulin",
      text: "Blood ketones < 0.3 mmol/L AND pH > 7.3.",
      items: [
        "If eating and drinking: convert to subcutaneous insulin (give short-acting before stopping FRII)",
        "If unable to eat/drink: switch to VRII and start 5% Dextrose if BG < 14 mmol/L",
        "Keep diabetes/endocrine team involved for ongoing management",
      ],
    },
  },
};
