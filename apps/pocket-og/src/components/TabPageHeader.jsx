import ThemeToggle from "./ThemeToggle";
import TextSizeToggle from "./TextSizeToggle";

export default function TabPageHeader({ title, subtitle, theme, onThemeToggle, trailing = null, children = null }) {
  return (
    <div
      className="px-5 pb-1 flex items-start justify-between gap-3"
      style={{ paddingTop: "max(3.5rem, calc(env(safe-area-inset-top) + 2rem))" }}
    >
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h2>
        {subtitle ? <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p> : null}
        {children}
      </div>
      <div className="flex items-center gap-2 shrink-0 pt-0.5">
        {trailing}
        {onThemeToggle ? (
          <>
            <TextSizeToggle />
            <ThemeToggle theme={theme} onToggle={onThemeToggle} />
          </>
        ) : null}
      </div>
    </div>
  );
}
