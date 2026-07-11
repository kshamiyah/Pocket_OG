// GTG36 — Prevention of Early-onset Neonatal Group B Streptococcal Disease
// (RCOG Green-top Guideline No. 36, 3rd edition, September 2017; neonatal
// observation/red-flag pathway cross-checked against NICE NG195, Neonatal
// infection: antibiotics for prevention and treatment)
//
// Exact intrapartum antibiotic prophylaxis (IAP) regimens and doses live in
// GL787 (Obstetric Antibiotics) — this guideline covers screening policy,
// who IAP is offered to and why, and what happens after birth, rather than
// repeating the dosing. Patient-facing counselling numbers are on the
// existing Counsel "GBS Antibiotics in Labour" entry.

export const GTG36_SECTIONS = [
  {
    id: "gtg36-screening-policy",
    gl: "GTG36",
    condition: "Group B Streptococcus",
    setting: "Antenatal",
    title: "Carriage, Incidence & UK Screening Policy",
    tags: [
      "gbs carriage", "group b strep incidence", "gbs screening policy",
      "universal screening gbs", "risk based gbs",
    ],
    content: [
      { type: "text", value: "Group B Streptococcus (GBS) is carried in the vagina or rectum of roughly a quarter of women at any given time — it's part of normal bowel/genital flora, causes no harm to a healthy adult, and carriage comes and goes through pregnancy and between pregnancies. The concern is exclusively about transmission to the baby around birth." },
      { type: "alert", value: "The UK does not offer universal antenatal bacteriological screening for GBS — the UK National Screening Committee has repeatedly reviewed this and recommended against it. The UK instead uses a risk-factor-based approach to decide who is offered intrapartum antibiotic prophylaxis (IAP)." },
      { type: "subheading", value: "Why risk-based rather than universal screening" },
      { type: "list", items: [
        "Universal culture-based screening would require major organisational change and funding without clear evidence it reduces early-onset GBS disease (EOGBS) more than a risk-based approach, given how carriage fluctuates between a screening test and the actual birth.",
        "Offering IAP to everyone who screens positive substantially increases intrapartum antibiotic use, with its own downsides — maternal anaphylaxis risk, increased medicalisation of labour and the neonatal period, and antibiotic resistance pressure.",
        "This is a genuinely debated policy area — some other countries (e.g. the USA) use universal culture-based screening — so be ready to explain the UK rationale rather than assume it's the only reasonable approach.",
      ]},
    ],
  },

  {
    id: "gtg36-risk-factors-iap",
    gl: "GTG36",
    condition: "Group B Streptococcus",
    setting: "Antenatal / Intrapartum",
    title: "Who Is Offered Intrapartum Antibiotic Prophylaxis",
    tags: [
      "gbs risk factors", "gbs bacteriuria", "gbs intrapartum antibiotics",
      "gbs iap indications", "gbs incidental finding",
    ],
    content: [
      { type: "text", value: "IAP is offered, not because a woman is unwell, but because she falls into a group with a higher-than-background chance of her baby developing EOGBS disease. Exact antibiotic choice and dosing (including for penicillin allergy) are in GL787." },
      { type: "subheading", value: "Indications" },
      { type: "list", items: [
        "GBS colonisation identified incidentally in the current pregnancy — on a vaginal/rectal swab taken for any reason, or on a urine culture.",
        "GBS bacteriuria at any concentration in the current pregnancy — treat the bacteriuria at the time it's found (as for any bacteriuria), and separately offer IAP in labour regardless of that treatment, since bacteriuria signals heavier colonisation and a higher EOGBS risk than a swab finding alone.",
        "A previous baby with invasive early- or late-onset GBS disease.",
        "Preterm labour (before 37 weeks) — treated as a GBS risk factor in its own right, IAP is offered even without a known positive swab or urine culture, because the balance of risks favours cover in preterm birth (see GL787 for the preterm/PPROM antibiotic pathway).",
        "Confirmed rupture of membranes ≥18 hours before birth.",
        "Intrapartum pyrexia ≥38°C — manage as possible intra-amniotic infection/chorioamnionitis, not GBS prophylaxis alone (see GL787).",
      ]},
      { type: "alert", value: "A GBS finding earlier in this pregnancy that has since been treated does not need re-testing to 'confirm clearance' before offering IAP — carriage fluctuates, and a documented finding this pregnancy is enough to trigger IAP in labour regardless of interim antibiotic treatment or a repeat negative swab." },
      { type: "subheading", value: "Timing" },
      { type: "text", value: "Ideally, the first dose is given far enough before birth for it to have crossed into fetal circulation — practically, this means starting IAP as soon as labour is confirmed or membranes rupture, not waiting for established labour, since birth timing can't be predicted precisely." },
    ],
  },

  {
    id: "gtg36-unknown-status",
    gl: "GTG36",
    condition: "Group B Streptococcus",
    setting: "Intrapartum",
    title: "Unknown GBS Status, Caesarean, & Declining Prophylaxis",
    tags: [
      "gbs status unknown", "gbs caesarean", "declining gbs antibiotics", "gbs preterm labour",
    ],
    content: [
      { type: "list", items: [
        "GBS status not known and no other risk factor present: IAP is not routinely indicated on the basis of unknown status alone — base the decision on the risk factors that are present, not on the absence of a test result.",
        "Planned caesarean birth before labour starts, with intact membranes: GBS-specific IAP is not needed — the baby's risk of EOGBS in this situation is very low, since exposure to the vaginal/rectal flora that transmits GBS hasn't occurred. The routine single dose of surgical antibiotic prophylaxis for caesarean (GL787) still applies as normal.",
        "A woman can decline IAP after appropriate counselling — if she does, plan enhanced postnatal observation of the baby rather than no plan at all (see the neonatal observation section).",
      ]},
    ],
  },

  {
    id: "gtg36-neonatal-observation",
    gl: "GTG36",
    condition: "Group B Streptococcus",
    setting: "Postnatal",
    title: "After Birth — Neonatal Observation & Red Flags",
    tags: [
      "well baby observation gbs", "neonatal red flags", "early onset neonatal infection",
      "neonatal sepsis observation", "ng195",
    ],
    flowchartId: "GTG36_GBS",
    content: [
      { type: "text", value: "What happens after birth depends on whether the baby is well with just a risk factor for infection, or shows an actual red-flag sign — these two pathways lead to different management, per NICE NG195." },
      { type: "subheading", value: "Well baby, risk factor present (e.g. maternal GBS risk factor, adequate IAP given)" },
      { type: "list", items: [
        "Clinical observation for at least the first 12 hours of life — regular checks of colour, tone, feeding, breathing and temperature, not a single check at birth.",
        "A well baby who received adequate IAP (appropriate antibiotic, adequate time before birth) does not routinely need blood tests or antibiotics of its own — the observation period is the safety net, not a trigger for automatic treatment.",
      ]},
      { type: "subheading", value: "Red flags — start empirical treatment" },
      { type: "list", items: [
        "Signs include: temperature instability (either high or low, not explained by the environment), respiratory distress, poor feeding, abnormal tone or responsiveness, seizures, and other signs of clinical instability.",
        "Any red flag → start empirical IV antibiotics promptly (benzylpenicillin plus gentamicin is the standard first-line combination) and admit for enhanced monitoring — do not wait to see if things settle first.",
        "Antibiotics are typically stopped around 36 hours if cultures are negative, the baby is clinically well, and inflammatory markers are reassuring; continued for a minimum of 7 days if cultures are positive or clinical suspicion remains high despite negative cultures.",
      ]},
      { type: "subheading", value: "Safety-netting for parents" },
      { type: "text", value: "Before discharge, make sure parents know the warning signs to watch for at home: poor feeding, unusual drowsiness or irritability, fast or noisy breathing, and a temperature that's too high or too low — all warrant urgent review, even after a reassuring observation period in hospital." },
    ],
  },
];
