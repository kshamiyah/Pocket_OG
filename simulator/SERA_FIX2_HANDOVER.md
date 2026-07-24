# SERA — Fix 2 Handover: Parallel Team (concurrent execution)

Self-contained spec for the **parallel-team** fix. The physiology overhaul (death model, cardiac
arrest, Hb, tissue — see `SERA_BUILD_HANDOVER.md`) is DONE and calibrated. This is the remaining
"Section E" that was deliberately deferred. Read Section 0 of `SERA_BUILD_HANDOVER.md` first for
orientation if you're new to the codebase.

---

## 0. Orientation (quick)

- **What SERA is:** a virtual obstetric patient driven by the REAL Pocket O&G PPH-SOS algorithm (via a
  Node bridge). We test whether the SOS protocol keeps her safe. **Do NOT modify the SOS algorithm.**
- **The file this fix lives in:** `simulator/bridge/app_operator.py` — the loop (`stream()`) that runs
  the real SOS engine against the patient and applies each recommendation. This is where ~all changes go.
- **Also touched:** `simulator/bridge/human_factors.py` — add the new "team parallelism" parameter.
- **SOS engine (READ-ONLY, for reference):** `apps/pocket-og/src/data/emergency/pph-logic.js`
  (`computeNextPrompt`, `effectiveTaskStatus`, task states). You may READ it to understand task-state
  gating, but do not change it.
- **Run:** `python3 simulator/bridge/app_operator.py` (launches the Node bridge). Branch: `Sera`.

---

## 1. The problem

The operator loop holds **one** in-flight action at a time (a single `pending` dict). Each task's
human-factored delay must run to completion **before the next task starts**. So a whole PPH team is
modelled as **one person doing everything single-file**.

Symptom (the trace that motivated this): `call_team → abc → iv_access → call_major → txa →
second_cannula → fundal_massage → call_massive → mhp → tone_check → bimanual`, each ~37 s + waits, ate
**7+ minutes** — and the patient arrested **before a single uterotonic was given**. That's not a
physiology bug; it's that the model serialises a team that in reality acts in parallel.

---

## 2. The core reframe (the key idea — get this first)

**The SOS app is tapped by ONE team leader — but each tap DELEGATES the action to a DIFFERENT team
member.** So the parallelism is in the *execution*, not the *prompting*. **Tapping ≠ doing.**

- Leader taps "IV access" → hands it to the nurse.
- ~seconds later taps "give oxytocin" → hands it to someone else.
- ~seconds later taps "call for help" → hands it to a third.

Three taps in ~15 s, and now **three actions run at once**, each finishing on its own timeline.

The model's mistake is **fusing two clocks that should be separate**:
1. **Dispatch cadence** — how fast the leader reads a prompt and delegates it. FAST (a few seconds).
2. **Completion delay** — how long the delegated person takes to actually do it. This is the existing
   human-factored delay, and it must run **in the background, in parallel** with everything else.

The current loop makes the leader *wait* for completion (clock 2) before the next tap (clock 1). The fix
is to **split them**: dispatch quickly, let completions run concurrently.

---

## 3. The design

1. **Concurrent in-flight pool (not a single `pending`).** Replace the single `pending` with a **list**
   of in-flight actions, each with its own countdown. Every step: apply any whose timer has expired
   (run its physiological effect, mark its task done, free its slot), then dispatch new ones into free
   capacity. Physiology ticks continuously while they run.

2. **Concurrency cap = team size.** You can't do infinite things at once. A `team_lanes` limit caps how
   many actions are in-flight simultaneously. When the pool is full, the leader waits for one to finish
   before dispatching the next. **This cap is the real "how parallel is this team" knob** and varies by
   human-factor preset (see §5). It is arguably a more honest human-factor than the per-task delays.

3. **"In-progress" task state (critical detail).** To get the SOS engine to hand you the *next* thing to
   dispatch, you must tell it the current one is **being handled** — not "not started", or
   `computeNextPrompt` just re-recommends the same task forever. When you dispatch an action, mark its
   task in `session.taskStates` with a status the engine treats as "handled/skip" so the next call
   returns a DIFFERENT prompt; when the in-flight timer completes, flip it to `done` and apply the
   effect. **INSPECT `pph-logic.js` `effectiveTaskStatus` / the `st()` gating to find which status the
   engine skips** (it already has `assigned` for theatre and `skipped` — reuse an existing one if it
   makes the engine move on; otherwise track dispatched task-ids on the OPERATOR side and don't
   re-dispatch them). **Do not modify the engine to achieve this** — do it via session state and/or an
   operator-side dispatched-set.

