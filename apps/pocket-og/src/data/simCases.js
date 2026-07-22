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
          { label: "Senior obstetrician review", sublabel: "CTG suspicious or pathological" },
          { label: "Reassure and discharge", sublabel: "Movements back to normal, no risk factors" },
          { label: "Book an ultrasound scan", sublabel: "Growth, liquor and umbilical artery Doppler" },
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
          { label: "Reassure her and arrange discharge", sublabel: "Normal growth, liquor and Doppler" },
          { label: "Manage as SGA or abnormal scan", sublabel: "Follow GTG31" },
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

  // ── DRAFTS awaiting clinical sign-off (not surfaced on the home screen; ──────
  // reachable only via ?sim=<id> for review). Remove `draft: true` on approval.
  {
    id: "ds-pph-minor-atony",
    title: "Minor postpartum haemorrhage",
    setting: "Delivery Suite",
    gl: "GTG52",
    difficulty: 1,
    room: "Room 1",
    draft: true,
    intro: "A midwife calls you into a birth room just after delivery. All patients in this simulation are fictional.",
    patient: {
      name: "Bea T (fictional)",
      firstName: "Bea",
      details: "29 · G3 P2 · SVD 15 min ago",
      history: "Spontaneous birth of a 4.1 kg baby after a long labour with oxytocin augmentation. Active third stage complete, placenta out and complete. Normotensive, no medical history.",
    },
    beats: [
      {
        kind: "info",
        time: "21:10",
        title: "Just after delivery",
        narrative: "The baby is on Bea's chest and doing well. The midwife is weighing swabs and looks up as a steady trickle turns into a flow.",
        dialogue: [
          { who: "midwife", text: "Big baby, long labour on the drip. Placenta's out and complete, but she's bleeding more than I'd like." },
        ],
        obs: { "BP": "118/76", "Pulse": "88", "Uterus": "soft" },
      },
      {
        kind: "checklist",
        time: "21:12",
        narrative: "You feel the fundus: soft and high. The weighed swabs come to about 700 ml and she is still oozing.",
        question: "What are your immediate first steps, done together?",
        items: [
          { label: "Call for help: the midwife in charge and the obstetrician", required: true, why: "Delayed escalation is a recurring contributor in PPH reviews; calling for help early is one of the highest-impact actions." },
          { label: "Rub up a contraction with bimanual uterine massage", required: true, why: "Tone is the likely cause, so a mechanical contraction is a first measure." },
          { label: "IV access (16G) and send FBC, coagulation and group and screen", required: true, why: "IV access and baseline bloods are immediate actions in minor PPH." },
          { label: "Catheterise and monitor hourly urine output", required: true, why: "A full bladder impairs uterine contraction; catheterise and target urine output above 30 ml/hr." },
          { label: "Take her straight to theatre for examination under anaesthesia", required: false, why: "Theatre is not a first step in a 700 ml bleed that has not been treated yet." },
          { label: "Wait and reassess in 15 minutes before doing anything", required: false, why: "Watchful waiting without treatment is the delayed-escalation pattern PPH reviews warn against." },
        ],
        source: { gl: "GTG52", sectionId: "gtg52-minor", label: "GTG52 · Minor PPH: immediate actions" },
      },
      {
        kind: "choice",
        time: "21:16",
        narrative: "The third-stage oxytocin is already in, and you have rubbed up a contraction, but bleeding continues from a still-soft uterus.",
        question: "What is the correct order of uterotonics from here?",
        options: [
          { label: "Oxytocin first (5 IU IV then a 40 IU infusion), then ergometrine if that is insufficient", sublabel: "She is normotensive, so ergometrine is not contraindicated" },
          { label: "Carboprost 0.25 mg IM as the next drug" },
          { label: "Straight to misoprostol 800 mcg and stop there" },
          { label: "Repeat the third-stage oxytocin dose and give nothing further" },
        ],
        answer: 0,
        why: "Oxytocin is first-line (5 IU IV then a 40 IU infusion), with ergometrine as the next step if oxytocin alone is insufficient, and it is safe here because she is not hypertensive or cardiac. Carboprost belongs to major PPH, and jumping to misoprostol alone or simply repeating oxytocin skips the logical ladder.",
        source: { gl: "GTG52", sectionId: "gtg52-minor", label: "GTG52 · Minor PPH: uterotonics" },
      },
      {
        kind: "choice",
        time: "21:24",
        narrative: "After the oxytocin infusion and ergometrine the uterus is firmer but not hard, and the running total is now about 950 ml with a continuing trickle.",
        question: "She is not fully controlled and approaching 1000 ml. What now?",
        options: [
          { label: "Escalate to the major PPH protocol now, rather than waiting for the loss to cross 1000 ml", sublabel: "Not responding, and approaching the major threshold" },
          { label: "Keep observing: 950 ml is still technically minor" },
          { label: "Give a third dose of ergometrine and wait" },
          { label: "Move her to the postnatal ward as the bleeding is nearly settled" },
        ],
        answer: 0,
        why: "Escalate the moment loss approaches 1000 ml or she is not responding, not only once the number crosses the threshold. Sitting on 'still technically minor', stacking another ergometrine dose, or stepping down are exactly the delayed-escalation patterns PPH reviews repeatedly flag.",
        source: { gl: "GTG52", sectionId: "gtg52-minor", label: "GTG52 · Minor PPH: when to escalate" },
      },
      {
        kind: "lesson",
        title: "The lesson: minor PPH and the 4 Ts",
        summary: "Bea's atonic minor PPH is managed by prompt simultaneous measures, and by escalating before the number, not after it.",
        points: [
          "Primary PPH is 500 ml or more within 24 hours; 500 to 1000 ml is minor, over 1000 ml is major.",
          "Tone causes about 80% of PPH; a soft uterus after a big baby and a long augmented labour is the classic picture.",
          "First moves happen together: call for help, rub up a contraction, IV access and bloods, catheterise.",
          "Uterotonic ladder: oxytocin first, then ergometrine if needed (avoided in hypertension or cardiac disease), then carboprost, then misoprostol.",
          "Escalate the moment loss approaches 1000 ml or she is not responding, not once it strictly crosses the threshold.",
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
    title: "Major postpartum haemorrhage",
    setting: "Delivery Suite",
    gl: "GTG52",
    difficulty: 2,
    room: "Room 3",
    draft: true,
    intro: "The emergency buzzer goes on the delivery suite overnight. All patients in this simulation are fictional.",
    patient: {
      name: "Chidinma A (fictional)",
      firstName: "Chidinma",
      details: "34 · G2 P1 · SVD 25 min ago",
      history: "Twin pregnancy delivered vaginally with an overdistended uterus. Brittle asthma. No hypertension. Active third stage given, both placentae complete.",
    },
    beats: [
      {
        kind: "info",
        time: "02:40",
        title: "The buzzer goes",
        narrative: "Both twins are out and well, but the bleeding is brisk and now pooling on the floor. The midwife has already put the buzzer out. The weighed loss is 1300 ml and climbing, and her pulse is 112.",
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
        narrative: "The oxytocin infusion is running and ergometrine has been given, but the uterus stays soft and she keeps bleeding. Her notes record brittle asthma.",
        question: "What is the next uterotonic?",
        options: [
          { label: "Misoprostol 800 mcg, because carboprost is contraindicated by her asthma", sublabel: "The asthma changes the usual next step" },
          { label: "Carboprost 0.25 mg IM every 15 minutes" },
          { label: "A second dose of ergometrine 500 mcg IV" },
          { label: "Repeat the oxytocin 5 IU IV bolus" },
        ],
        answer: 0,
        why: "Carboprost is the usual next uterotonic after oxytocin and ergometrine, but it is contraindicated in asthma, so here you skip it for misoprostol. Repeating ergometrine or oxytocin adds no new mechanism, and the recorded asthma is the detail that changes the answer.",
        source: { gl: "GTG52", sectionId: "gtg52-major", label: "GTG52 · Major PPH: pharmacological management" },
      },
      {
        kind: "choice",
        time: "02:54",
        narrative: "The team is working through the haemorrhage. Someone asks about tranexamic acid.",
        question: "What is the right approach to tranexamic acid?",
        options: [
          { label: "Give 1 g IV over 10 minutes now, as early as possible", sublabel: "Within 3 hours of birth" },
          { label: "Hold it until the fibrinogen result confirms it is below 2 g/L" },
          { label: "Give it only if bleeding continues past 2000 ml" },
          { label: "Avoid it: the thrombosis risk outweighs the benefit in PPH" },
        ],
        answer: 0,
        why: "Tranexamic acid 1 g IV over 10 minutes should be given as soon as possible, within 3 hours of birth, because earlier treatment is more effective. It is not conditional on a fibrinogen result or a higher blood-loss threshold; the 'wait for the numbers' options cost the very time that makes it work.",
        source: { gl: "GTG52", sectionId: "gtg52-major", label: "GTG52 · Major PPH: tranexamic acid" },
      },
      {
        kind: "choice",
        time: "03:02",
        narrative: "Point-of-care testing returns: fibrinogen 1.3 g/L, platelets 110, with bleeding ongoing.",
        question: "What is your priority blood product now?",
        options: [
          { label: "Cryoprecipitate (2 pools) to correct the low fibrinogen", sublabel: "First choice when fibrinogen is below 2 g/L" },
          { label: "Platelets, to keep ahead of the bleeding" },
          { label: "FFP alone" },
          { label: "Recombinant Factor VIIa" },
        ],
        answer: 0,
        why: "Fibrinogen is the priority: below 2 g/L it is corrected first, and cryoprecipitate is the first-choice product for it. Platelets at 110 are above the 75 transfusion threshold, so they are not the priority yet; FFP is for broader coagulopathy or a 1:1 ratio in massive transfusion; and Factor VIIa is a last resort in life-threatening haemorrhage not responding to standard measures.",
        source: { gl: "GTG52", sectionId: "gtg52-major", label: "GTG52 · Major PPH: blood products" },
      },
      {
        kind: "lesson",
        title: "The lesson: running a major PPH",
        summary: "A major atonic PPH after twins, where the asthma changes the drug and the priorities are escalation, TXA and the right product first.",
        points: [
          "Over 1000 ml is major: activate the response immediately and do not wait for laboratory results.",
          "The uterotonic ladder bends to the patient: carboprost is contraindicated in asthma, ergometrine in hypertension or cardiac disease.",
          "Tranexamic acid 1 g IV as early as possible (within 3 hours), not gated on a fibrinogen result.",
          "Correct fibrinogen first when it is below 2 g/L, with cryoprecipitate; platelets only below 75 (or below 100 if still bleeding).",
          "After haemostasis: high-dependency monitoring and a VTE assessment once bleeding has stopped.",
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
    title: "Massive postpartum haemorrhage",
    setting: "Delivery Suite",
    gl: "GTG52",
    difficulty: 3,
    room: "Theatre",
    draft: true,
    intro: "You are called to a woman who is not responding to the major PPH measures. All patients in this simulation are fictional.",
    patient: {
      name: "Priya R (fictional)",
      firstName: "Priya",
      details: "38 · G4 P3 · SVD 40 min ago",
      history: "Grand multiparity with atonic bleeding after birth. The full uterotonic ladder has been given and a Bakri balloon placed. Rhesus positive, no asthma.",
    },
    beats: [
      {
        kind: "info",
        time: "04:15",
        title: "Not settling",
        narrative: "Despite the uterotonic ladder and the balloon, Priya is still bleeding. Total loss is now over 2000 ml, she is cold at 35.3, and the cannula site has started to ooze.",
        dialogue: [
          { who: "midwife", text: "Full ladder's in and the balloon's up, but she's still losing, and now she's oozing from the drip site." },
        ],
        obs: { "BP": "88/50", "Pulse": "128", "Temp": "35.3 °C" },
      },
      {
        kind: "choice",
        time: "04:16",
        narrative: "The fresh oozing from puncture sites, with the hypothermia and the volume lost, is a new and ominous sign.",
        question: "What does the oozing tell you, and what must you do about it?",
        options: [
          { label: "Developing coagulopathy: activate the massive haemorrhage protocol, send point-of-care coagulation testing, and correct with products, warming and calcium", sublabel: "Treat empirically, guided by point-of-care testing" },
          { label: "Wait for the formal clotting screen before giving any products" },
          { label: "Expected surgical ooze: continue the balloon and observe" },
          { label: "Give more oxytocin infusion" },
        ],
        answer: 0,
        why: "Fresh oozing from puncture sites with hypothermia and massive loss signals developing coagulopathy. This is the massive haemorrhage protocol: empirical products guided by point-of-care testing (ROTEM/TEG), active warming and correction of hypocalcaemia, not waiting for a formal screen, and not more uterotonic, which does nothing for coagulopathy.",
        source: { gl: "GTG52", sectionId: "gtg52-massive", label: "GTG52 · Massive PPH: activate MHP" },
      },
      {
        kind: "checklist",
        time: "04:20",
        narrative: "You are running a massive haemorrhage.",
        question: "Which belong in the massive haemorrhage protocol here?",
        items: [
          { label: "Call the consultant obstetrician, anaesthetist and the haematologist", required: true, why: "In massive PPH deaths, the haematologist in particular is often contacted too late, once coagulopathy is already uncontrollable." },
          { label: "Massive haemorrhage pack: 6 units red cells with 4 units FFP, plus platelets and cryoprecipitate", required: true, why: "The MHP pack delivers red cells with FFP and, as needed, platelets and cryoprecipitate." },
          { label: "Keep her warm and correct acidosis and ionised hypocalcaemia (calcium gluconate)", required: true, why: "Hypothermia and hypocalcaemia both worsen coagulopathy." },
          { label: "Guide product replacement with point-of-care coagulation testing (ROTEM/TEG)", required: true, why: "Point-of-care testing directs targeted replacement in real time." },
          { label: "Plan to step her down to a normal ward once the balloon is up", required: false, why: "Massive PPH needs HDU or ITU; early step-down risks missing coagulopathy and renal failure." },
          { label: "Give recombinant Factor VIIa now as first-line", required: false, why: "Factor VIIa is a last resort in life-threatening haemorrhage not responding to standard measures, not a first-line step." },
        ],
        source: { gl: "GTG52", sectionId: "gtg52-massive", label: "GTG52 · Massive PPH: activate MHP" },
      },
      {
        kind: "choice",
        time: "04:35",
        narrative: "In theatre, atony persists despite the balloon, and she remains haemodynamically unstable at 84/48 with a pulse of 130.",
        question: "What is the most appropriate next step?",
        options: [
          { label: "Surgical control: laparotomy with a B-Lynch brace suture, escalating to stepwise devascularisation and hysterectomy if needed", sublabel: "Definitive haemostasis in an unstable woman" },
          { label: "Transfer to interventional radiology for uterine artery embolisation" },
          { label: "Give recombinant Factor VIIa and continue to observe" },
          { label: "Deflate the balloon and re-trial the uterotonic ladder" },
        ],
        answer: 0,
        why: "She is unstable with ongoing atonic bleeding despite tamponade, so she needs surgical control now: laparotomy with a brace suture (B-Lynch), moving stepwise to pelvic devascularisation and, as a last resort, hysterectomy. Uterine artery embolisation is only for the haemodynamically stable woman, which she is not, so it is the wrong choice here. Factor VIIa is a last resort and no substitute for surgical haemostasis, and re-trialling uterotonics simply wastes time.",
        source: { gl: "GTG52", sectionId: "gtg52-massive", label: "GTG52 · Massive PPH: surgical options" },
      },
      {
        kind: "choice",
        time: "05:20",
        narrative: "A hysterectomy achieves haemostasis and she stabilises.",
        question: "What is the correct next step in her care?",
        options: [
          { label: "HDU or ITU admission, with LMWH thromboprophylaxis once haemostasis is secure", sublabel: "High VTE risk after massive PPH" },
          { label: "Start LMWH immediately in theatre to pre-empt VTE" },
          { label: "Return her to a standard postnatal ward now that bleeding has stopped" },
          { label: "Withhold thromboprophylaxis entirely given the bleeding" },
        ],
        answer: 0,
        why: "After massive PPH she needs HDU or ITU, not an early step-down, which has led to missed coagulopathy and renal failure. VTE risk is high, so LMWH is given, but only once haemostasis is secure rather than while still bleeding, and not withheld altogether.",
        source: { gl: "GTG52", sectionId: "gtg52-massive", label: "GTG52 · Massive PPH: post-event care" },
      },
      {
        kind: "lesson",
        title: "The lesson: massive PPH and knowing when to cut",
        summary: "Priya survives a massive atonic PPH because the team reads the coagulopathy, escalates to the massive protocol, and moves to surgery without waiting.",
        points: [
          "Fresh oozing with hypothermia and massive loss means coagulopathy: empirical products guided by point-of-care testing, warming, and correction of hypocalcaemia.",
          "The massive protocol brings consultant, anaesthetist and haematologist together, with MHP packs, not a wait for the formal screen.",
          "Balloon tamponade buys time, but persistent atony with instability needs surgical control (brace suture, devascularisation, hysterectomy as a last resort).",
          "Uterine artery embolisation is only for the haemodynamically stable woman; instability makes theatre, not radiology, the answer.",
          "Recombinant Factor VIIa is a last resort for haemorrhage not responding to standard measures, never a substitute for surgical haemostasis.",
          "After a massive PPH: HDU or ITU, and LMWH once haemostasis is secure.",
        ],
        evidence: "Reviews of PPH deaths repeatedly identify delayed escalation, late consultant and haematologist involvement, and premature step-down from critical care as recurring, avoidable contributors.",
        links: [
          { type: "reader", id: "GTG52", label: "GTG52: the full guide" },
          { type: "flowchart", id: "GTG52_PPH", label: "PPH management pathway" },
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
