import HandoverMark from "./HandoverMark";
import { SHIFT_TYPES } from "../utils/constants";
import { shiftSummary } from "../utils/jobs";

function Stat({ label, value, accent }) {
  return (
    <div className={`rounded-2xl border px-4 py-3 ${accent ? "border-claude-200 dark:border-claude-900 bg-claude-50 dark:bg-claude-950/30" : "border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50"}`}>
      <div className={`font-mono text-3xl font-extrabold tabular-nums leading-none ${accent ? "text-claude-800 dark:text-claude-300" : "text-gray-900 dark:text-white"}`}>
        {value}
      </div>
      <div className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600 mt-1.5">
        {label}
      </div>
    </div>
  );
}

export default function EndShiftSummary({ jobs, shiftType, onBack, onHandover, onConfirmEnd }) {
  const stats = shiftSummary(jobs);
  const shiftLabel = SHIFT_TYPES.find((s) => s.key === shiftType)?.label ?? "Shift";
  const hasOpen = stats.open > 0;

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-950 px-5">
      <div className="flex-1 min-h-0 overflow-y-auto" style={{ paddingTop: "calc(env(safe-area-inset-top) + 1.25rem)" }}>
        <div className="flex items-center gap-3 mb-6">
          <button type="button" onClick={onBack} className="text-sm font-bold text-gray-500 dark:text-gray-400">
            ← Back
          </button>
          <HandoverMark className="font-extrabold text-lg text-gray-900 dark:text-white" />
        </div>

        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-1">
          {shiftLabel} shift
        </p>
        <h1 className="text-gray-900 dark:text-white text-3xl font-bold leading-tight mb-2">End of shift</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {stats.total === 0
            ? "You didn't add any jobs this shift."
            : "Here's how your shift looked before you clock out."}
        </p>

        <div className="grid grid-cols-2 gap-2.5 mb-5">
          <Stat label="Jobs created" value={stats.total} />
          <Stat label="Wards covered" value={stats.wardCount} />
          <Stat label="Done" value={stats.done} />
          <Stat label="Outstanding" value={stats.open} accent={hasOpen} />
        </div>

        {stats.wards.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-2">
              Wards on your list
            </p>
            <div className="flex flex-wrap gap-1.5">
              {stats.wards.map((ward) => (
                <span
                  key={ward}
                  className="text-xs font-bold text-claude-800 dark:text-claude-300 bg-claude-100 dark:bg-claude-900/30 px-2 py-1 rounded-lg"
                >
                  {ward}
                </span>
              ))}
            </div>
          </div>
        )}

        {hasOpen && (
          <div className="rounded-2xl border border-claude-200 dark:border-claude-900 bg-claude-50 dark:bg-claude-950/20 px-4 py-3.5 mb-4">
            <p className="text-sm font-bold text-claude-900 dark:text-claude-200 mb-1">
              {stats.open} job{stats.open === 1 ? "" : "s"} still open
              {stats.urgent > 0 ? ` · ${stats.urgent} urgent` : ""}
            </p>
            <p className="text-sm text-claude-800/80 dark:text-claude-300/80 leading-snug">
              Hand these over to the incoming doctor before you leave. They can scan your QR to pick them up.
            </p>
          </div>
        )}

        {!hasOpen && stats.total > 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Nothing left open. You're clear to end your shift.
          </p>
        )}
      </div>

      <div className="shrink-0 flex flex-col gap-2.5 pt-2" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1.5rem)" }}>
        {hasOpen ? (
          <>
            <button
              type="button"
              onClick={onHandover}
              className="w-full py-4 rounded-2xl bg-claude-600 text-white text-base font-bold active:scale-95 transition-all"
            >
              Hand over now
            </button>
            <button
              type="button"
              onClick={onConfirmEnd}
              className="w-full py-3.5 rounded-2xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 text-sm font-bold active:scale-[0.98] transition-all"
            >
              End shift without handover
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onConfirmEnd}
            className="w-full py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-950 text-base font-bold active:scale-95 transition-all"
          >
            End shift
          </button>
        )}
      </div>
    </div>
  );
}
