// GTG57 — Reduced Fetal Movements (RCOG Green-Top Guideline No. 57, 2026)
// Flowchart 1: Main RFM Care Pathway ≥28 weeks (Appendix C)
// Flowchart 2: Gestation-Based Initial Assessment
// Flowchart 3: Recurrent RFM Pathway

export const GTG57_CARE_PATHWAY_FLOWCHART = {
  id: "GTG57_CARE_PATHWAY",
  title: "RFM Care Pathway: ≥28 Weeks",
  subtitle: "GTG57 · RCOG: Reduced Fetal Movements",
  startId: "present",
  nodes: {

    "present": {
      type: "action",
      title: "Woman Presents With RFM at ≥28+0 Weeks",
      text: "Take a detailed clinical history. RFM is the presenting symptom for ~50% of IUFDs — the first priority is always to confirm fetal viability.",
      items: [
        "Duration and nature of RFM (reduced, absent, or changed pattern)",
        "Whether movement has ever been felt (important at borderline gestations)",
        "Any preceding period of excessive or vigorous fetal movements",
        "Risk factors for stillbirth and FGR: smoking, hypertension, diabetes, prior SGA/stillbirth, obesity, recurrent RFM, SFH <10th centile",
        "Medications that cross placenta (opioids, benzodiazepines, alcohol)",
      ],
      next: "confirms-rfm",
    },

    "confirms-rfm": {
      type: "decision",
      title: "Does history confirm RFM?",
      text: "Assess whether the woman truly has reduced fetal movements or whether an alternative explanation is likely (e.g. distraction, change in position, anterior placenta — though these should not falsely reassure).",
      options: [
        { label: "Yes, history confirms RFM", sublabel: "Proceed to auscultation", next: "auscultate" },
        { label: "Not confirmed, uncertain", sublabel: "Offer auscultation + routine assessment", next: "not-confirmed" },
      ],
    },

    "not-confirmed": {
      type: "end",
      title: "RFM Not Confirmed: Offer Auscultation",
      text: "If history does not clearly confirm RFM, offer auscultation of the fetal heart and routine antenatal assessment.",
      items: [
        "Offer to auscultate fetal heart with handheld Doppler",
        "Routine antenatal assessment (BP, urinalysis, SFH)",
        "Advise: if unsure whether movements are reduced, focus on fetal movements for 2 hours",
        "Advise: if fewer than 10 movements felt in 2 hours — contact maternity unit",
        "Give clear written information about when to re-attend",
      ],
    },

    "auscultate": {
      type: "action",
      title: "Auscultate With Handheld Doppler",
      text: "Confirm fetal cardiac activity. Differentiate fetal heart rate from maternal pulse — the FHR should be approximately double the maternal rate.",
      items: [
        "Use handheld Doppler (sonicaid) in community or hospital setting",
        "If encounter is virtual or by telephone — advise to attend maternity unit",
        "Also measure SFH (plot on growth chart), BP, and urinalysis",
      ],
      next: "fh-present",
    },

    "fh-present": {
      type: "decision",
      title: "Fetal heart confirmed on auscultation?",
      text: "Confirm presence of fetal cardiac activity before proceeding.",
      options: [
        { label: "Fetal heart NOT detected", sublabel: "Immediate referral for USS", next: "iufd-suspected" },
        { label: "Fetal heart present", sublabel: "Proceed to CTG", next: "ctg" },
      ],
    },

    "iufd-suspected": {
      type: "alert",
      title: "Fetal Heart Not Detected: Immediate USS",
      text: "Immediate ultrasound scan is required to confirm or exclude intrauterine fetal death (IUFD). Do not delay.",
      items: [
        "Arrange immediate USS to assess fetal cardiac activity",
        "Do not leave the woman alone while awaiting scan",
        "If IUFD confirmed: senior obstetrician and bereavement midwife involvement immediately",
        "Inform the woman sensitively — do not give false reassurance before scan",
      ],
    },

    "ctg": {
      type: "action",
      title: "Computerised CTG: Exclude Acute Fetal Compromise",
      text: "Perform computerised CTG (cCTG) for at least 20 minutes. A reactive CTG with FHR accelerations coinciding with fetal movements indicates an intact fetal autonomic nervous system.",
      items: [
        "Computerised CTG preferred over visual interpretation — reduces inter-observer variation",
        "A healthy fetus should show FHR accelerations with >92% of gross body movements",
        "If no acceleration for >80 minutes — fetal compromise is likely",
        "Abnormal CTG increases risk of adverse outcome 7-fold (aOR 7.1)",
      ],
      next: "ctg-result",
    },

    "ctg-result": {
      type: "decision",
      title: "CTG result?",
      text: "Interpret CTG result and assess whether RFM has resolved.",
      options: [
        { label: "Suspicious or pathological CTG", sublabel: "Senior obstetrician review required", next: "abnormal-ctg" },
        { label: "Normal CTG: RFM resolved, no risk factors", sublabel: "Reassure and discharge with advice", next: "reassure" },
        { label: "Normal CTG: RFM persists OR risk factors present", sublabel: "Proceed to USS", next: "uss-indicated" },
      ],
    },

    "abnormal-ctg": {
      type: "alert",
      title: "Suspicious or Pathological CTG: Senior Review",
      text: "Discuss with senior obstetrician immediately. Decisions about birth should consider gestation and degree of CTG anomaly.",
      items: [
        "Involve senior obstetrician (ST6+ or consultant) urgently",
        "Consider acute fetal compromise — expedite birth if appropriate",
        "If lesser degree of concern: further CTG monitoring with plan for frequent reassessment",
        "Consider USS (EFW, liquor, UAD) if birth not immediately indicated",
        "If acute compromise: proceed to birth per unit protocol",
      ],
    },

    "reassure": {
      type: "end",
      title: "Normal CTG: Reassure and Discharge",
      text: "Where RFM has resolved and investigations are normal with no risk factors, women can be reassured. There is no indication to expedite birth.",
      items: [
        "Reassure that investigations are normal",
        "No indication for expediting birth with normal investigations (Grade A)",
        "Do NOT recommend formal kick charts after a single episode with normal investigations — no evidence of benefit",
        "Advise: fetal movements do not decrease towards term — report any further reduction promptly",
        "Advise: report any further RFM or change in pattern immediately",
      ],
    },

    "uss-indicated": {
      type: "action",
      title: "USS: EFW, Amniotic Fluid Volume, Umbilical Artery Doppler",
      text: "Perform USS if: RFM persists despite normal CTG, OR any risk factors for FGR/stillbirth are present, OR no USS in the preceding 2 weeks.",
      items: [
        "Estimated fetal weight (EFW) and abdominal circumference — to detect SGA (<10th centile)",
        "Amniotic fluid volume — oligohydramnios associated with adverse outcome",
        "Umbilical artery Doppler — pulsatility index; absent/reversed end-diastolic flow = severe FGR",
        "Fetal morphology — if anomaly scan not previously performed",
        "CPR (cerebroplacental ratio) may identify fetuses benefiting from expedited birth after 37 weeks",
        "Perform at earliest available opportunity — do not delay diagnosis of SGA",
      ],
      next: "uss-result",
    },

    "uss-result": {
      type: "decision",
      title: "USS findings?",
      text: "Interpret USS findings to guide management.",
      options: [
        { label: "Normal: EFW ≥10th centile, normal fluid, normal Doppler", sublabel: "Reassure + advice", next: "normal-uss" },
        { label: "SGA, oligohydramnios, or abnormal Doppler", sublabel: "Manage per GTG31 SGA guideline", next: "sga-pathway" },
      ],
    },

    "normal-uss": {
      type: "end",
      title: "Normal USS: Reassure",
      text: "Normal USS following normal CTG — reassure. No indication for expediting birth with all investigations normal.",
      items: [
        "Reassure that all investigations are normal",
        "No indication for induction of labour before 39 weeks based on RFM alone with normal investigations",
        "If ≥39 weeks and woman wishes delivery: IOL does not increase caesarean risk (Grade A)",
        "Advise: any further RFM or change in pattern — attend maternity unit immediately",
        "Advise: fetal movements do not decrease towards term",
      ],
    },

    "sga-pathway": {
      type: "end",
      title: "SGA / Oligohydramnios / Abnormal Doppler: Manage per GTG31",
      text: "When SGA is identified or USS shows oligohydramnios or abnormal umbilical artery Doppler, manage in accordance with RCOG GTG31 (SGA and Growth Restricted Fetus).",
      items: [
        "SGA (EFW <10th centile): manage per RCOG Green-Top Guideline No. 31",
        "Oligohydramnios: associated with placental dysfunction — senior review, consider timing of birth",
        "Abnormal UAD (raised PI, absent or reversed end-diastolic flow): indicates significant FGR",
        "Fetomaternal haemorrhage: consider if sinusoidal CTG — MCA Doppler or Kleihauer–Betke test",
        "Fetal anomaly detected: refer to fetal medicine specialist",
      ],
    },

  },
};

