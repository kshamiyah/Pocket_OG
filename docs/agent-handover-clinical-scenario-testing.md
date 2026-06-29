# Agent handover — Clinical scenario testing for joint PPH + cardiac arrest

**Date:** 2026-06-26  
**Branch:** `emergency` (joint PPH + embedded arrest, Option A deck)  
**Audience:** Next agent continuing clinical verification / test harness work  
**Status:** **Not implemented** — direction agreed in principle; needs your review and build plan

---

## 1. What the product is

**Pocket OG** (`apps/pocket-og/`) is a clinical decision-support app for obstetric emergencies. On the `emergency` branch it supports:

- **PPH SOS** — postpartum haemorrhage with a priority-based “NOW” prompt engine
- **Joint maternal cardiac arrest** — embedded arrest (Option A deck) that runs **alongside** PPH; arrest prompts must win NOW when due; haemorrhage management is not paused

**Clinical review artifacts already exist (manual):**

| Artifact | Path | Purpose |
|----------|------|---------|
| Clinical flowcharts + scenarios A–E | `docs/joint-pph-arrest-clinical-flowcharts.md` | Diagram suite, §10 scenario checklists, §11 review questions |
| Manual PPH scenarios (1–13) | `apps/pocket-og/docs/PPH_SOS_MANUAL_TEST_SCENARIOS.md` | Hand-tap testing; scenario 12 only covers arrest *entry* (2222), not joint deck timing |
| Interactive canvas | `~/.cursor/projects/Users-khalidshamiyah-Pocket-OG/canvases/joint-pph-arrest-clinical-review.canvas.tsx` | Collapsible review + partial interactive flows |

**Automated tests today:**

| Test file | What it covers |
|-----------|----------------|
| `apps/pocket-og/src/data/emergency/pph-shared.test.js` | Rate-scaled uterotonic / carboprost delay maths |
| `apps/pocket-og/src/data/GTG52_FLOWCHART.test.js` | Standalone GTG52 flowchart path integrity |
| `apps/pocket-og/src/data/emergency/pph-logic.js` | Extracted PPH `computeNextPrompt` — **diverges from production** |

**Gap:** There are **no automated tests** for joint arrest NOW routing (`buildJointNowPrompt`, `computeJointPphNowPrompt`, `computeArrestNowPrompt` integration). Production logic lives in `apps/pocket-og/src/components/EmergencyPage.jsx` (~4000+ lines).

---

## 2. What the user wants

The user’s **top priority** is **clinical accuracy** of PPH + arrest pathways, verified in a way they can **fact-check clinically** — not only “CI green.”

They are **leaning towards** (not yet committed to build):

> **Clinical scenario DSL + simulation harness** — many YAML scenarios with slight variants, virtual clock, assertions on NOW / Coming up / strip, and a **human-readable report** for clinical sign-off.

They are **not** asking for another manual checklist or more Mermaid alone. They have walked manual scenarios many times and want something that:

1. Runs many variants automatically  
2. Produces a report they can review (pass/fail per assertion + clinical notes column)  
3. Catches regressions when `EmergencyPage.jsx` changes  

They explicitly **rejected** (for now) building the full “10x buffet” (chaos runner, exhaustive state enumeration, session replay, etc.) in one go.

---

## 3. Conversation history (decisions & dead ends)

### 3.1 Diagrams and canvas

- Created `docs/joint-pph-arrest-clinical-flowcharts.md` (diagram suite + overview Mermaid). User said diagrams **did not look accurate**; overview and §1 / §4.1 were rewritten to match `EmergencyPage.jsx` `computeNextPrompt` order (not stale `pph-logic.js`).
- Cursor canvas built for interactive review; **cannot render native Mermaid**; interactive walkthrough uses `computeDAGLayout` + checklists.

### 3.2 Single “ward collapse” test debate

Ten agents debated **one flagship automated test**. Consensus on the **hazard**:

> When joint arrest is active and rhythm/shock/adrenaline is due, **PPH must not steal NOW** (e.g. TXA 2nd, blood check, carboprost while rhythm is due at ~2 min CPR).

Proposed name: **Ward Collapse / Convergent Urgency Collision** (Scenario A + deliberate timer pile-up).

**User pushback:** “We already tested scenarios manually many times — how is this different?”

**Answer documented:** Same *clinical story*, different *guarantee* — automation asserts `NOW = arrest_rhythm` at a frozen clock on every code change; manual scenario 12 never enters joint deck CPR timing.

