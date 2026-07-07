import { useState } from "react";

export default function ReviewMerge({ incomingJobs, onMerge, onDiscard }) {
  const [selected, setSelected] = useState(() => new Set(incomingJobs.map((j) => j.id)));

  const toggle = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const chosen = incomingJobs.filter((j) => selected.has(j.id));

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-950 px-5">
      <div className="shrink-0" style={{ paddingTop: "calc(env(safe-area-inset-top) + 1.25rem)" }}>
      <div className="mb-2">
        <span className="text-[11px] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-md">
          {incomingJobs.length} job{incomingJobs.length === 1 ? "" : "s"} to take over
        </span>
      </div>
      <h1 className="text-gray-900 dark:text-white text-2xl font-bold mb-1">Review before it lands</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
        Uncheck anything you don't want on your list.
      </p>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-2 mb-4">
        {incomingJobs.map((job) => {
          const on = selected.has(job.id);
          const urgent = job.priority === "urgent";
          return (
            <button
              key={job.id}
              onClick={() => toggle(job.id)}
              className={`text-left rounded-xl border px-3 py-2.5 transition-colors ${
                on ? "bg-gray-50 dark:bg-gray-900/60 border-gray-200 dark:border-gray-800" : "bg-transparent border-gray-100 dark:border-gray-900 opacity-50"
              }`}
            >
              <div className="flex items-start gap-2.5">
                <span
                  className={`mt-0.5 w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center ${
                    on ? "bg-claude-600 border-claude-600" : "border-gray-400 dark:border-gray-600"
                  }`}
                >
                  {on && <span className="text-white text-[10px]">✓</span>}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                    {job.ward && (
                      <span className="text-[10px] font-bold uppercase tracking-wide text-claude-800 dark:text-claude-400 bg-claude-100 dark:bg-claude-900/30 px-1.5 py-0.5 rounded">
                        {job.ward}
                      </span>
                    )}
                    {job.bed && (
                      <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                        {job.bed}
                      </span>
                    )}
                    {urgent && (
                      <span className="text-[10px] font-bold uppercase tracking-wide text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-1.5 py-0.5 rounded">
                        Urgent
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-900 dark:text-gray-100 leading-snug">{job.text}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="shrink-0" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1.5rem)" }}>
        <button
          onClick={() => onMerge(chosen)}
          disabled={chosen.length === 0}
          className="w-full py-4 rounded-2xl bg-gray-900 dark:bg-white disabled:bg-gray-200 dark:disabled:bg-gray-800 text-white dark:text-gray-950 disabled:text-gray-400 text-base font-bold mb-2.5 active:scale-95 transition-all"
        >
          Add {chosen.length || ""} to my list
        </button>
        <button onClick={onDiscard} className="w-full py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
          Discard
        </button>
      </div>
    </div>
  );
}
