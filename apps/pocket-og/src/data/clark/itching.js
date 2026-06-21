export const ITCHING_PROTOCOL = {
  id: "itching",
  title: "Itching in Pregnancy",
  subtitle: "Obstetric cholestasis screen & management",
  category: "antenatal",
  guideline: "RBH GL880",
  color: "amber",
  startId: "history",
  nodes: {

    "history": {
      type: "checklist",
      title: "Take a focused history",
      subtitle: "Establish character and pattern of itch",
      items: [
        "Onset, duration, and distribution — palms and soles, generalised, nocturnal worsening",
        "Presence or absence of rash (ICP typically has no primary rash)",
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
      subtitle: "Results guide management and delivery planning",
      items: [
        "Non-fasting bile acids (BA) — key diagnostic test for ICP",
        "LFTs — ALT, AST, ALP, bilirubin, GGT",
        "Clotting screen if BA ≥100 µmol/L or LFTs significantly deranged",
        "No additional growth scans needed — ICP is not associated with IUGR; scans do not predict stillbirth",
        "Note: 3 in 4 cases of itching in pregnancy are benign — await results before diagnosing ICP",
      ],
      next: "bile_acids",
    },

    "bile_acids": {
      type: "calculator",
      title: "Bile Acid Level",
      subtitle: "Non-fasting bile acids — select result range",
      description: "Select the range that matches the patient's bile acid result to determine severity and management",
      fields: [
        {
          id: "ba_level",
          question: "Non-fasting bile acid level?",
          options: [
            { label: "<19 µmol/L — normal", score: 1 },
            { label: "19–39 µmol/L — mild ICP", score: 2 },
            { label: "40–99 µmol/L — moderate ICP", score: 3 },
            { label: "≥100 µmol/L — severe ICP", score: 4 },
          ],
        },
      ],
      scoring: [
        { min: 1, max: 1, label: "Normal bile acids", color: "green",  next: "not_icp"      },
        { min: 2, max: 2, label: "Mild ICP",          color: "amber",  next: "mild_icp"     },
        { min: 3, max: 3, label: "Moderate ICP",      color: "orange", next: "moderate_icp" },
        { min: 4, max: 4, label: "Severe ICP",        color: "red",    next: "severe_icp"   },
      ],
    },

    "not_icp": {
      type: "treatment",
      title: "Normal Bile Acids — ICP Not Confirmed",
      badge: { label: "BA <19 µmol/L", color: "green" },
      sections: [
        {
          title: "Management",
          items: [
            "ICP not confirmed at this stage",
            "If borderline or mildly elevated — recheck bile acids 1 week later; may normalise",
            "Ongoing itch with persistently normal BA/LFTs: repeat both at 1–2 week intervals",
            "Advise patient to return if itch worsens, dark urine, or jaundice develops",
          ],
        },
        {
          title: "Symptomatic relief",
          drugs: [
            { drug: "Aqueous cream + menthol 1%", dose: "Apply to affected areas PRN", note: "First-line topical" },
            { drug: "Chlorphenamine", dose: "4 mg TDS oral", note: "Antihistamine — safe in pregnancy" },
            { drug: "Loratadine / Cetirizine", dose: "10 mg OD oral", note: "Non-sedating alternative" },
          ],
        },
        {
          title: "Consider alternative diagnoses",
          items: [
            "PUPPP / polymorphic eruption of pregnancy",
            "Eczema or contact dermatitis",
            "Scabies",
            "Pemphigoid gestationis — rare; blisters on abdomen and limbs",
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
            "Intermittent auscultation acceptable in labour — homebirth and birth centre not contraindicated",
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
            { drug: "Aqueous cream + menthol 1%", dose: "Apply PRN", note: "First-line topical" },
            { drug: "Chlorphenamine", dose: "4 mg TDS oral", note: "" },
            { drug: "Loratadine / Cetirizine", dose: "10 mg OD oral", note: "Non-sedating" },
          ],
        },
      ],
      next: "documentation",
    },

    "moderate_icp": {
      type: "treatment",
      title: "Moderate ICP — Refer to Consultant ANC",
      badge: { label: "BA 40–99 µmol/L", color: "orange" },
      sections: [
        {
          title: "Monitoring",
          items: [
            "Weekly bile acids and LFTs from 35 weeks — levels may rise above 100 µmol/L",
            "Refer to consultant obstetric antenatal clinic",
            "BP and urinalysis at every review — PET risk is 12.2% in ICP",
            "Continuous EFM (CEFM) recommended in labour — higher likelihood of meconium",
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
            { drug: "UDCA (ursodeoxycholic acid)", dose: "12 mg/kg/day in divided doses", note: "Consider from 34–36 weeks; not routine — senior prescription required" },
          ],
        },
      ],
      next: "documentation",
    },

    "severe_icp": {
      type: "escalation",
      title: "Severe ICP — Escalate to Consultant",
      alert: "Stillbirth risk is significantly increased only above 100 µmol/L (~3.5%). Do not manage this alone.",
      items: [
        "Refer urgently to consultant obstetrician",
        "Planned birth at 35–36 weeks — if already past this gestation, arrange IOL imminently",
        "Continuous EFM (CEFM) must be offered in labour",
        "Advise patient: baby is more likely to need neonatal care at this gestation",
        "Clotting screen — Vitamin K (Menadiol 10 mg daily) if clotting abnormal",
        "UDCA — may be considered; senior prescription only",
        "Discuss risk of stillbirth with patient and document conversation",
      ],
      next: "documentation",
    },

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
