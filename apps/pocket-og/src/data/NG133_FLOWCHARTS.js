// NICE NG133 — Hypertension in pregnancy: national workflows.
// Published 25 June 2019, last updated 17 April 2023.
// https://www.nice.org.uk/guidance/ng133
//
// Built from NG133's own chapters, not by reshaping the RBH pathways, so the
// national layer stands on its own. The GL952 flowcharts stay exactly where
// they are as an optional local overlay: they carry trust process (the MOWS
// chart, SHO review within 1 hour, registrar and consultant escalation
// timings) which is deliberately absent here.
//
// NG133 gives no antihypertensive doses. Where a dose is needed it comes from
// the BNF and says so, matching the app's Rx formulary. Magnesium dosing is
// NG133's own Collaborative Eclampsia Trial regimen (1.8.4).
//
// NG133 recognises two degrees only: hypertension (140/90 or higher) and
// severe hypertension (over 160/110). There is no mild or moderate band.

export const NG133_CLASSIFY_FLOWCHART = {
  id: "NG133_CLASSIFY",
  title: "Hypertension in Pregnancy: Classification",
  subtitle: "NICE NG133 · which hypertensive disorder is this?",
  startId: "confirm",
  nodes: {

    "confirm": {
      type: "action",
      title: "Confirm the Degree of Hypertension",
      text: "Hypertension is a blood pressure of 140 mmHg systolic or higher, or 90 mmHg diastolic or higher. Severe hypertension is over 160 systolic or over 110 diastolic.",
      items: [
        "Severe hypertension needs immediate treatment: see the severe hypertension pathway, and do not wait on classification",
        "NG133 defines no mild or moderate band. Those thresholds came from CG107, which NG133 replaced in 2019",
      ],
      next: "onset",
    },

    "onset": {
      type: "decision",
      title: "When Did the Hypertension First Appear?",
      options: [
        { label: "At the booking visit, before 20 weeks, or she was already on antihypertensives when referred", sublabel: "Chronic hypertension", next: "chronic" },
        { label: "New, after 20 weeks of pregnancy", next: "proteinuria" },
      ],
    },

    "chronic": {
      type: "end",
      title: "Chronic Hypertension",
      text: "Hypertension present at booking or before 20 weeks, or already on treatment when referred. Primary or secondary in aetiology.",
      items: [
        "Stop ACE inhibitors or ARBs, preferably within 2 working days of notification of pregnancy, and offer alternatives (1.3.3)",
        "Offer aspirin 75 mg to 150 mg once daily from 12 weeks (1.3.11)",
        "Superimposed pre-eclampsia can still develop: reassess if proteinuria or organ dysfunction appears",
      ],
    },

    "proteinuria": {
      type: "decision",
      title: "Proteinuria or Maternal Organ Dysfunction?",
      text: "If dipstick screening is positive at 1+ or more, quantify with albumin:creatinine or protein:creatinine ratio (1.2.3). Do not use a first morning void or a 24-hour collection (1.2.4, 1.2.5).",
      options: [
        { label: "Protein:creatinine 30 mg/mmol or more, or albumin:creatinine 8 mg/mmol or more, or 1 g/litre (2+) on dipstick", sublabel: "1.2.6, 1.2.7", next: "preeclampsia" },
        { label: "No proteinuria, but new maternal organ dysfunction", sublabel: "Renal, liver, neurological, haematological or uteroplacental", next: "preeclampsia" },
        { label: "Neither", next: "gestational" },
      ],
    },

    "gestational": {
      type: "end",
      title: "Gestational Hypertension",
      text: "New hypertension presenting after 20 weeks without significant proteinuria.",
      items: [
        "Do not routinely admit to hospital (table 1)",
        "It can progress to pre-eclampsia: repeat dipstick once or twice a week with blood pressure, and bloods weekly",
        "Offer PLGF-based testing once, between 20 weeks and 36+6, if pre-eclampsia is suspected (1.4.4)",
      ],
    },

    "preeclampsia": {
      type: "end",
      title: "Pre-Eclampsia",
      text: "New hypertension after 20 weeks with proteinuria, or with maternal organ dysfunction, or with uteroplacental dysfunction such as fetal growth restriction, abnormal umbilical artery doppler or stillbirth.",
      items: [
        "Organ dysfunction: creatinine 90 micromol/litre or more; transaminases over 40 IU/litre; platelets below 150,000/microlitre; neurological features including eclampsia, clonus, severe headaches or persistent visual scotomata",
        "Severe pre-eclampsia is pre-eclampsia with severe hypertension that does not respond to treatment, or with ongoing or recurring severe headaches, visual scotomata, nausea or vomiting, epigastric pain, oliguria with severe hypertension, progressive deterioration in blood tests, or failure of fetal growth",
        "Manage by a healthcare professional trained in hypertensive disorders of pregnancy (1.5.1)",
      ],
    },

  },
};

