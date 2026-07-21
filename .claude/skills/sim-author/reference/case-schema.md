# Case schema

The canonical, machine-checked shape of an On Call case. This is enforced by
`apps/pocket-og/src/data/simCheck.test.js` and read by
`apps/pocket-og/src/components/SimPlayer.jsx`. When in doubt, copy the
`mau-rfm-34` case in `simCases.js` and change the content, not the structure.

## Case object

```js
{
  id: "mau-rfm-34",              // unique, kebab-case: <setting>-<topic>-<gestation/detail>
  title: "Reduced fetal movements",
  setting: "Maternity Assessment Unit",  // also "Delivery Suite" | "Antenatal Clinic"
  gl: "GTG57",                   // primary guideline code; drives the accent colour
  difficulty: 2,                 // 1 | 2 | 3 (see difficulty-rubric.md)
  room: "Room 2",                // optional, shown in the header
  intro: "…",                    // one line; always note patients are fictional
  patient: {
    name: "Amara O (fictional)", // MUST carry "(fictional)"
    firstName: "Amara",          // used for the avatar + dialogue speaker tag
    details: "32 · G2 P1 · 34+2 weeks",
    history: "…",                // the persistent one-liner under the name
  },
  beats: [ /* ordered; last beat MUST be the lesson */ ],
}
```

Also export nothing new: cases go in the `SIM_CASES` array; `SIM_CASE_MAP` and
`scoredBeatCount` derive automatically.

## Beat kinds

Every beat may carry `time` ("18:44", advancing monotonically through the shift)
and `dialogue` ([{ who: "patient" | "midwife", text }]).

### `info` — sets the scene, nothing to decide
```js
{ kind: "info", time: "18:40", title: "Arrival in MAU",
  narrative: "…", dialogue: [{ who: "midwife", text: "…" }],
  obs: { "BP": "118/74", "Pulse": "82" } }   // obs optional; renders on the monitor
```

### `choice` — single best answer
```js
{ kind: "choice", time: "18:44",
  narrative: "…", dialogue: [{ who: "patient", text: "…" }],
  question: "What is your first priority?",
  // EITHER inline options:
  options: [ { label: "…", sublabel: "…" }, … ],
  // OR live options pulled from a flowchart decision node (preferred):
  fromNode: { fc: "GTG57_CARE_PATHWAY", node: "ctg-result" },
  answer: 0,                     // index of the correct option
  why: "…",                      // reasoning, must not exceed the cited source
  source: { gl: "GTG57", sectionId: "gtg57-clinical-assessment", label: "GTG57 · …" },
  obs: { … },                    // optional
}
```
- With `fromNode`, do NOT also give `options`; they come from the flowchart.
- `answer` must be a valid index into whichever option list applies.

### `checklist` — pick the correct set
```js
{ kind: "checklist", time: "18:47", narrative: "…", question: "…",
  items: [
    { label: "…", required: true,  why: "why it belongs" },
    { label: "…", required: false, why: "why it is NOT indicated" },
  ],
  source: { gl, sectionId, label },
}
```
- Scores only on an exact match (all required ticked, no distractors ticked).
- At least one `required: true`. Every item needs a `why`.

### `lesson` — the close-out (exactly one, last)
```js
{ kind: "lesson", title: "The lesson: …", summary: "…",
  points: [ "…", … ],            // the takeaways, numbered in the UI
  evidence: "…",                 // optional: the trial/evidence behind it
  links: [                       // deep links; validated against the repo
    { type: "reader",    id: "GTG57", label: "GTG57: the full guide" },
    { type: "flowchart", id: "GTG57_CARE_PATHWAY", label: "RFM care pathway" },
  ],
}
```
The lesson also auto-renders "Your calls this shift" from the scored beats, each
with its source receipt, so you do not hand-write the recap.

## What the integrity test checks (so you do not ship a broken case)

- ids unique; `gl` and every link `id` resolve; `difficulty` in {1,2,3}.
- last beat is the lesson.
- `fromNode` points at a real `decision` node with >1 option; `answer` in range.
- inline `choice` has ≥2 options; `answer` in range.
- every `choice`/`checklist` has a valid `source` receipt (reader-available `gl`
  + a `sectionId` that exists in that guide) and a `why`.
- `lesson` links: flowchart ids exist; reader ids are reader-available.
