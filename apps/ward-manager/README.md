# PocketSuite: labour ward board

A phone-first board for the delivery suite doctor. It is a memory aid, not a record: it answers "who needs me next, and why?" and makes the common actions one or two taps. Everything stays on the device, with bed numbers only.

The look (colours, type, sheets, undo toast) matches the Handover app so the two tools feel like one family.

## A shift with PocketSuite

1. **Begin shift**: name, day or night, length. One screen.
2. **Taking over**: if the last shift left women on the board, you see them and take over. A **board round** steps through each woman in bed order with a big "No change · next" button.
3. **During the shift**: the board sorts itself.
   - **Needs you now** (red): the alert engine's urgent alerts.
   - **Due soon** (orange): its warnings.
   - **On track**: everything else, with the next thing due (for example "VE 01:28, in 3h 30m").
   Routine pulse, BP and temperature reminders are P/B/T dots on the row instead of alerts.
4. **Tap a woman** for big actions: **CTG normal** (1 tap), **CTG concern** (full NG229 review), **VE** (dilation and save; membranes, station and contractions carry over from the last VE), **Obs done** (1 tap), stage chips, delivered, oxytocin (start, change, hold or stop). Alerts such as GBS antibiotics or neonatal team have a Given or Done button.
5. **Admit**: bed, parity, gestation and stage on one screen (about 6 taps). Onset, membranes, analgesia, risk flags and the handover VE are optional.
6. **Handover**: plain-text handover sorted by bed, ready to copy or share.

Every change shows an undo toast for a few seconds instead of an "Are you sure?" dialog. Times are "Now", "10 / 20 / 30 / 60 min ago" or an exact time today or earlier; future times are refused.

The **full record** for each woman keeps the detail: VE and CTG history (edit or delete), obs values and urine output, oxytocin log, per-woman tasks, induction details, delivery, and edit details.

The **IOL queue** (NICE NG207 priority order) sits in its own tab, with admit-to-ward pre-filling the admission.

**Rules and sources** (menu, or the footer under the board) lists every alert rule in plain language. Tap a source to read the guideline's exact wording and open the page it came from. Every alert's citation is tappable too, so you can check why an alert fired from the bed itself.

## Code map

- `src/components/WardPage.jsx`: board state, persistence, undo, which sheet is open.
- `src/components/Board.jsx`: the triage board and bottom bar.
- `src/components/BedSheet.jsx`, `VESheet.jsx`, `CTGSheet.jsx`, `OxySheet.jsx`, `DeliverySheet.jsx`, `AdmitSheet.jsx`: action sheets.
- `src/components/BedRecord.jsx`, `BoardRound.jsx`, `HandoverSheet.jsx`, `IOLQueue.jsx`.
- `src/ui/`: Handover-matching style tokens, bottom sheet, chips, time picker, undo toast, icons.
- `src/utils/triage.js`: tiers, short labels and "next due". No clinical thresholds live here: next due asks the alert engine when each alert would first fire.
- `src/utils/bedModel.js`: bed helpers (add VE, stamp obs, set stage, clear an alert). The stored bed shape is unchanged from earlier versions.

## Clinical alert engine

`src/utils/wardAlerts.js`: pure function, injectable clock for testing.

The rules are listed in plain language, with their sources, in **`src/data/ruleCatalogue.js`**. That file drives the in-app **Rules and sources** page (menu, or the footer under the board) and is the single place to read what the board does. A test fails if the engine can raise an alert the catalogue does not describe, or if a rule cites a source that does not exist.

`src/data/sources.js` holds the exact guideline wording for each cited recommendation, with a link to its anchor on the NICE website. It is generated, not hand-typed:

```bash
node scripts/build-sources.mjs <recs.json>   # recs.json: NICE recommendation texts keyed by anchor id
```

Local guideline text (GL787, GL983) and the RCOG GTG52 summary are read from `@pocket-og/guidelines`.

What runs when:

- **Any stage of labour, including latent and induction**: a logged suspicious or pathological CTG is acted on. The "CTG not logged" and hourly review prompts start in established labour or once oxytocin is running (for every woman by default; a unit setting).
- **Under 28+0**: a note says labour progress and CTG rules are not applied. Preterm (NG25 lower bands), antibiotic and maternal observation alerts still run.
- **After birth**: maternal observations, low BP or temperature (NG255 table 1) and PPH (GTG52) continue; a woman with an active alert returns to "Needs you now".
- **Oxytocin** can be stopped or held. Pathological CTG on oxytocin raises "stop oxytocin" (NG235 1.8.56); there is no "increase" prompt while held, in the second stage, with 5 or more contractions in 10, or with an abnormal CTG.
- **Observations**: marking a check done without a value clears the old value, so an abnormal reading does not linger.

Numbers that are local choices rather than national guidance are marked as local on the Rules and sources page.

**Unit settings** (menu) let each unit set those local choices: continuous CTG for everyone in established labour (default on; NICE offers intermittent auscultation at low risk), extra CTG indications, meconium CTG mandatory, suspicious CTG recheck, latent reassessment, ROM review and antibiotic hours, neonatal team gestation, oxytocin maximum and oliguria threshold. Definitions and defaults live in `src/data/unitSettings.js`; values are stored on the phone (`pocketog_suite_unit_v1`, only changed values). Each Rules and sources card that a setting affects shows what this phone is set to and whether it differs from the app default.

**295 tests** covering the rules, triage, bed helpers and the catalogue: `npm test -w apps/ward-manager`

## CTG classification (NICE NG229 1.4.12, 1.4.32)

`classifyCTGEntry(entry, prevBaselineHR?)` grades 4 features as white, amber or red:

- **Contractions**: fewer than 5 in 10 min = white; 5 or more, or hypertonus = amber. Recorded on every full CTG review.
- **Baseline**: 110 to 160 bpm = white; 100 to 109 or 161 to 180 = amber; under 100 or over 180 = red. A rise of 20 bpm or more is also amber (local threshold).
- **Variability**: 5 to 25 bpm = white; under 5 for 30 to 50 min = amber; under 5 for over 50 min or sinusoidal = red; over 25 for 15 to 25 min = amber; over 25 for over 25 min = red.
- **Decelerations**: none, early or variable = white; concerning variable under 30 min = amber; concerning variable 30 min or more, late or prolonged = red.

Overall: 1 red or 2 or more amber = **pathological**; 1 amber = **suspicious**; all white = **normal**. The clinician can judge a trace pathological on the whole picture; the app records this as a clinician decision and never downgrades.

## Local development

```bash
npm install
npm run dev -w apps/ward-manager   # http://localhost:5173
npm test -w apps/ward-manager      # 295 tests
```

## Data storage

All data is stored in `localStorage` on the device: no network requests, no server, no patient identifiers. Bed numbers only.

## Tech stack

Vite · React 19 · Tailwind CSS · Vitest

## Important

This tool implements rules from NICE NG235, NG229, NG25, NG195, NG133, NG3 and NG255, RCOG GTG52, and local RBH guidelines (GL787, GL983); see the in-app Rules and sources page. It is not a substitute for clinical judgement. Always escalate to a senior when uncertain.
