// Isolated regression check for ward bed-label generation & grouping.
//
// Guards the four bay/bed label-kind combinations against the "1a/1b" support
// gap and the "11" collision: numbered bays with lettered OR numbered beds must
// produce unambiguous labels that still group under their bay. Runs in Node
// against the real source (no browser). Writes results/wardlabels.json.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const { gridBeds, groupBedsBySection } = await import("../src/utils/wardLayouts.js");

const findings = [];
const notes = [];
const fail = (id, msg) => findings.push({ id, severity: "data", msg });

function sectionsOf(beds) {
  return groupBedsBySection(beds.map((b) => ({ bed: b, open: 0, urgent: 0 })))
    .map((g) => ({ title: g.title, beds: g.beds.map((r) => r.bed) }));
}

// Each case: [name, section, expectedBeds, expectedSectionTitles]
const cases = [
  ["numbered bays / lettered beds (the 1a/1b/1c/1d ask)",
    { type: "grid", bayKind: "number", bedKind: "letter", bays: ["1", "2"], perBay: 4 },
    ["1A", "1B", "1C", "1D", "2A", "2B", "2C", "2D"],
    ["Bay 1", "Bay 2"]],
  ["numbered bays / numbered beds (was the '11' collision)",
    { type: "grid", bayKind: "number", bedKind: "number", bays: ["1", "2"], perBay: 3 },
    ["1-1", "1-2", "1-3", "2-1", "2-2", "2-3"],
    ["Bay 1", "Bay 2"]],
  ["lettered bays / numbered beds (default A1)",
    { type: "grid", bayKind: "letter", bedKind: "number", bays: ["A", "B"], perBay: 4 },
    ["A1", "A2", "A3", "A4", "B1", "B2", "B3", "B4"],
    ["Bay A", "Bay B"]],
  ["lettered bays / lettered beds",
    { type: "grid", bayKind: "letter", bedKind: "letter", bays: ["A", "B"], perBay: 3 },
    ["A-A", "A-B", "A-C", "B-A", "B-B", "B-C"],
    ["Bay A", "Bay B"]],
];

for (const [name, section, expectedBeds, expectedTitles] of cases) {
  const beds = gridBeds(section);
  if (JSON.stringify(beds) !== JSON.stringify(expectedBeds)) {
    fail("labels", `${name}: labels ${JSON.stringify(beds)} != expected ${JSON.stringify(expectedBeds)}`);
    continue;
  }
  const sections = sectionsOf(beds);
  const titles = sections.map((s) => s.title);
  if (JSON.stringify(titles) !== JSON.stringify(expectedTitles)) {
    fail("grouping", `${name}: grouped under ${JSON.stringify(titles)} != expected ${JSON.stringify(expectedTitles)} (a single "Beds" section here means the bay grouping was lost)`);
    continue;
  }
  // No two beds should collide.
  if (new Set(beds).size !== beds.length) fail("collision", `${name}: duplicate/ambiguous labels in ${JSON.stringify(beds)}`);
}

// Cross-config uniqueness: bay 1 bed 1 must differ from bay 1 bed 11 and bay 11 bed 1.
const b = (bays, per) => gridBeds({ type: "grid", bayKind: "number", bedKind: "number", bays, perBay: per });
const b1b1 = b(["1"], 1)[0];               // "1-1"
const b1b11 = b(["1"], 11)[10];            // "1-11"
const b11b1 = b(["11"], 1)[0];             // "11-1"
if (new Set([b1b1, b1b11, b11b1]).size !== 3)
  fail("ambiguity", `bay1/bed1 (${b1b1}), bay1/bed11 (${b1b11}), bay11/bed1 (${b11b1}) are not all distinct`);
else notes.push(`Unambiguous: bay1bed1=${b1b1}, bay1bed11=${b1b11}, bay11bed1=${b11b1}.`);

const out = { ranAt: new Date().toISOString(), findings, notes };
mkdirSync(join(HERE, "results"), { recursive: true });
writeFileSync(join(HERE, "results", "wardlabels.json"), JSON.stringify(out, null, 2));

console.log("── Ward bed-label grid check ──");
if (findings.length === 0) console.log("✓ All four bay/bed label combinations generate unambiguous, correctly-grouped beds.");
else { console.log(`✗ ${findings.length} finding(s):`); for (const f of findings) console.log(`  [${f.severity}] ${f.id}: ${f.msg}`); }
for (const n of notes) console.log(`  ⚑ ${n}`);
