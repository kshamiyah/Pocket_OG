import { useState, useEffect, useCallback, useMemo } from "react";
import { computeAlerts, bedStatusColor } from "../utils/wardAlerts";

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

// ─── Clinical metadata ────────────────────────────────────────────────────

const STAGE_SUB = {
  "Latent":               "< 4 cm · irregular contractions",
  "Active first stage":   "≥ 4 cm · regular contractions",
  "Passive second stage": "Fully dilated · no urge to push",
  "Active second stage":  "Pushing / baby visible",
};

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
            className={`py-4 px-3 rounded-2xl border text-left transition-colors active:scale-95 ${on ? "bg-gray-900 border-gray-900" : "bg-white border-gray-200"}`}>
            <p className={`text-sm font-bold leading-snug ${on ? "text-white" : "text-gray-800"}`}>
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
      {[-3,-2,-1,0,1,2,3].map((o, i) => (
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

/** Time field — big "Now" default, small "Edit" escape hatch */
function NowField({ label, value, onChange }) {
  const [editing, setEditing] = useState(false);
  const markNow = () => { onChange(timeInputNow()); setEditing(false); };
  return (
    <div>
      {label && <p className="text-xs font-semibold text-gray-500 mb-2">{label}</p>}
      {editing ? (
        <div className="flex gap-2">
          <input type="time" autoFocus defaultValue={value || timeInputNow()}
            onChange={e => onChange(e.target.value)}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-gray-800" />
          <button onClick={() => setEditing(false)}
            className="px-4 py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold">Done</button>
        </div>
      ) : (
        <div className="flex gap-2">
          <button onClick={markNow}
            className="flex-1 py-3.5 rounded-xl bg-gray-900 text-white text-sm font-bold active:scale-95 transition-all">
            Now &nbsp;·&nbsp; {timeInputNow()}
          </button>
          <button onClick={() => setEditing(true)}
            className="px-4 py-3.5 rounded-xl border border-gray-200 text-sm text-gray-500">
            {value && !editing ? value : "Edit"}
          </button>
        </div>
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
        <div className="overflow-y-auto overscroll-contain flex-1" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>{children}</div>
      </div>
    </>
  );
}

// ─── VE sheet content ─────────────────────────────────────────────────────

function VESheet({ bed, onSave }) {
  const lastVE = bed.ves?.[bed.ves.length - 1];
  const prevMembTime = (() => {
    for (let i = (bed.ves?.length ?? 0) - 1; i >= 0; i--)
      if (bed.ves[i].membranesTime) return bed.ves[i].membranesTime;
    return null;
  })();

  const [veTime, setVETime]       = useState(timeInputNow);
  const [dilation, setDil]        = useState(lastVE?.dilation ?? null);
  const [station, setStn]         = useState(lastVE?.station ?? 0);
  const [presentation, setPres]   = useState(lastVE?.presentation ?? "Cephalic");
  const [membranes, setMemb]      = useState(lastVE?.membranes ?? "Intact");
  const [membTime, setMembTime]   = useState(timeInputNow);
  const [contractions, setContr]  = useState(lastVE?.contractions ?? 3);

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
    <div className="px-5 pt-4 pb-10 space-y-6">
      <NowField label="Time of VE" value={veTime} onChange={setVETime} />

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
        <SLabel className="mb-3">Station</SLabel>
        <StationStrip value={station} onChange={setStn} />
      </div>

      <div>
        <SLabel className="mb-2">Presentation</SLabel>
        <PillRow value={presentation} onChange={setPres} options={["Cephalic","Breech","Other"]} />
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

      <div>
        <div className="flex items-baseline justify-between mb-3">
          <SLabel>Contractions / 10 min</SLabel>
          {contractions > 5 && <span className="text-[10px] font-bold text-red-500 uppercase tracking-wide">Hyperstim · NG235 §1.5.7</span>}
        </div>
        <Stepper value={contractions} onChange={setContr} min={1} max={8} />
      </div>

      <button onClick={save} disabled={dilation === null}
        className="w-full py-4 rounded-2xl text-base font-bold bg-gray-900 disabled:bg-gray-200 disabled:text-gray-400 text-white active:scale-95 transition-all">
        Save VE
      </button>
      <p className="text-[10px] text-gray-300 text-center -mt-2 pb-2">NICE NG235 §1.4.1 — 4-hourly VE in active labour</p>
    </div>
  );
}

// ─── Oxytocin sheet content ───────────────────────────────────────────────

function OxySheet({ bed, onSave }) {
  const current = bed.oxytocinLog?.[bed.oxytocinLog.length - 1];
  const [dose, setDose]     = useState(current?.dose ?? 2);
  const [oxyTime, setOTime] = useState(timeInputNow);

  const save = () => onSave({ id:`ox-${Date.now()}`, startTime: timeToISO(oxyTime), dose, lastIncrementTime: timeToISO(oxyTime) });

  return (
    <div className="px-5 pt-4 pb-10 space-y-5">
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

      <button onClick={save}
        className="w-full py-4 rounded-2xl text-base font-bold bg-gray-900 text-white active:scale-95 transition-all">
        Log dose
      </button>
    </div>
  );
}

// ─── Admission wizard ─────────────────────────────────────────────────────

function WizardDots({ step }) {
  return (
    <div className="flex gap-1.5">
      {[1,2,3].map(i => (
        <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i <= step ? "w-5 bg-gray-900" : "w-1.5 bg-gray-200"}`} />
      ))}
    </div>
  );
}

function AdmissionWizard({ existingNumbers, onSave, onCancel }) {
  const [step, setStep]     = useState(1);
  const [bedNum, setBedNum] = useState("");
  const [parity, setParity] = useState("Para 0");
  const [gestation, setGest]= useState(40);
  const [err, setErr]       = useState("");
  const [stage, setStage]   = useState("Active first stage");
  const [mode, setMode]     = useState("Spontaneous");
  const [indMethod, setIndM]= useState("Dinoprostone");
  const [analgesia, setAnal]= useState("None");
  const [flags, setFlags]   = useState([]);
  const [admTime, setAdmT]  = useState(timeInputNow);

  const goNext = () => {
    if (step === 1) {
      const n = bedNum.trim();
      if (!n) { setErr("Enter a bed number"); return; }
      if (existingNumbers.includes(n)) { setErr("Already in use"); return; }
      setErr(""); setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      const id = `bed-${Date.now()}`;
      onSave({
        id, bedNumber: bedNum.trim(),
        admissionTime: timeToISO(admTime),
        parity, gestation: `${gestation}w`,
        modeOfOnset: mode,
        inductionMethod: mode === "Induced" ? indMethod : null,
        analgesia, riskFlags: flags, labourStage: stage,
        passiveStartTime: stage === "Passive second stage" ? nowISO() : null,
        pushingStartTime: stage === "Active second stage"  ? nowISO() : null,
        ves: [], oxytocinLog: [], observations: {},
      });
    }
  };

  const titles = ["", "Who?", "Where are they?", "Any concerns?"];

  return (
    <div className="fixed inset-0 z-40 bg-white flex flex-col">
      {/* Top bar */}
      <div className="px-5 pb-4 flex items-center gap-3 border-b border-gray-100 shrink-0" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.75rem)' }}>
        <button onClick={step === 1 ? onCancel : () => setStep(s => s - 1)}
          className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 shrink-0">
          <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <p className="flex-1 text-base font-bold text-gray-900">{titles[step]}</p>
        <WizardDots step={step} />
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-7">

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
              <Stepper value={gestation} onChange={setGest} min={37} max={42} labelFn={v => `${v} weeks`} />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <SLabel className="mb-3">Labour stage — NICE NG235 §1.1</SLabel>
              <TileGrid value={stage} onChange={setStage} cols={2}
                options={["Latent","Active first stage","Passive second stage","Active second stage"]}
                subFn={o => STAGE_SUB[o]} />
            </div>

            <div>
              <SLabel className="mb-3">Mode of onset</SLabel>
              <TileGrid value={mode} onChange={setMode} cols={3}
                options={["Spontaneous","Induced","PPROM"]}
                subFn={o => ({ Spontaneous:"Natural onset", Induced:"IOL in progress", PPROM:"Pre-term PROM" }[o])} />
            </div>

            {mode === "Induced" && (
              <div>
                <SLabel className="mb-2">Induction method</SLabel>
                <PillRow value={indMethod} onChange={setIndM}
                  options={["Dinoprostone","Balloon","Misoprostol","ARM+Synto"]} />
              </div>
            )}

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
          </>
        )}

        {step === 3 && (
          <>
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
              <SLabel className="mb-2">Admission time</SLabel>
              <NowField value={admTime} onChange={setAdmT} />
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

function AlertCard({ alert }) {
  const s = SEV[alert.severity];
  return (
    <div className={`rounded-2xl border ${s.border} ${s.bg} p-4`}>
      <div className="flex items-start gap-3">
        <div className={`w-1.5 h-1.5 rounded-full ${s.bar} mt-1.5 shrink-0`} />
        <div className="flex-1">
          <p className={`text-sm font-bold ${s.text} leading-snug`}>{alert.title}</p>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">{alert.body}</p>
          <p className={`text-[10px] font-bold uppercase tracking-wide mt-2 ${s.cite}`}>{alert.citation}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Inline observation row ────────────────────────────────────────────────

function ObsRow({ bed, onUpdate }) {
  const obs = bed.observations ?? {};
  const isDiabetic     = (bed.riskFlags ?? []).some(f => f.startsWith("Diabetic"));
  const isHypertensive = (bed.riskFlags ?? []).includes("Hypertensive");
  const now = Date.now();

  const items = [
    { key: "lastPulse", label: "Pulse", limitMin: 60, citation: "§1.4.5" },
    { key: "lastBP",    label: "BP",    limitMin: isHypertensive ? 60 : 240, citation: "§1.4.5" },
    { key: "lastTemp",  label: "Temp",  limitMin: 240, citation: "§1.4.5" },
    ...(isDiabetic ? [{ key: "lastBGL", label: "BGL", limitMin: 60, citation: "GL983" }] : []),
  ];

  const tap = key => onUpdate({ ...obs, [key]: nowISO() });

  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0,1fr))` }}>
      {items.map(({ key, label, limitMin }) => {
        const lastISO = obs[key];
        const ageMin  = lastISO ? (now - new Date(lastISO).getTime()) / 60000 : Infinity;
        const pct     = ageMin / limitMin;
        const st      = !lastISO ? "none" : pct < 0.8 ? "ok" : pct < 1 ? "warn" : "over";
        return (
          <button key={key} onClick={() => tap(key)}
            className={`py-3.5 rounded-2xl border flex flex-col items-center gap-0.5 active:scale-95 transition-all ${
              st==="ok"   ? "bg-green-50 border-green-200" :
              st==="warn" ? "bg-amber-50 border-amber-200" :
              st==="over" ? "bg-red-50   border-red-200"   :
              "bg-gray-50 border-gray-200"
            }`}>
            <p className={`text-xs font-bold ${
              st==="ok" ? "text-green-700" : st==="warn" ? "text-amber-700" : st==="over" ? "text-red-700" : "text-gray-500"
            }`}>{label}</p>
            <p className={`text-[11px] font-medium ${
              st==="ok" ? "text-green-500" : st==="warn" ? "text-amber-500" : st==="over" ? "text-red-500" : "text-gray-400"
            }`}>{lastISO ? fmtTime(lastISO) : "—"}</p>
          </button>
        );
      })}
    </div>
  );
}

// ─── Bed detail view ──────────────────────────────────────────────────────

const STAGES   = ["Latent","Active first stage","Passive second stage","Active second stage"];
const ANALGS   = ["None","Entonox","Pethidine","Epidural","Remifentanil PCA"];

function BedDetailView({ bed, alerts, onBack, onUpdate, onDelete, onOpenVE, onOpenOxy }) {
  const status   = bedStatusColor(alerts);
  const sc       = STATUS[status];
  const lastVE   = bed.ves?.[bed.ves.length - 1];
  const currentOx= bed.oxytocinLog?.[bed.oxytocinLog.length - 1];
  const [now, setNow] = useState(Date.now());
  const [urineVal, setUrineVal] = useState(String(bed.observations?.urineOutput ?? ""));

  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 30000); return () => clearInterval(id); }, []);

  const setStage = s => {
    const u = { labourStage: s };
    if (s === "Passive second stage" && !bed.passiveStartTime) u.passiveStartTime = nowISO();
    if (s === "Active second stage"  && !bed.pushingStartTime)  u.pushingStartTime  = nowISO();
    onUpdate(u);
  };

  const saveUrine = () => {
    if (!urineVal) return;
    onUpdate({ observations: { ...bed.observations, urineOutput: parseFloat(urineVal), lastUrineCheck: nowISO() } });
  };

  return (
    <div className="min-h-screen bg-white pb-36">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="px-5 pb-4 border-b border-gray-100" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.75rem)' }}>
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

        <div className="px-5 pt-5 space-y-6">

          {/* Alerts */}
          {alerts.length > 0
            ? <div className="space-y-2">{alerts.map(a => <AlertCard key={a.id} alert={a} />)}</div>
            : <div className="rounded-2xl bg-green-50 border border-green-200 p-4">
                <p className="text-sm font-bold text-green-700">All clear</p>
                <p className="text-xs text-green-600 mt-0.5">No alerts — all timers within normal limits.</p>
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

          {/* Observations */}
          <div>
            <SLabel className="mb-2">Observations — tap to mark done now · NG235 §1.4.5</SLabel>
            <ObsRow bed={bed} onUpdate={obs => onUpdate({ observations: obs })} />
            {/* Urine output */}
            <div className="mt-2 flex gap-2">
              <input type="number" inputMode="numeric" value={urineVal}
                onChange={e => setUrineVal(e.target.value)} placeholder="Urine output mL/hr"
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-gray-400" />
              <button onClick={saveUrine} className="px-4 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-bold">Set</button>
            </div>
            {bed.observations?.urineOutput !== undefined && bed.observations.urineOutput < 30 && (
              <p className="text-xs font-bold text-red-600 mt-1">Oliguria {bed.observations.urineOutput} mL/hr — escalate · NG235 §1.4.5</p>
            )}
          </div>

          {/* VE log */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <SLabel>VE log — NG235 §1.4.1 [4-hourly]</SLabel>
              <button onClick={onOpenVE} className="px-3 py-1.5 rounded-full bg-gray-900 text-white text-xs font-bold">+ VE</button>
            </div>
            {!bed.ves?.length
              ? <button onClick={onOpenVE} className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-200 text-sm text-gray-400 font-medium">
                  Tap to record first VE
                </button>
              : <div className="rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm">
                  {[...bed.ves].reverse().map((ve, i) => (
                    <div key={ve.id} className={`px-4 py-3 ${i > 0 ? "border-t border-gray-50" : ""}`}>
                      <div className="flex items-baseline justify-between">
                        <p className="text-sm font-bold text-gray-900">{ve.dilation} cm</p>
                        <p className="text-xs text-gray-400">{fmtTime(ve.time)}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Station {ve.station > 0 ? `+${ve.station}` : ve.station} · {ve.presentation} · {ve.contractions}/10 min · {ve.membranes}
                        {ve.membranesTime ? ` at ${fmtTime(ve.membranesTime)}` : ""}
                      </p>
                    </div>
                  ))}
                </div>
            }
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
      </div>

      {/* FAB */}
      <div className="fixed bottom-24 right-5 z-30">
        <button onClick={onOpenVE}
          className="w-14 h-14 rounded-full bg-gray-900 text-white shadow-lg text-sm font-bold flex items-center justify-center active:scale-95 transition-all">
          VE
        </button>
      </div>
    </div>
  );
}

// ─── Board view ───────────────────────────────────────────────────────────

function BoardView({ beds, alertsMap, onSelect, onAddBed, onClear, onQuickVE }) {
  const bedList      = Object.values(beds).sort((a,b) => a.bedNumber.localeCompare(b.bedNumber, undefined, {numeric:true}));
  const totalUrgent  = Object.values(alertsMap).flat().filter(a => a.severity === "urgent").length;
  const now          = Date.now();

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-lg mx-auto">
        <div className="px-5 pb-4 flex items-center justify-between" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1rem)' }}>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Labour Ward</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              {bedList.length === 0
                ? "No patients"
                : `${bedList.length} patient${bedList.length !== 1 ? "s" : ""}${totalUrgent > 0 ? ` · ${totalUrgent} urgent` : " · all clear"}`}
            </p>
          </div>
          <div className="flex gap-2">
            {bedList.length > 0 && (
              <button onClick={() => { if (window.confirm("Clear all beds?")) onClear(); }}
                className="px-3 py-2 rounded-xl bg-gray-100 text-xs font-semibold text-gray-600">Clear</button>
            )}
            <button onClick={onAddBed}
              className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-bold active:scale-95 transition-all">
              + Add
            </button>
          </div>
        </div>

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
            const alerts  = alertsMap[bed.id] ?? [];
            const status  = bedStatusColor(alerts);
            const sc      = STATUS[status];
            const lastVE  = bed.ves?.[bed.ves.length - 1];
            const urgentN = alerts.filter(a => a.severity === "urgent").length;
            const msSinceVE = lastVE ? now - new Date(lastVE.time).getTime() : null;

            return (
              <div key={bed.id} className={`rounded-2xl border ${sc.card} overflow-hidden`}>
                {/* Main tap area → detail */}
                <button onClick={() => onSelect(bed.id)} className="w-full p-4 text-left">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-gray-900">Bed {bed.bedNumber}</span>
                      <span className={`w-2 h-2 rounded-full ${sc.dot} shrink-0`} />
                    </div>
                    {alerts.length > 0 && (
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${sc.badge}`}>
                        {urgentN > 0 ? `${urgentN} urgent` : `${alerts.length} alert${alerts.length!==1?"s":""}`}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{bed.parity} · {bed.gestation} · {bed.labourStage}</p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {lastVE && <span className="text-sm font-semibold text-gray-800">{lastVE.dilation} cm</span>}
                    {msSinceVE !== null && (
                      <span className={`text-xs ${msSinceVE > 3.5 * 3600000 ? "font-bold text-red-500" : "text-gray-400"}`}>
                        {fmtAge(msSinceVE)} ago
                      </span>
                    )}
                    {bed.riskFlags?.map(f => (
                      <span key={f} className="text-[10px] font-semibold text-gray-500 bg-white/80 border border-gray-200 px-1.5 py-0.5 rounded-full">{f}</span>
                    ))}
                  </div>
                </button>

                {/* Quick actions bar */}
                <div className="border-t border-black/5 px-4 py-2.5 flex items-center justify-between">
                  <p className="text-xs text-gray-400">
                    {bed.analgesia !== "None" ? bed.analgesia : "No analgesia"}
                    {bed.modeOfOnset === "Induced" ? ` · ${bed.inductionMethod ?? "Induced"}` : ""}
                  </p>
                  <button
                    onClick={e => { e.stopPropagation(); onQuickVE(bed.id); }}
                    className="px-4 py-1.5 rounded-full bg-gray-900 text-white text-xs font-bold active:scale-95 transition-all">
                    + VE
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {bedList.length > 0 && (
          <p className="text-[10px] text-gray-300 text-center mt-6 px-5 pb-4 leading-relaxed">
            NICE NG235 (Sept 2023) · GL983 · GL787 · Not a substitute for clinical judgement
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────

export default function WardPage() {
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
    updateBed(sheetBedId, { ves: [...sheetBed.ves, ve] });
    closeSheet();
  };

  const saveOxy = entry => {
    if (!sheetBed) return;
    updateBed(sheetBedId, { oxytocinLog: [...sheetBed.oxytocinLog, entry] });
    closeSheet();
  };

  const saveNewBed = bed => {
    setBeds(prev => ({ ...prev, [bed.id]: bed }));
    setView("board");
    // Immediately prompt for first VE
    setSheet("ve");
    setSheetBedId(bed.id);
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
    </div>
  );
}
