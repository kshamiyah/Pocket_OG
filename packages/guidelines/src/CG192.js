export const CG192_SECTIONS = [
  {
    id: "cg192-overview", gl: "CG192", condition: "Perinatal Mental Health", setting: "Overview & Risk Assessment",
    title: "Perinatal Mental Health — Overview & Risk Identification",
    tags: ["perinatal mental health","antenatal","postnatal","depression","anxiety","bipolar","schizophrenia","ocd","ptsd","psychosis","puerperal psychosis","postpartum psychosis","epds","whooley","booking","risk factors"],
    content: [
      { type: "subheading", value: "Why Perinatal Mental Health Matters" },
      { type: "text", value: "Mental health conditions are among the leading causes of indirect maternal death in the UK (MBRRACE). Perinatal mental illness affects 10–20% of women during pregnancy or in the first year after birth. Early identification and appropriate treatment are essential." },
      { type: "list", items: [
        "Depression and anxiety are the most common perinatal mental health conditions",
        "Postnatal psychosis (puerperal psychosis): affects 1–2 per 1000 births; can present within days of delivery",
        "Bipolar disorder carries the highest risk of postpartum relapse — up to 50% risk of puerperal psychosis",
        "Suicide and substance misuse are leading causes of late maternal deaths (6 weeks to 1 year postpartum)",
      ]},
      { type: "subheading", value: "Routine Screening (NICE NG192)" },
      { type: "list", items: [
        "At booking: Whooley questions (2-question depression screen) + GAD-2 (anxiety screen)",
        "At all subsequent contacts: be alert to signs of mental illness; ask about wellbeing",
        "At 4–6 weeks and 3–4 months postnatal: EPDS offered by midwife or health visitor",
        "Document ALL previous mental health history and medication at booking",
      ]},
      { type: "subheading", value: "Risk Factors for Perinatal Mental Illness" },
      { type: "list", items: [
        "Previous postpartum depression or puerperal psychosis",
        "Personal or family history of bipolar disorder or schizophrenia",
        "Domestic abuse, adverse childhood experiences",
        "Unplanned or unwanted pregnancy",
        "Poor social support, financial stress, migration / refugee status",
        "Pre-existing anxiety disorder, OCD, PTSD, eating disorder",
        "History of substance misuse",
      ]},
      { type: "alert", value: "Ask about suicidal ideation and self-harm at every perinatal contact — do not assume a pregnant or postpartum woman will not have these thoughts. Direct questioning does not increase risk." },
    ]
  },
  {
    id: "cg192-epds", gl: "CG192", condition: "Perinatal Mental Health", setting: "EPDS Scoring",
    title: "Perinatal Mental Health — Edinburgh Postnatal Depression Scale (EPDS)",
    tags: ["epds","edinburgh","postnatal depression scale","score","10","13","scoring","threshold","sensitivity","specificity","question 10","suicidal ideation","screening tool"],
    content: [
      { type: "subheading", value: "EPDS Overview" },
      { type: "text", value: "The Edinburgh Postnatal Depression Scale (EPDS) is a 10-item self-report questionnaire validated for use in the perinatal period. Each item is scored 0–3; total score 0–30. It screens for depression and anxiety and detects suicidal ideation." },
      { type: "subheading", value: "EPDS Scoring Interpretation" },
      { type: "table", headers: ["Total Score", "Interpretation", "Action"], rows: [
        ["0–9", "Unlikely depression", "Routine care; reassess at next visit if concerns"],
        ["10–12", "Possible mild depression", "Discuss results; offer self-help and watchful waiting; follow up in 2 weeks"],
        ["≥13", "Probable depression (or anxiety disorder)", "Refer for professional assessment (GP, IAPT, perinatal MH team); do not leave without a plan"],
        ["Any score ≥1 on Q10", "Suicidal ideation", "Urgent direct assessment — ask specifically about intent, plan, and access to means"],
      ]},
      { type: "subheading", value: "Administration Notes" },
      { type: "list", items: [
        "Mother completes questionnaire herself — refers to past 7 days",
        "Can be used antenatally and postnatally (validated in both settings)",
        "Available in multiple languages; use validated translated versions",
        "Question 10 (self-harm): 'The thought of harming myself has occurred to me' — any positive response requires immediate action",
        "Score ≥13 postnatally has ~80% sensitivity and ~88% specificity for major depression",
        "EPDS is a screening tool only — it does not make a diagnosis; formal clinical assessment is required",
      ]},
      { type: "alert", value: "An EPDS score alone does not determine clinical care. A woman with a score of 9 who discloses self-harm thoughts needs urgent review; a score of 14 in a woman with strong social support may be managed differently from one who is isolated." },
    ]
  },
  {
    id: "cg192-management", gl: "CG192", condition: "Perinatal Mental Health", setting: "Management by Severity",
    title: "Perinatal Mental Health — Management by Severity",
    tags: ["management","mild","moderate","severe","psychological therapy","cbt","cognitive behavioural","ipt","interpersonal","counselling","talking therapy","iapt","specialist","perinatal team","crisis","mbu","mother and baby unit","admission"],
    content: [
      { type: "subheading", value: "Stepped Care Model" },
      { type: "table", headers: ["Severity", "Criteria", "Management"], rows: [
        ["Mild", "EPDS 10–12, mild functional impairment", "Self-help resources; low-intensity CBT or guided self-help; IAPT referral; watchful waiting"],
        ["Moderate", "EPDS ≥13 or moderate functional impairment", "High-intensity CBT or IPT; consider antidepressant; regular review; involve specialist if not improving"],
        ["Severe", "Severe depression, psychosis, or risk", "Urgent specialist perinatal mental health team; consider inpatient admission to MBU"],
        ["Crisis / Acute psychosis", "Risk to self, baby, or others; puerperal psychosis", "Emergency psychiatric assessment; MBU admission if possible; do NOT separate mother and baby if safe"],
      ]},
      { type: "subheading", value: "Mild to Moderate Depression / Anxiety" },
      { type: "list", items: [
        "Psychological therapies are first-line — CBT, interpersonal therapy (IPT), mindfulness-based cognitive therapy",
        "IAPT (Improving Access to Psychological Therapies) has perinatal pathways in most areas",
        "Peer support programmes and group therapy: useful adjunct",
        "Partner / family involvement with consent",
        "Assess and address social factors: housing, domestic abuse, social isolation",
      ]},
      { type: "subheading", value: "Puerperal Psychosis" },
      { type: "list", items: [
        "Onset typically within days to 2 weeks of delivery",
        "Features: rapidly changing mood (manic and depressive episodes), confusion, insomnia, delusions, hallucinations",
        "Medical emergency — requires immediate psychiatric assessment",
        "Admit to Mother and Baby Unit (MBU) if available — avoid separating mother and baby wherever safe",
        "Treatment: antipsychotics, mood stabilisers ± benzodiazepines",
        "Recurrence risk in future pregnancies: up to 50% — plan prospectively",
      ]},
    ]
  },
  {
    id: "cg192-medications", gl: "CG192", condition: "Perinatal Mental Health", setting: "Medications in Pregnancy",
    title: "Perinatal Mental Health — Medications in Pregnancy & Breastfeeding",
    tags: ["medication","antidepressant","ssri","sertraline","fluoxetine","paroxetine","citalopram","venlafaxine","snri","tricyclic","antipsychotic","olanzapine","quetiapine","lithium","sodium valproate","lamotrigine","mood stabiliser","breastfeeding","neonatal withdrawal","pphn"],
    content: [
      { type: "subheading", value: "General Principles" },
      { type: "list", items: [
        "Untreated severe mental illness carries significant risks to mother and baby — weigh risks of treatment vs. no treatment",
        "Discuss all medication decisions with the woman and her partner",
        "Involve specialist perinatal psychiatrist in complex cases or medication decisions",
        "Use the lowest effective dose; avoid polypharmacy where possible",
        "Inform neonatology of maternal psychotropic use before delivery",
      ]},
      { type: "subheading", value: "Antidepressants (SSRIs)" },
      { type: "list", items: [
        "Sertraline: preferred first-line SSRI — extensive safety data, lowest placental transfer, compatible with breastfeeding",
        "Fluoxetine: second choice — long half-life increases neonatal exposure; compatible with breastfeeding",
        "Paroxetine: avoid in first trimester (small risk of neonatal cardiac defects); use with caution if already established",
        "Citalopram / escitalopram: generally considered safe; moderate breastfeeding transfer",
        "Venlafaxine (SNRI): consider if SSRI failed; increased risk of neonatal adaptation syndrome",
        "Neonatal adaptation syndrome (NAS): jitteriness, feeding difficulty, irritability in first few days — usually self-limiting",
        "PPHN (persistent pulmonary hypertension of newborn): small increased risk with late pregnancy SSRI use — do NOT stop medication solely for this reason",
      ]},
      { type: "subheading", value: "Mood Stabilisers & Antipsychotics" },
      { type: "list", items: [
        "Lithium: teratogenic (Ebstein's anomaly — small absolute risk); monitor levels; fetal cardiac scan at 18–20 weeks; target level 0.4–0.6 mmol/L; withhold in labour and restart postnatally",
        "Sodium valproate: CONTRAINDICATED in pregnancy (high rates of NTDs, developmental delay, autism — PREVENT programme)",
        "Lamotrigine: relatively safe; dose often needs increasing in pregnancy (reduced levels); safe in breastfeeding",
        "Quetiapine / olanzapine: consider for psychosis or bipolar — monitor for gestational diabetes",
        "Haloperidol: use when necessary for acute psychosis; fetal effects generally acceptable",
      ]},
      { type: "alert", value: "Sodium valproate must NOT be prescribed to women of childbearing potential without a Pregnancy Prevention Programme (PPP) in place — current MHRA guidance. If a woman on valproate becomes pregnant, refer urgently to specialist." },
    ]
  },
  {
    id: "cg192-postnatal", gl: "CG192", condition: "Perinatal Mental Health", setting: "Postnatal & Future Planning",
    title: "Perinatal Mental Health — Postnatal Care & Future Pregnancy Planning",
    tags: ["postnatal","baby blues","paternal mental health","bonding","attachment","safeguarding","child protection","future pregnancy","relapse prevention","preconception","recurrence risk","mbu","discharge"],
    content: [
      { type: "subheading", value: "Baby Blues vs. PND vs. Psychosis" },
      { type: "table", headers: ["Condition", "Timing", "Features", "Management"], rows: [
        ["Baby Blues", "Days 3–5", "Emotional lability, tearfulness — very common (up to 80%)", "Reassurance; usually resolves by day 10"],
        ["Postnatal Depression (PND)", "Usually first 3 months, up to 1 year", "EPDS ≥13, low mood, anhedonia, anxiety, bonding difficulties", "Psychological therapies ± antidepressants"],
        ["Puerperal Psychosis", "Within 2 weeks of delivery", "Mania, depression, psychosis, rapid onset", "Emergency psychiatric admission to MBU"],
      ]},
      { type: "subheading", value: "Bonding & Attachment" },
      { type: "list", items: [
        "Perinatal mental illness can impair mother-infant bonding and infant development",
        "Video interaction guidance (VIG) and watch-wait-wonder: effective for improving bonding",
        "Involve health visitor in monitoring mother-infant relationship",
        "Document any concerns about neglect or harm to infant — refer to safeguarding if required",
      ]},
      { type: "subheading", value: "Paternal Mental Health" },
      { type: "list", items: [
        "Up to 10% of fathers experience postnatal depression — often under-recognised",
        "Screen if mother has PND, or if paternal distress is apparent",
        "Refer to GP and IAPT",
      ]},
      { type: "subheading", value: "Future Pregnancy Planning" },
      { type: "list", items: [
        "Preconception counselling: adjust medications before conception where possible",
        "Relapse prevention plan: document in notes and share with GP, community midwife, HV, and perinatal team",
        "Bipolar disorder / previous puerperal psychosis: high recurrence risk — plan prophylaxis (lithium, quetiapine) from early postpartum period",
        "All women with severe perinatal mental illness: complete a Perinatal Mental Health Care Plan (PMHCP) by end of second trimester",
      ]},
      { type: "alert", value: "If you are concerned about a woman's safety or the safety of her baby, act immediately — contact the duty consultant and safeguarding team. Safety concerns override confidentiality." },
    ]
  },
];
