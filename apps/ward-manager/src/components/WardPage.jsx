import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { computeAlerts, bedStatusColor, classifyCTGEntry } from "../utils/wardAlerts";
import { IOL_IND, iolEntryTier, sortIOLQueue } from "../utils/iolPriority";

// ─── Storage ─────────────────────────────────────────────────────────────

const STORAGE_KEY     = "pocket_og_ward_beds";
const IOL_STORAGE_KEY = "pocket_og_iol_queue";

function loadBeds() {
  try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : {}; }
  catch { return {}; }
}
function saveBeds(beds) { localStorage.setItem(STORAGE_KEY, JSON.stringify(beds)); }
function loadIOL() {
  try { const r = localStorage.getItem(IOL_STORAGE_KEY); return r ? JSON.parse(r) : []; }
  catch { return []; }
}
function saveIOL(q) { localStorage.setItem(IOL_STORAGE_KEY, JSON.stringify(q)); }
function nowISO() { return new Date().toISOString(); }
function timeInputNow() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
}

const DAY_PICKER_OPTIONS = [
  { label: "Today",     daysAgo: 0 },
  { label: "Yesterday", daysAgo: 1 },
  { label: "−2 days",   daysAgo: 2 },
  { label: "−3 days",   daysAgo: 3 },
];

function calendarDaysAgo(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sel = new Date(date);
  sel.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((today - sel) / 86400000));
}

/** HH:MM + explicit daysAgo → Date; on Today only, future times roll to yesterday */
function resolveTimeInput(str, daysAgo = 0) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const [h, m] = str.split(":").map(Number);
  d.setHours(h, m, 0, 0);
  if (daysAgo === 0 && d.getTime() > Date.now() + 60 * 60 * 1000) d.setDate(d.getDate() - 1);
  return d;
}

function timeToISO(str, daysAgo = 0) {
  if (!str) return null;
  return resolveTimeInput(str, daysAgo).toISOString();
}

function isoToTimeFields(iso) {
  if (!iso) return { time: "", daysAgo: 0 };
  const d = new Date(iso);
  return {
    time: fmtTime(iso),
    daysAgo: Math.min(calendarDaysAgo(d), DAY_PICKER_OPTIONS.at(-1).daysAgo),
  };
}

function formatDayLabel(daysAgo, resolvedDate) {
  if (daysAgo === 0) return "Today";
  if (daysAgo === 1) return "Yesterday";
  return resolvedDate.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
}

function fmtTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
}
function fmtAge(ms) {
  const m = Math.floor(ms / 60000);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60), rm = m % 60;
  return rm > 0 ? `${h}h ${rm}m` : `${h}h`;
}

const STAGE_SHORT = {
  "Latent":               "Latent",
  "Active first stage":   "Active 1st",
  "Passive second stage": "Passive 2nd",
  "Active second stage":  "Active 2nd",
};

const LIQUOR_LABEL = {
  "Clear":          "Clear",
  "Thin meconium":  "Mec: thin",
  "Thick meconium": "Mec: thick",
  "Blood-stained":  "Blood-stained",
  "Absent":         "Absent",
};

const IOL_REASONS = [
  "Post-dates",
  "PROM at term",
  "Gestational diabetes",
  "Pre-eclampsia / hypertension",
  "Suspected FGR",
  "Reduced fetal movements",
  "Obstetric cholestasis",
  "Previous stillbirth",
  "Maternal request",
  "Other",
];

const IOL_START_HINT = {
  Dinoprostone: "Propess insertion / first dose",
  Balloon:      "Balloon insertion",
  Misoprostol:  "First dose",
  "ARM+Synto":  "ARM or syntocinon start",
};

const TASK_QUICK = [
  "Repeat FBC",
  "Group & Save",
  "Clotting screen",
  "Senior review",
  "Repeat CTG",
  "Antibiotics due",
  "Consent form",
  "IV access",
  "Urine dip",
];

const PAR_SHORT = { "Para 0": "P0", "Para 1": "P1", "Para 2+": "P2+" };

// ─── IOL Wizard constants ─────────────────────────────────────────────────

const IOL_TIER_META = [
  { label: "Urgent",   cls: { badge: "bg-red-500 text-white",    border: "border-red-200",   bg: "bg-red-50",    text: "text-red-700"   } },
  { label: "High",     cls: { badge: "bg-orange-500 text-white", border: "border-orange-200",bg: "bg-orange-50", text: "text-orange-700"} },
  { label: "Moderate", cls: { badge: "bg-amber-400 text-white",  border: "border-amber-200", bg: "bg-amber-50",  text: "text-amber-700" } },
  { label: "Routine",  cls: { badge: "bg-gray-300 text-gray-700",border: "border-gray-200",  bg: "bg-white",     text: "text-gray-500"  } },
];


function bedSummary(bed) {
  // Background: who is this patient
  const bg = [];
  if (bed.parity)   bg.push(PAR_SHORT[bed.parity] ?? bed.parity);
  if (bed.gestation) bg.push(bed.gestation);
  (bed.riskFlags ?? []).forEach(f => bg.push(f));

  // Situation: what is happening
  const sit = [];
  if (bed.delivery) {
    const d = bed.delivery;
    sit.push(d.mode, fmtTime(d.time));
    if (d.ebl != null) sit.push(`EBL ${d.ebl} mL`);
  } else {
    if (bed.labourStage) sit.push(STAGE_SHORT[bed.labourStage] ?? bed.labourStage);
    const lastVE = bed.ves?.length ? [...bed.ves].sort((a,b) => new Date(a.time)-new Date(b.time)).at(-1) : null;
    if (lastVE) {
      const ago = fmtAge(Date.now() - new Date(lastVE.time).getTime());
      sit.push(`${lastVE.dilation}cm ${ago} ago`);
    } else {
      sit.push("No VE");
    }
    if (bed.analgesia && bed.analgesia !== "None") sit.push(bed.analgesia);
  }

  const bgStr  = bg.join(" · ");
  const sitStr = sit.join(" · ");
  return bgStr && sitStr ? `${bgStr} — ${sitStr}` : bgStr || sitStr;
}

// ─── Status colours ───────────────────────────────────────────────────────

const STATUS = {
  urgent:  { card: "border-red-200 bg-red-50",     dot: "bg-red-500",   badge: "bg-red-500 text-white"    },
  warning: { card: "border-amber-200 bg-amber-50", dot: "bg-amber-400", badge: "bg-amber-400 text-white" },
  info:    { card: "border-blue-100 bg-blue-50",   dot: "bg-blue-400",  badge: "bg-blue-400 text-white"  },
  ok:      { card: "border-gray-100 bg-white",     dot: "bg-green-400", badge: "bg-gray-100 text-gray-500"},
};
const SEV = {
  urgent:  { bg:"bg-red-50",   border:"border-red-200",   text:"text-red-800",   bar:"bg-red-500",   cite:"text-red-400"   },
  warning: { bg:"bg-amber-50", border:"border-amber-200", text:"text-amber-800", bar:"bg-amber-400", cite:"text-amber-400" },
  info:    { bg:"bg-blue-50",  border:"border-blue-200",  text:"text-blue-800",  bar:"bg-blue-400",  cite:"text-blue-400"  },
};

// ─── CTG constants ────────────────────────────────────────────────────────

const CTG_CLASS_STYLE = {
  normal:       { bg: "bg-green-50",  border: "border-green-200",  text: "text-green-800",  dot: "bg-green-500"  },
  suspicious:   { bg: "bg-amber-50",  border: "border-amber-200",  text: "text-amber-800",  dot: "bg-amber-400"  },
  pathological: { bg: "bg-red-50",    border: "border-red-200",    text: "text-red-800",    dot: "bg-red-500"    },
};

const CTG_CLASS_DESC = {
  normal:       "All features reassuring — continue monitoring",
  suspicious:   "1 non-reassuring feature — conservative measures · reassess in 30 min",
  pathological: "2+ abnormal features — immediate senior review · consider FBS",
};

function ctgEntryLabel(e) {
  const varLbl = {
    "5-25":     "Var: normal",
    "<5":       `Var: <5 bpm ${e.variabilityMinutes > 50 ? ">50m" : e.variabilityMinutes >= 30 ? "30–50m" : "<30m"}`,
    ">25":      `Var: >25 bpm ${e.variabilityMinutes > 10 ? ">10m" : "≤10m"}`,
    sinusoidal: "Sinusoidal",
  };
  const dLbl = {
    none:                 "No decels",
    early:                "Early decels",
    variable:             "Variable",
    "variable-concerning":`Concern decels ${e.decelerationMinutes >= 30 ? "≥30m" : "<30m"}`,
    late:                 "Late decels",
    prolonged:            "Prolonged",
  };
  return [
    `HR ${e.baselineHR}`,
    varLbl[e.variability] ?? e.variability,
    dLbl[e.decelerations] ?? e.decelerations,
    e.accelerations ? "Accels ✓" : "No accels",
  ].join(" · ");
}

// ─── Clinical metadata ────────────────────────────────────────────────────

const STAGE_SUB = {
  "Latent":               "< 4 cm · irregular contractions",
  "Active first stage":   "≥ 4 cm · regular contractions",
  "Passive second stage": "Fully dilated · no urge to push",
  "Active second stage":  "Pushing / baby visible",
};

const STAGES   = ["Latent","Active first stage","Passive second stage","Active second stage"];
const ANALGS   = ["None","Entonox","Pethidine","Epidural","Remifentanil PCA"]; // eslint-disable-line no-unused-vars

// ─── Input atoms ──────────────────────────────────────────────────────────

