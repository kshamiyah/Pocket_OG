// OUH Guides content checks.
//  1. Every chart is a valid Pocket O&G flowchart: links resolve, every node is
//     reachable, every decision and end node cites a source page that exists.
//  2. Scenario walks: each row of the reviewed rule table (GS32 Figures 1 to 4,
//     Tables 4 to 6, Figure 2; GS69) reaches the expected outcome.
// Run from apps/ouh-guides:  ../../node_modules/.bin/vitest run
import { test, expect } from "vitest";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { OUH_FLOWCHARTS } from "./guides";

const PUBLIC = fileURLToPath(new URL("../../public", import.meta.url));

test("every chart is a well-formed, fully reachable flowchart with cited pages", () => {
  const problems = [];
  let nodesChecked = 0;
  for (const fc of Object.values(OUH_FLOWCHARTS)) {
    if (!fc.nodes[fc.startId]) problems.push(`${fc.id}: missing start ${fc.startId}`);
    const seen = new Set();
    const walk = id => {
      if (seen.has(id)) return;
      seen.add(id);
      const n = fc.nodes[id];
      if (!n) { problems.push(`${fc.id}: link to missing node ${id}`); return; }
      nodesChecked++;
      if (n.type === "decision") {
        if (!n.options?.length) problems.push(`${fc.id}.${id}: decision without options`);
        n.options?.forEach(o => walk(o.next));
      } else if (n.type === "action" || n.type === "alert") {
        if (!n.next) problems.push(`${fc.id}.${id}: ${n.type} without next`);
        else walk(n.next);
      } else if (n.type !== "end") problems.push(`${fc.id}.${id}: unknown type ${n.type}`);
      if ((n.type === "decision" || n.type === "end") && !n.sources?.length) problems.push(`${fc.id}.${id}: no source citation`);
      for (const s of n.sources ?? []) if (!existsSync(PUBLIC + s.href)) problems.push(`${fc.id}.${id}: missing page image ${s.href}`);
      const text = JSON.stringify(n);
      if (text.includes("—")) problems.push(`${fc.id}.${id}: em dash`);
    };
    walk(fc.startId);
    for (const id of Object.keys(fc.nodes)) if (!seen.has(id)) problems.push(`${fc.id}: unreachable node ${id}`);
  }
  expect(nodesChecked).toBeGreaterThan(60);
  expect(problems).toEqual([]);
});

// Follow a path of option labels (prefix match) through a chart; actions and
// alerts are passed through automatically. Returns the final node id.
function walk(chartId, picks) {
  const fc = OUH_FLOWCHARTS[chartId];
  let id = fc.startId;
  const queue = [...picks];
  for (let guard = 0; guard < 50; guard++) {
    const n = fc.nodes[id];
    if (n.type === "end") {
      if (queue.length) throw new Error(`${chartId}: reached ${id} with unused picks ${queue.join(" | ")}`);
      return id;
    }
    if (n.type === "action" || n.type === "alert") { id = n.next; continue; }
    const pick = queue.shift();
    if (pick === undefined) throw new Error(`${chartId}: ran out of picks at ${id}`);
    const opt = n.options.find(o => o.label.startsWith(pick));
    if (!opt) throw new Error(`${chartId}.${id}: no option starting "${pick}"`);
    id = opt.next;
  }
  throw new Error("loop");
}
const end = (chart, picks) => OUH_FLOWCHARTS[chart].nodes[walk(chart, picks)];

test("20-week allocation follows Figure 1 and Table 3", () => {
  const A = "OUH_GS32_ALLOCATION";
  expect(walk(A, ["Twins"])).toBe("multiple");
  expect(walk(A, ["Singleton", "Yes"])).toBe("end-low-growth");
  expect(end(A, ["Singleton", "Yes"]).items.join(" ")).toMatch(/3\.5 or more, request Pathway D2/);
  expect(walk(A, ["Singleton", "No", "Yes: unicornuate"])).toBe("end-unicornuate");
  expect(end(A, ["Singleton", "No", "Yes: unicornuate"]).items.join(" ")).toMatch(/at or before 25 weeks/);
  // Bicornuate or arcuate: Preterm Labour Clinic, then on through PI and risk factors.
  expect(walk(A, ["Singleton", "No", "Yes: bicornuate", "Below 2.5", "No risk"])).toBe("end-a");
  expect(walk(A, ["Singleton", "No", "No", "Below 2.5", "No risk"])).toBe("end-a");
  expect(walk(A, ["Singleton", "No", "No", "Below 2.5", "Any risk"])).toBe("end-c");
  expect(walk(A, ["Singleton", "No", "No", "2.5 or more", "No risk"])).toBe("end-d0");
  expect(walk(A, ["Singleton", "No", "No", "2.5 or more", "Any risk"])).toBe("end-d1");
  expect(walk(A, ["Singleton", "No", "No", "3.0 or more"])).toBe("end-d1");
  expect(walk(A, ["Singleton", "No", "No", "3.5 or more"])).toBe("end-d2");
  expect(end(A, ["Singleton", "No", "No", "Below 2.5", "No risk"]).text).toBe("36-week scan.");
  expect(end(A, ["Singleton", "No", "No", "Below 2.5", "Any risk"]).text).toBe("32-, 36- and 39-week scans.");
  expect(end(A, ["Singleton", "No", "No", "2.5 or more", "No risk"]).text).toBe("28-, 32- and 36-week scans.");
  expect(end(A, ["Singleton", "No", "No", "3.0 or more"]).text).toBe("28-, 32-, 36- and 39-week scans.");
});

