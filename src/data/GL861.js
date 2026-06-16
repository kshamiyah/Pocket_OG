export const GL861_SECTIONS = [
  {
    id: "gl861-indications", gl: "GL861", condition: "Induction of Labour", setting: "Indications & Contraindications",
    title: "IOL — Indications & Contraindications",
    flowchartId: "GL861_IOL",
    tags: ["induction of labour","iol","indications","post-dates","post-maturity","40+7","rfm","reduced fetal movements","38+6","maternal age","advanced maternal age","diabetes","hypertension","pre-eclampsia","pet","fetal growth restriction","iugr","contraindications","fetal compromise","obstetric cholestasis","bile acids","pcr","aph","iufd","intrauterine fetal death","anticoagulation"],
    content: [
      { type: "subheading", value: "Indications" },
      { type: "list", items: [
        "Post-maturity — offer IOL at 40+7 weeks",
        "Reduced fetal movements — if presenting from 38+6 weeks",
        "Maternal age ≥40 at conception: age 40–44 recommend IOL at 40 weeks; age ≥45 recommend IOL at 38 weeks",
        "Diabetes (see Diabetes in pregnancy GL983)",
        "Hypertension / Pre-eclampsia (see GL952) — induce as soon as possible after diagnosis at ≥37 weeks",
        "Fetal growth restriction (with consultant agreement only)",
        "Obstetric cholestasis with bile acids >100 — offer IOL at 37–39+6 weeks",
        "Raised PCR ≥30 with hypertension/PET symptoms — offer IOL at 39–40+6 weeks",
      ]},
      { type: "subheading", value: "Contraindications" },
      { type: "list", items: [
        "Severe fetal growth restriction with confirmed fetal compromise",
        "Any case of fetal compromise already identified",
      ]},
      { type: "subheading", value: "IOL Priority Table" },
      { type: "table", headers: ["Condition", "Gestation (weeks)", "Priority"], rows: [
        ["Post-dates", "40+7", "Routine"],
        ["Pre-existing diabetes (Type 1/2)", "37+0 to 38+6", "1"],
        ["GDM — low risk (stable glucose, normal growth)", "40+3 to 40+6", "2"],
        ["GDM — macrosomia / complications", "37–40", "2"],
        ["Maternal age 40–44", "40", "2"],
        ["Maternal age ≥45", "38", "2"],
        ["IUGR/SGA — consultant fetal medicine decision only", "Individual", "1"],
        ["PET (inpatient)", "ASAP after diagnosis at ≥37 wks", "1"],
        ["Hypertension, non-proteinuric (not requiring admission)", "40–40+6", "2"],
        ["Obstetric cholestasis (bile acids >100)", "37+0–39+6", "2"],
        ["Patients on full therapeutic anticoagulation", "39", "1"],
        ["APH (inpatient)", "Individual", "1"],
      ]},
    ]
  },
  {
    id: "gl861-assessment", gl: "GL861", condition: "Induction of Labour", setting: "Initial Assessment",
    title: "IOL — Initial Assessment & Bishop Score",
    tags: ["induction of labour","iol","bishop score","assessment","cervix","ctg","meows","abdominal palpation","ultrasound","cephalic","consent","fluid balance","ve","vaginal examination","cord presentation","modified bishop score","dilatation","effacement"],
    content: [
      { type: "subheading", value: "On Arrival Assessment" },
      { type: "list", items: [
        "Discussion about process, expectations and obtain consent",
        "Confirmation of dates and indication for IOL",
        "Review previous USS to exclude low-lying placenta",
        "Abdominal palpation and ultrasound scan to confirm cephalic presentation",
        "Computerised CTG",
        "Baseline observations (HR, RR, BP, temperature, urinalysis) and MEOWS score",
        "VE to assess the cervix and calculate Bishop score — palpate for cord presentation during VE",
        "Record fluid balance throughout",
      ]},
      { type: "subheading", value: "Modified Bishop Score" },
      { type: "table", headers: ["Parameter", "0", "1", "2", "3"], rows: [
        ["Dilatation (cm)", "<1", "1–2", "2–4", ">4"],
        ["Length (cm)", ">4", "2–4", "1–2", "<1"],
        ["Consistency", "Firm", "Average", "Soft", "—"],
        ["Position", "Posterior", "Mid/Ant", "—", "—"],
        ["Level", "-3", "-2", "-1 / 0", "+"],
      ]},
      { type: "text", value: "Bishop score <6 → consider cervical ripening balloon (CRB) as first line. If ARM is immediately possible, this should be recommended and facilitated without delay." },
    ]
  },
  {
    id: "gl861-crb", gl: "GL861", condition: "Induction of Labour", setting: "Cervical Ripening Balloon",
    title: "IOL — Cervical Ripening Balloon (CRB)",
    tags: ["crb","cervical ripening balloon","balloon","induction of labour","iol","bishop score","prostaglandins","silicone","double balloon","saline","60ml","12 hours","24 hours","outpatient iol","inpatient iol","arm","artificial rupture of membranes","propess","srom","cord prolapse","unstable","palpation","bladder","urine","outpatient"],
    content: [
      { type: "subheading", value: "CRB — First-Line IOL" },
      { type: "text", value: "Silicone double balloon catheter inflated with saline (maximum 60 ml per balloon). Gradually dilates the cervix by applying gentle constant pressure at the internal and external os." },
      { type: "subheading", value: "Exclusions" },
      { type: "list", items: [
        "Any contraindication to vaginal birth (placenta praevia, vasa praevia)",
        "Ruptured membranes (SROM)",
        "Unstable presenting part not engaged in the pelvis",
      ]},
      { type: "subheading", value: "Management" },
      { type: "list", items: [
        "Encourage woman to pass urine prior to insertion",
        "Monitor bladder function — if unable to pass urine every 3–4 hours, remove balloon and offer VE",
        "Maternal observations and CTG twice daily (more frequently if clinically indicated)",
        "CRB should remain in for 12 hours before removal and assessment for ARM + oxytocin",
        "Maximum duration in situ: 24 hours if labour ward is busy",
      ]},
      { type: "alert", value: "CRB must NOT be used in conjunction with prostaglandins. Remove balloon if SROM occurs." },
      { type: "subheading", value: "Outpatient IOL Criteria" },
      { type: "list", items: [
        "≥37 completed weeks, low risk, singleton, no SROM, cephalic with non-ballotable head, unscarred uterus",
        "Woman has responsible adult at home, understands advice leaflet, has transport to return",
        "Return immediately if: contractions (more than period cramps), SROM, decreased fetal movements, pyrexia, unable to pass urine, CRB falls out, or worried",
      ]},
    ]
  },
  {
    id: "gl861-propess", gl: "GL861", condition: "Induction of Labour", setting: "Propess / Dinoprostone",
    title: "IOL — Propess (Dinoprostone) & Prostin",
    tags: ["propess","dinoprostone","prostaglandin","prostin","induction of labour","iol","second line","caesarean section","previous cs","hyperstimulation","tachysystole","terbutaline","ctg","contractions","24 hours","3cm","unfavourable cervix","pessary","pgd","perineal","posterior fornix","bishop score"],
    content: [
      { type: "subheading", value: "Propess — Second-Line IOL" },
      { type: "text", value: "Controlled-release Dinoprostone 10 mg pessary, single dose lasting 24 hours. Used where CRB is contraindicated, staff unable to insert balloon, maternal preference, or following unsuccessful CRB." },
      { type: "alert", value: "Dinoprostone must NOT be used in women with a history of caesarean section without senior obstetrician review and agreement." },
      { type: "list", items: [
        "Do not give if contractions already present or abnormal CTG",
        "Insert into posterior fornix, rotate transversely; tape placed in lower vagina",
        "Woman should remain lying down for at least 30 minutes after insertion",
        "While in situ: 4-hourly HR, BP, temp, RR and auscultation of fetal heart",
        "Remove if regular contractions and cervix >3 cm dilated",
        "Remove after 24 hours if not removed earlier",
      ]},
      { type: "subheading", value: "Hyperstimulation vs Tachysystole" },
      { type: "table", headers: ["Condition", "Definition", "Action"], rows: [
        ["Hyperstimulation", ">5 contractions in 10 minutes WITH FHR abnormalities", "Remove propess. If not settling: Terbutaline 0.25 mg SC — refer to duty obstetrician"],
        ["Tachysystole", ">5 contractions in 10 minutes with NO FHR abnormalities", "Do NOT remove pessary. Observe and continue CTG"],
      ]},
      { type: "subheading", value: "Prostin (Dinoprostone 1 mg gel)" },
      { type: "list", items: [
        "Used after failure of one or two Propess pessaries",
        "May be used by midwife (Prostin PGD100) to induce labour 18–24 hours after PROM (term, low risk)",
        "Consultant discussion required before administration (exception: term PROM, low risk)",
        "Insert into posterior fornix — do not place gel into cervical canal",
        "CTG continuously for 1 hour post-insertion; commence oxytocin 6–8 hours later",
      ]},
    ]
  },
  {
    id: "gl861-amniotomy", gl: "GL861", condition: "Induction of Labour", setting: "ARM & Oxytocin",
    title: "IOL — Amniotomy (ARM) & Oxytocin",
    tags: ["amniotomy","arm","artificial rupture of membranes","oxytocin","syntocinon","induction of labour","iol","bishop score","cord prolapse","gbs","group b strep","benzylpenicillin","intrapartum antibiotics","augmentation","mlu","midwifery led unit","rushey","primip","multip","transfer"],
    content: [
      { type: "subheading", value: "Amniotomy (ARM)" },
      { type: "list", items: [
        "Perform if Bishop score >6 at start of induction or where ARM is immediately possible",
        "Perform after removal of CRB or Propess",
        "If head is high with risk of cord prolapse — escalate to MW in charge and on-call obstetric team (registrar bleep 555 or consultant bleep 266)",
      ]},
      { type: "subheading", value: "Oxytocin" },
      { type: "list", items: [
        "Commence ideally within 2 hours of ARM (discuss and agree with woman)",
        "If Propess inserted, commence oxytocin 24 hours later",
        "If Prostin gel inserted, commence oxytocin 6–8 hours later",
      ]},
      { type: "alert", value: "Women with GBS should be prescribed IV antibiotics (Benzylpenicillin) at the start of induction — administer when ARM or SROM occurs." },
      { type: "subheading", value: "IOL on Midwifery Led Unit (Rushey MLU)" },
      { type: "list", items: [
        "Women who go into labour after CRB, one Propess and/or ARM may labour on Rushey MLU if otherwise low risk — full CTG assessment required before transfer",
        "Low-risk multips may transfer to MLU for ARM; mobilise for 1 hour post-ARM; reassess 4 hours after ARM",
        "Low-risk primips may use this pathway following discussion with Rushey core midwife and maternity coordinator",
      ]},
    ]
  },
  {
    id: "gl861-unsuccessful", gl: "GL861", condition: "Induction of Labour", setting: "Unsuccessful / Declining IOL",
    title: "IOL — Unsuccessful & Declining IOL",
    tags: ["unsuccessful iol","failed induction","declining iol","42 weeks","40 weeks","caesarean","monitoring","ctg","liquor volume","ultrasound","rfm","fetal movements","weekly anc","overdue","post-dates","expectant management","surveillance"],
    content: [
      { type: "subheading", value: "Unsuccessful IOL" },
      { type: "list", items: [
        "If unable to perform ARM after above methods: full assessment including computerised CTG",
        "Senior obstetric review to agree plan: further attempts, expectant management, or caesarean birth",
      ]},
      { type: "subheading", value: "Patient Declining IOL (by 42 weeks, or 40 weeks if age ≥40)" },
      { type: "list", items: [
        "Counsel about risks and benefits — document informed decision",
        "Confirm no medical or obstetric reason for delivery, adequate fetal movements, no IUGR, normal liquor volume, reassuring CTG",
        "Arrange: twice-weekly liquor volume assessment, alternate-day CTGs, weekly ANC appointments",
        "Strongly advise delivery if non-reassuring fetal movements, CTG changes, or reduction in liquor volume",
      ]},
    ]
  },
];
