export const NG133_SECTIONS = [
  {
    id: "ng133-overview", gl: "NG133", condition: "Hypertension in Pregnancy", setting: "Overview & Classification",
    title: "Hypertension in Pregnancy — Definitions & Classification",
    tags: ["hypertension","PIH","pregnancy induced hypertension","gestational hypertension","pre-eclampsia","PET","chronic hypertension","white coat","definition","classification","mild","moderate","severe","systolic","diastolic","140","160","110","proteinuria","PCR","ABPM","HBPM"],
    content: [
      { type: "subheading", value: "Types of Hypertension in Pregnancy" },
      { type: "table", headers: ["Type", "Definition"], rows: [
        ["Chronic hypertension", "Hypertension present before 20 weeks gestation or pre-existing diagnosis. May be essential or secondary."],
        ["Gestational hypertension (PIH)", "New hypertension ≥20 weeks gestation without proteinuria or other features of pre-eclampsia"],
        ["Pre-eclampsia", "Gestational hypertension + proteinuria (PCR >30 mg/mmol) OR ≥1 adverse condition (renal, liver, neurological, haematological, uteroplacental)"],
        ["White coat hypertension", "Clinic BP ≥140/90 but daytime ABPM or HBPM average <135/85 — manage as normal, monitor closely"],
        ["Masked hypertension", "Normal clinic BP but raised on ABPM/HBPM — increased risk, requires monitoring"],
      ]},
      { type: "subheading", value: "BP Severity Thresholds" },
      { type: "table", headers: ["Severity", "Systolic", "Diastolic"], rows: [
        ["Mild", "140–149 mmHg", "90–99 mmHg"],
        ["Moderate", "150–159 mmHg", "100–109 mmHg"],
        ["Severe", "≥160 mmHg", "≥110 mmHg"],
      ]},
      { type: "subheading", value: "Confirming Diagnosis" },
      { type: "list", items: [
        "Use validated automated devices for BP measurement in pregnancy",
        "If clinic BP ≥140/90: offer ABPM or HBPM to confirm — do not diagnose hypertension on single clinic reading alone",
        "ABPM daytime average ≥135/85 or HBPM average ≥135/85: confirms hypertension",
        "Repeat clinic BP if ABPM/HBPM not immediately available and BP is not severely elevated",
      ]},
      { type: "alert", value: "Severe hypertension (≥160/110) is an emergency — do not delay treatment awaiting ABPM confirmation." },
    ]
  },
  {
    id: "ng133-prevention", gl: "NG133", condition: "Hypertension in Pregnancy", setting: "Prevention & Risk Stratification",
    title: "Hypertension in Pregnancy — Prevention & Aspirin",
    tags: ["aspirin","prevention","risk factors","pre-eclampsia prevention","uterine artery doppler","calcium","first trimester","12 weeks","high risk","moderate risk","placenta growth factor","PlGF","biomarker","75mg","150mg","antioxidants","vitamins"],
    content: [
      { type: "subheading", value: "Who Needs Aspirin?" },
      { type: "text", value: "Offer aspirin 75–150 mg daily from 12 weeks until birth to women with any HIGH-risk factor or ≥2 MODERATE-risk factors:" },
      { type: "table", headers: ["Risk Level", "Factors"], rows: [
        ["High risk (1 factor = prescribe aspirin)", "Previous pre-eclampsia; chronic kidney disease; autoimmune disease (SLE or antiphospholipid syndrome); type 1 or type 2 diabetes; chronic hypertension"],
        ["Moderate risk (need ≥2 factors)", "First pregnancy; age ≥40; interpregnancy interval >10 years; BMI ≥35 kg/m² at booking; family history of pre-eclampsia (mother or sister); multiple pregnancy"],
      ]},
      { type: "subheading", value: "Other Preventive Measures" },
      { type: "list", items: [
        "Calcium supplementation (≥1 g/day): offer to women with low calcium intake (<600 mg/day)",
        "Do NOT offer antioxidants (vitamins C and E) to prevent pre-eclampsia — no benefit",
        "Do NOT advise bed rest or salt restriction to prevent pre-eclampsia",
        "Do NOT offer nitric oxide donors, progesterone, or diuretics for prevention",
      ]},
      { type: "subheading", value: "First-Trimester Screening" },
      { type: "list", items: [
        "Combined first-trimester screening (PAPP-A + uterine artery Doppler + MAP + PlGF) at 11–13+6 weeks identifies >90% of early-onset pre-eclampsia",
        "PlGF testing (<100 pg/ml at 20–34+6 weeks) helps rule in/out developing pre-eclampsia in symptomatic women",
        "Uterine artery Doppler at 20–24 weeks: if bilateral notching or RI >0.58, increased risk of PE and SGA",
      ]},
      { type: "alert", value: "Aspirin should be started as early as possible in the first trimester (by 16 weeks at latest) for maximum benefit in preventing early-onset pre-eclampsia." },
    ]
  },
  {
    id: "ng133-gestational", gl: "NG133", condition: "Hypertension in Pregnancy", setting: "Gestational Hypertension (PIH)",
    title: "Gestational Hypertension — Outpatient & Inpatient Management",
    tags: ["gestational hypertension","PIH","pregnancy induced hypertension","outpatient","community","clinic","admit","admission","labetalol","nifedipine","antihypertensive","monitoring","blood tests","urine","proteinuria","CTG","ultrasound","delivery","37 weeks","38 weeks","fetal monitoring","BP target","135/85"],
    content: [
      { type: "subheading", value: "Initial Assessment" },
      { type: "list", items: [
        "Admit for initial assessment and investigation",
        "Urine PCR, FBC, LFTs, U&E, uric acid — to exclude pre-eclampsia",
        "If blood tests and urine normal: may be managed as outpatient after initial assessment",
        "Fetal assessment: CTG and USS with umbilical artery Doppler at diagnosis",
      ]},
      { type: "subheading", value: "Management by Severity" },
      { type: "table", headers: ["Severity", "Treatment", "BP Monitoring", "Blood Tests", "Delivery"], rows: [
        ["Mild (140–149/90–99)", "No antihypertensives required; outpatient care appropriate", "Twice weekly", "Weekly: FBC, LFTs, U&E, uric acid", "Offer at 37+0 weeks"],
        ["Moderate (150–159/100–109)", "Start antihypertensive; target BP ≤135/85", "Daily", "Twice weekly", "Offer at 37+0 weeks"],
        ["Severe (≥160/110)", "Urgent treatment within 30–60 min; admit", "Every 15 mins until stable, then hourly", "Every 48 hrs", "Expedite if not controlled"],
      ]},
      { type: "subheading", value: "Antihypertensive Treatment" },
      { type: "list", items: [
        "First line: labetalol oral 100 mg BD — titrate to 200–400 mg TDS (avoid in asthma, cardiac failure)",
        "Second line: nifedipine MR 10 mg BD — titrate to 40–80 mg BD",
        "Third line: methyldopa 250 mg BD–TDS — stop within 2 days of delivery",
        "BP target: ≤135/85 mmHg antenatally",
      ]},
      { type: "subheading", value: "Fetal Monitoring" },
      { type: "list", items: [
        "At diagnosis: CTG if any concerns; USS with growth and umbilical artery Doppler",
        "Mild gestational hypertension with normal investigations: USS every 2–4 weeks; no routine CTG unless clinical indication",
        "If abnormal Dopplers or growth concern: increase to fortnightly USS; CTG more frequently",
        "Monitor for symptoms of pre-eclampsia at every visit: headache, epigastric pain, visual disturbance",
      ]},
      { type: "alert", value: "Gestational hypertension can progress to pre-eclampsia — check urine PCR and repeat bloods at every antenatal visit." },
    ]
  },
  {
    id: "ng133-preeclampsia", gl: "NG133", condition: "Hypertension in Pregnancy", setting: "Pre-Eclampsia Management",
    title: "Pre-Eclampsia — Antenatal Management & Delivery",
    tags: ["pre-eclampsia","PET","management","antihypertensive","magnesium sulphate","MgSO4","eclampsia","severe","HELLP","fetal monitoring","CTG","USS","Doppler","delivery","timing","34 weeks","37 weeks","corticosteroids","steroids","PlGF","fibrinogen","platelet","platelet transfusion","fresh frozen plasma","FFP"],
    content: [
      { type: "alert", value: "All women with pre-eclampsia should be managed in a consultant-led unit. Do not manage as outpatient." },
      { type: "subheading", value: "Monitoring" },
      { type: "list", items: [
        "BP every 4 hours minimum (more frequent if severe)",
        "Daily urine output, blood tests every 48 hours (FBC, LFTs, U&E, uric acid)",
        "Urine PCR: no need to repeat once pre-eclampsia is confirmed",
        "CTG: not routine unless clinical concern — Doppler surveillance is more informative",
        "USS with growth and umbilical artery Doppler every 2 weeks; MCA if fetal compromise suspected",
        "Strict fluid balance — restrict to 80 ml/hr; avoid fluid overload",
      ]},
      { type: "subheading", value: "Antihypertensive Target" },
      { type: "list", items: [
        "Target BP: ≤135/85 mmHg antenatally",
        "Severe hypertension (≥160/110): treat urgently — IV labetalol, IV hydralazine, or oral nifedipine",
        "Aim to reduce severe BP within 30–60 minutes of diagnosis",
      ]},
      { type: "subheading", value: "Magnesium Sulphate (MgSO4)" },
      { type: "list", items: [
        "For eclampsia: 4 g IV loading dose over 5 minutes; maintenance 1 g/hr for ≥24 hours",
        "Consider for women with severe pre-eclampsia with high risk of eclampsia (CNS features, severe hypertension not responding, HELLP)",
        "Monitor: reflexes, respiration, urine output — antidote is calcium gluconate 10 ml 10% IV",
      ]},
      { type: "subheading", value: "Timing of Delivery" },
      { type: "table", headers: ["Scenario", "Recommendation"], rows: [
        ["Mild/moderate pre-eclampsia ≥37 weeks", "Offer birth"],
        ["Severe pre-eclampsia 34–36+6 weeks", "Offer birth after stabilisation (corticosteroids if <35 weeks)"],
        ["Pre-eclampsia <34 weeks", "Senior obstetric decision; corticosteroids; consider MgSO4; in-utero transfer if NICU not available"],
        ["Refractory severe hypertension or deteriorating maternal/fetal condition", "Deliver regardless of gestation after stabilisation"],
        ["HELLP syndrome", "Consider delivery after corticosteroids if ≥34 weeks; haematology input; platelets if <50 × 10⁹/L before surgery"],
      ]},
    ]
  },
  {
    id: "ng133-chronic", gl: "NG133", condition: "Hypertension in Pregnancy", setting: "Chronic Hypertension",
    title: "Chronic Hypertension in Pregnancy — Management",
    tags: ["chronic hypertension","pre-existing","essential hypertension","ACE inhibitor","ARB","stop medication","labetalol","methyldopa","nifedipine","amlodipine","aspirin","booking","surveillance","growth scan","uterine artery","target","<140/90","secondary hypertension","renal","deliver","37 weeks"],
    content: [
      { type: "subheading", value: "Pre-Conception / Booking Advice" },
      { type: "list", items: [
        "STOP: ACE inhibitors and ARBs — teratogenic in second and third trimester (renal dysplasia, oligohydramnios); stop as soon as pregnancy confirmed",
        "STOP: diuretics — reduce placental perfusion; switch to alternative",
        "START: safe alternatives — labetalol, nifedipine MR, methyldopa, or amlodipine",
        "Aspirin 75–150 mg from 12 weeks (high-risk for pre-eclampsia)",
        "Investigate for secondary hypertension if young, severe, or poorly controlled",
      ]},
      { type: "subheading", value: "BP Targets & Treatment" },
      { type: "list", items: [
        "Target BP: <140/90 mmHg throughout pregnancy",
        "If BP <140/90 on no medication: monitoring only — treatment not routinely required below 140/90",
        "If BP ≥150/100: antihypertensive treatment recommended",
        "Titrate medication to maintain BP 110–140/80–90 mmHg",
      ]},
      { type: "subheading", value: "Surveillance" },
      { type: "list", items: [
        "Urine dipstick at every antenatal visit — prompt PCR if proteinuria develops",
        "Uterine artery Doppler at 20–24 weeks",
        "Fetal growth USS at 28 and 32–34 weeks; additional scans if concerns",
        "More frequent antenatal visits — consultant-led care",
        "Thrombophilia and antiphospholipid antibody screen if clinically indicated",
      ]},
      { type: "subheading", value: "Delivery" },
      { type: "list", items: [
        "Uncomplicated chronic hypertension on stable medication: offer delivery at 37+0 weeks",
        "If superimposed pre-eclampsia develops: manage as per pre-eclampsia pathway",
        "Mode of delivery: vaginal birth not contraindicated unless other obstetric indications",
      ]},
      { type: "alert", value: "Stopping ACE inhibitors and ARBs is the single most important intervention when a woman with pre-existing hypertension presents in early pregnancy." },
    ]
  },
  {
    id: "ng133-postnatal", gl: "NG133", condition: "Hypertension in Pregnancy", setting: "Postnatal Care",
    title: "Hypertension in Pregnancy — Postnatal Care & Future Pregnancy",
    tags: ["postnatal","post natal","after delivery","antihypertensive","stop medication","reduce","labetalol","nifedipine","enalapril","captopril","amlodipine","breastfeeding","methyldopa","discharge","follow up","GP","6 weeks","6-8 weeks","future pregnancy","recurrence risk","cardiovascular risk","CVD","specialist referral"],
    content: [
      { type: "subheading", value: "Immediate Postnatal Management" },
      { type: "list", items: [
        "Continue antihypertensives postnatally — aim for BP ≤140/90",
        "If on methyldopa: switch within 2 days of delivery (risk of postnatal depression)",
        "BP monitoring: every 4 hours for 24 hours post-delivery, then at least daily for 3 days (or until discharge if earlier)",
        "Watch for postnatal BP surge — most common 3–5 days postpartum",
      ]},
      { type: "subheading", value: "Safe for Breastfeeding" },
      { type: "list", items: [
        "Labetalol: safe — first choice",
        "Nifedipine MR: safe",
        "Enalapril or captopril: safe — good ACE inhibitor choice postnatally",
        "Amlodipine: safe",
        "Avoid: ARBs (insufficient safety data for breastfeeding); diuretics (reduce milk supply)",
      ]},
      { type: "subheading", value: "Discharge & Community Follow-Up" },
      { type: "table", headers: ["Timepoint", "Action"], rows: [
        ["Discharge", "BP <150/100; stable or reducing medication; written plan for community"],
        ["Days 3–5", "Community BP check — high risk of BP surge"],
        ["2 weeks", "Medical review if still on antihypertensive"],
        ["6–8 weeks", "Review all women with gestational hypertension or pre-eclampsia — GP or obstetric clinic"],
        ["6–8 weeks (still on AHT)", "Refer to hypertension specialist for ongoing management"],
        ["6–8 weeks (still proteinuric)", "GP/renal referral — check for underlying kidney disease"],
      ]},
      { type: "subheading", value: "Future Pregnancy & Long-Term Risk" },
      { type: "list", items: [
        "Recurrence risk of gestational hypertension: ~20–50%",
        "Recurrence risk of pre-eclampsia: ~16% overall; higher if early or severe first episode",
        "Aspirin 75–150 mg from 12 weeks in next pregnancy — especially if severe or early-onset PE",
        "Long-term cardiovascular risk: women who had PE have 2× lifetime risk of CVD, stroke, hypertension",
        "Advise healthy lifestyle: BP monitoring, weight management, no smoking",
        "Pre-conception counselling if planning future pregnancy",
      ]},
    ]
  },
];
