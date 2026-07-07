import { useState } from "react";
import { buildHierarchy } from "../utils/jobs";
import JobCard from "./JobCard";
import QuickAddRow from "./QuickAddRow";

const TILE = "rounded-xl border px-4 py-3.5 flex items-center justify-between text-left bg-gray-50 dark:bg-gray-900/60 border-gray-200 dark:border-gray-800";
const NO_WARD = "__noward__";

function CountBadge({ open, urgent }) {
  if (open === 0) return <span className="text-xs text-gray-400 dark:text-gray-600">—</span>;
  return (
    <span className="flex items-center gap-1.5">
      {urgent > 0 && <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" aria-label="Has urgent jobs" />}
      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{open}</span>
    </span>
  );
}

// View 1: walk the building — enter a ward, see its beds as tiles, enter a
// bed to see (and add to) its task list. Mirrors the physical round rather
// than presenting one flat list.
//
// Focus (selectedWard/selectedBed/bedSelected) is controlled by the parent
// rather than owned here, so it survives switching to Overview/All jobs and
// back, and so the FAB elsewhere can see and match where the user actually
// is instead of tracking its own separate, easily-stale idea of "here".
export default function WardDrill({
  jobs, wardNames, wardLayouts, recentWards, recentBeds,
  editingId, onToggleDone, onToggleEdit, onSetWard, onSetBed, onSetPriority, onSetText, onDelete,
  onAddJob, onSetupWard,
  selectedWard, setSelectedWard, selectedBed, setSelectedBed, bedSelected, setBedSelected,
}) {
  const [newWard, setNewWard] = useState("");

  const { wards, noWard } = buildHierarchy(jobs, { wardNames, wardLayouts, recentBeds });

  const cardProps = { editingId, onToggleDone, onToggleEdit, onSetWard, onSetBed, onSetPriority, onSetText, onDelete, recentWards, recentBeds };
  const renderCard = (job) => (
    <JobCard key={job.id} job={job} hideLocation editing={editingId === job.id} {...cardProps} />
  );

  if (selectedWard === NO_WARD) {
    return (
      <div className="flex-1 min-h-0 overflow-y-auto px-5 py-3 flex flex-col gap-3" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 6rem)" }}>
        <button onClick={() => setSelectedWard(null)} className="text-sm font-bold text-gray-500 dark:text-gray-400 self-start">
          ← Wards
        </button>
        <h2 className="text-lg font-extrabold text-gray-900 dark:text-white -mt-1">No ward</h2>
        <QuickAddRow ward="" bed="" jobs={jobs} onAddJob={onAddJob} />
        <div className="flex flex-col gap-2">
          {noWard.jobs.length === 0 && <p className="text-sm text-gray-400 dark:text-gray-600">No jobs here yet.</p>}
          {noWard.jobs.map(renderCard)}
        </div>
      </div>
    );
  }

  if (selectedWard && bedSelected) {
    const wardData = wards.find((w) => w.ward === selectedWard);
    const bedData = wardData?.beds.find((b) => b.bed === selectedBed) ?? { bed: selectedBed, jobs: [] };
    return (
      <div className="flex-1 min-h-0 overflow-y-auto px-5 py-3 flex flex-col gap-3" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 6rem)" }}>
        <button onClick={() => setBedSelected(false)} className="text-sm font-bold text-gray-500 dark:text-gray-400 self-start">
          ← {selectedWard}
        </button>
        <h2 className="text-lg font-extrabold text-gray-900 dark:text-white -mt-1">
          {selectedBed === null ? "General" : selectedBed}
        </h2>
        <QuickAddRow ward={selectedWard} bed={selectedBed || ""} jobs={jobs} onAddJob={onAddJob} />
        <div className="flex flex-col gap-2">
          {bedData.jobs.length === 0 && <p className="text-sm text-gray-400 dark:text-gray-600">No jobs here yet.</p>}
          {bedData.jobs.map(renderCard)}
        </div>
      </div>
    );
  }

  if (selectedWard) {
    const wardData = wards.find((w) => w.ward === selectedWard) ?? { beds: [] };
    return (
      <div className="flex-1 min-h-0 overflow-y-auto px-5 py-3 flex flex-col gap-2" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 6rem)" }}>
        <button onClick={() => setSelectedWard(null)} className="text-sm font-bold text-gray-500 dark:text-gray-400 self-start mb-1">
          ← Wards
        </button>
        <h2 className="text-lg font-extrabold text-gray-900 dark:text-white mb-2">{selectedWard}</h2>
        {wardData.beds.map((b) => (
          <button
            key={b.bed ?? "general"}
            onClick={() => { setSelectedBed(b.bed); setBedSelected(true); }}
            className={TILE}
          >
            <span className="text-sm font-bold text-gray-900 dark:text-white">{b.bed === null ? "General" : b.bed}</span>
            <CountBadge open={b.open} urgent={b.urgent} />
          </button>
        ))}
        <button onClick={() => onSetupWard(selectedWard)} className="mt-2 text-xs font-bold text-amber-700 dark:text-amber-400 text-left">
          Manage beds for this ward
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-5 py-3 flex flex-col gap-2" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 6rem)" }}>
      {wards.length === 0 && (
        <p className="text-sm text-gray-400 dark:text-gray-600 text-center mt-10">No wards yet, add one below.</p>
      )}
      {wards.map((w) => (
        <button key={w.ward} onClick={() => setSelectedWard(w.ward)} className={TILE}>
          <span className="text-sm font-bold text-gray-900 dark:text-white">{w.ward}</span>
          <CountBadge open={w.open} urgent={w.urgent} />
        </button>
      ))}
      {noWard.jobs.length > 0 && (
        <button onClick={() => setSelectedWard(NO_WARD)} className={TILE}>
          <span className="text-sm font-bold text-gray-900 dark:text-white">No ward</span>
          <CountBadge open={noWard.open} urgent={noWard.urgent} />
        </button>
      )}
      <div className="flex gap-2 mt-2">
        <input
          value={newWard}
          onChange={(e) => setNewWard(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && newWard.trim() && setSelectedWard(newWard.trim())}
          placeholder="New ward name"
          className="flex-1 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
        />
        <button
          onClick={() => newWard.trim() && setSelectedWard(newWard.trim())}
          disabled={!newWard.trim()}
          className="shrink-0 px-4 rounded-xl bg-amber-600 disabled:bg-gray-200 dark:disabled:bg-gray-800 text-white disabled:text-gray-400 text-sm font-bold"
        >
          Enter
        </button>
      </div>
    </div>
  );
}
