// NG192 — Caesarean Birth
// (NICE Guideline NG192, published 31 March 2021, updated September 2024;
// replaces the older CG132)

export const NG192_SECTIONS = [
  {
    id: "ng192-urgency",
    gl: "NG192",
    condition: "Caesarean Birth",
    setting: "Labour Ward",
    title: "Categories of Urgency & Decision-to-Delivery Interval",
    tags: [
      "category 1 caesarean", "category 2 caesarean", "category 3 caesarean", "category 4 caesarean",
      "decision to delivery interval", "emergency caesarean", "crash section",
    ],
    content: [
      { type: "text", value: "Every caesarean birth is assigned an urgency category at the point of decision — this drives staffing, theatre priority, and how the decision is communicated to the team, not just how fast the knife goes in." },
      { type: "table",
        headers: ["Category", "Definition", "Decision-to-delivery target"],
        rows: [
          ["1", "Immediate threat to the life of the woman or fetus", "As soon as possible — in most situations within 30 minutes of the decision"],
          ["2", "Maternal or fetal compromise, not immediately life-threatening", "As soon as possible — in most situations within 75 minutes of the decision"],
          ["3", "No maternal or fetal compromise, but birth needs to happen early", "No fixed target — plan around theatre availability and the clinical picture"],
          ["4", "Birth timed to suit the woman or the maternity team (elective)", "Planned date"],
        ],
      },
      { type: "alert", value: "Category 1 examples include suspected uterine rupture, major placental abruption, cord prolapse, prolonged fetal bradycardia, and other presentations with an immediate threat to life — see the individual emergency pathways (e.g. cord prolapse, maternal collapse) for condition-specific action." },
      { type: "text", value: "The 30- and 75-minute figures are targets to organise a safe, efficient response, not thresholds that alone define a poor outcome — a birth achieved just outside the target with good fetal/maternal condition throughout is a very different situation from one where deterioration went unrecognised. Document the time of decision and the time of birth for every category 1 and 2 caesarean." },
    ],
  },

  {
    id: "ng192-decision-making",
    gl: "NG192",
    condition: "Caesarean Birth",
    setting: "Antenatal",
    title: "Indications & Mode-of-Birth Decisions",
    tags: [
      "maternal request caesarean", "elective caesarean indications", "breech caesarean",
      "caesarean counselling", "declining caesarean request",
    ],
    content: [
      { type: "subheading", value: "Maternal request" },
      { type: "list", items: [
        "When a woman requests a caesarean birth with no other clinical indication, explore and discuss the reasons for the request, and offer support (including from a healthcare professional with expertise in perinatal mental health, or a birth-planning discussion, if anxiety around childbirth is a factor) — but do not make that support a condition of agreeing the caesarean.",
        "If, after discussion, she still wants a caesarean birth, offer it. Access should not depend on which hospital, clinician, or how confidently a woman can advocate for herself.",
        "An individual obstetrician who is not comfortable performing a caesarean at maternal request may decline to do so personally, but must refer the woman on to a colleague who will support her choice — declining is not a route to blocking the request.",
      ]},
      { type: "subheading", value: "Other common indications to plan around" },
      { type: "list", items: [
        "Breech presentation at term where ECV has failed, is declined, or is contraindicated — discuss planned vaginal breech birth versus caesarean, according to local expertise.",
        "Placenta praevia or a high probability of placenta accreta spectrum — see GTG27a for the diagnosis and delivery-planning pathway; timing and setting (specialist MDT centre) are decided there, not by NG192 alone.",
        "Two or more previous caesareans, or a previous classical (vertical) uterine incision.",
        "Maternal medical or obstetric conditions where labour or vaginal birth carries a specific added risk — individualised discussion.",
      ]},
      { type: "text", value: "For a woman with one previous caesarean who is otherwise low risk, planned vaginal birth after caesarean is a reasonable option to discuss alongside elective repeat caesarean — that specific discussion (success rates, uterine rupture risk) belongs to the VBAC-specific guidance and consent pathway." },
    ],
  },

  {
    id: "ng192-technique",
    gl: "NG192",
    condition: "Caesarean Birth",
    setting: "Intraoperative",
    title: "Surgical Technique",
    tags: [
      "uterine closure technique", "single layer closure", "double layer closure", "blunt uterine extension",
      "sharp uterine extension", "skin closure caesarean", "sutures vs staples",
    ],
    content: [
      { type: "subheading", value: "Opening" },
      { type: "list", items: [
        "Use a low, transverse, straight skin incision; open subsequent tissue layers bluntly, extending with sharp dissection only if needed.",
        "For the uterine incision, where the lower segment is well formed, extend it bluntly rather than sharply — this reduces blood loss and the rate of postpartum haemorrhage compared with sharp extension.",
      ]},
      { type: "subheading", value: "Uterine closure" },
      { type: "list", items: [
        "Either single-layer or double-layer closure of the uterine incision is acceptable, chosen according to the clinical circumstances — single-layer closure does not increase the risk of postoperative bleeding or of uterine rupture in a subsequent pregnancy.",
      ]},
      { type: "subheading", value: "Skin closure" },
      { type: "list", items: [
        "Consider sutures rather than staples for skin closure — sutures are associated with a lower risk of superficial wound dehiscence.",
      ]},
      { type: "text", value: "These are technique preferences to guide practice, not a rigid protocol — individual circumstances (adhesions, obesity, tissue quality, operator experience) reasonably change what's appropriate case to case." },
    ],
  },

  {
    id: "ng192-perioperative",
    gl: "NG192",
    condition: "Caesarean Birth",
    setting: "Perioperative",
    title: "Perioperative Care & the Woman's Preferences",
    tags: [
      "caesarean antibiotics", "caesarean vte prophylaxis", "delayed cord clamping caesarean",
      "skin to skin caesarean", "gentle caesarean", "lower the screen",
    ],
    content: [
      { type: "list", items: [
        "Prophylactic antibiotics before skin incision — see GL787 for choice and timing; giving antibiotics before the incision (rather than after cord clamping) reduces maternal infection without evidence of fetal harm.",
        "VTE risk assessment and thromboprophylaxis — see GL891; every caesarean birth is itself a VTE risk factor to score.",
        "Delay cord clamping for at least 60 seconds unless the baby needs immediate resuscitation — the same principle as vaginal birth applies at caesarean.",
        "Offer and facilitate early skin-to-skin contact between the woman and her baby as soon as it's practically possible in theatre.",
      ]},
      { type: "subheading", value: "Accommodating preferences in theatre" },
      { type: "list", items: [
        "Ask in advance, where possible, and accommodate where practical: music playing, lowering the screen so she can see the baby born, or a quiet theatre so the woman's voice is the first the baby hears.",
        "These preferences don't compromise the surgical field or sterility when planned for — build them into the WHO checklist/team brief rather than treating them as a late add-on.",
      ]},
    ],
  },

  {
    id: "ng192-recovery-future",
    gl: "NG192",
    condition: "Caesarean Birth",
    setting: "Postnatal",
    title: "Recovery & Planning the Next Pregnancy",
    tags: [
      "caesarean recovery", "enhanced recovery caesarean", "caesarean discharge advice",
      "future pregnancy after caesarean", "interpregnancy interval",
    ],
    content: [
      { type: "list", items: [
        "Support early mobilisation, oral intake, and catheter removal as part of routine (enhanced) recovery after an uncomplicated caesarean — most women don't need to be treated as high-dependency post-op by default.",
        "Give clear safety-netting on wound care and the red-flag symptoms of infection or VTE before discharge.",
        "Discuss expected recovery time and realistic timelines for driving, exercise and returning to normal activity — set expectations rather than leaving the woman to guess.",
      ]},
      { type: "subheading", value: "Before discharge — start the conversation about future births" },
      { type: "list", items: [
        "A caesarean birth changes the discussion for next time — raise mode of birth for a future pregnancy (planned VBAC vs elective repeat caesarean) as a topic to revisit antenatally next time, not something to decide now.",
        "Note the indication for this caesarean clearly in the discharge summary — it directly shapes counselling in the next pregnancy (e.g. a category 1 caesarean for fetal compromise carries different implications for next time than an elective caesarean for breech).",
      ]},
    ],
  },
];
