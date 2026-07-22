import { useState } from "react";
import { totalBeds } from "../utils/wardLayouts";
import { PANEL, PRIMARY_BTN, SCREEN, SCREEN_FOOTER, SCREEN_SCROLL, safeBottom, safeTop } from "../utils/screenLayout";
import { TYPE_BODY, TYPE_DISPLAY, TYPE_EYEBROW_MB4, TYPE_UI, TYPE_UI_SM } from "../utils/typography";

const FIELD =
  "flex-1 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-3 text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-claude-500/30 focus:border-claude-500";

export default function WardsIntroScreen({ wardLayouts, onAddWard, onScanSetup, onComplete }) {
  const [value, setValue] = useState("");
  const wards = Object.keys(wardLayouts);

  const add = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAddWard(trimmed);
    setValue("");
  };

  return (
    <div className={`${SCREEN} px-6`}>
      <div className={`${SCREEN_SCROLL} pb-3`} style={safeTop("1.25rem")}>
        <p className={TYPE_EYEBROW_MB4}>
          Ward layouts
        </p>
        <h1 className={`${TYPE_DISPLAY} mb-2`}>
          Add your wards
        </h1>
        <p className={`${TYPE_BODY} text-gray-600 dark:text-gray-400 leading-snug mb-6`}>
          Add wards and set up beds yourself, or scan a setup code from a colleague who
          already uses the app. Once yours is ready, you can share it from Manage wards.
        </p>

        <div className={`${PANEL} p-4 mb-4`}>
          <div className="flex gap-2">
            <input
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
              placeholder="Ward name"
              className={FIELD}
            />
            <button
              type="button"
              onClick={add}
              disabled={!value.trim()}
              className="shrink-0 px-4 rounded-xl bg-claude-600 disabled:bg-gray-200 dark:disabled:bg-gray-800 text-white disabled:text-gray-400 text-sm font-bold active:scale-[0.98] transition-all"
            >
              Add
            </button>
          </div>
        </div>

        {wards.length > 0 && (
          <div className="flex flex-col gap-2">
            {wards.map((w) => {
              const count = totalBeds(wardLayouts[w]);
              return (
                <button
                  key={w}
                  type="button"
                  onClick={() => onAddWard(w)}
                  className={`${PANEL} text-left px-4 py-3.5 flex items-center justify-between active:scale-[0.99] transition-all`}
                >
                  <span className={`${TYPE_UI} text-gray-900 dark:text-white`}>{w}</span>
                  <span className={`${TYPE_UI_SM} text-claude-700 dark:text-claude-400`}>
                    {count > 0 ? `${count} beds` : "Set up beds"}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className={`${SCREEN_FOOTER} flex flex-col gap-2`} style={safeBottom()}>
        {onScanSetup && (
          <button
            type="button"
            onClick={onScanSetup}
            className="w-full py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-sm font-bold text-gray-700 dark:text-gray-300 active:scale-[0.98] transition-all"
          >
            Scan a colleague&apos;s ward setup
          </button>
        )}
        <button type="button" onClick={onComplete} className={PRIMARY_BTN}>
          {wards.length > 0 ? "Continue" : "Skip for now"}
        </button>
      </div>
    </div>
  );
}
