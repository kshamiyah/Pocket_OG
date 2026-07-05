#!/usr/bin/env node

// Test the Stage 1 compiler against a clinical scenario.
// Only CONFIRMED rules are compiled — run review-rules.js confirm first.

import { compileClinicalProtocol } from "../src/compiler/clinicalCompiler.js";

const SCENARIO = process.argv[2] === "hg-twins"
  ? {
      conditions: ["hyperemesis", "twins"],
      gestation: { weeks: 10, days: 3 },
      history: [],
      description: "10+3 weeks, twins, vomiting 15x/day, can't keep fluids down",
    }
  : {
      conditions: ["severe-pet", "twins"],
      gestation: { weeks: 32, days: 2 },
      history: ["previous-vte"],
      description: "32+2 weeks, twins, BP 165/105, previous DVT 2 years ago",
    };

console.log("\n╔══════════════════════════════════════════════════════════════╗");
console.log("║         STAGE 1 COMPILER — TEST RUN                          ║");
console.log("╚══════════════════════════════════════════════════════════════╝\n");
console.log("Scenario:", SCENARIO.description);
console.log("Tip: try `node scripts/test-compiler.js hg-twins` for hyperemesis + twins\n");

const result = compileClinicalProtocol(SCENARIO);

if (!result.protocol) {
  console.log("⚠️  No protocol generated.");
  console.log("Reason:", result.blockedReason);
  console.log("\nPending rules:", result.pendingRules);
  console.log("\n→ Confirm rules first:");
  console.log("   node scripts/review-rules.js list");
  console.log("   node scripts/review-rules.js confirm condition/severe-pet --reviewer \"KS\"");
  process.exit(0);
}

console.log(JSON.stringify(result.protocol, null, 2));
console.log("\nCompleteness:", Math.round(result.completeness.score * 100) + "%");
console.log("Pending rules still in queue:", result.pendingRules.total);
