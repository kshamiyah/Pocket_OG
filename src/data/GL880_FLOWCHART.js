export const GL880_DELIVERY_FLOWCHART = {
  id: "GL880_DELIVERY",
  title: "ICP Diagnosis & Delivery Pathway",
  subtitle: "GL880 · Intrahepatic Cholestasis of Pregnancy",
  startId: "present",
  nodes: {

    "present": {
      type: "action",
      title: "Itch Without Rash",
      text: "Intense itching (classically palms/soles, worse at night) with no rash — send non-fasting bile acids (BA) and LFTs.",
      items: [
        "Most itching in pregnancy (3 in 4 cases) is benign",
        "Check BP and urine at every review — pre-eclampsia is commoner in ICP (12.2%)",
        "No additional scans required — ICP is not associated with IUGR and scans do not predict stillbirth",
      ],
      next: "diagnose",
    },

    "diagnose": {
      type: "decision",
      title: "Bile acids > 19 µmol/L?",
      text: "Non-fasting BA > 19 µmol/L is diagnostic of ICP.",
      options: [
        { label: "Yes — ICP confirmed", sublabel: "Stratify by peak bile acid level", next: "stratify" },
        { label: "No — normal BA", sublabel: "If itch persists, repeat BA + LFTs at 1–2 week intervals", next: "not-icp" },
      ],
    },

    "not-icp": {
      type: "end",
      title: "ICP Not Confirmed",
      text: "Normal bile acids.",
      items: [
        "If mildly raised, recheck BA 1 week later (may normalise)",
        "Ongoing itch with normal BA/LFTs: repeat both at 1–2 week intervals",
        "Consider other benign causes of itching",
      ],
    },

    "stratify": {
      type: "decision",
      title: "Peak bile acid level?",
      text: "Severity guides monitoring, delivery timing and labour monitoring.",
      options: [
        { label: "19–39 µmol/L (mild)", sublabel: "Weekly testing from 38 weeks", next: "mild" },
        { label: "40–99 µmol/L (moderate)", sublabel: "Weekly testing from 35 weeks; refer ANC", next: "moderate" },
        { label: "≥ 100 µmol/L (severe)", sublabel: "Refer Miss Brooks' ANC", next: "severe" },
      ],
    },

    "mild": {
      type: "end",
      title: "Mild ICP (BA 19–39)",
      text: "Weekly testing from 38 weeks.",
      items: [
        "Planned birth by 40 weeks (if no other risk factors)",
        "Intermittent auscultation acceptable; homebirth and birth centre not contraindicated (if no other indication for CEFM)",
        "Symptomatic itch relief: aqueous cream ± menthol, chlorphenamine, loratadine/cetirizine",
      ],
    },

    "moderate": {
      type: "end",
      title: "Moderate ICP (BA 40–99)",
      text: "Weekly testing from 35 weeks (in case levels rise > 100). Refer to ANC.",
      items: [
        "Planned birth at 38–39 weeks (if no other risk factors)",
        "CEFM recommended in labour — higher likelihood of meconium and neonatal care",
        "UDCA may be considered from 34–36 weeks (12 mg/kg/day) — senior prescription only; not routine",
        "Co-morbidities (pre-eclampsia, diabetes, multiple pregnancy) with BA > 40 may justify earlier delivery",
      ],
    },

    "severe": {
      type: "alert",
      title: "Severe ICP (BA ≥ 100) — Highest Stillbirth Risk",
      text: "Stillbirth risk significantly increased only above 100 µmol/L (≈ 3.5%). Refer specifically to Miss Brooks' ANC.",
      items: [
        "Planned birth at 35–36 weeks — if already past this gestation, arrange IOL imminently",
        "CEFM must be offered in labour",
        "Advise that the baby is more likely to need neonatal care",
        "UDCA may be considered (senior prescription); Vitamin K (Menadiol 10 mg daily) if clotting abnormal",
      ],
    },

  },
};
