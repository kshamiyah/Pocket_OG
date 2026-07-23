// On Call simulation cases. A fictional patient walks into MAU and the user is
// asked, step by step, what they would do. Every question is scored against the
// app's own content: decision beats pull their options verbatim from the linked
// flowchart node, and knowledge/checklist beats quote the guideline sections,
// so a case can never disagree with the cited guidance it teaches.
//
// Beat kinds (rendered by SimPlayer as an unfolding encounter feed):
//   info      — narrative only; sets the scene, may update the obs panel
//   choice    — single-best-answer question; `answer` is the correct index
//   checklist — pick-the-right-set; each item is required or a distractor
//   lesson    — closing teaching screen: takeaways, score and deep links
// Any beat may also carry:
//   time      — clock time shown in the feed ("18:40"), advancing the shift
//   dialogue  — [{ who: "patient" | "midwife", text }] spoken lines
//   obs       — flat key/value pairs logged to Notes (legacy vitals fallback)
//   bedside   — structured panel: { kind: "vitals"|"ctg"|"scan", ... }
//
// A choice beat with `fromNode: { fc, node }` ties the answer index to the
// flowchart node. Optional `options` override the labels shown in the sim
// (action-oriented wording); if omitted, options are pulled verbatim from the node.
// Distractors in authored beats are real pathway actions that are wrong for
// this patient, or approaches the guideline explicitly recommends against;
// nothing is invented.

import { FLOWCHARTS } from "./flowcharts";

// Options for a choice beat: authored options first, else flowchart node verbatim.
export function beatOptions(beat) {
  if (beat.options?.length) return beat.options;
  if (beat.fromNode) return nodeOptions(beat.fromNode.fc, beat.fromNode.node);
  return [];
}

// Options of a flowchart decision node, verbatim.
export function nodeOptions(fcId, nodeId) {
  const node = FLOWCHARTS[fcId]?.nodes?.[nodeId];
  return (node?.options ?? []).map(o => ({ label: o.label, sublabel: o.sublabel }));
}

