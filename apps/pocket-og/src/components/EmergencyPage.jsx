import { useState, useEffect, useRef } from "react";

// ─── Task registry ─────────────────────────────────────────────────────────

const TASKS = [
  // Minor — stabilisation
  { id: "abc",            level: "minor",   type: "action",   title: "ABC — airway, breathing, circulation",   detail: "Position patient flat\nHigh-flow O₂ if SpO₂ <95%\nAssess for shock — heart rate, BP, skin perfusion" },
  { id: "call_team",      level: "minor",   type: "call",     title: "Call for help",                          detail: "• Midwife in charge\n• On-call obstetrician",                                                                                                                         followUpDelay: 120 },
  { id: "iv_access",      level: "minor",   type: "access",   title: "IV access + bloods",                     detail: "2 × large bore IV cannulas (14–16G)\nBloods: FBC, coagulation, U&E, LFT, group & screen",                                                                           followUpDelay: 90  },
  { id: "bimanual",       level: "minor",   type: "action",   title: "Bimanual uterine massage",               detail: "Rub up a contraction — sustained bimanual compression\nIs the uterus firm after massage? (diagnostic)" },
  { id: "catheterise",    level: "minor",   type: "action",   title: "Catheterise",                            detail: "Urinary catheter — target output >30 ml/hr\nMonitor hourly" },
  { id: "keep_warm",      level: "minor",   type: "action",   title: "Keep patient warm",                      detail: "Blankets and warming device\nHypothermia worsens coagulopathy" },
  { id: "iv_fluids",      level: "minor",   type: "fluid",    title: "IV fluids",                              detail: "Hartmann's or 0.9% saline — fluid resuscitation",                                                                                                                     deps: ["iv_access"] },
  // Minor — uterotonics in order
  { id: "oxytocin_bolus", level: "minor",   type: "drug",     title: "Oxytocin 5 IU IV",                       detail: "Slowly IV over ~1 minute\nOnly if not already given for active management of third stage",                                                                             followUpDelay: 60, deps: ["iv_access"] },
  { id: "ergometrine",    level: "minor",   type: "drug",     title: "Ergometrine 500 mcg",                    detail: "IM or slow IV\n⚠ Avoid if hypertension, pre-eclampsia, cardiac disease or asthma",                                                                                    followUpDelay: 60, deps: ["iv_access"] },
  { id: "oxytocin_inf",   level: "minor",   type: "drug",     title: "Oxytocin infusion",                      detail: "40 IU in 500 ml Hartmann's\nRun at 125 ml/hr IV",                                                                                                                     followUpDelay: 60, deps: ["iv_access"] },
  // Minor — examination
  { id: "inspect_canal",  level: "minor",   type: "action",   title: "Inspect birth canal",                    detail: "Systematic inspection of cervix, vagina, perineum\nGood exposure and lighting essential\nSuture all visible lacerations",                                              followUpDelay: 120 },
  { id: "check_placenta", level: "minor",   type: "action",   title: "Check placenta complete",                detail: "Confirm placenta and membranes complete\nIf uncertain — manual exploration under anaesthesia",                                                                           followUpDelay: 120 },
  { id: "coag_review",    level: "minor",   type: "action",   title: "Review coagulation results",             detail: "Review when available\nContact haematologist if known or suspected coagulopathy",                                                                                       deps: ["iv_access"] },
  // Major
  { id: "call_major",     level: "major",   type: "call",     title: "Escalate — major PPH",                   detail: "• Senior obstetrician\n• Anaesthetist\n• Alert theatre\n• Activate major PPH protocol\n• Alert blood transfusion lab",                                                followUpDelay: 120 },
  { id: "second_cannula", level: "major",   type: "access",   title: "2nd large bore cannula",                 detail: "14G or 16G — insert second cannula now\nCrossmatch 4 units red cells urgently\nRepeat FBC and coagulation",                                                           followUpDelay: 90, critical: true },
  { id: "rapid_cryst",    level: "major",   type: "fluid",    title: "Rapid crystalloid",                      detail: "Hartmann's 1.5–2 L rapidly\nO-negative blood if life-threatening — do not wait for crossmatch",                                                                        deps: ["iv_access"] },
  { id: "blood_products", level: "major",   type: "blood",    title: "Blood products",                         detail: "• FFP 4 units — coagulopathy or fibrinogen <1.5 g/L\n• Cryoprecipitate 2 pools — fibrinogen <2 g/L\n• Platelets — if <75 × 10⁹/L (or <100 if ongoing bleeding)",     deps: ["iv_access"] },
  { id: "carboprost",     level: "major",   type: "drug",     title: "Carboprost 0.25 mg IM",                  detail: "Every 15 minutes — up to 8 doses (2 mg total)\n⚠ Contraindicated in asthma",                                                                                          special: "carbo" },
  { id: "misoprostol",    level: "major",   type: "drug",     title: "Misoprostol 800 mcg sublingual",         detail: "Place under tongue — dissolves in ~20 min\nAlternative if other uterotonics unavailable or failed",                                                                     followUpDelay: 60 },
  { id: "txa",            level: "major",   type: "drug",     title: "Tranexamic acid 1 g IV",                 detail: "Over 10 minutes IV\n⚠ TIME CRITICAL — must be within 3 hours of birth",                                                                                               followUpDelay: 60, critical: true, special: "txa", deps: ["iv_access"] },
  // Massive
  { id: "call_massive",   level: "massive", type: "call",     title: "Activate massive PPH",                   detail: "• Consultant obstetrician — NOW\n• Consultant anaesthetist — NOW\n• Haematologist — NOW\n• Blood bank — activate MHP\n• Interventional radiology if UAE planned",     followUpDelay: 120, critical: true },
  { id: "mhp_pack",       level: "massive", type: "blood",    title: "MHP pack immediately",                   detail: "6 units red cells + 4 units FFP\n± Platelets ± Cryoprecipitate\nCall blood bank now — do not wait",                                                                   followUpDelay: 120, deps: ["iv_access"] },
  { id: "txa_massive",    level: "massive", type: "drug",     title: "TXA if not yet given",                   detail: "1 g IV over 10 minutes\n⚠ Must be within 3 hours of birth",                                                                                                           critical: true, special: "txa", deps: ["iv_access"] },
  { id: "calcium",        level: "massive", type: "drug",     title: "Calcium gluconate",                      detail: "10 ml of 10% calcium gluconate per 4 units red cells\nPrevents citrate-induced hypocalcaemia",                                                                         deps: ["iv_access"] },
  { id: "rotem_teg",      level: "massive", type: "action",   title: "ROTEM/TEG coagulation",                  detail: "Point-of-care coagulation testing to guide product selection\nMaintain normothermia — correct acidosis" },
  { id: "cell_salvage",   level: "massive", type: "action",   title: "Cell salvage",                           detail: "Activate if available\nHaematologist authorisation required if Rh-negative" },
  { id: "bakri",          level: "massive", type: "surgical", title: "Bakri balloon tamponade",                detail: "Inflate with 300–500 ml saline — tamponade test\nIf bleeding stops, may avoid theatre\nHave theatre prepared regardless" },
  { id: "theatre",        level: "massive", type: "surgical", title: "Transfer to theatre",                    detail: "• Stepwise uterine devascularisation\n• Bilateral uterine artery ligation\n• B-Lynch / Hayman brace suture\n• UAE if haemodynamically stable\n• Peripartum hysterectomy — last resort" },
];

