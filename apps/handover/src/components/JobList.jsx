import { useMemo, useRef, useState } from "react";
import { PRIORITY, SORT_MODE, NO_WARD_LABEL, SHIFT_TYPES } from "../utils/constants";
import { createJob, nextId, sortByUrgency, groupByWard, summarize } from "../utils/jobs";
import { pushMRU } from "../utils/storage";

const WARD_CHIP = "shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors";
const WARD_CHIP_ON = "bg-amber-600 text-white border-amber-600";
const WARD_CHIP_OFF = "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800";

function JobCard({ job, editing, onToggleDone, onToggleEdit, onSetWard, onSetPriority, onDelete, recentWards }) {
  const urgent = job.priority === PRIORITY.URGENT;
  return (
    <div
      className={`rounded-xl border px-3 py-2.5 bg-gray-50 dark:bg-gray-900/60 ${
        urgent && !job.done ? "border-red-300 dark:border-red-900" : "border-gray-200 dark:border-gray-800"
      }`}
    >
      <div className="flex items-start gap-2.5">
        <button
          onClick={() => onToggleDone(job.id)}
          aria-label={job.done ? "Mark not done" : "Mark done"}
          className={`mt-0.5 w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
            job.done ? "bg-emerald-600 border-emerald-600" : "border-gray-400 dark:border-gray-600"
          }`}
        >
          {job.done && <span className="text-white text-[10px]">✓</span>}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
            {job.ward && (
              <button
                onClick={() => onToggleEdit(job.id)}
                className="text-[10px] font-bold uppercase tracking-wide text-amber-800 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-1.5 py-0.5 rounded"
              >
                {job.ward}
              </button>
            )}
            {!job.ward && (
              <button
                onClick={() => onToggleEdit(job.id)}
                className="text-[10px] font-semibold text-gray-400 dark:text-gray-600 px-1.5 py-0.5 rounded border border-dashed border-gray-300 dark:border-gray-700"
              >
                + ward
              </button>
            )}
            {urgent && !job.done && (
              <span className="text-[10px] font-bold uppercase tracking-wide text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-1.5 py-0.5 rounded">
                Urgent
              </span>
            )}
          </div>
          <p className={`text-sm leading-snug ${job.done ? "text-gray-400 dark:text-gray-600 line-through" : "text-gray-900 dark:text-gray-100"}`}>
            {job.text}
          </p>

          {editing && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {recentWards.map((w) => (
                <button
                  key={w}
                  onClick={() => onSetWard(job.id, w)}
                  className={`${WARD_CHIP} ${job.ward === w ? WARD_CHIP_ON : WARD_CHIP_OFF}`}
                >
                  {w}
                </button>
              ))}
              <button
                onClick={() => onSetWard(job.id, "")}
                className={`${WARD_CHIP} ${WARD_CHIP_OFF}`}
              >
                No ward
              </button>
              <button
                onClick={() => onSetPriority(job.id, urgent ? PRIORITY.ROUTINE : PRIORITY.URGENT)}
                className={`${WARD_CHIP} ${urgent ? "bg-red-600 text-white border-red-600" : WARD_CHIP_OFF}`}
              >
                {urgent ? "Urgent ✓" : "Mark urgent"}
              </button>
              <button
                onClick={() => onDelete(job.id)}
                className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 dark:text-red-400"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function JobList({ jobs, setJobs, shiftType, recentWards, setRecentWards, onHandover, onScan }) {
  const [sortMode, setSortMode] = useState(SORT_MODE.URGENCY);
  const [editingId, setEditingId] = useState(null);
  const [stickyWard, setStickyWard] = useState(recentWards[0] || "");
  const [urgentDraft, setUrgentDraft] = useState(false);
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  const summary = useMemo(() => summarize(jobs), [jobs]);
  const shiftLabel = SHIFT_TYPES.find((s) => s.key === shiftType)?.label ?? "Shift";

  const addJob = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const job = createJob({ id: nextId(jobs), text: trimmed, ward: stickyWard, priority: urgentDraft ? PRIORITY.URGENT : PRIORITY.ROUTINE });
    setJobs([...jobs, job]);
    if (stickyWard) setRecentWards(pushMRU(recentWards, stickyWard));
    setText("");
    setUrgentDraft(false);
    inputRef.current?.focus();
  };

  const toggleDone = (id) => setJobs(jobs.map((j) => (j.id === id ? { ...j, done: !j.done } : j)));
  const toggleEdit = (id) => setEditingId((cur) => (cur === id ? null : id));
  const setWard = (id, ward) => {
    setJobs(jobs.map((j) => (j.id === id ? { ...j, ward } : j)));
    if (ward) setRecentWards(pushMRU(recentWards, ward));
  };
  const setPriority = (id, priority) => setJobs(jobs.map((j) => (j.id === id ? { ...j, priority } : j)));
  const deleteJob = (id) => { setJobs(jobs.filter((j) => j.id !== id)); setEditingId(null); };

  const renderCard = (job) => (
    <JobCard
      key={job.id}
      job={job}
      editing={editingId === job.id}
      onToggleDone={toggleDone}
      onToggleEdit={toggleEdit}
      onSetWard={setWard}
      onSetPriority={setPriority}
      onDelete={deleteJob}
      recentWards={recentWards}
    />
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      <div
        className="px-5 flex items-baseline justify-between border-b border-gray-200 dark:border-gray-800"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 1.25rem)", paddingBottom: "0.9rem" }}
      >
        <div className="font-extrabold text-lg text-gray-900 dark:text-white">
          Handover<span className="text-amber-600">.</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="font-mono text-[11px] tracking-wide text-gray-400 dark:text-gray-500 uppercase">
            {shiftLabel}
          </div>
          <button
            onClick={onScan}
            aria-label="Receive a handover"
            className="text-[11px] font-bold text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900 rounded-md px-2 py-1"
          >
            Receive
          </button>
        </div>
      </div>

      <div className="px-5 pt-3 flex items-center justify-between">
        <div className="font-mono text-[11px] tabular-nums tracking-wide text-gray-500 dark:text-gray-400">
          {summary.open} OPEN · {summary.urgent} URGENT · {summary.done} DONE
        </div>
        <div className="flex rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden text-[11px] font-bold">
          <button
            onClick={() => setSortMode(SORT_MODE.URGENCY)}
            className={`px-2.5 py-1 ${sortMode === SORT_MODE.URGENCY ? "bg-gray-900 dark:bg-white text-white dark:text-gray-950" : "text-gray-500 dark:text-gray-400"}`}
          >
            Urgency
          </button>
          <button
            onClick={() => setSortMode(SORT_MODE.WARD)}
            className={`px-2.5 py-1 ${sortMode === SORT_MODE.WARD ? "bg-gray-900 dark:bg-white text-white dark:text-gray-950" : "text-gray-500 dark:text-gray-400"}`}
          >
            Ward
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-3 flex flex-col gap-2 pb-2">
        {jobs.length === 0 && (
          <p className="text-sm text-gray-400 dark:text-gray-600 text-center mt-10">
            No jobs yet. Type your first one below.
          </p>
        )}

        {jobs.length > 0 && sortMode === SORT_MODE.URGENCY &&
          sortByUrgency(jobs).map(renderCard)}

        {jobs.length > 0 && sortMode === SORT_MODE.WARD &&
          groupByWard(jobs).map(([ward, list]) => (
            <div key={ward} className="flex flex-col gap-2">
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600 mt-1">
                {ward === NO_WARD_LABEL ? NO_WARD_LABEL : ward} · {list.length}
              </div>
              {list.map(renderCard)}
            </div>
          ))}
      </div>

      {summary.open > 0 && (
        <div className="px-5 pb-2">
          <button
            onClick={onHandover}
            className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold active:scale-[0.98] transition-all"
          >
            Handover →
          </button>
        </div>
      )}

      <div
        className="border-t border-gray-200 dark:border-gray-800 px-5 pt-2.5 bg-white dark:bg-gray-950"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }}
      >
        {recentWards.length > 0 && (
          <div className="flex gap-1.5 overflow-x-auto mb-2 pb-0.5">
            {recentWards.map((w) => (
              <button
                key={w}
                onClick={() => setStickyWard(w)}
                className={`${WARD_CHIP} ${stickyWard === w ? WARD_CHIP_ON : WARD_CHIP_OFF}`}
              >
                {w}
              </button>
            ))}
            {stickyWard && (
              <button onClick={() => setStickyWard("")} className={`${WARD_CHIP} ${WARD_CHIP_OFF}`}>
                Clear
              </button>
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addJob()}
            enterKeyHint="done"
            placeholder={stickyWard ? `Job for ${stickyWard}…` : "Add a job…"}
            className="flex-1 min-w-0 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
          />
          <button
            onClick={() => setUrgentDraft((v) => !v)}
            aria-label="Toggle urgent"
            className={`shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center text-xs font-bold transition-colors ${
              urgentDraft ? "bg-red-600 text-white border-red-600" : "bg-gray-100 dark:bg-gray-900 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-800"
            }`}
          >
            !
          </button>
          <button
            onClick={addJob}
            disabled={!text.trim()}
            aria-label="Add job"
            className="shrink-0 w-10 h-10 rounded-xl bg-amber-600 disabled:bg-gray-200 dark:disabled:bg-gray-800 text-white disabled:text-gray-400 flex items-center justify-center font-bold active:scale-95 transition-all"
          >
            +
          </button>
        </div>
        <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-1.5">
          No names, initials or bed numbers, just enough to jog your memory.
        </p>
      </div>
    </div>
  );
}
