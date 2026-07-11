// Pearl of the Day. A rotating teaching point drawn from the app's own content.
// Offline-native: a static, hand-authored list. One pearl surfaces per day,
// chosen deterministically from the date so everyone sees the same pearl and the
// whole list cycles before anything repeats.
//
// Each pearl carries a guideline code (`gl`) plus optional deep-link targets:
//   fc   flowchart id      calc  calculator scenario id
//   drug Rx drug id        tool  a named tool (e.g. iol-prioritizer)
// pearlLinks() turns those into buttons, and always adds the full guideline when
// a reader exists for that code, so a pearl points at both the flowchart and the
// guide when both are available.

import { GUIDELINES } from "@pocket-og/guidelines";
import { READER_AVAILABLE } from "./readerAvailable";

export const PEARLS = [
  {
    id: "aspirin-pet",
    topic: "Pre-eclampsia",
    pearl: "One high-risk factor, or two moderate ones, is enough to warrant aspirin.",
    detail: "Women with any high-risk factor (previous pre-eclampsia, chronic hypertension, CKD, diabetes, autoimmune disease) or two or more moderate factors should take 150 mg aspirin at night from 12 weeks until birth. It is one of the few genuinely preventive interventions in obstetrics.",
    gl: "NG133",
    drug: "aspirin_prophylaxis", drugLabel: "Aspirin prophylaxis",
  },
  {
    id: "mgso4-severe",
    topic: "Severe pre-eclampsia",
    pearl: "Magnesium sulfate is for seizure prevention, not blood-pressure control.",
    detail: "In severe pre-eclampsia and eclampsia, magnesium sulfate (loading dose then infusion) prevents and treats seizures; it does nothing for the blood pressure, which needs its own agent (labetalol, nifedipine or hydralazine). Monitor reflexes, respiratory rate and urine output; calcium gluconate is the antidote.",
    gl: "GL952",
    fc: "GL952_SEVERE_LW", fcLabel: "Severe PET (labour ward)",
  },
  {
    id: "ectopic-mtx",
    topic: "Ectopic pregnancy",
    pearl: "Methotrexate suits the stable, low-hCG, asymptomatic ectopic, not the one in pain.",
    detail: "Medical management is offered when there is no significant pain, an unruptured ectopic under 35 mm with no fetal heartbeat, an hCG typically below 1500, and the woman can return for follow-up. Significant pain or a high or rising hCG points to surgery.",
    gl: "CG623",
    fc: "CG623_MTX", fcLabel: "Ectopic methotrexate pathway",
  },
  {
    id: "pph-ladder",
    topic: "Postpartum haemorrhage",
    pearl: "The 4 Ts still catch almost every PPH: Tone, Trauma, Tissue, Thrombin.",
    detail: "Atony (Tone) causes about 70%. Work the mechanical and pharmacological ladder in parallel with resuscitation (rubbing up a contraction, oxytocin, ergometrine, carboprost, misoprostol), and escalate early to tamponade and theatre if bleeding continues.",
    gl: "GTG52",
    fc: "GTG52_PPH", fcLabel: "PPH management",
  },
  {
    id: "cord-prolapse",
    topic: "Cord prolapse",
    pearl: "Hands off the cord: elevate the presenting part, not the cord.",
    detail: "Handling a prolapsed cord causes vasospasm. Relieve pressure by elevating the presenting part (manually or knee-chest / Trendelenburg), consider filling the bladder to buy time, and expedite delivery, usually category-1 caesarean unless birth is imminent.",
    gl: "GTG50",
    fc: "GTG50_CORD", fcLabel: "Cord prolapse",
  },
  {
    id: "pprom-abx",
    topic: "PPROM",
    pearl: "Erythromycin for PPROM, never co-amoxiclav.",
    detail: "Erythromycin for 10 days (or until labour) prolongs pregnancy and reduces neonatal morbidity in preterm prelabour rupture of membranes. Co-amoxiclav is avoided because of the association with neonatal necrotising enterocolitis.",
    gl: "GL895",
    drug: "erythromycin", drugLabel: "Erythromycin",
  },
  {
    id: "steroids-window",
    topic: "Antenatal steroids",
    pearl: "Antenatal corticosteroids buy the most for the baby between 24 and 34+6 weeks.",
    detail: "A course of betamethasone or dexamethasone accelerates fetal lung maturity and reduces respiratory distress, intraventricular haemorrhage and neonatal death when birth is anticipated within 7 days. Two doses, 24 hours apart.",
    gl: "NG25",
    drug: "betamethasone", drugLabel: "Betamethasone",
  },
  {
    id: "mg-neuro",
    topic: "Preterm birth",
    pearl: "Magnesium sulfate isn't only for pre-eclampsia; it's fetal neuroprotection too.",
    detail: "Given to women in established preterm labour or with planned preterm birth before around 30 weeks (consider up to 33+6), magnesium sulfate reduces the risk of cerebral palsy in the surviving child.",
    gl: "NG25",
  },
  {
    id: "vte-timing",
    topic: "VTE prophylaxis",
    pearl: "The VTE score doesn't just decide if, it decides when.",
    detail: "Antenatally, a score of 4 or more means LMWH from the first trimester; a score of 3 means from 28 weeks. The risk assessment is repeated on admission and after birth, when the threshold changes again.",
    gl: "GL891",
    calc: "VTE_RISK", calcLabel: "VTE risk assessment",
  },
  {
    id: "icp-timing",
    topic: "Obstetric cholestasis",
    pearl: "In cholestasis, the peak bile acid level drives delivery timing.",
    detail: "The risk of stillbirth rises with the peak serum bile acid concentration. Severe disease (peak of 100 µmol/L or more) warrants consideration of birth around 35 to 36 weeks; milder disease is managed with later timing and surveillance.",
    gl: "GL880",
    fc: "GL880_DELIVERY", fcLabel: "ICP delivery timing",
  },
  {
    id: "rfm-kickcounts",
    topic: "Reduced fetal movements",
    pearl: "Formal kick-counting isn't recommended, but never dismiss a mother's concern.",
    detail: "There's no evidence that fixed kick-count charts improve outcomes, yet reduced movements can herald fetal compromise. After 28 weeks, assess with CTG; recurrent episodes warrant growth and liquor assessment.",
    gl: "GTG57",
    fc: "GTG57_CARE_PATHWAY", fcLabel: "RFM care pathway",
  },
  {
    id: "aeh-atypia",
    topic: "Endometrial hyperplasia",
    pearl: "Atypia changes everything: it's a surgical diagnosis.",
    detail: "Endometrial hyperplasia without atypia is managed medically, LNG-IUS first line, with a low progression risk. Atypical hyperplasia carries a substantial risk of concurrent or future cancer, so total hysterectomy is the standard treatment.",
    gl: "GTG67",
    fc: "GTG67_AEH", fcLabel: "Atypical hyperplasia",
  },
  {
    id: "puqe",
    topic: "Nausea & vomiting",
    pearl: "Score the vomiting before you treat it: the PUQE guides escalation.",
    detail: "The PUQE score grades severity of nausea and vomiting of pregnancy. Antihistamines (e.g. cyclizine) or doxylamine with pyridoxine are first line; ketosis, weight loss or dehydration mark hyperemesis needing admission and IV fluids.",
    gl: "GTG69",
    calc: "PUQE", calcLabel: "PUQE score",
  },
  {
    id: "recurrent-aps",
    topic: "Recurrent miscarriage",
    pearl: "Test every recurrent miscarriage for antiphospholipid syndrome; it's treatable.",
    detail: "APS is one of the few reversible causes: lupus anticoagulant and anticardiolipin or anti-β2-glycoprotein antibodies (repeated 12 weeks apart). Where present, aspirin plus LMWH improves live-birth rates.",
    gl: "GTG17",
  },
  {
    id: "hsv-third-tri",
    topic: "Genital herpes",
    pearl: "A first episode of genital herpes in the third trimester points towards caesarean.",
    detail: "Without time to develop protective antibodies before birth, a first episode near term carries a high neonatal transmission risk, so caesarean is recommended, especially within 6 weeks of delivery, with aciclovir suppression from 36 weeks.",
    gl: "BASHH_HSV",
    fc: "BASHH_HSV_PREGNANCY", fcLabel: "HSV in pregnancy",
  },
  {
    id: "aph-no-pv",
    topic: "Antepartum haemorrhage",
    pearl: "No digital vaginal exam in APH until you've excluded placenta praevia.",
    detail: "A speculum may be safe, but a digital examination in the presence of a low-lying placenta can provoke catastrophic bleeding. Localise the placenta first; resuscitate and monitor the fetus alongside.",
    gl: "GTG63",
    fc: "GTG63_TRIAGE", fcLabel: "APH triage",
  },
  {
    id: "antid-72",
    topic: "Anti-D",
    pearl: "After a sensitising event, anti-D works best within 72 hours, but give it late rather than not at all.",
    detail: "Any potential sensitising event in a RhD-negative woman (bleeding, trauma, ECV, procedures) needs anti-D, ideally within 72 hours. A Kleihauer quantifies the bleed and tells you whether more is required.",
    gl: "GTG63",
    fc: "GTG63_ANTID", fcLabel: "Anti-D pathway",
  },
  {
    id: "iron-alt-day",
    topic: "Iron deficiency",
    pearl: "Alternate-day oral iron is often absorbed better than daily dosing.",
    detail: "A single daily dose raises hepcidin and blunts absorption of the next day's dose. Alternate-day (or once-daily rather than divided) dosing can improve uptake and tolerability in iron-deficiency anaemia of pregnancy.",
    gl: "GL783",
  },
  {
    id: "ohss-vte",
    topic: "OHSS",
    pearl: "The danger in OHSS is thrombosis, not just the fluid shift.",
    detail: "Ovarian hyperstimulation syndrome is a prothrombotic state. VTE (including unusual sites such as the upper limb and cerebral veins) is a leading serious complication. Thromboprophylaxis and careful fluid balance matter more than draining ascites.",
    gl: "GTG5",
    fc: "GTG5_OHSS", fcLabel: "OHSS management",
  },
  {
    id: "ctg-dr-bravado",
    topic: "Fetal monitoring",
    pearl: "Read every CTG the same way, every time: DR C BRAVADO.",
    detail: "Define Risk, Contractions, Baseline RAte, Variability, Accelerations, Decelerations, Overall impression. A structured system stops you missing the abnormal feature, and forces the clinical context back into the interpretation.",
    gl: "NG229",
    fc: "NG229_CTG", fcLabel: "CTG interpretation",
  },
  {
    id: "sga-doppler",
    topic: "SGA / FGR",
    pearl: "Umbilical artery Doppler is the surveillance tool that changes outcomes in SGA.",
    detail: "Once a fetus is small, umbilical artery Doppler distinguishes the constitutionally small from the growth-restricted and guides surveillance intensity and timing of birth; absent or reversed end-diastolic flow is an urgent finding.",
    gl: "GTG31",
    fc: "GTG31_SURVEILLANCE", fcLabel: "SGA surveillance",
  },
  {
    id: "twins-ttts",
    topic: "Multiple pregnancy",
    pearl: "Chorionicity, set early, dictates how closely twins are watched.",
    detail: "Monochorionic twins share a placenta and risk twin-to-twin transfusion, so they're scanned fortnightly from 16 weeks. Determining chorionicity in the first trimester is one of the most consequential scans of the pregnancy.",
    gl: "NG137",
    fc: "QS46_CARE_PATHWAY", fcLabel: "Twin care pathway",
  },
  {
    id: "gdm-screen",
    topic: "Diabetes in pregnancy",
    pearl: "Previous GDM? Test early, don't wait for the routine 24 to 28 week OGTT.",
    detail: "Women with previous gestational diabetes should have an OGTT soon after booking (or early self-monitoring), because recurrence is common and earlier detection improves control and outcomes.",
    gl: "GL983",
  },
  {
    id: "pid-empirical",
    topic: "Pelvic inflammatory disease",
    pearl: "Treat suspected PID empirically; a negative swab doesn't exclude it.",
    detail: "The threshold for treating is deliberately low because the cost of missed PID is subfertility and chronic pain. Start broad empirical antibiotics covering gonorrhoea, chlamydia and anaerobes without waiting for microbiology.",
    gl: "BASHH_PID",
    fc: "BASHH_PID_ANTIBIOTICS", fcLabel: "PID antibiotics",
  },
  {
    id: "smear-pregnancy",
    topic: "Cervical screening",
    pearl: "Routine cervical screening is deferred in pregnancy, but abnormal cytology still needs colposcopy.",
    detail: "A due smear is postponed until after delivery. However, colposcopy for significant abnormalities goes ahead in pregnancy to exclude invasive disease; biopsy is used cautiously and treatment usually deferred to the postnatal period.",
    gl: "NHSCSP20",
    fc: "NHSCSP20_PREGNANCY", fcLabel: "Screening in pregnancy",
  },
  {
    id: "iol-postdates",
    topic: "Induction of labour",
    pearl: "Not all inductions are equal: prioritise by indication, not by who booked first.",
    detail: "A ward full of inductions needs triage: severe pre-eclampsia or a term PROM past 24 hours outranks an uncomplicated post-dates booking. Rank by the single most urgent indication each woman carries.",
    gl: "GL861",
    tool: "iol-prioritizer", toolLabel: "IOL Priority List",
  },
  {
    id: "endometriosis-lap",
    topic: "Endometriosis",
    pearl: "A normal laparoscopy doesn't exclude endometriosis, and don't delay empirical treatment for one.",
    detail: "Laparoscopy is the reference standard for diagnosis, but findings can be subtle and a negative look doesn't rule the condition out. Symptom-based hormonal treatment can begin without a definitive surgical diagnosis.",
    gl: "NG73",
    fc: "NG73_DIAGNOSIS", fcLabel: "Endometriosis diagnosis",
  },
];

