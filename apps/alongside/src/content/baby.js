// Your baby, week by week. Canonical baby-development data for both the "My
// baby" tab and the "This week" home card. Figures are typical averages from
// standard antenatal references (NHS pregnancy week-by-week and standard
// embryology); every baby grows at their own pace. Early lengths are measured
// head to bottom, later ones head to heel. Not medical advice.
//
// Stage shape: { from, size, measure, headline, points: [...], milestone? }
// `from` is the first week the stage applies; the last stage with from <= week
// is used.

const BABY_STAGES = [
  { from: 4, size: "a poppy seed", measure: "about 2 mm",
    headline: "A tiny ball of cells has settled in and started building the placenta.",
    points: [
      "The fertilised egg has burrowed into your womb lining.",
      "The placenta and the amniotic sac that cushions your baby are beginning to form.",
      "The neural tube, which becomes the brain and spinal cord, is starting to lay down.",
    ] },
  { from: 6, size: "a lentil", measure: "about 5 mm",
    headline: "A first heartbeat, and the earliest shape of a face and limbs.",
    points: [
      "A basic heart has begun to beat.",
      "Small buds that become the arms and legs are appearing.",
      "The beginnings of eyes, ears and a mouth are forming.",
    ] },
  { from: 8, size: "a raspberry", measure: "about 1.6 cm",
    headline: "All the major organs are forming, and your baby has started to move.",
    points: [
      "The major organs, heart, brain, lungs and kidneys, are all forming.",
      "Tiny fingers and toes are taking shape.",
      "Your baby is making small movements, though far too tiny to feel.",
    ] },
  { from: 10, size: "a strawberry", measure: "about 3 cm, 4 g",
    headline: "Now officially a fetus, with organs starting to work.",
    points: [
      "The vital organs are in place and beginning to function.",
      "Fingernails and tiny bones are starting to form.",
      "Your baby can already bend and stretch their limbs.",
    ] },
  { from: 12, size: "a lime", measure: "about 5.4 cm, 14 g", milestone: "Fully formed",
    headline: "Fully formed, with fingers, toes and working reflexes.",
    points: [
      "All the parts of the body are formed, now it's about growing.",
      "Your baby can open and close their hands and curl their toes.",
      "The kidneys are working and passing tiny amounts of urine into the waters.",
      "This is the window for the 12-week scan and combined screening test.",
    ] },
  { from: 14, size: "a lemon", measure: "about 8.5 cm, 45 g",
    headline: "Facial expressions, and the first fine hair.",
    points: [
      "Your baby can make facial expressions and may suck their thumb.",
      "A fine downy hair called lanugo begins to cover the skin.",
      "The body is starting to catch up with the size of the head.",
    ] },
  { from: 16, size: "an avocado", measure: "about 11.5 cm, 100 g",
    headline: "Your baby may be starting to hear you.",
    points: [
      "The bones of the inner ear are forming, so your baby may begin to hear.",
      "Movements are getting stronger, though you may not feel them yet.",
      "The skeleton is hardening from soft cartilage into bone.",
    ] },
  { from: 18, size: "a sweet potato", measure: "about 14 cm, 190 g",
    headline: "Fingerprints form, and your baby is busy and active.",
    points: [
      "Unique fingerprints are developing on those tiny fingers.",
      "Your baby is increasingly active, twisting and kicking.",
      "Hearing is developing further, and loud sounds may get a reaction.",
    ] },
  { from: 20, size: "a banana", measure: "about 25 cm, 300 g", milestone: "Halfway there",
    headline: "The halfway point, and often the first flutters of movement.",
    points: [
      "You're halfway through, and this is when the 20-week scan checks how your baby is developing.",
      "Many women feel their baby's first movements (quickening) around now.",
      "A waxy, protective coating called vernix forms over the skin.",
      "Hair is beginning to grow on the head.",
    ] },
  { from: 22, size: "a papaya", measure: "about 28 cm, 430 g",
    headline: "Sleeping, waking, and responding to sound.",
    points: [
      "Your baby is settling into cycles of sleeping and being awake.",
      "They can hear and respond to sounds, including your voice.",
      "A sense of touch is developing, and they may explore with their hands.",
    ] },
  { from: 24, size: "an ear of corn", measure: "about 30 cm, 600 g", milestone: "Reaches viability",
    headline: "A key milestone: survival outside the womb becomes possible.",
    points: [
      "From now, with specialist intensive care, a baby born early has a chance of surviving.",
      "The lungs are developing the cells that will let them breathe air.",
      "Taste buds are forming, and your baby responds to your voice and touch.",
    ] },
  { from: 26, size: "a courgette", measure: "about 35 cm, 760 g",
    headline: "Eyes beginning to open.",
    points: [
      "Your baby's eyes, fused shut until now, are starting to open.",
      "They may startle at a sudden loud noise.",
      "The brain is very active, and movements are becoming regular and strong.",
    ] },
  { from: 28, size: "an aubergine", measure: "about 37 cm, 1 kg",
    headline: "Practising breathing, and starting to dream.",
    points: [
      "Your baby opens and closes their eyes and practises breathing movements.",
      "They have periods of dream-like (REM) sleep.",
      "They can tell your voice apart from others, and are laying down fat.",
    ] },
  { from: 30, size: "a cabbage", measure: "about 39 cm, 1.3 kg",
    headline: "Filling out, with a fast-growing brain.",
    points: [
      "Your baby is putting on fat and getting stronger.",
      "The brain is growing rapidly and developing its folds.",
      "You may feel rhythmic jolts, these are hiccups, and are normal.",
    ] },
  { from: 32, size: "a squash", measure: "about 42 cm, 1.7 kg",
    headline: "Most systems mature, and often settling head-down.",
    points: [
      "Most of your baby's systems are well developed.",
      "Many babies are settling into a head-down position ready for birth.",
      "They practise sucking and swallowing, getting ready to feed.",
    ] },
  { from: 34, size: "a cantaloupe melon", measure: "about 45 cm, 2.1 kg",
    headline: "The lungs are maturing.",
    points: [
      "The lungs are nearly ready to breathe air on their own.",
      "The protective vernix coating thickens.",
      "There's less room to move now, so movements feel different, but should not reduce.",
    ] },
  { from: 36, size: "a romaine lettuce", measure: "about 47 cm, 2.6 kg",
    headline: "Nearly term, and getting into position.",
    points: [
      "The lungs are almost fully ready.",
      "Your baby is shedding the downy lanugo hair.",
      "They're gaining roughly 28 g a day and settling low into your pelvis.",
    ] },
  { from: 37, size: "a bunch of chard", measure: "about 48 cm, 2.9 kg", milestone: "Full term",
    headline: "Now full term: ready for life outside.",
    points: [
      "A birth any time from now is considered normally timed.",
      "Your baby has a strong grasp and well-developed senses.",
      "Their digestive system is ready to handle milk.",
    ] },
  { from: 39, size: "a small watermelon", measure: "about 50 cm, 3.3 kg",
    headline: "Fully developed, adding the final layers of fat.",
    points: [
      "Your baby is fully developed and mainly gaining weight.",
      "The skull bones stay soft and slightly movable to ease the journey through birth.",
      "Their first poo, a dark sticky substance called meconium, is building in the bowel.",
    ] },
  { from: 41, size: "a small pumpkin", measure: "about 51 cm, 3.5 kg",
    headline: "A little overdue is common and usually fine.",
    points: [
      "Going a bit past your due date is normal, most babies arrive within a week or two of it.",
      "You'll be offered a membrane sweep and a conversation about induction.",
      "Your baby keeps growing slowly, so keep reporting any change in movements.",
    ] },
];

function pickLast(week) {
  let chosen = BABY_STAGES[0];
  for (const s of BABY_STAGES) if (s.from <= week) chosen = s;
  return chosen;
}

export function babyStageForWeek(week) {
  return pickLast(week);
}

// Lightweight shape for the "This week" home card.
export function babyForWeek(week) {
  const s = pickLast(week);
  return { size: s.size, dev: s.headline };
}
