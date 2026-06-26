import { useState, useEffect, useRef } from "react";

// ─── Task registry ──────────────────────────────────────────────────────────

const TASKS = [
  // Minor — stabilisation
  { id: "abc",            level: "minor",   type: "action",   title: "ABC — airway, breathing, circulation",  detail: "Position patient flat\nHigh-flow O₂ if SpO₂ <95%\nAssess for shock — HR, BP, skin perfusion" },
  { id: "call_team",      level: "minor",   type: "call",     title: "Call for help",                         detail: "• Midwife in charge\n• On-call obstetrician",                                                                                                          followUpDelay: 120 },
  { id: "iv_access",      level: "minor",   type: "access",   title: "IV access + bloods",                    detail: "2 × large bore IV cannulas (14–16G)\nBloods: FBC, coagulation, U&E, LFT, group & screen",                                                              followUpDelay: 90  },
  { id: "bimanual",       level: "minor",   type: "action",   title: "Bimanual uterine massage",              detail: "Rub up a contraction — sustained bimanual compression\nIs the uterus firm after massage? (diagnostic)",                                                  followUpDelay: 180 },
  { id: "catheterise",    level: "minor",   type: "action",   title: "Catheterise",                           detail: "Urinary catheter — target output >30 ml/hr\nMonitor hourly" },
  { id: "keep_warm",      level: "minor",   type: "action",   title: "Keep patient warm",                     detail: "Blankets and warming device\nHypothermia worsens coagulopathy" },
  { id: "iv_fluids",      level: "minor",   type: "fluid",    title: "IV fluids",                             detail: "Hartmann's or 0.9% saline — fluid resuscitation",                                                                                                        deps: ["iv_access"] },
  // Minor — uterotonics in order
  { id: "oxytocin_bolus", level: "minor",   type: "drug",     title: "Oxytocin 5 IU IV",                      detail: "Slowly IV over ~1 minute\nOnly if not already given for active management of third stage",                                                               followUpDelay: 60, deps: ["iv_access"] },
  { id: "ergometrine",    level: "minor",   type: "drug",     title: "Ergometrine 500 mcg",                   detail: "IM or slow IV\n⚠ Avoid if hypertension, pre-eclampsia, cardiac disease or asthma",                                                                       followUpDelay: 60, deps: ["iv_access"] },
  { id: "oxytocin_inf",   level: "minor",   type: "drug",     title: "Oxytocin infusion",                     detail: "40 IU in 500 ml Hartmann's at 125 ml/hr IV",                                                                                                             followUpDelay: 60, deps: ["iv_access"] },
  // Minor — examination
  { id: "inspect_canal",  level: "minor",   type: "action",   title: "Inspect birth canal",                   detail: "Cervix, vagina, perineum — good exposure and lighting\nSuture all visible lacerations",                                                                   followUpDelay: 120 },
  { id: "check_placenta", level: "minor",   type: "action",   title: "Check placenta complete",               detail: "Confirm placenta and membranes complete\nIf uncertain — manual exploration under anaesthesia",                                                              followUpDelay: 120 },
  { id: "coag_review",    level: "minor",   type: "action",   title: "Review coagulation results",            detail: "Review when available\nHaematologist if known or suspected coagulopathy",                                                                                  deps: ["iv_access"] },
  // Major
  { id: "call_major",     level: "major",   type: "call",     title: "Escalate — major PPH",                  detail: "• Senior obstetrician\n• Anaesthetist\n• Alert theatre\n• Activate major PPH protocol\n• Alert blood transfusion lab",                                   followUpDelay: 120, critical: true },
  { id: "second_cannula", level: "major",   type: "access",   title: "2nd large bore cannula",                detail: "14G or 16G — insert now\nCrossmatch 4 units red cells urgently\nRepeat FBC and coagulation",                                                              followUpDelay: 90, critical: true },
  { id: "rapid_cryst",    level: "major",   type: "fluid",    title: "Rapid crystalloid",                     detail: "Hartmann's 1.5–2 L rapidly\nO-negative blood if life-threatening — do not wait for crossmatch",                                                           deps: ["iv_access"] },
  { id: "blood_products", level: "major",   type: "blood",    title: "Blood products",                        detail: "• FFP 4 units — coagulopathy or fibrinogen <1.5 g/L\n• Cryoprecipitate 2 pools — fibrinogen <2 g/L\n• Platelets — if <75 × 10⁹/L",                       deps: ["iv_access"] },
  { id: "carboprost",     level: "major",   type: "drug",     title: "Carboprost 0.25 mg IM",                 detail: "Every 15 minutes — up to 8 doses\n⚠ Contraindicated in asthma",                                                                                           special: "carbo" },
  { id: "misoprostol",    level: "major",   type: "drug",     title: "Misoprostol 800 mcg sublingual",        detail: "Place under tongue\nAlternative if other uterotonics unavailable or failed",                                                                               followUpDelay: 60 },
  { id: "txa",            level: "major",   type: "drug",     title: "Tranexamic acid 1 g IV",                detail: "Over 10 minutes IV\n⚠ TIME CRITICAL — within 3 hours of birth",                                                                                           followUpDelay: 60, critical: true, special: "txa", deps: ["iv_access"] },
  // Massive
  { id: "call_massive",   level: "massive", type: "call",     title: "Activate massive PPH",                  detail: "• Consultant obstetrician — NOW\n• Consultant anaesthetist — NOW\n• Haematologist — NOW\n• Blood bank — activate MHP\n• IR if UAE planned",               followUpDelay: 120, critical: true },
  { id: "mhp_pack",       level: "massive", type: "blood",    title: "MHP pack immediately",                  detail: "6 units red cells + 4 units FFP\n± Platelets ± Cryoprecipitate\nCall blood bank now",                                                                     followUpDelay: 120, critical: true, deps: ["iv_access"] },
  { id: "txa_massive",    level: "massive", type: "drug",     title: "TXA if not yet given",                  detail: "1 g IV over 10 minutes\n⚠ Within 3 hours of birth",                                                                                                       critical: true, special: "txa", deps: ["iv_access"] },
  { id: "calcium",        level: "massive", type: "drug",     title: "Calcium gluconate",                     detail: "10 ml of 10% per 4 units red cells transfused\nPrevents citrate-induced hypocalcaemia",                                                                    deps: ["iv_access"] },
  { id: "rotem_teg",      level: "massive", type: "action",   title: "ROTEM / TEG coagulation",               detail: "Point-of-care coagulation to guide product selection\nMaintain normothermia — correct acidosis" },
  { id: "cell_salvage",   level: "massive", type: "action",   title: "Cell salvage",                          detail: "Activate if available\nHaematologist authorisation if Rh-negative" },
  { id: "bakri",          level: "massive", type: "surgical", title: "Bakri balloon tamponade",               detail: "300–500 ml saline — tamponade test\nIf bleeding stops, may avoid theatre\nHave theatre prepared regardless" },
  { id: "theatre",        level: "massive", type: "surgical", title: "Transfer to theatre",                   detail: "• Stepwise uterine devascularisation\n• Bilateral uterine artery ligation\n• B-Lynch / Hayman brace suture\n• UAE if stable\n• Peripartum hysterectomy — last resort" },
];