/** Horizontal row of pill buttons — flex-1 each */
function PillRow({ value, onChange, options, labelFn }) {
  return (
    <div className="flex gap-2">
      {options.map(o => {
        const on = value === o;
        return (
          <button key={o} onClick={() => onChange(o)} type="button"
            className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-colors active:scale-95 ${on ? "bg-gray-900 border-gray-900 text-white" : "bg-white border-gray-200 text-gray-700"}`}>
            {labelFn ? labelFn(o) : o}
          </button>
        );
      })}
    </div>
  );
}

/** Grid of large tiles — cols via style to avoid Tailwind purge */
function TileGrid({ value, onChange, options, labelFn, subFn, cols = 2 }) {
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
      {options.map(o => {
        const on = value === o;
        return (
          <button key={o} onClick={() => onChange(o)} type="button"
            className={`py-4 px-3 rounded-2xl border text-left transition-colors active:scale-95 overflow-hidden ${on ? "bg-gray-900 border-gray-900" : "bg-white border-gray-200"}`}>
            <p className={`text-sm font-bold leading-snug break-words ${on ? "text-white" : "text-gray-800"}`}>
              {labelFn ? labelFn(o) : o}
            </p>
            {subFn && <p className={`text-[11px] mt-0.5 leading-tight ${on ? "text-gray-400" : "text-gray-400"}`}>{subFn(o)}</p>}
          </button>
        );
      })}
    </div>
  );
}

/** 11 large circles for dilation 0–10 */
function NumberGrid({ value, onChange }) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-6 gap-2">
        {[0,1,2,3,4,5].map(n => (
          <button key={n} onClick={() => onChange(n)}
            className={`aspect-square rounded-full flex items-center justify-center text-lg font-bold transition-colors active:scale-95 ${value === n ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700"}`}>
            {n}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-5 gap-2">
        {[6,7,8,9,10].map(n => (
          <button key={n} onClick={() => onChange(n)}
            className={`aspect-square rounded-full flex items-center justify-center text-lg font-bold transition-colors active:scale-95 ${value === n ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700"}`}>
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

/** 7-segment horizontal strip for station -3 to +3 */
function StationStrip({ value, onChange }) {
  return (
    <div className="flex rounded-xl overflow-hidden border border-gray-200">
      {[-3,-2,-1,0,1,2,3].map((o) => (
        <button key={o} onClick={() => onChange(o)}
          className={`flex-1 py-3.5 text-sm font-bold text-center transition-colors border-r border-gray-200 last:border-r-0 ${value === o ? "bg-gray-900 text-white" : "bg-white text-gray-600"}`}>
          {o > 0 ? `+${o}` : o}
        </button>
      ))}
    </div>
  );
}

/** Minus / value / Plus stepper */
function Stepper({ value, onChange, min, max, labelFn }) {
  return (
    <div className="flex items-center gap-4">
      <button onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}
        className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-700 disabled:opacity-30 active:scale-95 transition-all">
        −
      </button>
      <p className="flex-1 text-center text-3xl font-bold text-gray-900">
        {labelFn ? labelFn(value) : value}
      </p>
      <button onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}
        className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-700 disabled:opacity-30 active:scale-95 transition-all">
        +
      </button>
    </div>
  );
}

/** Weeks + days gestation input */
function GestationInput({ weeks, days, onChange }) {
  const btnCls = "w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-700 disabled:opacity-30 active:scale-95 transition-all";
  const adjW = d => {
    const w = Math.max(24, Math.min(42, weeks + d));
    onChange({ weeks: w, days });
  };
  const adjD = d => {
    let nd = days + d, nw = weeks;
    if (nd > 6) { nd = 0; nw = Math.min(42, nw + 1); }
    if (nd < 0) { nd = 6; nw = Math.max(24, nw - 1); }
    onChange({ weeks: nw, days: nd });
  };
  const unsupported = weeks < 28;
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide text-center mb-1.5">Weeks</p>
          <div className="flex items-center gap-1">
            <button onClick={() => adjW(-1)} disabled={weeks <= 24} className={btnCls}>−</button>
            <p className="flex-1 text-center text-3xl font-bold text-gray-900">{weeks}</p>
            <button onClick={() => adjW(1)}  disabled={weeks >= 42} className={btnCls}>+</button>
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-300 mt-5">+</p>
        <div className="flex-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide text-center mb-1.5">Days</p>
          <div className="flex items-center gap-1">
            <button onClick={() => adjD(-1)} disabled={weeks <= 24 && days === 0} className={btnCls}>−</button>
            <p className="flex-1 text-center text-3xl font-bold text-gray-900">{days}</p>
            <button onClick={() => adjD(1)}  disabled={weeks >= 42 && days >= 6} className={btnCls}>+</button>
          </div>
        </div>
      </div>
      {unsupported && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-center">
          <p className="text-sm font-bold text-amber-700">Gestations below 28+0 are not yet supported</p>
          <p className="text-xs text-amber-600 mt-0.5">Clinical alerts will not fire for this patient.</p>
        </div>
      )}
    </div>
  );
}

/** Multi-select chips */
function ChipGroup({ options, selected, onChange }) {
  const toggle = o => onChange(selected.includes(o) ? selected.filter(s => s !== o) : [...selected, o]);
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => {
        const on = selected.includes(o);
        return (
          <button key={o} onClick={() => toggle(o)} type="button"
            className={`px-3.5 py-2 rounded-full text-xs font-semibold border transition-colors ${on ? "bg-gray-900 border-gray-900 text-white" : "bg-white border-gray-200 text-gray-600"}`}>
            {o}
          </button>
        );
      })}
    </div>
  );
}

const COMMON_TIMES = ["08:00", "14:00", "18:00", "22:00"];

function shiftTime(clock, daysAgo, deltaMins) {
  const d = resolveTimeInput(clock, daysAgo);
  d.setMinutes(d.getMinutes() + deltaMins);
  let newDays = calendarDaysAgo(d);
  const maxDays = DAY_PICKER_OPTIONS.at(-1).daysAgo;
  if (newDays > maxDays) {
    newDays = maxDays;
    const anchored = new Date();
    anchored.setDate(anchored.getDate() - maxDays);
    anchored.setHours(d.getHours(), d.getMinutes(), 0, 0);
    d.setTime(anchored.getTime());
  }
  if (newDays < 0) newDays = 0;
  const time = `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
  return { time, daysAgo: newDays };
}

function formatWhenPreview(time, daysAgo) {
  const clock = time || timeInputNow();
  const d = resolveTimeInput(clock, daysAgo);
  const ms = Date.now() - d.getTime();
  const daysBack = calendarDaysAgo(d);
  const ago = ms >= 60 * 1000 ? `${fmtAge(ms)} ago` : ms >= 0 ? "Just now" : null;
  let main;
  if (daysBack === 0) main = `Today at ${clock}`;
  else if (daysBack === 1) main = `Yesterday at ${clock}`;
  else main = `${formatDayLabel(daysBack, d)} at ${clock}`;
  return { main, sub: ago };
}

/** When? — date + time picker with live preview; compact mode shows summary until Edit */
function NowField({ label, value, onChange, daysAgo: daysAgoProp = 0, compact = false }) {
  const [modified, setModified]     = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [daysAgo, setDaysAgo]       = useState(daysAgoProp);
  const [expanded, setExpanded]     = useState(!compact);

  useEffect(() => {
    setDaysAgo(daysAgoProp);
    if (daysAgoProp > 0 || (value && value !== timeInputNow())) setModified(true);
  }, [daysAgoProp, value]);

  const clock = value || timeInputNow();
  const preview = formatWhenPreview(modified ? clock : timeInputNow(), modified ? daysAgo : 0);

  const emit = (time, days = daysAgo) => onChange(time, days);

  const setNow = () => {
    setDaysAgo(0);
    emit(timeInputNow(), 0);
    setModified(false);
    setShowCustom(false);
  };

  const pickDay = days => {
    setDaysAgo(days);
    emit(clock, days);
    setModified(true);
    setShowCustom(false);
  };

  const pickTime = time => {
    emit(time, daysAgo);
    setModified(true);
    setShowCustom(false);
  };

  const nudge = deltaMins => {
    const base = modified ? clock : timeInputNow();
    const baseDays = modified ? daysAgo : 0;
    const { time, daysAgo: newDays } = shiftTime(base, baseDays, deltaMins);
    setDaysAgo(newDays);
    emit(time, newDays);
    setModified(true);
    setExpanded(true);
  };

  const stepBtn = "w-11 self-stretch rounded-2xl bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-700 active:scale-95 transition-all shrink-0";

  if (compact && !expanded) {
    return (
      <button type="button" onClick={() => setExpanded(true)}
        className="w-full flex items-center justify-between gap-3 rounded-2xl bg-gray-50 border border-gray-200 px-4 py-4 active:scale-[0.99] transition-all">
        <div className="text-left min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate">{preview.main}</p>
          {preview.sub && <p className="text-xs text-gray-400 mt-0.5">{preview.sub}</p>}
        </div>
        <span className="text-xs font-bold text-gray-500 shrink-0">Edit</span>
      </button>
    );
  }

  return (
    <div className="space-y-3">
      {label && <p className="text-xs font-semibold text-gray-500">{label}</p>}

      {compact && (
        <button type="button" onClick={() => { setExpanded(false); setShowCustom(false); }}
          className="text-[11px] font-semibold text-gray-400 active:text-gray-600">
          Collapse
        </button>
      )}

      {/* Preview + single ±15 min stepper */}
      <div className="flex items-stretch gap-2">
        <button type="button" aria-label="15 minutes earlier" onClick={() => nudge(-15)} className={stepBtn}>−</button>
        <div className="flex-1 rounded-2xl bg-gray-900 text-white px-4 py-3.5 text-center min-w-0">
          <p className="text-sm font-bold leading-snug">{preview.main}</p>
          {preview.sub && <p className="text-xs text-gray-400 mt-0.5">{preview.sub}</p>}
        </div>
        <button type="button" aria-label="15 minutes later" onClick={() => nudge(15)} className={stepBtn}>+</button>
      </div>

      {modified && (
        <button type="button" onClick={setNow}
          className="text-[11px] font-semibold text-gray-400 active:text-gray-600">
          Reset to now
        </button>
      )}

      {/* Date */}
      <div className="flex gap-1.5">
        {DAY_PICKER_OPTIONS.map(({ label: dayLabelOpt, daysAgo: d }) => (
          <button key={d} type="button" onClick={() => pickDay(d)}
            className={`flex-1 py-2.5 rounded-xl text-[11px] font-bold transition-colors active:scale-95 ${
              (d === 0 && !modified) || (modified && daysAgo === d)
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600"
            }`}>
            {dayLabelOpt}
          </button>
        ))}
      </div>

      {/* Quick times — tap to set, use ± above to fine-tune */}
      <div className="flex gap-1.5">
        {COMMON_TIMES.map(t => (
          <button key={t} type="button" onClick={() => pickTime(t)}
            className={`flex-1 py-2.5 rounded-xl text-[11px] font-bold transition-colors active:scale-95 ${
              modified && clock === t
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600"
            }`}>
            {t}
          </button>
        ))}
        <button type="button" onClick={() => setShowCustom(v => !v)}
          className={`px-3 py-2.5 rounded-xl text-[11px] font-bold transition-colors active:scale-95 ${
            showCustom ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"
          }`}>
          ···
        </button>
      </div>

      {showCustom && (
        <input type="time" autoFocus defaultValue={clock}
          onChange={e => pickTime(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none focus:border-gray-400" />
      )}
    </div>
  );
}

function SLabel({ children, className = "" }) {
  return <p className={`text-[11px] font-bold text-gray-400 uppercase tracking-wide ${className}`}>{children}</p>;
}

// ─── Bottom sheet ─────────────────────────────────────────────────────────

function BottomSheet({ open, onClose, title, sub, children }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <div onClick={onClose}
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`} />
      <div className={`fixed bottom-0 inset-x-0 z-50 bg-white rounded-t-3xl shadow-2xl flex flex-col transition-transform duration-300 ease-out ${open ? "translate-y-0" : "translate-y-full"}`}
        style={{ maxHeight: "92vh" }}>
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>
        {(title || sub) && (
          <div className="px-5 py-3 border-b border-gray-100 shrink-0">
            {title && <p className="text-base font-bold text-gray-900">{title}</p>}
            {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
          </div>
        )}
        <div className="flex-1 flex flex-col min-h-0">{children}</div>
      </div>
    </>
  );
}

// ─── VE sheet — 2-page pagination ─────────────────────────────────────────

function VESheet({ bed, editVE, onSave }) {
  const lastVE = bed.ves?.length ? [...bed.ves].sort((a,b) => new Date(a.time)-new Date(b.time)).at(-1) : null;
  const prevMembTime = (() => {
    for (let i = (bed.ves?.length ?? 0) - 1; i >= 0; i--)
      if (bed.ves[i].membranesTime) return bed.ves[i].membranesTime;
    return null;
  })();

  const [page, setPage]          = useState(1);
  const [dilation, setDil]       = useState(editVE?.dilation ?? null);
  const [membranes, setMemb]     = useState(editVE?.membranes ?? lastVE?.membranes ?? "Intact");
  const [membTime, setMembTime]  = useState(
    editVE?.membranesTime ? fmtTime(editVE.membranesTime) : timeInputNow()
  );
  const [membDaysAgo, setMembDaysAgo] = useState(
    editVE?.membranesTime ? isoToTimeFields(editVE.membranesTime).daysAgo : 0
  );
  const [veTime, setVETime]      = useState(
    editVE?.time ? fmtTime(editVE.time) : timeInputNow()
  );
  const [veDaysAgo, setVeDaysAgo] = useState(
    editVE?.time ? isoToTimeFields(editVE.time).daysAgo : 0
  );
  const [station, setStn]        = useState(editVE?.station ?? lastVE?.station ?? 0);
  const [presentation, setPres]  = useState(editVE?.presentation ?? "Cephalic");
  const [contractions, setContr] = useState(editVE?.contractions ?? lastVE?.contractions ?? 3);
  const [liquor, setLiquor]      = useState(editVE?.liquor ?? lastVE?.liquor ?? null);

  const save = () => {
    if (dilation === null) return;
    onSave({
      id: editVE?.id ?? `ve-${Date.now()}`,
      time: timeToISO(veTime, veDaysAgo),
      dilation, station, presentation, membranes,
      membranesTime: membranes !== "Intact"
        ? (editVE ? timeToISO(membTime, membDaysAgo) : prevMembTime && lastVE?.membranes === membranes ? prevMembTime : timeToISO(membTime, membDaysAgo))
        : null,
      liquor: membranes !== "Intact" ? liquor : null,
      contractions,
    });
  };

  return (
    <>
      {/* Page dots */}
      <div className="flex justify-center gap-2 py-3 shrink-0">
        {[1, 2].map(p => (
          <div key={p} className={`rounded-full transition-all duration-300 ${p === page ? "w-5 h-1.5 bg-gray-900" : "w-1.5 h-1.5 bg-gray-200"}`} />
        ))}
      </div>

      <div className="overflow-y-auto overscroll-contain flex-1 min-h-0">
        {page === 1 && (
          <div className="px-5 pt-2 pb-4 space-y-6">
            <div>
              <div className="flex items-baseline justify-between mb-3">
                <SLabel>Dilation (cm)</SLabel>
                {dilation !== null
                  ? <span className="text-2xl font-bold text-gray-900">{dilation} cm</span>
                  : <span className="text-xs text-gray-400">tap a circle</span>}
              </div>
              <NumberGrid value={dilation} onChange={setDil} />
            </div>

            <div>
              <SLabel className="mb-2">Membranes</SLabel>
              <PillRow value={membranes} onChange={setMemb} options={["Intact","SROM","AROM"]} />
              {membranes !== "Intact" && (
                <div className="mt-3">
                  <NowField label={`Time of ${membranes}`} value={membTime} daysAgo={membDaysAgo}
                    onChange={(t, d) => { setMembTime(t); setMembDaysAgo(d); }} />
                </div>
              )}
            </div>

            {membranes !== "Intact" && (
              <div>
                <SLabel className="mb-2">Liquor</SLabel>
                <div className="space-y-2">
                  <PillRow value={liquor} onChange={setLiquor}
                    options={["Clear","Thin meconium","Thick meconium"]}
                    labelFn={o => LIQUOR_LABEL[o]} />
                  <PillRow value={liquor} onChange={setLiquor}
                    options={["Blood-stained","Absent"]}
                    labelFn={o => LIQUOR_LABEL[o]} />
                </div>
              </div>
            )}
          </div>
        )}

        {page === 2 && (
          <div className="px-5 pt-2 pb-4 space-y-6">
            <NowField label="Time of VE" value={veTime} daysAgo={veDaysAgo}
              onChange={(t, d) => { setVETime(t); setVeDaysAgo(d); }} />

            <div>
              <SLabel className="mb-3">Station</SLabel>
              <StationStrip value={station} onChange={setStn} />
            </div>

            <div>
              <SLabel className="mb-2">Presentation</SLabel>
              <PillRow value={presentation} onChange={setPres} options={["Cephalic","Breech","Other"]} />
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-3">
                <SLabel>Contractions / 10 min</SLabel>
                {contractions > 5 && <span className="text-[10px] font-bold text-red-500 uppercase tracking-wide">Hyperstim · NG235 §1.5.7</span>}
              </div>
              <Stepper value={contractions} onChange={setContr} min={1} max={8} />
            </div>
          </div>
        )}
      </div>

      {/* Sticky footer */}
      <div className="px-5 pt-3 border-t border-gray-100 shrink-0"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}>
        {page === 1 ? (
          <button onClick={() => setPage(2)} disabled={dilation === null}
            className="w-full py-4 rounded-2xl text-base font-bold bg-gray-900 disabled:bg-gray-200 disabled:text-gray-400 text-white active:scale-95 transition-all">
            Next →
          </button>
        ) : (
          <div className="flex gap-3">
            <button onClick={() => setPage(1)}
              className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0 active:scale-95 transition-all">
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button onClick={save}
              className="flex-1 py-4 rounded-2xl text-base font-bold bg-gray-900 text-white active:scale-95 transition-all">
              Save VE
            </button>
          </div>
        )}
        <p className="text-[10px] text-gray-300 text-center mt-2">NICE NG235 §1.4.1 — 4-hourly VE in active labour</p>
      </div>
    </>
  );
}

// ─── Oxytocin sheet content ───────────────────────────────────────────────

function OxySheet({ bed, onSave }) {
  const current = bed.oxytocinLog?.[bed.oxytocinLog.length - 1];
  const [dose, setDose]     = useState(current?.dose ?? 2);
  const [oxyTime, setOTime] = useState(timeInputNow);
  const [oxyDaysAgo, setOxyDaysAgo] = useState(0);

  const save = () => onSave({
    id:`ox-${Date.now()}`,
    startTime: timeToISO(oxyTime, oxyDaysAgo),
    dose,
    lastIncrementTime: timeToISO(oxyTime, oxyDaysAgo),
  });

  return (
    <>
      <div className="overflow-y-auto overscroll-contain flex-1 min-h-0">
        <div className="px-5 pt-4 pb-4 space-y-5">
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
            <SLabel className="text-amber-600 mb-2">NICE NG235 §1.5.6 — Protocol</SLabel>
            <ul className="space-y-1">
              {["Start 1–2 mU/min · increase by 1–2 mU every 30 min minimum",
                "Target 3–4 contractions/10 min, each 40–60 sec",
                "Maximum 20 mU/min — escalate to registrar at max",
                "Do NOT routinely use in 2nd stage with regional analgesia [2023]",
              ].map((t,i) => <li key={i} className="flex gap-2 text-xs text-amber-800"><span className="text-amber-400 shrink-0">›</span>{t}</li>)}
            </ul>
          </div>

          <NowField label="Time of dose change" value={oxyTime} daysAgo={oxyDaysAgo}
            onChange={(t, d) => { setOTime(t); setOxyDaysAgo(d); }} />

          <div>
            <div className="flex items-baseline justify-between mb-3">
              <SLabel>Current dose</SLabel>
              <span className={`text-2xl font-bold ${dose >= 20 ? "text-red-600" : "text-gray-900"}`}>{dose} mU/min</span>
            </div>
            <Stepper value={dose} onChange={setDose} min={1} max={20} />
            {dose >= 20 && <p className="text-xs font-bold text-red-600 text-center mt-2">Maximum — escalate to registrar · NG235 §1.5.6</p>}
          </div>
        </div>
      </div>

      <div className="px-5 pt-3 border-t border-gray-100 shrink-0"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}>
        <button onClick={save}
          className="w-full py-4 rounded-2xl text-base font-bold bg-gray-900 text-white active:scale-95 transition-all">
          Log dose
        </button>
      </div>
    </>
  );
}

// ─── Delivery sheet ───────────────────────────────────────────────────────

const DELIVERY_MODES = ["SVD", "Forceps", "Ventouse", "Em LSCS", "El LSCS"];
const EBL_PRESETS = [200, 500, 1000, 1500];

