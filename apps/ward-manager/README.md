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
4. **Tap a woman** for big actions: **CTG normal** (1 tap), **CTG concern** (full NG229 review), **VE** (dilation and save; membranes, station and contractions carry over from the last VE), **Obs done** (1 tap), stage chips, delivered, oxytocin. Alerts such as GBS antibiotics or neonatal team have a Given or Done button.
5. **Admit**: bed, parity, gestation and stage on one screen (about 6 taps). Onset, membranes, analgesia, risk flags and the handover VE are optional.
6. **Handover**: plain-text handover sorted by bed, ready to copy or share.

Every change shows an undo toast for a few seconds instead of an "Are you sure?" dialog. Times are "Now", "10 / 20 / 30 / 60 min ago" or an exact time today or earlier; future times are refused.

The **full record** for each woman keeps the detail: VE and CTG history (edit or delete), obs values and urine output, oxytocin log, per-woman tasks, induction details, delivery, and edit details.

The **IOL queue** (NICE NG207 priority order) sits in its own tab, with admit-to-ward pre-filling the admission.

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

| Rule | Source | Severity |
|------|--------|----------|
| VE overdue (> 4 h active first stage) | NICE NG235 §1.4.1 | Urgent |
| VE due soon (> 3.5 h) | NICE NG235 §1.4.1 | Warning |
| Latent phase reassessment (> 4 h) | NICE NG235 §1.3.3 | Warning |
| Slow progress (< 0.5 cm/hr over ≥ 2 h) | NICE NG235 §1.5.1–1.5.4 | Urgent |
| Uterine hyperstimulation (> 5 ctx/10 min) | NICE NG235 §1.5.7 | Urgent |
| Oxytocin increment due (> 30 min) | NICE NG235 §1.5.6 | Warning |
| Oxytocin at maximum dose (≥ 20 mU/min) | NICE NG235 §1.5.6 | Urgent |
| Active pushing: nulliparous warning (≥ 45 min) | NICE NG235 §1.6.2 | Warning |
| Active pushing: nulliparous urgent (≥ 60 min) | NICE NG235 §1.6.2 | Urgent |
| Active pushing: multiparous warning (≥ 20 min) | NICE NG235 §1.6.2 | Warning |
| Active pushing: multiparous urgent (≥ 30 min) | NICE NG235 §1.6.2 | Urgent |
| Maternal pulse overdue (> 1 h active labour) | NICE NG235 §1.4.5 | Info |
| BP overdue (> 4 h; > 1 h if hypertensive) | NICE NG235 §1.4.5 | Info / Urgent |
| Temperature overdue (> 4 h) | NICE NG235 §1.4.5 | Info |
| BP elevated (≥ 140/90) | NICE NG133 / NG235 §1.4.5 | Warning |
| BP severe (≥ 160/110) | NICE NG133 / NG235 §1.4.5 | Urgent |
| Oliguria (< 30 mL/hr) | NICE NG235 §1.4.5 | Urgent |
| BGL overdue: diabetic (> 1 h) | GL983 | Urgent |
| BGL outside target (< 4.0 or > 7.0 mmol/L) | GL983 | Urgent |
| GBS IAP due | GL787 | Urgent |
| Ruptured membranes > 18 h (GBS+) | GL787 | Urgent |
| Preterm: alert neonatal team (< 34 weeks) | NICE NG25 §1.1.4 | Urgent |
| Preterm: MgSO4 neuroprotection (< 30 weeks) | NICE NG25 §1.6.1 | Urgent |
| Preterm: corticosteroids (< 34+6) | NICE NG25 §1.7.1 | Urgent |
| Preterm: consider tocolysis (28–33+6) | NICE NG25 §1.8 | Warning |
| Continuous CTG not documented | NICE NG229 §1.3.2 | Info |
| CTG suspicious (last entry) | NICE NG229 §1.4 | Warning |
| CTG suspicious ≥ 30 min without follow-up | NICE NG229 §1.4 | Urgent |
| CTG pathological (last entry) | NICE NG229 §1.4 | Urgent |
| CTG review overdue: normal (> 60 min) | NICE NG229 §1.3.2 | Info |

**219 tests** covering the rules, triage and bed helpers: `npm test -w apps/ward-manager`

## CTG classification (NICE NG229 §1.4)

`classifyCTGEntry(entry, prevBaselineHR?)` classifies each feature as White / Amber / Red:

- **Baseline HR**: 110–160 bpm = White; 100–109 or rise ≥ 20 bpm = Amber; < 100 or > 160 bpm = Red
- **Variability**: 5–25 bpm = White; < 5 bpm for 30–50 min = Amber; < 5 bpm > 50 min = Red; sinusoidal = Red; > 25 bpm ≤ 10 min = Amber; > 25 bpm > 10 min = Red
- **Decelerations**: None / Early = White; Variable (concerning) < 30 min = Amber; Variable ≥ 30 min / Late / Prolonged = Red
- **Contractions**: ≤ 5/10 min = White; > 5/10 min = Amber

Overall: ≥ 1 Red or ≥ 2 Amber = **Pathological** · 1 Amber = **Suspicious** · All White = **Normal**

## Local development

```bash
npm install
npm run dev -w apps/ward-manager   # http://localhost:5173
npm test -w apps/ward-manager      # 219 tests
```

## Data storage

All data is stored in `localStorage` on the device: no network requests, no server, no patient identifiers. Bed numbers only.

## Tech stack

Vite · React 19 · Tailwind CSS · Vitest

## Important

This tool implements rules from NICE NG235, NG229, NG25, NG133, and local RBH guidelines (GL787, GL983). It is not a substitute for clinical judgement. Always escalate to a senior when uncertain.
