# Difficulty rubric

Difficulty is *engineered*, not measured (the app is offline-first with no
performance data). You assign a level by turning dials deliberately. The tier is
tied to training stage, or it means nothing.

## The three levels

- **Level 1 — Foundation / SHO (recognition).** The first safe step. Textbook
  presentation, pre-interpreted data, obvious distractors, single decisions.
  Tests: do you know the pathway exists and its first move.
- **Level 2 — Registrar (application).** Interpreting and running the case.
  Raw data you must read yourself, some ambiguity, one genuinely close
  distractor, chained decisions. Tests: can you run the case.
- **Level 3 — Senior / MRCOG (judgment).** Judgment where the guideline hands
  off. Atypical, recurrent or masked presentations, noise, competing
  priorities, subtle distractors, escalation. Tests: do you know when to leave
  the algorithm.

## The dials (turn these, don't fake it)

1. **Cognitive level** — recall → apply → prioritise under uncertainty. This is
   the real axis; everything else serves it.
2. **Data pre-digestion** — "CTG is normal" (easy) vs raw features you classify
   (hard; use `classifyCTGEntry` so the marking stays objective).
3. **Distractor proximity** — obviously wrong (easy) vs the tempting option is
   *the lower level's correct answer* (hard). The single biggest lever.
4. **Signal-to-noise** — clean vignette vs red herrings and comorbidities to
   filter.
5. **Typicality** — classic vs atypical / recurrent / masked by "in-range"
   values.
6. **Competing priorities / information drip** — one patient, all data upfront,
   vs a second demand or results arriving late (the "night shift").

Level 1 turns all dials down; level 3 turns several up.

## The trap: real difficulty vs costume

Difficulty must come from **harder cognition, not obscurity**. A case is not
harder because the wording is confusing, or it hides a number in a wall of text,
or it hinges on a zebra. That is a bad question in a hard costume. The *decision*
must be genuinely harder; the *reading* must not be. Reject fake difficulty.

## RFM worked at all three levels

Same topic, same medicine, only the demand on the reader moves.

**Level 1.** 38 weeks, no risk factors, reduced movements. Q: "What is the first
thing you should do?" Correct: auscultate FH with handheld Doppler. Distractors
obviously wrong (reassure and send home; kick chart). One decision, recognition.
- Source: GTG57 · `gtg57-clinical-assessment` (initial examination). **Traceable.**

**Level 2.** 34+2, smoker, normal CTG but movements still reduced. Q: what next?
Correct: proceed to USS (persisting RFM + risk factor). The tempting distractor
("CTG normal, discharge") is *nearly* right. Integration of three facts.
- Source: GTG57 · `gtg57-clinical-assessment` (USS after normal CTG). **Traceable.**
- This is the shipped `mau-rfm-34` exemplar.

**Level 3.** Recurrent RFM, EFW fallen from 50th to 12th centile but still >10th,
liquor and Doppler normal. Q: how do you act? Correct: escalate and treat as
evolving FGR (velocity drop + recurrence), not reassure. The distractor "all
parameters within normal limits, reassure" is the level-2 correct answer.
- **CAUTION — this is the shape of a good level 3, but as written it is NOT
  traceable to the repo today.** The growth-velocity / centile-crossing concept
  (EFW >10th but falling) is a GTG31/FGR idea not stated in the GTG57 sections
  currently in the app. Under the "no source, no answer" rule this case cannot
  ship until that claim is added to a repo guideline with its citation, or the
  beat is rewritten to a claim that is in the repo. Use this as the standing
  example of why traceability gates difficulty.

## Assigning the level

State the target level, then justify it by naming which dials you turned. In
review, the level is honest only if the dials actually moved: a "level 3" with
obvious distractors and a textbook presentation is a mislabelled level 1.