export const NG133_SEVERE_FLOWCHART = {
  id: "NG133_SEVERE",
  title: "Severe Hypertension: Immediate Management",
  subtitle: "NICE NG133 1.8 · over 160/110, in a critical care setting",
  startId: "confirm",
  nodes: {

    "confirm": {
      type: "action",
      title: "Treat Immediately",
      text: "Treat women with severe hypertension in critical care, during pregnancy or after birth, immediately (1.8.6). Do not wait on further confirmation.",
      items: [
        "Measure blood pressure every 15 to 30 minutes until it is less than 160/110 (tables 1 and 2)",
        "Once below 160/110, measure at least 4 times daily while she is an inpatient",
        "Aim for a target of 135/85 mmHg or less once on treatment",
      ],
      next: "agent",
    },

    "agent": {
      type: "decision",
      title: "Which Agent?",
      text: "NG133 names three options and does not rank them (1.8.6). Base the choice on what she is already taking, contraindications and availability.",
      options: [
        { label: "Labetalol, oral or intravenous", next: "labetalol" },
        { label: "Oral nifedipine", next: "nifedipine" },
        { label: "Intravenous hydralazine", next: "hydralazine" },
      ],
    },

    "labetalol": {
      type: "action",
      title: "Labetalol",
      text: "Doses are not given in NG133. BNF: intravenous bolus 50 mg over at least 1 minute, repeated every 5 minutes to a maximum of 200 mg; or an infusion of 20 mg/hour, doubled every 30 minutes to a maximum of 160 mg/hour. Oral maintenance 100 to 200 mg twice daily.",
      items: [
        "Avoid in asthma",
      ],
      next: "monitor",
    },

    "nifedipine": {
      type: "action",
      title: "Nifedipine",
      text: "Doses are not given in NG133. BNF: immediate-release 10 mg, repeated after 30 minutes if blood pressure remains uncontrolled, to a maximum of 30 mg per acute episode. Modified-release 10 to 20 mg twice daily for maintenance.",
      items: [
        "Swallow whole: do not bite or crush",
        "At the time of NG133's publication some brands of nifedipine were contraindicated in pregnancy by the manufacturer. Check the summary of product characteristics for the preparation in use",
      ],
      next: "monitor",
    },

    "hydralazine": {
      type: "action",
      title: "Intravenous Hydralazine",
      text: "Doses are not given in NG133. BNF: 5 mg intravenously over 5 minutes, repeated every 20 minutes to a maximum of 20 mg per acute episode.",
      items: [
        "Consider up to 500 ml crystalloid before or at the same time as the first dose in the antenatal period (1.8.8)",
        "This is the one exception to the rule against volume expansion (1.8.11)",
      ],
      next: "monitor",
    },

    "monitor": {
      type: "action",
      title: "Monitor the Response",
      text: "Monitor her response to treatment to ensure blood pressure falls, to identify adverse effects for both the woman and the baby, and to modify treatment according to response (1.8.7).",
      items: [
        "Limit maintenance fluids to 80 ml/hour unless there are other ongoing losses such as haemorrhage (1.8.12)",
        "Do not use volume expansion unless hydralazine is the antenatal antihypertensive (1.8.11)",
        "Consider whether magnesium sulfate is indicated: see the magnesium pathway",
      ],
      next: "criticalcare",
    },

    "criticalcare": {
      type: "decision",
      title: "What Level of Critical Care Does She Need?",
      text: "Refer women with severe hypertension or severe pre-eclampsia to the appropriate critical care setting (1.8.14).",
      options: [
        { label: "Severe pre-eclampsia and needing ventilation", sublabel: "Level 3", next: "level3" },
        { label: "Eclampsia, HELLP, haemorrhage, hyperkalaemia, severe oliguria, coagulation support, intravenous antihypertensives, initial stabilisation, cardiac failure or abnormal neurology", sublabel: "Level 2", next: "level2" },
        { label: "Pre-eclampsia with hypertension, conservative management of severe preterm hypertension, or step-down after birth", sublabel: "Level 1", next: "level1" },
      ],
    },

    "level3": {
      type: "end",
      title: "Level 3 Critical Care",
      text: "Severe pre-eclampsia requiring ventilation.",
    },

    "level2": {
      type: "end",
      title: "Level 2 Critical Care",
      text: "Step-down from level 3, or severe pre-eclampsia with any of: eclampsia; HELLP syndrome; haemorrhage; hyperkalaemia; severe oliguria; coagulation support; intravenous antihypertensive treatment; initial stabilisation of severe hypertension; evidence of cardiac failure; abnormal neurology.",
    },

    "level1": {
      type: "end",
      title: "Level 1 Critical Care",
      text: "Pre-eclampsia with hypertension, ongoing conservative antenatal management of severe preterm hypertension, or step-down treatment after the birth.",
    },

  },
};

