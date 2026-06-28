# PPH SOS — Manual Test Scenarios

Step-by-step clinical scenarios for testing the **PPH SOS** emergency screen by hand.
Each scenario is a real-life vignette. Follow the **Tap** column in order and check the
**Expect** column against what the app actually shows. Tick the box if it matches.

### How to read this

- **Tap** = what you physically press in the app.
- **Expect** = what the app should display or do next.
- ⏱ = a step that depends on real elapsed time. Where a wait is long, a workaround is given
  (e.g. set the birth time in the past) so you don't have to sit and wait.
- 🩸 = blood-loss entry, either from the header quick-add (`+100 / +250 / +500`, `Correct`)
  or from inside a **Blood loss check** prompt.

> Most prompts surface automatically from the decision engine — you rarely navigate manually.
> If the expected prompt doesn't appear immediately, it's usually waiting on a timer
> (drug delay, reassessment interval) or on a prerequisite task (e.g. IV access). Those cases
> are flagged.

---

## Scenario 1 — Textbook minor PPH that settles (happy path)

**Vignette:** Spontaneous vaginal birth, 600 ml estimated loss, atonic uterus. Responds to
massage and oxytocin. Bleeding settles. Stand down.

**Purpose:** Baseline. Confirms the stabilisation order, the tone gate, the first uterotonic
rung, settling, and the stand-down → aftercare → summary flow.

| # | Tap | Expect |
|---|-----|--------|
| 1 | Open SOS. On **Initial blood loss**, tap **500 ml** preset (or enter `600`, **Start →**) | Main screen opens. Header shows **Minor PPH**, blood loss in yellow. |
| 2 | — | First prompt is **Call for help** (`call_team`). |
| 3 | Tap **Done ✓** | Next prompt is **ABC — airway, breathing, circulation**. |
| 4 | Tap **Done ✓** | Next prompt is **IV access + bloods**. |
| 5 | Tap **Done ✓** | Next prompt is **Fundal massage**. |
| 6 | Tap **Done ✓** | **Tone assessment** prompt appears ("Is the uterus firm after massage?"). |
| 7 | Tap **Still boggy →** | App continues into uterotonics / compression. Next actionable prompt is **Bimanual uterine compression** or **Oxytocin 5 IU IV**. |
| 8 | Work through the prompts with **Done ✓** until **Oxytocin 5 IU IV** appears, tap **Done ✓** | Oxytocin recorded. |
| 9 | ⏱ A **Blood loss check** prompt appears on the reassessment interval. Tap **Unchanged** | Loss stays 600 ml, stays Minor. |
| 10 | Tap **Stand down** (top right) → **Confirm** | **Aftercare checklist** appears with the 6 minor-level items. |
| 11 | Tick at least one item → **Complete** | **Summary** screen with timeline, peak loss 600 ml, events logged. |

- [ ] **PASS** / [ ] FAIL — notes:

---

## Scenario 2 — Minor escalating to major mid-resuscitation

**Vignette:** Starts as 700 ml minor PPH. During reassessment the loss jumps to 1,300 ml.

**Purpose:** Tests live escalation: the **Level change** overlay, that `call_major` surfaces,
and that the TXA window strip appears once at major.

| # | Tap | Expect |
|---|-----|--------|
| 1 | Start at **700 ml** custom (no birth time) | Header: **Minor PPH**. |
| 2 | Work through `call_team`, `ABC`, `iv_access` with **Done ✓** | Stabilisation trio recorded. |
| 3 | 🩸 In the header, tap **+500** then **+100** (700 → 1,300) | **Level change → Major PPH** overlay appears. |
| 4 | Tap **Acknowledged — continue** | Header now shows **Major PPH** (orange). |
| 5 | — | A new prompt **Call for help — major PPH** (`call_major`, marked *critical*) surfaces. |
| 6 | Tap **Done ✓** | In the task list, **Call for help** (`call_team`) is shown done with note *"included in major call"* (lower call auto-absorbed). |
| 7 | — | Drug strip now shows a **TXA window** countdown bar (3-hour window). |
| 8 | Continue until **Tranexamic acid 1 g IV** prompt; tap **Done ✓** | TXA recorded; strip switches to **2nd dose window** label. |

- [ ] **PASS** / [ ] FAIL — notes:

---

## Scenario 3 — Pre-eclamptic patient: ergometrine contraindicated

**Vignette:** Atonic PPH ~900 ml in a woman with severe pre-eclampsia (BP 165/110).
Oxytocin insufficient. Ergometrine is **contraindicated** — must skip to carboprost.

**Purpose:** Tests the contraindication check and the **ergometrine → carboprost** fallback.
(This is the exact clinical gap the automated tests caught and we fixed.)

