// NICE NG73 — Endometriosis flowcharts
// Updated November 2024 (diagnosis) and April 2024 (surgical fertility)
// https://www.nice.org.uk/guidance/ng73

export const NG73_DIAGNOSIS_FLOWCHART = {
  id: "NG73_DIAGNOSIS",
  title: "Endometriosis Diagnosis",
  subtitle: "NICE NG73 · Diagnosis Pathway (updated Nov 2024)",
  startId: "symptoms",
  nodes: {

    "symptoms": {
      type: "action",
      title: "Assess for Endometriosis",
      text: "Suspect endometriosis in any woman with unexplained pelvic pain, severe dysmenorrhoea, deep dyspareunia, or subfertility — especially if cyclical. Symptom severity does NOT correlate with disease extent.",
      items: [
        "Dysmenorrhoea — severe, disabling, not responding to simple analgesia",
        "Chronic pelvic pain — present for ≥6 months, often cyclical",
        "Deep dyspareunia — pain with intercourse",
        "Cyclical bowel symptoms: dyschezia, bloating, rectal bleeding",
        "Cyclical urinary symptoms: dysuria, haematuria",
        "Subfertility / difficulty conceiving",
        "Chronic fatigue (particularly cyclical)",
      ],
      next: "examination",
    },

    "examination": {
      type: "action",
      title: "Examination",
      text: "Normal examination does NOT exclude endometriosis. Perform bimanual examination where appropriate.",
      items: [
        "Abdominal: tenderness, palpable mass",
        "Speculum: vaginal or cervical abnormality (rare to see endometriosis lesions in clinic)",
        "Bimanual: uterine mobility (fixed, retroverted), adnexal mass or tenderness, uterosacral nodularity",
        "Document whether uterus is mobile or fixed — indicates possible DIE",
      ],
      next: "tvus",
    },

    "tvus": {
      type: "action",
      title: "Offer Transvaginal Ultrasound (TVUS) — NG73 Nov 2024",
      text: "GPs should now OFFER TVUS to all people with suspected endometriosis at first point of contact. This is the key 2024 change — TVUS is no longer restricted to secondary care.",
      items: [
        "TVUS can detect: ovarian endometrioma (ground-glass cyst), deep infiltrating endometriosis (rectovaginal, uterosacral, bladder)",
        "TVUS CANNOT reliably detect: superficial peritoneal endometriosis",
        "A normal TVUS does NOT exclude endometriosis",
        "Document: uterine position and mobility, ovarian mobility (sliding sign), any adnexal mass",
      ],
      next: "tvus_result",
    },

    "tvus_result": {
      type: "decision",
      title: "TVUS Result and Symptom Severity",
      text: "Use TVUS findings alongside symptoms to determine next steps.",
      options: [
        { label: "TVUS positive — endometrioma or DIE features", sublabel: "Refer to gynaecology; MRI if DIE suspected", next: "refer_urgent" },
        { label: "TVUS negative — but symptoms persist", sublabel: "Refer to gynaecology; normal USS does not exclude endo", next: "empirical" },
        { label: "Mild symptoms — adequate response to simple treatment", sublabel: "Trial of COCP or progestogen; review if not improving", next: "empirical_treatment" },
      ],
    },

    "refer_urgent": {
      type: "action",
      title: "Refer to Gynaecology",
      text: "Refer promptly with TVUS findings. Include clinical history, examination findings, and scan report.",
      items: [
        "Mark referral as urgent if: severe pain, large endometrioma, suspected DIE, hydronephrosis",
        "Request MRI pelvis if DIE features on TVUS — for surgical planning",
        "Include: duration of symptoms, treatments tried, impact on quality of life, fertility wishes",
        "Consider 2-week wait referral if malignancy cannot be excluded (e.g. complex ovarian mass)",
      ],
      next: "secondary_care",
    },

    "empirical": {
      type: "action",
      title: "Refer to Gynaecology — Negative TVUS",
      text: "A normal TVUS does not exclude endometriosis. Refer if symptoms persist despite adequate primary care management.",
      items: [
        "Endometriosis is a clinical diagnosis — negative imaging does not exclude it",
        "Refer to gynaecology if: symptoms uncontrolled, significant quality of life impact, subfertility, diagnostic uncertainty",
        "Empirical hormonal treatment (COCP or progestogen) appropriate while awaiting referral",
      ],
      next: "secondary_care",
    },

    "empirical_treatment": {
      type: "action",
      title: "Empirical Hormonal Treatment (Primary Care)",
      text: "Offer hormonal treatment for suspected endometriosis without waiting for laparoscopic confirmation.",
      items: [
        "COCP — standard or continuous regimen (skip pill-free week to suppress cyclical pain)",
        "Progestogen — desogestrel 75 mcg daily, or norethisterone 5–10 mg daily",
        "NSAIDs — mefenamic acid or ibuprofen for pain alongside hormonal treatment",
        "Review in 3 months — if inadequate response, refer to gynaecology",
        "If symptoms controlled: continue and review annually",
      ],
      next: "review",
    },

    "review": {
      type: "decision",
      title: "Review at 3 Months — Adequate Response?",
      text: "Reassess symptom control on empirical treatment.",
      options: [
        { label: "Adequate response — continue", sublabel: "Review annually; refer if symptoms recur or worsen", next: "managed" },
        { label: "Inadequate response — refer", sublabel: "Refer to gynaecology for further assessment", next: "secondary_care" },
      ],
    },

    "managed": {
      type: "end",
      title: "Managed in Primary Care",
      text: "Continue hormonal treatment with annual review. Advise on when to return.",
      items: [
        "Continue COCP or progestogen — reassess at least annually",
        "Advise: return if pain worsens, new symptoms develop, or fertility becomes a concern",
        "If planning pregnancy: review contraception and refer to gynaecology / fertility if subfertility",
        "Consider referral for laparoscopic confirmation if diagnosis is in doubt or patient wishes definitive diagnosis",
      ],
    },

    "secondary_care": {
      type: "action",
      title: "Secondary Care Assessment",
      text: "Gynaecology assessment — thorough history, examination, review of investigations.",
      items: [
        "Review all investigations: TVUS, MRI if available",
        "MRI pelvis if DIE suspected — maps disease for surgical planning",
        "Confirm or update imaging if not done recently",
        "Discuss treatment options: medical vs surgical, fertility wishes, quality of life goals",
      ],
      next: "lap_decision",
    },

    "lap_decision": {
      type: "decision",
      title: "Laparoscopy Indicated?",
      text: "Laparoscopy is the only definitive diagnostic test. Not always required — medical management can be started on clinical grounds.",
      options: [
        { label: "Yes — proceed to diagnostic ± therapeutic laparoscopy", sublabel: "Symptoms uncontrolled; patient wants definitive diagnosis; fertility concern", next: "laparoscopy" },
        { label: "No — continue or intensify medical treatment", sublabel: "Adequate symptom control; patient declines surgery; fertility not immediate concern", next: "medical_management" },
      ],
    },

    "laparoscopy": {
      type: "action",
      title: "Diagnostic ± Therapeutic Laparoscopy",
      text: "Plan for therapeutic treatment at the same time as diagnostic laparoscopy — avoid two-stage procedures where possible.",
      items: [
        "Obtain histological confirmation where feasible",
        "Excise (preferred) or ablate superficial peritoneal endometriosis at same sitting",
        "Endometrioma: laparoscopic cystectomy preferred over drainage",
        "DIE: do not attempt in non-specialist centre — refer to BSGE centre if found",
        "Document rASRM stage, disease sites, and any adhesions",
        "Post-operative hormonal treatment to reduce recurrence",
      ],
      next: "diagnosis_end",
    },

    "medical_management": {
      type: "end",
      title: "Medical Management Without Laparoscopy",
      text: "Endometriosis can be managed clinically without histological confirmation when diagnosis is likely and treatment is effective.",
      items: [
        "Continue or intensify hormonal treatment: COCP, progestogen, dienogest, or GnRH agonist",
        "Review response in 3–6 months",
        "Refer for laparoscopy if: treatment fails, symptoms worsen, fertility concern arises",
        "Annual review — endometriosis is a chronic condition requiring long-term management",
      ],
    },

    "diagnosis_end": {
      type: "end",
      title: "Endometriosis Confirmed — Plan Treatment",
      text: "Endometriosis confirmed at laparoscopy. Initiate or continue treatment based on patient priorities.",
      items: [
        "Post-surgical hormonal treatment to reduce recurrence: COCP, progestogen, or LNG-IUS",
        "If fertility is the priority: see treatment flowchart — discuss with fertility specialist",
        "DIE identified: refer to BSGE endometriosis centre for specialist management",
        "Follow-up in 3 months post-surgery; annual review thereafter",
        "Advise on endometriosis support resources (Endometriosis UK)",
      ],
    },

  },
};

