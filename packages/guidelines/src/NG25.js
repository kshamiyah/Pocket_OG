export const NG25_SECTIONS = [
  {
    id: "ng25-overview", gl: "NG25", condition: "Preterm Labour & Birth", setting: "Overview & Definitions",
    title: "Preterm Labour — Overview & Definitions",
    tags: ["preterm","preterm labour","preterm birth","37 weeks","extremely preterm","28 weeks","very preterm","32 weeks","moderate late preterm","36 weeks","singleton","multiple","risk factors"],
    content: [
      { type: "subheading", value: "Definitions" },
      { type: "list", items: [
        "Preterm birth: birth before 37+0 weeks of gestation",
        "Extremely preterm: <28+0 weeks",
        "Very preterm: 28+0–31+6 weeks",
        "Moderate preterm: 32+0–33+6 weeks",
        "Late preterm: 34+0–36+6 weeks",
        "Preterm birth affects ~8% of all births in the UK",
      ]},
      { type: "subheading", value: "Risk Factors for Spontaneous Preterm Labour" },
      { type: "list", items: [
        "Previous preterm birth (most significant single risk factor)",
        "Short cervical length on transvaginal ultrasound (<25 mm at 16–24 weeks)",
        "Multiple pregnancy",
        "Uterine anomalies (bicornuate uterus, large fibroids)",
        "Cervical insufficiency / previous LLETZ procedure",
        "Fetal fibronectin (fFN) positive in cervicovaginal secretions",
        "Polyhydramnios, intrauterine infection / chorioamnionitis",
        "Smoking, substance misuse",
        "Low socioeconomic status",
      ]},
      { type: "subheading", value: "Guideline Scope (NICE NG25)" },
      { type: "text", value: "NICE NG25 covers singleton pregnancies presenting with symptoms of preterm labour or at high risk of preterm birth. Separate guidance applies to multiple pregnancies. Prophylactic interventions (cervical cerclage, progesterone) are covered if indicated." },
    ]
  },
  {
    id: "ng25-diagnosis", gl: "NG25", condition: "Preterm Labour & Birth", setting: "Diagnosis",
    title: "Preterm Labour — Diagnosis (Cervical Length & fFN)",
    tags: ["diagnosis","suspected preterm labour","cervical length","transvaginal ultrasound","tvs","ffn","fetal fibronectin","15mm","25mm","positive","negative","ppv","npv","not in labour","false labour"],
    content: [
      { type: "subheading", value: "Suspected Preterm Labour — Key Criteria" },
      { type: "list", items: [
        "Regular uterine contractions (≥4 in 20 minutes) AND / OR",
        "Clinical signs of cervical change (dilation, effacement, length on speculum)",
        "Onset before 37+0 weeks gestation",
      ]},
      { type: "subheading", value: "Diagnosis at ≥30+0 Weeks" },
      { type: "text", value: "Use transvaginal ultrasound (TVS) cervical length as the primary diagnostic test." },
      { type: "table", headers: ["Cervical Length", "Interpretation", "Action"], rows: [
        ["<15 mm", "In preterm labour", "Treat as preterm labour (steroids, MgSO₄, tocolysis if <34 weeks)"],
        ["15–25 mm", "Equivocal", "Offer fFN testing if TVS equivocal; use clinical judgement"],
        [">25 mm", "Unlikely to deliver within 48 hours", "Observe; discharge with advice if no clinical deterioration"],
      ]},
      { type: "subheading", value: "Fetal Fibronectin (fFN)" },
      { type: "list", items: [
        "Offer if TVS not available or not acceptable at ≥30+0 weeks",
        "Take swab from posterior vaginal fornix BEFORE any vaginal examination",
        "fFN >50 ng/ml: treat as in preterm labour",
        "fFN negative: very high NPV (>95%) — unlikely to deliver within 2 weeks",
        "Do NOT take fFN if intercourse within 24 hours, if vaginal bleeding present, or if membranes ruptured",
      ]},
      { type: "subheading", value: "Diagnosis at <30+0 Weeks" },
      { type: "list", items: [
        "Clinical assessment is primary (TVS + fFN less validated at very early gestations)",
        "Treat on clinical suspicion — do not delay treatment to wait for test results",
        "Speculum examination to assess cervix and to exclude membrane rupture",
      ]},
      { type: "alert", value: "Do NOT perform a digital vaginal examination in suspected preterm labour if membranes may be ruptured — risk of ascending infection and cord prolapse." },
    ]
  },
  {
    id: "ng25-steroids", gl: "NG25", condition: "Preterm Labour & Birth", setting: "Corticosteroids",
    title: "Preterm Labour — Antenatal Corticosteroids",
    tags: ["corticosteroids","betamethasone","dexamethasone","antenatal steroids","fetal lung maturity","ards","rds","respiratory distress","24 weeks","35 weeks","surfactant","repeat dose","rescue dose"],
    content: [
      { type: "subheading", value: "Indication & Dose" },
      { type: "list", items: [
        "Offer to women at 24+0 to 33+6 weeks in suspected, diagnosed or established preterm labour, having a planned preterm birth, or with P-PROM",
        "Consider for women at 34+0 to 35+6 weeks in the same circumstances",
        "Betamethasone 12 mg IM × 2 doses, 24 hours apart (preferred)",
        "Alternative: dexamethasone 6 mg IM × 4 doses, 12 hours apart",
        "Benefit: reduces rate of RDS, IVH, necrotising enterocolitis, neonatal mortality",
        "Maximum benefit reached 24 hours after first dose and persists for 7 days",
      ]},
      { type: "subheading", value: "Single Rescue Course" },
      { type: "list", items: [
        "Offer a single rescue course if: previous course given >7 days ago AND still <35+6 weeks AND birth imminent",
        "Do NOT routinely give more than 2 courses",
        "Evidence for rescue course: reduced RDS and surfactant use",
      ]},
      { type: "subheading", value: "Special Circumstances" },
      { type: "list", items: [
        "Gestational diabetes / pre-existing diabetes: monitor blood glucose closely — corticosteroids cause hyperglycaemia; consider VRII",
        "Threatened preterm labour that does not progress: corticosteroids given are not wasted — protect for any future preterm episode",
        "36–38 weeks (RCOG/NICE guidance): consider if planned preterm caesarean at these gestations to reduce admission for TTN",
      ]},
      { type: "alert", value: "Even if delivery seems imminent, give the first dose of betamethasone — partial courses still offer fetal benefit." },
    ]
  },
  {
    id: "ng25-mgso4", gl: "NG25", condition: "Preterm Labour & Birth", setting: "Magnesium Sulphate",
    title: "Preterm Labour — Magnesium Sulphate (Neuroprotection)",
    tags: ["magnesium sulphate","mgso4","neuroprotection","cerebral palsy","intraventricular haemorrhage","ivh","30 weeks","33 weeks","loading dose","maintenance","4g","1g","toxicity","respiratory depression","patellar reflex"],
    content: [
      { type: "subheading", value: "Indication" },
      { type: "list", items: [
        "Offer MgSO₄ to women in confirmed preterm labour at <30+0 weeks for fetal neuroprotection",
        "Consider up to 33+6 weeks (evidence weaker but some benefit shown)",
        "Reduces risk of cerebral palsy and gross motor dysfunction in preterm infants",
      ]},
      { type: "subheading", value: "Dosing Protocol" },
      { type: "list", items: [
        "Loading dose: 4 g IV over 15–20 minutes",
        "Maintenance: 1 g/hour IV infusion until birth or for maximum 24 hours (whichever is sooner)",
        "If birth likely within 24 hours: start immediately",
        "Discontinue if: delivery not imminent after 24 hours, or maternal toxicity develops",
      ]},
      { type: "subheading", value: "Monitoring for Toxicity" },
      { type: "list", items: [
        "Patellar (knee) reflexes hourly — loss of reflexes is earliest sign of toxicity (Mg ~5–7 mmol/L)",
        "Respiratory rate every 30 minutes — RR <16/min: withhold infusion",
        "Urine output hourly — must be ≥25 ml/hr",
        "Serum Mg level if toxicity suspected (not routine)",
        "Calcium gluconate 1 g IV (10 ml of 10%): antidote for respiratory depression",
      ]},
      { type: "alert", value: "MgSO₄ for neuroprotection is separate from its use as a tocolytic (NOT recommended as tocolysis in the UK). Do not use for both purposes simultaneously." },
    ]
  },
  {
    id: "ng25-tocolysis", gl: "NG25", condition: "Preterm Labour & Birth", setting: "Tocolysis",
    title: "Preterm Labour — Tocolysis",
    tags: ["tocolysis","tocolytic","nifedipine","atosiban","ritodrine","betamimetics","24 weeks","34 weeks","48 hours","preterm delivery","delay","steroids","transfer"],
    content: [
      { type: "subheading", value: "When to Offer Tocolysis" },
      { type: "list", items: [
        "Offer tocolysis to women at 24+0 to 33+6 weeks in suspected or confirmed preterm labour",
        "Goal: delay birth by at least 48 hours to allow corticosteroids to take effect and arrange in-utero transfer",
        "Do NOT routinely offer tocolysis after 34 weeks — risks outweigh benefits at later gestations",
        "Do NOT offer tocolysis if: signs of chorioamnionitis, fetal distress, significant antepartum haemorrhage, or placenta praevia with active bleeding",
      ]},
      { type: "subheading", value: "First-Line: Nifedipine" },
      { type: "list", items: [
        "Nifedipine (calcium channel blocker) — oral, licensed, most evidence",
        "Loading: 20 mg PO stat, then 10–20 mg QDS for up to 48 hours",
        "Monitoring: BP every 30 minutes for 2 hours after loading dose (may cause hypotension)",
        "Avoid if: maternal hypotension, hepatic impairment, or concurrent use of MgSO₄ (additive hypotension risk)",
      ]},
      { type: "subheading", value: "Alternative: Atosiban" },
      { type: "list", items: [
        "Atosiban (oxytocin receptor antagonist) — IV, licensed in UK",
        "Loading: 6.75 mg IV bolus over 1 minute",
        "Then 18 mg/hour IV for 3 hours, then 6 mg/hour for up to 45 hours",
        "Fewer cardiovascular side effects than beta-agonists; more expensive than nifedipine",
        "Use if nifedipine contraindicated or not tolerated",
      ]},
      { type: "alert", value: "Beta-agonists (ritodrine, salbutamol) are NOT recommended due to unacceptable maternal cardiovascular side effects. Magnesium sulphate alone is NOT recommended as tocolysis in the UK." },
    ]
  },
  {
    id: "ng25-transfer", gl: "NG25", condition: "Preterm Labour & Birth", setting: "Transfer & Delivery",
    title: "Preterm Labour — In-Utero Transfer & Intrapartum Care",
    tags: ["in utero transfer","transfer","neonatal unit","level 3","level 2","27 weeks","28 weeks","delivery","iol","mode of delivery","monitoring","fetal scalp electrode","fetal blood sample","22 weeks","23 weeks","viability","periviability"],
    content: [
      { type: "subheading", value: "In-Utero Transfer (IUT)" },
      { type: "list", items: [
        "Advise transfer to maternity unit with Level-3 (NICU) neonatal care for women at <27+0 weeks (singleton) or <28+0 weeks (multiple)",
        "Do NOT transfer if: delivery imminent or expected within 3–4 hours, or maternal instability",
        "Ensure tocolysis and steroids given before/during transfer where possible",
        "Give loading dose of MgSO₄ before transfer if <30 weeks",
        "All IUT should follow local protocol (CG508 or equivalent)",
      ]},
      { type: "subheading", value: "Periviable Birth (22+0 to 25+6 Weeks)" },
      { type: "list", items: [
        "Decisions at the margins of viability should be made collaboratively with parents after appropriate counselling",
        "Survival rates (UK EPICURE data): <24 weeks ~10%, 24 weeks ~30%, 25 weeks ~50%, 26 weeks ~65%",
        "Senior neonatologist + senior obstetrician should be involved in all births <26 weeks",
        "Document detailed parental discussions and decisions clearly",
      ]},
      { type: "subheading", value: "Intrapartum Care if Preterm Labour Continues" },
      { type: "list", items: [
        "Continuous CTG in active labour",
        "Avoid fetal scalp electrode if <34+0 weeks (risk of scalp trauma in preterm neonate)",
        "Fetal blood sampling: not routinely recommended before 34+0 weeks",
        "Paediatric / NICU team must be present at delivery",
        "Cord clamping: delayed cord clamping (≥60 seconds) recommended if baby not requiring immediate resuscitation",
      ]},
      { type: "alert", value: "Oral tocolysis is not a substitute for IV tocolysis if delivery is imminent. If transfer is taking place, continue IV tocolysis during transfer with monitoring." },
    ]
  },
];
