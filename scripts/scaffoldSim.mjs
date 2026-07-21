// Scaffolder for On Call sim cases. Turns an existing flowchart plus a chosen
// path into a ready-made case skeleton, with the correct answer indices already
// filled in from the flowchart, so an author only has to write the wrapper
// (patient, scene, dialogue, sources). Used by the sim-author skill.
//
// Usage, from the repo root:
//   node scripts/scaffoldSim.mjs <FLOWCHART_ID>
//       → prints a MAP of the flowchart: its decision nodes, each option
//         indexed, and where each leads. Use it to choose a path.
//
//   node scripts/scaffoldSim.mjs <FLOWCHART_ID> --path 2,1,0
//       → walks the flowchart from the start, taking option 2 at the first
//         decision, 1 at the next, 0 at the next, and prints a case skeleton
//         (a simCases.js entry) with those answers pre-filled.
//
// The skeleton is intentionally full of TODOs: the medicine (which answer is
// correct at each decision) is inherited from the flowchart; the wrapper is the
// author's job. Nothing here invents clinical content.

// The app source uses extensionless imports; register a resolver hook so Node
// can load it, then pull the registries in dynamically (after the hook is live).
import { register } from "node:module";
register("./extlessLoader.mjs", import.meta.url);
const { FLOWCHARTS } = await import("../apps/pocket-og/src/data/flowcharts.js");
const { READER_AVAILABLE } = await import("../apps/pocket-og/src/data/readerAvailable.js");

const [, , fcId, ...rest] = process.argv;

if (!fcId) {
  console.error("Usage: node scripts/scaffoldSim.mjs <FLOWCHART_ID> [--path 2,1,0]");
  console.error("Tip: run without --path first to see the flowchart map.");
  process.exit(1);
}

const fc = FLOWCHARTS[fcId];
if (!fc) {
  console.error(`Unknown flowchart id "${fcId}".`);
  const near = Object.keys(FLOWCHARTS).filter(id => id.toLowerCase().includes(fcId.toLowerCase().split("_")[0])).slice(0, 10);
  if (near.length) console.error(`Did you mean one of:\n  ${near.join("\n  ")}`);
  process.exit(1);
}

// Best-guess guideline code from the flowchart's subtitle ("GTG52 · ...") or id.
function guessGl() {
  const fromSub = fc.subtitle?.split("·")[0]?.trim();
  if (fromSub && /^[A-Z]/.test(fromSub) && !fromSub.includes(" ")) return fromSub;
  return fcId.split("_")[0];
}
const gl = guessGl();
const readerNote = READER_AVAILABLE.has(gl) ? "" : "  // WARN: no reader for this gl — receipts cannot open; fix gl or add a reader";

// ── Map mode: print the flowchart's decision points ─────────────────────────
function printMap() {
  console.log(`\nFlowchart: ${fc.title}  (${fcId})`);
  console.log(`Subtitle:  ${fc.subtitle ?? "-"}`);
  console.log(`Guessed gl: ${gl}${READER_AVAILABLE.has(gl) ? "" : "  (NOT reader-available — check this)"}`);
  console.log(`Start:     ${fc.startId}\n`);
  console.log("Decision nodes (these become questions):\n");
  for (const [id, node] of Object.entries(fc.nodes)) {
    if (node.type !== "decision") continue;
    console.log(`  ${id}  —  "${node.title ?? ""}"`);
    (node.options ?? []).forEach((o, i) => {
      console.log(`     [${i}] ${o.label}  → ${o.next}`);
    });
    console.log("");
  }
  console.log("Pick a path (one option index per decision you want in the case), e.g.:");
  console.log(`  node scripts/scaffoldSim.mjs ${fcId} --path 2,1\n`);
}