export const NG133_MAGNESIUM_FLOWCHART = {
  id: "NG133_MAGNESIUM",
  title: "Magnesium Sulfate in Severe Pre-Eclampsia & Eclampsia",
  subtitle: "NICE NG133 1.8.1 to 1.8.5 · Collaborative Eclampsia Trial regimen",
  startId: "indication",
  nodes: {

    "indication": {
      type: "decision",
      title: "Is Magnesium Sulfate Indicated?",
      text: "These recommendations apply to women in a critical care setting with severe hypertension or severe pre-eclampsia.",
      options: [
        { label: "She has had, or previously had, an eclamptic fit", sublabel: "1.8.1, give it", next: "regimen" },
        { label: "Severe pre-eclampsia, and birth is planned within 24 hours", sublabel: "1.8.2, consider it", next: "regimen" },
        { label: "Severe pre-eclampsia with features below", sublabel: "1.8.3, consider the need", next: "features" },
        { label: "None of these", next: "not-indicated" },
      ],
    },

    "features": {
      type: "decision",
      title: "Any Feature of Severe Pre-Eclampsia?",
      text: "Consider the need for magnesium sulfate if 1 or more of these is present (1.8.3).",
      options: [
        { label: "Ongoing or recurring severe headaches, visual scotomata, nausea or vomiting, epigastric pain, oliguria with severe hypertension, or progressive deterioration in blood tests", sublabel: "Rising creatinine or transaminases, falling platelets", next: "regimen" },
        { label: "None present", next: "not-indicated" },
      ],
    },

    "not-indicated": {
      type: "end",
      title: "No Indication at Present",
      text: "Reassess if she has a fit, if birth is planned within 24 hours, or if features of severe pre-eclampsia develop.",
    },

    "regimen": {
      type: "action",
      title: "Collaborative Eclampsia Trial Regimen",
      text: "A loading dose of 4 g intravenously over 5 to 15 minutes, followed by an infusion of 1 g/hour maintained for 24 hours. If she has had an eclamptic fit, continue the infusion for 24 hours after the last fit (1.8.4).",
      items: [
        "Do not use diazepam, phenytoin or other anticonvulsants as an alternative to magnesium sulfate in women with eclampsia (1.8.5)",
        "Antidote is not covered by NG133. The app's formulary and RCOG GTG56 give calcium gluconate 1 g intravenously (10 mL of 10%) over 10 minutes",
        "MHRA warning: prolonged or repeated use in pregnancy, longer than 5 to 7 days, has been associated with neonatal skeletal adverse effects, hypocalcaemia and hypermagnesaemia. Consider monitoring the neonate",
      ],
      next: "recurrent",
    },

    "recurrent": {
      type: "decision",
      title: "Further Fit After the Loading Dose?",
      options: [
        { label: "Yes, a recurrent fit", sublabel: "1.8.4", next: "further-dose" },
        { label: "No further fits", next: "continue" },
      ],
    },

    "further-dose": {
      type: "end",
      title: "Further 2 g to 4 g Intravenously",
      text: "Treat recurrent fits with a further dose of 2 g to 4 g given intravenously over 5 to 15 minutes (1.8.4).",
      items: [
        "Continue the maintenance infusion for 24 hours after the last fit",
        "Reassess the level of critical care she needs: a further fit is a level 2 criterion (1.8.14)",
      ],
    },

    "continue": {
      type: "end",
      title: "Continue the Infusion",
      text: "Maintain 1 g/hour for 24 hours, or for 24 hours after the last fit if she has had one (1.8.4).",
    },

  },
};

