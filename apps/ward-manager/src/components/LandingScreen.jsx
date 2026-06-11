import { useState, useEffect } from "react";

const BEDS_KEY = "pocket_og_ward_beds";

function bedCount() {
  try {
    const b = JSON.parse(localStorage.getItem(BEDS_KEY) ?? "{}");
    return Object.keys(b).length;
  } catch { return 0; }
}

export default function LandingScreen({ onBegin }) {
  const [now, setNow] = useState(new Date());
  const count = bedCount();

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hh  = String(now.getHours()).padStart(2, "0");
  const mm  = String(now.getMinutes()).padStart(2, "0");
  const ss  = String(now.getSeconds()).padStart(2, "0");

  const DAYS   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dateStr = `${DAYS[now.getDay()]} ${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center px-6"
      style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}>

      {/* Clock */}
      <div className="text-center mb-14">
        <p className="font-mono text-gray-900 dark:text-white leading-none select-none"
          style={{ fontSize: "clamp(80px, 22vw, 128px)", fontWeight: 700, letterSpacing: "-0.02em" }}>
          {hh}:{mm}
          <span className="text-gray-300 dark:text-gray-700">:{ss}</span>
        </p>
        <p className="text-gray-500 text-lg mt-3 font-medium">{dateStr}</p>
      </div>

      {/* Patients hint */}
      {count > 0 && (
        <div className="mb-8">
          <span className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-sm font-medium">
            {count} patient{count !== 1 ? "s" : ""} on board
          </span>
        </div>
      )}

      {/* CTA */}
      <button onClick={onBegin}
        className="w-full max-w-sm py-5 rounded-3xl bg-gray-900 dark:bg-white text-white dark:text-gray-950 text-lg font-bold tracking-tight active:scale-95 transition-all shadow-xl">
        Begin Shift
      </button>

      <p className="text-gray-400 dark:text-gray-700 text-[11px] font-semibold tracking-widest uppercase mt-10">
        PocketSuite · Labour Ward
      </p>
    </div>
  );
}
