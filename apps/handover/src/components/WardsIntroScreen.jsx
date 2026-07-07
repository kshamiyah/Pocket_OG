import { useState } from "react";
import { totalBeds } from "../utils/wardLayouts";
import { SCREEN, SCREEN_FOOTER, SCREEN_SCROLL, safeBottom, safeTop } from "../utils/screenLayout";

// Shown once, right after the intro, before the first-ever Shift pick.
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
    <div className={SCREEN}>
      <div className={`${SCREEN_SCROLL} px-6 pb-3`} style={safeTop("1.5rem")}>
        <h1 className="text-gray-900 dark:text-white text-2xl font-bold leading-tight mb-1">Add your wards</h1>
        <p className="text-gray-500 text-sm mb-5">
          Add one at a time and set up its beds. You can always add more later.
        </p>

        <div className="flex gap-2 mb-4">
          <input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            placeholder="Ward name"
            className="flex-1 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-3 text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-claude-500/30 focus:border-claude-500"
          />
          <button
            onClick={add}
            disabled={!value.trim()}
            className="shrink-0 px-4 rounded-xl bg-claude-600 disabled:bg-gray-200 dark:disabled:bg-gray-800 text-white disabled:text-gray-400 text-sm font-bold"
          >
            Add
          </button>
        </div>

        {wards.length > 0 && (
          <div className="flex flex-col gap-2">
            {wards.map((w) => {
              const count = totalBeds(wardLayouts[w]);
              return (
                <button
                  key={w}
                  onClick={() => onAddWard(w)}
                  className="text-left rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40 px-3.5 py-3 flex items-center justify-between"
                >
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{w}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-600">{count > 0 ? `${count} beds` : "No beds"}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className={`${SCREEN_FOOTER} px-6`} style={safeBottom()}>
        <button
          onClick={onComplete}
          className="w-full py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-950 text-base font-bold active:scale-95 transition-all"
        >
          {wards.length > 0 ? "Continue" : "Skip for now"}
        </button>
      </div>
    </div>
  );
}
