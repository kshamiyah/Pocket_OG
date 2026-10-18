import { useEffect, useState } from "react";
import { advance, jumpTo, resetClock, simOffset } from "./clock";
import { clock, fmtAge } from "../utils/time";

const MIN = 60000;

/** Floating clock control for the private test board. Not in the live app. */
export default function SimBar({ rows }) {
  const [open, setOpen] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const on = () => setNow(Date.now());
    window.addEventListener("sim-clock", on);
    const id = setInterval(on, 15000);
    return () => { window.removeEventListener("sim-clock", on); clearInterval(id); };
  }, []);

  // The soonest thing the board is waiting for, across every bed.
  const next = rows
    .map(r => r.t?.next && { ...r.t.next, bed: r.bed.bedNumber })
    .filter(n => n && n.at > now)
    .sort((a, b) => a.at - b.at)[0] ?? null;
  const ahead = simOffset();
  const btn = "min-h-10 px-3 rounded-lg text-sm font-semibold bg-white/15 active:bg-white/25 text-white";

  return (
    // A slim tab on the left edge, mid-screen: it sits over the page margin,
    // so it never covers a close button, a chip or a footer button.
    <div className="fixed z-[70] left-0 top-1/2 -translate-y-1/2">
      {!open ? (
        <button type="button" onClick={() => setOpen(true)} aria-label="Simulation clock"
          className="w-4 py-2 rounded-r-md bg-violet-700/90 text-white text-[9px] font-bold shadow-lg tabular-nums leading-tight flex flex-col items-center gap-0.5">
          <span aria-hidden="true">⏱</span>
          <span className="[writing-mode:vertical-rl] rotate-180">{clock(now)}</span>
        </button>
      ) : (
        <div className="ml-2 w-[17.5rem] rounded-2xl bg-violet-800 text-white shadow-2xl p-3 space-y-2.5">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold tabular-nums">{clock(now)}</span>
            <button type="button" onClick={() => setOpen(false)} className="text-sm font-semibold text-violet-200 min-h-8 px-2">Hide</button>
          </div>
          <p className="text-xs text-violet-200">Simulation clock · {ahead ? `${fmtAge(ahead)} ahead of real time` : "real time"}</p>
          <div className="grid grid-cols-3 gap-1.5">
            <button type="button" className={btn} onClick={() => advance(15 * MIN)}>+15 min</button>
            <button type="button" className={btn} onClick={() => advance(60 * MIN)}>+1 h</button>
            <button type="button" className={btn} onClick={() => advance(240 * MIN)}>+4 h</button>
          </div>
          <button type="button" disabled={!next} onClick={() => next && jumpTo(next.at)}
            className="w-full min-h-11 rounded-lg text-sm font-bold bg-white text-violet-800 disabled:opacity-40">
            {next ? `Next due: Bed ${next.bed} ${next.label} at ${clock(next.at)}` : "Nothing due"}
          </button>
          {ahead > 0 && (
            <button type="button" onClick={resetClock} className="w-full min-h-9 text-xs font-semibold text-violet-200 underline">
              Back to real time
            </button>
          )}
          {/* Start a test case from an empty board: two taps so it cannot happen by accident. */}
          <button type="button"
            onClick={() => {
              if (!confirmClear) { setConfirmClear(true); return; }
              try { localStorage.removeItem("pocket_og_ward_beds"); localStorage.removeItem("pocket_og_iol_queue"); localStorage.removeItem("pocket_og_ward_removed"); } catch { /* storage blocked */ }
              resetClock();
              location.reload();
            }}
            className={`w-full min-h-10 rounded-lg text-sm font-semibold ${confirmClear ? "bg-red-600 text-white" : "bg-white/10 text-violet-100"}`}>
            {confirmClear ? "Tap again to remove every patient" : "Clear board and reset clock"}
          </button>
        </div>
      )}
    </div>
  );
}
