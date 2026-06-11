# Ward Manager — Labour Ward Board

A mobile-first clinical tool for managing the labour ward board during a shift. Tracks patients, fires evidence-based alerts, and provides quick access to VE, CTG, and obs logging — all client-side with no server or patient identifiers stored.

## Features

### Ward board
- Per-shift setup (doctor name, day/night, custom handover time)
- Bed cards with real-time alert status, obs dots, and quick + VE / + CTG actions
- **Tasks tab** — ward-wide task list grouped by urgency (Urgent / Warning / Routine), each item tappable to navigate directly to the relevant bed

### Admission wizard
- 4-step wizard: bed number + parity + gestation → labour stage → mode of onset + analgesia → risk flags + admission time
- Risk flags: GBS+, Diabetic (T1/T2/GDM), VBAC, Previous LSCS, Hypertensive

### Vaginal examination (VE)
- Dilation (0–10 cm), membranes, station, presentation, contractions/10 min
- NowField with quick offset pills (−15 m / −30 m / −1 h / −2 h / −3 h / −4 h) and ago confirmation

### CTG review (NICE NG229 — Fetal Monitoring in Labour, Dec 2022)
- Feature entry: baseline HR stepper, variability (5-25 / <5 / >25 / sinusoidal) with duration buckets, decelerations with duration sub-classification, accelerations, contractions
- Live classification banner: **Normal / Suspicious / Pathological** computed per NG229 §1.4 rules
- History log per bed with classification badge

### Observations
- Pulse, BP (sys/dia), Temperature, BGL (diabetic patients)
- Tap a card to mark done instantly (clears the alert); optional value entry via `+ label` buttons
- Urine output with oliguria warning (< 30 mL/hr)
- Oxytocin log with 30-min increment reminders

### Delivery
- Mark delivered: mode (SVD / Forceps / Ventouse / Em LSCS / El LSCS), time, EBL
- Major PPH flag at ≥ 1000 mL
- Delivered beds shown in green, excluded from task list

### Handover
- Auto-generated SBAR-style text handover for all active beds
- Share sheet integration

## Clinical alert engine

`src/utils/wardAlerts.js` — pure function, injectable clock for testing.

| Rule | Source | Severity |
|------|--------|----------|
| VE overdue (> 4 h active first stage) | NICE NG235 §1.4.1 | Urgent |
| VE due soon (> 3.5 h) | NICE NG235 §1.4.1 | Warning |
| Latent phase reassessment (> 4 h) | NICE NG235 §1.3.3 | Warning |
| Slow progress (< 0.5 cm/hr over ≥ 2 h) | NICE NG235 §1.5.1–1.5.4 | Urgent |
| Uterine hyperstimulation (> 5 ctx/10 min) | NICE NG235 §1.5.7 | Urgent |
| Oxytocin increment due (> 30 min) | NICE NG235 §1.5.6 | Warning |
| Oxytocin at maximum dose (≥ 20 mU/min) | NICE NG235 §1.5.6 | Urgent |
| Active pushing — nulliparous warning (≥ 45 min) | NICE NG235 §1.6.2 | Warning |
| Active pushing — nulliparous urgent (≥ 60 min) | NICE NG235 §1.6.2 | Urgent |
| Active pushing — multiparous warning (≥ 20 min) | NICE NG235 §1.6.2 | Warning |
| Active pushing — multiparous urgent (≥ 30 min) | NICE NG235 §1.6.2 | Urgent |
| Maternal pulse overdue (> 1 h active labour) | NICE NG235 §1.4.5 | Info |
| BP overdue (> 4 h; > 1 h if hypertensive) | NICE NG235 §1.4.5 | Info / Urgent |
| Temperature overdue (> 4 h) | NICE NG235 §1.4.5 | Info |
| BP elevated (≥ 140/90) | NICE NG133 / NG235 §1.4.5 | Warning |
| BP severe (≥ 160/110) | NICE NG133 / NG235 §1.4.5 | Urgent |
| Oliguria (< 30 mL/hr) | NICE NG235 §1.4.5 | Urgent |
| BGL overdue — diabetic (> 1 h) | GL983 | Urgent |
| BGL outside target (< 4.0 or > 7.0 mmol/L) | GL983 | Urgent |
| GBS IAP due | GL787 | Urgent |
| Ruptured membranes > 18 h (GBS+) | GL787 | Urgent |
| Preterm — alert neonatal team (< 34 weeks) | NICE NG25 §1.1.4 | Urgent |
| Preterm — MgSO4 neuroprotection (< 30 weeks) | NICE NG25 §1.6.1 | Urgent |
| Preterm — corticosteroids (< 34+6) | NICE NG25 §1.7.1 | Urgent |
| Preterm — consider tocolysis (28–33+6) | NICE NG25 §1.8 | Warning |
| Continuous CTG not documented | NICE NG229 §1.3.2 | Info |
| CTG suspicious (last entry) | NICE NG229 §1.4 | Warning |
| CTG suspicious ≥ 30 min without follow-up | NICE NG229 §1.4 | Urgent |
| CTG pathological (last entry) | NICE NG229 §1.4 | Urgent |
| CTG review overdue — normal (> 60 min) | NICE NG229 §1.3.2 | Info |

**152 tests** covering all rules — `npm test -w apps/ward-manager`

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
npm test -w apps/ward-manager      # 152 clinical rule tests
```

## Data storage

All data is stored in `localStorage` on the device — no network requests, no server, no patient identifiers. Bed numbers only.

## Tech stack

Vite · React 19 · Tailwind CSS · Vitest

## Important

This tool implements rules from NICE NG235, NG229, NG25, NG133, and local RBH guidelines (GL787, GL983). It is not a substitute for clinical judgement. Always escalate to a senior when uncertain.
