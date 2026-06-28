import { useState, useEffect, useRef } from "react";
import {
  PMCS_DECISION_SEC,
  PMCS_DELIVERY_SEC,
  CPR_CYCLE_SEC,
  ADRENALINE_INTERVAL_SEC,
  SHOCK_ENERGY,
  JOINT_ARREST_QUICK_TIMES,
  STANDALONE_IMMEDIATE_ACTIONS,
  filterImmediateActions,
  computeArrestNowPrompt,
  computeArrestComingUpItems,
  minsAgoToTimestamp,
  initialCycleFromCprStart,
} from "../data/emergency/cardiac-arrest-shared.js";
import {
  JointInstrumentStrip,
  ArrestNowCard,
  JointComingUpPanel,
  CollapsibleArrestChecklist,
} from "./JointResusDeck.jsx";
import { SosExitConfirm } from "./sos-ui.jsx";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pad(n) { return String(n).padStart(2, "0"); }
function fmtClock(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
}
function fmtTime(d) {
  return new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

const CA_SAFE_TOP = "max(12px, env(safe-area-inset-top))";
const CA_SAFE_BOTTOM = "max(16px, env(safe-area-inset-bottom))";

function CaStickyFooter({ children, className = "" }) {
  return (
    <div
      className={`flex-shrink-0 px-4 pt-3 border-t border-gray-800 bg-gray-950 ${className}`}
      style={{ paddingBottom: CA_SAFE_BOTTOM }}
    >
      {children}
    </div>
  );
}

function CaOverlayShell({ children, className = "", zClass = "z-[55]" }) {
  return (
    <div
      className={`fixed inset-0 ${zClass} overflow-y-auto ${className}`}
      style={{ paddingTop: CA_SAFE_TOP, paddingBottom: CA_SAFE_BOTTOM }}
    >
      <div className="min-h-full flex flex-col items-center justify-center gap-5 px-6 py-4">
        {children}
      </div>
    </div>
  );
}

function ExitConfirm(props) {
  return (
    <SosExitConfirm
      {...props}
      activeTitle="Leave active arrest?"
      inactiveTitle="Exit without starting?"
      activeBody={<>Session stays saved — reopen Maternal Cardiac Arrest to resume. Use <span className="text-gray-300">ROSC achieved</span> or <span className="text-gray-300">Stopped</span> to record an outcome.</>}
      inactiveBody="Opened by mistake? No new session will be started."
      confirmLabel={props.active ? "Leave" : "Exit"}
      zClass="z-[70]"
    />
  );
}

// ─── Setup screen ───────────────────────────────────────────────────────────
// Captures gestation band (MLUD + PMCS), collapse time (PMCS / arrest clock),
// and CPR start (2-min rhythm cycles) — they may differ if CPR was delayed.

function formatElapsedMs(ms) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  if (m === 0) return `${s}s`;
  if (s === 0) return `${m} min`;
  return `${m} min ${s}s`;
}

function collapseHelperFromTs(collapseTime) {
  const elapsed = Date.now() - collapseTime;
  if (elapsed < 60 * 1000) return "Collapse recorded — PMCS decision at 4 min from collapse.";
  const ago = formatElapsedMs(elapsed);
  const pmcsRemainingMs = PMCS_DECISION_SEC * 1000 - elapsed;
  if (pmcsRemainingMs <= 0) {
    return `Collapse ${ago} ago — PMCS decision due now if no ROSC.`;
  }
  return `Collapse ${ago} ago — PMCS decision in ${formatElapsedMs(pmcsRemainingMs)} if no ROSC.`;
}

function cprHelperFromTs(collapseTime, cprTime) {
  const cprElapsed = Date.now() - cprTime;
  const delayMs = cprTime - collapseTime;
  const elapsedSec = Math.floor(cprElapsed / 1000);
  const due = elapsedSec > 0 && elapsedSec % CPR_CYCLE_SEC === 0;
  const remSec = due ? 0 : CPR_CYCLE_SEC - (elapsedSec % CPR_CYCLE_SEC);

  if (cprElapsed < 60 * 1000) {
    return delayMs > 0
      ? `CPR starting now — ${formatElapsedMs(delayMs)} after collapse. First rhythm check in 2 min.`
      : "CPR starting now — first rhythm check in 2 min.";
  }
  const ago = formatElapsedMs(cprElapsed);
  if (due) {
    return delayMs > 0
      ? `CPR ${ago} (${formatElapsedMs(delayMs)} after collapse) — rhythm check due on open.`
      : `CPR ${ago} — rhythm check due on open.`;
  }
  const remLabel = remSec >= 60 ? formatElapsedMs(remSec * 1000) : "<1 min";
  return delayMs > 0
    ? `CPR ${ago} (${formatElapsedMs(delayMs)} after collapse) — next rhythm check in ${remLabel}.`
    : `CPR ${ago} — next rhythm check in ${remLabel}.`;
}

const QUICK_TIME_OPTIONS = JOINT_ARREST_QUICK_TIMES;

