import { useState } from "react";
import { totalBeds } from "../utils/wardLayouts";

export default function WardManager({ wardNames, wardLayouts, onEditWard, onBack }) {
  const [newWard, setNewWard] = useState("");

  const addAndEdit = () => {
    const trimmed = newWard.trim();
    if (!trimmed) return;
    onEditWard(trimmed);
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-950 px-5">
      <div className="shrink-0 flex items-center gap-3 mb-6" style={{ paddingTop: "calc(env(safe-area-inset-top) + 1.25rem)" }}>
        <button onClick={onBack} className="text-sm font-bold text-gray-500 dark:text-gray-400 px-2 py-1.5 active:scale-95 transition-all" aria-label="Back to home">← Home</button>
        <div>
          <div className="font-extrabold text-lg text-gray-900 dark:text-white">Bed setup</div>
          <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5">Bed layouts saved on this device.</p>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-2 mb-4">
        {wardNames.length === 0 && (
          <p className="text-sm text-gray-400 dark:text-gray-600 text-center mt-8">
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
              className="text-left rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40 px-4 py-3.5 flex items-center justify-between active:scale-[0.98] transition-all min-h-[56px]"
            >
              <span className="text-[15px] font-bold text-gray-900 dark:text-white">{ward}</span>
              <span className="text-[13px] text-gray-400 dark:text-gray-600">
                {configured ? (count > 0 ? `${count} beds` : "No beds") : "Not set up"}
              </span>
            </button>
          );
        })}
      </div>

      <div className="shrink-0 flex gap-2" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1.5rem)" }}>
        <input
          value={newWard}
          onChange={(e) => setNewWard(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addAndEdit()}
          placeholder="New ward name"
          className="flex-1 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-3 text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
        />
        <button
          onClick={addAndEdit}
          disabled={!newWard.trim()}
          className="shrink-0 px-5 py-3 rounded-xl bg-amber-600 disabled:bg-gray-200 dark:disabled:bg-gray-800 text-white disabled:text-gray-400 text-base font-bold active:scale-95 transition-all min-h-[48px]"
        >
          Set up
        </button>
      </div>
    </div>
  );
}
