# Clinical Context Compiler — Stage 1

**Branch:** `cursor/clinical-compiler-stage1-ecf1` (not on main)

## What Stage 1 includes

- `src/compiler/clinicalCompiler.js` — core engine (confirmed rules only)
- `src/compiler/rules/conditions.js` — condition definitions
- `src/compiler/rules/interactions.js` — cross-condition logic
- `src/compiler/rules/safety-checklists.js` — "what you might forget"
- `scripts/review-rules.js` — your confirm/decline workflow
- `scripts/test-compiler.js` — test a scenario after confirming rules

CLARK from `clerk` is merged on this branch as the future renderer (Stage 3).

## Your workflow: confirm / decline rules

### 1. See what's waiting for sign-off

```bash
cd apps/pocket-og
node scripts/review-rules.js list
```

### 2. Inspect one rule in full

```bash
node scripts/review-rules.js show condition/hyperemesis
node scripts/review-rules.js show interaction/hyperemesis-no-dextrose
```

### 3. Confirm (activates it for compilation)

```bash
node scripts/review-rules.js confirm condition/hyperemesis --reviewer "KS"
node scripts/review-rules.js confirm interaction/hyperemesis-no-dextrose --reviewer "KS"
```

### 4. Decline (kept for audit, never compiled)

```bash
node scripts/review-rules.js decline condition/pprom --reason "Needs full GL895 draft first"
```

### 5. Export a markdown review pack

```bash
node scripts/review-rules.js export-md
# → docs/COMPILER_RULES_REVIEW.md
```

### 6. Test compilation

```bash
# After confirming at least the conditions in the scenario:
node scripts/test-compiler.js              # PET + twins + VTE
node scripts/test-compiler.js hg-twins     # Hyperemesis + twins
```

## Rule status lifecycle

| Status | Meaning |
|--------|---------|
| `proposed` | Draft — visible in review, **not compiled** |
| `confirmed` | Clinically signed off — **used by compiler** |
| `declined` | Rejected — kept for audit, never compiled |

## Current proposed rules (awaiting you)

**Conditions:** severe-pet, twins, hyperemesis, previous-vte, pprom

**Interactions:** hyperemesis-no-dextrose, hyperemesis-twins-severity, pet-twins-delivery-timing, previous-vte-escalation, mgso4-renal-check

**Safety checklists:** early-pregnancy, preterm-delivery, hyperemesis, twins, severe-pet

## Suggested first sign-off batch

For the two test scenarios we ran:

1. `condition/severe-pet`
2. `condition/twins`
3. `condition/hyperemesis`
4. `interaction/hyperemesis-no-dextrose`
5. `interaction/pet-twins-delivery-timing`
6. `interaction/previous-vte-escalation`
7. `safety/severe-pet`
8. `safety/twins`
9. `safety/hyperemesis`

Then run both test scenarios and tell me what to fix.

## Next stages (not built yet)

- **Stage 2:** Context Builder UI
- **Stage 3:** Wire compiler → CLARK renderer
- **Stage 4:** Clinical testing & coverage analyser
- **Stage 5:** Pre-compiled pathways for top scenarios