function formatWallClock(ts) {
  const d = new Date(ts);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function QuickTimePicker({ label, minsAgo, onSelect, helper, error, footer }) {
  return (
    <div className="space-y-2">
      <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{label}</p>
      <div className="flex flex-wrap gap-2">
        {QUICK_TIME_OPTIONS.map(opt => (
          <button
            key={opt.mins}
            type="button"
            onClick={() => onSelect(opt.mins)}
            className={`px-3 py-2 rounded-lg text-sm font-medium border transition ${
              minsAgo === opt.mins
                ? "bg-white text-gray-950 border-white"
                : "border-gray-800 text-gray-300 hover:border-gray-600"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {footer}
      {minsAgo != null && (
        <p className="text-gray-500 text-xs tabular-nums">≈ {formatWallClock(minsAgoToTimestamp(minsAgo))}</p>
      )}
      {error && <p className="text-red-400 text-xs">{error}</p>}
      {!error && helper && <p className="text-gray-600 text-xs">{helper}</p>}
    </div>
  );
}

function initialCycleFromCprStartLocal(cprStartTime) {
  return initialCycleFromCprStart(cprStartTime, Date.now());
}

function SetupScreen({ onConfirm, onExit, onReturnToPph, postpartum }) {
  const [gestation, setGestation] = useState(postpartum ? "delivered" : null); // "under20" | "over20" | "delivered"
  const [collapseMinsAgo, setCollapseMinsAgo] = useState(0);
  const [cprSameAsCollapse, setCprSameAsCollapse] = useState(true);
  const [cprMinsAgo, setCprMinsAgo] = useState(0);

  const collapseTime = minsAgoToTimestamp(collapseMinsAgo);
  const cprTime = cprSameAsCollapse ? collapseTime : minsAgoToTimestamp(cprMinsAgo);

  const cprBeforeCollapse = !cprSameAsCollapse && cprMinsAgo > collapseMinsAgo;
  const cprError = cprBeforeCollapse ? "CPR cannot start before collapse." : null;

  const timesValid = !cprError;
  const canStart = gestation != null && timesValid;

  function toggleGestation(value) {
    setGestation(prev => (prev === value ? null : value));
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 w-full">
      <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-2 pb-4 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-1">Maternal cardiac arrest</p>
            <h1 className="text-white text-2xl font-black leading-tight">Start resuscitation</h1>
            <p className="text-gray-500 text-sm mt-1.5">GTG56 · Resus Council UK ALS</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {onReturnToPph && (
              <button
                onClick={onReturnToPph}
                className="text-violet-400 hover:text-violet-300 text-xs border border-violet-900/60 hover:border-violet-700 px-2.5 py-1.5 rounded transition whitespace-nowrap"
              >
                ← PPH
              </button>
            )}
            <button
              onClick={onExit}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-800 text-gray-500 hover:text-gray-300 hover:border-gray-600 shrink-0"
              aria-label="Exit"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Gestation — skipped when launched postpartum from PPH */}
        {postpartum ? (
          <div className="rounded-xl border border-gray-800 bg-gray-900/40 px-4 py-3">
            <p className="text-white text-sm font-bold">Postpartum (from PPH)</p>
            <p className="text-gray-500 text-xs mt-0.5">Standard ALS — PMCS and MLUD not indicated (already delivered)</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Gestation</p>
            <div className="flex flex-col gap-2">
              <button onClick={() => toggleGestation("over20")}
                className={`w-full text-left px-4 py-3 rounded-xl border transition ${gestation === "over20" ? "border-red-600 bg-red-950/40" : "border-gray-800"}`}>
                <span className="text-white font-bold text-base">≥ 20 weeks</span>
                <span className="block text-gray-500 text-xs mt-0.5">or uterus palpable at/above umbilicus — MLUD + PMCS apply</span>
              </button>
              <button onClick={() => toggleGestation("under20")}
                className={`w-full text-left px-4 py-3 rounded-xl border transition ${gestation === "under20" ? "border-red-600 bg-red-950/40" : "border-gray-800"}`}>
                <span className="text-white font-bold text-base">&lt; 20 weeks</span>
                <span className="block text-gray-500 text-xs mt-0.5">standard ALS — PMCS not indicated for maternal benefit</span>
              </button>
            </div>
            {gestation != null && (
              <p className="text-gray-600 text-xs">Tap your selection again to clear, or choose the other band.</p>
            )}
          </div>
        )}

        <QuickTimePicker
          label="Collapse occurred at"
          minsAgo={collapseMinsAgo}
          onSelect={setCollapseMinsAgo}
          helper={timesValid ? collapseHelperFromTs(collapseTime) : "Tap when collapse happened"}
        />

        <QuickTimePicker
          label="CPR started at"
          minsAgo={cprSameAsCollapse ? collapseMinsAgo : cprMinsAgo}
          onSelect={(mins) => { setCprSameAsCollapse(false); setCprMinsAgo(mins); }}
          footer={(
            <button
              type="button"
              onClick={() => setCprSameAsCollapse(true)}
              className={`mt-1 px-3 py-2 rounded-lg text-xs font-medium border transition ${
                cprSameAsCollapse
                  ? "bg-gray-800 text-white border-gray-600"
                  : "border-gray-800 text-gray-400 hover:border-gray-600"
              }`}
            >
              Same as collapse
            </button>
          )}
          helper={timesValid ? cprHelperFromTs(collapseTime, cprTime) : "Tap when CPR started"}
          error={cprError}
        />
      </div>

      <CaStickyFooter className="px-5">
        <button
          disabled={!canStart}
          onClick={() => onConfirm({
            gestation,
            startTime: collapseTime,
            cprStartTime: cprTime,
          })}
          className={`w-full py-3.5 rounded-xl font-black text-base transition ${canStart ? "bg-red-600 text-white" : "bg-gray-800 text-gray-600"}`}>
          Start resuscitation
        </button>
      </CaStickyFooter>
    </div>
  );
}

// ─── PMCS full-screen alarm ───────────────────────────────────────────────────

function PmcsAlarm({ onAcknowledge }) {
  useEffect(() => {
    if (!("vibrate" in navigator)) return;
    const id = setInterval(() => navigator.vibrate([400, 150, 400, 150, 400]), 2000);
    navigator.vibrate([400, 150, 400, 150, 400]);
    return () => clearInterval(id);
  }, []);
  return (
    <CaOverlayShell className="bg-red-700 text-center" zClass="z-[60]">
      <p className="text-red-200 text-sm font-bold uppercase tracking-widest">4 minutes — no ROSC</p>
      <h2 className="text-white text-3xl font-black leading-tight">Start perimortem caesarean now</h2>
      <p className="text-red-100 text-base leading-relaxed">
        Deliver by 5 minutes.<br />
        Do <span className="font-black">NOT</span> move the patient — operate here.<br />
        Continue CPR throughout.
      </p>
      <button onClick={onAcknowledge} className="bg-white text-red-700 font-black text-base px-10 py-4 rounded-xl">
        PMCS started / acknowledged
      </button>
    </CaOverlayShell>
  );
}

// ─── Immediate actions (concurrent checklist) ─────────────────────────────────
// These happen in parallel the moment CPR starts (GTG56 Appendix 4).

// ─── CPR cycle constants ──────────────────────────────────────────────────────

// ─── Reversible causes (4 Hs / 4 Ts / Eclampsia) ──────────────────────────────
// GTG56 Appendix 2 + management sections. Antidotes are tappable with doses.

const REVERSIBLE_CAUSES = [
  { id: "hypoxia", group: "4 H", label: "Hypoxia",
    detail: "Pregnant women desaturate rapidly\nEarly intubation by experienced anaesthetist · high-flow O₂" },
  { id: "hypovolaemia", group: "4 H", label: "Hypovolaemia",
    detail: "Obstetric haemorrhage — may be CONCEALED (abruption, ruptured uterus/ectopic, post-CS)\nMajor haemorrhage protocol + TXA · deliver fetus/placenta if APH",
    pphLink: true },
  { id: "metabolic", group: "4 H", label: "Hypo/hyperkalaemia + metabolic",
    detail: "Check K⁺, glucose, Ca²⁺, Mg²⁺\nHyponatraemia may follow oxytocin use\nHyperkalaemia → calcium chloride/gluconate 10 ml 10% IV" },
  { id: "hypothermia", group: "4 H", label: "Hypothermia",
    detail: "Active warming" },
  { id: "thromboembolism", group: "4 T", label: "Thromboembolism",
    detail: "Pulmonary embolism → thrombolysis (GTG37b)\nAmniotic fluid embolism → supportive; FFP for coagulopathy; avoid rFVIIa" },
  { id: "toxicity", group: "4 T", label: "Toxicity",
    detail: "Local anaesthetic toxicity or magnesium toxicity — stop the offending drug",
    antidotes: [
      { id: "intralipid", label: "Intralipid 20% (LA toxicity)", dose: "1.5 ml/kg IV bolus over 1 min, then 15 ml/kg/hr infusion", log: "Intralipid 20% lipid rescue started" },
      { id: "calcium", label: "Calcium gluconate/chloride (Mg toxicity)", dose: "10 ml 10% IV by slow injection", log: "Calcium 10 ml 10% given — magnesium toxicity" },
    ] },
  { id: "tamponade", group: "4 T", label: "Cardiac tamponade",
    detail: "Usually following trauma — consider pericardiocentesis / thoracotomy" },
  { id: "tension_pneumo", group: "4 T", label: "Tension pneumothorax",
    detail: "Usually following trauma — needle / finger decompression" },
  { id: "eclampsia", group: "E", label: "Eclampsia / pre-eclampsia",
    detail: "Magnesium sulfate 4 g IV (NICE CG107)\nIncludes intracranial haemorrhage — early neurosurgical involvement" },
];

function ReversibleCauses({ consideredSet, antidotesGiven, onConsider, onAntidote, onLaunchPph }) {
  const [expanded, setExpanded] = useState(null);
  return (
    <div className="space-y-2">
      <p className="text-gray-400 text-xs font-bold uppercase tracking-wider px-1">Reversible causes — consider throughout</p>
      {REVERSIBLE_CAUSES.map(c => {
        const open = expanded === c.id;
        const considered = consideredSet.includes(c.id);
        return (
          <div key={c.id} className={`rounded-xl border transition ${considered ? "border-gray-800 bg-gray-900/40" : "border-gray-700"}`}>
            <button onClick={() => setExpanded(open ? null : c.id)} className="w-full flex items-center gap-3 px-4 py-3 text-left">
              <span className="text-gray-600 text-[10px] font-bold uppercase tracking-wider w-7 shrink-0">{c.group}</span>
              <span className={`flex-1 text-sm font-bold ${considered ? "text-gray-500" : "text-white"}`}>{c.label}</span>
              {considered && <span className="text-gray-600 text-xs shrink-0">✓ considered</span>}
              <span className="text-gray-600 text-xs shrink-0">{open ? "↑" : "↓"}</span>
            </button>
            {open && (
              <div className="px-4 pb-3.5 space-y-3">
                <p className="text-gray-400 text-xs whitespace-pre-line leading-relaxed">{c.detail}</p>
                {c.antidotes?.map(a => {
                  const given = antidotesGiven.includes(a.id);
                  return (
                    <div key={a.id} className="flex items-center gap-3 rounded-lg border border-gray-800 px-3 py-2.5">
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold ${given ? "text-gray-500 line-through" : "text-white"}`}>{a.label}</p>
                        <p className="text-gray-500 text-xs">{a.dose}</p>
                      </div>
                      <button onClick={() => onAntidote(a.id, a.log)} disabled={given}
                        className={`shrink-0 font-bold px-3 py-2 rounded-lg text-xs ${given ? "border border-gray-800 text-gray-600" : "bg-amber-500 text-gray-950"}`}>
                        {given ? "given" : "Give"}
                      </button>
                    </div>
                  );
                })}
                {c.pphLink && (
                  <button onClick={onLaunchPph} className="w-full bg-red-700 text-white font-bold py-2.5 rounded-lg text-sm">
                    Open PPH SOS →
                  </button>
                )}
                <button onClick={() => onConsider(c.id)}
                  className={`w-full font-medium py-2.5 rounded-lg text-sm ${considered ? "border border-gray-800 text-gray-500" : "border border-gray-600 text-white"}`}>
                  {considered ? "Considered ✓" : "Mark considered"}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Box B — other ALS / obstetric drugs (reference) ──────────────────────────

const BOX_B_DRUGS = [
  { label: "Magnesium", dose: "2 g IV (polymorphic VT / hypomagnesaemia) · 4 g IV (eclampsia)" },
  { label: "Atropine", dose: "0.5–1 mg IV up to 3 mg — if vagal tone likely (not routine for asystole)" },
  { label: "Calcium", dose: "10 ml 10% IV — Mg toxicity, low calcium, hyperkalaemia" },
  { label: "Intralipid 20%", dose: "1.5 ml/kg IV bolus, then 15 ml/kg/hr — LA toxicity" },
  { label: "Fluids", dose: "500 ml IV crystalloid bolus" },
  { label: "Thrombolysis / PCI", dose: "suspected massive PE / MI" },
  { label: "Tranexamic acid", dose: "1 g IV if haemorrhage" },
];

function BoxBReference() {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-gray-800">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-4 py-3">
        <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Box B — other ALS drugs</span>
        <span className="text-gray-600 text-xs">{open ? "↑" : "↓"}</span>
      </button>
      {open && (
        <div className="px-4 pb-3 space-y-2">
          {BOX_B_DRUGS.map(d => (
            <div key={d.label} className="text-xs">
              <span className="text-white font-bold">{d.label}</span>
              <span className="text-gray-500"> — {d.dose}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Post-resuscitation checklist (ROSC) ──────────────────────────────────────

const POST_RESUS = [
  { id: "haemorrhage", text: "If haemorrhage — activate Massive Haemorrhage Protocol; uterotonics, fibrinogen, TXA", pphLink: true },
  { id: "haemostasis", text: "Surgical haemostasis — uterine tamponade / sutures, aortic compression, hysterectomy" },
  { id: "ecg", text: "12-lead ECG; treat underlying cause; expert cardiology if cardiac" },
  { id: "icu", text: "Transfer to ICU — consultant intensivist; targeted temperature management" },
  { id: "debrief", text: "Debrief patient/family and team; MBRRACE notification if maternal death or near-miss" },
];

function PostResusScreen({ done, onToggle, onLaunchPph, onFinish }) {
  return (
    <div className="flex flex-col flex-1 min-h-0 w-full">
      <div className="px-5 py-4 border-b border-gray-800 flex-shrink-0">
        <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-1">ROSC achieved</p>
        <h2 className="text-white text-2xl font-black">Post-resuscitation care</h2>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-2">
        {POST_RESUS.map(p => {
          const isDone = done.includes(p.id);
          return (
            <div key={p.id} className={`rounded-xl border ${isDone ? "border-gray-800 bg-gray-900/40" : "border-gray-700"}`}>
              <button onClick={() => onToggle(p.id)} className="w-full flex items-start gap-3 px-4 py-3 text-left">
                <span className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center text-xs font-bold shrink-0 ${isDone ? "bg-white text-gray-950" : "border border-gray-600 text-transparent"}`}>✓</span>
                <span className={`text-sm leading-snug ${isDone ? "text-gray-500 line-through" : "text-white"}`}>{p.text}</span>
              </button>
              {p.pphLink && !isDone && (
                <div className="px-4 pb-3">
                  <button onClick={onLaunchPph} className="w-full bg-red-700 text-white font-bold py-2.5 rounded-lg text-sm">Open PPH SOS →</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <CaStickyFooter>
        <button onClick={onFinish} className="w-full bg-white text-gray-950 font-bold py-3.5 rounded-lg text-sm">View record</button>
      </CaStickyFooter>
    </div>
  );
}

// ─── Summary ──────────────────────────────────────────────────────────────────

function SummaryScreen({ startTime, outcome, outcomeTime, shockCount, adrenalineCount, amio300Given, amio150Given, pmcsAcknowledged, causesConsidered, antidotesGiven, onClose }) {
  const duration = (outcomeTime ?? Date.now()) - startTime;
  const row = (label, value) => (
    <div className="flex justify-between px-5 py-2.5 border-b border-gray-900">
      <span className="text-gray-500 text-sm">{label}</span>
      <span className="text-gray-200 text-sm font-medium text-right">{value}</span>
    </div>
  );
  const causeLabels = causesConsidered.map(id => REVERSIBLE_CAUSES.find(c => c.id === id)?.label).filter(Boolean);
  return (
    <div className="flex flex-col flex-1 min-h-0 w-full">
      <div className="px-5 py-4 border-b border-gray-800 flex-shrink-0">
        <p className="text-gray-600 text-xs uppercase tracking-widest mb-2">Maternal cardiac arrest record</p>
        <h2 className={`text-2xl font-black ${outcome === "rosc" ? "text-green-400" : "text-gray-300"}`}>
          {outcome === "rosc" ? "ROSC achieved" : "Resuscitation stopped"}
        </h2>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto">
        {row("Arrest time", fmtTime(startTime))}
        {row("Duration", fmtClock(duration))}
        {row("Shocks delivered", shockCount)}
        {row("Adrenaline doses", adrenalineCount)}
        {row("Amiodarone", amio150Given ? "300 + 150 mg" : amio300Given ? "300 mg" : "—")}
        {row("Perimortem caesarean", pmcsAcknowledged ? "Performed / acknowledged" : "Not performed")}
        {row("Antidotes given", antidotesGiven.length ? antidotesGiven.join(", ") : "—")}
        <div className="px-5 py-3 border-b border-gray-900">
          <p className="text-gray-500 text-sm mb-1">Reversible causes considered</p>
          <p className="text-gray-200 text-sm">{causeLabels.length ? causeLabels.join(" · ") : "—"}</p>
        </div>
      </div>
      <CaStickyFooter className="px-5">
        <p className="text-gray-500 text-xs leading-relaxed border-l-2 border-gray-700 pl-3 mb-3">
          Complete documentation. Debrief team and family. MBRRACE-UK notification if maternal death or near-miss.
        </p>
        <button onClick={onClose} className="w-full border border-gray-800 text-gray-500 font-medium py-3 rounded-xl text-sm">Close</button>
      </CaStickyFooter>
    </div>
  );
}

// ─── Dual-clock header ────────────────────────────────────────────────────────

function Header({ startTime, now, gestation, onClose, onReturnToPph }) {
  const elapsedMs = now - startTime;
  const pmcsRemainingMs = PMCS_DECISION_SEC * 1000 - elapsedMs;
  const pmcsDue = pmcsRemainingMs <= 0;
  const deliveryRemainingMs = PMCS_DELIVERY_SEC * 1000 - elapsedMs;
  const showPmcs = gestation === "over20";

  return (
    <div className="bg-gray-900 px-4 pt-3 pb-3 border-b border-gray-800 flex-shrink-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-baseline gap-2">
          <span className="text-gray-600 text-xs">Arrest</span>
          <span className="font-mono text-white text-2xl font-bold tabular-nums">{fmtClock(elapsedMs)}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {onReturnToPph && (
            <button
              onClick={onReturnToPph}
              className="text-violet-400 hover:text-violet-300 text-xs border border-violet-900/60 hover:border-violet-700 px-2.5 py-1.5 rounded transition whitespace-nowrap"
            >
              ← PPH
            </button>
          )}
          <button onClick={onClose} className="text-gray-600 hover:text-gray-300 text-xs border border-gray-800 hover:border-gray-600 px-2.5 py-1.5 rounded transition">Close</button>
        </div>
      </div>
      {showPmcs && (
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold uppercase tracking-wider shrink-0 ${pmcsDue ? "text-red-400" : "text-gray-500"}`}>PMCS</span>
          <div className="flex-1 bg-gray-800 h-1 rounded-full relative overflow-hidden">
            <div className={`absolute top-0 left-0 h-1 rounded-full transition-all ${pmcsDue ? "bg-red-500" : "bg-orange-400"}`}
              style={{ width: `${Math.max(0, Math.min(100, (1 - elapsedMs / (PMCS_DECISION_SEC * 1000)) * 100))}%` }} />
          </div>
          <span className={`text-sm font-mono tabular-nums shrink-0 ${pmcsDue ? "text-red-400 font-bold" : "text-orange-400"}`}>
            {pmcsDue
              ? (deliveryRemainingMs > 0 ? `deliver ${fmtClock(deliveryRemainingMs)}` : "DELIVER NOW")
              : fmtClock(pmcsRemainingMs)}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

// ─── Session persistence ──────────────────────────────────────────────────────

const CA_STORAGE_KEY = "pocket_og_cardiac_arrest_session";
function caSave(data) { try { localStorage.setItem(CA_STORAGE_KEY, JSON.stringify(data)); } catch {} }
function caClear() { try { localStorage.removeItem(CA_STORAGE_KEY); } catch {} }

function readActiveCaSnapshot() {
  try {
    const s = JSON.parse(localStorage.getItem(CA_STORAGE_KEY));
    return (s?.phase === "active" || s?.phase === "postresus") ? s : null;
  } catch {
    return null;
  }
}

export default function CardiacArrestPage({ onClose, onLaunchPph, onReturnToPph, context }) {
  const [savedSession] = useState(() => {
    try { const r = localStorage.getItem(CA_STORAGE_KEY); return r ? JSON.parse(r) : null; } catch { return null; }
  });
  const [recoveryDismissed, setRecoveryDismissed] = useState(false);
  const [phase, setPhase] = useState(() => {
    if (context?.resumeCa) {
      const s = readActiveCaSnapshot();
      if (s?.phase === "postresus") return "postresus";
      if (s?.phase === "active") return "active";
    }
    return "setup";
  });
  const [gestation, setGestation] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(() => Date.now());
  const [rosc, setRosc] = useState(false);
  const [pmcsAcknowledged, setPmcsAcknowledged] = useState(false);
  const [pmcsAlarmDismissed, setPmcsAlarmDismissed] = useState(false);
  const [actionsDone, setActionsDone] = useState([]);
  // CPR cycle state
  const [cycleStart, setCycleStart] = useState(null);
  const [cycleNumber, setCycleNumber] = useState(1);
  const [shockCount, setShockCount] = useState(0);
  const [rhythmPromptOpen, setRhythmPromptOpen] = useState(false);
  const [pendingShock, setPendingShock] = useState(false);
  const [adrenalineCount, setAdrenalineCount] = useState(0);
  const [lastAdrenalineAt, setLastAdrenalineAt] = useState(null);
  const [adrenalineArmed, setAdrenalineArmed] = useState(false); // first dose indicated (non-shockable, or after 3rd shock)
  const [amio300Given, setAmio300Given] = useState(false);
  const [amio150Given, setAmio150Given] = useState(false);
  const [causesConsidered, setCausesConsidered] = useState([]);
  const [antidotesGiven, setAntidotesGiven] = useState([]);
  const [outcome, setOutcome] = useState(null); // "rosc" | "stopped"
  const [outcomeTime, setOutcomeTime] = useState(null);
  const [postResusDone, setPostResusDone] = useState([]);
  const [exitConfirm, setExitConfirm] = useState(false);
  const wakeLockRef = useRef(null);
  const caAutoResumed = useRef(false);

  // 1-second tick while resus is in progress
  useEffect(() => {
    if (phase !== "active" && phase !== "postresus") return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [phase]);

  // Persist the in-progress session on every change so it can be recovered.
  useEffect(() => {
    if (phase !== "active" && phase !== "postresus") return;
    caSave({
      phase, gestation, startTime, rosc, pmcsAcknowledged, pmcsAlarmDismissed, actionsDone,
      cycleStart, cycleNumber, shockCount, adrenalineCount, lastAdrenalineAt, adrenalineArmed,
      amio300Given, amio150Given, causesConsidered, antidotesGiven, outcome, outcomeTime, postResusDone,
    });
  }, [phase, gestation, startTime, rosc, pmcsAcknowledged, pmcsAlarmDismissed, actionsDone,
      cycleStart, cycleNumber, shockCount, adrenalineCount, lastAdrenalineAt, adrenalineArmed,
      amio300Given, amio150Given, causesConsidered, antidotesGiven, outcome, outcomeTime, postResusDone]);

  function handleRecover() {
    const s = savedSession;
    if (!s) return;
    applyCaSnapshot(s);
  }

  function applyCaSnapshot(s) {
    if (!s) return;
    setGestation(s.gestation ?? null);
    setStartTime(s.startTime ?? Date.now());
    setRosc(s.rosc ?? false);
    setPmcsAcknowledged(s.pmcsAcknowledged ?? false);
    setPmcsAlarmDismissed(s.pmcsAlarmDismissed ?? false);
    setActionsDone(s.actionsDone ?? []);
    setCycleStart(s.cycleStart ?? Date.now());
    setCycleNumber(s.cycleNumber ?? 1);
    setShockCount(s.shockCount ?? 0);
    setAdrenalineCount(s.adrenalineCount ?? 0);
    setLastAdrenalineAt(s.lastAdrenalineAt ?? null);
    setAdrenalineArmed(s.adrenalineArmed ?? false);
    setAmio300Given(s.amio300Given ?? false);
    setAmio150Given(s.amio150Given ?? false);
    setCausesConsidered(s.causesConsidered ?? []);
    setAntidotesGiven(s.antidotesGiven ?? []);
    setOutcome(s.outcome ?? null);
    setOutcomeTime(s.outcomeTime ?? null);
    setPostResusDone(s.postResusDone ?? []);
    setPhase(s.phase === "postresus" ? "postresus" : "active");
  }

  useEffect(() => {
    if (!context?.resumeCa || caAutoResumed.current) return;
    const s = readActiveCaSnapshot();
    if (!s) return;
    caAutoResumed.current = true;
    applyCaSnapshot(s);
    setRecoveryDismissed(true);
  }, [context?.resumeCa]);

  function handleClose() {
    if (phase === "summary") caClear();
    onClose?.();
  }

  function requestClose() {
    if (phase === "active" || phase === "setup") setExitConfirm(true);
    else handleClose();
  }

  function confirmExit() {
    setExitConfirm(false);
    onClose?.();
  }

  // The summary is terminal — clear the saved session so it won't offer to resume.
  useEffect(() => { if (phase === "summary") caClear(); }, [phase]);

  // Keep the screen awake during an active arrest
  useEffect(() => {
    if (phase !== "active" || !("wakeLock" in navigator)) return;
    let lock;
    navigator.wakeLock.request("screen").then(l => { lock = l; wakeLockRef.current = l; }).catch(() => {});
    return () => { try { lock?.release(); } catch {} };
  }, [phase]);

  function handleSetup({ gestation, startTime, cprStartTime }) {
    setGestation(gestation);
    setStartTime(startTime);
    const { cycleNumber: n, cycleStart: cs } = initialCycleFromCprStart(cprStartTime);
    setCycleNumber(n);
    setCycleStart(cs);
    setPhase("active");
  }

  // Auto-fire the rhythm check when a 2-min cycle elapses (no other overlay open).
  useEffect(() => {
    if (phase !== "active" || rosc || !cycleStart) return;
    if (rhythmPromptOpen || pendingShock) return;
    if ((now - cycleStart) / 1000 >= CPR_CYCLE_SEC) setRhythmPromptOpen(true);
  }, [phase, rosc, cycleStart, now, rhythmPromptOpen, pendingShock]);

  function resumeCpr() {
    setCycleStart(Date.now());
    setCycleNumber(n => n + 1);
  }
  function handleShockable() {
    setRhythmPromptOpen(false);
    setPendingShock(true);
  }
  function handleShockDelivered() {
    const newCount = shockCount + 1;
    setShockCount(newCount);
    if (newCount >= 3) setAdrenalineArmed(true); // adrenaline indicated from 3rd shock
    setPendingShock(false);
    resumeCpr();
  }
  function handleNonShockable() {
    setRhythmPromptOpen(false);
    setAdrenalineArmed(true); // adrenaline immediately in non-shockable
    resumeCpr();
  }
  function handleAdrenaline() {
    setAdrenalineCount(c => c + 1);
    setLastAdrenalineAt(Date.now());
    setAdrenalineArmed(false);
  }
  function handleResusDone(actionId) {
    setActionsDone(prev => (prev.includes(actionId) ? prev : [...prev, actionId]));
  }
  function handleResusToggle(actionId) {
    setActionsDone(prev => prev.includes(actionId) ? prev.filter(x => x !== actionId) : [...prev, actionId]);
  }
  function handleRosc() {
    setRosc(true);
    setOutcome("rosc");
    setOutcomeTime(Date.now());
    setRhythmPromptOpen(false);
    setPendingShock(false);
    setPhase("postresus");
  }
  function handleStop() {
    setOutcome("stopped");
    setOutcomeTime(Date.now());
    setRhythmPromptOpen(false);
    setPendingShock(false);
    setPhase("summary");
  }

  if (phase === "setup") {
    return (
      <div
        className="fixed inset-0 z-50 bg-gray-950 flex flex-col overflow-hidden emergency-shell"
        style={{ paddingTop: CA_SAFE_TOP }}
      >
        {savedSession && !recoveryDismissed && (
          <div className="bg-amber-950/60 border-b border-amber-800 px-4 py-3 flex flex-col gap-2 flex-shrink-0">
            <p className="text-amber-300 text-sm font-bold">Resume previous arrest?</p>
            <p className="text-amber-400/80 text-xs">
              In-progress resuscitation found — {savedSession.shockCount ?? 0} shock{(savedSession.shockCount ?? 0) === 1 ? "" : "s"}, {savedSession.adrenalineCount ?? 0} adrenaline.
            </p>
            <div className="flex gap-2">
              <button onClick={handleRecover} className="flex-1 bg-amber-500 text-gray-950 font-bold py-2.5 text-sm rounded-lg">Resume</button>
              <button onClick={() => { setRecoveryDismissed(true); caClear(); }} className="flex-1 border border-amber-800 text-amber-400 text-sm py-2.5 rounded-lg">Discard</button>
            </div>
          </div>
        )}
        {exitConfirm && (
          <ExitConfirm
            active={false}
            onConfirm={confirmExit}
            onCancel={() => setExitConfirm(false)}
          />
        )}
        <SetupScreen
          onConfirm={handleSetup}
          onExit={requestClose}
          onReturnToPph={onReturnToPph}
          postpartum={!!context?.postpartum}
        />
      </div>
    );
  }

  if (phase === "postresus") {
    return (
      <div
        className="fixed inset-0 z-50 bg-gray-950 flex flex-col overflow-hidden emergency-shell"
        style={{ paddingTop: CA_SAFE_TOP }}
      >
        <PostResusScreen
          done={postResusDone}
          onToggle={(id) => setPostResusDone(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
          onLaunchPph={() => onLaunchPph?.()}
          onFinish={() => setPhase("summary")}
        />
      </div>
    );
  }

  if (phase === "summary") {
    return (
      <div
        className="fixed inset-0 z-50 bg-gray-950 flex flex-col overflow-hidden emergency-shell"
        style={{ paddingTop: CA_SAFE_TOP }}
      >
        <SummaryScreen
          startTime={startTime} outcome={outcome} outcomeTime={outcomeTime}
          shockCount={shockCount} adrenalineCount={adrenalineCount}
          amio300Given={amio300Given} amio150Given={amio150Given}
          pmcsAcknowledged={pmcsAcknowledged} causesConsidered={causesConsidered}
          antidotesGiven={antidotesGiven} onClose={handleClose}
        />
      </div>
    );
  }

  const elapsedSec = (now - startTime) / 1000;
  const pmcsTriggered =
    gestation === "over20" && !rosc && !pmcsAcknowledged && elapsedSec >= PMCS_DECISION_SEC;
  const showAlarm = pmcsTriggered && !pmcsAlarmDismissed;

  const immediateActions = filterImmediateActions(STANDALONE_IMMEDIATE_ACTIONS, { gestation });
  const arrestState = {
    active: true,
    rosc,
    cycleStart,
    cycleNumber,
    shockCount,
    pendingShock,
    rhythmPromptOpen,
    adrenalineCount,
    lastAdrenalineAt,
    adrenalineArmed,
    amio300Given,
    amio150Given,
    actionsDone,
  };
  const arrestCore = computeArrestNowPrompt(arrestState, now, immediateActions);
  const nowPrompt = arrestCore
    ? {
        ...arrestCore,
        ...(arrestCore.type === "arrest_shock" ? { onDelivered: handleShockDelivered } : {}),
        ...(arrestCore.type === "arrest_rhythm"
          ? { onShockable: handleShockable, onNonShockable: handleNonShockable }
          : {}),
        ...(arrestCore.type === "arrest_resus"
          ? { onDone: () => handleResusDone(arrestCore.action.id) }
          : {}),
      }
    : null;
  const comingUp = computeArrestComingUpItems(arrestState, now, immediateActions);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-gray-950 overflow-hidden emergency-shell"
      style={{ paddingTop: CA_SAFE_TOP }}
    >
      {showAlarm && (
        <PmcsAlarm onAcknowledge={() => { setPmcsAcknowledged(true); setPmcsAlarmDismissed(true); }} />
      )}

      {exitConfirm && (
        <ExitConfirm
          active
          onConfirm={confirmExit}
          onCancel={() => setExitConfirm(false)}
        />
      )}

      <Header startTime={startTime} now={now} gestation={gestation} onClose={requestClose} onReturnToPph={onReturnToPph} />

      {!rosc && (
        <>
          <JointInstrumentStrip
            showPph={false}
            pphElapsed={now - startTime}
            bloodLoss={0}
            bloodLossClass="text-white"
            levelLabel=""
            onAddBlood={() => {}}
            onExit={requestClose}
            onStandDown={requestClose}
            arrest={arrestState}
            now={now}
            onRhythmCheck={() => setRhythmPromptOpen(true)}
            onRosc={handleRosc}
            onAdrenaline={handleAdrenaline}
            onAmio300={() => setAmio300Given(true)}
            onAmio150={() => setAmio150Given(true)}
          />
          <ArrestNowCard
            prompt={nowPrompt}
            onAdrenaline={handleAdrenaline}
            onAmio300={() => setAmio300Given(true)}
            onAmio150={() => setAmio150Given(true)}
            arrest={arrestState}
          />
          <JointComingUpPanel items={comingUp} now={now} skipFirst={!!nowPrompt} />
        </>
      )}

      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-5">
        {!rosc && (
          <CollapsibleArrestChecklist
            arrest={arrestState}
            actions={immediateActions}
            title="Immediate actions"
            onToggle={handleResusToggle}
          />
        )}
        <ReversibleCauses
          consideredSet={causesConsidered}
          antidotesGiven={antidotesGiven}
          onConsider={(id) => setCausesConsidered(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
          onAntidote={(id) => setAntidotesGiven(prev => prev.includes(id) ? prev : [...prev, id])}
          onLaunchPph={() => onLaunchPph?.()}
        />
        <BoxBReference />
      </div>

      {/* Outcome action bar */}
      <CaStickyFooter className="flex gap-2">
        <button onClick={handleRosc} className="flex-1 bg-green-600 text-white font-black py-3.5 rounded-xl text-sm">ROSC achieved</button>
        <button onClick={handleStop} className="px-5 border border-gray-700 text-gray-400 font-medium py-3.5 rounded-xl text-sm">Stopped</button>
      </CaStickyFooter>
    </div>
  );
}
