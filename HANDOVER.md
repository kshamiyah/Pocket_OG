# Pocket OG — PPH Algorithm Handover

**Date:** 2026-06-26  
**Branch:** `claude/app-feature-connections-6bjuqc` (local alias: `feature-merge`)  
**Repo:** `kshamiyah/pocket_og`  
**Primary file:** `apps/pocket-og/src/components/EmergencyPage.jsx`

---

## 1. What This Feature Is

A bedside smartphone app for managing Postpartum Haemorrhage (PPH). It presents the clinical team with one prompt at a time driven by a priority queue state machine. The clinician works through the algorithm by tapping Done / Assign / Skip on each prompt. The app tracks blood loss, escalates through three severity levels, and handles timed drug repeats automatically.

It is a React 18 SPA, Tailwind CSS, mobile-first (iPhone 14: 390×844). All logic lives in a single file: `EmergencyPage.jsx`.

---

## 2. Architecture: How the Algorithm Engine Works

Everything pivots on **`computeNextPrompt()`** — a function that evaluates state every second and returns whichever prompt has the highest priority at that moment.

### Priority queue (highest to lowest)

| Priority | Condition | Prompt surfaced |
|----------|-----------|-----------------|
| 1.5 | `fundal_massage` just marked Done AND `toneAssessed = false` | Tone check (firm / boggy) |
| 1 | Assigned critical task overdue by `followUpDelay` seconds | Follow-up prompt |
| 2 | >5min (minor) / 4min (major) / 3min (massive) since last blood loss log | Blood loss check |
| 3 | Bimanual done/skipped AND `fourTsDone = false` | Four T's (Tone/Trauma/Tissue/Thrombin) |
| 4 | Assigned non-critical task overdue | Follow-up prompt |
| 5 | Unstarted critical task with deps met | Task prompt (critical) |
| 6 | `carboCount > 0 AND carboCount < 8 AND 15min since last dose` | Carboprost repeat dose |
| 6.5 | `txaTime` set AND `!txaSecondDone` AND ≥30min AND within 3h window | TXA second dose |
| 7 | Next unstarted task with deps met | Task prompt (regular) |
| — | Nothing else | Monitoring (all complete) |

### Key state variables

| Variable | Type | Purpose |
|----------|------|---------|
| `bloodLoss` | number (ml) | Current total blood loss |
| `level` | "minor" \| "major" \| "massive" | Derived from bloodLoss (minor <1000, major ≥1000, massive ≥2000) |
| `taskStates` | `{ [id]: { status, doneAt/assignedAt/skippedAt } }` | Per-task status |
| `txaHandled` | boolean | Suppresses TXA from queue (set on done/assign/skip) |
| `txaTime` | timestamp \| null | When TXA was given — drives DrugStrip countdown |
| `txaSecondDone` | boolean | Suppresses second TXA dose prompt |
| `toneAssessed` | boolean | Whether tone check fired after fundal massage |
| `fourTsDone` | boolean | Whether Four T's has been documented |
| `carboCount` | number | Number of carboprost doses given (0–8) |
| `carboLastTime` | timestamp \| null | When last carboprost dose given — drives 15min repeat |
| `birthTime` | timestamp \| null | From setup screen — drives TXA 3h window |
| `effectiveBirthTime` | birthTime ?? emergencyStartTime | Used for TXA window |
| `phase` | "setup" \| "active" \| "summary" | App phase |

### Task dependency system

Tasks have optional `deps: [id, ...]`. A task is locked until all deps are `"done"` or `"skipped"`. Currently used for:
- `bimanual` depends on `fundal_massage`
- `iv_fluids`, `oxytocin_bolus`, `ergometrine`, `oxytocin_inf`, `coag_review` depend on `iv_access`
- `blood_products`, `rapid_cryst`, `txa` depend on `iv_access`
- `mhp_pack`, `txa_massive` depend on `iv_access`

---

## 3. What Has Been Implemented (Completed)

### Fix #10 — localStorage session persistence ✅
- `saveSession()` / `clearSession()` helpers
- Session auto-saves on every state change while `phase === "active"`
- On next app open: recovery banner shows with level, blood loss, event count
- "Resume session" restores all state; "Discard" clears storage and starts fresh
- `emergencyStartTime` is persisted so elapsed time is correct on recovery

