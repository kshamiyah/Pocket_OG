// Ovarian Hyperstimulation Syndrome — assessment & management.
// RCOG Green-Top Guideline No. 5 (4th edition, BJOG 2026;133:e50–e69,
// DOI 10.1111/1471-0528.70195).

export const GTG5_OHSS_FLOWCHART = {
  id: "GTG5_OHSS",
  title: "Ovarian Hyperstimulation Syndrome",
  subtitle: "RCOG Green-top Guideline No. 5 · assessment & management",
  startId: "start",
  nodes: {

    "start": {
      type: "action",
      title: "Suspected OHSS — Fertility Treatment or Recent hCG Trigger",
      text: "No specific diagnostic test exists — diagnosis is clinical, supported by exam, bloods and imaging. Elevated haematocrit with low serum osmolality/sodium is characteristic.",
      items: [
        "Early OHSS: within 7 days of hCG trigger — usually excessive ovarian response",
        "Late OHSS: ≥10 days after trigger — usually driven by endogenous hCG from early pregnancy; tends to be more prolonged/severe",
      ],
      next: "differentials",
    },

    "differentials": {
      type: "decision",
      title: "Severe Pain, Pyrexia or Peritonism?",
      text: "OHSS itself rarely causes these — actively exclude other causes first.",
      options: [
        {
          label: "Yes — one or more present",
          sublabel: "Pelvic infection/abscess, appendicitis, ovarian torsion/cyst rupture, bowel perforation, ectopic pregnancy",
          next: "exclude_alt",
        },
        { label: "No — findings consistent with OHSS alone", next: "classify" },
      ],
    },

    "exclude_alt": {
      type: "alert",
      title: "Exclude Alternative Diagnoses First",
      text: "Get advice from the fertility specialists. Manage the alternative diagnosis per its own pathway before attributing symptoms to OHSS alone.",
      next: "classify",
    },

    "classify": {
      type: "decision",
      title: "Classify Severity (RCOG/HFEA)",
      options: [
        {
          label: "Mild",
          sublabel: "Mild pain/bloating · ovarian size <8cm · HCT <0.40",
          next: "outpatient",
        },
        {
          label: "Moderate",
          sublabel: "Moderate pain, nausea ± vomiting · ovaries 8–12cm + ascites on US · HCT <0.45",
          next: "outpatient",
        },
        {
          label: "Severe",
          sublabel: "Clinical ascites · ovaries usually >12cm · HCT >0.45 · Na <135, K >5.0, albumin <35, oliguria",
          next: "severity_severe",
        },
        {
          label: "Critical",
          sublabel: "Tense ascites/pleural effusion · HCT >0.55, WCC >25,000 · anuria, thrombosis, ARDS",
          next: "critical",
        },
      ],
    },

    "severity_severe": {
      type: "decision",
      title: "Severe OHSS — Suitable for Outpatient Care?",
      text: "Outpatient care is appropriate in selected severe cases with clear criteria and access to admission if needed.",
      options: [
        {
          label: "Yes — selected, stable",
          sublabel: "Able to attend follow-up, pain controlled, tolerating oral intake",
          next: "outpatient",
        },
        {
          label: "No — admit",
          sublabel: [
            "Unable to attend regular follow-up",
            "Unable to achieve satisfactory pain control",
            "Unable to maintain fluid intake (nausea/vomiting)",
            "Worsening despite outpatient care",
          ],
          next: "inpatient",
        },
      ],
    },

    "critical": {
      type: "alert",
      title: "Critical OHSS — Multidisciplinary / Consider ICU",
      text: "Seek anaesthetic/ITU/renal/respiratory/haematology input. Features of critical OHSS should prompt consideration of intensive care.",
      next: "inpatient",
    },

    "outpatient": {
      type: "action",
      title: "Outpatient Care",
      items: [
        "Fluid: drink to thirst (oral as effective as parenteral); don't routinely replace electrolytes/albumin — reflects a reset osmostat, not true loss",
        "Analgesia: paracetamol/oral opioids; AVOID NSAIDs (renal risk)",
        "Thromboprophylaxis: moderate OHSS — evaluate risk factors, consider stockings/LMWH. Severe OHSS — stockings AND LMWH",
        "Outpatient paracentesis (abdominal or transvaginal, US-guided) can reduce admission",
        "Review every 2–3 days if stable; urgent review for any worsening symptoms",
        "Follow up until resolution (typically 7–10 days; longer if pregnant)",
      ],
      next: "worsening_check",
    },

    "worsening_check": {
      type: "decision",
      title: "Any Signs of Worsening?",
      options: [
        {
          label: "Yes",
          sublabel: [
            "Increasing distension/pain, nausea/vomiting, breathlessness",
            "Tachycardia/hypotension",
            "Urine output <1000mL/24h (or <300mL/24h)",
            "Weight gain, rising haematocrit, abnormal LFTs/renal function",
          ],
          next: "inpatient",
        },
        { label: "No — continue outpatient monitoring", next: "resolution" },
      ],
    },

    "inpatient": {
      type: "action",
      title: "Inpatient Care",
      items: [
        "Daily: weight, abdominal girth, HR/RR/BP/temp, fluid balance, SpO2, FBC (haematocrit), U&E, LFTs, clotting",
        "Fluid: oral preferred; IV crystalloid for initial correction only (can worsen ascites); human albumin 20% (50–100g/100mL over 4h, repeat 4–12hrly) for persistent haemoconcentration. Do NOT use HES (withdrawn — increased mortality)",
        "Diuretics only in an MDT setting with central venous monitoring",
        "Paracentesis if: severe distension/pain, respiratory compromise, or oliguria despite adequate fluids — always US-guided",
        "Pleural effusion: chest drain if symptomatic; mediastinal shift/tachypnoea >15/min needs anaesthetic/respiratory input",
        "Thromboprophylaxis: anti-embolism stockings AND LMWH for all admitted with OHSS; continue to end of first trimester if pregnant",
        "Surgery if: suspected torsion, internal bleeding from ruptured cyst, or ectopic pregnancy",
      ],
      next: "vte_watch",
    },

    "vte_watch": {
      type: "alert",
      title: "Stay Alert for Atypical Thromboembolism",
      text: "OHSS thrombosis often affects upper-body/arterial sites and can present weeks after apparent resolution. Unusual symptoms — dizziness, visual loss, neck pain — warrant urgent assessment.",
      items: [
        "If suspected: start therapeutic anticoagulation while arranging imaging; involve haematology/maternal medicine",
      ],
      next: "resolution",
    },

    "resolution": {
      type: "end",
      title: "Follow Up to Resolution",
      items: [
        "Recovery signalled by diuresis, normalising haematocrit/electrolytes/osmolality, falling girth/weight",
        "If pregnant: increased risk of pre-eclampsia and preterm birth — inform the woman and plan surveillance accordingly",
        "Ongoing contact with the fertility clinic/treating centre until resolution; offer counselling/peer support",
        "Report severe/critical cases to the HFEA per local process; report any OHSS-related death to MBRRACE-UK",
      ],
    },

  },
};