// Deterministic PRNG from a string seed (mulberry32 over an FNV-1a hash).
function seededRand(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
  return () => {
    h |= 0; h = (h + 0x6D2B79F5) | 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// A choice beat's options in a shuffled-but-stable order, with the correct
// answer index remapped to its new position. Seeded from the beat's own content
// so every call site (render, scoring, debrief) derives the SAME order without
// shared state, and so the correct answer is never fixed to one position. The
// data keeps `answer` pointing at the clinically correct option; only the
// display order changes.
export function choiceView(beat) {
  const opts = beatOptions(beat);
  const answer = beat.answer ?? 0;
  if (opts.length < 2) return { options: opts, answer };
  const seed = `${beat.question ?? ""}|${opts.map(o => o.label).join("|")}`;
  const rnd = seededRand(seed);
  const idx = opts.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return { options: idx.map(i => opts[i]), answer: idx.indexOf(answer) };
}

export const SIM_CASES = [
  {
    id: "mau-rfm-34",
    title: "Reduced fetal movements",
    setting: "Maternity Assessment Unit",
    gl: "GTG57",
    difficulty: 2,
    room: "Room 2",
    intro: "A midwife hands you the triage card for the next patient. All patients in this simulation are fictional.",
    patient: {
      name: "Amara O (fictional)",
      firstName: "Amara",
      details: "32 · G2 P1 · 34+2 weeks",
      history: "Previous term SVD. This pregnancy uncomplicated so far; anomaly scan normal. Smokes 8–10 cigarettes/day. Anterior placenta on the 20-week scan.",
    },
    beats: [
      {
        kind: "info",
        time: "18:40",
        title: "Arrival in MAU",
        narrative: "The unit is mid-evening busy: two CTGs running, a phone that will not stop. The coordinating midwife hands you a triage card.",
        dialogue: [
          { who: "midwife", text: "Room 2 for you. Amara, 34 plus 2, second baby. Baby moving much less since yesterday evening, no pain, no bleeding, no fluid. Obs are fine. She's quite worked up." },
        ],
        obs: { "BP": "118/74", "Pulse": "82", "Temp": "36.7 °C", "Urinalysis": "pending" },
      },
      {
        kind: "choice",
        time: "18:44",
        narrative: "Amara is perched on the edge of the couch, coat still on, one hand resting on her bump. She searches your face as you introduce yourself.",
        dialogue: [
          { who: "patient", text: "Is she okay? She's normally so busy after dinner, kicking away while I watch telly. Since last night it's just been these little flutters." },
        ],
        question: "What is your first priority?",
        options: [
          { label: "Auscultate the fetal heart with a handheld Doppler" },
          { label: "Put her straight on the CTG monitor" },
          { label: "Arrange an ultrasound scan for growth and liquor" },
          { label: "Reassure her that an anterior placenta dampens movements" },
        ],
        answer: 0,
        why: "RFM is the presenting symptom in around 50% of intrauterine fetal deaths, so the first priority is always to confirm fetal viability with handheld Doppler auscultation, differentiating the fetal heart from the maternal pulse (the FHR should be roughly double the maternal rate). CTG and USS have their place later in the pathway, and an anterior placenta must never be used to falsely reassure.",
        source: { gl: "GTG57", sectionId: "gtg57-clinical-assessment", label: "GTG57 · Clinical assessment when RFM presents" },
      },
      {
        kind: "checklist",
        time: "18:47",
        narrative: "You find the fetal heart quickly with the sonicaid: 148 bpm, galloping along, clearly distinct from Amara's pulse of 82. Her shoulders drop an inch.",
        dialogue: [
          { who: "patient", text: "Oh, thank God. So she's alright then?" },
        ],
        question: "A heartbeat is not the whole answer. Which of the following complete your bedside assessment?",
        obs: { "BP": "118/74", "Pulse": "82", "FH (Doppler)": "148 bpm" },
        items: [
          { label: "History of risk factors for stillbirth and FGR", required: true, why: "Smoking, hypertension, diabetes, prior SGA or stillbirth, obesity and recurrent RFM all raise the risk of adverse outcome and change the pathway." },
          { label: "Measure SFH and plot on the growth chart", required: true, why: "SFH below the 10th centile is the strongest clinical predictor of adverse outcome after RFM (OR 15.43)." },
          { label: "Blood pressure and urinalysis", required: true, why: "Pre-eclampsia is associated with placental dysfunction; BP and urinalysis are part of every RFM assessment." },
          { label: "Start a formal kick chart on the unit", required: false, why: "Formal fetal movement counting to a specified number is not recommended; there is insufficient evidence of benefit (Grade A)." },
          { label: "Book a routine USS for every RFM presentation", required: false, why: "Routine USS for all RFM presentations is not recommended: in the AFFIRM trial it did not reduce stillbirth but increased induction and caesarean rates. USS is for selected cases." },
          { label: "Biophysical profile", required: false, why: "There is insufficient evidence to recommend the biophysical profile routinely in RFM." },
        ],
        source: { gl: "GTG57", sectionId: "gtg57-clinical-assessment", label: "GTG57 · Clinical assessment when RFM presents" },
      },
      {
        kind: "choice",
        time: "18:52",
        narrative: "SFH measures 33 cm, plotting on the 50th centile for 34 weeks. BP 118/74, urinalysis negative. Going through her history she confirms she smokes, 8 to 10 a day, \"less than before I was pregnant\". No diabetes, no hypertension, no previous small baby. This is her first episode of reduced movements.",
        obs: { "SFH": "33 cm (50th)", "BP": "118/74", "Urinalysis": "NAD", "Smoker": "8–10/day" },
        dialogue: [
          { who: "midwife", text: "Do you want her on the monitor?" },
        ],
        question: "She is 34+2 weeks and the fetal heart is confirmed. What monitoring does the guideline call for now?",
        options: [
          { label: "Computerised CTG for at least 20 minutes" },
          { label: "A 10-minute visual CTG is sufficient" },
          { label: "No CTG needed, the Doppler already confirmed a heartbeat" },
          { label: "CTG only if she re-attends with a second episode" },
        ],
        answer: 0,
        why: "At 26+0 weeks or beyond, once viability is confirmed, a computerised CTG for at least 20 minutes is used to exclude acute fetal compromise. Computerised interpretation is preferred because it reduces inter-observer variation; a reactive trace with accelerations alongside movements indicates an intact fetal autonomic nervous system. A Doppler heartbeat alone says nothing about compromise.",
        source: { gl: "GTG57", sectionId: "gtg57-clinical-assessment", label: "GTG57 · Computerised CTG (≥26 weeks)" },
      },
      {
        kind: "choice",
        time: "19:24",
        narrative: "The computerised CTG runs for 24 minutes. The printout shows a reactive trace: baseline 145 bpm, variability 5–25 bpm, accelerations coinciding with the flutters Amara felt, and no decelerations. Computerised interpretation: normal. You come back to review it and she catches your eye before you can speak.",
        bedside: {
          kind: "ctg",
          duration: "24 min · computerised",
          category: "normal",
          source: "NG229 §1.4 · GTG57 computerised CTG",
          features: [
            { label: "Baseline", value: "145 bpm", grade: "white" },
            { label: "Variability", value: "5–25 bpm", grade: "white" },
            { label: "Accelerations", value: "Present with movements", grade: "white" },
            { label: "Decelerations", value: "None", grade: "white" },
          ],
        },
        obs: {
          "CTG": "Normal (24 min)",
          "Baseline": "145 bpm",
          "Variability": "5–25 bpm",
          "Accelerations": "present",
          "Decelerations": "none",
        },
        dialogue: [
          { who: "patient", text: "The machine looked fine, the midwife said. But the kicks still feel less than they should be. I know her." },
        ],
        question: "The CTG is normal. Following the RFM care pathway, what happens next?",
        fromNode: { fc: "GTG57_CARE_PATHWAY", node: "ctg-result" },
        options: [
          { label: "Senior obstetrician review" },
          { label: "Reassure and discharge" },
          { label: "Book an ultrasound scan" },
        ],
        answer: 2,
        why: "The CTG is normal, but her perception of reduced movements persists and she has a risk factor (smoking, aOR 2.96 for adverse outcome). A normal CTG with persisting RFM or any risk factor for FGR or stillbirth is an indication for ultrasound assessment: EFW and abdominal circumference, amniotic fluid volume and umbilical artery Doppler. Discharge on the strength of the CTG alone would be premature here.",
        source: { gl: "GTG57", sectionId: "gtg57-clinical-assessment", label: "GTG57 · USS after normal CTG (when indicated)" },
      },
      {
        kind: "choice",
        time: "20:05",
        narrative: "The on-call sonographer fits her in. You watch the screen together: EFW 2,350 g on the 48th centile, deepest vertical pocket 5.2 cm, umbilical artery Doppler with normal PI and end-diastolic flow present. Growth is tracking its curve. Amara watches your face, not the screen.",
        bedside: {
          kind: "scan",
          title: "Ultrasound",
          findings: [
            { label: "EFW", value: "2,350 g", sub: "48th centile" },
            { label: "Liquor (DVP)", value: "5.2 cm", sub: "Normal volume" },
            { label: "UA Doppler", value: "Normal PI", sub: "End-diastolic flow present" },
          ],
        },
        obs: { "EFW": "2,350 g (48th)", "DVP": "5.2 cm", "UA Doppler": "normal PI, EDF present" },
        question: "How do you act on these ultrasound findings?",
        fromNode: { fc: "GTG57_CARE_PATHWAY", node: "uss-result" },
        options: [
          { label: "Reassure her and arrange discharge" },
          { label: "Manage as SGA or abnormal scan" },
        ],
        answer: 0,
        why: "Growth, liquor and Doppler are all normal, so there is no objective evidence of fetal compromise. She should be reassured: with normal investigations there is no indication for expediting birth (Grade A), and around 70% of women with RFM go on to have a good pregnancy outcome. Had the scan shown SGA, oligohydramnios or an abnormal Doppler, management would follow GTG31.",
        source: { gl: "GTG57", sectionId: "gtg57-after-normal-investigations", label: "GTG57 · After normal investigations" },
      },
      {
        kind: "choice",
        time: "20:30",
        narrative: "Coat back on, notes in hand, she pauses at the door.",
        dialogue: [
          { who: "patient", text: "Should I download one of those kick-counting apps? So I know when to come back?" },
        ],
        question: "What discharge advice does the guideline support?",
        options: [
          { label: "No formal counting: know your baby's own pattern, and return immediately with any further reduction or change" },
          { label: "Count to ten movements every day and attend if you fall short" },
          { label: "Only return if you feel no movements at all for 24 hours" },
          { label: "Offer induction of labour now to remove the ongoing risk" },
        ],
        answer: 0,
        why: "Formal fetal movement counting to a specified number is not recommended (Grade A); awareness of the baby's individual pattern matters more than a target. She should be told that movements do not decrease towards term and to attend immediately with any further RFM, never to wait out a silent day. And with normal investigations there is no indication for induction: AFFIRM showed routine intervention increased inductions and caesareans without reducing stillbirth. If she re-attends, recurrent RFM makes ultrasound mandatory.",
        source: { gl: "GTG57", sectionId: "gtg57-after-normal-investigations", label: "GTG57 · After normal investigations (AFFIRM)" },
      },
      {
        kind: "lesson",
        title: "The lesson: reduced fetal movements",
        summary: "Amara goes home reassured, with clear safety-netting and a documented plan. The pathway that got her there is worth keeping:",
        points: [
          "Viability first. RFM is the presenting symptom in about half of intrauterine fetal deaths; auscultate with handheld Doppler before any other investigation.",
          "Bedside assessment is history (risk factors for stillbirth and FGR), SFH plotted on the chart, BP and urinalysis. SFH below the 10th centile is the strongest clinical predictor of adverse outcome.",
          "At 26+0 weeks or later: computerised CTG for at least 20 minutes to exclude acute compromise.",
          "Normal CTG does not end the pathway if RFM persists or risk factors are present: scan for growth, liquor and umbilical artery Doppler.",
          "All investigations normal means no expediting of birth (Grade A) and no kick charts; safety-net instead: movements do not decrease towards term, return immediately with any change.",
          "Recurrent RFM (2 or more episodes in 21 days after 26 weeks) is a different beast: USS becomes mandatory, and from 39+0 weeks induction can be offered.",
        ],
        evidence: "The AFFIRM trial (Lancet 2018) tested routine USS and early-term IOL offers for every RFM presentation: stillbirth was not reduced, while induction and caesarean rates rose. It is why this pathway investigates selectively rather than intervening on every presentation.",
        links: [
          { type: "reader", id: "GTG57", label: "GTG57: the full guide" },
          { type: "flowchart", id: "GTG57_CARE_PATHWAY", label: "RFM care pathway ≥28 weeks" },
          { type: "flowchart", id: "GTG57_RECURRENT", label: "Recurrent RFM pathway" },
        ],
      },
    ],
  },

  // ── DRAFTS awaiting clinical sign-off (shown in the On Call library with a ───
  // draft tag; filtered from production separately). Each patient journeys
  // through several co-occurring guideline pitfalls; every decision is built
  // backwards from a documented trap (see the sim-author skill).
  {
    id: "ds-pph-minor-atony",
    title: "Bleeding after a forceps birth",
    setting: "Delivery Suite",
    gl: "GTG52",
    difficulty: 1,
    room: "Room 1",
    draft: true,
    intro: "A midwife calls you into a birth room just after delivery. All patients in this simulation are fictional.",
    patient: {
      name: "Bea T (fictional)",
      firstName: "Bea",
      details: "29 · G3 P2 · forceps birth 15 min ago",
      history: "Forceps birth for a long second stage. Active third stage complete, placenta out and complete. Normotensive, no medical history, no asthma.",
    },
    beats: [
      {
        kind: "info",
        time: "21:10",
        title: "Just after delivery",
        narrative: "The baby is on Bea's chest and doing well. The midwife is weighing swabs and looks up as a steady trickle turns into a flow. The fundus feels soft and high.",
        dialogue: [
          { who: "midwife", text: "Forceps for a long second stage. Placenta's out and complete, but she's bleeding more than I'd like." },
        ],
        obs: { "BP": "118/76", "Pulse": "88", "Uterus": "soft" },
      },
      {
        kind: "checklist",
        time: "21:12",
        narrative: "The loss is about 500 ml and continuing from a soft uterus.",
        question: "What are your immediate first steps, done together?",
        items: [
          { label: "Call for help: the midwife in charge and the obstetrician", required: true, why: "Delayed escalation is a recurring contributor in PPH reviews; calling for help early is one of the highest-impact actions." },
          { label: "Rub up a contraction and give the oxytocin", required: true, why: "Atony is the likely cause, so a mechanical contraction and the first-line uterotonic go in together." },
          { label: "IV access (16G) and send FBC, coagulation and group and screen", required: true, why: "IV access and baseline bloods are immediate actions in minor PPH." },
          { label: "Catheterise and monitor hourly urine output", required: true, why: "A full bladder impairs uterine contraction; catheterise and target urine output above 30 ml/hr." },
          { label: "Take her straight to theatre for examination under anaesthesia", required: false, why: "Theatre is not a first step for a 500 ml bleed that has not yet been treated." },
          { label: "Wait and reassess in 15 minutes before doing anything", required: false, why: "Watchful waiting without treatment is the delayed-escalation pattern PPH reviews warn against." },
        ],
        source: { gl: "GTG52", sectionId: "gtg52-minor", label: "GTG52 · Minor PPH: immediate actions" },
      },
      {
        kind: "choice",
        time: "21:16",
        narrative: "You rub up a contraction and the oxytocin runs. The fundus is now firm and central, but bright red blood keeps trickling steadily, and the total is up to 700 ml.",
        question: "What is the most likely source, and your next step?",
        options: [
          { label: "Genital tract trauma: examine the cervix and vagina under direct vision" },
          { label: "Uterine atony: give a further uterotonic" },
          { label: "Retained tissue: proceed to manual removal of placenta" },
          { label: "Coagulopathy: send a clotting screen and await the result" },
        ],
        answer: 0,
        why: "A firm, contracted uterus argues against tone. Continued brisk bleeding after an instrumental birth points to genital tract trauma, found by examining the cervix and vagina under good exposure and light. More uterotonics for an already-contracted uterus, or reaching first for manual removal or a clotting screen, miss the likely source.",
        source: { gl: "GTG52", sectionId: "gtg52-minor", label: "GTG52 · Minor PPH: address the cause" },
      },
      {
        kind: "choice",
        time: "21:22",
        narrative: "You find a high vaginal tear and the registrar starts to repair it. As they work, the running total reaches 850 ml. Bea's pulse has climbed from 88 to 120 and her BP is 94/50.",
        question: "What is the most appropriate next step?",
        options: [
          { label: "Activate the major PPH protocol now" },
          { label: "Continue; the loss is still under 1000 ml" },
          { label: "Give ergometrine and reassess in ten minutes" },
          { label: "Recheck her observations in fifteen minutes" },
        ],
        answer: 0,
        why: "She is tachycardic and hypotensive: haemodynamically compromised, itself a trigger to escalate regardless of the sub-1000 ml figure. Anchoring on the number, adding another drug, or passively rechecking are the delayed-escalation patterns PPH reviews repeatedly flag.",
        source: { gl: "GTG52", sectionId: "gtg52-minor", label: "GTG52 · Minor PPH: when to escalate" },
      },
      {
        kind: "lesson",
        title: "The lesson: find the cause, treat the patient",
        summary: "Bea's bleeding was trauma masquerading behind a treated atony, and she needed escalation on her physiology, not the number.",
        points: [
          "Tone causes most PPH, but a firm uterus that keeps bleeding points elsewhere: trauma (especially after an instrumental birth) or retained tissue.",
          "First moves happen together: call for help, rub up a contraction and give oxytocin, IV access and bloods, catheterise.",
          "Examine the genital tract under direct vision when the uterus is contracted but bleeding continues.",
          "Escalate the moment she is haemodynamically compromised, even below 1000 ml. Treat the patient, not the threshold.",
        ],
        links: [
          { type: "reader", id: "GTG52", label: "GTG52: the full guide" },
          { type: "flowchart", id: "GTG52_PPH", label: "PPH management pathway" },
        ],
      },
    ],
  },

  {
    id: "ds-pph-major-txa",
    title: "Major haemorrhage after twins",
    setting: "Delivery Suite",
    gl: "GTG52",
    difficulty: 2,
    room: "Room 3",
    draft: true,
    intro: "The emergency buzzer goes on the delivery suite overnight. All patients in this simulation are fictional.",
    patient: {
      name: "Chidinma A (fictional)",
      firstName: "Chidinma",
      details: "34 · G2 P1 · twin birth 25 min ago",
      history: "Twin pregnancy delivered vaginally with an overdistended uterus. Drug chart lists a salbutamol inhaler used most days, and an admission with wheeze last winter. No hypertension. Both placentae complete.",
    },
    beats: [
      {
        kind: "info",
        time: "02:40",
        title: "The buzzer goes",
        narrative: "Both twins are out and well, but the bleeding is brisk and now pooling on the floor. The weighed loss is 1300 ml and climbing, and her pulse is 112.",
        dialogue: [
          { who: "midwife", text: "Placentae are complete, but she's pouring and her pulse is climbing." },
        ],
        obs: { "BP": "104/62", "Pulse": "112", "EBL": "1300 ml" },
      },
      {
        kind: "checklist",
        time: "02:43",
        narrative: "This is a major PPH and you are leading the response.",
        question: "Which belong in your immediate major-haemorrhage response?",
        items: [
          { label: "Call the senior obstetrician, anaesthetist and senior midwife, and activate the major PPH protocol", required: true, why: "Early senior help and protocol activation are the difference-makers PPH reviews repeatedly identify." },
          { label: "Two large-bore cannulae (14 to 16G) and crossmatch 4 units of red cells", required: true, why: "Two large-bore cannulae and an urgent crossmatch of 4 units are standard in major PPH." },
          { label: "Rapid crystalloid (Hartmann's up to 1.5 to 2 L) while blood is coming", required: true, why: "Rapid crystalloid bridges resuscitation until blood products arrive." },
          { label: "O-negative blood if the haemorrhage is immediately life-threatening before crossmatch is ready", required: true, why: "O-negative blood is used when life-threatening haemorrhage cannot wait for crossmatch." },
          { label: "Hold all treatment until the FBC and coagulation results are back", required: false, why: "Do not delay treatment awaiting laboratory results in major PPH." },
          { label: "Leave the consultant until loss passes 2000 ml", required: false, why: "Early consultant involvement is recommended; delayed senior involvement is a recurring finding." },
        ],
        source: { gl: "GTG52", sectionId: "gtg52-major", label: "GTG52 · Major PPH: call for help and resuscitation" },
      },
      {
        kind: "choice",
        time: "02:50",
        narrative: "The oxytocin infusion is running and ergometrine is in, but the uterus stays soft and she keeps bleeding. You glance again at her drug chart: the salbutamol inhaler, and the winter admission with wheeze.",
        question: "Which is the most appropriate next uterotonic?",
        options: [
          { label: "Misoprostol 800 mcg" },
          { label: "Carboprost 0.25 mg intramuscularly" },
          { label: "A repeat dose of ergometrine" },
          { label: "A further oxytocin bolus" },
        ],
        answer: 0,
        why: "The inhaler and the wheeze admission point to asthma, in which carboprost, the usual next uterotonic after oxytocin and ergometrine, is contraindicated. Misoprostol is the appropriate choice. Repeating ergometrine or oxytocin adds no new mechanism, and the asthma is the detail that changes the answer.",
        source: { gl: "GTG52", sectionId: "gtg52-major", label: "GTG52 · Major PPH: pharmacological management" },
      },
      {
        kind: "choice",
        time: "02:58",
        narrative: "She has lost 1800 ml and is still bleeding. The lab phones to say the FBC and clotting will be another 25 minutes.",
        question: "What is the most appropriate action now?",
        options: [
          { label: "Give tranexamic acid and start empirical blood products without waiting" },
          { label: "Await the clotting result before giving blood products" },
          { label: "Wait for the full crossmatch before transfusing" },
          { label: "Give a further dose of misoprostol" },
        ],
        answer: 0,
        why: "In major PPH you do not delay treatment for laboratory results: give tranexamic acid (1 g IV, as early as possible within 3 hours of birth) and transfuse empirically, using O-negative blood if life-threatening before crossmatch is ready. Waiting for the clotting screen or full crossmatch costs time, and more misoprostol adds no new mechanism.",
        source: { gl: "GTG52", sectionId: "gtg52-major", label: "GTG52 · Major PPH: resuscitation" },
      },
      {
        kind: "choice",
        time: "03:06",
        narrative: "Point-of-care testing returns: fibrinogen 1.1 g/L, platelets 90, Hb 82, and she is still bleeding.",
        question: "Which product is the priority?",
        options: [
          { label: "Cryoprecipitate" },
          { label: "Fresh frozen plasma" },
          { label: "Platelets" },
          { label: "Red cells" },
        ],
        answer: 0,
        why: "Fibrinogen below 2 g/L is the priority to correct, and cryoprecipitate is the first-choice product for it. Platelets at 90 are above the 75 transfusion trigger, the Hb of 82 is near target, and FFP is for broader coagulopathy or a 1:1 ratio in massive transfusion, not this specific fibrinogen deficit.",
        source: { gl: "GTG52", sectionId: "gtg52-major", label: "GTG52 · Major PPH: blood products" },
      },
      {
        kind: "lesson",
        title: "The lesson: running a major PPH",
        summary: "A major atonic PPH after twins, where the asthma changes the drug and the priorities are early escalation, empirical treatment and the right product first.",
        points: [
          "Over 1000 ml is major: activate the response immediately and do not wait for laboratory results.",
          "The uterotonic ladder bends to the patient: carboprost is contraindicated in asthma, ergometrine in hypertension or cardiac disease.",
          "Give tranexamic acid 1 g IV as early as possible, and transfuse empirically (O-negative if life-threatening before crossmatch).",
          "Correct fibrinogen first when it is below 2 g/L, with cryoprecipitate; platelets only below 75.",
        ],
        links: [
          { type: "reader", id: "GTG52", label: "GTG52: the full guide" },
          { type: "flowchart", id: "GTG52_PPH", label: "PPH management pathway" },
        ],
      },
    ],
  },

  {
    id: "ds-pph-massive-judgment",
    title: "Massive haemorrhage, not settling",
    setting: "Delivery Suite",
    gl: "GTG52",
    difficulty: 3,
    room: "Theatre",
    draft: true,
    intro: "You are called to a woman who is not responding to the major PPH measures. All patients in this simulation are fictional.",
    patient: {
      name: "Priya R (fictional)",
      firstName: "Priya",
      details: "38 · G4 P3 · birth 40 min ago",
      history: "Grand multiparity with atonic bleeding after birth. The full uterotonic ladder has been given and a Bakri balloon placed. Rhesus positive, no asthma.",
    },
    beats: [
      {
        kind: "info",
        time: "04:15",
        title: "Not settling",
        narrative: "Despite the uterotonic ladder and the balloon, Priya is still bleeding. Total loss is over 2000 ml, she is cold, and the cannula site has started to ooze.",
        dialogue: [
          { who: "midwife", text: "Full ladder's in and the balloon's up, but she's still losing, and now she's oozing from the drip site." },
        ],
        obs: { "BP": "88/50", "Pulse": "128", "Temp": "35.3 °C" },
      },
      {
        kind: "checklist",
        time: "04:20",
        narrative: "Fresh oozing from puncture sites, with the hypothermia and the volume lost, signals developing coagulopathy. You declare a massive haemorrhage.",
        question: "Which belong in your massive haemorrhage response?",
        items: [
          { label: "Call the consultant obstetrician, anaesthetist and the haematologist", required: true, why: "In massive PPH deaths, the haematologist in particular is often contacted too late, once coagulopathy is uncontrollable." },
          { label: "Massive haemorrhage pack, with FFP given 1:1 alongside red cells", required: true, why: "The MHP pack delivers red cells with FFP; a 1:1 ratio is used in massive transfusion." },
          { label: "Keep her warm and correct acidosis and ionised hypocalcaemia (calcium gluconate)", required: true, why: "Hypothermia and hypocalcaemia both worsen coagulopathy." },
          { label: "Guide product replacement with point-of-care coagulation testing (ROTEM/TEG)", required: true, why: "Point-of-care testing directs targeted replacement in real time." },
          { label: "Plan to step her down to a normal ward once the balloon is up", required: false, why: "Massive PPH needs HDU or ITU; early step-down risks missing coagulopathy and renal failure." },
          { label: "Give recombinant Factor VIIa now as first-line", required: false, why: "Factor VIIa is a last resort in life-threatening haemorrhage not responding to standard measures, not a first-line step." },
        ],
        source: { gl: "GTG52", sectionId: "gtg52-massive", label: "GTG52 · Massive PPH: activate MHP" },
      },
      {
        kind: "choice",
        time: "04:32",
        narrative: "She is into her sixth unit of red cells with FFP and cryoprecipitate given, yet she keeps oozing. Temperature 34.8, and the ionised calcium is low on the gas.",
        question: "Besides continuing products, what is most important now?",
        options: [
          { label: "Actively warm her and give calcium" },
          { label: "Give recombinant Factor VIIa" },
          { label: "Switch resuscitation to colloid" },
          { label: "Repeat the fibrinogen and wait for it" },
        ],
        answer: 0,
        why: "Hypothermia and hypocalcaemia both impair clotting and are common, correctable reasons bleeding persists despite products. Warm her actively and replace calcium. Factor VIIa is a last resort, the fluid type is not the issue, and repeat testing without correcting the physiology wastes time.",
        source: { gl: "GTG52", sectionId: "gtg52-massive", label: "GTG52 · Massive PPH: activate MHP" },
      },
      {
        kind: "choice",
        time: "04:45",
        narrative: "In theatre the uterus is atonic despite the balloon. She is on her second unit of O-negative, BP 82/46, pulse 134, and the anaesthetist is struggling to keep up with losses.",
        question: "What is the most appropriate next step to secure haemostasis?",
        options: [
          { label: "Laparotomy with a brace suture, to devascularisation or hysterectomy if needed" },
          { label: "Transfer to interventional radiology for uterine artery embolisation" },
          { label: "Recombinant Factor VIIa, then reassess the bleeding" },
          { label: "Deflate the balloon and repeat the uterotonic ladder" },
        ],
        answer: 0,
        why: "She is haemodynamically unstable, so uterine artery embolisation, which requires a stable woman, is not appropriate; she needs surgical control now. Factor VIIa is no substitute for surgical haemostasis, and re-trialling uterotonics goes backwards.",
        source: { gl: "GTG52", sectionId: "gtg52-massive", label: "GTG52 · Massive PPH: surgical options" },
      },
      {
        kind: "choice",
        time: "05:30",
        narrative: "A B-Lynch suture secures haemostasis and she stabilises: warm, BP 112/70, lactate falling. The registrar suggests moving her to the postnatal ward as a bed is needed.",
        question: "What is the most appropriate ongoing plan?",
        options: [
          { label: "Critical care with close monitoring, and thromboprophylaxis once haemostasis is secure" },
          { label: "Move to the postnatal ward now she is stable" },
          { label: "Start LMWH immediately for the high VTE risk" },
          { label: "Discharge home in 24 hours if observations stay normal" },
        ],
        answer: 0,
        why: "After a massive PPH she needs HDU or ITU: early step-down has led to missed coagulopathy and renal failure. VTE risk is high, so LMWH is given, but timed to once haemostasis is secure rather than immediately, and never withheld altogether.",
        source: { gl: "GTG52", sectionId: "gtg52-massive", label: "GTG52 · Massive PPH: post-event care" },
      },
      {
        kind: "lesson",
        title: "The lesson: massive PPH and knowing when to cut",
        summary: "Priya survives a massive atonic PPH because the team reads the coagulopathy, corrects the physiology, and moves to surgery without waiting.",
        points: [
          "Fresh oozing with hypothermia and massive loss means coagulopathy: empirical products by point-of-care testing, FFP 1:1, warming, and calcium.",
          "Hypothermia and hypocalcaemia sabotage clotting; correcting them is as important as the products themselves.",
          "Persistent atony with instability needs surgical control; uterine artery embolisation is only for the haemodynamically stable woman.",
          "After a massive PPH: HDU or ITU, and LMWH once haemostasis is secure, not an early step-down.",
        ],
        evidence: "Reviews of PPH deaths repeatedly identify delayed escalation, late consultant and haematologist involvement, and premature step-down from critical care as recurring, avoidable contributors.",
        links: [
          { type: "reader", id: "GTG52", label: "GTG52: the full guide" },
          { type: "flowchart", id: "GTG52_PPH", label: "PPH management pathway" },
        ],
      },
    ],
  },

  {
    id: "ds-eclampsia-lw",
    title: "Seizure on the labour ward",
    setting: "Delivery Suite",
    gl: "GL952",
    difficulty: 3,
    room: "Room 5",
    draft: true,
    intro: "You are called urgently to a woman with severe pre-eclampsia. All patients in this simulation are fictional.",
    patient: {
      name: "Fatima H (fictional)",
      firstName: "Fatima",
      details: "31 · primigravida · 37 weeks",
      history: "Admitted with severe pre-eclampsia (BP up to 168/112, proteinuria, headache). On labetalol. Rhesus positive.",
    },
    beats: [
      {
        kind: "info",
        time: "14:02",
        title: "A seizure",
        narrative: "You arrive as Fatima has a generalised tonic-clonic seizure. It self-terminates after about 90 seconds. Airway is protected, she is postictal, and the magnesium sulfate loading dose is given.",
        dialogue: [
          { who: "midwife", text: "That's her first fit. Loading dose of magnesium is going in now. Her pressure's just come up on the cycle." },
        ],
        obs: { "BP": "172/116", "Pulse": "104", "SpO2": "97%" },
      },
      {
        kind: "choice",
        time: "14:06",
        narrative: "The seizure has stopped and the magnesium load is in. The repeat blood pressure is 172/116.",
        question: "What is the most appropriate immediate next step?",
        options: [
          { label: "Give a rapid-acting antihypertensive such as labetalol" },
          { label: "Give a second magnesium loading dose" },
          { label: "Start the magnesium maintenance infusion and watch the blood pressure" },
          { label: "Proceed straight to caesarean without treating the blood pressure" },
        ],
        answer: 0,
        why: "A BP of 172/116 is in the severe range and carries a stroke risk. Magnesium controls seizures but is not an antihypertensive, so the pressure needs its own rapid-acting agent such as labetalol. More magnesium does nothing for the BP, and rushing to delivery with uncontrolled pressure is unsafe: stabilise first.",
        source: { gl: "GL952", sectionId: "pet-severe-lw", label: "GL952 · Severe PET / eclampsia (labour ward)" },
      },
      {
        kind: "choice",
        time: "18:10",
        narrative: "The blood pressure is controlled and the magnesium maintenance infusion has run for four hours. Fatima is now drowsy. Respiratory rate 14, urine output 140 ml over the last 4 hours, but her patellar reflexes are absent.",
        question: "What is the most appropriate action?",
        options: [
          { label: "Stop the magnesium infusion until reflexes return" },
          { label: "Give calcium gluconate immediately" },
          { label: "Reduce the infusion to 0.5 g/hr" },
          { label: "Continue and recheck in an hour" },
        ],
        answer: 0,
        why: "Absent patellar reflexes indicate magnesium toxicity, and the correct response is to stop the infusion until reflexes return. Calcium gluconate is reserved for respiratory depression (her rate is 14), reducing the infusion is the response to low urine output (hers is normal at 140 ml), and continuing ignores the sign.",
        source: { gl: "GL952", sectionId: "pet-severe-lw", label: "GL952 · Magnesium toxicity monitoring" },
      },
      {
        kind: "choice",
        time: "19:30",
        narrative: "Reflexes have returned and the infusion is restarted. She remains oliguric: 60 ml over the last 3 hours. A colleague suggests a 500 ml crystalloid bolus to improve the urine output.",
        question: "What is the most appropriate fluid management?",
        options: [
          { label: "Maintain strict fluid restriction and do not bolus for the oliguria" },
          { label: "Give the 500 ml crystalloid bolus" },
          { label: "Give repeated boluses until urine output improves" },
          { label: "Start a furosemide infusion" },
        ],
        answer: 0,
        why: "Oliguria in severe pre-eclampsia is expected and is managed with strict fluid restriction; giving boluses to chase urine output risks pulmonary oedema. Repeated boluses compound the danger, and a diuretic is not the answer.",
        source: { gl: "GL952", sectionId: "pet-severe-lw", label: "GL952 · Severe PET: strict fluid balance" },
      },
      {
        kind: "choice",
        time: "20:15",
        narrative: "Bloods return: platelets 68, ALT 210, haemolysis on the film. This is HELLP syndrome. The registrar asks whether to give dexamethasone to treat it.",
        question: "What is the most appropriate response about steroids?",
        options: [
          { label: "Steroids do not treat HELLP; give them only for fetal lung maturation if preterm delivery is planned" },
          { label: "Give high-dose dexamethasone to treat the HELLP" },
          { label: "Give steroids to raise the platelet count before delivery" },
          { label: "Withhold steroids entirely whatever the gestation" },
        ],
        answer: 0,
        why: "Steroids do not treat HELLP; their only role here is fetal lung maturation if preterm delivery is planned. Giving them to treat HELLP or to raise the platelet count reflects a disproven practice, while withholding them regardless of gestation forgets the fetal indication.",
        source: { gl: "GL952", sectionId: "pet-definition", label: "GL952 · HELLP syndrome" },
      },
      {
        kind: "choice",
        time: "22:40",
        narrative: "She proceeds to a vaginal delivery. As the baby is born, the midwife asks which drug to give for the active third stage.",
        question: "Which is the most appropriate uterotonic here?",
        options: [
          { label: "Oxytocin alone" },
          { label: "Syntometrine (oxytocin with ergometrine)" },
          { label: "Ergometrine" },
          { label: "Carboprost" },
        ],
        answer: 0,
        why: "Ergometrine, and therefore Syntometrine which contains it, raises blood pressure and is avoided in hypertension, so the third stage is managed with oxytocin alone. Carboprost is not a routine third-stage agent.",
        source: { gl: "GL952", sectionId: "pet-severe-lw", label: "GL952 · Severe PET: intrapartum care" },
      },
      {
        kind: "lesson",
        title: "The lesson: eclampsia, magnesium and the traps",
        summary: "Fatima is stabilised and delivered safely by treating the seizure and the pressure separately, watching for magnesium toxicity, and avoiding the classic traps.",
        points: [
          "Magnesium stops and prevents the seizure; the blood pressure needs its own rapid-acting agent, and a severe pressure must be treated before delivery.",
          "Loss of patellar reflexes is the first sign of magnesium toxicity: stop the infusion. Calcium gluconate is for respiratory depression.",
          "Oliguria in severe pre-eclampsia is managed by strict fluid restriction, not boluses, which risk pulmonary oedema.",
          "Steroids do not treat HELLP; give them only for fetal lung maturation if preterm delivery is planned.",
          "For the third stage in a hypertensive woman use oxytocin alone; ergometrine and Syntometrine raise the blood pressure.",
        ],
        links: [
          { type: "reader", id: "GL952", label: "GL952: the full guide" },
        ],
      },
    ],
  },
];

export const SIM_CASE_MAP = Object.fromEntries(SIM_CASES.map(c => [c.id, c]));

// Number of scored beats (choice + checklist) in a case.
export function scoredBeatCount(simCase) {
  return simCase.beats.filter(b => b.kind === "choice" || b.kind === "checklist").length;
}
