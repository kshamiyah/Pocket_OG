// Abdominal Pain in Pregnancy — triage & differential (clinical approach).
// Cross-source synthesis, not a single guideline. Decision support only —
// screen for emergencies first, then stratify by gestation. Pending sign-off.

export const ABDO_TRIAGE_FLOWCHART = {
  id: "ABDO_TRIAGE",
  title: "Abdominal Pain in Pregnancy",
  subtitle: "Triage & differential · clinical approach",
  startId: "assess",
  nodes: {

    "assess": {
      type: "action",
      title: "Assess & Screen for Red Flags",
      text: "Abdominal pain in pregnancy is common and often benign — but exclude the emergencies first. Do NOT attribute pain to pregnancy until serious causes are excluded.",
      items: [
        "Rapid ABC and maternal observations (MEOWS)",
        "Pain: site, onset, character, radiation; PV bleeding; fetal movements",
        "Gestation, parity, previous caesarean / uterine surgery, risk factors",
      ],
      next: "redflags",
    },

    "redflags": {
      type: "decision",
      title: "Any Red Flags?",
      text: "Any one of these → treat as an obstetric emergency.",
      options: [
        {
          label: "Yes — one or more present",
          sublabel: [
            "Shock / collapse / heavy PV bleeding",
            "Constant pain + tense, tender 'woody' uterus (abruption)",
            "Sudden tearing pain ± previous scar (uterine rupture)",
            "BP ≥160/110, epigastric/RUQ pain, headache/visual (severe PET/HELLP)",
            "Peritonism / sepsis features / fetal bradycardia or absent FH",
          ],
          next: "emergency",
        },
        { label: "No — haemodynamically stable", sublabel: "Stratify by gestation", next: "gestation" },
      ],
    },

    "emergency": {
      type: "alert",
      title: "Obstetric Emergency — Escalate Now",
      text: "Call for senior obstetric help immediately. Resuscitate and treat the likely cause; continuous fetal monitoring if viable.",
      items: [
        "ABC, two large-bore cannulae, bloods incl. group & crossmatch",
        "Abruption / heavy bleeding → APH pathway (GTG63); activate haemorrhage protocol if unstable",
        "Suspected uterine rupture → immediate senior review, prepare for theatre",
        "Severe pre-eclampsia / HELLP → pre-eclampsia pathway (GL952): control BP, magnesium",
        "Sepsis → Sepsis Six; expedite birth if fetal compromise",
      ],
    },

    "gestation": {
      type: "decision",
      title: "Gestation?",
      text: "The likely causes shift with gestation.",
      options: [
        { label: "Under 12 weeks", sublabel: "Early pregnancy", next: "early" },
        { label: "12–24 weeks", sublabel: "Mid-trimester", next: "mid" },
        { label: "24 weeks or more", sublabel: "Viable / third trimester", next: "late" },
      ],
    },

    "early": {
      type: "end",
      title: "< 12 weeks — Exclude Ectopic First",
      text: "In any woman with a positive pregnancy test and abdominal pain, exclude ectopic pregnancy.",
      items: [
        "Causes: ectopic, miscarriage, ovarian cyst / torsion, UTI, appendicitis, constipation",
        "Assess: obs, abdominal ± speculum/bimanual as appropriate, urine dip / MSU",
        "Bloods: FBC, group & save; serum hCG (serial if location unknown) per local protocol",
        "Transvaginal USS to locate the pregnancy — refer EPU",
        "Escalate: instability or suspected ectopic → immediate gynae / obstetric review",
      ],
    },

    "mid": {
      type: "end",
      title: "12–24 weeks — Mid-trimester",
      text: "Consider obstetric, gynae and surgical causes. Appendicitis is the commonest non-obstetric surgical emergency and may present atypically in pregnancy.",
      items: [
        "Causes: appendicitis, ovarian torsion, UTI / pyelonephritis, fibroid degeneration, round-ligament pain, late miscarriage / threatened preterm labour",
        "Assess: obs / MEOWS, abdominal exam, urine dip / MSU",
        "Bloods: FBC, CRP, U&E, LFT, amylase/lipase as indicated",
        "Imaging: USS (obstetric + abdominal/renal); MRI preferred over CT if a surgical cause is suspected",
        "Escalate: involve surgeons early for peritonism / persistent pain; senior obstetric review",
      ],
    },

    "late": {
      type: "end",
      title: "≥ 24 weeks — Viable / Third Trimester",
      text: "Prioritise obstetric emergencies, monitor the fetus, and still consider non-obstetric causes.",
      items: [
        "Obstetric: labour / preterm labour, abruption, pre-eclampsia / HELLP, uterine rupture (esp. previous scar)",
        "Non-obstetric: appendicitis, UTI / pyelonephritis, cholecystitis, pancreatitis",
        "Assess: obs / MEOWS, CTG, abdominal exam (contractions, tenderness, tone), speculum if bleeding / SROM query",
        "Bloods: FBC, U&E, LFT, urate, CRP; group & save; PET bloods if hypertensive; urine dip / PCR",
        "Escalate: continuous CTG + obstetric review; abruption / PET / rupture → emergency pathway",
      ],
    },

  },
};
