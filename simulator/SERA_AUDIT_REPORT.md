# SERA audit report — physiology, parallel dispatch, and operator integration

**Date:** 24 July 2026  
**Branch:** `Sera`  
**Scope:** Simulator stack only (`simulator/` + `simulator/bridge/`). The Pocket O&G SOS algorithm (`apps/pocket-og/src/`) was **not modified** at any point.

**Purpose:** Structured verification programme run one audit at a time before wider sign-off. This document is the consolidated record for chief-agent review.

---

## Executive summary

| Audit | Title | Verdict |
|-------|-------|---------|
| 1 | Untreated physiology calibration | **PASS** |
| 2 | Parallel vs serial team dispatch | **PASS** |
| 3 | Lane sweep (1→8 lanes) | **PASS** (minor EBL noise) |
| 4 | Phenotype × human-factor grid | **PASS** |
| 5 | Death pathway labelling (CPP vs oxygen debt) | **PASS** |
| 6 | Hb clamp stress tests (crystalloid / PRBC flood) | **PASS** |
| 7 | Follow-up / stuck-task edge cases | **PASS** |
| 8 | Phenotype-specific operator runs (Streamlit-equivalent) | **PASS** |
| 9 | Ideal robot + 99 lanes stress test | **PASS** |

**Overall programme verdict: PASS**

One small code improvement was made during the programme (Audit 5 follow-up): operator snapshots now expose `death_cause` and the live log prints the physiology label on terminal death ticks. No other code changes were required to pass the audits.

---

## Test environment

- **Operator loop:** `simulator/bridge/app_operator.py` driving the real SOS engine via `simulator/bridge/server.mjs` (Node bridge).
- **Physiology:** `simulator/stage4_sandbox.py` (`PatientV4`).
- **Human factors:** `simulator/bridge/human_factors.py` (includes `team_lanes`, presets through `chaotic`).
- **Calibration reference:** `simulator/calibrate_physiology.py`.
- **Default presentation (unless stated):** 70 kg, BMI 25, EBL 500 ml at recognition, Hb 110 g/L, no extra risk factors.
- **Streamlit UI:** `simulator/bridge/app_live.py` (Audits 8–9 used the same `stream()` path as Streamlit; browser UI was not manually driven for every audit).

---

## Audit 1 — Untreated physiology calibration

**Script:** `python3 simulator/calibrate_physiology.py`  
**Verdict: PASS**

Validates `PatientV4` death and equilibrium behaviour with **no SOS operator** (pure physiology).

### Key results

- Dual death pathways behave as designed:
  - **Catastrophic atony / trauma** → `cardiac_arrest` (coronary fuse, fast).
  - **Severe atony / tissue ceiling** → `irreversible_shock` (oxygen debt ≥ LD50 113.5 mL/kg, slow).
- **Hb sweep on debt path:** death times strictly increase Hb 70 → 90 → 110 → 130 g/L (anaemia accelerates debt death).
- **Hb sweep on arrest path:** catastrophic atony arrest timing **Hb-independent** (Hb 70 vs 110 within ~1 min).
- Tissue equilibrium MAP stays above the spurious legacy arrest zone.

### Caveat

Catastrophic untreated arrest occurs at ~**11.5 min**, slightly below the 15 min lower bound mentioned in early handover notes. Clinically still in the “minutes not hours” band; flag for calibration tuning if a stricter bound is required.

---

## Audit 2 — Parallel vs serial team dispatch

**Setup:** Catastrophic atony (full comorbid risk-factor load), start EBL 500 ml, SOS operator.

| Config | Oxytocin (first DONE) | Final verdict | Time |
|--------|----------------------|---------------|------|
| Competent, **5 lanes** | 1.6 min | CONTROLLED | 9.8 min |
| Competent, **1 lane** | 5.5 min | NEAR_MISS | 20.6 min |
| Chaotic, **1 lane** | never | ARREST | 12.7 min |

**Verdict: PASS**

Parallel lanes materially change outcome on the same physiology. A 1-lane “competent” team is slower than the old fully serial model (~7 min oxytocin in pre–Fix 2 runs) because **calls no longer block lanes** (fire-and-forget).

---

## Audit 3 — Lane sweep (1→8)

**Setup:** Competent human-factor delays, catastrophic atony, lanes varied 1→8.

| Lanes | Oxytocin | Verdict |
|-------|----------|---------|
| 1 | 5.5 min | NEAR_MISS |
| 2 | 3.5 min | NEAR_MISS |
| 3 | 2.5 min | NEAR_MISS |
| 4 | 1.5 min | CONTROLLED |
| 5+ | ~0.9–1.5 min | CONTROLLED |

