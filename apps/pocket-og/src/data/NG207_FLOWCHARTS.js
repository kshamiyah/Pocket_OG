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
