export const CG623_SECTIONS = [
  {
    id: "ep-criteria", gl: "CG623", condition: "Ectopic Pregnancy", setting: "MTX — Selection & Exclusion Criteria",
    flowchartId: "CG623_MTX",
    title: "Ectopic Pregnancy — MTX Eligibility",
    tags: ["ectopic","ectopic pregnancy","methotrexate","mtx","selection criteria","eligibility","bhcg","beta hcg","unruptured","haemodynamically stable","adnexal mass","35mm","lft","fbc","u+e","folic acid","live ectopic","cardiac activity","exclusion","contraindication","ectopic criteria"],
    content: [
      { type: "subheading", value: "Patient Selection Criteria" },
      { type: "list", items: ["No significant pain","No intrauterine pregnancy","Unruptured ectopic pregnancy (diagnosed with BHCG and TVS) — mass <35mm, no fetal heart activity","BHCG value <1500 IU/litre — consider conservative management (see Ectopic Pregnancy GL1061)","BHCG values <1500 IU/litre AND conservative management criteria not met or not successful — offer as first line (NICE 2019)","BHCG level 1500–5000 IU/litre — offer MTX or surgery (NICE 2019), haemodynamically stable","Normal LFTs, U&Es and FBC","Failed surgical treatment","Treatment should begin if levels plateau","If levels are rising — exclude intrauterine pregnancy before starting treatment","Patient aware of possible lengthy follow-up (average 35 days) and able to comply"] },
      { type: "subheading", value: "Exclusion Criteria (MTX Contraindicated)" },
      { type: "list", items: ["Cardiac activity in ectopic pregnancy (live ectopic)","Adnexal mass ≥35mm diameter","Evidence of intra-peritoneal haemorrhage (clinical or on TVS)","Active pulmonary disease","Active infection or immuno-suppressed state including steroid use","Peptic ulcer or ulcerative colitis","Hepatic dysfunction, thrombocytopenia (platelets <100), blood dyscrasia (WCC <2), severe anaemia","Breastfeeding","Patient unsure of choice of treatment","Difficulty/unwillingness of patient for prolonged follow-up (average 35 days)"] },
    ]
  },
  {
    id: "ep-protocol", gl: "CG623", condition: "Ectopic Pregnancy", setting: "MTX Treatment Protocol",
    title: "Ectopic Pregnancy — MTX Treatment & Monitoring",
    tags: ["ectopic","ectopic pregnancy","methotrexate","mtx","50mg","treatment","protocol","day 1","day 4","day 7","bhcg monitoring","second dose","cytotoxic","im injection","intramuscular","registrar","consultant","follow up","bhcg","weekly","15 percent"],
    content: [
      { type: "subheading", value: "Treatment Steps" },
      { type: "list", items: ["Registrar review and Consultant agreement — especially if decision based on single ultrasound scan","Counsel the patient and explain treatment protocol — discuss surgical/medical options","Informed consent using eConsent — include off-label ('off label') use of methotrexate","Record height and weight","Organise baseline blood tests: FBC, G&S, LFTs, U&Es and BHCG","Prescribe methotrexate 50mg/m²","Methotrexate given by appropriately trained staff in line with Trust cytotoxic drug policy","Patient rests for up to 1 hour post administration — check no local reaction before discharge","Do NOT prescribe anti-D for medical management of ectopic pregnancy (NICE 2019)"] },
      { type: "subheading", value: "BHCG Monitoring Schedule" },
      { type: "table", headers: ["Timepoint","Action"], rows: [["Day 1","BHCG, FBC, LFT, U&E — give methotrexate"],["Day 4","BHCG"],["Day 7","Repeat BHCG and compare to Day 4 BHCG"],[">15% decrease (Day 4→7)","Repeat BHCG weekly until <20 IU/L — treatment successful"],["<15% decrease or rise","Repeat USS + discuss with consultant — consider 2nd dose MTX or surgical management"]] },
      { type: "subheading", value: "If Second Dose Required" },
      { type: "list", items: ["Repeat USS and discuss with on-call consultant before giving 2nd dose","Day 4 post 2nd dose: BHCG","Day 7 post 2nd dose: repeat BHCG and compare to Day 4",">15% decrease → repeat weekly until <20 IU/L","<15% decrease or rise → surgical management"] },
      { type: "subheading", value: "Trans-vaginal Scan (TVS)" },
      { type: "text", value: "Avoid vaginal examination. TVS may be undertaken during the first treatment week or subsequently if clinically indicated (suboptimal BHCG decline between Days 4–7, or patient symptomatic with worsening pain)." },
    ]
  },
  {
    id: "ep-outcomes", gl: "CG623", condition: "Ectopic Pregnancy", setting: "Outcomes & Clinician Information",
    title: "Ectopic MTX — Outcomes & Clinician Information",
    tags: ["ectopic","outcomes","success rate","tubal patency","recurrence","follow up","bhcg","resolution","rupture risk","tubal rupture","fertility","35 days","mean time","10 percent","surgery","second dose"],
    content: [
      { type: "subheading", value: "Outcomes" },
      { type: "list", items: ["65.5% to 94% successful treatment with single dose regime","Recurrent ectopic pregnancy rate 10–20%","Tubal patency approximately 80%","10% of patients require surgery — for ruptured ectopic pregnancy or BHCG not declining as expected","Mean time to resolution is 35 days","BHCG levels may initially rise between days 1–4 (up to 86% of patients)","14% of medically treated women will require more than one dose of methotrexate","Risk of tubal rupture is 7% — risk remains while there is persistent BHCG","No difference in subsequent fertility rates between medical or surgical treatment"] },
      { type: "subheading", value: "When to Seek Urgent Help — Attend ED" },
      { type: "list", items: ["Severe or worsening abdominal pain","Dizziness or feeling faint","Shoulder tip pain","Any other concern during treatment"] },
    ]
  },
  {
    id: "ep-patientinfo", gl: "CG623", condition: "Ectopic Pregnancy", setting: "Patient Information",
    title: "Ectopic MTX — Patient Information & Advice",
    tags: ["ectopic","methotrexate","side effects","contraception","avoid","alcohol","folic acid","sunlight","pregnancy after ectopic","3 months","avoid pregnancy","vaginal bleeding","abdominal pain","days 3 to 7","patient advice","discharge instructions","off label"],
    content: [
      { type: "alert", value: "Pregnancy should be avoided for 3 months after methotrexate has been given, because of possible teratogenic effect. Use barrier contraception (RCOG)." },
      { type: "subheading", value: "What to Expect" },
      { type: "list", items: ["Up to 75% of patients may experience (worsening) abdominal pain on days 3–7 — thought to be due to tubal miscarriage; usually lasts 4–12 hours; attend ED urgently if pain is severe or associated with dizziness or shoulder tip pain","BHCG levels may initially rise between days 1–4","Some women will experience vaginal bleeding — from dark brown spotting to heavier bright red loss, lasting a few days to weeks; contact EPU if excessive or concerning","Prolonged follow-up (up to 7 weeks) required — blood tests until BHCG <20 u/L","A further dose of methotrexate may be necessary"] },
      { type: "subheading", value: "Things to Avoid During Treatment" },
      { type: "list", items: ["Alcohol or folic acid containing vitamins — may interfere with the effectiveness of methotrexate treatment","Sexual intercourse until resolution of the ectopic pregnancy","Exposure to sunlight","Heavy lifting","Maintain ample fluid intake"] },
      { type: "subheading", value: "Side Effects" },
      { type: "list", items: ["Side effects of the drug are minimal but may include nausea, vomiting, stomatitis and diarrhoea","Treatment is recommended by NICE and is proven to work in selected patients"] },
    ]
  },
];
