import { useRef, useState } from "react";
import { PRIORITY } from "../utils/constants";
import { createJob, nextId } from "../utils/jobs";

// Minimal add row for when ward/bed are already fixed by the surrounding
// screen (a bed's own task list, an expanded bed row in the master sheet) —
// no location fields, just the task and its priority.
export default function QuickAddRow({ ward, bed, jobs, onAddJob }) {
  const [text, setText] = useState("");
  const [urgent, setUrgent] = useState(false);
  const inputRef = useRef(null);

  const add = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const job = createJob({ id: nextId(jobs), text: trimmed, ward, bed, priority: urgent ? PRIORITY.URGENT : PRIORITY.ROUTINE });
    onAddJob(job);
    setText("");
    setUrgent(false);
    inputRef.current?.focus();
  };

  return (
    <div className="flex items-center gap-2">
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && add()}
        enterKeyHint="done"
        placeholder="Add a job here…"
        className="flex-1 min-w-0 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-claude-500/30 focus:border-claude-500"
      />
      <button
        onClick={() => setUrgent((v) => !v)}
        aria-label="Toggle urgent"
        className={`shrink-0 w-11 h-11 rounded-xl border flex items-center justify-center text-xs font-bold transition-colors ${
          urgent ? "bg-red-600 text-white border-red-600" : "bg-gray-100 dark:bg-gray-900 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-800"
        }`}
      >
        !
      </button>
      <button
        onClick={add}
        disabled={!text.trim()}
        aria-label="Add job here"
        className="shrink-0 w-11 h-11 rounded-xl bg-claude-600 disabled:bg-gray-200 dark:disabled:bg-gray-800 text-white disabled:text-gray-400 flex items-center justify-center font-bold active:scale-95 transition-all"
      >
        +
      </button>
    </div>
  );
}