const LEVEL_ORDER = ["minor", "major", "massive"];
function levelVal(l) { return LEVEL_ORDER.indexOf(l); }

function getLevel(ml) {
  if (ml >= 2000) return "massive";
  if (ml >= 1000) return "major";
  return "minor";
}

// ─── Priority queue ─────────────────────────────────────────────────────────

function computeNextPrompt({ taskStates, level, fourTsDone, log, txaTime, carboCount, carboLastTime, now }) {
  function depsOk(task) {
    return (task.deps || []).every(id => {
      const s = taskStates[id]?.status;
      return s === "done" || s === "skipped";
    });
  }
  function relevant(task) {
    return levelVal(task.level) <= levelVal(level);
  }
  function st(id) { return taskStates[id]?.status ?? null; }

  // 1. Four T's after bimanual done/skipped
  if (!fourTsDone && ["done", "skipped"].includes(st("bimanual"))) {
    return { type: "four_ts" };
  }

  // 2. Critical overdue follow-ups
  for (const t of TASKS) {
    if (!relevant(t) || st(t.id) !== "assigned" || !t.followUpDelay || !t.critical) continue;
    if ((now - (taskStates[t.id].assignedAt || 0)) / 1000 >= t.followUpDelay) return { type: "followup", task: t };
  }

  // 3. Blood loss check overdue
  const blInterval = level === "massive" ? 180 : level === "major" ? 240 : 300;
  const lastBL = [...log].reverse().find(e => e.kind === "blood_loss");
  if (lastBL && (now - lastBL.time) / 1000 > blInterval) return { type: "blood_loss_check" };

  // 4. Regular overdue follow-ups
  for (const t of TASKS) {
    if (!relevant(t) || st(t.id) !== "assigned" || !t.followUpDelay) continue;
    if ((now - (taskStates[t.id].assignedAt || 0)) / 1000 >= t.followUpDelay) return { type: "followup", task: t };
  }

  // 5. Carboprost repeat dose due
  if (carboCount > 0 && carboCount < 8 && carboLastTime && (now - carboLastTime) / 1000 >= 15 * 60) {
    return { type: "carbo_dose" };
  }

  // 6. Next actionable task
  for (const t of TASKS) {
    if (!relevant(t)) continue;
    if (st(t.id) !== null) continue;
    if (!depsOk(t)) continue;
    if (t.special === "txa" && txaTime) continue;
    if (t.special === "carbo" && carboCount > 0) continue;
    return { type: "task", task: t };
  }

  // 7. Monitoring
  return { type: "monitoring" };
}

// ─── Helpers ───────────────────────────────────────────────────────────────

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

