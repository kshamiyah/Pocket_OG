export const GL861_IOL_FLOWCHART = {
  id: "GL861_IOL",
  title: "IOL Pathway",
  subtitle: "GL861 · Induction of Labour",
  startId: "assess",
  nodes: {

    "assess": {
      type: "action",
      title: "Initial assessment",
      text: "Assess woman on arrival at the IOL suite.",
      items: [
        "Confirm dates and indication for IOL",
        "Review USS — exclude low-lying placenta",
        "Abdominal palpation + ultrasound to confirm cephalic presentation",
        "Computerised CTG",
        "Baseline obs: HR, RR, BP, temp, urinalysis, MEOWS",
        "VE — assess cervix, calculate Bishop score, palpate for cord presentation",
        "Start fluid balance chart",
      ],
      next: "bishop",
    },

    "bishop": {
      type: "decision",
      title: "Bishop score",
      text: "What is the Bishop score?",
      options: [
        { label: "BS ≥ 6", sublabel: "Favourable: ARM likely possible", next: "arm-head" },
        { label: "BS < 6", sublabel: "Unfavourable, cervical ripening needed", next: "crb-check" },
      ],
    },

    // ── ARM pathway ──────────────────────────────────────────────

    "arm-head": {
      type: "decision",
      title: "Head position",
      text: "Is the presenting part well applied to the cervix? (Head engaged / not high)",
      options: [
        { label: "Yes, head well applied", next: "arm-do" },
        { label: "No, head is high", next: "arm-high-head" },
      ],
    },

    "arm-high-head": {
      type: "alert",
      title: "High head, escalate first",
      text: "Escalate to MW in charge and on-call obstetric team before proceeding.",
      items: [
        "Registrar: bleep 555",
        "Consultant: bleep 266",
        "Options: controlled ARM with fundal pressure, or commence oxytocin first to engage head",
      ],
      next: "arm-do",
    },

    "arm-do": {
      type: "action",
      title: "Perform ARM",
      text: "Perform amniotomy (ARM) on the IOL suite.",
      items: [
        "Commence oxytocin ideally within 2 hours of ARM — discuss and agree with woman",
        "GBS carriers: IV Benzylpenicillin must be prescribed at start of induction and administered at ARM",
        "If contractions start following ARM, assess suitability for Rushey MLU",
      ],
      next: "transfer",
    },

    "transfer": {
      type: "decision",
      title: "Transfer location",
      text: "Where should the woman labour?",
      options: [
        { label: "Delivery Suite", sublabel: "Consultant care, oxytocin infusion, or higher risk", next: "end-ds" },
        { label: "Rushey MLU", sublabel: "Low-risk multip or primip who laboured after CRB/Propess/ARM, full CTG before transfer", next: "end-mlu" },
      ],
    },

    "end-ds": {
      type: "end",
      title: "Delivery Suite",
      text: "Transfer to Delivery Suite.",
      items: [
        "Maintain oxytocin infusion as prescribed",
        "Continuous electronic fetal monitoring",
        "Ensure woman is kept updated on any delays",
      ],
    },

    "end-mlu": {
      type: "end",
      title: "Rushey MLU",
      text: "Transfer to Rushey MLU for labour care.",
      items: [
        "Perform full CTG assessment before transfer",
        "Encourage mobilisation for 1 hour after ARM",
        "Reassess 4 hours post-ARM — if no contractions or cervical change, transfer to Delivery Suite",
      ],
    },

    // ── CRB pathway ──────────────────────────────────────────────

    "crb-check": {
      type: "decision",
      title: "CRB appropriate?",
      text: "Is the Cervical Ripening Balloon (CRB) appropriate and acceptable?\n\nExclusions: ruptured membranes (SROM), unstable presenting part not in pelvis, placenta praevia or vasa praevia.",
      options: [
        { label: "Yes, first line", sublabel: "No exclusions, woman accepts", next: "crb-setting" },
        { label: "No, contraindicated or declined", next: "propess-check" },
      ],
    },

    "crb-setting": {
      type: "decision",
      title: "Inpatient or outpatient?",
      text: "Does the woman meet outpatient IOL criteria?\n\n✓ ≥37 weeks, low risk, singleton, no SROM\n✓ Cephalic with non-ballotable head, unscarred uterus\n✓ Responsible adult at home, understands advice, has transport to return",
      options: [
        { label: "Yes, outpatient IOL", next: "crb-op" },
        { label: "No, inpatient IOL", next: "crb-ip" },
      ],
    },

    "crb-op": {
      type: "action",
      title: "CRB, outpatient",
      text: "Insert CRB (double balloon, max 60 ml saline per balloon).",
      items: [
        "Encourage to pass urine before insertion",
        "Give written return instructions: return at 12 hours (or immediately if contractions > period cramps, SROM, decreased fetal movements, pyrexia, unable to pass urine, CRB falls out, or worried)",
        "Contact number for IOL suite provided",
      ],
      next: "crb-review",
    },

    "crb-ip": {
      type: "action",
      title: "CRB, inpatient",
      text: "Insert CRB on IOL suite (double balloon, max 60 ml saline per balloon).",
      items: [
        "Encourage to pass urine before insertion",
        "Maternal obs + CTG twice daily (more frequently if indicated)",
        "Offer analgesia for discomfort at 4–6 hours post-insertion",
        "Monitor bladder — if unable to pass urine every 3–4 hours, remove balloon",
        "Leave in for 12 hours. Maximum duration: 24 hours",
      ],
      next: "crb-review",
    },

    "crb-review": {
      type: "decision",
      title: "Reassess after CRB",
      text: "After CRB removal — perform VE and reassess.\n\nIs ARM now possible? (Cervix favourable / Bishop score ≥ 6)",
      options: [
        { label: "Yes: ARM possible", next: "arm-head" },
        { label: "No, cervix still unfavourable", next: "crb-fail" },
      ],
    },

    "crb-fail": {
      type: "decision",
      title: "After unsuccessful CRB",
      text: "CRB has not achieved a favourable cervix. Discuss plan with woman and obstetrician.\n\nIs there a history of previous caesarean section?",
      options: [
        { label: "No previous CS: Propess appropriate", next: "propess-insert" },
        { label: "Previous CS, senior review required", next: "propess-cs" },
        { label: "Propess declined / not appropriate", next: "prostin-discuss" },
      ],
    },

    // ── Propess pathway ──────────────────────────────────────────

    "propess-check": {
      type: "decision",
      title: "Propess appropriate?",
      text: "Is Propess (Dinoprostone 10 mg) appropriate?\n\nNote: do NOT give if contractions are already present or CTG is abnormal.",
      options: [
        { label: "Yes, no previous CS, normal CTG", next: "propess-insert" },
        { label: "Previous caesarean section", next: "propess-cs" },
        { label: "Contractions present or abnormal CTG", next: "propess-ci" },
      ],
    },

    "propess-cs": {
      type: "alert",
      title: "Previous CS, stop",
      text: "Propess (Dinoprostone) must NOT be used in women with a history of caesarean section without senior obstetrician review.",
      items: [
        "Discuss with senior obstetrician before prescribing",
        "Document the discussion",
        "Proceed only with explicit senior agreement",
      ],
      next: "propess-insert",
    },

    "propess-ci": {
      type: "alert",
      title: "Propess contraindicated",
      text: "Do not administer Propess if contractions are present or the CTG is abnormal.",
      items: [
        "Reassess when contractions settle or CTG normalises",
        "Discuss plan with senior obstetrician",
        "Consider Prostin gel after consultant review if appropriate",
      ],
      next: "prostin-discuss",
    },

    "propess-insert": {
      type: "action",
      title: "Insert Propess",
      text: "Insert Propess 10 mg into posterior fornix, rotate transversely. Tape to hang in lower vagina.",
      items: [
        "Woman to lie down for at least 30 minutes post-insertion",
        "4-hourly obs: HR, BP, temp, RR, auscultation of fetal heart",
        "Start CTG when contractions begin; continue if CTG normal with hourly obs",
        "Opioid analgesia request → perform CTG",
        "Remove if: regular contractions AND cervix >3 cm dilated; SROM (unless not in established labour); after 24 hours",
      ],
      next: "propess-review",
    },

    "propess-review": {
      type: "decision",
      title: "Reassess after Propess",
      text: "After Propess removal / 24 hours — perform VE and reassess.\n\nIs ARM now possible?",
      options: [
        { label: "Yes: ARM possible", next: "arm-head" },
        { label: "No, cervix still unfavourable", next: "propess-fail" },
      ],
    },

    "propess-fail": {
      type: "decision",
      title: "Unsuccessful Propess, options",
      text: "Cervix remains unfavourable. Discuss options with woman and obstetrician.",
      options: [
        { label: "Second Propess (after senior discussion)", next: "propess-insert" },
        { label: "CRB (if not yet tried)", next: "crb-ip" },
        { label: "Prostin gel (consultant review required)", next: "prostin-discuss" },
        { label: "Unsuccessful IOL, senior review", next: "end-unsuccessful" },
      ],
    },

    // ── Prostin pathway ──────────────────────────────────────────

    "prostin-discuss": {
      type: "alert",
      title: "Prostin, consultant review",
      text: "Discuss with consultant before Prostin administration.",
      items: [
        "Exception: term PROM, low risk — midwife may administer per Prostin PGD100",
        "Document consultant discussion for all other indications",
      ],
      next: "prostin-insert",
    },

    "prostin-insert": {
      type: "action",
      title: "Administer Prostin",
      text: "Prostin (Dinoprostone 1 mg gel) — insert into posterior fornix only.",
      items: [
        "Do NOT insert gel into the cervical canal",
        "Continuous CTG for 1 hour post-insertion (longer if needed)",
        "Repeat CTG when contractions begin",
        "Commence oxytocin 6–8 hours after Prostin",
      ],
      next: "arm-do",
    },

    // ── Unsuccessful IOL ─────────────────────────────────────────

    "end-unsuccessful": {
      type: "end",
      title: "Unsuccessful IOL",
      text: "Unsuccessful IOL — senior obstetric review required.",
      items: [
        "Full assessment including computerised CTG",
        "Senior obstetrician to discuss and agree plan with woman",
        "Options: further induction attempt, expectant management, or caesarean birth",
      ],
    },

  },
};

