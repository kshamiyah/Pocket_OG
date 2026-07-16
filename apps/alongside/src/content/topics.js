// Patient-voiced topic content for Alongside.
//
// IMPORTANT: this is hand-authored plain-language content, NOT an automatic
// translation of the clinician guideline text. Each topic records the clinician
// guideline code(s) it is `basedOn`, resolved through @pocket-og/guidelines for
// an accurate, always-in-step provenance line. Copy is deliberately
// conservative and frames everything as a decision aid, never a diagnosis.
//
// Section shape per topic:
//   understand    : content blocks (text | list | alert)
//   goodCare      : [{ point, caveat? }]  ("what good care looks like" / "usually normal")
//   goodCareLabel : heading for that section
//   whenSeen      : [{ level: "urgent" | "soon" | "routine", text }]
//   questions     : [string]              (things to say out loud)
//   words         : [{ term, meaning }]

export const TOPICS = [
  {
    id: "heavy-periods",
    area: "Gynae",
    mode: "Advocate",
    title: "Heavy periods",
    blurb: "What counts as heavy, what good care looks like, and how to ask for it.",
    basedOn: ["NG88"],
    understand: [
      { type: "text", value: "“Heavy” is what's heavy for you. A rough guide: changing a pad or tampon every hour or two, passing clots bigger than a 10p coin, bleeding through to your clothes or bedding, or your periods stopping you doing everyday things." },
      { type: "text", value: "Heavy periods are common and there are many effective treatments. They can also quietly make you anaemic (low iron), which is worth checking because it is easily treated." },
    ],
    goodCareLabel: "What good care looks like",
    goodCare: [
      { point: "Your care should start with how the bleeding affects your life, not just test results.", caveat: "If something urgent needs ruling out first, that can reasonably come before treatment. A clinician should be able to explain the order." },
      { point: "You should be offered a blood test to check your iron (a full blood count)." },
      { point: "You should be offered treatment options and a real say in choosing.", caveat: "Some options will not suit your health or plans, for example if you are trying to conceive. That is a conversation, not a closed door." },
      { point: "You do not have to accept heavy periods as “just how you are”. Treatment can begin based on the impact on your life." },
    ],
    whenSeen: [
      { level: "urgent", text: "Bleeding so heavy that you feel faint, dizzy, breathless, or your heart is racing: seek urgent help (call 111 or go to A&E)." },
      { level: "soon", text: "Bleeding between periods or after sex, or periods becoming newly heavy after age 45: get this checked, as it can have causes that need looking at." },
      { level: "routine", text: "Heavy but steady periods that affect your life: book a routine GP appointment. You deserve to have it looked into." },
    ],
    questions: [
      "This is affecting my daily life, and I'd like it investigated, not just managed. What are my options?",
      "Could we check my iron levels?",
      "Would the hormonal coil, or a non-hormonal option like tranexamic acid, suit me?",
      "What would need to happen for you to refer me for a scan or to a specialist?",
    ],
    words: [
      { term: "Hormonal coil (LNG-IUS)", meaning: "A small device placed in the womb that releases a hormone locally and often greatly reduces bleeding. Frequently suggested as a first option, and it also works as contraception." },
      { term: "Tranexamic acid", meaning: "A non-hormonal tablet taken during your period to reduce heavy bleeding. It is not a painkiller and not a contraceptive." },
      { term: "Ferritin", meaning: "A blood test showing your iron stores. Low ferritin points to iron deficiency, a common and treatable cause of tiredness alongside heavy periods." },
      { term: "Ablation", meaning: "A procedure that treats the womb lining to reduce bleeding, one of several options usually discussed if simpler treatments have not helped." },
    ],
  },

  {
    id: "bleeding-after-menopause",
    area: "Gynae",
    mode: "Know the signs",
    title: "Bleeding after menopause",
    blurb: "The one bleeding symptom to never ignore, explained calmly.",
    basedOn: ["GTG67"],
    extraSources: ["NHS / NICE suspected cancer referral (the 2-week-wait pathway)"],
    understand: [
      { type: "alert", value: "Any bleeding a year or more after your last period should be checked, even a single spot, even if it is brown, and even if it happens only once." },
      { type: "text", value: "For around 9 in 10 women, bleeding after menopause is not cancer, often it is a thin, fragile womb lining. But because it can be an early sign of womb cancer, which is very treatable when caught early, this is the one symptom we never wait on." },
    ],
    goodCareLabel: "What good care looks like",
    goodCare: [
      { point: "You should be seen quickly, usually on an urgent (2-week) referral.", caveat: "Being referred urgently is precautionary and completely normal. It does not mean anyone thinks you have cancer." },
      { point: "You can expect an internal (transvaginal) ultrasound to measure the lining of your womb." },
      { point: "Depending on the scan, you may be offered a hysteroscopy (a thin camera) and a small sample of the lining." },
    ],
    whenSeen: [
      { level: "urgent", text: "Very heavy bleeding, or feeling faint or unwell with it: seek urgent help (call 111 or go to A&E)." },
      { level: "soon", text: "Any bleeding or spotting once your periods have stopped for good: contact your GP and ask about an urgent referral. Do not wait to see if it happens again." },
    ],
    questions: [
      "I've had bleeding since my periods stopped. Can I be referred on the urgent (2-week) pathway?",
      "Will I have a scan to measure my womb lining?",
      "What are the possible causes, and what happens after the scan?",
    ],
    words: [
      { term: "Postmenopausal", meaning: "You are considered postmenopausal once you have had no period for 12 months. Bleeding after that point is what needs checking." },
      { term: "Endometrium", meaning: "The lining of your womb. Its thickness on a scan helps decide whether a closer look is needed." },
      { term: "Hysteroscopy", meaning: "A quick look inside the womb with a thin camera, often done in clinic, sometimes with a small sample taken at the same time." },
      { term: "2-week-wait", meaning: "An urgent NHS referral to be seen within two weeks. It is used as a precaution to rule things out quickly, not a diagnosis." },
    ],
  },

  {
    id: "pregnancy-physiology",
    area: "Pregnancy",
    mode: "Understand",
    title: "Your body in pregnancy",
    blurb: "Why you feel so different, what's normal, and what to mention.",
    basedOn: ["PHYSIOLOGY"],
    understand: [
      { type: "text", value: "Pregnancy changes almost every system in your body, often earlier and more than people expect. Most of these changes are completely normal and settle after birth. Knowing what is expected makes it easier to spot what is not." },
      { type: "list", items: [
        "Your heart pumps around 40% more blood than before pregnancy, so feeling puffed on the stairs is expected.",
        "Your blood is more “watered down”, so a slightly low haemoglobin can be normal.",
        "Your kidneys work harder, so you need to wee more often.",
        "Digestion slows down, so heartburn and constipation are common.",
      ]},
    ],
    goodCareLabel: "Usually normal (and when it isn't)",
    goodCare: [
      { point: "Breathlessness when you exert yourself is common and expected, as your heart and lungs do more.", caveat: "But sudden or severe breathlessness, breathlessness at rest, or with chest pain, needs urgent assessment." },
      { point: "Mild swelling of the ankles and hands is common, especially later on.", caveat: "But sudden swelling of the face, hands or feet, especially with a headache or vision changes, can signal pre-eclampsia. Contact your maternity unit." },
      { point: "Heartburn, constipation and needing to wee often are normal parts of pregnancy.", caveat: "But pain or burning when you wee, or a temperature, can mean a urine infection that is worth treating." },
      { point: "Braxton Hicks (irregular, painless tightenings) are your womb practising.", caveat: "But regular or painful tightenings before 37 weeks, or any bleeding or waters breaking, is a reason to call now." },
    ],
    whenSeen: [
      { level: "urgent", text: "Your baby moving less than usual, or a change from their normal pattern: contact your maternity unit straight away, day or night. Never wait." },
      { level: "urgent", text: "A severe headache with vision changes, sudden swelling, or pain just under your ribs: contact your maternity unit now (possible pre-eclampsia)." },
      { level: "urgent", text: "Vaginal bleeding, your waters breaking, or a high temperature: contact your maternity unit." },
      { level: "soon", text: "Itching without a rash, especially on your palms and soles: ask your midwife about a blood test for your liver (bile acids)." },
    ],
    questions: [
      "Is what I'm feeling normal for how far along I am?",
      "Which symptoms should make me call the maternity unit straight away?",
      "Who do I call, and what's the number, day or night?",
    ],
    words: [
      { term: "Braxton Hicks", meaning: "Irregular, usually painless tightenings of the womb that come and go. A normal “practice” for labour." },
      { term: "Trimester", meaning: "Pregnancy is split into three roughly 13 to 14 week thirds. Different changes tend to show up in each." },
      { term: "Reduced fetal movements", meaning: "Fewer movements, or a change from your baby's usual pattern. Always worth an immediate call to your maternity unit." },
      { term: "Oedema", meaning: "Swelling from fluid, common in the ankles and hands in pregnancy. Sudden facial or hand swelling is the kind to report." },
    ],
  },
];

export function getTopic(id) {
  return TOPICS.find(t => t.id === id) ?? null;
}
