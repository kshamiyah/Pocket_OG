import { useState, useEffect, useRef } from "react";

// ─── Task registry ─────────────────────────────────────────────────────────

const TASKS = [
  // Minor — Universal
  { id: "call_team",      level: "minor",   track: "universal", type: "call",     title: "Call for help",               detail: "• Midwife in charge\n• On-call obstetrician",                                                                                             followUpDelay: 120 },
  { id: "iv_access",      level: "minor",   track: "universal", type: "access",   title: "IV access + bloods",          detail: "Minimum 1 × 16G peripheral cannula\nBloods: FBC, coagulation, U&E, LFT, group & screen",                                                   followUpDelay: 90  },
  { id: "bimanual",       level: "minor",   track: "universal", type: "action",   title: "Bimanual uterine massage",    detail: "Rub up a contraction — sustained bimanual compression\nUterus should firm and stay contracted\nAlso diagnostic: is it firm after massage?", followUpDelay: null },
  { id: "catheterise",    level: "minor",   track: "universal", type: "action",   title: "Catheterise",                 detail: "Target urine output >30 ml/hr\nMonitor hourly" },
  { id: "iv_fluids",      level: "minor",   track: "universal", type: "fluid",    title: "IV fluids",                   detail: "Hartmann's or 0.9% saline — fluid resuscitation",                                                                                           deps: ["iv_access"] },
  // Minor — Tone
  { id: "oxytocin_bolus", level: "minor",   track: "tone",      type: "drug",     title: "Oxytocin 5 IU IV",            detail: "Slowly IV over ~1 minute\nOnly if not already given for active management of third stage",                                                  followUpDelay: 60,  deps: ["iv_access"] },
  { id: "oxytocin_inf",   level: "minor",   track: "tone",      type: "drug",     title: "Oxytocin infusion",           detail: "40 IU in 500 ml Hartmann's\nRun at 125 ml/hr IV",                                                                                           followUpDelay: 60,  deps: ["iv_access"] },
  { id: "ergometrine",    level: "minor",   track: "tone",      type: "drug",     title: "Ergometrine 500 mcg",         detail: "IM or slow IV\n⚠ Avoid if hypertension, pre-eclampsia, cardiac disease or asthma",                                                          followUpDelay: 60,  deps: ["iv_access"] },
  // Minor — Trauma
  { id: "inspect_canal",  level: "minor",   track: "trauma",    type: "action",   title: "Inspect birth canal",         detail: "Systematic inspection of cervix, vagina, perineum\nGood exposure and lighting essential\nSuture all visible lacerations",                    followUpDelay: 120 },
  // Minor — Tissue
  { id: "check_placenta", level: "minor",   track: "tissue",    type: "action",   title: "Check placenta",              detail: "Confirm placenta and membranes are complete\nIf uncertain, proceed to manual exploration under anaesthesia",                                 followUpDelay: 120 },
  // Minor — Thrombin
  { id: "coag_review",    level: "minor",   track: "thrombin",  type: "action",   title: "Review coagulation",          detail: "Review coagulation results when available\nContact haematologist if known or suspected pre-existing coagulopathy",                           deps: ["iv_access"] },
  // Major — Universal
  { id: "call_major",     level: "major",   track: "universal", type: "call",     title: "Escalate — major PPH",        detail: "• Senior midwife\n• Senior obstetrician\n• Anaesthetist\n• Alert theatre team\n• Activate major PPH protocol",                              followUpDelay: 120 },
  { id: "second_cannula", level: "major",   track: "universal", type: "access",   title: "2nd large bore cannula",      detail: "14G or 16G — place second cannula now\nCrossmatch 4 units red cells urgently\nRepeat FBC and coagulation",                                  followUpDelay: 90,  critical: true },
  { id: "rapid_cryst",    level: "major",   track: "universal", type: "fluid",    title: "Rapid crystalloid",           detail: "Hartmann's 1.5–2 L rapidly\nO-negative blood if life-threatening before crossmatch — do not wait",                                          deps: ["iv_access"] },
  { id: "blood_products", level: "major",   track: "universal", type: "blood",    title: "Blood products",              detail: "• FFP 4 units — coagulopathy or fibrinogen <1.5 g/L\n• Cryoprecipitate 2 pools — fibrinogen <2 g/L\n• Platelets — if <75 × 10⁹/L",          deps: ["iv_access"] },
  // Major — Tone
  { id: "txa",            level: "major",   track: "tone",      type: "drug",     title: "Tranexamic acid 1 g IV",      detail: "Over 10 minutes IV\n⚠ TIME CRITICAL — must be within 3 hours of birth",                                                                     followUpDelay: 60,  critical: true, special: "txa", deps: ["iv_access"] },
  { id: "carboprost",     level: "major",   track: "tone",      type: "drug",     title: "Carboprost 0.25 mg IM",       detail: "Every 15 minutes — up to 8 doses\n⚠ Contraindicated in asthma",                                                                            special: "carbo" },
  // Major — Trauma
  { id: "theatre_trauma", level: "major",   track: "trauma",    type: "call",     title: "Alert theatre — repair",      detail: "Complex laceration or suspected uterine rupture\nSurgical repair required",                                                                  followUpDelay: 120 },
  // Major — Tissue
  { id: "explore_cavity", level: "major",   track: "tissue",    type: "action",   title: "Explore uterine cavity",      detail: "Manual exploration under anaesthesia\nManual removal of placenta if retained\nCurettage if required",                                         followUpDelay: 120 },
  // Major — Thrombin
  { id: "haematologist",  level: "major",   track: "thrombin",  type: "call",     title: "Contact haematologist",       detail: "Do not wait for massive escalation\nEarly haematologist involvement guides product replacement",                                               followUpDelay: 120 },
  // Massive — Universal
  { id: "call_massive",   level: "massive", track: "universal", type: "call",     title: "Activate massive PPH",        detail: "• Consultant obstetrician — NOW\n• Consultant anaesthetist — NOW\n• Haematologist — NOW\n• Blood bank — activate MHP\n• IR if UAE planned",  followUpDelay: 120, critical: true },
  { id: "mhp_pack",       level: "massive", track: "universal", type: "blood",    title: "MHP pack immediately",        detail: "6 units red cells + 4 units FFP\n± Platelets ± Cryoprecipitate\nCall blood bank now",                                                        followUpDelay: 120, deps: ["iv_access"] },
  { id: "txa_massive",    level: "massive", track: "universal", type: "drug",     title: "TXA if not yet given",        detail: "1 g IV over 10 minutes\n⚠ Must be within 3 hours of birth",                                                                                  critical: true, special: "txa", deps: ["iv_access"] },
  { id: "calcium",        level: "massive", track: "universal", type: "drug",     title: "Calcium gluconate",           detail: "10 ml of 10% calcium gluconate per 4 units red cells transfused\nPrevents citrate-induced hypocalcaemia",                                      deps: ["iv_access"] },
  { id: "rotem_teg",      level: "massive", track: "universal", type: "action",   title: "ROTEM/TEG coagulation",       detail: "Point-of-care coagulation to guide product selection\nMaintain normothermia — correct acidosis" },
  { id: "cell_salvage",   level: "massive", track: "universal", type: "action",   title: "Cell salvage",                detail: "Activate if available\nHaematologist authorisation required if Rh-negative" },
  { id: "bakri",          level: "massive", track: "tone",      type: "surgical", title: "Bakri balloon tamponade",     detail: "Inflate with 300–500 ml saline — tamponade test\nIf bleeding stops, may avoid theatre\nHave theatre prepared regardless" },
  { id: "theatre",        level: "massive", track: "universal", type: "surgical", title: "Transfer to theatre",         detail: "B-Lynch / Hayman brace suture\nBilateral uterine artery ligation\nUAE — if haemodynamically stable\nPeripartum hysterectomy — last resort" },
];

