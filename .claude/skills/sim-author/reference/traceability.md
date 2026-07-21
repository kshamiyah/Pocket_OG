# Traceability — "no source, no answer"

This is the load-bearing rule of the whole feature. If the app tells a user an
answer is right or wrong, that verdict must be defensible from a guideline
section that already exists in the repo, and the user must be able to open it.

## The receipt

Every scored beat (`choice` and `checklist`) carries:

```js
source: { gl: "GTG57", sectionId: "gtg57-clinical-assessment", label: "GTG57 · Clinical assessment when RFM presents" }
```

- `gl` — the guideline code. It **must be reader-available**
  (`apps/pocket-og/src/data/readerAvailable.js`), or the receipt cannot open.
- `sectionId` — a real section id in that guide
  (`packages/guidelines/src/<GL>.js`, each section's `id`). It **must exist**.
- `label` — the human label shown on the tappable receipt.

In the app this renders as a link that opens the guideline at that exact
section, in the feedback panel and again in the end-of-case recap. The
integrity test fails the build if `gl` is not reader-available or `sectionId`
does not exist.

## How to bind an answer

1. Decide the correct answer from the flowchart/guide (never from memory).
2. Open the guide section that states it. Copy its `id`.
3. Write the `why` so it stays within what that section supports. Do not add a
   fact the section does not contain, even if you believe it.
4. Put the section id in the receipt.

Prefer `fromNode` decision beats: the options are the flowchart's own branches,
so the "answer" is inherited from an already-validated pathway, and you only
have to cite the guide section that explains it.

## When the claim is not in the repo

This is the RFM level-3 situation (growth-velocity / centile-crossing). If the
correct answer depends on a clinical claim that no repo guideline states:

- **Do not ship it.** A plausible-sounding answer with no repo source is exactly
  what this rule exists to stop.
- Options: (a) add the claim to the relevant guide section with its citation
  first (a separate, human-approved content change), then cite it; or (b)
  rewrite the beat so its correct answer rests on a claim that *is* in the repo;
  or (c) cut the beat.
- Flag it explicitly to Khalid rather than quietly picking an answer.

## What counts as a distractor

Wrong options must be **real** and **wrong for this patient**:

- a genuine pathway action that is correct elsewhere but not here, or
- an approach the guideline explicitly advises against (kick charts in RFM,
  routine USS for every presentation).

Never a fabricated dose, threshold or centile. A wrong number on screen is a
clinical hazard even as a distractor.

## Vignette numbers

The numbers in the scene must make **exactly one** branch correct. Choose values
that sit unambiguously on one side of the guideline threshold (1,200 ml, not
950 ml; EFW on the 48th centile, not the 11th). If two options could both be
defended for the numbers given, the beat is broken.
