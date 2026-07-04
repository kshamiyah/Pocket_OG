// NG88 — Heavy Menstrual Bleeding (NICE NG88, updated September 2023)
// Flowchart 1: Initial Assessment & Primary Care Pathway
// Flowchart 2: Pharmacological Treatment Selection
// Flowchart 3: Surgical Options Decision
// Flowchart 4: Fibroid Management Pathway
// Flowchart 5: Secondary Care Pathway

export const NG88_ASSESSMENT_FLOWCHART = {
  id: "NG88_ASSESSMENT",
  title: "HMB: Initial Assessment & Primary Care Pathway",
  subtitle: "NG88: Heavy Menstrual Bleeding",
  startId: "present",
  nodes: {

    "present": {
      type: "action",
      title: "Woman Presents with Heavy Menstrual Bleeding",
      text: "HMB = excessive menstrual blood loss interfering with quality of life. Clinical diagnosis — does not require objective measurement. Assess impact on work, social life, and daily activities.",
      items: [
        "Record: cycle length, duration, volume, clots, flooding",
        "Ask about associated symptoms: dysmenorrhoea, IMB, PCB, pelvic pressure",
        "Assess quality-of-life impact on a scale meaningful to the woman",
        "Note desire for future fertility — critical for treatment planning",
      ],
      next: "red-flags",
    },

    "red-flags": {
      type: "decision",
      title: "Are there red flag features requiring urgent action?",
      text: "Screen for features that require urgent referral or investigation before routine management.",
      options: [
        { label: "Postmenopausal bleeding (any bleeding >12 months after last period)", sublabel: "Urgent suspected cancer (2WW) referral required", next: "urgent-referral" },
        { label: "Persistent intermenstrual or postcoital bleeding (any age)", sublabel: "Requires investigation, refer or investigate", next: "investigate-imb" },
        { label: "HMB only, no red flag features", sublabel: "Proceed to standard assessment", next: "examination" },
      ],
    },

    "urgent-referral": {
      type: "alert",
      title: "Urgent Suspected Cancer Referral (2-Week Wait)",
      text: "Postmenopausal bleeding in a woman aged ≥55 years (or clinically menopausal) requires a 2WW gynaecology referral to exclude endometrial and cervical cancer.",
      items: [
        "Refer under 2-week wait if: unexplained vaginal bleeding after menopause",
        "Consider urgent referral: endometrial thickening >4 mm on USS + PMB",
        "Ensure up-to-date cervical smear",
        "Do not delay referral to trial treatment",
      ],
      next: "end-urgent",
    },

    "end-urgent": {
      type: "end",
      title: "Urgent Referral Made",
      text: "2WW gynaecology referral. Inform patient of referral, expected timescale, and what to expect at their appointment.",
      items: [
        "Document reasoning for urgent referral in notes",
        "Treat iron deficiency anaemia if present while awaiting appointment",
        "Safety net: advise patient to re-attend if symptoms worsen",
      ],
    },

    "investigate-imb": {
      type: "action",
      title: "Persistent IMB / PCB: Investigate Before Treating",
      text: "Intermenstrual bleeding (IMB) and postcoital bleeding (PCB) may indicate endometrial or cervical pathology and should not be treated empirically without investigation.",
      items: [
        "Speculum examination: assess cervix, check for erosion, polyps, contact bleeding",
        "Ensure cervical smear is up to date; refer for colposcopy if smear abnormal or cervix suspicious",
        "Pelvic USS to assess uterine cavity and endometrium",
        "Consider hysteroscopy + endometrial biopsy if USS abnormal or IMB persists",
        "Refer to gynaecology if no obvious cause found or USS abnormal",
      ],
      next: "end-imb",
    },

    "end-imb": {
      type: "end",
      title: "IMB/PCB Investigation Pathway",
      text: "Investigations and/or referral to gynaecology as appropriate. Do not treat HMB empirically if IMB/PCB is the primary concern.",
    },

    "examination": {
      type: "action",
      title: "Clinical Assessment",
      text: "History and examination to characterise HMB and identify any underlying structural pathology.",
      items: [
        "BMI (risk factor for endometrial cancer if >30)",
        "Abdominal palpation: palpable uterus = significant fibroids → refer",
        "Pelvic examination if appropriate: uterine size, mobility, tenderness, adnexal mass",
        "FBC: check haemoglobin — treat iron deficiency anaemia concurrently",
        "Coagulation screen (VWF, FVIII) if: HMB since menarche, family/personal bleeding history",
      ],
      next: "structural-suspected",
    },

    "structural-suspected": {
      type: "decision",
      title: "Is structural pathology suspected or confirmed?",
      text: "Clinical features suggesting structural pathology: palpable uterus, bulk symptoms (urinary frequency, pressure), severe dysmenorrhoea, treatment failure. Check pelvic USS findings if available.",
      options: [
        { label: "Yes, uterus palpable, structural pathology suspected, or USS abnormal", sublabel: "USS if not done; refer to gynaecology if structural pathology confirmed", next: "structural-path" },
        { label: "No, no structural pathology suspected; HMB without identifiable cause", sublabel: "Proceed to pharmacological treatment in primary care", next: "primary-care-tx" },
      ],
    },

    "structural-path": {
      type: "action",
      title: "Structural Pathology: USS and Consider Referral",
      text: "Pelvic USS (transvaginal preferred) to characterise pathology. Management depends on findings.",
      items: [
        "Fibroids <3 cm, not distorting cavity: may be managed in primary care with LNG-IUS or pharmacological options",
        "Fibroids ≥3 cm OR distorting cavity: refer to gynaecology",
        "Endometrial thickening / polyp: refer to gynaecology for hysteroscopy ± biopsy",
        "Adenomyosis suspected: trial LNG-IUS or refer",
        "Abnormal ovarian pathology: urgent review / urgent USS",
      ],
      next: "refer-gynae",
    },

    "refer-gynae": {
      type: "end",
      title: "Refer to Gynaecology",
      text: "Refer to secondary care gynaecology. Manage iron deficiency anaemia in primary care while awaiting appointment.",
      items: [
        "Include USS results, FBC, current medications in referral",
        "Start iron replacement if anaemic",
        "Trial tranexamic acid or NSAID for symptom relief while awaiting referral",
        "Document fertility wishes in referral",
      ],
    },

    "primary-care-tx": {
      type: "action",
      title: "Offer Pharmacological Treatment in Primary Care",
      text: "No structural pathology identified (or fibroids <3 cm not distorting cavity). Offer treatments in the following sequence.",
      items: [
        "First-line: LNG-IUS (Mirena) — most effective; also provides contraception",
        "If LNG-IUS declined/contraindicated: tranexamic acid, NSAIDs, CHC, norethisterone",
        "Treat iron deficiency anaemia concurrently",
        "Review efficacy after 3–6 months of treatment",
      ],
      next: "treatment-response",
    },

    "treatment-response": {
      type: "decision",
      title: "Response to Primary Care Treatment?",
      text: "Assess after 3–6 months of appropriate treatment.",
      options: [
        { label: "Satisfactory response, symptoms controlled, QoL improved", sublabel: "Continue treatment; annual review", next: "continue-tx" },
        { label: "Inadequate response after ≥2 pharmacological options tried", sublabel: "Refer to gynaecology", next: "refer-failed-tx" },
      ],
    },

    "continue-tx": {
      type: "end",
      title: "Continue Treatment: Annual Review",
      text: "Continue effective treatment. Recheck FBC if anaemia was present. Annual review or sooner if symptoms change.",
      items: [
        "LNG-IUS: effective for up to 5 years (check position at annual smear if applicable)",
        "Reassess endometrial biopsy indications if ≥45 years or risk factors develop",
        "Advise patient to re-present if symptoms change, IMB/PCB develops, or new symptoms",
      ],
    },

    "refer-failed-tx": {
      type: "end",
      title: "Refer to Gynaecology: Treatment Failure",
      text: "Refer to secondary care with details of treatments tried, duration, compliance, and investigations performed.",
      items: [
        "Include: FBC results, USS if performed, treatments tried and for how long",
        "Consider offering USS before referral if not yet done",
        "Continue iron replacement; consider bridging pharmacological treatment while awaiting appointment",
        "Discuss surgical options may be considered at secondary care appointment",
      ],
    },
  },
};


