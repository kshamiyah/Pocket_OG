import { SHIFT_TYPES, roleLabel, timeGreeting } from "../utils/constants";
import { SCREEN, SCREEN_SCROLL, safeBottom, safeTop } from "../utils/screenLayout";

export default function ShiftPicker({ profile, onComplete, onBack }) {
  const name = profile?.name?.trim();
  const label = roleLabel(profile);

  return (
    <div className={`${SCREEN} px-6`}>
      <div className={`${SCREEN_SCROLL} pb-4`} style={{ ...safeTop("1.5rem"), ...safeBottom() }}>
        {onBack && (
          <button type="button" onClick={onBack} className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-4 self-start">
            ← Back
          </button>
        )}
        <p className="text-gray-500 text-base mb-2">
          Good {timeGreeting()}{name ? `, ${name}` : ""}{label ? ` · ${label}` : ""}.
        </p>
        <h1 className="text-gray-900 dark:text-white text-2xl font-bold leading-tight mb-1">Starting a shift?</h1>
        <p className="text-gray-500 text-base mb-6">Pick what you're working, nothing else to set up.</p>
        <div className="grid grid-cols-2 gap-2.5">
          {SHIFT_TYPES.map((s) => (
            <button
              key={s.key}
              onClick={() => onComplete({ shiftType: s.key })}
              className="py-3 rounded-xl text-sm font-bold border bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 active:scale-[0.98] transition-all"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