const TYPE_COLOR = {
  call:     { bg: "bg-blue-900/30",   border: "border-blue-500",   text: "text-blue-400",   label: "Call" },
  access:   { bg: "bg-purple-900/30", border: "border-purple-500", text: "text-purple-400", label: "Access" },
  action:   { bg: "bg-teal-900/30",   border: "border-teal-500",   text: "text-teal-400",   label: "Action" },
  fluid:    { bg: "bg-cyan-900/30",   border: "border-cyan-500",   text: "text-cyan-400",   label: "Fluid" },
  drug:     { bg: "bg-orange-900/30", border: "border-orange-400", text: "text-orange-400", label: "Drug" },
  blood:    { bg: "bg-red-900/30",    border: "border-red-500",    text: "text-red-400",    label: "Blood" },
  surgical: { bg: "bg-rose-900/30",   border: "border-rose-500",   text: "text-rose-400",   label: "Surgical" },
};

const TYPE_ICON = {
  call: "📞", access: "💉", action: "🩺", fluid: "💧", drug: "💊", blood: "🩸", surgical: "🔪",
};

const KIND_ICON = {
  task_done: "✅", task_assigned: "📋", task_skipped: "⏭", four_ts: "🔲", blood_loss: "🩸",
  followup_done: "✅", followup_pending: "⏳", escalated: "🚨", carbo_dose: "💊", carbo_skip: "⏭",
  stand_down: "🏁",
};