export const NG88_TREATMENT_FLOWCHART = {
  id: "NG88_TREATMENT",
  title: "HMB: Pharmacological Treatment Selection",
  subtitle: "NG88: No structural pathology / Fibroids <3 cm",
  startId: "start",
  nodes: {

    "start": {
      type: "action",
      title: "HMB: No Structural Pathology Identified",
      text: "No uterine cavity distortion, no significant structural abnormality. Offer pharmacological treatment in the following sequence.",
      items: [
        "Confirm: future fertility desires?",
        "Confirm: contraception desired or acceptable?",
        "Check: any contraindications to hormonal treatment?",
        "Treat iron deficiency anaemia concurrently",
      ],
      next: "lng-ius-suitable",
    },

    "lng-ius-suitable": {
      type: "decision",
      title: "Is LNG-IUS acceptable and suitable?",
      text: "LNG-IUS (e.g. Mirena 52 mg) is the most effective pharmacological treatment for HMB. Offer as first-line unless contraindicated or declined.",
      options: [
        { label: "Yes, woman accepts LNG-IUS; no contraindications", sublabel: "Offer LNG-IUS as first-line", next: "offer-lng-ius" },
        { label: "No, woman declines, or contraindicated (current breast cancer, distorted cavity, active PID)", sublabel: "Offer non-LNG-IUS options", next: "non-lng" },
      ],
    },

    "offer-lng-ius": {
      type: "action",
      title: "LNG-IUS (Mirena 52 mg): First-Line",
      text: "Levonorgestrel intrauterine system. Reduces blood loss by 71–95%. Approximately 50% of users achieve amenorrhoea within 12 months.",
      items: [
        "Insert at any time in menstrual cycle; can be inserted immediately post-partum or post-abortion",
        "Irregular spotting very common in first 3–6 months — counsel about this",
        "Contraception: >99.8% efficacy; fertility returns rapidly after removal",
        "Systemic progestogen side effects occur but less than with pills (local delivery)",
        "Review at 3–6 months — irregular bleeding usually settles",
        "Duration: up to 5 years; re-insert at 5 years if ongoing HMB",
      ],
      next: "lng-review",
    },

    "lng-review": {
      type: "decision",
      title: "LNG-IUS response at 3–6 months?",
      text: "Irregular spotting is expected and usually settles. Assess HMB improvement.",
      options: [
        { label: "Good response: HMB improved; spotting reducing or settled", sublabel: "Continue; review at 12 months", next: "lng-continue" },
        { label: "Inadequate response: HMB persists; or LNG-IUS expelled / not tolerated", sublabel: "Consider additional pharmacological options or refer", next: "lng-failed" },
      ],
    },

    "lng-continue": {
      type: "end",
      title: "Continue LNG-IUS",
      text: "Annual review. LNG-IUS is effective for up to 5 years. Re-insert at 5 years if still indicated.",
    },

    "lng-failed": {
      type: "end",
      title: "LNG-IUS Not Effective: Consider Referral",
      text: "If LNG-IUS fails: add tranexamic acid or NSAID during menstruation, or refer to gynaecology if symptoms remain uncontrolled.",
    },

    "non-lng": {
      type: "decision",
      title: "Does woman want contraception?",
      text: "Choice of non-IUS pharmacological agent depends on contraceptive need and hormone acceptability.",
      options: [
        { label: "Yes, wants contraception", sublabel: "Hormonal options with contraceptive benefit", next: "hormonal-contraception" },
        { label: "No, no contraception needed / prefers non-hormonal", sublabel: "Non-hormonal first; hormonal if needed", next: "non-hormonal" },
      ],
    },

    "hormonal-contraception": {
      type: "action",
      title: "Combined Hormonal Contraception (CHC) or Progestogen",
      text: "CHC (combined pill, patch, or vaginal ring) reduces blood loss by ~40–50% per cycle. Can be used back-to-back to reduce cycle frequency.",
      items: [
        "Combined pill: e.g. Microgynon, Rigevidon — take back-to-back to minimise number of bleeds per year",
        "Patch (Evra) or ring (NuvaRing/Kyleena) — alternatives with similar efficacy",
        "Check UKMEC categories before prescribing CHC",
        "Norethisterone 5 mg TDS day 5–26: reduces blood loss ~80%; not a contraceptive at this dose",
        "Injectable progestogen (Depo-Provera) or implant: also reduce HMB; variable pattern initially",
      ],
      next: "hormonal-review",
    },

    "non-hormonal": {
      type: "action",
      title: "Non-Hormonal Treatment Options",
      text: "Non-hormonal options for HMB when hormonal treatment is declined or contraindicated.",
      items: [
        "Tranexamic acid 1 g (2 × 500 mg) up to 4 times daily for duration of heavy bleeding only (max 4 days per cycle)",
        "Reduces blood loss by approximately 50%; does not affect ovulation or fertility",
        "NSAID (mefenamic acid 500 mg TDS or ibuprofen 400–600 mg TDS): reduces blood loss ~20–30%; also helps dysmenorrhoea",
        "Tranexamic acid + NSAID can be used together for additive effect",
        "Avoid tranexamic acid in women with history of thromboembolic disease",
        "Avoid NSAIDs in renal disease, peptic ulcer disease, NSAID-sensitive asthma",
      ],
      next: "hormonal-review",
    },

    "hormonal-review": {
      type: "decision",
      title: "Response to treatment at 3–6 months?",
      options: [
        { label: "Satisfactory, symptoms adequately controlled", sublabel: "Continue; annual review", next: "tx-continue" },
        { label: "Inadequate, symptoms persist after ≥2 options tried", sublabel: "Consider referral to gynaecology", next: "tx-refer" },
      ],
    },

    "tx-continue": {
      type: "end",
      title: "Continue Effective Treatment",
      text: "Annual review. Reassess at any change in symptoms, new IMB/PCB, or if approaching perimenopause.",
    },

    "tx-refer": {
      type: "end",
      title: "Refer to Gynaecology",
      text: "Treatment failure after ≥2 pharmacological options. Refer with full details of treatments tried, USS results, and fertility wishes. Surgical options will be discussed.",
    },
  },
};


