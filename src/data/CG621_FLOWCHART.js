// CG621 — Medical Management of Miscarriage
// Two flowcharts: Outpatient pathway and Inpatient pathway (>10 weeks)

export const CG621_OUTPATIENT_FLOWCHART = {
  id: "CG621_OUTPATIENT",
  title: "Outpatient Medical Management",
  subtitle: "CG621 · Medical Management of Miscarriage",
  startId: "counsel",
  nodes: {

    "counsel": {
      type: "action",
      title: "Counselling & Consent",
      text: "Before prescribing, ensure the patient is fully informed and has consented.",
      items: [
        "Explain advantages, disadvantages, and alternatives (expectant / surgical)",
        "Provide information leaflets on miscarriage and medical management",
        "Give the patient time to decide; offer to return on another date",
        "Obtain e-consent — must include: failure rate (~17%), unlicensed use of Mifepristone and Misoprostol, side effects (nausea, diarrhoea, pain, heavy bleeding), and possible need for surgical management",
        "Document temperature, blood pressure, pulse",
      ],
      next: "ci-check",
    },

    "ci-check": {
      type: "decision",
      title: "Any contraindications?",
      text: "Check for contraindications to medical management.",
      options: [
        { label: "Contraindication present:", sublabel: "Haemodynamically unstable · Hb <10g/dl · Fever >38°C · Suspected molar pregnancy · Anticoagulation · Clotting disorder · IUCD in-situ · Porphyria · Mitral stenosis · Severe asthma", next: "end-ci" },
        { label: "No contraindications", sublabel: "Safe to proceed", next: "bloods" },
      ],
    },

    "end-ci": {
      type: "end",
      title: "Contraindication — Not Suitable",
      text: "Medical management is not appropriate for this patient.",
      items: [
        "Discuss alternative management options",
        "Expectant management: wait for natural passage (may take several weeks)",
        "Surgical management (SMM): can be offered under GA or local anaesthetic",
        "Document reason for exclusion from medical management",
        "Refer to consultant if uncertain",
      ],
    },

    "bloods": {
      type: "action",
      title: "Bloods",
      text: "Take FBC and Group & Save before prescribing.",
      items: [
        "FBC: confirm Hb >100g/L (10g/dl) before proceeding",
        "Group & Save: check blood group for Anti-D decision",
        "If Hb <100g/L: defer medical management; discuss with consultant",
      ],
      next: "anti-d",
    },

    "anti-d": {
      type: "decision",
      title: "Anti-D required?",
      text: "Gestation and blood group determine Anti-D need.",
      options: [
        { label: "< 12 weeks gestation", sublabel: "Anti-D NOT required regardless of blood group", next: "dispense" },
        { label: "≥ 12 weeks OR gestation uncertain", sublabel: "Check blood group", next: "rh-check" },
      ],
    },

    "rh-check": {
      type: "decision",
      title: "Rhesus negative?",
      text: "Check blood group result from G&S.",
      options: [
        { label: "Yes — Rh negative", sublabel: "Anti-D immunoglobulin required", next: "give-anti-d" },
        { label: "No — Rh positive", sublabel: "Anti-D not needed", next: "dispense" },
      ],
    },

    "give-anti-d": {
      type: "action",
      title: "Administer Anti-D",
      text: "Give Anti-D immunoglobulin before discharge.",
      items: [
        "Administer Anti-D immunoglobulin per local dose protocol",
        "Document in notes and on drug chart",
        "Proceed to dispensing medications",
      ],
      next: "dispense",
    },

    "dispense": {
      type: "action",
      title: "Dispense Medications",
      text: "Prescribe and dispense the pre-arranged medical management pack.",
      items: [
        "Mifepristone 200mg PO — take orally NOW in clinic",
        "Misoprostol 800mcg PV — take at HOME 48 hours after Mifepristone",
        "(600mcg if incomplete miscarriage)",
        "Codeine for analgesia",
        "Pregnancy test (for Day 21 self-check)",
        "Counsel on vaginal insertion of Misoprostol, expected bleeding, analgesia",
        "Return any unused Misoprostol to any pharmacy (it is an abortifacient)",
      ],
      next: "day7",
    },

    "day7": {
      type: "action",
      title: "Day 7–9 Nursing Call",
      text: "A nurse will call the patient 7–9 days after starting treatment.",
      items: [
        "Ask: Has bleeding started? Have products been passed?",
        "Ask about current symptoms and wellbeing",
        "Advise when to call EPU: prolonged heavy bleeding (>3 days), haemorrhage, haemodynamic instability, signs of infection, positive UPT at 3 weeks",
      ],
      next: "poc-assessment",
    },

    "poc-assessment": {
      type: "decision",
      title: "History of complete miscarriage?",
      text: "Based on the nursing call — has the patient passed products of conception?",
      options: [
        { label: "Yes — likely complete", sublabel: "Heavy bleeding that has since reduced significantly", next: "end-complete" },
        { label: "No — unclear or incomplete", sublabel: "No POC passed or bleeding has not settled", next: "second-dose-choice" },
      ],
    },

    "end-complete": {
      type: "end",
      title: "Likely Complete Miscarriage",
      text: "Reassure the patient. No routine follow-up appointment needed.",
      items: [
        "Advise pregnancy test in 3 weeks",
        "Call EPU if pregnancy test positive at 3 weeks",
        "Call EPU if symptoms develop: heavy bleeding, pain, fever",
        "Routine follow-up appointment not required unless clinical concern",
        "Emotional support and bereavement resources as needed",
      ],
    },

    "second-dose-choice": {
      type: "decision",
      title: "Patient's preference",
      text: "No clear history of complete miscarriage. Discuss options with patient.",
      options: [
        { label: "Repeat Misoprostol", sublabel: "Second dose 800mcg PV — arrange attendance", next: "repeat-miso" },
        { label: "Surgical management", sublabel: "Patient prefers surgical evacuation", next: "end-surgical" },
        { label: "Expectant management", sublabel: "Wait and watch", next: "end-expectant" },
      ],
    },

    "repeat-miso": {
      type: "action",
      title: "Repeat Misoprostol 800mcg PV",
      text: "Second dose of Misoprostol — arrange attendance as soon as possible.",
      items: [
        "Administer 800mcg Misoprostol vaginally in clinic",
        "Repeat nursing call or review after 7 days",
        "If still no history of complete miscarriage: refer for surgical management",
      ],
      next: "end-repeat-review",
    },

    "end-repeat-review": {
      type: "end",
      title: "Post-Repeat Dose Review",
      text: "Review outcome after second Misoprostol dose.",
      items: [
        "If bleeding settled and UPT negative at 3 weeks: complete miscarriage",
        "If UPT positive at 3 weeks: refer to EPU for USS",
        "If ongoing bleeding or no POC: offer surgical management (SMM/ERPC)",
        "Document outcome and arrange appropriate follow-up",
      ],
    },

    "end-surgical": {
      type: "end",
      title: "Surgical Management",
      text: "Surgical Management of Miscarriage (SMM) / ERPC.",
      items: [
        "Refer for surgical management (SMM — suction or sharp curettage)",
        "Can be performed under general anaesthesia or local anaesthetic",
        "Discuss risks: infection, haemorrhage, Asherman syndrome (rare)",
        "Ensure G&S is current",
      ],
    },

    "end-expectant": {
      type: "end",
      title: "Expectant Management",
      text: "Natural passage of products without intervention.",
      items: [
        "Advise: most complete within 1–2 weeks",
        "Repeat UPT in 3 weeks",
        "Return to EPU if: heavy haemorrhage, signs of infection, UPT positive at 3 weeks, no bleeding within 2 weeks",
      ],
    },

  },
};

