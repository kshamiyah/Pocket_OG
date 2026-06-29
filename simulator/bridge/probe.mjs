// Headless probe: call the REAL app engine outside the browser.
import { computeNextPrompt, TASKS } from "../../apps/pocket-og/src/components/EmergencyPage.jsx";
import { emptyJointArrestState } from "../../apps/pocket-og/src/data/emergency/cardiac-arrest-shared.js";

const session = {
  taskStates: {}, level: "minor", toneAssessed: false,
  log: [{ kind: "blood_loss", total: 600, time: 0 }],
  txaTime: null, txaHandled: false, txaSecondDone: false,
  effectiveBirthTime: 0, carboCount: 0, carboLastTime: null,
  ciCleared: {}, forcedTasks: [], now: 0,
  uterotonicHold: false, uterotonicEscalate: null, queuedUterotonicId: null,
  ivAccessPendingSince: null, ivAccessRetries: 0, ivFailSnoozeUntil: null,
  infusionReassess: false, sessionRecoveredAt: null, forcedFollowUpId: null,
  jointArrest: emptyJointArrestState(), undoPromptHold: new Set(),
};

const prompt = computeNextPrompt(session);
console.log("TASKS loaded:", TASKS.length);
console.log("First NOW prompt:", JSON.stringify({ type: prompt?.type, taskId: prompt?.task?.id, title: prompt?.task?.title }));
