import { SHIFT_TYPES, roleLabel, timeGreeting } from "../utils/constants";

export default function ShiftPicker({ profile, onComplete, onBack }) {
  const name = profile?.name?.trim();
  const label = roleLabel(profile);

  return (
    <div
      className="h-screen overflow-y-auto bg-white dark:bg-gray-950 flex flex-col px-6"
      style={{ paddingTop: "calc(env(safe-area-inset-top) + 3rem)", paddingBottom: "calc(env(safe-area-inset-bottom) + 2rem)" }}
    >
      {onBack && (
        <button type="button" onClick={onBack} className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-4 self-start">
          ← Back
        </button>
      )}
      <p className="text-gray-500 text-base mb-2">
        Good {timeGreeting()}{name ? `, ${name}` : ""}{label ? ` · ${label}` : ""}.
      </p>
      <h1 className="text-gray-900 dark:text-white text-3xl font-bold leading-tight mb-1">Starting a shift?</h1>
      <p className="text-gray-500 text-base mb-8">Pick what you're working, nothing else to set up.</p>
      <div className="grid grid-cols-2 gap-2.5">
        {SHIFT_TYPES.map((s) => (
          <button
            key={s.key}
            onClick={() => onComplete({ shiftType: s.key })}
            className="py-3.5 rounded-xl text-sm font-bold border bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 active:scale-[0.98] transition-all"
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
