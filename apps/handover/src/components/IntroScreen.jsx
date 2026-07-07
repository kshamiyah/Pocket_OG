const STEPS = [
  {
    title: "Add jobs",
    body: "Type what needs doing. Tag it with a ward and bed if it helps you remember later.",
  },
  {
    title: "Work your way",
    body: "Rounds walks you ward by ward. Overview shows everything nested on one page. All jobs is the flat list.",
  },
  {
    title: "Hand over with a scan",
    body: "At the end of your shift, generate a QR code. No server, nothing leaves your phone.",
  },
];

// Shown once, right after Portfolio, before the first-ever Shift pick.
export default function IntroScreen({ onComplete }) {
  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-950">
      <div
        className="flex-1 min-h-0 overflow-y-auto px-6"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 3rem)" }}
      >
        <h1 className="text-gray-900 dark:text-white text-3xl font-bold leading-tight mb-8">How Handover works</h1>
        <div className="flex flex-col gap-6">
          {STEPS.map((step) => (
            <div key={step.title}>
              <div className="text-base font-bold text-gray-900 dark:text-white mb-1">{step.title}</div>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-snug">{step.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="shrink-0 px-6" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 2rem)" }}>
        <button
          onClick={onComplete}
          className="w-full py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-950 text-base font-bold active:scale-95 transition-all"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