const LEVEL_CFG = {
  minor:   { badge: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40", label: "Minor PPH",   border: "border-yellow-500", overlay: null },
  major:   { badge: "bg-orange-500/20 text-orange-300 border border-orange-500/40", label: "Major PPH",   border: "border-orange-400", overlay: null },
  massive: { badge: "bg-red-500/20 text-red-300 border border-red-500/40",          label: "Massive PPH", border: "border-red-500",    overlay: null },
};

function bloodLossClass(ml) {
  if (ml >= 2000) return "text-red-400 font-black animate-pulse";
  if (ml >= 1000) return "text-orange-400 font-bold";
  if (ml >= 500)  return "text-yellow-400 font-bold";
  return "text-white font-bold";
}

// ─── Escalation overlay ─────────────────────────────────────────────────────

function EscalationOverlay({ level, onDismiss }) {
  const cfg = {
    major:   { bg: "bg-orange-600", title: "MAJOR PPH", sub: "Blood loss ≥ 1,000 ml\nEscalate now — senior obstetrician, anaesthetist, theatre" },
    massive: { bg: "bg-red-600",    title: "MASSIVE PPH", sub: "Blood loss ≥ 2,000 ml\nActivate massive haemorrhage protocol immediately" },
  };
  const c = cfg[level] ?? cfg.major;

  useEffect(() => {
    if ("vibrate" in navigator) navigator.vibrate([300, 100, 300, 100, 300]);
  }, []);

  return (
    <div className={`fixed inset-0 ${c.bg} z-50 flex flex-col items-center justify-center gap-6 p-8`} onClick={onDismiss}>
      <div className="text-white/60 text-sm font-semibold uppercase tracking-widest">Level change</div>
      <div className="text-white text-6xl font-black text-center leading-none">{c.title}</div>
      <div className="text-white/80 text-base text-center whitespace-pre-line leading-relaxed">{c.sub}</div>
      <button
        onClick={onDismiss}
        className="mt-6 bg-white text-gray-900 font-black text-lg px-12 py-4 rounded-2xl active:scale-95 transition"
      >
        Acknowledged
      </button>
    </div>
  );
}

// ─── Stand down confirm ────────────────────────────────────────────────────

function StandDownConfirm({ bloodLoss, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/70 z-40 flex items-end justify-center p-4" onClick={onCancel}>
      <div
        className="bg-gray-800 border border-gray-600 rounded-2xl p-6 w-full max-w-sm mb-2"
        onClick={e => e.stopPropagation()}
      >
        <p className="text-white font-bold text-lg mb-1">Stand down?</p>
        <p className="text-gray-400 text-sm mb-5">
          This will end the emergency and generate the summary. Total blood loss: <span className={bloodLossClass(bloodLoss)}>{bloodLoss} ml</span>
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Header ─────────────────────────────────────────────────────────────────

function Header({ elapsed, bloodLoss, level, assignedCount, onAddBlood, onStandDown }) {
  const lc = LEVEL_CFG[level];

  return (
    <div className={`bg-gray-900 border-b-2 ${lc.border} px-4 pt-3 pb-2 flex-shrink-0`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="font-mono text-white text-lg font-bold tabular-nums">{fmt(elapsed)}</span>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${lc.badge}`}>{lc.label}</span>
        {assignedCount > 0 && (
          <span className="text-xs bg-amber-900/50 text-amber-300 border border-amber-700/50 px-2 py-0.5 rounded-full font-medium ml-auto">
            ⚡ {assignedCount} assigned
          </span>
        )}
        {assignedCount === 0 && <span className="ml-auto" />}
        <button
          onClick={onStandDown}
          className="text-xs bg-gray-700/80 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded-full transition"
        >
          Stand Down
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-baseline gap-1.5">
          <span className="text-gray-500 text-xs">Loss</span>
          <span className={`text-xl tabular-nums transition-colors ${bloodLossClass(bloodLoss)}`}>{bloodLoss} ml</span>
        </div>
        <div className="flex gap-1.5 ml-auto">
          {[100, 250, 500].map(n => (
            <button
              key={n}
              onClick={() => onAddBlood(n)}
              className="bg-red-950/70 hover:bg-red-800/70 active:bg-red-700 text-red-300 text-xs font-bold px-2.5 py-1 rounded-lg transition"
            >
              +{n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Drug strip ──────────────────────────────────────────────────────────────

function DrugStrip({ txaTime, birthTime, carboCount, carboLastTime, now }) {
  const strips = [];

  if (txaTime) {
    const windowMs = 3 * 60 * 60 * 1000;
    const remaining = Math.max(0, birthTime + windowMs - now);
    const pct = Math.max(0, Math.min(100, (remaining / windowMs) * 100));
    const expired = remaining === 0;
    const urgent = !expired && remaining < 30 * 60 * 1000;
    strips.push(
      <div key="txa" className={`flex items-center gap-2 rounded-lg px-3 py-1.5 border ${expired ? "bg-red-950/70 border-red-700" : urgent ? "bg-red-950/50 border-red-800" : "bg-purple-950/50 border-purple-800"}`}>
        <span className={`text-xs font-bold ${expired ? "text-red-300" : "text-purple-300"}`}>TXA window</span>
        <div className="flex-1 bg-gray-700 rounded-full h-1.5">
          <div className={`h-1.5 rounded-full transition-all ${expired ? "bg-red-500" : urgent ? "bg-orange-400" : "bg-purple-400"}`} style={{ width: `${pct}%` }} />
        </div>
        <span className={`text-xs font-mono ${expired ? "text-red-400 font-bold" : urgent ? "text-orange-300 font-bold" : "text-purple-300"}`}>
          {expired ? "CLOSED" : fmt(remaining)}
        </span>
      </div>
    );
  }

  if (carboCount > 0) {
    const nextMs = carboLastTime ? Math.max(0, carboLastTime + 15 * 60 * 1000 - now) : null;
    const due = nextMs === 0;
    strips.push(
      <div key="carbo" className={`flex items-center gap-2 rounded-lg px-3 py-1.5 border ${due ? "bg-yellow-950/70 border-yellow-600" : "bg-violet-950/50 border-violet-800"}`}>
        <span className="text-violet-300 text-xs font-bold">Carboprost</span>
        <span className={`text-xs font-bold ${carboCount >= 8 ? "text-gray-400" : "text-white"}`}>{carboCount}/8</span>
        {nextMs !== null && carboCount < 8 && (
          <span className={`text-xs font-mono ml-auto ${due ? "text-yellow-300 font-black" : "text-violet-400"}`}>
            {due ? "DOSE DUE NOW" : `next in ${fmt(nextMs)}`}
          </span>
        )}
        {carboCount >= 8 && <span className="text-xs text-gray-500 ml-auto">max doses reached</span>}
      </div>
    );
  }

  if (strips.length === 0) return null;
  return (
    <div className="px-3 py-2 flex flex-col gap-1.5 bg-gray-900 border-b border-gray-800 flex-shrink-0">
      {strips}
    </div>
  );
}

// ─── Task prompt card ────────────────────────────────────────────────────────

function TaskPromptCard({ task, completedCount, totalCount, onDone, onAssign, onSkip }) {
  const tc = TYPE_COLOR[task.type] ?? TYPE_COLOR.action;
  const autoShowDetail = task.type === "drug" || task.type === "blood" || task.critical;
  const [showDetail, setShowDetail] = useState(autoShowDetail);

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Progress */}
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-gray-800 rounded-full h-1">
          <div className="bg-emerald-500 h-1 rounded-full transition-all" style={{ width: `${(completedCount / Math.max(totalCount, 1)) * 100}%` }} />
        </div>
        <span className="text-gray-500 text-xs tabular-nums">{completedCount}/{totalCount}</span>
      </div>

      {/* Card */}
      <div className={`flex-1 rounded-2xl border-2 ${tc.border} ${tc.bg} p-5 flex flex-col gap-4`}>
        {/* Type label + critical badge */}
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold uppercase tracking-widest ${tc.text}`}>
            {TYPE_ICON[task.type]} {tc.label}
          </span>
          {task.critical && (
            <span className="ml-auto text-xs font-black bg-red-600 text-white px-2 py-0.5 rounded-full animate-pulse">
              CRITICAL
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-white text-2xl font-black leading-tight">{task.title}</h2>

        {/* Detail */}
        {task.detail && (
          <div>
            {!autoShowDetail && (
              <button onClick={() => setShowDetail(v => !v)} className={`text-xs font-medium mb-2 ${tc.text}`}>
                {showDetail ? "Hide ▲" : "Detail ▼"}
              </button>
            )}
            {showDetail && (
              <div className="text-gray-300 text-sm whitespace-pre-line leading-relaxed border-t border-white/10 pt-3">
                {task.detail}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => onDone(task)}
          className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-black py-4 rounded-2xl text-xl transition"
        >
          Done ✓
        </button>
        <button
          onClick={() => onAssign(task)}
          className="w-full bg-blue-700 hover:bg-blue-600 active:bg-blue-800 text-white font-bold py-4 rounded-2xl text-lg transition"
        >
          Assign to team →
        </button>
        <button
          onClick={() => onSkip(task)}
          className="w-full text-gray-500 hover:text-gray-300 py-2 text-sm transition"
        >
          Already done / not applicable — skip
        </button>
      </div>
    </div>
  );
}

// ─── Follow-up card ──────────────────────────────────────────────────────────

function FollowUpCard({ task, onYes, onNo }) {
  const tc = TYPE_COLOR[task.type] ?? TYPE_COLOR.action;
  const [showDetail, setShowDetail] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      <div className={`rounded-2xl border-2 border-amber-500 bg-amber-900/20 p-5 flex flex-col gap-3`}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">⏰ Follow-up</span>
          {task.critical && <span className="ml-auto text-xs font-black bg-red-600 text-white px-2 py-0.5 rounded-full">CRITICAL</span>}
        </div>
        <h2 className="text-white text-2xl font-black leading-tight">{task.title}</h2>
        <p className="text-amber-200/70 text-sm">This was assigned to the team — has it been done?</p>
        {task.detail && (
          <div>
            <button onClick={() => setShowDetail(v => !v)} className="text-xs text-amber-400 font-medium">
              {showDetail ? "Hide detail ▲" : "Show detail ▼"}
            </button>
            {showDetail && <div className="text-gray-300 text-sm whitespace-pre-line mt-2 leading-relaxed">{task.detail}</div>}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={() => onYes(task)}
          className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-black py-4 rounded-2xl text-xl transition"
        >
          Yes — confirmed done ✓
        </button>
        <button
          onClick={() => onNo(task)}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3.5 rounded-2xl text-base transition"
        >
          Not yet — check again soon
        </button>
      </div>
    </div>
  );
}

// ─── Four T's card (documentation only) ─────────────────────────────────────

function FourTsCard({ onConfirm }) {
  const [selected, setSelected] = useState(new Set());

  const options = [
    { key: "tone",     icon: "💤", label: "Tone",     desc: "Uterine atony" },
    { key: "trauma",   icon: "🩹", label: "Trauma",   desc: "Lacerations / haematoma" },
    { key: "tissue",   icon: "🫀", label: "Tissue",   desc: "Retained placenta / membranes" },
    { key: "thrombin", icon: "🧬", label: "Thrombin", desc: "Coagulopathy" },
  ];

  function toggle(key) {
    setSelected(prev => {
      const n = new Set(prev);
      if (n.has(key)) n.delete(key); else n.add(key);
      return n;
    });
  }

  function confirm() {
    onConfirm(selected.size > 0 ? selected : new Set(["tone", "trauma", "tissue", "thrombin"]));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border-2 border-blue-500 bg-blue-900/20 p-5 flex flex-col gap-3">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-400">🔲 Four T's Assessment</span>
        <h2 className="text-white text-2xl font-black">Suspected cause?</h2>
        <p className="text-blue-200/60 text-sm">Select all that apply — for documentation</p>

        <div className="grid grid-cols-2 gap-2 mt-1">
          {options.map(o => {
            const active = selected.has(o.key);
            return (
              <button
                key={o.key}
                onClick={() => toggle(o.key)}
                className={`text-left px-4 py-3 rounded-xl border-2 transition ${active
                  ? "border-blue-400 bg-blue-800/50 text-white"
                  : "border-gray-700 bg-gray-800 text-gray-400"}`}
              >
                <div className="text-lg mb-0.5">{o.icon}</div>
                <div className="font-bold text-sm">{o.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{o.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={confirm}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl text-lg transition"
      >
        {selected.size > 0 ? `Confirm ${selected.size} cause${selected.size > 1 ? "s" : ""} →` : "Uncertain — treat all →"}
      </button>
    </div>
  );
}

// ─── Blood loss check card ───────────────────────────────────────────────────

function BloodLossCheckCard({ level, bloodLoss, onAdd, onUnchanged }) {
  const [custom, setCustom] = useState("");

  function submitCustom() {
    const n = Number(custom);
    if (!isNaN(n) && n > 0) { onAdd(n); setCustom(""); }
  }

  const intervals = { massive: "3 min", major: "4 min", minor: "5 min" };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border-2 border-red-500 bg-red-900/20 p-5 flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-widest text-red-400">🩸 Blood Loss Check</span>
        <h2 className="text-white text-2xl font-black">Update estimate</h2>
        <p className="text-red-200/60 text-sm">Reassess every {intervals[level]} at this level</p>
        <p className="text-gray-400 text-sm">Current estimate: <span className={bloodLossClass(bloodLoss)}>{bloodLoss} ml</span></p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[100, 200, 250, 500, 750, 1000].map(n => (
          <button
            key={n}
            onClick={() => onAdd(n)}
            className="bg-red-950/60 hover:bg-red-800/70 active:bg-red-700 text-red-200 font-bold py-3 rounded-xl text-sm transition"
          >
            +{n} ml
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="number"
          value={custom}
          onChange={e => setCustom(e.target.value)}
          placeholder="Other (ml)"
          className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
          onKeyDown={e => e.key === "Enter" && submitCustom()}
        />
        <button
          onClick={submitCustom}
          className="bg-red-700 hover:bg-red-600 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition"
        >
          Add
        </button>
      </div>

      <button
        onClick={onUnchanged}
        className="w-full text-gray-500 hover:text-gray-300 py-2 text-sm transition"
      >
        No change — estimate unchanged
      </button>
    </div>
  );
}

// ─── Carboprost dose card ────────────────────────────────────────────────────

function CarboDoseCard({ count, onDose, onSkip }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border-2 border-violet-500 bg-violet-900/20 p-5 flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-widest text-violet-400">💊 Carboprost</span>
        <h2 className="text-white text-2xl font-black">Repeat dose due</h2>
        <p className="text-gray-300 text-base">0.25 mg IM — dose {count + 1} of 8</p>
        <p className="text-amber-400 text-sm">⚠ Contraindicated in asthma</p>
        {count >= 7 && <p className="text-orange-400 text-sm font-bold">This is the final dose (maximum 8 doses / 2 mg)</p>}
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={onDose}
          className="w-full bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-black py-4 rounded-2xl text-xl transition"
        >
          Dose {count + 1} given ✓
        </button>
        <button
          onClick={onSkip}
          className="w-full text-gray-500 hover:text-gray-300 py-2 text-sm transition"
        >
          Skip — not appropriate now
        </button>
      </div>
    </div>
  );
}

// ─── Monitoring card ─────────────────────────────────────────────────────────

function MonitoringCard({ taskStates, level, now, onConfirm }) {
  const assigned = TASKS.filter(t => {
    if (levelVal(t.level) > levelVal(level)) return false;
    return taskStates[t.id]?.status === "assigned";
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border-2 border-gray-600 bg-gray-800/40 p-5 flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">👁 Monitoring</span>
        <h2 className="text-white text-2xl font-black">All tasks dispatched</h2>
        <p className="text-gray-400 text-sm">Tap a task when your team confirms it's done</p>
      </div>

      {assigned.length === 0 ? (
        <p className="text-gray-600 text-center text-sm py-4">No tasks currently in flight</p>
      ) : (
        <div className="flex flex-col gap-2">
          {assigned.map(t => {
            const sinceMs = now - (taskStates[t.id]?.assignedAt || now);
            return (
              <button
                key={t.id}
                onClick={() => onConfirm(t.id)}
                className="w-full text-left bg-gray-800 hover:bg-gray-700 active:bg-gray-600 border border-gray-700 hover:border-gray-500 rounded-xl px-4 py-3.5 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{TYPE_ICON[t.type] ?? "📋"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-semibold text-sm truncate">{t.title}</div>
                    <div className="text-gray-500 text-xs mt-0.5">assigned {fmt(sinceMs)} ago</div>
                  </div>
                  <span className="text-emerald-400 text-xs font-bold shrink-0">Mark done →</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Mini timeline ───────────────────────────────────────────────────────────

function MiniTimeline({ log }) {
  const recent = [...log].reverse().slice(0, 3);
  if (recent.length === 0) return null;
  return (
    <div className="flex-shrink-0 border-t border-gray-800 bg-gray-900/80 px-4 py-2">
      {recent.map((e, i) => (
        <div key={i} className="flex items-center gap-2 py-0.5">
          <span className="text-xs">{KIND_ICON[e.kind] ?? "•"}</span>
          <span className="text-gray-600 text-xs font-mono tabular-nums">{fmtTime(e.time)}</span>
          <span className="text-gray-400 text-xs truncate">{e.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Setup screen ────────────────────────────────────────────────────────────

function SetupScreen({ onConfirm }) {
  const [ml, setMl] = useState("");

  const presets = [
    { v: 500,  sub: "Minor PPH" },
    { v: 750,  sub: "Minor" },
    { v: 1000, sub: "Major PPH" },
    { v: 1500, sub: "Major" },
    { v: 2000, sub: "Massive PPH" },
    { v: 2500, sub: "Massive" },
  ];

  function submit(value) {
    const n = Number(value);
    if (!isNaN(n) && n >= 0) onConfirm(n);
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 gap-6">
      <div className="text-center">
        <div className="text-6xl mb-3">🩸</div>
        <h1 className="text-white text-2xl font-black">PPH — Initial Assessment</h1>
        <p className="text-gray-400 mt-2 text-sm">How much blood has been lost so far?</p>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        {presets.map(({ v, sub }) => (
          <button
            key={v}
            onClick={() => submit(v)}
            className="bg-gray-800 hover:bg-gray-700 active:bg-gray-600 border border-gray-700 hover:border-gray-500 text-white py-4 rounded-xl transition"
          >
            <div className="font-black text-lg">{v} ml</div>
            <div className="text-gray-500 text-xs mt-0.5">{sub}</div>
          </button>
        ))}
      </div>

      <div className="w-full max-w-xs">
        <p className="text-gray-500 text-xs text-center mb-2">Or enter exact amount</p>
        <div className="flex gap-2">
          <input
            type="number"
            value={ml}
            onChange={e => setMl(e.target.value)}
            placeholder="ml"
            className="flex-1 bg-gray-800 border border-gray-700 focus:border-red-500 text-white rounded-xl px-4 py-3 text-base outline-none focus:ring-1 focus:ring-red-500"
            onKeyDown={e => e.key === "Enter" && submit(ml)}
            autoFocus
          />
          <button
            onClick={() => submit(ml)}
            className="bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-bold px-5 py-3 rounded-xl transition"
          >
            Go →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Summary screen ──────────────────────────────────────────────────────────

function SummaryScreen({ log, emergencyStartTime, resolveTime, bloodLoss, onBack }) {
  const duration = (resolveTime ?? Date.now()) - emergencyStartTime;

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <div className="bg-gray-900 border-b border-gray-800 px-5 py-4 flex-shrink-0">
        <h1 className="text-white text-xl font-black">PPH — Emergency Record</h1>
        <div className="flex gap-5 mt-2 text-sm">
          <span className="text-gray-400">Duration <span className="text-white font-mono font-bold">{fmt(duration)}</span></span>
          <span className="text-gray-400">Total loss <span className={`font-bold ${bloodLossClass(bloodLoss)}`}>{bloodLoss} ml</span></span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
        {log.map((e, i) => (
          <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-800/60">
            <span className="text-base flex-shrink-0 mt-0.5">{KIND_ICON[e.kind] ?? "•"}</span>
            <span className="text-gray-500 text-xs font-mono tabular-nums flex-shrink-0 mt-0.5">{fmtTime(e.time)}</span>
            <span className="text-gray-200 text-sm leading-snug">{e.label}</span>
          </div>
        ))}
        {log.length === 0 && <p className="text-gray-600 text-sm text-center py-8">No events recorded</p>}
      </div>

      <div className="bg-gray-900 border-t border-gray-800 px-5 py-5 flex-shrink-0 space-y-4">
        <div className="bg-amber-950/40 border border-amber-700/50 rounded-xl p-4 text-amber-200 text-xs leading-relaxed">
          <strong>MBRRACE-UK reminder:</strong> Complete incident documentation, debrief the team, and ensure postnatal review is arranged. Report to MBRRACE-UK if maternal near miss or death.
        </div>
        <div className="space-y-2 text-xs text-gray-400">
          <p className="font-bold text-gray-300 text-sm">Post-event checklist</p>
          <p>☐ Written record of all drugs with times and doses</p>
          <p>☐ Repeat FBC, coagulation, U&E, LFT at 4 hours</p>
          <p>☐ Debrief offered to woman and partner</p>
          <p>☐ Thromboprophylaxis reviewed</p>
          <p>☐ Iron supplementation commenced</p>
          <p>☐ Incident report submitted</p>
        </div>
        <button
          onClick={onBack}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-xl transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function EmergencyPage({ onClose }) {
  const [emergencyStartTime] = useState(() => Date.now());
  const [phase, setPhase] = useState("setup");
  const [bloodLoss, setBloodLoss] = useState(0);
  const [taskStates, setTaskStates] = useState({});
  const [fourTsDone, setFourTsDone] = useState(false);
  const [log, setLog] = useState([]);
  const [txaTime, setTxaTime] = useState(null);
  const [carboCount, setCarboCount] = useState(0);
  const [carboLastTime, setCarboLastTime] = useState(null);
  const [resolveTime, setResolveTime] = useState(null);
  const [now, setNow] = useState(() => Date.now());
  const [escalationAlert, setEscalationAlert] = useState(null);
  const [standDownConfirm, setStandDownConfirm] = useState(false);

  const prevLevelRef = useRef(null);
  const prevPromptRef = useRef(null);
  const wakeLockRef = useRef(null);

  // Clock
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Wake lock
  useEffect(() => {
    if (phase !== "active" || !("wakeLock" in navigator)) return;
    navigator.wakeLock.request("screen").then(wl => { wakeLockRef.current = wl; }).catch(() => {});
    return () => { wakeLockRef.current?.release().catch(() => {}); };
  }, [phase]);

  const level = getLevel(bloodLoss);

  function addLog(kind, label) {
    setLog(prev => [...prev, { kind, label, time: Date.now() }]);
  }

  // Level escalation detection
  useEffect(() => {
    if (phase !== "active") return;
    if (prevLevelRef.current && prevLevelRef.current !== level) {
      setEscalationAlert(level);
      addLog("escalated", `⚠ Escalated to ${LEVEL_CFG[level].label} (${bloodLoss} ml)`);
    }
    prevLevelRef.current = level;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, phase]);

  const prompt = phase === "active"
    ? computeNextPrompt({ taskStates, level, fourTsDone, log, txaTime, carboCount, carboLastTime, now })
    : null;

  // Vibrate on new follow-up prompt
  useEffect(() => {
    if (!prompt) return;
    const key = `${prompt.type}:${prompt.task?.id ?? ""}`;
    if (prompt.type === "followup" && prevPromptRef.current !== key && "vibrate" in navigator) {
      navigator.vibrate([100, 60, 100]);
    }
    prevPromptRef.current = key;
  }, [prompt]);

  // Progress count
  const relevantTasks = TASKS.filter(t => levelVal(t.level) <= levelVal(level));
  const completedCount = relevantTasks.filter(t => ["done", "skipped"].includes(taskStates[t.id]?.status)).length;
  const assignedCount = relevantTasks.filter(t => taskStates[t.id]?.status === "assigned").length;

  // ── Handlers ──

  function handleSetup(ml) {
    setBloodLoss(ml);
    prevLevelRef.current = getLevel(ml);
    const initialLog = [{ kind: "blood_loss", label: `Initial blood loss: ${ml} ml — ${LEVEL_CFG[getLevel(ml)].label}`, time: Date.now() }];
    setLog(initialLog);
    setPhase("active");
  }

  function handleAddBlood(delta) {
    setBloodLoss(prev => {
      const next = prev + delta;
      addLog("blood_loss", `+${delta} ml → ${next} ml total`);
      return next;
    });
  }

  function handleDone(task) {
    setTaskStates(prev => ({ ...prev, [task.id]: { status: "done", doneAt: Date.now() } }));
    addLog("task_done", `Done: ${task.title}`);
    if (task.special === "txa") setTxaTime(Date.now());
    if (task.special === "carbo") { setCarboCount(1); setCarboLastTime(Date.now()); }
  }

  function handleAssign(task) {
    setTaskStates(prev => ({ ...prev, [task.id]: { status: "assigned", assignedAt: Date.now() } }));
    addLog("task_assigned", `Assigned: ${task.title}`);
  }

  function handleSkip(task) {
    setTaskStates(prev => ({ ...prev, [task.id]: { status: "skipped", skippedAt: Date.now() } }));
    addLog("task_skipped", `Skipped: ${task.title}`);
    if (task.special === "txa") setTxaTime(Date.now());
  }

  function handleFollowupYes(task) {
    setTaskStates(prev => ({ ...prev, [task.id]: { status: "done", doneAt: Date.now() } }));
    addLog("followup_done", `Confirmed done: ${task.title}`);
  }

  function handleFollowupNo(task) {
    setTaskStates(prev => ({ ...prev, [task.id]: { ...prev[task.id], assignedAt: Date.now() } }));
    addLog("followup_pending", `Still in progress: ${task.title}`);
  }

  function handleFourTs(tracksSet) {
    setFourTsDone(true);
    const names = [...tracksSet].map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(", ");
    addLog("four_ts", `Four T's: ${names}`);
  }

  function handleBloodLossAdd(delta) {
    setBloodLoss(prev => {
      const next = prev + delta;
      addLog("blood_loss", `Blood loss check: +${delta} ml → ${next} ml`);
      return next;
    });
  }

  function handleBloodLossUnchanged() {
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
  }

  function handleStandDown() {
    const t = Date.now();
    setResolveTime(t);
    setLog(prev => [...prev, { kind: "stand_down", label: `Emergency stood down — total blood loss ${bloodLoss} ml`, time: t }]);
    setStandDownConfirm(false);
    setPhase("summary");
  }

  // ── Render ──

  if (phase === "setup") return <SetupScreen onConfirm={handleSetup} />;

  if (phase === "summary") {
    return (
      <SummaryScreen
        log={log}
        emergencyStartTime={emergencyStartTime}
        resolveTime={resolveTime}
        bloodLoss={bloodLoss}
        onBack={onClose}
      />
    );
  }

  function renderPrompt() {
    if (!prompt) return null;
    switch (prompt.type) {
      case "task":
        return (
          <TaskPromptCard
            task={prompt.task}
            completedCount={completedCount}
            totalCount={relevantTasks.length}
            onDone={handleDone}
            onAssign={handleAssign}
            onSkip={handleSkip}
          />
        );
      case "followup":
        return <FollowUpCard task={prompt.task} onYes={handleFollowupYes} onNo={handleFollowupNo} />;
      case "four_ts":
        return <FourTsCard onConfirm={handleFourTs} />;
      case "blood_loss_check":
        return <BloodLossCheckCard level={level} bloodLoss={bloodLoss} onAdd={handleBloodLossAdd} onUnchanged={handleBloodLossUnchanged} />;
      case "carbo_dose":
        return <CarboDoseCard count={carboCount} onDose={handleCarboDose} onSkip={handleCarboSkip} />;
      case "monitoring":
        return <MonitoringCard taskStates={taskStates} level={level} now={now} onConfirm={handleConfirmTask} />;
      default:
        return null;
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-950 overflow-hidden">
      {escalationAlert && (
        <EscalationOverlay level={escalationAlert} onDismiss={() => setEscalationAlert(null)} />
      )}

      {standDownConfirm && (
        <StandDownConfirm
          bloodLoss={bloodLoss}
          onConfirm={handleStandDown}
          onCancel={() => setStandDownConfirm(false)}
        />
      )}

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
        birthTime={emergencyStartTime}
        carboCount={carboCount}
        carboLastTime={carboLastTime}
        now={now}
      />

      <div className="flex-1 overflow-y-auto px-4 py-5">
        {renderPrompt()}
      </div>

      <MiniTimeline log={log} />
    </div>
  );
}