4. **Fire-and-forget for calls.** `call_team / call_major / call_massive / cardiac_arrest_ref` are quick
   delegations — they should NOT occupy a hands/lane slot for their full delay and must not block bedside
   care. Dispatch them with ~zero lane cost.

5. **First-line tone treatment fires immediately, in parallel.** Oxytocin and fundal massage/compression
   must not sit behind the admin shell (calls, cannula). With the concurrent pool this happens naturally,
   but verify: "time to first uterotonic" for a competent team should drop from ~7 min to ~1–2 min.

---

## 4. Architecture sketch (for `app_operator.py` `stream()`)

Current loop (simplified): one `pending`; if pending & not expired → wait; if expired → `apply_prompt`;
else ask `bridge.next_prompt(session)`, compute `action_delay_min`, set `pending`.

New loop each step:
1. **Complete:** for each in-flight action with `now ≥ until`: `apply_prompt(prompt)` (runs the physiology
   effect + marks task `done`), remove from pool, free its lane.
2. **Dispatch:** while `len(in_flight) < team_lanes` AND the leader's dispatch tick is due: call
   `bridge.next_prompt(session)`. If actionable, mark its task "in-progress" (§3), compute its completion
   delay (existing `action_delay_min` / `transfusion_start_delay_min` / `theatre_ready_delay_min`), and
   push `{prompt, until: now+delay}` into the pool. Calls (§4) dispatch without consuming a lane. Stop when
   the engine returns nothing actionable (monitoring) or the pool is full.
3. **Advance the clock** to the next event (soonest in-flight completion, or next dispatch tick — keep the
   existing `MIN_ACTION_MIN` / `DT_IDLE_MIN` granularity), and **tick physiology** over that interval.
4. Keep emitting the per-step snapshot; add fields so the UI/log can show how many actions are in-flight.

Preserve the existing timing machinery (`human_factors.py` delays, blood/theatre timers) — those become
the per-action **completion** delays. The only change is running MANY concurrently instead of one, gated
by `team_lanes`.

---

## 5. New human-factor: team_lanes (per preset)

Add a `team_lanes` parameter to `human_factors.py` (per HF preset) — how many actions can be in-flight at
once. Suggested starting values (TUNABLE):

| Preset | team_lanes | Rationale |
|---|---|---|
| ideal_robot | large (e.g. 99) | tests the protocol with perfect parallelism |
| competent | ~4–5 | full team: leader + nurse + anaesthetist + runner |
| busy_shift | ~3 | |
| stretched | ~2 | short-staffed |
| chaotic / solo | 1 | one person — collapses back to serial (this is the failure mode) |

`team_lanes = 1` must reproduce today's serial behaviour exactly (useful as a regression check).

---

## 6. Definition of done

- **The motivating trace is fixed:** competent team gives **first uterotonic + massage within ~1–2 min**
  (in parallel with calls/access), not after 7 min. She is far more likely to survive.
- **`team_lanes = 1` reproduces the old serial timing** (regression anchor).
- **Lane count changes outcomes sensibly:** competent (parallel) survives cases that chaotic/solo (serial)
  loses. Run the phenotype × human-factor sweep (`sweep_scoring.py`) and show the safe zone widens with
  more lanes.
- **No physiology regressions:** the calibrated death/arrest/Hb/tissue behaviour (from
  `SERA_BUILD_HANDOVER.md`) is unchanged — this fix only changes *when actions are dispatched*, not how the
  body responds.
- **SOS engine untouched** — verify no edits under `apps/pocket-og/src/`.

## 7. Verify locally

```
python3 simulator/bridge/app_operator.py     # watch time-to-first-uterotonic drop
python3 simulator/sweep_scoring.py           # safe zone should widen with more team_lanes
```

Report: the new time-to-first-uterotonic for competent vs chaotic, a before/after on the motivating
trace, and confirmation that `team_lanes=1` matches the old serial behaviour. Branch `Sera`.
