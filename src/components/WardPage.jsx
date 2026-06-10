import { useState, useEffect, useCallback, useMemo } from "react";
import { computeAlerts, bedStatusColor } from "../utils/wardAlerts";

// ─── Constants ──────────────────────────────────────────────────────────

const STORAGE_KEY = "pocket_og_ward_beds";

const PARITY_OPTIONS    = ["Para 0", "Para 1", "Para 2", "Para 3+"];
const GESTATION_OPTIONS = ["37", "38", "39", "40", "41", "42"];
const MODE_OPTIONS      = ["Spontaneous", "Induced", "PPROM"];
const INDUCTION_OPTIONS = ["Dinoprostone", "Balloon", "Misoprostol", "ARM+Synto"];
const ANALGESIA_OPTIONS = ["None", "Entonox", "Pethidine", "Epidural", "Remifentanil PCA"];
const RISK_FLAG_OPTIONS = ["GBS+", "Diabetic-T1", "Diabetic-T2", "Diabetic-GDM", "VBAC", "Previous LSCS", "Hypertensive"];
const STAGE_OPTIONS     = ["Latent", "Active first stage", "Passive second stage", "Active second stage"];
const DILATION_OPTIONS  = Array.from({ length: 11 }, (_, i) => i);
const STATION_OPTIONS   = [-3, -2, -1, 0, 1, 2, 3];
const MEMBRANE_OPTIONS  = ["Intact", "SROM", "AROM"];
const CONTRACTION_OPT   = [1, 2, 3, 4, 5, 6, 7, 8];
const PRESENTATION_OPT  = ["Cephalic", "Breech", "Other"];
const OXYTOCIN_DOSES    = [1, 2, 3, 4, 6, 8, 10, 12, 14, 16, 18, 20];

const SEVERITY = {
  urgent:  { bar: "bg-red-500",   bg: "bg-red-50",   border: "border-red-200",   text: "text-red-800",   cite: "text-red-400"   },
  warning: { bar: "bg-amber-400", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800", cite: "text-amber-400" },
  info:    { bar: "bg-blue-400",  bg: "bg-blue-50",  border: "border-blue-200",  text: "text-blue-800",  cite: "text-blue-400"  },
};

const STATUS_CARD = {
  urgent:  { card: "border-red-200 bg-red-50",    dot: "bg-red-500",   badge: "bg-red-500 text-white"    },
  warning: { card: "border-amber-200 bg-amber-50", dot: "bg-amber-400", badge: "bg-amber-400 text-white" },
  info:    { card: "border-blue-100 bg-blue-50",   dot: "bg-blue-400",  badge: "bg-blue-400 text-white"  },
  ok:      { card: "border-gray-100 bg-white",     dot: "bg-green-400", badge: "bg-gray-100 text-gray-500" },
};

// ─── Persistence helpers ────────────────────────────────────────────────

function loadBeds() {
  try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : {}; }
  catch { return {}; }
}

function saveBeds(beds) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(beds));
}

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
  const h = Math.floor(m / 60);
  return m % 60 > 0 ? `${h}h ${m % 60}m` : `${h}h`;
}

// ─── Shared UI atoms ────────────────────────────────────────────────────

