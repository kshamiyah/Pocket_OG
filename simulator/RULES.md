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
☑ **ACCEPTED** (2026-06-28)

### R-VOL-3 — Transcapillary refill (partial self-compensation) **[ASSUMED rate]**
Body shifts interstitial fluid into circulation, partly offsetting early loss —
modelled as a slow top-up term, magnitude per Zenker model.
_Source: transcapillary refill in ZenCur model (Curcio 2020)._
☑ **DEFERRED to Stage 2** (2026-06-28); not in Stage 1 sandbox. Rate to be
lifted from the Zenker model when added. (Stage 1 patient is therefore slightly
more pessimistic — drains without this self-top-up.)

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
☑ **ACCEPTED** (2026-06-28); percentages applied to the weight-based maternal
volume (R-VOL-1), so a mother reaches each class at a higher absolute loss —
correctly reproducing late maternal decompensation.

### R-CIRC-2 — Compensation then collapse
Below ~15% loss, MAP holds (heart rate compensates). Past ~30–40% loss,
compensation fails and **MAP falls steeply**.
_Source: StatPearls staging; ZenCur baroreflex behaviour._
☑ **ACCEPTED** (2026-06-28); models the "compensate then crash off a cliff"
behaviour — the reason early action wins.

---

## D. Drug effects on tone (uterotonics)

Each drug raises `tone` **after an onset/effect delay**, by some amount, for some
duration. **DECISION (2026-06-28): drug timing is adopted directly from the
existing Pocket O&G algorithm** (`pph-shared.js` → `UTEROTONIC_PHARM_DELAY_SEC`,
`scaleDelayByBleedRate`, `CARBO_REPEAT_*`), so the simulator and the app share a
single source of truth and cannot drift. The bleed-rate scaling (waits shorten
when bleeding is brisk, 60 s floor) is inherited too.

> **Tone magnitude is a SEPARATE open issue.** The app models drugs as a ladder
> (escalate if not working) and never represents *how firm* the uterus becomes.
> So each drug's **tone-gain amount** is deliberately left unset here and tracked
> as its own decision (see `OPEN: tone magnitudes` below). Timing ✓ from app;
> magnitude ✗ still to be set.

### R-DRUG-OXY — Oxytocin
**Onset/effect window = 180 s (3 min), bolus** — from app
`UTEROTONIC_PHARM_DELAY_SEC.oxytocin_bolus`; infusion = 300 s. Effect sustained
~60 min then fades.
_Source: Pocket O&G `pph-shared.js`; corroborated by Uterotonics refresher (UCT)._
☑ **ACCEPTED — timing (app value 180 s)** (2026-06-28); tone magnitude: OPEN.

### R-DRUG-ERGO — Ergometrine
**Onset/effect window = 300 s (5 min)** — from app
`UTEROTONIC_PHARM_DELAY_SEC.ergometrine`; sustained tonic contraction (long
half-life 30–120 min).
_Source: Pocket O&G `pph-shared.js`; corroborated by Uterotonics refresher (UCT)._
☑ **ACCEPTED — timing (app value 300 s)** (2026-06-28); tone magnitude: OPEN.

### R-DRUG-CARBO — Carboprost
**Onset/effect window = 900 s (15 min)**, **repeat every 15 min** (floor 5 min
under brisk bleeding), up to 8 doses — from app `CARBO_REPEAT_BASE_SEC` /
`effectiveCarboRepeatDelaySec`.
_Source: Pocket O&G `pph-shared.js`; protocol GTG52._
☑ **ACCEPTED — timing (app value 900 s)** (2026-06-28); tone magnitude: OPEN.

### R-DRUG-MISO — Misoprostol
**Onset/effect window = 600 s (10 min)** — from app
`UTEROTONIC_PHARM_DELAY_SEC.misoprostol`.
_Source: Pocket O&G `pph-shared.js`._
☑ **ACCEPTED — timing (app value 600 s)** (2026-06-28); tone magnitude: OPEN.

### R-DRUG-MASSAGE — Fundal massage **[ASSUMED]**
Mechanical, immediate but **transient** partial tone gain; decays without a
drug to sustain it. No app timing constant (not a drug); onset ≈ immediate.
☑ **ACCEPTED — concept (immediate bump + decay)** (2026-06-28); magnitude & decay
rate set in the tone-magnitude exercise below.

## D2. Tone magnitude — the responsiveness model

