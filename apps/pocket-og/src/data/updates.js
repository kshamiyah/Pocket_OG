// In-app changelog — newest release first. Edit this when you ship something.
// Each change has a `tag`: "new" | "improved" | "fixed".
// Keep the top `version` in step with package.json so the About build stamp,
// the hero chip and this list all show the same number.
export const UPDATES = [
  {
    version: "1.15.0",
    date: "12/07/2026",
    title: "Urogynaecology, sexual health & contraception",
    changes: [
      { tag: "new", text: "Ovarian cysts, premenopausal (RCOG GTG62) and postmenopausal (RCOG GTG34), with a shared triage flowchart." },
      { tag: "new", text: "Menopause: identification and management (NICE NG23)." },
      { tag: "new", text: "Urinary incontinence & pelvic organ prolapse (NICE NG123)." },
      { tag: "new", text: "Premenstrual syndrome (RCOG GTG48)." },
      { tag: "new", text: "Fertility problems: assessment and treatment (NICE NG257)." },
      { tag: "new", text: "Polycystic ovary syndrome (2023 international guideline)." },
      { tag: "new", text: "Chlamydia (BASHH)." },
      { tag: "new", text: "Gonorrhoea (BASHH)." },
      { tag: "new", text: "Syphilis, including in pregnancy (BASHH)." },
      { tag: "new", text: "Bacterial vaginosis & trichomonas vaginalis (BASHH)." },
      { tag: "new", text: "HIV in pregnancy (BHIVA)." },
      { tag: "new", text: "UKMEC — contraception method choice (FSRH)." },
      { tag: "new", text: "Emergency contraception (FSRH)." },
      { tag: "new", text: "Gestational trophoblastic disease (RCOG GTG38)." },
      { tag: "improved", text: "Pearl of the Day expanded from 27 to 200 pearls, now drawing from every guideline in the library." },
      { tag: "fixed", text: "Searching \"cord prolapse\" now shows the GTG50 emergency pathway as a topic card at the top, instead of ranking pelvic organ prolapse and induction results above it." },
      { tag: "fixed", text: "Searching \"abnormal smear\" now shows a cervical screening & colposcopy topic card (NHSCSP), instead of ranking a fetal-monitoring CTG page above it." },
      { tag: "fixed", text: "Searching \"POP-Q\" now shows a pelvic organ prolapse topic card (NG123), instead of ranking progestogen-only pill entries above it." },
      { tag: "fixed", text: "Tranexamic acid now shows its oral heavy-menstrual-bleeding dose (NICE NG88) alongside the IV PPH dose, instead of being labelled postpartum-use-only." },
    ],
  },
  {
    version: "1.14.0",
    date: "11/07/2026",
    title: "Postnatal care & obstetric medicine",
    changes: [
      { tag: "new", text: "Postnatal care: the routine contact schedule, maternal red flags cross-linked to the guidelines that manage each one, what the 6-8 week check should cover, and newborn assessment/safety-netting, from NICE NG194." },
      { tag: "new", text: "Epilepsy in pregnancy: AED optimisation, the valproate Pregnancy Prevention Programme, antenatal drug-level monitoring, and intrapartum/postnatal safety advice, from RCOG GTG68. Includes a seizure-management flowchart." },
      { tag: "new", text: "Asthma in pregnancy: why to keep treating as normal, acute exacerbation management, and medication cautions around delivery, from the BTS/NICE/SIGN asthma pathway (NG244). Includes an acute-exacerbation flowchart." },
      { tag: "new", text: "Renal disease in pregnancy: risk stratification, medication switching, and the pre-eclampsia overlap problem, from the UK Kidney Association's 2019 guideline." },
      { tag: "new", text: "Cardiac disease in pregnancy: mWHO risk stratification, the Pregnancy Heart Team model, and red flags for a missed diagnosis, from the 2025 ESC guidelines — now the full-guideline home for the existing congenital heart disease, cardiomyopathy, MI, arrhythmia and valvular disease pathways." },
    ],
  },
  {
    version: "1.13.0",
    date: "11/07/2026",
    title: "Seven new labour ward & antenatal guides",
    changes: [
      { tag: "new", text: "Caesarean birth: the four urgency categories with decision-to-delivery targets, mode-of-birth decisions including maternal request, surgical technique, and perioperative care, from NICE NG192. Includes a category-triage flowchart." },
      { tag: "new", text: "Assisted vaginal birth: prerequisites, station/rotation classification, forceps vs ventouse trade-offs, trial-in-theatre criteria, and conduct of the attempt, from RCOG GTG26. Includes a decision flowchart." },
      { tag: "new", text: "Birth after previous caesarean (VBAC): intrapartum monitoring requirements and recognising uterine scar rupture, from RCOG GTG45. Includes a monitoring/emergency flowchart." },
      { tag: "new", text: "Group B Streptococcus: the UK's risk-based screening policy, who's offered intrapartum antibiotic prophylaxis, and the postnatal neonatal observation and red-flag pathway, from RCOG GTG36. Includes a decision flowchart." },
      { tag: "new", text: "Twin and triplet pregnancy: recommended timing and mode of birth by chorionicity, and TTTS Quintero staging, from NICE NG137 (alongside the existing QS46). Includes a decision flowchart." },
      { tag: "new", text: "Obesity in pregnancy: BMI-triggered antenatal, intrapartum and postnatal pathway, from RCOG GTG72. Includes a decision flowchart." },
      { tag: "new", text: "Breech presentation at term: external cephalic version and the management of vaginal breech birth, from RCOG GTG20a and GTG20b. Includes a shared decision flowchart." },
    ],
  },
  {
    version: "1.12.0",
    date: "11/07/2026",
    title: "Four new emergency & antenatal guides",
    changes: [
      { tag: "new", text: "Anti-D prophylaxis: RAADP dosing, anti-D for potentially sensitising events, FMH/Kleihauer quantification, and postnatal anti-D, from RCOG GTG22 and NICE TA156. Includes a step-by-step flowchart." },
      { tag: "new", text: "Shoulder dystocia: recognition, the full manoeuvre sequence (McRoberts', suprapubic pressure, internal/all-fours manoeuvres, last-resort measures), and post-birth documentation, from RCOG GTG42. Includes an emergency flowchart." },
      { tag: "new", text: "Maternal sepsis: red flags, the Sepsis Six hour-1 bundle, source control, and postpartum-specific causes, from RCOG GTG64 (the current guideline, replacing the old GTG64a/b split). Includes an emergency flowchart." },
      { tag: "new", text: "Placenta praevia & accreta spectrum, and vasa praevia: diagnosis pathways, risk factors, antenatal management and delivery planning, from RCOG GTG27a and GTG27b. Each includes its own flowchart." },
    ],
  },
  {
    version: "1.11.0",
    date: "08/07/2026",
    title: "Dark mode",
    changes: [
      { tag: "new", text: "Dark mode across the whole app. Tap the moon in the top-left of the home screen to switch; your choice is remembered on this device." },
    ],
  },
  {
    version: "1.10.1",
    date: "08/07/2026",
    title: "Counsel everywhere",
    changes: [
      { tag: "improved", text: "The Counsel rename now runs through the whole app: search results, topic cards, cross-links from guides and flowcharts, the About screen and the feedback form all say Counsel instead of Consent. The word consent still appears where it is clinically correct, such as the right to decline and consent forms." },
    ],
  },
  {
    version: "1.10.0",
    date: "08/07/2026",
    title: "Six new Counsel topics",
    changes: [
      { tag: "new", text: "Birth after caesarean (VBAC): success rates, uterine rupture and the full side-by-side comparison of planned VBAC vs planned repeat caesarean, from RCOG GTG45." },
      { tag: "new", text: "Ectopic pregnancy: walk through methotrexate, surgery or expectant management, with the eligibility criteria, success rates and follow-up from CG623 and NICE NG126." },
      { tag: "new", text: "External cephalic version (ECV): success rates, what the procedure involves, and the breech alternatives if it fails, from RCOG GTG20." },
      { tag: "new", text: "GBS antibiotics in labour: the 1 in 400 vs 1 in 4,000 numbers, practicalities of the drip, and what declining means, from RCOG GTG36." },
      { tag: "new", text: "LLETZ: what treatment involves, the ~95% cure rate, and the preterm birth conversation for future pregnancies, from NHSCSP guidance." },
      { tag: "new", text: "Aspirin for pre-eclampsia prevention: NG133 risk factors as tappable chips, benefits, practical points and alternatives." },
      { tag: "improved", text: "Ectopic and pre-eclampsia topic cards now link to their Counsel entries." },
    ],
  },
  {
    version: "1.9.0",
    date: "08/07/2026",
    title: "Consent becomes Counsel",
    changes: [
      { tag: "new", text: "The Consent tab is now Counsel: a walkthrough for counselling a patient about a procedure or decision, covering what it involves, benefits, risks, alternatives and common questions." },
      { tag: "new", text: "Elective caesarean gets the fullest treatment: a step-by-step explanation of the operation (before, during and after), a Benefits tab and an Options tab comparing planned caesarean with planned vaginal birth (NICE NG192 Appendix A), and Decline reframed as Alternatives (planned vaginal birth, VBAC, ECV)." },
      { tag: "new", text: "Every Counsel entry now uses the counselling shape: emergency caesarean, instrumental birth, all four induction methods, surgical and medical miscarriage, laparoscopy, hysteroscopy and antenatal corticosteroids each gain a Benefits tab and an Alternatives tab in place of Decline." },
      { tag: "improved", text: "Searching \"counsel\" or \"counselling\" now finds these pages; \"consent\" still works." },
      { tag: "fixed", text: "Pearl of the day no longer opens trapped inside the home column on iPhone: the popup now dims the whole screen, sits as a proper bottom sheet and clears the home indicator." },
      { tag: "fixed", text: "The Back/Next bar in Counsel walkthroughs no longer hides behind the iPhone tab bar; it now sits fully visible above it and pages leave room for it when scrolled to the bottom." },
    ],
  },
  {
    version: "1.8.0",
    date: "06/07/2026",
    title: "Diabetes, anaemia & mental health drugs",
    changes: [
      { tag: "new", text: "Rx now covers three guides that had no drug pages before: insulin (VRII) and metformin for diabetes in pregnancy, oral iron and Ferinject for iron deficiency anaemia, and sertraline, fluoxetine and lithium for perinatal mental health." },
      { tag: "new", text: "Three new topic cards: search \"diabetes\", \"anaemia\" or \"perinatal mental health\" to see the guide, drugs (and DKA pathway, for diabetes) together." },
    ],
  },
  {
    version: "1.7.0",
    date: "06/07/2026",
    title: "Maternal collapse & cardiac arrest",
    changes: [
      { tag: "new", text: "Maternal Collapse (RCOG GTG56) added to Library: causes, why resuscitation differs in pregnancy, ABCDE management, perimortem caesarean section, cause-specific management (AFE, sepsis, toxicity, anaphylaxis), and team/governance." },
      { tag: "new", text: "New Obstetric Cardiac Arrest flowchart, based on the OAA/Resuscitation Council UK Maternal Cardiac Arrest QRH, step through aortocaval relief, rhythm check, drugs and the PMCS decision." },
      { tag: "new", text: "Six resuscitation drugs added to Rx: adrenaline, amiodarone, atropine, calcium gluconate, calcium chloride and Intralipid 20%." },
      { tag: "new", text: "New topic card: search \"cardiac arrest\", \"maternal collapse\" or \"PMCS\" to see the guide, flowchart, drugs and evidence together." },
    ],
  },
  {
    version: "1.6.0",
    date: "05/07/2026",
    title: "Six more topic cards",
    changes: [
      { tag: "new", text: "Topic cards added for postpartum haemorrhage, induction of labour, ectopic pregnancy, hyperemesis gravidarum, PPROM & preterm labour, and heavy menstrual bleeding. Search any of these (e.g. \"PPH\", \"IOL\", \"HMB\") to see guides, pathways, drugs, calculators, evidence and don't-miss items in one place." },
      { tag: "new", text: "Methotrexate added to Rx (dose, contraindications, monitoring schedule for ectopic pregnancy), linked from the Ectopic pregnancy topic card." },
    ],
  },
  {
    version: "1.5.0",
    date: "05/07/2026",
    title: "Topic cards in search",
    changes: [
      { tag: "new", text: "Topic cards: searching a big topic now shows a curated card above the results with everything the app holds on it in one place, organised as guides, pathways, drugs, evidence and don't-miss items. First topic: pre-eclampsia. Try searching \"PET\"." },
    ],
  },
  {
    version: "1.4.0",
    date: "04/07/2026",
    title: "Landmark Trials in the Library",
    changes: [
      { tag: "new", text: "Landmark Trials: a new section under Library, Articles, collecting the guideline-changing studies behind O&G practice. Each card gives the clinical question, design, key result and what it changed, with a link to the paper and to the guideline it underpins." },
      { tag: "new", text: "Ten trials to start: ARRIVE, Magpie, the Term Breech Trial, antenatal corticosteroids, magnesium for neuroprotection, ASPRE, WOMAN, ORACLE I & II, ECLIPSE and PRISM. Find them via the Trials filter in Library or in search." },
    ],
  },
  {
    version: "1.3.0",
    date: "04/07/2026",
    title: "Pearl of the Day, sharing & a rebuilt IOL prioritiser",
    changes: [
      { tag: "new", text: "Pearl of the Day: a daily teaching point on the home screen that links straight to the flowchart and the full guideline it comes from. It changes every day, and you can dismiss it or tap through." },
      { tag: "improved", text: "The IOL Priority List is rebuilt on the NICE NG207 four-tier model: multiple indications per patient, hours since SROM, post-dates priority derived automatically from gestation, editable entries, and tier-grouped ordering with a one-tap reset to the recommended order." },
      { tag: "new", text: "Share buttons on guidelines, flowcharts, calculators and consent pages, so you can send a colleague straight to what you are reading." },
      { tag: "fixed", text: "Shared links now open the app directly to the shared content instead of the home screen." },
    ],
  },
  {
    version: "1.2.0",
    date: "03/07/2026",
    title: "New guides, triage flowcharts & app-wide search",
    changes: [
      { tag: "new", text: "Genital Herpes in Pregnancy, a new BASHH/RCOG 2024 guide with an interactive management flowchart: first episode by trimester, suppressive therapy, mode of delivery, PPROM and neonatal care." },
      { tag: "new", text: "Two new triage flowcharts: Rupture of Membranes (PROM/PPRoM), and Acute Heavy Menstrual Bleeding in ED." },
      { tag: "new", text: "Antivirals added to Rx, aciclovir, valaciclovir and famciclovir, each with dosing and BNF links." },
      { tag: "improved", text: "Search now covers the whole app, medications, calculators and consent pages appear in results, with new Meds, Calcs and Consent filters and smarter ranking." },
      { tag: "improved", text: "IOL Priority List moved to the Calculator tab." },
      { tag: "fixed", text: "Fixed several broken links between flowcharts, calculators and guidelines, and the Genital Herpes guide now opens correctly." },
      { tag: "new", text: "TOG Reviews, a Library section with in-depth summaries of RCOG's review journal, each with its own interactive flowchart: polyhydramnios & oligohydramnios, thyroid disease, cardiac disease (congenital, cardiomyopathy, myocardial infarction, arrhythmias, valvular disease)." },
      { tag: "improved", text: "PUL and post-ectopic hCG calculators now have a Quick entry mode, jump straight to the numbers when you already know the clinical picture." },
      { tag: "fixed", text: "The keyboard no longer pops open automatically when you launch the app." },
    ],
  },
  {
    version: "1.0.0",
    date: "01/07/2026",
    title: "First release",
    changes: [
      { tag: "new", text: "Pocket O&G is live, a fast, offline reference for O&G trainees." },
    ],
  },
];

export const LATEST_VERSION = UPDATES[0].version;
export const LATEST_TITLE = UPDATES[0].title;

const SEEN_KEY = "pocketog_updates_seen_v1";

export function hasUnseenUpdates() {
  try {
    return localStorage.getItem(SEEN_KEY) !== LATEST_VERSION;
  } catch {
    return false;
  }
}

export function markUpdatesSeen() {
  try {
    localStorage.setItem(SEEN_KEY, LATEST_VERSION);
  } catch { /* storage unavailable — ignore */ }
}
