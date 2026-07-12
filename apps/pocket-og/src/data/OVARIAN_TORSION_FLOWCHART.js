// Ovarian Torsion: acute assessment & management.
// Original interactive pathway synthesised for Pocket O&G from the TOG review
// (Bailey F, Moore G, De A, Holland T. Ovarian torsion: a modern approach to
// management. The Obstetrician & Gynaecologist 2025;27:221-30, DOI
// 10.1111/tog.12985). Cross-links to GTG62 (suspected ovarian masses) and
// GTG5 (OHSS). Decision support only, not a protocol. Verify against local guidance.

export const TOG_OVARIAN_TORSION_FLOWCHART = {
  id: "TOG_OVARIAN_TORSION",
  title: "Ovarian Torsion: Emergency",
  subtitle: "TOG review (Bailey, 2025) · suspect, image, operate",
  startId: "suspect",
  nodes: {

    "suspect": {
      type: "action",
      title: "Suspect Ovarian Torsion",
      text: "Consider in any female with sudden-onset, unilateral, severe lower abdominal or pelvic pain, which may fluctuate. Torsion is 2-3% of acute gynaecological presentations and is more common on the right.",
      items: [
        "Associated nausea and vomiting are common (vomiting in ~41%); tachycardia in ~11%, fever uncommon",
        "May have a palpable adnexal mass and suprapubic tenderness",
        "Higher risk: ovarian cyst (especially >50 mm), pregnancy (12-18% of torsions; commonest 10-17 weeks), assisted reproduction (~11-fold), post tubal-sterilisation, PCOS/multicystic ovaries, previous torsion",
      ],
      next: "imaging",
    },

    "imaging": {
      type: "action",
      title: "First-line Imaging: Transvaginal Ultrasound ± Doppler",
      text: "Ultrasound is first-line, but only about 40% of torsions are diagnosed pre-operatively, so it cannot rule the diagnosis out.",
      items: [
        "Suggestive signs: asymmetrically enlarged ovary with peripheral follicle displacement, whirlpool sign (twisted pedicle), follicular ring sign, free fluid, a displaced ovary",
        "MRI can help when the presentation is non-specific or in pregnancy; CT has no role (ovarian irradiation)",
        "Identify the normal-appearing contralateral ovary to establish the affected side",
      ],
      next: "caveat",
    },

    "caveat": {
      type: "alert",
      title: "A Normal Scan Does Not Exclude Torsion",
      text: "Transvaginal ultrasound aids the diagnosis when findings are positive; if negative, it does not override the need for laparoscopy when clinical suspicion is high (Bailey 2025).",
      items: [
        "The decision to operate is clinical, not radiological",
        "Delay risks ovarian infarction; prompt intervention allows ovarian preservation",
      ],
      next: "decide",
    },

    "decide": {
      type: "decision",
      title: "Is Clinical Suspicion of Torsion High?",
      options: [
        { label: "Yes, or symptoms severe", sublabel: "Regardless of a normal scan", next: "surgery" },
        { label: "Low, another diagnosis more likely", sublabel: "A clear alternative cause is found", next: "reassess" },
      ],
    },

    "reassess": {
      type: "end",
      title: "Reassess & Safety-net",
      text: "If torsion is genuinely unlikely, investigate and treat the alternative cause, but keep torsion in mind.",
      items: [
        "Safety-net: return immediately if pain worsens or recurs",
        "Have a low threshold to re-image or proceed to diagnostic laparoscopy if the picture changes",
      ],
    },

    "surgery": {
      type: "action",
      title: "Urgent Gynaecology Referral for Laparoscopy",
      text: "Refer urgently for diagnostic laparoscopy. Laparoscopy is preferred over laparotomy, with comparable ovarian recovery and no increase in thromboembolism.",
      items: [
        "Do not delay surgery for further imaging if suspicion is high",
        "In pregnancy, laparoscopy remains appropriate; involve seniors and anaesthetics",
      ],
      next: "manage",
    },

    "manage": {
      type: "end",
      title: "Detorsion & Ovarian Conservation",
      text: "Conservative detorsion, with cystectomy if a cyst is present, is the modern mainstay in premenopausal women, to preserve fertility.",
      items: [
        "Conserve the ovary even if it looks blue-black: ovarian function is preserved after detorsion",
        "Oophorectomy is described as harmful and unnecessary in this setting yet is still often performed; avoid it in premenopausal women unless clearly indicated",
        "Consider oophoropexy (low threshold) where there is a non-correctable cause or recurrent torsion, though no standardised technique exists",
        "Treat the underlying cause (e.g. cyst) to reduce recurrence",
      ],
    },

  },
};