**Decisions (2026-06-28, clinician):**
1. **Per-patient responsiveness dial — YES.** Each patient has a value
   `responsiveness R ∈ [0,1]`: how well her uterus answers uterotonics.
2. **Typical responder is controllable by oxytocin alone** — at `R = 1`,
   oxytocin reaches "controlled" tone (~0.95).
3. **R is derived from PPH risk factors** — more / worse risk factors → lower R
   → drugs work less → the app must escalate sooner (incl. surgical).

### R-TONE-RESP — Responsiveness from risk factors
`R` starts at 1.0 (typical, low-risk) and is reduced by each present PPH risk
factor, floored at 0.1 (drugs always do *something*). A heavily loaded patient →
low `R` → refractory atony that drugs barely shift, forcing balloon / sutures /
hysterectomy.

**Risk factors — transcribed from the app's GTG52 guideline** ("Risk Factors for
Atonic PPH"), with candidate weights (the amount each subtracts from `R`).
Weights are **[ASSUMED]** pending sign-off; the **list is from GTG52**.

| GTG52 atonic-PPH risk factor | Candidate weight (−R) |
|---|---|
| Previous PPH | 0.15 |
| Multiple pregnancy / polyhydramnios (overdistension) | 0.20 |
| Macrosomia (EFW >4 kg) | 0.15 |
| Grand multiparity (≥5 deliveries) | 0.10 |
| Prolonged labour (esp. third stage >30 min) | 0.15 |
| Chorioamnionitis / pyrexia in labour | 0.15 |
| Uterine fibroids | 0.10 |
| General anaesthesia / oxytocin augmentation | 0.10 |
| Placenta praevia or accreta suspected | 0.20 |

`R = max(0.1, 1.0 − Σ weights of present factors)`
_Source: GTG52 "Risk Factors for Atonic PPH" (Pocket O&G guideline content)._
☑ **ACCEPTED — list from GTG52** (2026-06-28); per-factor weights to be signed off.

### R-TONE-GAIN — How a drug raises tone (scaled by R)
Each uterotonic has a **potential target tone** `T_drug` (what it achieves in a
fully responsive patient, R = 1). Actual tone reached climbs toward that target
scaled by responsiveness:
`tone_after = tone_before + (T_drug − tone_before) × R`   (only if positive)
Stacking drugs lets a partial responder climb higher; a very low-R uterus never
reaches control on drugs alone → surgical escalation is the only winning move.

Candidate targets at R = 1 (magnitudes — for review, **[ASSUMED]** pending
sign-off):
| Agent | Target tone `T` at R=1 | Meaning |
|---|---|---|
| Oxytocin | 0.95 | Controls a typical responder alone (decision 2) |
| Ergometrine | 0.95 | Second agent; helps partial responders climb |
| Carboprost | 0.97 | Strong prostaglandin; higher ceiling |
| Misoprostol | 0.95 | Adjunct |
| Fundal massage | +0.3 transient, decays ~0.1/min | Mechanical bridge (R-DRUG-MASSAGE) |
| Surgical (balloon/sutures) | ~0.98 | Mechanical control independent of R |
☑ **ACCEPTED — formula + candidate targets** (2026-06-28); targets [ASSUMED],
revisable.

---

## E. Cardiac arrest layer

### R-ARR-1 — Cause-agnostic arrest & death via oxygen delivery / debt
**Design decision (2026-06-28):** the arrest trigger is **not** blood-volume
specific (so the model extends to sepsis, cardiac, etc.). The universal currency
is **oxygen delivery (DO₂)** — every shock type lowers it by its own mechanism
(haemorrhage: ↓volume→↓output; sepsis: ↓vascular resistance/maldistribution;
cardiac: ↓pump; hypoxia: ↓O₂ content).

Two distinct consequences, both off the same variable:

1. **Acute arrest event** — heart stops when oxygen delivery acutely collapses
   (circulatory output → near zero). For the haemorrhage pathway this is
   **calibrated** to coincide with ~40–50% volume loss (~4–5 min for an
   untreated full atonic bleed at 700 ml/min from a ~6,650 ml maternal volume).
   The volume figure is a _calibration anchor for bleeding_, not the universal
   trigger.
