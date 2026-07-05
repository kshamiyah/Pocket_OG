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
        "Intrauterine fetal death (see GL862)",
        "Obstetric cholestasis with bile acids >100 — offer IOL at 37–39+6 weeks",
        "Raised PCR ≥30 with hypertension/PET symptoms — offer IOL at 39–40+6 weeks",
      ]},
      { type: "subheading", value: "Contraindications" },
      { type: "list", items: [
        "Severe fetal growth restriction with confirmed fetal compromise",
        "Any case of fetal compromise already identified",
      ]},
      { type: "subheading", value: "IOL Priority Table" },
      { type: "text", value: "The full table of recommended gestation and priority for each indication is in the next section, IOL: Timing by Indication." },
    ]
  },
  {
    id: "gl861-iol-timing", gl: "GL861", condition: "Induction of Labour", setting: "Timing by Indication",
    title: "IOL: Timing by Indication",
    flowchartId: "GL861_TIMING",
    tags: ["induction timing","when to induce","iol timing by indication","iol priority table","recommended gestation for induction","timing of birth","timing of induction","post-dates 40+7","gdm induction timing","diabetes induction timing","cholestasis delivery timing","pre-eclampsia induction timing","reduced fetal movements induction","maternal age induction","raised pcr","anticoagulation induction","iol priority","priority 1","priority 2","by indication"],
    content: [
      { type: "text", value: "Recommended gestation and IOL priority for each indication. Discuss timing with the woman, document the indication clearly, and see the linked guideline for full management. Decision aid only; clinical responsibility remains with the treating clinician." },
      { type: "table", headers: ["Indication", "Recommended gestation", "Priority", "See also"], rows: [
        ["Post-dates", "40+7", "Routine", ""],
        ["Reduced fetal movements (no other cause)", "From 38+6", "2 (senior)", "GTG57"],
        ["Maternal age 40–44", "40+0", "2", ""],
        ["Maternal age ≥45", "38+0", "2", ""],
        ["Pre-existing diabetes (Type 1 or 2)", "37+0 to 38+6", "1", "GL983"],
        ["GDM, low risk (stable glucose, normal growth)", "40+3 to 40+6", "2", "GL983"],
        ["GDM, macrosomia or complications", "37 to 40", "2", "GL983"],
        ["Hypertension / pre-eclampsia", "ASAP after diagnosis, ≥37+0", "1", "GL952"],
        ["Hypertension, non-proteinuric (outpatient)", "40+0 to 40+6", "2", "GL952"],
        ["Obstetric cholestasis (bile acids >100)", "37+0 to 39+6", "2", "GL880"],
        ["Raised PCR ≥30 with hypertension symptoms", "39+0 to 40+6", "2", "GL952"],
        ["IUGR / SGA (consultant decision only)", "Individualised", "1", "GTG31"],
        ["Full therapeutic anticoagulation", "39+0", "1", "GL891"],
        ["APH (inpatient)", "Individualised", "1", "GTG63"],
      ]},
      { type: "text", value: "Priority 1: aim to book within 24 to 48 hours. IUGR/SGA and APH are individualised senior or consultant decisions and are not booked without explicit agreement." },
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
        "Record fluid balance throughout — refer to Hyponatraemia guideline (GL1177)",
      ]},
      { type: "subheading", value: "Modified Bishop Score" },
      { type: "table", headers: ["Parameter", "0", "1", "2", "3"], rows: [
        ["Dilatation (cm)", "<1", "1–2", "2–4", ">4"],
        ["Length (cm)", ">4", "2–4", "1–2", "<1"],
        ["Consistency", "Firm", "Average", "Soft", "—"],
        ["Position", "Posterior", "Mid/Ant", "—", "—"],
        ["Level", "-3", "-2", "-1 / 0", "+"],
      ]},
      { type: "text", value: "Bishop score <6 → consider cervical ripening balloon (CRB) as first line. If ARM is immediately possible, this should be recommended and facilitated without delay. Do not give CRB or prostaglandins if ARM is possible but transfer to intrapartum area is delayed." },
    ]
  },
  {
    id: "gl861-crb", gl: "GL861", condition: "Induction of Labour", setting: "Cervical Ripening Balloon",
    title: "IOL — Cervical Ripening Balloon (CRB)",
    tags: ["crb","cervical ripening balloon","balloon","induction of labour","iol","bishop score","prostaglandins","silicone","double balloon","saline","60ml","12 hours","24 hours","outpatient iol","inpatient iol","arm","artificial rupture of membranes","propess","srom","cord prolapse","unstable","palpation","bladder","urine","outpatient"],
    content: [
      { type: "subheading", value: "CRB — First-Line IOL" },
      { type: "text", value: "Silicone double balloon catheter inflated with saline (maximum 60 ml per balloon). Gradually dilates the cervix by applying gentle constant pressure at the internal and external os. No pharmaceutical involvement — suitable in IUGR/SGA." },
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
        "Inform woman of likely abdominal discomfort 4–6 hours after insertion — offer simple analgesia",
        "CRB should remain in for 12 hours before removal and assessment for ARM + oxytocin",
        "Maximum duration in situ: 24 hours if labour ward is busy",
        "If presenting part is high after balloon removed — encourage walking for 60 minutes before ARM; if unstable refer to senior obstetrician",
      ]},
      { type: "alert", value: "CRB must NOT be used in conjunction with prostaglandins. Remove balloon if SROM occurs." },
      { type: "subheading", value: "If Balloon Falls Out" },
      { type: "list", items: [
        "Before 12 hours with unfavourable cervix — reinsert another CRB, continue timings from original insertion",
        "Likely effective if falls out after adequate duration — offer VE to confirm favourable cervix, arrange ARM and transfer",
      ]},
      { type: "subheading", value: "Outpatient IOL Criteria" },
      { type: "list", items: [
        "≥37 completed weeks, low risk, singleton, no SROM, cephalic with non-ballotable head, unscarred uterus",
        "Woman has responsible adult at home, understands advice leaflet, has transport to return",
        "Return immediately if: contractions (more than period cramps), SROM, decreased fetal movements, pyrexia/flu symptoms, unable to pass urine, CRB falls out, or worried for any reason",
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
        "Insert into posterior fornix, rotate transversely; most tape placed in lower vagina",
        "Woman should remain lying down for at least 30 minutes after insertion",
        "While in situ: 4-hourly HR, BP, temp, RR and auscultation of fetal heart",
        "Further vaginal assessment only if contracting 3–4:10 or membranes rupture",
        "Once contractions begin: CTG for fetal wellbeing + hourly observations if CTG normal",
        "Opioid analgesia request should prompt CTG",
        "Remove if regular contractions and cervix >3 cm dilated",
        "Remove after 24 hours if not removed earlier",
        "SROM confirmed — propess may remain in situ unless in established labour or 24 hours has elapsed",
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
        "CTG continuously for 1 hour post-insertion; repeat CTG when contractions begin",
        "If Prostin inserted, commence oxytocin 6–8 hours later",
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
        "May be carried out on IOL suite prior to transfer to delivery suite if a midwife is available for labour care",
        "If head is high with risk of cord prolapse — escalate to MW in charge and on-call obstetric team (registrar bleep 555 or consultant bleep 266); consider controlled procedure with fundal pressure or oxytocin to induce contractions",
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
        "Low-risk multips may transfer to MLU for ARM; mobilise for 1 hour post-ARM; reassess 4 hours after ARM and transfer to delivery suite if no contractions or cervical change",
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
        "If all normal, arrange: twice-weekly liquor volume assessment, alternate-day CTGs, weekly ANC appointments",
        "Strongly advise delivery if non-reassuring fetal movements, CTG changes, or reduction in liquor volume",
      ]},
    ]
  },
  {
    id: "gl861-prom-assessment", gl: "GL861", condition: "Term PLRoM", setting: "Assessment",
    flowchartId: "GL895_ROM_TRIAGE",
    title: "Term PLRoM — Assessment & Expectant Management",
    tags: ["prom","plrom","term prom","rupture of membranes","srom","prelabour","waters breaking","amniotic fluid","amnisure","amni-sure","speculum","cord prolapse","limb prolapse","meows","ctg","fetal movements","expectant management","48 hours","meconium","gbs","pyrexia","37 weeks","delivery","term"],
    content: [
      { type: "subheading", value: "Assessment for Suspected SROM" },
      { type: "list", items: [
        "Maternal observations (BP, RR, HR, temp) and MEOWS score",
        "Abdominal palpation for presentation and fifths palpable",
        "Auscultation of fetal heart in low-risk mothers; CTG for consultant-care patients or any concern",
        "If obvious PROM (liquor visible): sterile speculum examination to exclude cord/limb presentation — avoid digital examinations (increase infection risk and stimulate prostaglandins)",
        "If no liquor seen: sterile speculum examination to confirm SROM and exclude cord/limb prolapse",
        "If no liquor seen on speculum: perform AmniSure test to confirm SROM",
        "Provide 'Pre-labour Rupture of Membranes' leaflet",
      ]},
      { type: "subheading", value: "Expectant Management" },
      { type: "list", items: [
        "Aim: baby born within 48 hours of SROM",
        "Offer expectant management for 18–24 hours or immediate induction — woman's choice",
        "VE for modified Bishop Score should ONLY be offered when woman returns to hospital (not at initial assessment if choosing expectant management)",
        "Woman may wait at home during expectant management",
      ]},
      { type: "subheading", value: "Reasons to Return Immediately" },
      { type: "list", items: [
        "Liquor becomes meconium-stained",
        "Contractions become regular and painful",
        "Maternal pyrexia (≥37.2°C)",
        "Change in fetal movements",
      ]},
      { type: "alert", value: "Offer immediate induction for: meconium, known GBS carriers, or maternal pyrexia — discuss with senior obstetrician and delivery suite coordinator." },
    ]
  },
  {
    id: "gl861-prom-antibiotics", gl: "GL861", condition: "Term PLRoM", setting: "Antibiotics & IOL",
    title: "Term PLRoM — Antibiotics & Induction",
    tags: ["prom","plrom","term prom","antibiotics","amoxicillin","azithromycin","penicillin allergy","benzylpenicillin","teicoplanin","iv antibiotics","pyrexia","48 hours","gbs","group b strep","propess","prostin","oxytocin","bishop score","unfavourable cervix","augmentation","mau","delivery suite","capacity"],
    content: [
      { type: "subheading", value: "Antibiotic Prescribing" },
      { type: "table", headers: ["Scenario", "Antibiotic"], rows: [
        ["Pyrexia or >48 hours post-ROM — oral (not in labour)", "Amoxicillin 1g 8-hourly for 7 days OR until established labour"],
        ["Penicillin allergy — oral (not in labour)", "Azithromycin 500mg 24-hourly for 7 days OR until established labour"],
        ["In labour (IV)", "Benzylpenicillin 3g stat, then 1.5g 4-hourly until delivered"],
        ["Penicillin allergy — in labour (IV)", "Teicoplanin 10mg/kg STAT, then 10mg/kg every 12 hours until delivered"],
        ["GBS positive", "IV antibiotics when SROM diagnosed — advise immediate induction"],
      ]},
      { type: "subheading", value: "IOL for Term PLRoM" },
      { type: "list", items: [
        "If cervix unfavourable (Bishop score ≤6): consider Propess or Prostin gel after discussion with obstetrician — arrange via IOL suite or DAU",
        "If Propess inserted: commence oxytocin 24 hours later",
        "If Prostin inserted: commence oxytocin 6–8 hours later",
        "Admit usually 18–24 hours after SROM — woman to phone delivery suite to arrange suitable time",
        "Woman's details (including phone number) must be recorded on delivery suite board and DS coordinator made aware",
      ]},
      { type: "subheading", value: "If Augmentation Cannot Commence within 24 hours (Capacity)" },
      { type: "list", items: [
        "Bring woman into MAU: full observations, CTG, and offer VE for Bishop score",
        "Consider Prostin after discussion with obstetrician",
        "If capacity remains an issue: admit to postnatal ward to await augmentation — escalate any concerns to obstetric team",
      ]},
    ]
  },
];
