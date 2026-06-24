export const SHOULDER_DYSTOCIA_EMERGENCY = {
  id: "shoulder_dystocia",
  title: "Shoulder Dystocia",
  sourceGl: "GTG42",
  singleLevel: true,
  mbrrace: "Shoulder dystocia is a time-critical intrapartum emergency. MBRRACE and CNST data show that failure to follow a structured stepwise approach and poor team communication are leading contributors to adverse neonatal outcomes including hypoxic-ischaemic encephalopathy and death.",

  intro: "Call for help immediately. Do NOT apply fundal pressure. Work through HELPERR in order — escalate rapidly if head-to-body delivery does not occur within 5 minutes.",

  helperr: [
    {
      letter: "H",
      step: "Call for Help",
      detail: "Shout for help — midwife in charge, senior obstetrician, anaesthetist, neonatologist, extra midwife for documentation",
      critical: true,
    },
    {
      letter: "E",
      step: "Evaluate for Episiotomy",
      detail: "Episiotomy does not relieve the bony obstruction but gives access for internal manoeuvres. Perform if needed for access.",
      critical: false,
    },
    {
      letter: "L",
      step: "Legs — McRoberts Manoeuvre",
      detail: "Hyperflexion and abduction of maternal thighs onto abdomen. Requires two assistants. Flattens lumbar lordosis and rotates symphysis pubis superiorly — increases functional AP diameter.",
      critical: true,
    },
    {
      letter: "P",
      step: "Suprapubic Pressure",
      detail: "Continuous or rocking (Rubin) pressure applied posterolaterally to the fetal anterior shoulder to dislodge it from behind the symphysis. Directed toward the fetal face.",
      critical: true,
    },
    {
      letter: "E",
      step: "Enter — Internal Rotational Manoeuvres",
      detail: "Rubin II: pressure on posterior aspect of anterior shoulder to rotate it toward fetal chest.\nWoods screw: pressure on anterior aspect of posterior shoulder to rotate.\nReverse Woods (Rubin III): if above fail — alternate pressure directions to achieve rotation.",
      critical: true,
    },
    {
      letter: "R",
      step: "Remove the Posterior Arm",
      detail: "Locate the posterior arm, flex the elbow, sweep the arm across the fetal chest and deliver it. Reduces shoulder girdle width by one arm's diameter.",
      critical: true,
    },
    {
      letter: "R",
      step: "Roll — All-Fours Position (Gaskin)",
      detail: "Roll mother to all-fours position. Gravity may dislodge posterior shoulder. Internal manoeuvres can be repeated in this position.",
      critical: false,
    },
  ],

  lastResorts: [
    {
      step: "Zavanelli manoeuvre",
      note: "Cephalic replacement followed by emergency caesarean section. Requires tocolysis (terbutaline 0.25 mg SC). Last resort — high maternal risk.",
    },
    {
      step: "Deliberate clavicle fracture",
      note: "Fracture of fetal anterior clavicle reduces shoulder girdle width. Only if all other manoeuvres fail.",
    },
    {
      step: "Symphysiotomy",
      note: "Surgical division of symphysis pubis — rarely performed in the UK. Only in extremis.",
    },
  ],

  doNot: [
    "Do NOT apply fundal pressure — impacts the shoulder further",
    "Do NOT apply excessive traction on the fetal head — risk of brachial plexus injury and cervical spine damage",
    "Do NOT perform aggressive lateral neck flexion",
  ],

  afterDelivery: [
    "Document exact timing: head delivered, dystocia recognised, baby delivered, APGAR scores",
    "Neonatal resuscitation team present at delivery",
    "Examine baby: check for brachial plexus injury (Erb's palsy), fractured clavicle or humerus",
    "Examine mother: PPH risk — uterine atony, cervical/vaginal lacerations",
    "Debrief mother and partner — explain what happened and why",
    "Complete full incident documentation; refer to perinatal team if injury",
  ],
};