2. **Death / irreversibility** — governed by **cumulative oxygen debt** =
   ∫(demand − delivery)dt. Evidence-based threshold: **LD50 ≈ 113.5 mL/kg**
   (50% mortality), with metabolic correlates **lactate ≈ 12.9 mmol/L** and
   **base excess ≈ −18.8 mmol/L** at that point. Debt repaid within ~2 h →
   survivable; debt that lingers → organ failure → death.

Central new state variable: **oxygen delivery / cumulative oxygen debt** (lactate
as its visible readout). Each pathology plugs into it.

_Sources: Rixen & Siegel, "Bench-to-bedside review: oxygen debt…" (Critical Care,
cc3526); "Oxygen debt and metabolic acidemia as quantitative predictors of
mortality…" (PubMed 1989759); "Blood failure / oxygen debt" (Transfusion 2016)._
[refs: R12, R13, R14, R15, R16]
☑ **ACCEPTED** (2026-06-28).

### R-ARR-2 — Defibrillation window
Shockable rhythm (VF/VT): defibrillate within **2 min** for best survival; each
2-min CPR cycle ends in a rhythm check.
_Source: AHA Cardiac Arrest in Pregnancy; matches app `CPR_CYCLE_SEC = 120`._
[refs: R9, I3]
☑ **ACCEPTED** (2026-06-28).

### R-ARR-3 — Adrenaline
Non-shockable: adrenaline within **5 min**, repeated every **3–5 min**.
_Source: AHA; app `ADRENALINE_INTERVAL_SEC = 180`._
[refs: R9, I3]
☑ **ACCEPTED** (2026-06-28).

### R-ARR-4 — Perimortem caesarean / delivery
If no ROSC by **5 min** of arrest, deliver — best maternal & neonatal outcome.
Relieving aortocaval compression also improves CPR effectiveness.
_Source: AHA; app `PMCS_DECISION_SEC = 240`, `PMCS_DELIVERY_SEC = 300`._
[refs: R9, I3]
☑ **ACCEPTED** (2026-06-28).

---

## F. Outcome function

### R-OUT-DEATH — Death conditions (deterministic)
The model recognises **two** death pathways; both use deterministic thresholds
(not probabilities) for now.

**(1) Acute — used to score the algorithm.**
Once arrested, death if no return of circulation within the resuscitation window
and (pregnant arrest) delivery not achieved by ~5 min.
_Refs: R9 (AHA, 5-min delivery — solid); R10 (maternal IHCA survival)._
_The resuscitation-window length is **[ASSUMED]** (no clean cut-off in R10)._

**(2) Cumulative oxygen debt — MODELLED & RECORDED, not yet used to judge the
algorithm.**
Death if cumulative oxygen debt ≥ **~113 mL/kg** (LD50, treated as a hard line
for now). This represents later ITU / organ-failure death even after a pulse is
regained.
_Refs: R12 / R13 (Rixen & Siegel, PMID 1989759)._

> **Scope decision (2026-06-28):** the algorithm under test manages the **acute
> emergency only — it does not manage ITU/post-arrest care**, so condition (2) is
> **recorded as an outcome metric but does NOT count for/against the algorithm's
> score.** Oxygen debt is still fully modelled (it drives the acute arrest trigger
> R-ARR-1 and is logged as a severity marker). Scoring on condition (2) is
> deferred until the app's scope extends to post-resuscitation care.
> **113 mL/kg is LD50 (50% mortality)** — a future, more rigorous version may make
> this probabilistic.

☑ **ACCEPTED — deterministic; condition (2) recorded-not-scored** (2026-06-28).

### R-OUT-SURVIVE — Stabilisation (acute)
The patient survives the acute emergency if **condition (1) is avoided**: bleeding
controlled (`bleed_rate` low) and `blood_volume` restored above a safe line before
acute arrest becomes irreversible. Oxygen-debt repayment within ~2 h is recorded
(R12) as a quality/severity metric but, per the scope decision above, is not part
of the algorithm's pass/fail yet.
☑ **ACCEPTED** (2026-06-28).

---

## G. Resuscitation & transfusion

### R-TX-1 — Drug timing uses TWO separate clocks
The simulator separates two things the app conflates into one number:
- **Escalation clock** — when the operator *gives the next* uterotonic =
  the app's `UTEROTONIC_PHARM_DELAY_SEC` **scaled by bleed rate**
  (`scaleDelayByBleedRate`): brisk bleeding shortens the wait toward a 60 s
  floor. _Source: app `pph-shared.js` (I1)._ ☑ **ACCEPTED**.
