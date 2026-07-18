// GTG27a — Placenta Praevia and Placenta Accreta Spectrum: Diagnosis and
// Management (RCOG Green-top Guideline No. 27a, fifth edition, 2026;
// Jauniaux et al, BJOG 2026, doi:10.1111/1471-0528.70239, accepted 30 March
// 2026). Supersedes the 2018 fourth edition. Vasa praevia stays in GTG27b.
//
// Key shifts from 2018: corticosteroids are now given selectively (not
// routinely) when imminent preterm birth is anticipated; routine MRI is not
// recommended where ultrasound expertise including TVS is available; a trial
// of labour may be offered for an asymptomatic low-lying placenta 11–20 mm
// from the os after 36 weeks; a caesarean scar ectopic pregnancy section is
// added; and methotrexate should not be used when the placenta is left in situ.

export const GTG27A_SECTIONS = [
  {
    id: "gtg27a-definitions-diagnosis",
    gl: "GTG27A",
    condition: "Placenta Praevia & Accreta Spectrum",
    setting: "Antenatal",
    title: "Definitions & Ultrasound Diagnosis",
    tags: [
      "placenta praevia", "low lying placenta", "placenta accreta", "placenta accreta spectrum",
      "pas", "transvaginal scan placenta", "placental lacunae", "abnormally invasive placenta",
    ],
    content: [
      { type: "text", value: "Beyond 16 weeks, report the placenta as praevia when its edge reaches or covers the internal cervical os, and as low-lying when the leading edge is less than 20 mm from the os without covering it (20 mm or more is normal). This ultrasound classification replaces the older clinical terms (marginal, partial) and better predicts the risk of bleeding." },
      { type: "alert", value: "Transvaginal ultrasound (TVS) is superior to transabdominal or transperineal scanning for a low-lying placenta or praevia, and is safe. Reassure women who are apprehensive about a vaginal probe with a low placenta." },
      { type: "subheading", value: "Follow-up scanning pathway" },
      { type: "list", items: [
        "Placental location is recorded at the 18+0 to 20+6 week fetal anomaly scan. Most placentas that look low then have resolved by 32 weeks as the lower segment develops.",
        "Low-lying or praevia at the anomaly scan: offer a follow-up TVS at around 32 weeks by an experienced operator to plan delivery.",
        "Still low-lying or praevia at 32 weeks and asymptomatic: a further TVS at 36 weeks confirms the final position and guides the mode and timing of birth.",
      ]},
      { type: "subheading", value: "Placenta accreta spectrum (PAS) — who to suspect it in" },
      { type: "text", value: "Most PAS now arises from placentation into a caesarean scar defect. Identify women at high risk (a previous caesarean birth with an anterior low-lying placenta or praevia overlying the scar) at the first antenatal appointment, and screen for PAS signs at the 18+0 to 20+6 week anomaly scan." },
      { type: "list", items: [
        "Previous caesarean section: risk rises with the number of previous caesareans, especially with an anterior low-lying placenta or praevia over the scar.",
        "Other previous uterine surgery: curettage, hysteroscopic surgery, endometrial ablation, uterine artery embolisation, myomectomy.",
        "IVF conception.",
        "Placenta praevia diagnosed antenatally: the strongest single antenatal flag when combined with any previous uterine surgery.",
      ]},
      { type: "subheading", value: "Ultrasound features suggesting PAS" },
      { type: "list", items: [
        "Loss of the normal retroplacental clear (hypoechoic) zone",
        "Myometrial thinning under the placenta",
        "Placental lacunae: irregular vascular spaces giving a 'Swiss cheese' appearance",
        "Bladder wall interruption, or bulging of the placenta into the bladder",
        "Increased vascularity at the uterovesical interface, and bridging vessels crossing the myometrial-placental or placental-bladder border on colour Doppler",
      ]},
      { type: "alert", value: "Where ultrasound expertise including TVS is available, routine MRI is not recommended. Reserve MRI for equivocal ultrasound, posterior placentation, or assessing the extent of parametrial or bladder involvement, and request it through the specialist PAS team." },
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
      "figo pas classification", "abnormally invasive placenta",
    ],
    content: [
      { type: "text", value: "\"Placenta accreta spectrum\" (PAS) is the preferred umbrella term, replacing the older labels 'placenta accreta' and 'abnormally invasive placenta'. It describes a range of abnormal villous attachment depth, graded at birth (FIGO 2019 classification):" },
      { type: "list", items: [
        "Accreta (creta/adherenta): villi attach directly to the myometrial surface, without the normal intervening decidua, but without deep invasion into the muscle.",
        "Increta: villi invade into the myometrium itself.",
        "Percreta: invasion extends through the myometrium and serosa, and can involve adjacent pelvic organs (classically the bladder).",
      ]},
      { type: "text", value: "The evidence now favours PAS being a consequence of uterine scarring with secondary dehiscence and dissection of the lower segment, rather than true spontaneous invasion. A case where the placenta separates normally, or is removed by simple curettage without removing part of the uterine wall, should not be recorded as PAS." },
      { type: "alert", value: "The management question that matters most is not the precise histological grade but whether the MDT anticipates the placenta will separate normally at birth. Any degree of PAS carries a high risk of massive obstetric haemorrhage if separation is forced." },
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
      "placenta praevia tocolysis", "placenta praevia cerclage", "pas mdt referral", "cell salvage placenta praevia",
    ],
    flowchartId: "GTG27A_PAS",
    content: [
      { type: "alert", value: "Avoid digital vaginal examination in a woman with a known low-lying placenta or praevia: manipulating the placenta risks precipitating major haemorrhage." },
      { type: "subheading", value: "Corticosteroids and magnesium sulphate — selective, not routine" },
      { type: "list", items: [
        "Offer a course of antenatal corticosteroids between 24+0 and 34+6 weeks to women in whom imminent preterm birth is anticipated, either established preterm labour or a planned preterm birth for vaginal bleeding. This is a change from the previous routine late-preterm course.",
        "Give magnesium sulphate for neuroprotection up to 30+0 weeks when birth is expected within 24 hours or in established labour.",
        "Discuss the benefit of corticosteroids after 35+0 weeks with the woman. See RCOG GTG74 and NICE NG25 for detail.",
      ]},
      { type: "subheading", value: "Symptomatic placenta praevia" },
      { type: "list", items: [
        "Tocolysis may be considered for up to 48 hours to allow corticosteroids to be given. Cervical cerclage is not recommended.",
        "Provide antenatal care, including hospitalisation, tailored to individual clinical needs and social circumstances.",
        "Screen for anaemia and optimise haemoglobin with iron if indicated, given the high risk of intraoperative and postpartum haemorrhage.",
      ]},
      { type: "subheading", value: "Asymptomatic placenta praevia" },
      { type: "list", items: [
        "Can be cared for as outpatients with a clear plan for emergency presentation: any vaginal bleeding, contractions or pain needs immediate review. Base admission on distance from hospital, home support and bleeding history.",
        "Arrange a senior obstetrician discussion covering the risks of haemorrhage, blood transfusion, hysterectomy and maternal mortality, and document any wish to decline blood products.",
      ]},
      { type: "subheading", value: "Refer to a specialist PAS multidisciplinary team when" },
      { type: "list", items: [
        "Ultrasound suggests a high probability of PAS at the anomaly scan.",
        "Placenta praevia is confirmed in a woman with a previous caesarean or other uterine surgery, especially an anterior placenta over the scar.",
      ]},
      { type: "text", value: "Refer antenatally, in time to plan the birth, not as a same-day discovery in theatre. The specialist centre should have an MDT experienced in complex caesarean surgery, with immediate access to blood products, adult intensive care and neonatology." },
    ],
  },

  {
    id: "gtg27a-delivery",
    gl: "GTG27A",
    condition: "Placenta Praevia & Accreta Spectrum",
    setting: "Delivery Planning",
    title: "Planning & Managing the Birth",
    tags: [
      "placenta praevia caesarean timing", "placenta praevia trial of labour", "placenta accreta hysterectomy",
      "conservative management placenta accreta", "leaving placenta in situ", "massive obstetric haemorrhage pas",
      "cell salvage", "balloon tamponade placenta praevia", "ureteric stents pas",
    ],
    flowchartId: "GTG27A_PAS",
    content: [
      { type: "subheading", value: "Timing" },
      { type: "list", items: [
        "Uncomplicated low-lying placenta or praevia: tailor to antenatal symptoms and plan birth no later than 37+6 weeks.",
        "High probability of PAS, with no preterm-birth risk factors or antenatal bleeding: plan birth at 36+1 to 37+0 weeks, balancing prematurity against the risk of an unscheduled emergency delivery.",
        "Bring delivery forward for active bleeding, labour, or any other obstetric indication regardless of the planned date.",
      ]},
      { type: "subheading", value: "Trial of labour for a low-lying placenta" },
      { type: "text", value: "For a third-trimester asymptomatic low-lying placenta with a placental edge 11 to 20 mm from the internal os after 36 weeks, discuss the option of a trial of labour: more than 80% achieve a vaginal birth without increased morbidity (around 43% vaginal birth at an edge 1 to 10 mm, 85% at 11 to 20 mm)." },
      { type: "subheading", value: "Where to deliver" },
      { type: "list", items: [
        "Arrange birth in a maternity unit with on-site blood transfusion services and access to critical care.",
        "Intraoperative cell salvage is beneficial and safe, and is particularly useful for women who decline donor blood for personal or religious reasons.",
        "For suspected or confirmed PAS, deliver in a specialist centre with the full MDT present: obstetrician experienced in PAS surgery, senior anaesthetist, activated major haemorrhage protocol, cell salvage and neonatal team.",
      ]},
      { type: "subheading", value: "At operation — suspected or confirmed PAS" },
      { type: "list", items: [
        "Plan a uterine incision sited away from the placenta so the baby is delivered without disturbing it.",
        "Do not attempt to separate the placenta from the uterine wall, and do not incise through the placenta for fetal extraction. Forced separation is the step that precipitates catastrophic haemorrhage.",
        "If uterotonics and tranexamic acid fail to control bleeding, use intrauterine balloon tamponade and consider uterine compression sutures.",
      ]},
      { type: "subheading", value: "Definitive management options" },
      { type: "list", items: [
        "Primary caesarean hysterectomy, leaving the placenta in situ (no attempt at removal), is the standard definitive approach for confirmed PAS.",
        "Uterine preservation, or leaving the placenta in situ for expectant management, is an option in selected cases where fertility matters greatly. Both carry a high risk of recurrence in future pregnancies, so discuss contraception.",
        "Where the placenta is left in situ, arrange regular review, ultrasound and rapid access to emergency care for bleeding or infection. Methotrexate should not be used in this context.",
        "Prophylactic ureteric stents are not routinely recommended; involve a urologist where imaging shows major uterine remodelling or hypervascularity of the bladder interface. There is insufficient evidence for the routine use of interventional radiology.",
      ]},
    ],
  },

  {
    id: "gtg27a-caesarean-scar-pregnancy",
    gl: "GTG27A",
    condition: "Placenta Praevia & Accreta Spectrum",
    setting: "Early Pregnancy",
    title: "Caesarean Scar Pregnancy",
    tags: [
      "caesarean scar pregnancy", "caesarean scar ectopic", "csep", "csp", "isthmocele", "niche",
      "caesarean scar defect", "scar pregnancy", "placenta praevia accreta",
    ],
    content: [
      { type: "text", value: "A caesarean scar pregnancy implants into a previous caesarean scar defect (also called an isthmocele or niche). It sits on the continuum that leads to placenta praevia and PAS: most PAS arises from placentation into a caesarean scar defect." },
      { type: "alert", value: "A woman diagnosed with a live caesarean scar ectopic pregnancy at the end of the first trimester who chooses to continue must be counselled by an expert consultant about the high risk of major complications later in pregnancy, including placenta praevia and placenta praevia accreta." },
      { type: "list", items: [
        "Around three-quarters of continuing caesarean scar pregnancies are diagnosed with PAS at birth, and a large proportion experience severe second- or third-trimester bleeding.",
        "Manage diagnosis and counselling in an early-pregnancy service with expertise in caesarean scar pregnancy; a continuing pregnancy needs an antenatal PAS care plan from the outset.",
      ]},
    ],
  },
];
