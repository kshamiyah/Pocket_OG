// Integrity check for On Call sim cases: every flowchart-derived question must
// point at a real decision node with a valid correct-option index, every
// authored question must have a resolvable answer, and every lesson link must
// land somewhere. Run:  npx vitest run src/data/simCheck.test.js
import { test, expect } from "vitest";
import { SIM_CASES, nodeOptions } from "./simCases";
import { FLOWCHARTS } from "./flowcharts";
import { GUIDELINES } from "@pocket-og/guidelines";
import * as GL from "@pocket-og/guidelines";
import { READER_AVAILABLE } from "./readerAvailable";

// gl code → set of its section ids, so a source receipt can be verified to
// point at a section that actually exists in the repo.
const SECTION_IDS = {};
for (const [name, val] of Object.entries(GL)) {
  if (!name.endsWith("_SECTIONS") || !Array.isArray(val)) continue;
  for (const section of val) {
    if (!section.gl || !section.id) continue;
    (SECTION_IDS[section.gl] ??= new Set()).add(section.id);
  }
}

// A source receipt must be a live link into a repo guideline: the guide must be
// reader-available and the section id must exist in it. This is the rule that
// backs every right/wrong verdict in the app.
function expectValidReceipt(source, where) {
  expect(typeof source, `${where}: source must be a { gl, sectionId, label } receipt`).toBe("object");
  expect(READER_AVAILABLE.has(source.gl), `${where}: no reader for ${source.gl}`).toBe(true);
  expect(SECTION_IDS[source.gl]?.has(source.sectionId), `${where}: ${source.gl} has no section "${source.sectionId}"`).toBe(true);
  expect(source.label, `${where}: receipt needs a label`).toBeTruthy();
}

test("sim case ids are unique and guideline codes are real", () => {
  const ids = SIM_CASES.map(c => c.id);
  expect(new Set(ids).size).toBe(ids.length);
  for (const c of SIM_CASES) {
    expect(GUIDELINES[c.gl], `${c.id}: unknown guideline ${c.gl}`).toBeTruthy();
    if (c.difficulty !== undefined) {
      expect([1, 2, 3], `${c.id}: difficulty must be 1, 2 or 3`).toContain(c.difficulty);
    }
  }
});

test("every beat is well-formed and every answer resolves", () => {
  for (const c of SIM_CASES) {
    expect(c.beats.at(-1).kind, `${c.id}: last beat must be the lesson`).toBe("lesson");
    for (const [i, beat] of c.beats.entries()) {
      const where = `${c.id} beat ${i}`;
      if (beat.kind === "choice") {
        if (beat.fromNode) {
          const node = FLOWCHARTS[beat.fromNode.fc]?.nodes?.[beat.fromNode.node];
          expect(node, `${where}: missing node ${beat.fromNode.fc}/${beat.fromNode.node}`).toBeTruthy();
          expect(node.type, `${where}: fromNode must be a decision node`).toBe("decision");
          const opts = nodeOptions(beat.fromNode.fc, beat.fromNode.node);
          expect(opts.length, `${where}: node has no options`).toBeGreaterThan(1);
          expect(beat.answer, `${where}: answer index out of range`).toBeLessThan(opts.length);
        } else {
          expect(beat.options?.length, `${where}: needs at least 2 options`).toBeGreaterThan(1);
          expect(beat.answer, `${where}: answer index out of range`).toBeLessThan(beat.options.length);
        }
        expect(beat.answer, `${where}: answer must be an index`).toBeGreaterThanOrEqual(0);
        expect(beat.why, `${where}: every question needs its reasoning`).toBeTruthy();
        expectValidReceipt(beat.source, where);
      }
      if (beat.kind === "checklist") {
        expect(beat.items.some(it => it.required), `${where}: checklist needs required items`).toBe(true);
        for (const it of beat.items) expect(it.why, `${where}: item "${it.label}" needs a why`).toBeTruthy();
        expectValidReceipt(beat.source, where);
      }
      if (beat.kind === "lesson") {
        for (const l of beat.links ?? []) {
          if (l.type === "flowchart") expect(FLOWCHARTS[l.id], `${where}: dead flowchart link ${l.id}`).toBeTruthy();
          if (l.type === "reader") expect(READER_AVAILABLE.has(l.id), `${where}: no reader for ${l.id}`).toBe(true);
        }
      }
    }
  }
});