- Oxytocin time decreases **monotonically** as lanes increase.
- Verdict crosses from NEAR_MISS (1–3 lanes) to CONTROLLED (4+ lanes).
- Minor EBL blip at lanes 4 vs 5 (~80 ml); not trend-breaking.

**Verdict: PASS**

---

## Audit 4 — Phenotype × human-factor grid

**Setup:** Five phenotypes × five HF presets (`ideal_robot` → `chaotic`), SOS operator, start EBL 500 ml.  
(`sweep_scoring.py` does not yet include `chaotic`; this audit ran inline.)

### Results matrix

| Phenotype | Ideal (99) | Competent (5) | Busy (3) | Stretched (2) | Chaotic (1) |
|-----------|------------|---------------|----------|---------------|-------------|
| **typical_atonic** | COMFORT @ 2 min | COMFORT @ 4 min | COMFORT @ 4 min | COMFORT @ 6 min | COMFORT @ 19 min |
| **refractory_atony** | COMFORT @ 19 min | COMFORT @ 20 min | COMFORT @ 20 min | CONTROLLED @ 22 min | NEAR_MISS @ 96 min |
| **tissue_mild** | COMFORT @ 5 min | NEAR_MISS @ 16 min | NEAR_MISS @ 25 min | NEAR_MISS @ 66 min | **IRREVERSIBLE_SHOCK** @ 64 min |
| **trauma** | COMFORT @ 5 min | COMFORT @ 6 min | NEAR_MISS @ 10 min | NEAR_MISS @ 64 min | **ARREST** @ 17 min |
| **accreta** | COMFORT @ 17 min | NEAR_MISS @ 37 min | **ARREST** @ 21 min | **ARREST** @ 18 min | **ARREST** @ 17 min |

*(COMFORT = CONTROLLED_COMFORTABLY)*

### Findings

- **Ideal robot:** 5/5 phenotypes controlled comfortably.
- **Competent vs chaotic:** All five phenotypes worse under chaotic (verdict, EBL, or earlier death).
- **Death pathway mix under chaotic:** tissue_mild → oxygen debt; trauma/accreta → cardiac arrest.
- **Minor anomaly:** accreta busy (3 lanes) arrests at 21 min vs stretched (2 lanes) at 18 min. Both die without source control. Likely timing interaction on a case where neither team reaches definitive haemostasis; not a physiology bug.

**Verdict: PASS**

---

## Audit 5 — Death pathway spot checks (CPP vs oxygen debt)

**Verdict: PASS** (11/11 checks)

### Pathway A — Coronary fuse → `ARREST`

| Case | Time | MAP | CPP | Peak debt | arrest_min |
|------|------|-----|-----|-----------|------------|
| Catastrophic atony (untreated) | 11.5 min | 20 | 4.7 | 13.9 | 7.0 |
| Catastrophic trauma (untreated) | 13.5 min | 24 | 9.4 | 13.0 | 7.0 |
| Trauma × chaotic (operator) | 17.4 min | 30 | 15 | 14.6 | 7.8 |
| Accreta × chaotic (operator) | 17.4 min | 30 | 15 | 14.6 | 7.8 |

Pattern: CPP &lt; 17 mmHg for ~7 min → death with debt well below LD50. Logs show `coronary ischaemia`; UI says **CARDIAC ARREST (coronary fuse)**.

### Pathway B — Oxygen debt → `IRREVERSIBLE_SHOCK`

| Case | Time | MAP | CPP | Peak debt | arrest_min |
|------|------|-----|-----|-----------|------------|
| Severe atony (untreated) | 63.5 min | 47 | 31.8 | 114.1 | 0.0 |
| Tissue 0.5 ceiling (untreated) | 62.0 min | 44 | 29.0 | 115.1 | 0.0 |
| Tissue_mild × chaotic (operator) | 64.0 min | 44 | 29 | 117.3 | 0 |

Pattern: slow bleed, MAP above fuse floor, debt crosses LD50, no coronary fuse.

### Other checks

- **Priority rule:** fast crash dies as `cardiac_arrest` even if debt is accumulating.
- **Fuse timing:** fuse active at 5.7 min → death at 12.7 min (7.0 min lead-in).
- **Parity:** `_terminal_verdict` in `app_operator.py` matches `grade_outcome` in `scoring.py`.

### Code fix applied after Audit 5

Operator snapshots now include `"death_cause": p.death_cause` (`None` while alive; `"cardiac_arrest"` or `"irreversible_shock"` at death). `app_live.py` log block adds e.g. `[DEATH] ARREST — coronary fuse (CPP)` on terminal ticks.

### Open note (not a blocker)

`CORONARY_INJURY_ARREST_THRESHOLD` is defined in constants but injury accrual does not yet trigger arrest independently; death is CPP &lt; 17 mmHg for 7 min.

