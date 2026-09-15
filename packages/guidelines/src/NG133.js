// NICE NG133 — Hypertension in pregnancy: diagnosis and management.
// Published 25 June 2019, last updated 17 April 2023. Replaces CG107.
// https://www.nice.org.uk/guidance/ng133
//
// Rewritten 15 September 2026 directly from the source PDF, which is in this
// package and served from public/guidelines. The previous version carried a
// great deal of material attributed to NG133 that the guideline does not
// contain: antihypertensive dose ladders, "mild" and "moderate" severity bands
// (a CG107 relic), white coat and masked hypertension, ABPM/HBPM confirmation,
// uric acid, uterine artery doppler, PAPP-A, combined first-trimester
// screening, MCA doppler, calcium supplementation, and PlGF thresholds. All of
// that has been removed rather than re-labelled.
//
// NG133 states NO antihypertensive doses. Where a dose is clinically needed it
// is taken from the BNF and marked as such, matching the app's own Rx formulary
// so the two cannot drift apart. Magnesium dosing is NG133's own (the
// Collaborative Eclampsia Trial regimen, 1.8.4).
//
// NG133 recognises only two degrees: hypertension (140/90 or higher) and severe
// hypertension (over 160/110). There is no mild or moderate band.
//
// Section ids ng133-prevention and ng133-gestational are referenced from
// topics.js and pearls.js respectively, so they are preserved.

