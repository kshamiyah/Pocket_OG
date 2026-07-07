import { SHIFT_TYPES } from "../utils/constants";

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "morning" : h < 18 ? "afternoon" : "evening";
};

// Asked every time there's no active shift — this is the "clocking in"
// gesture that bookends handover ("clocking out") at the other end.
export default function ShiftPicker({ onComplete }) {
  return (
    <div
      className="h-screen overflow-y-auto bg-white dark:bg-gray-950 flex flex-col px-6"
      style={{ paddingTop: "calc(env(safe-area-inset-top) + 3rem)", paddingBottom: "calc(env(safe-area-inset-bottom) + 2rem)" }}
    >
      <p className="text-gray-500 text-base mb-2">Good {greeting()}.</p>
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