**User then preferred:** DSL + many variants + clinical report (section 2 above) over a single hard-coded test.

### 3.3 Prerequisite everyone agreed on

**Extract** prompt engine from `EmergencyPage.jsx` into a testable pure module before any harness is trustworthy. Testing `pph-logic.js` alone is misleading.

Key functions to extract or re-export:

- `computeNextPrompt` (production version in `EmergencyPage.jsx`, not `pph-logic.js`)
- `buildJointNowPrompt`
- `computeJointPphNowPrompt`
- `isBlockedDuringJointArrest`
- `computeJointNextUpQueue` (optional for richer reports)

Dependencies already pure in `apps/pocket-og/src/data/emergency/`:

- `cardiac-arrest-shared.js` — `computeArrestNowPrompt`, `createJointArrestState`, timing constants
- `pph-shared.js` — bleed rate, reassess intervals, uterotonic delays

---

## 4. Proposed approach (v1 spec — for your review)

### 4.1 Scenario files (YAML)

Location suggestion: `apps/pocket-og/scenarios/joint/*.yaml`

```yaml
id: major_pph_arrest_rhythm_beats_txa
clinical: >
  Major PPH, TXA 2nd due, rhythm due at 2min CPR.
  Arrest must own NOW; PPH items stay in Coming up.
tags: [joint, arrest-supremacy, scenario-a]

initial:
  bloodLoss: 1200
  birthMinsAgo: 45
  tasks_done: [call_major, abc, iv_access, fundal_massage, txa]
  txaMinsAgo: 35
  carboCount: 1
  carboLastMinsAgo: 14
  toneAssessed: true

events:
  - at: 0s
    action: confirm_arrest
    args: { collapseMinsAgo: 2, cprSameAsCollapse: true }

  - at: 2m10s
    assert:
      now_type: arrest_rhythm
      not_now_type: [txa_second, blood_loss_check, carbo_dose]
      coming_up_includes: ["TXA 2nd dose", "Blood loss check"]
```

**Suggested starter set (from flowcharts §10):**

| ID | Based on | Stress |
|----|----------|--------|
| `major_pph_to_arrest` | Scenario A | Entry + shockable ×3 + ROSC |
| `uterotonic_during_arrest` | Scenario B | Ergo due while rhythm due |
| `iv_fail_massive` | Scenario C | IV fail vs arrest IV |
| `theatre_force` | Scenario D | Forced theatre consider |
| `uterotonic_hold` | Scenario E | Settled bleed hold |
| `rhythm_beats_txa` | Collision | Core supremacy invariant |

**Variants:** Same file or matrix — vary `bloodLoss`, bleed rate in log, `birthMinsAgo`, arrest entry path (`abc_button` vs `massive_7.6`).

### 4.2 Simulation harness

- Parse YAML → build session state (taskStates, log, jointArrest, clocks)
- Advance virtual `now`; apply `action` events (complete task, confirm arrest, rhythm_shockable, rosc, etc.)
- At `assert` events: call `buildJointNowPrompt` / `computeNextPrompt` with production engine
- Collect snapshot: `{ now, comingUp, stripLabels, jointArrest flags }`

**Suggested commands:**

```bash
npm run test:scenarios          # run all, fail on assertion mismatch
npm run test:scenarios:report   # write docs/clinical-scenario-report.md
```

### 4.3 Clinical report (user-facing deliverable)

Markdown or HTML table per scenario:

- Scenario id + `clinical:` blurb from YAML  
- Per assertion: time, expected, actual, ✓/✗  
- Empty **Clinical review** column: `[ ] OK  [ ] Wrong  Notes:`  

CI can fail on **engine errors**; scenarios marked `clinical_status: pending_review` until user signs off (optional workflow).

### 4.4 What v1 explicitly does NOT include

- Playwright / full React UI tests  
- Property-based fuzz (optional v2)  
- Canvas auto-sync from YAML (nice later)  
- Committing iOS Capacitor build artifacts (untracked in git)

---

## 5. Key source references

| Concern | File |
|---------|------|
| Production NOW router (joint) | `EmergencyPage.jsx` — `buildJointNowPrompt` (~989), `computeJointPphNowPrompt` (~891) |
| PPH-only ladder (production) | `EmergencyPage.jsx` — `computeNextPrompt` (~468) |
| Stale test copy of ladder | `pph-logic.js` — `computeNextPrompt` (different priority order) |
| Arrest timing & checklist | `cardiac-arrest-shared.js` — `JOINT_IMMEDIATE_ACTIONS`, `computeArrestNowPrompt` |
| Level / rate scaling | `pph-shared.js` |
| UI deck | `JointResusDeck.jsx`, `SosDrugStrip.jsx` |
| Clinical scenarios prose | `docs/joint-pph-arrest-clinical-flowcharts.md` §10–§11 |

