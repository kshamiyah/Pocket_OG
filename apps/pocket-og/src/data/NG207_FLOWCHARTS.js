// NICE NG207: inducing labour. National workflows.
// Published 4 November 2021. https://www.nice.org.uk/guidance/ng207
//
// Built from NG207's own recommendations, not by reshaping the RBH pathway,
// so the national layer stands on its own. The GL861 flowcharts stay as an
// optional local overlay: they carry trust process (Rushey MLU, delivery
// suite logistics, the cervical ripening balloon first-line ordering) which is
// deliberately absent here. Where NG207 and GL861 differ on the first method
// at a Bishop score of 6 or less, the "Guidance differs" card in the NG207
// methods section sets both out; this chart follows NG207 and points to it.
//
// NG207 gives no dinoprostone regimens beyond naming the preparations, and
// defers to the manufacturers' guidance (1.3.6). The only dose it states is
// low dose (25 microgram) oral misoprostol (1.3.7). No other doses appear here.

export const NG207_METHOD_FLOWCHART = {
  id: "NG207_METHOD",
  title: "Induction of Labour: Choosing a Method",
  subtitle: "NICE NG207 1.3 · membrane sweep, then Bishop score to method",
  startId: "stage",
  nodes: {

    "stage": {
      type: "decision",
      title: "Where Is She in the Pathway?",
      options: [
        { label: "Antenatal visit after 39+0 weeks, labour not started", sublabel: "Membrane sweeping, 1.3.1 to 1.3.3", next: "sweep" },
        { label: "Induction has been agreed and is about to start", next: "assess" },
      ],
    },

    "sweep": {
      type: "end",
      title: "Offer a Membrane Sweep",
      text: "At antenatal visits after 39+0 weeks, discuss whether she would like a vaginal examination for membrane sweeping, and obtain verbal consent before carrying it out (1.3.2).",
      items: [
        "Explain what a membrane sweep is, that it might make it more likely labour starts without additional pharmacological or mechanical methods, and that pain, discomfort and vaginal bleeding are possible (1.3.1)",
        "Check there is no evidence of a low-lying placenta on previous scans before sweeping (1.7.6)",
        "If labour does not start after the first sweep, discuss whether she would like additional sweeping (1.3.3)",
      ],
    },

    "assess": {
      type: "action",
      title: "Assess Before Starting",
      text: "Ensure the position of the baby and her condition are suitable for induction (1.5.1).",
      items: [
        "Abdominally assess the level and stability of the fetal head in the lower part of the uterus, at or near the pelvic brim",
        "Ultrasound scan if there is any concern about the baby's position, for example if it might be breech",
        "Confirm a normal fetal heart rate pattern on antenatal cardiotocography",
        "Confirm the absence of significant uterine contractions (not Braxton-Hicks) on cardiotocography",
        "Check there is no evidence of a low-lying placenta on previous scans (1.7.6)",
        "Ensure cardiotocography is available wherever induction is started (1.5.2)",
      ],
      next: "bishop",
    },

    "bishop": {
      type: "decision",
      title: "What Is the Bishop Score?",
      text: "Explain that a vaginal examination to assess the readiness of the cervix, recorded as the Bishop score, helps decide which method is offered first, and obtain consent (1.3.4). During the examination, palpate for cord presentation and avoid dislodging the baby's head (1.7.5). NG207 uses a threshold of 6 or less versus more than 6.",
      options: [
        { label: "6 or less", next: "suitable" },
        { label: "More than 6", next: "amniotomy" },
      ],
    },

    "suitable": {
      type: "decision",
      title: "Is a Pharmacological Method Suitable?",
      text: "Discuss the risks and benefits of each method (1.3.5). Both dinoprostone and misoprostol can cause hyperstimulation; mechanical methods are less likely to.",
      options: [
        { label: "Yes, and she chooses a pharmacological method", sublabel: "1.3.7", next: "pharm" },
        { label: "No: higher risk of, or from, hyperstimulation", sublabel: "1.3.8", next: "mechanical" },
        { label: "No: she has had a previous caesarean birth", sublabel: "1.3.8, 1.2.17", next: "mechanical" },
        { label: "She chooses a mechanical method", sublabel: "1.3.8", next: "mechanical" },
      ],
    },

    "pharm": {
      type: "end",
      title: "Dinoprostone or Low Dose Oral Misoprostol",
      text: "Offer dinoprostone as vaginal tablet, vaginal gel or controlled-release vaginal delivery system, or low dose (25 microgram) oral misoprostol tablets (1.3.7).",
      items: [
        "Follow the manufacturers' guidance on each preparation, including when to remove a controlled-release system (1.3.6)",
        "If hyperstimulation occurs, give no further medication and remove vaginal products where possible. Controlled-release systems are easier to remove than gel or tablets, and hyperstimulation from misoprostol may be harder to reverse (1.3.5)",
        "When contractions begin, assess fetal wellbeing and contractions with intrapartum cardiotocography. If the fetal heart rate is abnormal or contractions are excessive: continuous cardiotocography, no further doses, remove any pessary or delivery system if possible (1.5.3)",
        "Reassess her wellbeing, the baby's wellbeing and the Bishop score at intervals suited to the method (1.5.4)",
        "Local guidance may order the first method differently: see the \"Guidance differs\" card in the NG207 methods section",
      ],
    },

    "mechanical": {
      type: "end",
      title: "Consider a Mechanical Method",
      text: "Consider a mechanical method, for example a balloon catheter or osmotic cervical dilator (1.3.8).",
      items: [
        "Mechanical methods are less likely to cause hyperstimulation than pharmacological methods (1.3.5)",
        "Previous caesarean birth: discuss the increased risk of emergency caesarean birth, the risk of uterine rupture, the suitability of mechanical methods including the risk of infection, and that the marketing authorisations for dinoprostone and misoprostol contraindicate their use with a uterine scar (1.2.17)",
        "Reassess her wellbeing, the baby's wellbeing and the Bishop score at intervals suited to the method (1.5.4)",
      ],
    },

    "amniotomy": {
      type: "end",
      title: "Amniotomy and Oxytocin",
      text: "Offer induction with amniotomy and an intravenous oxytocin infusion (1.3.9).",
      items: [
        "She can have an amniotomy and choose whether or not to have an oxytocin infusion, or delay starting it, but labour may take longer and the risk of neonatal infection may be increased (1.3.10)",
        "After the membranes rupture, use continuous cardiotocography if the presenting part is not stable and not well applied to the cervix (1.7.5)",
        "Previous caesarean birth: discuss the risks of induction, including uterine rupture, before going ahead (1.2.17)",
        "Once active labour is established, monitor as in the NICE guideline on fetal monitoring in labour (1.5.5)",
      ],
    },

  },
};

