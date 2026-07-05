# Handover: Clinical Context Compiler branch

## Branch & PR

| Item | Detail |
|------|--------|
| **Branch** | `cursor/clinical-compiler-stage1-ecf1` |
| **Base** | `main` (not merged — intentionally isolated) |
| **Draft PR** | [#25](https://github.com/kshamiyah/Pocket_OG/pull/25) — WIP, not for release |
| **Status** | Stage 1 only — engine + rules, no app UI yet |

---

## What we're trying to do

### The problem

Pocket O&G has rich, interconnected content (guidelines, flowcharts, calculators, drugs, consent), but users still have to **search and stitch** it together themselves — especially for **multi-condition** patients (e.g. twins + severe PET + previous VTE).

### The solution

Build a **Clinical Context Compiler** inspired by Karpathy's "second brain" idea:

- **Compile** knowledge from your connection graph into actionable pathways
- **Synthesise** across guidelines (resolve conflicts, catch interactions)
- **Render** using CLARK's step-by-step UI (from the `clerk` branch)

### What CLARK was (and why we're evolving it)

**CLARK** on `clerk` = static, hand-authored protocols for single presenting complaints (hyperemesis, RFM, PPROM, etc.). It was not strong enough on its own: too linear, single-condition, high maintenance.

**New direction:** CLARK becomes the **renderer**; the **compiler** generates protocols dynamically from rules + your existing guideline graph.

---

## Architecture (target state)

```
User selects conditions + gestation + history
        ↓
Clinical Compiler (rules engine + connection graph)
        ↓
CLARK-style protocol (JSON nodes: checklist, question, treatment, etc.)
        ↓
CLARK UI renders step-by-step pathway
```

**Karpathy hybrid approach (planned):**

- **Pre-compile** top 20–30 common scenarios (reviewed, high quality)
- **Dynamic compile** everything else on demand
- Rules must be **confirmed** before use (clinical sign-off)

---

## What's on the branch now

### Merged from `clerk`

- `Clark.jsx` — protocol renderer (dark UI, node types, citations)
- 7 static CLARK protocols in `src/data/clark/` (hyperemesis, RFM, PPROM, etc.)
- GTG73 guideline support
- CLARK wired in `App.jsx` but **no floating launcher** on home (overlay only, for later)

### New: Stage 1 compiler

| Path | Purpose |
|------|---------|
| `src/compiler/clinicalCompiler.js` | Core engine — builds CLARK-compatible protocols |
| `src/compiler/rules/conditions.js` | Per-condition rules (actions, investigations, management) |
| `src/compiler/rules/interactions.js` | Cross-condition logic (conflicts, escalations, alerts) |
| `src/compiler/rules/safety-checklists.js` | "What you might forget" items |
| `src/compiler/ruleStatus.js` | `proposed` / `confirmed` / `declined` lifecycle |

### Tooling

| Script | Purpose |
|--------|---------|
| `scripts/review-rules.js` | List, show, **confirm**, **decline** rules |
| `scripts/test-compiler.js` | Test compile a scenario (after rules confirmed) |
| `docs/COMPILER_STAGE1.md` | Workflow documentation |

### Not built yet

- Context Builder UI (condition picker)
- Compiler entry point in the app
- Wiring compiler output → CLARK session
- Pre-compiled pathway files
- Full drug ladders in rules (e.g. severe-PET currently draft-thin)

---

## Rule review workflow (critical)

**Nothing compiles until you confirm rules.** This is intentional — clinical safety.

```
proposed  →  you review  →  confirmed (used)  or  declined (audit only)
```

**Commands:**

```bash
cd apps/pocket-og
node scripts/review-rules.js list
node scripts/review-rules.js show condition/severe-pet
node scripts/review-rules.js confirm condition/hyperemesis --reviewer "KS"
node scripts/review-rules.js decline condition/pprom --reason "Needs full GL895 draft"
node scripts/test-compiler.js              # PET + twins + VTE scenario
node scripts/test-compiler.js hg-twins     # Hyperemesis + twins scenario
```

**Current state:** 15 rules, all **proposed**, 0 confirmed → test compiler correctly returns "No protocol generated".

---

## Test scenarios we validated (prototype)

### Scenario A: PET + twins + VTE

- 32+2, BP 165/105, previous DVT
- Generated 7 nodes: immediate actions → investigations → VTE question → escalation → management (with QS46 vs GL952 delivery conflict) → safety checklist → end

### Scenario B: Hyperemesis + twins

- 10+3, vomiting 15×/day, can't keep fluids down
- Generated 6 nodes including **critical dextrose/Wernicke's alert**, antiemetic ladder, twins-worse-HG insight

Both outputs were clinically reasonable in prototype form; rules need sign-off and refinement (e.g. full antihypertensive ladder for PET, not just labetalol).

---

## Implementation stages (roadmap)

| Stage | What | Status |
|-------|------|--------|
| **0** | Branch + merge CLARK | Done |
| **1** | Compiler engine + rules + confirm/decline | Done (rules draft, awaiting sign-off) |
| **2** | Context Builder UI (multi-condition picker) | Not started |
| **3** | Wire compiler → CLARK renderer in app | Not started |
| **4** | Clinical testing, coverage analyser | Not started |
| **5** | Pre-compile top scenarios (Karpathy wiki layer) | Not started |
| **6** | Polish (deep links, sharing, handover export) | Not started |

**Release gate:** ~95% tested before merging to `main`.

---

## Open clinical decisions (need you)

1. **`condition/severe-pet`** — Expand to full antihypertensive ladder (labetalol, nifedipine, hydralazine IV, methyldopa) vs link-only to GL952_ACUTE flowchart?
2. **`condition/pprom`** — Decline placeholder until full GL895 content?
3. **`condition/previous-vte`** — History flag only, not a selectable condition?
4. **Which scenarios to pre-compile first** once rules are confirmed?

---

## Key files to read first

1. `apps/pocket-og/docs/COMPILER_STAGE1.md` — workflow
2. `apps/pocket-og/src/compiler/clinicalCompiler.js` — how compilation works
3. `apps/pocket-og/src/compiler/rules/conditions.js` — what you're signing off
4. `apps/pocket-og/src/components/Clark.jsx` — future renderer
5. `apps/pocket-og/scripts/test-compiler.js` — how to test

---

## Next actions (when you pick this up)

1. Review rules one at a time (`review-rules.js list`)
2. Expand `severe-pet` management block with full drug ladder
3. Confirm first batch of rules (~10–12 for two test scenarios)
4. Run both test scenarios; fix gaps
5. Start Stage 2 (Context Builder UI) only after rule quality feels right

---

## One-line summary

**We're building a dynamic clinical pathway compiler that synthesises multi-condition management from Pocket O&G's guideline graph, rendered through CLARK's UI — with every clinical rule requiring explicit confirm/decline before it ships.**
