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
☑ **ACCEPTED — concept; ⏸ DEFERRED (build after)** (2026-06-29). Trauma/tissue/
thrombin bleeding is clinically less difficult than atony but adds real modelling
complexity (separate sources, repair dynamics). Flagged for a later stage — NOT
built now to keep the patient tractable.

---

## B. Blood volume & resuscitation in

### R-VOL-1 — Starting maternal blood volume (BMI-adjusted)
Whole blood volume at term is ~100 ml/kg for a lean mother but **falls with BMI**
(adipose carries less blood per kg). **Volume is weight-AND-BMI based:**
`ml_per_kg = clamp(−1.372 × BMI + 130, 55, 110)` (Vricella regression, R26);
`blood_volume_start = weight_kg × ml_per_kg`.
- BMI 20 → ~103 ml/kg (70 kg → ~7,180 ml)
- BMI 25 → ~96 ml/kg (70 kg → ~6,700 ml) ≈ prior lean baseline
- BMI 40 → ~75 ml/kg (70 kg → ~5,260 ml)

Adds **weight and BMI** as required inputs. Effect: an obese mother arrests
**earlier** on the same bleed (same loss = larger fraction of a smaller volume) —
exactly the under-estimation hazard the source warns of.
_Sources: Vricella et al., hydroxyethyl-starch dilution (R26); Kennedy et al.,
BJA 2022 non-linear approach (R24); plasma-volume expansion (R25)._
☑ **ACCEPTED — BMI-adjusted (Vricella)** (2026-06-29); flat ml/kg superseded.

### R-VOL-2 — Volume balance each tick
`blood_volume += (fluids_in + blood_in − bleed_rate × dt)`
_Source: mass-balance of haemorrhage models (Curcio 2020/2021)._
☑ **ACCEPTED** (2026-06-28)

### R-VOL-3 — Transcapillary refill (partial self-compensation) **[ASSUMED rate]**
Body shifts interstitial fluid into circulation, partly offsetting early loss —
modelled as a slow top-up term, magnitude per Zenker model.
_Source: transcapillary refill in ZenCur model (Curcio 2020)._
⏸ **DEFERRED — later (too complex now)** (2026-06-29). Confirmed flagged: the
body's self-refill is genuinely complex to model faithfully; left out for now,
rate to be lifted from the Zenker model when we build it. (Patient is therefore
slightly pessimistic — drains without self-top-up.)

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

**Theme-5 calibration sign-off (2026-06-29):** the specific calibration values —
MAP-vs-%-lost breakpoints (90→85→75→45→25), the HR curve (80 + 160×fraction,
cap 180), the arrest threshold (MAP ≤ 35), and the oxygen engine (DO₂ 12,
VO₂ 3.5, debt floor 0.70 mL/kg/min) — are **ACCEPTED as ATLS-grounded**: they sit
within the sourced ATLS shock-class bands (R5/R6) and the oxygen-debt physiology
(R12). ATLS is the accountable authority for the staging.

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
Magnitude **+0.30 transient, decays 0.10/min** (clinical convention — bimanual
compression buys time but fades without a uterotonic to sustain it).
☑ **ACCEPTED — magnitude +0.30 / decay 0.10/min** (2026-06-29).

## D2. Tone magnitude — the responsiveness model

> ⚠️ **SUPERSEDED (2026-06-29) by the R-SEVERITY redesign in §D3.** Clinical
> decision: PPH risk factors do **not** affect *treatability*; they affect how
> *atonic/fast-bleeding* the uterus is. The whole responsiveness (R) model below
> is retired. Surgery is now a **haemodynamic** decision, and structural causes
> (accreta) are explicitly **drug-refractory**. The text below is kept for history.

## D3. R-SEVERITY — risk factors drive severity (current model)

**R-SEVERITY — starting tone from risk factors.** Risk factors set how atonic she
starts (severity → bleed rate), from a base tone of **0.85** (~105 ml/min, a
typical recognised major PPH inferred from total-loss-over-time; literature gives
volume not rate). Each present GTG52 factor lowers the starting tone by its
weight (same weights as before, now applied to severity, not R):
`start_tone = max(0, 0.85 − Σ weights)`. _Source: GTG52 ORs (R21) for the weights;
base rate inferred from R24/R25 + total-loss data._ ☑ **ACCEPTED**.