// ─────────────────────────────────────────────────────────────────────────────

export const GTG57_GESTATION_FLOWCHART = {
  id: "GTG57_GESTATION",
  title: "RFM: Initial Assessment by Gestation",
  subtitle: "GTG57 · RCOG: Reduced Fetal Movements",
  startId: "gestation",
  nodes: {

    "gestation": {
      type: "decision",
      title: "Gestation at presentation with RFM?",
      text: "Management of RFM differs significantly by gestation. Most evidence comes from pregnancies after 28 weeks.",
      options: [
        { label: "Before 24+0 weeks", sublabel: "Confirm fetal heartbeat only", next: "pre-24" },
        { label: "24+0 to 25+6 weeks", sublabel: "Confirm FH + history for risk factors", next: "24-to-26" },
        { label: "26+0 to 27+6 weeks", sublabel: "Confirm FH + history; consider CTG if concern", next: "26-to-28" },
        { label: "28+0 weeks or later", sublabel: "Full RFM care pathway", next: "over-28" },
      ],
    },

    "pre-24": {
      type: "action",
      title: "RFM Before 24+0 Weeks: Confirm Fetal Heartbeat",
      text: "There are no studies on outcomes of RFM before 24 weeks. Placental insufficiency rarely presents this early. Confirm fetal viability.",
      items: [
        "Auscultate fetal heart with handheld Doppler — to exclude IUFD",
        "If FH not detected: immediate USS referral",
        "If FH confirmed: reassure and advise",
      ],
      next: "pre-24-movement",
    },

    "pre-24-movement": {
      type: "decision",
      title: "Has movement ever been felt?",
      text: "Women who have never perceived any fetal movement by 24 weeks may have a fetus with an underlying neuromuscular or structural condition.",
      options: [
        { label: "Yes, previously felt movement", sublabel: "Normal variation likely; reassure", next: "pre24-reassure" },
        { label: "Never, no movement felt at all", sublabel: "Arrange anomaly scan + consider fetal medicine", next: "pre24-anomaly" },
      ],
    },

    "pre24-reassure": {
      type: "end",
      title: "Reassure: Normal at This Gestation",
      text: "Fetal heartbeat confirmed. Movement perception is variable before 24 weeks. Reassure and advise.",
      items: [
        "Women feel movements from 16–24 weeks — significant variation is normal",
        "Multiparous women may feel movement earlier than primiparous",
        "Advise: report if no movement felt at all by 24 weeks",
        "Advise: report any further concerns about movement",
      ],
    },

    "pre24-anomaly": {
      type: "alert",
      title: "No Movement Ever Felt: Arrange Anomaly Scan",
      text: "Absent fetal movement by 24 weeks is associated with neurological and musculoskeletal anomalies. Investigate further.",
      items: [
        "Arrange anomaly USS if not already performed",
        "Consider referral to fetal medicine specialist if concerns persist",
        "Possible underlying conditions: neuromuscular disorders (myotonic dystrophy, arthrogryposis), structural anomalies",
        "Ensure woman is supported psychologically",
      ],
    },

    "24-to-26": {
      type: "action",
      title: "RFM 24+0 to 25+6 Weeks: Confirm FH + Risk History",
      text: "Confirm fetal viability and take a comprehensive stillbirth risk assessment. No evidence to recommend routine CTG at this gestation.",
      items: [
        "Auscultate fetal heart with handheld Doppler — to exclude IUFD",
        "Take history for stillbirth and early-onset FGR risk factors",
        "Risk factors: smoking, hypertension, diabetes, prior SGA/stillbirth, BMI, placental insufficiency",
        "No evidence to recommend routine CTG surveillance at this gestation",
        "If clinical suspicion of FGR: consider USS assessment of fetal size",
      ],
      next: "24-risk",
    },

    "24-risk": {
      type: "decision",
      title: "Risk factors for FGR or stillbirth present?",
      text: "Clinical suspicion of FGR or significant risk factors prompt USS assessment even at this gestation.",
      options: [
        { label: "Yes, risk factors or clinical concern", sublabel: "Consider USS for fetal size", next: "24-uss" },
        { label: "No, low risk, FH confirmed", sublabel: "Reassure and advise", next: "24-end" },
      ],
    },

    "24-uss": {
      type: "end",
      title: "Consider USS at 24–26 Weeks",
      text: "If FGR is clinically suspected, USS assessment of fetal size should be considered.",
      items: [
        "USS: EFW and AC to assess for SGA",
        "Liquor volume assessment",
        "Uterine artery Doppler if available (raised PI associated with x5.73 increased risk of SGA after RFM)",
        "If FGR confirmed: manage per RCOG GTG31",
        "Advise re-attend if further concerns about movement",
      ],
    },

    "24-end": {
      type: "end",
      title: "Reassure: FH Confirmed, No Risk Factors",
      text: "Fetal heartbeat confirmed. Low-risk presentation. Reassure and give clear advice.",
      items: [
        "Fetal heartbeat confirmed — reassure",
        "Explain normal pattern of fetal movements at this gestation",
        "Advise: report any further RFM or change in movement pattern",
        "Advise: attend maternity unit if concerned",
      ],
    },

    "26-to-28": {
      type: "action",
      title: "RFM 26+0 to 27+6 Weeks: Confirm FH + Assess",
      text: "Confirm fetal viability. Consider CTG if clinical suspicion of fetal compromise. CTG can be offered from 26 weeks if viability is confirmed.",
      items: [
        "Auscultate fetal heart with handheld Doppler",
        "Take history for FGR/stillbirth risk factors",
        "Measure SFH and plot on growth chart; BP and urinalysis",
        "CTG can be considered from 26+0 weeks if clinically indicated",
      ],
      next: "26-concern",
    },

    "26-concern": {
      type: "decision",
      title: "Clinical suspicion of compromise or significant risk factors?",
      text: "Decide whether CTG and USS assessment are needed at this borderline gestation.",
      options: [
        { label: "Yes, clinical concern or risk factors", sublabel: "CTG ± USS assessment", next: "26-ctg" },
        { label: "No: FH confirmed, low risk", sublabel: "Reassure + advice", next: "26-end" },
      ],
    },

    "26-ctg": {
      type: "end",
      title: "CTG ± USS at 26–28 Weeks",
      text: "Computerised CTG is available from 26 weeks. Perform if clinically indicated.",
      items: [
        "Perform CTG — computerised interpretation preferred",
        "Consider USS if CTG abnormal or suspicion of FGR",
        "USS: EFW, AC, liquor volume, UAD",
        "If FGR or acute compromise: senior obstetrician involvement",
        "Decisions about birth must weigh gestation against degree of compromise",
      ],
    },

    "26-end": {
      type: "end",
      title: "Reassure: FH Confirmed, No Concern",
      text: "Fetal heartbeat confirmed. Low-risk presentation at 26–28 weeks. Reassure and advise.",
      items: [
        "Fetal heartbeat confirmed — reassure",
        "Advise: report any further RFM immediately",
        "Advise: fetal movements should not decrease — any change should be reported",
        "Review at next scheduled appointment",
      ],
    },

    "over-28": {
      type: "end",
      title: "≥28+0 Weeks: Use Full RFM Care Pathway",
      text: "At 28 weeks or later, proceed with the full RFM care pathway including CTG and USS assessment as indicated.",
      items: [
        "Take detailed history including risk factors for stillbirth and FGR",
        "Auscultate fetal heart with handheld Doppler",
        "CTG to exclude acute fetal compromise",
        "USS if: CTG normal but RFM persists, OR risk factors present, OR no USS in past 2 weeks",
        "See the main RFM Care Pathway (≥28 weeks) flowchart for full decision logic",
      ],
    },

  },
};

