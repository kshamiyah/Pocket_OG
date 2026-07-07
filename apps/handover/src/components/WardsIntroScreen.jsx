import { useState } from "react";
import { totalBeds } from "../utils/wardLayouts";

// Shown once, right after the intro, before the first-ever Shift pick.
// Each ward goes straight into the real bed-setup screen (same one used
// everywhere else), then returns here to add the next one or finish —
// "no beds for this ward" is already a built-in option over there.
export default function WardsIntroScreen({ wardLayouts, onAddWard, onComplete }) {
  const [value, setValue] = useState("");
  const wards = Object.keys(wardLayouts);

  const add = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAddWard(trimmed);
    setValue("");
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-950">
      <div
        className="flex-1 min-h-0 overflow-y-auto px-6"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 3rem)" }}
      >
        <h1 className="text-gray-900 dark:text-white text-3xl font-bold leading-tight mb-1">Add your wards</h1>
        <p className="text-gray-500 text-[15px] mb-8">
          Add one at a time and set up its beds. You can always add more later.
        </p>

        <div className="flex gap-2 mb-4">
          <input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            placeholder="Ward name"
            className="flex-1 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-3 text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
          />
          <button
            onClick={add}
            disabled={!value.trim()}
            className="shrink-0 px-5 py-3 rounded-xl bg-amber-600 disabled:bg-gray-200 dark:disabled:bg-gray-800 text-white disabled:text-gray-400 text-base font-bold active:scale-95 transition-all min-h-[48px]"
          >
            Add
          </button>
        </div>

        {wards.length > 0 && (
          <div className="flex flex-col gap-2.5">
            {wards.map((w) => {
              const count = totalBeds(wardLayouts[w]);
              return (
                <button
                  key={w}
                  onClick={() => onAddWard(w)}
                  className="text-left rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40 px-4 py-3.5 flex items-center justify-between active:scale-[0.98] transition-all min-h-[56px]"
                >
                  <span className="text-[15px] font-bold text-gray-900 dark:text-white">{w}</span>
                  <span className="text-[13px] text-gray-400 dark:text-gray-600">{count > 0 ? `${count} beds` : "No beds"}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="shrink-0 px-6" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 2rem)" }}>
        <button
          onClick={onComplete}
          className="w-full py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-950 text-base font-bold active:scale-95 transition-all min-h-[56px]"
        >
          {wards.length > 0 ? "Continue" : "Skip for now"}
        </button>
      </div>
    </div>
  );
}
