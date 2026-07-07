import HandoverMark from "./HandoverMark";

const BULLETS = [
  "Add jobs as you go — tag a ward and bed if it helps you remember.",
  "Walk the ward bed by bed, or see everything on one page.",
  "Take over with a scan at the start — hand over at the end of shift.",
];

export default function WelcomeScreen({ onComplete }) {
  return (
    <div
      className="h-screen flex flex-col bg-white dark:bg-gray-950 px-6"
      style={{ paddingTop: "calc(env(safe-area-inset-top) + 3rem)", paddingBottom: "calc(env(safe-area-inset-bottom) + 2rem)" }}
    >
      <div className="flex-1 min-h-0 overflow-y-auto">
        <HandoverMark className="font-extrabold text-2xl text-gray-900 dark:text-white mb-2" />
        <h1 className="text-gray-900 dark:text-white text-3xl font-bold leading-tight mb-3">
          Your shift job list, on your phone.
        </h1>
        <ul className="flex flex-col gap-4 mb-8">
          {BULLETS.map((text) => (
            <li key={text} className="flex gap-3 text-base text-gray-600 dark:text-gray-400 leading-snug">
              <span className="text-claude-600 font-bold shrink-0">·</span>
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onComplete}
        className="shrink-0 w-full py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-950 text-base font-bold active:scale-95 transition-all"
      >
        Get started
      </button>
    </div>
  );
}
