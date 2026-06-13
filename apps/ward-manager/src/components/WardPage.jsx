import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { computeAlerts, bedStatusColor, classifyCTGEntry } from "../utils/wardAlerts";

// ─── Storage ─────────────────────────────────────────────────────────────

const STORAGE_KEY = "pocket_og_ward_beds";

function loadBeds() {
  try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : {}; }
  catch { return {}; }
}
function saveBeds(beds) { localStorage.setItem(STORAGE_KEY, JSON.stringify(beds)); }
function nowISO() { return new Date().toISOString(); }
function timeInputNow() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
}
function timeToISO(str) {
  const d = new Date();
  const [h, m] = str.split(":").map(Number);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
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

const PAR_SHORT = { "Para 0": "P0", "Para 1": "P1", "Para 2+": "P2+" };

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
    const lastVE = bed.ves?.[bed.ves.length - 1];
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

/** Time field — Now default + quick offset pills + ago confirmation */
function NowField({ label, value, onChange }) {
  const [modified, setModified]     = useState(false);
  const [showCustom, setShowCustom] = useState(false);

  // How long ago is the currently selected time?
  const agoLabel = (() => {
    if (!modified || !value) return null;
    const now = new Date();
    const [h, m] = value.split(":").map(Number);
    const sel = new Date();
    sel.setHours(h, m, 0, 0);
    const mins = Math.round((now - sel) / 60000);
    if (mins <= 0) return null;
    if (mins < 60) return `${mins}m ago`;
    const hh = Math.floor(mins / 60), mm = mins % 60;
    return mm > 0 ? `${hh}h ${mm}m ago` : `${hh}h ago`;
  })();

  const setOffset = mins => {
    const d = new Date(Date.now() - mins * 60000);
    onChange(`${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`);
    setModified(true);
    setShowCustom(false);
  };

  const setNow = () => {
    onChange(timeInputNow());
    setModified(false);
    setShowCustom(false);
  };

  return (
    <div className="space-y-2">
      {label && <p className="text-xs font-semibold text-gray-500">{label}</p>}

      {/* Main time row */}
      <div className="flex gap-2">
        {!modified ? (
          <button onClick={setNow}
            className="flex-1 py-3.5 rounded-xl bg-gray-900 text-white text-sm font-bold active:scale-95 transition-all">
            Now &nbsp;·&nbsp; {timeInputNow()}
          </button>
        ) : (
          <>
            <div className="flex-1 py-3.5 px-4 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-between">
              <span className="text-sm font-bold text-gray-900">{value}</span>
              {agoLabel && <span className="text-xs font-semibold text-gray-500">{agoLabel}</span>}
            </div>
            <button onClick={setNow}
              className="px-4 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 active:scale-95 transition-all">
              Now
            </button>
          </>
        )}
      </div>

      {/* Quick offset pills */}
      <div className="flex gap-1.5">
        {[15, 30, 60, 120, 180, 240].map(mins => (
          <button key={mins} onClick={() => setOffset(mins)}
            className="flex-1 py-3 rounded-xl bg-gray-100 text-xs font-bold text-gray-600 active:scale-95 transition-all">
            {mins < 60 ? `−${mins}m` : `−${mins / 60}h`}
          </button>
        ))}
      </div>

      {/* Custom time entry */}
      {showCustom ? (
        <div className="flex gap-2">
          <input type="time" autoFocus defaultValue={value || timeInputNow()}
            onChange={e => { onChange(e.target.value); setModified(true); }}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-gray-800" />
          <button onClick={() => setShowCustom(false)}
            className="px-4 py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold">Done</button>
        </div>
      ) : (
        <button onClick={() => setShowCustom(true)}
          className="text-[11px] text-gray-400 ml-0.5">Custom time…</button>
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

function VESheet({ bed, onSave }) {
  const lastVE = bed.ves?.[bed.ves.length - 1];
  const prevMembTime = (() => {
    for (let i = (bed.ves?.length ?? 0) - 1; i >= 0; i--)
      if (bed.ves[i].membranesTime) return bed.ves[i].membranesTime;
    return null;
  })();

  const [page, setPage]          = useState(1);
  const [dilation, setDil]       = useState(lastVE?.dilation ?? null);
  const [membranes, setMemb]     = useState(lastVE?.membranes ?? "Intact");
  const [membTime, setMembTime]  = useState(timeInputNow);
  const [veTime, setVETime]      = useState(timeInputNow);
  const [station, setStn]        = useState(lastVE?.station ?? 0);
  const [presentation, setPres]  = useState("Cephalic");
  const [contractions, setContr] = useState(lastVE?.contractions ?? 3);

  const save = () => {
    if (dilation === null) return;
    onSave({
      id: `ve-${Date.now()}`, time: timeToISO(veTime),
      dilation, station, presentation, membranes,
      membranesTime: membranes !== "Intact"
        ? (prevMembTime && lastVE?.membranes === membranes ? prevMembTime : timeToISO(membTime))
        : null,
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
                  <NowField label={`Time of ${membranes}`} value={membTime} onChange={setMembTime} />
                </div>
              )}
            </div>
          </div>
        )}

        {page === 2 && (
          <div className="px-5 pt-2 pb-4 space-y-6">
            <NowField label="Time of VE" value={veTime} onChange={setVETime} />

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

  const save = () => onSave({ id:`ox-${Date.now()}`, startTime: timeToISO(oxyTime), dose, lastIncrementTime: timeToISO(oxyTime) });

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

          <NowField label="Time of dose change" value={oxyTime} onChange={setOTime} />

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
  const [delivTime, setDelivTime] = useState(timeInputNow);
  const [mode, setMode]           = useState(ex?.mode ?? "SVD");
  const [ebl, setEbl]             = useState(ex?.ebl != null ? String(ex.ebl) : "");
  const [notes, setNotes]         = useState(ex?.notes ?? "");

  const eblNum = ebl ? parseFloat(ebl) : null;

  const save = () => onSave({
    time:  timeToISO(delivTime),
    mode,
    ebl:   eblNum,
    notes: notes.trim() || null,
  });

  return (
    <>
      <div className="overflow-y-auto overscroll-contain flex-1 min-h-0">
        <div className="px-5 pt-4 pb-4 space-y-5">

          <NowField label="Time of delivery" value={delivTime} onChange={setDelivTime} />

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

function CTGSheet({ bed, onSave }) {
  const prevEntry = (bed.ctgLog ?? []).slice(-1)[0] ?? null;
  const prevHR    = prevEntry?.baselineHR ?? null;

  const [ctgTime, setCTGTime]     = useState(timeInputNow);
  const [hr, setHR]               = useState(prevHR ?? 140);
  const [variability, setVar]     = useState("5-25");
  const [varMin, setVarMin]       = useState(0);
  const [decels, setDecels]       = useState("none");
  const [decelMin, setDecelMin]   = useState(0);
  const [accelerations, setAccel] = useState(true);
  const [ctxPer10, setCtx]        = useState(3);

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
    id: `ctg-${Date.now()}`,
    time: timeToISO(ctgTime),
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

          <NowField label="Time of CTG review" value={ctgTime} onChange={setCTGTime} />

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

// ─── Admission wizard — 2 steps ───────────────────────────────────────────

function WizardDots({ step, total = 4 }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: total }, (_, i) => i + 1).map(i => (
        <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i <= step ? "w-5 bg-gray-900" : "w-1.5 bg-gray-200"}`} />
      ))}
    </div>
  );
}

function AdmissionWizard({ existingNumbers, onSave, onCancel }) {
  const [step, setStep]       = useState(1);
  const [bedNum, setBedNum]   = useState("");
  const [parity, setParity]   = useState("Para 0");
  const [gestWeeks, setGestW] = useState(40);
  const [gestDays,  setGestD] = useState(0);
  const [err, setErr]         = useState("");
  const [stage, setStage]     = useState(null);
  const [mode, setMode]       = useState("Spontaneous");
  const [indMethod, setIndM]  = useState("Dinoprostone");
  const [analgesia, setAnal]  = useState("None");
  const [flags, setFlags]     = useState([]);
  const [admTime, setAdmT]    = useState(timeInputNow);

  // Admission VE — dilation drives stage deduction
  const [admDilation, setAdmDil]   = useState(null);
  const [admMembranes, setAdmMemb] = useState("Intact");
  const [admStation, setAdmStn]    = useState(0);
  const [admContracts, setAdmContr]= useState(3);
  const [admPushing, setAdmPush]   = useState(false);

  const deduceStage = (d, ctx, isPushing) => {
    if (d === null) return null; // no dilation → stage not yet determined
    if (d <= 2) return "Latent";
    // 3 cm: latent unless contractions are regular/established (≥ 4/10 min)
    if (d === 3) return ctx.contractions >= 4 ? "Active first stage" : "Latent";
    if (d <= 9) return "Active first stage";
    return isPushing ? "Active second stage" : "Passive second stage";
  };

  const handleDilationChange = (d) => {
    setAdmDil(d);
    setStage(deduceStage(d, { contractions: admContracts }, admPushing));
  };

  const handleContractionChange = (c) => {
    setAdmContr(c);
    // Re-deduce at the 3 cm boundary when contractions change
    if (admDilation === 3) setStage(deduceStage(3, { contractions: c }, admPushing));
  };

  const handlePushingChange = (isPushing) => {
    setAdmPush(isPushing);
    if (admDilation === 10) setStage(isPushing ? "Active second stage" : "Passive second stage");
  };

  const handleStageChange = (s) => {
    setStage(s);
    // Manual override from fallback picker — also set dilation hint at 10 for 2nd stage
    if (s === "Active second stage") setAdmDil(10);
  };

  const goNext = () => {
    if (step === 1) {
      const n = bedNum.trim();
      if (!n) { setErr("Enter a bed number"); return; }
      if (existingNumbers.includes(n)) { setErr("Already in use"); return; }
      if (gestWeeks < 28) { setErr("Gestation below 28+0 is not yet supported"); return; }
      setErr(""); setStep(2);
    } else if (step === 2) {
      if (!stage) { setErr("Enter dilation or select a stage"); return; }
      setErr(""); setStep(3);
    } else {
      const id = `bed-${Date.now()}`;
      const stageTime = admTime ? timeToISO(admTime) : nowISO();
      const admVE = admDilation !== null ? [{
        id: `ve-${Date.now()}`,
        time: stageTime,
        dilation: admDilation,
        membranes: admMembranes,
        membranesTime: admMembranes !== "Intact" ? stageTime : null,
        station: admStation,
        presentation: "Cephalic",
        contractions: admContracts,
      }] : [];
      onSave({
        id, bedNumber: bedNum.trim(),
        admissionTime: admTime ? timeToISO(admTime) : null,
        parity, gestation: `${gestWeeks}+${gestDays}`,
        modeOfOnset: mode,
        inductionMethod: mode === "Induced" ? indMethod : null,
        analgesia, riskFlags: flags, labourStage: stage,
        activeFirstStageStartTime: stage === "Active first stage" ? stageTime : null,
        passiveStartTime: stage === "Passive second stage" ? stageTime : null,
        pushingStartTime: stage === "Active second stage"  ? stageTime : null,
        armTime: null, oxytocinStartTime: null,
        ves: admVE, oxytocinLog: [], ctgLog: [], observations: {},
      });
    }
  };

  const titles = ["", "Patient", "Examination", "Context"];

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Top bar */}
      <div className="px-5 pb-4 flex items-center gap-3 border-b border-gray-100 shrink-0" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.75rem)' }}>
        <button onClick={step === 1 ? onCancel : () => setStep(s => s - 1)}
          className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 shrink-0">
          <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <p className="flex-1 text-base font-bold text-gray-900">{titles[step]}</p>
        <WizardDots step={step} total={3} />
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-7">

        {/* ── Step 1: Patient ─────────────────────────────────────── */}
        {step === 1 && (
          <>
            <div>
              <SLabel className="mb-3 text-center">Bed / bay number</SLabel>
              <input type="text" inputMode="numeric" autoFocus value={bedNum}
                onChange={e => { setBedNum(e.target.value); setErr(""); }}
                placeholder="—"
                className="w-full text-5xl font-bold text-gray-900 text-center border-b-2 border-gray-200 focus:border-gray-900 pb-2 bg-transparent outline-none transition-colors" />
              {err && <p className="text-xs text-red-500 text-center mt-2">{err}</p>}
            </div>

            <div>
              <SLabel className="mb-3">Parity</SLabel>
              <PillRow value={parity} onChange={setParity}
                options={["Para 0","Para 1","Para 2","Para 3+"]}
                labelFn={o => o.replace("Para ","P")} />
            </div>

            <div>
              <SLabel className="mb-4">Gestation</SLabel>
              <GestationInput
                weeks={gestWeeks} days={gestDays}
                onChange={({ weeks, days }) => { setGestW(weeks); setGestD(days); setErr(""); }}
              />
            </div>
          </>
        )}

        {/* ── Step 2: Examination ─────────────────────────────────── */}
        {step === 2 && (
          <>
            {/* Dilation — the hero question on this screen */}
            <div>
              <div className="flex items-end justify-between mb-4">
                <SLabel>Dilation</SLabel>
                {admDilation !== null
                  ? <span className="text-3xl font-black text-gray-900 leading-none">{admDilation} <span className="text-lg font-semibold text-gray-400">cm</span></span>
                  : <span className="text-xs text-gray-400">tap a circle</span>}
              </div>
              <NumberGrid value={admDilation} onChange={handleDilationChange} />

              {/* Stage chip — appears as soon as dilation is tapped */}
              {admDilation !== null && (() => {
                const chipCls = {
                  "Latent":               "bg-gray-100 text-gray-600",
                  "Active first stage":   "bg-blue-100 text-blue-700",
                  "Passive second stage": "bg-violet-100 text-violet-700",
                  "Active second stage":  "bg-violet-200 text-violet-800",
                }[stage] ?? "bg-gray-100 text-gray-600";
                return (
                  <div className="flex items-center gap-2 mt-3">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${chipCls}`}>{stage}</span>
                    {admDilation === 3 && (
                      <span className="text-[11px] text-gray-400">
                        {admContracts >= 4 ? "≥ 4 ctx/10 min" : "adjust contractions below to refine"}
                      </span>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Pushing? — only at 10 cm */}
            {admDilation === 10 && (
              <div>
                <SLabel className="mb-3">Actively pushing?</SLabel>
                <PillRow value={admPushing ? "Yes" : "No"}
                  onChange={v => handlePushingChange(v === "Yes")}
                  options={["No","Yes"]} />
              </div>
            )}

            {/* Fallback stage picker — only when no dilation entered */}
            {admDilation === null && (
              <div>
                <SLabel className="mb-1">No VE yet — select stage manually</SLabel>
                <p className="text-[11px] text-gray-400 mb-3">Or tap a dilation circle above to auto-deduce</p>
                <TileGrid value={stage} onChange={handleStageChange} cols={2}
                  options={["Latent","Active first stage","Passive second stage","Active second stage"]}
                  subFn={o => STAGE_SUB[o]} />
                {err && <p className="text-xs text-red-500 mt-2">{err}</p>}
              </div>
            )}

            {/* Rest of VE — only when dilation entered */}
            {admDilation !== null && (
              <>
                <div className="h-px bg-gray-100" />

                <div>
                  <SLabel className="mb-2">Membranes</SLabel>
                  <PillRow value={admMembranes} onChange={setAdmMemb} options={["Intact","SROM","AROM"]} />
                </div>

                <div>
                  <SLabel className="mb-3">Station</SLabel>
                  <StationStrip value={admStation} onChange={setAdmStn} />
                </div>

                <div>
                  <div className="flex items-baseline justify-between mb-3">
                    <SLabel>Contractions / 10 min</SLabel>
                    <span className="text-xl font-bold text-gray-900">{admContracts}</span>
                  </div>
                  <Stepper value={admContracts} onChange={handleContractionChange} min={0} max={10} />
                </div>
              </>
            )}
          </>
        )}

        {/* ── Step 3: Context ─────────────────────────────────────── */}
        {step === 3 && (
          <>
            <div>
              <SLabel className="mb-2">Analgesia</SLabel>
              <div className="space-y-2">
                <PillRow value={analgesia} onChange={setAnal} options={["None","Entonox","Pethidine"]} />
                <PillRow value={analgesia} onChange={setAnal} options={["Epidural","Remifentanil PCA"]} />
              </div>
              {(analgesia==="Epidural"||analgesia==="Remifentanil PCA") && (
                <p className="text-[10px] text-gray-400 mt-1.5">Regional analgesia — 2nd stage time limits extended · NG235 §1.6.5</p>
              )}
            </div>

            <div>
              <SLabel className="mb-2">Mode of onset</SLabel>
              <PillRow value={mode} onChange={setMode}
                options={["Spontaneous","Induced","PPROM"]}
                labelFn={o => ({ Spontaneous:"Spontaneous", Induced:"Induced", PPROM:"PPROM" }[o])} />
              {mode === "Induced" && <p className="text-[10px] text-gray-400 mt-1.5">IOL in progress</p>}
              {mode === "PPROM" && <p className="text-[10px] text-gray-400 mt-1.5">Pre-term pre-labour rupture of membranes</p>}
            </div>

            {mode === "Induced" && (
              <div>
                <SLabel className="mb-2">Induction method</SLabel>
                <PillRow value={indMethod} onChange={setIndM}
                  options={["Dinoprostone","Balloon","Misoprostol","ARM+Synto"]} />
              </div>
            )}

            <div className="h-px bg-gray-100" />

            <div>
              <SLabel className="mb-3">Risk flags — select all that apply</SLabel>
              <ChipGroup
                options={["GBS+","Diabetic-T1","Diabetic-T2","Diabetic-GDM","VBAC","Previous LSCS","Hypertensive"]}
                selected={flags} onChange={setFlags} />
              <div className="mt-3 space-y-1">
                {flags.includes("GBS+") && (
                  <p className="text-[11px] text-amber-600 font-semibold">GBS+ → IV benzylpenicillin required intrapartum · GL787 + NG235 §1.2.12</p>
                )}
                {flags.some(f=>f.startsWith("Diabetic")) && (
                  <p className="text-[11px] text-amber-600 font-semibold">Diabetic → hourly BGL, target 4–7 mmol/L · GL983</p>
                )}
                {flags.includes("Hypertensive") && (
                  <p className="text-[11px] text-amber-600 font-semibold">Hypertensive → BP hourly · NG235 §1.4.5</p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-2">
                <SLabel>Admission time</SLabel>
                <span className="text-[10px] text-gray-400">optional</span>
              </div>
              <NowField value={admTime} onChange={setAdmT} />
              {admTime && (
                <button onClick={() => setAdmT("")}
                  className="text-[11px] text-gray-400 mt-1.5 ml-1">
                  Clear — not known
                </button>
              )}
            </div>

            <p className="text-[10px] text-gray-300 text-center">Bed number only — no patient identifiers stored on this device</p>
          </>
        )}
      </div>

      {/* CTA */}
      <div className="px-5 pt-4 border-t border-gray-100 shrink-0" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.25rem)' }}>
        <button onClick={goNext}
          className="w-full py-4 rounded-2xl text-base font-bold bg-gray-900 text-white active:scale-95 transition-all">
          {step < 3 ? "Next" : "Add to ward"}
        </button>
      </div>
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
    <div className={`rounded-2xl border ${s.border} ${s.bg} p-4`}>
      <div className="flex items-start gap-3">
        <div className={`w-1.5 h-1.5 rounded-full ${s.bar} mt-1.5 shrink-0`} />
        <div className="flex-1">
          <p className={`text-sm font-bold ${s.text} leading-snug`}>{alert.title}</p>
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
              className={`py-3.5 rounded-2xl border flex flex-col items-center gap-0.5 active:scale-95 transition-all ${
                st==="ok"   ? "bg-green-50 border-green-200" :
                st==="warn" ? "bg-amber-50 border-amber-200" :
                st==="over" ? "bg-red-50   border-red-200"   :
                "bg-gray-50 border-gray-200"
              }`}>
              <p className={`text-xs font-bold ${
                st==="ok" ? "text-green-700" : st==="warn" ? "text-amber-700" : st==="over" ? "text-red-700" : "text-gray-500"
              }`}>{item.label}</p>
              <p className={`text-[11px] font-medium ${
                st==="ok" ? "text-green-500" : st==="warn" ? "text-amber-500" : st==="over" ? "text-red-500" : "text-gray-400"
              }`}>
                {displayVal ?? (lastISO ? fmtTime(lastISO) : "tap to clear")}
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
            <div className={`w-2 h-2 rounded-full ${dotCls}`} />
            <span className="text-[10px] text-gray-400 font-semibold">{letter}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Bed detail view — 3 inner tabs ──────────────────────────────────────

function BedDetailView({ bed, alerts, onBack, onUpdate, onDelete, onOpenVE, onOpenOxy, onOpenDelivery, onOpenCTG }) {
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
  const [now, setNow]       = useState(Date.now());
  const [urineVal, setUrineVal] = useState(String(bed.observations?.urineOutput ?? ""));
  const [innerTab, setInnerTab] = useState("overview"); // overview | ves | obs

  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 30000); return () => clearInterval(id); }, []);

  const urgentCount = alerts.filter(a => a.severity === "urgent").length;

  const setStage = s => {
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
            ].map(tab => {
              const lastCTG = tab.key === "ctg" ? bed.ctgLog?.[bed.ctgLog.length - 1] : null;
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
                </button>
              );
            })}
          </div>
        </div>

        {/* Overview tab */}
        {innerTab === "overview" && (
          <div className="px-5 pt-4 space-y-5 pb-24">
            {/* Alerts */}
            {alerts.length > 0
              ? <div className="space-y-2">{alerts.map(a => (
                  <AlertCard key={a.id} alert={a}
                    onAcknowledge={(PERSISTENT_FLAGS[a.id] || OBS_STAMP[a.id]) ? ackAlert : undefined} />
                ))}</div>
              : <div className="rounded-2xl bg-green-50 border border-green-200 p-4">
                  <p className="text-sm font-bold text-green-700">All clear</p>
                  <p className="text-xs text-green-600 mt-0.5">No active alerts.</p>
                </div>
            }

            {/* Stage */}
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

            {/* Analgesia */}
            <div>
              <SLabel className="mb-2">Analgesia</SLabel>
              <div className="space-y-2">
                <PillRow value={bed.analgesia} onChange={a => onUpdate({ analgesia: a })} options={["None","Entonox","Pethidine"]} />
                <PillRow value={bed.analgesia} onChange={a => onUpdate({ analgesia: a })} options={["Epidural","Remifentanil PCA"]} />
              </div>
            </div>

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

            {/* Discharge */}
            <div className="space-y-2 pt-2">
              <button onClick={() => { if (window.confirm(`Discharge Bed ${bed.bedNumber}?`)) onDelete(); }}
                className="w-full border border-red-200 text-red-500 font-medium py-3 rounded-2xl text-sm active:bg-red-50">
                Discharge / Remove bed
              </button>
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
                        <p className="text-xs text-gray-400">{fmtTime(ve.time)}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Station {ve.station > 0 ? `+${ve.station}` : ve.station} · {ve.membranes}
                        {ve.membranesTime ? ` at ${fmtTime(ve.membranesTime)}` : ""} · {ve.contractions}/10 min
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
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${cs.border} ${cs.bg} ${cs.text} capitalize`}>
                            {entry.classification}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 leading-snug">{ctgEntryLabel(entry)}</p>
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
      </div>

      {/* FAB — always shows VE */}
      <div className="fixed bottom-24 right-5 z-30">
        <button onClick={onOpenVE}
          className="w-14 h-14 rounded-full bg-gray-900 text-white shadow-lg text-sm font-bold flex items-center justify-center active:scale-95 transition-all">
          VE
        </button>
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
        const lastVE = bed.ves?.[bed.ves.length - 1];
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

function TasksView({ beds, alertsMap, onSelect }) {
  const allTasks = Object.entries(alertsMap).flatMap(([bedId, alerts]) => {
    const bed = beds[bedId];
    if (!bed || bed.delivery) return [];
    return alerts.map(a => ({ ...a, bed }));
  });

  if (allTasks.length === 0) {
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
      {TASK_LEVELS.map(lv => {
        const tasks = allTasks.filter(t => t.severity === lv.key);
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

function BoardView({ beds, alertsMap, onSelect, onAddBed, onClear, onQuickVE, onQuickCTG, onHandover, shift, onEndShift }) {
  const bedList      = Object.values(beds).sort((a,b) => a.bedNumber.localeCompare(b.bedNumber, undefined, {numeric:true}));
  const totalUrgent  = Object.values(alertsMap).flat().filter(a => a.severity === "urgent").length;
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

        {/* Board / Tasks tab bar */}
        {bedList.length > 0 && (
          <div className="px-5 pb-3">
            <div className="flex bg-gray-100 dark:bg-gray-900 rounded-xl p-1 gap-1">
              {[
                { key: "board", label: "Board" },
                { key: "tasks", label: "Tasks" },
              ].map(tab => {
                const isActive = boardTab === tab.key;
                return (
                  <button key={tab.key} onClick={() => setBoardTab(tab.key)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      isActive ? "bg-white shadow-sm text-gray-900" : "text-gray-500"
                    }`}>
                    {tab.label}
                    {tab.key === "tasks" && totalUrgent > 0 && (
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none ${
                        isActive ? "bg-red-500 text-white" : "bg-red-100 text-red-500"
                      }`}>
                        {totalUrgent}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {boardTab === "tasks" ? (
          <TasksView beds={beds} alertsMap={alertsMap} onSelect={onSelect} />
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
            const alerts     = alertsMap[bed.id] ?? [];
            const status     = bedStatusColor(alerts);
            const sc         = STATUS[status];
            const lastVE     = bed.ves?.[bed.ves.length - 1];
            const urgentN    = alerts.filter(a => a.severity === "urgent").length;
            const msSinceVE  = lastVE ? now - new Date(lastVE.time).getTime() : null;
            const isDelivered = !!bed.delivery;

            const cardCls = isDelivered
              ? "border-green-200 bg-green-50"
              : sc.card;

            return (
              <div key={bed.id} className={`rounded-2xl border ${cardCls} overflow-hidden`}>
                {/* Main tap area → detail */}
                <button onClick={() => onSelect(bed.id)} className="w-full p-4 text-left">
                  <div className="flex items-center justify-between gap-2">
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
                  <p className="text-sm text-gray-500 mt-1.5 truncate">{bedSummary(bed)}</p>
                  {!isDelivered && <ObsDots bed={bed} now={now} />}
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
  const [selectedId, setSelId]     = useState(null);
  const [view, setView]            = useState("board"); // board | detail | wizard
  const [sheet, setSheet]          = useState(null);    // null | "ve" | "oxy"
  const [sheetBedId, setSheetBedId]= useState(null);
  const [tick, setTick]            = useState(0);

  useEffect(() => { saveBeds(beds); }, [beds]);
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
  const closeSheet = () => { setSheet(null); setSheetBedId(null); };

  const sheetBed = sheetBedId ? beds[sheetBedId] : null;

  const saveVE = ve => {
    if (!sheetBed) return;
    const updates = { ves: [...sheetBed.ves, ve] };
    if (ve.membranes === "AROM" && !sheetBed.armTime) updates.armTime = ve.membranesTime;
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
    updateBed(sheetBedId, { ctgLog: [...ctgLog, entry] });
    closeSheet();
  };

  const saveNewBed = bed => {
    setBeds(prev => ({ ...prev, [bed.id]: bed }));
    setView("board");
    // Auto-open VE only for active first stage where no VE was captured in the wizard
    if (!bed.ves?.length && bed.labourStage === "Active first stage") {
      setSheet("ve");
      setSheetBedId(bed.id);
    }
  };

  if (view === "wizard") {
    return (
      <AdmissionWizard
        existingNumbers={Object.values(beds).map(b => b.bedNumber)}
        onSave={saveNewBed}
        onCancel={() => setView("board")}
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
          shift={shift}
          onEndShift={onEndShift}
        />
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
          onOpenVE={() => openSheet("ve", selectedId)}
          onOpenOxy={() => openSheet("oxy", selectedId)}
          onOpenDelivery={() => openSheet("delivery", selectedId)}
          onOpenCTG={() => openSheet("ctg", selectedId)}
        />
      )}

      {/* Global bottom sheets — render above everything */}
      <BottomSheet open={sheet === "ve" && !!sheetBed} onClose={closeSheet}
        title={`Record VE${sheetBed ? ` — Bed ${sheetBed.bedNumber}` : ""}`}
        sub="NICE NG235 §1.4.1 — 4-hourly in active labour">
        {sheetBed && <VESheet bed={sheetBed} onSave={saveVE} />}
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
        title={`CTG Review — Bed ${sheetBed?.bedNumber ?? ""}`}
        sub="NICE NG229 — Fetal Monitoring in Labour [Dec 2022]">
        {sheetBed && <CTGSheet bed={sheetBed} onSave={saveCTG} />}
      </BottomSheet>

      <BottomSheet open={sheet === "handover"} onClose={closeSheet}
        title="Ward Handover"
        sub={`${Object.keys(beds).length} patient${Object.keys(beds).length !== 1 ? "s" : ""}`}>
        <HandoverSheet beds={beds} alertsMap={alertsMap} shift={shift} />
      </BottomSheet>
    </div>
  );
}
