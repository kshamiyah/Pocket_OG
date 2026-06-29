# PPH Emergency Algorithm — Handover

**Branch:** `claude/handover-doc-review-1sgwsa`
**Primary file:** `apps/pocket-og/src/components/EmergencyPage.jsx` (all state, logic, UI)
**Clinical benchmark:** `apps/pocket-og/src/data/GTG52_FLOWCHART.js` (read-only source of truth)
**Live preview:** https://pocketog-git-claude-handover-d-b18096-khalid-shamiyahs-projects.vercel.app
(Vercel git integration — every push to this branch auto-deploys to that URL.)

---

## Goal

Turn the static GTG52 PPH flowchart into an **active** bedside emergency tool: it
times things, tracks doses, chases delegated tasks, and escalates — instead of
being a passive reference the clinician has to read during a crisis. Every step
has been walked through against GTG52 and corrected where it deviated.

---

## Architecture (how it works)

- **Single task registry** (`TASKS` array) keyed by unique `id`, tagged with a
  `level` (`minor` / `major` / `massive`).
- **State machine** `computeNextPrompt()` runs every second and returns the single
  highest-priority thing to surface. Priority order:
  1. Tone check (fires immediately after fundal massage)
  2. Critical follow-ups (overdue delegated critical tasks)
  3. Blood-loss reassessment (rate-based — see below)
  4. Non-critical follow-ups
  5. Critical unstarted tasks (highest level first)
  6. Carboprost repeat dose / TXA second dose
  7. Next regular task
  8. Monitoring (idle)
- **Task status** lives in one `taskStates` object keyed by id (`null` →
  `assigned` / `done` / `skipped`). It is **never reset on level change**, so a
  drug given in minor stays done and is never re-prompted in major. Each drug is
  a single uniquely-id'd task — there are no duplicate drug tasks across levels.
- **localStorage persistence**: full active session is saved every change and can
  be recovered (Resume / Discard banner on the setup screen).
- **Level** is derived from blood loss: ≥1000 ml → major, ≥2000 ml → massive.

### Key generic mechanisms
- `deps: [...]` — task only surfaces once its dependencies are done/skipped.
- `gate()` — intercepts a task before surfacing: drugs with `contraindications`
  route to a CI-check prompt; tasks with `assess` route to an assessment prompt.
- `hidden: true` + `forcedTasks` — task only surfaces when force-activated
  (used by fallback drugs and assessment-driven treatments).
- `assess: {...}` — Four T's pattern: ask exclude-vs-present; "present" activates
  a hidden treatment task.
- `naOption: {...}` — "Not available" button for adjuncts not in every unit
  (ROTEM/TEG, cell salvage); logs the reason instead of a generic skip.

---

## Clinical content — current state (all benchmarked vs GTG52)

