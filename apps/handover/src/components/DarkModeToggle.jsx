import { useTheme } from "../context/useTheme";

function SunIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function ThemeSwitch({ on, onToggle }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={on ? "Dark mode on" : "Dark mode off"}
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full shrink-0 transition-colors ${on ? "bg-claude-600" : "bg-gray-300 dark:bg-gray-700"}`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`}
      />
    </button>
  );
}

/** Row with label + switch (shift menu). */
export function DarkModeToggleRow() {
  const { dark, toggle } = useTheme();
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3.5">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-gray-500 dark:text-gray-400 shrink-0">
          {dark ? <MoonIcon /> : <SunIcon />}
        </span>
        <span className="text-base font-bold text-gray-900 dark:text-white">Dark mode</span>
      </div>
      <ThemeSwitch on={dark} onToggle={toggle} />
    </div>
  );
}
