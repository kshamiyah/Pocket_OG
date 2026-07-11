// GTG27a — Placenta Praevia and Placenta Accreta Spectrum: Diagnosis and
// Management (RCOG Green-top Guideline No. 27a, September 2018). Splits out
// (with GTG27b, vasa praevia) from the 2011 edition of GTG63, which covered
// antepartum haemorrhage more broadly.

export const GTG27A_SECTIONS = [
  {
    id: "gtg27a-definitions-diagnosis",
    gl: "GTG27A",
    condition: "Placenta Praevia & Accreta Spectrum",
    setting: "Antenatal",
    title: "Definitions & Ultrasound Diagnosis",
    tags: [
      "placenta praevia", "low lying placenta", "placenta accreta", "placenta accreta spectrum",
      "pas", "transvaginal scan placenta", "placental lacunae",
    ],
    content: [
      { type: "text", value: "Placenta praevia: the placenta lies directly over the internal cervical os. Low-lying placenta (used beyond 16 weeks): the placental edge is less than 20 mm from the internal os on transabdominal or transvaginal ultrasound, without covering it." },
      { type: "alert", value: "Transvaginal ultrasound (TVS) is superior to transabdominal or transperineal scanning for diagnosing placenta praevia or a low-lying placenta, and is safe — reassure women who are (understandably) apprehensive about a vaginal probe with a low placenta." },
      { type: "subheading", value: "Follow-up scanning pathway" },
      { type: "list", items: [
        "Placenta low-lying or praevia at the routine (~20-week) anomaly scan → rescan with TVS at around 32 weeks to check for persistence.",
        "Still low-lying or praevia at 32 weeks, and asymptomatic → a further TVS at around 36 weeks to confirm the final position and guide the mode and timing of birth.",
        "Most low-lying placentas identified at the anomaly scan resolve by the third trimester as the lower segment develops — a 32-week rescan avoids over-calling praevia based on the mid-trimester scan alone.",
      ]},
      { type: "subheading", value: "Placenta accreta spectrum (PAS) — who to suspect it in" },
      { type: "list", items: [
        "Previous caesarean section — risk rises with the number of previous caesareans, especially combined with an anterior low-lying placenta or praevia overlying the scar.",
        "Other previous uterine surgery — myomectomy, hysteroscopic surgery, endometrial ablation, uterine curettage, uterine artery embolisation.",
        "IVF conception.",
        "Placenta praevia diagnosed antenatally — the strongest single antenatal flag when combined with any previous uterine surgery.",
      ]},
      { type: "subheading", value: "Ultrasound features suggesting PAS" },
      { type: "list", items: [
        "Loss of the normal retroplacental clear (hypoechoic) zone",
        "Myometrial thinning under the placenta",
        "Placental lacunae — irregular vascular spaces giving a 'Swiss cheese' appearance",
        "Bladder wall interruption, or bulging of the placenta into the bladder",
        "Increased vascularity at the uterovesical interface, and bridging vessels crossing the myometrial-placental or placental-bladder border on colour Doppler",
      ]},
      { type: "text", value: "MRI can be a useful adjunct where ultrasound is equivocal, or to assess posterior placentation or the degree of parametrial invasion — request it through, or in discussion with, the specialist PAS/MDT team rather than as a routine addition to every scan." },
    ],
  },

  {
    id: "gtg27a-classification",
    gl: "GTG27A",
    condition: "Placenta Praevia & Accreta Spectrum",
    setting: "Antenatal",
    title: "Classifying the Spectrum",
    tags: [
      "placenta accreta classification", "placenta increta", "placenta percreta",
      "abnormally invasive placenta",
    ],
    content: [
      { type: "text", value: "\"Placenta accreta spectrum\" (PAS) is the preferred umbrella term, replacing the older single label 'placenta accreta' — it spans a range of abnormal trophoblast invasion depth:" },
      { type: "list", items: [
        "Accreta — chorionic villi attach directly to the myometrial surface, without the normal intervening decidua, but without deep invasion into the muscle.",
        "Increta — villi invade into the myometrium itself.",
        "Percreta — invasion extends through the myometrium and uterine serosa, and can involve adjacent pelvic organs (classically the bladder).",
      ]},
      { type: "alert", value: "The clinical management question that matters most is not the precise histological label but whether the MDT anticipates the placenta will separate normally at birth — any degree of PAS carries a high risk of massive obstetric haemorrhage if separation is forced." },
    ],
  },

  {
    id: "gtg27a-antenatal-management",
    gl: "GTG27A",
    condition: "Placenta Praevia & Accreta Spectrum",
    setting: "Antenatal",
    title: "Antenatal Management",
    tags: [
      "placenta praevia bleeding", "placenta praevia corticosteroids", "placenta praevia digital examination",
      "placenta praevia admission", "pas mdt referral",
    ],
    flowchartId: "GTG27A_PAS",
    content: [
      { type: "alert", value: "Avoid digital vaginal examination in a woman with a known low-lying placenta or placenta praevia — any manipulation of the placenta risks precipitating major haemorrhage." },
      { type: "list", items: [
        "A single course of antenatal corticosteroids is recommended between 34+0 and 35+6 weeks for women with a low-lying placenta or praevia, given the raised risk of preterm and/or unplanned birth; give it earlier if additional risk factors for preterm birth are present.",
        "Advise on symptoms that need immediate review — any vaginal bleeding, contractions, or pain — and give written information along with a clear plan for emergency presentation.",
        "There isn't a single mandated admission policy — many asymptomatic women with a stable placenta praevia and no bleeding are managed as outpatients with rapid access to the unit; base the decision on distance from hospital, home support, and bleeding history, and set this out explicitly in the woman's antenatal plan.",
      ]},
      { type: "subheading", value: "Refer to a specialist PAS multidisciplinary team when" },
      { type: "list", items: [
        "Ultrasound (± MRI) suggests a high probability of PAS.",
        "Placenta praevia is confirmed in a woman with any previous uterine surgery, especially previous caesarean section.",
      ]},
      { type: "text", value: "Referral should happen antenatally, in time to plan the birth — not as a same-day discovery in theatre. The specialist team should include senior obstetric, anaesthetic and neonatal input, with agreed access to blood products, critical care and interventional radiology." },
    ],
  },

  {
    id: "gtg27a-delivery",
    gl: "GTG27A",
    condition: "Placenta Praevia & Accreta Spectrum",
    setting: "Delivery Planning",
    title: "Planning & Managing the Birth",
    tags: [
      "placenta praevia caesarean timing", "placenta accreta hysterectomy", "conservative management placenta accreta",
      "leaving placenta in situ", "massive obstetric haemorrhage pas", "cell salvage",
    ],
    flowchartId: "GTG27A_PAS",
    content: [
      { type: "subheading", value: "Timing" },
      { type: "list", items: [
        "Uncomplicated placenta praevia, no suspicion of PAS: planned caesarean section around 36–37 weeks.",
        "Suspected placenta accreta spectrum: planned birth typically brought forward, commonly discussed in the 35–37 week range — balance the risk of prematurity against the risk of a bleeding emergency if labour starts first. Confirm the exact planned date with the MDT rather than a fixed rule.",
        "Bring delivery forward for active bleeding, labour, or any other obstetric indication regardless of the planned elective date.",
      ]},
      { type: "subheading", value: "On the day — for suspected/confirmed PAS" },
      { type: "list", items: [
        "Deliver in a specialist centre with the full MDT present: senior obstetrician experienced in PAS surgery, senior anaesthetist, availability of cross-matched blood and major haemorrhage protocol activation, cell salvage, and neonatal team.",
        "Plan the surgical approach in advance — usually a midline or high transverse skin incision and a uterine incision sited away from the placenta, to deliver the baby without disturbing it.",
        "Do not attempt to forcibly separate a placenta that shows any sign of PAS — this is the step that precipitates catastrophic haemorrhage.",
      ]},
      { type: "subheading", value: "Definitive management options" },
      { type: "list", items: [
        "Planned caesarean hysterectomy, leaving the placenta in situ (not attempting removal), is the standard definitive approach for confirmed PAS.",
        "Conservative management — leaving all or part of the placenta in situ and allowing it to resorb or be removed later — is an option in selected cases where fertility preservation matters greatly, but it carries real risks of delayed haemorrhage and infection, needs intensive follow-up, and should only be pursued after full counselling and with the MDT's agreement.",
        "Interventional radiology (e.g. prophylactic balloon catheters) is used in some centres as an adjunct — evidence for routine benefit is mixed, and its use should follow local specialist practice rather than being assumed as standard.",
      ]},
    ],
  },
];
