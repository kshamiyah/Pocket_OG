// GTG45 — Birth After Previous Caesarean Birth
// (RCOG Green-top Guideline No. 45, October 2015; induction/augmentation
// specifics cross-checked against NICE NG207, Intrapartum care for women
// with existing medical conditions or obstetric complications, 2021)
//
// The existing Counsel "Birth After Caesarean (VBAC)" page already carries
// the detailed counselling numbers (success rates, rupture risk, VBAC vs
// ERCS comparison) — this guideline focuses on the clinical/intrapartum
// side rather than repeating that content.

export const GTG45_SECTIONS = [
  {
    id: "gtg45-eligibility",
    gl: "GTG45",
    condition: "Birth After Previous Caesarean",
    setting: "Antenatal",
    title: "Eligibility & Antenatal Planning",
    tags: [
      "vbac eligibility", "vbac contraindications", "vaginal birth after caesarean",
      "trial of labour after caesarean", "tolac",
    ],
    content: [
      { type: "text", value: "Most women with one previous lower-segment caesarean and no other complicating factor are candidates for either planned VBAC or planned elective repeat caesarean (ERCS) — both are recommended options, and the choice belongs to the woman after counselling. Full counselling numbers (success rates, rupture risk, and the side-by-side VBAC vs ERCS comparison) are covered in the Counsel entry; this page covers how the labour itself is run." },
      { type: "subheading", value: "Contraindications to planned VBAC" },
      { type: "list", items: [
        "Previous uterine rupture.",
        "Previous classical (vertical) caesarean incision.",
        "Any other usual contraindication to vaginal birth — e.g. major placenta praevia (see GTG27a).",
      ]},
      { type: "subheading", value: "Factors that shift the odds — discuss individually rather than treating as absolute" },
      { type: "list", items: [
        "No previous vaginal birth reduces the chance of VBAC success compared with a woman who has had one.",
        "Short interdelivery interval, maternal obesity, advanced maternal age, and a large estimated fetal weight are each associated with lower success and/or higher rupture risk — individually modest effects that should inform, not dictate, the discussion.",
        "Induced or augmented labour carries a higher rupture risk than spontaneous labour (see the induction/augmentation section) — a relevant factor in the planning conversation, not a reason to withhold VBAC outright.",
      ]},
      { type: "text", value: "Two or more previous caesareans: VBAC can still be supported after senior review — success rates are broadly similar to one previous caesarean, but the uterine rupture risk is less well established and may be higher, so this decision should specifically involve a consultant." },
    ],
  },

  {
    id: "gtg45-intrapartum-monitoring",
    gl: "GTG45",
    condition: "Birth After Previous Caesarean",
    setting: "Intrapartum",
    title: "Intrapartum Monitoring Requirements",
    tags: [
      "vbac monitoring", "continuous ctg vbac", "vbac unit requirements", "vbac iv access",
      "vbac epidural",
    ],
    content: [
      { type: "alert", value: "Continuous electronic fetal monitoring (CTG) is recommended for the whole of a VBAC labour — a change in the fetal heart rate pattern is often the earliest and most consistent sign of a developing problem with the scar, frequently appearing before any maternal symptom." },
      { type: "list", items: [
        "Plan birth in a unit with continuous monitoring and immediate access to caesarean section and blood transfusion — not a midwife-led unit or home birth setting.",
        "Consider intravenous access on admission in labour.",
        "Epidural analgesia is not contraindicated in VBAC labour and the full range of pain relief should be available — a working epidural does not meaningfully mask the signs of rupture, and adequate analgesia should not be withheld out of a mistaken belief that pain is a reliable early warning sign.",
      ]},
    ],
  },

  {
    id: "gtg45-scar-rupture",
    gl: "GTG45",
    condition: "Birth After Previous Caesarean",
    setting: "Intrapartum Emergency",
    title: "Recognising Uterine Scar Rupture",
    tags: [
      "uterine rupture signs", "scar rupture vbac", "scar tenderness", "vbac emergency",
      "abnormal ctg vbac",
    ],
    flowchartId: "GTG45_VBAC",
    content: [
      { type: "alert", value: "There is no single symptom or sign that reliably confirms uterine scar rupture on its own — recognition depends on staying alert to the combination below and acting on suspicion rather than waiting for certainty." },
      { type: "list", items: [
        "Abnormal CTG — usually the first and most consistent sign; any acute change in a previously normal trace during a VBAC labour should specifically raise this possibility.",
        "Abdominal pain that is atypical, or that persists between contractions rather than easing — different in character from expected labour pain.",
        "Tenderness directly over the previous scar.",
        "New vaginal bleeding.",
        "Sudden cessation of previously effective, established contractions, or a marked change in contraction pattern.",
        "Maternal tachycardia, or other signs suggesting maternal haemodynamic compromise.",
        "Loss of station of the presenting part — a head that was engaged or descending is suddenly higher on palpation/examination.",
      ]},
      { type: "alert", value: "Suspected uterine rupture is an obstetric emergency: call for senior help immediately and proceed to category 1 caesarean section. Do not wait for every feature above to be present — an abnormal CTG alone, in a VBAC labour, is enough to act on." },
    ],
  },

  {
    id: "gtg45-induction-augmentation",
    gl: "GTG45",
    condition: "Birth After Previous Caesarean",
    setting: "Intrapartum",
    title: "Induction & Augmentation",
    tags: [
      "vbac induction", "vbac augmentation", "prostaglandin uterine scar",
      "oxytocin vbac", "balloon catheter vbac",
    ],
    content: [
      { type: "alert", value: "Induction of a VBAC labour carries a higher risk of both emergency caesarean and uterine rupture than spontaneous labour — this needs an explicit discussion with a senior obstetrician, weighing the reason for induction against that added risk, rather than a default decision." },
      { type: "list", items: [
        "Prostaglandins (dinoprostone and misoprostol) are not used for induction in a woman with a uterine scar — they further increase rupture risk. A mechanical method (balloon catheter) is the preferred induction method where induction is needed (NICE NG207).",
        "Oxytocin augmentation can be used, but cautiously and with a lower threshold for senior review and for stopping if there's any concern about the CTG, contraction pattern, or other rupture red flags — it is not managed the same as augmentation in a woman without a uterine scar.",
      ]},
    ],
  },

  {
    id: "gtg45-special-situations",
    gl: "GTG45",
    condition: "Birth After Previous Caesarean",
    setting: "Antenatal",
    title: "Special Situations",
    tags: [
      "vbac twins", "vbac breech", "vbac multiple previous caesarean", "vbac postdates",
      "vbac macrosomia", "vbac maternal age",
    ],
    content: [
      { type: "list", items: [
        "Twin pregnancy after one previous caesarean: planned VBAC can be considered in appropriately selected women — discuss with a senior obstetrician, as the evidence base is smaller than for singleton VBAC.",
        "Breech presentation after one previous caesarean: both external cephalic version and vaginal breech birth can be considered — this compounds two individually complex decisions, so involve senior input early.",
        "Postdates pregnancy: VBAC can still be offered — going past the due date is not itself a reason to abandon a VBAC plan, though it may prompt a fresh discussion about induction versus waiting versus ERCS.",
        "Suspected fetal macrosomia: associated with lower VBAC success and higher rupture risk, but is not an automatic contraindication — individualise.",
        "Maternal age 40 or over: a modest additional factor to weigh in counselling, not a contraindication on its own.",
        "Antepartum stillbirth with a previous caesarean: mode of birth is individualised with senior input, balancing maternal preference against the specific circumstances.",
      ]},
    ],
  },
];
