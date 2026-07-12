// NG123 — Urinary Incontinence and Pelvic Organ Prolapse in Women: Management
// NICE Guideline NG123 (April 2019, updated June 2019)

export const NG123_SECTIONS = [
  {
    id: "ng123-assessment",
    gl: "NG123",
    condition: "Urinary Incontinence & Pelvic Organ Prolapse",
    setting: "Urogynaecology",
    title: "Assessment & Classification",
    tags: [
      "urinary incontinence", "pelvic organ prolapse", "ng123", "nice urogynaecology",
      "stress incontinence", "urgency incontinence", "mixed incontinence",
      "pop-q staging", "bladder diary", "overactive bladder",
    ],
    content: [
      { type: "text", value: "NICE NG123 (April 2019, updated June 2019) covers assessing and managing urinary incontinence (UI) and pelvic organ prolapse (POP) in women aged 18 and over." },
      { type: "subheading", value: "Classifying Urinary Incontinence" },
      { type: "list", items: [
        "Stress UI — leakage on effort, exertion, coughing or sneezing",
        "Urgency UI / overactive bladder — leakage accompanied by or immediately preceded by urgency",
        "Mixed UI — both stress and urgency components; ask which is more bothersome, as this guides initial treatment",
      ]},
      { type: "subheading", value: "Assessment" },
      { type: "list", items: [
        "Bladder diary for a minimum of 3 days, covering variation in usual activities (e.g. a work day and a leisure day)",
        "Vaginal examination to assess pelvic floor muscle contraction and to look for prolapse",
        "Urodynamic studies are not routinely required before conservative treatment; reserve for women considering surgery, or where the diagnosis is unclear",
      ]},
      { type: "subheading", value: "Classifying Pelvic Organ Prolapse" },
      { type: "list", items: [
        "Described by compartment — anterior (cystocele), posterior (rectocele), apical/uterine or vault prolapse — and often more than one compartment is involved",
        "POP-Q (Pelvic Organ Prolapse Quantification) staging: stage 0 (no prolapse) to stage 4 (complete eversion) describes the leading edge relative to the hymen",
        "Symptoms (sensation of a bulge, dragging, pressure) correlate poorly with stage — treat the symptom, not the number",
      ]},
      { type: "alert", value: "Red flags warranting more urgent or specialist assessment rather than routine conservative management: visible haematuria, recurrent UTI, voiding difficulty or urinary retention, a palpable bladder after voiding, and pelvic pain out of keeping with simple prolapse." },
    ],
  },

  {
    id: "ng123-ui-conservative",
    gl: "NG123",
    condition: "Urinary Incontinence",
    setting: "Urogynaecology",
    title: "Urinary Incontinence — Conservative & First-Line Management",
    tags: [
      "pelvic floor muscle training", "pfmt", "bladder training",
      "stress incontinence treatment", "urgency incontinence treatment",
      "lifestyle urinary incontinence",
    ],
    flowchartId: "NG123_UI_POP_PATHWAY",
    content: [
      { type: "alert", value: "Supervised pelvic floor muscle training (PFMT) of at least 3 months' duration is first-line for stress or mixed UI. Programmes should comprise at least 8 contractions performed 3 times a day." },
      { type: "list", items: [
        "Bladder training for a minimum of 6 weeks is first-line for urgency or mixed UI",
        "Combine PFMT and bladder training where both stress and urgency components are present",
        "Lifestyle advice: reduce excessive fluid intake, moderate caffeine, and weight loss where BMI is raised — all improve UI symptoms",
        "Continue supervised PFMT if there is benefit at 3 months; only move to second-line treatment once an adequate conservative trial has failed",
      ]},
    ],
  },

  {
    id: "ng123-ui-pharmacological",
    gl: "NG123",
    condition: "Urinary Incontinence",
    setting: "Urogynaecology",
    title: "Urinary Incontinence — Pharmacological & Specialist Options",
    tags: [
      "antimuscarinic bladder", "oxybutynin", "mirabegron", "botulinum toxin bladder",
      "sacral nerve stimulation", "overactive bladder drugs", "anticholinergic burden",
    ],
    content: [
      { type: "text", value: "Drug treatment for urgency UI/overactive bladder is offered only if bladder training has not been successful enough after 6 weeks." },
      { type: "list", items: [
        "Antimuscarinics (e.g. oxybutynin, solifenacin, tolterodine) or mirabegron (a beta-3 agonist) are options — choice and dose should follow local formulary and current guidance (verify against local protocol)",
        "Immediate-release oxybutynin should be avoided in older women at risk of frailty because of its anticholinergic burden — a transdermal or extended-release preparation, or mirabegron, is preferred in this group",
        "Review effectiveness and tolerability within 4 weeks of starting or changing a drug",
      ]},
      { type: "subheading", value: "Duloxetine for Stress UI" },
      { type: "text", value: "Duloxetine is not offered as a routine first- or second-line treatment for stress UI — only consider it if a woman prefers pharmacological treatment to surgery, or is not suitable for surgery, after full discussion of side effects." },
      { type: "subheading", value: "Specialist / Third-Line Options" },
      { type: "list", items: [
        "Botulinum toxin type A bladder injections for urgency UI/overactive bladder that has not responded to conservative and drug treatment",
        "Sacral nerve stimulation, percutaneous tibial nerve stimulation, or augmentation cystoplasty are further specialist options for refractory overactive bladder — managed in a specialist urogynaecology service",
      ]},
    ],
  },

  {
    id: "ng123-ui-surgical",
    gl: "NG123",
    condition: "Urinary Incontinence",
    setting: "Urogynaecology",
    title: "Urinary Incontinence — Surgical Management",
    tags: [
      "colposuspension", "autologous fascial sling", "stress incontinence surgery",
      "mesh sling pause", "synthetic mesh incontinence",
    ],
    content: [
      { type: "alert", value: "Offer surgery for stress UI only after conservative management has failed, and after a full discussion of options, benefits and risks. Colposuspension (open or laparoscopic) and autologous fascial sling are the recommended surgical options." },
      { type: "list", items: [
        "Synthetic mesh (tape) sling procedures are not routinely offered — follow current national position and local governance arrangements on vaginal mesh before considering this option (verify against local protocol/national mesh pause status)",
        "Discuss the specific risks of each surgical option, including voiding dysfunction, de novo urgency, and the possibility of further surgery",
        "Ensure specialist multidisciplinary assessment before surgery, particularly where there is a mixed picture or previous failed surgery",
      ]},
    ],
  },

  {
    id: "ng123-pop-conservative",
    gl: "NG123",
    condition: "Pelvic Organ Prolapse",
    setting: "Urogynaecology",
    title: "Pelvic Organ Prolapse — Conservative Management",
    tags: [
      "vaginal pessary", "ring pessary", "shelf pessary", "cube pessary",
      "prolapse pelvic floor training", "pessary clinic review",
    ],
    flowchartId: "NG123_UI_POP_PATHWAY",
    content: [
      { type: "list", items: [
        "Supervised PFMT for at least 16 weeks as a first option for symptomatic POP-Q stage 1 or 2 prolapse",
        "Vaginal pessaries (ring, shelf, cube and other designs) can be offered alone or alongside PFMT, at any stage, for women who want a non-surgical option or are not fit for surgery",
        "There is no single correct pessary — fitting is individualised by vaginal size, prolapse type and the woman's activity and preference",
      ]},
      { type: "alert", value: "Offer a pessary clinic review appointment every 6 months for women at higher risk of complications (e.g. physical or cognitive impairment that makes self-care of the pessary difficult); otherwise review according to symptoms and pessary type." },
    ],
  },

  {
    id: "ng123-pop-surgical",
    gl: "NG123",
    condition: "Pelvic Organ Prolapse",
    setting: "Urogynaecology",
    title: "Pelvic Organ Prolapse — Surgical Management",
    tags: [
      "sacrocolpopexy", "anterior repair", "posterior repair", "colpocleisis",
      "vaginal mesh prolapse", "apical prolapse surgery", "vault prolapse",
    ],
    content: [
      { type: "text", value: "Surgical management is individualised by the compartment(s) involved and the woman's priorities, including any wish to preserve sexual function or fertility." },
      { type: "list", items: [
        "Anterior or posterior compartment prolapse: native tissue (non-mesh) vaginal repair",
        "Apical/uterine or vault prolapse: options include vaginal hysterectomy with apical support, sacrospinous fixation, or sacrocolpopexy (abdominal, laparoscopic or robotic) — sacrocolpopexy is generally preferred for vault prolapse where there is a higher chance of recurrence with vaginal approaches",
        "Colpocleisis (obliterative surgery) is an option for women who no longer wish to remain sexually active and want a lower-risk procedure for advanced prolapse",
      ]},
      { type: "alert", value: "Transvaginal synthetic mesh repair of anterior or posterior wall prolapse has serious, well-recognised safety concerns and inadequate long-term efficacy evidence — this procedure should only be used in the context of research, not routine practice." },
    ],
  },
];