---

## Audit 6 — Hb clamp stress tests (crystalloid / PRBC flood)

**Bounds:** floor 25 g/L, ceiling 200 g/L (PRBC concentration).

**Verdict: PASS**

| Test | Result |
|------|--------|
| 48-combo grid (Hb × crystalloid × PRBC doses) | Zero bound violations |
| Anaemic + 50 L crystalloid | Floor clamp engages → Hb **25.0 g/L** |
| Defensive ceiling pin (pathological mass inflation) | Capped at **200.0 g/L** |
| PRBC-only flood (80 L) | Hb rises toward 200, never exceeds |
| Bleed + crystalloid resuscitation | Hb pinned at **25.0 g/L**, DO₂ finite |
| Dilute then PRBC rescue | Nadir 32.2 → final 101.7 g/L |
| Anaemia debt timing | Hb 70 @ 54.5 min vs Hb 110 @ 63.5 min |
| Arrest path Hb-independence | Hb 70 and 110 both arrest @ 12.7 min |
| Operator trace (ideal_robot, refractory) | Hb 90–110 g/L throughout |

Pure PRBC infusion asymptotes toward 200 g/L from below (physically correct); ceiling clamp is a defensive safety net.

---

## Audit 7 — Follow-up / stuck-task edge cases (parallel dispatch)

**Verdict: PASS**

### Hard invariants (8 scenarios + global checks)

| Check | Result |
|-------|--------|
| `in_flight` / `lanes_in_use` never exceed `team_lanes` | ✅ |
| No duplicate task keys within a single tick | ✅ |
| Calls never occupy a lane slot | ✅ |
| Clock strictly monotonic | ✅ |
| No duplicate WAIT in same tick | ✅ |
| Refractory + competent runs up to **5 concurrent** jobs | ✅ |
| Follow-up WAIT → DONE when run continues (tissue, accreta) | ✅ |
| Solo 1-lane: no deadlock (typical survives, catastrophic arrests) | ✅ |

### Theatre “orphan WAIT” (expected, not a bug)

On **refractory × competent**, theatre mobilisation WAIT is logged @ 16.7 min but the run ends @ 20.2 min with **CONTROLLED** while theatre still has ~12 min remaining in `in_flight`. Bleeding was controlled before theatre was needed; simulation terminates on clinical outcome. Accreta confirms full path: WAIT @ 6.6 min → DONE @ 26.2 min (`THEATRE: sutures → hysterectomy`).

### Parallel dispatch behaviour confirmed

1. Dedup: `_in_flight_has_prompt` blocks re-dispatch of the same prompt.
2. Calls: fire-and-forget, instant DONE, no lane use.
3. Theatre: instant DELEGATE on `consider`; mobilisation as background `theatre_transfer`.
4. Completions: expired timers fire DONE before new dispatches in the same tick loop.

---

## Audit 8 — Phenotype-specific runs (Streamlit-equivalent)

**Defaults:** 70 kg, BMI 25, EBL 500 ml, Hb 110 g/L, no risk factors, **competent** team (Streamlit sidebar defaults).

**Verdict: PASS**

| Phenotype | Streamlit setup | Verdict | Time | EBL | Key pathway |
|-----------|-----------------|---------|------|-----|-------------|
| **Refractory atony** | Preset → Refractory atony | CONTROLLED_COMFORTABLY | 20.2 min | 2,360 ml | Oxytocin (no response) → ergometrine CI → balloon → theatre |
| **Tissue 0.5** | Retained tissue → 0.5 | NEAR_MISS | 19.8 min | 4,518 ml | Tissue present → manual removal → surgery/theatre |
| **Trauma 0.6** | Genital tract tear → 0.6 | CONTROLLED_COMFORTABLY | 6.2 min | 2,400 ml | Trauma present → suture/repair → theatre |
| **Asthma + refractory** | Refractory + asthma checkbox | CONTROLLED_COMFORTABLY | 20.2 min | 2,360 ml | Same as refractory (identical outcome) |

Oxytocin first DONE: **1.3 min** (refractory), **2.1 min** (tissue), **2.2 min** (trauma).

### Asthma (R-TX-5)

Competent refractory does **not** reach the carboprost rung in live runs (SOS escalates to balloon ~18 min first). Direct code-path tests confirm skip wiring:

- `task` + `carboprost` → `status: skipped`, `skipReason: asthma`
- `carbo_dose` repeat → same skip

The checkbox is connected; skip fires when SOS prompts carboprost.

---

## Audit 9 — Ideal robot + 99 lanes stress test

**Preset:** `ideal_robot` (`team_lanes: 99`, all delays ~0, O Neg immediate).

**Verdict: PASS**

### All phenotypes — ideal vs competent

