# Virtual Obstetric Patient — Candidate Rule Book (v0)

_The actual rules the simulator would run, derived from the sources in
`RESEARCH_BRIEF.md`. Each rule is a **candidate**: a plain-English statement, the
concrete number / formula, and its source. **Tick OK or write a correction.**_

> ⚠️ Nothing here is validated. Every number is a starting proposal pulled from a
> cited source and **must be signed off by a clinician** before use. Where a
> figure is an engineering guess (not in a source), it is marked **[ASSUMED]**.

Notation: `tone` runs 0 (fully atonic) → 1 (firm, contracted). The clock ticks
in simulated minutes (`dt`).

---

## A. Bleeding source — the obstetric core

### R-BLEED-1 — Baseline uterine blood flow
At term, blood flow through the placental bed is **≈ 700 ml/min**; an atonic
uterus can bleed at "faucet flow" **≈ 750 ml/min**.
`BASELINE_FLOW = 700 ml/min`
_Source: Uterine Atony overview (ScienceDirect); PPH overview (Medscape)._
☑ **ACCEPTED** (2026-06-28)

### R-BLEED-2 — Tone controls the bleed
Bleeding rate is the baseline flow scaled by how _un_-contracted the uterus is:
`bleed_rate = BASELINE_FLOW × (1 − tone)`
→ tone 0 → ~700 ml/min; tone 0.5 → ~350; tone 1 → ~0.
_Source: haemostasis depends on myometrial contraction compressing spiral
arteries (Uterine Atony overview)._
☑ **ACCEPTED** (2026-06-28)

### R-BLEED-3 — Non-atonic causes (the other three T's) **[ASSUMED]**
Trauma / tissue / thrombin add a separate, tone-independent bleed term
(`bleed_extra`), set per scenario until sourced individually.
☑ **ACCEPTED — concept** (2026-06-28); per-cause ml/min still to be sourced/assigned

---

## B. Blood volume & resuscitation in

### R-VOL-1 — Starting maternal blood volume
Pregnancy raises blood volume ~40–50%, so a term mother carries ~90–100 ml/kg.
**Volume is weight-based, not flat:**
`blood_volume_start = weight_kg × 95 ml/kg`  (e.g. 70 kg → ~6,650 ml).
This adds **patient weight** as a required scenario input.
_(~95 ml/kg term-maternal value; exact ml/kg still to be pinned to a citation.)_
☑ **ACCEPTED — weight-based** (2026-06-28); flat 5,000 ml declined

### R-VOL-2 — Volume balance each tick
`blood_volume += (fluids_in + blood_in − bleed_rate × dt)`
_Source: mass-balance of haemorrhage models (Curcio 2020/2021)._
☐ OK ☐ Correct: __________

### R-VOL-3 — Transcapillary refill (partial self-compensation) **[ASSUMED rate]**
Body shifts interstitial fluid into circulation, partly offsetting early loss —
modelled as a slow top-up term, magnitude per Zenker model.
_Source: transcapillary refill in ZenCur model (Curcio 2020)._
☐ OK ☐ Correct: __________

---

## C. Circulation response (vitals) — ATLS / shock staging

> ⚠️ **Obstetric caveat:** the classic ATLS classes below assume a ~5 L
> non-pregnant adult. Because a pregnant woman's volume is ~40% higher, vital
> signs change **later** for a given absolute loss — she can lose a litre+ before
> the numbers move. This "she looks well until she crashes" lag is itself a rule
> to encode, and a key safety point.

### R-CIRC-1 — Heart rate & pressure vs percent volume lost
| Class | Volume lost | Heart rate | Blood pressure |
|---|---|---|---|
| I | <15% | <100, mild rise | Normal |
| II | 15–30% | 100–120 | Normal systolic, narrowed pulse pressure |
| III | 30–40% | 120–140 | Falls |
| IV | >40% | >140 | Markedly low |
_Source: Hemorrhagic Shock (StatPearls); CV Physiology._
☐ OK ☐ Correct: __________

### R-CIRC-2 — Compensation then collapse
Below ~15% loss, MAP holds (heart rate compensates). Past ~30–40% loss,
compensation fails and **MAP falls steeply**.
_Source: StatPearls staging; ZenCur baroreflex behaviour._
☐ OK ☐ Correct: __________