export const NG133_ANTENATAL_FLOWCHART = {
  id: "NG133_ANTENATAL",
  title: "Antenatal Management by Diagnosis",
  subtitle: "NICE NG133 tables 1 and 2 · targets, monitoring and admission",
  startId: "which",
  nodes: {

    "which": {
      type: "decision",
      title: "Which Diagnosis?",
      text: "Target blood pressure once on treatment is 135/85 mmHg or less in every case.",
      options: [
        { label: "Chronic hypertension", sublabel: "1.3", next: "chronic" },
        { label: "Gestational hypertension", sublabel: "Table 1", next: "gestational" },
        { label: "Pre-eclampsia", sublabel: "Table 2", next: "preeclampsia" },
      ],
    },

    "chronic": {
      type: "end",
      title: "Chronic Hypertension",
      text: "Offer treatment if she is not already treated and sustained systolic is 140 mmHg or higher, or sustained diastolic is 90 mmHg or higher (1.3.8). Aim for 135/85 mmHg (1.3.9).",
      items: [
        "Continue existing treatment if safe, unless sustained systolic is under 110, sustained diastolic is under 70, or she has symptomatic hypotension (1.3.7)",
        "Consider labetalol first, nifedipine if labetalol is unsuitable, methyldopa if both are unsuitable (1.3.10). BNF: labetalol 100 to 200 mg twice daily, max 800 mg daily; nifedipine modified-release 10 to 20 mg twice daily, max 80 mg daily; methyldopa 250 mg two to three times daily, max 3 g daily",
        "Offer aspirin 75 mg to 150 mg once daily from 12 weeks (1.3.11)",
        "Appointments weekly if poorly controlled, every 2 to 4 weeks if well controlled (1.3.13)",
        "Ultrasound with umbilical artery doppler at 28, 32 and 36 weeks; CTG only if clinically indicated (1.6.1, 1.6.2)",
      ],
    },

    "gestational": {
      type: "end",
      title: "Gestational Hypertension",
      text: "Do not routinely admit. Offer treatment if blood pressure remains above 140/90; offer it to all women with severe hypertension (table 1).",
      items: [
        "Blood pressure once or twice a week until 135/85 or less; every 15 to 30 minutes if severe, until under 160/110",
        "Dipstick once or twice a week with the blood pressure; daily while admitted if severe",
        "Full blood count, liver and renal function at presentation then weekly",
        "Ultrasound at diagnosis and, if normal, every 2 to 4 weeks if clinically indicated; every 2 weeks if severe hypertension persists (1.6.3)",
        "Do not offer bed rest in hospital as a treatment (1.4.6)",
      ],
    },

    "preeclampsia": {
      type: "end",
      title: "Pre-Eclampsia",
      text: "Admit if there are clinical concerns for the woman or baby, or if the fullPIERS or PREP-S models suggest a high risk of adverse events (1.5.2, table 2). Admit all women with severe hypertension.",
      items: [
        "Concerns prompting admission: sustained systolic 160 or higher; new persistent rise in creatinine to 90 micromol/litre or more, or alanine transaminase over 70 IU/litre, or platelets under 150,000/microlitre; signs of impending eclampsia or pulmonary oedema; suspected fetal compromise",
        "Blood pressure at least every 48 hours, more often if admitted; every 15 to 30 minutes if severe until under 160/110, then at least 4 times daily",
        "Full blood count, liver and renal function twice a week, or 3 times a week if severe",
        "Do not repeat dipstick quantification once pre-eclampsia is confirmed unless the diagnosis is uncertain",
        "CTG at diagnosis, then only if clinically indicated; ultrasound with doppler every 2 weeks (1.6.5 to 1.6.9)",
      ],
    },

  },
};

