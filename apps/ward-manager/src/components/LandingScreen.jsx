import { useEffect, useState } from "react";
import { BTN, BTN_PRIMARY, TYPE_EYEBROW, TYPE_META } from "../ui/styles";

const BEDS_KEY = "pocket_og_ward_beds";

function bedCount() {
  try { return Object.keys(JSON.parse(localStorage.getItem(BEDS_KEY) ?? "{}")).length; } catch { return 0; }
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function LandingScreen({ onBegin }) {
  const [now, setNow] = useState(new Date());
  const count = bedCount();
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");

  return (
    <div className="min-h-dvh bg-white dark:bg-gray-950 flex flex-col"
      style={{ paddingTop: "calc(env(safe-area-inset-top) + 2rem)", paddingBottom: "calc(env(safe-area-inset-bottom) + 1.5rem)" }}>
      <div className="max-w-lg w-full mx-auto px-6 flex-1 flex flex-col">
        <span className={TYPE_EYEBROW}>PocketSuite · Labour ward</span>
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-2">
          <p className="font-semibold tabular-nums leading-none text-gray-900 dark:text-white" style={{ fontSize: "clamp(72px, 20vw, 112px)", letterSpacing: "-0.03em" }}>
            {hh}<span className="text-claude-600">:</span>{mm}
          </p>
          <p className="text-base text-gray-500 dark:text-gray-400">{DAYS[now.getDay()]} {now.getDate()} {MONTHS[now.getMonth()]}</p>
          {count > 0 && (
            <span className="mt-4 px-3 py-1.5 rounded-full text-xs font-semibold bg-claude-100 dark:bg-claude-950/40 text-claude-800 dark:text-claude-300 border border-claude-200 dark:border-claude-800">
              {count} {count === 1 ? "woman" : "women"} on the board
            </span>
          )}
        </div>
        <button type="button" onClick={onBegin} className={`${BTN} ${BTN_PRIMARY} w-full min-h-[3.5rem] text-base`}>Begin shift</button>
        <p className={`${TYPE_META} text-center mt-3`}>Decision aid only. Not a substitute for clinical judgement.</p>
      </div>
    </div>
  );
}
