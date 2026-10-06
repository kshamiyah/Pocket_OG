// Timing of planned birth by indication: national sources only.
//
// Replaces the local GL861 timing table as the national route. That table was
// a local aggregation of decisions that each belong to a different national
// guideline, so every node here names its own source and cites it:
//
//   NICE NG207 (2021)  inducing labour
//   NICE NG3 (2015, updated 2020)  diabetes in pregnancy
//   NICE NG133 (2019, updated 2023)  hypertension in pregnancy
//   RCOG GTG57 (2026)  reduced fetal movements
//   RCOG GTG43 (2022)  intrahepatic cholestasis of pregnancy
//   RCOG GTG31 (2024)  SGA fetus and growth restricted fetus
//   RCOG GTG63 (2011)  antepartum haemorrhage
//
// NICE citations are recommendation numbers. RCOG guidelines number sections
// rather than recommendations, so RCOG citations give the grade instead.
// Wording follows each source: where a source says "consider", so does this.
// Local rows with no national source (maternal age, anticoagulation, raised PCR
// with symptoms as a separate row) are deliberately absent.

export const IOL_TIMING_FLOWCHART = {
  id: "IOL_TIMING",
  title: "Timing of Planned Birth by Indication",
  subtitle: "National guidance only · NICE and RCOG",
  startId: "which",
  nodes: {

    "which": {
      type: "decision",
      title: "What Is the Indication?",
      text: "Each answer comes from the national guideline that owns it. Decision aid only; clinical responsibility remains with the treating clinician.",
      options: [
        { label: "Uncomplicated pregnancy beyond 41 weeks", sublabel: "NICE NG207", next: "postdates" },
        { label: "Reduced fetal movements", sublabel: "RCOG GTG57", next: "rfm" },
        { label: "Diabetes", sublabel: "NICE NG3", next: "dm" },
        { label: "Hypertension or pre-eclampsia", sublabel: "NICE NG133", next: "htn" },
        { label: "Intrahepatic cholestasis of pregnancy", sublabel: "RCOG GTG43", next: "icp" },
        { label: "Small for gestational age or growth restriction", sublabel: "RCOG GTG31", next: "sga" },
        { label: "Antepartum haemorrhage", sublabel: "RCOG GTG63", next: "aph" },
      ],
    },

    // ── NG207 ───────────────────────────────────────────────────────────
    "postdates": {
      type: "end",
      title: "Pregnancy Beyond 41 Weeks",
      text: "Discuss that induction of labour from 41+0 weeks may reduce the risks of a pregnancy continuing beyond 41+0 weeks, alongside its impact on her birth experience (NG207 1.2.4).",
      items: [
        "Give women with uncomplicated pregnancies every opportunity to go into spontaneous labour (NG207 1.2.1)",
      ],
    },

    // ── GTG57 ───────────────────────────────────────────────────────────
    "rfm": {
      type: "end",
      title: "Reduced Fetal Movements",
      text: "Where there is no objective evidence of fetal compromise (no CTG anomalies, no evidence of reduced fetal growth, oligohydramnios or umbilical artery Doppler anomalies), reassure her that there is no indication for expediting birth (GTG57, Grade A).",
      items: [
        "A decision to expedite birth should be made on an individual basis in partnership with her (GTG57, Grade A)",
        "If she presents with reduced fetal movements after 39+0 weeks, expediting birth does not appear to be associated with increased risk to her or the baby (GTG57, Grade A)",
        "If she recurrently perceives reduced fetal movements, review her case to exclude predisposing causes (GTG57, Grade C)",
      ],
    },

    // ── NG3 ─────────────────────────────────────────────────────────────
    "dm": {
      type: "decision",
      title: "Which Type, and Any Complications?",
      text: "Discuss the timing and mode of birth at antenatal appointments, especially in the third trimester (NG3 1.4.1).",
      options: [
        { label: "Type 1 or type 2 diabetes, no other complications", sublabel: "NG3 1.4.2", next: "dm-pre" },
        { label: "Type 1 or type 2 diabetes, with metabolic or other maternal or fetal complications", sublabel: "NG3 1.4.3", next: "dm-pre-comp" },
        { label: "Gestational diabetes, no complications", sublabel: "NG3 1.4.4", next: "gdm" },
        { label: "Gestational diabetes, with maternal or fetal complications", sublabel: "NG3 1.4.5", next: "gdm-comp" },
      ],
    },

    "dm-pre": {
      type: "end",
      title: "Birth Between 37+0 and 38+6 Weeks",
      text: "Advise an elective birth by induced labour, or by caesarean section if indicated, between 37 weeks and 38 weeks plus 6 days (NG3 1.4.2).",
    },

    "dm-pre-comp": {
      type: "end",
      title: "Consider Birth Before 37 Weeks",
      text: "Consider elective birth before 37 weeks for women with type 1 or type 2 diabetes who have metabolic or other maternal or fetal complications (NG3 1.4.3).",
    },

    "gdm": {
      type: "end",
      title: "Birth No Later Than 40+6 Weeks",
      text: "Advise women with gestational diabetes to give birth no later than 40 weeks plus 6 days. Offer elective birth by induced labour, or by caesarean section if indicated, to women who have not given birth by then (NG3 1.4.4).",
    },

    "gdm-comp": {
      type: "end",
      title: "Consider Birth Before 40+6 Weeks",
      text: "Consider elective birth before 40 weeks plus 6 days for women with gestational diabetes who have maternal or fetal complications (NG3 1.4.5).",
    },

    // ── NG133 ───────────────────────────────────────────────────────────
    "htn": {
      type: "decision",
      title: "Which Hypertensive Disorder?",
      text: "Involve a senior obstetrician in any decision on timing of birth in pre-eclampsia (NG133 1.5.8).",
      options: [
        { label: "Pre-eclampsia", sublabel: "NG133 table 3", next: "pet" },
        { label: "Chronic hypertension, blood pressure below 160/110", sublabel: "NG133 1.3.14, 1.3.15", next: "chronic" },
        { label: "Gestational hypertension, blood pressure below 160/110", sublabel: "NG133 1.4.7, 1.4.8", next: "gestational" },
        { label: "Blood pressure 160/110 or higher", next: "severe" },
      ],
    },

    "pet": {
      type: "end",
      title: "Pre-Eclampsia",
      text: "Decide on timing of birth as set out in table 3 (NG133 1.5.12).",
      items: [
        "Before 34 weeks: continue surveillance unless there are indications for planned early birth. Offer intravenous magnesium sulfate and antenatal corticosteroids in line with the NICE guideline on preterm labour and birth",
        "34 weeks to 36 weeks plus 6 days: continue surveillance unless there are indications for planned early birth, taking into account her and the baby's condition, risk factors and neonatal unit beds",
        "From 37 weeks: initiate birth within 24 to 48 hours",
        "Record the maternal and fetal thresholds for planned early birth before 37 weeks (NG133 1.5.7)",
      ],
    },

    "chronic": {
      type: "end",
      title: "Chronic Hypertension Below 160/110",
      text: "Do not offer planned early birth before 37 weeks, with or without antihypertensive treatment, unless there are other medical indications (NG133 1.3.14).",
      items: [
        "After 37 weeks, timing of birth and the maternal and fetal indications for birth should be agreed between her and the senior obstetrician (NG133 1.3.15)",
        "NG133 gives no fixed gestation after 37 weeks",
      ],
    },

    "gestational": {
      type: "end",
      title: "Gestational Hypertension Below 160/110",
      text: "Do not offer planned early birth before 37 weeks unless there are other medical indications (NG133 1.4.7).",
      items: [
        "After 37 weeks, timing of birth and the maternal and fetal indications for birth should be agreed between her and the senior obstetrician (NG133 1.4.8)",
        "NG133 gives no fixed gestation after 37 weeks",
      ],
    },

    "severe": {
      type: "end",
      title: "Blood Pressure 160/110 or Higher",
      text: "NG133's recommendations against planned birth before 37 weeks apply only below 160/110 (NG133 1.3.14, 1.4.7). Treat the severe hypertension first.",
    },

    // ── GTG43 ───────────────────────────────────────────────────────────
    "icp": {
      type: "decision",
      title: "Peak Bile Acid Concentration?",
      text: "Isolated ICP in a singleton pregnancy. The risk of stillbirth only rises above the population rate once bile acids are 100 micromol/L or more (GTG43).",
      options: [
        { label: "19 to 39 micromol/L (mild)", next: "icp-mild" },
        { label: "40 to 99 micromol/L (moderate)", next: "icp-moderate" },
        { label: "100 micromol/L or more (severe)", next: "icp-severe" },
      ],
    },

    "icp-mild": {
      type: "end",
      title: "Mild ICP",
      text: "With no other risk factors, the risk of stillbirth is similar to the background risk. Consider options of planned birth by 40 weeks, or ongoing antenatal care according to national guidance (GTG43, Grade A).",
      items: [
        "Comorbidities such as gestational diabetes, pre-eclampsia or multifetal pregnancy appear to increase the risk of stillbirth and may influence timing (GTG43, Grade D)",
      ],
    },

    "icp-moderate": {
      type: "end",
      title: "Moderate ICP",
      text: "With no other risk factors, the risk of stillbirth is similar to the background risk until 38 to 39 weeks. Consider planned birth at 38 to 39 weeks (GTG43, Grade A).",
      items: [
        "Comorbidities such as gestational diabetes, pre-eclampsia or multifetal pregnancy appear to increase the risk of stillbirth and may influence timing (GTG43, Grade D)",
      ],
    },

    "icp-severe": {
      type: "end",
      title: "Severe ICP",
      text: "The risk of stillbirth is higher than the background risk. Consider planned birth at 35 to 36 weeks (GTG43, Grade A).",
      items: [
        "Comorbidities such as gestational diabetes, pre-eclampsia or multifetal pregnancy appear to increase the risk of stillbirth and may influence timing (GTG43, Grade D)",
        "Fetal ultrasound and CTG do not predict or prevent stillbirth in ICP (GTG43, Grade D)",
      ],
    },

    // ── GTG31 ───────────────────────────────────────────────────────────
    "sga": {
      type: "decision",
      title: "SGA or Fetal Growth Restriction?",
      text: "SGA: estimated fetal weight or abdominal circumference below the 10th centile. FGR: below the 3rd centile, or below the 10th centile with Doppler abnormalities. Early FGR is detected before 32+0 weeks, late FGR from 32+0 (GTG31).",
      options: [
        { label: "SGA, FGR excluded", next: "sga-only" },
        { label: "Late FGR, from 32+0 weeks", next: "fgr-late" },
        { label: "Early FGR, before 32+0 weeks", next: "fgr-early" },
      ],
    },

    "sga-only": {
      type: "end",
      title: "SGA With FGR Excluded",
      text: "Consider birth or the start of induction at 39+0 weeks after discussion with her and her partner, family or support network. Birth should occur by 39+6 weeks (GTG31, Grade B).",
      items: [
        "With an estimated fetal weight between the 3rd and 10th centile, birth before 39+0 weeks needs other features: maternal (medical conditions or concerns about fetal movements) or fetal compromise (FGR on Doppler, fetal growth velocity, or a concern on CTG) (GTG31, Grade C)",
        "If she wishes to continue beyond 39+0 weeks, counsel her that planned birth at this gestation carries no additional risk for her or the baby compared with expectant care, and make an individual plan (GTG31, GPP)",
      ],
    },

    "fgr-late": {
      type: "end",
      title: "Late FGR",
      text: "Initiate birth from 37+0 weeks, to be completed by 37+6 weeks (GTG31, Grade A).",
      items: [
        "Base decisions for birth on fetal wellbeing assessments or maternal indication (GTG31, GPP)",
      ],
    },

    "fgr-early": {
      type: "end",
      title: "Early FGR",
      text: "Monitor and manage with input from a tertiary level unit with the highest level of neonatal care, with multidisciplinary care from neonatology and obstetricians with fetal medicine expertise, particularly before 28 weeks (GTG31, GPP).",
      items: [
        "Repeat fetal biometry every 2 weeks (GTG31, Grade B)",
        "Assessment of fetal wellbeing must include computerised CTG and/or ductus venosus Doppler (GTG31, Grade B)",
      ],
    },

    // ── GTG63 ───────────────────────────────────────────────────────────
    "aph": {
      type: "decision",
      title: "Antepartum Haemorrhage: Is There Compromise?",
      text: "The optimum timing of birth for unexplained APH without maternal or fetal compromise is not established. Involve a senior obstetrician in deciding timing and mode of birth (GTG63).",
      options: [
        { label: "Maternal or fetal compromise", next: "aph-compromise" },
        { label: "No compromise, before 37+0 weeks, bleeding settled", next: "aph-preterm" },
        { label: "No compromise, from 37+0 weeks", next: "aph-term" },
      ],
    },

    "aph-compromise": {
      type: "end",
      title: "Deliver Immediately",
      text: "Women with APH and associated maternal or fetal compromise are required to be delivered immediately (GTG63).",
      items: [
        "If the fetus is compromised, caesarean birth with concurrent maternal resuscitation is appropriate (GTG63)",
      ],
    },

    "aph-preterm": {
      type: "end",
      title: "No Evidence for Elective Early Birth",
      text: "Before 37+0 weeks, with no maternal or fetal compromise and the bleeding settled, there is no evidence to support elective premature delivery (GTG63).",
    },

    "aph-term": {
      type: "end",
      title: "Consider Induction",
      text: "After 37+0 weeks, establish whether this is an APH or a blood-stained show. Spotting, or blood streaked through mucus, is unlikely to need intervention. With a minor or major APH, consider induction of labour aiming for vaginal birth (GTG63).",
    },

  },
};
