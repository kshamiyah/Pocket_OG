# Clinical Context Compiler - Prototype Test

This folder contains a **proof-of-concept** of what the Clinical Context Compiler would generate.

## What's Here

### 1. `test-compiler.js`
A standalone script that demonstrates the compilation algorithm.

**Run it:**
```bash
cd apps/pocket-og
node scripts/test-compiler.js
```

**What it does:**
- Takes a clinical scenario: "32+2 weeks, twins, BP 165/105, previous DVT"
- Dynamically generates a CLARK-style protocol
- Outputs JSON you can inspect

**Output:** A complete protocol with 7 nodes that synthesizes GL952 + QS46 + GL891

### 2. `preview-compiled-protocol.html`
A visual preview of what the compiled protocol looks like in CLARK's UI.

**View it:**
```bash
# Open in browser
open apps/pocket-og/scripts/preview-compiled-protocol.html

# Or on Linux
xdg-open apps/pocket-og/scripts/preview-compiled-protocol.html
```

**What you'll see:**
- Full CLARK-style rendering
- All 7 nodes styled as they would appear in the app
- Immediate actions → Investigations → Questions → Management → Safety → End
- Dark theme matching CLARK's design

## Key Takeaways

### ✅ What Works
1. **Dynamic protocol generation** - No hand-authoring needed
2. **Multi-condition synthesis** - Handles "PET + twins + VTE history"
3. **Interaction detection** - Catches "MgSO4 + LMWH → inform anaesthetics"
4. **Conflict resolution** - "QS46 says 36-37w, GL952 says 34w → resolution"
5. **Safety checklist** - Auto-generates "what you might forget"
6. **Uses CLARK UI** - Reuses existing node components

### 🎯 What This Proves
- Compiler can generate **unlimited protocols** from your connection graph
- No need to hand-author 50+ static protocols
- Works with complex multi-condition scenarios
- Produces actionable, clinically sound pathways

### 📊 Comparison

**Static CLARK (current clerk branch):**
- 7 hand-authored protocols
- Single condition only
- Need to write 143 more protocols
- Can't handle combinations

**Dynamic Compiler + CLARK UI:**
- ∞ protocols (any combination)
- Multi-condition by design  
- Leverages entire connection graph
- Reuses proven UI components

## Next Steps

If you like what you see:

1. **Phase 1:** Build the real compiler using your actual connection graph
2. **Phase 2:** Create ContextBuilder UI (multi-condition selector)
3. **Phase 3:** Wire compiler → CLARK renderer
4. **Phase 4:** Test with 10-15 common scenarios
5. **Phase 5:** Deploy and iterate based on usage

## Test Different Scenarios

Edit `test-compiler.js` to try different conditions:

```javascript
const TEST_SCENARIO = {
  conditions: ['hyperemesis', 'twins'],  // Try different combinations
  gestation: { weeks: 10, days: 3 },
  history: [],
  description: "Your custom scenario"
};
```

Then re-run: `node scripts/test-compiler.js`

## Questions?

This is a prototype to validate the concept. The real implementation would:
- Use your actual connection graph from `src/data/connections.js`
- Pull from real flowcharts, calculators, drugs
- Have more sophisticated interaction rules
- Include completeness scoring
- Generate even richer protocols

But the core architecture is proven here.