export const NG88_SURGICAL_FLOWCHART = {
  id: "NG88_SURGICAL",
  title: "HMB: Surgical Treatment Decision",
  subtitle: "NG88: Pharmacological treatment failed or declined",
  startId: "start",
  nodes: {

    "start": {
      type: "action",
      title: "Surgical/Interventional Treatment for HMB",
      text: "Consider surgical options when: pharmacological treatment has failed, is contraindicated, or the woman prefers surgical management.",
      items: [
        "Confirm: does the woman wish to preserve fertility?",
        "Confirm: is there structural pathology (fibroids, polyps, adenomyosis)?",
        "Ensure appropriate pre-operative investigations: FBC, USS ± MRI",
        "Correct iron deficiency anaemia pre-operatively",
      ],
      next: "fertility-check",
    },

    "fertility-check": {
      type: "decision",
      title: "Does the woman wish to preserve fertility?",
      options: [
        { label: "Yes, wants future pregnancy / fertility preservation", sublabel: "Avoid ablation and hysterectomy", next: "fertility-preserve" },
        { label: "No, family complete or fertility not desired", sublabel: "All surgical options available", next: "structural-check" },
      ],
    },

    "fertility-preserve": {
      type: "action",
      title: "Fertility-Preserving Surgical Options",
      text: "Avoid endometrial ablation and hysterectomy. Options depend on underlying cause.",
      items: [
        "Hysteroscopic polypectomy: if endometrial polyps are the cause",
        "Hysteroscopic myomectomy: for submucosal fibroids (type 0–2)",
        "Laparoscopic or open myomectomy: for intramural/multiple fibroids not amenable to hysteroscopic approach",
        "UAE is NOT recommended for women wishing to preserve fertility — risk of ovarian failure and obstetric complications",
        "GnRH analogue pre-treatment: to shrink fibroids pre-operatively if large",
        "After myomectomy: advise 3–6 months before conceiving (uterine healing); mode of birth depends on depth of myomectomy",
      ],
      next: "end-fertility",
    },

    "end-fertility": {
      type: "end",
      title: "Fertility-Preserving Surgery",
      text: "Hysteroscopic or laparoscopic/open surgery as appropriate. Post-operative follow-up with gynaecology. Return to primary care for ongoing management.",
    },

    "structural-check": {
      type: "decision",
      title: "Is there significant structural pathology?",
      options: [
        { label: "Fibroids (significant / multiple / large)", sublabel: "See fibroid management pathway", next: "fibroids" },
        { label: "Polyps", sublabel: "Hysteroscopic polypectomy is first-line", next: "polyp" },
        { label: "No significant structural pathology / Adenomyosis", sublabel: "Ablation or hysterectomy based on preference", next: "no-structural" },
      ],
    },

    "polyp": {
      type: "end",
      title: "Hysteroscopic Polypectomy",
      text: "First-line surgical treatment for symptomatic endometrial polyps. Highly effective (>90% resolution of IMB/HMB). Can be performed in outpatient or day case setting.",
      items: [
        "Outpatient hysteroscopy: 2–3 mm hysteroscope; local anaesthetic optional; NSAID 30–60 min before",
        "Send all polyp tissue for histology",
        "Review at 6–8 weeks for symptom resolution",
        "If symptoms recur: consider repeat hysteroscopy, endometrial biopsy, LNG-IUS",
      ],
    },

    "fibroids": {
      type: "decision",
      title: "Fibroid characteristics?",
      options: [
        { label: "Submucosal (type 0–2), distorting cavity", sublabel: "Hysteroscopic myomectomy", next: "hyst-myomectomy" },
        { label: "Intramural / subserosal / multiple / large (>6 cm)", sublabel: "UAE, myomectomy, or hysterectomy", next: "fibroid-options" },
      ],
    },

    "hyst-myomectomy": {
      type: "end",
      title: "Hysteroscopic Myomectomy",
      text: "Surgical removal of submucosal fibroids via hysteroscope. Highly effective for HMB from cavity-distorting fibroids. Day case or short stay.",
      items: [
        "Type 0 (pedunculated): complete resection usually achievable in one procedure",
        "Type 1–2: may require staged procedure if large",
        "GnRH analogue pre-treatment for 3 months if anaemic or large fibroid",
        "Risk: uterine perforation (<1%), fluid overload (closed-loop monitoring required)",
        "Post-operative: review at 6–8 weeks",
      ],
    },

    "fibroid-options": {
      type: "decision",
      title: "Preferred approach for intramural/larger fibroids?",
      options: [
        { label: "Uterine preservation preferred: UAE or myomectomy", sublabel: "Discuss both options; inform about limitations", next: "uae-vs-myomectomy" },
        { label: "Hysterectomy preferred, definitive treatment", sublabel: "Counselling, pre-operative work-up", next: "hysterectomy" },
      ],
    },

    "uae-vs-myomectomy": {
      type: "action",
      title: "UAE vs Myomectomy: Shared Decision",
      text: "Both are effective uterine-preserving options. Discuss pros and cons of each.",
      items: [
        "UAE: radiological procedure; no surgery; effective for most fibroid types; shorter recovery than open myomectomy",
        "UAE NOT recommended if fertility desired — risk of premature ovarian failure",
        "Open/laparoscopic myomectomy: surgical; removes fibroids; may need repeat if recurrence; suitable regardless of fibroid type",
        "MRI pelvis required before UAE to map fibroid vascularity and anatomy",
        "Re-intervention rate over 5 years: UAE ~20%; myomectomy ~15%",
      ],
      next: "end-uae",
    },

    "end-uae": {
      type: "end",
      title: "UAE or Myomectomy Planned",
      text: "Proceed with chosen procedure after pre-operative assessment, anaemia correction, and appropriate consent.",
    },

    "no-structural": {
      type: "decision",
      title: "Ablation or Hysterectomy?",
      text: "For women with no significant structural pathology and family complete. Discuss both options fully.",
      options: [
        { label: "Endometrial ablation, prefers uterine preservation / quicker recovery", sublabel: "Second-generation device preferred", next: "ablation" },
        { label: "Hysterectomy, prefers definitive treatment / ablation failed", sublabel: "Discuss route and timing", next: "hysterectomy" },
      ],
    },

    "ablation": {
      type: "action",
      title: "Endometrial Ablation",
      text: "Destroys the endometrial lining using heat (NovaSure, ThermaChoice) or microwave energy. Second-generation (non-hysteroscopic) preferred.",
      items: [
        "Only offer to women who do NOT want to preserve fertility",
        "Requires effective contraception post-procedure — pregnancy after ablation is dangerous",
        "NovaSure (impedance-controlled), Microwave Endometrial Ablation (MEA), ThermaChoice balloon",
        "Amenorrhoea rate at 1 year: 15–35%; satisfaction rate: ~80%",
        "Can be performed under local anaesthetic (outpatient in suitable women)",
        "~30% require further treatment at 5 years; ~15–20% eventually need hysterectomy",
        "Contraindications: desire for future fertility, cavity distortion, endometrial abnormality, recent pregnancy",
      ],
      next: "ablation-outcome",
    },

    "ablation-outcome": {
      type: "decision",
      title: "Response to ablation at 3–6 months?",
      options: [
        { label: "Symptoms controlled: HMB improved, amenorrhoea or minimal bleeding", sublabel: "Continue; no further treatment needed", next: "ablation-success" },
        { label: "Treatment failure: HMB persists or recurs", sublabel: "Consider hysterectomy", next: "hysterectomy" },
      ],
    },

    "ablation-success": {
      type: "end",
      title: "Ablation Successful",
      text: "Annual review. Ensure ongoing effective contraception. Advise to seek medical advice if bleeding changes or new symptoms develop.",
    },

    "hysterectomy": {
      type: "action",
      title: "Hysterectomy",
      text: "Definitive treatment for HMB. Discuss route (vaginal, laparoscopic, abdominal) and ovarian conservation.",
      items: [
        "Vaginal hysterectomy: preferred if uterus mobile and not enlarged; shorter recovery, fewer complications",
        "Laparoscopic (TLH or LAVH): minimally invasive; preferred when vaginal not suitable; 2–4 weeks recovery",
        "Abdominal: for very large uteri, significant adhesions, or complex anatomy; 4–8 weeks recovery",
        "Ovarian conservation: discuss — avoids surgical menopause but retains ovarian cancer risk",
        "Pre-operative: correct anaemia, GnRH analogue if fibroids very large, VTE prophylaxis",
        "Patient satisfaction at 5 years: ~90% (higher than ablation)",
      ],
      next: "hysterectomy-end",
    },

    "hysterectomy-end": {
      type: "end",
      title: "Hysterectomy: Planned & Consented",
      text: "Pre-operative optimisation, consent, and scheduling. Post-operative follow-up at 6–8 weeks. Return to GP thereafter.",
      items: [
        "Correct Hb pre-operatively (target ≥100 g/L)",
        "Thromboprophylaxis: LMWH post-operatively per VTE protocol",
        "Arrange pathology review of uterus post-operatively",
        "If HRT needed post-operatively (surgical menopause): oestrogen-only HRT if hysterectomy (no progestogen needed)",
      ],
    },
  },
};


