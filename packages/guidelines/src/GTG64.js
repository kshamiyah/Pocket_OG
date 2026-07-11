// GTG64 — Identification and Management of Maternal Sepsis During and
// Following Pregnancy (RCOG Green-top Guideline No. 64, published 19
// December 2024; BJOG 2025;132:e1–e51, Lissauer et al, DOI
// 10.1111/1471-0528.18009). This single, current guideline supersedes the
// previous two-part guidance (GTG64a "Bacterial Sepsis in Pregnancy" and
// GTG64b "Bacterial Sepsis following Pregnancy", both April 2012).

export const GTG64_SECTIONS = [
  {
    id: "gtg64-overview",
    gl: "GTG64",
    condition: "Maternal Sepsis",
    setting: "Antenatal / Intrapartum / Postnatal Emergency",
    title: "Why Maternal Sepsis Is Different — Recognition",
    tags: [
      "maternal sepsis", "sepsis in pregnancy", "sepsis postpartum", "puerperal sepsis",
      "septic shock pregnancy", "red flag sepsis", "group a strep sepsis", "gas sepsis",
    ],
    content: [
      { type: "alert", value: "Sepsis remains one of the leading causes of direct maternal death in the UK (MBRRACE-UK). Pregnancy and the puerperium both mask and accelerate sepsis: normal physiological changes of pregnancy (higher resting heart rate, lower blood pressure, dilutional anaemia) can hide early warning signs, and deterioration can be much faster than in the non-pregnant state." },
      { type: "text", value: "Clinical signs suggestive of sepsis include one or more of: pyrexia, hypothermia, tachycardia, tachypnoea, hypoxia, hypotension, oliguria, and impaired consciousness or failure to respond to treatment. Pyrexia is not required for a diagnosis of sepsis and is not a marker of severity — some of the most rapidly progressive presentations, particularly group A streptococcal (GAS) sepsis, present with a normal or low temperature." },

      { type: "subheading", value: "Be alert to genital tract sepsis" },
      { type: "list", items: [
        "Constant, severe abdominal or pelvic pain and tenderness that isn't relieved by usual analgesia is a red flag for genital tract sepsis — do not attribute it to 'normal' postnatal or early pregnancy pain without examining for this.",
        "Sepsis presenting within 12 hours of birth is more likely to be streptococcal, particularly group A strep (GAS) — ask specifically about sore throats, scarlet fever, or upper respiratory tract infections in the woman or close contacts (including young children at home), since GAS often has a household source.",
        "GAS sepsis can progress from feeling well to septic shock within hours — a low threshold for escalation is essential if it's suspected.",
      ]},

      { type: "subheading", value: "Track-and-trigger" },
      { type: "list", items: [
        "Use a validated maternity early warning score (MEOWS / obstetric early warning chart) for every woman with suspected infection — track physiological parameters (heart rate, respiratory rate, blood pressure, temperature, oxygen saturation, conscious level) against your local trigger thresholds.",
        "A single severely abnormal parameter, or a combination of two or more mildly abnormal parameters, should trigger escalation regardless of how well the woman otherwise looks.",
        "Confirm your local chart's exact trigger thresholds — these are set at trust level rather than as a single fixed national figure.",
      ]},
    ],
  },

  {
    id: "gtg64-risk-factors",
    gl: "GTG64",
    condition: "Maternal Sepsis",
    setting: "Antenatal / Postnatal",
    title: "Risk Factors & Risk Stratification",
    tags: [
      "sepsis risk factors pregnancy", "puerperal sepsis risk factors", "chorioamnionitis risk",
      "sepsis risk stratification",
    ],
    content: [
      { type: "text", value: "Assess every woman with suspected infection for sepsis using a risk-stratification approach rather than waiting for a single feature to confirm it — many risk factors are additive." },
      { type: "list", items: [
        "Obesity",
        "Diabetes (pre-existing or gestational) or impaired glucose tolerance",
        "Impaired immunity — immunosuppressant medication, chemotherapy",
        "Anaemia",
        "History of pelvic infection or group A streptococcal infection",
        "Vaginal discharge, offensive liquor, or prolonged rupture of membranes",
        "Amniocentesis or other invasive intrauterine procedures, cervical cerclage",
        "Vaginal trauma, operative vaginal delivery, or caesarean section",
        "Retained products of conception after miscarriage, termination or birth",
        "Close contact with group A streptococcal infection (sore throat, scarlet fever, cellulitis) in the household, including children",
        "Black, Asian or other minority ethnic background — MBRRACE-UK reporting has consistently identified higher sepsis mortality in these groups, likely reflecting a combination of access, recognition and systemic factors rather than biology alone.",
      ]},
    ],
  },

  {
    id: "gtg64-sepsis-six",
    gl: "GTG64",
    condition: "Maternal Sepsis",
    setting: "Emergency",
    title: "The Sepsis Six — Hour-1 Bundle",
    tags: [
      "sepsis six", "sepsis bundle", "sepsis six pregnancy", "sepsis antibiotics one hour",
      "sepsis lactate", "sepsis fluid bolus", "sepsis blood cultures",
    ],
    flowchartId: "GTG64_SEPSIS",
    content: [
      { type: "alert", value: "Where sepsis is suspected, complete the Sepsis Six within 1 hour of recognition — do not wait for senior review or a definitive source to start it. The Sepsis Six approach has been shown to reduce inpatient mortality and is the RCOG-endorsed structure for the first hour." },
      { type: "table",
        headers: ["Give (3 in)", "Take (3 out)"],
        rows: [
          ["High-flow oxygen if hypoxic or unwell, target sats per local protocol", "Blood cultures before antibiotics"],
          ["IV broad-spectrum antibiotics within 1 hour, per local antimicrobial policy", "Serum lactate"],
          ["IV fluid resuscitation — crystalloid bolus if hypotensive or lactate raised", "Accurate urine output monitoring (catheterise if needed)"],
        ],
      },
      { type: "list", items: [
        "Take blood cultures before giving antibiotics where possible, but do not delay antibiotics to achieve this — antibiotics within 1 hour of recognition takes priority.",
        "If hypotensive and/or lactate >4 mmol/L, give an initial minimum 20 mL/kg crystalloid bolus and reassess.",
        "Vasopressors are indicated for hypotension that doesn't respond to initial fluid resuscitation, to maintain mean arterial pressure — this needs critical care/anaesthetic involvement, not a labour ward setting alone.",
        "Reassess response within 1 hour and again by the next set of observations — non-response is itself an indication to escalate.",
      ]},

      { type: "subheading", value: "Escalation" },
      { type: "list", items: [
        "Involve senior obstetric and midwifery staff early for any suspected sepsis, and involve microbiology/infectious diseases, anaesthetics and critical care early for severe sepsis or septic shock — don't wait for deterioration to ask.",
        "Consider critical care admission for any woman needing vasopressor support, with ongoing high lactate despite fluids, or with multi-organ dysfunction.",
      ]},

      { type: "subheading", value: "Source control" },
      { type: "list", items: [
        "Sepsis Six treats the physiology; identifying and controlling the source is equally essential and shouldn't be delayed once the bundle is underway.",
        "Evacuate retained products of conception where this is the likely source.",
        "Drain any collection or abscess (pelvic, wound) under imaging or surgical guidance.",
        "Remove infected foreign material where relevant (e.g. cervical cerclage).",
        "Consider imaging (ultrasound, CT) early if the source isn't obvious on examination.",
        "Hysterectomy is a last-resort source-control option for overwhelming intrauterine infection not responding to the above — a decision for senior multidisciplinary input, not a first-line step.",
      ]},
    ],
  },

  {
    id: "gtg64-postpartum-causes",
    gl: "GTG64",
    condition: "Maternal Sepsis",
    setting: "Postnatal",
    title: "Postpartum Sources of Sepsis",
    tags: [
      "endometritis", "wound infection caesarean", "perineal wound infection", "mastitis",
      "breast abscess", "necrotising fasciitis", "septic pelvic thrombophlebitis",
      "puerperal pyrexia",
    ],
    content: [
      { type: "text", value: "The puerperium (up to 6 weeks after birth) carries its own set of likely sources — actively look for these rather than treating 'puerperal pyrexia' as a single diagnosis." },
      { type: "list", items: [
        "Endometritis — uterine tenderness, offensive lochia, secondary PPH; more common after caesarean section, prolonged rupture of membranes, or manual removal of placenta.",
        "Caesarean or perineal wound infection — spreading erythema, discharge, wound breakdown; examine every wound in a febrile postnatal woman.",
        "Mastitis / breast abscess — localised breast pain, erythema and fever; most mastitis responds to antibiotics and continued milk removal, but a fluctuant, non-responding area needs imaging for abscess.",
        "Urinary tract infection / pyelonephritis — common and easily missed as 'just' a UTI; loin pain or systemic upset should prompt treating it as a potential sepsis source, not a simple lower UTI.",
        "Chorioamnionitis in labour — maternal pyrexia, fetal tachycardia, offensive liquor; treat as intrapartum sepsis and expedite birth where indicated.",
        "Retained products of conception — after miscarriage, termination, or birth; consider ultrasound if bleeding or pyrexia persists.",
        "Septic pelvic thrombophlebitis — persistent pyrexia despite antibiotics and no other source found, often with a tender adnexal mass; a diagnosis of exclusion requiring imaging.",
      ]},
      { type: "alert", value: "Necrotising fasciitis is rare but rapidly fatal — pain out of proportion to visible signs, rapidly spreading erythema, skin discolouration, blistering, crepitus, or systemic upset disproportionate to the apparent local findings should prompt immediate senior surgical/microbiology review. Do not wait for classical skin changes — early necrotising fasciitis can look deceptively mild." },
    ],
  },

  {
    id: "gtg64-followup",
    gl: "GTG64",
    condition: "Maternal Sepsis",
    setting: "Postnatal / Follow-up",
    title: "Documentation, Debrief & Safety-Netting",
    tags: [
      "sepsis documentation", "sepsis debrief", "sepsis safety netting", "sepsis follow up",
      "sepsis discharge advice",
    ],
    content: [
      { type: "list", items: [
        "Document the working source of sepsis, the time sepsis was recognised, each element of the Sepsis Six and when it was completed, antibiotic choice and rationale, and the escalation/MDT input sought.",
        "Review microbiology results at 48–72 hours and de-escalate or change antibiotics according to sensitivities and clinical response, per local antimicrobial stewardship policy.",
        "Debrief the woman and her birth partner once she has recovered, explaining what happened and why.",
        "Report severe sepsis and near-miss cases through local incident-reporting systems; any maternal death from sepsis should be reported to MBRRACE-UK.",
        "Before discharge, give clear safety-netting advice on red flag symptoms that should prompt urgent review — persistent fever, worsening pain, abnormal-smelling discharge, wound concerns, or feeling generally unwell — since sepsis can present or recur after the woman has gone home.",
      ]},
    ],
  },
];
