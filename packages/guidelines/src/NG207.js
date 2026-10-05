// NICE NG207: inducing labour.
// Published 4 November 2021. Replaces CG70 (2008) and evidence summary ESUOM11.
// Links to other NICE guidelines were refreshed in October 2023; the
// recommendations themselves are unchanged since publication.
// https://www.nice.org.uk/guidance/ng207
//
// Written from the source PDF, which is in this package and served from
// public/guidelines. Covers both halves of the local RBH guideline GL861:
// induction of labour, and prelabour rupture of membranes at term.
//
// NG207 gives no antibiotic regimens. For prelabour rupture of membranes it
// defers to the NICE guideline on neonatal infection, so the antibiotic
// choices in GL861 are local antimicrobial policy and are not reproduced here.
//
// Where NG207 and the local guideline differ on the first method to use at a
// Bishop score of 6 or less, that is set out in the "Guidance differs" card in
// the methods section rather than resolved in the text.

export const NG207_SECTIONS = [
  {
    id: "ng207-information", gl: "NG207", condition: "Induction of Labour", setting: "Information & Decision Making",
    title: "Induction of Labour: Information & Decision Making",
    tags: ["induction of labour","iol","consent","information","decision making","counselling","declining induction","birth options","place of birth","birthing pool","hyperstimulation","assisted birth","OASI","pain","hospital stay"],
    content: [
      { type: "alert", value: "Women can decide to proceed with, delay, decline or stop an induction. Respect that decision even if healthcare professionals disagree with it, do not let personal views influence the care given, and record the decision in her notes (1.1.5)." },
      { type: "subheading", value: "Discussing mode of birth" },
      { type: "list", items: [
        "Discuss preferences about mode of birth early in pregnancy, covering expectant management, induction of labour, or planned caesarean birth, and record the discussion (1.1.1)",
        "Confirm her preferences at antenatal visits towards the end of pregnancy, as they may have changed (1.1.2)",
      ]},
      { type: "subheading", value: "What induction means for her birth (1.1.3)" },
      { type: "text", value: "Explain that induction is a medical intervention that will affect her birth options and her experience of the birth process:" },
      { type: "list", items: [
        "Vaginal examinations are needed before and during induction, to choose the method and monitor progress",
        "Her choice of place of birth will be limited: oxytocin infusion, continuous fetal heart rate monitoring and epidurals are not available for home birth or in midwife-led units",
        "There may be limitations on the use of a birthing pool",
        "There may be a need for assisted vaginal birth using forceps or ventouse, with the associated increased risk of obstetric anal sphincter injury",
        "Pharmacological methods can cause hyperstimulation, which can change the fetal heart rate and result in fetal compromise",
        "An induced labour may be more painful than a spontaneous labour",
        "Her hospital stay may be longer than with a spontaneous labour",
      ]},
      { type: "subheading", value: "What to cover when offering induction (1.1.4, 1.1.5)" },
      { type: "list", items: [
        "The reasons it is being offered, and when, where and how it would be carried out",
        "Arrangements for support and pain relief",
        "The alternatives if she declines, or later decides not to proceed",
        "The risks and benefits in her specific circumstances, and the proposed methods",
        "That induction may not be successful, and how that would affect her options",
        "Give her time to discuss it with her partner, birth companion or family, point her to written information and the NHS website, and give her time to think",
      ]},
    ]
  },

  {
    id: "ng207-prolonged", gl: "NG207", condition: "Induction of Labour", setting: "Pregnancy Beyond 41 Weeks",
    title: "Pregnancy Lasting Longer Than 41 Weeks",
    tags: ["prolonged pregnancy","post dates","41 weeks","42 weeks","post term","stillbirth","neonatal death","NICU","expectant management","membrane sweep","fetal monitoring","MBRRACE","ethnicity","deprivation","dating scan"],
    content: [
      { type: "list", items: [
        "Give women with uncomplicated pregnancies every opportunity to go into spontaneous labour (1.2.1)",
        "Explain that labour usually starts naturally before 42+0 weeks, based on the gestational age from the dating scan (1.2.2)",
      ]},
      { type: "subheading", value: "When labour starts spontaneously (table 1)" },
      { type: "table", headers: ["Gestation", "Started at this gestation", "Cumulative"], rows: [
        ["31 weeks and under", "2.4%", "2.4%"],
        ["32+0 to 36+6", "5.3%", "7.7%"],
        ["37+0 to 37+6", "5.1%", "12.8%"],
        ["38+0 to 38+6", "12.1%", "24.9%"],
        ["39+0 to 39+6", "25.4%", "50.3%"],
        ["40+0 to 40+6", "32.5%", "82.8%"],
        ["41+0 to 41+6", "16.2%", "99.0%"],
        ["42+0 and over", "0.9%", "100%"],
      ]},
      { type: "subheading", value: "Risks beyond 41+0 weeks (1.2.3)" },
      { type: "list", items: [
        "Increased likelihood of caesarean birth",
        "Increased likelihood of the baby needing admission to a neonatal intensive care unit",
        "Increased likelihood of stillbirth and neonatal death",
      ]},
      { type: "text", value: "Discuss that induction from 41+0 weeks may reduce these risks, but that she will also need to weigh the impact of induction on her birth experience (1.2.4)." },
      { type: "alert", value: "Per the 2020 MBRRACE-UK perinatal mortality report, women from some minority ethnic backgrounds or living in deprived areas have an increased risk of stillbirth and may benefit from closer monitoring and additional support. Across all births, the stillbirth rate is more than twice as high in black babies (74 per 10,000) and around 50% higher in Asian babies (53 per 10,000) than in white babies (34 per 10,000), and almost twice as high in the most deprived areas (47 per 10,000) as the least deprived (26 per 10,000) (1.2.5)." },
      { type: "subheading", value: "If she chooses not to be induced" },
      { type: "list", items: [
        "Discuss her options from that point, such as expectant management or caesarean birth, and record her decision (1.2.6)",
        "Discuss whether she wants additional fetal monitoring from 42 weeks. Advise that monitoring gives only a snapshot, cannot reliably predict change afterwards, and that adverse effects including stillbirth cannot be reliably predicted or prevented even with it. Monitoring might consist of twice-weekly cardiotocography and ultrasound estimation of maximum amniotic pool depth (1.2.7)",
        "Offer the chance to discuss the decision again at every subsequent review (1.2.8)",
        "Advise her to contact her midwife or maternity unit if she changes her mind, or sooner if she has concerns such as reduced or altered fetal movements (1.2.9)",
      ]},
    ]
  },

  {
    id: "ng207-prom", gl: "NG207", condition: "Prelabour Rupture of Membranes", setting: "Term & Preterm",
    flowchartId: "NG207_PROM",
    title: "Prelabour Rupture of Membranes: Term & Preterm",
    tags: ["prelabour rupture of membranes","PROM","PPROM","term PROM","SROM","37 weeks","34 weeks","expectant management","24 hours","group B streptococcus","GBS","antibiotics","neonatal infection"],
    content: [
      { type: "subheading", value: "At term, at or after 37+0 weeks" },
      { type: "list", items: [
        "Offer a choice of expectant management for up to 24 hours, or induction of labour as soon as possible. Discuss the benefits and risks and take her circumstances and preferences into account (1.2.13)",
        "If she chooses expectant management, offer induction if labour has not started naturally after approximately 24 hours (1.2.14)",
        "Respect her decision if she chooses to wait beyond 24 hours, and discuss her options for birth from that point (1.2.15)",
        "If she has had a positive group B streptococcus test at any time in this pregnancy, offer immediate induction of labour or caesarean birth (1.2.16)",
      ]},
      { type: "subheading", value: "Preterm, before 37+0 weeks" },
      { type: "list", items: [
        "Do not induce before 34+0 weeks unless there are additional obstetric indications such as infection or fetal compromise. Offer expectant management until 37+0 weeks (1.2.10)",
        "After 34+0 but before 37+0 weeks, discuss expectant management until 37+0 weeks versus induction, taking into account risks to her (sepsis, possible caesarean birth), risks to the baby (sepsis, problems of preterm birth), local availability of neonatal intensive care, and her circumstances and preferences (1.2.11)",
        "After 34+0 but before 37+0 weeks with a positive group B streptococcus test at any time in this pregnancy, offer immediate induction of labour or caesarean birth (1.2.12)",
      ]},
      { type: "alert", value: "NG207 gives no antibiotic regimens. It defers to the NICE guideline on neonatal infection for intrapartum antibiotics. Antibiotic choices are set locally to match each unit's resistance patterns: check your trust's policy." },
    ]
  },

  {
    id: "ng207-circumstances", gl: "NG207", condition: "Induction of Labour", setting: "Specific Circumstances",
    title: "Induction in Specific Circumstances",
    tags: ["previous caesarean","uterine scar","uterine rupture","VBAC","maternal request","breech","external cephalic version","ECV","fetal growth restriction","FGR","macrosomia","big baby","shoulder dystocia","precipitate labour","dinoprostone contraindicated"],
    content: [
      { type: "subheading", value: "Previous caesarean birth" },
      { type: "text", value: "Discuss methods of induction so she can make an informed decision, covering that induction can lead to an increased risk of emergency caesarean birth and a risk of uterine rupture; the suitability of mechanical methods including the risk of infection; that the marketing authorisations for dinoprostone and misoprostol contraindicate their use with a uterine scar because they increase the risk of uterine rupture; and the risks and consequences of caesarean birth (1.2.17)." },
      { type: "list", items: [
        "If birth needs to be expedited, offer a choice of induction of labour or planned caesarean birth, taking her circumstances and preferences into account (1.2.18)",
        "Advise her she can choose neither, even when it may benefit her or her baby's health (1.2.19)",
      ]},
      { type: "subheading", value: "Breech, growth restriction and macrosomia" },
      { type: "list", items: [
        "Induction is not generally recommended if the baby is breech (1.2.21). Consider it only if birth needs to be expedited, external cephalic version is unsuccessful, declined or contraindicated, and she chooses not to have a planned caesarean birth (1.2.22)",
        "Do not induce if there is fetal growth restriction with confirmed fetal compromise: offer caesarean birth instead (1.2.23)",
        "For suspected macrosomia without diabetes, discuss that the options are expectant management, induction or caesarean birth, and that there is uncertainty about the benefits and risks. With induction the risk of shoulder dystocia is reduced, the risk of third- or fourth-degree tears is increased, and the risk of perinatal death, brachial plexus injury or emergency caesarean birth is the same between the two options (1.2.24)",
        "For suspected macrosomia with pre-existing or gestational diabetes, see the NICE guideline on diabetes in pregnancy (1.2.25)",
      ]},
      { type: "subheading", value: "Maternal request and precipitate labour" },
      { type: "list", items: [
        "Consider requests for induction only after discussing the benefits and risks, taking her circumstances and preferences into account (1.2.20)",
        "Do not routinely offer induction to women with a history of precipitate labour to avoid an unattended birth (1.2.26)",
      ]},
    ]
  },

  {
    id: "ng207-iufd", gl: "NG207", condition: "Induction of Labour", setting: "Intrauterine Fetal Death",
    title: "Intrauterine Fetal Death",
    tags: ["intrauterine fetal death","IUFD","stillbirth","mifepristone","misoprostol","dinoprostone","previous caesarean","bereavement","support","one to one care","off label"],
    content: [
      { type: "list", items: [
        "Offer support to help her, her partner and family cope with the emotional and physical consequences, and information about specialist support (1.2.27)",
        "If she appears physically well, her membranes are intact and there is no evidence of infection or bleeding, discuss the options of expectant management, induction of labour or caesarean birth, and respect her decision (1.2.28)",
        "If there is evidence of ruptured membranes, infection or bleeding, offer immediate induction of labour or caesarean birth (1.2.29)",
        "If she chooses induced labour, monitor uterine contractions, preferably by manual assessment, and provide one-to-one midwifery care during labour and birth (1.2.30)",
      ]},
      { type: "subheading", value: "Non-scarred uterus (1.2.31)" },
      { type: "text", value: "If she chooses induced labour, offer either oral mifepristone 200 mg followed by vaginal dinoprostone or oral or vaginal misoprostol, basing the choice and dosage on clinical circumstances and national protocols, or a mechanical method of induction." },
      { type: "alert", value: "In November 2021, some uses of mifepristone, dinoprostone and misoprostol were off label." },
      { type: "subheading", value: "Previous caesarean birth (1.2.32)" },
      { type: "text", value: "Discuss methods of induction so she can make an informed decision, covering the risk of uterine rupture; the suitability of mechanical methods including the risk of infection; that the marketing authorisations for dinoprostone and misoprostol contraindicate their use with a uterine scar; and the risks and consequences of caesarean birth." },
    ]
  },

  {
    id: "ng207-methods", gl: "NG207", condition: "Induction of Labour", setting: "Methods",
    flowchartId: "NG207_METHOD",
    title: "Methods for Induction of Labour",
    tags: ["membrane sweep","sweep","bishop score","dinoprostone","misoprostol","25 microgram","balloon catheter","osmotic dilator","mechanical method","amniotomy","ARM","oxytocin","hyperstimulation","39 weeks","prostaglandin"],
    content: [
      { type: "subheading", value: "Membrane sweeping" },
      { type: "list", items: [
        "Explain what a membrane sweep is, that it might make it more likely labour starts without additional pharmacological or mechanical methods, and that pain, discomfort and vaginal bleeding are possible (1.3.1)",
        "At antenatal visits after 39+0 weeks, discuss whether she would like a vaginal examination for membrane sweeping, and obtain verbal consent before carrying it out (1.3.2)",
        "Discuss whether she would like additional sweeping if labour does not start after the first sweep (1.3.3)",
        "Check there is no evidence of a low-lying placenta on previous scans before membrane sweeping and before induction (1.7.6)",
      ]},
      { type: "subheading", value: "Choosing a method by Bishop score" },
      { type: "text", value: "Explain that a vaginal examination to assess the readiness of the cervix, recorded as the Bishop score, helps decide which method is offered first, and obtain consent (1.3.4). A score of 8 or more generally indicates the cervix is ready to dilate; this guideline uses a threshold of 6 or less versus more than 6." },
      { type: "table", headers: ["Bishop score", "NG207 recommendation"], rows: [
        ["6 or less", "Offer dinoprostone as vaginal tablet, vaginal gel or controlled-release vaginal delivery system, or low dose (25 microgram) oral misoprostol tablets (1.3.7)"],
        ["6 or less, where pharmacological methods are unsuitable", "Consider a mechanical method such as a balloon catheter or osmotic cervical dilator, if there is a higher risk of or from hyperstimulation, or previous caesarean birth, or if she chooses a mechanical method (1.3.8)"],
        ["More than 6", "Offer amniotomy and an intravenous oxytocin infusion (1.3.9)"],
      ]},
      { type: "compare", id: "iol-first-method-bishop-6" },
      { type: "subheading", value: "Discussing the risks of each method (1.3.5)" },
      { type: "list", items: [
        "Both dinoprostone and misoprostol can cause hyperstimulation",
        "With pharmacological methods, uterine activity and fetal condition must be monitored regularly",
        "If hyperstimulation occurs the treatment is stopped, by giving no further medication or removing vaginally administered products where possible",
        "Products differ in how easily they can be removed: controlled-release systems are easier to remove than gel or vaginal tablets",
        "Hyperstimulation can be treated with tocolysis, but that caused by misoprostol may be harder to reverse",
        "Mechanical methods are less likely to cause hyperstimulation than pharmacological methods",
        "Follow the manufacturers' guidance on dinoprostone and misoprostol preparations, including when to remove controlled-release systems (1.3.6)",
      ]},
      { type: "text", value: "Advise her that she can have an amniotomy and choose whether or not to have an oxytocin infusion, or delay starting it, but that labour may take longer and there may be an increased risk of neonatal infection (1.3.10)." },
    ]
  },

  {
    id: "ng207-not-recommended", gl: "NG207", condition: "Induction of Labour", setting: "Methods Not Recommended",
    title: "Methods That Are Not Recommended",
    tags: ["not recommended","oral dinoprostone","intravenous dinoprostone","intracervical","PGF2","oxytocin alone","hyaluronidase","corticosteroids","oestrogen","relaxin","mifepristone","nitric oxide","herbal","acupuncture","homeopathy","castor oil","hot bath","enema","sexual intercourse"],
    content: [
      { type: "text", value: "Be aware that the available evidence does not support these methods for induction of labour." },
      { type: "subheading", value: "Pharmacological (1.4.1)" },
      { type: "list", items: [
        "Oral dinoprostone, intravenous dinoprostone, extra-amniotic dinoprostone or PGF2, intracervical dinoprostone, vaginal PGF2",
        "Intravenous oxytocin alone",
        "Hyaluronidase, corticosteroids, oestrogen, relaxin",
        "Mifepristone, except in combination for intrauterine fetal death (1.2.31)",
        "Vaginal nitric oxide donors",
      ]},
      { type: "subheading", value: "Non-pharmacological (1.4.2)" },
      { type: "list", items: [
        "Herbal supplements, acupuncture, homeopathy, castor oil, hot baths, enemas, sexual intercourse",
      ]},
    ]
  },

  {
    id: "ng207-assessment", gl: "NG207", condition: "Induction of Labour", setting: "Assessment, Monitoring & Pain",
    title: "Assessment Before Induction, Monitoring & Pain Relief",
    tags: ["assessment","fetal head","engagement","ultrasound","breech","bishop score","cardiotocography","CTG","monitoring","intermittent auscultation","pain relief","epidural","labour in water","hyperstimulation"],
    content: [
      { type: "subheading", value: "Before starting induction (1.5.1)" },
      { type: "list", items: [
        "Abdominally assess the level and stability of the fetal head in the lower part of the uterus at or near the pelvic brim",
        "Carry out an ultrasound scan if there are any concerns about the position of the baby, for example if it might be breech",
        "Assess and record the Bishop score",
        "Confirm a normal fetal heart rate pattern using antenatal cardiotocography interpretation",
        "Confirm the absence of significant uterine contractions, not Braxton-Hicks, using cardiotocography",
        "Ensure facilities for cardiotocography are available wherever induction is started (1.5.2)",
      ]},
      { type: "subheading", value: "Monitoring once contractions begin (1.5.3)" },
      { type: "text", value: "When uterine contractions begin after dinoprostone or misoprostol, assess fetal wellbeing and uterine contractions with intrapartum cardiotocography interpretation:" },
      { type: "list", items: [
        "If the cardiotocogram is confirmed normal, review the individual circumstances and, if considered low risk, use intermittent auscultation unless there are clear indications for further cardiotocography",
        "If the fetal heart rate is abnormal or there are excessive contractions: continue or restart continuous cardiotocography, give no further doses, and remove any vaginal pessaries or delivery systems if possible",
        "Offer to reassess her wellbeing, the baby's wellbeing and the Bishop score at appropriate intervals, depending on the method and her clinical condition (1.5.4)",
        "Once active labour is established, follow the NICE guideline on fetal monitoring in labour (1.5.5)",
      ]},
      { type: "alert", value: "The summaries of product characteristics for different dinoprostone preparations contain different monitoring requirements. Use NG207 alongside the relevant summary of product characteristics." },
      { type: "subheading", value: "Pain relief" },
      { type: "list", items: [
        "Explain that induced labour may be more painful than spontaneous labour (1.5.6)",
        "Discuss the available pain relief options in different settings (1.5.7)",
        "Provide the pain relief appropriate for her and her pain, which can include simple analgesia, labour in water and epidural analgesia (1.5.8)",
      ]},
    ]
  },

  {
    id: "ng207-outpatient", gl: "NG207", condition: "Induction of Labour", setting: "Outpatient Induction",
    title: "Outpatient Induction",
    tags: ["outpatient induction","home","dinoprostone","mechanical method","review plan","when to contact","pessary loss","reduced fetal movements"],
    content: [
      { type: "list", items: [
        "Consider outpatient induction with vaginal dinoprostone preparations or mechanical methods for women who wish to return home and who have no co-existing medical conditions or obstetric complications. Discuss the benefits and risks of returning home and respect her decision (1.6.1)",
        "Carry out a full clinical assessment of her and the baby as for any induction, and ensure safety and support procedures are in place (1.6.2)",
        "Agree a review plan with her before she returns home (1.6.3)",
      ]},
      { type: "subheading", value: "Ask her to make contact (1.6.4)" },
      { type: "list", items: [
        "When contractions begin",
        "If there are no contractions within an agreed timeframe, depending on the method used",
        "If her membranes rupture",
        "If she develops bleeding",
        "If she has any other concerns, such as reduced or altered fetal movements, excessive pain or contractions, side effects, or loss of the pessary",
      ]},
    ]
  },

  {
    id: "ng207-complications", gl: "NG207", condition: "Induction of Labour", setting: "Complications",
    title: "Prevention & Management of Complications",
    tags: ["hyperstimulation","tachysystole","tocolysis","unsuccessful induction","failed induction","cord prolapse","low lying placenta","caesarean birth","rest period","expectant management"],
    content: [
      { type: "alert", value: "Hyperstimulation is overactivity of the uterus as a result of induction. It is variously defined as tachysystole (5 or more contractions per 10 minutes for at least 20 minutes) and hypersystole or hypertonicity (a contraction lasting at least 2 minutes). These may or may not be associated with fetal heart rate changes." },
      { type: "subheading", value: "Uterine hyperstimulation (1.7.1)" },
      { type: "list", items: [
        "Carry out a fetal assessment",
        "Give no further doses of medicines to induce labour, and remove any vaginal pessaries or delivery systems if possible",
        "Consider tocolysis",
      ]},
      { type: "subheading", value: "Unsuccessful induction" },
      { type: "list", items: [
        "Discuss it with her and provide support. Fully reassess her condition and the pregnancy, and assess fetal wellbeing using antenatal cardiotocography interpretation (1.7.2)",
        "Discuss and agree a plan for further management, including whether she would like further attempts at induction, taking into account the clinical circumstances and her preferences (1.7.3)",
        "Subsequent options are a rest period if clinically appropriate then reassessment, expectant management, further attempts to induce labour, or caesarean birth (1.7.4)",
      ]},
      { type: "subheading", value: "Avoiding cord prolapse (1.7.5)" },
      { type: "list", items: [
        "Before induction, abdominally assess the level and stability of the fetal head at or near the pelvic brim",
        "During the preliminary vaginal examination, palpate for umbilical cord presentation and avoid dislodging the baby's head",
        "Carry out continuous cardiotocography after the membranes have ruptured if the presenting part is not stable and not well applied to the cervix. Discuss the risks and benefits of induction with her, and if necessary consider caesarean birth. If the presenting part stabilises and the cardiotocogram is normal, use intermittent auscultation unless there are clear indications for further cardiotocography",
      ]},
    ]
  },
];
