import { useMemo, useState } from "react";
import Sheet from "../ui/Sheet";
import { Label, WhenPicker } from "../ui/atoms";
import { BTN, BTN_PRIMARY, BTN_SECONDARY, INPUT, TYPE_META } from "../ui/styles";
import { resolveWhen } from "../utils/time";
import { computeAlerts } from "../utils/wardAlerts";
import { isDiabetic, recordObs, stampObs } from "../utils/bedModel";
import { tidy } from "../utils/triage";

// Which alerts belong to which field, so the box can colour itself from the
// engine's own thresholds (no numbers are repeated here).
const FIELD_ALERTS = {
  pulse: ["tachycardia"],
  bp: ["bp-severe", "bp-elevated", "bp-low"],
  temp: ["temp-38", "temp-375", "temp-low"],
  rr: ["rr-high", "rr-low"],
  bgl: ["bgl-low", "bgl-high"],
};
const FIELD_TONE = {
  urgent: "border-red-400 dark:border-red-700 bg-red-50 dark:bg-red-950/30",
  warning: "border-claude-400 dark:border-claude-700 bg-claude-50 dark:bg-claude-950/30",
};

function NumBox({ id, label, unit, value, onChange, decimal = false, tone, placeholder }) {
  return (
    <label htmlFor={id} className="block">
      <span className="flex items-baseline justify-between mb-1">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</span>
        <span className="text-[11px] text-gray-400">{unit}</span>
      </span>
      <input id={id} type="text" inputMode={decimal ? "decimal" : "numeric"} autoComplete="off" value={value}
        onChange={e => onChange(e.target.value.replace(decimal ? /[^\d.]/g : /\D/g, "").slice(0, decimal ? 4 : 3))}
        placeholder={placeholder}
        className={`${INPUT} !h-11 text-lg font-semibold tabular-nums ${tone ? FIELD_TONE[tone] : ""}`} />
    </label>
  );
}

/** Quick obs: enter what you have, backdate if needed, see abnormal values at once. */
export default function ObsSheet({ bed, onSave, onClose }) {
  const obs = bed.observations ?? {};
  const [v, setV] = useState({ pulse: "", sys: "", dia: "", temp: "", rr: "", bgl: "" });
  const [when, setWhen] = useState({ minsAgo: 0 });
  const iso = resolveWhen(when);
  const set = k => x => setV(p => ({ ...p, [k]: x }));
  const entries = {
    pulse: v.pulse, temp: v.temp, rr: v.rr,
    ...(v.sys && v.dia ? { bp: [v.sys, v.dia] } : {}),
    ...(isDiabetic(bed) ? { bgl: v.bgl } : {}),
  };
  const any = Object.values(entries).some(x => Array.isArray(x) ? x.every(Boolean) : !!x);
  const bpHalf = (v.sys && !v.dia) || (!v.sys && v.dia);

  // Preview the alerts these values would raise.
  const preview = useMemo(() => {
    if (!any || !iso) return [];
    const next = { ...bed, ...recordObs(bed, iso, entries) };
    const ids = new Set(Object.values(FIELD_ALERTS).flat());
    return computeAlerts(next).filter(a => ids.has(a.id));
  }, [v, iso]); // eslint-disable-line react-hooks/exhaustive-deps
  const toneOf = field => {
    const hit = preview.filter(a => FIELD_ALERTS[field].includes(a.id));
    return hit.some(a => a.severity === "urgent") ? "urgent" : hit.length ? "warning" : null;
  };
  const last = val => (val ? `last ${val}` : "");

  return (
    <Sheet open dense onClose={onClose} title={`Obs · Bed ${bed.bedNumber}`} sub="Enter what you have. Values stay until a newer one replaces them."
      footer={
        <div className="grid grid-cols-[1fr_2fr] gap-2">
          <button type="button" disabled={!iso} onClick={() => iso && onSave(stampObs(bed, iso), "Obs done")}
            className={`${BTN} ${BTN_SECONDARY} whitespace-nowrap`}>Done, no values</button>
          <button type="button" disabled={!iso || !any || bpHalf} onClick={() => onSave(recordObs(bed, iso, entries), "Obs recorded")}
            className={`${BTN} ${BTN_PRIMARY} min-h-[3.25rem] text-base`}>{bpHalf ? "Add both BP numbers" : "Save obs"}</button>
        </div>
      }>
      <div className="grid grid-cols-2 gap-3">
        <NumBox id="obs-pulse" label="Pulse" unit="bpm" value={v.pulse} onChange={set("pulse")} tone={toneOf("pulse")} placeholder={last(obs.pulseValue)} />
        <NumBox id="obs-temp" label="Temp" unit="°C" decimal value={v.temp} onChange={set("temp")} tone={toneOf("temp")} placeholder={last(obs.tempValue)} />
        <div className="col-span-2 grid grid-cols-2 gap-3">
          <NumBox id="obs-sys" label="BP systolic" unit="mmHg" value={v.sys} onChange={set("sys")} tone={toneOf("bp")} placeholder={obs.bpSystolic ? `last ${obs.bpSystolic}` : ""} />
          <NumBox id="obs-dia" label="Diastolic" unit="mmHg" value={v.dia} onChange={set("dia")} tone={toneOf("bp")} placeholder={obs.bpDiastolic ? `last ${obs.bpDiastolic}` : ""} />
        </div>
        <NumBox id="obs-rr" label="Resp rate" unit="/min" value={v.rr} onChange={set("rr")} tone={toneOf("rr")} placeholder={last(obs.rrValue)} />
        {isDiabetic(bed) && <NumBox id="obs-bgl" label="Glucose" unit="mmol/L" decimal value={v.bgl} onChange={set("bgl")} tone={toneOf("bgl")} placeholder={last(obs.bglValue)} />}
      </div>
      {preview.length > 0 && (
        <div className="space-y-1">
          {preview.map(a => <p key={a.id} className={`text-sm font-semibold ${a.severity === "urgent" ? "text-red-600 dark:text-red-400" : "text-claude-700 dark:text-claude-400"}`}>{tidy(a.title)}</p>)}
        </div>
      )}
      <WhenPicker tight label="Taken" value={when} onChange={setWhen} presets={[0, 15, 30, 60]} />
      <div>
        <Label tight>Schedule</Label>
        <p className={TYPE_META}>Pulse hourly; BP, temperature and respiratory rate 4-hourly (BP hourly if hypertensive){isDiabetic(bed) ? "; glucose hourly" : ""}. NICE NG235 1.8.19, NG133 1.7.3{isDiabetic(bed) ? ", NG3 1.4.10" : ""}.</p>
      </div>
    </Sheet>
  );
}
