# Item writing — professional standard for On Call questions

This is the craft standard for every scored beat. It is drawn from the NBME
item-writing method (the basis of USMLE and, in the same family, MRCOG SBAs) and
the medical-education literature on higher-order questions. Follow it and the
questions test clinical reasoning; ignore it and they test recall or, worse,
test-taking tricks. Sources are listed at the end.

## 1. Anatomy of a one-best-answer item

Every `choice` beat is a **stem** (the vignette narrative + a focused lead-in
question) followed by **one best answer** and **homogeneous, plausible
distractors**. In this app the vignette is the beat's `narrative` (plus the
running obs and dialogue), the lead-in is the `question`, and the options are
`options`/`fromNode`.

## 2. The cover-the-options rule (the acid test)

A properly built item can be answered from the vignette and lead-in **alone**,
before reading the options. If you cover the options and a competent trainee
cannot commit to an answer, the lead-in is not focused. Write the lead-in so it
poses one clear clinical decision ("what is the most appropriate next step",
"which drug is contraindicated here"), never "which of the following is true".

## 3. Vignette construction

- **Order the data like a real presentation**: demographics, then history, then
  examination, then observations/results, then what has been done, then the new
  development. The obs panel and dialogue carry some of this.
- **No red herrings, no padding.** Every clause is either load-bearing for the
  decision or scene-setting that earns its place. Difficulty must never come
  from burying a fact in noise (that is irrelevant difficulty, see §6).
- **Put the deciding data in, but not the conclusion.** This is the hinge of
  higher-order design, see §4.

## 4. Higher-order by design: make them reason, not recall

The single biggest lever on difficulty is **how many inferential steps sit
between the words on the page and the answer**. Target the Bloom levels
deliberately:

- **Recall (avoid as the whole question):** the fact is the answer. "Which
  uterotonic is contraindicated in asthma?" One step, pure memory.
- **Application / analysis / evaluation (aim here):** the stem gives **data**,
  and the candidate must **interpret it, infer the intermediate state, and then
  decide**. The answer is two or three inferential steps away.

Concrete techniques to force multistep reasoning:

1. **Give data, not the diagnosis.** Do not write "she has brittle asthma";
   write "she reaches for a blue inhaler between contractions and was admitted
   with wheeze last winter". The candidate must *derive* asthma, then *recall*
   the carboprost contraindication, then *choose* the alternative. Three steps
   from one well-built vignette.
2. **Chain interpret → act.** Present raw obs/results (BP, pulse, shock index,
   ROTEM, fibrinogen) and make the candidate compute the state before choosing
   the action, rather than telling them the state.
3. **Two-constraint elimination.** Make the safe answer satisfy *two* facts at
   once (e.g. a woman who is both asthmatic *and* hypertensive rules out both
   carboprost *and* ergometrine, leaving misoprostol). The candidate must hold
   and apply both.
4. **Most appropriate *next* step, with all options genuinely on the pathway.**
   Every option is something you could do in this condition; only one is right
   *now*, discriminated by timing, priority, stability or a contraindication the
   vignette makes them work out.
5. **Second-order consequence.** Ask what happens after the obvious move, or the
   complication the correct action prevents, rather than the move itself.

If a question can be answered by matching a single word in the stem to a single
word in an option, it is not yet higher-order. Rewrite until the answer must be
*built*, not *spotted*.

## 5. Distractor craft

- **Homogeneous.** All options are the same kind of thing (all uterotonics, all
  blood products, all "next steps"). Mixed categories let candidates eliminate
  by type instead of reasoning.
- **Every distractor is a real mistake.** Each wrong option should be the answer
  a specific, reasonable-but-wrong trainee would choose, and you should be able
  to name the misconception it catches (chose the standard drug and missed the
  contraindication; treated the number not the trend; escalated too late).
- **Plausible and roughly equal in weight.** If the wrong options are obviously
  silly, the item tests nothing. Aim for the "if you don't know, they all look
  reasonable" feel.
- Never fabricate a dose or threshold in a distractor (repo rule; see
  `traceability.md`).

## 6. Technical item-flaw checklist (run before shipping every item)

These are the flaws NBME catalogues. Two families: those that let a test-wise
candidate guess, and those that add difficulty unrelated to clinical reasoning.

**Testwiseness flaws (they leak the answer):**
- **Correct answer longest / most detailed.** The most common tell. Balance
  option length and specificity so the right answer is not the fullest one.
- **Grammatical cues.** Every option must read grammatically from the lead-in.
- **Absolute terms** ("always", "never", "all", "none") in options — usually
  false, so test-wise candidates skip them. Avoid.
- **Clang clues / word repeats.** A word shared between stem and the correct
  option points at it. Remove it, or use it in all options.
- **Convergence.** The correct answer should not be the one that shares the most
  elements with the other options.
- **Collectively exhaustive or paired options.** Avoid two options that are
  opposites, or a set that a candidate can reason must contain the answer.

**Irrelevant-difficulty flaws (they add noise, not reasoning):**
- **Vague frequency terms** ("usually", "often", "may") — read differently by
  everyone. Be specific.
- **Over-complex or negatively phrased lead-in** ("which is NOT..."). Keep it
  positive and clean; if you must negate, bold it.
- **Inconsistent or gratuitous numbers**, "none/all of the above", tricking on a
  technicality.

## 7. The author's pre-ship questions

For every scored beat, confirm:
1. Does it test an important decision a trainee actually faces?
2. Cover the options: can a competent trainee answer from stem + lead-in alone?
3. Is the answer *built* from ≥2 inferential steps, or merely *spotted*?
4. Is every distractor a real, nameable mistake, homogeneous with the answer?
5. Does it survive the technical-flaw checklist (§6)?
6. Is every answer bound to a repo guideline section (`traceability.md`)?

## Sources

- NBME Item-Writing Guide, *Constructing Written Test Questions for the Health
  Sciences* (one-best-answer rules, cover-the-options, vignette order, flaw
  taxonomy). https://www.nbme.org/educators/item-writing-guide
- "Solving Not Answering: Validation of Guidance for Writing Higher-Order MCQs",
  PMC11698704. https://pmc.ncbi.nlm.nih.gov/articles/PMC11698704/
- University of Washington SOM, *Writing Multiple-Choice Questions*.
- Guelph OTL, *Assessing Higher-Order Outcomes using MCQs*.