- **Onset clock** — when a given drug *starts raising tone*. Separate,
  pharmacological; the app does not model it.
  Candidates: oxytocin 2 min, ergometrine 2 min, carboprost 4 min,
  misoprostol 10 min. ☐ **[ASSUMED] — needs sign-off**.

### R-TX-2 — Transfusion triggers on EBL, at the app's thresholds
The operator tracks **true EBL** (cumulative blood lost, gross of transfusion)
and gives blood only per `PPH_THRESHOLDS` (I1):
- **< 1,000 ml (minor):** no blood.
- **≥ 1,000 ml (major):** blood products + rapid crystalloid.
- **≥ 2,000 ml (massive):** MHP pack.
_Source: app `PPH_THRESHOLDS` / `getPphLevel` (I1)._ ☑ **ACCEPTED**.

### R-TX-3 — Infusion ceiling from cannula flow
Transfusion is rate-limited by cannula flow — it cannot outrun a torrential
bleed. **16G "grey" ≈ 180 ml/min**; clinical practice sites ≥1 grey routinely
and a **second grey** in major/massive haemorrhage:
- **major: ~180 ml/min** (one grey)
- **massive: ~360 ml/min** (two greys)
_Source: 16G grey cannula flow rate ~180 ml/min (R17)._ ☑ **ACCEPTED**.
Blood-prep delay (time to bedside) ~2 min ☐ **[ASSUMED]**.

### R-TX-4 — Exsanguination signal → surgery
If ~**1 whole blood volume** has been transfused and bleeding continues
(held by transfusion alone), surgical control is mandatory. Stands in for the
not-yet-modelled limits: **dilutional coagulopathy** and **blood-bank
depletion**. ☑ **ACCEPTED — concept**; coagulopathy modelling deferred.

## H. Surgical / mechanical control (Stage 4)

### R-SURG-1 — Mechanical control is independent of responsiveness
Unlike drugs (scaled by `R`), mechanical control physically compresses the
bleeding source, so it raises tone **regardless of `R`**. Ladder, escalated when
the uterotonic ladder is exhausted and bleeding continues:
| Step | Effect (tone target) | Note |
|---|---|---|
| Bakri balloon tamponade | ~0.95 | first-line mechanical; may avoid theatre |
| Compression sutures (B-Lynch) + vessel ligation | ~0.97 | laparotomy |
| Hysterectomy | ~0.999 | definitive |
Some causes blunt mechanical efficacy (e.g. **placenta accreta** → balloon/
sutures ineffective → hysterectomy is definitive).
_Source: GTG52 surgical management; app `bakri` task (I2)._
Tone targets ☐ **[ASSUMED]**; ladder/escalation order ☑ **ACCEPTED**.

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

---

## References & Audit Trail

Each source carries a **stable identifier** (PMID / PMCID / DOI / ISBN-equivalent)
so it remains reachable for future audit even if a URL changes. Internal sources
cite the repository file and the specific named symbol/section.

### External literature

