// BASHH PID 2019 — Pelvic Inflammatory Disease flowcharts
// Source: BASHH PID Guidelines 2018 (updated 2019)
// https://www.bashh.org/resources/6/pid_2019/

export const BASHH_PID_TRIAGE_FLOWCHART = {
  id: "BASHH_PID_TRIAGE",
  title: "PID Assessment & Triage",
  subtitle: "BASHH PID 2019 · Diagnosis & Severity",
  startId: "assess",
  nodes: {

    "assess": {
      type: "action",
      title: "Clinical Assessment for PID",
      text: "PID is a clinical diagnosis. There is no single test — diagnosis is based on minimum clinical criteria in a woman with pelvic pain. Low threshold for treatment: the risks of untreated PID exceed risks of unnecessary antibiotics.",
      items: [
        "History: onset and character of lower abdominal/pelvic pain, dyspareunia, vaginal discharge, fever",
        "Sexual history: new partner, STI risk, lack of barrier contraception",
        "Examine: temperature, lower abdominal tenderness (± guarding), speculum (discharge, cervicitis)",
        "Bimanual: uterine tenderness, adnexal tenderness, cervical motion tenderness (CMT)",
        "Baseline observations: temperature, pulse, BP",
      ],
      next: "criteria",
    },

    "criteria": {
      type: "decision",
      title: "Minimum Diagnostic Criteria Met?",
      text: "BASHH minimum criteria: lower abdominal/pelvic pain AND at least one of uterine tenderness, adnexal tenderness, or cervical motion tenderness on bimanual examination.",
      options: [
        { label: "Yes — criteria met", sublabel: "Proceed to severity assessment and treatment", next: "investigations" },
        { label: "No — criteria not met", sublabel: "Consider alternative diagnoses", next: "alt_dx" },
      ],
    },

    "alt_dx": {
      type: "end",
      title: "Consider Alternative Diagnoses",
      text: "If minimum PID criteria are not met, consider alternative causes of pelvic pain before commencing antibiotics.",
      items: [
        "Ectopic pregnancy — urgent urine/serum βhCG",
        "Appendicitis — right iliac fossa pain, anorexia, raised WBC",
        "Ovarian cyst complication (torsion, rupture) — USS",
        "Endometriosis — cyclical pain, dyspareunia",
        "Urinary tract infection — MSU, urinalysis",
        "Functional or musculoskeletal pain",
        "If any doubt about surgical emergency: urgent surgical review",
      ],
    },

    "investigations": {
      type: "action",
      title: "Investigations",
      text: "Perform baseline investigations but do not delay treatment for results. A negative NAAT does not exclude PID.",
      items: [
        "NAAT (endocervical/vulvovaginal swab): chlamydia and gonorrhoea",
        "High vaginal swab: microscopy and culture",
        "Blood tests: FBC, CRP, ESR, LFTs, U&E",
        "Urine βhCG — exclude ectopic or intrauterine pregnancy",
        "Urinalysis and MSU if urinary symptoms",
        "Pelvic USS: if TOA suspected, severe pain, or diagnosis uncertain",
      ],
      next: "severity",
    },

    "severity": {
      type: "decision",
      title: "Severity Assessment — Features of Severe PID?",
      text: "Assess for features that require inpatient management. Most PID is mild to moderate and can be treated as an outpatient.",
      options: [
        { label: "Mild to moderate — outpatient suitable", sublabel: "No severe features; tolerating orals; reliable follow-up", next: "outpatient" },
        { label: "Severe features — admit", sublabel: "Any one of: high fever, vomiting, TOA, peritonism, surgical emergency not excluded", next: "inpatient_criteria" },
      ],
    },

    "inpatient_criteria": {
      type: "alert",
      title: "Indications for Inpatient Admission",
      text: "Consider inpatient IV treatment if any of the following are present:",
      items: [
        "Temperature ≥38°C with systemic upset",
        "Unable to tolerate oral antibiotics (nausea, vomiting)",
        "Tubo-ovarian abscess (TOA) on USS or clinical suspicion",
        "Peritonism or signs suggesting surgical emergency (appendicitis, ruptured ectopic)",
        "Failure to improve on 72-hour oral outpatient treatment",
        "Pregnancy",
        "Immunocompromised patient",
        "Diagnostic uncertainty requiring observation or further investigation",
      ],
      next: "inpatient",
    },

    "outpatient": {
      type: "end",
      title: "Outpatient Management",
      text: "Treat as an outpatient with oral/IM antibiotics. Mandatory 72-hour review.",
      items: [
        "Commence outpatient antibiotic regimen (BASHH first-line: see Antibiotic Regimen flowchart)",
        "Advise abstinence from sexual intercourse until patient and all partners treated and asymptomatic",
        "Discuss IUD if in situ — removal is not mandatory but consider if no improvement by 72 hr",
        "Give written information on PID, treatment, and follow-up",
        "Arrange 72-hour review — this is MANDATORY",
        "Sexual health follow-up for full STI screen and partner notification",
        "If gonorrhoea confirmed: contact trace; test of cure at 72 hr",
      ],
    },

    "inpatient": {
      type: "end",
      title: "Inpatient Management",
      text: "Admit for IV antibiotics and monitoring. Switch to oral antibiotics once clinically improved.",
      items: [
        "IV antibiotics — commence promptly (see Antibiotic Regimen flowchart)",
        "Continue IV until clinical improvement: temperature <37.5°C, pain settling, tolerating diet",
        "Pelvic USS if not already done — to assess for TOA",
        "TOA: IV antibiotics alone if <5 cm; drainage (USS or surgical) if ≥5 cm or no response at 72 hr",
        "Daily clinical review — reassess response to treatment",
        "Gynaecology and GUM joint review if gonorrhoea suspected or confirmed",
        "Sexual health review before discharge: partner notification and test of cure arrangements",
        "Repeat USS at follow-up if TOA identified",
      ],
    },

  },
};

