import { useState, useEffect } from "react";

function padded(n) { return String(n).padStart(2, "0"); }
function fmtClock(s) {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  if (h > 0) return `${h}h ${padded(m)}m ${padded(sec)}s`;
  return `${padded(m)}m ${padded(sec)}s`;
}
function fmtTime(d) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}

const LEVEL_ORDER = ["minor", "major", "massive"];

const LEVEL_META = {
  minor:   { label: "Minor",   range: "500–1000 ml", hBg: "bg-orange-700", barBg: "bg-orange-400", muted: "text-orange-200", threshold: 1000, from: 500  },
  major:   { label: "Major",   range: ">1000 ml",    hBg: "bg-red-800",    barBg: "bg-red-400",    muted: "text-red-200",    threshold: 2000, from: 1000 },
  massive: { label: "Massive", range: ">2000 ml",    hBg: "bg-red-950",    barBg: null,            muted: "text-rose-300",   threshold: null, from: 2000 },
};

const TYPE_STYLE = {
  call:     { bg: "bg-red-600",    label: "Call"     },
  drug:     { bg: "bg-violet-600", label: "Drug"     },
  access:   { bg: "bg-blue-600",   label: "Access"   },
  fluid:    { bg: "bg-sky-600",    label: "Fluid"    },
  blood:    { bg: "bg-rose-600",   label: "Blood"    },
  action:   { bg: "bg-slate-600",  label: "Action"   },
  surgical: { bg: "bg-amber-700",  label: "Surgical" },
};

const LEVEL_STEPS = {
  minor: [
    { type: "call",   title: "Call for help",            detail: "• Midwife in charge\n• On-call obstetrician" },
    { type: "action", title: "Bimanual uterine massage",  detail: "Rub up a uterine contraction — sustained bimanual compression until the uterus contracts and stays firm." },
    { type: "drug",   title: "Oxytocin 5 IU IV",         detail: "Give slowly IV over ~1 minute.\nOnly if not already given for active management of third stage." },
    { type: "drug",   title: "Oxytocin infusion",        detail: "40 IU in 500 ml Hartmann's\nRun at 125 ml/hr IV" },
    { type: "access", title: "IV access + bloods",       detail: "Minimum 1 × 16G peripheral cannula.\n\nBloods: FBC, coagulation, U&E, LFT, group & screen." },
    { type: "action", title: "Catheterise",               detail: "Target urine output >30 ml/hr.\nMonitor hourly." },
    { type: "action", title: "Check placenta & inspect",  detail: "Confirm placenta and membranes are complete.\nInspect cervix and vagina for trauma — good exposure and lighting.\nKeep warm; treat pain adequately." },
  ],
  major: [
    { type: "call",   title: "Escalate — major PPH",     detail: "• Senior midwife\n• Senior obstetrician\n• Anaesthetist\n• Alert theatre team\n• Activate major PPH protocol" },
    { type: "access", title: "2 × large bore cannulae",  detail: "14G or 16G × 2. Place second now if only one in situ.\n\nCrossmatch 4 units red cells urgently.\nRepeat FBC and coagulation." },
    { type: "fluid",  title: "Rapid crystalloid",        detail: "Hartmann's 1.5–2 L rapidly.\n\nO-negative blood immediately if life-threatening — do not wait for crossmatch." },
    { type: "drug",   title: "Tranexamic acid 1 g IV",  detail: "Over 10 minutes.\n\n⚠ TIME CRITICAL — must be within 3 hours of birth.", critical: true },
    { type: "drug",   title: "Carboprost 0.25 mg IM",   detail: "Every 15 minutes — start a dose timer.\nMaximum 8 doses total.\n\n⚠ Contraindicated in asthma." },
    { type: "blood",  title: "Blood products",           detail: "• FFP 4 units — if coagulopathy or fibrinogen <1.5 g/L\n• Cryoprecipitate 2 pools — if fibrinogen <2 g/L (first-line for fibrinogen)\n• Platelets — if <75 × 10⁹/L (or <100 if ongoing bleeding)" },
    { type: "action", title: "Explore & inspect",        detail: "Explore uterine cavity if doubt about placental completeness.\nInspect cervix and vagina — full exposure and lighting.\nCorrect coagulopathy before surgery where possible." },
  ],
  massive: [
    { type: "call",     title: "Activate massive PPH",    detail: "• Consultant obstetrician — now\n• Consultant anaesthetist — now\n• Haematologist — now\n• Blood bank — activate MHP\n• Interventional radiology if UAE planned" },
    { type: "blood",    title: "MHP pack immediately",    detail: "6 units red cells + 4 units FFP\n± Platelets ± Cryoprecipitate\n\nCall blood bank now — do not delay." },
    { type: "drug",     title: "Calcium gluconate",       detail: "10 ml of 10% calcium gluconate per 4 units red cells transfused.\n\nMassive transfusion causes citrate-induced hypocalcaemia." },
    { type: "drug",     title: "TXA if not yet given",   detail: "1 g IV over 10 minutes.\n⚠ Must be within 3 hours of birth.", critical: true },
    { type: "action",   title: "ROTEM/TEG coagulation",  detail: "Point-of-care coagulation to guide product selection.\n\nMaintain normothermia and correct acidosis — both worsen coagulopathy." },
    { type: "action",   title: "Cell salvage",            detail: "Activate if available.\nHaematologist authorisation required if Rh-negative." },
    { type: "surgical", title: "Bakri balloon tamponade", detail: "Inflate with 300–500 ml saline — 'tamponade test'.\nIf bleeding stops, may avoid theatre.\n\nHave theatre prepared regardless." },
    { type: "surgical", title: "Transfer to theatre",     detail: "Prepare for surgical haemostasis:\n• B-Lynch brace suture\n• Hayman suture\n• Bilateral uterine artery ligation\n• Uterine artery embolisation (UAE) — if haemodynamically stable\n• Peripartum hysterectomy — life-saving last resort" },
  ],
};

