// "My care" content: the NHS antenatal screening tests and the routine checks,
// in plain English. Screening timeline and framing follow NHS "Screening tests
// in pregnancy" (nhs.uk, reviewed March 2026); the antenatal care standard is
// NICE QS22. Conservative, decision-aid framing. Screening is always a choice.

// Screening offered through pregnancy, in the order it happens. `from`/`to` are
// the usual gestational-week window, used to flag what's relevant "around now".
export const SCREENING = [
  {
    id: "sickle", from: 1, to: 10, when: "Usually before 10 weeks",
    title: "Sickle cell & thalassaemia",
    what: "A blood test that checks whether you carry a gene for these inherited blood disorders. Your baby could be affected only if the baby's other parent carries one too.",
    why: "It's done early so that, if you're a carrier, the other parent can be offered testing and you have time to talk through what it means.",
  },
  {
    id: "infections", from: 8, to: 12, when: "Usually 8 to 12 weeks",
    title: "Hepatitis B, HIV & syphilis",
    what: "Blood tests for these three infections, which can pass to your baby. They're part of your booking bloods.",
    why: "All three can be treated or managed during pregnancy to protect your baby, so finding them early genuinely changes the outcome.",
  },
  {
    id: "scan12", from: 11, to: 14, when: "Usually 11 to 14 weeks",
    title: "The 12-week (dating) scan",
    what: "An ultrasound that confirms how many weeks you are and your due date, checks how your baby is developing, and can pick up signs of some conditions such as spina bifida.",
    why: "It sets your dates for the rest of pregnancy, and it's usually when the combined screening test is done.",
  },
  {
    id: "combined", from: 11, to: 14, when: "Usually 11 to 14 weeks", choice: true,
    title: "Combined test",
    what: "A scan measurement (the fluid at the back of your baby's neck) plus a blood test, combined to work out the chance of your baby having Down's, Edwards' or Patau's syndrome.",
    why: "It gives a 'higher chance' or 'lower chance' result, not a yes or no. If it comes back higher chance, you'll be offered more information and further tests.",
  },
  {
    id: "quad", from: 14, to: 20, when: "Usually 14 to 20 weeks", choice: true,
    title: "Quadruple test",
    what: "A blood test offered if the combined test wasn't possible in time. It screens for Down's syndrome only.",
    why: "It's a second route to screening if you missed the combined-test window earlier on.",
  },
  {
    id: "scan20", from: 18, to: 21, when: "Usually 18 to 21 weeks (up to 23 if needed)", choice: true,
    title: "The 20-week screening scan",
    what: "A detailed ultrasound, also called the anomaly scan, that checks your baby's physical development, screens for 11 conditions, and checks how they're growing. Your placenta and the blood flow to your womb are checked too.",
    why: "It's the main look at how your baby is formed and growing. Most scans are completely reassuring. It can't find everything, so if something ever doesn't feel right later in pregnancy, still tell your midwife.",
    more: [
      { h: "What they look at", body: "They look closely at your baby's bones, heart, brain, spinal cord, face, kidneys and tummy. It takes about 30 minutes, is done at a hospital or clinic, and has no known risk to you or your baby. You may be asked if you'd like to know your baby's sex." },
      { h: "If the scan finds something", body: "You may be offered more scans and tests, such as amniocentesis or chorionic villus sampling, and be referred to a specialist who will help you decide whether to have them. These can tell you for certain what a finding means for you and your baby." },
    ],
    conditions: [
      "Anencephaly (the skull and brain not forming properly)",
      "Open spina bifida (a gap in the spine)",
      "Cleft lip",
      "Diaphragmatic hernia (a gap in the muscle below the lungs)",
      "Gastroschisis (the tummy wall not fully formed)",
      "Exomphalos (some tummy organs developing outside the body)",
      "Serious heart conditions",
      "Missing or abnormal kidneys (bilateral renal agenesis)",
      "Lethal skeletal dysplasia (bones not developing properly)",
      "Edwards' syndrome (trisomy 18)",
      "Patau's syndrome (trisomy 13)",
    ],
    support: "If you're told your baby has, or might have, a condition, Antenatal Results and Choices (ARC) offers information and a helpline: 020 7713 7486, Monday to Friday.",
  },
];

// The routine checks at your appointments, each linked to the body system that
// explains why it's done (opens that system in My body).
export const CHECKS = [
  {
    id: "bp", title: "Blood pressure", system: "heart",
    what: "Taken at every single appointment.",
    why: "It's the main screen for pre-eclampsia, together with your urine. That's why it's done every time, even when you feel completely well.",
  },
  {
    id: "urine", title: "Urine dip", system: "kidneys",
    what: "A quick dipstick at your appointments.",
    why: "One test, three jobs: protein (pre-eclampsia), glucose (diabetes) and signs of a urine infection.",
  },
  {
    id: "bump", title: "Measuring your bump", system: "womb",
    what: "From around 24 weeks, a tape measure from your pubic bone to the top of your womb.",
    why: "A rough check that your baby is growing on track. If the measurement is out of step, you'll be offered a growth scan rather than guesswork.",
  },
  {
    id: "bloods", title: "Booking & 28-week bloods", system: "kidneys",
    what: "Blood tests at your first appointment and again around 28 weeks.",
    why: "They check your blood group and antibodies (which decides if you need anti-D), and recheck for anaemia as your blood volume rises.",
  },
];

export function screeningAroundWeek(week) {
  return SCREENING.filter(s => week >= s.from && week <= s.to).map(s => s.id);
}
