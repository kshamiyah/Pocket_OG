export default function ThemeToggle({ theme, onToggle, className = "" }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={`w-8 h-8 flex items-center justify-center bg-white/95 backdrop-blur border border-gray-200 shadow-sm rounded-full text-gray-400 hover:text-gray-600 hover:shadow-md active:scale-95 transition-all shrink-0 ${className}`}
    >
      {theme === "dark" ? (
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5M12 19.5V21M4.22 4.22l1.06 1.06M18.72 18.72l1.06 1.06M3 12h1.5M19.5 12H21M4.22 19.78l1.06-1.06M18.72 5.28l1.06-1.06M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
        </svg>
      ) : (
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 15A9.72 9.72 0 0118 15.75c-5.39 0-9.75-4.36-9.75-9.75 0-1.33.27-2.6.75-3.75A9.75 9.75 0 003 11.25C3 16.64 7.36 21 12.75 21a9.75 9.75 0 009-6z" />
        </svg>
      )}
    </button>
  );
}