const POST_EVENT = [
  "HDU or ITU admission — risk of late coagulopathy and renal failure (MBRRACE: early step-down was a recurring finding)",
  "VTE risk assessment — LMWH once haemostasis is achieved",
  "Debrief patient and partner with written summary",
  "Postnatal consultant debrief before discharge",
  "MBRRACE notification if maternal near-miss or death",
];

// ── Setup screen ───────────────────────────────────────────────────────────
function SetupScreen({ onConfirm }) {
  const opts = [
    { label: "~500 ml",  ml: 500,  tag: "Minor",   primary: true },
    { label: "~750 ml",  ml: 750,  tag: "Minor",   primary: false },
    { label: "~1000 ml", ml: 1000, tag: "Major",   primary: false },
    { label: "~1500 ml", ml: 1500, tag: "Major",   primary: false },
    { label: ">2000 ml", ml: 2000, tag: "Massive", primary: false },
  ];
  return (
    <div
      className="flex flex-col h-full bg-orange-700"
      style={{ paddingTop: "max(20px, env(safe-area-inset-top))", paddingBottom: "max(20px, env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-center gap-2 px-5 pt-2 pb-6">
        <div className="w-1.5 h-1.5 rounded-full bg-orange-300 animate-pulse" />
        <span className="text-[10px] font-bold tracking-widest uppercase text-orange-200">Postpartum Haemorrhage · GTG52</span>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white text-center mb-2">Estimated blood loss?</h1>
        <p className="text-orange-200 text-sm text-center mb-10">Sets the starting protocol level</p>
        <div className="space-y-3 w-full max-w-xs">
          {opts.map(o => (
            <button
              key={o.ml}
              onClick={() => onConfirm(o.ml)}
              className={`w-full rounded-2xl font-bold transition-all active:scale-[0.98] flex items-center justify-between px-5 ${
                o.primary
                  ? "py-5 bg-white text-orange-800 text-lg shadow-lg"
                  : "py-4 bg-orange-600/60 text-white text-base border border-orange-500/60"
              }`}
            >
              <span>{o.label}</span>
              <span className={`text-xs font-bold rounded-lg px-2 py-0.5 ${
                o.tag === "Minor"   ? "bg-orange-200/40 text-orange-100" :
                o.tag === "Major"   ? "bg-red-200/40 text-red-100"       :
                                      "bg-rose-300/40 text-rose-100"
              }`}>{o.tag}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Persistent header ──────────────────────────────────────────────────────
function Header({ emergencyStartTime, bloodLoss, currentLevel, now, onAddBlood, onStandDown, onClose }) {
  const meta = LEVEL_META[currentLevel];
  const elapsed = Math.floor((now - emergencyStartTime) / 1000);
  const nearThreshold = meta.threshold && bloodLoss >= meta.threshold * 0.85;
  const pct = meta.threshold
    ? Math.min(100, ((bloodLoss - meta.from) / (meta.threshold - meta.from)) * 100)
    : 100;

  return (
    <div className={`${meta.hBg} text-white flex-shrink-0`} style={{ paddingTop: "max(12px, env(safe-area-inset-top))" }}>
      {/* Row 1 */}
      <div className="px-4 pt-2 pb-2 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-red-300 animate-pulse" />
            <span className={`text-[10px] font-bold tracking-widest uppercase ${meta.muted}`}>PPH · GTG52</span>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <p className={`text-[9px] uppercase tracking-wide ${meta.muted}`}>Declared</p>
              <p className="text-base font-mono font-bold tabular-nums leading-tight">{fmtClock(elapsed)}</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div>
              <p className={`text-[9px] uppercase tracking-wide ${meta.muted}`}>Blood loss</p>
              <p className={`text-base font-mono font-bold tabular-nums leading-tight ${nearThreshold ? "text-amber-300" : "text-white"}`}>
                {bloodLoss} ml
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <button
            onClick={onStandDown}
            className="text-[11px] font-bold text-green-300 bg-green-900/40 border border-green-700/40 px-3 py-1.5 rounded-xl"
          >
            Stand Down
          </button>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10"
          >
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      {/* Row 2: blood add buttons + level badge */}
      <div className="px-4 pb-2 flex items-center gap-2">
        <span className={`text-[9px] uppercase tracking-wide font-bold ${meta.muted}`}>Add:</span>
        {[100, 250, 500].map(ml => (
          <button
            key={ml}
            onClick={() => onAddBlood(ml)}
            className="text-xs font-bold text-white bg-white/15 border border-white/20 px-3 py-1 rounded-lg active:bg-white/30"
          >
            +{ml}
          </button>
        ))}
        <div className="ml-auto">
          <span className={`text-[10px] font-black uppercase tracking-wide px-2.5 py-1 rounded-lg ${
            currentLevel === "minor"   ? "bg-orange-500 text-white" :
            currentLevel === "major"   ? "bg-red-600 text-white"    :
                                         "bg-rose-900 text-rose-200 border border-rose-700"
          }`}>{meta.label}</span>
        </div>
      </div>
      {/* Threshold progress bar */}
      {meta.threshold && (
        <div className="px-4 pb-2">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${nearThreshold ? "bg-amber-400" : meta.barBg}`}
              style={{ width: `${Math.max(2, pct)}%` }}
            />
          </div>
          {nearThreshold && (
            <p className="text-[10px] font-bold text-amber-300 mt-1">
              ⚠ Approaching {currentLevel === "minor" ? "major" : "massive"} threshold ({meta.threshold} ml)
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Level progress bar ─────────────────────────────────────────────────────
function LevelBar({ currentLevel }) {
  const idx = LEVEL_ORDER.indexOf(currentLevel);
  const meta = LEVEL_META[currentLevel];
  return (
    <div className={`${meta.hBg} flex-shrink-0 px-4 pb-3 flex items-center gap-1.5`}>
      {LEVEL_ORDER.map((l, i) => (
        <div key={l} className="flex items-center gap-1.5">
          {i > 0 && <div className={`h-px w-5 ${i <= idx ? "bg-white/50" : "bg-white/15"}`} />}
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all ${
            i < idx  ? "bg-green-500 text-white"       :
            i === idx ? "bg-white text-gray-900"        :
                        "bg-white/10 text-white/35"
          }`}>
            {LEVEL_META[l].label}
          </span>
        </div>
      ))}
      <span className={`ml-auto text-[10px] ${meta.muted}`}>{meta.range}</span>
    </div>
  );
}

// ── Single step screen ─────────────────────────────────────────────────────
function StepScreen({ step, stepIndex, totalSteps, currentLevel, emergencyStartTime, bloodLoss, now, onDone, onAddBlood, onStandDown, onClose, nextStep }) {
  const tStyle = TYPE_STYLE[step.type] || TYPE_STYLE.action;
  return (
    <div className="flex flex-col h-full">
      <Header
        emergencyStartTime={emergencyStartTime}
        bloodLoss={bloodLoss}
        currentLevel={currentLevel}
        now={now}
        onAddBlood={onAddBlood}
        onStandDown={onStandDown}
        onClose={onClose}
      />
      <LevelBar currentLevel={currentLevel} />

      {/* Step type chip + counter */}
      <div className="flex-shrink-0 bg-gray-50 border-b border-gray-100 px-4 py-1.5 flex items-center gap-2">
        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white ${tStyle.bg}`}>
          {tStyle.label}
        </span>
        <span className="text-xs text-gray-400 ml-auto">{stepIndex + 1} / {totalSteps}</span>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col px-4 pt-5 pb-3 min-h-0">
        <div className="flex-shrink-0 mb-4">
          {step.critical && (
            <span className="text-[9px] font-black bg-red-600 text-white px-2 py-0.5 rounded mb-2 inline-block">
              TIME CRITICAL
            </span>
          )}
          <h2 className={`text-xl font-bold text-gray-900 leading-snug ${step.critical ? "mt-1" : ""}`}>{step.title}</h2>
        </div>

        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 overflow-y-auto min-h-0">
          <p className="text-[15px] text-gray-700 leading-relaxed whitespace-pre-line">{step.detail}</p>
        </div>
      </div>

      {/* Done button */}
      <div
        className="flex-shrink-0 bg-white border-t border-gray-100 px-4 pt-3"
        style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
      >
        <button
          onClick={onDone}
          className="w-full py-5 rounded-2xl bg-red-700 text-white font-bold text-base flex items-center justify-center gap-3 active:bg-red-800 active:scale-[0.98] transition-all shadow-sm"
        >
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>
            Done
            {nextStep
              ? <span className="font-normal opacity-80"> — Next: {nextStep.title}</span>
              : <span className="font-normal opacity-80"> — All steps complete</span>
            }
          </span>
        </button>
      </div>
    </div>
  );
}

// ── Level complete (all steps done, monitoring) ────────────────────────────
function LevelCompleteScreen({ currentLevel, emergencyStartTime, bloodLoss, now, onAddBlood, onStandDown, onClose }) {
  const meta = LEVEL_META[currentLevel];
  return (
    <div className="flex flex-col h-full">
      <Header
        emergencyStartTime={emergencyStartTime}
        bloodLoss={bloodLoss}
        currentLevel={currentLevel}
        now={now}
        onAddBlood={onAddBlood}
        onStandDown={onStandDown}
        onClose={onClose}
      />
      <LevelBar currentLevel={currentLevel} />

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{meta.label} steps complete</h2>
          <p className="text-sm text-gray-500 mt-1.5 leading-snug">Continue monitoring blood loss.<br />Auto-escalates if threshold is crossed.</p>
        </div>
        {meta.threshold && (
          <div className="bg-gray-100 rounded-2xl px-5 py-3 text-sm text-gray-600">
            {meta.label === "Minor"
              ? `Escalates to Major at ${meta.threshold} ml — currently ${bloodLoss} ml`
              : `Escalates to Massive at ${meta.threshold} ml — currently ${bloodLoss} ml`}
          </div>
        )}
      </div>

      <div
        className="flex-shrink-0 bg-white border-t border-gray-100 px-4 pt-3"
        style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
      >
        <button
          onClick={onStandDown}
          className="w-full py-4 rounded-2xl bg-green-600 text-white font-bold text-base flex items-center justify-center gap-2 active:bg-green-700"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Stand Down — Resolve Emergency
        </button>
      </div>
    </div>
  );
}

// ── Summary screen ─────────────────────────────────────────────────────────
function SummaryScreen({ emergencyStartTime, resolveTime, bloodLoss, stepsCompleted, onClose }) {
  const duration = Math.floor((resolveTime - emergencyStartTime) / 1000);
  const finalLevel = bloodLoss >= 2000 ? "Massive" : bloodLoss >= 1000 ? "Major" : "Minor";

  return (
    <div className="flex flex-col h-full">
      <div className="bg-green-700 text-white flex-shrink-0" style={{ paddingTop: "max(12px, env(safe-area-inset-top))" }}>
        <div className="px-4 pt-3 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-green-200">Emergency Stood Down</span>
          </div>
          <h1 className="text-xl font-bold">PPH Summary</h1>
          <p className="text-xs text-green-300 mt-0.5">{fmtTime(emergencyStartTime)} → {fmtTime(resolveTime)}</p>
          <div className="flex gap-2 mt-3">
            {[
              { value: fmtClock(duration), label: "Duration" },
              { value: `${bloodLoss} ml`,  label: "Blood loss" },
              { value: finalLevel,          label: "Max level" },
              { value: stepsCompleted,      label: "Steps done" },
            ].map(s => (
              <div key={s.label} className="flex-1 bg-white/15 rounded-xl px-1.5 py-2.5 text-center">
                <p className="text-sm font-bold tabular-nums leading-tight">{s.value}</p>
                <p className="text-[10px] text-green-200 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50 pb-4">
        {/* MBRRACE */}
        <div className="mx-4 mt-4 mb-4 bg-rose-50 border border-rose-200 rounded-2xl p-4">
          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-rose-600 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-white text-[10px] font-black">M</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-rose-500 tracking-wider uppercase mb-1">MBRRACE</p>
              <p className="text-sm text-rose-900 leading-relaxed">
                Consultant involvement was frequently delayed in massive PPH deaths reviewed by MBRRACE. Delayed escalation and late haematologist contact were recurring findings. Delayed escalation is the most impactful modifiable factor.
              </p>
            </div>
          </div>
        </div>

        {/* Post-event checklist */}
        <div className="mx-4 mb-4">
          <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-2">After Stabilisation</p>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {POST_EVENT.map((item, i) => (
              <div key={i} className={`flex items-start gap-3 px-4 py-3 ${i > 0 ? "border-t border-gray-50" : ""}`}>
                <svg className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                <p className="text-sm text-gray-700 leading-snug">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="flex-shrink-0 bg-white border-t border-gray-200 px-4 pt-3"
        style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
      >
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-gray-100 text-gray-700 font-bold text-sm active:bg-gray-200"
        >
          Close
        </button>
      </div>
    </div>
  );
}

// ── Root ───────────────────────────────────────────────────────────────────
export default function EmergencyPage({ onClose }) {
  const [emergencyStartTime] = useState(() => new Date());
  const [phase, setPhase] = useState("setup"); // setup | steps | level-complete | summary
  const [bloodLoss, setBloodLoss] = useState(0);
  const [currentLevel, setCurrentLevel] = useState("minor");
  const [stepIndex, setStepIndex] = useState(0);
  const [stepsCompleted, setStepsCompleted] = useState(0);
  const [resolveTime, setResolveTime] = useState(null);
  const [now, setNow] = useState(() => new Date());
  const [escalationBanner, setEscalationBanner] = useState(null);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!("wakeLock" in navigator)) return;
    let lock;
    navigator.wakeLock.request("screen").then(l => { lock = l; }).catch(() => {});
    return () => { lock?.release(); };
  }, []);

  // Auto-escalation based on blood loss
  useEffect(() => {
    if (phase === "setup" || phase === "summary") return;
    const derived = bloodLoss >= 2000 ? "massive" : bloodLoss >= 1000 ? "major" : "minor";
    const shouldEscalate = LEVEL_ORDER.indexOf(derived) > LEVEL_ORDER.indexOf(currentLevel);
    if (!shouldEscalate) return;
    setCurrentLevel(derived);
    setStepIndex(0);
    setPhase("steps");
    setEscalationBanner(derived === "massive" ? "⬆ Escalated to MASSIVE PPH" : "⬆ Escalated to MAJOR PPH");
  }, [bloodLoss]);

  // Auto-clear escalation banner
  useEffect(() => {
    if (!escalationBanner) return;
    const t = setTimeout(() => setEscalationBanner(null), 3000);
    return () => clearTimeout(t);
  }, [escalationBanner]);

  const handleSetup = (ml) => {
    const level = ml >= 2000 ? "massive" : ml >= 1000 ? "major" : "minor";
    setBloodLoss(ml);
    setCurrentLevel(level);
    setPhase("steps");
  };

  const handleAddBlood = (ml) => setBloodLoss(prev => prev + ml);

  const handleStepDone = () => {
    setStepsCompleted(c => c + 1);
    const steps = LEVEL_STEPS[currentLevel];
    if (stepIndex < steps.length - 1) {
      setStepIndex(i => i + 1);
    } else {
      setPhase("level-complete");
    }
  };

  const handleStandDown = () => {
    setResolveTime(new Date());
    setPhase("summary");
  };

  const currentSteps = LEVEL_STEPS[currentLevel];
  const step = currentSteps?.[stepIndex];
  const nextStep = currentSteps?.[stepIndex + 1];

  return (
    <div
      className="fixed inset-0 z-50 bg-gray-50 flex flex-col"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif" }}
    >
      {phase === "setup" && (
        <SetupScreen onConfirm={handleSetup} />
      )}

      {phase === "steps" && step && (
        <>
          <StepScreen
            step={step}
            stepIndex={stepIndex}
            totalSteps={currentSteps.length}
            currentLevel={currentLevel}
            emergencyStartTime={emergencyStartTime}
            bloodLoss={bloodLoss}
            now={now}
            onDone={handleStepDone}
            onAddBlood={handleAddBlood}
            onStandDown={handleStandDown}
            onClose={onClose}
            nextStep={nextStep}
          />
          {escalationBanner && (
            <div className="absolute inset-x-0 top-0 z-[60] flex justify-center pt-24 pointer-events-none">
              <div className="bg-red-900 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl border border-red-700 animate-bounce">
                {escalationBanner}
              </div>
            </div>
          )}
        </>
      )}

      {phase === "level-complete" && (
        <LevelCompleteScreen
          currentLevel={currentLevel}
          emergencyStartTime={emergencyStartTime}
          bloodLoss={bloodLoss}
          now={now}
          onAddBlood={handleAddBlood}
          onStandDown={handleStandDown}
          onClose={onClose}
        />
      )}

      {phase === "summary" && (
        <SummaryScreen
          emergencyStartTime={emergencyStartTime}
          resolveTime={resolveTime}
          bloodLoss={bloodLoss}
          stepsCompleted={stepsCompleted}
          onClose={onClose}
        />
      )}
    </div>
  );
}