export const NG88_FIBROID_FLOWCHART = {
  id: "NG88_FIBROID",
  title: "Uterine Fibroid Management",
  subtitle: "NG88: HMB with Fibroids",
  startId: "start",
  nodes: {

    "start": {
      type: "action",
      title: "Uterine Fibroids: Initial Assessment",
      text: "Uterine fibroids are the most common cause of HMB with structural pathology. Management depends on fibroid size, FIGO type, symptoms, and fertility wishes.",
      items: [
        "Characterise fibroids: USS (transvaginal) — size, number, FIGO type (0–7), cavity involvement",
        "Symptoms: HMB, bulk symptoms (urinary frequency, pressure, constipation), pelvic pain",
        "Fertility wishes: critical for treatment selection",
        "FBC: treat iron deficiency anaemia",
        "MRI pelvis if: large/multiple fibroids planned for UAE or complex surgery",
      ],
      next: "symptoms-check",
    },

    "symptoms-check": {
      type: "decision",
      title: "Primary symptom?",
      options: [
        { label: "HMB (heavy menstrual bleeding), main concern", sublabel: "Focus on HMB management", next: "hmb-fibroid" },
        { label: "Bulk symptoms, pressure, urinary, size (minimal or no HMB)", sublabel: "Focus on fibroid reduction/removal", next: "bulk-symptoms" },
        { label: "Both HMB and bulk symptoms", sublabel: "Treatment must address both", next: "both-symptoms" },
      ],
    },

    "hmb-fibroid": {
      type: "decision",
      title: "Fibroid size and cavity distortion?",
      options: [
        { label: "Fibroids <3 cm, no distortion of uterine cavity", sublabel: "Medical management as per no-structural-pathology pathway", next: "small-fibroid-tx" },
        { label: "Submucosal fibroid (FIGO type 0–2) / cavity distorted", sublabel: "Medical or surgical, depends on fertility and preference", next: "submucosal-tx" },
        { label: "Intramural/multiple fibroids ≥3 cm", sublabel: "Secondary care management required", next: "large-fibroid-tx" },
      ],
    },

    "small-fibroid-tx": {
      type: "end",
      title: "Small Fibroids: Medical Management",
      text: "Manage as per NG88 pharmacological pathway. LNG-IUS is first-line if cavity not distorted.",
      items: [
        "LNG-IUS: effective if fibroid <3 cm and cavity not distorted",
        "Tranexamic acid / NSAIDs: symptomatic relief",
        "Follow-up USS in 12 months to monitor fibroid size",
      ],
    },

    "submucosal-tx": {
      type: "decision",
      title: "Fertility wishes?",
      options: [
        { label: "Fertility desired", sublabel: "Hysteroscopic myomectomy is first-line surgical option", next: "hyst-myomectomy" },
        { label: "Family complete / fertility not desired", sublabel: "Hysteroscopic myomectomy, ablation (if cavity can be normalised), or hysterectomy", next: "submucosal-no-fertility" },
      ],
    },

    "hyst-myomectomy": {
      type: "end",
      title: "Hysteroscopic Myomectomy",
      text: "Surgical resection of submucosal fibroids via hysteroscope. Highly effective for HMB from submucosal fibroids. Preserves fertility.",
      items: [
        "GnRH analogue pre-treatment ×3 months if anaemic or fibroid large",
        "Type 0: usually complete resection at single procedure",
        "Type 1–2: may require staged procedures",
        "Post-op: allow 3–6 months before attempting conception",
      ],
    },

    "submucosal-no-fertility": {
      type: "end",
      title: "Hysteroscopic Myomectomy / Ablation / Hysterectomy",
      text: "Discuss options. Hysteroscopic myomectomy: removes fibroid, preserves uterus. Endometrial ablation after myomectomy: may offer if cavity normalised. Hysterectomy: definitive.",
    },

    "large-fibroid-tx": {
      type: "decision",
      title: "Fertility wishes (large/multiple fibroids)?",
      options: [
        { label: "Fertility desired", sublabel: "Myomectomy (laparoscopic or open)", next: "myomectomy" },
        { label: "Family complete / fertility not desired", sublabel: "UAE, myomectomy, or hysterectomy", next: "large-no-fertility" },
      ],
    },

    "myomectomy": {
      type: "end",
      title: "Laparoscopic or Open Myomectomy",
      text: "Surgical fibroid removal preserving the uterus. GnRH analogue ×3 months pre-op if large/anaemic. Fertility preserved — allow 3–6 months before conception.",
      items: [
        "Laparoscopic: preferred if ≤3 fibroids and ≤10 cm; skilled laparoscopic surgeon required",
        "Open (abdominal): for very large, multiple, or complex fibroid configurations",
        "Intraoperative cell salvage for large cases",
        "Recurrence rate: ~30% by 5 years; re-operation ~10–15% by 5 years",
      ],
    },

    "large-no-fertility": {
      type: "decision",
      title: "UAE vs Myomectomy vs Hysterectomy?",
      options: [
        { label: "UAE, prefers non-surgical, uterine preservation", sublabel: "MRI required; not if fertility desired", next: "uae" },
        { label: "Myomectomy, prefers surgical fibroid removal, keep uterus", sublabel: "Laparoscopic or open", next: "myomectomy-def" },
        { label: "Hysterectomy, definitive treatment", sublabel: "Discuss route and ovarian conservation", next: "hysterectomy" },
      ],
    },

    "uae": {
      type: "end",
      title: "Uterine Artery Embolisation (UAE)",
      text: "Interventional radiology procedure. MRI required beforehand. Effective for most fibroid types. Fibroid shrinkage 40–70%.",
      items: [
        "Post-embolisation syndrome: pain, fever, nausea for 3–7 days — plan analgesia",
        "Hospital stay 1–2 days; recovery 1–2 weeks",
        "Re-intervention rate ~20–30% at 5 years",
        "Rare: premature menopause (1–2%), fibroid expulsion, endometritis",
        "NOT recommended for women wishing to conceive",
      ],
    },

    "myomectomy-def": {
      type: "end",
      title: "Laparoscopic or Open Myomectomy",
      text: "Surgical fibroid removal. Route depends on fibroid size and number. GnRH analogue pre-treatment if large or anaemic.",
    },

    "hysterectomy": {
      type: "end",
      title: "Hysterectomy",
      text: "Definitive treatment. Route depends on uterine size: vaginal (small uterus) → laparoscopic → abdominal (very large). Discuss ovarian conservation.",
      items: [
        "GnRH analogue ×3 months pre-op to reduce uterine/fibroid size",
        "Cell salvage for large fibroids",
        "Correct anaemia to Hb ≥100 g/L pre-operatively",
      ],
    },

    "bulk-symptoms": {
      type: "end",
      title: "Bulk Symptoms: Fibroid Reduction",
      text: "Bulk symptoms (urinary frequency, pressure, distension) are best addressed by fibroid reduction/removal. Medical options provide temporary relief.",
      items: [
        "GnRH analogue: temporary fibroid shrinkage; symptoms recur after stopping",
        "Relugolix (Ryeqo): oral GnRH antagonist with HRT add-back; sustained symptom relief",
        "UAE: effective for bulk symptoms; most effective for multiple/large fibroids",
        "Hysterectomy: definitive for bulk symptoms",
        "Myomectomy: if fertility desired and fibroid load manageable",
      ],
    },

    "both-symptoms": {
      type: "end",
      title: "HMB + Bulk Symptoms: Combined Approach",
      text: "Requires treatment addressing both. Medical bridging then surgical/interventional management usually needed.",
      items: [
        "GnRH analogue or Relugolix: medical bridge while awaiting or planning surgery",
        "UAE: addresses both HMB and bulk symptoms",
        "Hysterectomy: definitively addresses both",
        "Myomectomy: if fertility desired",
        "LNG-IUS: may help HMB but does not address bulk symptoms",
      ],
    },
  },
};