export const NG133_SECTIONS = [
  {
    id: "ng133-overview", gl: "NG133", condition: "Hypertension in Pregnancy", setting: "Definitions & Thresholds",
    title: "Hypertension in Pregnancy — Definitions & Diagnostic Thresholds",
    tags: ["hypertension","PIH","pregnancy induced hypertension","gestational hypertension","pre-eclampsia","PET","severe pre-eclampsia","chronic hypertension","eclampsia","HELLP","definition","classification","severe","140/90","160/110","proteinuria","PCR","ACR","protein creatinine ratio","albumin creatinine ratio","30 mg/mmol","8 mg/mmol"],
    flowchartId: "NG133_CLASSIFY",
    content: [
      { type: "alert", value: "NG133 recognises two degrees only: hypertension (140 mmHg systolic or higher, or 90 mmHg diastolic or higher) and severe hypertension (over 160 mmHg systolic or over 110 mmHg diastolic). It defines no mild or moderate band." },
      { type: "subheading", value: "Terms used in this guideline" },
      { type: "table", headers: ["Term", "Definition"], rows: [
        ["Hypertension", "Blood pressure 140 mmHg systolic or higher, or 90 mmHg diastolic or higher"],
        ["Severe hypertension", "Blood pressure over 160 mmHg systolic or over 110 mmHg diastolic"],
        ["Chronic hypertension", "Hypertension present at the booking visit or before 20 weeks, or the woman is already taking antihypertensive medication when referred to maternity services. Primary or secondary in aetiology"],
        ["Gestational hypertension", "New hypertension presenting after 20 weeks without significant proteinuria"],
        ["Eclampsia", "A convulsive condition associated with pre-eclampsia"],
        ["HELLP syndrome", "Haemolysis, elevated liver enzymes and low platelet count"],
      ]},
      { type: "subheading", value: "Pre-eclampsia" },
      { type: "text", value: "New onset of hypertension (over 140 systolic or over 90 diastolic) after 20 weeks, with 1 or more of the following new-onset conditions:" },
      { type: "list", items: [
        "Proteinuria: protein:creatinine ratio 30 mg/mmol or more, or albumin:creatinine ratio 8 mg/mmol or more, or at least 1 g/litre (2+) on dipstick",
        "Renal insufficiency: creatinine 90 micromol/litre or more",
        "Liver involvement: transaminases over 40 IU/litre, with or without right upper quadrant or epigastric pain",
        "Neurological complications: eclampsia, altered mental status, blindness, stroke, clonus, severe headaches, persistent visual scotomata",
        "Haematological complications: platelets below 150,000/microlitre, disseminated intravascular coagulation, or haemolysis",
        "Uteroplacental dysfunction: fetal growth restriction, abnormal umbilical artery doppler, or stillbirth",
      ]},
      { type: "subheading", value: "Severe pre-eclampsia" },
      { type: "text", value: "Pre-eclampsia with severe hypertension that does not respond to treatment, or is associated with ongoing or recurring severe headaches, visual scotomata, nausea or vomiting, epigastric pain, oliguria and severe hypertension, progressive deterioration in laboratory blood tests (rising creatinine or transaminases, falling platelets), or failure of fetal growth or abnormal doppler findings." },
    ]
  },

  {
    id: "ng133-prevention", gl: "NG133", condition: "Hypertension in Pregnancy", setting: "Reducing the Risk",
    title: "Reducing the Risk — Aspirin, Symptoms & What Not to Offer",
    tags: ["aspirin","prevention","prophylaxis","risk factors","high risk","moderate risk","75 mg","150 mg","12 weeks","symptoms of pre-eclampsia","headache","visual disturbance","epigastric pain","do not offer","nitric oxide","progesterone","diuretics","LMWH","antioxidants","vitamin C","vitamin E","fish oil","garlic","salt restriction","bed rest"],
    content: [
      { type: "subheading", value: "Symptoms to advise her about (1.1.1)" },
      { type: "text", value: "Advise pregnant women to see a healthcare professional immediately if they experience symptoms of pre-eclampsia: severe headache; problems with vision such as blurring or flashing before the eyes; severe pain just below the ribs; vomiting; sudden swelling of the face, hands or feet." },
      { type: "subheading", value: "Aspirin 75 mg to 150 mg daily from 12 weeks until birth" },
      { type: "table", headers: ["Risk level", "Factors"], rows: [
        ["High risk — any 1 factor (1.1.2)", "Hypertensive disease during a previous pregnancy; chronic kidney disease; autoimmune disease such as SLE or antiphospholipid syndrome; type 1 or type 2 diabetes; chronic hypertension"],
        ["Moderate risk — more than 1 factor (1.1.3)", "Nulliparity; age 40 or older; pregnancy interval of more than 10 years; BMI 35 kg/m² or more at first visit; family history of pre-eclampsia; multi-fetal pregnancy"],
      ]},
      { type: "alert", value: "Aspirin has no UK marketing authorisation for this indication and must be prescribed: community pharmacies in England cannot legally sell it for prevention of pre-eclampsia." },
      { type: "subheading", value: "Do not use to prevent hypertensive disorders (1.1.4)" },
      { type: "list", items: [
        "Nitric oxide donors",
        "Progesterone",
        "Diuretics",
        "Low molecular weight heparin",
      ]},
      { type: "subheading", value: "Do not recommend these supplements for prevention (1.1.5)" },
      { type: "list", items: [
        "Magnesium",
        "Folic acid",
        "Antioxidants (vitamins C and E)",
        "Fish oils or algal oils",
        "Garlic",
      ]},
      { type: "list", items: [
        "Do not recommend salt restriction solely to prevent gestational hypertension or pre-eclampsia (1.1.6)",
        "Give the same advice on rest, exercise and work as for healthy pregnant women (1.1.7)",
      ]},
    ]
  },

  {
    id: "ng133-proteinuria", gl: "NG133", condition: "Hypertension in Pregnancy", setting: "Assessing Proteinuria",
    title: "Assessing Proteinuria in Hypertensive Disorders",
    tags: ["proteinuria","dipstick","automated reagent strip","protein creatinine ratio","PCR","albumin creatinine ratio","ACR","30 mg/mmol","8 mg/mmol","24 hour urine","first morning void","quantify"],
    flowchartId: "NG133_CLASSIFY",
    content: [
      { type: "list", items: [
        "Interpret proteinuria in the context of a full clinical review of symptoms, signs and other investigations for pre-eclampsia (1.2.1)",
        "Use an automated reagent-strip reading device for dipstick screening in secondary care (1.2.2)",
        "If dipstick screening is positive (1+ or more), use albumin:creatinine ratio or protein:creatinine ratio to quantify (1.2.3)",
        "Do not use a first morning urine void to quantify proteinuria (1.2.4)",
        "Do not routinely use 24-hour urine collection to quantify proteinuria (1.2.5)",
      ]},
      { type: "subheading", value: "Thresholds" },
      { type: "table", headers: ["Test", "Threshold", "If uncertain"], rows: [
        ["Protein:creatinine ratio (1.2.6)", "30 mg/mmol", "If 30 mg/mmol or above and the diagnosis is still uncertain, consider re-testing on a new sample alongside clinical review"],
        ["Albumin:creatinine ratio (1.2.7)", "8 mg/mmol", "If 8 mg/mmol or above and the diagnosis is still uncertain, consider re-testing on a new sample alongside clinical review"],
      ]},
    ]
  },

  {
    id: "ng133-chronic", gl: "NG133", condition: "Hypertension in Pregnancy", setting: "Chronic Hypertension",
    title: "Chronic Hypertension in Pregnancy",
    tags: ["chronic hypertension","pre-existing","ACE inhibitor","ARB","angiotensin","teratogenic","thiazide","diuretic","labetalol","nifedipine","methyldopa","target 135/85","aspirin","PLGF","timing of birth","37 weeks","postnatal","140/90"],
    flowchartId: "NG133_ANTENATAL",
    content: [
      { type: "alert", value: "Stop antihypertensive treatment in women taking ACE inhibitors or ARBs if they become pregnant, preferably within 2 working days of notification, and offer alternatives (1.3.3)." },
      { type: "subheading", value: "Before and early in pregnancy" },
      { type: "list", items: [
        "Offer referral to a specialist in hypertensive disorders of pregnancy to discuss the risks and benefits of treatment (1.3.1)",
        "Advise women taking ACE inhibitors or ARBs of the increased risk of congenital abnormalities, and to discuss alternatives if planning pregnancy (1.3.2)",
        "Advise women taking thiazide or thiazide-like diuretics that there may be an increased risk of congenital abnormalities and neonatal complications (1.3.4)",
        "Other antihypertensives: the limited evidence available has not shown an increased risk of congenital malformation (1.3.5)",
      ]},
      { type: "subheading", value: "Treatment" },
      { type: "list", items: [
        "Continue existing treatment if safe in pregnancy, or switch, unless sustained systolic is under 110 mmHg, sustained diastolic is under 70 mmHg, or she has symptomatic hypotension (1.3.7)",
        "Offer treatment if not already treated and sustained systolic is 140 mmHg or higher, or sustained diastolic is 90 mmHg or higher (1.3.8)",
        "Aim for a target blood pressure of 135/85 mmHg (1.3.9)",
        "Consider labetalol first; consider nifedipine if labetalol is unsuitable, or methyldopa if both are unsuitable. Base the choice on existing treatment, side-effect profiles, risks including fetal effects, and her preference (1.3.10)",
        "Offer aspirin 75 mg to 150 mg once daily from 12 weeks (1.3.11)",
        "Offer PLGF-based testing to help rule out pre-eclampsia between 20 weeks and 36+6, if pre-eclampsia is suspected (1.3.12)",
      ]},
      { type: "text", value: "Doses are not given in NG133. BNF: labetalol 100 to 200 mg twice daily (max 800 mg daily); nifedipine modified-release 10 to 20 mg twice daily (max 80 mg daily); methyldopa 250 mg two to three times daily (max 3 g daily)." },
      { type: "subheading", value: "Appointments and timing of birth" },
      { type: "list", items: [
        "Schedule additional antenatal appointments based on individual need: weekly if hypertension is poorly controlled, every 2 to 4 weeks if well controlled (1.3.13)",
        "Do not offer planned early birth before 37 weeks if blood pressure is lower than 160/110, with or without treatment, unless there are other medical indications (1.3.14)",
        "After 37 weeks, agree timing of birth between the woman and the senior obstetrician (1.3.15)",
        "If planned early birth is necessary, offer antenatal corticosteroids and magnesium sulfate if indicated (1.3.16)",
      ]},
      { type: "subheading", value: "After the birth" },
      { type: "list", items: [
        "Measure blood pressure daily for the first 2 days, at least once between day 3 and day 5, and as clinically indicated if treatment is changed (1.3.17)",
        "Aim to keep blood pressure lower than 140/90 mmHg (1.3.18)",
        "If she took methyldopa, stop within 2 days of the birth and change to an alternative (1.3.19)",
        "Offer a medical review 6 to 8 weeks after the birth with her GP or specialist (1.3.20)",
      ]},
    ]
  },

  {
    id: "ng133-gestational", gl: "NG133", condition: "Hypertension in Pregnancy", setting: "Gestational Hypertension",
    title: "Gestational Hypertension — Assessment & Management",
    tags: ["gestational hypertension","PIH","pregnancy induced hypertension","new hypertension","after 20 weeks","admission","labetalol","nifedipine","methyldopa","target 135/85","PLGF","timing of birth","37 weeks","postnatal","150/100","bed rest"],
    flowchartId: "NG133_ANTENATAL",
    content: [
      { type: "alert", value: "Do not routinely admit women with gestational hypertension to hospital. Admit if blood pressure is severe, and if it then falls below 160/110 manage as for hypertension (table 1)." },
      { type: "list", items: [
        "Carry out a full assessment in a secondary care setting, by a healthcare professional trained in hypertensive disorders of pregnancy (1.4.1)",
        "Take account of risk factors needing additional assessment and follow-up: nulliparity; age 40 or older; pregnancy interval over 10 years; family history of pre-eclampsia; multi-fetal pregnancy; BMI 35 kg/m² or more; gestational age at presentation; previous pre-eclampsia or gestational hypertension; pre-existing vascular or kidney disease (1.4.2)",
      ]},
      { type: "subheading", value: "Table 1: management of gestational hypertension (1.4.3)" },
      { type: "table", headers: ["", "Hypertension", "Severe hypertension"], rows: [
        ["Admission", "Do not routinely admit", "Admit, but if BP falls below 160/110 manage as for hypertension"],
        ["Antihypertensive treatment", "Offer if BP remains above 140/90", "Offer to all women"],
        ["Target once on treatment", "135/85 or less", "135/85 or less"],
        ["Blood pressure measurement", "Once or twice a week until BP is 135/85 or less", "Every 15 to 30 minutes until BP is less than 160/110"],
        ["Dipstick proteinuria", "Once or twice a week, with BP measurement", "Daily while admitted"],
        ["Blood tests", "FBC, liver and renal function at presentation, then weekly", "FBC, liver and renal function at presentation, then weekly"],
        ["Fetal assessment", "Ultrasound at diagnosis and, if normal, every 2 to 4 weeks if clinically indicated; CTG only if clinically indicated", "Ultrasound at diagnosis and, if normal, every 2 weeks if severe hypertension persists; CTG at diagnosis then only if clinically indicated"],
      ]},
      { type: "subheading", value: "Treatment and birth" },
      { type: "list", items: [
        "Offer PLGF-based testing once, between 20 weeks and 36+6, if pre-eclampsia is suspected (1.4.4)",
        "Consider labetalol first; consider nifedipine if labetalol is unsuitable, and methyldopa if both are unsuitable (1.4.5)",
        "Do not offer bed rest in hospital as a treatment (1.4.6)",
        "Do not offer planned early birth before 37 weeks if BP is lower than 160/110, unless there are other medical indications (1.4.7)",
        "After 37 weeks, agree timing of birth between the woman and the senior obstetrician (1.4.8)",
      ]},
      { type: "subheading", value: "After the birth" },
      { type: "list", items: [
        "Measure BP daily for the first 2 days, at least once between day 3 and day 5, and as clinically indicated if treatment is changed (1.4.10)",
        "Continue treatment if required; advise that postnatal treatment usually lasts about as long as antenatal treatment, but may be longer; reduce treatment if BP falls below 130/80 (1.4.11)",
        "If she took methyldopa, stop within 2 days of the birth (1.4.12)",
        "If she did not take antihypertensive treatment, start it if BP is 150/100 or higher (1.4.13)",
        "Write a care plan before transfer to community care (1.4.14), offer medical review at 2 weeks if still on treatment (1.4.15), and offer all women a review at 6 to 8 weeks (1.4.16)",
      ]},
    ]
  },

  {
    id: "ng133-preeclampsia", gl: "NG133", condition: "Hypertension in Pregnancy", setting: "Pre-Eclampsia",
    title: "Pre-Eclampsia — Assessment, Treatment & Timing of Birth",
    tags: ["pre-eclampsia","PET","admission","fullPIERS","PREP-S","risk prediction","labetalol","nifedipine","methyldopa","target 135/85","timing of birth","34 weeks","37 weeks","corticosteroids","magnesium sulfate","table 2","table 3"],
    flowchartId: "NG133_TIMING",
    content: [
      { type: "subheading", value: "Assessment" },
      { type: "list", items: [
        "Assessment should be by a healthcare professional trained in the management of hypertensive disorders of pregnancy (1.5.1)",
        "Carry out a full clinical assessment at each antenatal appointment, and offer admission if there are concerns for the woman or baby (1.5.2)",
      ]},
      { type: "text", value: "Concerns prompting admission (1.5.2) include sustained systolic of 160 mmHg or higher; a new and persistent rise in creatinine (90 micromol/litre or more) or alanine transaminase (over 70 IU/litre, or twice the upper limit of normal) or fall in platelets (under 150,000/microlitre); signs of impending eclampsia; signs of impending pulmonary oedema; other signs of severe pre-eclampsia; suspected fetal compromise; or any other clinical sign causing concern." },
      { type: "list", items: [
        "Consider the fullPIERS or PREP-S validated risk prediction models to guide place of care and thresholds for intervention (1.5.3)",
        "fullPIERS can be used at any time in pregnancy; PREP-S only up to 34 weeks; neither predicts outcomes for babies (1.5.4)",
      ]},
      { type: "subheading", value: "Table 2: management of pre-eclampsia (1.5.5)" },
      { type: "table", headers: ["", "Hypertension", "Severe hypertension"], rows: [
        ["Admission", "Admit if there are clinical concerns, or if risk prediction suggests high risk of adverse events", "Admit, but if BP falls below 160/110 manage as for hypertension"],
        ["Antihypertensive treatment", "Offer if BP remains above 140/90", "Offer to all women"],
        ["Target once on treatment", "135/85 or less", "135/85 or less"],
        ["Blood pressure measurement", "At least every 48 hours, more often if admitted", "Every 15 to 30 minutes until BP is less than 160/110, then at least 4 times daily as an inpatient"],
        ["Blood tests", "FBC, liver and renal function twice a week", "FBC, liver and renal function 3 times a week"],
        ["Fetal assessment", "Ultrasound at diagnosis and, if normal, every 2 weeks; CTG at diagnosis then only if clinically indicated", "Ultrasound at diagnosis and, if normal, every 2 weeks; CTG at diagnosis then only if clinically indicated"],
      ]},
      { type: "list", items: [
        "Offer labetalol to treat hypertension in pre-eclampsia. Offer nifedipine if labetalol is unsuitable, and methyldopa if neither is suitable (1.5.6)",
      ]},
      { type: "text", value: "Doses are not given in NG133. BNF: labetalol 100 to 200 mg twice daily (max 800 mg daily); nifedipine modified-release 10 to 20 mg twice daily (max 80 mg daily); methyldopa 250 mg two to three times daily (max 3 g daily)." },
      { type: "subheading", value: "Timing of birth" },
      { type: "text", value: "Record maternal and fetal thresholds for planned early birth before 37 weeks (1.5.7). Thresholds could include inability to control blood pressure despite 3 or more classes of antihypertensive in appropriate doses; maternal pulse oximetry under 90%; progressive deterioration in liver or renal function, haemolysis or platelet count; ongoing neurological features such as severe intractable headache, repeated visual scotomata or eclampsia; placental abruption; or reversed end-diastolic flow, a non-reassuring CTG, or stillbirth." },
      { type: "table", headers: ["Gestation", "Timing of birth (table 3, 1.5.12)"], rows: [
        ["Before 34 weeks", "Continue surveillance unless there are indications for planned early birth. Offer intravenous magnesium sulfate and antenatal corticosteroids"],
        ["34 weeks to 36+6", "Continue surveillance unless there are indications for planned early birth. When considering planned early birth, take into account the woman's and baby's condition, risk factors and availability of neonatal beds. Consider antenatal corticosteroids"],
        ["37 weeks onwards", "Initiate birth within 24 to 48 hours"],
      ]},
      { type: "list", items: [
        "Involve a senior obstetrician in decisions on timing of birth (1.5.8)",
        "Discuss with the anaesthetic team if birth is planned (1.5.9), and with the neonatal team if neonatal complications are anticipated (1.5.10)",
        "Offer intravenous magnesium sulfate and antenatal corticosteroids if early birth is planned in preterm pre-eclampsia (1.5.11)",
      ]},
    ]
  },

  {
    id: "ng133-fetal-intrapartum", gl: "NG133", condition: "Hypertension in Pregnancy", setting: "Fetal Monitoring & Labour",
    title: "Fetal Monitoring & Intrapartum Care",
    tags: ["fetal monitoring","ultrasound","umbilical artery doppler","CTG","cardiotocography","28 weeks","32 weeks","36 weeks","intrapartum","labour","epidural","preload","second stage","operative birth","hourly BP"],
    content: [
      { type: "subheading", value: "Fetal monitoring" },
      { type: "table", headers: ["Condition", "Monitoring"], rows: [
        ["Chronic hypertension (1.6.1, 1.6.2)", "Ultrasound for fetal growth and amniotic fluid, with umbilical artery doppler, at 28, 32 and 36 weeks. CTG only if clinically indicated"],
        ["Gestational hypertension (1.6.3, 1.6.4)", "Ultrasound at diagnosis and, if normal, every 2 to 4 weeks if clinically indicated. CTG only if clinically indicated"],
        ["Pre-eclampsia or severe gestational hypertension (1.6.5 to 1.6.9)", "CTG at diagnosis. If conservative management is planned, ultrasound and umbilical artery doppler at diagnosis, repeated every 2 weeks. Do not routinely repeat CTG unless clinically indicated"],
        ["Previous severe or early pre-eclampsia, IUD or abruption (1.6.11)", "Ultrasound and umbilical artery doppler from 28 to 30 weeks (or at least 2 weeks before the previous gestation of onset if earlier), repeated 4 weeks later"],
      ]},
      { type: "list", items: [
        "Repeat CTG in pre-eclampsia or severe gestational hypertension if she reports a change in fetal movement, or there is vaginal bleeding, abdominal pain, or deterioration in her condition (1.6.8)",
        "Write a care plan covering the timing and nature of future fetal monitoring, fetal indications for birth, whether and when to give corticosteroids, and plans for discussion with neonatal paediatricians and obstetric anaesthetists (1.6.10)",
      ]},
      { type: "subheading", value: "Blood pressure in labour (1.7.3, 1.7.4)" },
      { type: "list", items: [
        "Hypertension: measure blood pressure hourly",
        "Severe hypertension: measure every 15 to 30 minutes until blood pressure is less than 160/110",
        "Continue antenatal antihypertensive treatment during labour",
      ]},
      { type: "alert", value: "Do not preload women who have severe pre-eclampsia with intravenous fluids before establishing low-dose epidural or combined spinal epidural analgesia (1.7.6)." },
      { type: "list", items: [
        "Determine the need for haematological and biochemical tests during labour using the same criteria as antenatally, even if regional analgesia is being considered (1.7.5)",
        "Do not routinely limit the duration of the second stage in women with controlled hypertension (1.7.7)",
        "Consider operative or assisted birth in the second stage for women with severe hypertension whose blood pressure has not responded to initial treatment (1.7.8)",
      ]},
    ]
  },

  {
    id: "ng133-severe", gl: "NG133", condition: "Hypertension in Pregnancy", setting: "Severe Disease & Critical Care",
    title: "Severe Hypertension, Severe Pre-Eclampsia & Eclampsia",
    tags: ["severe hypertension","severe pre-eclampsia","eclampsia","magnesium sulfate","MgSO4","4 g","1 g/hour","Collaborative Eclampsia Trial","recurrent fits","diazepam","phenytoin","IV labetalol","hydralazine","fluid balance","80 ml/hour","volume expansion","HELLP","dexamethasone","critical care","level 2","level 3"],
    flowchartId: "NG133_SEVERE",
    content: [
      { type: "subheading", value: "Magnesium sulfate" },
      { type: "list", items: [
        "Give intravenous magnesium sulfate if a woman in a critical care setting with severe hypertension or severe pre-eclampsia has had, or previously had, an eclamptic fit (1.8.1)",
        "Consider it for women with severe pre-eclampsia in critical care if birth is planned within 24 hours (1.8.2)",
        "Consider the need for it if 1 or more features of severe pre-eclampsia is present: ongoing or recurring severe headaches; visual scotomata; nausea or vomiting; epigastric pain; oliguria with severe hypertension; or progressive deterioration in blood tests (1.8.3)",
      ]},
      { type: "alert", value: "Collaborative Eclampsia Trial regimen (1.8.4): a loading dose of 4 g intravenously over 5 to 15 minutes, followed by an infusion of 1 g/hour for 24 hours. If she has had an eclamptic fit, continue the infusion for 24 hours after the last fit. Treat recurrent fits with a further dose of 2 g to 4 g intravenously over 5 to 15 minutes." },
      { type: "list", items: [
        "Do not use diazepam, phenytoin or other anticonvulsants as an alternative to magnesium sulfate in women with eclampsia (1.8.5)",
        "MHRA warning: prolonged or repeated use of magnesium sulfate in pregnancy (longer than 5 to 7 days) has been associated with neonatal skeletal adverse effects, hypocalcaemia and hypermagnesaemia. Consider monitoring the neonate if use is prolonged or repeated",
      ]},
      { type: "text", value: "Magnesium toxicity antidote is not covered by NG133. The app's formulary and RCOG GTG56 give calcium gluconate 1 g intravenously (10 mL of 10%) over 10 minutes." },
      { type: "subheading", value: "Antihypertensives in critical care" },
      { type: "list", items: [
        "Treat severe hypertension in critical care, during pregnancy or after birth, immediately with 1 of: labetalol (oral or intravenous), oral nifedipine, or intravenous hydralazine (1.8.6)",
        "Monitor the response to ensure blood pressure falls, to identify adverse effects for the woman and baby, and to modify treatment accordingly (1.8.7)",
        "Consider up to 500 ml crystalloid before or at the same time as the first dose of intravenous hydralazine in the antenatal period (1.8.8)",
      ]},
      { type: "text", value: "Doses are not given in NG133. BNF: labetalol intravenous bolus 50 mg over at least 1 minute, repeated every 5 minutes (max 200 mg), or infusion 20 mg/hour doubled every 30 minutes (max 160 mg/hour); nifedipine immediate-release 10 mg, repeated after 30 minutes if uncontrolled (max 30 mg per episode); hydralazine 5 mg intravenously over 5 minutes, repeated every 20 minutes (max 20 mg per episode)." },
      { type: "subheading", value: "Fluids, steroids and mode of birth" },
      { type: "list", items: [
        "Do not use volume expansion in severe pre-eclampsia unless hydralazine is the antenatal antihypertensive (1.8.11)",
        "Limit maintenance fluids to 80 ml/hour unless there are other ongoing fluid losses such as haemorrhage (1.8.12)",
        "Offer antenatal corticosteroids if early birth is considered likely within 7 days (1.8.9)",
        "Do not use dexamethasone or betamethasone to treat HELLP syndrome (1.8.10)",
        "Choose mode of birth according to the clinical circumstances and the woman's preference (1.8.13)",
      ]},
      { type: "subheading", value: "Table 4: critical care level (1.8.14)" },
      { type: "table", headers: ["Level", "Clinical criteria"], rows: [
        ["Level 3", "Severe pre-eclampsia and needing ventilation"],
        ["Level 2", "Step-down from level 3, or severe pre-eclampsia with any of: eclampsia; HELLP syndrome; haemorrhage; hyperkalaemia; severe oliguria; coagulation support; intravenous antihypertensive treatment; initial stabilisation of severe hypertension; evidence of cardiac failure; abnormal neurology"],
        ["Level 1", "Pre-eclampsia with hypertension; ongoing conservative antenatal management of severe preterm hypertension; step-down treatment after the birth"],
      ]},
    ]
  },

  {
    id: "ng133-postnatal", gl: "NG133", condition: "Hypertension in Pregnancy", setting: "Postnatal Care & Follow-Up",
    title: "Postnatal Care, Antihypertensives & Follow-Up",
    tags: ["postnatal","after birth","enalapril","nifedipine","amlodipine","atenolol","labetalol","breastfeeding","ACE inhibitor","ARB","diuretic","African or Caribbean family origin","150/100","140/90","130/80","transfer to community","6 to 8 weeks","recurrence","cardiovascular risk"],
    flowchartId: "NG133_POSTNATAL",
    content: [
      { type: "subheading", value: "Blood pressure after birth in pre-eclampsia" },
      { type: "list", items: [
        "If she did not take antihypertensive treatment: measure BP at least 4 times a day as an inpatient, at least once between day 3 and day 5, and on alternate days until normal if it was abnormal on days 3 to 5 (1.5.13)",
        "If she did not take antihypertensive treatment, start it if BP is 150/100 mmHg or higher (1.5.14)",
        "Ask about severe headache and epigastric pain each time blood pressure is measured (1.5.15)",
        "If she took antihypertensive treatment: measure BP at least 4 times a day as an inpatient, then every 1 to 2 days for up to 2 weeks after transfer to community care until she is off treatment and has no hypertension (1.5.16)",
        "Consider reducing treatment if BP falls below 140/90, and reduce it if BP falls below 130/80 (1.5.17)",
        "If she took methyldopa, stop within 2 days of the birth (1.5.18)",
      ]},
      { type: "subheading", value: "Choice of antihypertensive after birth" },
      { type: "list", items: [
        "Offer enalapril, with monitoring of maternal renal function and serum potassium (1.9.4)",
        "For women of African or Caribbean family origin, consider nifedipine, or amlodipine if she has previously used it successfully (1.9.5)",
        "If BP is not controlled on a single medicine, consider combining nifedipine (or amlodipine) with enalapril. If that is not tolerated or is ineffective, consider adding atenolol or labetalol, or swapping one of the medicines for atenolol or labetalol (1.9.6)",
        "Use medicines taken once daily where possible (1.9.7)",
        "Where possible avoid diuretics or angiotensin receptor blockers in women who are breastfeeding or expressing milk (1.9.8)",
        "For women not breastfeeding and not planning to, treat in line with the NICE guideline on hypertension in adults (1.9.9)",
      ]},
      { type: "subheading", value: "Breastfeeding" },
      { type: "list", items: [
        "Advise that treatment can be adapted to accommodate breastfeeding, and that needing antihypertensive medication does not prevent her from breastfeeding (1.9.1)",
        "Explain that medicines pass into breast milk, but most only at very low levels, so the amounts taken in by babies are very small and unlikely to have any clinical effect (1.9.2)",
        "Consider monitoring the blood pressure of babies, especially those born preterm, who have symptoms of low blood pressure in the first few weeks; advise her to watch for drowsiness, lethargy, pallor, cold peripheries or poor feeding (1.9.3)",
      ]},
      { type: "subheading", value: "Transfer to community care and follow-up" },
      { type: "list", items: [
        "Offer transfer to community care when there are no symptoms of pre-eclampsia, blood pressure with or without treatment is 150/100 mmHg or less, and blood test results are stable or improving (1.5.19)",
        "Write a care plan covering who will provide follow-up, frequency of BP monitoring, thresholds for reducing or stopping treatment, indications for referral to primary care, and self-monitoring for symptoms (1.5.20)",
        "Offer a medical review with her GP or specialist 2 weeks after transfer to community care if still on treatment (1.5.21), and offer all women a review 6 to 8 weeks after the birth (1.5.22)",
        "Measure platelets, transaminases and serum creatinine 48 to 72 hours after birth or step-down; do not repeat if normal (1.5.23)",
        "Carry out a urinary reagent-strip test 6 to 8 weeks after the birth (1.5.25); if proteinuria persists at 1+ or more, offer further review at 3 months to assess kidney function (1.5.26)",
        "Consider referral for specialist kidney assessment if kidney function is abnormal at 3 months (1.5.27)",
      ]},
      { type: "subheading", value: "Recurrence in a future pregnancy (table 5, 1.10.1)" },
      { type: "table", headers: ["Previous", "Risk of any hypertensive disorder next time"], rows: [
        ["Any hypertensive disorder", "Approximately 1 in 5"],
        ["Pre-eclampsia", "Up to approximately 16% (1 in 6). If birth was at 28 to 34 weeks, approximately 33% (1 in 3). If birth was at 34 to 37 weeks, approximately 23% (1 in 4)"],
        ["Gestational hypertension", "Between approximately 6% and 12% for pre-eclampsia next time; 11% to 15% for gestational hypertension"],
        ["Chronic hypertension", "Approximately 2% risk of pre-eclampsia"],
      ]},
      { type: "text", value: "Advise women who have had a hypertensive disorder of pregnancy that it is associated with an increased risk of hypertension and cardiovascular disease in later life (1.10.2)." },
    ]
  },
];