---

## D. Drug effects on tone (uterotonics)

Each drug raises `tone` **after an onset delay**, by some amount, for some
duration. Numbers below are timing facts from sources; the _amount_ of tone gain
is **[ASSUMED]** pending sign-off.

### R-DRUG-OXY — Oxytocin
Onset **2–5 min IM** (faster IV); half-life **3–5 min**; uterine effect up to
**~1 h**. → raises tone after ~3 min, sustained ~60 min.
_Source: Uterotonics refresher (UCT); WHO uterotonics._
☐ OK ☐ Correct: __________

### R-DRUG-ERGO — Ergometrine
Latent phase **2–5 min**; half-life **30–120 min**; sustained tonic contraction.
_Source: Uterotonics refresher (UCT)._
☐ OK ☐ Correct: __________

### R-DRUG-CARBO — Carboprost
Prostaglandin F2α analogue; **slower onset, longer duration**; repeat every
**15 min** up to 8 doses (per protocol).
_Source: Uterotonics refresher (UCT); app protocol GTG52._
☐ OK ☐ Correct: __________

### R-DRUG-MASSAGE — Fundal massage **[ASSUMED]**
Mechanical, immediate but **transient** partial tone gain; decays without a
drug to sustain it.
☐ OK ☐ Correct: __________

---

## E. Cardiac arrest layer

### R-ARR-1 — Trigger
If `MAP` stays below a critical line for longer than a tolerated window →
hypovolaemic cardiac arrest (`rhythm` → PEA/asystole). Threshold **[ASSUMED]**,
to be set against shock literature.
☐ OK ☐ Correct: __________

### R-ARR-2 — Defibrillation window
Shockable rhythm (VF/VT): defibrillate within **2 min** for best survival; each
2-min CPR cycle ends in a rhythm check.
_Source: AHA Cardiac Arrest in Pregnancy; matches app `CPR_CYCLE_SEC = 120`._
☐ OK ☐ Correct: __________

### R-ARR-3 — Adrenaline
Non-shockable: adrenaline within **5 min**, repeated every **3–5 min**.
_Source: AHA; app `ADRENALINE_INTERVAL_SEC = 180`._
☐ OK ☐ Correct: __________

### R-ARR-4 — Perimortem caesarean / delivery
If no ROSC by **5 min** of arrest, deliver — best maternal & neonatal outcome.
Relieving aortocaval compression also improves CPR effectiveness.
_Source: AHA; app `PMCS_DECISION_SEC = 240`, `PMCS_DELIVERY_SEC = 300`._
☐ OK ☐ Correct: __________

---

## F. Outcome function

### R-OUT-DEATH — Death conditions (candidate)
The patient dies if **either**:
- MAP below the critical line for longer than the tolerated window (exsanguination), **or**
- arrest without ROSC beyond the survival window (Tier 6 outcome data).
Thresholds **[ASSUMED]**, to be anchored to the maternal IHCA survival study.
_Source: Maternal In-Hospital Cardiac Arrest survival study (PMC)._
☐ OK ☐ Correct: __________

### R-OUT-SURVIVE — Stabilisation
If bleeding is controlled (`bleed_rate` low) and `blood_volume` restored above a
safe line before the death thresholds are met → survives / stabilises.
☐ OK ☐ Correct: __________

---

## How these become code (Stage 1 preview)

Each tick (`dt = 1 min`):
1. `bleed_rate = BASELINE_FLOW × (1 − tone) + bleed_extra`        (R-BLEED-2/3)
2. `blood_volume += fluids_in + blood_in − bleed_rate × dt`        (R-VOL-2)
3. update `tone` from active drugs and their onset/decay curves    (D.*)
4. derive `heart_rate`, `MAP` from percent volume lost             (R-CIRC-1/2)
5. check arrest triggers and timing windows                        (E.*)
6. evaluate outcome                                                (F.*)

Stage 1 sandbox would implement **only steps 1–2 plus oxytocin in step 3** —
three numbers and one drug — so the mechanism is visible and checkable before
anything is added.

_Every rule above is a candidate awaiting clinical sign-off against its cited
source. Corrections to any line change only that line._
