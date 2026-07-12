// Quick Reference — a searchable, cross-source reference card (not a single
// guideline). Doses mirror the app's own Rx formulary for consistency; ranges
// are typical pregnancy values. Aggregated from RCOG / NICE / BNF / Resus
// Council UK — pending clinical sign-off; always verify against local protocols.
export const QUICKREF_SECTIONS = [
  {
    id: "quickref-normal-values",
    gl: "QUICKREF",
    condition: "Quick Reference",
    setting: "Reference — Normal Values",
    title: "Normal Values in Pregnancy",
    tags: [
      "normal values pregnancy", "normal ranges pregnancy", "reference range",
      "haemoglobin pregnancy", "hb pregnancy", "anaemia threshold", "platelets pregnancy",
      "wcc pregnancy", "white cell count", "alt pregnancy", "liver function pregnancy",
      "urate", "uric acid", "bile acids", "d-dimer pregnancy", "fibrinogen", "tsh pregnancy",
      "thyroid pregnancy", "blood results pregnancy", "booking bloods",
    ],
    content: [
      { type: "alert", value: "Typical pregnancy ranges — always interpret against your local laboratory's pregnancy-specific reference ranges." },
      { type: "table",
        headers: ["Test", "Non-pregnant", "In pregnancy"],
        rows: [
          ["Haemoglobin (g/L)", "120–150", "Anaemia if <110 (1st tri), <105 (2nd/3rd tri), <100 postnatal"],
          ["Platelets (×10⁹/L)", "150–400", "Fall slightly; gestational thrombocytopenia common (usually >100)"],
          ["WCC (×10⁹/L)", "4–11", "Rises — up to ~15 normal, higher in labour"],
          ["Urea / creatinine", "—", "Fall in pregnancy; 'normal' non-pregnant values may be abnormal"],
          ["ALT / AST", "<40", "Fall ~20%; a normal-looking level may be high for pregnancy (PET/HELLP)"],
          ["ALP", "—", "Rises (placental) — not a marker of liver dysfunction"],
          ["Bile acids (µmol/L)", "<19", ">19 suggests obstetric cholestasis; ≥100 severe"],
          ["Urate", "—", "Rises with gestation; tracks pre-eclampsia severity"],
          ["Fibrinogen (g/L)", "2–4", "Rises to ~4–6; a low-normal level in PPH is concerning"],
          ["D-dimer", "—", "Rises physiologically — NOT useful to exclude VTE in pregnancy"],
          ["TSH / free T4", "0.4–4.0", "Use trimester-specific (lab) pregnancy ranges"],
        ],
      },
      { type: "text", value: "Compiled from RCOG/NICE guidance and standard obstetric references. Verify against local laboratory ranges." },
    ],
  },

  {
    id: "quickref-eclampsia-mag",
    gl: "QUICKREF",
    condition: "Quick Reference",
    setting: "Emergency — Doses",
    title: "Eclampsia & Severe Pre-eclampsia — Magnesium",
    tags: [
      "eclampsia dose", "magnesium dose", "magnesium sulphate", "mgso4", "mg so4",
      "seizure pregnancy", "fitting on ward", "severe pre-eclampsia", "loading dose magnesium",
      "calcium gluconate", "magnesium toxicity", "seizure prophylaxis", "emergency dose",
    ],
    content: [
      { type: "alert", value: "Magnesium sulphate is first-line for eclamptic seizures and for seizure prophylaxis in severe pre-eclampsia. Call for senior help." },
      { type: "table",
        headers: ["Step", "Dose"],
        rows: [
          ["Loading", "4 g IV over 5–10 min (8 mL of 50% MgSO₄ in 100 mL 0.9% NaCl)"],
          ["Maintenance", "1 g/hr IV, continuous for 24 h after birth or the last seizure"],
          ["Recurrent seizure", "Further 2–4 g IV over 5–15 min"],
          ["Toxicity antidote", "Calcium gluconate 1 g IV over 10 min"],
        ],
      },
      { type: "subheading", value: "Monitoring" },
      { type: "list", items: [
        "Urine output >25 mL/hr, respiratory rate >12/min, patellar reflexes present",
        "Loss of tendon reflexes is the earliest sign of toxicity — stop infusion and check a level",
        "Reduce dose in renal impairment; potentiates nifedipine (hypotension risk)",
      ]},
      { type: "text", value: "Doses per the app Rx formulary · NICE NG133 · RCOG GTG10(a). Verify locally." },
    ],
  },

  {
    id: "quickref-pph-ladder",
    gl: "QUICKREF",
    condition: "Quick Reference",
    setting: "Emergency — Doses",
    title: "Postpartum Haemorrhage — Uterotonic Ladder",
    tags: [
      "pph dose", "postpartum haemorrhage", "uterotonics", "oxytocin dose", "syntocinon",
      "ergometrine dose", "carboprost dose", "hemabate", "misoprostol dose", "tranexamic acid",
      "txa pph", "bleeding after birth", "syntometrine", "emergency dose", "4 ts",
    ],
    content: [
      { type: "alert", value: "Call for help, ABC, two large-bore cannulae, bloods + crossmatch, and treat the cause (4 T's: Tone, Trauma, Tissue, Thrombin)." },
      { type: "table",
        headers: ["Drug", "Dose", "Note"],
        rows: [
          ["Oxytocin", "5 units slow IV → 40 units in 500 mL 0.9% NaCl at 125 mL/hr", "First-line"],
          ["Ergometrine", "500 mcg IM (or 250–500 mcg slow IV)", "Avoid in hypertension / pre-eclampsia"],
          ["Carboprost", "250 mcg deep IM, repeat every 15 min", "Max 8 doses (2 mg); caution in asthma"],
          ["Misoprostol", "800 mcg sublingual", "If parenteral agents unavailable"],
          ["Tranexamic acid", "1 g IV", "Give early; max 2 g per episode"],
        ],
      },
      { type: "text", value: "Doses per the app Rx formulary · RCOG GTG52. Escalate to the obstetric emergency call; verify locally." },
    ],
  },

  {
    id: "quickref-aspiration-prophylaxis",
    gl: "QUICKREF",
    condition: "Quick Reference",
    setting: "Perioperative — Doses",
    title: "Aspiration Prophylaxis for Caesarean",
    tags: [
      "aspiration prophylaxis", "antacid", "antacid in labour", "ranitidine",
      "omeprazole", "proton pump inhibitor", "ppi", "h2 antagonist", "h2 receptor antagonist",
      "sodium citrate", "acid prophylaxis", "caesarean prophylaxis", "pre-caesarean",
      "gastric acid", "mendelson", "aspiration pneumonitis", "pre-op caesarean", "emergency dose",
    ],
    content: [
      { type: "alert", value: "Before a caesarean birth, offer an antacid plus an H2-receptor antagonist or proton pump inhibitor to reduce gastric volume and acidity, and offer an antiemetic (NICE NG192, 1.4.18–1.4.19). This lowers the risk of aspiration (Mendelson's syndrome) if general anaesthesia is needed." },
      { type: "alert", value: "Ranitidine was withdrawn in the UK in 2020 (NDMA contamination). Use a proton pump inhibitor (omeprazole) instead." },
      { type: "subheading", value: "Elective caesarean" },
      { type: "table",
        headers: ["Drug", "Dose"],
        rows: [
          ["Omeprazole (oral)", "40 mg the night before, and 40 mg on the morning of surgery"],
        ],
      },
      { type: "subheading", value: "Emergency caesarean / general anaesthesia" },
      { type: "table",
        headers: ["Drug", "Dose"],
        rows: [
          ["Sodium citrate 0.3M (oral)", "30 mL immediately before induction"],
          ["Omeprazole (IV)", "40 mg"],
          ["Metoclopramide (IV)", "10 mg (antiemetic, promotes gastric emptying)"],
        ],
      },
      { type: "text", value: "Principle per NICE NG192 (1.4.18–1.4.19), which recommends the drug classes but not specific doses. The doses shown are common UK anaesthetic defaults (BNF / OAA practice), not a fixed national figure: verify against your local obstetric anaesthesia protocol." },
    ],
  },

  {
    id: "quickref-anaphylaxis",
    gl: "QUICKREF",
    condition: "Quick Reference",
    setting: "Emergency — Doses",
    title: "Anaphylaxis",
    tags: [
      "anaphylaxis", "adrenaline dose", "epinephrine", "allergic reaction", "anaphylaxis pregnancy",
      "resus", "emergency dose", "1:1000",
    ],
    content: [
      { type: "alert", value: "ABC, remove the trigger, call for help. In pregnancy use left-lateral tilt to relieve aortocaval compression." },
      { type: "table",
        headers: ["Intervention", "Dose"],
        rows: [
          ["Adrenaline (IM)", "500 mcg IM (0.5 mL of 1:1000) — repeat after 5 min if no improvement"],
          ["IV fluids", "500–1000 mL crystalloid bolus"],
          ["Oxygen / adjuncts", "High-flow O₂; consider chlorphenamine & hydrocortisone after initial resuscitation"],
        ],
      },
      { type: "text", value: "Adrenaline dose per Resuscitation Council UK. Verify locally." },
    ],
  },
];
