# SERA — Build Handover Tracker

Running list of everything to add/build, decided during the physiology design sessions.
Status: **DECIDED** = locked · **DESIGNING** = still being worked out · **DEFERRED** = later thread.

## 0. Orientation (building agent: read first)

**What SERA is.** SERA (Simulated Emergency Response Agent) is a virtual obstetric patient whose body is
driven by the REAL Pocket O&G PPH-SOS algorithm (via a Node bridge). The point: test whether the SOS
protocol keeps the simulated mother safe. The SOS algorithm is fixed/under-test — do NOT change it; you
change SERA's physiology (how her body responds).

**Key files** (all under `simulator/`):
- `stage4_sandbox.py` → **`PatientV4`** — the live physiology body. **This is where most changes land.**
- `bridge/app_operator.py` → the loop that runs the real SOS engine against PatientV4 (`stream()`,
  `apply_prompt()`, `_terminal_verdict()`). Translates app prompts → physiology calls; owns verdicts.
- `bridge/app_live.py` → Streamlit UI.
- `patient_profile.py` → phenotype/scenario builder (`scenario_from_profile`, treatment-response matrix).
- `bridge/human_factors.py` → team-timing (delays). Relevant to Fix 2 (deferred), and manual-removal timing.
- `stage1–3_sandbox.py` → foundational constants (blood volume, MAP breakpoints, oxygen engine, coag).
  Reused by PatientV4; several new constants belong here.
- `RULES.md` → the rule book (R-* rules). Update it as you implement; it's the physiology source of truth.

**How to run:** `python3 simulator/bridge/app_operator.py` (needs the Node bridge; it launches vite-node).
Batch/sweep harness: `simulator/batch_run.py`. Branch: **`Sera`**.

**How to use this doc:** Sections A–H are grouped by concept. Build in the dependency order in
"Build order" below, not A→H. Every hard number is either cited (see citations) or explicitly a tunable.
Calibrate as you code (targets in "Definition of done").

## Build order (dependency-sequenced)

1. **D — Hb tracking** (`Hb_mass`, `starting_Hb`, bleed/crystalloid/PRBC updates). Nothing DO₂-related works without it.
2. **B — MAP-coupled bleed** (perfusion_factor, P_floor). Changes `bleed_rate`.
3. **C — Death model (debt)** + **H item 38** (rewrite accrual on DO₂ = flow×Hb; repayment). Depends on D + B; ship together with B.
4. **G — Cardiac arrest**: build the **pulse-pressure sub-model (item 33) FIRST**, then CPP, then the two-stage fuse. Depends on MAP (B).
5. **A — Retained tissue** (tone ceiling, manual removal, phenotype). Largely independent; can slot in parallel.
6. **H — Integration** (items 39–41: reconcile verdicts, plumb phenotypes end-to-end).
7. **F — Scoring** (margin metrics, graded bands, sweep). Do last — it measures everything above.
8. **Calibrate** against the Definition of done. **Then stop — Fix 2 (Section E) is a separate task.**

## Definition of done (verify before handing back)

- **Time-to-death targets (untreated), from C-CAL:** severe atony ~1–2 h · catastrophic (near-zero tone / rupture / big trauma) ~15–45 min · mild ooze many hours. Test each.
- **Permissive-hypotension equilibrium MAP sits ABOVE the coronary arrest floor** (no spurious slow-tail arrests). The single tightest cross-model constraint (B×G).
- **Two death pathways both reachable and correctly labelled:** slow case → "irreversible shock" (debt); torrential → "cardiac arrest" (fuse).
- **Hb behaves:** normal-ish during early bleed; falls with crystalloid; rises with PRBC. Anaemic patient dies sooner than non-anaemic for the same insult.
- **Tissue:** boggy-despite-drugs signature; manual removal lifts ceiling; banked uterotonics then control; accreta/fail → hysterectomy clears it.
- **Scoring (F) produces the margin readout** (peak debt, time-to-source-control, MAP nadir, graded verdict) across a phenotype × human-factor sweep — not just survive/die.
- **Sanity replay:** the original failing trace (constant 350 bleed, death at t8) should no longer occur — bleed tapers with MAP, death is debt/fuse-driven.

> **CORE PIVOT (read first).** Success is **not** life-vs-death. Real PPH survival with good care is
> very high, so a realistic SERA will have most patients survive. SERA's job is to measure **how fast
> the bleeding is brought under control** and **the worst physiological state the patient reaches** —
> i.e. the *margin*, not the body count. Deaths still occur, but only in the hard corners (bad
> phenotype × bad human factors × protocol mistakes). This pivot is why Section F (Scoring) exists and
> why the death model (Section C) is deliberately slow/cumulative rather than an instant MAP cliff.

