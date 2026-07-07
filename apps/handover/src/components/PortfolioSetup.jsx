import { ROLES } from "../utils/constants";

// One-time setup, this device is this person's from here on. Not asked
// again unless they explicitly go edit it.
export default function PortfolioSetup({ initialRole, onComplete }) {
  return (
    <div
      className="h-screen overflow-y-auto bg-white dark:bg-gray-950 flex flex-col px-6"
      style={{ paddingTop: "calc(env(safe-area-inset-top) + 3rem)", paddingBottom: "calc(env(safe-area-inset-bottom) + 2rem)" }}
    >
      <p className="text-gray-500 text-base mb-2">Welcome.</p>
      <h1 className="text-gray-900 dark:text-white text-3xl font-bold leading-tight mb-2">Set up this phone</h1>
      <p className="text-gray-500 text-sm mb-10">One-time. This device is yours from here on.</p>

      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-2">Your role</p>
      <div className="flex flex-col gap-2.5">
        {ROLES.map((r) => (
          <button
            key={r.key}
            onClick={() => onComplete({ role: r.key })}
            className={`w-full py-4 rounded-2xl border text-left px-5 text-base font-bold active:scale-[0.98] transition-all ${
              initialRole === r.key
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-950 border-gray-900 dark:border-white"
                : "bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white border-gray-200 dark:border-gray-800"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>
    </div>
  );
}
