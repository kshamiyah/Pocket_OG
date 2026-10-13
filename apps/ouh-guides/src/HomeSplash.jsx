import TextSizeToggle from "../../pocket-og/src/components/TextSizeToggle";
import ThemeToggle from "../../pocket-og/src/components/ThemeToggle";

// Welcome screen shown before the guide list. Title styling follows Pocket
// O&G's home hero.
export default function HomeSplash({ theme, onThemeToggle, onBrowse }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div
        className="shrink-0 max-w-lg mx-auto w-full px-5 flex justify-end gap-2"
        style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}
      >
        <TextSizeToggle />
        <ThemeToggle theme={theme} onToggle={onThemeToggle} />
      </div>

      <div className="flex-1 flex items-center justify-center px-5 pb-16">
        <div className="max-w-lg w-full text-center animate-enter">
          <h1 className="text-[42px] sm:text-[52px] font-[800] tracking-[-0.03em] text-black leading-[0.95]">
            OUH Guides
          </h1>
          <p className="mt-3 text-base text-gray-400 leading-relaxed">Oxford local O&amp;G pathways</p>
          <p className="mt-1.5 text-xs text-gray-400">Built by Khalid Shamiyah</p>
          <button
            type="button"
            onClick={onBrowse}
            className="mt-8 inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-black text-white text-sm font-semibold shadow-lg shadow-gray-200/60 hover:bg-gray-800 active:scale-95 transition-all"
          >
            Browse guides
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
