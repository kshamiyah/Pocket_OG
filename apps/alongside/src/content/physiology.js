// Interactive "Your body in pregnancy" content, one entry per body system.
//
// Each system runs the same teaching arc, with layered depth:
//   headline  -> the figure, as a headline
//   why       -> why the body does it (tied to the baby / to birth)
//   feel      -> what she'll feel, each connected to its mechanism
//   deeper    -> "Go deeper: the medicine", the fuller explanation and numbers
//   clever    -> a moment of "my body is remarkable"
//   checks    -> what her antenatal appointments check about this system, and why
//   flags     -> when it's the normal change gone too far
//
// Figures trace to the shared PHYSIOLOGY guide (Soma-Pillay & Nelson-Piercy et
// al) and standard UK antenatal references. Short HTML (<b>, <em>) is allowed
// in string fields and rendered through a trusted-HTML helper. Conservative,
// decision-aid framing throughout.

export const PHYS_ORDER = ["heart", "lungs", "womb", "breasts", "kidneys", "gut", "hormones", "metabolism"];

export const PHYS_SYSTEMS = {
  heart: {
    key: "heart", label: "Heart & blood", kicker: "Heart & blood",
    hotspot: { left: "52%", top: "39%" },
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
    deeper: [
      ["Where the extra output comes from", "Your heart's output is stroke volume (how much it pushes per beat) times heart rate. Early on, most of the 40% rise comes from a bigger <b>stroke volume</b>, as the heart muscle grows a little and fills more. Towards term, stroke volume tails off but your faster heart rate keeps the output up. Cardiac output is already up about 20% by 8 weeks and peaks around 20 to 28 weeks."],
      ["Why your blood pressure dips then climbs", "A pregnancy hormone signal (helped by nitric oxide) relaxes your blood vessels, dropping the resistance they offer by about a quarter. Your blood pressure falls through the first and second trimesters, reaching its lowest around the middle, then drifts back toward your normal by the third. This is why booking-in blood pressure is your baseline, and a later rise is read against it."],
      ["The pre-eclampsia connection", "In pre-eclampsia the vessels do the opposite and tighten, and they get leaky. Blood pressure rises and fluid escapes into the tissues, which is why the danger signs cluster together: high blood pressure, protein in the urine, sudden swelling, headache and visual changes. It is the normal 'relaxed, well-supplied' state going into reverse."],
    ],
    clever: "Your blood also becomes deliberately better at clotting, another way your body prepares to survive birth. The trade-off is that pregnancy raises the risk of clots in the legs or lungs, which is why swollen, painful calves are always worth mentioning.",
    checks: "At every appointment they check your <b>blood pressure</b> and dip your <b>urine for protein</b>. Together these are the main screen for pre-eclampsia, which is why they are done so often even when you feel well.",
    flags: [
      ["u", "Breathlessness that comes on suddenly or at rest, chest pain, or fainting more than once: get checked the same day."],
      ["u", "Blood pressure climbing high, with a bad headache, changes to your vision, or sudden swelling: this can be pre-eclampsia. Contact your maternity unit now."],
      ["s", "A hot, swollen, painful calf: mention it promptly, as pregnancy makes clots more likely."],
    ],
  },

  lungs: {
    key: "lungs", label: "Lungs & breathing", kicker: "Lungs & breathing",
    hotspot: { left: "38%", top: "31%" },
    headline: { pre: "You move about ", big: "40% more air", post: " every minute, yet you are not short of oxygen." },
    why: [
      "Your baby cannot breathe for themselves, so they breathe <b>through you</b>. The waste carbon dioxide your baby makes has to cross the placenta into your blood, and then you breathe it out.",
      "The pregnancy hormone progesterone turns up your breathing drive to make that happen, so you shift more air even while resting. Your oxygen levels stay completely normal, your body is just clearing carbon dioxide for two.",
    ],
    feel: [
      ["Why do I feel like I can't get a full breath?", "This is called <b>air hunger</b>, and it is one of the most common, most alarming-feeling, and most harmless changes in pregnancy. Your brain is simply driving you to breathe a little more. It often starts early, long before the bump is big."],
      ["Why is it worse later on?", "As your baby grows, the womb pushes your diaphragm upwards and gives your lungs less room to expand, so you notice it more climbing stairs or lying down."],
    ],
    deeper: [
      ["It is deeper breaths, not faster ones", "The extra air comes almost entirely from breathing more <b>deeply</b> (a bigger tidal volume), not from a faster rate. Your resting breathing rate barely changes, which is why a genuinely fast breathing rate is taken seriously rather than shrugged off as 'just pregnancy'."],
      ["Why your blood turns slightly alkaline", "Breathing off extra carbon dioxide nudges your blood chemistry, so your body quietly lowers its bicarbonate to rebalance. The result is a mild, fully compensated shift that is completely normal in pregnancy. It also means a 'normal' non-pregnant carbon dioxide level in a breathless pregnant woman can actually be a warning sign, because hers should be lower."],
    ],
    clever: "Your body does this mostly by taking <b>deeper</b> breaths, not faster ones, the more efficient way to shift extra air without wearing you out.",
    flags: [
      ["u", "Breathlessness that starts suddenly, is there at rest, or comes with chest pain, a cough, or a racing heart is different from normal air hunger. Get it checked, as it can point to a clot, a chest infection, asthma or anaemia."],
    ],
  },

  womb: {
    key: "womb", label: "Womb & bump", kicker: "Womb & bump",
    hotspot: { left: "52%", top: "62%" },
    headline: { pre: "Your womb grows from the size of a pear to roughly a ", big: "watermelon", post: ", and about 15 times heavier." },
    why: [
      "Your womb is mostly muscle. Through pregnancy those muscle fibres grow dramatically, both longer and thicker, to make room for your baby, the placenta and the waters, and to have the power to push at the end.",
      "It also builds a huge new blood supply. Near term, something like a fifth of all the blood your heart pumps is going to your womb and placenta, feeding your baby.",
    ],
    feel: [
      ["Why do I get sharp pains down the sides of my bump?", "As the womb rises out of the pelvis, the <b>round ligaments</b> that anchor it stretch. Sudden movements, standing up or a cough can tug them, giving a sharp, brief pain low down on one or both sides. It usually eases when you change position."],
      ["What are the painless tightenings?", "These are <b>Braxton Hicks</b>, your womb practising its squeeze. They are irregular, come and go, and settle with rest. They become more noticeable in the third trimester."],
      ["Why can I feel my baby move more at certain times?", "Babies have sleep and wake cycles, and are often livelier when you are resting or after you eat. What matters is <b>your baby's own usual pattern</b>, not a set number, so you learn what is normal for them."],
    ],
    deeper: [
      ["Braxton Hicks versus real labour", "Practice tightenings are irregular, do not get steadily stronger or closer together, and ease if you rest, move or have a drink. Labour contractions build a rhythm, get longer, stronger and closer, and carry on whatever you do. Before 37 weeks, regular painful tightenings should always be reported, as they can be premature labour."],
      ["Why movements are your baby's report card", "A baby who is well and well-fed moves in their usual pattern. A drop in movements can be an early sign your baby is not getting quite enough from the placenta, and it can be the only sign, which is why it is never something to 'wait and see' on. Home dopplers are discouraged because a heartbeat can be reassuring falsely."],
    ],
    clever: "Your womb knows to grow without going into labour, held quiet by progesterone, then switches to powerful, coordinated contractions only at the end. That controlled switch is one of the most tightly managed processes in the body.",
    checks: "From around 24 weeks a midwife measures your bump (<b>symphysis-fundal height</b>) in centimetres, which loosely tracks your weeks, to keep a rough eye on growth. If it is out of step, they arrange a <b>growth scan</b> rather than guessing.",
    flags: [
      ["u", "Any reduction or change in your baby's usual movements: contact your maternity unit straight away, day or night, every time."],
      ["u", "Regular or painful tightenings before 37 weeks, a gush or trickle of fluid, or any vaginal bleeding: contact your maternity unit."],
      ["s", "Round ligament pain that is severe, constant, or comes with a temperature or feeling unwell is worth a call, as it is more than simple stretching."],
    ],
  },

  breasts: {
    key: "breasts", label: "Breasts", kicker: "Breasts",
    hotspot: { left: "60%", top: "32%" },
    headline: { pre: "Your breasts begin getting ready to feed your baby ", big: "from the first weeks", post: ", long before birth." },
    why: [
      "Pregnancy hormones (oestrogen, progesterone and later prolactin) build new milk-making glands and their ducts, and pull in a richer blood supply. This is why tender, fuller breasts are often one of the earliest signs of pregnancy.",
      "By the second half of pregnancy your breasts can already make <b>colostrum</b>, the first, concentrated milk, so your baby has something ready from the very first feed.",
    ],
    feel: [
      ["Why are my breasts so sore and tingly early on?", "The glandular tissue is growing fast and the blood flow is rising, which makes them feel heavy, tender and sometimes tingly. It often settles after the first trimester as your body adjusts."],
      ["Why have my nipples gone darker?", "Raised pregnancy hormones increase pigment, darkening the nipple and the area around it (the areola). One idea is that it helps a newborn, who sees in low contrast, find the nipple. The small bumps on the areola are glands that keep the skin protected."],
      ["Why am I leaking already?", "Some women leak a little colostrum in later pregnancy. It is a normal sign the plumbing works and is nothing to worry about, though not leaking is just as normal."],
    ],
    deeper: [
      ["Why milk does not pour out during pregnancy", "The hormone that makes milk, prolactin, is high in pregnancy, but the high <b>progesterone</b> from the placenta keeps full milk production switched off. When the placenta is delivered, progesterone drops away sharply, and that fall is the trigger that brings your milk 'in' a few days after birth."],
    ],
    clever: "Your breasts run on a supply-and-demand system that sets up before your baby even arrives, so that within days of birth a newborn's suckling can drive a full milk supply on demand.",
    flags: [
      ["s", "A new, hard, or growing lump, skin dimpling, or blood-stained discharge from one nipple should be checked, as breast changes still need attention in pregnancy."],
      ["s", "A red, hot, painful area with feeling feverish (more common after birth once feeding) can be a breast infection and is worth a prompt call."],
    ],
  },

  kidneys: {
    key: "kidneys", label: "Kidneys & fluid", kicker: "Kidneys & fluid",
    hotspot: { left: "64%", top: "52%" },
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
    deeper: [
      ["Why 'normal' kidney blood tests look different", "Because your kidneys filter so much faster, they clear waste chemicals like creatinine and urea more effectively, so their levels in your blood <b>fall</b>. A creatinine that would be reassuringly normal outside pregnancy can actually be too high for pregnancy, which is why pregnancy has its own reference ranges."],
      ["Why sugar and protein can appear in your urine", "So much is filtered so quickly that the kidney tubules cannot always reabsorb every last bit, so small amounts of glucose or protein can spill into the urine harmlessly. This is why a single 'trace' is interpreted in context, but persistent protein, especially with high blood pressure, is taken seriously as a pre-eclampsia sign."],
      ["Why urine infections matter more now", "The same hormones relax the tubes draining your kidneys, so urine sits and drains more slowly. That still, warm plumbing lets bacteria multiply, so a symptomless infection is more likely to climb to the kidneys. This is why your urine is sometimes sent to the lab even when you feel fine."],
    ],
    clever: "Because so much is filtered so fast, small amounts of sugar or protein can spill into your urine harmlessly, which is why a single 'trace' on a dip test is read in context, not panic.",
    checks: "The <b>urine dip</b> at your appointments is quietly doing three jobs: protein (pre-eclampsia), glucose (diabetes) and signs of infection. A <b>full blood count</b> at booking and around 28 weeks checks for anaemia.",
    flags: [
      ["u", "Sudden swelling of your face, hands or feet, especially with a headache or vision changes: this is the swelling of pre-eclampsia, not ordinary puffiness. Contact your maternity unit."],
      ["s", "Pain or burning when you wee, needing to go urgently, or a temperature: likely a water infection, which is worth treating in pregnancy. Ring your midwife or GP."],
    ],
  },

  gut: {
    key: "gut", label: "Stomach & gut", kicker: "Stomach & gut",
    hotspot: { left: "40%", top: "50%" },
    headline: { pre: "The same hormone that holds your pregnancy also ", big: "slows your gut down", post: "." },
    why: [
      "Progesterone relaxes muscle throughout your body, including the muscular walls of your stomach and bowel. Everything moves through more slowly.",
      "There is an upside: a slower gut squeezes <b>more nutrients</b> out of your food to pass to your baby. The downside is the familiar heartburn and constipation.",
    ],
    feel: [
      ["Why do I get so much heartburn?", "The same muscle-relaxing effect loosens the valve at the top of your stomach, so acid slips back up more easily, especially when you lie down or later on when the bump presses upward."],
      ["Why am I so constipated?", "Food moving slowly means more water gets reabsorbed from it, so things firm up. Iron tablets, if you take them, add to it."],
      ["Why was I so sick early on?", "Morning sickness tracks the pregnancy hormone hCG, which peaks toward the end of the first trimester. It usually eases by around 16 to 20 weeks as hCG falls, though for some it lasts longer."],
    ],
    deeper: [
      ["Why anaesthetists treat you as 'full stomach'", "A relaxed valve plus slow stomach emptying means the acid contents of your stomach can come back up more easily. Under general anaesthetic that carries a risk of it reaching the lungs, which is why pregnant women are given antacids and a specific, careful technique for any operation. It is a direct, practical consequence of the physiology."],
      ["When sickness is more than morning sickness", "About 1 in 100 women get hyperemesis gravidarum, severe vomiting with weight loss and dehydration that needs treatment, sometimes in hospital. It is not 'just' morning sickness and there are effective anti-sickness medicines that are safe in pregnancy, so it is worth asking rather than suffering."],
    ],
    clever: "None of this is a fault, it is your body prioritising getting every last bit of goodness from your food across to your baby.",
    flags: [
      ["u", "Severe pain high in your tummy or just under your right ribs, especially with a headache, feeling unwell or swelling, is not simple heartburn. It can be a sign of pre-eclampsia or HELLP. Contact your maternity unit."],
      ["s", "Relentless vomiting where you can't keep fluids down: get reviewed, as it can lead to dehydration and needs treating."],
    ],
  },

  hormones: {
    key: "hormones", label: "Hormones", kicker: "Hormones · the conductors",
    headline: { pre: "Almost everything you feel traces back to a handful of ", big: "hormones", post: " running the whole show." },
    why: [
      "Pregnancy is orchestrated by chemical messengers. Understanding the main few makes almost every other change click into place, because they are the reason behind so much of it.",
      "Early on your ovary, and then the placenta, take over as a powerful hormone factory, keeping the pregnancy going and tuning your whole body to support it.",
    ],
    feel: [
      ["hCG, the pregnancy-test hormone", "Made by the early placenta, hCG is what a pregnancy test detects. It roughly <b>doubles every couple of days</b> in the beginning, holds the pregnancy in the first weeks, and its peak lines up with the worst of the nausea."],
      ["Progesterone, the great relaxer", "It keeps the womb quiet and relaxes smooth muscle everywhere, which explains reflux, constipation, slower urine drainage, and stuffy nose all at once. One hormone, many symptoms."],
      ["Oestrogen, the builder", "It drives blood flow, and the growth of your womb and breasts. It is behind the pregnancy 'glow', extra vaginal discharge, and some of the skin changes."],
      ["Relaxin, the loosener", "It softens ligaments and joints to let your pelvis open for birth. Helpful at the end, but it is also why joints ache and the pelvis can feel unstable."],
    ],
    deeper: [
      ["Why the first trimester is the hardest, then eases", "In the first weeks the pregnancy runs on hormones from a small structure on your ovary (the corpus luteum), and rising hCG makes many women feel rough. Around 10 to 12 weeks the <b>placenta takes over</b> hormone production, hCG falls from its peak, and this handover is a big part of why nausea and exhaustion so often lift in the second trimester."],
      ["Why your thyroid and blood sugar shift too", "hCG looks similar enough to the thyroid's own signal that it nudges the thyroid in early pregnancy, and placental hormones deliberately blunt your response to insulin later on. This is why thyroid and glucose are watched, and why some women need support with either, it is the hormones doing their job, sometimes a little too well."],
    ],
    clever: "The placenta is not just a filter, it is one of the most active hormone-producing organs your body will ever grow, and you build it from scratch in a few months, then deliver it and take it all down again.",
    flags: [
      ["s", "Feeling persistently low, anxious, or unable to enjoy things is common and treatable, and not a hormone you should just 'ride out'. Tell your midwife or GP, perinatal mental health matters as much as the physical."],
    ],
  },

  metabolism: {
    key: "metabolism", label: "Blood sugar & energy", kicker: "Blood sugar & energy",
    headline: { pre: "In the second half of pregnancy your body becomes ", big: "deliberately resistant to insulin", post: "." },
    why: [
      "Insulin is the hormone that moves sugar out of your blood and into your cells. In later pregnancy, placental hormones make your body <b>less responsive</b> to it, on purpose.",
      "The point is to keep a little more sugar in your bloodstream for longer after meals, so more of it crosses the placenta to fuel your growing baby. Your body shifts to burning more fat for its own energy, sparing the sugar for the baby.",
    ],
    feel: [
      ["Why am I so hungry, then suddenly shaky?", "Your body is juggling fuel differently. You may feel hungrier as your baby's demands rise, and shaky or light-headed if you go too long without eating, because between meals your body drops your own sugar to preserve supply for the baby. Small, regular meals help."],
      ["Why am I so tired, especially early and late?", "Early on, high progesterone is genuinely sedating. Later, you are carrying more weight, sleeping less well, and running a metabolism working for two, so tiredness is real and physical, not a lack of effort."],
    ],
    deeper: [
      ["What gestational diabetes actually is", "For most women the extra insulin their pancreas makes keeps up with the resistance, and blood sugar stays normal. <b>Gestational diabetes</b> is simply when the pancreas cannot quite keep up, so sugar runs higher than ideal. It is common, usually has no symptoms, and is why higher-risk women are offered a glucose test (the GTT) around 24 to 28 weeks, exactly when insulin resistance peaks."],
      ["Why it matters, and why it usually settles", "Higher sugar crosses to the baby, who can grow larger and make extra of their own insulin, which is why it is managed with diet, monitoring and sometimes medication. Because the cause is the placenta's hormones, blood sugar usually returns to normal soon after birth, though it flags a higher future risk worth knowing about."],
    ],
    clever: "Your body performs a precise balancing act, loosening its own sugar control just enough to feed your baby, without, for most women, ever tipping into a problem.",
    checks: "Around <b>24 to 28 weeks</b>, if you have risk factors, you may be offered a <b>glucose tolerance test</b>: a fasting blood test, a sugary drink, then another blood test, timed to catch the peak of insulin resistance.",
    flags: [
      ["s", "Excessive thirst, weeing far more than the usual pregnancy amount, or a big appetite with tiredness can be signs of high blood sugar worth mentioning."],
      ["s", "If you have gestational diabetes and your monitored sugars run high, or your baby's movements change, contact your team, good control protects your baby."],
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
