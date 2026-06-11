import { useState } from "react";

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
  const h   = String(date.getHours()).padStart(2, "0");
  const m   = String(date.getMinutes()).padStart(2, "0");
  const now = new Date();
  const tomorrow = date.getDate() !== now.getDate() || date.getMonth() !== now.getMonth();
  return `${h}:${m}${tomorrow ? " tomorrow" : ""}`;
}

export default function ShiftSetup({ onComplete }) {
  const savedName = (() => { try { return localStorage.getItem(DOCTOR_KEY) ?? ""; } catch { return ""; } })();

  const [page,       setPage]       = useState(1);
  const [name,       setName]       = useState(savedName);
  const [shiftType,  setShiftType]  = useState(detectShiftType);
  const [durationH,  setDurationH]  = useState(() => detectShiftType() === "night" ? 12 : 8);
  const [useCustom,  setUseCustom]  = useState(false);
  const [customTime, setCustomTime] = useState("");

  const greeting = (() => {
    const h = new Date().getHours();
    return h < 12 ? "morning" : h < 18 ? "afternoon" : "evening";
  })();

  const endTime = useCustom && customTime ? parseCustomEnd(customTime) : addHours(durationH);

  const DURATIONS = shiftType === "night" ? [10, 12, 13] : [8, 10, 12];

  const start = () => {
    const doctorName = name.trim() || "Doctor";
    try { localStorage.setItem(DOCTOR_KEY, doctorName); } catch {}
    onComplete({
      doctorName,
      shiftType,
      shiftStart: new Date().toISOString(),
      shiftEnd:   endTime.toISOString(),
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col px-6"
      style={{ paddingTop: "calc(env(safe-area-inset-top) + 3rem)", paddingBottom: "calc(env(safe-area-inset-bottom) + 2rem)" }}>

      {/* Progress dots */}
      <div className="flex gap-1.5 mb-12">
        {[1, 2].map(p => (
          <div key={p} className={`h-1 rounded-full transition-all duration-300 ${p === page ? "w-6 bg-gray-900 dark:bg-white" : "w-1.5 bg-gray-300 dark:bg-gray-700"}`} />
        ))}
      </div>

      {/* ── Page 1: Name ───────────────────────────────── */}
      {page === 1 && (
        <div className="flex-1 flex flex-col">
          <p className="text-gray-500 text-base mb-2">Good {greeting}, Doctor.</p>
          <h1 className="text-gray-900 dark:text-white text-3xl font-bold leading-tight mb-10">
            What should we<br />call you?
          </h1>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg font-medium pointer-events-none">
              Dr.
            </span>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && setPage(2)}
              placeholder="Your name"
              className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 rounded-2xl pl-12 pr-4 py-4 text-lg font-medium focus:outline-none focus:border-gray-400 dark:focus:border-gray-600 transition-colors"
            />
          </div>

          <div className="mt-auto pt-8">
            <button onClick={() => setPage(2)}
              className="w-full py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-950 text-base font-bold active:scale-95 transition-all">
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* ── Page 2: Shift ──────────────────────────────── */}
      {page === 2 && (
        <div className="flex-1 flex flex-col">
          <h1 className="text-gray-900 dark:text-white text-3xl font-bold leading-tight mb-1">Your shift</h1>
          <p className="text-gray-500 text-base mb-8">Dr. {name.trim() || "Doctor"}</p>

          {/* Day / Night */}
          <p className="text-gray-600 text-[11px] font-bold uppercase tracking-widest mb-2">Type</p>
          <div className="flex gap-2 mb-8">
            {[
              { key: "day",   label: "Day",   icon: "☀︎" },
              { key: "night", label: "Night", icon: "☾" },
            ].map(({ key, label, icon }) => (
              <button key={key}
                onClick={() => { setShiftType(key); setDurationH(key === "night" ? 12 : 8); setUseCustom(false); }}
                className={`flex-1 py-3.5 rounded-xl text-sm font-bold transition-colors ${
                  shiftType === key
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-950"
                    : "bg-gray-100 dark:bg-gray-900 text-gray-500 border border-gray-200 dark:border-gray-800"
                }`}>
                {icon} {label}
              </button>
            ))}
          </div>

          {/* Duration presets */}
          <p className="text-gray-600 text-[11px] font-bold uppercase tracking-widest mb-2">Length</p>
          <div className="flex gap-2 mb-2">
            {DURATIONS.map(h => (
              <button key={h}
                onClick={() => { setDurationH(h); setUseCustom(false); }}
                className={`flex-1 py-3.5 rounded-xl text-sm font-bold transition-colors ${
                  !useCustom && durationH === h
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-950"
                    : "bg-gray-100 dark:bg-gray-900 text-gray-500 border border-gray-200 dark:border-gray-800"
                }`}>
                {h}h
              </button>
            ))}
          </div>

          {/* Custom */}
          <div className="flex gap-2 items-center mb-8">
            <button onClick={() => { setUseCustom(true); }}
              className={`px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                useCustom
                  ? "bg-gray-900 dark:bg-white text-white dark:text-gray-950"
                  : "bg-gray-100 dark:bg-gray-900 text-gray-500 border border-gray-200 dark:border-gray-800"
              }`}>
              Custom
            </button>
            {useCustom && (
              <input type="time" autoFocus value={customTime}
                onChange={e => setCustomTime(e.target.value)}
                className="flex-1 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-gray-400 dark:focus:border-gray-500" />
            )}
          </div>

          {/* End time preview */}
          <div className="p-5 rounded-2xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <p className="text-gray-600 text-[11px] font-bold uppercase tracking-widest mb-1">Handing over at</p>
            <p className="text-gray-900 dark:text-white text-3xl font-bold tracking-tight">{fmtEndPreview(endTime)}</p>
          </div>

          <div className="mt-auto pt-8 flex gap-3">
            <button onClick={() => setPage(1)}
              className="w-12 h-14 rounded-2xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-500 shrink-0 active:scale-95 transition-all">
              ←
            </button>
            <button onClick={start}
              className="flex-1 py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-950 text-base font-bold active:scale-95 transition-all">
              Start Shift
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