const LEVEL_ORDER = ["minor", "major", "massive"];
function levelVal(l) { return LEVEL_ORDER.indexOf(l); }

function getLevel(ml) {
  if (ml >= 2000) return "massive";
  if (ml >= 1000) return "major";
  return "minor";
}

function computeNextPrompt({ taskStates, activeTracks, level, fourTsDone, log, txaTime, carboCount, carboLastTime, now }) {
  function depsOk(task) {
    return (task.deps || []).every(id => {
      const s = taskStates[id]?.status;
      return s === "done" || s === "skipped";
    });
  }
  function relevant(task) {
    return levelVal(task.level) <= levelVal(level) &&
      (task.track === "universal" || activeTracks.has(task.track));
  }
  function st(id) { return taskStates[id]?.status ?? null; }

  // 1. Four T's — after bimanual done or skipped
  const bimanualActedOn = ["done", "skipped"].includes(st("bimanual"));
  if (!fourTsDone && bimanualActedOn) return { type: "four_ts" };

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

  // 5. Carboprost repeat dose
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
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${String(m % 60).padStart(2, "0")}m`;
  return `${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

function fmtTime(date) {
  return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const TYPE_ICON = {
  call: "📞", access: "💉", action: "🩺", fluid: "💧", drug: "💊", blood: "🩸", surgical: "🔪",
};

const KIND_ICON = {
  task_done: "✅", task_assigned: "📋", task_skipped: "⏭", four_ts: "🔲", blood_loss: "🩸",
  followup_done: "✅", followup_pending: "⏳", escalated: "🚨", carbo_dose: "💊", carbo_skip: "⏭",
};

const LEVEL_STYLES = {
  minor:   { badge: "bg-yellow-100 text-yellow-800", label: "Minor PPH",   border: "border-yellow-400" },
  major:   { badge: "bg-orange-100 text-orange-800", label: "Major PPH",   border: "border-orange-400" },
  massive: { badge: "bg-red-100 text-red-800",       label: "Massive PPH", border: "border-red-500"    },
};

// ─── Sub-components ────────────────────────────────────────────────────────

function SetupScreen({ onConfirm }) {
  const [ml, setMl] = useState("");
  const presets = [300, 500, 750, 1000, 1500, 2000];

  function submit(value) {
    const n = Number(value);
    if (!isNaN(n) && n >= 0) onConfirm(n);
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 gap-6">
      <div className="text-center">
        <div className="text-5xl mb-3">🩸</div>
        <h1 className="text-white text-2xl font-bold">PPH — Initial Assessment</h1>
        <p className="text-gray-400 mt-2">How much blood has been lost?</p>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
        {presets.map(v => (
          <button
            key={v}
            onClick={() => submit(v)}
            className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl text-base transition"
          >
            {v} ml
          </button>
        ))}
      </div>

      <div className="w-full max-w-xs">
        <p className="text-gray-400 text-sm text-center mb-2">Or enter exact amount</p>
        <div className="flex gap-2">
          <input
            type="number"
            value={ml}
            onChange={e => setMl(e.target.value)}
            placeholder="ml"
            className="flex-1 bg-gray-800 text-white rounded-xl px-4 py-3 text-base outline-none focus:ring-2 focus:ring-red-500"
            onKeyDown={e => e.key === "Enter" && submit(ml)}
          />
          <button
            onClick={() => submit(ml)}
            className="bg-red-600 hover:bg-red-500 text-white font-bold px-5 py-3 rounded-xl transition"
          >
            Go
          </button>
        </div>
      </div>
    </div>
  );
}

function Header({ elapsed, bloodLoss, level, onAddBlood, onStandDown }) {
  const ls = LEVEL_STYLES[level];

  return (
    <div className={`bg-gray-900 border-b-2 ${ls.border} px-4 pt-3 pb-2 flex-shrink-0`}>
      <div className="flex items-center justify-between mb-2">
        <div className="font-mono text-white text-lg font-bold">{fmt(elapsed)}</div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${ls.badge}`}>{ls.label}</span>
        <button
          onClick={onStandDown}
          className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded-full transition"
        >
          Stand Down
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-gray-400 text-sm font-medium">Blood loss:</span>
        <span className="text-white font-bold text-base">{bloodLoss} ml</span>
        <div className="flex gap-1.5 ml-auto">
          {[100, 250, 500].map(n => (
            <button
              key={n}
              onClick={() => onAddBlood(n)}
              className="bg-red-900/60 hover:bg-red-700 text-red-200 text-xs font-bold px-2.5 py-1 rounded-lg transition"
            >
              +{n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function DrugStrip({ txaTime, birthTime, carboCount, carboLastTime, now }) {
  const strips = [];

  if (txaTime) {
    const windowMs = 3 * 60 * 60 * 1000;
    const deadline = birthTime + windowMs;
    const remaining = Math.max(0, deadline - now);
    const pct = Math.max(0, Math.min(100, (remaining / windowMs) * 100));
    const expired = remaining === 0;
    strips.push(
      <div key="txa" className="flex items-center gap-2 bg-purple-950/70 border border-purple-700 rounded-lg px-3 py-1.5">
        <span className="text-purple-300 text-xs font-bold">TXA</span>
        <div className="flex-1 bg-gray-700 rounded-full h-1.5 min-w-[60px]">
          <div
            className={`h-1.5 rounded-full transition-all ${expired ? "bg-red-500" : "bg-purple-400"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className={`text-xs font-mono ${expired ? "text-red-400" : "text-purple-300"}`}>
          {expired ? "WINDOW CLOSED" : fmt(remaining)}
        </span>
      </div>
    );
  }

  if (carboCount > 0) {
    const nextMs = carboLastTime ? Math.max(0, carboLastTime + 15 * 60 * 1000 - now) : null;
    strips.push(
      <div key="carbo" className="flex items-center gap-2 bg-violet-950/70 border border-violet-700 rounded-lg px-3 py-1.5">
        <span className="text-violet-300 text-xs font-bold">Carboprost</span>
        <span className="text-white text-xs font-bold">{carboCount}/8</span>
        {nextMs !== null && (
          <span className={`text-xs font-mono ml-auto ${nextMs === 0 ? "text-yellow-400 font-bold" : "text-violet-300"}`}>
            {nextMs === 0 ? "DOSE DUE" : `next in ${fmt(nextMs)}`}
          </span>
        )}
      </div>
    );
  }

  if (strips.length === 0) return null;

  return (
    <div className="px-4 py-2 flex flex-col gap-1.5 bg-gray-900 border-b border-gray-800 flex-shrink-0">
      {strips}
    </div>
  );
}

function TaskPromptCard({ task, onDone, onAssign, onSkip }) {
  const [showDetail, setShowDetail] = useState(false);
  const icon = TYPE_ICON[task.type] ?? "📋";

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center">
        <div className="text-4xl mb-2">{icon}</div>
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
          {task.track !== "universal" ? `${task.track.toUpperCase()} — ` : ""}{task.type.toUpperCase()}
        </div>
        <h2 className="text-white text-2xl font-bold leading-tight">{task.title}</h2>
      </div>

      {task.detail && (
        <div>
          <button
            onClick={() => setShowDetail(v => !v)}
            className="w-full text-left text-xs text-blue-400 font-medium mb-1"
          >
            {showDetail ? "Hide detail ▲" : "Show detail ▼"}
          </button>
          {showDetail && (
            <div className="bg-gray-800 rounded-xl p-3 text-gray-300 text-sm whitespace-pre-line leading-relaxed">
              {task.detail}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <button
          onClick={() => onDone(task)}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl text-lg transition"
        >
          Done ✓
        </button>
        <button
          onClick={() => onAssign(task)}
          className="w-full bg-red-700 hover:bg-red-600 text-white font-bold py-4 rounded-2xl text-lg transition"
        >
          Assign →
        </button>
        <button
          onClick={() => onSkip(task)}
          className="w-full text-gray-400 hover:text-gray-200 py-2 text-sm transition"
        >
          Already done / not applicable — skip
        </button>
      </div>
    </div>
  );
}

function FollowUpCard({ task, onYes, onNo }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-center">
        <div className="text-4xl mb-2">⏰</div>
        <div className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-1">Follow-up</div>
        <h2 className="text-white text-xl font-bold leading-tight">{task.title}</h2>
        <p className="text-gray-400 text-sm mt-2">This was assigned — has it been done?</p>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={() => onYes(task)}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl text-lg transition"
        >
          Yes — confirmed done ✓
        </button>
        <button
          onClick={() => onNo(task)}
          className="w-full bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-3 rounded-2xl text-base transition"
        >
          Not yet — check again soon
        </button>
      </div>
    </div>
  );
}

function FourTsCard({ onConfirm }) {
  const [selected, setSelected] = useState(new Set());

  const options = [
    { key: "tone",     label: "Tone",     desc: "Uterine atony — uterus boggy, not contracting" },
    { key: "trauma",   label: "Trauma",   desc: "Lacerations, haematoma, uterine rupture" },
    { key: "tissue",   label: "Tissue",   desc: "Retained placenta or membranes" },
    { key: "thrombin", label: "Thrombin", desc: "Coagulopathy — known or suspected" },
  ];

  function toggle(key) {
    setSelected(prev => {
      const n = new Set(prev);
      if (n.has(key)) n.delete(key); else n.add(key);
      return n;
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center">
        <div className="text-4xl mb-2">🔲</div>
        <div className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-1">Four T's Assessment</div>
        <h2 className="text-white text-xl font-bold">What is the cause?</h2>
        <p className="text-gray-400 text-sm mt-1">Select all that apply</p>
      </div>

      <div className="flex flex-col gap-2">
        {options.map(o => {
          const active = selected.has(o.key);
          return (
            <button
              key={o.key}
              onClick={() => toggle(o.key)}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 transition ${active
                ? "border-blue-500 bg-blue-900/40 text-white"
                : "border-gray-700 bg-gray-800 text-gray-300"}`}
            >
              <div className="font-bold">{o.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{o.desc}</div>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={() => onConfirm(selected.size > 0 ? selected : new Set(["tone", "trauma", "tissue", "thrombin"]))}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl text-lg transition"
        >
          {selected.size > 0 ? `Confirm (${selected.size} cause${selected.size > 1 ? "s" : ""})` : "Confirm — treat all"}
        </button>
        <button
          onClick={() => onConfirm(new Set(["tone", "trauma", "tissue", "thrombin"]))}
          className="w-full text-gray-400 hover:text-gray-200 py-2 text-sm transition"
        >
          Uncertain — treat all four T's
        </button>
      </div>
    </div>
  );
}

function BloodLossCheckCard({ level, onAdd, onUnchanged }) {
  const [custom, setCustom] = useState("");

  function submitCustom() {
    const n = Number(custom);
    if (!isNaN(n) && n > 0) { onAdd(n); setCustom(""); }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center">
        <div className="text-4xl mb-2">🩸</div>
        <div className="text-xs font-semibold text-red-400 uppercase tracking-widest mb-1">Blood Loss Check</div>
        <h2 className="text-white text-xl font-bold">Update blood loss estimate</h2>
        <p className="text-gray-400 text-sm mt-1">
          {level === "massive" ? "Every 3 minutes" : level === "major" ? "Every 4 minutes" : "Every 5 minutes"}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[100, 200, 250, 500, 750, 1000].map(n => (
          <button
            key={n}
            onClick={() => onAdd(n)}
            className="bg-red-900/50 hover:bg-red-700 text-red-100 font-bold py-3 rounded-xl text-sm transition"
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
          className="flex-1 bg-gray-800 text-white rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-500"
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
        className="w-full text-gray-400 hover:text-gray-200 py-2 text-sm transition"
      >
        No change — estimate unchanged
      </button>
    </div>
  );
}

function CarboDoseCard({ count, onDose, onSkip }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-center">
        <div className="text-4xl mb-2">💊</div>
        <div className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-1">Carboprost</div>
        <h2 className="text-white text-xl font-bold">Repeat dose due</h2>
        <p className="text-gray-300 text-base mt-1">0.25 mg IM — dose {count + 1} of 8</p>
        <p className="text-gray-400 text-sm mt-1">⚠ Contraindicated in asthma</p>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={onDose}
          className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-4 rounded-2xl text-lg transition"
        >
          Dose {count + 1} given ✓
        </button>
        <button
          onClick={onSkip}
          className="w-full text-gray-400 hover:text-gray-200 py-2 text-sm transition"
        >
          Skip — not appropriate
        </button>
      </div>
    </div>
  );
}

function MonitoringCard({ taskStates, activeTracks, level, onConfirm }) {
  const assigned = TASKS.filter(t => {
    if (levelVal(t.level) > levelVal(level)) return false;
    if (t.track !== "universal" && !activeTracks.has(t.track)) return false;
    return taskStates[t.id]?.status === "assigned";
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center">
        <div className="text-4xl mb-2">👁</div>
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Monitoring</div>
        <h2 className="text-white text-xl font-bold">All tasks dispatched</h2>
        <p className="text-gray-400 text-sm mt-1">Tap any task when completed</p>
      </div>

      {assigned.length === 0 ? (
        <p className="text-gray-500 text-center text-sm">No tasks in flight</p>
      ) : (
        <div className="flex flex-col gap-2">
          {assigned.map(t => (
            <button
              key={t.id}
              onClick={() => onConfirm(t.id)}
              className="w-full text-left bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl px-4 py-3 transition"
            >
              <div className="flex items-center gap-2">
                <span>{TYPE_ICON[t.type] ?? "📋"}</span>
                <span className="text-white font-medium text-sm flex-1">{t.title}</span>
                <span className="text-emerald-400 text-xs font-semibold">Mark done</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function MiniTimeline({ log }) {
  const recent = [...log].reverse().slice(0, 3);
  if (recent.length === 0) return null;

  return (
    <div className="flex-shrink-0 border-t border-gray-800 bg-gray-900 px-4 py-2">
      {recent.map((e, i) => (
        <div key={i} className="flex items-start gap-2 py-0.5">
          <span className="text-xs mt-0.5">{KIND_ICON[e.kind] ?? "•"}</span>
          <span className="text-gray-500 text-xs font-mono">{fmtTime(e.time)}</span>
          <span className="text-gray-400 text-xs">{e.label}</span>
        </div>
      ))}
    </div>
  );
}

function SummaryScreen({ log, emergencyStartTime, resolveTime, bloodLoss, onBack }) {
  const duration = resolveTime ? resolveTime - emergencyStartTime : Date.now() - emergencyStartTime;

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-4 flex-shrink-0">
        <h1 className="text-white text-xl font-bold">PPH — Summary</h1>
        <div className="flex gap-4 mt-1 text-sm text-gray-400">
          <span>Duration: <span className="text-white font-mono">{fmt(duration)}</span></span>
          <span>Total loss: <span className="text-red-400 font-bold">{bloodLoss} ml</span></span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {log.map((e, i) => (
          <div key={i} className="flex items-start gap-3 py-1.5 border-b border-gray-800">
            <span className="text-lg flex-shrink-0">{KIND_ICON[e.kind] ?? "•"}</span>
            <div className="flex-1 min-w-0">
              <span className="text-gray-400 text-xs font-mono mr-2">{fmtTime(e.time)}</span>
              <span className="text-gray-200 text-sm">{e.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 border-t border-gray-800 px-4 py-4 flex-shrink-0">
        <div className="bg-amber-950/50 border border-amber-700 rounded-xl p-3 mb-3 text-amber-200 text-xs leading-relaxed">
          <strong>MBRRACE reminder:</strong> Complete incident documentation, debrief the team, and ensure postnatal review is booked. Report to MBRRACE-UK if maternal near miss or death.
        </div>
        <div className="space-y-1.5 text-xs text-gray-400 mb-4">
          <p className="font-semibold text-gray-300">Post-event checklist</p>
          <p>☐ Written record of all drugs given with times and doses</p>
          <p>☐ Repeat FBC, coagulation, U&E, LFT at 4 hours</p>
          <p>☐ Postnatal debriefing offered to woman and partner</p>
          <p>☐ Thromboprophylaxis review</p>
          <p>☐ Iron therapy commenced</p>
          <p>☐ Incident report submitted</p>
        </div>
        <button
          onClick={onBack}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-xl transition"
        >
          Back to home
        </button>
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────

export default function EmergencyPage({ onClose }) {

  const [emergencyStartTime] = useState(() => Date.now());
  const [phase, setPhase] = useState("setup"); // setup | active | summary
  const [bloodLoss, setBloodLoss] = useState(0);
  const [taskStates, setTaskStates] = useState({});
  const [fourTsDone, setFourTsDone] = useState(false);
  const [activeTracks, setActiveTracks] = useState(new Set());
  const [log, setLog] = useState([]);
  const [txaTime, setTxaTime] = useState(null);
  const [carboCount, setCarboCount] = useState(0);
  const [carboLastTime, setCarboLastTime] = useState(null);
  const [resolveTime, setResolveTime] = useState(null);
  const [now, setNow] = useState(() => Date.now());

  const prevLevelRef = useRef(null);
  const wakeLockRef = useRef(null);

  // Tick every second
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Wake lock
  useEffect(() => {
    if (phase !== "active") return;
    if (!("wakeLock" in navigator)) return;
    navigator.wakeLock.request("screen").then(wl => { wakeLockRef.current = wl; }).catch(() => {});
    return () => { wakeLockRef.current?.release().catch(() => {}); };
  }, [phase]);

  const level = getLevel(bloodLoss);

  function addLog(kind, label) {
    setLog(prev => [...prev, { kind, label, time: Date.now() }]);
  }

  // Escalation detection
  useEffect(() => {
    if (phase !== "active") return;
    if (prevLevelRef.current && prevLevelRef.current !== level) {
      addLog("escalated", `Escalated to ${LEVEL_STYLES[level].label} (${bloodLoss} ml)`);
    }
    prevLevelRef.current = level;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  const prompt = phase === "active"
    ? computeNextPrompt({ taskStates, activeTracks, level, fourTsDone, log, txaTime, carboCount, carboLastTime, now })
    : null;

  // ── Handlers ──

  function handleSetup(ml) {
    setBloodLoss(ml);
    setLog([{ kind: "blood_loss", label: `Initial blood loss: ${ml} ml`, time: Date.now() }]);
    prevLevelRef.current = getLevel(ml);
    setPhase("active");
  }

  function handleAddBlood(delta) {
    setBloodLoss(prev => {
      const next = prev + delta;
      addLog("blood_loss", `Blood loss +${delta} ml → ${next} ml total`);
      return next;
    });
  }

  function handleDone(task) {
    setTaskStates(prev => ({ ...prev, [task.id]: { status: "done", doneAt: Date.now() } }));
    addLog("task_done", `Done: ${task.title}`);
    if (task.special === "txa") setTxaTime(Date.now());
    if (task.special === "carbo") {
      setCarboCount(1);
      setCarboLastTime(Date.now());
    }
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
    setTaskStates(prev => ({
      ...prev,
      [task.id]: { ...prev[task.id], assignedAt: Date.now() },
    }));
    addLog("followup_pending", `Still in progress: ${task.title}`);
  }

  function handleFourTs(tracksSet) {
    setActiveTracks(tracksSet);
    setFourTsDone(true);
    const names = [...tracksSet].map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(", ");
    addLog("four_ts", `Four T's assessed: ${names}`);
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
    setLog(prev => [...prev, { kind: "task_done", label: `Emergency stood down (${bloodLoss} ml total)`, time: t }]);
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
        return <TaskPromptCard task={prompt.task} onDone={handleDone} onAssign={handleAssign} onSkip={handleSkip} />;
      case "followup":
        return <FollowUpCard task={prompt.task} onYes={handleFollowupYes} onNo={handleFollowupNo} />;
      case "four_ts":
        return <FourTsCard onConfirm={handleFourTs} />;
      case "blood_loss_check":
        return <BloodLossCheckCard level={level} onAdd={handleBloodLossAdd} onUnchanged={handleBloodLossUnchanged} />;
      case "carbo_dose":
        return <CarboDoseCard count={carboCount} onDose={handleCarboDose} onSkip={handleCarboSkip} />;
      case "monitoring":
        return <MonitoringCard taskStates={taskStates} activeTracks={activeTracks} level={level} onConfirm={handleConfirmTask} />;
      default:
        return null;
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-950 overflow-hidden">
      <Header
        elapsed={now - emergencyStartTime}
        bloodLoss={bloodLoss}
        level={level}
        onAddBlood={handleAddBlood}
        onStandDown={handleStandDown}
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
