import { useState } from "react";
import { ROLES, SHIFT_TYPES } from "../utils/constants";

const CHIP = "flex-1 py-3.5 rounded-xl text-sm font-bold transition-colors border";
const CHIP_ON = "bg-gray-900 dark:bg-white text-white dark:text-gray-950 border-gray-900 dark:border-white";
const CHIP_OFF = "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800";

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "morning" : h < 18 ? "afternoon" : "evening";
};

// First run asks role then shift type. Every later shift-start (profile
// already known) skips straight to the shift-type page — that re-ask is the
// deliberate "clocking in" ritual that bookends handover at the other end.
export default function Onboarding({ knownRole, onComplete }) {
  const [page, setPage] = useState(knownRole ? "shift" : "role");
  const [role, setRole] = useState(knownRole || null);
  const [shiftType, setShiftType] = useState(null);

  const chooseRole = (key) => { setRole(key); setPage("shift"); };
  const chooseShift = (key) => {
    setShiftType(key);
    onComplete({ role, shiftType: key });
  };

  return (
    <div
      className="min-h-screen bg-white dark:bg-gray-950 flex flex-col px-6"
      style={{ paddingTop: "calc(env(safe-area-inset-top) + 3rem)", paddingBottom: "calc(env(safe-area-inset-bottom) + 2rem)" }}
    >
      <div className="flex gap-1.5 mb-12">
        {(knownRole ? ["shift"] : ["role", "shift"]).map((p) => (
          <div
            key={p}
            className={`h-1 rounded-full transition-all duration-300 ${p === page ? "w-6 bg-amber-600" : "w-1.5 bg-gray-300 dark:bg-gray-700"}`}
          />
        ))}
      </div>

      {page === "role" && (
        <div className="flex-1 flex flex-col">
          <p className="text-gray-500 text-base mb-2">Good {greeting()}.</p>
          <h1 className="text-gray-900 dark:text-white text-3xl font-bold leading-tight mb-10">
            What's your<br />role?
          </h1>
          <div className="flex flex-col gap-2.5">
            {ROLES.map((r) => (
              <button
                key={r.key}
                onClick={() => chooseRole(r.key)}
                className="w-full py-4 rounded-2xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-base font-bold text-left px-5 active:scale-[0.98] transition-all"
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {page === "shift" && (
        <div className="flex-1 flex flex-col">
          <h1 className="text-gray-900 dark:text-white text-3xl font-bold leading-tight mb-1">Starting a shift?</h1>
          <p className="text-gray-500 text-base mb-8">Pick what you're working, nothing else to set up.</p>
          <div className="grid grid-cols-2 gap-2.5">
            {SHIFT_TYPES.map((s) => (
              <button
                key={s.key}
                onClick={() => chooseShift(s.key)}
                className={`${CHIP} ${shiftType === s.key ? CHIP_ON : CHIP_OFF}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