test("growth scan findings follow Tables 4, 5 and 6, including EFW below the 3rd centile", () => {
  const G = "OUH_GS32_GROWTH";
  // Table 4 (24+0 to 34+6)
  expect(end(G, ["24+0", "Absent"]).title).toBe("Needs Same-Day Obstetric Review");
  expect(end(G, ["24+0", "PI above"]).title).toBe("Refer to FMU");
  expect(end(G, ["24+0", "Normal", "CPR below"]).title).toBe("Refer to FMU");
  expect(walk(G, ["24+0", "Normal", "Normal", "EFW below the 3rd"])).toBe("t4-efw3");
  expect(end(G, ["24+0", "Normal", "Normal", "EFW below the 3rd"]).title).toBe("Refer to FMU");
  expect(walk(G, ["24+0", "Normal", "Normal", "EFW 3rd to 9th"])).toBe("t4-sga");
  expect(walk(G, ["24+0", "Normal", "Normal", "EFW above"])).toBe("t4-large");
  expect(walk(G, ["24+0", "Normal", "Normal", "Normal"])).toBe("t4-normal");
  // Table 5 (35+0 to 36+6): EFW below the 3rd centile goes to DAU like any EFW below the 10th
  expect(end(G, ["35+0", "Absent"]).title).toBe("Needs Immediate Obstetric Review");
  expect(end(G, ["35+0", "PI above"]).title).toBe("Needs Same-Day Obstetric Review");
  expect(walk(G, ["35+0", "Normal", "Normal", "EFW or AC below"])).toBe("t5-dau");
  expect(OUH_FLOWCHARTS[G].nodes["t5-growth"].options[0].sublabel).toMatch(/below the 3rd centile/);
  expect(walk(G, ["35+0", "Normal", "Normal", "ACGV"])).toBe("t5-dau");
  expect(walk(G, ["35+0", "Normal", "Normal", "EFW above"])).toBe("t5-large");
  expect(walk(G, ["35+0", "Normal", "Normal", "EFW 10th to 19th"])).toBe("t5-1019");
  expect(walk(G, ["35+0", "Normal", "Normal", "EFW at or above the 20th"])).toBe("t5-normal");
  // Table 6 (37+0 or later)
  expect(end(G, ["37+0", "Absent"]).title).toBe("Needs Immediate Obstetric Review");
  expect(walk(G, ["37+0", "Normal", "Normal", "EFW or AC below"])).toBe("t6-dau");
  expect(walk(G, ["37+0", "Normal", "Normal", "ACGV"])).toBe("t6-dau");
  expect(walk(G, ["37+0", "Normal", "Normal", "EFW 10th to 19th"])).toBe("t6-1019");
  expect(walk(G, ["37+0", "Normal", "Normal", "EFW at or above the 20th"])).toBe("t6-normal");
  // MCA anaemia referral is shown alongside every growth result, never instead of it
  for (const id of ["t4-sga", "t5-dau", "t6-normal", "t4-aredf"]) {
    expect(OUH_FLOWCHARTS[G].nodes[id].items.join(" ")).toMatch(/Vmax above 100 cm\/s: refer to FMU/);
  }
});

test("liquor volume follows Figure 2", () => {
  const L = "OUH_GS32_LIQUOR";
  expect(walk(L, ["2 cm or more"])).toBe("end-normal");
  expect(walk(L, ["Below 2 cm", "Yes"])).toBe("end-oligo-other");
  expect(walk(L, ["Below 2 cm", "No"])).toBe("end-oligo");
  expect(walk(L, ["8 cm", "Below 25"])).toBe("end-normal");
  expect(walk(L, ["8 cm", "25 cm", "Yes"])).toBe("end-diabetes");
  expect(walk(L, ["8 cm", "25 cm", "No", "Before 35", "Yes"])).toBe("end-no-action");
  expect(walk(L, ["8 cm", "25 cm", "No", "Before 35", "No"])).toBe("end-cmw");
  expect(walk(L, ["8 cm", "25 cm", "No", "35+0", "No"])).toBe("end-anc");
  expect(walk(L, ["8 cm", "25 cm", "No", "35+0", "Yes"])).toBe("end-diabetes");
  expect(walk(L, ["8 cm", "Above 30", "Yes"])).toBe("end-diabetes");
  expect(walk(L, ["8 cm", "Above 30", "No"])).toBe("end-fmu");
});

