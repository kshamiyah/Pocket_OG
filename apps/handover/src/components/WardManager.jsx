import { useState } from "react";
import { totalBeds } from "../utils/wardLayouts";
import { SCREEN, SCREEN_FOOTER, SCREEN_SCROLL, safeBottom, safeTop } from "../utils/screenLayout";

export default function WardManager({ wardNames, wardLayouts, onEditWard, onBack }) {
  const [newWard, setNewWard] = useState("");

  const addAndEdit = () => {
    const trimmed = newWard.trim();
    if (!trimmed) return;
    onEditWard(trimmed);
  };

  return (
    <div className={`${SCREEN} px-5`}>
      <div className="shrink-0 flex items-center gap-3 mb-4" style={safeTop()}>
        <button onClick={onBack} className="text-sm font-bold text-gray-500 dark:text-gray-400" aria-label="Back to home">← Home</button>
        <div>
          <div className="font-extrabold text-lg text-gray-900 dark:text-white">Bed setup</div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Bed layouts saved on this device.</p>
        </div>
      </div>

      <div className={`${SCREEN_SCROLL} flex flex-col gap-2 pb-3`}>
        {wardNames.length === 0 && (
          <p className="text-sm text-gray-400 dark:text-gray-600 text-center mt-4">
            No wards yet. Add one below, or tag a job with a ward first.
          </p>
        )}
        {wardNames.map((ward) => {
          const layout = wardLayouts[ward];
          const configured = Boolean(layout);
          const count = configured ? totalBeds(layout) : 0;
          return (
            <button
              key={ward}
              onClick={() => onEditWard(ward)}
              className="text-left rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40 px-3.5 py-3 flex items-center justify-between"
            >
              <span className="text-sm font-bold text-gray-900 dark:text-white">{ward}</span>
              <span className="text-xs text-gray-400 dark:text-gray-600">
                {configured ? (count > 0 ? `${count} beds` : "No beds") : "Not set up"}
              </span>
            </button>
          );
        })}
      </div>

      <div className={`${SCREEN_FOOTER} flex gap-2`} style={safeBottom()}>
        <input
          value={newWard}
          onChange={(e) => setNewWard(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addAndEdit()}
          placeholder="New ward name"
          className="flex-1 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-claude-500/30 focus:border-claude-500"
        />
        <button
          onClick={addAndEdit}
          disabled={!newWard.trim()}
          className="shrink-0 px-4 rounded-xl bg-claude-600 disabled:bg-gray-200 dark:disabled:bg-gray-800 text-white disabled:text-gray-400 text-sm font-bold"
        >
          Set up
        </button>
      </div>
    </div>
  );
}
