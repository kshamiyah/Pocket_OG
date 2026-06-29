/**
 * Exhaustive path explorer for PPH computeNextPrompt state machine.
 * Extracted logic mirrors EmergencyPage.jsx (handover-doc-review branch).
 */

const TASKS = [
  { id: "call_team", level: "minor", followUpDelay: 90 },
  { id: "abc", level: "minor" },
  { id: "iv_access", level: "minor", followUpDelay: 90 },
  { id: "fundal_massage", level: "minor" },
  { id: "bimanual", level: "minor", followUpDelay: 90, deps: ["fundal_massage"] },
  { id: "trauma_assess", level: "minor", assess: { treatment: "suture" } },
  { id: "suture", level: "minor", hidden: true, followUpDelay: 300, followUpEscalate: "theatre" },
  { id: "tissue_assess", level: "minor", assess: { treatment: "manual_removal" } },
  { id: "manual_removal", level: "minor", hidden: true, followUpDelay: 300 },
  { id: "catheterise", level: "minor" },
  { id: "iv_fluids", level: "minor", deps: ["iv_access"] },
  { id: "oxytocin_bolus", level: "minor", deps: ["iv_access"] },
  { id: "oxytocin_inf", level: "minor", deps: ["iv_access"] },
  { id: "ergometrine", level: "minor", deps: ["iv_access"], contraindications: ["Hypertension"], fallback: "carboprost" },
  { id: "coag_review", level: "minor", deps: ["iv_access"] },
  { id: "call_major", level: "major", followUpDelay: 90, critical: true },
  { id: "second_cannula", level: "major", followUpDelay: 90, critical: true },
  { id: "txa", level: "major", followUpDelay: 90, critical: true, special: "txa", deps: ["iv_access"] },
  { id: "rapid_cryst", level: "major", deps: ["iv_access"] },
  { id: "blood_products", level: "major", deps: ["iv_access"] },
  { id: "keep_warm", level: "major" },
  { id: "calcium", level: "major" },
  { id: "rotem_teg", level: "major", naOption: true },
  { id: "carboprost", level: "major", special: "carbo", contraindications: ["Asthma"], fallback: "misoprostol" },
  { id: "misoprostol", level: "major" },
  { id: "call_massive", level: "massive", followUpDelay: 90, critical: true },
  { id: "mhp_pack", level: "massive", followUpDelay: 90, critical: true, deps: ["iv_access"] },
  { id: "cell_salvage", level: "massive", naOption: true },
  { id: "bakri", level: "massive" },
  { id: "theatre", level: "massive" },
  { id: "cardiac_arrest_ref", level: "massive" },
];

const LEVEL_ORDER = ["minor", "major", "massive"];
const levelVal = (l) => LEVEL_ORDER.indexOf(l);
const getLevel = (ml) => (ml >= 2000 ? "massive" : ml >= 1000 ? "major" : "minor");

function bloodLossRate(log, now, windowMs = 10 * 60 * 1000) {
  const points = log.filter((e) => e.kind === "blood_loss" && typeof e.total === "number");
  if (points.length < 2) return 0;
  const latest = points[points.length - 1];
  const cutoff = now - windowMs;
  let ref = points[0];
  for (const p of points) if (p.time <= cutoff) ref = p;
  const elapsedMin = (latest.time - ref.time) / 60000;
  if (elapsedMin <= 0) return 0;
  return Math.max(0, (latest.total - ref.total) / elapsedMin);
}

function reassessInterval(rate, level) {
  const levelCap = level === "massive" ? 180 : level === "major" ? 240 : 300;
  let rateInterval;
  if (rate >= 150) rateInterval = 60;
  else if (rate >= 50) rateInterval = 120;
  else if (rate >= 10) rateInterval = 180;
  else if (rate >= 1) rateInterval = 300;
  else rateInterval = 420;
  return Math.min(levelCap, rateInterval);
}

