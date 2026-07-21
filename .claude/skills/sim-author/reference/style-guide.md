# Style guide — house voice for On Call cases

The point of this file is that fifty scenarios written across many sessions read
as one product. The exemplar is the `mau-rfm-34` case; when this guide and the
exemplar disagree, the exemplar wins. Several of these rules are enforced by
`simStyleCheck.test.js`.

## Language

- **British English throughout.** haemorrhage, paediatric, anaesthetic, fetal,
  oedema, oestrogen, labour, catheterise. Never the US spellings.
- **Never use em dashes (—).** Use a comma, colon, semicolon, or parentheses.
  En dashes in genuine numeric ranges (24–28 weeks, 500–1000 ml) are fine.
- Crisp and clinical. Short sentences. No throat-clearing, no "it is important
  to note", no filler.

## The patient and the scene

- Every patient is **fictional** and the `name` says so: "Amara O (fictional)".
- Give a real first name and a plausible, specific history. The history is one
  line and carries the detail that makes the case teach (e.g. the smoking and
  anterior placenta in RFM).
- The `narrative` is third-person scene-setting: what is in front of you, what
  has just happened, what you can see. Concrete and sensory, not a textbook stem.
  "Amara is perched on the edge of the couch, coat still on, one hand on her
  bump." Not "A 32-year-old G2P1 presents at 34 weeks with…".

## Dialogue

- People speak like people. Patients use lay words ("she's normally so busy
  after dinner, kicking away"), not clinical terms.
- Use dialogue to carry the teaching pressure: the patient's worry or pushback
  should land exactly where the hard decision is ("the machine looked fine, but
  I know her").
- Keep it short, one or two lines per beat. Attribute with `who: "patient"` or
  `who: "midwife"`.

## The clock

- `time` advances monotonically across beats and should feel realistic: a CTG
  takes ~25 minutes, a scan slot an hour. The gaps do quiet work; use them.
- Format "HH:MM", 24-hour.

## Observations

- `obs` render on a bedside monitor. Keys are short ("BP", "Pulse", "SFH",
  "cCTG", "UA Doppler"). Values carry units and are terse ("118/74", "148 bpm",
  "33 cm (50th)").
- Only show obs that matter to the decision at hand. Do not dump a full set
  every beat; update them as results arrive.

## Questions, options and the `why`

- The `question` is the call to action ("What is your first priority?", "How do
  you act on these findings?"), not a stem restating the vignette.
- Prefer `fromNode` so options are the guideline's own branches.
- For inline options: the correct one is unambiguous for this vignette; the
  distractors are real pathway actions wrong *here*, or approaches the guideline
  advises against. Never a fabricated dose or threshold.
- The `why` teaches in 2–4 sentences and never states more than the cited
  source supports. End-load the source in the receipt, not the prose.

## The lesson

- `summary` is one or two sentences on how the case resolved.
- `points` are the durable takeaways (5–7), each a principle a trainee keeps,
  not a recap of this patient.
- `evidence` names the trial or evidence base where there is one (AFFIRM for
  RFM), in plain terms.
- `links` point back into the guide and the relevant flowcharts.

## Framing that must stay

- The decision-aid framing is non-negotiable: the player already renders
  "training simulation with a fictional patient; decision aid only, clinical
  responsibility remains with the treating clinician." Do not remove or weaken
  it, and do not write anything that reads as a direct clinical instruction
  rather than a teaching decision.
