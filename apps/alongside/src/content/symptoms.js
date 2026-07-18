// "Is this normal?" content. Education and safety-netting only: each symptom
// explains what's usually going on (often linking to the body system that
// explains it) and, separately, the signs that mean get seen. It never
// diagnoses, and every red flag resolves to contacting the midwife, maternity
// unit or 111. Conservative throughout; drawn from the red-flag guidance in the
// PHYSIOLOGY systems and standard NHS pregnancy safety-netting.
//
// `top` is the at-a-glance row signal, chosen deliberately:
//   u = never ignore, always call   s = worth a call   c = usually normal
// The detailed "when to get seen" items carry their own level.

export const SYMPTOMS = [
  {
    id: "movements", label: "My baby is moving less, or differently", top: "u",
    terms: ["movements", "kicks", "reduced", "fetal movement", "not moving"],
    normal: "Babies have their own pattern of active and quiet times, and you come to know yours. What matters is a change from your baby's normal, not hitting a set number of kicks.",
    watch: [
      ["u", "If your baby's movements slow down, stop, or feel different from usual, contact your maternity unit straight away, day or night. Never wait until morning, and don't rely on a home doppler. Getting checked is always the right thing to do, even when all turns out well."],
    ],
  },
  {
    id: "bleeding", label: "I'm bleeding from the vagina", top: "u",
    terms: ["bleeding", "blood", "spotting", "bleed"],
    normal: null,
    watch: [
      ["u", "Any vaginal bleeding in pregnancy should be checked. Contact your maternity unit, and go in urgently if the bleeding is heavy or comes with tummy pain."],
    ],
  },
  {
    id: "waters", label: "I think my waters have broken", top: "u",
    terms: ["waters", "fluid", "leaking", "gush", "broke", "trickle"],
    normal: null,
    watch: [
      ["u", "A gush or a slow trickle of fluid can mean your waters have broken. Contact your maternity unit: they'll want to check you and your baby, especially before 37 weeks, or if the fluid is green, brown or bloodstained."],
    ],
  },
  {
    id: "vision", label: "I'm seeing spots, flashing lights or blurring", top: "u",
    terms: ["vision", "spots", "flashing", "blurred", "eyesight", "sight"],
    normal: null,
    watch: [
      ["u", "Changes to your vision, such as spots, flashing lights or blurring, especially with a headache or swelling, can be a warning sign of pre-eclampsia. Contact your maternity unit now."],
    ],
  },
  {
    id: "headache", label: "I have a bad headache", top: "c", system: "heart",
    terms: ["headache", "migraine", "head", "head pain"],
    normal: "Headaches are common in pregnancy, often from hormones, tiredness, dehydration or tension.",
    watch: [
      ["u", "A severe headache, or one that won't go with rest and paracetamol, especially with vision changes, swelling of your face or hands, or pain under your ribs, can be a sign of pre-eclampsia. Contact your maternity unit now."],
    ],
  },
  {
    id: "breathless", label: "I'm short of breath", top: "c", system: "lungs",
    terms: ["breathless", "breathing", "short of breath", "cant breathe", "puffed"],
    normal: "Feeling puffed, or like you can't get a full breath, is very common and usually harmless. Your body is breathing more for two, and later your bump crowds your lungs.",
    watch: [
      ["u", "Breathlessness that comes on suddenly, is there at rest, or comes with chest pain, a cough or a racing heart is different. Get it checked the same day."],
    ],
  },
  {
    id: "swelling", label: "My hands, feet or face are swollen", top: "c", system: "kidneys",
    terms: ["swelling", "swollen", "oedema", "puffy", "ankles", "feet"],
    normal: "Gradual, mild swelling of the ankles and hands is common, especially later in the day and in warm weather, as your body holds more fluid.",
    watch: [
      ["u", "Sudden swelling of your face, hands or feet, especially with a headache or vision changes, is different from ordinary puffiness and can signal pre-eclampsia. Contact your maternity unit."],
      ["s", "A hot, swollen, painful area in one calf can be a clot, and is worth getting checked promptly."],
    ],
  },
  {
    id: "tummypain", label: "I have tummy or pelvic pain", top: "c", system: "womb",
    terms: ["pain", "tummy", "abdominal", "cramp", "stomach", "pelvic"],
    normal: "Brief pains low down as your womb grows, called round ligament pain, are common and ease when you change position. Mild cramps can also be normal.",
    watch: [
      ["u", "Severe or constant pain, or pain high in your tummy or under your right ribs, especially with a headache or feeling unwell, can be serious. Contact your maternity unit now."],
      ["s", "Regular or painful tightenings before 37 weeks may be early labour. Call your maternity unit."],
    ],
  },
  {
    id: "tightenings", label: "My tummy keeps tightening", top: "c", system: "womb",
    terms: ["tightening", "contractions", "braxton hicks", "tight", "tightenings"],
    normal: "Irregular, painless tightenings that come and go and ease with rest are usually Braxton Hicks, your womb practising. They're common in the third trimester.",
    watch: [
      ["s", "If tightenings become regular, painful, or come with bleeding or a gush of fluid before 37 weeks, treat it as possible early labour and call your maternity unit."],
    ],
  },
  {
    id: "itching", label: "I'm really itchy", top: "s",
    terms: ["itch", "itching", "itchy", "cholestasis"],
    normal: "Mild itching is common as your skin stretches over your bump and breasts.",
    watch: [
      ["s", "Itching without a rash, especially on your palms and soles and worse at night, can be a sign of a liver condition of pregnancy (obstetric cholestasis). Ask your midwife for a blood test (bile acids)."],
    ],
  },
  {
    id: "vomiting", label: "I can't stop being sick", top: "s", system: "gut",
    terms: ["sick", "vomiting", "nausea", "hyperemesis", "throwing up", "morning sickness"],
    normal: "Nausea and being sick, especially in the first trimester, is very common and usually eases by around 16 to 20 weeks.",
    watch: [
      ["s", "If you can't keep any fluids or food down, are weeing very little, or feel very unwell, you may be getting dehydrated (hyperemesis). Get reviewed: there are safe treatments that help."],
    ],
  },
  {
    id: "wee", label: "It burns when I wee", top: "s", system: "kidneys",
    terms: ["wee", "urine", "burning", "uti", "infection", "cystitis", "weeing"],
    normal: "Needing to wee often is normal in pregnancy, as your kidneys work harder and your womb presses on your bladder.",
    watch: [
      ["s", "Pain or burning when you wee, needing to go urgently, cloudy or smelly urine, or a temperature can mean a water infection, which is worth treating in pregnancy. Contact your midwife or GP."],
    ],
  },
  {
    id: "fever", label: "I have a temperature or feel unwell", top: "s",
    terms: ["fever", "temperature", "unwell", "flu", "infection", "hot"],
    normal: null,
    watch: [
      ["s", "A temperature of 38°C or above, or feeling generally unwell, is worth checking in pregnancy, as some infections need treating. Contact your midwife, GP or 111."],
      ["u", "Feeling very unwell, with a high temperature, shivering, fast breathing or feeling faint, needs urgent assessment. Call your maternity unit, or 999 if you feel very unwell."],
    ],
  },
  {
    id: "mood", label: "I'm feeling low or very anxious", top: "s",
    terms: ["low", "anxious", "depressed", "mental health", "sad", "worried", "anxiety"],
    normal: "Ups and downs in mood are common with pregnancy hormones and the big changes ahead.",
    watch: [
      ["s", "Feeling persistently low, anxious, or unable to enjoy things is common and treatable, and not something to just ride out. Tell your midwife or GP: your mental health matters as much as the physical."],
      ["u", "If you ever have thoughts of harming yourself, get help now: contact your maternity unit or 111, or call 999 in an emergency."],
    ],
  },
];

export function searchSymptoms(query) {
  const q = query.trim().toLowerCase();
  if (!q) return SYMPTOMS;
  return SYMPTOMS.filter(s =>
    s.label.toLowerCase().includes(q) || s.terms.some(t => t.includes(q))
  );
}