function computeNextPrompt(state) {
  const {
    taskStates, level, toneAssessed, log, txaTime, txaHandled, txaSecondDone,
    effectiveBirthTime, carboCount, carboLastTime, ciCleared, forcedTasks, now,
  } = state;

  const depsOk = (task) =>
    (task.deps || []).every((id) => ["done", "skipped"].includes(taskStates[id]?.status));
  const relevant = (task) =>
    levelVal(task.level) <= levelVal(level) || (forcedTasks || []).includes(task.id);
  const st = (id) => taskStates[id]?.status ?? null;

  const gate = (task) => {
    if (task.contraindications && !(ciCleared || {})[task.id]) return { type: "ci_check", task };
    if (task.assess) return { type: "assess", task };
    return { type: "task", task };
  };

  if (taskStates.fundal_massage?.status === "done" && !toneAssessed) return { type: "tone_check" };

  for (const t of TASKS) {
    if (!relevant(t) || st(t.id) !== "assigned" || !t.followUpDelay || !t.critical) continue;
    if ((now - (taskStates[t.id].assignedAt || 0)) / 1000 >= t.followUpDelay)
      return { type: "followup", task: t, critical: true };
  }

  const blRate = bloodLossRate(log, now);
  const blInterval = reassessInterval(blRate, level);
  const lastBL = [...log].reverse().find((e) => e.kind === "blood_loss");
  if (lastBL && (now - lastBL.time) / 1000 > blInterval)
    return { type: "blood_loss_check", rate: blRate, interval: blInterval };

  for (const t of TASKS) {
    if (!relevant(t) || st(t.id) !== "assigned" || !t.followUpDelay) continue;
    if ((now - (taskStates[t.id].assignedAt || 0)) / 1000 >= t.followUpDelay)
      return { type: "followup", task: t, critical: false };
  }

  for (const critLevel of ["massive", "major", "minor"]) {
    for (const t of TASKS) {
      if (t.level !== critLevel || !relevant(t) || st(t.id) !== null || !depsOk(t) || !t.critical) continue;
      if (t.hidden && !(forcedTasks || []).includes(t.id)) continue;
      if (t.special === "txa" && txaHandled) continue;
      if (t.special === "carbo" && carboCount > 0) continue;
      return gate(t);
    }
  }

  if (carboCount > 0 && carboCount < 8 && carboLastTime && (now - carboLastTime) / 1000 >= 15 * 60)
    return { type: "carbo_dose" };

  if (txaTime && !txaSecondDone && levelVal(level) >= levelVal("major")) {
    const sinceFirst = (now - txaTime) / 1000;
    const windowOpen = effectiveBirthTime + 3 * 60 * 60 * 1000 > now;
    if (sinceFirst >= 30 * 60 && windowOpen) return { type: "txa_second" };
  }

  for (const t of TASKS) {
    if (!relevant(t) || st(t.id) !== null || !depsOk(t)) continue;
    if (t.hidden && !(forcedTasks || []).includes(t.id)) continue;
    if (t.special === "txa" && txaHandled) continue;
    if (t.special === "carbo" && carboCount > 0) continue;
    return gate(t);
  }

  return { type: "monitoring" };
}

function initialState(bloodLoss = 500, now = 1000000) {
  return {
    bloodLoss,
    level: getLevel(bloodLoss),
    taskStates: {},
    toneAssessed: false,
    log: [{ kind: "blood_loss", label: "initial", total: bloodLoss, time: now }],
    txaTime: null,
    txaHandled: false,
    txaSecondDone: false,
    effectiveBirthTime: now,
    carboCount: 0,
    carboLastTime: null,
    ciCleared: {},
    forcedTasks: [],
    now,
    path: [],
    issues: [],
  };
}

function promptKey(p) {
  if (!p) return "null";
  if (p.task) return `${p.type}:${p.task.id}`;
  return p.type;
}