// ─── Core logic ─────────────────────────────────────────────────────────────

const LEVEL_ORDER = ["minor", "major", "massive"];
function levelVal(l) { return LEVEL_ORDER.indexOf(l); }
function getLevel(ml) {
  if (ml >= 2000) return "massive";
  if (ml >= 1000) return "major";
  return "minor";
}

function computeNextPrompt({ taskStates, level, fourTsDone, log, txaTime, txaHandled, carboCount, carboLastTime, now }) {
  function depsOk(task) {
    return (task.deps || []).every(id => ["done", "skipped"].includes(taskStates[id]?.status));
  }
  function relevant(task) { return levelVal(task.level) <= levelVal(level); }
  function st(id) { return taskStates[id]?.status ?? null; }

  // Priority 1 — critical follow-ups (overdue assigned critical tasks)
  for (const t of TASKS) {
    if (!relevant(t) || st(t.id) !== "assigned" || !t.followUpDelay || !t.critical) continue;
    if ((now - (taskStates[t.id].assignedAt || 0)) / 1000 >= t.followUpDelay) return { type: "followup", task: t };
  }

  // Priority 2 — blood loss check
  const blInterval = level === "massive" ? 180 : level === "major" ? 240 : 300;
  const lastBL = [...log].reverse().find(e => e.kind === "blood_loss");
  if (lastBL && (now - lastBL.time) / 1000 > blInterval) return { type: "blood_loss_check" };

  // Priority 3 — Four T's documentation (only after bimanual attempted)
  if (!fourTsDone && ["done", "skipped"].includes(st("bimanual"))) return { type: "four_ts" };

  // Priority 4 — non-critical follow-ups
  for (const t of TASKS) {
    if (!relevant(t) || st(t.id) !== "assigned" || !t.followUpDelay) continue;
    if ((now - (taskStates[t.id].assignedAt || 0)) / 1000 >= t.followUpDelay) return { type: "followup", task: t };
  }

  // Priority 5 — critical unstarted tasks, highest level first so call_massive
  // surfaces before second_cannula when at massive PPH
  for (const critLevel of ["massive", "major", "minor"]) {
    for (const t of TASKS) {
      if (t.level !== critLevel || !relevant(t) || st(t.id) !== null || !depsOk(t) || !t.critical) continue;
      if (t.special === "txa" && txaHandled) continue;
      if (t.special === "carbo" && carboCount > 0) continue;
      return { type: "task", task: t };
    }
  }

  // Priority 6 — carboprost repeat dose
  if (carboCount > 0 && carboCount < 8 && carboLastTime && (now - carboLastTime) / 1000 >= 15 * 60) {
    return { type: "carbo_dose" };
  }

  // Priority 7 — next regular task
  for (const t of TASKS) {
    if (!relevant(t) || st(t.id) !== null || !depsOk(t)) continue;
    if (t.special === "txa" && txaHandled) continue;
    if (t.special === "carbo" && carboCount > 0) continue;
    return { type: "task", task: t };
  }

  return { type: "monitoring" };
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function fmt(ms) {
  const s = Math.floor(Math.abs(ms) / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${String(m % 60).padStart(2, "0")}m`;
  return `${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

function fmtTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function bloodLossClass(ml) {
  if (ml >= 2000) return "text-red-400";
  if (ml >= 1000) return "text-orange-400";
  if (ml >= 500)  return "text-yellow-300";
  return "text-white";
}

const TYPE_LABEL = {
  call: "Call", access: "Access", action: "Action",
  fluid: "Fluid", drug: "Drug", blood: "Blood", surgical: "Surgical",
};

// ─── Escalation overlay ──────────────────────────────────────────────────────

function EscalationOverlay({ level, onDismiss }) {
  const cfg = {
    major:   { title: "Major PPH",   body: "Blood loss ≥ 1,000 ml\nEscalate now — senior obstetrician, anaesthetist, theatre" },
    massive: { title: "Massive PPH", body: "Blood loss ≥ 2,000 ml\nActivate massive haemorrhage protocol immediately" },
  };
  const c = cfg[level];
  if (!c) return null;
  useEffect(() => { if ("vibrate" in navigator) navigator.vibrate([300, 100, 300, 100, 300]); }, []);
  return (
    <div className="fixed inset-0 bg-gray-950 z-50 flex flex-col items-center justify-center gap-5 p-8" onClick={onDismiss}>
      <p className="text-red-500 text-xs font-bold uppercase tracking-widest">Level change</p>
      <h2 className="text-white text-5xl font-black text-center">{c.title}</h2>
      <p className="text-gray-400 text-sm text-center whitespace-pre-line leading-relaxed">{c.body}</p>
      <button onClick={onDismiss} className="mt-8 bg-white text-gray-950 font-black text-sm px-10 py-3 rounded-lg">
        Acknowledged — continue
      </button>
    </div>
  );
}

// ─── Stand down confirm ──────────────────────────────────────────────────────

function StandDownConfirm({ bloodLoss, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/80 z-40 flex items-end p-4" onClick={onCancel}>
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 w-full" onClick={e => e.stopPropagation()}>
        <p className="text-white font-bold mb-1">Stand down?</p>
        <p className="text-gray-500 text-sm mb-4">
          Total blood loss: <span className={`font-bold ${bloodLossClass(bloodLoss)}`}>{bloodLoss} ml</span>
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 border border-gray-700 text-gray-300 font-medium py-2.5 rounded-lg text-sm">Cancel</button>
          <button onClick={onConfirm} className="flex-1 bg-white text-gray-950 font-bold py-2.5 rounded-lg text-sm">Confirm</button>
        </div>
      </div>
    </div>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────────

function Header({ elapsed, bloodLoss, level, assignedCount, onAddBlood, onStandDown }) {
  const levelLabel = { minor: "Minor PPH", major: "Major PPH", massive: "Massive PPH" }[level];
  return (
    <div className="bg-gray-900 px-4 pt-3 pb-3 border-b border-gray-800 flex-shrink-0">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-white text-xl font-bold tabular-nums">{fmt(elapsed)}</span>
        <div className="flex items-center gap-3">
          {assignedCount > 0 && <span className="text-amber-500 text-xs">{assignedCount} in progress</span>}
          <span className="text-gray-600 text-xs">{levelLabel}</span>
        </div>
        <button onClick={onStandDown} className="text-gray-600 hover:text-gray-300 text-xs transition">Stand down</button>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-gray-600 text-xs">Blood loss</span>
          <span className={`text-2xl font-black tabular-nums transition-colors ${bloodLossClass(bloodLoss)}`}>{bloodLoss} ml</span>
        </div>
        <div className="flex gap-2">
          {[100, 250, 500].map(n => (
            <button key={n} onClick={() => onAddBlood(n)}
              className="text-gray-600 hover:text-gray-300 text-xs border border-gray-800 hover:border-gray-600 px-2 py-1 rounded transition">
              +{n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Drug strip ───────────────────────────────────────────────────────────────

function DrugStrip({ txaTime, birthTime, carboCount, carboLastTime, now }) {
  const items = [];

  if (txaTime) {
    const windowMs = 3 * 60 * 60 * 1000;
    const remaining = Math.max(0, birthTime + windowMs - now);
    const pct = Math.max(0, Math.min(100, (remaining / windowMs) * 100));
    const closed = remaining === 0;
    const urgent = !closed && remaining < 30 * 60 * 1000;
    items.push(
      <div key="txa" className="flex items-center gap-3">
        <span className="text-gray-600 text-xs w-18 shrink-0">TXA window</span>
        <div className="flex-1 bg-gray-800 h-px relative">
          <div className={`absolute top-0 left-0 h-px transition-all ${closed ? "bg-red-500" : urgent ? "bg-orange-400" : "bg-gray-500"}`} style={{ width: `${pct}%` }} />
        </div>
        <span className={`text-xs font-mono tabular-nums w-14 text-right shrink-0 ${closed ? "text-red-400" : urgent ? "text-orange-400" : "text-gray-500"}`}>
          {closed ? "closed" : fmt(remaining)}
        </span>
      </div>
    );
  }

  if (carboCount > 0) {
    const nextMs = carboLastTime ? Math.max(0, carboLastTime + 15 * 60 * 1000 - now) : null;
    const due = nextMs === 0;
    items.push(
      <div key="carbo" className="flex items-center gap-3">
        <span className="text-gray-600 text-xs w-18 shrink-0">Carboprost</span>
        <span className="text-gray-500 text-xs">{carboCount} / 8</span>
        {nextMs !== null && carboCount < 8 && (
          <span className={`text-xs font-mono ml-auto ${due ? "text-amber-400 font-bold" : "text-gray-600"}`}>
            {due ? "dose due now" : `next in ${fmt(nextMs)}`}
          </span>
        )}
        {carboCount >= 8 && <span className="text-gray-700 text-xs ml-auto">max doses</span>}
      </div>
    );
  }

  if (!items.length) return null;
  return (
    <div className="px-4 py-2.5 border-b border-gray-800 flex-shrink-0 space-y-2">
      {items}
    </div>
  );
}

// ─── Active prompt sub-components ────────────────────────────────────────────

function TaskPrompt({ task, onDone, onAssign, onSkip }) {
  const autoExpand = task.type === "drug" || task.type === "blood" || task.critical;
  const [showDetail, setShowDetail] = useState(autoExpand);
  return (
    <div className="px-4 py-3.5 space-y-2.5">
      <div className="flex items-center gap-2">
        <span className={`text-xs font-bold uppercase tracking-wider ${task.critical ? "text-red-400" : "text-gray-600"}`}>
          {TYPE_LABEL[task.type]}{task.critical ? " — critical" : ""}
        </span>
      </div>
      <p className="text-white text-xl font-bold leading-snug">{task.title}</p>
      {task.detail && (
        <>
          {!autoExpand && (
            <button onClick={() => setShowDetail(v => !v)} className="text-gray-700 hover:text-gray-500 text-xs transition">
              {showDetail ? "hide ↑" : "detail ↓"}
            </button>
          )}
          {showDetail && (
            <p className="text-gray-500 text-xs whitespace-pre-line leading-relaxed">{task.detail}</p>
          )}
        </>
      )}
      <div className="flex gap-2 pt-1">
        <button onClick={() => onDone(task)} className="flex-1 bg-white text-gray-950 font-bold py-2.5 text-sm rounded-lg">Done ✓</button>
        <button onClick={() => onAssign(task)} className="flex-1 border border-gray-700 hover:border-gray-500 text-white font-medium py-2.5 text-sm rounded-lg transition">Assign →</button>
        <button onClick={() => onSkip(task)} className="text-gray-700 hover:text-gray-500 text-xs px-2 transition">Skip</button>
      </div>
    </div>
  );
}

function FollowupPrompt({ task, onYes, onNo }) {
  useEffect(() => { if ("vibrate" in navigator) navigator.vibrate([100, 60, 100]); }, []);
  return (
    <div className="px-4 py-3.5 space-y-2.5">
      <span className="text-xs font-bold uppercase tracking-wider text-amber-500">Follow-up</span>
      <p className="text-white text-xl font-bold leading-snug">{task.title}</p>
      <p className="text-gray-600 text-xs">Assigned to team — has it been done?</p>
      <div className="flex gap-2 pt-1">
        <button onClick={() => onYes(task)} className="flex-1 bg-white text-gray-950 font-bold py-2.5 text-sm rounded-lg">Yes — confirmed ✓</button>
        <button onClick={() => onNo(task)} className="flex-1 border border-gray-700 text-white font-medium py-2.5 text-sm rounded-lg">Not yet</button>
      </div>
    </div>
  );
}

function FourTsPrompt({ onConfirm }) {
  const [selected, setSelected] = useState(new Set());
  const opts = [
    { key: "tone",     label: "Tone",     sub: "Uterine atony" },
    { key: "trauma",   label: "Trauma",   sub: "Lacerations / haematoma" },
    { key: "tissue",   label: "Tissue",   sub: "Retained placenta" },
    { key: "thrombin", label: "Thrombin", sub: "Coagulopathy" },
  ];
  function toggle(k) {
    setSelected(prev => { const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n; });
  }
  function confirm() {
    onConfirm(selected.size > 0 ? selected : new Set(opts.map(o => o.key)));
  }
  return (
    <div className="px-4 py-3.5 space-y-2.5">
      <span className="text-xs font-bold uppercase tracking-wider text-gray-600">Four T's — suspected cause</span>
      <p className="text-gray-500 text-xs">Select all that apply (for documentation)</p>
      <div className="grid grid-cols-4 gap-1.5">
        {opts.map(o => {
          const on = selected.has(o.key);
          return (
            <button key={o.key} onClick={() => toggle(o.key)}
              className={`text-left px-2.5 py-2 rounded-lg border text-xs transition ${on ? "border-white text-white bg-gray-800" : "border-gray-800 text-gray-600"}`}>
              <div className="font-bold">{o.label}</div>
              <div className="text-gray-600 mt-0.5 leading-tight hidden sm:block">{o.sub}</div>
            </button>
          );
        })}
      </div>
      <button onClick={confirm} className="w-full bg-white text-gray-950 font-bold py-2.5 text-sm rounded-lg">
        {selected.size > 0 ? `Confirm (${selected.size}) →` : "Uncertain — treat all →"}
      </button>
    </div>
  );
}

function BloodCheckPrompt({ level, bloodLoss, onAdd, onUnchanged }) {
  const [custom, setCustom] = useState("");
  const interval = { massive: "3 min", major: "4 min", minor: "5 min" }[level];
  function submitCustom() {
    const n = Number(custom);
    if (!isNaN(n) && n > 0) { onAdd(n); setCustom(""); }
  }
  return (
    <div className="px-4 py-3.5 space-y-2.5">
      <div className="flex items-baseline gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-600">Blood loss check</span>
        <span className="text-gray-700 text-xs">{interval} interval</span>
      </div>
      <p className="text-gray-500 text-xs">
        Current: <span className={`font-bold ${bloodLossClass(bloodLoss)}`}>{bloodLoss} ml</span> — additional loss?
      </p>
      <div className="flex gap-2">
        {[100, 250, 500].map(n => (
          <button key={n} onClick={() => onAdd(n)}
            className="flex-1 border border-gray-700 hover:border-gray-500 text-white font-medium py-2 text-sm rounded-lg transition">
            +{n}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="number" value={custom} onChange={e => setCustom(e.target.value)} placeholder="Other ml"
          className="flex-1 bg-gray-800 border border-gray-700 focus:border-gray-500 text-white text-sm rounded-lg px-3 py-2 outline-none transition"
          onKeyDown={e => e.key === "Enter" && submitCustom()}
        />
        <button onClick={submitCustom} className="border border-gray-700 text-white text-sm px-3 py-2 rounded-lg">Add</button>
        <button onClick={onUnchanged} className="text-gray-700 hover:text-gray-500 text-xs px-2 transition">Unchanged</button>
      </div>
    </div>
  );
}

function CarboDosePrompt({ count, onDose, onSkip }) {
  return (
    <div className="px-4 py-3.5 space-y-2">
      <span className="text-xs font-bold uppercase tracking-wider text-gray-600">Carboprost</span>
      <p className="text-white text-xl font-bold">Dose {count + 1} of 8 due</p>
      <p className="text-gray-500 text-xs">0.25 mg IM · ⚠ Contraindicated in asthma{count >= 7 ? " · This is the final dose" : ""}</p>
      <div className="flex gap-2 pt-1">
        <button onClick={onDose} className="flex-1 bg-white text-gray-950 font-bold py-2.5 text-sm rounded-lg">Given ✓</button>
        <button onClick={onSkip} className="border border-gray-700 text-gray-400 text-sm px-4 py-2.5 rounded-lg">Skip</button>
      </div>
    </div>
  );
}

function MonitoringPrompt({ assignedCount }) {
  return (
    <div className="px-4 py-4">
      <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Monitoring</span>
      <p className="text-gray-500 text-sm mt-1">
        {assignedCount > 0
          ? `${assignedCount} task${assignedCount > 1 ? "s" : ""} in progress — confirm below when done`
          : "All tasks complete"}
      </p>
    </div>
  );
}

// ─── Active prompt area ───────────────────────────────────────────────────────

function ActivePromptArea({ prompt, bloodLoss, level, carboCount, assignedCount, handlers }) {
  if (!prompt) return null;
  const { onDone, onAssign, onSkip, onFollowupYes, onFollowupNo, onFourTs, onBloodAdd, onBloodUnchanged, onCarboDose, onCarboSkip } = handlers;

  let content;
  switch (prompt.type) {
    case "task":         content = <TaskPrompt task={prompt.task} onDone={onDone} onAssign={onAssign} onSkip={onSkip} />; break;
    case "followup":     content = <FollowupPrompt task={prompt.task} onYes={onFollowupYes} onNo={onFollowupNo} />; break;
    case "four_ts":      content = <FourTsPrompt onConfirm={onFourTs} />; break;
    case "blood_loss_check": content = <BloodCheckPrompt level={level} bloodLoss={bloodLoss} onAdd={onBloodAdd} onUnchanged={onBloodUnchanged} />; break;
    case "carbo_dose":   content = <CarboDosePrompt count={carboCount} onDose={onCarboDose} onSkip={onCarboSkip} />; break;
    case "monitoring":   content = <MonitoringPrompt assignedCount={assignedCount} />; break;
    default:             return null;
  }

  const isInterrupt = ["followup", "four_ts", "blood_loss_check", "carbo_dose"].includes(prompt.type);

  return (
    <div className={`flex-shrink-0 border-b border-gray-800 ${isInterrupt ? "bg-gray-900" : "bg-gray-900"}`}>
      {isInterrupt && (
        <div className="px-4 pt-2.5 pb-0">
          <div className="h-px bg-amber-500/30 w-full" />
        </div>
      )}
      {content}
    </div>
  );
}

// ─── Task list ────────────────────────────────────────────────────────────────

function TaskRow({ task, state, taskStates, now, onConfirm }) {
  const status = state?.status ?? null;
  const blockingDeps = (task.deps || []).filter(id => !["done", "skipped"].includes(taskStates[id]?.status));
  const isLocked = !status && blockingDeps.length > 0;

  if (status === "done") {
    return (
      <div className="flex items-center gap-3 px-4 py-1.5">
        <span className="text-gray-700 text-xs w-3 shrink-0">✓</span>
        <span className="text-gray-700 text-sm">{task.title}</span>
      </div>
    );
  }

  if (status === "skipped") {
    return (
      <div className="flex items-center gap-3 px-4 py-1.5">
        <span className="text-gray-800 text-xs w-3 shrink-0">–</span>
        <span className="text-gray-800 text-sm">{task.title}</span>
        <span className="text-gray-800 text-xs ml-auto">skipped</span>
      </div>
    );
  }

  if (status === "assigned") {
    const sinceMs = now - (state.assignedAt || now);
    return (
      <button onClick={() => onConfirm(task.id)}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-left active:bg-gray-900 transition">
        <span className="text-amber-500 text-xs w-3 shrink-0">→</span>
        <span className="text-white text-sm flex-1">{task.title}</span>
        <span className="text-gray-600 text-xs">{fmt(sinceMs)}</span>
      </button>
    );
  }

  if (isLocked) {
    const blockingTitle = TASKS.find(t => t.id === blockingDeps[0])?.title ?? blockingDeps[0];
    return (
      <div className="flex items-center gap-3 px-4 py-1.5 opacity-30">
        <span className="text-gray-700 text-xs w-3 shrink-0">○</span>
        <span className="text-gray-700 text-sm flex-1">{task.title}</span>
        <span className="text-gray-700 text-xs shrink-0">awaits {blockingTitle}</span>
      </div>
    );
  }

  // Pending
  return (
    <div className="flex items-center gap-3 px-4 py-2">
      <span className="text-gray-700 text-xs w-3 shrink-0">·</span>
      <span className="text-gray-300 text-sm">{task.title}</span>
    </div>
  );
}

function TaskList({ taskStates, level, now, onConfirmTask }) {
  const relevantLevels = LEVEL_ORDER.filter(l => levelVal(l) <= levelVal(level));
  const showSections = relevantLevels.length > 1;
  const sectionLabels = { minor: "Initial response", major: "Major PPH", massive: "Massive PPH" };

  return (
    <div className="flex-1 overflow-y-auto">
      {relevantLevels.map(sectionLevel => {
        const tasks = TASKS.filter(t => t.level === sectionLevel);
        return (
          <div key={sectionLevel}>
            {showSections && (
              <div className="px-4 py-2 border-b border-gray-900">
                <span className="text-gray-700 text-xs font-bold uppercase tracking-widest">{sectionLabels[sectionLevel]}</span>
              </div>
            )}
            {tasks.map(task => (
              <TaskRow
                key={task.id}
                task={task}
                state={taskStates[task.id]}
                taskStates={taskStates}
                now={now}
                onConfirm={onConfirmTask}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ─── Setup screen ─────────────────────────────────────────────────────────────

function SetupScreen({ onConfirm }) {
  const [ml, setMl] = useState("");
  const [birthTimeInput, setBirthTimeInput] = useState("");
  const presets = [
    { v: 500,  label: "500 ml",   sub: "Minor PPH" },
    { v: 1000, label: "1,000 ml", sub: "Major PPH" },
    { v: 1500, label: "1,500 ml", sub: "Major" },
    { v: 2000, label: "2,000 ml", sub: "Massive PPH" },
  ];

  function parseBirthTime() {
    if (!birthTimeInput.trim()) return null;
    const [hh, mm] = birthTimeInput.split(":").map(Number);
    if (isNaN(hh) || isNaN(mm)) return null;
    const d = new Date();
    d.setHours(hh, mm, 0, 0);
    // if parsed time is in the future, assume previous day
    if (d.getTime() > Date.now()) d.setDate(d.getDate() - 1);
    return d.getTime();
  }

  function submit(v) {
    const n = Number(v);
    if (!isNaN(n) && n >= 0) onConfirm(n, parseBirthTime());
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col justify-center px-6 gap-8">
      <div>
        <p className="text-gray-600 text-xs uppercase tracking-widest mb-2">PPH</p>
        <h1 className="text-white text-3xl font-black">Initial blood loss</h1>
        <p className="text-gray-500 text-sm mt-1">How much has been lost?</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {presets.map(({ v, label, sub }) => (
          <button key={v} onClick={() => submit(v)}
            className="bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 text-left p-4 rounded-xl transition">
            <div className="text-white font-bold text-base">{label}</div>
            <div className="text-gray-600 text-xs mt-0.5">{sub}</div>
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        <input
          type="number" value={ml} onChange={e => setMl(e.target.value)} placeholder="Enter ml"
          className="flex-1 bg-gray-900 border border-gray-800 focus:border-gray-600 text-white rounded-xl px-4 py-3 text-sm outline-none transition"
          onKeyDown={e => e.key === "Enter" && submit(ml)}
          autoFocus
        />
        <button onClick={() => submit(ml)} className="bg-white text-gray-950 font-bold px-6 py-3 rounded-xl text-sm">
          Start →
        </button>
      </div>
      <div>
        <p className="text-gray-600 text-xs mb-2">Birth time <span className="text-gray-700">(for TXA 3-hour window)</span></p>
        <input
          type="time" value={birthTimeInput} onChange={e => setBirthTimeInput(e.target.value)}
          className="w-full bg-gray-900 border border-gray-800 focus:border-gray-600 text-white rounded-xl px-4 py-3 text-sm outline-none transition"
        />
        <p className="text-gray-700 text-xs mt-1.5">Leave blank to use emergency start time</p>
      </div>
    </div>
  );
}

// ─── Summary screen ───────────────────────────────────────────────────────────

function SummaryScreen({ log, emergencyStartTime, resolveTime, bloodLoss, onBack }) {
  const duration = (resolveTime ?? Date.now()) - emergencyStartTime;
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <div className="px-5 py-5 border-b border-gray-800 flex-shrink-0">
        <p className="text-gray-600 text-xs uppercase tracking-widest mb-3">PPH record</p>
        <div className="flex gap-8">
          <div>
            <p className="text-gray-600 text-xs mb-0.5">Duration</p>
            <p className="text-white font-mono font-bold text-lg">{fmt(duration)}</p>
          </div>
          <div>
            <p className="text-gray-600 text-xs mb-0.5">Total blood loss</p>
            <p className={`font-bold text-lg ${bloodLossClass(bloodLoss)}`}>{bloodLoss} ml</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {log.map((e, i) => (
          <div key={i} className="flex items-start gap-3 px-5 py-2.5 border-b border-gray-900">
            <span className="text-gray-700 text-xs font-mono tabular-nums mt-0.5 w-16 shrink-0">{fmtTime(e.time)}</span>
            <span className="text-gray-300 text-sm leading-snug">{e.label}</span>
          </div>
        ))}
        {!log.length && <p className="text-gray-700 text-sm text-center py-10">No events recorded</p>}
      </div>

      <div className="px-5 py-5 border-t border-gray-800 flex-shrink-0 space-y-4">
        <p className="text-gray-500 text-xs leading-relaxed border-l-2 border-gray-700 pl-3">
          Complete incident documentation. Debrief team. Arrange postnatal review.<br />
          Report to MBRRACE-UK if maternal near miss or death.
        </p>
        <div className="space-y-1.5 text-xs text-gray-700">
          <p className="text-gray-500 font-medium mb-2">Post-event checklist</p>
          {["Drug record with times and doses", "Repeat bloods at 4 hours", "Postnatal debrief offered", "Thromboprophylaxis reviewed", "Iron supplementation started", "Incident report submitted"].map(item => (
            <p key={item}>☐ {item}</p>
          ))}
        </div>
        <button onClick={onBack} className="w-full border border-gray-800 text-gray-500 font-medium py-3 rounded-xl text-sm">Close</button>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function EmergencyPage({ onClose }) {
  const [emergencyStartTime] = useState(() => Date.now());
  const [phase, setPhase] = useState("setup");
  const [bloodLoss, setBloodLoss] = useState(0);
  const [taskStates, setTaskStates] = useState({});
  const [fourTsDone, setFourTsDone] = useState(false);
  const [log, setLog] = useState([]);
  const [txaTime, setTxaTime] = useState(null);
  const [txaHandled, setTxaHandled] = useState(false);
  const [birthTime, setBirthTime] = useState(null);
  const [carboCount, setCarboCount] = useState(0);
  const [carboLastTime, setCarboLastTime] = useState(null);
  const [resolveTime, setResolveTime] = useState(null);
  const [now, setNow] = useState(() => Date.now());
  const [escalationAlert, setEscalationAlert] = useState(null);
  const [standDownConfirm, setStandDownConfirm] = useState(false);

  const prevLevelRef = useRef(null);
  const wakeLockRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (phase !== "active" || !("wakeLock" in navigator)) return;
    navigator.wakeLock.request("screen").then(wl => { wakeLockRef.current = wl; }).catch(() => {});
    return () => { wakeLockRef.current?.release().catch(() => {}); };
  }, [phase]);

  const level = getLevel(bloodLoss);

  function addLog(kind, label) {
    setLog(prev => [...prev, { kind, label, time: Date.now() }]);
  }

  useEffect(() => {
    if (phase !== "active") return;
    if (prevLevelRef.current && prevLevelRef.current !== level) {
      setEscalationAlert(level);
      addLog("escalated", `Escalated to ${({ minor: "Minor", major: "Major", massive: "Massive" })[level]} PPH (${bloodLoss} ml)`);
    }
    prevLevelRef.current = level;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, phase]);

  const effectiveBirthTime = birthTime ?? emergencyStartTime;

  const prompt = phase === "active"
    ? computeNextPrompt({ taskStates, level, fourTsDone, log, txaTime, txaHandled, carboCount, carboLastTime, now })
    : null;

  const relevantTasks = TASKS.filter(t => levelVal(t.level) <= levelVal(level));
  const assignedCount = relevantTasks.filter(t => taskStates[t.id]?.status === "assigned").length;

  // ── Handlers ──

  function handleSetup(ml, bt) {
    setBloodLoss(ml);
    if (bt) setBirthTime(bt);
    prevLevelRef.current = getLevel(ml);
    setLog([{ kind: "blood_loss", label: `Initial blood loss: ${ml} ml`, time: Date.now() }]);
    setPhase("active");
  }

  function handleAddBlood(delta) {
    const next = bloodLoss + delta;
    setBloodLoss(next);
    addLog("blood_loss", `+${delta} ml → ${next} ml`);
  }

  function handleDone(task) {
    setTaskStates(prev => ({ ...prev, [task.id]: { status: "done", doneAt: Date.now() } }));
    addLog("task_done", `Done: ${task.title}`);
    if (task.special === "txa") { setTxaTime(Date.now()); setTxaHandled(true); }
    if (task.special === "carbo") { setCarboCount(1); setCarboLastTime(Date.now()); }
  }

  function handleAssign(task) {
    setTaskStates(prev => ({ ...prev, [task.id]: { status: "assigned", assignedAt: Date.now() } }));
    addLog("task_assigned", `Assigned: ${task.title}`);
    if (task.special === "txa") setTxaHandled(true);
    // Track first carbo dose so DrugStrip shows and repeat prompts work.
    // carboLastTime left null until confirmed — timer starts at confirmation.
    if (task.special === "carbo") setCarboCount(1);
  }

  function handleSkip(task) {
    setTaskStates(prev => ({ ...prev, [task.id]: { status: "skipped", skippedAt: Date.now() } }));
    addLog("task_skipped", `Skipped: ${task.title}`);
    if (task.special === "txa") setTxaHandled(true);
  }

  function handleFollowupYes(task) {
    setTaskStates(prev => ({ ...prev, [task.id]: { status: "done", doneAt: Date.now() } }));
    addLog("followup_done", `Confirmed done: ${task.title}`);
    if (task.special === "txa") { setTxaTime(Date.now()); setTxaHandled(true); }
  }

  function handleFollowupNo(task) {
    setTaskStates(prev => ({ ...prev, [task.id]: { ...prev[task.id], assignedAt: Date.now() } }));
    addLog("followup_pending", `Still in progress: ${task.title}`);
  }

  function handleFourTs(tracksSet) {
    setFourTsDone(true);
    const names = [...tracksSet].map(t => t[0].toUpperCase() + t.slice(1)).join(", ");
    addLog("four_ts", `Four T's: ${names}`);
  }

  function handleBloodAdd(delta) {
    const next = bloodLoss + delta;
    setBloodLoss(next);
    addLog("blood_loss", `Blood loss check: +${delta} ml → ${next} ml`);
  }

  function handleBloodUnchanged() {
    addLog("blood_loss", `Blood loss check: unchanged (${bloodLoss} ml)`);
  }

  function handleCarboDose() {
    const next = carboCount + 1;
    setCarboCount(next);
    setCarboLastTime(Date.now());
    addLog("carbo_dose", `Carboprost dose ${next}/8`);
  }

  function handleCarboSkip() {
    setCarboLastTime(Date.now());
    addLog("carbo_skip", "Carboprost dose skipped");
  }

  function handleConfirmTask(taskId) {
    const task = TASKS.find(t => t.id === taskId);
    setTaskStates(prev => ({ ...prev, [taskId]: { status: "done", doneAt: Date.now() } }));
    addLog("task_done", `Confirmed done: ${task?.title ?? taskId}`);
    if (task?.special === "txa") { setTxaTime(Date.now()); setTxaHandled(true); }
    // Confirming assigned carboprost from the task row starts the 15-min repeat timer.
    if (task?.special === "carbo") { setCarboCount(prev => prev === 0 ? 1 : prev); setCarboLastTime(Date.now()); }
  }

  function handleStandDown() {
    const t = Date.now();
    const unresolvedEntries = TASKS
      .filter(task => taskStates[task.id]?.status === "assigned")
      .map(task => ({ kind: "unresolved", label: `Unresolved at stand-down: ${task.title}`, time: t }));
    setResolveTime(t);
    setLog(prev => [
      ...prev,
      { kind: "stand_down", label: `Emergency stood down — ${bloodLoss} ml total`, time: t },
      ...unresolvedEntries,
    ]);
    setStandDownConfirm(false);
    setPhase("summary");
  }

  // ── Render ──

  if (phase === "setup") return <SetupScreen onConfirm={handleSetup} />;
  if (phase === "summary") {
    return <SummaryScreen log={log} emergencyStartTime={emergencyStartTime} resolveTime={resolveTime} bloodLoss={bloodLoss} onBack={onClose} />;
  }

  const handlers = {
    onDone: handleDone, onAssign: handleAssign, onSkip: handleSkip,
    onFollowupYes: handleFollowupYes, onFollowupNo: handleFollowupNo,
    onFourTs: handleFourTs, onBloodAdd: handleBloodAdd, onBloodUnchanged: handleBloodUnchanged,
    onCarboDose: handleCarboDose, onCarboSkip: handleCarboSkip,
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 overflow-hidden">
      {escalationAlert && <EscalationOverlay level={escalationAlert} onDismiss={() => setEscalationAlert(null)} />}
      {standDownConfirm && <StandDownConfirm bloodLoss={bloodLoss} onConfirm={handleStandDown} onCancel={() => setStandDownConfirm(false)} />}

      <Header
        elapsed={now - emergencyStartTime}
        bloodLoss={bloodLoss}
        level={level}
        assignedCount={assignedCount}
        onAddBlood={handleAddBlood}
        onStandDown={() => setStandDownConfirm(true)}
      />

      <DrugStrip
        txaTime={txaTime}
        birthTime={effectiveBirthTime}
        carboCount={carboCount}
        carboLastTime={carboLastTime}
        now={now}
      />

      <ActivePromptArea
        prompt={prompt}
        bloodLoss={bloodLoss}
        level={level}
        carboCount={carboCount}
        assignedCount={assignedCount}
        handlers={handlers}
      />

      <TaskList
        taskStates={taskStates}
        level={level}
        now={now}
        onConfirmTask={handleConfirmTask}
      />
    </div>
  );
}
