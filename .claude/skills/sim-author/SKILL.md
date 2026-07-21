---
name: sim-author
description: Author "On Call" case simulations for the Pocket O&G app (src/data/simCases.js). Use this skill whenever Khalid asks to write, draft, generate, add or review a sim case, a simulation, an On Call scenario, "a patient for MAU / delivery suite / antenatal clinic", or says things like "I need PPH questions", "make 3 reduced movements cases", "write a level 3 sepsis scenario", "draft some cases for GTG52", or "review this sim case". Produces complete, guideline-traceable scenarios that match the app's schema, house voice and difficulty rubric, self-checked against the repo before being handed over for clinical sign-off. Do NOT use for flowcharts, guideline reader content, pearls, or the MRCOG Anki cards (use mrcog-card-maker for those).
---

# Sim Author — On Call case simulations for Pocket O&G

Authors simulated patients for the **On Call** feature: a fictional patient
arrives (MAU, delivery suite, antenatal clinic), the user is asked step by step
what to do, and each decision is scored and taught. Cases live in
`apps/pocket-og/src/data/simCases.js` and play through `SimPlayer.jsx`.

## The one rule that overrides everything

**No source, no answer.** Every right/wrong verdict must be traceable to a
guideline section that already exists in the repo. You do not invent clinical
facts, thresholds, doses or "correct answers." You *select* the correct answer
from content that is already in the app and already signed off, and you *cite*
the exact section. If a scenario needs a clinical claim that is not in a repo
guideline, you cannot ship it: either the claim gets added to the guide (with
its citation) first, or the beat is cut. See `reference/traceability.md`.

This is Khalid's number one priority. A scenario that is beautifully written but
cannot point at its source is worthless and must not be produced.

## What you author vs what you inherit

A scenario has two layers. Keep them separate in your head:

- **The clinical skeleton** (which flowchart/guide, which path, what is correct
  at each decision) is *inherited* from content that already exists. Prefer
  `fromNode` beats, whose options are pulled live from a flowchart decision node
  at runtime, so you never even write the options. You are choosing a path
  through an already-correct pathway.
- **The wrapper** (patient, scene, dialogue, vignette numbers, difficulty) is
  what you *write*. This is where your effort goes.

## Before writing anything

1. **Read the exemplar.** `apps/pocket-og/src/data/simCases.js`, the `mau-rfm-34`
   case, is the gold standard for voice, structure and receipts. Match it.
2. **Read the schema.** `reference/case-schema.md` for the exact beat shapes.
3. **Find the source content in the repo.** Grep the relevant flowchart
   (`apps/pocket-og/src/data/*_FLOWCHART*.js`) and guide sections
   (`packages/guidelines/src/*.js`). Note the exact node ids and section ids you
   will bind answers to. If the content is not there, stop and tell Khalid.

## Workflow

### 1. Scope
From the request ("I need PPH questions"), identify the guideline and flowchart
already in the repo (e.g. GTG52 / `GTG52_PPH`). Pick a **spread** of distinct
presentations, not near-duplicates: for PPH, walk the 4 Ts (tone, trauma,
tissue, thrombin) and minor vs major vs massive. Check `simCases.js` for what
already exists and fill gaps. Default to 3 cases unless a number is given.

### 2. Choose difficulty
Assign each case a level (1/2/3) using `reference/difficulty-rubric.md`. Turn
the difficulty *dials* deliberately; do not fake difficulty with obscurity or
trickery. State which level each case targets and why.

### 3. Scaffold the skeleton (optional but recommended)
Let the scaffolder lay down the bones so the answer indices come straight from
the flowchart and cannot be typed wrong. From the repo root:

- See the flowchart's decision points and pick a path:
  `node scripts/scaffoldSim.mjs <FLOWCHART_ID>`
- Emit a case skeleton for a chosen path (one option index per decision):
  `node scripts/scaffoldSim.mjs <FLOWCHART_ID> --path 2,1`

It prints a `SIM_CASES` entry full of TODOs with `fromNode` and `answer` already
filled from the pathway. The medicine is inherited; your job is the wrapper.

### 4. Draft the wrapper
Fill every TODO: an `info` opener that sets the scene, then the scored
`choice` / `checklist` beats along the path, then the `lesson`. Prefer
`fromNode` for decision beats. Follow `reference/style-guide.md` for voice,
British English, no em dashes, the clock, dialogue and the disclaimer framing.

### 5. Bind and cite every answer
Every scored beat gets a `source: { gl, sectionId, label }` receipt pointing at
a real, reader-available section. Write the `why` so it quotes or paraphrases
that section, never beyond it. See `reference/traceability.md`.

### 6. Self-check before handing over
Run, from `apps/pocket-og`:
- `../../node_modules/.bin/vitest run src/data/simCheck.test.js src/data/simStyleCheck.test.js`
- `../../node_modules/.bin/eslint src/data/simCases.js`
Fix everything red. The integrity test enforces that every node, option index,
receipt and link resolves; the style test enforces the house rules. A draft that
does not pass both is not ready.

### 7. Present for review
Hand each case over as a **playable draft**, never as JSON to proofread. Mark it
`draft: true`, give Khalid the preview deep link (`?sim=<id>`), and a short crib:
the difficulty level, the decisions, and the source each answer is bound to.
Then Khalid **approves / alters / rejects**. See `reference/review-and-publish.md`.

### 8. Publish on approval
On approval, remove the `draft` flag and commit. Rejected cases are discarded.
"Alter" loops back to step 4 for that case only.

## Modes

Introduce these in order of trust. Default to the earliest the request implies.

- **Critic** (lowest risk): Khalid gives you a case he wrote; you check it
  against the rubric, the style guide and traceability, and report issues. You
  do not author medicine.
- **Scaffold**: you produce the skeleton (path + correct answers + `fromNode`
  wiring) from a flowchart, leaving the wrapper for a human.
- **Author** (highest trust): full drafts, gated hard by the self-check and by
  Khalid's sign-off.

## Hard limits

- Never invent a dose, threshold, centile or figure. If it is not in the repo,
  it does not go on screen.
- Distractors must be real pathway options (that are wrong for *this* patient)
  or approaches the guideline explicitly advises against. Never a fabricated
  wrong dose.
- Vignette numbers must make exactly **one** branch correct. No borderline
  values where two options are defensible (1,200 ml, not 950 ml).
- Every patient is marked fictional. The decision-aid disclaimer stays.
- The clinical sign-off (Khalid's approval) is the only step you may never
  skip or simulate.

## Reference files

- `reference/case-schema.md` — the exact data shape of a case and every beat.
- `reference/style-guide.md` — house voice, British English, clock, dialogue, obs.
- `reference/difficulty-rubric.md` — the three levels, the dials, RFM worked.
- `reference/traceability.md` — the "no source, no answer" rule in detail.
- `reference/review-and-publish.md` — draft staging, review, approve/publish.
