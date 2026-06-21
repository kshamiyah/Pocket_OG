export const ITCHING_PROTOCOL = {
  id: "itching",
  title: "Itching in Pregnancy",
  subtitle: "Obstetric cholestasis screen & management",
  category: "antenatal",
  guideline: "RBH GL880",
  color: "amber",
  startId: "rash_q",
  nodes: {

    // ─── Opening question ──────────────────────────────────────────────────────

    "rash_q": {
      type: "question",
      question: "Is there a rash?",
      subtitle: "ICP typically causes no primary rash — scratch marks only",
      options: [
        { label: "No rash — scratch marks only, or no skin changes",  next: "distribution_q" },
        { label: "Yes — there is a visible rash",                     next: "rash_present"   },
      ],
    },

    "rash_present": {
      type: "treatment",
      title: "Rash present — consider alternative diagnoses",
      source: { gl: "GL880", sectionId: "icp-overview", label: "ICP — Overview, Symptoms & Risks" },
      sections: [
        {
          title: "Common causes of rash with itch in pregnancy",
          items: [
            "PUPPP / polymorphic eruption of pregnancy — urticarial plaques, starts in striae, periumbilical sparing",
            "Eczema or contact dermatitis — history of atopy, localised",
            "Scabies — burrows between fingers, web spaces, nocturnal itch",
            "Pemphigoid gestationis — rare; blisters on abdomen and limbs, positive DIF",
          ],
        },
        {
          title: "Still check for ICP",
          items: [
            "ICP is characterised by intense pruritus in the absence of a skin rash — a rash makes ICP less likely but does not exclude it",
            "Send bile acids and LFTs regardless if any doubt",
            "Continue to the history and investigations if any doubt",
          ],
        },
      ],
      next: "distribution_q",
    },

    // ─── History ──────────────────────────────────────────────────────────────

    "distribution_q": {
      type: "question",
      question: "Where is the itch worst?",
      subtitle: "Distribution helps identify ICP",
      options: [
        { label: "Palms and soles — or worse at night",    sublabel: "Classic ICP pattern",          next: "history"  },
        { label: "Generalised — no clear pattern",         sublabel: "Could still be ICP",            next: "history"  },
        { label: "Localised — belly, legs, or one area",   sublabel: "Less typical of ICP",           next: "history"  },
      ],
    },

    "history": {
      type: "checklist",
      title: "Take a focused history",
      source: { gl: "GL880", sectionId: "icp-overview", label: "ICP — Overview, Symptoms & Risks" },
      items: [
        "Onset, duration — palms and soles, generalised, nocturnal worsening",
        "Dark urine or pale stools — biliary obstruction features",
        "Previous ICP in this or prior pregnancies — high risk of recurrence in subsequent pregnancies",
        "Family history of ICP or liver disease",
        "Current medications — any hepatotoxic drugs",
        "Other common causes: eczema, contact dermatitis, scabies, PUPPP — most itching in pregnancy (3 in 4 cases) is due to other benign causes",
      ],
      next: "examination",
    },

    "examination": {
      type: "checklist",
      title: "Examine the patient",
      source: { gl: "GL880", sectionId: "icp-overview", label: "ICP — Overview, Symptoms & Risks" },
      items: [
        "BP and urinalysis — incidence of pre-eclampsia is higher in ICP (12.2% vs 3.4%); check at every review",
        "Inspect skin — rash present or absent; scratch marks and excoriation",
        "Jaundice — rare in ICP (< 1%) but important to identify",
        "Abdominal examination — SFH, fetal lie, auscultate FH",
      ],
      next: "investigations",
    },

    "investigations": {
      type: "checklist",
      title: "Investigations",
      source: { gl: "GL880", sectionId: "icp-diagnosis", label: "ICP — Diagnosis & Monitoring" },
      items: [
        "Non-fasting bile acids (BA) — key diagnostic test; BA > 19 µmol/L is diagnostic of ICP",
        "LFTs — ALT, AST, ALP, bilirubin, GGT",
        "Routine coagulation testing is NOT recommended for uncomplicated ICP",
        "Note: results may take hours — arrange review once back",
        "Most itching in pregnancy (3 in 4 cases) is due to other benign causes — await results before diagnosing ICP",
      ],
      next: "results_q",
    },

    // ─── Key branch: bile acid result ─────────────────────────────────────────

    "results_q": {
      type: "question",
      question: "Are the bile acid results available?",
      options: [
        { label: "Yes — results are back",        next: "ba_level_q"  },
        { label: "Not yet — still pending",        next: "pending"     },
      ],
    },

    "pending": {
      type: "treatment",
      title: "Results pending — interim management",
      source: { gl: "GL880", sectionId: "icp-treatment", label: "ICP — Treatment (UDCA & Symptomatic)" },
      sections: [
        {
          title: "While awaiting results",
          items: [
            "Do not diagnose or exclude ICP until bile acids are available",
            "Symptomatic relief only — topical and antihistamine",
            "Advise patient to return when results are available or sooner if symptoms worsen",
            "Advise: return immediately if dark urine, jaundice, or significantly worse itch",
          ],
        },
        {
          title: "Symptomatic relief",
          drugs: [
            { drug: "Aqueous cream + menthol 1%",      dose: "Apply to affected areas PRN",  note: "First-line topical emollient"       },
            { drug: "Chlorphenamine",                   dose: "4 mg TDS oral",                note: "Sedative antihistamine — useful at night" },
            { drug: "Loratadine / Cetirizine",         dose: "10 mg OD oral",                note: "Non-sedating antihistamine"         },
          ],
        },
      ],
      next: "documentation",
    },

    "ba_level_q": {
      type: "question",
      question: "What is the bile acid level?",
      subtitle: "Non-fasting bile acids",
      options: [
        { label: "< 19 µmol/L",   sublabel: "Normal",        next: "not_icp"      },
        { label: "19–39 µmol/L",  sublabel: "Mild ICP",      next: "mild_icp"     },
        { label: "40–99 µmol/L",  sublabel: "Moderate ICP",  next: "moderate_icp" },
        { label: "≥ 100 µmol/L",  sublabel: "Severe ICP",    next: "severe_icp"   },
      ],
    },

    // ─── Management by severity ────────────────────────────────────────────────

    "not_icp": {
      type: "treatment",
      title: "Normal Bile Acids — ICP Not Confirmed",
      badge: { label: "BA <19 µmol/L", color: "green" },
      source: { gl: "GL880", sectionId: "icp-diagnosis", label: "ICP — Diagnosis & Monitoring" },
      sections: [
        {
          title: "Management",
          items: [
            "ICP not confirmed at this stage — BA > 19 µmol/L is required for diagnosis",
            "If borderline — recheck BA 1 week later; may normalise, making ICP obsolete",
            "Persistent itch with normal BA/LFTs: repeat both at 1–2 week intervals",
            "Advise patient to return if itch worsens, dark urine, or jaundice develops",
          ],
        },
        {
          title: "Symptomatic relief",
          drugs: [
            { drug: "Aqueous cream + menthol 1%",  dose: "Apply PRN",         note: "First-line topical emollient"       },
            { drug: "Chlorphenamine",               dose: "4 mg TDS oral",     note: "Sedative antihistamine — useful at night" },
            { drug: "Loratadine / Cetirizine",     dose: "10 mg OD oral",     note: "Non-sedating antihistamine"         },
          ],
        },
      ],
      next: "documentation",
    },

    "mild_icp": {
      type: "treatment",
      title: "Mild ICP — Outpatient Management",
      badge: { label: "BA 19–39 µmol/L", color: "amber" },
      source: { gl: "GL880", sectionId: "icp-delivery", label: "ICP — Timing of Delivery & Labour Monitoring" },
      sections: [
        {
          title: "Monitoring",
          items: [
            "Weekly bile acids and LFTs from 38 weeks",
            "BP and urinalysis at every review — pre-eclampsia incidence is higher in ICP",
            "No additional growth scans required — ICP not associated with IUGR; scans do not predict stillbirth",
            "Intermittent auscultation acceptable in labour — homebirth and birth centre not contraindicated (if no other indication for CEFM)",
          ],
        },
        {
          title: "Delivery timing",
          items: [
            "Consider planned birth by 40 weeks (if no other risk factors)",
          ],
        },
        {
          title: "Symptomatic relief",
          drugs: [
            { drug: "Aqueous cream + menthol 1%",  dose: "Apply PRN",         note: "First-line topical emollient"       },
            { drug: "Chlorphenamine",               dose: "4 mg TDS oral",     note: "Sedative antihistamine — useful at night" },
            { drug: "Loratadine / Cetirizine",     dose: "10 mg OD oral",     note: "Non-sedating antihistamine"         },
          ],
        },
      ],
      next: "documentation",
    },

    "moderate_icp": {
      type: "treatment",
      title: "Moderate ICP — Refer to Consultant ANC",
      badge: { label: "BA 40–99 µmol/L", color: "amber" },
      source: { gl: "GL880", sectionId: "icp-delivery", label: "ICP — Timing of Delivery & Labour Monitoring" },
      sections: [
        {
          title: "Monitoring",
          items: [
            "Weekly bile acids and LFTs from 35 weeks — levels may rise above 100 µmol/L",
            "Refer to consultant obstetric antenatal clinic (ANC) to discuss management and timing of delivery",
            "BP and urinalysis at every review — incidence of pre-eclampsia is higher in ICP (12.2% vs 3.4%)",
            "CEFM recommended in labour — higher likelihood of meconium and neonatal care needed",
          ],
        },
        {
          title: "Delivery timing",
          items: [
            "Consider planned birth at 38–39 weeks (if no other risk factors)",
            "Co-morbidities (pre-eclampsia, diabetes, multifetal pregnancy) with BA > 40 µmol/L may increase stillbirth risk — consider earlier delivery",
          ],
        },
        {
          title: "Consider UDCA (senior prescription only)",
          drugs: [
            { drug: "UDCA (ursodeoxycholic acid)", dose: "12 mg/kg/day in divided doses", note: "Consider if BA > 40 µmol/L from 34–36 weeks. Not licensed in pregnancy — must only be prescribed after consultation with a senior clinician (middle grade or above)" },
          ],
        },
      ],
      next: "documentation",
    },

    "severe_icp": {
      type: "escalation",
      title: "Severe ICP — Escalate to Consultant",
      alert: "Stillbirth risk is significantly increased when BA > 100 µmol/L (risk ~3.5%). Do not manage this alone.",
      source: { gl: "GL880", sectionId: "icp-delivery", label: "ICP — Timing of Delivery & Labour Monitoring" },
      items: [
        "Refer urgently to consultant obstetrician — refer specifically to Miss Brooks' ANC; do not discharge",
        "Consider planned birth at 35–36 weeks — if already past this gestation, arrange IOL imminently",
        "CEFM must be offered in labour",
        "Advise patient: baby is more likely to require neonatal care at this gestation",
        "Vitamin K (Menadiol 10 mg daily) if clotting is abnormal",
        "UDCA (12 mg/kg/day) — may be considered; must only be prescribed after consultation with a senior clinician (middle grade or above)",
        "Discuss risk of stillbirth with patient and document the conversation",
      ],
      next: "documentation",
    },

    // ─── Documentation ────────────────────────────────────────────────────────

    "documentation": {
      type: "end",
      title: "Document on EPR",
      subtitle: "Before you leave the patient",
      source: { gl: "GL880", sectionId: "icp-diagnosis", label: "ICP — Diagnosis & Monitoring" },
      items: [
        "Itch character and distribution — palms/soles, nocturnal, with or without rash",
        "BP and urinalysis result at this visit",
        "Bile acid result and LFT results",
        "ICP severity — not confirmed / mild / moderate / severe",
        "Delivery timing plan communicated to patient",
        "Symptomatic treatment prescribed — drug, dose, route",
        "Referral to consultant ANC if BA > 40 µmol/L",
        "Repeat blood test plan — date and what to recheck",
        "Safety-netting: advised to return if itch worsens, dark urine, or jaundice",
      ],
    },

  },
};