export const GL861_TIMING_FLOWCHART = {
  id: "GL861_TIMING",
  title: "When to Induce: IOL Timing by Indication",
  subtitle: "GL861 · Induction of Labour",
  startId: "priority-key",
  nodes: {

    "priority-key": {
      type: "action",
      title: "IOL Timing by Indication",
      text: "Select the indication below to see the recommended gestation and IOL priority. Discuss timing with the woman and document the indication clearly in the notes.",
      next: "indication",
    },

    "indication": {
      type: "decision",
      title: "What is the indication for IOL?",
      text: "Select the primary indication:",
      options: [
        { label: "Post-dates",                                next: "post-dates" },
        { label: "Reduced fetal movements (RFM)",             next: "rfm" },
        { label: "Maternal age 40–44",                        next: "age-40-44" },
        { label: "Maternal age ≥45",                          next: "age-45" },
        { label: "Pre-existing diabetes (Type 1 or 2)",       next: "dm-preexisting" },
        { label: "GDM, low risk",                            next: "gdm-low" },
        { label: "GDM, macrosomia or complications",         next: "gdm-macro" },
        { label: "Hypertension / Pre-eclampsia (PET)",        next: "pet" },
        { label: "Hypertension, non-proteinuric, outpatient",next: "htn-op" },
        { label: "Obstetric cholestasis (bile acids >100)",   next: "icp" },
        { label: "Raised PCR ≥30 with hypertension symptoms", next: "pcr" },
        { label: "IUGR / SGA, fetal growth restriction",    next: "iugr" },
        { label: "Full therapeutic anticoagulation",          next: "anticoag" },
        { label: "APH (inpatient)",                           next: "aph" },
      ],
    },

    "post-dates": {
      type: "action",
      title: "Post-dates",
      text: "Offer IOL at 40+7 weeks.",
      items: ["Priority: Routine"],
      next: "end",
    },

    "rfm": {
      type: "action",
      title: "Reduced Fetal Movements",
      text: "Offer IOL if presenting from 38+6 weeks.",
      items: [
        "Only if no other explanation for RFM after full assessment",
        "Refer to GTG57 (Reduced Fetal Movements) for full pathway",
        "Priority: discuss with senior — usually Priority 2",
      ],
      next: "end",
    },

    "age-40-44": {
      type: "action",
      title: "Maternal Age 40–44",
      text: "Recommend IOL at 40+0 weeks.",
      items: ["Priority: 2"],
      next: "end",
    },

    "age-45": {
      type: "action",
      title: "Maternal Age ≥45",
      text: "Recommend IOL at 38+0 weeks.",
      items: ["Priority: 2"],
      next: "end",
    },

    "dm-preexisting": {
      type: "action",
      title: "Pre-existing Diabetes (Type 1 or 2)",
      text: "Offer IOL at 37+0 to 38+6 weeks.",
      items: [
        "Priority: 1",
        "Refer to GL983 (Diabetes in Pregnancy) for full management",
        "Aim for 37+0 to 38+6 gestation depending on control and complications",
      ],
      next: "end",
    },

    "gdm-low": {
      type: "action",
      title: "GDM: Low Risk",
      text: "Offer IOL at 40+3 to 40+6 weeks.",
      items: [
        "Low risk = stable glucose levels, normal growth scan",
        "Priority: 2",
        "Refer to GL983 (Diabetes in Pregnancy) for full management",
      ],
      next: "end",
    },

    "gdm-macro": {
      type: "action",
      title: "GDM: Macrosomia or Complications",
      text: "Offer IOL between 37+0 and 40+0 weeks.",
      items: [
        "Macrosomia = EFW ≥90th centile or AC ≥90th centile",
        "Priority: 2 — senior review to determine exact gestation",
        "Refer to GL983 (Diabetes in Pregnancy) for full management",
      ],
      next: "end",
    },

    "pet": {
      type: "alert",
      title: "Hypertension / Pre-eclampsia (PET)",
      text: "Induce as soon as possible after diagnosis at ≥37+0 weeks.",
      items: [
        "Priority: 1 — inpatient, book within 24–48 hours",
        "Refer to GL952 (Hypertension in Pregnancy) for full management",
        "Senior obstetrician to agree timing and mode of birth",
      ],
      next: "end",
    },

    "htn-op": {
      type: "action",
      title: "Hypertension: Non-proteinuric (Outpatient)",
      text: "Offer IOL at 40+0 to 40+6 weeks.",
      items: [
        "Priority: 2",
        "Ensure BP well controlled with antihypertensives before IOL",
        "Refer to GL952 (Hypertension in Pregnancy)",
      ],
      next: "end",
    },

    "icp": {
      type: "action",
      title: "Obstetric Cholestasis (Bile Acids >100)",
      text: "Offer IOL at 37+0 to 39+6 weeks.",
      items: [
        "Only applies when bile acids >100 µmol/l",
        "Priority: 2",
        "Refer to GL880 (Intrahepatic Cholestasis of Pregnancy)",
      ],
      next: "end",
    },

    "pcr": {
      type: "action",
      title: "Raised PCR ≥30 with Hypertension/PET Symptoms",
      text: "Offer IOL at 39+0 to 40+6 weeks.",
      items: [
        "PCR ≥30 mg/mmol with hypertensive symptoms — discuss with senior",
        "Priority: 2",
        "Refer to GL952 (Hypertension in Pregnancy)",
      ],
      next: "end",
    },

    "iugr": {
      type: "alert",
      title: "IUGR / SGA: Fetal Growth Restriction",
      text: "Timing is individual — consultant fetal medicine decision only.",
      items: [
        "Priority: 1 — do NOT book without explicit consultant agreement",
        "Gestation determined by severity, Doppler findings, and fetal wellbeing",
        "Contraindicated if fetal compromise already confirmed — arrange CS instead",
      ],
      next: "end",
    },

    "anticoag": {
      type: "action",
      title: "Full Therapeutic Anticoagulation",
      text: "Offer IOL at 39+0 weeks.",
      items: [
        "Priority: 1",
        "Plan anticoagulation bridging with haematology well in advance",
        "Refer to GL891 (VTE in Pregnancy & Postnatal)",
      ],
      next: "end",
    },

    "aph": {
      type: "alert",
      title: "APH (Inpatient)",
      text: "Timing is individual — senior obstetric decision.",
      items: [
        "Priority: 1 — manage as inpatient; timing depends on severity and gestation",
        "Refer to GTG63 (Antepartum Haemorrhage) for full management",
        "Senior obstetrician to agree mode and timing of birth",
      ],
      next: "end",
    },

    "end": {
      type: "end",
      title: "Book IOL",
      text: "Document indication, priority, and agreed gestation in the notes.",
      items: [
        "Priority 1: aim to book within 24–48 hours",
        "Confirm woman understands the plan and has a contact number",
        "Ensure booking is reflected in the maternity record",
      ],
    },

  },
};