// ─────────────────────────────────────────────────────────────────────────────

export const GTG57_RECURRENT_FLOWCHART = {
  id: "GTG57_RECURRENT",
  title: "Recurrent RFM Pathway",
  subtitle: "GTG57 · RCOG: Reduced Fetal Movements",
  startId: "define",
  nodes: {

    "define": {
      type: "action",
      title: "Defining Recurrent RFM",
      text: "Recurrent RFM is defined as 2 or more episodes of RFM occurring within a 21-day period after 26 weeks of gestation. Women with recurrent RFM are at significantly higher risk of adverse outcome.",
      items: [
        "Risk of stillbirth: 1.4% vs 0.6% (one episode only)",
        "Risk of FGR: 44.2% vs 9.8% (one episode only)",
        "Odds of SGA infant: OR 8.04 (95% CI 4.63–13.98)",
        "Risk of preterm birth also increased",
      ],
      next: "review-cause",
    },

    "review-cause": {
      type: "action",
      title: "Review for Predisposing Causes",
      text: "When a woman recurrently perceives RFM, her case should be reviewed to exclude predisposing causes of reduced perception.",
      items: [
        "Cigarette smoking (aOR 2.96 for adverse outcome)",
        "Past medical history: diabetes, hypertension (aOR 2.35)",
        "Prior SGA birth or stillbirth (aOR 2.10)",
        "SFH <10th centile (OR 15.43 — strongest clinical predictor)",
        "Raised uterine artery PI on second trimester scan (OR 5.73 for SGA)",
        "Medications affecting fetal movements: opioids, benzodiazepines, alcohol",
        "Factors reducing perception: anterior placenta, high BMI, maternal distraction",
      ],
      next: "full-investigations",
    },

    "full-investigations": {
      type: "action",
      title: "Mandatory Full Investigations",
      text: "USS is mandatory in all cases of recurrent RFM. Full investigation package should be completed.",
      items: [
        "Computerised CTG — to exclude acute fetal compromise",
        "USS: EFW + abdominal circumference (SGA detection)",
        "Amniotic fluid volume (deepest vertical pocket)",
        "Umbilical artery Doppler — PI, end-diastolic flow",
        "Consider: cerebroplacental ratio (CPR) — especially if ≥37 weeks (CPR <1.1 may guide IOL decision)",
        "Fetal morphology — if not previously assessed",
      ],
      next: "investigations-result",
    },

    "investigations-result": {
      type: "decision",
      title: "Investigation findings?",
      text: "Interpret full investigation results to guide further management.",
      options: [
        { label: "Abnormal: SGA, oligohydramnios, or abnormal Doppler", sublabel: "Manage per GTG31; senior review", next: "abnormal-recurrent" },
        { label: "Abnormal CTG", sublabel: "Senior obstetrician review urgently", next: "abnormal-ctg-recurrent" },
        { label: "All investigations normal", sublabel: "Assess gestation for IOL decision", next: "gestation-decision" },
      ],
    },

    "abnormal-recurrent": {
      type: "alert",
      title: "Abnormal USS: SGA / Oligohydramnios / Abnormal Doppler",
      text: "USS abnormality in context of recurrent RFM is a high-risk finding. Manage in accordance with RCOG GTG31.",
      items: [
        "Refer to or manage per RCOG GTG31 (SGA and Growth Restricted Fetus)",
        "Consultant obstetrician involvement",
        "Frequency of surveillance and timing of birth determined by USS findings and gestation",
        "Absent/reversed end-diastolic flow on UAD = severe FGR — urgent senior review",
        "Inform woman of findings and involve her in birth planning",
      ],
    },

    "abnormal-ctg-recurrent": {
      type: "alert",
      title: "Abnormal CTG: Senior Obstetrician Review",
      text: "Abnormal CTG in recurrent RFM significantly increases risk. Discuss with senior obstetrician urgently.",
      items: [
        "Involve senior obstetrician immediately",
        "Decisions about birth: consider gestation vs degree of CTG anomaly",
        "Acute compromise: proceed to birth per unit protocol",
        "Lesser concern: further CTG monitoring with plan for frequent reassessment",
        "Add USS (EFW, liquor, UAD) if not already performed",
      ],
    },

    "gestation-decision": {
      type: "decision",
      title: "Gestation, guide IOL decision",
      text: "Where all investigations are normal in a woman with recurrent RFM, the decision to offer induction of labour must be individualised. Gestation is the key factor.",
      options: [
        { label: "Before 39+0 weeks", sublabel: "No routine IOL, individualised senior decision", next: "pre-39" },
        { label: "39+0 weeks or later", sublabel: "IOL can be offered, not associated with increased risk", next: "post-39" },
      ],
    },

    "pre-39": {
      type: "end",
      title: "Recurrent RFM <39 Weeks: No Routine IOL",
      text: "There is no evidence that IOL before 39 weeks for recurrent RFM with normal investigations improves perinatal outcomes. The decision must be individualised.",
      items: [
        "No routine IOL before 39 weeks for RFM alone with normal investigations (Grade A)",
        "Decision for IOL at early term must be made by experienced obstetrician in partnership with the woman",
        "Continue with USS and CTG surveillance",
        "Advise: attend immediately with any further RFM or movement change",
        "Document discussion and individualised plan in notes",
        "Consider CPR — CPR <1.1 may identify fetuses benefiting from expedited birth",
      ],
    },

    "post-39": {
      type: "end",
      title: "Recurrent RFM ≥39 Weeks: IOL Can Be Offered",
      text: "Induction of labour at or after 39 weeks of gestation is not associated with increased caesarean rate or adverse maternal or fetal outcomes. It can be offered.",
      items: [
        "IOL at ≥39 weeks: not associated with increased caesarean rate (Grade A)",
        "Not associated with increased adverse maternal or fetal outcomes",
        "Offer IOL in partnership with the woman — shared decision-making",
        "Document discussion and woman's wishes",
        "If woman declines IOL: increase surveillance with CTG and USS",
        "Ensure woman understands she should return immediately with any further movement concerns",
      ],
    },

  },
};