---

## How the models fit together (read before the per-section detail)

The bleed is the single driver; everything else reads off it.

1. **PPH model → MAP.** Blood loss → deficit → MAP (now MAP-coupled, Section B). Bleeding also slows as MAP
   falls (pressure-passive uterus → permissive hypotension / auto-tamponade).
2. **MAP → two parallel death clocks:**
   - **Whole-body oxygen debt** (Section C) reads MAP via `DO₂ = flow(MAP) × Hb`. Slow (hours).
   - **Cardiac fuse** (Section G) reads MAP via `DBP = MAP − PP/3 → CPP`. Fast (minutes).
3. **They race — first to lethal ends the run**, tagged "cardiac arrest" (fuse) or "irreversible shock" (debt).
   Each owns a regime: slow atony → debt death; torrential/decompensated → arrest.
4. **Treatment reverses both via the same levers.** Stop bleed / transfuse → MAP↑ and Hb↑ → debt drains AND
   fuse cools. Crystalloid-only → props MAP (helps fuse) but dilutes Hb (doesn't help debt) — the split lands
   differently in each engine.
5. **The one tight coupling / calibration checkpoint:** the permissive-hypotension equilibrium MAP (Section B)
   MUST sit above the coronary arrest floor (Section G), or slow-debt patients spuriously arrest in the tail.

---

## A. Retained Tissue — the missing "Tissue" T  (DECIDED)

1. **New phenotype `tissue_severity`** (0–1) on PatientV4. Default `0.0`. Active from t0 (no onset delay), same as `trauma_severity`.
2. **Tone ceiling mechanism:** `tissue_ceiling = 1 - tissue_severity`.
   - `effective_tone = min(sustained_tone + fundal_pulse, tissue_ceiling)`.
   - Apply the `min()` **ONLY at bleed-calc read time** (inside `source_bleed_rate`). **Do NOT** clamp `sustained_tone` when a drug lands — uterotonics must keep banking freely up to 0.97, or the "drugs already given pay off after removal" behaviour breaks.
3. **`give_manual_removal(now_min)`** → schedules effect at `now + manual_removal_duration_min`. On effect: `tissue_severity → 0` (ceiling lifts).
4. **New knob `manual_removal_duration_min`** (default ~4). Dedicated + independent of severity/human-factors. Surface in UI presets (e.g. Quick bedside ~3 / Standard ~5 / Difficult ERPC ~8).
5. **Delay-to-START manual removal = human factor.** Currently `manual_removal` is in `_HANDS_ON` (~30s) — too fast; it usually needs anaesthesia/theatre. Give it its own logistics timer (like `theatre_mobilisation_min`) OR a slower bucket.
6. **app_operator.py wiring** (mirror trauma/suture):
   - `assess/tissue_assess` → answer "present" → force `manual_removal`.
   - `task/manual_removal` → `p.give_manual_removal(t_min)`.
7. **patient_profile.py:** add `manual_removal` to the treatment-response matrix (Works/Fails). Fail = accreta / no cleavage plane → ceiling stays.
8. **Hysterectomy (definitive) must ALSO set `tissue_severity → 0` AND `trauma_severity → 0`** — not just its tone target. Otherwise the ceiling stays and she keeps bleeding after hysterectomy.
9. **Balloon/sutures must NOT clear `tissue_severity`.** They act through the tone term, so the ceiling auto-gates them via the same `min()` — no special-casing, just don't touch severity.
10. **UI:** add `tissue_severity` input; add `manual_removal` Works/Fails radio (visible only when `tissue_severity > 0`); add `manual_removal_duration_min` preset.
11. Arrest during removal window, or accreta arresting before hysterectomy, = valid outcomes (not bugs).

---

## B. Fix 1 — MAP-coupled bleeding  (DECIDED)

12. **Perfusion factor** (uterine bed is pressure-passive → linear):
    `perfusion_factor = clamp((MAP - P_floor) / (NORMAL_MAP - P_floor), 0, 1)`
    `bleed_rate = source_bleed × coag_multiplier × perfusion_factor`
13. **`P_floor` ≈ 10–15 mmHg** (self-tamponade floor — bleed → 0 as MAP approaches venous/intracavitary pressure).
14. Consequence to honour: this creates a stabilizing feedback loop (permissive hypotension). Over-resuscitation re-bleeding falls out for free. **Must ship together with the new death model (Section C).**

---

## C. New Death Model  (DECIDED)

15. **Death has TWO parallel pathways — whichever fires first wins:** (a) slow whole-body **oxygen debt**
    (this section) and (b) fast **cardiac arrest / coronary fuse** (Section G). Retire the old instantaneous
    `arrested = MAP ≤ 35` — it's replaced by the coronary-fuse pathway in G, not by debt alone. Debt death =
    `oxygen_debt ≥ LETHAL_DEBT` (slow, hours). Cardiac arrest = coronary supply below the arrest floor (fast, minutes).
16. **`LETHAL_DEBT` = LD50 113.5 mL/kg** (Dunham/Siegel 1991, PMID 1989759; already in code as `LD50_DEBT_ML_KG`). Literature band ~95–113 (dog vs pig) → later a per-patient resilience knob could pick within it.
17. **Replace the `0.70` MAP floor with `DO₂crit ≈ 4 mL/kg/min`** (critical oxygen delivery; max extraction ratio ~0.6–0.7). Debt accrues when DO₂ < DO₂crit.
18. **Bring Hb into delivery:** `DO₂ = 12 × (MAP/90) × (Hb/110)`; `CaO₂ = 1.34 × Hb`. (Depends on Section D.)
19. **Debt repayment (fill fast / drain slow).** Debt rises when DO₂ < the line; **falls** when DO₂ is above it. Drain is **slower than fill** — anchor: a full debt clears over **~2 hours** at full recovery (≈ 1 unit/min), and the drain is bounded by the *surplus* oxygen (barely-above-the-line → barely drains; lots of blood → drains faster). This is the recovery arc.
20. **Point of no return = EMERGENT, not a threshold.** Literature gives **no** citable "PONR = X mL/kg" number — irreversibility is depth × duration (golden-hour / 2-h repayment data). So do **NOT** invent a `PONR_DEBT`. The point of no return falls out of fill-fast/drain-slow: dig the debt too deep and the slow drain can't empty it before it crosses 113, so she can die *after* correct treatment starts. Optional sharpening: make drain slow further as debt deepens (accumulating tissue damage). The one honestly-tunable knob is the **repayment rate**, not a threshold.

### C-CAL. Calibration targets for time-to-death (must be TESTED, not assumed)
Real data: only ~11% of PPH deaths <6 h; 67% at 6–24 h; ~79% on day 1 — i.e. **hours, not minutes**, and that's *with* treatment (untreated somewhat faster). The MAP-coupled bleed auto-tamponades into a low-MAP equilibrium whose tail can drag death too long if under-tuned. Calibrate & verify against:
- **Typical severe atony, untreated → ~1–2 h to death.**
- **Catastrophic (near-zero tone, uterine rupture, big accreta/trauma) → ~15–45 min.** Model must still allow this fast end via high source-bleed.
- **Mild ongoing ooze → many hours** (correctly slow).
Watch the `P_floor` and fill-rate knobs — they set whether the equilibrium tail is realistic.

---

## D. Haemoglobin tracking  (DECIDED)

21. **New phenotype `starting_Hb`** (default ~110 g/L, pregnancy). Adjustable per scenario.
22. **New tracked internal state: running Hb.** `Hb = Hb_mass / blood_volume`. Track `Hb_mass` (grams); computed, never set directly.
23. **Update `Hb_mass` per event:**
    - Bleed → removes Hb at current concentration (so concentration ~unchanged early — the "normal Hb in acute bleed" trap).
    - Crystalloid / FFP → add volume, no Hb → dilution (Hb falls).
    - PRBC → adds Hb (~200 g/L, i.e. ~+10 g/L per unit).
24. Feed `Hb/110` into DO₂ (Section C, item 18).

---

## E. Fix 2 — Parallel team actions  (DEFERRED — separate thread)

25. Team currently acts strictly serially (one `pending` at a time) → unrealistic single-file resus. Need concurrency lanes / multiple in-flight actions; calls "fire-and-forget"; first-line tone treatment fires immediately in parallel. Lane count per HF preset. **Not yet designed.**

---

## G. Cardiac Arrest — the coronary fuse  (DECIDED design; one soft curve to calibrate)

**Concept.** Cardiac arrest is a SEPARATE event from whole-body debt death (Section C), and physiologically
distinct: it is a *pump-pressure* failure, not cumulative tissue debt. Build it as a MIRROR of the debt
engine but keyed to the heart and on a much faster fuse (the myocardium is the most perfusion-sensitive
organ). Two death pathways run in parallel; **whichever reaches lethal first = death** (label: "cardiac
arrest" vs "irreversible shock"). This is the physiologically-correct choice AND the extensible one — it
gives a real myocardial state a future CPR/adrenaline/ROSC layer can act on.

31. **Driver = coronary perfusion pressure (CPP), not MAP.**
    `CPP = DBP − RAP` (RAP ≈ 10 mmHg). Coronary flow is diastolic, so we need DBP (see item 33).
    Refine with heart rate: `coronary_supply = CPP × DTF(HR)` where DTF = diastolic time fraction
    (~0.65 at rest → ~0.4 at HR 150+). Her terminal tachycardia (HR→180, already modelled) crushes DTF
    and accelerates arrest — honest and free once DTF is in.
32. **Literature-anchored lines (RAP 10):**
    - Normal CPP 60–80 (DBP ~70–90).
    - **Ischaemia begins CPP < ~50 (DBP ~60)** → fuse starts accruing injury.
    - **Arrest floor CPP ~15–20 (DBP ~25–30)** → cardiac output fails (pseudo-PEA: heart beating, no pulse).
33. **NEW sub-model needed: pulse pressure (to get DBP).** Model currently has only MAP.
    `PP narrows ∝ stroke volume`, which falls with the same effective deficit that drives MAP.
    `DBP = MAP − PP/3`. Anchors (ATLS / trauma literature): **PP ≈ 40 normal → ~30 at ~30% loss → ~15 terminal.**
    (PP<40 = Class II 15–30% loss; PP<30 = massive-transfusion predictor.) This is a prerequisite for the
    whole pathway — build it first.
34. **Two-stage fuse:**
    - **Stage 1 — output fails (functional arrest):** when `coronary_supply` crosses the arrest floor,
      cardiac output → ~0 (pseudo-PEA). This is "she arrested."
    - **Stage 2 — irreversibility:** myocardial death accrues over the **~6–8 min reversible window**
      after output fails. Within it, restoring coronary perfusion (future CPR/blood/adrenaline) → ROSC.
      Past it → locked in. Emergent point of no return, same pattern as the debt model.
35. **Reversible** (confirmed): the fuse recovers if coronary perfusion is restored in time — required so a
    future resuscitation layer has a real state to act on.
36. **Behaviour it must produce** (validated on a worked trajectory): coronary perfusion stays safe through
    compensated AND moderate shock, collapsing to the arrest floor ONLY in terminal decompensation — so
    arrest is the LAST event, never trigger-happy. Fast torrential bleed → MAP crashes → arrest in minutes.
    Slow atony → MAP defended above the floor → dies of whole-body debt over hours instead.
37. **Calibration constraints for the builder:**
    - Permissive-hypotension equilibrium MAP MUST sit above the coronary arrest floor, or spurious arrests.
    - **The one soft number:** the *graded* fuse speed BETWEEN the ischaemia line (CPP ~50) and the arrest
      floor (CPP ~15–20). Endpoints are anchored (tolerable ~15–20 min near the line; output fails at the
      floor with a ~6–8 min reversible window); the curve between is a tunable, like the debt-drain rate.

### Cardiac-arrest citations
- CPP thresholds (normal 60–80; ROSC ≥15–20; arrest floor) — StatPearls Coronary Perfusion Pressure (NBK551531).
- Diastolic time fraction / tachycardia reduces coronary perfusion — Circulation 1999 (01.cir.100.1.75).
- Pulse pressure ∝ stroke volume, narrows early (PP<40 Class II, PP<30 massive transfusion) — trauma/ATLS lit (PubMed 16966999; ScienceDirect S0002961019304404).
- Reversible arrest window ~6–8 min; occlusion→VF ~20 min — ECPR rat model (PMC10655001).

---

## F. Scoring & how to run SERA  (DECIDED — new measurement layer, NOT physiology)

This is what turns the realistic physiology into an actionable signal. Without it the death model is
invisible (you'd just see "survived" and learn nothing). Implements the Core Pivot above.

26. **Record margin metrics every run** (not just survive/die):
    - Peak oxygen debt (how close to the 113 line) — the headline margin number.
    - **Time to source control** — when the bleed actually stopped (durable_bleed < CONTROLLED_BLEED). The key outcome.
    - MAP nadir, peak EBL, total PRBC/FFP/crystalloid used, Hb nadir.
    - Minutes spent in shock (DO₂ below the line); whether debt entered the irreversible tail.
27. **Redesign the verdict from binary → graded bands**, e.g.:
    - *Controlled comfortably* — bleed stopped fast, low peak debt, big margin.
    - *Near miss* — survived but peak debt got dangerously high / long time in shock.
    - *Died* — plus cause tag (source-control too slow · dilution/wrong resuscitation · crossed PONR tail).
28. **Run as a SWEEP, not single cases:** phenotype (easy atony → refractory → accreta → retained tissue → trauma → coagulopathy) × human-factor preset (competent → busy → stretched → chaotic).
29. **Summarise as an outcome MAP across the grid:** where's the safe zone, where do near-misses/deaths cluster. That map is the actual deliverable — it shows which real situations the SOS protocol handles and where a protocol change widened or narrowed the safe zone.
30. **Interpretation rule:** a protocol change that keeps everyone alive but pushes peak debt up (e.g. 40 → 95) is a RED FLAG. Judge by margin shift, not survival count.

---

## H. Integration & reconciliation  (DECIDED — wiring the new physiology into the existing code)

38. **Rewrite the debt ACCRUAL RATE to match the new trigger (Section C).** The trigger changed from
    `perfusion_adequacy < 0.70` (MAP-only) to `DO₂ < DO₂crit` (delivery, Hb-inclusive) — but the *rate*
    must change too. Define fill as the **unmet oxygen demand**:
    `VO2_delivered = min(VO2_demand, DO₂ × max_extraction_ratio)` (max ER ≈ 0.6–0.7);
    `if VO2_delivered < VO2_demand: oxygen_debt += (VO2_demand − VO2_delivered) × dt`.
    Drain (repayment) uses the surplus above demand, slower (Section C item 19). Retire the old
    `0.70 × VO2 × shortfall` form entirely — trigger and rate must be on the same variable (DO₂).
39. **Reconcile the terminal verdicts in `app_operator.py` `_terminal_verdict()`.** The old set
    (`ARREST` = MAP≤35, `EXSANGUINATING`, `CONTROLLED`) predates the new model. New mapping:
    - `ARREST` → now driven by the **coronary fuse** (Section G), not MAP≤35.
    - death → the **debt** pathway (Section C) → tag "irreversible shock".
    - `CONTROLLED` → becomes the graded Section F bands (controlled-comfortably / near-miss).
    - **`EXSANGUINATING` micro-choice (RECOMMENDATION, builder may override):** keep it, but demote it from
      a death to a **Section F warning tag** ("held by transfusion alone — source uncontrolled"), since
      actual death now comes only from debt or the fuse. It flags the "1 blood volume in, still bleeding"
      state without pre-empting the two real death clocks.
40. **Plumb the new phenotype inputs end-to-end.** Four new inputs must thread through
    `scenario_from_profile()` (patient_profile.py) AND the UI, not just PatientV4:
    `tissue_severity`, `manual_removal_duration_min`, `starting_Hb` (plus the tissue Works/Fails phenotype
    from Section A item 7). Don't forget the UI side.
41. **New PatientV4 internal state introduced across A–G** (checklist for the builder, so nothing is missed):
    `tissue_severity` + ceiling; `Hb_mass` (+ `starting_Hb`); debt repayment (drain); pulse pressure / DBP;
    coronary fuse (injury accumulator + reversible window). MAP and `bleed_rate` properties both change
    (MAP-coupled bleed; Hb-inclusive DO₂; fuse read from DBP).

---

### Key citations
- Oxygen debt LD50 113.5 mL/kg, lactate 12.9, BE −18.8 — Dunham/Siegel, Crit Care Med 1991, PMID 1989759.
- Blood-failure framing (modern) — Bjerkvig 2016 Transfusion (trf.13500); PMC5488798 (2017); PMC11009713 (2024).
- DO₂crit ~4 mL/kg/min, max O₂ER ~0.6–0.7 — BJA Education oxygen transport; LITFL O₂ER.
- DO₂ = CO × CaO₂, CaO₂ = 1.34 × Hb — CEACCP oxygen delivery.
- Uteroplacental bed pressure-passive (linear flow vs MAP) — Deranged Physiology; OpenAnesthesia.
- Time-to-death in PPH (~11% <6 h, 67% 6–24 h; hours not minutes) — IJRCOG maternal-death series; CDC pregnancy-related hemorrhage deaths; JBI timing-of-maternal-mortality review.
- No citable numeric point-of-no-return; irreversibility is time-dependent (golden hour; 2-h repayment window) — Bjerkvig 2016; golden-hour animal studies (90 vs 180 min tolerance).