function clone(s) {
  return {
    ...s,
    taskStates: JSON.parse(JSON.stringify(s.taskStates)),
    log: [...s.log],
    ciCleared: { ...s.ciCleared },
    forcedTasks: [...s.forcedTasks],
    path: [...s.path],
    issues: [...s.issues],
  };
}

function advanceTime(s, seconds) {
  s.now += seconds * 1000;
}

function applyAction(s, action) {
  const ns = clone(s);
  ns.path.push(action);

  const [type, ...rest] = action.split(":");
  const taskId = rest[0];

  switch (type) {
    case "done":
      ns.taskStates[taskId] = { status: "done", doneAt: ns.now };
      if (taskId === "fundal_massage") { /* tone check next */ }
      if (taskId === "txa") { ns.txaTime = ns.now; ns.txaHandled = true; }
      if (taskId === "carboprost") { ns.carboCount = 1; ns.carboLastTime = ns.now; }
      break;
    case "assign":
      ns.taskStates[taskId] = { status: "assigned", assignedAt: ns.now };
      if (taskId === "txa") ns.txaHandled = true;
      if (taskId === "carboprost") ns.carboCount = 1;
      break;
    case "skip":
      ns.taskStates[taskId] = { status: "skipped", skippedAt: ns.now };
      if (taskId === "txa") ns.txaHandled = true;
      break;
    case "na":
      ns.taskStates[taskId] = { status: "skipped", skippedAt: ns.now };
      break;
    case "tone_firm":
      ns.toneAssessed = true;
      ns.taskStates.bimanual = { status: "skipped", skippedAt: ns.now };
      break;
    case "tone_boggy":
      ns.toneAssessed = true;
      break;
    case "assess_exclude":
      ns.taskStates[taskId] = { status: "done", doneAt: ns.now };
      break;
    case "assess_present":
      ns.taskStates[taskId] = { status: "done", doneAt: ns.now };
      {
        const t = TASKS.find((x) => x.id === taskId);
        if (t?.assess?.treatment && !ns.forcedTasks.includes(t.assess.treatment))
          ns.forcedTasks.push(t.assess.treatment);
      }
      break;
    case "ci_clear":
      ns.ciCleared[taskId] = true;
      break;
    case "ci_contra": {
      ns.taskStates[taskId] = { status: "skipped", skippedAt: ns.now };
      const t = TASKS.find((x) => x.id === taskId);
      if (t?.special === "txa") ns.txaHandled = true;
      if (t?.fallback && !ns.forcedTasks.includes(t.fallback)) ns.forcedTasks.push(t.fallback);
      break;
    }
    case "followup_yes":
      ns.taskStates[taskId] = { status: "done", doneAt: ns.now };
      if (taskId === "txa") { ns.txaTime = ns.now; ns.txaHandled = true; }
      break;
    case "followup_no":
      ns.taskStates[taskId] = { ...ns.taskStates[taskId], assignedAt: ns.now };
      break;
    case "followup_escalate":
      ns.taskStates[taskId] = { ...ns.taskStates[taskId], assignedAt: ns.now };
      if (!ns.forcedTasks.includes("theatre")) ns.forcedTasks.push("theatre");
      break;
    case "blood_unchanged":
      ns.log.push({ kind: "blood_loss", label: "unchanged", total: ns.bloodLoss, time: ns.now });
      break;
    case "blood_add": {
      const delta = Number(rest[0]);
      ns.bloodLoss += delta;
      ns.level = getLevel(ns.bloodLoss);
      ns.log.push({ kind: "blood_loss", label: `+${delta}`, total: ns.bloodLoss, time: ns.now });
      break;
    }
    case "carbo_dose":
      ns.carboCount += 1;
      ns.carboLastTime = ns.now;
      break;
    case "carbo_skip":
      ns.carboLastTime = ns.now;
      break;
    case "txa2_given":
      ns.txaSecondDone = true;
      break;
    case "txa2_skip":
      ns.txaSecondDone = true;
      break;
    case "wait":
      advanceTime(ns, Number(rest[0]));
      break;
    default:
      break;
  }
  return ns;
}