// NG207 gives no antibiotic regimens for prelabour rupture of membranes. It
// refers to the NICE guideline on neonatal infection for intrapartum
// antibiotics (1.2.12, 1.2.16), and this chart does the same.
export const NG207_PROM_FLOWCHART = {
  id: "NG207_PROM",
  title: "Prelabour Rupture of Membranes",
  subtitle: "NICE NG207 1.2.10 to 1.2.16 · term and preterm",
  startId: "gestation",
  nodes: {

    "gestation": {
      type: "decision",
      title: "Gestation When the Membranes Ruptured?",
      options: [
        { label: "Before 34+0 weeks", sublabel: "1.2.10", next: "pre34" },
        { label: "34+0 to 36+6 weeks", sublabel: "1.2.11, 1.2.12", next: "preterm-gbs" },
        { label: "37+0 weeks or later (term)", sublabel: "1.2.13 to 1.2.16", next: "term-gbs" },
      ],
    },

    "pre34": {
      type: "decision",
      title: "Is There Another Obstetric Indication?",
      text: "Do not induce labour before 34+0 weeks unless there are additional obstetric indications, for example infection or fetal compromise (1.2.10).",
      options: [
        { label: "Yes, for example infection or fetal compromise", next: "pre34-indicated" },
        { label: "No", next: "pre34-expectant" },
      ],
    },

    "pre34-indicated": {
      type: "end",
      title: "Birth Decided by the Other Indication",
      text: "The bar on induction before 34+0 weeks does not apply where there is an additional obstetric indication such as infection or fetal compromise (1.2.10).",
      items: [
        "NG207 does not set out the management of preterm birth: see the NICE guideline on preterm labour and birth",
      ],
    },

    "pre34-expectant": {
      type: "end",
      title: "Expectant Management Until 37+0 Weeks",
      text: "Do not induce. Offer expectant management until 37+0 weeks (1.2.10).",
      items: [
        "Reassess if infection or fetal compromise develops, as that is an additional obstetric indication (1.2.10)",
        "NG207 does not set out the rest of preterm care: see the NICE guideline on preterm labour and birth",
      ],
    },

    "preterm-gbs": {
      type: "decision",
      title: "Positive Group B Streptococcus Test?",
      text: "A positive test at any time in the current pregnancy.",
      options: [
        { label: "Yes", sublabel: "1.2.12", next: "preterm-gbs-pos" },
        { label: "No, or not tested", sublabel: "1.2.11", next: "preterm-shared" },
      ],
    },

    "preterm-gbs-pos": {
      type: "end",
      title: "Offer Immediate Induction or Caesarean Birth",
      text: "Preterm prelabour rupture of membranes after 34+0 weeks, before 37+0, with a positive group B streptococcus test at any time in this pregnancy: offer immediate induction of labour or caesarean birth (1.2.12).",
      items: [
        "See the NICE guidelines on neonatal infection and on preterm labour and birth (1.2.12)",
        "NG207 gives no antibiotic regimen",
      ],
    },

    "preterm-shared": {
      type: "end",
      title: "Shared Decision: Wait Until 37+0 or Induce",
      text: "Discuss expectant management until 37+0 weeks or induction of labour, and make a shared decision (1.2.11).",
      items: [
        "Risks to her: for example sepsis, and the possible need for caesarean birth",
        "Risks to the baby: for example sepsis, and problems relating to preterm birth",
        "Local availability of neonatal intensive care",
        "Her individual circumstances and preferences",
      ],
    },

    "term-gbs": {
      type: "decision",
      title: "Positive Group B Streptococcus Test?",
      text: "A positive test at any time in the current pregnancy.",
      options: [
        { label: "Yes", sublabel: "1.2.16", next: "term-gbs-pos" },
        { label: "No, or not tested", sublabel: "1.2.13", next: "term-choice" },
      ],
    },

    "term-gbs-pos": {
      type: "end",
      title: "Offer Immediate Induction or Caesarean Birth",
      text: "Prelabour rupture of membranes at or after 37+0 weeks with a positive group B streptococcus test at any time in this pregnancy: offer immediate induction of labour or caesarean birth (1.2.16).",
      items: [
        "For intrapartum antibiotics, see the NICE guideline on neonatal infection (1.2.16). NG207 gives no regimen",
      ],
    },

    "term-choice": {
      type: "decision",
      title: "Offer a Choice",
      text: "Offer expectant management for up to 24 hours, or induction of labour as soon as possible. Discuss the benefits and risks of each, and take her circumstances and preferences into account (1.2.13).",
      options: [
        { label: "She chooses induction as soon as possible", next: "term-iol" },
        { label: "She chooses expectant management", next: "term-expectant" },
      ],
    },

    "term-expectant": {
      type: "decision",
      title: "Labour Not Started After About 24 Hours",
      text: "If labour has not started naturally after approximately 24 hours, offer induction of labour (1.2.14).",
      options: [
        { label: "She accepts induction", sublabel: "1.2.14", next: "term-iol" },
        { label: "She chooses to keep waiting", sublabel: "1.2.15", next: "term-wait" },
      ],
    },

    "term-wait": {
      type: "end",
      title: "Respect Her Decision to Wait",
      text: "Respect her decision if she chooses to wait for spontaneous labour beyond 24 hours, and discuss her options for birth from this point onwards (1.2.15).",
    },

    "term-iol": {
      type: "end",
      title: "Induction of Labour",
      text: "Go on to choose the method by Bishop score.",
      items: [
        "Induction as soon as possible if that is her choice (1.2.13), or after approximately 24 hours of expectant management (1.2.14)",
      ],
    },

  },
};