export const NG133_TIMING_FLOWCHART = {
  id: "NG133_TIMING",
  title: "Timing of Birth",
  subtitle: "NICE NG133 table 3 · and the thresholds for planned early birth",
  startId: "which",
  nodes: {

    "which": {
      type: "decision",
      title: "Which Diagnosis?",
      options: [
        { label: "Chronic hypertension", sublabel: "1.3.14, 1.3.15", next: "chronic" },
        { label: "Gestational hypertension", sublabel: "1.4.7, 1.4.8", next: "gestational" },
        { label: "Pre-eclampsia", sublabel: "Table 3", next: "gestation" },
      ],
    },

    "chronic": {
      type: "end",
      title: "Chronic Hypertension",
      text: "Do not offer planned early birth before 37 weeks to women whose blood pressure is lower than 160/110, with or without treatment, unless there are other medical indications (1.3.14).",
      items: [
        "After 37 weeks, agree timing of birth and the maternal and fetal indications between the woman and the senior obstetrician (1.3.15)",
        "If planned early birth is necessary, offer antenatal corticosteroids and magnesium sulfate if indicated (1.3.16)",
      ],
    },

    "gestational": {
      type: "end",
      title: "Gestational Hypertension",
      text: "Do not offer planned early birth before 37 weeks to women whose blood pressure is lower than 160/110, unless there are other medical indications (1.4.7).",
      items: [
        "After 37 weeks, agree timing of birth between the woman and the senior obstetrician (1.4.8)",
        "If planned early birth is necessary, offer antenatal corticosteroids and magnesium sulfate if indicated (1.4.9)",
      ],
    },

    "gestation": {
      type: "decision",
      title: "Gestation in Pre-Eclampsia",
      text: "Record maternal and fetal thresholds for planned early birth before 37 weeks (1.5.7). Involve a senior obstetrician in the decision (1.5.8), discuss with the anaesthetic team (1.5.9), and with neonatal staff if complications are anticipated (1.5.10).",
      options: [
        { label: "Before 34 weeks", next: "before34" },
        { label: "34 weeks to 36 weeks plus 6 days", next: "from34" },
        { label: "37 weeks onwards", next: "from37" },
      ],
    },

    "before34": {
      type: "end",
      title: "Continue Surveillance",
      text: "Continue surveillance unless there are indications for planned early birth. Offer intravenous magnesium sulfate and a course of antenatal corticosteroids (table 3).",
      items: [
        "Thresholds for planned early birth (1.5.7) include: inability to control blood pressure despite 3 or more classes of antihypertensive at appropriate doses; maternal pulse oximetry under 90%; progressive deterioration in liver or renal function, haemolysis or platelets; ongoing neurological features such as severe intractable headache, repeated visual scotomata or eclampsia; placental abruption; reversed end-diastolic flow, a non-reassuring CTG, or stillbirth",
      ],
    },

    "from34": {
      type: "end",
      title: "Continue Surveillance, Weigh Planned Early Birth",
      text: "Continue surveillance unless there are indications for planned early birth. When considering the option, take into account the woman's and baby's condition, risk factors such as maternal comorbidities and multi-fetal pregnancy, and the availability of neonatal unit beds. Consider a course of antenatal corticosteroids (table 3).",
    },

    "from37": {
      type: "end",
      title: "Initiate Birth Within 24 to 48 Hours",
      text: "From 37 weeks onwards, initiate birth within 24 to 48 hours (table 3).",
    },

  },
};

