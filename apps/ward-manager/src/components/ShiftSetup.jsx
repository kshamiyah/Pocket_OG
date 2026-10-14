import { useState } from "react";
import { Chip, Label } from "../ui/atoms";
import { BTN, BTN_PRIMARY, CARD, INPUT, TYPE_DISPLAY, TYPE_EYEBROW, TYPE_META } from "../ui/styles";

const DOCTOR_KEY = "pocket_suite_doctor";

function detectShiftType() {
  const h = new Date().getHours();
  return h >= 20 || h < 8 ? "night" : "day";
}

function addHours(h) {
  const d = new Date();
  d.setHours(d.getHours() + h, d.getMinutes(), 0, 0);
  return d;
}

function parseCustomEnd(timeStr) {
  const d = new Date();
  const [h, m] = timeStr.split(":").map(Number);
  d.setHours(h, m, 0, 0);
  if (d <= new Date()) d.setDate(d.getDate() + 1);
  return d;
}

function fmtEndPreview(date) {
  const now = new Date();
  const tomorrow = date.getDate() !== now.getDate() || date.getMonth() !== now.getMonth();
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}${tomorrow ? " tomorrow" : ""}`;
}

export default function ShiftSetup({ onComplete, onBack }) {
  const savedName = (() => { try { return localStorage.getItem(DOCTOR_KEY) ?? ""; } catch { return ""; } })();
  const [name, setName] = useState(savedName === "Doctor" ? "" : savedName);
  const [shiftType, setShiftType] = useState(detectShiftType);
  const [durationH, setDurationH] = useState(() => (detectShiftType() === "night" ? 12 : 8));
  const [useCustom, setUseCustom] = useState(false);
  const [customTime, setCustomTime] = useState("");

  const h = new Date().getHours();
  const greeting = h < 12 ? "morning" : h < 18 ? "afternoon" : "evening";
  const endTime = useCustom && customTime ? parseCustomEnd(customTime) : addHours(durationH);
  const DURATIONS = shiftType === "night" ? [10, 12, 13] : [8, 10, 12];

  const start = () => {
    const doctorName = name.trim() || "Doctor";
    try { localStorage.setItem(DOCTOR_KEY, doctorName); } catch { /* ignore */ }
    onComplete({ doctorName, shiftType, shiftStart: new Date().toISOString(), shiftEnd: endTime.toISOString() });
  };

  return (
    <div className="min-h-dvh bg-white dark:bg-gray-950 flex flex-col"
      style={{ paddingTop: "calc(env(safe-area-inset-top) + 1.5rem)", paddingBottom: "calc(env(safe-area-inset-bottom) + 1.25rem)" }}>
      <div className="max-w-lg w-full mx-auto px-6 flex-1 flex flex-col gap-6">
        {onBack && (
          <button type="button" onClick={onBack} className="self-start text-sm font-semibold text-claude-700 dark:text-claude-400 min-h-10">Back</button>
        )}
        <div>
          <span className={`${TYPE_EYEBROW} block mb-2`}>New shift</span>
          <p className="text-base text-gray-600 dark:text-gray-400">Good {greeting}{savedName && savedName !== "Doctor" ? <>, <b className="text-gray-900 dark:text-white">Dr {savedName}</b></> : null}.</p>
          <h1 className={`${TYPE_DISPLAY} mt-1`}>Starting a labour ward shift?</h1>
        </div>

        <div>
          <Label>Your name</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium pointer-events-none">Dr</span>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className={`${INPUT} pl-10`} aria-label="Your name" />
          </div>
        </div>

        <div>
          <Label>Shift</Label>
          <div className="grid grid-cols-2 gap-2">
            {[["day", "Day"], ["night", "Night"]].map(([key, label]) => (
              <Chip key={key} on={shiftType === key} className="min-h-12 text-base"
                onClick={() => { setShiftType(key); setDurationH(key === "night" ? 12 : 8); setUseCustom(false); }}>{label}</Chip>
            ))}
          </div>
        </div>

        <div>
          <Label>Length</Label>
          <div className="flex gap-2 flex-wrap">
            {DURATIONS.map(d => <Chip key={d} on={!useCustom && durationH === d} onClick={() => { setDurationH(d); setUseCustom(false); }}>{d}h</Chip>)}
            <Chip on={useCustom} onClick={() => setUseCustom(true)}>Ends at…</Chip>
          </div>
          {useCustom && <input type="time" value={customTime} onChange={e => setCustomTime(e.target.value)} className={`${INPUT} mt-2`} aria-label="Shift end time" />}
        </div>

        <div className={`${CARD} px-4 py-3`}>
          <p className={TYPE_META}>Handing over at</p>
          <p className="text-2xl font-semibold tabular-nums text-gray-900 dark:text-white">{fmtEndPreview(endTime)}</p>
        </div>

        <div className="mt-auto">
          <button type="button" onClick={start} className={`${BTN} ${BTN_PRIMARY} w-full min-h-[3.25rem] text-base`}>Start shift</button>
        </div>
      </div>
    </div>
  );
}