### Minor PPH
Call for help → ABC → IV access (1×16G + FBC/coag/U&E/G&S) → fundal massage →
tone check → bimanual compression (if boggy) → **oxytocin bolus** (as soon as tone
pathway complete) → **then** trauma/tissue assessments (Four T's), catheterise, IV
fluids, oxytocin infusion → ergometrine ladder; coag review for Thrombin.

### Major PPH
Escalate → 2nd cannula → **TXA (moved up, time-critical)** → rapid crystalloid
(1.5–2 L per GTG52) → blood products → keep warm → **calcium gluconate** (10 ml
10% — hypocalcaemia in massive transfusion) → **ROTEM/TEG** ("if available") →
carboprost → misoprostol.

### Massive PPH
Activate massive → **MHP pack** (empirical 6 RBC + 4 FFP, don't wait for labs,
1:1 if ongoing) → cell salvage (with "Not available" option) → Bakri balloon →
transfer to theatre → cardiac-arrest reference (call 2222).

### Post-control aftercare (new)
On **Stand down**, a level-filtered aftercare checklist appears before the
summary: VTE prophylaxis, HDU/ITU, serial bloods, debrief, documentation, and
(massive) MBRRACE notification. Ticked items are logged into the PPH record.

---

## Reminder system (rationalised this session)

### Blood-loss reassessment — RATE-AWARE
Interval scales with the actual bleed rate (ml/min) computed over a rolling
10-min window:

| Rate (ml/min) | Severity | Next check |
|---|---|---|
| ≥ 150 | catastrophic | 1 min |
| 50–150 | brisk | 2 min |
| 10–50 | moderate | 3 min |
| 1–10 | slow ooze | 5 min |
| ~0 | settled | backs off |

The current level sets the **slowest** acceptable cadence (massive 3 / major 4 /
minor 5 min); a faster rate only shortens it (`min(levelCap, rateInterval)`).
Blood-loss log entries store cumulative `total` + timestamp to derive the rate.
The check prompt shows live rate, severity, and the next-check interval.

### Chase timers — all 90s
Logistics-confirmation follow-ups fire 90s after a task is **delegated**
("Assign →"): call for help, escalate major, activate massive, MHP pack, IV
access, 2nd cannula, TXA-given confirmation, and bimanual compression. Consistent
proactive cadence to keep the team on their toes.

### Repeat-dose timers — the only drug timers
- **Carboprost**: every 15 min, up to 8 doses (drug-strip counter).
- **TXA 2nd dose**: at 30 min if still bleeding and within the 3-hour window.
Generic per-drug effect timers (oxytocin/ergometrine/misoprostol) were
**removed** — drug effect is judged by the rate-based blood-loss reassessment,
not redundant per-drug timers.

### TXA 3-hour window tracker — flipped & scoped
- Shows **before** the first dose (at major+) as the "give it in time" cue.
- Relabels to "2nd dose window" between first and second dose.
- Hides once the second dose is given or the window closes.

### Event-driven prompts (not timed)
Tone check, Four T's assessments, suture re-check (5 min: controlled / improving /
consider theatre — escalation is opt-in, never forced), contraindication
pre-checks (ergometrine → carboprost → misoprostol fallback chain), and the
full-screen escalation overlay when blood loss crosses 1000 / 2000 ml.

---

## Fixes this session (commit trail)

- `916ecde` 90s chase follow-up on bimanual compression
- `1499aba` Fix: reset elapsed timer when starting a fresh session after discard
- `295156d` Drop redundant drug effect timers; flip+scope TXA window tracker
- `6768dd6` Standardise chase follow-ups to 90s
- `76a5f94` Rate-aware blood-loss reassessment interval
- `9f795bc` Complete massive block + post-control aftercare
- `d914221` "Not available" option for ROTEM/TEG
- `ef82b87` Align major block with GTG52 (TXA up, crystalloid, calcium, ROTEM)
- `dddb649` Opt-in theatre escalation from suture follow-up
- (earlier) Assessment-driven Four T's, contraindication fallback chain,
  uterotonic ordering, IV-access match, call-before-ABC reordering.

---

## Open items / next steps

1. **Unified dataset architecture** — biggest remaining task. One shared dataset
   consumed by *both* the static GTG52 reader and the active engine, so the two
   can never drift apart. Clinical content is now validated, so this is the
   natural next step.
2. **bimanual follow-up priority** — currently non-critical (Priority 4). Could
   be made critical if it should jump the queue like calls/access.
3. **H6 misoprostol double-dose** — effectively resolved (single uniquely-id'd
   task can't be prompted twice); revisit only if a belt-and-braces "already
   given" banner is wanted.
4. **Rate thresholds & 10-min window** — confirmed sensible by clinician but
   easy to tune (one-line changes) if real-world testing suggests otherwise.
5. **Sibling-branch conflict watch** — an earlier branch removed calcium
   gluconate as "out of scope"; we deliberately re-added it. Don't let it get
   reverted on merge.
6. **Deployment protection** — preview is behind Vercel SAML auth; fine for the
   team, not shareable externally without disabling preview protection.
