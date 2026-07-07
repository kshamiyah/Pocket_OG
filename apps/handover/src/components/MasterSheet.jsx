import { useState } from "react";
import { buildHierarchy } from "../utils/jobs";
import JobCard from "./JobCard";
import QuickAddRow from "./QuickAddRow";

const NO_WARD_KEY = "__noward__";

function Chevron({ open }) {
  return <span className={`inline-block transition-transform ${open ? "rotate-90" : ""}`}>›</span>;
}

// View 2: everything, nested — wards collapsed by default, expand one to see
// its beds collapsed, expand a bed to see (and add to) its tasks inline.
// Same data as WardDrill, presented as one page instead of a walk-through.
export default function MasterSheet({
  jobs, wardNames, wardLayouts, recentWards, recentBeds,
  editingId, onToggleDone, onToggleEdit, onSetWard, onSetBed, onSetPriority, onSetText, onDelete,
  onAddJob,
}) {
  const [openWards, setOpenWards] = useState(new Set());
  const [openBeds, setOpenBeds] = useState(new Set());

  const { wards, noWard } = buildHierarchy(jobs, { wardNames, wardLayouts, recentBeds });

  const toggleWard = (key) => setOpenWards((s) => { const n = new Set(s); n.has(key) ? n.delete(key) : n.add(key); return n; });
  const bedKey = (ward, bed) => `${ward}::${bed}`;
  const toggleBed = (ward, bed) => setOpenBeds((s) => { const k = bedKey(ward, bed); const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); return n; });

  const cardProps = { editingId, onToggleDone, onToggleEdit, onSetWard, onSetBed, onSetPriority, onSetText, onDelete, recentWards, recentBeds };
  const renderCard = (job, hideLocation) => (
    <JobCard key={job.id} job={job} hideLocation={hideLocation} editing={editingId === job.id} {...cardProps} />
  );

  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-5 py-3 flex flex-col gap-2" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 6rem)" }}>
      {wards.length === 0 && noWard.jobs.length === 0 && (
        <p className="text-sm text-gray-400 dark:text-gray-600 text-center mt-10">No jobs yet.</p>
      )}

      {wards.map((w) => {
        const wardOpen = openWards.has(w.ward);
        return (
          <div key={w.ward} className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <button onClick={() => toggleWard(w.ward)} className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-900/60">
              <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                <Chevron open={wardOpen} /> {w.ward}
              </span>
              <span className="flex items-center gap-1.5">
                {w.urgent > 0 && <span className="w-2 h-2 rounded-full bg-red-500" aria-label="Has urgent jobs" />}
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{w.open}</span>
              </span>
            </button>
            {wardOpen && (
              <div className="px-3 pb-3 flex flex-col gap-1.5 pt-1">
                {w.beds.map((b) => {
                  const key = bedKey(w.ward, b.bed);
                  const bOpen = openBeds.has(key);
                  const label = b.bed === null ? "General" : b.bed;
                  return (
                    <div key={key} className="rounded-lg border border-gray-100 dark:border-gray-800/60">
                      <button onClick={() => toggleBed(w.ward, b.bed)} className="w-full flex items-center justify-between px-3 py-2">
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                          <Chevron open={bOpen} /> {label}
                        </span>
                        <span className="flex items-center gap-1.5">
                          {b.urgent > 0 && <span className="w-1.5 h-1.5 rounded-full bg-red-500" aria-label="Has urgent jobs" />}
                          <span className="text-xs font-semibold text-gray-400 dark:text-gray-600">{b.open}</span>
                        </span>
                      </button>
                      {bOpen && (
                        <div className="px-3 pb-3 flex flex-col gap-2">
                          <QuickAddRow ward={w.ward} bed={b.bed || ""} jobs={jobs} onAddJob={onAddJob} />
                          {b.jobs.length === 0 && <p className="text-xs text-gray-400 dark:text-gray-600">No jobs here yet.</p>}
                          {b.jobs.map((job) => renderCard(job, true))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {noWard.jobs.length > 0 && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <button onClick={() => toggleWard(NO_WARD_KEY)} className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-900/60">
            <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
              <Chevron open={openWards.has(NO_WARD_KEY)} /> No ward
            </span>
            <span className="flex items-center gap-1.5">
              {noWard.urgent > 0 && <span className="w-2 h-2 rounded-full bg-red-500" aria-label="Has urgent jobs" />}
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{noWard.open}</span>
            </span>
          </button>
          {openWards.has(NO_WARD_KEY) && (
            <div className="px-3 pb-3 flex flex-col gap-2 pt-1">
              {noWard.jobs.map((job) => renderCard(job, false))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