export const BASHH_PID_ANTIBIOTICS_FLOWCHART = {
  id: "BASHH_PID_ANTIBIOTICS",
  title: "PID Antibiotic Regimen",
  subtitle: "BASHH PID 2019 · Antibiotic Selection",
  startId: "setting",
  nodes: {

    "setting": {
      type: "decision",
      title: "Treatment Setting",
      text: "Select antibiotic regimen based on clinical severity and whether inpatient or outpatient treatment is appropriate.",
      options: [
        { label: "Outpatient — mild to moderate PID", sublabel: "Tolerating orals; no severe features; reliable follow-up", next: "outpatient_regimen" },
        { label: "Inpatient — severe PID", sublabel: "Fever, vomiting, TOA, peritonism, or failed outpatient treatment", next: "inpatient_regimen" },
      ],
    },

    "outpatient_regimen": {
      type: "action",
      title: "Outpatient Antibiotic Regimen (BASHH First-Line)",
      text: "BASHH 2019 first-line outpatient regimen. Covers chlamydia, gonorrhoea, anaerobes, and aerobic gram-negative rods. Ceftriaxone dose updated to 1g IM per 2019 revision.",
      items: [
        "Ceftriaxone 1g IM — single dose (BASHH 2019 revision: 1g not 500mg)",
        "PLUS doxycycline 100 mg orally twice daily for 14 days",
        "PLUS metronidazole 400 mg orally twice daily for 14 days",
        "Note: if gonorrhoea confirmed, discuss with GUM — test of cure required at 72 hr",
        "Note: moxifloxacin 400mg OD for 14 days is an alternative if gonorrhoea excluded (MHRA 2019: fluoroquinolone warning — use only if no alternative)",
        "Alternative if ceftriaxone unavailable: ofloxacin 400mg BD + metronidazole 500mg BD for 14 days (avoid if gonorrhoea risk)",
      ],
      next: "iud_check",
    },

    "iud_check": {
      type: "decision",
      title: "IUD / IUS in Situ?",
      text: "An IUD or IUS in situ does not mandate immediate removal. However, removal may improve outcomes if there is no clinical improvement within 72 hours.",
      options: [
        { label: "No IUD / IUS", sublabel: "Proceed to 72-hour review", next: "review_72h" },
        { label: "Yes — IUD / IUS present", sublabel: "Discuss removal; advise on contraception if removed", next: "iud_decision" },
      ],
    },

    "iud_decision": {
      type: "action",
      title: "IUD — Discuss and Document Decision",
      text: "Evidence for routine IUD removal is limited. Removal may improve short-term symptoms.",
      items: [
        "Discuss risks and benefits of IUD removal with patient",
        "If patient declines removal: ensure 72-hour review is arranged and advise to return if worsening",
        "If IUD removed: provide bridging contraception (emergency contraception if recent UPSI)",
        "Do not remove IUD in the first 72 hours unless clinical deterioration",
        "If no improvement at 72-hour review: strongly consider removal",
      ],
      next: "review_72h",
    },

    "review_72h": {
      type: "action",
      title: "72-Hour Review — MANDATORY",
      text: "All outpatients MUST be reviewed at 72 hours. This is a clinical safety requirement.",
      items: [
        "Reassess symptoms: pain, fever, vaginal discharge",
        "Repeat bimanual examination: tenderness improving?",
        "Review investigation results: NAAT, swabs, bloods",
        "Assess antibiotic tolerability and compliance",
        "If gonorrhoea confirmed: test of cure swab at this appointment",
      ],
      next: "review_response",
    },

    "review_response": {
      type: "decision",
      title: "Clinical Improvement at 72 Hours?",
      text: "Assess response to outpatient treatment. Failure to improve requires reassessment and possible admission.",
      options: [
        { label: "Improving — continue orals", sublabel: "Pain improving; tolerating antibiotics; afebrile", next: "outpatient_end" },
        { label: "Not improving / worsening", sublabel: "Reassess diagnosis; consider admission and IV treatment", next: "admit" },
      ],
    },

    "outpatient_end": {
      type: "end",
      title: "Continue Outpatient Treatment to Completion",
      text: "Continue antibiotic course to 14 days. Arrange sexual health follow-up.",
      items: [
        "Complete full 14-day antibiotic course",
        "Abstain from sexual intercourse until patient and all partners are fully treated and asymptomatic",
        "Partner notification: all sexual contacts within 6 months should be tested and treated",
        "Advise re: future PID risk and consequences (chronic pelvic pain, ectopic, infertility)",
        "Consider future contraception — long-acting reversible contraception (LARC) discussed",
        "Routine sexual health screen at 4–6 weeks follow-up",
      ],
    },

    "admit": {
      type: "alert",
      title: "Admit — Escalate to Inpatient IV Treatment",
      text: "Failure to improve on outpatient treatment requires inpatient admission and reassessment.",
      items: [
        "Admit to gynaecology ward",
        "Repeat pelvic USS — exclude TOA",
        "Send bloods: FBC, CRP, cultures",
        "Review diagnosis — ensure no surgical emergency",
        "Escalate to IV antibiotic regimen",
      ],
      next: "inpatient_regimen",
    },

    "inpatient_regimen": {
      type: "action",
      title: "Inpatient IV Antibiotic Regimen",
      text: "Two IV regimens are recommended by BASHH 2019. Choice depends on local resistance patterns and allergy history.",
      items: [
        "REGIMEN A (preferred): IV cefoxitin 2g every 8 hours + oral/IV doxycycline 100mg every 12 hours",
        "Continue Regimen A until ≥24 hours clinical improvement → step down",
        "REGIMEN B (alternative): IV clindamycin 900mg every 8 hours + IV gentamicin (2 mg/kg loading, then 1.5 mg/kg every 8 hours)",
        "Continue Regimen B until ≥24 hours clinical improvement → step down",
        "If gonorrhoea confirmed or high risk: seek GUM/microbiology advice on regimen modification",
        "Note: moxifloxacin 400mg OD IV/oral is an option but MHRA 2019 fluoroquinolone warning applies",
      ],
      next: "step_down",
    },

    "step_down": {
      type: "action",
      title: "Step-Down to Oral Antibiotics",
      text: "Step down from IV to oral once clinically improved: afebrile, pain improving, tolerating diet.",
      items: [
        "After Regimen A: oral doxycycline 100mg twice daily + oral metronidazole 400mg three times daily to complete 14 days total",
        "After Regimen B: oral clindamycin 450mg four times daily for 14 days, OR oral doxycycline 100mg twice daily + metronidazole 400mg three times daily for 14 days",
        "Ensure 14-day total course counting IV days",
        "Arrange pelvic USS follow-up if TOA was identified",
        "Sexual health review before discharge",
      ],
      next: "inpatient_end",
    },

    "inpatient_end": {
      type: "end",
      title: "Discharge Planning",
      text: "Ensure complete follow-up arrangements before discharge.",
      items: [
        "Complete oral antibiotic course to 14 days total",
        "Abstain from sexual intercourse until patient and all partners are fully treated and asymptomatic",
        "Partner notification: all contacts within 6 months must be tested and treated",
        "Repeat USS arranged if TOA was identified (4–6 weeks)",
        "Written information: PID complications, future fertility, signs of recurrence",
        "GUM / sexual health follow-up in 4–6 weeks",
        "Advise: 1 in 5 women with PID will have a recurrence within 2 years",
      ],
    },

  },
};
