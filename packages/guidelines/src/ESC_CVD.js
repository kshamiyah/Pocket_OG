// ESC_CVD — Cardiac Disease in Pregnancy
// (2025 ESC Guidelines for the Management of Cardiovascular Disease and
// Pregnancy, European Society of Cardiology; supersedes the 2018 edition)
//
// This is the full-guideline tier sitting above the existing TOG-sourced
// condition flowcharts (congenital heart disease, cardiomyopathy, MI,
// arrhythmias, valvular disease) — those flowcharts carry the
// condition-specific algorithms; this guideline adds the overarching risk
// framework, red-flag recognition, and delivery planning that ties them
// together.

export const ESC_CVD_SECTIONS = [
  {
    id: "esc-cvd-why-it-matters",
    gl: "ESC_CVD",
    condition: "Cardiac Disease in Pregnancy",
    setting: "General",
    title: "Why This Matters",
    tags: [
      "cardiac disease pregnancy", "maternal cardiac death", "mbrrace cardiac",
      "heart disease pregnancy",
    ],
    content: [
      { type: "alert", value: "Cardiac disease is a leading cause of indirect maternal death in the UK (MBRRACE-UK), and a recurring theme in confidential enquiry reports is a missed or delayed diagnosis — symptoms attributed to 'normal pregnancy' when they weren't. Breathlessness, palpitations and fatigue are common in normal pregnancy, which is exactly why abnormal cardiac symptoms get missed rather than caught." },
      { type: "text", value: "Pregnancy itself is a cardiovascular stress test — plasma volume, cardiac output and heart rate all rise substantially, peaking around late second to third trimester and again in the immediate postpartum period. Women with limited cardiac reserve, known or previously undiagnosed, can decompensate at exactly these points." },
    ],
  },

  {
    id: "esc-cvd-risk-stratification",
    gl: "ESC_CVD",
    condition: "Cardiac Disease in Pregnancy",
    setting: "Preconception / Antenatal",
    title: "Risk Stratification — mWHO 2.0 Classification",
    tags: [
      "mwho classification", "modified who classification", "pregnancy heart team",
      "cardiac risk stratification pregnancy",
    ],
    flowchartId: "ESC_MWHO_TRIAGE",
    content: [
      { type: "text", value: "The modified WHO (mWHO) classification is the standard framework for estimating maternal cardiovascular risk in pregnancy — it drives who needs specialist pre-pregnancy counselling, how closely a pregnancy is monitored, and where it should be delivered." },
      { type: "table",
        headers: ["Class", "Risk", "Model of care"],
        rows: [
          ["I", "No detectable increased mortality risk; no/mild morbidity increase", "Standard obstetric care"],
          ["II", "Small increased mortality risk, or moderate morbidity increase", "Cardiology follow-up; Pregnancy Heart Team not routinely required"],
          ["II–III", "Intermediate increased risk", "Individualised; Pregnancy Heart Team often advised"],
          ["III", "Significantly increased mortality risk or severe morbidity", "High risk — Pregnancy Heart Team oversight mandatory"],
          ["IV", "Extremely high mortality/morbidity risk — pregnancy generally advised against", "Shared decision-making within the Pregnancy Heart Team if pregnancy continues; detailed counselling, psychological support, maximal monitoring"],
        ],
      },
      { type: "alert", value: "Reported maternal cardiac event rates rise steeply across the classes — roughly a range of 3–10% in Class I up to 36–50% in Class IV in published cohorts. This is not a linear scale; Class III and IV are a different order of risk, not simply 'more of the same'." },
      { type: "subheading", value: "The Pregnancy Heart Team" },
      { type: "text", value: "A multidisciplinary team (cardiology, obstetrics, obstetric anaesthesia, and others as needed) should be involved from pre-pregnancy counselling through to postpartum for mWHO class II–III and above — this is a standing recommendation, not something to assemble reactively once a woman is already in trouble." },
    ],
  },

  {
    id: "esc-cvd-red-flags",
    gl: "ESC_CVD",
    condition: "Cardiac Disease in Pregnancy",
    setting: "Antenatal / Postnatal",
    title: "Red Flags — When to Suspect Cardiac Disease",
    tags: [
      "cardiac red flags pregnancy", "breathlessness pregnancy", "palpitations pregnancy",
      "syncope pregnancy", "chest pain pregnancy", "orthopnoea pregnancy",
    ],
    content: [
      { type: "alert", value: "Normal pregnancy causes some breathlessness and awareness of the heartbeat — the skill is recognising when a symptom has crossed from 'expected' to 'needs cardiac assessment', not dismissing it by category." },
      { type: "list", items: [
        "Breathlessness that is disproportionate, rapidly progressive, or present at rest — not the gradual, mild breathlessness of a growing uterus.",
        "Orthopnoea or paroxysmal nocturnal breathlessness — waking breathless, or needing to prop up on pillows to breathe comfortably, is not a normal pregnancy symptom at any gestation.",
        "Syncope, or pre-syncope on exertion — normal pregnancy vasovagal episodes are typically positional (standing quickly); exertional syncope needs cardiac assessment.",
        "Chest pain — do not default to musculoskeletal or reflux without considering a cardiac cause, particularly with exertional pattern or radiation.",
        "New or sustained palpitations, especially with associated dizziness, chest pain or breathlessness — brief awareness of a fast heartbeat is common; a sustained or disabling arrhythmia is not.",
        "A new murmur, or one that's louder/different from a previously documented innocent flow murmur — get it assessed rather than assumed benign by default.",
      ]},
      { type: "text", value: "Postpartum cardiomyopathy in particular can present in the weeks after birth with breathlessness, oedema and fatigue that get attributed to 'normal recovery' — keep peripartum cardiomyopathy on the differential for unexplained postnatal breathlessness (see the cardiomyopathy pathway below)." },
    ],
  },

  {
    id: "esc-cvd-delivery-planning",
    gl: "ESC_CVD",
    condition: "Cardiac Disease in Pregnancy",
    setting: "Intrapartum",
    title: "Delivery Planning",
    tags: [
      "cardiac disease delivery planning", "mode of birth cardiac disease",
      "second stage cardiac disease", "ergometrine cardiac disease", "epidural cardiac disease",
    ],
    content: [
      { type: "list", items: [
        "Mode of birth is usually obstetric, not cardiac, in origin — vaginal birth is preferred for most cardiac disease, with caesarean reserved for obstetric indications or specific high-risk cardiac conditions (e.g. aortic pathology, certain mechanical valve or anticoagulation scenarios) agreed by the Pregnancy Heart Team in advance.",
        "Plan delivery in a centre matched to the mWHO class — Class III/IV needs delivery where cardiology, obstetric anaesthesia, and critical care are immediately available, not just 'on-site somewhere in the trust'.",
        "Early epidural analgesia is generally beneficial in significant cardiac disease — it blunts the haemodynamic surges of pain and catecholamine release from uncontrolled labour pain.",
        "Avoid or shorten active pushing in high-risk cardiac disease where agreed by the team — an assisted second stage to limit the Valsalva-related haemodynamic load is a common part of the plan, not a routine default for every cardiac patient.",
        "Ergometrine (including as Syntometrine) causes vasoconstriction and should be avoided or used with caution in significant cardiac disease, particularly hypertensive or ischaemic conditions — plan the third-stage uterotonic in advance rather than reaching for the standard regimen without checking.",
      ]},
    ],
  },

  {
    id: "esc-cvd-chd-pathway",
    gl: "ESC_CVD",
    condition: "Cardiac Disease in Pregnancy",
    setting: "Antenatal",
    title: "Congenital Heart Disease — Pathway",
    tags: ["congenital heart disease pregnancy", "chd pregnancy"],
    flowchartId: "TOG_CHD_PREGNANCY",
    content: [
      { type: "text", value: "Congenital heart disease is the most common category of cardiac disease encountered in pregnancy, spanning simple repaired lesions (often low risk) through to complex single-ventricle physiology or pulmonary hypertension (mWHO III–IV). Risk-stratify by lesion and repair status using the pathway below, not by 'congenital heart disease' as a single label." },
    ],
  },

  {
    id: "esc-cvd-cardiomyopathy-pathway",
    gl: "ESC_CVD",
    condition: "Cardiac Disease in Pregnancy",
    setting: "Antenatal / Postnatal",
    title: "Cardiomyopathy (Including Peripartum) — Pathway",
    tags: ["cardiomyopathy pregnancy", "peripartum cardiomyopathy", "dilated cardiomyopathy pregnancy"],
    flowchartId: "TOG_ACQUIRED_CARDIAC",
    content: [
      { type: "text", value: "Peripartum cardiomyopathy is a specific diagnosis of exclusion presenting late pregnancy to several months postpartum — keep it in mind for unexplained postnatal breathlessness rather than assuming deconditioning or anxiety." },
    ],
  },

  {
    id: "esc-cvd-mi-pathway",
    gl: "ESC_CVD",
    condition: "Cardiac Disease in Pregnancy",
    setting: "Emergency",
    title: "Myocardial Infarction & Acute Coronary Syndrome — Pathway",
    tags: ["myocardial infarction pregnancy", "acute coronary syndrome pregnancy", "scad pregnancy"],
    flowchartId: "TOG_MI_PREGNANCY",
    content: [
      { type: "alert", value: "Spontaneous coronary artery dissection (SCAD) is a disproportionately important cause of pregnancy-associated MI — do not anchor on 'atherosclerotic MI is rare in young women' and dismiss the diagnosis." },
    ],
  },

  {
    id: "esc-cvd-arrhythmia-pathway",
    gl: "ESC_CVD",
    condition: "Cardiac Disease in Pregnancy",
    setting: "Antenatal / Emergency",
    title: "Arrhythmias & Palpitations — Pathway",
    tags: ["arrhythmia pregnancy", "palpitations pregnancy", "svt pregnancy", "atrial fibrillation pregnancy"],
    flowchartId: "TOG_ARRHYTHMIAS_PREGNANCY",
    content: [
      { type: "text", value: "Palpitations are common and usually benign in pregnancy, but a sustained or symptomatic arrhythmia needs proper characterisation (ECG during symptoms where possible) rather than reassurance by default — see the red flags above." },
    ],
  },

  {
    id: "esc-cvd-valvular-pathway",
    gl: "ESC_CVD",
    condition: "Cardiac Disease in Pregnancy",
    setting: "Antenatal",
    title: "Valvular Heart Disease — Pathway",
    tags: ["valvular heart disease pregnancy", "mechanical heart valve pregnancy", "mitral stenosis pregnancy"],
    flowchartId: "TOG_VALVULAR_PREGNANCY",
    content: [
      { type: "alert", value: "Severe mitral stenosis and mechanical heart valves are among the highest-risk cardiac conditions in pregnancy (mWHO III–IV) — anticoagulation strategy for a mechanical valve is a specialist decision made well before pregnancy, not something to improvise once pregnant." },
    ],
  },
];