**Critical invariant (documented in flowcharts §2):**

> Arrest always wins over PPH in NOW when joint arrest is active and not ROSC.

**Blocked during joint arrest** (`isBlockedDuringJointArrest`):

- `cardiac_arrest_ref` consider prompt  
- `consider` prompts with `considerArrestCheck`  
- Arrest rhythm/shock handled only in arrest lane (stripped from main `computeNextPrompt` via `emptyJointArrestState()` in joint PPH path)

---

## 6. Git / branch notes

- Active development on **`emergency`** branch (joint deck, compact drug strip, SOS UI alignment, iOS gitignore — pushed previously).
- **`main`** has homepage/About modal changes separate from emergency work.
- `docs/joint-pph-arrest-clinical-flowcharts.md` may be **uncommitted** — check `git status`.
- User preference: **do not commit unless explicitly asked.**

---

## 7. Tasks for the next agent (suggested order)

1. **Read** `docs/joint-pph-arrest-clinical-flowcharts.md` (overview, §2, §4.1, §10) and skim `EmergencyPage.jsx` prompt functions.  
2. **Answer the questions in §8** — user wants your independent judgment on testing strategy.  
3. If proceeding with DSL: **extract** prompt engine module; sync or deprecate `pph-logic.js` drift.  
4. Implement **minimal harness** + **3 YAML scenarios** + **markdown report**.  
5. Run report; leave clinical review columns empty for user.

---

## 8. Questions for you (next agent) — **please answer before building**

The user explicitly wants **your input** on whether this is the best approach. Do not treat the DSL plan as final. In your first response to the user, address:

### Strategy

1. **Is YAML scenario DSL + virtual-clock harness the right primary strategy** for clinical verification of joint PPH + arrest? If not, what would you recommend instead (single contract test, golden traces, property tests, Playwright, something else)?

2. **Is “many slight variants + clinical report”** the right UX for a clinician reviewer? Or would a smaller set of signed golden traces be clearer?

3. **What is the minimum viable first deliverable** — 3 scenarios, 10 scenarios, or one collision test plus harness skeleton?

### Technical

4. **Extract vs duplicate:** How would you extract `computeNextPrompt` from `EmergencyPage.jsx` without a risky 2000-line refactor? Incremental plan?

5. **`pph-logic.js` drift:** Merge into one module, delete test copy, or generate from single source?

6. **Assertion surface:** Should scenarios assert only `now.type`, or also Coming up (max 6), compact strip labels, task sync (abc↔airway)? What’s the right balance for clinical readability vs brittleness?

7. **CI policy:** Should assertion failures block merge, or only generate a report until clinical sign-off catches up?

### Clinical

8. **Coverage gaps:** Which of scenarios A–E are highest risk if untested? Anything missing (e.g. `pph_continue` checklist ordering, adrenaline before 3rd shock, stand-down merged aftercare)?

9. **Manual vs automated overlap:** User has `PPH_SOS_MANUAL_TEST_SCENARIOS.md`. Should automated scenarios **replace**, **reference**, or **extend** those ids?

10. **Open challenge:** Manual testing has been done “many times” on similar stories. **What does automation add** that manual checklists do not, in your view? Is that worth the extraction cost?

---

## 9. User communication preferences

- Explain simply; avoid jargon where possible.  
- Do not commit unless asked.  
- Clinical review needs detail; prefer accurate specs over quick code.  
- Canvas path: `~/.cursor/projects/Users-khalidshamiyah-Pocket-OG/canvases/joint-pph-arrest-clinical-review.canvas.tsx`

---

## 10. One-paragraph summary for a rushed reader

Pocket OG on `emergency` runs joint PPH + embedded cardiac arrest with a dual NOW router (`buildJointNowPrompt`). Clinical flowcharts and manual scenarios exist but **nothing automated tests joint timing collisions** (rhythm vs TXA/blood at CPR 2 min). The user wants **YAML scenarios + virtual clock + a clinical review report** across many variants, not just one test. **Prerequisite:** extract prompt logic from `EmergencyPage.jsx`. **Next agent:** evaluate whether this is the best testing strategy (§8), propose a minimal build plan, get user agreement, then implement.

---

*End of handover. Please reply to the user with your answers to §8 before large implementation.*