| # | Tap | Expect |
|---|-----|--------|
| 1 | Start at **900 ml** | Minor PPH. |
| 2 | Clear `call_team`, `ABC`, `iv_access`, `fundal_massage` with **Done ✓** | Tone prompt appears. |
| 3 | Tap **Still boggy →** | Continues into uterotonics. |
| 4 | Give **Oxytocin 5 IU IV** (Done ✓), then **Oxytocin infusion** (Done ✓ — note infusion needs IV, which is done) | Both oxytocins recorded. |
| 5 | ⏱ After the drug delay + a blood-loss check, an **Uterotonic escalation** prompt offers **Ergometrine 500 mcg**. Tap **Yes — give now** | App routes to a **Before giving — check contraindications** card for ergometrine. |
| 6 | Read the CI list — it must include **Hypertension, Pre-eclampsia, Cardiac disease, Obliterative vascular disease** | All four listed. |
| 7 | Tap **Contraindicated → Carboprost 0.25 mg IM** | Ergometrine marked not given; **Carboprost** is force-activated as the next step. |
| 8 | — | The next prompt is **Carboprost 0.25 mg IM** (its own CI check first — see Scenario 4). |

- [ ] **PASS** / [ ] FAIL — notes:

---

## Scenario 4 — Asthmatic **and** cardiac patient: double contraindication cascade

**Vignette:** Major PPH 1,200 ml. Patient has brittle asthma **and** known cardiac disease.
Ergometrine (cardiac) **and** carboprost (asthma) are both contraindicated — only
misoprostol remains.

**Purpose:** Stretches the fallback chain two levels deep:
**ergometrine → carboprost → misoprostol**.

| # | Tap | Expect |
|---|-----|--------|
| 1 | Start at **1,200 ml** | **Level change → Major PPH** overlay → Acknowledge. |
| 2 | Clear the stabilisation/critical prompts and both oxytocins with **Done ✓** | Oxytocins recorded. |
| 3 | ⏱ When **Ergometrine** is offered (escalation or CI check), reach its **CI check** and tap **Contraindicated → Carboprost** | Carboprost force-activated. |
| 4 | On the **Carboprost** CI check, confirm the list includes **Asthma, Significant cardiac disease, Active hepatic disease, Active renal disease** | All four listed. |
| 5 | Tap **Contraindicated → Misoprostol 800 mcg** | Carboprost marked not given; **Misoprostol** force-activated. |
| 6 | — | Next prompt is **Misoprostol 800 mcg** (no CI check — it has none). |
| 7 | Tap **Done ✓** | Misoprostol recorded. Uterotonic ladder now exhausted at major. |

- [ ] **PASS** / [ ] FAIL — notes:

---

## Scenario 5 — IV access fails: forced onto the IM / sublingual route

**Vignette:** Major PPH 1,100 ml. Difficult veins — cannulation keeps failing. The app must
stop waiting and push uterotonics by IM/sublingual route, and must **not** offer the IV
oxytocin infusion until access is in.

**Purpose:** Tests the IV attempt window, the `iv_fail` prompt, IM options, retry cap, and the
infusion lock.

| # | Tap | Expect |
|---|-----|--------|
| 1 | Start at **1,100 ml** → Acknowledge Major overlay | Major PPH. |
| 2 | When **IV access + bloods** appears, tap **Assign →** (team is attempting, not yet in) | IV access shows *assigned/in progress*. |
| 3 | ⏱ Wait out the IV attempt window (**~2 min** at major; 90 s on a retry) | An **IV access — No IV after 2 min** prompt appears with IM/sublingual drug buttons. |
| 4 | Confirm the IM options listed are **Ergometrine / Carboprost / Misoprostol** (only those valid at this level and not yet given) | Correct options shown, plus **Keep trying — another 90 sec**. |
| 5 | Tap **Keep trying — another 90 sec** | Window resets; retry counter increments (1 of 2). |
| 6 | ⏱ Let it expire again → tap **Keep trying** once more (2 of 2) | After the 2nd retry, the prompt no longer offers "Keep trying" — only IM options remain. |
| 7 | Tap an IM option, e.g. **Misoprostol 800 mcg** | Drug recorded by IM/sublingual route. |
| 8 | Look at the task list for **Oxytocin infusion** | It is **locked** (greyed / awaiting prerequisite) — infusion requires IV, which never went in. |

- [ ] **PASS** / [ ] FAIL — notes:

> **Variation:** Instead of going IM, give IV access **Done ✓** late. Expect an
> **IV access established — Is oxytocin infusion still needed?** reassessment prompt.

---

## Scenario 6 — Retained placenta (the "Tissue" of the four T's)

**Vignette:** 800 ml PPH; on checking, the placenta is incomplete — retained tissue.

**Purpose:** Tests the assess → treat branch and that **Manual removal** is force-surfaced.