function getActions(s, prompt) {
  const actions = [];
  switch (prompt.type) {
    case "tone_check":
      actions.push("tone_firm", "tone_boggy");
      break;
    case "assess":
      actions.push(`assess_exclude:${prompt.task.id}`, `assess_present:${prompt.task.id}`);
      break;
    case "ci_check":
      actions.push(`ci_clear:${prompt.task.id}`, `ci_contra:${prompt.task.id}`);
      break;
    case "task": {
      const t = prompt.task;
      actions.push(`done:${t.id}`, `assign:${t.id}`, `skip:${t.id}`);
      if (t.naOption) actions.push(`na:${t.id}`);
      break;
    }
    case "followup":
      actions.push(`followup_yes:${prompt.task.id}`, `followup_no:${prompt.task.id}`);
      if (prompt.task.followUpEscalate)
        actions.push(`followup_escalate:${prompt.task.id}`);
      break;
    case "blood_loss_check":
      actions.push("blood_unchanged", "blood_add:100", "blood_add:500");
      break;
    case "carbo_dose":
      actions.push("carbo_dose", "carbo_skip");
      break;
    case "txa_second":
      actions.push("txa2_given", "txa2_skip");
      break;
    case "monitoring":
      actions.push("wait:60");
      break;
    default:
      actions.push("wait:30");
  }
  return actions;
}

const issues = [];

function checkInvariants(s, prompt) {
  const id = promptKey(prompt);

  // Skip fundal massage bypasses tone check
  if (s.taskStates.fundal_massage?.status === "skipped" && !s.toneAssessed && prompt.type !== "tone_check") {
    if (s.taskStates.bimanual?.status == null) {
      issues.push({ severity: "medium", path: s.path.join(" → "), msg: "Skipped fundal massage — no tone check, bimanual may unlock without tone assessment" });
    }
  }

  // TXA skipped but no alternative
  if (s.txaHandled && !s.txaTime && s.taskStates.txa?.status === "skipped") {
    issues.push({ severity: "critical", path: s.path.join(" → "), msg: "TXA skipped — txaHandled=true permanently, no fallback drug" });
  }

  // TXA CI with no fallback
  if (s.taskStates.txa?.status === "skipped" && s.txaHandled && !s.forcedTasks.includes("misoprostol")) {
    const fromCi = s.path.some((p) => p === "ci_contra:txa");
    if (fromCi) issues.push({ severity: "critical", path: s.path.join(" → "), msg: "TXA contraindicated — no fallback activated (ergometrine-style chain missing for TXA)" });
  }

  // Assign TXA without confirmation — txaHandled but no txaTime
  if (s.taskStates.txa?.status === "assigned" && s.txaHandled && !s.txaTime) {
    // expected until followup - not bug
  }

  // Ergometrine CI at minor forces carboprost before major level
  if (s.forcedTasks.includes("carboprost") && s.level === "minor" && prompt.task?.id === "carboprost") {
    issues.push({ severity: "info", path: s.path.join(" → "), msg: "Carboprost surfaced at minor PPH via ergometrine CI fallback (may be intentional)" });
  }

  // Theatre forced at non-massive
  if (s.forcedTasks.includes("theatre") && s.level !== "massive" && prompt.task?.id === "theatre") {
    issues.push({ severity: "medium", path: s.path.join(" → "), msg: `Theatre task surfaced at ${s.level} level (trauma escalation)` });
  }

  // Hidden task without force
  if (prompt.task?.hidden && !s.forcedTasks.includes(prompt.task.id)) {
    issues.push({ severity: "critical", path: s.path.join(" → "), msg: `Hidden task ${prompt.task.id} surfaced without force-activation` });
  }

  // Stuck loop detection
  if (s.path.length >= 2) {
    const last = s.path.slice(-4).join("|");
    const prev = s.path.slice(-8, -4).join("|");
    if (last === prev && last.includes("blood_unchanged")) {
      issues.push({ severity: "low", path: s.path.join(" → "), msg: "Possible blood-loss check loop with unchanged entries" });
    }
  }

  // CI cleared but task never completed — infinite ci_check loop
  if (prompt.type === "ci_check" && s.ciCleared[prompt.task.id]) {
    issues.push({ severity: "critical", path: s.path.join(" → "), msg: `CI check re-fired after ci_cleared for ${prompt.task.id} — should show task prompt` });
  }

  // Monitoring with many pending tasks
  if (prompt.type === "monitoring") {
    const pending = TASKS.filter((t) =>
      levelVal(t.level) <= levelVal(s.level) && !s.taskStates[t.id]?.status && !(t.hidden && !s.forcedTasks.includes(t.id))
    );
    if (pending.length > 5) {
      issues.push({ severity: "medium", path: s.path.join(" → "), msg: `Monitoring state with ${pending.length} unstarted tasks still pending — user may think done` });
    }
  }

  // Double escalation: misoprostol after ergometrine+ carboprost both CI
  if (s.forcedTasks.includes("misoprostol") && s.taskStates.ergometrine?.status === "skipped" && s.taskStates.carboprost?.status === "skipped") {
    if (prompt.task?.id === "misoprostol" && s.level === "minor") {
      issues.push({ severity: "info", path: s.path.join(" → "), msg: "Misoprostol forced at minor after full uterotonic CI chain" });
    }
  }

  // mhp_pack depends iv_access — at massive start without iv
  if (s.level === "massive" && prompt.task?.id === "mhp_pack") {
    const iv = s.taskStates.iv_access?.status;
    if (!iv) issues.push({ severity: "high", path: s.path.join(" → "), msg: "MHP pack prompt before IV access completed/skipped" });
  }

  // calcium before blood products order
  if (prompt.task?.id === "calcium" && s.taskStates.blood_products?.status == null && s.level === "major") {
    // ordering issue not blocking
  }
}