### Fix #12 — Bimanual split into two steps ✅
- `fundal_massage` (step 4) → immediately fires Priority 1.5 tone check
- Tone check: "Firm ✓" → auto-skips bimanual, sets `toneAssessed = true`
- Tone check: "Still boggy" → bimanual surfaces next
- `bimanual` (step 5) has `deps: ["fundal_massage"]` so it only unlocks after massage

---

## 4. The TASKS Array (Current Algorithm)

The full sequence as coded in `TASKS[]`:

### Minor PPH (<1,000 ml)
1. `abc` — ABC / O₂ 15L/min / shock assessment
2. `call_team` — Call for help (midwife in charge, on-call obs) [followUp: 120s]
3. `iv_access` — IV access + bloods (2×14–16G, FBC/coag/G&S) [followUp: 90s]
4. `fundal_massage` — Fundal massage → triggers tone check (P1.5)
5. `bimanual` — Bimanual uterine compression [deps: fundal_massage] → triggers Four T's (P3)
6. `catheterise` — Catheterise (>30 ml/hr)
7. `keep_warm` — Keep patient warm
8. `iv_fluids` — IV fluids ≤1L Hartmann's [deps: iv_access]
9. `oxytocin_bolus` — Oxytocin 5 IU IV [followUp: 300s, deps: iv_access]
10. `ergometrine` — Ergometrine 500mcg [followUp: 300s, deps: iv_access]
11. `oxytocin_inf` — Oxytocin infusion 40 IU in 500ml [followUp: 60s, deps: iv_access]
12. `inspect_canal` — Inspect birth canal [followUp: 120s]
13. `check_placenta` — Check placenta complete [followUp: 120s]
14. `coag_review` — Review coagulation results [deps: iv_access]

### Major PPH (≥1,000 ml)
15. `call_major` — Escalate major PPH [critical, followUp: 120s]
16. `second_cannula` — 2nd large bore cannula [critical, followUp: 90s]
17. `rapid_cryst` — Rapid crystalloid ≤1L [deps: iv_access]
18. `blood_products` — Blood products (FFP/cryo/platelets) [deps: iv_access]
19. `carboprost` — Carboprost 0.25mg IM [special: "carbo"]
20. `misoprostol` — Misoprostol 800mcg SL [followUp: 60s]
21. `txa` — TXA 1g IV [critical, special: "txa", deps: iv_access]

### Massive PPH (≥2,000 ml)
22. `call_massive` — Activate massive PPH [critical, followUp: 120s]
23. `mhp_pack` — MHP pack immediately [critical, followUp: 120s, deps: iv_access]
24. `txa_massive` — TXA if not yet given [critical, special: "txa", deps: iv_access]
25. `rotem_teg` — ROTEM / TEG coagulation
26. `cell_salvage` — Cell salvage
27. `bakri` — Bakri balloon tamponade
28. `theatre` — Transfer to theatre
29. `cardiac_arrest_ref` — If cardiac arrest — call 2222

---

## 5. What Still Needs Doing

### Approach going forward (user-confirmed)
Walk through the algorithm **one step at a time** with the user. They confirm each step is clinically correct or incorrect. Where something is wrong, fix it before moving to the next step. Do not batch fixes.

### Known issues from expert panel review (8 clinical agents)

The following issues were identified and graded. They have NOT been implemented yet — they need walking through with the user first.

#### CRITICAL (patient safety — confirm and fix before going live)

| ID | Issue | Fix needed |
|----|-------|------------|
| C1 | TXA at step 21 — too late per WOMAN trial | Move before carboprost/misoprostol |
| C2 | Misoprostol fallback dose in minor PPH was 600mcg — **this has since been corrected to 800mcg in the task detail** but needs verification | Check current detail text |
| C3 | Calcium gluconate absent from major PPH | Add `calcium` task after `blood_products` |
| C4 | Carboprost CIs: only asthma listed; missing cardiac, hepatic, renal disease | Update `carboprost` task detail |
| C5 | No PMCS (perimortem caesarean) in cardiac arrest | Update `cardiac_arrest_ref` detail |
| C6 | No manual left uterine displacement (MLUD) in cardiac arrest | Update `cardiac_arrest_ref` detail |