| # | Tap | Expect |
|---|-----|--------|
| 1 | Start at **800 ml** | Minor PPH. |
| 2 | Clear stabilisation + fundal massage; answer tone **Firm ✓** | Continues; four-T assessments become available. |
| 3 | When **Assess — Tissue — check placenta** appears ("Placenta and membranes complete?"), tap **No — retained** | Logged as retained tissue; **Manual removal of retained tissue** is force-activated. |
| 4 | — | Next prompt is **Manual removal of retained tissue**. |
| 5 | Tap **Done ✓** | Recorded. Task list shows Tissue with note *"retained tissue"*. |

- [ ] **PASS** / [ ] FAIL — notes:

> **Counter-check:** Re-run and tap **Yes — complete** at the Tissue assessment instead.
> Manual removal should **never** surface, and the task list note reads *"placenta complete"*.

---

## Scenario 7 — Genital tract trauma not controlled → theatre

**Vignette:** 750 ml PPH from a high vaginal tear. Sutured, but still oozing at 5 minutes.

**Purpose:** Tests the trauma assess → suture → timed follow-up → theatre escalation.

| # | Tap | Expect |
|---|-----|--------|
| 1 | Start at **750 ml**; clear stabilisation + tone | Four-T assessments available. |
| 2 | On **Assess — Trauma — inspect birth canal**, tap **Yes — present** | **Suture lacerations / surgical haemostasis** is force-activated. |
| 3 | Reach the **Suture** task, tap **Done ✓** | Recorded; a 5-min follow-up is scheduled. |
| 4 | ⏱ After ~5 min the follow-up **"Trauma bleeding controlled?"** appears | Three options shown: **Yes — controlled**, **Improving — check back in 5 min**, **Not controlled — consider theatre →**. |
| 5 | Tap **Not controlled — consider theatre →** | **Transfer to theatre** is escalated/queued; log records trauma not controlled. |

- [ ] **PASS** / [ ] FAIL — notes:

---

## Scenario 8 — Massive PPH from the outset

**Vignette:** Placental abruption; 2,200 ml on arrival. Straight to massive protocol.

**Purpose:** Tests starting at massive: overlay, `call_massive` absorbing **both** lower calls,
MHP pack, and the soft "consider" surgical prompts.

| # | Tap | Expect |
|---|-----|--------|
| 1 | Start with **2,000 ml** preset (or enter `2200`) | **Level change → Massive PPH** overlay on entry. |
| 2 | Acknowledge | Header: **Massive PPH** (red). |
| 3 | — | First prompt is **Activate massive PPH** (`call_massive`, critical). |
| 4 | Tap **Done ✓** | Task list shows **Call for help** *"included in massive call"* **and** **Call for help — major PPH** *"included in massive call"* — both lower calls auto-absorbed. |
| 5 | Continue clearing critical prompts (`MHP pack`, `second_cannula`, `TXA`) with **Done ✓** | All recorded. |
| 6 | — | Eventually a violet **Consider** prompt appears (e.g. **Consider bakri balloon tamponade?** / **transfer to theatre?**). |
| 7 | Tap **Not now — remind in 2 min** | At massive, the reminder interval is **2 min** (shorter than the 5 min used at lower levels). |

- [ ] **PASS** / [ ] FAIL — notes:

---

## Scenario 9 — Theatre force trigger (uncontrolled major after full ladder)

**Vignette:** Major PPH, climbs to 1,600 ml, **all** uterotonics given, still bleeding briskly.

**Purpose:** Tests the automatic theatre activation. This fires **only** when **all** of:
level ≥ major **AND** loss ≥ 1,500 ml **AND** uterotonic ladder exhausted **AND**
bleeding rate > 10 ml/min.

| # | Tap | Expect |
|---|-----|--------|
| 1 | Start at **1,000 ml** → Acknowledge Major | Major PPH. |
| 2 | Give every uterotonic rung in turn (oxytocin bolus, infusion, ergometrine, carboprost, misoprostol — use **Done ✓** / clear CI checks with **None present — give**) | Ladder exhausted at major. |
| 3 | 🩸 On a **Blood loss check**, tap **+500** then **+100** (→ 1,600 ml) over a short interval so the **rate** reads moderate/brisk (> 10 ml/min) | Loss ≥ 1,500 and rate > 10. |
| 4 | — | **Transfer to theatre** is auto-forced; the log records *"Major PPH — ongoing bleeding after uterotonics — theatre activated"*. |

> **Negative check:** Repeat but enter the 1,600 ml as a single calm correction long after the
> last loss entry (low rate), or leave one uterotonic ungiven. Theatre should **not** auto-force —
> proving the trigger needs all four conditions, not just the volume.

- [ ] **PASS** / [ ] FAIL — notes:

---

## Scenario 10 — TXA 3-hour window (the WOMAN-trial deadline)

**Vignette:** Major PPH but the woman delivered **2 h 45 min ago** — the TXA window is nearly
shut.

