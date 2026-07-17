// Interactive "Your body in pregnancy" content, one entry per body system.
// Each system runs the same teaching arc: what's changing (headline figure) ->
// why the body does it -> what she'll feel -> the clever bit -> when it's too
// much. Figures trace to the shared PHYSIOLOGY guide (Soma-Pillay &
// Nelson-Piercy et al). Short HTML (<b>, <em>) is allowed in the string fields
// and rendered via a small trusted-HTML helper.

export const PHYS_ORDER = ["heart", "lungs", "kidneys", "gut"];

export const PHYS_SYSTEMS = {
  heart: {
    key: "heart",
    label: "Heart & blood",
    kicker: "Heart & blood",
    hotspot: { left: "60%", top: "40%" },
    headline: { pre: "By the time your baby comes, you carry nearly ", big: "50% more blood", post: " than before." },
    cardio: true,
    why: [
      "The placenta is a brand-new organ, and it is thirsty. To pass enough oxygen and food across to your baby, it needs a huge, constant blood supply, so your body simply makes more blood.",
      "There is a second reason, and it is clever. You will lose some blood when your baby is born. That extra litre and a half you build up is a <b>safety buffer</b> your body stocks in advance, so a normal birth doesn't leave you short.",
    ],
    feel: [
      ["Why can I feel my heart pounding?", "To move all that extra blood, your heart pumps about <b>40% more every minute</b>, mostly by squeezing harder, and by beating <b>10 to 20 beats a minute faster</b>. Being aware of your heartbeat, or the odd 'skipped' beat, is usually just this."],
      ["Why do I feel faint when I stand up?", "Pregnancy hormones relax and widen your blood vessels, so your blood pressure actually <b>dips in the first half</b> of pregnancy. Standing quickly can briefly drop it further, which is the light-headed feeling."],
      ["Why does lying on my back feel awful later on?", "Your growing womb is heavy. Lying flat lets it press on the big vein that returns blood to your heart, so less blood gets back, your pressure dips and you feel sick or faint. <b>Rolling onto your side lifts it straight off</b>, which is exactly why side-sleeping is advised later on."],
    ],
    clever: "Your blood also becomes deliberately better at clotting, another way your body prepares to survive birth. The trade-off is that pregnancy raises the risk of clots in the legs or lungs, which is why swollen, painful calves are always worth mentioning.",
    flags: [
      ["u", "Breathlessness that comes on suddenly or at rest, chest pain, or fainting more than once: get checked the same day."],
      ["u", "Blood pressure climbing high, with a bad headache, changes to your vision, or sudden swelling: this can be pre-eclampsia. Contact your maternity unit now."],
      ["s", "A hot, swollen, painful calf: mention it promptly, as pregnancy makes clots more likely."],
    ],
  },

  lungs: {
    key: "lungs",
    label: "Lungs & breathing",
    kicker: "Lungs & breathing",
    hotspot: { left: "38%", top: "34%" },
    headline: { pre: "You move about ", big: "40% more air", post: " every minute, yet you are not short of oxygen." },
    why: [
      "Your baby cannot breathe for themselves, so they breathe <b>through you</b>. The waste carbon dioxide your baby makes has to cross the placenta into your blood, and then you breathe it out.",
      "The pregnancy hormone progesterone turns up your breathing drive to make that happen, so you shift more air even while resting. Your oxygen levels stay completely normal, your body is just clearing carbon dioxide for two.",
    ],
    feel: [
      ["Why do I feel like I can't get a full breath?", "This is called <b>air hunger</b>, and it is one of the most common, most alarming-feeling, and most harmless changes in pregnancy. Your brain is simply driving you to breathe a little more. It often starts early, long before the bump is big."],
      ["Why is it worse later on?", "As your baby grows, the womb pushes your diaphragm upwards and gives your lungs less room to expand, so you notice it more climbing stairs or lying down."],
    ],
    clever: "Your body does this mostly by taking <b>deeper</b> breaths, not faster ones, the more efficient way to shift extra air without wearing you out.",
    flags: [
      ["u", "Breathlessness that starts suddenly, is there at rest, or comes with chest pain, a cough, or a racing heart is different from normal air hunger. Get it checked, as it can point to a clot, a chest infection, asthma or anaemia."],
    ],
  },

  kidneys: {
    key: "kidneys",
    label: "Kidneys & fluid",
    kicker: "Kidneys & fluid",
    hotspot: { left: "64%", top: "60%" },
    headline: { pre: "Your kidneys now filter up to ", big: "50–85% more", post: " than before pregnancy." },
    why: [
      "You are clearing waste for two people now, so your kidneys ramp right up and your blood flows through them far faster.",
      "Your body also holds on to a lot more <b>water and salt</b> to fill up all that extra blood volume, which is why a bit of puffiness is part of the deal.",
    ],
    feel: [
      ["Why do I need to wee all the time?", "Two reasons stacked together: your kidneys are making more urine because they're working harder, and lower down, your growing womb is pressing on your bladder so it fills up sooner."],
      ["Why did they say my blood count is low, but it's fine?", "Your blood plasma (the watery part) rises faster than your red cells, so your blood is slightly more <b>watered down</b>. A mildly low haemoglobin can be completely normal, this is often called physiological anaemia. Real iron deficiency is also common though, which is why they check and may suggest iron."],
      ["Why are my ankles and hands puffy?", "The extra fluid your body is holding tends to pool, especially later in the day and in warm weather. Gradual, mild swelling is usually just this."],
    ],
    clever: "Because so much is filtered so fast, small amounts of sugar or protein can spill into your urine harmlessly, which is why a single 'trace' on a dip test is read in context, not panic.",
    flags: [
      ["u", "Sudden swelling of your face, hands or feet, especially with a headache or vision changes: this is the swelling of pre-eclampsia, not ordinary puffiness. Contact your maternity unit."],
      ["s", "Pain or burning when you wee, needing to go urgently, or a temperature: likely a water infection, which is worth treating in pregnancy. Ring your midwife or GP."],
    ],
  },

  gut: {
    key: "gut",
    label: "Stomach & gut",
    kicker: "Stomach & gut",
    hotspot: { left: "40%", top: "52%" },
    headline: { pre: "The same hormone that holds your pregnancy also ", big: "slows your gut down", post: "." },
    why: [
      "Progesterone relaxes muscle throughout your body, including the muscular walls of your stomach and bowel. Everything moves through more slowly.",
      "There is an upside: a slower gut squeezes <b>more nutrients</b> out of your food to pass to your baby. The downside is the familiar heartburn and constipation.",
    ],
    feel: [
      ["Why do I get so much heartburn?", "The same muscle-relaxing effect loosens the valve at the top of your stomach, so acid slips back up more easily, especially when you lie down or later on when the bump presses upward."],
      ["Why am I so constipated?", "Food moving slowly means more water gets reabsorbed from it, so things firm up. Iron tablets, if you take them, add to it."],
    ],
    clever: "None of this is a fault, it is your body prioritising getting every last bit of goodness from your food across to your baby.",
    flags: [
      ["u", "Severe pain high in your tummy or just under your right ribs, especially with a headache, feeling unwell or swelling, is not simple heartburn. It can be a sign of pre-eclampsia or HELLP. Contact your maternity unit."],
      ["s", "Relentless vomiting where you can't keep fluids down: get reviewed, as it can lead to dehydration and needs treating."],
    ],
  },
};

// Cardiac output (% above pre-pregnancy baseline) at a given week, interpolated
// from the shape described in the source review: up ~20% by 8 weeks, peak ~40%
// around 24 weeks, slight fall toward term.
export function cardiacOutputAtWeek(w) {
  const pts = [[0, 0], [8, 20], [16, 33], [24, 40], [30, 39], [40, 34]];
  if (w <= 0) return 0;
  for (let i = 1; i < pts.length; i++) {
    if (w <= pts[i][0]) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
      const t = (w - x0) / (x1 - x0);
      return y0 + (y1 - y0) * t;
    }
  }
  return pts[pts.length - 1][1];
}
