// Week-keyed content that powers the "This week" home. Deliberately concise and
// conservative; it seeds the future "My baby" and "My care" tabs. Figures follow
// standard UK antenatal practice (NHS pregnancy week-by-week, NICE NG201
// antenatal care) and the shared PHYSIOLOGY guide. Not medical advice.

// --- Your care: the antenatal schedule, as ranges. ---
const CARE = [
  { from: 5, to: 10, title: "Your booking appointment", detail: "Usually by 10 weeks: booking bloods, blood pressure, urine and screening choices. It's the longest appointment, and it sets your baseline." },
  { from: 11, to: 14, title: "Dating & screening scan", detail: "Around 11 to 14 weeks: confirms your due date and, if you choose, screens for Down's, Edwards' and Patau's syndromes." },
  { from: 15, to: 17, title: "16-week check", detail: "A quick review of your results and how you're feeling, with blood pressure and urine." },
  { from: 18, to: 21, title: "The anomaly scan", detail: "The detailed 20-week scan (18 to 20+6 weeks) checks your baby's development from head to toe, and where your placenta is lying." },
  { from: 22, to: 27, title: "The glucose test window", detail: "If you have risk factors, the glucose tolerance test around 24 to 28 weeks checks for gestational diabetes, timed to when insulin resistance peaks." },
  { from: 28, to: 28, title: "Your 28-week appointment", detail: "Bloods to recheck for anaemia, and anti-D if your blood group is rhesus negative, plus the usual blood pressure and urine." },
  { from: 29, to: 35, title: "Third-trimester checks", detail: "Appointments come more often now: growth, blood pressure and urine, and the start of your birth planning." },
  { from: 36, to: 37, title: "36-week check", detail: "Which way up is your baby? If breech, they'll talk through your options, alongside birth planning." },
  { from: 38, to: 40, title: "Approaching your due date", detail: "Regular checks continue. Your baby's movements matter as much as ever, keep reporting any change straight away." },
  { from: 41, to: 42, title: "If you go past your due date", detail: "Around 41 weeks you'll be offered a membrane sweep and a conversation about induction." },
];

// --- Which body system is most relevant this fortnight, with a one-line hook. ---
const BODY_FOCUS = [
  { from: 1, systemKey: "hormones", hook: "The first trimester runs on hormones, and hCG is behind the nausea and the deep tiredness." },
  { from: 8, systemKey: "gut", hook: "Progesterone is slowing your gut, which is why sickness, reflux and queasiness show up now." },
  { from: 13, systemKey: "heart", hook: "Your blood volume and heart output are climbing fast, so you may notice your heart and energy shifting." },
  { from: 18, systemKey: "womb", hook: "Your womb is rising out of the pelvis, and you may start to feel those first flutters of movement." },
  { from: 24, systemKey: "lungs", hook: "As the bump crowds your lungs, feeling breathless on the stairs becomes common, and it's normal." },
  { from: 28, systemKey: "kidneys", hook: "Your kidneys and bladder are working overtime, which is why you're weeing so often now." },
  { from: 31, systemKey: "metabolism", hook: "Blood sugar is watched closely now, as your body's insulin resistance reaches its peak." },
  { from: 36, systemKey: "breasts", hook: "Your breasts are making colostrum, the first milk, getting ready to feed your baby." },
  { from: 38, systemKey: "womb", hook: "Braxton Hicks tightenings and a body quietly preparing for labour." },
];

function pickLast(list, week) {
  let chosen = list[0];
  for (const item of list) if (item.from <= week) chosen = item;
  return chosen;
}

export function bodyFocusForWeek(week) {
  return pickLast(BODY_FOCUS, week);
}

// Returns the care milestone happening now, or the next one coming up.
export function careForWeek(week) {
  const now = CARE.find(m => week >= m.from && week <= m.to);
  if (now) return { ...now, when: "now" };
  const next = CARE.find(m => m.from > week);
  return next ? { ...next, when: "soon" } : null;
}