**R-DRUG-INCREMENT — equipotent increments (no R).** Each uterotonic adds an equal
tone increment (oxy/ergo/carbo +0.30, miso +0.20), capped at 0.97. How many drugs
she needs falls out of how atonic she started. _Source: Cochrane equipotence
(R20)._ ☑ **ACCEPTED**.

**R-DRUG-REFRACTORY — structural causes don't respond.** Accreta / abnormal
placentation is **drug-refractory** (uterotonics can't raise tone) AND mechanically
refractory (balloon/sutures ineffective → hysterectomy). A structural property,
NOT a risk-factor effect. ☑ **ACCEPTED**.

**R-SURGERY-TRIGGER — surgery is a haemodynamic decision.** Go to theatre when she
is **still bleeding** (durable, drug-driven) **AND** (MAP ≤ **60 mmHg** — becoming
unstable — **OR** has already bled a massive amount, ≥ 2,000 ml, without control).
Fires at any point, even mid-ladder; the surgical ladder (balloon → sutures →
hysterectomy) escalates paced by onset. _Source: GTG52 "surgical haemostasis when
medical measures fail"; clinical sign-off._ ☑ **ACCEPTED**.

**R-CONTROL-DURABLE — control means durable.** The "controlled" verdict uses the
**sustained** (drug/surgical) tone, excluding the transient massage bonus — massage
buys time (slows actual loss) but doesn't count as definitive control. ☑ **ACCEPTED**.

### (history — superseded responsiveness model)

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

**Risk factors and weights — from GTG52 Table 1 odds ratios** (Stones et al.
1993, R21). Each factor's weight is **derived from its odds ratio**, tiered:

| OR tier | OR | Weight (−R) |
|---|---|---|
| Very high | ≥ 8 | 0.25 |
| High | 3–5 | 0.15 |
| Moderate | ~2 | 0.10 |

| Risk factor | GTG52/source OR | Weight (−R) |
|---|---|---|
| Placenta praevia / accreta | ~13 | 0.25 |
| Multiple pregnancy / polyhydramnios (overdistension) | ~4.5 | 0.15 |
| Previous PPH | ~3 | 0.15 |
| Macrosomia (EFW >4 kg) | ~2 | 0.10 |
| Prolonged labour | ~2 | 0.10 |
| Chorioamnionitis / pyrexia | ~2 | 0.10 |
| General anaesthesia / oxytocin augmentation | ~2 | 0.10 |
| Grand multiparity | ~2 | 0.10 |
| Uterine fibroids | ~2 | 0.10 |

`R = max(0.1, 1.0 − Σ weights of present factors)`

**Modelling assumption (flagged):** the GTG52 ORs quantify the risk of *having* a
PPH, not refractoriness to treatment. They are used as a **proxy** for `R` because
the high-OR factors are mechanistically also the hardest to reverse (overdistension,
exhausted/augmented or infected myometrium, abnormal lower-segment implantation).

_Source: GTG52 Table 1 / Stones et al. 1993 (R21); factor list from app GTG52 (I2)._
☑ **ACCEPTED — weights derived from GTG52 ORs** (2026-06-29).

### R-TONE-GAIN — How a drug raises tone (scaled by R)
Each uterotonic has a **potential target tone** `T_drug` (what it achieves in a
fully responsive patient, R = 1). Actual tone reached climbs toward that target
scaled by responsiveness:
`tone_after = tone_before + (T_drug − tone_before) × R`   (only if positive)
Stacking drugs lets a partial responder climb higher; a very low-R uterus never
reaches control on drugs alone → surgical escalation is the only winning move.

**Tone scale anchoring (clinical sign-off 2026-06-29):** the `tone` variable
(0 = atonic → 1 = firm) maps to real, measurable clinical scales — the validated
**0–10 uterine tone score** (0 = no atony … 10 = severe relaxation; inverse of our
scale) and **intrauterine-pressure (IUPC)** resting tone (normal < 15–20 mmHg).
_Sources: 0–10 tone score (R18); IUPC resting tone (R19)._

**Uterotonics are roughly EQUIPOTENT (clinical sign-off 2026-06-29).** Clinically
you stack agents until bleeding settles; if the whole ladder is exhausted and she
is still bleeding, escalate to surgery. The agents are of similar strength — what
differs between patients is how refractory the uterus is (the responsiveness `R`,
which decides whether she settles on drugs or runs out and needs theatre). So each
drug uses ~the same target, misoprostol slightly weaker (Cochrane NMA, R20):

| Agent | Target tone `T` at R=1 | Meaning |
|---|---|---|
| Oxytocin | 0.95 | first-line |
| Ergometrine | 0.95 | equipotent |
| Carboprost | 0.95 | equipotent |
| Misoprostol | 0.90 | slightly weaker (Cochrane NMA, R20) |
| Fundal massage | +0.3 transient, decays ~0.1/min | Mechanical bridge (R-DRUG-MASSAGE) |
| Surgical (balloon/sutures) | ~0.95–0.999 | Mechanical, independent of R (R-SURG-1) |

_Drug targets: relative ordering evidence-based (R20); absolute values remain
calibration ([ASSUMED]) but anchored to the 0–10 / mmHg scale above._
☑ **ACCEPTED — equipotent targets** (2026-06-29).

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
  pharmacological; the app does not model it. **Published onset of effect:**
  oxytocin **1 min** (IV near-instant; 2–5 min IM), ergometrine **2 min** (2–3 min IM),
  carboprost **15 min** (peak plasma 20–30 min; clinical response within ~30 min in
  75%; slow), misoprostol **10 min** (peak plasma 10–15 min oral).
  _Sources: R7 (uterotonics pharmacology), R22 (carboprost monograph), R23
  (prostaglandins for PPH)._ ☑ **ACCEPTED — researched onsets** (2026-06-29).
  > Operator-logic note — ✅ RESOLVED (2026-06-29): the operator now waits for the
  > last uterotonic's onset before escalating drugs → surgery (unless urgent), so a
  > drug always gets its chance to work. Surfaced by the asthma case (misoprostol
  > given then balloon 1 min later — fixed to wait the ~10-min onset).

### R-TX-2 — Transfusion triggers on EBL, at the app's thresholds
The operator tracks **true EBL** (cumulative blood lost, gross of transfusion)
and gives blood only per `PPH_THRESHOLDS` (I1):
- **< 1,000 ml (minor):** no blood.
- **≥ 1,000 ml (major):** blood products + rapid crystalloid.
- **≥ 2,000 ml (massive):** MHP pack.
_Source: app `PPH_THRESHOLDS` / `getPphLevel` (I1)._ ☑ **ACCEPTED**.

### R-TX-3 — Infusion ceiling from cannula flow (PRBC)
Transfusion is rate-limited by cannula flow and **blood viscosity** — packed
red cells flow ~50% slower than crystalloid through the same line (PMC8053387).
Infusion runs at a **fixed PRBC ceiling**, not capped at the current bleed rate:
when haemorrhage outpaces infusion, circulating volume falls and MAP drops.
- **major: ~100 ml/min** (one 16G, undiluted PRBC)
- **massive: ~200 ml/min** (two greys + pressurised / rapid infuser)
Crystalloid ceilings (~180 ml/min per 16G) are separate — Step 2+ in the build.
_Source: 16G flow (R17); PRBC viscosity halving (PMC8053387)._ ☑ **ACCEPTED** (2026-06-29 PRBC revision).
Blood-prep delay (time to bedside): **0 in the ideal model** — real time-to-blood
(O-neg ~mins vs crossmatched 15–30+ min) is a **human-factors** item, ⏸ **DEFERRED**
to that later layer (2026-06-29).

### R-TX-4 — Exsanguination signal → surgery
If ~**1 whole blood volume** has been transfused and bleeding continues
(held by transfusion alone), surgical control is mandatory. Stands in for the
not-yet-modelled limits: **dilutional coagulopathy** and **blood-bank
depletion**. ☑ **ACCEPTED — concept**; coagulopathy modelling deferred.

### R-TX-5 — Carboprost repeat dosing + abandon-to-surgery decision
The operator does not give carboprost once; it **repeats** it (every ~15 min,
bleed-rate-scaled to a 5-min floor, up to **8 doses** — app I1), and decides per
two axes when to **abandon** it for surgery:
- **Axis 1 — is it working / dose cap:** keep repeating while still bleeding and
  under 8 doses; the patient's responsiveness `R` decides whether repeats reach
  control (good responder settles in a few doses) or never do.
- **Axis 2 — urgency:** if EBL ≥ **1,500 ml** (app `theatreForce`) and bleeding is
  still brisk (≥ **200 ml/min** [ASSUMED]) → **abandon carboprost, go to surgery**
  now rather than grinding through 8 doses.
- **Contraindication:** **asthma → carboprost skipped entirely** (→ next agent).
Also: the operator keeps escalating (drugs → surgery) until bleeding is below the
**controlled** line (50 ml/min) — no untreated 50–100 ml/min dead zone.
_Source: GTG52 ("surgical haemostasis sooner rather than later"); app carbo repeat
+ theatreForce (I1)._ ☑ **ACCEPTED — clinician sign-off** (2026-06-29).
> Note: the app's 5-min carbo-repeat floor is more aggressive than BNF's "≥15 min"
> minimum; mirrored here for app-consistency, flagged for later review.

## H. Surgical / mechanical control (Stage 4)

### R-SURG-1 — Mechanical control is independent of responsiveness
Unlike drugs (scaled by `R`), mechanical control physically compresses the
bleeding source, so it raises tone **regardless of `R`**. Ladder, escalated when
the uterotonic ladder is exhausted and bleeding continues:
| Step | Effect (tone target) | Published success rate |
|---|---|---|
| Bakri balloon tamponade | ~0.95 | **85.9%** pooled (atony 87%, accreta **66.7%**) — R27 |
| Compression sutures (B-Lynch) + vessel ligation | ~0.97 | **~91%** pooled — R28 |
| Hysterectomy | ~0.999 | definitive (removes the organ) |

Tone targets are now **anchored to published success rates** (ordering balloon <
sutures < hysterectomy matches 86% < 91% < definitive). The cause-specific failure
is handled by the **accreta** flag (balloon/sutures ineffective → hysterectomy),
directly supported by the balloon's drop to 66.7% in accreta (R27). Deterministic
for the ideal model; a future probabilistic version could use 86%/91% as literal
probabilities.
_Sources: Bakri systematic review (R27); B-Lynch meta-analysis (R28); GTG52 /
app `bakri` task (I2)._
☑ **ACCEPTED — targets evidence-anchored** (2026-06-29); ladder/escalation order ✓.
**Escalation timing (2026-06-29):** in the ideal model the operator escalates to
the next surgical step only **after the previous step's onset has had its chance**
to work (place it, see if it controls her, else escalate). Theatre-mobilisation
time is a **human factor → deferred**. ☑ **ACCEPTED — onset-paced escalation**.

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
| R18 | Interrater reliability of a 0–10 uterine tone score (cesarean) | ScienceDirect S2589933321000379 | https://www.sciencedirect.com/science/article/abs/pii/S2589933321000379 |
| R19 | Normal uterine resting tone on oxytocin by IUPC (<15–20 mmHg) | FDA oxytocin label / IUPC reference | https://www.droracle.ai/articles/535846/what-is-a-normal-uterine-resting-tone-on-oxytocin |
| R20 | Uterotonic agents for preventing PPH: network meta-analysis | Cochrane CD011689.pub4 (Gallos et al.); DOI: 10.1002/14651858.CD011689.pub4 | https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD011689.pub4/full |
| R21 | Risk factors for major obstetric haemorrhage (GTG52 Table 1 source) | Stones et al. 1993; PMID: 8449256 | https://pubmed.ncbi.nlm.nih.gov/8449256/ |
| R22 | Carboprost monograph (onset / peak 20–30 min) | Drugs.com carboprost monograph | https://www.drugs.com/monograph/carboprost.html |
| R23 | Prostaglandins for Postpartum Hemorrhage: pharmacology | Karger, Pharmacology 2021;106:477 | https://karger.com/pha/article/106/9-10/477/820467/Prostaglandins-for-Postpartum-Hemorrhage |
| R24 | Maternal body weight and estimated circulating blood volume (review, non-linear approach) | Br J Anaesth 2022; DOI: 10.1016/j.bja.2022.07.009 | https://www.bjanaesthesia.org.uk/article/S0007-0912(22)00453-6/fulltext |
| R25 | Plasma volume expansion in pregnancy (~100 ml/kg at term) | ScienceDirect / PMC5701717 | https://pmc.ncbi.nlm.nih.gov/articles/PMC5701717/ |
| R26 | Blood volume in obese vs normal-weight gravidas (hydroxyethyl-starch); ml/kg vs BMI regression | Vricella et al.; PMID: 25981844 / PMC4589161 | https://pmc.ncbi.nlm.nih.gov/articles/PMC4589161/ |
| R27 | Uterine balloon tamponade success (85.9% pooled; by cause incl. accreta 66.7%) | Systematic review, 91 studies / PMC10086883 | https://pmc.ncbi.nlm.nih.gov/articles/PMC10086883/ |
| R28 | B-Lynch compression suture success (~91% pooled) | Meta-analysis / PMC9734287 | https://pmc.ncbi.nlm.nih.gov/articles/PMC9734287/ |

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