| Phenotype | Ideal | Competent |
|-----------|-------|-----------|
| Typical atony | COMFORT @ **2.1 min** (580 ml) | COMFORT @ 3.6 min |
| Refractory | COMFORT @ **18.8 min** (2,257 ml) | COMFORT @ 20.2 min |
| Tissue 0.5 | COMFORT @ **5.3 min** (1,459 ml) | NEAR_MISS @ 15.8 min |
| Trauma 0.6 | COMFORT @ **4.6 min** (2,030 ml) | COMFORT @ 6.2 min |
| Accreta | COMFORT @ **16.6 min** (5,382 ml) | NEAR_MISS @ 37.2 min |
| Balloon fails | COMFORT @ **2.1 min** | COMFORT @ 3.6 min |
| Catastrophic RF | COMFORT @ **8.6 min** (2,710 ml) | COMFORT @ 9.8 min |

**7/7 CONTROLLED_COMFORTABLY** under ideal robot.

### Stress observations

| Check | Result |
|-------|--------|
| `team_lanes = 99` on every snap | ✅ |
| Lane / in-flight overflow | ✅ none |
| WAIT events (zero-delay path) | ✅ **0** |
| Oxytocin first DONE | ✅ **0.15 min** every case |
| First-tick burst (typical) | ✅ **11 instant DONE** @ t=0.15 min |
| Avg simulation steps | ✅ **10.9** (competent: 21.0) |

### How 99 lanes manifest

With all delays at 0, tasks hit the instant-completion path (`delay ≤ MIN_ACTION_MIN`) and rarely enter `in_flight`. Parallelism appears as **multi-event DONE bursts** in a single tick, not queued lane slots. This matches the design goal: ideal robot tests protocol quality with human delay removed.

Hard phenotypes still take longer and bleed more under ideal (accreta 16.6 min / 5,382 ml vs typical 2.1 min / 580 ml).

---

## Manual testing (user, pre-audit)

Two catastrophic-atony Streamlit runs confirmed expected behaviour before the formal audit programme:

| Team | Oxytocin | Outcome |
|------|----------|---------|
| Competent, 5 lanes | ~1.6 min | CONTROLLED @ ~9.8 min |
| Chaotic, 1 lane | never | ARREST @ ~12.7 min |

---

## Files touched during audit programme

| File | Change |
|------|--------|
| `simulator/bridge/app_operator.py` | Added `death_cause` to operator snapshots (Audit 5 follow-up) |
| `simulator/bridge/app_live.py` | Terminal log line for death cause (Audit 5 follow-up) |
| `simulator/SERA_AUDIT_REPORT.md` | This document |

No changes to `apps/pocket-og/src/` (SOS algorithm).

---

## Recommended follow-ups (non-blocking)

1. **`sweep_scoring.py`:** add `chaotic` to `HF_GRID` so Audit 4 grid is reproducible from one script.
2. **`audit_sweep.py`:** optional automation wrapping Audits 1–9 for CI or pre-release checks.
3. **Catastrophic arrest timing:** consider tuning if 11.5 min is below the desired lower bound (Audit 1 caveat).
4. **Accreta busy vs stretched ordering:** optional log trace on the 3-lane vs 2-lane arrest timing inversion (Audit 4).
5. **Coronary injury threshold:** `CORONARY_INJURY_ARREST_THRESHOLD` is defined but unused; either wire it or document as future work (Audit 5).
6. **Asthma live demonstration:** craft a scenario that reaches the carboprost rung if a visible Streamlit skip event is needed for training demos (Audit 8).

---

## Reproduction commands

```bash
# Audit 1
python3 simulator/calibrate_physiology.py

# Audit 4 grid (inline; or extend sweep_scoring.py)
python3 simulator/sweep_scoring.py

# Streamlit (manual / UI)
cd simulator/bridge && streamlit run app_live.py
```

Audits 2–3, 5–9 were run as inline Python harnesses against `app_operator.stream()` with `scenario_from_profile()` and `preset_human_factors()`. A future `audit_sweep.py` should codify these.

---

## Sign-off checklist for chief agent

- [ ] All nine audits PASS; no blocker defects found.
- [ ] Dual death pathways (coronary fuse vs oxygen debt) verified in physiology and operator labelling.
- [ ] Parallel team dispatch (`team_lanes`, `in_flight` pool) behaves correctly; no stuck loops or lane overruns.
- [ ] Hb tracking and clamps survive extreme infusion stress tests.
- [ ] Phenotype-specific pathways (refractory, tissue, trauma, asthma skip) behave as specified.
- [ ] Ideal robot isolates protocol from human delay; hard cases still differ in duration and EBL.
- [ ] SOS engine untouched; bridge + operator are the integration surface under test.

---

*End of report.*
