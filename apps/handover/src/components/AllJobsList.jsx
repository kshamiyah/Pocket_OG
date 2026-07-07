import { useMemo, useState } from "react";
import { SORT_MODE, NO_WARD_LABEL } from "../utils/constants";
import { sortByUrgency, groupByWard, summarize } from "../utils/jobs";
import JobCard from "./JobCard";

// The flat, urgency-first master view — same jobs as WardDrill/MasterSheet,
// no location grouping by default, for the moments a whole-patch glance
// matters more than walking the building (triage, pre-handover check).
export default function AllJobsList({
  jobs, recentWards, recentBeds,
  editingId, onToggleDone, onToggleEdit, onSetWard, onSetBed, onSetPriority, onSetText, onDelete,
}) {
  const [sortMode, setSortMode] = useState(SORT_MODE.URGENCY);
  const summary = useMemo(() => summarize(jobs), [jobs]);

  const cardProps = { editingId, onToggleDone, onToggleEdit, onSetWard, onSetBed, onSetPriority, onSetText, onDelete, recentWards, recentBeds };
  const renderCard = (job) => <JobCard key={job.id} job={job} editing={editingId === job.id} {...cardProps} />;

  return (
    <>
      <div className="px-5 pt-3 flex items-center justify-between">
        <div className="font-mono text-[11px] tabular-nums tracking-wide text-gray-500 dark:text-gray-400">
          {summary.open} OPEN · {summary.urgent} URGENT · {summary.done} DONE
        </div>
        <div className="flex rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden text-[11px] font-bold">
          <button onClick={() => setSortMode(SORT_MODE.URGENCY)} className={`px-2.5 py-1 ${sortMode === SORT_MODE.URGENCY ? "bg-gray-900 dark:bg-white text-white dark:text-gray-950" : "text-gray-500 dark:text-gray-400"}`}>
            Urgency
          </button>
          <button onClick={() => setSortMode(SORT_MODE.WARD)} className={`px-2.5 py-1 ${sortMode === SORT_MODE.WARD ? "bg-gray-900 dark:bg-white text-white dark:text-gray-950" : "text-gray-500 dark:text-gray-400"}`}>
            Ward
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-5 py-3 flex flex-col gap-2" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 6rem)" }}>
        {jobs.length === 0 && (
          <p className="text-sm text-gray-400 dark:text-gray-600 text-center mt-10">
            No jobs yet. Tap + to add your first one.
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
    </>
  );
}
