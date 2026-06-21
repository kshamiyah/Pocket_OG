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
            "ICP and a rash can co-exist — send bile acids and LFTs regardless",
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
      items: [
        "Onset, duration — palms and soles, generalised, nocturnal worsening",
        "Dark urine or pale stools — biliary obstruction features",
        "Previous ICP in this or prior pregnancies — recurrence rate 45–70%",
        "Family history of ICP or liver disease",
        "Current medications — any hepatotoxic drugs",
        "Other common causes: eczema, contact dermatitis, scabies, PUPPP",
      ],
      next: "examination",
    },

    "examination": {
      type: "checklist",
      title: "Examine the patient",
      items: [
        "BP and urinalysis — pre-eclampsia co-exists in 12.2% of ICP cases; check at every review",
        "Inspect skin — rash present or absent; scratch marks and excoriation",
        "Jaundice — rare in ICP but important to identify",
        "Abdominal examination — SFH, fetal lie, auscultate FH",
      ],
      next: "investigations",
    },

    "investigations": {
      type: "checklist",
      title: "Investigations",
      items: [
        "Non-fasting bile acids (BA) — key diagnostic test for ICP",
        "LFTs — ALT, AST, ALP, bilirubin, GGT",
        "Clotting screen if BA ≥100 µmol/L or LFTs significantly deranged",
        "Note: results may take hours — arrange review once back",
        "3 in 4 cases of itching in pregnancy are benign — await results before diagnosing ICP",
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
            { drug: "Aqueous cream + menthol 1%",      dose: "Apply to affected areas PRN",  note: "First-line topical"             },
            { drug: "Chlorphenamine",                   dose: "4 mg TDS oral",                note: "Antihistamine — safe in pregnancy" },
            { drug: "Loratadine / Cetirizine",         dose: "10 mg OD oral",                note: "Non-sedating alternative"       },
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
      sections: [
        {
          title: "Management",
          items: [
            "ICP not confirmed at this stage",
            "If borderline — recheck bile acids 1 week later; may normalise",
            "Persistent itch with normal BA/LFTs: repeat both at 1–2 week intervals",
            "Advise patient to return if itch worsens, dark urine, or jaundice develops",
          ],
        },
        {
          title: "Symptomatic relief",
          drugs: [
            { drug: "Aqueous cream + menthol 1%",  dose: "Apply PRN",         note: "First-line topical"             },
            { drug: "Chlorphenamine",               dose: "4 mg TDS oral",     note: "Safe in pregnancy"              },
            { drug: "Loratadine / Cetirizine",     dose: "10 mg OD oral",     note: "Non-sedating alternative"       },
          ],
        },
      ],
      next: "documentation",
    },

    "mild_icp": {
      type: "treatment",
      title: "Mild ICP — Outpatient Management",
      badge: { label: "BA 19–39 µmol/L", color: "amber" },
      sections: [
        {
          title: "Monitoring",
          items: [
            "Weekly bile acids and LFTs from 38 weeks",
            "BP and urinalysis at every review",
            "No additional growth scans required",
            "Intermittent auscultation acceptable in labour",
          ],
        },
        {
          title: "Delivery timing",
          items: [
            "Planned birth by 40 weeks (if no other risk factors)",
          ],
        },
        {
          title: "Symptomatic relief",
          drugs: [
            { drug: "Aqueous cream + menthol 1%",  dose: "Apply PRN",         note: "First-line topical" },
            { drug: "Chlorphenamine",               dose: "4 mg TDS oral",     note: ""                   },
            { drug: "Loratadine / Cetirizine",     dose: "10 mg OD oral",     note: "Non-sedating"       },
          ],
        },
      ],
      next: "documentation",
    },

    "moderate_icp": {
      type: "treatment",
      title: "Moderate ICP — Refer to Consultant ANC",
      badge: { label: "BA 40–99 µmol/L", color: "amber" },
      sections: [
        {
          title: "Monitoring",
          items: [
            "Weekly bile acids and LFTs from 35 weeks — levels may rise above 100 µmol/L",
            "Refer to consultant obstetric antenatal clinic",
            "BP and urinalysis at every review — PET risk is 12.2% in ICP",
            "Continuous EFM (CEFM) recommended in labour",
          ],
        },
        {
          title: "Delivery timing",
          items: [
            "Planned birth at 38–39 weeks",
            "Earlier delivery if co-morbidities (PET, diabetes, multiple pregnancy) with BA >40 µmol/L",
          ],
        },
        {
          title: "Consider (senior prescription only)",
          drugs: [
            { drug: "UDCA (ursodeoxycholic acid)", dose: "12 mg/kg/day in divided doses", note: "Not routine — senior prescription required" },
          ],
        },
      ],
      next: "documentation",
    },

    "severe_icp": {
      type: "escalation",
      title: "Severe ICP — Escalate to Consultant",
      alert: "Stillbirth risk significantly increased above 100 µmol/L (~3.5%). Do not manage this alone.",
      items: [
        "Refer urgently to consultant obstetrician — do not discharge",
        "Planned birth at 35–36 weeks — if already past this gestation, arrange IOL imminently",
        "Continuous EFM (CEFM) must be offered in labour",
        "Advise patient: baby is more likely to need neonatal care at this gestation",
        "Clotting screen — Vitamin K (Menadiol 10 mg daily) if clotting abnormal",
        "UDCA — may be considered; senior prescription only",
        "Discuss risk of stillbirth with patient and document the conversation",
      ],
      next: "documentation",
    },

    // ─── Documentation ────────────────────────────────────────────────────────

    "documentation": {
      type: "end",
      title: "Document on EPR",
      subtitle: "Before you leave the patient",
      items: [
        "Itch character and distribution — palms/soles, nocturnal, with or without rash",
        "BP and urinalysis result at this visit",
        "Bile acid result and LFT results",
        "ICP severity — not confirmed / mild / moderate / severe",
        "Delivery timing plan communicated to patient",
        "Symptomatic treatment prescribed — drug, dose, route",
        "Referral to consultant ANC if moderate or severe",
        "Repeat blood test plan — date and what to recheck",
        "Safety-netting: advised to return if itch worsens, dark urine, or jaundice",
      ],
    },

  },
};