**Purpose:** Tests the 3-hour TXA window using the **birth time** field, plus the second-dose
prompt — without waiting hours.

| # | Tap | Expect |
|---|-----|--------|
| 1 | On setup, set **Birth time** to **2 h 45 min before now** (e.g. if it's 14:00, enter `11:15`), then start at **1,200 ml** | Major PPH; TXA window strip shows only ~**15 min** remaining, in **orange/urgent**. |
| 2 | Clear stabilisation + **IV access Done ✓** | TXA becomes givable. |
| 3 | Give **Tranexamic acid 1 g IV** → **Done ✓** | First dose recorded; strip switches to **2nd dose window**, still counting toward the same 3-hour mark. |
| 4 | ⏱ (Optional, needs 30 min) After 30 min with bleeding ongoing, a **TXA — second dose** prompt asks "Is bleeding continuing?" | Options **Give second dose ✓** / **Not needed**. |
| 5 | **Window-closure check:** Re-run, set **Birth time to 3 h 5 min ago**, start at major | The TXA window strip is **hidden / closed** — the engine treats the window as expired and won't push TXA. |

- [ ] **PASS** / [ ] FAIL — notes:

---

## Scenario 11 — Carboprost repeat dosing and the 8-dose ceiling

**Vignette:** Major PPH, no asthma. Carboprost is the working uterotonic and needs repeat
15-minutely dosing up to the hard maximum of 8.

**Purpose:** Tests the carboprost confirm-dose-1 step, the 15-min repeat timer, and the
**max-8** cap.

| # | Tap | Expect |
|---|-----|--------|
| 1 | Start at **1,200 ml** → Acknowledge Major | Major PPH. |
| 2 | Clear up to **Carboprost**, pass its CI check with **None present — give**, tap **Done ✓** | Drug strip shows **Carboprost — assigned · confirm dose 1**. |
| 3 | ⏱ When the dose-1 follow-up appears, confirm it given | Strip shows **1 / 8** and **next in 15:00** counting down. |
| 4 | ⏱ After 15 min, a **Carboprost — Dose 2 of 8 due** prompt appears; tap **Given ✓** | Counter advances to **2 / 8**; timer resets. |
| 5 | (Patience permitting) repeat to dose 8 | At **8 / 8** the strip reads **max doses** and **no further** carboprost prompt is offered. |

- [ ] **PASS** / [ ] FAIL — notes:

---

## Scenario 12 — Maternal collapse: cardiac arrest path

**Vignette:** During a massive PPH the woman becomes unresponsive with no output.

**Purpose:** Tests the arrest check off the ABC step and the 2222 call.

| # | Tap | Expect |
|---|-----|--------|
| 1 | Start at **2,000 ml** → Acknowledge Massive | Massive PPH. |
| 2 | When **ABC** prompt shows, note the extra red button **Unstable — check for cardiac arrest** | Button present beneath Done/Assign. |
| 3 | Tap **Unstable — check for cardiac arrest** | A **Check — Cardiac arrest?** prompt appears. |
| 4 | Tap **Yes — call 2222 now** | `Cardiac arrest — 2222` task recorded; task list note *"2222 called"*. PPH management continues alongside. |

> **Counter-check:** Tap **No — continue PPH resus** instead → note reads *"no arrest"* and the
> app returns to the PPH flow without calling 2222.

- [ ] **PASS** / [ ] FAIL — notes:

---

## Scenario 13 — Overestimated loss corrected down (de-escalation)

**Vignette:** Swabs initially over-weighed at 1,100 ml (major), then re-totted to 800 ml.

**Purpose:** Tests that a downward correction de-escalates the live level, that **no** escalation
overlay fires going down, and that the **peak** is preserved for the record.

| # | Tap | Expect |
|---|-----|--------|
| 1 | Start at **1,100 ml** → Acknowledge Major | Major PPH. |
| 2 | In the header tap **Correct**, enter **800**, **Apply** (or use **Overestimated? Correct total** inside a Blood loss check) | Header drops to **Minor PPH** (yellow); **no** "Level change" overlay appears going down. |
| 3 | — | Log shows *"Blood loss corrected: 1100 → 800 ml"*. |
| 4 | Stand down → complete aftercare → **Summary** | Summary **peak** still reads **1,100 ml** even though final is 800 ml. |

- [ ] **PASS** / [ ] FAIL — notes:

---

## Reporting template

For each scenario record:

```
Scenario:        #__  ____________________________
Result:          PASS / FAIL
Where it broke:  (step #, what you expected, what actually happened)
Severity:        clinical-safety / wrong-prompt / cosmetic
Notes:
```

Anything marked **clinical-safety** (a contraindicated drug offered, theatre/escalation not
triggered when it should be, TXA pushed outside the window, a missed call step) should be raised
before anything cosmetic.
```
