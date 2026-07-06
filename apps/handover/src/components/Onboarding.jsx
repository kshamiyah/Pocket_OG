import { useState } from "react";
import { SHIFT_TYPES } from "../utils/constants";
import { roleLabel } from "../utils/portfolios";

const CHIP = "flex-1 py-3.5 rounded-xl text-sm font-bold transition-colors border";
const CHIP_ON = "bg-gray-900 dark:bg-white text-white dark:text-gray-950 border-gray-900 dark:border-white";
const CHIP_OFF = "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800";

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "morning" : h < 18 ? "afternoon" : "evening";
};

export default function Onboarding({ portfolio, onComplete, onSwitchPortfolio }) {
  const [shiftType, setShiftType] = useState(null);
  const label = roleLabel(portfolio.role);

  const start = (key) => {
    setShiftType(key);
    onComplete({ shiftType: key });
  };

  return (
    <div
      className="min-h-screen bg-white dark:bg-gray-950 flex flex-col px-6"
      style={{ paddingTop: "calc(env(safe-area-inset-top) + 3rem)", paddingBottom: "calc(env(safe-area-inset-bottom) + 2rem)" }}
    >
      <p className="text-gray-500 text-base mb-2">Good {greeting()}, {portfolio.name}.</p>
      <h1 className="text-gray-900 dark:text-white text-3xl font-bold leading-tight mb-1">Starting a shift?</h1>
      <p className="text-gray-500 text-base mb-8">
        Pick what you&apos;re working{label ? ` · ${label}` : ""}.
      </p>

      <div className="grid grid-cols-2 gap-2.5 flex-1 content-start">
        {SHIFT_TYPES.map((s) => (
          <button
            key={s.key}
            onClick={() => start(s.key)}
            className={`${CHIP} ${shiftType === s.key ? CHIP_ON : CHIP_OFF}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {onSwitchPortfolio && (
        <button
          onClick={onSwitchPortfolio}
          className="mt-6 text-sm font-medium text-gray-500 dark:text-gray-400"
        >
          Switch portfolio
        </button>
      )}
    </div>
  );
}
