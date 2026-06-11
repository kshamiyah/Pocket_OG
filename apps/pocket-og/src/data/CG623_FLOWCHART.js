// CG623 — Medical Management of Ectopic Pregnancy (Methotrexate)
// Covers eligibility screening, βhCG stratification, treatment, and Day 4/7 monitoring

export const CG623_MTX_FLOWCHART = {
  id: "CG623_MTX",
  title: "Ectopic MTX Pathway",
  subtitle: "CG623 · Medical Management of Ectopic Pregnancy",
  startId: "initial-assessment",
  nodes: {

    "initial-assessment": {
      type: "action",
      title: "Initial Assessment",
      text: "TVS and βhCG confirm ectopic pregnancy. Assess eligibility for MTX before proceeding.",
      items: [
        "Confirm ectopic on TVS (adnexal mass ± ring-of-fire; no IUP)",
        "Check βhCG level",
        "Baseline bloods: FBC, G&S, LFTs, U&Es",
        "Registrar review — consultant agreement required (especially if single USS only)",
        "Discuss management options with patient: medical vs. surgical",
      ],
      next: "selection-criteria",
    },

    "selection-criteria": {
      type: "decision",
      title: "Selection criteria met?",
      text: "ALL of the following must be present for MTX to be considered.",
      options: [
        { label: "Yes — all criteria met:", sublabel: "No significant pain · No IUP · Unruptured ectopic <35mm · No FH · Haemodynamically stable · Normal FBC/LFTs/U&Es · Able to comply with follow-up", next: "exclusion-criteria" },
        { label: "No — criteria not met", sublabel: "Pain present, unstable, IUP found, or non-compliant", next: "end-surgery" },
      ],
    },

    "exclusion-criteria": {
      type: "decision",
      title: "Any exclusion criteria?",
      text: "ANY of the following excludes MTX.",
      options: [
        { label: "No exclusions present", sublabel: "Safe to proceed to βhCG stratification", next: "bhcg-level" },
        { label: "Exclusion present:", sublabel: "Cardiac activity in ectopic · Mass ≥35mm · Intraperitoneal haemorrhage · Pulmonary disease · Active infection / immunosuppressed · Peptic ulcer / UC · Hepatic dysfunction · Platelets <100 · WCC <2 · Severe anaemia · Breastfeeding · Unwilling for follow-up", next: "end-surgery" },
      ],
    },

    "bhcg-level": {
      type: "decision",
      title: "βhCG level",
      text: "Stratify management based on current βhCG.",
      options: [
        { label: "βhCG <1500 IU/L", sublabel: "Consider conservative management first", next: "conservative" },
        { label: "βhCG 1500–5000 IU/L", sublabel: "Offer MTX or surgery (patient choice)", next: "mtx-or-surgery" },
        { label: "βhCG >5000 IU/L", sublabel: "Surgery usually preferred", next: "high-bhcg" },
      ],
    },

    "conservative": {
      type: "action",
      title: "Conservative Management (<1500 IU/L)",
      text: "Monitor βhCG — if spontaneous resolution, surgery and MTX may be avoided.",
      items: [
        "Monitor βhCG twice-weekly",
        "Advise: attend ED urgently if severe pain, dizziness, shoulder-tip pain",
        "If βhCG plateaus or fails to decline: proceed to MTX",
        "If conservative criteria are not met or conservative management fails: proceed to MTX",
      ],
      next: "conservative-response",
    },

    "conservative-response": {
      type: "decision",
      title: "βhCG declining on conservative management?",
      text: "Monitor βhCG response over 1–2 weeks.",
      options: [
        { label: "Yes — consistent decline", sublabel: "Continue monitoring to resolution", next: "end-monitoring" },
        { label: "No — plateau or rise", sublabel: "Conservative failed — proceed to MTX", next: "pre-mtx" },
      ],
    },

    "mtx-or-surgery": {
      type: "decision",
      title: "MTX or surgical management?",
      text: "Discuss options. βhCG 1500–5000 IU/L — both are appropriate. Patient preference guides decision.",
      options: [
        { label: "Patient chooses MTX", sublabel: "Single-dose IM Methotrexate 50mg/m²", next: "pre-mtx" },
        { label: "Patient chooses surgery", sublabel: "Laparoscopic salpingectomy / salpingotomy", next: "end-surgery" },
      ],
    },

    "high-bhcg": {
      type: "alert",
      title: "βhCG >5000 IU/L — Surgery Recommended",
      text: "High βhCG is associated with lower MTX success and higher rupture risk.",
      items: [
        "Surgery is the preferred primary management at this level",
        "MTX may be considered with explicit consultant agreement only",
        "Explain: risk of MTX failure and tubal rupture increases with higher βhCG",
        "If patient declines surgery and all exclusion criteria are absent: consultant to lead decision",
      ],
    },

    "pre-mtx": {
      type: "action",
      title: "Pre-Treatment Checks",
      text: "Complete all checks before administering Methotrexate.",
      items: [
        "Registrar review + consultant agreement documented",
        "Counsel patient fully; give information leaflet",
        "Informed consent via eConsent — include: off-label ('unlicensed') use of MTX",
        "Record height and weight (dose is 50mg/m²)",
        "Confirm bloods: FBC, G&S, LFTs, U&Es and βhCG all checked",
        "Prescribe MTX 50mg/m² IM",
        "Anti-D is NOT required for medical management of ectopic",
      ],
      next: "mtx-admin",
    },

    "mtx-admin": {
      type: "action",
      title: "MTX Administration",
      text: "Administered intramuscularly by trained staff following cytotoxic drug policy.",
      items: [
        "Administer MTX 50mg/m² IM by appropriately trained staff (cytotoxic precautions)",
        "Patient to rest for 1 hour post-injection; check for local reaction before discharge",
        "Advise: avoid alcohol, folic acid supplements, sexual intercourse, sunlight, heavy lifting",
        "Avoid pregnancy for 3 months (use barrier contraception)",
        "Expect pain days 3–7 (tubal miscarriage) — attend ED if severe / dizziness / shoulder-tip pain",
        "Ensure patient has EPU follow-up arrangements and contact number",
      ],
      next: "day4",
    },

    "day4": {
      type: "action",
      title: "Day 4 — βhCG + FBC",
      text: "βhCG may RISE initially — this is expected in up to 86% of patients.",
      items: [
        "Check βhCG + FBC",
        "βhCG often rises between Days 1–4 — this is NORMAL and expected",
        "Pain on days 3–7 is common (tubal miscarriage effect) — normal if mild and settling",
        "Document result; advise patient to return on Day 7",
        "Attend ED urgently if: severe worsening pain, dizziness, shoulder-tip pain, haemodynamic instability",
      ],
      next: "day7-result",
    },

    "day7-result": {
      type: "decision",
      title: "Day 7 — βhCG decline from Day 4?",
      text: "Compare Day 7 βhCG to Day 4 value.",
      options: [
        { label: "≥15% decline from Day 4", sublabel: "Treatment responding — continue monitoring", next: "end-monitoring" },
        { label: "<15% decline or plateau/rise", sublabel: "Suboptimal response — reassess", next: "day7-tvs" },
      ],
    },

    "day7-tvs": {
      type: "action",
      title: "Day 7 — Repeat TVS + Consultant",
      text: "Suboptimal βhCG decline requires re-evaluation before second dose decision.",
      items: [
        "Perform repeat TVS on Day 7 (only indicated for suboptimal decline or if symptomatic)",
        "Discuss with consultant on call",
        "~14% of patients require a second dose of MTX",
      ],
      next: "second-dose",
    },

    "second-dose": {
      type: "decision",
      title: "Second dose MTX or surgery?",
      text: "Based on TVS findings and clinical assessment with consultant.",
      options: [
        { label: "Second dose MTX indicated", sublabel: "No rupture, mass stable, patient stable", next: "second-mtx" },
        { label: "Surgery indicated", sublabel: "Rupture suspected, worsening pain, or patient preference", next: "end-surgery" },
      ],
    },

    "second-mtx": {
      type: "action",
      title: "Second Dose MTX",
      text: "~14% of patients require a second dose. Repeat monitoring cycle.",
      items: [
        "Second dose MTX 50mg/m² IM — same cytotoxic precautions",
        "Repeat Day 4 and Day 7 monitoring cycle from this dose",
        "If βhCG still fails to decline after second dose: surgical management required",
        "Ensure patient aware: third dose is not standard practice",
      ],
      next: "end-monitoring",
    },

    "end-monitoring": {
      type: "end",
      title: "Ongoing βhCG Monitoring",
      text: "Treatment responding. Continue until βhCG <20 IU/L.",
      items: [
        "Weekly βhCG until level <20 IU/L",
        "Mean time to resolution: 35 days (range up to 7 weeks)",
        "Tubal rupture risk remains while βhCG is detectable — advise ED if severe pain or haemodynamic symptoms",
        "Avoid pregnancy for 3 months (barrier contraception)",
        "Success rate with single dose: 65.5–94%",
        "Recurrent ectopic risk: 10–20%; tubal patency: ~80%",
      ],
    },

    "end-surgery": {
      type: "end",
      title: "Surgical Management",
      text: "MTX not appropriate or patient prefers surgery.",
      items: [
        "Laparoscopic salpingectomy (or salpingotomy if only tube remaining)",
        "Emergency surgery if ruptured ectopic: call 2222 if haemodynamically unstable",
        "~10% of patients managed with MTX ultimately require surgery",
        "Consent: risks include haemorrhage, adhesions, future fertility considerations",
        "Anti-D if Rh negative",
        "Discuss recurrence risk and future fertility at post-op review",
      ],
    },

  },
};