export const NG88_SECONDARY_FLOWCHART = {
  id: "NG88_SECONDARY",
  title: "HMB: Secondary Care Assessment Pathway",
  subtitle: "NG88: Gynaecology Outpatient",
  startId: "referral",
  nodes: {

    "referral": {
      type: "action",
      title: "Referred to Gynaecology with HMB",
      text: "Review referral information. Confirm history, examination findings, and investigations already performed.",
      items: [
        "Review: FBC, any USS results, treatments tried in primary care",
        "Identify: red flags (IMB, PCB, PMB, failed treatment, structural pathology)",
        "Confirm: fertility wishes, contraceptive requirements",
        "Identify: endometrial cancer risk factors (BMI >30, PCOS, diabetes, tamoxivin, Lynch syndrome)",
      ],
      next: "uss-done",
    },

    "uss-done": {
      type: "decision",
      title: "Is a pelvic USS already available?",
      options: [
        { label: "Yes: USS performed in primary care", sublabel: "Review results; perform further imaging if needed", next: "uss-findings" },
        { label: "No, no USS yet", sublabel: "Arrange pelvic USS (transvaginal preferred)", next: "arrange-uss" },
      ],
    },

    "arrange-uss": {
      type: "action",
      title: "Arrange Pelvic USS",
      text: "Transvaginal USS (TVUSS) preferred. Report should include: uterine size and morphology, endometrial thickness and appearance, any fibroids (size/location/FIGO type), ovaries.",
      items: [
        "Transvaginal: superior to transabdominal for endometrium and fibroids",
        "Transabdominal additionally if uterus palpable abdominally or large fibroids",
        "SIS (saline infusion sonography) if polyp or submucosal fibroid suspected on standard USS",
      ],
      next: "uss-findings",
    },

    "uss-findings": {
      type: "decision",
      title: "USS findings?",
      options: [
        { label: "Endometrial polyp or submucosal fibroid identified", sublabel: "Hysteroscopy recommended", next: "hysteroscopy" },
        { label: "Fibroids ≥3 cm / multiple fibroids / significant distortion", sublabel: "Consider MRI; specialist fibroid clinic if available", next: "fibroid-secondary" },
        { label: "Thickened or abnormal endometrium / adenomyosis features", sublabel: "Endometrial biopsy ± MRI", next: "endometrial-biopsy" },
        { label: "Normal USS / no significant findings", sublabel: "Review treatment options; consider hysteroscopy", next: "normal-uss" },
      ],
    },

    "hysteroscopy": {
      type: "action",
      title: "Hysteroscopy: Diagnostic ± Therapeutic",
      text: "Gold standard for intrauterine pathology. Outpatient hysteroscopy preferred (no-touch technique, ±LA).",
      items: [
        "Polypectomy at time of diagnostic hysteroscopy if polyp found",
        "Biopsy any suspicious or abnormal areas",
        "Assess submucosal fibroids: size, FIGO type, proportion intramural",
        "Outpatient: 2–3 mm hysteroscope; NSAID 30–60 min before; saline distension",
        "Send all tissue for histology",
      ],
      next: "hysteroscopy-findings",
    },

    "hysteroscopy-findings": {
      type: "decision",
      title: "Hysteroscopy findings?",
      options: [
        { label: "Polyp removed, no other pathology", sublabel: "Review at 6–8 weeks; most resolve", next: "end-polyp" },
        { label: "Submucosal fibroid identified", sublabel: "Plan hysteroscopic myomectomy", next: "end-submucosal" },
        { label: "Endometrial abnormality / cancer suspected", sublabel: "Urgent histology; MDT referral if malignant", next: "end-malignancy" },
        { label: "Normal cavity", sublabel: "Consider ablation or pharmacological treatment", next: "normal-cavity" },
      ],
    },

    "end-polyp": {
      type: "end",
      title: "Polypectomy Done: Follow-Up",
      text: "Review symptoms at 6–8 weeks. Most women have significant improvement. If symptoms recur: repeat hysteroscopy, LNG-IUS, or ablation.",
    },

    "end-submucosal": {
      type: "end",
      title: "Hysteroscopic Myomectomy Planned",
      text: "Consent, pre-operative GnRH analogue if anaemic or large. Perform hysteroscopic resection. Histology of fibroid. Review 6–8 weeks post-op.",
    },

    "end-malignancy": {
      type: "end",
      title: "Possible Endometrial Malignancy",
      text: "Urgent histology. If endometrial cancer confirmed: urgent MDT referral; staging MRI pelvis/abdomen; oncology referral. Management as per NICE endometrial cancer guideline.",
    },

    "normal-cavity": {
      type: "end",
      title: "Normal Cavity: Discuss Treatment Options",
      text: "Normal hysteroscopy. Discuss: LNG-IUS, pharmacological treatment, or endometrial ablation (if family complete).",
    },

    "fibroid-secondary": {
      type: "end",
      title: "Complex Fibroids: Multi-Disciplinary / Specialist",
      text: "Arrange MRI pelvis. Discuss options: UAE, myomectomy (laparoscopic or open), GnRH analogue bridging, hysterectomy. Refer to fibroid clinic or interventional radiology as appropriate.",
    },

    "endometrial-biopsy": {
      type: "action",
      title: "Endometrial Biopsy",
      text: "Pipelle biopsy in outpatient, or at hysteroscopy. Indicated when endometrial cancer or hyperplasia is suspected.",
      items: [
        "Indications: PMB / abnormal USS / treatment failure in at-risk women / age ≥45 with treatment failure / risk factors for endometrial cancer",
        "Pipelle biopsy: office procedure; <60 seconds; analgesia with NSAID pre-procedure",
        "False-negative rate for focal lesions (polyp, fibroid) ~60% — hysteroscopy required if polyp suspected",
        "Result: if hyperplasia with atypia → MDT/oncology; if hyperplasia without atypia → LNG-IUS; if normal → treat HMB",
      ],
      next: "biopsy-result",
    },

    "biopsy-result": {
      type: "decision",
      title: "Endometrial biopsy result?",
      options: [
        { label: "Normal / inactive / proliferative endometrium", sublabel: "Treat HMB; continue monitoring", next: "normal-biopsy" },
        { label: "Hyperplasia without atypia", sublabel: "LNG-IUS first-line; follow-up biopsy", next: "hyperplasia" },
        { label: "Atypical hyperplasia (AEH/EIN) or carcinoma", sublabel: "Urgent MDT referral; gynaecological oncology", next: "aeh" },
      ],
    },

    "normal-biopsy": {
      type: "end",
      title: "Normal Biopsy: Treat HMB",
      text: "Normal histology. Manage HMB with appropriate pharmacological or surgical treatment. Annual review.",
    },

    "hyperplasia": {
      type: "end",
      title: "Hyperplasia Without Atypia: LNG-IUS",
      text: "LNG-IUS is first-line treatment. Regression expected in >90% at 6 months. Follow-up biopsy at 6 months.",
      items: [
        "LNG-IUS: regression rate >90% at 6 months; maintain for at least 12 months post-regression",
        "If LNG-IUS declined: oral progestogen (norethisterone 10–15 mg daily)",
        "6-monthly endometrial biopsy until two consecutive negative biopsies",
        "Address underlying risk factors: weight reduction, diabetes control",
        "Hysterectomy if: persistent hyperplasia after 12 months treatment, patient preference, or concurrent significant HMB unresponsive to treatment",
      ],
    },

    "aeh": {
      type: "alert",
      title: "Atypical Hyperplasia / Endometrial Intraepithelial Neoplasia (AEH/EIN)",
      text: "AEH/EIN carries 25–30% risk of concurrent or subsequent endometrial cancer. Requires urgent specialist management.",
      items: [
        "Hysterectomy (and bilateral salpingo-oophorectomy): recommended if family complete — definitive and diagnostic",
        "Fertility-sparing (specialist centres only): high-dose progestogen + LNG-IUS; mandatory 3-monthly hysteroscopy + biopsy; complete family as soon as safely possible",
        "MDT referral: gynaecological oncology input for all cases",
        "Staging investigations: MRI pelvis (± CT/PET if cancer suspected on USS/MRI)",
      ],
      next: "end-aeh",
    },

    "end-aeh": {
      type: "end",
      title: "MDT/Oncology Referral: AEH/EIN",
      text: "Urgent referral to gynaecological oncology MDT. Shared decision making about hysterectomy vs fertility-sparing management.",
    },

    "normal-uss": {
      type: "end",
      title: "Normal USS: Review and Treat",
      text: "No structural pathology identified. Consider: trial of LNG-IUS if not already tried, endometrial biopsy if risk factors, outpatient hysteroscopy to exclude focal pathology. Discuss surgical options if pharmacological treatment has failed.",
    },
  },
};
