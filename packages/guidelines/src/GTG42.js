// GTG42 — Shoulder Dystocia
// (RCOG Green-top Guideline No. 42, 2nd edition, March 2012)

export const GTG42_SECTIONS = [
  {
    id: "gtg42-overview",
    gl: "GTG42",
    condition: "Shoulder Dystocia",
    setting: "Intrapartum Emergency",
    title: "Definition, Incidence & Risk Factors",
    tags: [
      "shoulder dystocia", "impacted shoulders", "turtle sign", "brachial plexus injury",
      "obstetric emergency delivery", "macrosomia delivery",
    ],
    content: [
      { type: "text", value: "Shoulder dystocia is a vaginal cephalic delivery that requires additional obstetric manoeuvres to release the shoulders and deliver the body after the head has delivered and gentle traction has failed. It is a mechanical problem — the anterior shoulder impacts against the maternal symphysis pubis (or, less often, the posterior shoulder against the sacral promontory)." },
      { type: "alert", value: "Reported incidence is 0.58–0.7% of vaginal deliveries. Every minute of delay after the head delivers is a minute of reduced fetal cardiac output as the cord is compressed against the pelvis — this is a true obstetric emergency requiring a calm, rehearsed, stepwise response." },

      { type: "subheading", value: "Risk factors — and why prediction fails" },
      { type: "alert", value: "Almost half of all shoulder dystocia cases have no antecedent risk factors, and conventional risk-factor screening predicts only a small minority of cases that go on to cause morbidity. Do not rely on risk-factor screening to 'rule out' shoulder dystocia in a given labour — every vaginal birth attendant should be able to perform the manoeuvres below without warning." },
      { type: "list", items: [
        "Fetal macrosomia — the single strongest association, though most macrosomic babies are delivered without dystocia and most shoulder dystocia occurs in normally grown babies.",
        "Previous shoulder dystocia — a strong risk factor for recurrence.",
        "Maternal diabetes (pre-existing or gestational) — the risk is higher than for a non-diabetic mother having a baby of the same birthweight.",
        "Maternal obesity.",
        "Induction of labour.",
        "Prolonged first or second stage of labour.",
        "Secondary arrest, or use of oxytocin augmentation.",
        "Instrumental (assisted) vaginal delivery.",
        "Short maternal stature.",
      ]},
      { type: "text", value: "Where risk factors are present, discuss mode of birth and the plan for a possible shoulder dystocia antenatally (e.g. suspected macrosomia with diabetes, or a previous shoulder dystocia) — but do not promise that identifying risk factors will prevent it." },

      { type: "subheading", value: "Complications" },
      { type: "list", items: [
        "Postpartum haemorrhage — around 11% of shoulder dystocia births.",
        "Third- or fourth-degree perineal tears — around 3.8%.",
        "Brachial plexus injury — transient in most cases; a minority go on to permanent injury. Risk is reduced where staff are trained to avoid excessive traction and lateral flexion of the fetal head/neck.",
        "Fetal hypoxia/acidosis and, rarely, hypoxic brain injury or death, if the head-to-body interval is prolonged.",
        "Clavicle or humerus fracture.",
      ]},
    ],
  },

  {
    id: "gtg42-recognition-call-for-help",
    gl: "GTG42",
    condition: "Shoulder Dystocia",
    setting: "Intrapartum Emergency",
    title: "Recognition & the First Response",
    tags: [
      "shoulder dystocia diagnosis", "turtle sign", "shoulder dystocia call for help",
      "shoulder dystocia first steps", "fundal pressure",
    ],
    flowchartId: "GTG42_SHOULDER",
    content: [
      { type: "alert", value: "Suspect shoulder dystocia when the head delivers but restitution fails, the chin retracts against the perineum ('turtle sign'), and gentle downward traction does not deliver the anterior shoulder. Diagnosis is clinical and immediate — do not wait for a fixed time interval before acting." },
      { type: "subheading", value: "Immediate actions" },
      { type: "list", items: [
        "Call for help — senior midwife, senior obstetrician, anaesthetist and neonatal team. Note the time the head delivers.",
        "Stop the mother pushing.",
        "Lie the mother flat, remove any leg supports, and get her buttocks to the edge of the bed.",
        "Move to McRoberts' position (see Manoeuvres) as the first manoeuvre — this alone resolves the majority of cases.",
      ]},
      { type: "subheading", value: "What NOT to do" },
      { type: "alert", value: "Do not apply fundal pressure — it further impacts the shoulder against the symphysis, increases the risk of uterine rupture, and does not aid delivery. Do not apply excessive traction, or lateral or downward flexion of the fetal head and neck — both increase the risk of brachial plexus injury." },
    ],
  },

  {
    id: "gtg42-manoeuvres",
    gl: "GTG42",
    condition: "Shoulder Dystocia",
    setting: "Intrapartum Emergency",
    title: "Manoeuvres — Stepwise Management",
    tags: [
      "mcroberts", "mcroberts manoeuvre", "suprapubic pressure", "all fours", "gaskin manoeuvre",
      "rubin manoeuvre", "woods screw manoeuvre", "posterior arm delivery", "internal rotation shoulder",
      "episiotomy shoulder dystocia",
    ],
    flowchartId: "GTG42_SHOULDER",
    content: [
      { type: "subheading", value: "First line — McRoberts' manoeuvre + suprapubic pressure" },
      { type: "list", items: [
        "McRoberts' manoeuvre: hyperflex both maternal hips, bringing the thighs to the abdomen. Simple, rapid, and resolves the majority of cases when done well — treat it as the default first step for every shoulder dystocia.",
        "Add suprapubic pressure from an assistant if McRoberts' alone doesn't deliver the shoulder — pressure applied just above the symphysis pubis, directed to push the anterior shoulder towards the fetal chest and away from the symphysis, in a rocking or continuous motion.",
        "An episiotomy does not relieve the bony obstruction itself, but consider it if it will make room for internal manoeuvres.",
      ]},

      { type: "subheading", value: "If unresolved — move to internal manoeuvres or all-fours" },
      { type: "list", items: [
        "Delivery of the posterior arm: the operator's hand follows the posterior fetal arm to the elbow, flexes it, and sweeps the arm across the chest to deliver it — this reduces the diameter that must pass and is highly effective; increasingly favoured as an early rather than last-line step once McRoberts'/suprapubic pressure have failed.",
        "Internal rotational manoeuvres: Rubin manoeuvre (pressure on the posterior aspect of the accessible shoulder to adduct and rotate it obliquely) or the Woods screw manoeuvre (pressure on the anterior aspect of the posterior shoulder's clavicle, rotating it towards the fetal back) — reverse the direction if the first attempt doesn't work.",
        "All-fours (Gaskin) position: turn the mother onto her hands and knees. Simple and effective, and worth considering earlier rather than later, particularly outside a bed/stirrups setting — the mechanism is thought to relate to increased pelvic diameters and gravity assisting the posterior shoulder.",
        "There is no RCOG-mandated single order between all-fours and the internal manoeuvres — choose based on maternal mobility (epidural, obesity), operator experience, and what is achievable quickly. Keep moving through the sequence rather than repeating a failed manoeuvre.",
      ]},

      { type: "subheading", value: "Last resort — rarely needed" },
      { type: "alert", value: "Reserve these for the rare case where all standard manoeuvres fail, usually because the posterior arm cannot be accessed. Call the most senior help available before proceeding." },
      { type: "list", items: [
        "Cleidotomy — deliberate fracture of the anterior fetal clavicle to reduce shoulder width.",
        "Zavanelli manoeuvre — cephalic replacement (pushing the head back in) followed by immediate caesarean section.",
        "Symphysiotomy — surgical division of the symphyseal ligament to widen the pelvic outlet.",
        "Abdominal rescue — hysterotomy with rotation of the shoulders from above, whilst continuing traction from below.",
      ]},
    ],
  },

  {
    id: "gtg42-after-birth",
    gl: "GTG42",
    condition: "Shoulder Dystocia",
    setting: "Postnatal",
    title: "After the Birth — Documentation, Examination & Debrief",
    tags: [
      "shoulder dystocia documentation", "head to body interval", "erbs palsy",
      "shoulder dystocia debrief", "shoulder dystocia neonatal examination",
      "shoulder dystocia next pregnancy",
    ],
    content: [
      { type: "alert", value: "Document immediately and in detail — this protects the baby's future care and the clinical record equally. Structured training programmes have been shown to substantially improve the completeness of this documentation." },
      { type: "list", items: [
        "Time the head delivered and time the body delivered (head-to-body interval).",
        "Direction the head was facing at delivery, and which fetal shoulder was anterior.",
        "Each manoeuvre used, in the order performed, and who performed them.",
        "Staff present and their roles.",
        "Estimated maternal blood loss and any perineal trauma.",
        "Cord gases, and Apgar scores.",
        "A full neonatal examination for clavicle/humerus fracture and brachial plexus function (arm movement, grip) before the baby leaves the delivery room — early recognition of an injury shapes early referral.",
      ]},
      { type: "subheading", value: "Debrief and reporting" },
      { type: "list", items: [
        "Offer the woman and her birth partner a debrief explaining what happened and why the manoeuvres were needed.",
        "Report shoulder dystocia through local incident-reporting systems, and review cases with brachial plexus injury or a prolonged head-to-body interval through multidisciplinary case review.",
      ]},
      { type: "subheading", value: "Counselling for a future pregnancy" },
      { type: "list", items: [
        "Recurrence risk is increased after a previous shoulder dystocia — discuss this alongside estimated fetal weight, any diabetes, and the woman's own preference when planning mode of birth in a subsequent pregnancy.",
        "There is no evidence that routine elective caesarean section is required for all women with a previous shoulder dystocia — decisions should be individualised.",
      ]},
    ],
  },

  {
    id: "gtg42-training",
    gl: "GTG42",
    condition: "Shoulder Dystocia",
    setting: "Training & Prevention",
    title: "Training — the Real Prevention Strategy",
    tags: [
      "shoulder dystocia training", "prompt training", "obstetric emergency drills",
      "shoulder dystocia simulation",
    ],
    content: [
      { type: "text", value: "Because most shoulder dystocia is unpredicted, the guideline's emphasis is on preparedness rather than prediction: every maternity unit should provide regular, multidisciplinary, hands-on training in the recognition and management of shoulder dystocia (e.g. PROMPT-style training with a birth simulator)." },
      { type: "list", items: [
        "Units with structured, regular training have demonstrated meaningfully lower rates of brachial plexus injury and substantially better documentation quality than units without it.",
        "Training should rehearse the whole sequence — call for help, McRoberts', suprapubic pressure, internal manoeuvres/all-fours, and clear post-event documentation — not just the manoeuvres in isolation.",
        "Every member of staff who might attend a vaginal birth should be able to perform the first-line manoeuvres confidently, since shoulder dystocia gives no reliable warning.",
      ]},
    ],
  },
];
