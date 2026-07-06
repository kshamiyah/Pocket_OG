import { useMemo, useState } from "react";
import { PRIORITY, SORT_MODE, NO_WARD_LABEL, SHIFT_TYPES } from "../utils/constants";
import { sortByUrgency, groupByWard, summarize } from "../utils/jobs";
import { pushMRU, roleLabel } from "../utils/portfolios";
import JobCapture from "./JobCapture";

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
            {job.bed && (
              <span className="text-[10px] font-bold tabular-nums text-gray-600 dark:text-gray-400 bg-gray-200/80 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                Bed {job.bed}
              </span>
            )}
            {!job.ward && !job.bed && (
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

export default function JobList({ portfolio, jobs, setJobs, recentWards, setRecentWards, recentPhrases, setRecentPhrases, wardTasks, setWardTasks, wardLayouts, setWardLayouts, recentBeds, setRecentBeds, captureMode, setCaptureMode, onHandover, onScan, onPortfolios, onEndShift }) {
  const [sortMode, setSortMode] = useState(SORT_MODE.URGENCY);
  const [editingId, setEditingId] = useState(null);

  const summary = useMemo(() => summarize(jobs), [jobs]);
  const shiftLabel = SHIFT_TYPES.find((s) => s.key === portfolio.shift?.type)?.label ?? "Shift";
  const role = roleLabel(portfolio.role);

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
        <button onClick={onPortfolios} className="text-left min-w-0">
          <div className="font-extrabold text-lg text-gray-900 dark:text-white truncate">
            {portfolio.name}
          </div>
          <div className="font-mono text-[10px] tracking-wide text-gray-400 dark:text-gray-500 uppercase truncate">
            {shiftLabel}{role ? ` · ${role}` : ""}
          </div>
        </button>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onScan}
            aria-label="Receive a handover"
            className="text-[11px] font-bold text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900 rounded-md px-2 py-1"
          >
            Receive
          </button>
          <button
            onClick={onEndShift}
            aria-label="End shift"
            className="text-[11px] font-bold text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800 rounded-md px-2 py-1"
          >
            End
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

      <JobCapture
        jobs={jobs}
        setJobs={setJobs}
        captureMode={captureMode}
        setCaptureMode={setCaptureMode}
        recentWards={recentWards}
        setRecentWards={setRecentWards}
        recentPhrases={recentPhrases}
        setRecentPhrases={setRecentPhrases}
        wardTasks={wardTasks}
        setWardTasks={setWardTasks}
        wardLayouts={wardLayouts}
        setWardLayouts={setWardLayouts}
        recentBeds={recentBeds}
        setRecentBeds={setRecentBeds}
      />
    </div>
  );
}