test("late FGR timing of birth follows every box of Figures 3 and 4", () => {
  const F = "OUH_GS32_LATE_FGR";
  // Each box of the figure as a path: the finding, then (only where Table 7
  // changes the outcome) the risk factor answer.
  const fig3 = [
    [["UmbA AREDF"], "f3-aredf"],
    [["EFW below the 1st"], "f3-urgent"],
    [["EFW below the 10th centile and any"], "f3-urgent"],
    [["EFW at or above the 10th centile but"], "f3-doppler"],
    [["EFW 1st to 2nd"], "f3-efw12"],
    [["EFW 3rd to 9th", "One or more"], "f3-efw12"],
    [["EFW 3rd to 9th", "No risk"], "f3-39"],
    [["Isolated AC"], "f3-39"],
    [["ACGV reduction of 40 centiles or more and EFW 10th to 19th", "One or more"], "f3-39"],
    [["ACGV reduction of 40 centiles or more and EFW 10th to 19th", "No risk"], "f3-40"],
    [["ACGV reduction of 40 centiles or more and EFW at or above the 20th", "One or more"], "f3-40"],
    [["ACGV reduction of 40 centiles or more and EFW at or above the 20th", "No risk"], "f3-41"],
  ];
  for (const [picks, out] of fig3) {
    expect(walk(F, ["35+0", ...picks])).toBe(out);
    expect(walk(F, ["37+0", ...picks])).toBe(out.replace("f3", "f4"));
  }
  const n = OUH_FLOWCHARTS[F].nodes;
  expect(n["f3-urgent"].text).toMatch(/before 37\+0/);
  expect(n["f3-efw12"].text).toMatch(/37\+0 to 37\+6/);
  expect(n["f3-doppler"].text).toMatch(/on-call consultant obstetrician/);
  expect(n["f3-39"].text).toMatch(/Rescan in 2 weeks.*39\+0 to 39\+6/);
  expect(n["f3-40"].text).toMatch(/40\+0 to 40\+6/);
  expect(n["f3-41"].text).toMatch(/41\+0 to 41\+3/);
  for (const id of ["f4-urgent", "f4-doppler", "f4-efw12"]) expect(n[id].text).toMatch(/Recommend urgent birth/);
  expect(n["f4-39"].text).not.toMatch(/Rescan/);
  expect(n["f4-40"].text).toMatch(/unless birth is planned before this/);
  // Risk factors are asked only where they change the outcome, never up front.
  expect(n["f3-check"].items).toBeUndefined();
  for (const id of ["f3-check", "f4-check"]) {
    expect(n[id].measures.map(m => m.label)).toEqual(["Uterine artery PI", "EFW", "AC", "ACGV", "UmbA EDF", "UmbA PI", "CPR", "Liquor MVP"]);
  }
  expect(n["f4-box"].options.filter(o => o.next.includes("-rf-")).length).toBe(3);
  // Table 7 lists the ACGV fall itself; the ACGV questions say the guideline is silent on it rather than deciding.
  for (const id of ["f3-rf-acgv-1019", "f4-rf-acgv-20"]) {
    expect(n[id].items.join(" ")).toMatch(/ACGV reduction of 40 centiles/);
    expect(n[id].text).toMatch(/does not say whether it counts/);
  }
  expect(n["f4-rf-efw"].text).not.toMatch(/does not say/);
});

test("multiple pregnancy follows GS69", () => {
  const M = "OUH_GS69_SCANS";
  expect(OUH_FLOWCHARTS[M].nodes[OUH_FLOWCHARTS[M].startId].type).toBe("alert");
  expect(walk(M, ["Triplets"])).toBe("end-higher");
  expect(walk(M, ["Twins", "Dichorionic"])).toBe("end-dc");
  expect(walk(M, ["Twins", "Monochorionic diamniotic"])).toBe("end-mcda");
  expect(walk(M, ["Twins", "Monochorionic monoamniotic"])).toBe("end-mcma");
  expect(walk(M, ["Twins", "Uncertain"])).toBe("end-uncertain");
  const n = OUH_FLOWCHARTS[M].nodes;
  expect(n["end-dc"].text).toMatch(/24, 28, 32 and 36 weeks/);
  expect(n["end-mcda"].items.join(" ")).toMatch(/weekly if membrane folding, size discordance above 20%, sIUGR, or any twin with EFW below the 10th centile/);
  expect(n["end-mcma"].items.join(" ")).toMatch(/32\+0 and 33\+6/);
  expect(JSON.stringify(n["end-mcma"])).not.toMatch(/individuali/);
});
