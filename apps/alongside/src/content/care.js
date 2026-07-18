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
    id: "scan20", from: 18, to: 21, when: "Usually 18 to 21 weeks", choice: true,
    title: "The 20-week screening scan",
    what: "A detailed ultrasound that checks your baby's physical development from head to toe, screens for 11 rare conditions, and checks where your placenta is lying.",
    why: "It's the main look at how your baby is growing and formed. Most scans are reassuring; if something is found, you'll be offered more information and support.",
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
