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
//   dialogue  — [{ who: "patient" | "midwife", text }] spoken lines, rendered
//               as speech bubbles between the narrative and the question
//
// A choice beat with `fromNode: { fc, node }` renders the live options of that
// flowchart decision node, so guideline updates flow through automatically.
// Distractors in authored beats are real pathway actions that are wrong for
// this patient, or approaches the guideline explicitly recommends against;
// nothing is invented.

import { FLOWCHARTS } from "./flowcharts";

// Options of a flowchart decision node, verbatim.
export function nodeOptions(fcId, nodeId) {
  const node = FLOWCHARTS[fcId]?.nodes?.[nodeId];
  return (node?.options ?? []).map(o => ({ label: o.label, sublabel: o.sublabel }));
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
          { label: "Auscultate the fetal heart with a handheld Doppler", sublabel: "Confirm viability before anything else" },
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
          { label: "Computerised CTG for at least 20 minutes", sublabel: "Preferred over visual interpretation" },
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
        narrative: "The computerised CTG runs for 24 minutes and meets criteria: baseline 145 bpm, normal variability, accelerations present, no decelerations. Amara felt a couple of flutters during the trace. You come back to review it and she catches your eye before you can speak.",
        obs: { "cCTG": "criteria met, 24 min", "Baseline": "145 bpm", "Accelerations": "present" },
        dialogue: [
          { who: "patient", text: "The machine looked fine, the midwife said. But the kicks still feel less than they should be. I know her." },
        ],
        question: "The CTG is normal. Following the RFM care pathway, what happens next?",
        fromNode: { fc: "GTG57_CARE_PATHWAY", node: "ctg-result" },
        answer: 2,
        why: "The CTG is normal, but her perception of reduced movements persists and she has a risk factor (smoking, aOR 2.96 for adverse outcome). A normal CTG with persisting RFM or any risk factor for FGR or stillbirth is an indication for ultrasound assessment: EFW and abdominal circumference, amniotic fluid volume and umbilical artery Doppler. Discharge on the strength of the CTG alone would be premature here.",
        source: { gl: "GTG57", sectionId: "gtg57-clinical-assessment", label: "GTG57 · USS after normal CTG (when indicated)" },
      },
      {
        kind: "choice",
        time: "20:05",
        narrative: "The on-call sonographer fits her in. You watch the screen together: EFW 2,350 g on the 48th centile, deepest vertical pocket 5.2 cm, umbilical artery Doppler with normal PI and end-diastolic flow present. Growth is tracking its curve. Amara watches your face, not the screen.",
        obs: { "EFW": "2,350 g (48th)", "DVP": "5.2 cm", "UA Doppler": "normal PI, EDF present" },
        question: "How do you act on these ultrasound findings?",
        fromNode: { fc: "GTG57_CARE_PATHWAY", node: "uss-result" },
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
          { label: "No formal counting: know your baby's own pattern, and return immediately with any further reduction or change", sublabel: "Movements do not decrease towards term" },
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
];

export const SIM_CASE_MAP = Object.fromEntries(SIM_CASES.map(c => [c.id, c]));

// Number of scored beats (choice + checklist) in a case.
export function scoredBeatCount(simCase) {
  return simCase.beats.filter(b => b.kind === "choice" || b.kind === "checklist").length;
}
