// GTG27b — Vasa Praevia: Diagnosis and Management
// (RCOG Green-top Guideline No. 27b, September 2018)

export const GTG27B_SECTIONS = [
  {
    id: "gtg27b-definition-risk",
    gl: "GTG27B",
    condition: "Vasa Praevia",
    setting: "Antenatal",
    title: "Definition, Types & Risk Factors",
    tags: [
      "vasa praevia", "velamentous cord insertion", "bilobed placenta", "succenturiate lobe",
      "fetal vessels membranes",
    ],
    content: [
      { type: "alert", value: "Vasa praevia: unprotected fetal blood vessels run through the membranes, over or near the internal cervical os, without the support of placental tissue or Wharton's jelly. If these membranes rupture — spontaneously or artificially — the vessels can tear, causing rapid fetal exsanguination. This is a fetal, not maternal, emergency." },
      { type: "subheading", value: "Types" },
      { type: "list", items: [
        "Type 1 — velamentous cord insertion, with the unprotected vessels running from the insertion site across or near the os.",
        "Type 2 — a bilobed placenta or a placenta with a succenturiate (accessory) lobe, with vessels running between the lobes across or near the os.",
      ]},
      { type: "subheading", value: "Risk factors" },
      { type: "list", items: [
        "Velamentous cord insertion, or a bilobed/succenturiate-lobed placenta.",
        "A low-lying placenta or placenta praevia in the second trimester that then appears to resolve on later scanning — the placental tissue itself may have 'moved' up and out of the lower segment, but vessels that ran through it at the time can remain behind, unsupported.",
        "Multiple pregnancy.",
        "IVF conception.",
      ]},
      { type: "text", value: "A meaningful minority of cases have no identifiable risk factor — a normal risk profile does not exclude it, though targeted scanning in women who do have risk factors is the practical route to antenatal diagnosis." },
    ],
  },

  {
    id: "gtg27b-diagnosis-management",
    gl: "GTG27B",
    condition: "Vasa Praevia",
    setting: "Antenatal",
    title: "Diagnosis & Antenatal Management",
    tags: [
      "vasa praevia diagnosis", "vasa praevia ultrasound", "vasa praevia colour doppler",
      "vasa praevia corticosteroids", "vasa praevia admission", "vasa praevia elective caesarean",
    ],
    flowchartId: "GTG27B_VASA",
    content: [
      { type: "alert", value: "There is no national universal screening programme for vasa praevia. Diagnosis rests on targeted transvaginal ultrasound with colour Doppler in women with risk factors — checking cord insertion site and placental morphology at the routine anomaly scan makes this achievable without a dedicated extra visit for most women." },
      { type: "list", items: [
        "Outcomes hinge entirely on antenatal diagnosis: survival is reported at over 95% (up to ~97% in the largest cohorts) when vasa praevia is diagnosed antenatally and birth is by planned caesarean section before labour or membrane rupture — set against a fetal mortality rate of around 60% when it presents unexpectedly in labour, usually after membrane rupture.",
        "Once diagnosed, the goal of antenatal management is to safely prolong the pregnancy while minimising the risk of unplanned rupture of membranes or labour before the planned birth.",
      ]},
      { type: "subheading", value: "Practical antenatal plan" },
      { type: "list", items: [
        "Give antenatal corticosteroids from around 32 weeks, given the raised risk of needing preterm birth.",
        "Asymptomatic women with a stable, reassuring cervical length are reasonable candidates for outpatient care with clear safety-netting; admission is often considered from around 30–32 weeks, or sooner for a shortening cervix, bleeding, contractions, or multiple pregnancy — agree the exact threshold with the woman and her specialist team rather than applying a single fixed rule.",
        "Plan elective caesarean section before the expected onset of labour — commonly in the 34–36 week range — specifically to avoid spontaneous rupture of membranes with vessels intact.",
        "Make sure the woman knows to come in immediately for any bleeding, however light, or any suggestion of waters breaking — this is not a 'wait and see' symptom in vasa praevia.",
      ]},
    ],
  },

  {
    id: "gtg27b-emergency",
    gl: "GTG27B",
    condition: "Vasa Praevia",
    setting: "Emergency",
    title: "Emergency Presentation — Bleeding or Ruptured Membranes",
    tags: [
      "vasa praevia bleeding emergency", "vasa praevia category 1 caesarean", "vasa praevia rupture of membranes",
      "fetal exsanguination",
    ],
    flowchartId: "GTG27B_VASA",
    content: [
      { type: "alert", value: "Any vaginal bleeding after rupture of membranes in a woman with known or suspected vasa praevia is a fetal emergency until proven otherwise — deliver by immediate category 1 caesarean section. Do not wait for CTG confirmation of fetal compromise if the history fits; the fetal blood volume lost from torn unsupported vessels is small in absolute terms but catastrophic for the baby." },
      { type: "list", items: [
        "Undiagnosed vasa praevia rupturing in labour classically presents as sudden, painless, bright red vaginal bleeding at the time of membrane rupture, with an acute change in the fetal heart trace (bradycardia, sinusoidal trace, or terminal deceleration) — this combination should prompt immediate category 1 delivery even before any test can confirm fetal blood.",
        "Alert the neonatal team in advance where possible — the baby may be born profoundly anaemic and need immediate resuscitation, including likely blood transfusion.",
        "For a woman with a known, antenatally diagnosed vasa praevia who presents with any bleeding or suspected membrane rupture before her planned elective date, treat it the same way — immediate category 1 caesarean section, not expectant assessment.",
      ]},
    ],
  },
];
