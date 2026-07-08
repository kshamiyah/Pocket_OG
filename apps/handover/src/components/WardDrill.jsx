import { useState } from "react";
import { buildHierarchy } from "../utils/jobs";
import { NO_WARD_LABEL } from "../utils/constants";
import { hasLayout, totalBeds } from "../utils/wardLayouts";
import JobCard from "./JobCard";
import QuickAddRow from "./QuickAddRow";
import WardBedList from "./BedBoard";
const NO_WARD = "__noward__";
const TILE = "rounded-xl border px-4 py-3.5 flex items-center justify-between text-left bg-gray-50 dark:bg-gray-900/60 border-gray-200 dark:border-gray-800";

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
  editingId, onToggleDone, onToggleEdit, onSetWard, onSetBed, onSetPriority, onSetText, onSetRemindAt, onDelete,
  onAddJob, onSetupWard,
  selectedWard, setSelectedWard, selectedBed, setSelectedBed, bedSelected, setBedSelected,
  listBottomPad,
}) {
  const [newWard, setNewWard] = useState("");

  const { wards, noWard } = buildHierarchy(jobs, { wardNames, wardLayouts, recentBeds });

  const cardProps = { editingId, onToggleDone, onToggleEdit, onSetWard, onSetBed, onSetPriority, onSetText, onSetRemindAt, onDelete, recentWards, recentBeds };
  const renderCard = (job) => (
    <JobCard key={job.id} job={job} hideLocation editing={editingId === job.id} {...cardProps} />
  );

  const scrollPad = { paddingBottom: listBottomPad ?? "calc(env(safe-area-inset-bottom) + 6rem)" };
  const scrollClass = "flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden px-5 py-3 flex flex-col gap-2 touch-pan-y";

  if (selectedWard === NO_WARD) {
    return (
      <div className={scrollClass} style={scrollPad}>
        <button onClick={() => setSelectedWard(null)} className="text-sm font-bold text-gray-500 dark:text-gray-400 self-start">
          ← Wards
        </button>
        <h2 className="text-lg font-extrabold text-gray-900 dark:text-white -mt-1">{NO_WARD_LABEL}</h2>
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
      <div className={`${scrollClass} gap-3`} style={scrollPad}>
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
    const layoutEmpty = hasLayout(wardLayouts, selectedWard) && totalBeds(wardLayouts[selectedWard]) === 0;
    return (
      <div className={scrollClass} style={scrollPad}>
        <button onClick={() => setSelectedWard(null)} className="text-sm font-bold text-gray-500 dark:text-gray-400 self-start mb-2">
          ← Wards
        </button>
        <div className="flex items-baseline gap-3 mb-2 flex-wrap">
          <h2 className="text-lg font-extrabold text-gray-900 dark:text-white">{selectedWard}</h2>
          <button onClick={() => onSetupWard(selectedWard)} className="text-sm font-bold text-claude-700 dark:text-claude-400">
            Manage beds
          </button>
        </div>
        {layoutEmpty && (
          <p className="text-sm text-gray-400 dark:text-gray-600 mb-1">
            No beds on this ward. Add jobs under General, or use Manage beds to set up again.
          </p>
        )}
        <WardBedList
          beds={wardData.beds}
          layout={wardLayouts[selectedWard]}
          onBedClick={(bed) => { setSelectedBed(bed); setBedSelected(true); }}
        />
      </div>
    );
  }

  return (
    <div className={scrollClass} style={scrollPad}>
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
          <span className="text-sm font-bold text-gray-900 dark:text-white">{NO_WARD_LABEL}</span>
          <CountBadge open={noWard.open} urgent={noWard.urgent} />
        </button>
      )}
      <div className="flex gap-2 mt-2">
        <input
          value={newWard}
          onChange={(e) => setNewWard(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && newWard.trim() && setSelectedWard(newWard.trim())}
          placeholder="New ward name"
          className="flex-1 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-claude-500/30 focus:border-claude-500"
        />
        <button
          onClick={() => newWard.trim() && setSelectedWard(newWard.trim())}
          disabled={!newWard.trim()}
          className="shrink-0 px-4 rounded-xl bg-claude-600 disabled:bg-gray-200 dark:disabled:bg-gray-800 text-white disabled:text-gray-400 text-sm font-bold"
        >
          Enter
        </button>
      </div>
    </div>
  );
}
