// House-style linter for On Call sim cases, enforcing the rules the sim-author
// skill promises so fifty scenarios read as one product. Structural/traceability
// checks live in simCheck.test.js; this file covers prose style and consistency.
// Run:  npx vitest run src/data/simStyleCheck.test.js
import { test, expect } from "vitest";
import { SIM_CASES } from "./simCases";

// Every authored string in a case (NOT flowchart-derived option text, which is
// guideline content checked elsewhere).
function authoredStrings(c) {
  const out = [];
  const push = (...xs) => xs.forEach(x => { if (typeof x === "string") out.push(x); });
  push(c.title, c.intro, c.setting, c.room);
  if (c.patient) push(c.patient.name, c.patient.firstName, c.patient.details, c.patient.history);
  for (const b of c.beats) {
    push(b.title, b.narrative, b.question, b.summary, b.evidence);
    (b.dialogue ?? []).forEach(d => push(d.text));
    (b.options ?? []).forEach(o => push(o.label, o.sublabel)); // inline only
    (b.items ?? []).forEach(it => push(it.label, it.why));
    (b.points ?? []).forEach(p => push(p));
    (b.links ?? []).forEach(l => push(l.label));
    push(b.why);
    if (b.source && typeof b.source === "object") push(b.source.label);
  }
  return out;
}

test("no em dashes anywhere in authored text", () => {
  const bad = [];
  for (const c of SIM_CASES) {
    for (const s of authoredStrings(c)) {
      if (s.includes("—")) bad.push(`${c.id}: em dash in "${s.slice(0, 60)}…"`);
    }
  }
  if (bad.length) console.log("\nEM DASHES:\n" + bad.join("\n") + "\n");
  expect(bad).toEqual([]);
});

// Clearly-clinical US spellings that must be the British form. Deliberately
// conservative to avoid false positives (e.g. -ise/-ize is not policed).
const US_SPELLINGS = [
  /\bhemorrhag/i, /\bpediatric/i, /\banesthe/i, /\banaesth?esia\b(?!)/i,
  /\bedema/i, /\bestrogen/i, /\bestradiol/i, /\bgynecolog/i, /\banemia/i,
  /\bhematolog/i, /\bleukemia/i, /\bdiarrhea/i, /\besophag/i, /\btumor\b/i,
  /\blabor\b/i, /\bcatheteriz/i, /\bfetus\b(?!)/i,
];

test("British English spelling in authored text", () => {
  const bad = [];
  for (const c of SIM_CASES) {
    for (const s of authoredStrings(c)) {
      for (const re of US_SPELLINGS) {
        if (re.test(s)) bad.push(`${c.id}: "${s.match(re)[0]}" in "${s.slice(0, 50)}…" (use the British spelling)`);
      }
    }
  }
  if (bad.length) console.log("\nUS SPELLINGS:\n" + bad.join("\n") + "\n");
  expect(bad).toEqual([]);
});

test("cases carry the required metadata", () => {
  for (const c of SIM_CASES) {
    expect(c.difficulty, `${c.id}: needs a difficulty (1|2|3)`).toBeTruthy();
    expect(c.patient?.name?.toLowerCase(), `${c.id}: patient name must be marked (fictional)`).toContain("fictional");
    expect(c.patient?.firstName, `${c.id}: patient needs a firstName`).toBeTruthy();
    expect(c.setting, `${c.id}: needs a setting`).toBeTruthy();
  }
});

test("shift clock never runs backwards", () => {
  const toMin = t => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
  const bad = [];
  for (const c of SIM_CASES) {
    let last = -1, lastStr = "";
    for (const b of c.beats) {
      if (!b.time) continue;
      const m = toMin(b.time);
      if (m < last) bad.push(`${c.id}: time ${b.time} is before ${lastStr}`);
      last = m; lastStr = b.time;
    }
  }
  if (bad.length) console.log("\nCLOCK:\n" + bad.join("\n") + "\n");
  expect(bad).toEqual([]);
});