| Ref | Citation | Stable ID | URL |
|---|---|---|---|
| R1 | Uterine Atony (overview) | ScienceDirect Topics: "Uterine Atony" | https://www.sciencedirect.com/topics/medicine-and-dentistry/uterine-atony |
| R2 | Postpartum Haemorrhage (overview), Medscape | Medscape Article 275038 | https://emedicine.medscape.com/article/275038-overview |
| R3 | Curcio et al., "A Simple Cardiovascular Model for the Study of Hemorrhagic Shock" (2020) | PMCID: PMC7781723; DOI: 10.1155/2020/7936895 | https://pmc.ncbi.nlm.nih.gov/articles/PMC7781723/ |
| R4 | Curcio et al., "Seven Mathematical Models of Hemorrhagic Shock" (2021) | PMCID: PMC8195646; DOI: 10.1155/2021/6640638 | https://pmc.ncbi.nlm.nih.gov/articles/PMC8195646/ |
| R5 | Hemorrhagic Shock — StatPearls | NCBI Bookshelf: NBK470382 | https://www.ncbi.nlm.nih.gov/books/NBK470382/ |
| R6 | CV Physiology — Hemorrhagic Shock | cvphysiology.com BP031 | https://cvphysiology.com/blood-pressure/bp031 |
| R7 | Uterotonics & Tocolytics — UCT Anaesthesia Refresher (2021) | UCT Refresher Course 2021 | https://anaesthetics.ukzn.ac.za/wp-content/uploads/2024/11/Uterotonics-and-tocolytics-Ref-2021.pdf |
| R8 | WHO Recommendations: Uterotonics for Prevention of PPH | NCBI Bookshelf: NBK535990 | https://www.ncbi.nlm.nih.gov/books/NBK535990/ |
| R9 | Cardiac Arrest in Pregnancy — AHA Scientific Statement | DOI: 10.1161/CIR.0000000000000300 | https://www.ahajournals.org/doi/full/10.1161/cir.0000000000000300 |
| R10 | Survival Outcomes in Maternal In-Hospital Cardiac Arrest | PMCID: PMC8917084 | https://pmc.ncbi.nlm.nih.gov/articles/PMC8917084/ |
| R11 | Management of Hemorrhagic Shock: Physiology, Timing, Strategies | PMCID: PMC9821021; DOI: 10.3390/jcm12010260 | https://pmc.ncbi.nlm.nih.gov/articles/PMC9821021/ |
| R12 | Rixen & Siegel, "Bench-to-bedside review: Oxygen debt and its metabolic correlates…" Crit Care (2005) | DOI: 10.1186/cc3526 | https://ccforum.biomedcentral.com/articles/10.1186/cc3526 |
| R13 | Rixen et al., "Oxygen debt and metabolic acidemia as quantitative predictors of mortality…" (1991) | PMID: 1989759 | https://pubmed.ncbi.nlm.nih.gov/1989759/ |
| R14 | Bjerkvig et al., "'Blood failure': oxygen debt, coagulopathy and endothelial damage" Transfusion (2016) | DOI: 10.1111/trf.13500 | https://onlinelibrary.wiley.com/doi/full/10.1111/trf.13500 |
| R15 | "Class of hemorrhagic shock … diastolic coronary flow reversal" (swine exsanguination model) | PMCID: PMC9795012 | https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9795012/ |
| R16 | Critical Thresholds of Hemorrhagic Shock (blood-loss % to arrest, summary) | MED-TAC / tactical-medicine review | https://www.tactical-medicine.com/blogs/news/how-much-blood-loss-is-fatal-the-critical-thresholds-of-hemorrhagic-shock |
| R17 | 16G grey cannula flow rate (~180 ml/min) | BD Venflon 16G spec / IV cannula flow-rate references | https://www.midmeds.co.uk/shop/md391455-1-bd-venflon-iv-cannula-16g-grey-x-1-69600 |

### Internal sources (Pocket O&G repository)

| Ref | Source | Reachable location |
|---|---|---|
| I1 | Uterotonic drug timing constants | `apps/pocket-og/src/data/emergency/pph-shared.js` → `UTEROTONIC_PHARM_DELAY_SEC`, `CARBO_REPEAT_BASE_SEC`, `scaleDelayByBleedRate` |
| I2 | GTG52 atonic-PPH risk factors | `packages/guidelines/src/GTG52.js` → "Risk Factors for Atonic PPH" |
| I3 | Arrest timing constants (cross-check) | `apps/pocket-og/src/data/emergency/cardiac-arrest-shared.js` → `CPR_CYCLE_SEC`, `ADRENALINE_INTERVAL_SEC`, `PMCS_DECISION_SEC`, `PMCS_DELIVERY_SEC` |

### Rule → reference map

| Rule | References |
|---|---|
| R-BLEED-1, R-BLEED-2, R-BLEED-3 | R1, R2 |
| R-VOL-1 | R1, R2 (maternal volume; exact ml/kg to be pinned) |
| R-VOL-2, R-VOL-3 | R3, R4 |
| R-CIRC-1, R-CIRC-2 | R5, R6, R3 |
| R-DRUG-OXY/ERGO/CARBO/MISO | I1, R7, R8 |
| R-DRUG-MASSAGE | (clinical convention; magnitude unsourced) |
| R-TONE-RESP | I2 (list); weights unsourced |
| R-TONE-GAIN | (targets unsourced — [ASSUMED]) |
| R-ARR-1 | R12, R13, R14, R15, R16, R11 |
| R-ARR-2, R-ARR-3, R-ARR-4 | R9, I3 |
| R-OUT-DEATH, R-OUT-SURVIVE | R10, R12 |

**Audit note:** any value marked `[ASSUMED]` or "unsourced" has **no citation by
design** and must be set by clinical sign-off before use — these are the lines an
audit should scrutinise first.