// ── Walk mode: follow a path and emit a skeleton ────────────────────────────
function walk(pathIdx) {
  const decisions = [];       // { nodeId, chosenIndex, node }
  let currentId = fc.startId;
  let step = 0;
  const guard = new Set();

  while (currentId && !guard.has(currentId)) {
    guard.add(currentId);
    const node = fc.nodes[currentId];
    if (!node) break;

    if (node.type === "decision") {
      const choice = pathIdx[step];
      if (choice === undefined) break;              // path ran out; stop here
      const opt = node.options?.[choice];
      if (!opt) {
        console.error(`Path error: node "${currentId}" has no option [${choice}] (it has ${node.options?.length ?? 0}).`);
        process.exit(1);
      }
      decisions.push({ nodeId: currentId, chosenIndex: choice, node });
      step++;
      currentId = opt.next;
    } else if (node.type === "end") {
      break;
    } else {
      // action / alert / classifier: a pathway step, not a question — skip it
      currentId = node.next ?? (node.type === "classifier" ? undefined : undefined);
      if (!currentId) break;
    }
  }

  if (decisions.length === 0) {
    console.error("No decision nodes were reached with that path. Check the map and the --path indices.");
    process.exit(1);
  }
  return decisions;
}

function skeleton(decisions) {
  const idBase = `${fcId.toLowerCase().replace(/_/g, "-")}`;
  const beats = [];

  beats.push(`      {
        kind: "info",
        time: "TODO",            // e.g. "18:40"
        title: "TODO arrival",
        narrative: "TODO: set the scene — who is in front of you, what has just happened.",
        // dialogue: [{ who: "midwife", text: "TODO handover line" }],
        // obs / bedside: add the observations that matter here
      },`);

  decisions.forEach((d, i) => {
    beats.push(`      {
        kind: "choice",
        time: "TODO",
        narrative: "TODO: what the author sees / the patient says at this step.",
        question: "TODO: the call to action (not a restatement of the vignette).",
        fromNode: { fc: ${JSON.stringify(fcId)}, node: ${JSON.stringify(d.nodeId)} },
        answer: ${d.chosenIndex},   // inherited from the flowchart: "${d.node.options[d.chosenIndex].label}"
        why: "TODO: the reasoning, staying within what the cited section supports.",
        source: { gl: ${JSON.stringify(gl)}, sectionId: "TODO", label: "TODO: ${gl} · section" },${readerNote}
      },`);
  });

  const readerLink = READER_AVAILABLE.has(gl)
    ? `\n          { type: "reader", id: ${JSON.stringify(gl)}, label: "TODO: ${gl} full guide" },`
    : "";

  beats.push(`      {
        kind: "lesson",
        title: "TODO: the lesson",
        summary: "TODO: one or two sentences on how the case resolved.",
        points: [
          "TODO takeaway 1",
          "TODO takeaway 2",
        ],
        // evidence: "TODO: the trial or evidence base, if there is one.",
        links: [
          { type: "flowchart", id: ${JSON.stringify(fcId)}, label: ${JSON.stringify(fc.title)} },${readerLink}
        ],
      },`);

  return `  {
    id: "${idBase}-TODO",           // <setting>-<topic>-<detail>, kebab-case, unique
    title: "TODO",
    setting: "TODO",                // "Maternity Assessment Unit" | "Delivery Suite" | "Antenatal Clinic"
    gl: ${JSON.stringify(gl)},
    difficulty: 2,                  // 1 | 2 | 3 — see the difficulty rubric
    room: "TODO",
    intro: "A midwife hands you the triage card for the next patient. All patients in this simulation are fictional.",
    patient: {
      name: "TODO (fictional)",     // MUST carry "(fictional)"
      firstName: "TODO",
      details: "TODO",              // e.g. "32 · G2 P1 · 34+2 weeks"
      history: "TODO: the one line that makes this case teach.",
    },
    beats: [
${beats.join("\n")}
    ],
  },`;
}

// ── Run ─────────────────────────────────────────────────────────────────────
const pathArgIdx = rest.indexOf("--path");
if (pathArgIdx === -1) {
  printMap();
} else {
  const raw = rest[pathArgIdx + 1];
  if (!raw) { console.error("--path needs indices, e.g. --path 2,1,0"); process.exit(1); }
  const pathIdx = raw.split(",").map(s => Number(s.trim()));
  if (pathIdx.some(n => Number.isNaN(n))) { console.error(`Bad --path "${raw}". Use comma-separated integers.`); process.exit(1); }
  const decisions = walk(pathIdx);
  console.log(`// Scaffolded from ${fcId} · path [${pathIdx.join(", ")}] · ${decisions.length} decision beat(s).`);
  console.log("// Paste into SIM_CASES in apps/pocket-og/src/data/simCases.js, then fill every TODO.");
  console.log("// The answer indices are inherited from the flowchart; do NOT change them without re-checking the pathway.\n");
  console.log(skeleton(decisions));
}