function explore(startBloodLoss, maxDepth = 35, maxStates = 8000) {
  const visited = new Set();
  const queue = [initialState(startBloodLoss)];
  let explored = 0;

  while (queue.length && explored < maxStates) {
    const s = queue.shift();
    explored++;
    const prompt = computeNextPrompt(s);
    checkInvariants(s, prompt);
    const key = JSON.stringify({
      p: promptKey(prompt),
      ts: s.taskStates,
      bl: s.bloodLoss,
      tone: s.toneAssessed,
      txa: s.txaHandled,
      txaT: s.txaTime,
      forced: s.forcedTasks,
      ci: s.ciCleared,
      carbo: s.carboCount,
    });
    if (s.path.length >= maxDepth) continue;

    for (const action of getActions(s, prompt)) {
      const ns = applyAction(s, action);
      const np = computeNextPrompt(ns);
      const nkey = JSON.stringify({ p: promptKey(np), bl: ns.bloodLoss, pathLen: ns.path.length });
      if (visited.has(nkey)) continue;
      visited.add(nkey);
      checkInvariants(ns, np);
      queue.push(ns);
    }
  }
  return explored;
}

// Scenario-specific deep paths
function runScenario(name, steps) {
  let s = initialState(500);
  for (const step of steps) {
    if (step.startsWith("wait:")) {
      s = applyAction(s, step);
      continue;
    }
    const prompt = computeNextPrompt(s);
    checkInvariants(s, prompt);
    if (step === "AUTO") {
      // take first available done action
      const acts = getActions(s, prompt);
      const done = acts.find((a) => a.startsWith("done:")) || acts[0];
      s = applyAction(s, done);
    } else {
      s = applyAction(s, step);
    }
  }
  const finalPrompt = computeNextPrompt(s);
  checkInvariants(s, finalPrompt);
  return { name, final: promptKey(finalPrompt), path: s.path.join(" → ") };
}

