export const ANTICOAGULANTS = [
  {
    id: "aspirin_prophylaxis",
    name: "Aspirin",
    class: "Antiplatelet — pre-eclampsia prophylaxis",
    color: "fuchsia",
    routes: [
      {
        type: "oral",
        shortLabel: "Oral — pre-eclampsia prophylaxis",
        label: "Oral — pre-eclampsia prophylaxis",
        dose: "75–150 mg",
        frequency: "once daily from 12 weeks until delivery",
        maxDose: "150 mg/day (prophylactic dose only)",
        notes: "NICE NG133: offer 75–150 mg daily from 12 weeks if ≥1 high-risk or ≥2 moderate-risk factors for pre-eclampsia. Start before 16 weeks if possible. ASPRE trial: 150 mg at night reduces early-onset pre-eclampsia by ~62%. Take at night — evidence favours evening dosing. Stop at 36 weeks.",
      },
    ],
    contraindications: [
      "Active peptic ulcer disease",
      "Bleeding disorders",
      "Aspirin or NSAID hypersensitivity",
    ],
    cautions: [
      "Stop at 36 weeks — increased bleeding risk at delivery",
      "Evening (night) dosing has evidence of better efficacy",
      "Do NOT use standard analgesic doses (≥300 mg) in pregnancy",
      "PPI cover if GI symptoms develop",
    ],
    pregnancySafety: "75–150 mg prophylactic dose is safe in pregnancy from 12 weeks. Stop at 36 weeks. Do not use anti-inflammatory doses.",
    sources: [
      { label: "BNF", href: "https://bnf.nice.org.uk/drugs/aspirin/" },
      { label: "NICE NG133", href: "https://www.nice.org.uk/guidance/ng133" },
    ],
  },
  {
    id: "enoxaparin",
    name: "Enoxaparin",
    class: "Low molecular weight heparin (Clexane®)",
    color: "fuchsia",
    routes: [
      {
        type: "sc",
        shortLabel: "SC — VTE prophylaxis",
        label: "Subcutaneous — VTE prophylaxis",
        dose: "<50 kg: 20 mg; 50–90 kg: 40 mg; 91–130 kg: 60 mg; 131–170 kg: 80 mg",
        frequency: "once daily",
        maxDose: "Weight-dependent — seek haematology if >170 kg",
        notes: "Weight-based once-daily prophylactic dosing. SC injection into abdomen or thigh. Withhold ≥12 hr before planned regional anaesthesia or delivery. Resume 4 hr after spinal, or 6 hr after epidural removal.",
      },
      {
        type: "sc",
        shortLabel: "SC — VTE treatment",
        label: "Subcutaneous — VTE treatment (confirmed DVT/PE)",
        dose: "1 mg/kg",
        frequency: "twice daily",
        maxDose: "Monitor anti-Xa levels if renal impairment or weight extremes",
        notes: "For confirmed DVT or PE in pregnancy. Check anti-Xa levels 3–4 hr post-dose (target 0.6–1.0 IU/mL). Withhold ≥24 hr before regional anaesthesia. Ensure consultant haematologist/obstetric physician involvement.",
      },
    ],
    contraindications: [
      "Active major haemorrhage",
      "Heparin-induced thrombocytopenia (HIT)",
      "Severe thrombocytopenia (platelets <50 × 10⁹/L)",
    ],
    cautions: [
      "WITHHOLD ≥12 hr (prophylaxis) or ≥24 hr (treatment) before regional anaesthesia",
      "Monitor platelet count if used >5 days — HIT risk",
      "Anti-Xa monitoring in renal impairment, extremes of weight, or recurrent VTE",
      "Does not cross placenta — safe in pregnancy",
    ],
    pregnancySafety: "LMWH of choice for VTE prophylaxis and treatment in pregnancy. Does not cross placenta. Safe for breastfeeding.",
    sources: [
      { label: "BNF", href: "https://bnf.nice.org.uk/drugs/enoxaparin-sodium/" },
      { label: "RCOG GTG 37a", href: "https://www.rcog.org.uk/guidance/browse-all-guidance/green-top-guidelines/reducing-the-risk-of-venous-thromboembolism-during-pregnancy-and-the-puerperium-green-top-guideline-no-37a/" },
    ],
  },
  {
    id: "dalteparin",
    name: "Dalteparin",
    class: "Low molecular weight heparin (Fragmin®)",
    color: "fuchsia",
    routes: [
      {
        type: "sc",
        shortLabel: "SC — VTE prophylaxis",
        label: "Subcutaneous — VTE prophylaxis",
        dose: "<50 kg: 2500 units; 50–90 kg: 5000 units; 91–130 kg: 7500 units; >130 kg: 10 000 units",
        frequency: "once daily",
        maxDose: "Weight-dependent — see local protocol",
        notes: "Once-daily prophylactic dosing by weight band. Treatment dose: 100 units/kg BD. Withhold ≥12 hr (prophylaxis) or ≥24 hr (treatment) before regional anaesthesia.",
      },
    ],
    contraindications: [
      "Active major haemorrhage",
      "Heparin-induced thrombocytopenia (HIT)",
    ],
    cautions: [
      "WITHHOLD ≥12 hr (prophylaxis) or ≥24 hr (treatment) before regional anaesthesia",
      "Do not substitute doses directly with enoxaparin — different unit scales; use local conversion",
      "Anti-Xa monitoring in renal impairment or weight extremes",
    ],
    pregnancySafety: "Safe in pregnancy. Alternative LMWH to enoxaparin. Does not cross placenta.",
    sources: [
      { label: "BNF", href: "https://bnf.nice.org.uk/drugs/dalteparin-sodium/" },
      { label: "RCOG GTG 37a", href: "https://www.rcog.org.uk/guidance/browse-all-guidance/green-top-guidelines/reducing-the-risk-of-venous-thromboembolism-during-pregnancy-and-the-puerperium-green-top-guideline-no-37a/" },
    ],
  },
  {
    id: "tinzaparin",
    name: "Tinzaparin",
    class: "Low molecular weight heparin (Innohep®)",
    color: "fuchsia",
    routes: [
      {
        type: "sc",
        shortLabel: "SC — VTE prophylaxis / treatment",
        label: "Subcutaneous — VTE prophylaxis / treatment",
        dose: "Prophylaxis: 4500 units (50–90 kg); Treatment: 175 units/kg once daily",
        frequency: "once daily",
        maxDose: "Weight-dependent prophylaxis; 175 units/kg for treatment",
        notes: "Prophylaxis doses: <50 kg → 3500 units OD; 50–90 kg → 4500 units OD; 91–130 kg → 7000 units OD; >130 kg → 9000 units OD. Treatment: 175 units/kg once daily (once-daily dosing for treatment, unlike enoxaparin which is BD). Withhold ≥24 hr before regional anaesthesia.",
      },
    ],
    contraindications: [
      "Active major haemorrhage",
      "Heparin-induced thrombocytopenia (HIT)",
    ],
    cautions: [
      "WITHHOLD ≥24 hr before regional anaesthesia (both prophylactic and treatment doses)",
      "Treatment dosing is once daily — different from enoxaparin (twice daily); do not interchange without dose conversion",
    ],
    pregnancySafety: "Safe in pregnancy. Once-daily treatment dosing. Does not cross placenta.",
    sources: [
      { label: "BNF", href: "https://bnf.nice.org.uk/drugs/tinzaparin-sodium/" },
      { label: "RCOG GTG 37a", href: "https://www.rcog.org.uk/guidance/browse-all-guidance/green-top-guidelines/reducing-the-risk-of-venous-thromboembolism-during-pregnancy-and-the-puerperium-green-top-guideline-no-37a/" },
    ],
  },
];