#### HIGH PRIORITY

| ID | Issue | Fix needed |
|----|-------|------------|
| H1 | Ergometrine CIs: cardiac disease missing; "vascular disease" should be "obliterative vascular disease" | Update `ergometrine` task detail |
| H2 | No haemodynamic monitoring targets anywhere | Consider monitoring task or detail updates |
| H3 | Four T's fires after bimanual — should guide from outset | Clinical discussion: can it fire concurrently? |
| H4 | Inspect canal + check placenta too late (steps 12–13) | Reorder to earlier in minor sequence |
| H5 | Vasopressors absent | Consider a reference task at major level |
| H6 | Misoprostol at step 20 (major) with no warning it may have already been given at minor | Logic: suppress if already done |
| H7 | Magnesium toxicity not in cardiac arrest 4Ts | Update `cardiac_arrest_ref` detail |

#### MEDIUM PRIORITY

| ID | Issue |
|----|-------|
| M1 | FFP trigger should be empirical in massive, lab-based only in major |
| M2 | Fibrinogen not named as the primary coagulation target |
| M3 | Bakri balloon framing: should be a tamponade TEST decision point, not a step before theatre |
| M4 | ROTEM/TEG should start at major, not massive |
| M5 | Minor PPH lower bound: algorithm fires at any blood loss; GTG52 starts at 500ml |
| M6 | Platelet threshold <100 for ongoing bleeding absent |
| M7 | Aortic compression absent (GTG52 §8.3) |
| M8 | rFVIIa absent from massive PPH |
| M9 | No permissive hypotension target (SBP 80–90 pre-source control) |
| M10 | Postnatal care pathway absent from summary screen |

#### QUICK WORDING FIXES (no logic change)
- TXA second dose: "at 30min if continuing" → "if bleeding continues or restarts"
- MHP "1:1 RBC:FFP" → "6u RBC + 4u FFP ± platelets ± cryo (per local MHP pack)"
- Oxytocin 10 IU IM fallback conflates third-stage prophylaxis with PPH treatment

### Fix #13 — Can't do / fallback system (not yet implemented)
The user approved a **Skip → sub-choice** design:
- Current: Skip sends task to "skipped"
- Planned: Skip opens sub-prompt with two options:
  - **Not relevant** → skipped silently
  - **Can't do** → surfaces a fallback task (next-best alternative)
- Fallback tasks needed for: IV access failure (→ IM alternatives), ergometrine CI (→ misoprostol 800mcg), carboprost CI (→ misoprostol 800mcg), no IV for TXA (→ prioritise IV access)
- This is a significant code change touching `TaskPrompt`, `computeNextPrompt`, and `TASKS`

---

## 6. Files of Interest

| File | Purpose |
|------|---------|
| `apps/pocket-og/src/components/EmergencyPage.jsx` | Entire PPH algorithm — all logic, state, and UI |
| `apps/pocket-og/src/data/emergency/pph.js` | Legacy static PPH data (used by old non-interactive view) |
| `apps/pocket-og/src/data/GTG52_FLOWCHART.js` | GTG52 flowchart data for the reader view |
| `apps/pocket-og/src/data/rx/uterotonics.js` | Drug reference data (carboprost, ergometrine, misoprostol, oxytocin, TXA) |

---

## 7. Git State

- All implemented fixes are committed and pushed to `claude/app-feature-connections-6bjuqc`
- No PR created yet (user has not requested one)
- Local branch `feature-merge` tracks the above remote branch

---

## 8. How to Proceed

**Session approach:** Walk through the algorithm step by step with the user. For each step (1 through 29), describe what the algorithm currently does and ask: "Is this correct or does something need to change?" Fix one step at a time. Confirm before moving to next.

Start at step 1 (ABC) and work through in order. Clinical issues identified by the expert panel (section 5 above) are the likely friction points — but let the user's clinical judgment be the final word, not the agents'.

After the walk-through is complete, implement Fix #13 (Can't do / fallback system) which touches many tasks.
