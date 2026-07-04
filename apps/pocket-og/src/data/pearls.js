// Pearl of the Day — a rotating teaching point drawn from the app's own content.
// Offline-native: a static, hand-authored list. One pearl surfaces per day,
// chosen deterministically from the date so everyone sees the same pearl and the
// whole list cycles before anything repeats. Each pearl deep-links into the guide,
// flowchart, calculator or drug it came from via handleNavigate's { type, id }.
//
// `gl` is only used to colour the source badge — keep it a real guideline code.
// Teaching points are deliberately crisp; the exact thresholds live in the linked
// guide, which is always one tap away.

export const PEARLS = [
  {
    id: "aspirin-pet",
    topic: "Pre-eclampsia",
    pearl: "One high-risk factor — or two moderate — is enough to warrant aspirin.",
    detail: "Women with any high-risk factor (previous pre-eclampsia, chronic hypertension, CKD, diabetes, autoimmune disease) or ≥2 moderate factors should take 150 mg aspirin at night from 12 weeks until birth. It is one of the few genuinely preventive interventions in obstetrics.",
    gl: "NG133",
    link: { type: "drug", id: "aspirin_prophylaxis", label: "Aspirin prophylaxis" },
  },
  {
    id: "mgso4-severe",
    topic: "Severe pre-eclampsia",
    pearl: "Magnesium sulfate is for seizure prevention — not blood-pressure control.",
    detail: "In severe pre-eclampsia/eclampsia, magnesium sulfate (loading dose then infusion) prevents and treats seizures; it does nothing for the blood pressure, which needs its own agent (labetalol, nifedipine or hydralazine). Monitor reflexes, respiratory rate and urine output — calcium gluconate is the antidote.",
    gl: "GL952",
    link: { type: "flowchart", id: "GL952_SEVERE_LW", label: "Severe PET — Labour Ward" },
  },
  {
    id: "ectopic-mtx",
    topic: "Ectopic pregnancy",
    pearl: "Methotrexate suits the stable, low-hCG, asymptomatic ectopic — not the one in pain.",
    detail: "Medical management is offered when there is no significant pain, an unruptured ectopic <35 mm with no fetal heartbeat, an hCG typically <1500, and the woman can return for follow-up. Significant pain or a high/rising hCG points to surgery.",
    gl: "CG623",
    link: { type: "flowchart", id: "CG623_MTX", label: "Ectopic — Methotrexate" },
  },
  {
    id: "pph-ladder",
    topic: "Postpartum haemorrhage",
    pearl: "The 4 Ts still catch almost every PPH: Tone, Trauma, Tissue, Thrombin.",
    detail: "Atony (Tone) causes ~70%. Work the mechanical and pharmacological ladder in parallel with resuscitation — rubbing up a contraction, oxytocin, ergometrine, carboprost, misoprostol — and escalate early to tamponade and theatre if bleeding continues.",
    gl: "GTG52",
    link: { type: "flowchart", id: "GTG52_PPH", label: "PPH management" },
  },
  {
    id: "cord-prolapse",
    topic: "Cord prolapse",
    pearl: "Hands off the cord — elevate the presenting part, not the cord.",
    detail: "Handling a prolapsed cord causes vasospasm. Relieve pressure by elevating the presenting part (manually or knee-chest/Trendelenburg), consider filling the bladder to buy time, and expedite delivery — usually category-1 caesarean unless birth is imminent.",
    gl: "GTG50",
    link: { type: "flowchart", id: "GTG50_CORD", label: "Cord prolapse" },
  },
  {
    id: "pprom-abx",
    topic: "PPROM",
    pearl: "Erythromycin for PPROM — never co-amoxiclav.",
    detail: "Erythromycin for 10 days (or until labour) prolongs pregnancy and reduces neonatal morbidity in preterm prelabour rupture of membranes. Co-amoxiclav is avoided because of the association with neonatal necrotising enterocolitis.",
    gl: "GL895",
    link: { type: "drug", id: "erythromycin", label: "Erythromycin" },
  },
  {
    id: "steroids-window",
    topic: "Antenatal steroids",
    pearl: "Antenatal corticosteroids buy the most for the baby between 24 and 34+6 weeks.",
    detail: "A course of betamethasone or dexamethasone accelerates fetal lung maturity and reduces respiratory distress, intraventricular haemorrhage and neonatal death when birth is anticipated within 7 days. Two doses, 24 hours apart.",
    gl: "NG25",
    link: { type: "drug", id: "betamethasone", label: "Betamethasone" },
  },
  {
    id: "mg-neuro",
    topic: "Preterm birth",
    pearl: "Magnesium sulfate isn't only for pre-eclampsia — it's fetal neuroprotection too.",
    detail: "Given to women in established preterm labour or with planned preterm birth before ~30 weeks (consider up to 33+6), magnesium sulfate reduces the risk of cerebral palsy in the surviving child.",
    gl: "NG25",
    link: { type: "reader", id: "NG25", label: "Preterm Labour & Birth" },
  },
  {
    id: "vte-timing",
    topic: "VTE prophylaxis",
    pearl: "The VTE score doesn't just decide if — it decides when.",
    detail: "Antenatally, a score of 4 or more means LMWH from the first trimester; a score of 3 means from 28 weeks. The risk assessment is repeated on admission and after birth, when the threshold changes again.",
    gl: "GL891",
    link: { type: "calculator", id: "VTE_RISK", label: "VTE risk assessment" },
  },
  {
    id: "icp-timing",
    topic: "Obstetric cholestasis",
    pearl: "In cholestasis, the peak bile acid level drives delivery timing.",
    detail: "The risk of stillbirth rises with the peak serum bile acid concentration. Severe disease (peak ≥100 µmol/L) warrants consideration of birth around 35–36 weeks; milder disease is managed with later timing and surveillance.",
    gl: "GL880",
    link: { type: "flowchart", id: "GL880_DELIVERY", label: "ICP — Delivery timing" },
  },
  {
    id: "rfm-kickcounts",
    topic: "Reduced fetal movements",
    pearl: "Formal kick-counting isn't recommended — but never dismiss a mother's concern.",
    detail: "There's no evidence that fixed kick-count charts improve outcomes, yet reduced movements can herald fetal compromise. After 28 weeks, assess with CTG; recurrent episodes warrant growth and liquor assessment.",
    gl: "GTG57",
    link: { type: "flowchart", id: "GTG57_CARE_PATHWAY", label: "RFM care pathway" },
  },
  {
    id: "aeh-atypia",
    topic: "Endometrial hyperplasia",
    pearl: "Atypia changes everything — it's a surgical diagnosis.",
    detail: "Endometrial hyperplasia without atypia is managed medically, LNG-IUS first line, with a low progression risk. Atypical hyperplasia carries a substantial risk of concurrent or future cancer, so total hysterectomy is the standard treatment.",
    gl: "GTG67",
    link: { type: "flowchart", id: "GTG67_AEH", label: "Atypical hyperplasia" },
  },
  {
    id: "puqe",
    topic: "Nausea & vomiting",
    pearl: "Score the vomiting before you treat it — the PUQE guides escalation.",
    detail: "The PUQE score grades severity of nausea and vomiting of pregnancy. Antihistamines (e.g. cyclizine) or doxylamine–pyridoxine are first line; ketosis, weight loss or dehydration mark hyperemesis needing admission and IV fluids.",
    gl: "GTG69",
    link: { type: "calculator", id: "PUQE", label: "PUQE score" },
  },
  {
    id: "recurrent-aps",
    topic: "Recurrent miscarriage",
    pearl: "Test every recurrent miscarriage for antiphospholipid syndrome — it's treatable.",
    detail: "APS is one of the few reversible causes: lupus anticoagulant and anticardiolipin/anti-β2-glycoprotein antibodies (repeated 12 weeks apart). Where present, aspirin plus LMWH improves live-birth rates.",
    gl: "GTG17",
    link: { type: "reader", id: "GTG17", label: "Recurrent Miscarriage" },
  },
  {
    id: "hsv-third-tri",
    topic: "Genital herpes",
    pearl: "A first episode of genital herpes in the third trimester points towards caesarean.",
    detail: "Without time to develop protective antibodies before birth, a first episode near term carries a high neonatal transmission risk — caesarean is recommended, especially within 6 weeks of delivery, with aciclovir suppression from 36 weeks.",
    gl: "BASHH_HSV",
    link: { type: "flowchart", id: "BASHH_HSV_PREGNANCY", label: "HSV in pregnancy" },
  },
  {
    id: "aph-no-pv",
    topic: "Antepartum haemorrhage",
    pearl: "No digital vaginal exam in APH until you've excluded placenta praevia.",
    detail: "A speculum may be safe, but a digital examination in the presence of a low-lying placenta can provoke catastrophic bleeding. Localise the placenta first; resuscitate and monitor the fetus alongside.",
    gl: "GTG63",
    link: { type: "flowchart", id: "GTG63_TRIAGE", label: "APH triage" },
  },
  {
    id: "antid-72",
    topic: "Anti-D",
    pearl: "After a sensitising event, anti-D works best within 72 hours — but give it late rather than not at all.",
    detail: "Any potential sensitising event in a RhD-negative woman (bleeding, trauma, ECV, procedures) needs anti-D, ideally within 72 hours. A Kleihauer quantifies the bleed and tells you whether more is required.",
    gl: "GTG63",
    link: { type: "flowchart", id: "GTG63_ANTID", label: "Anti-D pathway" },
  },
  {
    id: "iron-alt-day",
    topic: "Iron deficiency",
    pearl: "Alternate-day oral iron is often absorbed better than daily dosing.",
    detail: "A single daily dose raises hepcidin and blunts absorption of the next day's dose. Alternate-day (or once-daily rather than divided) dosing can improve uptake and tolerability in iron-deficiency anaemia of pregnancy.",
    gl: "GL783",
    link: { type: "reader", id: "GL783", label: "Iron Deficiency Anaemia" },
  },
  {
    id: "ohss-vte",
    topic: "OHSS",
    pearl: "The danger in OHSS is thrombosis, not just the fluid shift.",
    detail: "Ovarian hyperstimulation syndrome is a prothrombotic state — VTE (including unusual sites such as the upper limb and cerebral veins) is a leading serious complication. Thromboprophylaxis and careful fluid balance matter more than draining ascites.",
    gl: "GTG5",
    link: { type: "flowchart", id: "GTG5_OHSS", label: "OHSS management" },
  },
  {
    id: "ctg-dr-bravado",
    topic: "Fetal monitoring",
    pearl: "Read every CTG the same way, every time: DR C BRAVADO.",
    detail: "Define Risk, Contractions, Baseline RAte, Variability, Accelerations, Decelerations, Overall impression. A structured system stops you missing the abnormal feature — and forces the clinical context back into the interpretation.",
    gl: "NG229",
    link: { type: "flowchart", id: "NG229_CTG", label: "CTG interpretation" },
  },
  {
    id: "sga-doppler",
    topic: "SGA / FGR",
    pearl: "Umbilical artery Doppler is the surveillance tool that changes outcomes in SGA.",
    detail: "Once a fetus is small, umbilical artery Doppler distinguishes the constitutionally small from the growth-restricted and guides surveillance intensity and timing of birth — absent or reversed end-diastolic flow is an urgent finding.",
    gl: "GTG31",
    link: { type: "flowchart", id: "GTG31_SURVEILLANCE", label: "SGA surveillance" },
  },
  {
    id: "twins-ttts",
    topic: "Multiple pregnancy",
    pearl: "Chorionicity, set early, dictates how closely twins are watched.",
    detail: "Monochorionic twins share a placenta and risk twin-to-twin transfusion, so they're scanned fortnightly from 16 weeks. Determining chorionicity in the first trimester is one of the most consequential scans of the pregnancy.",
    gl: "QS46",
    link: { type: "reader", id: "QS46", label: "Multiple Pregnancy" },
  },
  {
    id: "gdm-screen",
    topic: "Diabetes in pregnancy",
    pearl: "Previous GDM? Test early — don't wait for the routine 24–28 week OGTT.",
    detail: "Women with previous gestational diabetes should have an OGTT soon after booking (or early self-monitoring), because recurrence is common and earlier detection improves control and outcomes.",
    gl: "GL983",
    link: { type: "reader", id: "GL983", label: "Diabetes in Pregnancy" },
  },
  {
    id: "pid-empirical",
    topic: "Pelvic inflammatory disease",
    pearl: "Treat suspected PID empirically — a negative swab doesn't exclude it.",
    detail: "The threshold for treating is deliberately low because the cost of missed PID is subfertility and chronic pain. Start broad empirical antibiotics covering gonorrhoea, chlamydia and anaerobes without waiting for microbiology.",
    gl: "BASHH_PID",
    link: { type: "flowchart", id: "BASHH_PID_ANTIBIOTICS", label: "PID antibiotics" },
  },
  {
    id: "smear-pregnancy",
    topic: "Cervical screening",
    pearl: "Routine cervical screening is deferred in pregnancy — but abnormal cytology still needs colposcopy.",
    detail: "A due smear is postponed until after delivery. However, colposcopy for significant abnormalities goes ahead in pregnancy to exclude invasive disease; biopsy is used cautiously and treatment usually deferred to the postnatal period.",
    gl: "NHSCSP20",
    link: { type: "flowchart", id: "NHSCSP20_PREGNANCY", label: "Screening in pregnancy" },
  },
  {
    id: "iol-postdates",
    topic: "Induction of labour",
    pearl: "Not all inductions are equal — prioritise by indication, not by who booked first.",
    detail: "A ward full of inductions needs triage: severe pre-eclampsia or a term PROM past 24 hours outranks an uncomplicated post-dates booking. Rank by the single most urgent indication each woman carries.",
    gl: "GL861",
    link: { type: "iol-prioritizer", id: null, label: "IOL Priority List" },
  },
  {
    id: "endometriosis-lap",
    topic: "Endometriosis",
    pearl: "A normal laparoscopy doesn't exclude endometriosis — and don't delay empirical treatment for one.",
    detail: "Laparoscopy is the reference standard for diagnosis, but findings can be subtle and a negative look doesn't rule the condition out. Symptom-based hormonal treatment can begin without a definitive surgical diagnosis.",
    gl: "NG73",
    link: { type: "flowchart", id: "NG73_DIAGNOSIS", label: "Endometriosis diagnosis" },
  },
];

// ─── daily selection + seen state ────────────────────────────────────────────

// Whole days since epoch in the viewer's LOCAL time (so "today" flips at local
// midnight, not UTC).
function localDayNumber(d) {
  return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000);
}

export function pearlForDate(d = new Date()) {
  const n = PEARLS.length;
  const idx = ((localDayNumber(d) % n) + n) % n;
  return PEARLS[idx];
}

function todayKey(d = new Date()) {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

const SEEN_KEY = "pocketog_pearl_seen_v1";

export function hasUnseenPearl() {
  try {
    return localStorage.getItem(SEEN_KEY) !== todayKey();
  } catch {
    return false;
  }
}

export function markPearlSeen() {
  try {
    localStorage.setItem(SEEN_KEY, todayKey());
  } catch { /* storage unavailable — ignore */ }
}
