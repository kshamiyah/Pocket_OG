// GTG20b — Management of Breech Presentation
// (RCOG Green-top Guideline No. 20b, 2nd edition, 2017)

export const GTG20B_SECTIONS = [
  {
    id: "gtg20b-overview-selection",
    gl: "GTG20B",
    condition: "Breech Presentation",
    setting: "Antenatal",
    title: "Mode of Birth & Selection for Vaginal Breech Birth",
    tags: [
      "breech presentation", "vaginal breech birth", "breech selection criteria",
      "breech contraindications", "footling breech", "hyperextended neck",
    ],
    flowchartId: "GTG20_BREECH",
    content: [
      { type: "text", value: "Breech presentation complicates 3–4% of term pregnancies. Once ECV has been offered, declined, or has failed, the choice is between planned caesarean birth and planned vaginal breech birth — both are legitimate options, and the safety of a vaginal breech birth depends heavily on case selection, an experienced attendant, and how the labour itself is managed." },
      { type: "alert", value: "Planned caesarean carries a small reduction in perinatal risk compared with planned vaginal breech birth, but at the cost of surgical risk to the mother and implications for future pregnancies — this is a genuine trade-off to discuss, not a default answer." },
      { type: "subheading", value: "Higher-risk factors — a vaginal breech attempt is expected to carry more risk where any of these are present" },
      { type: "list", items: [
        "Footling presentation (as opposed to extended/frank or flexed breech) — increases cord prolapse risk substantially.",
        "Hyperextended fetal neck on ultrasound — risk of cervical spine injury during birth.",
        "Estimated fetal weight above 3.8 kg, or below the 10th centile.",
        "Evidence of antenatal fetal compromise.",
        "Any existing independent indication for caesarean birth (this rules out vaginal breech birth on its own terms, not just for the breech).",
      ]},
      { type: "text", value: "None of these are framed as absolute numerical cut-offs in isolation — they're factors that shift the risk-benefit discussion, and the decision should be individualised with an experienced obstetrician rather than reduced to a checklist. That said, footling presentation and a hyperextended neck are generally treated as strong reasons to recommend against a vaginal attempt." },
    ],
  },

  {
    id: "gtg20b-intrapartum",
    gl: "GTG20B",
    condition: "Breech Presentation",
    setting: "Intrapartum",
    title: "Intrapartum Management of Vaginal Breech Birth",
    tags: [
      "breech intrapartum management", "hands off breech", "breech ctg monitoring",
      "breech second stage", "breech oxytocin augmentation", "breech slow progress",
    ],
    flowchartId: "GTG20_BREECH",
    content: [
      { type: "alert", value: "A skilled, experienced attendant is essential for the whole labour, not just called in for the delivery itself. If nobody with genuine vaginal breech birth experience is available, this changes the safety calculus and should be part of the conversation about mode of birth." },
      { type: "list", items: [
        "Continuous electronic fetal monitoring throughout labour.",
        "'Hands off the breech': allow spontaneous descent and birth of the body without traction until the scapulae are visible — downward traction risks extending the head and trapping the arms above it, both of which make delivery harder and more dangerous.",
        "A passive second stage of up to 90 minutes (allowing the breech to descend well into the pelvis before active pushing begins) is acceptable — this isn't a labour to rush through its stages.",
        "Oxytocin augmentation for slow progress is used cautiously, and mainly where contraction frequency itself looks inadequate (particularly with an epidural in place) — it isn't a routine part of managing a breech labour.",
        "Poor progress despite adequate contractions is a reason to move to caesarean section, not to push on and see — this is one of the clearest 'stop and reassess' triggers in the whole pathway.",
      ]},
    ],
  },

  {
    id: "gtg20b-manoeuvres",
    gl: "GTG20B",
    condition: "Breech Presentation",
    setting: "Intrapartum Emergency",
    title: "Delivery Manoeuvres",
    tags: [
      "lovset manoeuvre", "mauriceau smellie veit", "breech arms delivery",
      "aftercoming head breech", "breech emergency manoeuvres",
    ],
    content: [
      { type: "text", value: "These are used when spontaneous descent stalls — not applied routinely to every birth. Call for senior help early if extraction manoeuvres are needed; this is not something to work through alone if it's not going smoothly." },
      { type: "subheading", value: "Delivering the arms — Løvset's manoeuvre" },
      { type: "text", value: "Splint the fetal humerus and sweep the arm downward across the chest while rotating the fetal trunk — used when the arms don't deliver spontaneously, most often because one or both have become extended above the head." },
      { type: "subheading", value: "Delivering the head — Mauriceau–Smellie–Veit manoeuvre" },
      { type: "text", value: "The operator's fingers (index and middle) are placed along the fetal maxillary prominences to flex the head, with the body supported along the forearm, while an assistant applies gentle suprapubic pressure to aid flexion and prevent the head extending — the aim throughout is controlled flexion, not traction." },
      { type: "alert", value: "If standard manoeuvres don't achieve delivery promptly, escalate to the most senior obstetrician available — further options exist (e.g. forceps to the aftercoming head) but are a senior decision, not a default next step to reach for alone." },
    ],
  },
];