function DeliverySheet({ bed, onSave }) {
  const ex = bed.delivery ?? null;
  const [delivTime, setDelivTime] = useState(ex?.time ? fmtTime(ex.time) : timeInputNow());
  const [delivDaysAgo, setDelivDaysAgo] = useState(ex?.time ? isoToTimeFields(ex.time).daysAgo : 0);
  const [mode, setMode]           = useState(ex?.mode ?? "SVD");
  const [ebl, setEbl]             = useState(ex?.ebl != null ? String(ex.ebl) : "");
  const [notes, setNotes]         = useState(ex?.notes ?? "");

  const eblNum = ebl ? parseFloat(ebl) : null;

  const save = () => onSave({
    time:  timeToISO(delivTime, delivDaysAgo),
    mode,
    ebl:   eblNum,
    notes: notes.trim() || null,
  });

  return (
    <>
      <div className="overflow-y-auto overscroll-contain flex-1 min-h-0">
        <div className="px-5 pt-4 pb-4 space-y-5">

          <NowField label="Time of delivery" value={delivTime} daysAgo={delivDaysAgo}
            onChange={(t, d) => { setDelivTime(t); setDelivDaysAgo(d); }} />

          <div>
            <SLabel className="mb-2">Mode of delivery</SLabel>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {["SVD","Forceps","Ventouse"].map(m => (
                <button key={m} onClick={() => setMode(m)}
                  className={`py-3.5 rounded-2xl border text-sm font-bold transition-colors active:scale-95 ${mode === m ? "bg-gray-900 border-gray-900 text-white" : "bg-white border-gray-200 text-gray-700"}`}>
                  {m}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {["Em LSCS","El LSCS"].map(m => (
                <button key={m} onClick={() => setMode(m)}
                  className={`py-3.5 rounded-2xl border text-sm font-bold transition-colors active:scale-95 ${mode === m ? "bg-gray-900 border-gray-900 text-white" : "bg-white border-gray-200 text-gray-700"}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <SLabel className="mb-2">Estimated blood loss (mL)</SLabel>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {EBL_PRESETS.map(v => (
                <button key={v} onClick={() => setEbl(String(v))}
                  className={`py-2.5 rounded-xl border text-xs font-bold transition-colors active:scale-95 ${ebl === String(v) ? "bg-gray-900 border-gray-900 text-white" : "bg-gray-50 border-gray-200 text-gray-600"}`}>
                  {v}
                </button>
              ))}
            </div>
            <input type="number" inputMode="numeric" value={ebl}
              onChange={e => setEbl(e.target.value)}
              placeholder="Or type exact mL"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-gray-400" />
            {eblNum !== null && eblNum >= 1000 && (
              <p className="text-xs font-bold text-red-600 mt-1.5">Major PPH ≥ 1000 mL — activate PPH protocol</p>
            )}
            {eblNum !== null && eblNum >= 500 && eblNum < 1000 && (
              <p className="text-xs font-bold text-amber-600 mt-1.5">PPH ≥ 500 mL — monitor closely</p>
            )}
          </div>

          <div>
            <SLabel className="mb-2">Notes (optional)</SLabel>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="e.g. shoulder dystocia, perineal tear, PPH managed…"
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-gray-400 resize-none" />
          </div>

        </div>
      </div>

      <div className="px-5 pt-3 border-t border-gray-100 shrink-0"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}>
        <button onClick={save}
          className="w-full py-4 rounded-2xl text-base font-bold bg-green-700 text-white active:scale-95 transition-all">
          {ex ? "Update delivery record" : "Mark as delivered"}
        </button>
      </div>
    </>
  );
}

// ─── CTG sheet ───────────────────────────────────────────────────────────

function CTGSheet({ bed, editCTG = null, onSave }) {
  const prevEntry = editCTG
    ? (bed.ctgLog ?? []).filter(e => e.id !== editCTG.id).slice(-1)[0] ?? null
    : (bed.ctgLog ?? []).slice(-1)[0] ?? null;
  const prevHR = prevEntry?.baselineHR ?? null;

  const [ctgTime, setCTGTime]     = useState(editCTG ? fmtTime(editCTG.time) : timeInputNow());
  const [ctgDaysAgo, setCtgDaysAgo] = useState(editCTG ? isoToTimeFields(editCTG.time).daysAgo : 0);
  const [hr, setHR]               = useState(editCTG?.baselineHR ?? prevHR ?? 140);
  const [variability, setVar]     = useState(editCTG?.variability ?? "5-25");
  const [varMin, setVarMin]       = useState(editCTG?.variabilityMinutes ?? 0);
  const [decels, setDecels]       = useState(editCTG?.decelerations ?? "none");
  const [decelMin, setDecelMin]   = useState(editCTG?.decelerationMinutes ?? 0);
  const [accelerations, setAccel] = useState(editCTG?.accelerations ?? true);
  const [ctxPer10, setCtx]        = useState(editCTG?.contractionsPerTen ?? 3);

  const classification = useMemo(() =>
    classifyCTGEntry(
      { baselineHR: hr, variability, variabilityMinutes: varMin,
        decelerations: decels, decelerationMinutes: decelMin,
        accelerations, contractionsPerTen: ctxPer10 },
      prevHR
    ),
    [hr, variability, varMin, decels, decelMin, accelerations, ctxPer10, prevHR]
  );

  const cs   = CTG_CLASS_STYLE[classification];
  const rise = prevHR != null ? hr - prevHR : 0;
  const hrColor = hr < 100 || hr > 160 ? "text-red-600" : hr < 110 ? "text-amber-500" : "text-gray-900";
  const hrHint  = hr < 100 ? "RED — bradycardia < 100 bpm"
                : hr > 160 ? "RED — tachycardia > 160 bpm"
                : hr < 110 ? "AMBER — 100–109 bpm" : "White — normal 110–160 bpm";

  const save = () => onSave({
    id: editCTG?.id ?? `ctg-${Date.now()}`,
    time: timeToISO(ctgTime, ctgDaysAgo),
    baselineHR: hr, variability, variabilityMinutes: varMin,
    decelerations: decels, decelerationMinutes: decelMin,
    accelerations, contractionsPerTen: ctxPer10,
    classification,
  });

  return (
    <>
      <div className="overflow-y-auto overscroll-contain flex-1 min-h-0">
        <div className="px-5 pt-4 pb-4 space-y-6">

          {/* Live classification banner */}
          <div className={`rounded-2xl border ${cs.border} ${cs.bg} px-4 py-3 flex items-center gap-3`}>
            <div className={`w-3 h-3 rounded-full ${cs.dot} shrink-0`} />
            <div className="flex-1">
              <p className={`text-sm font-bold ${cs.text} capitalize`}>{classification} CTG</p>
              <p className={`text-xs ${cs.text} opacity-80 mt-0.5 leading-snug`}>{CTG_CLASS_DESC[classification]}</p>
            </div>
          </div>

          <NowField label="Time of CTG review" value={ctgTime} daysAgo={ctgDaysAgo}
            onChange={(t, d) => { setCTGTime(t); setCtgDaysAgo(d); }} />

          {/* Baseline HR */}
          <div>
            <div className="flex items-baseline justify-between mb-3">
              <SLabel>Baseline HR</SLabel>
              {prevHR != null && (
                <span className={`text-xs ${rise >= 20 ? "text-amber-500 font-bold" : "text-gray-400"}`}>
                  Last {prevHR} bpm {rise !== 0 ? (rise > 0 ? `↑${rise}` : `↓${Math.abs(rise)}`) : "="}
                  {rise >= 20 && " · AMBER"}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setHR(h => Math.max(60, h - 10))}
                className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-700 active:scale-95 transition-all">
                −10
              </button>
              <button onClick={() => setHR(h => Math.max(60, h - 1))}
                className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-700 active:scale-95 transition-all">
                −
              </button>
              <p className={`flex-1 text-center text-3xl font-bold ${hrColor}`}>{hr}</p>
              <button onClick={() => setHR(h => Math.min(200, h + 1))}
                className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-700 active:scale-95 transition-all">
                +
              </button>
              <button onClick={() => setHR(h => Math.min(200, h + 10))}
                className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-700 active:scale-95 transition-all">
                +10
              </button>
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-1.5">{hrHint}</p>
          </div>

          {/* Variability */}
          <div>
            <SLabel className="mb-2">Variability</SLabel>
            <div className="grid grid-cols-4 gap-1.5">
              {["5-25", "<5", ">25", "sinusoidal"].map(o => {
                const label = { "5-25": "5–25 bpm", "<5": "< 5 bpm", ">25": "> 25 bpm", sinusoidal: "Sinusoidal" }[o];
                const on = variability === o;
                return (
                  <button key={o} onClick={() => { setVar(o); setVarMin(0); }}
                    className={`py-2.5 rounded-xl border text-xs font-semibold transition-colors active:scale-95 ${on ? "bg-gray-900 border-gray-900 text-white" : "bg-white border-gray-200 text-gray-700"}`}>
                    {label}
                  </button>
                );
              })}
            </div>

            {variability === "<5" && (
              <div className="mt-3">
                <SLabel className="mb-2">Duration of reduced variability</SLabel>
                <div className="grid grid-cols-3 gap-1.5">
                  {[{ val: 15, label: "< 30 min", hint: "Acceptable" },
                    { val: 40, label: "30–50 min", hint: "AMBER" },
                    { val: 60, label: "> 50 min",  hint: "RED" }].map(({ val, label, hint }) => {
                    const on = (val === 15 && varMin < 30) || (val === 40 && varMin >= 30 && varMin <= 50) || (val === 60 && varMin > 50);
                    return (
                      <button key={val} onClick={() => setVarMin(val)}
                        className={`py-2.5 rounded-xl border text-center transition-colors active:scale-95 ${on ? "bg-gray-900 border-gray-900" : "bg-white border-gray-200"}`}>
                        <p className={`text-xs font-bold ${on ? "text-white" : "text-gray-800"}`}>{label}</p>
                        <p className={`text-[10px] ${on ? "text-gray-400" : "text-gray-400"}`}>{hint}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {variability === ">25" && (
              <div className="mt-3">
                <SLabel className="mb-2">Duration of saltatory variability</SLabel>
                <div className="grid grid-cols-2 gap-1.5">
                  {[{ val: 5, label: "≤ 10 min", hint: "AMBER" },
                    { val: 15, label: "> 10 min", hint: "RED"  }].map(({ val, label, hint }) => {
                    const on = (val === 5 && varMin <= 10) || (val === 15 && varMin > 10);
                    return (
                      <button key={val} onClick={() => setVarMin(val)}
                        className={`py-2.5 rounded-xl border text-center transition-colors active:scale-95 ${on ? "bg-gray-900 border-gray-900" : "bg-white border-gray-200"}`}>
                        <p className={`text-xs font-bold ${on ? "text-white" : "text-gray-800"}`}>{label}</p>
                        <p className={`text-[10px] ${on ? "text-gray-400" : "text-gray-400"}`}>{hint}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Decelerations */}
          <div>
            <SLabel className="mb-2">Decelerations</SLabel>
            <div className="space-y-1.5">
              <div className="grid grid-cols-3 gap-1.5">
                {["none", "early", "variable"].map(o => {
                  const label = { none: "None", early: "Early", variable: "Variable" }[o];
                  const on = decels === o;
                  return (
                    <button key={o} onClick={() => { setDecels(o); setDecelMin(0); }}
                      className={`py-2.5 rounded-xl border text-xs font-semibold transition-colors active:scale-95 ${on ? "bg-gray-900 border-gray-900 text-white" : "bg-white border-gray-200 text-gray-700"}`}>
                      {label}
                    </button>
                  );
                })}
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {["variable-concerning", "late", "prolonged"].map(o => {
                  const label = { "variable-concerning": "Var (concerns)", late: "Late", prolonged: "Prolonged ≥3m" }[o];
                  const on = decels === o;
                  return (
                    <button key={o} onClick={() => { setDecels(o); setDecelMin(0); }}
                      className={`py-2.5 rounded-xl border text-xs font-semibold transition-colors active:scale-95 ${on ? "bg-gray-900 border-gray-900 text-white" : "bg-white border-gray-200 text-gray-700"}`}>
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {decels === "variable-concerning" && (
              <div className="mt-3">
                <SLabel className="mb-2">Duration of concerning variable decels</SLabel>
                <div className="grid grid-cols-2 gap-1.5">
                  {[{ val: 15, label: "< 30 min", hint: "AMBER" },
                    { val: 30, label: "≥ 30 min", hint: "RED"   }].map(({ val, label, hint }) => {
                    const on = (val === 15 && decelMin < 30) || (val === 30 && decelMin >= 30);
                    return (
                      <button key={val} onClick={() => setDecelMin(val)}
                        className={`py-2.5 rounded-xl border text-center transition-colors active:scale-95 ${on ? "bg-gray-900 border-gray-900" : "bg-white border-gray-200"}`}>
                        <p className={`text-xs font-bold ${on ? "text-white" : "text-gray-800"}`}>{label}</p>
                        <p className={`text-[10px] ${on ? "text-gray-400" : "text-gray-400"}`}>{hint}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Accelerations */}
          <div>
            <SLabel className="mb-2">Accelerations (≥15 bpm for ≥15 sec)</SLabel>
            <PillRow value={accelerations ? "present" : "absent"}
              onChange={v => setAccel(v === "present")}
              options={["present", "absent"]}
              labelFn={o => o === "present" ? "Present ✓" : "Absent"} />
          </div>

          {/* Contractions */}
          <div>
            <div className="flex items-baseline justify-between mb-3">
              <SLabel>Contractions / 10 min</SLabel>
              {ctxPer10 >= 5 && (
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wide">Tachysystole · NG229 §1.4</span>
              )}
            </div>
            <Stepper value={ctxPer10} onChange={setCtx} min={0} max={10} />
          </div>

        </div>
      </div>

      <div className="px-5 pt-3 border-t border-gray-100 shrink-0"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}>
        <button onClick={save}
          className={`w-full py-4 rounded-2xl text-base font-bold text-white active:scale-95 transition-all ${
            classification === "pathological" ? "bg-red-600" :
            classification === "suspicious"   ? "bg-amber-500" : "bg-gray-900"
          }`}>
          Log {classification === "pathological" ? "⚠ Pathological" : classification === "suspicious" ? "Suspicious" : "Normal"} CTG
        </button>
        <p className="text-[10px] text-gray-300 text-center mt-2">NICE NG229 — Fetal Monitoring in Labour [Dec 2022]</p>
      </div>
    </>
  );
}

// ─── Admission wizard — one question per page ─────────────────────────────

const ADM_PHASE_DEFS = [
  { id: "patient",  label: "Patient",  ids: ["bed", "demographics"] },
  { id: "handover", label: "Handover", ids: ["flags", "stage", "analgesia", "mode", "membranes", "liquor"] },
  { id: "finish",   label: "Finish",   ids: ["indMethod", "iolReasons", "iolStart", "admTime", "handoverVE", "veTime", "dilation", "veExtras"] },
];

function buildAdmissionQuestions({ mode, admMembranes, handoverVEAnswered, hasHandoverVE, expressIOL }) {
  if (expressIOL) {
    const qs = ["bed", "stage", "indMethod", "iolStart", "handoverVE"];
    if (handoverVEAnswered && hasHandoverVE) qs.push("veTime", "dilation", "veExtras");
    return qs;
  }
  const qs = ["bed", "demographics", "flags", "stage", "analgesia", "mode"];
  if (mode !== "PPROM") {
    qs.push("membranes");
    if (admMembranes !== "Intact") qs.push("liquor");
  }
  if (mode === "Induced") qs.push("indMethod", "iolReasons", "iolStart");
  qs.push("admTime", "handoverVE");
  if (handoverVEAnswered && hasHandoverVE) qs.push("veTime", "dilation", "veExtras");
  return qs;
}

function getAdmissionProgress(questions, qIndex) {
  const qId = questions[qIndex];
  for (const phase of ADM_PHASE_DEFS) {
    const inPhase = questions.filter(q => phase.ids.includes(q));
    const idx = inPhase.indexOf(qId);
    if (idx >= 0) return { phaseLabel: phase.label, stepInPhase: idx + 1, totalInPhase: inPhase.length };
  }
  return { phaseLabel: "Admission", stepInPhase: qIndex + 1, totalInPhase: questions.length };
}

function admissionContextChip(bedNum, parity, gestWeeks, gestDays) {
  if (!bedNum.trim()) return null;
  const parts = [`Bed ${bedNum.trim()}`];
  if (parity) parts.push(parity.replace("Para ", "P"));
  parts.push(`${gestWeeks}+${gestDays}`);
  return parts.join(" · ");
}

function buildAdmissionSummary(f) {
  const parts = [`Bed ${f.bedNum.trim()}`];
  if (!f.expressIOL) parts.push(f.parity.replace("Para ", "P"), `${f.gestWeeks}+${f.gestDays}`);
  else parts.push(`${f.gestWeeks}+${f.gestDays}`);
  if (f.stage) parts.push(STAGE_SHORT[f.stage] ?? f.stage);
  if (f.analgesia && f.analgesia !== "None") parts.push(f.analgesia);
  if (f.mode === "Induced") parts.push(`Induced${f.indMethod ? ` · ${f.indMethod}` : ""}`);
  else if (f.mode === "PPROM") parts.push("PPROM");
  if (f.flags.length) parts.push(f.flags.join(", "));
  if (f.hasHandoverVE && f.admDilation != null) parts.push(`VE ${f.admDilation} cm`);
  else if (!f.hasHandoverVE) parts.push("no VE on handover");
  return parts.filter(Boolean).join(" · ");
}

const ADM_Q_META = {
  bed:           { title: "Bed / bay number",        hint: "Which bed or bay?" },
  demographics:  { title: "Parity & gestation",    hint: "As handed over" },
  flags:         { title: "Risk flags",            hint: "Select all that apply — or tap None" },
  stage:         { title: "Reported labour stage", hint: "As handed over — not from an exam now" },
  analgesia:     { title: "Analgesia",             hint: "Current analgesia" },
  mode:          { title: "Mode of onset",         hint: null },
  membranes:     { title: "Membranes",             hint: null },
  liquor:        { title: "Liquor",                hint: null },
  indMethod:     { title: "Induction method",      hint: null },
  iolReasons:    { title: "Indication for IOL",    hint: "Select all that apply" },
  iolStart:      { title: "When did IOL start?",   hint: "Skip if not known" },
  admTime:       { title: "Admission time",        hint: "Skip to use now" },
  handoverVE:    { title: "VE on handover?",       hint: "Record last known VE if handed over" },
  veTime:        { title: "Last VE time",          hint: null },
  dilation:      { title: "Dilation at that VE",   hint: "Tap a circle" },
  veExtras:      { title: "Station & contractions", hint: "Optional — skip if not known" },
};

const ADM_SLIDE_CSS = `
  @keyframes admSlideFwd { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
  @keyframes admSlideBack { from { opacity:0; transform:translateX(-20px); } to { opacity:1; transform:translateX(0); } }
`;

function AdmissionWizard({ existingNumbers, onSave, onCancel, initialValues = null, expressIOL = false, iolAddedAt = null }) {
  const iolStartInit = iolAddedAt ? isoToTimeFields(iolAddedAt) : { time: timeInputNow(), daysAgo: 0 };
  const [bedNum, setBedNum]   = useState("");
  const [parity, setParity]   = useState("Para 0");
  const [gestWeeks, setGestW] = useState(initialValues?.gestWeeks ?? 40);
  const [gestDays,  setGestD] = useState(initialValues?.gestDays  ?? 0);
  const [err, setErr]         = useState("");
  const [stage, setStage]     = useState(expressIOL ? "Latent" : null);
  const [mode, setMode]       = useState(initialValues?.mode ?? "Spontaneous");
  const [indMethod, setIndM]  = useState("Dinoprostone");
  const [iolReasons, setIolR] = useState(initialValues?.iolReasons ?? []);
  const [analgesia, setAnal]  = useState("None");
  const [flags, setFlags]     = useState([]);
  const [admTime, setAdmT]    = useState(timeInputNow);
  const [admDaysAgo, setAdmDaysAgo] = useState(0);
  const [iolStartTime, setIolStartTime] = useState(iolStartInit.time || timeInputNow());
  const [iolDaysAgo, setIolDaysAgo] = useState(iolStartInit.daysAgo);
  const [skipIolStart, setSkipIolStart] = useState(false);
  const [skipAdmTime, setSkipAdmTime]   = useState(false);

  const [hasHandoverVE, setHasHandoverVE] = useState(false);
  const [handoverVEAnswered, setHandoverVEAnswered] = useState(false);
  const [veTime, setVeTime]               = useState("");
  const [veDaysAgo, setVeDaysAgo]         = useState(0);
  const [admDilation, setAdmDil]          = useState(null);
  const [admMembranes, setAdmMemb]        = useState(mode === "PPROM" ? "SROM" : "Intact");
  const [admLiquor, setAdmLiquor]         = useState(null);
  const [admStation, setAdmStn]           = useState(0);
  const [admContracts, setAdmContr]       = useState(3);

  const [qIndex, setQIndex] = useState(0);
  const [slideDir, setSlideDir] = useState(1);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    const handler = e => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  const questions = buildAdmissionQuestions({ mode, admMembranes, handoverVEAnswered, hasHandoverVE, expressIOL });
  const qId = questions[Math.min(qIndex, questions.length - 1)] ?? "bed";
  const meta  = ADM_Q_META[qId];
  const { phaseLabel, stepInPhase, totalInPhase } = getAdmissionProgress(questions, qIndex);
  const demoIdx = questions.indexOf("demographics");
  const showContext = bedNum.trim() && (expressIOL ? qIndex > 0 : (demoIdx < 0 || qIndex > demoIdx));
  const contextChip = expressIOL
    ? [`Bed ${bedNum.trim()}`, `${gestWeeks}+${gestDays}`, "IOL"].join(" · ")
    : admissionContextChip(bedNum, parity, gestWeeks, gestDays);

  useEffect(() => {
    if (qIndex >= questions.length) setQIndex(Math.max(0, questions.length - 1));
  }, [questions.length, qIndex]);

  useEffect(() => {
    if (qId === "handoverVE" && !handoverVEAnswered
        && (stage === "Passive second stage" || stage === "Active second stage")) {
      setHasHandoverVE(true);
    }
  }, [qId, handoverVEAnswered, stage]);

  const advance = () => {
    setErr("");
    setSlideDir(1);
    setQIndex(i => Math.min(i + 1, questions.length - 1));
  };

  const goBack = () => {
    setErr("");
    setShowSummary(false);
    if (qIndex === 0) {
      if (!bedNum || window.confirm("Discard this admission?")) onCancel();
      return;
    }
    const prevId = questions[qIndex - 1];
    if (prevId === "handoverVE") {
      setHandoverVEAnswered(false);
      setHasHandoverVE(false);
    }
    setSlideDir(-1);
    setQIndex(i => i - 1);
  };

  const autoAdvance = () => setTimeout(advance, 120);

  const applyModeDefaults = v => {
    setMode(v);
    if (v === "Induced") {
      setSkipIolStart(false);
      setIolStartTime(iolStartInit.time || timeInputNow());
      setIolDaysAgo(iolStartInit.daysAgo);
      if (!stage) setStage("Latent");
    }
    if (v === "PPROM") {
      if (!stage) setStage("Latent");
      setAdmMemb("SROM");
      setAdmLiquor(null);
    }
  };

  const saveAdmission = () => {
    const id = `bed-${Date.now()}`;
    const admissionISO = skipAdmTime || !admTime ? nowISO() : timeToISO(admTime, admDaysAgo);
    const veTimeISO = hasHandoverVE && veTime ? timeToISO(veTime, veDaysAgo) : null;
    const stageTime = veTimeISO ?? admissionISO;
    const membranes = mode === "PPROM" ? "SROM" : admMembranes;
    const admVE = hasHandoverVE && admDilation !== null ? [{
      id: `ve-${Date.now()}`,
      time: veTimeISO ?? nowISO(),
      dilation: admDilation,
      membranes,
      membranesTime: membranes !== "Intact" ? (veTimeISO ?? admissionISO) : null,
      liquor: membranes !== "Intact" ? admLiquor : null,
      station: admStation,
      presentation: "Cephalic",
      contractions: admContracts,
    }] : [];
    onSave({
      id, bedNumber: bedNum.trim(),
      admissionTime: admissionISO,
      parity, gestation: `${gestWeeks}+${gestDays}`,
      modeOfOnset: mode,
      inductionMethod: mode === "Induced" ? indMethod : null,
      iolReasons: mode === "Induced" ? iolReasons : [],
      inductionStartTime: mode === "Induced" && !skipIolStart && iolStartTime
        ? timeToISO(iolStartTime, iolDaysAgo) : null,
      analgesia, riskFlags: flags, labourStage: stage,
      activeFirstStageStartTime: stage === "Active first stage" ? stageTime : null,
      passiveStartTime: stage === "Passive second stage" ? stageTime : null,
      pushingStartTime: stage === "Active second stage"  ? stageTime : null,
      armTime: membranes === "AROM" ? (veTimeISO ?? admissionISO) : null,
      oxytocinStartTime: null,
      ves: admVE, oxytocinLog: [], ctgLog: [], observations: {},
    });
  };

  const summaryPayload = () => buildAdmissionSummary({
    bedNum, parity, gestWeeks, gestDays, stage, analgesia, mode, indMethod,
    flags, hasHandoverVE, admDilation, expressIOL,
  });

  const requestSave = () => setShowSummary(true);

  const validateAndAdvance = () => {
    if (qId === "bed") {
      const n = bedNum.trim();
      if (!n) { setErr("Enter a bed number"); return; }
      if (existingNumbers.includes(n)) { setErr("Already in use"); return; }
    }
    if (qId === "demographics" && gestWeeks < 28) {
      setErr("Gestation below 28+0 is not yet supported"); return;
    }
    advance();
  };

  const onHandoverVE = yes => {
    setHandoverVEAnswered(true);
    setHasHandoverVE(yes);
    if (yes) {
      if (!veTime) setVeTime(timeInputNow());
      setSlideDir(1);
      setTimeout(() => setQIndex(i => i + 1), 120);
    } else {
      requestSave();
    }
  };

  const needsFooter = ["bed", "demographics", "flags", "iolReasons", "iolStart", "admTime", "veTime", "veExtras"].includes(qId);

  const footerPrimary = () => {
    if (qId === "bed") return "Next";
    if (qId === "veExtras") return "Add to ward";
    return "Continue";
  };

  const footerAction = () => {
    if (qId === "veExtras") { requestSave(); return; }
    validateAndAdvance();
  };

  const slideAnim = slideDir > 0 ? "admSlideFwd 0.22s ease-out" : "admSlideBack 0.22s ease-out";

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      <style>{ADM_SLIDE_CSS}</style>

      <div className="px-5 pb-3 shrink-0 border-b border-gray-100"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 0.75rem)" }}>
        <div className="flex items-center gap-3 mb-2">
          <button onClick={goBack}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 shrink-0">
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-400">{phaseLabel} · {stepInPhase} of {totalInPhase}</p>
            <p className="text-base font-bold text-gray-900 truncate">{meta.title}</p>
          </div>
        </div>
        {showContext && contextChip && (
          <p className="text-xs font-semibold text-gray-500 text-center mb-2 px-2 truncate">{contextChip}</p>
        )}
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gray-900 rounded-full transition-all duration-300"
            style={{ width: `${(stepInPhase / totalInPhase) * 100}%` }} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-8 flex flex-col justify-center min-h-0">
        <div key={`${qId}-${qIndex}`} style={{ animation: slideAnim }}>
        {meta.hint && (
          <p className="text-sm text-gray-500 text-center mb-6 -mt-2">{meta.hint}</p>
        )}

        {qId === "bed" && (
          <input type="text" inputMode="numeric" autoFocus value={bedNum}
            onChange={e => { setBedNum(e.target.value); setErr(""); }}
            onKeyDown={e => e.key === "Enter" && validateAndAdvance()}
            placeholder="—"
            className="w-full text-6xl font-bold text-gray-900 text-center border-b-2 border-gray-200 focus:border-gray-900 pb-3 bg-transparent outline-none" />
        )}

        {qId === "demographics" && (
          <div className="space-y-8">
            <div>
              <SLabel className="mb-3 text-center">Parity</SLabel>
              <PillRow value={parity} onChange={setParity}
                options={["Para 0","Para 1","Para 2","Para 3+"]}
                labelFn={o => o.replace("Para ","P")} />
            </div>
            <div>
              <SLabel className="mb-4 text-center">Gestation</SLabel>
              <GestationInput weeks={gestWeeks} days={gestDays}
                onChange={({ weeks, days }) => { setGestW(weeks); setGestD(days); setErr(""); }} />
            </div>
          </div>
        )}

        {qId === "flags" && (
          <div>
            <button type="button"
              onClick={() => { setFlags([]); autoAdvance(); }}
              className={`w-full mb-3 py-3 rounded-xl text-sm font-semibold border transition-colors active:scale-95 ${
                flags.length === 0 ? "bg-gray-900 border-gray-900 text-white" : "bg-white border-gray-200 text-gray-700"
              }`}>
              None
            </button>
            <ChipGroup
              options={["GBS+","GBS pending","Diabetic-T1","Diabetic-T2","Diabetic-GDM","VBAC","Previous LSCS","Hypertensive"]}
              selected={flags} onChange={setFlags} />
            <div className="mt-4 space-y-1">
              {flags.includes("GBS+") && (
                <p className="text-[11px] text-amber-600 font-semibold">GBS+ → IV benzylpenicillin · GL787</p>
              )}
              {flags.some(f => f.startsWith("Diabetic")) && (
                <p className="text-[11px] text-amber-600 font-semibold">Diabetic → hourly BGL · GL983</p>
              )}
            </div>
          </div>
        )}

        {qId === "stage" && (
          <TileGrid value={stage} onChange={v => { setStage(v); setErr(""); autoAdvance(); }} cols={2}
            options={["Latent","Active first stage","Passive second stage","Active second stage"]}
            subFn={o => STAGE_SUB[o]} />
        )}

        {qId === "analgesia" && (
          <div className="space-y-2">
            <PillRow value={analgesia} onChange={v => { setAnal(v); autoAdvance(); }}
              options={["None","Entonox","Pethidine"]} />
            <PillRow value={analgesia} onChange={v => { setAnal(v); autoAdvance(); }}
              options={["Epidural","Remifentanil PCA"]} />
          </div>
        )}

        {qId === "mode" && (
          <PillRow value={mode} onChange={v => { applyModeDefaults(v); autoAdvance(); }}
            options={["Spontaneous","Induced","PPROM"]}
            labelFn={o => ({ Spontaneous:"Spontaneous", Induced:"Induced", PPROM:"PPROM" }[o])} />
        )}

        {qId === "membranes" && (
          <PillRow value={admMembranes} onChange={v => {
              setAdmMemb(v);
              if (v === "Intact") setAdmLiquor(null);
              autoAdvance();
            }}
            options={["Intact","SROM","AROM"]} />
        )}

        {qId === "liquor" && (
          <div className="space-y-2">
            <PillRow value={admLiquor} onChange={v => { setAdmLiquor(v); autoAdvance(); }}
              options={["Clear","Thin meconium","Thick meconium"]}
              labelFn={o => LIQUOR_LABEL[o]} />
            <PillRow value={admLiquor} onChange={v => { setAdmLiquor(v); autoAdvance(); }}
              options={["Blood-stained","Absent"]}
              labelFn={o => LIQUOR_LABEL[o]} />
          </div>
        )}

        {qId === "iolStart" && (
          <div>
            <p className="text-[10px] text-gray-400 mb-3 text-center">{IOL_START_HINT[indMethod]}</p>
            <NowField compact value={iolStartTime} daysAgo={iolDaysAgo}
              onChange={(t, d) => { setIolStartTime(t); setIolDaysAgo(d); setSkipIolStart(false); }} />
          </div>
        )}

        {qId === "admTime" && (
          <NowField compact value={admTime} daysAgo={admDaysAgo}
            onChange={(t, d) => { setAdmT(t); setAdmDaysAgo(d); setSkipAdmTime(false); }} />
        )}

        {qId === "handoverVE" && (
          <div className="space-y-3">
            <PillRow value={handoverVEAnswered ? (hasHandoverVE ? "Yes" : "No") : (hasHandoverVE ? "Yes" : null)}
              onChange={v => onHandoverVE(v === "Yes")}
              options={["No","Yes"]} />
            <p className="text-xs text-gray-400 text-center leading-relaxed">
              No — patient goes on the board with reported stage only.<br />
              Yes — record last known VE findings.
            </p>
            {!handoverVEAnswered && (stage === "Passive second stage" || stage === "Active second stage") && (
              <p className="text-[11px] text-gray-400 text-center">2nd stage — VE usually documented</p>
            )}
          </div>
        )}

        {qId === "veTime" && (
          <NowField compact value={veTime} daysAgo={veDaysAgo}
            onChange={(t, d) => { setVeTime(t); setVeDaysAgo(d); setErr(""); }} />
        )}

        {qId === "indMethod" && (
          <div className="space-y-2">
            <PillRow value={indMethod} onChange={v => { setIndM(v); autoAdvance(); }}
              options={["Dinoprostone","Balloon"]} />
            <PillRow value={indMethod} onChange={v => { setIndM(v); autoAdvance(); }}
              options={["Misoprostol","ARM+Synto"]} />
          </div>
        )}

        {qId === "iolReasons" && (
          <ChipGroup options={IOL_REASONS} selected={iolReasons} onChange={setIolR} />
        )}

        {qId === "dilation" && (
          <div>
            <div className="flex items-end justify-between mb-4">
              {admDilation !== null
                ? <span className="text-4xl font-black text-gray-900 mx-auto">{admDilation} <span className="text-xl text-gray-400">cm</span></span>
                : <span className="text-sm text-gray-400 mx-auto">tap a circle</span>}
            </div>
            <NumberGrid value={admDilation} onChange={d => { setAdmDil(d); setErr(""); autoAdvance(); }} />
          </div>
        )}

        {qId === "veExtras" && (
          <div className="space-y-6">
            <div>
              <SLabel className="mb-3">Station</SLabel>
              <StationStrip value={admStation} onChange={setAdmStn} />
            </div>
            <div>
              <div className="flex items-baseline justify-between mb-3">
                <SLabel>Contractions / 10 min</SLabel>
                <span className="text-xl font-bold text-gray-900">{admContracts}</span>
              </div>
              <Stepper value={admContracts} onChange={setAdmContr} min={0} max={10} />
            </div>
          </div>
        )}

        {err && <p className="text-xs text-red-500 text-center mt-4">{err}</p>}
        </div>
      </div>

      {needsFooter && (
        <div className="px-5 pt-3 border-t border-gray-100 shrink-0 flex gap-3"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1.25rem)" }}>
          {(qId === "iolStart" || qId === "admTime" || qId === "veExtras") && (
            <button type="button"
              onClick={() => {
                if (qId === "iolStart") { setSkipIolStart(true); advance(); }
                else if (qId === "admTime") { setSkipAdmTime(true); advance(); }
                else requestSave();
              }}
              className="px-5 py-4 rounded-2xl text-base font-bold bg-gray-100 text-gray-600 active:scale-95 transition-all">
              Skip
            </button>
          )}
          <button type="button" onClick={footerAction}
            className="flex-1 py-4 rounded-2xl text-base font-bold bg-gray-900 text-white active:scale-95 transition-all">
            {qId === "veExtras" ? "Add to ward" : footerPrimary()}
          </button>
        </div>
      )}

      <p className="text-[10px] text-gray-300 text-center pb-3 shrink-0">
        Bed number only — no patient identifiers stored
      </p>

      {showSummary && (
        <div className="absolute inset-0 z-10 bg-black/40 flex items-end sm:items-center justify-center p-5">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-xl"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1.25rem)" }}>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Confirm admission</p>
            <p className="text-sm font-semibold text-gray-900 leading-relaxed mb-5">{summaryPayload()}</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowSummary(false)}
                className="flex-1 py-3.5 rounded-xl text-sm font-bold bg-gray-100 text-gray-600 active:scale-95">
                Back
              </button>
              <button type="button" onClick={() => { setShowSummary(false); saveAdmission(); }}
                className="flex-1 py-3.5 rounded-xl text-sm font-bold bg-gray-900 text-white active:scale-95">
                Add to ward
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Alert card ───────────────────────────────────────────────────────────

function AlertCard({ alert, onAcknowledge }) {
  const [done, setDone] = useState(false);
  const s = SEV[alert.severity];

  const handleDone = () => {
    setDone(true);
    if (onAcknowledge) setTimeout(() => onAcknowledge(alert.id), 500);
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-4 flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0">
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-sm font-bold text-green-700">Done</p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border ${s.border} ${s.bg} overflow-hidden`}>
      <div className="flex items-stretch">
        <div className={`w-1 shrink-0 ${s.bar}`} />
        <div className="flex-1 flex items-start gap-3 p-4">
          <div className="flex-1">
            <p className={`text-base font-bold ${s.text} leading-snug`}>{alert.title}</p>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">{alert.body}</p>
            <p className={`text-[10px] font-bold uppercase tracking-wide mt-2 ${s.cite}`}>{alert.citation}</p>
          </div>
          {onAcknowledge && (
            <button onClick={handleDone}
              className={`w-8 h-8 rounded-full border-2 ${s.border} flex items-center justify-center shrink-0 mt-0.5 active:scale-95 transition-all`}>
              <svg className={`w-3.5 h-3.5 ${s.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Obs items config helper ──────────────────────────────────────────────

function getObsItems(bed) {
  const isDiabetic     = (bed.riskFlags ?? []).some(f => f.startsWith("Diabetic"));
  const isHypertensive = (bed.riskFlags ?? []).includes("Hypertensive");
  return [
    { key: "lastPulse", vk: "pulseValue",  label: "Pulse", unit: "bpm",     limit: 60,                        type: "int"   },
    { key: "lastBP",    vk: "bpSystolic",  label: "BP",    unit: "mmHg",    limit: isHypertensive ? 60 : 240, type: "bp"    },
    { key: "lastTemp",  vk: "tempValue",   label: "Temp",  unit: "°C",      limit: 240,                       type: "float" },
    ...(isDiabetic ? [{ key: "lastBGL", vk: "bglValue", label: "BGL", unit: "mmol/L", limit: 60, type: "float" }] : []),
  ];
}

// ─── Inline observation row ────────────────────────────────────────────────

function ObsRow({ bed, onUpdate }) {
  const obs = bed.observations ?? {};
  const now = Date.now();
  const items = getObsItems(bed);

  const [valueKey, setValueKey] = useState(null); // which card has the value-entry open
  const [v1, setV1] = useState("");
  const [v2, setV2] = useState("");
  const v1Ref = useRef(null);

  const activeItem = items.find(it => it.key === valueKey);

  useEffect(() => {
    if (valueKey && v1Ref.current) setTimeout(() => v1Ref.current?.focus(), 50);
  }, [valueKey]);

  // Tap the card → mark done immediately (just stamp the time)
  const markDone = (item) => {
    onUpdate({ ...obs, [item.key]: nowISO() });
    if (valueKey === item.key) { setValueKey(null); setV1(""); setV2(""); }
  };

  // Save with optional value
  const saveValue = () => {
    if (!activeItem) return;
    const updates = { ...obs, [activeItem.key]: nowISO() };
    if (activeItem.type === "bp") {
      if (v1) updates.bpSystolic = v1;
      if (v2) updates.bpDiastolic = v2;
    } else if (v1) {
      updates[activeItem.vk] = v1;
    }
    onUpdate(updates);
    setValueKey(null); setV1(""); setV2("");
  };

  const getDisplayVal = (item) => {
    if (item.type === "bp") {
      if (obs.bpSystolic && obs.bpDiastolic) return `${obs.bpSystolic}/${obs.bpDiastolic}`;
      if (obs.bpSystolic) return `${obs.bpSystolic}/—`;
    } else if (obs[item.vk]) {
      return obs[item.vk];
    }
    return null;
  };

  return (
    <div className="space-y-2">
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0,1fr))` }}>
        {items.map((item) => {
          const lastISO  = obs[item.key];
          const ageMin   = lastISO ? (now - new Date(lastISO).getTime()) / 60000 : Infinity;
          const pct      = ageMin / item.limit;
          const st       = !lastISO ? "none" : pct < 0.8 ? "ok" : pct < 1 ? "warn" : "over";
          const displayVal = getDisplayVal(item);

          return (
            <button key={item.key}
              onClick={() => markDone(item)}
              className={`py-4 rounded-2xl border flex flex-col items-center gap-1 active:scale-95 transition-all ${
                st==="ok"   ? "bg-green-50 border-green-200" :
                st==="warn" ? "bg-amber-50 border-amber-200" :
                st==="over" ? "bg-red-50   border-red-200"   :
                "bg-gray-50 border-gray-200"
              }`}>
              <p className={`text-xs font-bold ${
                st==="ok" ? "text-green-700" : st==="warn" ? "text-amber-700" : st==="over" ? "text-red-700" : "text-gray-500"
              }`}>{item.label}</p>
              <p className={`${displayVal ? "text-sm font-semibold" : "text-[11px] font-medium"} ${
                st==="ok" ? "text-green-600" : st==="warn" ? "text-amber-600" : st==="over" ? "text-red-600" : "text-gray-400"
              }`}>
                {displayVal ?? (lastISO ? fmtTime(lastISO) : "—")}
              </p>
            </button>
          );
        })}
      </div>

      {/* Optional value entry */}
      <div className="flex items-center gap-2">
        {valueKey && activeItem ? (
          <>
            {activeItem.type === "bp" ? (
              <>
                <input ref={v1Ref} type="number" inputMode="numeric" placeholder="Sys"
                  value={v1} onChange={e => setV1(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-gray-800 text-center" />
                <span className="text-gray-400 font-bold">/</span>
                <input type="number" inputMode="numeric" placeholder="Dia"
                  value={v2} onChange={e => setV2(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-gray-800 text-center" />
              </>
            ) : (
              <input ref={v1Ref} type="number" inputMode={activeItem.type === "float" ? "decimal" : "numeric"}
                placeholder={`${activeItem.label} (${activeItem.unit})`}
                value={v1} onChange={e => setV1(e.target.value)}
                className="flex-1 border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-gray-800" />
            )}
            <button onClick={saveValue}
              className="w-12 h-10 rounded-xl bg-gray-900 text-white text-base font-bold flex items-center justify-center active:scale-95">✓</button>
            <button onClick={() => { setValueKey(null); setV1(""); setV2(""); }}
              className="w-12 h-10 rounded-xl border border-gray-200 text-gray-400 text-base font-bold flex items-center justify-center active:scale-95">✕</button>
          </>
        ) : (
          <div className="flex gap-2">
            {items.map(item => (
              <button key={item.key}
                onClick={() => { setValueKey(item.key); setV1(""); setV2(""); }}
                className="text-[11px] text-gray-400 font-medium px-2 py-1 rounded-lg border border-gray-100 active:scale-95">
                + {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Obs dots for board view ──────────────────────────────────────────────

function ObsDots({ bed, now }) {
  const obs   = bed.observations ?? {};
  const items = getObsItems(bed);

  return (
    <div className="flex gap-1.5 mt-2 flex-wrap">
      {items.map(item => {
        const lastISO = obs[item.key];
        const ageMin  = lastISO ? (now - new Date(lastISO).getTime()) / 60000 : Infinity;
        const pct     = ageMin / item.limit;
        const dotCls  = !lastISO ? "bg-gray-300" : pct < 0.8 ? "bg-green-400" : pct < 1 ? "bg-amber-400" : "bg-red-500";
        const letter  = item.label[0];
        return (
          <div key={item.key} className="flex items-center gap-0.5">
            <div className={`w-2.5 h-2.5 rounded-full ${dotCls}`} />
            <span className="text-[10px] text-gray-400 font-semibold">{letter}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Per-patient task list ────────────────────────────────────────────────

function TasksTab({ bed, onUpdate }) {
  const tasks   = bed.tasks ?? [];
  const pending = tasks.filter(t => !t.done);
  const done    = tasks.filter(t => t.done);
  const [text, setText] = useState("");

  const addTask = raw => {
    const label = raw.trim();
    if (!label) return;
    const task = { id: `task-${Date.now()}`, text: label, done: false, createdAt: nowISO() };
    onUpdate({ tasks: [...tasks, task] });
    setText("");
  };

  const toggle = id =>
    onUpdate({ tasks: tasks.map(t => t.id === id ? { ...t, done: !t.done } : t) });

  return (
    <div className="px-5 pt-4 pb-8 space-y-5">
      {/* Quick-add chips */}
      <div>
        <SLabel className="mb-2">Quick add</SLabel>
        <div className="flex flex-wrap gap-2">
          {TASK_QUICK.map(label => (
            <button key={label} onClick={() => addTask(label)}
              className="px-3 py-1.5 rounded-full bg-gray-100 text-xs font-semibold text-gray-700 active:scale-95 transition-all">
              + {label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom input */}
      <div className="flex gap-2">
        <input type="text" value={text} onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addTask(text)}
          placeholder="Custom task…"
          className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-gray-400 bg-white" />
        <button onClick={() => addTask(text)} disabled={!text.trim()}
          className="px-4 py-3 rounded-2xl bg-gray-900 text-white text-sm font-bold disabled:opacity-30 active:scale-95 transition-all">
          Add
        </button>
      </div>

      {/* Task list */}
      {tasks.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">No tasks — use quick-add or type above</p>
      ) : (
        <div className="space-y-2">
          {pending.map(task => (
            <div key={task.id} className="flex items-center gap-3 rounded-2xl bg-white border border-gray-100 shadow-sm px-4 py-3">
              <button onClick={() => toggle(task.id)}
                className="w-6 h-6 rounded-full border-2 border-gray-300 shrink-0 active:scale-95 transition-all" />
              <p className="text-sm text-gray-900 flex-1 leading-snug">{task.text}</p>
            </div>
          ))}
          {done.map(task => (
            <div key={task.id} className="flex items-center gap-3 rounded-2xl bg-gray-50 border border-gray-100 px-4 py-3">
              <button onClick={() => toggle(task.id)}
                className="w-6 h-6 rounded-full bg-green-500 border-2 border-green-500 flex items-center justify-center shrink-0 active:scale-95 transition-all">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <p className="text-sm text-gray-400 flex-1 leading-snug line-through">{task.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Bed detail view — inner tabs ─────────────────────────────────────────

function BedDetailView({ bed, alerts, onBack, onUpdate, onDelete, onOpenVE, onEditVE, onOpenOxy, onOpenDelivery, onOpenCTG, onEditCTG, onDeleteCTG }) {
  const PERSISTENT_FLAGS = {
    "gbs-iap":          "gbsAntibioticsStarted",
    "preterm-neonatal": "neonatalTeamAlerted",
    "preterm-mgso4":    "mgso4Given",
    "preterm-steroids": "corticosteroidsConfirmed",
    "preterm-tocolysis":"tocolysisOffered",
  };
  const OBS_STAMP = {
    "pulse-never": "lastPulse", "pulse-due": "lastPulse",
    "bp-never":    "lastBP",    "bp-due":    "lastBP",
    "temp-never":  "lastTemp",  "temp-due":  "lastTemp",
    "bgl-never":   "lastBGL",   "bgl-due":   "lastBGL",
  };
  const ackAlert = id => {
    if (PERSISTENT_FLAGS[id]) {
      onUpdate({ [PERSISTENT_FLAGS[id]]: true });
    } else if (OBS_STAMP[id]) {
      onUpdate({ observations: { ...bed.observations, [OBS_STAMP[id]]: nowISO() } });
    }
  };

  const status   = bedStatusColor(alerts);
  const sc       = STATUS[status];
  const currentOx= bed.oxytocinLog?.[bed.oxytocinLog.length - 1];
  const [now, setNow]             = useState(Date.now());
  const [urineVal, setUrineVal]   = useState(String(bed.observations?.urineOutput ?? ""));
  const [innerTab, setInnerTab]   = useState("overview"); // overview | ves | obs
  const [confirmDischarge, setConfirmDischarge] = useState(false);

  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 30000); return () => clearInterval(id); }, []);

  const urgentCount = alerts.filter(a => a.severity === "urgent").length;

  const setStage = s => {
    const order = ["Latent", "Active first stage", "Passive second stage", "Active second stage"];
    const curIdx = order.indexOf(bed.labourStage);
    const newIdx = order.indexOf(s);
    if (curIdx > newIdx && !window.confirm(`Change stage back to "${s}"?\n\nExisting timers are kept — only the stage label changes.`)) return;
    const u = { labourStage: s };
    if (s === "Active first stage"   && !bed.activeFirstStageStartTime) u.activeFirstStageStartTime = nowISO();
    if (s === "Passive second stage" && !bed.passiveStartTime)          u.passiveStartTime          = nowISO();
    if (s === "Active second stage"  && !bed.pushingStartTime)          u.pushingStartTime          = nowISO();
    onUpdate(u);
  };

  const saveUrine = () => {
    if (!urineVal) return;
    onUpdate({ observations: { ...bed.observations, urineOutput: parseFloat(urineVal), lastUrineCheck: nowISO() } });
  };

  return (
    <div className="min-h-screen bg-white pb-36">
      <div className="max-w-lg mx-auto">

        {/* Sticky header + tab bar */}
        <div className="sticky top-0 z-20 bg-white">
          {/* Header */}
          <div className="px-5 pb-3 border-b border-gray-100" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.75rem)' }}>
            <div className="flex items-start gap-3">
              <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-2xl font-bold text-gray-900">Bed {bed.bedNumber}</h2>
                  <span className={`w-2.5 h-2.5 rounded-full ${sc.dot}`} />
                  {urgentCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white">{urgentCount} urgent</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{bed.parity} · {bed.gestation} · admitted {fmtTime(bed.admissionTime)}</p>
                {bed.riskFlags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {bed.riskFlags.map(f => <span key={f} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs font-semibold text-gray-600">{f}</span>)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Inner tab bar */}
          <div className="flex border-b border-gray-100">
            {[
              { key: "overview", label: "Overview" },
              { key: "ves",      label: "VEs" },
              { key: "obs",      label: "Obs" },
              { key: "ctg",      label: "CTG" },
              { key: "tasks",    label: "Tasks" },
            ].map(tab => {
              const lastCTG = tab.key === "ctg" ? bed.ctgLog?.[bed.ctgLog.length - 1] : null;
              const pendingTaskCount = tab.key === "tasks" ? (bed.tasks ?? []).filter(t => !t.done).length : 0;
              return (
                <button key={tab.key} onClick={() => setInnerTab(tab.key)}
                  className={`flex-1 py-3 text-sm font-semibold relative transition-colors ${innerTab === tab.key ? "text-gray-900 border-b-2 border-gray-900" : "text-gray-400"}`}>
                  {tab.label}
                  {tab.key === "overview" && urgentCount > 0 && (
                    <span className="absolute top-2 right-3 w-2 h-2 rounded-full bg-red-500" />
                  )}
                  {lastCTG?.classification === "pathological" && (
                    <span className="absolute top-2 right-1 w-2 h-2 rounded-full bg-red-500" />
                  )}
                  {lastCTG?.classification === "suspicious" && (
                    <span className="absolute top-2 right-1 w-2 h-2 rounded-full bg-amber-400" />
                  )}
                  {tab.key === "tasks" && pendingTaskCount > 0 && (
                    <span className="absolute top-1.5 right-1 min-w-[16px] h-4 px-1 rounded-full bg-blue-500 text-white text-[9px] font-black flex items-center justify-center leading-none">
                      {pendingTaskCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Overview tab */}
        {innerTab === "overview" && (
          <div className="px-5 pt-4 space-y-5 pb-24">
            {/* Alerts */}
            {alerts.length > 0 ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-black uppercase tracking-widest text-gray-500">Alerts</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    alerts.some(a => a.severity === "urgent") ? "bg-red-500 text-white" : "bg-amber-400 text-white"
                  }`}>{alerts.length}</span>
                </div>
                <div className="space-y-2">
                  {alerts.map(a => (
                    <AlertCard key={a.id} alert={a}
                      onAcknowledge={(PERSISTENT_FLAGS[a.id] || OBS_STAMP[a.id]) ? ackAlert : undefined} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-green-50 border border-green-200 p-4">
                <p className="text-sm font-bold text-green-700">All clear</p>
                <p className="text-xs text-green-600 mt-0.5">No active alerts.</p>
              </div>
            )}

            {/* Stage — hidden post-delivery (P4-22) */}
            {!bed.delivery && (
              <div>
                <SLabel className="mb-2">Labour stage — NICE NG235 §1.1</SLabel>
                <div className="grid grid-cols-2 gap-2">
                  {STAGES.map(s => {
                    const active = bed.labourStage === s;
                    const sub =
                      s === "Active second stage"  && bed.pushingStartTime  ? `Pushing: ${fmtAge(now - new Date(bed.pushingStartTime).getTime())}` :
                      s === "Passive second stage" && bed.passiveStartTime  ? `Passive: ${fmtAge(now - new Date(bed.passiveStartTime).getTime())}` :
                      STAGE_SUB[s];
                    return (
                      <button key={s} onClick={() => setStage(s)}
                        className={`py-3.5 px-3 rounded-2xl border text-left transition-colors active:scale-95 ${active ? "bg-gray-900 border-gray-900" : "bg-white border-gray-200"}`}>
                        <p className={`text-xs font-bold leading-snug ${active ? "text-white" : "text-gray-800"}`}>{s}</p>
                        <p className={`text-[10px] mt-0.5 leading-tight ${active ? "text-gray-400" : "text-gray-400"}`}>{sub}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Analgesia */}
            <div>
              <SLabel className="mb-2">Analgesia</SLabel>
              <div className="space-y-2">
                <PillRow value={bed.analgesia} onChange={a => onUpdate({ analgesia: a })} options={["None","Entonox","Pethidine"]} />
                <PillRow value={bed.analgesia} onChange={a => onUpdate({ analgesia: a })} options={["Epidural","Remifentanil PCA"]} />
              </div>
            </div>

            {/* IOL details — only when induced */}
            {bed.modeOfOnset === "Induced" && (
              <div>
                <SLabel className="mb-2">Induction</SLabel>
                <div className="rounded-2xl border border-gray-100 bg-white p-4 space-y-3">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1.5">Method</p>
                    <div className="space-y-2">
                      <PillRow value={bed.inductionMethod} onChange={v => onUpdate({ inductionMethod: v })}
                        options={["Dinoprostone","Balloon"]} />
                      <PillRow value={bed.inductionMethod} onChange={v => onUpdate({ inductionMethod: v })}
                        options={["Misoprostol","ARM+Synto"]} />
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1.5">Indication</p>
                    <ChipGroup options={IOL_REASONS}
                      selected={bed.iolReasons ?? []}
                      onChange={v => onUpdate({ iolReasons: v })} />
                    {(bed.iolReasons?.length ?? 0) === 0 && (
                      <p className="text-xs text-gray-400 mt-1.5">None recorded — tap to add</p>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1.5">IOL started</p>
                    <p className="text-[10px] text-gray-400 mb-2">{IOL_START_HINT[bed.inductionMethod] ?? "When IOL began"}</p>
                    <NowField
                      value={bed.inductionStartTime ? fmtTime(bed.inductionStartTime) : ""}
                      daysAgo={isoToTimeFields(bed.inductionStartTime).daysAgo}
                      onChange={(t, d) => onUpdate({ inductionStartTime: t ? timeToISO(t, d) : null })}
                    />
                    {bed.inductionStartTime && (
                      <p className="text-[11px] text-gray-400 mt-1.5">
                        {fmtAge(Date.now() - new Date(bed.inductionStartTime).getTime())} ago
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Delivery status */}
            <div>
              {bed.delivery ? (
                <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-bold text-green-800">Delivered {fmtTime(bed.delivery.time)}</p>
                    <button onClick={onOpenDelivery}
                      className="text-xs font-semibold text-green-600 px-2 py-0.5 rounded-lg border border-green-200 bg-white">
                      Edit
                    </button>
                  </div>
                  <p className="text-xs text-green-700">{bed.delivery.mode}{bed.delivery.ebl != null ? ` · EBL ${bed.delivery.ebl} mL` : ""}</p>
                  {bed.delivery.ebl >= 1000 && (
                    <p className="text-xs font-bold text-red-600 mt-1">Major PPH ≥ 1000 mL</p>
                  )}
                  {bed.delivery.notes && (
                    <p className="text-xs text-green-600 mt-1 italic">{bed.delivery.notes}</p>
                  )}
                </div>
              ) : (
                <button onClick={onOpenDelivery}
                  className="w-full py-4 rounded-2xl bg-green-700 text-white font-bold text-base active:scale-95 transition-all">
                  Mark Delivered
                </button>
              )}
            </div>

            {/* Discharge — 2-step confirm to prevent accidental deletion */}
            <div className="space-y-2 pt-2">
              {!confirmDischarge ? (
                <button onClick={() => setConfirmDischarge(true)}
                  className="w-full border border-red-200 text-red-500 font-medium py-3 rounded-2xl text-sm active:bg-red-50">
                  Discharge / Remove bed
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-center text-red-500 font-semibold">This will permanently remove Bed {bed.bedNumber}. Are you sure?</p>
                  <div className="flex gap-2">
                    <button onClick={onDelete}
                      className="flex-1 py-3 rounded-2xl bg-red-500 text-white text-sm font-bold active:bg-red-600">
                      Yes, discharge
                    </button>
                    <button onClick={() => setConfirmDischarge(false)}
                      className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-600 text-sm font-medium active:bg-gray-50">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              <p className="text-[10px] text-gray-300 text-center leading-relaxed pb-2">
                NICE NG235 (Sept 2023) · GL983 · GL787 · Not a substitute for clinical judgement
              </p>
            </div>
          </div>
        )}

        {/* VEs tab */}
        {innerTab === "ves" && (
          <div className="px-5 pt-4 pb-8 space-y-4">
            <button onClick={onOpenVE}
              className="w-full py-4 rounded-2xl text-base font-bold bg-gray-900 text-white active:scale-95 transition-all">
              Record VE
            </button>

            {!bed.ves?.length
              ? <p className="text-sm text-gray-400 text-center py-8">No VEs recorded yet</p>
              : (
                <div className="rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm">
                  {[...bed.ves].reverse().map((ve, i) => (
                    <div key={ve.id} className={`px-4 py-3 ${i > 0 ? "border-t border-gray-50" : ""}`}>
                      <div className="flex items-baseline justify-between">
                        <p className="text-2xl font-bold text-gray-900">{ve.dilation} cm</p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-gray-400">{fmtTime(ve.time)}</p>
                          <button onClick={() => onEditVE(ve)}
                            className="text-xs font-semibold text-gray-500 px-2 py-0.5 rounded-lg border border-gray-200 bg-white active:bg-gray-50">
                            Edit
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Station {ve.station > 0 ? `+${ve.station}` : ve.station} · {ve.membranes}
                        {ve.membranesTime ? ` at ${fmtTime(ve.membranesTime)}` : ""} · {ve.contractions}/10 min
                        {ve.liquor && ve.liquor !== "Clear" ? ` · ${LIQUOR_LABEL[ve.liquor] ?? ve.liquor}` : ""}
                      </p>
                    </div>
                  ))}
                </div>
              )
            }

            <p className="text-[10px] text-gray-300 text-center">NICE NG235 §1.4.1 — 4-hourly VE in active labour</p>
          </div>
        )}

        {/* CTG tab */}
        {innerTab === "ctg" && (
          <div className="px-5 pt-4 pb-8 space-y-4">
            <button onClick={onOpenCTG}
              className="w-full py-4 rounded-2xl text-base font-bold bg-gray-900 text-white active:scale-95 transition-all">
              Log CTG Review
            </button>

            {!bed.ctgLog?.length
              ? <p className="text-sm text-gray-400 text-center py-8">No CTG entries recorded</p>
              : (
                <div className="rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm">
                  {[...bed.ctgLog].reverse().map((entry, i) => {
                    const cs = CTG_CLASS_STYLE[entry.classification];
                    return (
                      <div key={entry.id} className={`px-4 py-3 ${i > 0 ? "border-t border-gray-50" : ""}`}>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-bold text-gray-900">{fmtTime(entry.time)}</p>
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${cs.border} ${cs.bg} ${cs.text} capitalize`}>
                              {entry.classification}
                            </span>
                            <button onClick={() => onEditCTG(entry)}
                              className="text-xs font-semibold text-gray-500 px-2 py-0.5 rounded-lg border border-gray-200 bg-white active:bg-gray-50">
                              Edit
                            </button>
                            <button onClick={() => { if (window.confirm("Delete this CTG entry?")) onDeleteCTG(entry.id); }}
                              className="text-xs text-gray-400 px-2 py-0.5 rounded-lg border border-gray-200 bg-white active:bg-gray-50">
                              ✕
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">{ctgEntryLabel(entry)}</p>
                      </div>
                    );
                  })}
                </div>
              )
            }
            <p className="text-[10px] text-gray-300 text-center">NICE NG229 — Fetal Monitoring in Labour [Dec 2022]</p>
          </div>
        )}

        {/* Obs tab */}
        {innerTab === "obs" && (
          <div className="px-5 pt-4 pb-8 space-y-5">
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Pulse hourly · BP {(bed.riskFlags ?? []).includes("Hypertensive") ? "hourly (hypertensive)" : "4-hourly"} · Temp 4-hourly
              {(bed.riskFlags ?? []).some(f => f.startsWith("Diabetic")) ? " · BGL hourly" : ""}
              {" · "}Tap each to record time; use + buttons to enter values.
            </p>
            <ObsRow bed={bed} onUpdate={obs => onUpdate({ observations: { ...bed.observations, ...obs } })} />

            {/* Urine output */}
            <div>
              <SLabel className="mb-2">Urine output</SLabel>
              <div className="flex gap-2">
                <input type="number" inputMode="numeric" value={urineVal}
                  onChange={e => setUrineVal(e.target.value)} placeholder="mL/hr"
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-gray-400" />
                <button onClick={saveUrine} className="px-4 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-bold">Set</button>
              </div>
              {bed.observations?.urineOutput !== undefined && bed.observations.urineOutput < 30 && (
                <p className="text-xs font-bold text-red-600 mt-1">Oliguria {bed.observations.urineOutput} mL/hr — escalate · NG235 §1.4.5</p>
              )}
            </div>

            {/* Oxytocin */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <SLabel>Oxytocin — NG235 §1.5.6 [30-min increments]</SLabel>
                <button onClick={onOpenOxy} className="px-3 py-1.5 rounded-full bg-gray-900 text-white text-xs font-bold">+ Log</button>
              </div>
              {!currentOx
                ? <button onClick={onOpenOxy} className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-200 text-sm text-gray-400 font-medium">
                    Tap to start oxytocin log
                  </button>
                : <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-4">
                    <div className="flex items-baseline justify-between">
                      <p className={`text-xl font-bold ${currentOx.dose >= 20 ? "text-red-600" : "text-gray-900"}`}>{currentOx.dose} mU/min</p>
                      <p className="text-xs text-gray-400">since {fmtTime(currentOx.startTime)}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Last increment: {fmtTime(currentOx.lastIncrementTime)} · {fmtAge(now - new Date(currentOx.lastIncrementTime).getTime())} ago
                    </p>
                  </div>
              }
            </div>
          </div>
        )}

        {/* Tasks tab */}
        {innerTab === "tasks" && (
          <TasksTab bed={bed} onUpdate={onUpdate} />
        )}
      </div>

    </div>
  );
}

// ─── Handover generator ───────────────────────────────────────────────────

function generateHandover(beds, alertsMap, shift) {
  const now = new Date();
  const dd   = String(now.getDate()).padStart(2, "0");
  const mm   = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();
  const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const bedList = Object.values(beds).sort((a, b) =>
    a.bedNumber.localeCompare(b.bedNumber, undefined, { numeric: true })
  );

  const parShort = p =>
    ({ "Para 0": "P0", "Para 1": "P1", "Para 2+": "P2+" }[p] ?? p ?? "?");

  const stageShort = s =>
    ({
      "Latent":               "Latent",
      "Active first stage":   "Active 1st",
      "Passive second stage": "Passive 2nd",
      "Active second stage":  "Active 2nd",
    }[s] ?? s ?? "—");

  const isGestPreterm = g => {
    if (!g) return false;
    const plus = g.match(/^(\d+)\+(\d)$/);
    if (plus) return parseInt(plus[1]) < 37;
    const w = g.match(/^(\d+)w$/);
    if (w) return parseInt(w[1]) < 37;
    return false;
  };

  const DIV = "─".repeat(38);
  const heading = shift
    ? `DR. ${shift.doctorName.toUpperCase()} — ${shift.shiftType.toUpperCase()} SHIFT`
    : `LABOUR WARD HANDOVER`;
  const lines = [heading, `${dd}/${mm}/${yyyy}  ${hhmm}`, ""];

  if (bedList.length === 0) {
    lines.push("No patients on board.");
  } else {
    bedList.forEach(bed => {
      lines.push(DIV);

      const isDelivered = !!bed.delivery;
      const ptTag = isGestPreterm(bed.gestation) ? " [PRETERM]" : "";

      lines.push(
        `BED ${bed.bedNumber}  ${parShort(bed.parity)}  ${bed.gestation ?? "?"}${ptTag}  ${
          isDelivered ? "Delivered" : stageShort(bed.labourStage)
        }`
      );

      if (isDelivered) {
        const d = bed.delivery;
        const pphTag = d.ebl >= 1000 ? " ⚠ Major PPH" : d.ebl >= 500 ? " (PPH ≥500)" : "";
        lines.push(
          `${d.mode} · ${fmtTime(d.time)}${d.ebl != null ? ` · EBL ${d.ebl} mL${pphTag}` : ""}`
        );
        const ptFlags = [
          bed.neonatalTeamAlerted     && "Neonatal ✓",
          bed.corticosteroidsConfirmed && "Steroids ✓",
          bed.mgso4Given               && "MgSO4 ✓",
        ].filter(Boolean);
        if (ptFlags.length) lines.push(ptFlags.join(" · "));
        if (d.notes) lines.push(`Notes: ${d.notes}`);
      } else {
        const lastVE = bed.ves?.length ? [...bed.ves].sort((a,b) => new Date(a.time)-new Date(b.time)).at(-1) : null;
        if (lastVE) {
          const ago = fmtAge(Date.now() - new Date(lastVE.time).getTime());
          const stn = lastVE.station > 0 ? `+${lastVE.station}` : `${lastVE.station}`;
          const cx  = lastVE.contractions != null ? ` · ${lastVE.contractions}cx/10` : "";
          lines.push(`VE: ${lastVE.dilation}cm / ${stn} / ${lastVE.presentation ?? "Ceph"} (${ago} ago)${cx}`);
        } else {
          lines.push("VE: none recorded");
        }

        const obs = bed.observations ?? {};
        const obsParts = [
          obs.bpSystolic && obs.bpDiastolic && `BP ${obs.bpSystolic}/${obs.bpDiastolic}`,
          obs.pulseValue  && `P${obs.pulseValue}`,
          obs.tempValue   && `T${obs.tempValue}°C`,
          obs.bglValue    && `BGL ${obs.bglValue}`,
          bed.analgesia && bed.analgesia !== "None" && bed.analgesia,
        ].filter(Boolean);
        if (obsParts.length) lines.push(obsParts.join(" | "));

        const flagParts = [
          ...(bed.riskFlags ?? []),
          bed.gbsAntibioticsStarted  && "IAP ✓",
          bed.tocolysisOffered        && "Tocolysis offered ✓",
        ].filter(Boolean);
        if (flagParts.length) lines.push(flagParts.join(" · "));

        const activeAlerts = (alertsMap[bed.id] ?? []).filter(
          a => a.severity === "urgent" || a.severity === "warning"
        );
        activeAlerts.forEach(a =>
          lines.push(`${a.severity === "urgent" ? "⚠⚠" : "⚠"} ${a.title}`)
        );
      }

      lines.push("");
    });
  }

  if (shift?.shiftStart && shift?.shiftEnd) {
    const start = new Date(shift.shiftStart);
    const end   = new Date(shift.shiftEnd);
    const fmtT  = d => `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
    lines.push(DIV);
    lines.push(`Shift: ${fmtT(start)} → ${fmtT(end)}`);
  }
  lines.push(DIV);
  lines.push("PocketSuite · Not a substitute for clinical judgement");
  return lines.join("\n");
}

function HandoverSheet({ beds, alertsMap, shift }) {
  const text = useMemo(() => generateHandover(beds, alertsMap, shift), [beds, alertsMap, shift]);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(text)
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); })
      .catch(() => {});
  };

  const share = () => {
    if (navigator.share) navigator.share({ title: "Labour Ward Handover", text });
  };

  return (
    <>
      <div className="px-5 pt-4 pb-3 flex gap-2 shrink-0">
        <button onClick={copy}
          className={`flex-1 py-3.5 rounded-2xl text-sm font-bold transition-colors active:scale-95 ${copied ? "bg-green-600 text-white" : "bg-gray-900 text-white"}`}>
          {copied ? "Copied ✓" : "Copy"}
        </button>
        {typeof navigator !== "undefined" && navigator.share && (
          <button onClick={share}
            className="px-5 py-3.5 rounded-2xl text-sm font-bold border border-gray-200 text-gray-700 active:scale-95 transition-all">
            Share
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-8 min-h-0">
        <pre className="text-xs text-gray-700 font-mono leading-relaxed whitespace-pre-wrap break-words bg-gray-50 rounded-2xl p-4 border border-gray-100">
          {text}
        </pre>
      </div>
    </>
  );
}

// ─── Board view ───────────────────────────────────────────────────────────

function useCountdown(shiftEnd) {
  const [msLeft, setMsLeft] = useState(() => shiftEnd ? new Date(shiftEnd) - Date.now() : null);
  useEffect(() => {
    if (!shiftEnd) return;
    const id = setInterval(() => setMsLeft(new Date(shiftEnd) - Date.now()), 30000);
    return () => clearInterval(id);
  }, [shiftEnd]);
  return msLeft;
}

function formatCountdown(ms) {
  if (ms == null || ms <= 0) return "0m";
  const totalMin = Math.floor(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

// ─── Tasks view ───────────────────────────────────────────────────────────────

const TASK_LEVELS = [
  { key: "urgent",  label: "Urgent",  dotCls: "bg-red-500",   barCls: "bg-red-400",   hdrCls: "text-red-600",   bdgCls: "bg-red-500 text-white",   divCls: "border-red-100",  cardCls: "border-red-100 bg-red-50"   },
  { key: "warning", label: "Warning", dotCls: "bg-amber-400", barCls: "bg-amber-400", hdrCls: "text-amber-600", bdgCls: "bg-amber-400 text-white", divCls: "border-amber-100", cardCls: "border-amber-100 bg-amber-50" },
  { key: "info",    label: "Routine", dotCls: "bg-blue-400",  barCls: "bg-blue-300",  hdrCls: "text-blue-500",  bdgCls: "bg-blue-100 text-blue-600", divCls: "border-blue-100",  cardCls: "border-blue-100 bg-blue-50"  },
];

function TasksView({ beds, alertsMap, onSelect, onUpdateBed }) {
  const bedList = Object.values(beds).sort((a, b) =>
    a.bedNumber.localeCompare(b.bedNumber, undefined, { numeric: true })
  );

  const manualPending = bedList.flatMap(bed =>
    (bed.tasks ?? []).filter(t => !t.done).map(t => ({ task: t, bed }))
  );
  const manualDone = bedList.flatMap(bed =>
    (bed.tasks ?? []).filter(t => t.done).map(t => ({ task: t, bed }))
  );
  const allManual = [...manualPending, ...manualDone];

  const toggleTask = (bed, taskId) => {
    const newTasks = (bed.tasks ?? []).map(t => t.id === taskId ? { ...t, done: !t.done } : t);
    onUpdateBed(bed.id, { tasks: newTasks });
  };

  const allAlerts = Object.entries(alertsMap).flatMap(([bedId, alerts]) => {
    const bed = beds[bedId];
    if (!bed || bed.delivery) return [];
    return alerts.map(a => ({ ...a, bed }));
  });

  const hasAnything = allManual.length > 0 || allAlerts.length > 0;

  if (!hasAnything) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-gray-900 font-bold text-lg">All clear</p>
        <p className="text-gray-400 text-sm mt-1">No pending tasks across the ward</p>
      </div>
    );
  }

  return (
    <div className="px-5 pb-8 pt-1 space-y-5">
      {/* Manual tasks */}
      {allManual.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2 px-1">
            <span className="text-[11px] font-black uppercase tracking-widest text-gray-500">Tasks</span>
            {manualPending.length > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500 text-white">{manualPending.length}</span>
            )}
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
            {allManual.map(({ task, bed }, i) => (
              <div key={`${bed.id}-${task.id}`}
                className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? "border-t border-gray-50" : ""}`}>
                <button onClick={() => toggleTask(bed, task.id)}
                  className={`w-6 h-6 rounded-full border-2 shrink-0 active:scale-95 transition-all flex items-center justify-center ${
                    task.done ? "bg-green-500 border-green-500" : "border-gray-300"
                  }`}>
                  {task.done && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-snug ${task.done ? "line-through text-gray-400" : "text-gray-900"}`}>
                    {task.text}
                  </p>
                </div>
                <button onClick={() => onSelect(bed.id)}
                  className="text-[10px] font-bold bg-gray-100 text-gray-600 rounded-md px-1.5 py-0.5 shrink-0">
                  Bed {bed.bedNumber}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clinical alerts */}
      {TASK_LEVELS.map(lv => {
        const tasks = allAlerts.filter(t => t.severity === lv.key);
        if (!tasks.length) return null;
        return (
          <div key={lv.key}>
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className={`text-[11px] font-black uppercase tracking-widest ${lv.hdrCls}`}>{lv.label}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${lv.bdgCls}`}>{tasks.length}</span>
            </div>
            <div className={`rounded-2xl border ${lv.cardCls} overflow-hidden`}>
              {tasks.map((task, i) => (
                <button key={`${task.bed.id}-${task.id}`}
                  onClick={() => onSelect(task.bed.id)}
                  className={`w-full flex items-stretch text-left transition-colors active:bg-black/5 ${i > 0 ? `border-t ${lv.divCls}` : ""}`}>
                  <div className={`w-1 shrink-0 ${lv.barCls}`} />
                  <div className="flex-1 px-4 py-3 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-[10px] font-bold bg-white border border-gray-200 text-gray-600 rounded-md px-1.5 py-0.5 shrink-0">
                        Bed {task.bed.bedNumber}
                      </span>
                      <p className="text-sm font-bold text-gray-900 leading-snug">{task.title}</p>
                    </div>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mt-0.5">{task.citation}</p>
                  </div>
                  <div className="flex items-center pr-4 pl-2 shrink-0">
                    <svg className="w-3.5 h-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── IOL Wizard UI ────────────────────────────────────────────────────────

function IOLAddSheet({ onSave, initialValues = null }) {
  const [initials, setInit]    = useState(initialValues?.initials    ?? "");
  const [gestWeeks, setGestW]  = useState(initialValues?.gestWeeks   ?? 40);
  const [gestDays,  setGestD]  = useState(initialValues?.gestDays    ?? 0);
  const [indications, setInds] = useState(initialValues?.indications ?? []);
  const [queueTime, setQTime]  = useState(
    initialValues?.addedAt ? fmtTime(initialValues.addedAt) : timeInputNow()
  );
  const [queueDaysAgo, setQueueDaysAgo] = useState(
    initialValues?.addedAt ? isoToTimeFields(initialValues.addedAt).daysAgo : 0
  );

  const isEdit = !!initialValues;

  const toggle = ind =>
    setInds(prev => prev.includes(ind) ? prev.filter(x => x !== ind) : [...prev, ind]);

  const save = () => {
    if (!initials.trim() || !indications.length) return;
    onSave({
      id:         initialValues?.id ?? `iol-${Date.now()}`,
      addedAt:    timeToISO(queueTime, queueDaysAgo),
      initials:   initials.trim().toUpperCase(),
      gestWeeks, gestDays, indications,
    });
  };

  const canSave = initials.trim().length > 0 && indications.length > 0;

  const tierGroups = [0,1,2,3].map(tier => ({
    tier,
    meta: IOL_TIER_META[tier],
    items: IOL_IND.filter(i => i.tier === tier),
  }));

  const adjWeeks = d => setGestW(w => Math.max(24, Math.min(42, w + d)));
  const adjDays  = d => {
    let nd = gestDays + d, nw = gestWeeks;
    if (nd > 6) { nd = 0; nw = Math.min(42, nw + 1); }
    if (nd < 0) { nd = 6; nw = Math.max(24, nw - 1); }
    setGestW(nw); setGestD(nd);
  };
  const btnSm = "w-9 h-9 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold flex items-center justify-center active:scale-95 shrink-0";

  return (
    <>
      <div className="overflow-y-auto overscroll-contain flex-1 min-h-0">
        <div className="px-5 pt-3 pb-3 space-y-3">

          {/* Initials */}
          <div>
            <SLabel className="mb-1.5">Initials</SLabel>
            <input
              type="text" maxLength={4} value={initials}
              onChange={e => setInit(e.target.value)}
              placeholder="JB"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xl font-bold text-gray-900 uppercase tracking-widest focus:outline-none focus:border-gray-400 text-center" />
          </div>

          {/* Time queued — full-width row so iOS time picker never clips */}
          <div>
            <SLabel className="mb-1.5">Time queued</SLabel>
            <input
              type="time" value={queueTime}
              onChange={e => setQTime(e.target.value)}
              className="block w-full border border-gray-200 rounded-xl px-3 py-2 text-base text-gray-900 focus:outline-none focus:border-gray-400" />
          </div>

          {/* Compact gestation */}
          <div className="flex items-center gap-2">
            <SLabel className="shrink-0">Gestation</SLabel>
            <div className="flex items-center gap-1 ml-auto">
              <button onClick={() => adjWeeks(-1)} className={btnSm}>−w</button>
              <span className="text-base font-bold text-gray-900 w-12 text-center tabular-nums">{gestWeeks}+{gestDays}</span>
              <button onClick={() => adjWeeks(+1)} className={btnSm}>+w</button>
              <div className="w-px h-5 bg-gray-200 mx-0.5" />
              <button onClick={() => adjDays(-1)} className={btnSm}>−d</button>
              <button onClick={() => adjDays(+1)} className={btnSm}>+d</button>
            </div>
          </div>

          {/* Indications — 2-column grid per tier */}
          <div>
            <SLabel className="mb-2">Indication — select all that apply</SLabel>
            <div className="space-y-2">
              {tierGroups.map(({ tier, meta, items }) => (
                <div key={tier}>
                  <p className={`text-[10px] font-bold uppercase tracking-wide mb-1 ${meta.cls.text}`}>
                    {meta.label}
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {items.map(ind => {
                      const on = indications.includes(ind.label);
                      return (
                        <button key={ind.label} type="button" onClick={() => toggle(ind.label)}
                          className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold text-left leading-tight transition-colors active:scale-95 ${
                            on ? "bg-gray-900 border-gray-900 text-white" : "bg-white border-gray-200 text-gray-600"
                          }`}>
                          {ind.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      <div className="px-5 pt-2.5 border-t border-gray-100 shrink-0"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.75rem)' }}>
        <button onClick={save} disabled={!canSave}
          className={`w-full py-3 rounded-2xl text-base font-bold transition-all active:scale-95 ${
            canSave ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-400"
          }`}>
          {isEdit ? "Save changes" : "Add to queue"}
        </button>
      </div>
    </>
  );
}

function IOLReferenceSheet() {
  const tierGroups = IOL_TIER_META.map((meta, tier) => ({
    tier, meta,
    items: IOL_IND.filter(i => i.tier === tier),
  }));

  const tierDescriptions = [
    "Deliver within hours — escalate immediately",
    "Expedite — aim to start induction today",
    "Plan induction — prioritise within the week",
    "Schedule in usual order",
  ];

  return (
    <div className="px-5 pt-2 pb-6 space-y-4">
      <p className="text-xs text-gray-400 leading-relaxed">
        Priority order based on NICE NG207 (Inducing labour). Within each tier,
        higher gestation is prioritised first, then by longest wait.
      </p>

      {tierGroups.map(({ tier, meta, items }) => (
        <div key={tier} className={`rounded-2xl border ${meta.cls.border} ${meta.cls.bg} p-4`}>
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${meta.cls.badge}`}>
              {meta.label}
            </span>
            <span className={`text-xs font-medium ${meta.cls.text}`}>
              {tierDescriptions[tier]}
            </span>
          </div>
          <div className="space-y-1.5">
            {items.map(ind => (
              <div key={ind.label} className="flex items-baseline justify-between gap-2">
                <span className="text-sm text-gray-800">{ind.label}</span>
                {ind.cite && (
                  <span className="text-[10px] text-gray-400 shrink-0">{ind.cite}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <p className="text-[10px] text-gray-300 text-center leading-relaxed pt-1">
        Not a substitute for clinical judgement
      </p>
    </div>
  );
}

function IOLTab({ queue, onAdd, onAdmit, onRemove, onEdit }) {
  const [showRef, setShowRef] = useState(false);
  const sorted = sortIOLQueue(queue);

  const InfoBtn = () => (
    <button onClick={() => setShowRef(true)}
      className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 text-sm font-bold active:bg-gray-50">
      ⓘ
    </button>
  );

  if (!sorted.length) {
    return (
      <>
        <div className="px-5 pt-12 text-center">
          <p className="text-gray-400 text-sm font-medium mb-6">No women queued for IOL</p>
          <button onClick={onAdd}
            className="px-6 py-3.5 rounded-2xl bg-gray-900 text-white text-sm font-bold active:scale-95 transition-all">
            + Add to queue
          </button>
          <button onClick={() => setShowRef(true)}
            className="block mx-auto mt-5 text-[11px] text-gray-300 underline underline-offset-2">
            View priority reference (NICE NG207)
          </button>
        </div>
        <BottomSheet open={showRef} onClose={() => setShowRef(false)}
          title="IOL Priority Reference" sub="NICE NG207 · Inducing labour">
          <IOLReferenceSheet />
        </BottomSheet>
      </>
    );
  }

  return (
    <>
    <div className="px-5 space-y-3">
      <div className="flex items-center justify-end gap-2 pt-1">
        <InfoBtn />
        <button onClick={onAdd}
          className="px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-bold active:scale-95 transition-all">
          + Add
        </button>
      </div>

      {sorted.map((entry, idx) => {
        const tier = iolEntryTier(entry);
        const meta = IOL_TIER_META[tier];
        const tierActions = ["Deliver within hours — escalate immediately", "Expedite — aim to start today", "Plan — prioritise within the week", "Schedule in usual order"];
        const waitMs = Date.now() - new Date(entry.addedAt).getTime();
        const waitStr = fmtAge(waitMs);
        const indCites = entry.indications.map(l => IOL_IND.find(i => i.label === l)).filter(Boolean);
        const cite = [...new Set(indCites.map(i => i.cite).filter(Boolean))].join(" · ");

        return (
          <div key={entry.id} className={`rounded-2xl border ${meta.cls.border} ${meta.cls.bg} overflow-hidden`}>
            <div className="p-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-gray-300 w-6 shrink-0">#{idx + 1}</span>
                  <span className="text-xl font-bold text-gray-900">{entry.initials}</span>
                  <span className="text-sm font-semibold text-gray-500">{entry.gestWeeks}+{entry.gestDays ?? 0}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${meta.cls.badge}`}>
                    {meta.label}
                  </span>
                </div>
                <span className="text-xs text-gray-400 shrink-0 text-right">
                  <span className="font-semibold text-gray-500">{fmtTime(entry.addedAt)}</span>
                  {" · "}{waitStr} ago
                </span>
              </div>

              <p className={`text-xs font-medium mb-2 ${meta.cls.text}`}>{tierActions[tier]}</p>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {entry.indications.map(ind => (
                  <span key={ind} className="px-2.5 py-1 rounded-full bg-white border border-gray-200 text-xs font-medium text-gray-700">
                    {ind}
                  </span>
                ))}
              </div>

              {cite && (
                <p className="text-[10px] text-gray-400 mb-3">{cite}</p>
              )}

              <div className="flex gap-2">
                <button onClick={() => onAdmit(entry)}
                  className="flex-1 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-bold active:scale-95 transition-all">
                  Admit to ward →
                </button>
                <button onClick={() => onEdit(entry)}
                  className="px-3 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold active:bg-gray-50">
                  Edit
                </button>
                <button onClick={() => onRemove(entry.id)}
                  className="px-3 py-2.5 rounded-xl border border-gray-200 text-gray-400 text-sm font-medium active:bg-gray-50">
                  ✕
                </button>
              </div>
            </div>
          </div>
        );
      })}

      <p className="text-[10px] text-gray-300 text-center pb-4 leading-relaxed">
        Priority order per NICE NG207 · Not a substitute for clinical judgement
      </p>
    </div>

    <BottomSheet open={showRef} onClose={() => setShowRef(false)}
      title="IOL Priority Reference" sub="NICE NG207 · Inducing labour">
      <IOLReferenceSheet />
    </BottomSheet>
    </>
  );
}

function BoardView({ beds, alertsMap, onSelect, onAddBed, onClear, onQuickVE, onQuickCTG, onHandover, onUpdateBed, shift, onEndShift, iolQueue, onIOLAdd, onIOLAdmit, onIOLRemove, onIOLEdit, highlightBedId = null }) {
  const bedList         = Object.values(beds).sort((a,b) => a.bedNumber.localeCompare(b.bedNumber, undefined, {numeric:true}));
  const totalUrgent     = Object.values(alertsMap).flat().filter(a => a.severity === "urgent").length;
  const totalPendingTasks = Object.values(beds).reduce((n, b) => n + (b.tasks ?? []).filter(t => !t.done).length, 0);
  const now          = Date.now();
  const msLeft       = useCountdown(shift?.shiftEnd);
  const nearEnd      = msLeft != null && msLeft > 0 && msLeft <= 30 * 60 * 1000;
  const [boardTab, setBoardTab] = useState("board");
  const overTime     = msLeft != null && msLeft <= 0;

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-lg mx-auto">
        {/* Shift info row */}
        {shift && (
          <div className="px-5 flex items-center justify-between gap-2"
            style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.75rem)' }}>
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-semibold text-gray-500 truncate">
                Dr. {shift.doctorName} · {shift.shiftType === "night" ? "Night" : "Day"}
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                overTime ? "bg-red-100 text-red-600" : nearEnd ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500"
              }`}>
                {overTime ? "Overtime" : formatCountdown(msLeft)}
              </span>
            </div>
            <button onClick={() => { if (window.confirm("End your shift? This will log you out of the board.")) onEndShift(); }}
              className="text-xs font-semibold text-gray-400 px-3 py-1.5 rounded-xl border border-gray-200 active:scale-95 transition-all shrink-0">
              End shift
            </button>
          </div>
        )}

        {/* 30-min warning banner */}
        {nearEnd && (
          <div className="mx-5 mt-3 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2">
            <span className="text-amber-600 text-sm">⏰</span>
            <p className="text-amber-800 text-xs font-semibold">Handover in {formatCountdown(msLeft)} — prepare handover</p>
            <button onClick={onHandover} className="ml-auto text-xs font-bold text-amber-700 underline">Open</button>
          </div>
        )}

        <div className="px-5 pb-3" style={{ paddingTop: shift ? '0.75rem' : 'calc(env(safe-area-inset-top) + 1rem)' }}>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Labour Ward</h2>
          <div className="flex items-center justify-between mt-1 gap-2">
            <p className="text-xs text-gray-400 min-w-0 truncate">
              {bedList.length === 0
                ? "No patients"
                : `${bedList.length} patient${bedList.length !== 1 ? "s" : ""}`}
            </p>
            <div className="flex gap-2 shrink-0">
              {bedList.length > 0 && (
                <button onClick={onHandover}
                  className="px-3 py-1.5 rounded-xl bg-gray-100 text-xs font-semibold text-gray-600">Handover</button>
              )}
              {bedList.length > 0 && (
                <button onClick={() => { if (window.confirm("Clear all beds?")) onClear(); }}
                  className="px-3 py-1.5 rounded-xl bg-gray-100 text-xs font-semibold text-gray-600">Clear</button>
              )}
              <button onClick={onAddBed}
                className="px-3 py-1.5 rounded-xl bg-gray-900 text-white text-xs font-bold active:scale-95 transition-all">
                + Add
              </button>
            </div>
          </div>
        </div>

        {/* Board / Tasks / IOL tab bar — always visible */}
        <div className="px-5 pb-3">
          <div className="flex bg-gray-100 dark:bg-gray-900 rounded-xl p-1 gap-1">
            {[
              { key: "board", label: "Board" },
              { key: "tasks", label: "Tasks" },
              { key: "iol",   label: "IOL" },
            ].map(tab => {
              const isActive = boardTab === tab.key;
              const iolUrgent = iolQueue.filter(e => iolEntryTier(e) <= 1).length;
              return (
                <button key={tab.key} onClick={() => setBoardTab(tab.key)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    isActive ? "bg-white shadow-sm text-gray-900" : "text-gray-500"
                  }`}>
                  {tab.label}
                  {tab.key === "tasks" && totalPendingTasks > 0 && (
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none ${
                      isActive ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-600"
                    }`}>
                      {totalPendingTasks}
                    </span>
                  )}
                  {tab.key === "iol" && iolQueue.length > 0 && (
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none ${
                      iolUrgent > 0
                        ? (isActive ? "bg-red-500 text-white" : "bg-red-100 text-red-600")
                        : (isActive ? "bg-gray-500 text-white" : "bg-gray-200 text-gray-600")
                    }`}>
                      {iolQueue.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {boardTab === "iol" ? (
          <IOLTab queue={iolQueue} onAdd={onIOLAdd} onAdmit={onIOLAdmit} onRemove={onIOLRemove} onEdit={onIOLEdit} />
        ) : boardTab === "tasks" ? (
          <TasksView beds={beds} alertsMap={alertsMap} onSelect={onSelect} onUpdateBed={onUpdateBed} />
        ) : (
        <>

        {bedList.length === 0 && (
          <div className="px-5 mt-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 11h.01M8 11h.01" />
              </svg>
            </div>
            <p className="text-gray-400 text-sm font-medium">Ward is empty</p>
            <button onClick={onAddBed} className="mt-4 px-6 py-3.5 rounded-2xl bg-gray-900 text-white text-sm font-bold">
              Add first patient
            </button>
          </div>
        )}

        <div className="px-5 space-y-3">
          {bedList.map(bed => {
            const alerts      = alertsMap[bed.id] ?? [];
            const status      = bedStatusColor(alerts);
            const sc          = STATUS[status];
            const lastVE      = bed.ves?.length ? [...bed.ves].sort((a,b) => new Date(a.time)-new Date(b.time)).at(-1) : null;
            const urgentN     = alerts.filter(a => a.severity === "urgent").length;
            const isDelivered = !!bed.delivery;
            const currentOxy  = bed.oxytocinLog?.length ? bed.oxytocinLog[bed.oxytocinLog.length - 1] : null;
            const pendingTasks = (bed.tasks ?? []).filter(t => !t.done).length;

            const cardCls = isDelivered
              ? "border-green-200 bg-green-50"
              : sc.card;

            // B — Background
            const bParts = [];
            if (bed.parity)    bParts.push(PAR_SHORT[bed.parity] ?? bed.parity);
            if (bed.gestation) bParts.push(bed.gestation);
            if (bed.modeOfOnset === "Induced") {
              bParts.push(bed.iolReasons?.length ? `Induced (${bed.iolReasons[0]})` : "Induced");
            } else if (bed.modeOfOnset === "PPROM") {
              bParts.push("PPROM");
            } else if (bed.modeOfOnset) {
              bParts.push("Spontaneous");
            }
            const rf = bed.riskFlags ?? [];
            rf.slice(0, 2).forEach(f => bParts.push(f));
            if (rf.length > 2) bParts.push(`+${rf.length - 2} more`);

            // S — Situation
            const veAgeMin   = lastVE ? (now - new Date(lastVE.time).getTime()) / 60000 : null;
            const veAgoStr   = veAgeMin != null ? fmtAge(veAgeMin * 60000) : null;
            const veAgeCls   = veAgeMin == null ? "" : veAgeMin > 240 ? "text-red-500 font-bold" : veAgeMin > 180 ? "text-amber-500 font-semibold" : "text-gray-400";
            const delivSLine = isDelivered ? `${bed.delivery.mode} at ${fmtTime(bed.delivery.time)}` : null;

            // A — Assessment
            const aParts = [];
            if (isDelivered) {
              if (bed.delivery.ebl != null) aParts.push(`EBL ${bed.delivery.ebl} mL`);
            } else {
              if (lastVE?.membranes) {
                if (lastVE.membranes !== "Intact") {
                  aParts.push(`${lastVE.membranes}${lastVE.membranesTime ? ` ${fmtTime(lastVE.membranesTime)}` : ""}`);
                  if (lastVE.liquor) aParts.push(LIQUOR_LABEL[lastVE.liquor] ?? lastVE.liquor);
                } else {
                  aParts.push("Intact");
                }
              }
              if (bed.analgesia && bed.analgesia !== "None") aParts.push(bed.analgesia);
              if (currentOxy) aParts.push(`Oxy ${currentOxy.dose} mU/min`);
            }

            const isHighlighted = bed.id === highlightBedId;

            return (
              <div key={bed.id} className={`rounded-2xl border ${cardCls} overflow-hidden transition-all duration-300 ${
                isHighlighted ? "ring-2 ring-gray-900 ring-offset-2 shadow-md" : ""
              }`}>
                {/* Main tap area → detail */}
                <button onClick={() => onSelect(bed.id)} className="w-full p-4 text-left">
                  {/* Header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-gray-900">Bed {bed.bedNumber}</span>
                      {isDelivered
                        ? <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                        : <span className={`w-2 h-2 rounded-full ${sc.dot} shrink-0`} />}
                    </div>
                    {isDelivered ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-600 text-white shrink-0">
                        Delivered
                      </span>
                    ) : alerts.length > 0 && (
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${sc.badge}`}>
                        {urgentN > 0 ? `${urgentN} urgent` : `${alerts.length} alert${alerts.length!==1?"s":""}`}
                      </span>
                    )}
                  </div>

                  {/* BSAR rows */}
                  <div className="space-y-1.5">
                    {bParts.length > 0 && (
                      <div className="flex gap-2 items-baseline">
                        <span className="text-[10px] font-bold text-gray-300 w-3 shrink-0">B</span>
                        <span className="text-sm text-gray-700 leading-snug">{bParts.join(" · ")}</span>
                      </div>
                    )}
                    {/* S row — dilation displayed large for instant scannability */}
                    {isDelivered ? (
                      <div className="flex gap-2 items-baseline">
                        <span className="text-[10px] font-bold text-gray-300 w-3 shrink-0">S</span>
                        <span className="text-sm font-semibold text-gray-900 leading-snug">{delivSLine}</span>
                      </div>
                    ) : (
                      <div className="flex gap-2 items-center">
                        <span className="text-[10px] font-bold text-gray-300 w-3 shrink-0">S</span>
                        <span className="text-xs text-gray-500 leading-none">{STAGE_SHORT[bed.labourStage] ?? bed.labourStage ?? "—"}</span>
                        {lastVE ? (
                          <>
                            <span className="text-gray-300 leading-none text-xs">·</span>
                            <span className="text-lg font-black text-gray-900 leading-none tabular-nums">
                              {lastVE.dilation}<span className="text-xs font-normal text-gray-400"> cm</span>
                            </span>
                            <span className={`text-xs leading-none ${veAgeCls}`}>{veAgoStr} ago</span>
                          </>
                        ) : (
                          <span className="text-sm font-semibold text-gray-400">No VE</span>
                        )}
                      </div>
                    )}
                    {aParts.length > 0 && (
                      <div className="flex gap-2 items-baseline">
                        <span className="text-[10px] font-bold text-gray-300 w-3 shrink-0">A</span>
                        <span className="text-sm text-gray-600 leading-snug">{aParts.join(" · ")}</span>
                      </div>
                    )}
                    {!isDelivered && (
                      <div className="flex gap-2 items-center mt-1">
                        <span className="text-[10px] font-bold text-gray-300 w-3 shrink-0">R</span>
                        <div className="flex items-center gap-3">
                          <ObsDots bed={bed} now={now} />
                          {pendingTasks > 0 && (
                            <span className="text-[11px] font-semibold text-blue-500">{pendingTasks} task{pendingTasks !== 1 ? "s" : ""}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </button>

                {/* Quick actions bar */}
                {!isDelivered && (
                  <div className="border-t border-black/5 px-4 py-2.5 flex items-center justify-end gap-2">
                    <button
                      onClick={e => { e.stopPropagation(); onQuickCTG(bed.id); }}
                      className="px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 text-xs font-bold active:scale-95 transition-all">
                      + CTG
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); onQuickVE(bed.id); }}
                      className="px-4 py-1.5 rounded-full bg-gray-900 text-white text-xs font-bold active:scale-95 transition-all">
                      + VE
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {bedList.length > 0 && (
          <p className="text-[10px] text-gray-300 text-center mt-6 px-5 pb-4 leading-relaxed">
            NICE NG235 (Sept 2023) · GL983 · GL787 · Not a substitute for clinical judgement
          </p>
        )}

        </>
        )}
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────

export default function WardPage({ shift, onEndShift }) {
  const [beds, setBeds]            = useState(loadBeds);
  const [iolQueue, setIolQueue]    = useState(loadIOL);
  const [admitIOL, setAdmitIOL]    = useState(null);   // IOL entry being admitted, pre-fills wizard
  const [iolSheet, setIolSheet]    = useState(false);  // add/edit sheet
  const [iolSheetKey, setIolSheetKey] = useState(0);  // increments on each open to force fresh mount
  const [iolEditEntry, setIolEditEntry] = useState(null); // entry being edited, null for new
  const [selectedId, setSelId]     = useState(null);
  const [view, setView]            = useState("board"); // board | detail | wizard
  const [sheet, setSheet]          = useState(null);    // null | "ve" | "oxy" | "ctg" ...
  const [sheetBedId, setSheetBedId]= useState(null);
  const [editVE, setEditVE]        = useState(null);    // VE object being edited, or null for new
  const [editCTG, setEditCTG]      = useState(null);    // CTG object being edited, or null for new
  const [tick, setTick]            = useState(0);
  const [highlightBedId, setHighlightBedId] = useState(null);
  const [boardToast, setBoardToast] = useState(null);

  useEffect(() => { saveBeds(beds); }, [beds]);
  useEffect(() => { saveIOL(iolQueue); }, [iolQueue]);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(id);
  }, []);

  const alertsMap = useMemo(() => {
    const map = {};
    Object.values(beds).forEach(b => { map[b.id] = computeAlerts(b); });
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beds, tick]);

  const updateBed = useCallback((id, updates) => {
    setBeds(prev => ({ ...prev, [id]: { ...prev[id], ...updates } }));
  }, []);

  const openSheet = (type, bedId) => { setSheet(type); setSheetBedId(bedId); };
  const closeSheet = () => { setSheet(null); setSheetBedId(null); setEditVE(null); setEditCTG(null); };

  const sheetBed = sheetBedId ? beds[sheetBedId] : null;

  const saveVE = ve => {
    if (!sheetBed) return;
    const isEdit = !!editVE;
    // P1-4: prevent duplicate VEs at the exact same timestamp
    if (!isEdit && sheetBed.ves.some(v => v.time === ve.time)) return;
    const newVes = isEdit
      ? sheetBed.ves.map(v => v.id === ve.id ? ve : v)
      : [...sheetBed.ves, ve];
    const updates = { ves: newVes };
    if (!isEdit && ve.membranes === "AROM" && !sheetBed.armTime) updates.armTime = ve.membranesTime;
    updateBed(sheetBedId, updates);
    closeSheet();
  };

  const saveOxy = entry => {
    if (!sheetBed) return;
    const updates = { oxytocinLog: [...sheetBed.oxytocinLog, entry] };
    if (sheetBed.oxytocinLog.length === 0) updates.oxytocinStartTime = entry.startTime;
    updateBed(sheetBedId, updates);
    closeSheet();
  };

  const saveDelivery = record => {
    if (!sheetBed) return;
    updateBed(sheetBedId, { delivery: record });
    closeSheet();
  };

  const saveCTG = entry => {
    if (!sheetBed) return;
    const ctgLog = sheetBed.ctgLog ?? [];
    const isEdit = !!editCTG;
    const newLog = isEdit
      ? ctgLog.map(e => e.id === entry.id ? entry : e)
      : [...ctgLog, entry];
    updateBed(sheetBedId, { ctgLog: newLog });
    closeSheet();
  };

  const saveNewBed = bed => {
    setBeds(prev => ({ ...prev, [bed.id]: bed }));
    if (admitIOL) {
      setIolQueue(prev => prev.filter(e => e.id !== admitIOL.id));
      setAdmitIOL(null);
    }
    setView("board");
    setHighlightBedId(bed.id);
    const needsVE = !bed.ves?.length && bed.labourStage === "Active first stage";
    setBoardToast(
      needsVE
        ? `Bed ${bed.bedNumber} added — log VE when examined`
        : `Bed ${bed.bedNumber} added to ward`
    );
    setTimeout(() => setHighlightBedId(null), 3000);
    setTimeout(() => setBoardToast(null), 4500);
  };

  if (view === "wizard") {
    const wizardInitial = admitIOL ? {
      gestWeeks:  admitIOL.gestWeeks,
      gestDays:   admitIOL.gestDays ?? 0,
      mode:       "Induced",
      iolReasons: admitIOL.indications,
    } : null;
    return (
      <AdmissionWizard
        existingNumbers={Object.values(beds).map(b => b.bedNumber)}
        initialValues={wizardInitial}
        expressIOL={!!admitIOL}
        iolAddedAt={admitIOL?.addedAt ?? null}
        onSave={saveNewBed}
        onCancel={() => { setAdmitIOL(null); setView("board"); }}
      />
    );
  }

  const selectedBed    = selectedId ? beds[selectedId] : null;
  const selectedAlerts = selectedBed ? (alertsMap[selectedId] ?? []) : [];

  return (
    <div>
      {view === "board" && (
        <BoardView
          beds={beds} alertsMap={alertsMap}
          onSelect={id => { setSelId(id); setView("detail"); }}
          onAddBed={() => setView("wizard")}
          onClear={() => setBeds({})}
          onQuickVE={id => openSheet("ve", id)}
          onQuickCTG={id => openSheet("ctg", id)}
          onHandover={() => setSheet("handover")}
          onUpdateBed={updateBed}
          shift={shift}
          onEndShift={onEndShift}
          iolQueue={iolQueue}
          onIOLAdd={() => { setIolEditEntry(null); setIolSheetKey(k => k + 1); setIolSheet(true); }}
          onIOLEdit={entry => { setIolEditEntry(entry); setIolSheetKey(k => k + 1); setIolSheet(true); }}
          onIOLAdmit={entry => { setAdmitIOL(entry); setView("wizard"); }}
          onIOLRemove={id => setIolQueue(prev => prev.filter(e => e.id !== id))}
          highlightBedId={highlightBedId}
        />
      )}

      {boardToast && (
        <div className="fixed bottom-24 left-0 right-0 z-40 px-5 pointer-events-none">
          <div className="max-w-lg mx-auto bg-gray-900 text-white text-sm font-semibold px-4 py-3 rounded-2xl shadow-lg text-center">
            {boardToast}
          </div>
        </div>
      )}

      {view === "detail" && selectedBed && (
        <BedDetailView
          bed={selectedBed} alerts={selectedAlerts}
          onBack={() => { setSelId(null); setView("board"); }}
          onUpdate={updates => updateBed(selectedId, updates)}
          onDelete={() => {
            setBeds(prev => { const n = {...prev}; delete n[selectedId]; return n; });
            setSelId(null); setView("board");
          }}
          onOpenVE={() => { setEditVE(null); openSheet("ve", selectedId); }}
          onEditVE={ve => { setEditVE(ve); openSheet("ve", selectedId); }}
          onOpenOxy={() => openSheet("oxy", selectedId)}
          onOpenDelivery={() => openSheet("delivery", selectedId)}
          onOpenCTG={() => { setEditCTG(null); openSheet("ctg", selectedId); }}
          onEditCTG={ctg => { setEditCTG(ctg); openSheet("ctg", selectedId); }}
          onDeleteCTG={ctgId => updateBed(selectedId, { ctgLog: (selectedBed.ctgLog ?? []).filter(e => e.id !== ctgId) })}
        />
      )}

      {/* IOL add / edit sheet */}
      <BottomSheet open={iolSheet} onClose={() => { setIolSheet(false); setIolEditEntry(null); }}
        title={iolEditEntry ? "Edit IOL entry" : "Add to IOL queue"}
        sub="NICE NG207 · Inducing labour">
        <IOLAddSheet key={iolSheetKey} initialValues={iolEditEntry} onSave={entry => {
          setIolQueue(prev =>
            iolEditEntry
              ? prev.map(e => e.id === entry.id ? entry : e)
              : [...prev, entry]
          );
          setIolEditEntry(null);
          setIolSheet(false);
        }} />
      </BottomSheet>

      {/* Global bottom sheets — render above everything */}
      <BottomSheet open={sheet === "ve" && !!sheetBed} onClose={closeSheet}
        title={`${editVE ? "Edit VE" : "Record VE"}${sheetBed ? ` — Bed ${sheetBed.bedNumber}` : ""}`}
        sub="NICE NG235 §1.4.1 — 4-hourly in active labour">
        {sheetBed && <VESheet bed={sheetBed} editVE={editVE} onSave={saveVE} />}
      </BottomSheet>

      <BottomSheet open={sheet === "oxy" && !!sheetBed} onClose={closeSheet}
        title={`Oxytocin — Bed ${sheetBed?.bedNumber ?? ""}`}
        sub="NICE NG235 §1.5.6 — increment every 30 min minimum">
        {sheetBed && <OxySheet bed={sheetBed} onSave={saveOxy} />}
      </BottomSheet>

      <BottomSheet open={sheet === "delivery" && !!sheetBed} onClose={closeSheet}
        title={`${sheetBed?.delivery ? "Delivery record" : "Mark delivered"} — Bed ${sheetBed?.bedNumber ?? ""}`}>
        {sheetBed && <DeliverySheet bed={sheetBed} onSave={saveDelivery} />}
      </BottomSheet>

      <BottomSheet open={sheet === "ctg" && !!sheetBed} onClose={closeSheet}
        title={`${editCTG ? "Edit CTG Review" : "Log CTG Review"} — Bed ${sheetBed?.bedNumber ?? ""}`}
        sub="NICE NG229 — Fetal Monitoring in Labour [Dec 2022]">
        {sheetBed && <CTGSheet bed={sheetBed} editCTG={editCTG} onSave={saveCTG} />}
      </BottomSheet>

      <BottomSheet open={sheet === "handover"} onClose={closeSheet}
        title="Ward Handover"
        sub={`${Object.keys(beds).length} patient${Object.keys(beds).length !== 1 ? "s" : ""}`}>
        <HandoverSheet beds={beds} alertsMap={alertsMap} shift={shift} />
      </BottomSheet>
    </div>
  );
}