export const NG73_TREATMENT_FLOWCHART = {
  id: "NG73_TREATMENT",
  title: "Endometriosis Treatment",
  subtitle: "NICE NG73 · Treatment Decision Pathway",
  startId: "priority",
  nodes: {

    "priority": {
      type: "decision",
      title: "Treatment Priority",
      text: "Treatment approach depends on the patient's main priority. Discuss both options if appropriate.",
      options: [
        { label: "Pain relief — fertility not immediate concern", sublabel: "Medical or surgical treatment for symptom control", next: "pain_first_line" },
        { label: "Fertility — trying to conceive", sublabel: "Medical treatment does NOT improve fertility — surgical or ART route", next: "fertility_route" },
      ],
    },

    "pain_first_line": {
      type: "action",
      title: "First-Line: Medical Treatment for Pain",
      text: "Offer hormonal treatment to all women with endometriosis-related pain unless contraindicated.",
      items: [
        "COCP — continuous regimen preferred for cyclical pain (skip pill-free interval)",
        "Progestogen — desogestrel 75 mcg daily, norethisterone 5–10 mg daily, or dienogest 2 mg daily",
        "LNG-IUS 52mg (Mirena) — particularly effective for dysmenorrhoea; licensed for endometriosis",
        "NSAIDs alongside hormonal treatment for breakthrough pain",
        "Review in 3–6 months — assess symptom control",
      ],
      next: "pain_response",
    },

    "pain_response": {
      type: "decision",
      title: "Response to First-Line Treatment?",
      text: "Reassess after 3–6 months of treatment.",
      options: [
        { label: "Adequate — continue", sublabel: "Annual review; continue long-term", next: "long_term_medical" },
        { label: "Inadequate — escalate", sublabel: "Try alternative first-line or escalate to GnRH agonist or surgery", next: "escalate" },
      ],
    },

    "long_term_medical": {
      type: "end",
      title: "Long-term Medical Management",
      text: "Continue hormonal treatment with annual review. Endometriosis is a chronic condition.",
      items: [
        "Review at least annually — reassess symptom control, side effects, and fertility wishes",
        "COCP or progestogen: can continue indefinitely",
        "LNG-IUS: re-insert at 5 years (8 years for contraception indication)",
        "GnRH agonists with add-back: can continue beyond 6 months with appropriate add-back HRT",
        "Refer for surgery if breakthrough symptoms, new features, or failed medical management",
      ],
    },

    "escalate": {
      type: "action",
      title: "Escalation Options",
      text: "If first-line treatment fails, consider second-line hormonal therapy or surgical referral.",
      items: [
        "Try alternative first-line: switch between COCP, progestogen, dienogest, or LNG-IUS",
        "GnRH agonist (goserelin or leuprorelin) + add-back HRT — highly effective for pain",
        "Refer to gynaecology for surgical assessment if medical treatment repeatedly fails",
        "Pain management team referral for chronic pelvic pain",
        "Pelvic floor physiotherapy",
      ],
      next: "gnrh_or_surgery",
    },

    "gnrh_or_surgery": {
      type: "decision",
      title: "GnRH Agonist or Surgical Route?",
      text: "Discuss both options with patient — consider fertility wishes, symptom severity, and patient preference.",
      options: [
        { label: "GnRH agonist + add-back", sublabel: "Goserelin or leuprorelin; add-back HRT from start; max 6 months without", next: "gnrh_treatment" },
        { label: "Surgical — laparoscopic excision", sublabel: "Diagnostic ± therapeutic laparoscopy; preferred if surgery not yet done", next: "surgery_local" },
      ],
    },

    "gnrh_treatment": {
      type: "action",
      title: "GnRH Agonist + Add-back HRT",
      text: "GnRH agonists induce pseudomenopause — highly effective for pain but require add-back to protect bone density.",
      items: [
        "Goserelin 3.6 mg SC monthly (Zoladex) or 10.8 mg every 3 months",
        "Leuprorelin 3.75 mg IM monthly (Prostap) or 11.25 mg every 3 months",
        "Add-back HRT from start: norethisterone 5 mg daily, or tibolone 2.5 mg, or continuous combined HRT",
        "Without add-back: maximum 6 months; with add-back can continue longer",
        "Follow with long-term maintenance hormonal treatment post-GnRH agonist",
      ],
      next: "gnrh_response",
    },

    "gnrh_response": {
      type: "decision",
      title: "Response to GnRH Agonist?",
      text: "Review after 3–6 months.",
      options: [
        { label: "Good response — plan maintenance", sublabel: "Switch to long-term COCP, progestogen, or LNG-IUS", next: "long_term_medical" },
        { label: "Poor response — consider surgery", sublabel: "Persistent severe symptoms despite medical treatment", next: "surgery_local" },
      ],
    },

    "surgery_local": {
      type: "action",
      title: "Laparoscopic Surgery",
      text: "Refer for diagnostic ± therapeutic laparoscopy. Therapeutic excision should be performed at the same time where possible.",
      items: [
        "Excision preferred over ablation for peritoneal endometriosis",
        "Endometrioma: cystectomy preferred over drainage (lower recurrence)",
        "Obtain histological confirmation",
        "Post-surgical hormonal treatment to reduce recurrence",
        "Document rASRM staging",
      ],
      next: "die_check",
    },

    "die_check": {
      type: "decision",
      title: "Deep Infiltrating Endometriosis (DIE)?",
      text: "Assess whether disease involves bowel, bladder, ureters, or other deep structures.",
      options: [
        { label: "No DIE — manage locally", sublabel: "Superficial peritoneal or ovarian endometriosis only", next: "post_surgical" },
        { label: "DIE confirmed or suspected", sublabel: "Bowel, bladder, ureteric, or rectovaginal involvement", next: "bsge_referral" },
      ],
    },

    "bsge_referral": {
      type: "alert",
      title: "Refer to BSGE Endometriosis Centre",
      text: "Deep infiltrating endometriosis must be managed in a BSGE-accredited specialist centre. Do not attempt DIE surgery in a non-specialist unit.",
      items: [
        "MRI pelvis — mandatory before DIE surgery for mapping",
        "Multi-disciplinary team: specialist gynaecologist, colorectal surgeon, urologist",
        "Bowel endometriosis: shave excision, disc resection, or bowel resection",
        "Bladder endometriosis: laparoscopic partial cystectomy",
        "Ureteric involvement: ureterolysis ± ureteric reimplantation",
      ],
      next: "post_surgical",
    },

    "post_surgical": {
      type: "end",
      title: "Post-Surgical Management",
      text: "Post-surgical hormonal treatment significantly reduces recurrence. Discuss long-term management plan.",
      items: [
        "Start hormonal treatment post-surgery to reduce disease recurrence",
        "Options: COCP (continuous), progestogen (LNG-IUS, desogestrel, dienogest), GnRH agonist with add-back",
        "Review in 6–12 weeks post-surgery; annual review thereafter",
        "Advise: recurrence rate ~20–40% at 5 years — hormonal treatment significantly reduces this",
        "If symptoms recur: reassess; consider further surgery or alternative medical treatment",
      ],
    },

    "fertility_route": {
      type: "action",
      title: "Fertility Assessment",
      text: "Medical hormonal treatment does NOT improve fertility. Focus on surgery and assisted reproduction.",
      items: [
        "Do NOT use COCP, progestogen, or GnRH agonist to improve natural conception rates",
        "Refer to fertility specialist early — do not delay ART unnecessarily",
        "Assess: duration of subfertility, partner semen analysis, ovarian reserve (AMH, AFC)",
        "Staging: laparoscopy for staging and simultaneous excision improves fertility in mild-moderate disease",
      ],
      next: "fertility_staging",
    },

    "fertility_staging": {
      type: "decision",
      title: "Disease Severity and Fertility Plan",
      text: "Management depends on extent of endometriosis and ovarian reserve.",
      options: [
        { label: "Minimal–mild (stage I–II) — surgery may help", sublabel: "Laparoscopic excision improves spontaneous pregnancy rates", next: "fertility_surgery" },
        { label: "Moderate–severe (stage III–IV) or endometrioma", sublabel: "IVF often first-line; surgery if endometrioma >3 cm", next: "fertility_ivf" },
      ],
    },

    "fertility_surgery": {
      type: "action",
      title: "Laparoscopic Surgery for Fertility",
      text: "Excision of endometriosis improves spontaneous pregnancy rates in minimal-mild disease.",
      items: [
        "Laparoscopic excision of peritoneal endometriosis — improves natural conception rates in stage I–II",
        "Endometrioma >3 cm: cystectomy preferred over drainage before IVF (April 2024 update)",
        "Measure AMH pre-operatively — cystectomy risks ovarian reserve",
        "Warn that cystectomy removes some normal ovarian tissue — irreversible reduction in reserve",
        "Consider fertility preservation (oocyte cryopreservation) before bilateral endometrioma surgery",
      ],
      next: "fertility_end",
    },

    "fertility_ivf": {
      type: "action",
      title: "IVF / Assisted Reproduction",
      text: "IVF is often first-line for moderate-severe endometriosis, tubal damage, or failed surgical treatment.",
      items: [
        "Refer to fertility specialist — endometriosis reduces IVF success rates; counsel appropriately",
        "Pre-IVF GnRH agonist downregulation (3–6 months) may improve outcomes in severe disease",
        "Endometrioma >3 cm: cystectomy before IVF if not already done — discuss risks to ovarian reserve",
        "Endometrioma drainage at egg collection: not routinely recommended",
        "Discuss: number of IVF cycles, NHS funding criteria, prognosis",
      ],
      next: "fertility_end",
    },

    "fertility_end": {
      type: "end",
      title: "Fertility Management Plan in Place",
      text: "Ongoing multidisciplinary support for women with endometriosis and subfertility.",
      items: [
        "Joint care: gynaecologist + fertility specialist + pain team if needed",
        "Review plan regularly — adjust based on response to treatment and fertility outcomes",
        "After completed family: offer definitive hormonal treatment or hysterectomy if symptoms severe",
        "Psychological support: subfertility with endometriosis causes significant emotional burden",
        "Endometriosis UK and Fertility Network UK: support organisations",
      ],
    },

  },
};
