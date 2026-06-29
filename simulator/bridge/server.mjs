// Persistent bridge: read one session JSON per line on stdin, return the REAL
// app engine's NOW prompt as JSON on stdout. Started once by the Python loop.
import readline from "node:readline";
import { computeNextPrompt } from "../../apps/pocket-og/src/components/EmergencyPage.jsx";
import { emptyJointArrestState } from "../../apps/pocket-og/src/data/emergency/cardiac-arrest-shared.js";

// Extract a JSON-safe view of the engine's prompt object.
function serializePrompt(p) {
  if (!p) return { type: null };
  return {
    type: p.type,
    taskId: p.task?.id ?? null,
    title: p.task?.title ?? null,
    special: p.task?.special ?? null,
    uterotonic: p.task?.uterotonic ?? null,
    nextTaskId: p.nextTask?.id ?? null,
    rate: p.rate ?? null,
    interval: p.interval ?? null,
    dose: p.dose ?? null,
    early: p.early ?? null,
  };
}

// Rebuild the non-JSON fields the engine needs from a plain session object.
function hydrate(s) {
  return {
    ...s,
    undoPromptHold: new Set(s.undoPromptHold || []),
    ciCleared: s.ciCleared || {},
    forcedTasks: s.forcedTasks || [],
    jointArrest: emptyJointArrestState(),   // PPH-only mode for now
  };
}

const rl = readline.createInterface({ input: process.stdin });
process.stdout.write(JSON.stringify({ ready: true }) + "\n");
rl.on("line", (line) => {
  line = line.trim();
  if (!line) return;
  try {
    const session = hydrate(JSON.parse(line));
    const prompt = computeNextPrompt(session);
    process.stdout.write(JSON.stringify(serializePrompt(prompt)) + "\n");
  } catch (e) {
    process.stdout.write(JSON.stringify({ error: String(e) }) + "\n");
  }
});