console.log("=== BFS path exploration ===");
console.log("Minor start:", explore(500, 30, 5000));
console.log("Major start:", explore(1000, 28, 5000));
console.log("Massive start:", explore(2000, 25, 5000));

const scenarios = [
  ["Happy path minor — firm tone", [
    "done:call_team", "done:abc", "done:iv_access", "done:fundal_massage", "tone_firm",
    "assess_exclude:trauma_assess", "assess_exclude:tissue_assess",
  ]],
  ["Trauma present → suture → theatre escalate", [
    "done:call_team", "done:abc", "done:iv_access", "done:fundal_massage", "tone_firm",
    "assess_present:trauma_assess", "assign:suture", "wait:301", "followup_escalate:suture",
  ]],
  ["Ergometrine CI → carboprost at minor", [
    "done:call_team", "done:abc", "done:iv_access", "done:fundal_massage", "tone_firm",
    "assess_exclude:trauma_assess", "assess_exclude:tissue_assess", "done:catheterise",
    "done:iv_fluids", "done:oxytocin_bolus", "done:oxytocin_inf",
    "ci_contra:ergometrine",
  ]],
  ["Full CI chain ergo→carbo→misoprostol", [
    "done:call_team", "done:abc", "done:iv_access", "done:fundal_massage", "tone_firm",
    "assess_exclude:trauma_assess", "assess_exclude:tissue_assess", "done:catheterise",
    "done:iv_fluids", "done:oxytocin_bolus", "done:oxytocin_inf",
    "ci_contra:ergometrine", "ci_contra:carboprost",
  ]],
  ["Skip TXA critical", [
    "blood_add:500", "done:call_team", "done:abc", "done:iv_access",
    "done:call_major", "skip:txa",
  ]],
  ["Assign TXA then wait followup", [
    "blood_add:500", "done:call_team", "done:abc", "done:iv_access",
    "done:call_major", "assign:txa", "wait:91", "followup_yes:txa",
  ]],
  ["TXA second dose at 30min", [
    "blood_add:500", "done:call_team", "done:abc", "done:iv_access",
    "done:call_major", "done:txa", "wait:1801", "AUTO",
  ]],
  ["Skip fundal massage", [
    "done:call_team", "done:abc", "done:iv_access", "skip:fundal_massage",
  ]],
  ["ROTEM not available", [
    "blood_add:500", "done:call_team", "done:abc", "done:iv_access",
    "done:call_major", "done:second_cannula", "done:txa", "done:rapid_cryst",
    "done:blood_products", "done:keep_warm", "done:calcium", "na:rotem_teg",
  ]],
  ["Carboprost assign then confirm", [
    "blood_add:500", "done:call_team", "done:abc", "done:iv_access",
    "done:call_major", "done:second_cannula", "done:txa", "done:rapid_cryst",
    "done:blood_products", "done:keep_warm", "done:calcium", "na:rotem_teg",
    "assign:carboprost", "wait:91", "followup_yes:carboprost", "wait:901", "AUTO",
  ]],
  ["Massive without IV access", [
    "done:call_team", "done:abc", "skip:iv_access", "blood_add:1500",
  ]],
];

console.log("\n=== Targeted scenarios ===");
for (const [name, steps] of scenarios) {
  const r = runScenario(name, steps);
  console.log(`\n${name}`);
  console.log(`  Final prompt: ${r.final}`);
}

// Dedupe issues
const seen = new Set();
const unique = issues.filter((i) => {
  const k = i.severity + i.msg;
  if (seen.has(k)) return false;
  seen.add(k);
  return true;
});

console.log("\n=== ISSUES FOUND ===");
for (const sev of ["critical", "high", "medium", "low", "info"]) {
  const group = unique.filter((i) => i.severity === sev);
  if (group.length) {
    console.log(`\n[${sev.toUpperCase()}] (${group.length})`);
    group.forEach((i) => console.log(`  - ${i.msg}\n    e.g. ${i.path.slice(0, 120)}...`));
  }
}
console.log(`\nTotal unique issues: ${unique.length}`);