export const NG133_POSTNATAL_FLOWCHART = {
  id: "NG133_POSTNATAL",
  title: "Postnatal Blood Pressure & Antihypertensives",
  subtitle: "NICE NG133 1.5.13 to 1.5.22 and 1.9",
  startId: "ontreatment",
  nodes: {

    "ontreatment": {
      type: "decision",
      title: "Was She on Antihypertensive Treatment?",
      options: [
        { label: "Yes, she took antihypertensive treatment", sublabel: "1.5.16, 1.5.17", next: "treated" },
        { label: "No, she did not", sublabel: "1.5.13, 1.5.14", next: "untreated" },
      ],
    },

    "treated": {
      type: "action",
      title: "Measure at Least 4 Times a Day as an Inpatient",
      text: "Then every 1 to 2 days for up to 2 weeks after transfer to community care, until she is off treatment and has no hypertension (1.5.16).",
      items: [
        "Consider reducing treatment if blood pressure falls below 140/90 mmHg, and reduce it if blood pressure falls below 130/80 mmHg (1.5.17)",
        "If she took methyldopa, stop within 2 days of the birth and change to an alternative (1.5.18)",
        "Ask about severe headache and epigastric pain each time blood pressure is measured (1.5.15)",
      ],
      next: "choice",
    },

    "untreated": {
      type: "action",
      title: "Measure at Least 4 Times a Day as an Inpatient",
      text: "Measure at least once between day 3 and day 5 after birth, and on alternate days until normal if it was abnormal on days 3 to 5 (1.5.13).",
      items: [
        "Start antihypertensive treatment if blood pressure is 150/100 mmHg or higher (1.5.14)",
        "Ask about severe headache and epigastric pain each time blood pressure is measured (1.5.15)",
      ],
      next: "choice",
    },

    "choice": {
      type: "decision",
      title: "Choosing an Antihypertensive After Birth",
      text: "Use medicines taken once daily where possible (1.9.7). Needing antihypertensive medication does not prevent her from breastfeeding (1.9.1).",
      options: [
        { label: "First line", sublabel: "1.9.4", next: "enalapril" },
        { label: "Woman of African or Caribbean family origin", sublabel: "1.9.5", next: "ccb" },
        { label: "Not controlled on a single medicine", sublabel: "1.9.6", next: "combination" },
      ],
    },

    "enalapril": {
      type: "action",
      title: "Offer Enalapril",
      text: "Offer enalapril to treat hypertension during the postnatal period, with appropriate monitoring of maternal renal function and serum potassium (1.9.4).",
      items: [
        "Where possible avoid diuretics or angiotensin receptor blockers in women who are breastfeeding or expressing milk (1.9.8)",
      ],
      next: "discharge",
    },

    "ccb": {
      type: "action",
      title: "Consider Nifedipine or Amlodipine",
      text: "For women of African or Caribbean family origin, consider nifedipine, or amlodipine if she has previously used it to control her blood pressure successfully (1.9.5).",
      next: "discharge",
    },

    "combination": {
      type: "action",
      title: "Combine, Then Add or Swap",
      text: "Consider a combination of nifedipine (or amlodipine) and enalapril. If that is not tolerated or is ineffective, consider adding atenolol or labetalol, or swapping one of the medicines already used for atenolol or labetalol (1.9.6).",
      next: "discharge",
    },

    "discharge": {
      type: "end",
      title: "Transfer to Community Care",
      text: "Offer transfer when there are no symptoms of pre-eclampsia, blood pressure with or without treatment is 150/100 mmHg or less, and blood test results are stable or improving (1.5.19).",
      items: [
        "Write a care plan: who provides follow-up, frequency of blood pressure monitoring, thresholds for reducing or stopping treatment, indications for referral to primary care, and self-monitoring for symptoms (1.5.20)",
        "Medical review with her GP or specialist 2 weeks after transfer if still on treatment (1.5.21)",
        "Offer all women a medical review 6 to 8 weeks after the birth (1.5.22)",
        "Carry out a urinary reagent-strip test at 6 to 8 weeks; if proteinuria persists at 1+ or more, offer review at 3 months to assess kidney function (1.5.25, 1.5.26)",
        "Advise that a hypertensive disorder of pregnancy carries an increased risk of hypertension and cardiovascular disease in later life (1.10.2)",
      ],
    },

  },
};
