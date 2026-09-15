// Guidance differs: decisions where national bodies give different rules.
//
// This dataset exists because conflicting recommendations are normal, not an
// error to be reconciled. Pocket O&G shows every position at equal weight and
// never picks a winner. The rules the renderer guarantees:
//
//   - positions are rendered newest first, and the card says so
//   - sources that AGREE are listed too, so a narrow difference does not read
//     as wholesale disagreement
//   - scope (gestation, population) is stated, because most apparent conflicts
//     are scope mismatches rather than real disagreement
//   - status (current / archived / superseded) is a fact about the document,
//     not a judgement about its quality
//   - local trust guidance sits OUTSIDE the national card, as an optional
//     overlay that can be switched off without leaving a gap
//
// Only genuine divergence belongs here. Two things that look similar but are
// NOT divergence, and must not be added:
//   - supersession: one document replacing an older one is chronology, and is
//     carried by the `status` field on the guideline itself
//   - equipoise: a single body declining to rank options (for example NG126
//     listing vaginal, oral and sublingual misoprostol without ranking them)
//     is simply that guideline's content
//
// `source` keys match the app's glColors source keys, so each position is
// themed by the body that issued it.

export const DIVERGENCES = {
  "antid-ectopic-under-12": {
    id: "antid-ectopic-under-12",
    question: "Anti-D for an ectopic pregnancy before 12 weeks",
    scope: "RhD-negative, not already sensitised · under 12+0 weeks by ultrasound",
    positions: [
      {
        body: "NICE NG126",
        gl: "NG126",
        source: "NICE",
        year: 2026,
        status: "current",
        position:
          "Do not offer anti-D immunoglobulin prophylaxis for an ectopic pregnancy, miscarriage or threatened miscarriage up to and including 11+6 weeks.",
        citation: "NG126 1.18.1 · updated 17 June 2026",
      },
      {
        body: "BSH",
        gl: null,
        source: "BSH",
        year: 2014,
        status: "current",
        position:
          "Give a minimum of 250 IU anti-D Ig for all ectopic pregnancies in previously non-sensitised RhD-negative women, whatever the mode of management.",
        citation: "BSH, Anti-D Ig for prevention of HDFN (Transfusion Medicine 2014) 3.2",
      },
      {
        body: "RCOG GTG22",
        gl: "GTG22",
        source: "RCOG",
        year: 2011,
        status: "archived",
        position:
          "Anti-D for ectopic pregnancy regardless of how it is managed. RCOG has archived this guideline and points readers to the BSH guidance.",
        citation: "GTG22, archived by RCOG",
      },
    ],
    agreed:
      "A minimum dose of 250 IU whenever anti-D is given, dating by ultrasound rather than last menstrual period, and no feto-maternal haemorrhage test in early pregnancy.",
    why:
      "BSH states that NICE recommends against anti-D for a medically managed ectopic \"without any clear evidence to support this\", and judges that it introduces complexity without strong evidence. NICE reviewed the evidence in 2026 and found no evidence of benefit below 12 weeks.",
    local: [
      {
        body: "RBH CG565",
        gl: "CG565",
        source: "RBH",
        position:
          "Anti-D immunoglobulin to all non-sensitised RhD-negative women in theatre.",
        citation: "CG565, surgical management of miscarriage",
      },
      {
        body: "RBH CG621",
        gl: "CG621",
        source: "RBH",
        position:
          "Anti-D should not be administered to women undergoing medical management of miscarriage under 12 weeks.",
        citation: "CG621, outpatient pathway",
      },
    ],
    localNote: "These two local guidelines do not agree with each other.",
    lastReviewed: "14 September 2026",
  },

  "antid-threatened-heavy-bleeding": {
    id: "antid-threatened-heavy-bleeding",
    question: "Anti-D for threatened miscarriage with heavy or repeated bleeding before 12 weeks",
    scope: "RhD-negative, not already sensitised · viable intrauterine pregnancy · under 12+0 weeks",
    positions: [
      {
        body: "NICE NG126",
        gl: "NG126",
        source: "NICE",
        year: 2026,
        status: "current",
        position:
          "Do not offer anti-D for threatened miscarriage up to and including 11+6 weeks. From 12+0 to 12+6 weeks, consider at least 250 IU where bleeding is heavy or recurrent.",
        citation: "NG126 1.18.1 and 1.18.3",
      },
      {
        body: "BSH",
        gl: null,
        source: "BSH",
        year: 2014,
        status: "current",
        position:
          "Anti-D is not necessary where bleeding stops completely before 12 weeks, but give 250 IU where bleeding is heavy or repeated, or where there is associated abdominal pain, particularly as gestation approaches 12 weeks.",
        citation: "BSH, Anti-D Ig for prevention of HDFN (Transfusion Medicine 2014) 3.2",
      },
    ],
    agreed:
      "No anti-D where light bleeding settles before 12 weeks, a minimum dose of 250 IU when it is given, and gestational age confirmed by ultrasound.",
    why:
      "The bodies set the same threshold at different gestations. BSH treats heavy or repeated bleeding as an indication before 12 weeks; NICE holds that line only from 12+0 weeks.",
    local: [],
    lastReviewed: "14 September 2026",
  },

  // National versus local rather than body versus body: NG207 is the only
  // national voice on induction method, so `positions` holds one entry and the
  // difference sits in the `local` block. That is what the local block is for.
  "iol-first-method-bishop-6": {
    id: "iol-first-method-bishop-6",
    question: "First method offered for induction at a Bishop score of 6 or less",
    scope: "Induction of labour · unfavourable cervix · no uterine scar",
    positions: [
      {
        body: "NICE NG207",
        gl: "NG207",
        source: "NICE",
        year: 2021,
        status: "current",
        position:
          "Offer dinoprostone as vaginal tablet, vaginal gel or controlled-release vaginal delivery system, or low dose (25 microgram) oral misoprostol tablets. Consider a mechanical method such as a balloon catheter only if pharmacological methods are not suitable, for example a higher risk of or from hyperstimulation or a previous caesarean birth, or if she chooses a mechanical method.",
        citation: "NG207 1.3.7 and 1.3.8",
      },
    ],
    agreed:
      "The Bishop score decides which method is offered first, a score above 6 leads to amniotomy and oxytocin, and a mechanical method is preferred where there is a uterine scar or a higher risk from hyperstimulation.",
    why:
      "NG207 places mechanical methods second because the evidence it reviewed did not show them to be more effective than pharmacological methods for an unfavourable cervix. Units that lead with a balloon do so on the basis of lower hyperstimulation rates and a pathway that suits outpatient induction.",
    local: [
      {
        body: "RBH GL861",
        gl: "GL861",
        source: "RBH",
        position:
          "A Bishop score below 6 leads to a cervical ripening balloon as first line. Propess is second line, used where the balloon is contraindicated, staff are unable to insert it, the woman prefers it, or a balloon has been unsuccessful.",
        citation: "GL861, induction of labour: assessment, CRB and Propess",
      },
    ],
    localNote:
      "This reverses the NG207 order. Both methods are recommended by NG207; the difference is which is offered first.",
    lastReviewed: "15 September 2026",
  },
};

// Stable list form for search indexing.
export const DIVERGENCE_LIST = Object.values(DIVERGENCES);