function BackHeader({ title, sub, onBack }) {
  return (
    <div className="px-5 pt-14 pb-4 flex items-center gap-3 border-b border-gray-100">
      <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors shrink-0">
        <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div>
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function SelectField({ label, value, onChange, options, getLabel }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-gray-500 mb-1.5">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-gray-400 transition-colors appearance-none pr-8"
        >
          {options.map(o => (
            <option key={o} value={o}>{getLabel ? getLabel(o) : o}</option>
          ))}
        </select>
        <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </label>
  );
}

function TimeField({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-gray-500 mb-1.5">{label}</span>
      <input
        type="time"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-gray-400 transition-colors"
      />
    </label>
  );
}

function ChipGroup({ label, options, selected, onChange }) {
  const toggle = opt => onChange(
    selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt]
  );
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 mb-1.5">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => {
          const on = selected.includes(opt);
          return (
            <button key={opt} type="button" onClick={() => toggle(opt)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${on ? "bg-gray-900 border-gray-900 text-white" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">{children}</p>;
}

// ─── Alert card ─────────────────────────────────────────────────────────

function AlertCard({ alert }) {
  const s = SEVERITY[alert.severity];
  return (
    <div className={`rounded-2xl border ${s.border} ${s.bg} p-4`}>
      <div className="flex items-start gap-3">
        <div className={`w-1.5 h-1.5 rounded-full ${s.bar} mt-1.5 shrink-0`} />
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-bold ${s.text} leading-snug`}>{alert.title}</p>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">{alert.body}</p>
          <p className={`text-[10px] font-bold uppercase tracking-wide mt-2 ${s.cite}`}>{alert.citation}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Add Bed Form ───────────────────────────────────────────────────────

function AddBedForm({ onSave, onCancel, existingNumbers }) {
  const [bedNum, setBedNum]     = useState("");
  const [parity, setParity]     = useState("Para 0");
  const [gestation, setGest]    = useState("40");
  const [mode, setMode]         = useState("Spontaneous");
  const [indMethod, setIndMeth] = useState("Dinoprostone");
  const [analgesia, setAnalg]   = useState("None");
  const [flags, setFlags]       = useState([]);
  const [stage, setStage]       = useState("Active first stage");
  const [admTime, setAdmTime]   = useState(timeInputNow);
  const [err, setErr]           = useState("");

  const submit = () => {
    const n = bedNum.trim();
    if (!n) { setErr("Bed number is required"); return; }
    if (existingNumbers.includes(n)) { setErr("Bed number already in use"); return; }
    const id = `bed-${Date.now()}`;
    onSave({
      id, bedNumber: n,
      admissionTime: timeToISO(admTime),
      parity, gestation: `${gestation}w`,
      modeOfOnset: mode,
      inductionMethod: mode === "Induced" ? indMethod : null,
      analgesia, riskFlags: flags, labourStage: stage,
      passiveStartTime: stage === "Passive second stage" ? nowISO() : null,
      pushingStartTime: stage === "Active second stage" ? nowISO() : null,
      ves: [], oxytocinLog: [], observations: {},
    });
  };

  return (
    <div className="min-h-screen pb-24 bg-white">
      <div className="max-w-lg mx-auto">
        <BackHeader title="Add Bed" sub="Admission details" onBack={onCancel} />
        <div className="px-5 pt-5 space-y-4">
          <label className="block">
            <span className="block text-xs font-semibold text-gray-500 mb-1.5">Bed / bay number</span>
            <input
              type="text" inputMode="numeric" value={bedNum} placeholder="e.g. 4"
              onChange={e => { setBedNum(e.target.value); setErr(""); }}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-gray-400 transition-colors"
            />
            {err && <p className="text-xs text-red-500 mt-1">{err}</p>}
          </label>

          <div className="grid grid-cols-2 gap-3">
            <SelectField label="Parity" value={parity} onChange={setParity} options={PARITY_OPTIONS} />
            <SelectField label="Gestation (weeks)" value={gestation} onChange={setGest} options={GESTATION_OPTIONS} getLabel={o => `${o}w`} />
          </div>

          <SelectField label="Labour stage on admission" value={stage} onChange={setStage} options={STAGE_OPTIONS} />
          <SelectField label="Mode of onset" value={mode} onChange={setMode} options={MODE_OPTIONS} />
          {mode === "Induced" && (
            <SelectField label="Induction method" value={indMethod} onChange={setIndMeth} options={INDUCTION_OPTIONS} />
          )}
          <SelectField label="Analgesia" value={analgesia} onChange={setAnalg} options={ANALGESIA_OPTIONS} />
          <TimeField label="Admission time" value={admTime} onChange={setAdmTime} />
          <ChipGroup label="Risk flags" options={RISK_FLAG_OPTIONS} selected={flags} onChange={setFlags} />

          <button onClick={submit}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3.5 rounded-2xl transition-colors">
            Add to ward
          </button>
          <p className="text-[10px] text-gray-300 text-center pb-2">Bed number only — no patient identifiers stored</p>
        </div>
      </div>
    </div>
  );
}

// ─── Add VE Form ────────────────────────────────────────────────────────

function AddVEForm({ bed, onSave, onCancel }) {
  const lastVE = bed.ves?.[bed.ves.length - 1];
  const [time, setTime]           = useState(timeInputNow);
  const [dilation, setDil]        = useState(String(lastVE?.dilation ?? 5));
  const [station, setStn]         = useState(String(lastVE?.station ?? 0));
  const [presentation, setPres]   = useState(lastVE?.presentation ?? "Cephalic");
  const [membranes, setMemb]      = useState(lastVE?.membranes ?? "Intact");
  const [membTime, setMembTime]   = useState(timeInputNow);
  const [contractions, setContr]  = useState(String(lastVE?.contractions ?? 3));

  const submit = () => {
    const prevMembTime = (() => {
      for (let i = bed.ves.length - 1; i >= 0; i--) {
        if (bed.ves[i].membranesTime) return bed.ves[i].membranesTime;
      }
      return null;
    })();

    onSave({
      id: `ve-${Date.now()}`,
      time: timeToISO(time),
      dilation: parseInt(dilation),
      station: parseInt(station),
      presentation,
      membranes,
      membranesTime: membranes !== "Intact"
        ? (prevMembTime && lastVE?.membranes === membranes ? prevMembTime : timeToISO(membTime))
        : null,
      contractions: parseInt(contractions),
    });
  };

  return (
    <div className="min-h-screen pb-24 bg-white">
      <div className="max-w-lg mx-auto">
        <BackHeader title="Record VE" sub={`Bed ${bed.bedNumber} · NICE NG235 §1.4.1 — 4-hourly in active labour`} onBack={onCancel} />
        <div className="px-5 pt-5 space-y-4">
          <TimeField label="Time of VE" value={time} onChange={setTime} />
          <div className="grid grid-cols-2 gap-3">
            <SelectField label="Dilation (cm)" value={dilation} onChange={setDil}
              options={DILATION_OPTIONS.map(String)} getLabel={o => `${o} cm`} />
            <SelectField label="Station" value={station} onChange={setStn}
              options={STATION_OPTIONS.map(String)} getLabel={o => (parseInt(o) > 0 ? `+${o}` : o)} />
          </div>
          <SelectField label="Presentation" value={presentation} onChange={setPres} options={PRESENTATION_OPT} />
          <SelectField label="Membranes" value={membranes} onChange={setMemb} options={MEMBRANE_OPTIONS} />
          {membranes !== "Intact" && (
            <TimeField label={`Time of ${membranes}`} value={membTime} onChange={setMembTime} />
          )}
          <SelectField label="Contractions per 10 min" value={contractions} onChange={setContr}
            options={CONTRACTION_OPT.map(String)} getLabel={o => `${o}/10 min`} />

          {parseInt(contractions) > 5 && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-3">
              <p className="text-xs font-bold text-red-700">Hyperstimulation: &gt; 5 contractions/10 min</p>
              <p className="text-[10px] text-red-500 mt-0.5">Consider reducing / stopping oxytocin · NICE NG235 §1.5.7</p>
            </div>
          )}

          <button onClick={submit}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3.5 rounded-2xl transition-colors">
            Save VE
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Oxytocin Log Form ──────────────────────────────────────────────────

function AddOxytocinForm({ bed, onSave, onCancel }) {
  const [time, setTime] = useState(timeInputNow);
  const [dose, setDose] = useState("2");

  const submit = () => onSave({
    id: `ox-${Date.now()}`,
    startTime: timeToISO(time),
    dose: parseInt(dose),
    lastIncrementTime: timeToISO(time),
  });

  return (
    <div className="min-h-screen pb-24 bg-white">
      <div className="max-w-lg mx-auto">
        <BackHeader title="Oxytocin Log" sub={`Bed ${bed.bedNumber}`} onBack={onCancel} />
        <div className="px-5 pt-5 space-y-4">

          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
            <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wide mb-2">NICE NG235 §1.5.6 — Augmentation protocol</p>
            <ul className="space-y-1">
              {[
                "Start at 1–2 mU/min IV",
                "Increase by 1–2 mU/min every 30 minutes minimum",
                "Target: 3–4 contractions/10 min, each lasting 40–60 seconds",
                "Maximum dose: 20 mU/min",
                "Do NOT routinely use in second stage with regional analgesia [2023]",
                "Hyperstimulation (> 5 contrax/10 min): stop or reduce immediately",
              ].map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-amber-800">
                  <span className="text-amber-400 mt-0.5 shrink-0">›</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <TimeField label="Time of dose change" value={time} onChange={setTime} />
          <SelectField label="Current dose" value={dose} onChange={setDose}
            options={OXYTOCIN_DOSES.map(String)} getLabel={o => `${o} mU/min`} />

          {parseInt(dose) >= 20 && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-3">
              <p className="text-xs font-bold text-red-700">Maximum dose reached — escalate to registrar</p>
              <p className="text-[10px] text-red-500 mt-0.5">NICE NG235 §1.5.6 [2023]</p>
            </div>
          )}

          <button onClick={submit}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3.5 rounded-2xl transition-colors">
            Log dose
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Observations Form ──────────────────────────────────────────────────

function UpdateObsForm({ bed, onSave, onCancel }) {
  const isDiabetic    = (bed.riskFlags ?? []).some(f => f.startsWith("Diabetic"));
  const isHypertensive = (bed.riskFlags ?? []).includes("Hypertensive");
  const timeNow = timeInputNow();

  const [pulse, setPulse] = useState(false);
  const [bp, setBP]       = useState(false);
  const [temp, setTemp]   = useState(false);
  const [bgl, setBGL]     = useState(false);
  const [urine, setUrine] = useState("");

  const submit = () => {
    const t = timeToISO(timeNow);
    const updates = { ...bed.observations };
    if (pulse) updates.lastPulse = t;
    if (bp)    updates.lastBP    = t;
    if (temp)  updates.lastTemp  = t;
    if (bgl)   updates.lastBGL   = t;
    if (urine) { updates.lastUrineCheck = t; updates.urineOutput = parseFloat(urine); }
    onSave(updates);
  };

  const checkItems = [
    { key: "pulse", state: pulse, set: setPulse, label: "Maternal pulse", freq: "Hourly", citation: "NICE NG235 §1.4.5" },
    { key: "bp", state: bp, set: setBP, label: "Blood pressure", freq: isHypertensive ? "Hourly (hypertensive)" : "4-hourly", citation: "NICE NG235 §1.4.5" },
    { key: "temp", state: temp, set: setTemp, label: "Temperature", freq: "4-hourly", citation: "NICE NG235 §1.4.5" },
    ...(isDiabetic ? [{ key: "bgl", state: bgl, set: setBGL, label: "Blood glucose (BGL)", freq: "Hourly · target 4.0–7.0 mmol/L", citation: "GL983 §Intrapartum" }] : []),
  ];

  return (
    <div className="min-h-screen pb-24 bg-white">
      <div className="max-w-lg mx-auto">
        <BackHeader title="Observations" sub={`Bed ${bed.bedNumber} · recorded at ${timeNow}`} onBack={onCancel} />
        <div className="px-5 pt-5 space-y-3">
          <SectionLabel>Tick observations completed now</SectionLabel>

          {checkItems.map(({ key, state, set, label, freq, citation }) => (
            <button key={key} type="button" onClick={() => set(!state)}
              className={`w-full flex items-start gap-3 px-4 py-3.5 rounded-2xl border text-left transition-colors ${state ? "bg-gray-900 border-gray-900" : "bg-white border-gray-200 hover:bg-gray-50"}`}>
              <span className={`w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center mt-0.5 ${state ? "border-white" : "border-gray-300"}`}>
                {state && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
              <div>
                <p className={`text-sm font-semibold leading-tight ${state ? "text-white" : "text-gray-900"}`}>{label}</p>
                <p className={`text-xs mt-0.5 ${state ? "text-gray-300" : "text-gray-400"}`}>{freq}</p>
                <p className={`text-[10px] font-bold uppercase tracking-wide mt-0.5 ${state ? "text-gray-500" : "text-gray-300"}`}>{citation}</p>
              </div>
            </button>
          ))}

          <div className="pt-1">
            <label className="block">
              <span className="block text-xs font-semibold text-gray-500 mb-1.5">
                Urine output (mL/hr) — alert if &lt; 30 mL/hr · NICE NG235 §1.4.5
              </span>
              <input type="number" inputMode="numeric" value={urine} onChange={e => setUrine(e.target.value)}
                placeholder="e.g. 45"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-gray-400 transition-colors" />
            </label>
            {urine && parseFloat(urine) < 30 && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-3 mt-2">
                <p className="text-xs font-bold text-red-700">Oliguria — urine output &lt; 30 mL/hr. Escalate to medical team.</p>
                <p className="text-[10px] text-red-400 mt-0.5">NICE NG235 §1.4.5 [2023]</p>
              </div>
            )}
          </div>

          <button onClick={submit}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3.5 rounded-2xl transition-colors mt-2">
            Save observations
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Bed Detail View ────────────────────────────────────────────────────

function BedDetailView({ bed, alerts, onBack, onUpdate, onDelete, onAddVE, onAddOx, onUpdateObs }) {
  const status = bedStatusColor(alerts);
  const sc     = STATUS_CARD[status];
  const lastVE = bed.ves?.[bed.ves.length - 1];
  const currentOx = bed.oxytocinLog?.[bed.oxytocinLog.length - 1];
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  const setStage = stage => {
    const updates = { labourStage: stage };
    if (stage === "Passive second stage" && !bed.passiveStartTime) updates.passiveStartTime = nowISO();
    if (stage === "Active second stage"  && !bed.pushingStartTime)  updates.pushingStartTime  = nowISO();
    onUpdate(updates);
  };

  return (
    <div className="min-h-screen pb-28 bg-white">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="px-5 pt-14 pb-4 border-b border-gray-100">
          <div className="flex items-start gap-3">
            <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2.5">
                <h2 className="text-2xl font-bold text-gray-900">Bed {bed.bedNumber}</h2>
                <span className={`w-2.5 h-2.5 rounded-full ${sc.dot} shrink-0`} />
              </div>
              <p className="text-sm text-gray-500 mt-0.5">
                {bed.parity} · {bed.gestation} · {bed.modeOfOnset} · admitted {fmtTime(bed.admissionTime)}
              </p>
              {bed.riskFlags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {bed.riskFlags.map(f => (
                    <span key={f} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs font-semibold text-gray-600">{f}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-5 pt-4 space-y-6">

          {/* Alerts */}
          <div>
            <SectionLabel>{alerts.length > 0 ? `${alerts.length} active alert${alerts.length !== 1 ? "s" : ""}` : "Alerts"}</SectionLabel>
            <div className="mt-2 space-y-2">
              {alerts.length === 0 ? (
                <div className="rounded-2xl bg-green-50 border border-green-200 p-4">
                  <p className="text-sm font-bold text-green-700">No active alerts</p>
                  <p className="text-xs text-green-600 mt-0.5">All timers and thresholds within normal limits.</p>
                </div>
              ) : (
                alerts.map(a => <AlertCard key={a.id} alert={a} />)
              )}
            </div>
          </div>

          {/* Labour stage */}
          <div>
            <SectionLabel>Labour stage — NICE NG235 §1.1 [2023]</SectionLabel>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {STAGE_OPTIONS.map(s => {
                const active = bed.labourStage === s;
                const sub =
                  s === "Active second stage" && bed.pushingStartTime
                    ? `Pushing: ${fmtAge(now - new Date(bed.pushingStartTime).getTime())}`
                    : s === "Passive second stage" && bed.passiveStartTime
                    ? `Passive: ${fmtAge(now - new Date(bed.passiveStartTime).getTime())}`
                    : null;
                return (
                  <button key={s} onClick={() => setStage(s)}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-medium text-left transition-colors ${active ? "bg-gray-900 border-gray-900 text-white" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                    <span className="block leading-snug">{s}</span>
                    {sub && <span className={`block text-[10px] mt-0.5 ${active ? "text-gray-400" : "text-gray-400"}`}>{sub}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* VE Log */}
          <div>
            <div className="flex items-center justify-between">
              <SectionLabel>VE log — NICE NG235 §1.4.1 [4-hourly]</SectionLabel>
              <button onClick={onAddVE} className="px-3 py-1 rounded-full bg-gray-900 text-white text-xs font-semibold">+ Add VE</button>
            </div>
            <div className="mt-2">
              {!bed.ves?.length ? (
                <p className="text-sm text-gray-400">No VEs recorded yet.</p>
              ) : (
                <div className="rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm">
                  {[...bed.ves].reverse().map((ve, i) => (
                    <div key={ve.id} className={`px-4 py-3 ${i > 0 ? "border-t border-gray-50" : ""}`}>
                      <div className="flex items-baseline justify-between">
                        <p className="text-sm font-bold text-gray-900">{ve.dilation} cm</p>
                        <p className="text-xs text-gray-400">{fmtTime(ve.time)}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Station {ve.station > 0 ? `+${ve.station}` : ve.station} · {ve.presentation} · {ve.contractions}/10 min
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Membranes: {ve.membranes}{ve.membranesTime ? ` at ${fmtTime(ve.membranesTime)}` : ""}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Oxytocin */}
          <div>
            <div className="flex items-center justify-between">
              <SectionLabel>Oxytocin — NICE NG235 §1.5.6 [30-min increments]</SectionLabel>
              <button onClick={onAddOx} className="px-3 py-1 rounded-full bg-gray-900 text-white text-xs font-semibold">+ Log</button>
            </div>
            <div className="mt-2">
              {!currentOx ? (
                <p className="text-sm text-gray-400">No oxytocin logged.</p>
              ) : (
                <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-4">
                  <div className="flex items-baseline justify-between">
                    <p className="text-base font-bold text-gray-900">{currentOx.dose} mU/min</p>
                    <p className="text-xs text-gray-400">since {fmtTime(currentOx.startTime)}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Last increment: {fmtTime(currentOx.lastIncrementTime)} · {fmtAge(now - new Date(currentOx.lastIncrementTime).getTime())} ago
                  </p>
                  {bed.oxytocinLog.length > 1 && (
                    <div className="mt-2 space-y-1">
                      {[...bed.oxytocinLog].reverse().slice(1, 4).map(e => (
                        <p key={e.id} className="text-[11px] text-gray-400">{fmtTime(e.startTime)} — {e.dose} mU/min</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Observations */}
          <div>
            <div className="flex items-center justify-between">
              <SectionLabel>Observations — NICE NG235 §1.4.5</SectionLabel>
              <button onClick={onUpdateObs} className="px-3 py-1 rounded-full bg-gray-900 text-white text-xs font-semibold">Update</button>
            </div>
            <div className="mt-2 rounded-2xl border border-gray-100 bg-white shadow-sm">
              {[
                { label: "Pulse (hourly)", val: bed.observations?.lastPulse },
                { label: "BP", val: bed.observations?.lastBP },
                { label: "Temperature (4-hourly)", val: bed.observations?.lastTemp },
                ...(bed.riskFlags?.some(f => f.startsWith("Diabetic"))
                  ? [{ label: "BGL (hourly, target 4–7 mmol/L)", val: bed.observations?.lastBGL }]
                  : []),
              ].map(({ label, val }, i) => (
                <div key={label} className={`flex items-center justify-between px-4 py-2.5 ${i > 0 ? "border-t border-gray-50" : ""}`}>
                  <p className="text-xs text-gray-600">{label}</p>
                  <p className={`text-xs font-semibold ${val ? "text-gray-900" : "text-gray-300"}`}>{val ? fmtTime(val) : "Not recorded"}</p>
                </div>
              ))}
              {bed.observations?.urineOutput !== undefined && (
                <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-50">
                  <p className="text-xs text-gray-600">Urine output (mL/hr)</p>
                  <p className={`text-xs font-semibold ${bed.observations.urineOutput < 30 ? "text-red-600" : "text-gray-900"}`}>
                    {bed.observations.urineOutput} mL/hr{bed.observations.urineOutput < 30 ? " — LOW" : ""}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Analgesia */}
          <div>
            <SectionLabel>Analgesia</SectionLabel>
            <div className="mt-2 flex flex-wrap gap-2">
              {ANALGESIA_OPTIONS.map(opt => (
                <button key={opt} onClick={() => onUpdate({ analgesia: opt })}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${bed.analgesia === opt ? "bg-gray-900 border-gray-900 text-white" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                  {opt}
                </button>
              ))}
            </div>
            {(bed.analgesia === "Epidural" || bed.analgesia === "Remifentanil PCA") && (
              <p className="text-[10px] text-gray-400 mt-1.5">Regional analgesia — second stage limits extended · NICE NG235 §1.6.5</p>
            )}
          </div>

          {/* Delete */}
          <div className="pt-2 space-y-2">
            <button
              onClick={() => { if (window.confirm(`Discharge Bed ${bed.bedNumber} from the ward?`)) onDelete(); }}
              className="w-full border border-red-200 text-red-500 hover:bg-red-50 font-medium py-3 rounded-2xl transition-colors text-sm">
              Discharge / Remove bed
            </button>
            <p className="text-[10px] text-gray-300 text-center leading-relaxed pb-2">
              All thresholds from NICE NG235 (Intrapartum Care, Sept 2023), GL983 &amp; GL787.
              Not a substitute for clinical judgement. Always escalate when uncertain.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Board View ─────────────────────────────────────────────────────────

function BoardView({ beds, alertsMap, onSelect, onAddBed, onClear }) {
  const bedList = Object.values(beds).sort((a, b) =>
    a.bedNumber.localeCompare(b.bedNumber, undefined, { numeric: true })
  );
  const totalUrgent = Object.values(alertsMap).flat().filter(a => a.severity === "urgent").length;

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-lg mx-auto">
        <div className="px-5 pt-16 pb-4 flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Labour Ward</h2>
            <p className="text-sm text-gray-400 mt-1">
              {bedList.length === 0
                ? "No patients — tap Add bed to start"
                : `${bedList.length} patient${bedList.length !== 1 ? "s" : ""}${totalUrgent > 0 ? ` · ${totalUrgent} urgent alert${totalUrgent !== 1 ? "s" : ""}` : ""}`}
            </p>
          </div>
          <div className="flex gap-2 mt-1">
            {bedList.length > 0 && (
              <button onClick={() => { if (window.confirm("Clear all beds from the ward?")) onClear(); }}
                className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-600 transition-colors">
                Clear all
              </button>
            )}
            <button onClick={onAddBed}
              className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold transition-colors">
              + Add bed
            </button>
          </div>
        </div>

        {bedList.length === 0 && (
          <div className="px-5 mt-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 11h.01M8 11h.01" />
              </svg>
            </div>
            <p className="text-gray-400 text-sm font-medium">No patients on the ward</p>
            <p className="text-gray-300 text-xs mt-1">Data is stored locally on this device only.</p>
          </div>
        )}

        <div className="px-5 space-y-3">
          {bedList.map(bed => {
            const alerts   = alertsMap[bed.id] ?? [];
            const status   = bedStatusColor(alerts);
            const sc       = STATUS_CARD[status];
            const lastVE   = bed.ves?.[bed.ves.length - 1];
            const urgentN  = alerts.filter(a => a.severity === "urgent").length;
            const totalN   = alerts.length;

            return (
              <button key={bed.id} onClick={() => onSelect(bed.id)}
                className={`w-full rounded-2xl border p-4 text-left transition-all hover:shadow-sm active:scale-[0.99] ${sc.card}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-gray-900">Bed {bed.bedNumber}</span>
                    <span className={`w-2 h-2 rounded-full ${sc.dot} shrink-0`} />
                  </div>
                  {totalN > 0 && (
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${sc.badge}`}>
                      {urgentN > 0 ? `${urgentN} urgent` : `${totalN} alert${totalN !== 1 ? "s" : ""}`}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {bed.parity} · {bed.gestation} · {bed.modeOfOnset}
                  {bed.analgesia !== "None" ? ` · ${bed.analgesia}` : ""}
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-xs font-medium text-gray-500 bg-white/80 px-2 py-0.5 rounded-full border border-white/60">
                    {bed.labourStage}
                  </span>
                  {lastVE && (
                    <span className="text-xs text-gray-500">{lastVE.dilation} cm · {fmtTime(lastVE.time)}</span>
                  )}
                </div>
                {bed.riskFlags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {bed.riskFlags.map(f => (
                      <span key={f} className="text-[10px] font-semibold text-gray-500 bg-white/80 border border-gray-200 px-1.5 py-0.5 rounded-full">{f}</span>
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {bedList.length > 0 && (
          <p className="text-[10px] text-gray-300 text-center mt-8 px-5 leading-relaxed pb-2">
            Clinical thresholds from NICE NG235 (Intrapartum Care, Sept 2023) · GL983 · GL787.
            Not a substitute for clinical judgement. Always escalate when uncertain.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Root component ─────────────────────────────────────────────────────

export default function WardPage() {
  const [beds, setBeds]         = useState(loadBeds);
  const [selectedId, setSelId]  = useState(null);
  const [view, setView]         = useState("board");
  const [tick, setTick]         = useState(0);

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

  const selectedBed    = selectedId ? beds[selectedId] : null;
  const selectedAlerts = selectedBed ? (alertsMap[selectedId] ?? []) : [];

  const updateBed = useCallback((id, updates) => {
    setBeds(prev => ({ ...prev, [id]: { ...prev[id], ...updates } }));
  }, []);

  if (view === "addBed") {
    return (
      <AddBedForm
        existingNumbers={Object.values(beds).map(b => b.bedNumber)}
        onSave={bed => { setBeds(prev => ({ ...prev, [bed.id]: bed })); setView("board"); }}
        onCancel={() => setView("board")}
      />
    );
  }

  if (view === "addVE" && selectedBed) {
    return (
      <AddVEForm
        bed={selectedBed}
        onSave={ve => { updateBed(selectedId, { ves: [...selectedBed.ves, ve] }); setView("detail"); }}
        onCancel={() => setView("detail")}
      />
    );
  }

  if (view === "addOx" && selectedBed) {
    return (
      <AddOxytocinForm
        bed={selectedBed}
        onSave={entry => { updateBed(selectedId, { oxytocinLog: [...selectedBed.oxytocinLog, entry] }); setView("detail"); }}
        onCancel={() => setView("detail")}
      />
    );
  }

  if (view === "updateObs" && selectedBed) {
    return (
      <UpdateObsForm
        bed={selectedBed}
        onSave={obs => { updateBed(selectedId, { observations: obs }); setView("detail"); }}
        onCancel={() => setView("detail")}
      />
    );
  }

  if (view === "detail" && selectedBed) {
    return (
      <BedDetailView
        bed={selectedBed}
        alerts={selectedAlerts}
        onBack={() => { setSelId(null); setView("board"); }}
        onUpdate={updates => updateBed(selectedId, updates)}
        onDelete={() => {
          setBeds(prev => { const n = { ...prev }; delete n[selectedId]; return n; });
          setSelId(null); setView("board");
        }}
        onAddVE={() => setView("addVE")}
        onAddOx={() => setView("addOx")}
        onUpdateObs={() => setView("updateObs")}
      />
    );
  }

  return (
    <BoardView
      beds={beds}
      alertsMap={alertsMap}
      onSelect={id => { setSelId(id); setView("detail"); }}
      onAddBed={() => setView("addBed")}
      onClear={() => setBeds({})}
    />
  );
}