export const NG207_PROLONGED_FLOWCHART = {
  id: "NG207_PROLONGED",
  title: "Pregnancy Beyond 41 Weeks",
  subtitle: "NICE NG207 1.2.1 to 1.2.9 · uncomplicated pregnancy",
  startId: "spontaneous",
  nodes: {

    "spontaneous": {
      type: "action",
      title: "Uncomplicated Pregnancy: Spontaneous Labour First",
      text: "Give women with uncomplicated pregnancies every opportunity to go into spontaneous labour (1.2.1). Explain that labour usually starts naturally before 42+0 weeks, based on the gestational age from the dating scan (1.2.2).",
      items: [
        "NG207 table 1: 82.8% of spontaneous labours have started by the end of 40+6 weeks, and 99.0% by the end of 41+6 weeks",
      ],
      next: "risks",
    },

    "risks": {
      type: "action",
      title: "Discuss the Risks Beyond 41+0 Weeks",
      text: "Some risks of a pregnancy continuing beyond 41+0 weeks may increase over time (1.2.3).",
      items: [
        "Increased likelihood of caesarean birth",
        "Increased likelihood of the baby needing admission to a neonatal intensive care unit",
        "Increased likelihood of stillbirth and neonatal death",
        "Induction from 41+0 weeks may reduce these risks, but she will also need to consider the impact of induction on her birth experience (1.2.4)",
        "Be aware that, per the 2020 MBRRACE-UK perinatal mortality report, women from some minority ethnic backgrounds or living in deprived areas have an increased risk of stillbirth and may benefit from closer monitoring and additional support (1.2.5)",
      ],
      next: "decision",
    },

    "decision": {
      type: "decision",
      title: "What Does She Choose?",
      options: [
        { label: "Induction of labour from 41+0 weeks", sublabel: "1.2.4", next: "iol" },
        { label: "Not to be induced", sublabel: "1.2.6 to 1.2.9", next: "decline" },
      ],
    },

    "iol": {
      type: "end",
      title: "Induction of Labour",
      text: "Go on to choose the method by Bishop score.",
      items: [
        "Explain what induction involves for her birth before it starts, and record her decision (1.1.3, 1.1.5)",
      ],
    },

    "decline": {
      type: "action",
      title: "She Chooses Not to Be Induced",
      text: "Discuss her options from this point on, for example expectant management or caesarean birth, and record her decision in her notes (1.2.6).",
      next: "monitoring",
    },

    "monitoring": {
      type: "decision",
      title: "Additional Fetal Monitoring From 42 Weeks?",
      text: "Discuss whether she would like additional fetal monitoring from 42 weeks (1.2.7). Advise that monitoring gives only a snapshot and cannot reliably predict changes after it ends, though it may help her decide on options for birth; and that adverse effects on the baby, including stillbirth, and when they might happen, cannot be reliably predicted or prevented even with monitoring.",
      options: [
        { label: "She would like monitoring", next: "monitor" },
        { label: "She does not want monitoring", next: "await" },
      ],
    },

    "monitor": {
      type: "end",
      title: "Additional Monitoring From 42 Weeks",
      text: "Monitoring might consist of twice-weekly cardiotocography and ultrasound estimation of maximum amniotic pool depth (1.2.7).",
      items: [
        "Offer the chance to discuss her decision again at every subsequent review (1.2.8)",
        "Advise her to contact her midwife or maternity unit if she changes her mind before the next appointment, or as soon as possible with concerns about the baby, such as reduced or altered fetal movements (1.2.9)",
      ],
    },

    "await": {
      type: "end",
      title: "Awaiting Spontaneous Labour",
      text: "Respect her decision and record it (1.2.6).",
      items: [
        "Offer the chance to discuss her decision again at every subsequent review (1.2.8)",
        "Advise her to contact her midwife or maternity unit if she changes her mind before the next appointment, or as soon as possible with concerns about the baby, such as reduced or altered fetal movements (1.2.9)",
      ],
    },

  },
};
