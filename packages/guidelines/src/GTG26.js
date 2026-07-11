// GTG26 — Assisted Vaginal Birth
// (RCOG Green-top Guideline No. 26, 4th edition, April 2020; formerly
// "Operative Vaginal Delivery")

export const GTG26_SECTIONS = [
  {
    id: "gtg26-indications-prerequisites",
    gl: "GTG26",
    condition: "Assisted Vaginal Birth",
    setting: "Intrapartum",
    title: "Indications & Prerequisites",
    tags: [
      "assisted vaginal birth", "operative vaginal delivery", "forceps indications",
      "ventouse indications", "instrumental delivery prerequisites",
    ],
    content: [
      { type: "subheading", value: "Indications" },
      { type: "list", items: [
        "Fetal — suspected fetal compromise in the second stage.",
        "Maternal — prolonged second stage of labour, or a need to avoid prolonged active pushing because of a maternal medical condition (e.g. significant cardiac disease, some neurological or ophthalmic conditions).",
        "Maternal exhaustion, or an inability to push effectively.",
      ]},
      { type: "alert", value: "Assisted vaginal birth carries real risks to both mother and baby — it should be offered where it will genuinely help the birth progress safely, not used routinely to shorten a normally progressing second stage." },

      { type: "subheading", value: "Prerequisites before starting" },
      { type: "list", items: [
        "Full clinical assessment: fetal head position, station and degree of caput/moulding confirmed by abdominal and vaginal (± ultrasound) examination — inaccurate assessment of fetal head position before starting is a recognised and preventable cause of morbidity.",
        "Cervix fully dilated and membranes ruptured.",
        "Adequate pain relief in place, appropriate to the anticipated procedure.",
        "Maternal bladder empty — catheterise if needed.",
        "Clear communication with the woman and her birth partner: what's being offered, why, what it involves, and the alternative of caesarean birth — informed consent, including the right to decline, applies here as much as to any other procedure.",
        "An operator trained and competent in the chosen instrument, with a clear backup plan (and senior support/theatre availability) if the attempt doesn't succeed.",
      ]},
    ],
  },

  {
    id: "gtg26-classification-instrument",
    gl: "GTG26",
    condition: "Assisted Vaginal Birth",
    setting: "Intrapartum",
    title: "Classification & Choosing the Instrument",
    tags: [
      "outlet delivery", "low cavity delivery", "mid cavity delivery", "forceps vs ventouse",
      "vacuum extraction", "kiwi omnicup", "kiellands forceps", "rotational delivery",
    ],
    content: [
      { type: "table",
        headers: ["Classification", "Definition"],
        rows: [
          ["Outlet", "Scalp visible at the introitus without separating the labia; skull has reached the pelvic floor; sagittal suture ≤45° from the anteroposterior diameter"],
          ["Low", "Leading bony point at station +2 cm or below, not on the perineum — subdivided into ≤45° rotation and >45° rotation"],
          ["Mid-cavity", "Head ≤1/5 palpable per abdomen; leading bony point at station 0 to +1 cm — subdivided into ≤45° rotation and >45° rotation"],
          ["High", "Head >1/5 palpable, above station 0 — assisted vaginal birth is not appropriate; this is a caesarean"],
        ],
      },
      { type: "subheading", value: "Forceps vs ventouse — the trade-off" },
      { type: "list", items: [
        "Ventouse: somewhat higher chance of not achieving vaginal birth than forceps, and more neonatal cephalhaematoma and retinal haemorrhage — but less maternal perineal/vaginal trauma, including a lower rate of third- and fourth-degree tears.",
        "Forceps: higher chance of successful vaginal birth than ventouse, but a meaningfully higher rate of significant maternal perineal trauma (including obstetric anal sphincter injury).",
        "Choice should weigh the clinical scenario (fetal condition, gestation, position) alongside operator experience with the specific instrument — the 'best' instrument is the one the situation calls for and the operator is genuinely skilled with.",
      ]},
      { type: "subheading", value: "Specific contraindications and cautions" },
      { type: "list", items: [
        "Avoid ventouse below approximately 34 weeks' gestation — increased risk of neonatal cephalhaematoma/intracranial injury in the preterm fetal skull.",
        "Avoid ventouse where there's a known or suspected fetal bleeding disorder, or with a face presentation.",
        "Rotational delivery (manual or instrumental, e.g. Kielland's forceps or rotational ventouse) for a malpositioned head should only be performed by an operator specifically trained and experienced in the technique.",
      ]},
    ],
  },

  {
    id: "gtg26-trial-conduct",
    gl: "GTG26",
    condition: "Assisted Vaginal Birth",
    setting: "Intrapartum",
    title: "Trial in Theatre & Conducting the Attempt",
    tags: [
      "trial of instrumental delivery", "trial in theatre", "failed instrumental delivery",
      "sequential instruments", "abandon instrumental delivery",
    ],
    flowchartId: "GTG26_ASSISTED_BIRTH",
    content: [
      { type: "alert", value: "Where the attempt is judged to have a meaningfully higher chance of not succeeding, conduct it as a trial in theatre — set up with immediate recourse to caesarean birth, rather than attempting on the labour ward and transferring after a failed attempt." },
      { type: "subheading", value: "Factors favouring a trial in theatre" },
      { type: "list", items: [
        "Estimated fetal weight >4 kg or a clinically large baby",
        "Maternal BMI >30",
        "Occipito-posterior position",
        "Mid-cavity delivery, or head >1/5 palpable per abdomen",
        "Combination of factors, or an operator with limited experience of the anticipated difficulty",
      ]},
      { type: "subheading", value: "Conducting the attempt" },
      { type: "list", items: [
        "Expect visible descent with each contraction/traction — if there's no descent at all with correctly applied traction, do not persist; reassess or abandon.",
        "There is no single mandated maximum number of pulls — but the absence of progressive descent, rather than a fixed pull count, is the signal to stop and reassess or move to caesarean.",
        "Planned sequential use of instruments (e.g. ventouse followed by forceps) is not recommended — it's associated with a higher risk of neonatal trauma. If one instrument fails, the default next step is caesarean birth, decided by a senior obstetrician, not automatically trying the other instrument.",
      ]},
    ],
  },

  {
    id: "gtg26-complications-documentation",
    gl: "GTG26",
    condition: "Assisted Vaginal Birth",
    setting: "Postnatal",
    title: "Complications & Documentation",
    tags: [
      "oasi forceps", "third degree tear instrumental delivery", "cephalhaematoma",
      "retinal haemorrhage ventouse", "instrumental delivery documentation",
    ],
    content: [
      { type: "subheading", value: "Maternal complications" },
      { type: "list", items: [
        "Perineal trauma, including obstetric anal sphincter injury (OASI) — higher with forceps than ventouse; examine systematically after every assisted birth, including a rectal examination to avoid missing a sphincter injury.",
        "Postpartum haemorrhage.",
        "Urinary retention — ensure voiding is checked before discharge from the delivery area.",
      ]},
      { type: "subheading", value: "Neonatal complications" },
      { type: "list", items: [
        "Cephalhaematoma and retinal haemorrhage — more common with ventouse.",
        "Facial or scalp marking/bruising, and rarely more significant injury (skull fracture, facial nerve palsy) — examine and document the baby's condition clearly, and safety-net for any parent concern about feeding, tone, or the appearance of the injury.",
      ]},
      { type: "subheading", value: "Documentation" },
      { type: "list", items: [
        "Indication for the procedure, and the consent discussion.",
        "Findings on assessment before starting: position, station, caput/moulding.",
        "Instrument used, number of pulls/tractions, ease of application and descent, and total duration.",
        "Who performed it, and their level of supervision/seniority.",
        "Condition of the baby at birth (Apgar, cord gases where taken), and maternal perineal findings including any OASI.",
      ]},
    ],
  },
];