// ─────────────────────────────────────────────────────────────────────────────

export const CG621_INPATIENT_FLOWCHART = {
  id: "CG621_INPATIENT",
  title: "Inpatient Medical Management (>10 weeks)",
  subtitle: "CG621 · Sonning Ward Admission",
  startId: "inpatient-indication",
  nodes: {

    "inpatient-indication": {
      type: "action",
      title: "Inpatient Management Indications",
      text: "Inpatient pathway is recommended in the following circumstances.",
      items: [
        "Gestation >10 weeks (CRL >31mm) — higher risk of heavy bleeding",
        "Patient requests inpatient management",
        "Book a side room on Sonning Ward for privacy",
        "Written consent obtained",
        "Anti-D if Rh negative >12 weeks (see outpatient flowchart for details)",
        "FBC + Group & Save",
      ],
      next: "pre-admission",
    },

    "pre-admission": {
      type: "action",
      title: "Pre-Admission (48 hours before)",
      text: "Patient takes Mifepristone 48 hours before the planned admission date.",
      items: [
        "Dispense Mifepristone 200mg PO — patient takes it at home",
        "Confirm admission date and time (Sonning Ward)",
        "Provide written instructions and emergency contact numbers",
        "Advise: some bleeding may start before admission — expected and normal",
      ],
      next: "admission",
    },

    "admission": {
      type: "action",
      title: "Admission to Sonning Ward",
      text: "Patient admitted 36–48 hours after taking Mifepristone.",
      items: [
        "MEWS observations on admission and every 4 hours",
        "Confirm no contraindications have developed since pre-assessment",
        "Administer Misoprostol 800mcg PV — by the patient, nurse or duty doctor",
        "Start fluid balance chart",
        "Adequate analgesia prescribed (paracetamol ± diclofenac ± codeine)",
      ],
      next: "three-hour-check",
    },

    "three-hour-check": {
      type: "decision",
      title: "Products of conception (POC) after 3 hours?",
      text: "Have products of conception been passed 3 hours after first Misoprostol dose?",
      options: [
        { label: "Yes — POC passed", sublabel: "Confirm observation stability", next: "poc-passed" },
        { label: "No — POC not passed", sublabel: "Administer second dose", next: "second-miso" },
      ],
    },

    "poc-passed": {
      type: "action",
      title: "Products Passed — Check Stability",
      text: "Confirm the patient is stable before discharge.",
      items: [
        "MEWS observations: all within normal limits",
        "Bleeding: not haemorrhagic (soaking ≤1 pad/hour)",
        "Patient comfortable with adequate analgesia",
        "Pain settled or well controlled",
      ],
      next: "end-discharge",
    },

    "end-discharge": {
      type: "end",
      title: "Discharge from Sonning Ward",
      text: "Patient stable after passing products of conception.",
      items: [
        "Discharge when observations stable, bleeding not heavy, POC confirmed passed",
        "Prescribe analgesia for home (paracetamol ± ibuprofen ± codeine)",
        "Advise: pregnancy test in 3 weeks; call EPU if positive",
        "Provide emergency contact and leaflets on warning signs",
        "If third consecutive miscarriage: refer for recurrent miscarriage investigations",
      ],
    },

    "second-miso": {
      type: "action",
      title: "Second Misoprostol 800mcg PV",
      text: "No POC passed after 3 hours — administer second dose.",
      items: [
        "Administer further Misoprostol 800mcg PV",
        "Continue MEWS 4-hourly",
        "Ensure adequate analgesia",
        "Reassess in 3 hours",
      ],
      next: "after-second-dose",
    },

    "after-second-dose": {
      type: "decision",
      title: "POC passed after second dose?",
      text: "Have products of conception been passed following the second Misoprostol dose?",
      options: [
        { label: "Yes — POC now passed", sublabel: "Assess for discharge", next: "poc-passed" },
        { label: "No — POC not passed", sublabel: "Assess symptoms", next: "symptoms-check" },
      ],
    },

    "symptoms-check": {
      type: "decision",
      title: "Symptoms settled?",
      text: "Has pain and bleeding settled despite no POC?",
      options: [
        { label: "Yes — pain and bleeding settled", sublabel: "Safe to discharge with USS follow-up", next: "home-with-uss" },
        { label: "No — ongoing pain/heavy bleeding", sublabel: "Medical management failure", next: "end-surgical-inpatient" },
      ],
    },

    "home-with-uss": {
      type: "action",
      title: "Home with USS Follow-up",
      text: "Patient may go home if settled, even without confirmed POC.",
      items: [
        "Discharge patient",
        "Arrange USS at EPU within 48 hours",
        "Advise: some products may still be retained — scan will clarify",
        "Emergency contact if haemorrhage, signs of infection, or clinical deterioration",
      ],
      next: "uss-result",
    },

    "uss-result": {
      type: "decision",
      title: "USS result",
      text: "What does the ultrasound at EPU within 48 hours show?",
      options: [
        { label: "Products retained", sublabel: "Incomplete/failed medical management", next: "end-surgical-inpatient" },
        { label: "Empty uterus or likely complete", sublabel: "Medical management successful", next: "end-complete-inpatient" },
      ],
    },

    "end-complete-inpatient": {
      type: "end",
      title: "Medical Management Successful",
      text: "Uterus empty on USS — medical management complete.",
      items: [
        "Discharge from EPU care",
        "Pregnancy test in 3 weeks; call EPU if positive",
        "Provide bereavement support and leaflets",
        "If third consecutive miscarriage: refer for recurrent miscarriage investigations",
      ],
    },

    "end-surgical-inpatient": {
      type: "end",
      title: "Medical Management Failed — Surgical",
      text: "Retained products of conception despite two doses of Misoprostol.",
      items: [
        "Offer surgical management: SMM (suction) or ERPC",
        "Explain: medical management failure rate up to 17%",
        "Ensure G&S current; confirm consent",
        "Can be performed under GA or local anaesthetic",
        "If third consecutive miscarriage: refer for recurrent miscarriage investigations after SMM",
      ],
    },

  },
};