// Build the ordered link buttons for a pearl: the specific target(s) first, then
// the full guideline whenever a reader exists for its code.
export function pearlLinks(pearl) {
  const out = [];
  if (pearl.fc) out.push({ type: "flowchart", id: pearl.fc, label: pearl.fcLabel, kind: "flowchart" });
  if (pearl.calc) out.push({ type: "calculator", id: pearl.calc, label: pearl.calcLabel, kind: "calc" });
  if (pearl.drug) out.push({ type: "drug", id: pearl.drug, label: pearl.drugLabel, kind: "drug" });
  if (pearl.tool) out.push({ type: pearl.tool, id: null, label: pearl.toolLabel, kind: "tool" });
  if (READER_AVAILABLE.has(pearl.gl)) {
    const g = GUIDELINES[pearl.gl];
    out.push({ type: "reader", id: pearl.gl, label: g ? g.label : "Full guideline", kind: "guide" });
  }
  return out;
}

// ─── daily selection + seen / dismissed state ────────────────────────────────

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
const DISMISS_KEY = "pocketog_pearl_dismissed_v1";

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
  } catch { /* storage unavailable, ignore */ }
}

export function isPearlDismissed() {
  try {
    return localStorage.getItem(DISMISS_KEY) === todayKey();
  } catch {
    return false;
  }
}

export function dismissPearl() {
  try {
    localStorage.setItem(DISMISS_KEY, todayKey());
  } catch { /* storage unavailable, ignore */ }
}
