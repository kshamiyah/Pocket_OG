import { useLayoutEffect, useRef, useState } from "react";
import { buildHierarchy } from "../utils/jobs";
import { NO_WARD_LABEL } from "../utils/constants";
import { hasLayout, totalBeds } from "../utils/wardLayouts";
import { drillDirection, drillKey } from "../utils/panelMotion";
import JobCard from "./JobCard";
import JobListWithCompleted from "./JobListWithCompleted";
import QuickAddRow from "./QuickAddRow";
import WardBedList from "./BedBoard";
import BedNote from "./BedNote";
import PanelTransition from "./PanelTransition";
import { getBedNote, notesForWard } from "../utils/bedNotes";
import { BACK_LINK, JOB_LIST_SCROLL } from "../utils/screenLayout";
import { TYPE_LINK, TYPE_TITLE, TYPE_UI_SM } from "../utils/typography";

const NO_WARD = "__noward__";
const TILE = "rounded-xl border px-4 py-3.5 flex items-center justify-between text-left bg-gray-50 dark:bg-gray-900/60 border-gray-200 dark:border-gray-800";

function CountBadge({ open, urgent }) {
  if (open === 0) return <span className="text-xs text-gray-400 dark:text-gray-600">—</span>;
  return (
    <span className="flex items-center gap-1.5">
      {urgent > 0 && <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" aria-label="Has urgent jobs" />}
      <span className={`${TYPE_UI_SM} text-gray-700 dark:text-gray-300`}>{open}</span>
    </span>
  );
}

export default function WardDrill({
  jobs, wardNames, wardLayouts, recentWards, recentBeds,
  editingId, onToggleDone, onToggleEdit, onSetWard, onSetBed, onSetPriority, onSetText, onSetRemindAt, onDelete,
  onAddJob, onRegisterWard, onSetupWard, recentPhrases, setRecentPhrases,
  selectedWard, setSelectedWard, selectedBed, setSelectedBed, bedSelected, setBedSelected,
  bedNotes, onSetBedNote,
  listBottomPad,
}) {
  const [newWard, setNewWard] = useState("");

  const panelKey = drillKey(selectedWard, bedSelected, selectedBed, NO_WARD);
  const prevKeyRef = useRef(panelKey);
  const [direction, setDirection] = useState("forward");
  useLayoutEffect(() => {
    setDirection(drillDirection(panelKey, prevKeyRef.current));
    prevKeyRef.current = panelKey;
  }, [panelKey]);

  const { wards, noWard } = buildHierarchy(jobs, { wardNames, wardLayouts, recentBeds });
  const bedsWithNotes = selectedWard && selectedWard !== NO_WARD
    ? notesForWard(bedNotes, selectedWard)
    : new Set();

  const submitNewWard = () => {
    const trimmed = newWard.trim();
    if (!trimmed) return;
    onRegisterWard?.(trimmed);
    setNewWard("");
  };

  const cardProps = {
    editingId, onToggleDone, onToggleEdit, onSetWard, onSetBed, onSetPriority, onSetText, onSetRemindAt, onDelete,
    recentWards, recentBeds,
  };
  const renderCard = (job, index = 0) => (
    <JobCard job={job} hideLocation editing={editingId === job.id} enterDelay={index * 30} {...cardProps} />
  );

  const scrollPad = { paddingBottom: listBottomPad ?? "calc(env(safe-area-inset-bottom) + 6rem)" };
  const scrollClass = JOB_LIST_SCROLL;

  const renderBody = () => {
    if (selectedWard === NO_WARD) {
      return (
        <>
          <button type="button" onClick={() => setSelectedWard(null)} className={`${BACK_LINK} self-start`}>
            ← Wards
          </button>
          <h2 className={`${TYPE_TITLE} -mt-1`}>{NO_WARD_LABEL}</h2>
          <QuickAddRow ward="" bed="" jobs={jobs} onAddJob={onAddJob} recentPhrases={recentPhrases} setRecentPhrases={setRecentPhrases} />
          <div key={noWard.jobs.length > 0 ? "jobs" : "empty"} className={noWard.jobs.length > 0 ? "animate-fade-in motion-reduce:animate-none" : ""}>
            {noWard.jobs.length === 0 && <p className="text-sm text-gray-400 dark:text-gray-600">No jobs here yet.</p>}
            {noWard.jobs.length > 0 && (
              <JobListWithCompleted jobs={noWard.jobs}>
                {renderCard}
              </JobListWithCompleted>
            )}
          </div>
        </>
      );
    }

    if (selectedWard && bedSelected) {
      const wardData = wards.find((w) => w.ward === selectedWard);
      const bedData = wardData?.beds.find((b) => b.bed === selectedBed) ?? { bed: selectedBed, jobs: [] };
      const noteValue = getBedNote(bedNotes, selectedWard, selectedBed);
      return (
        <>
          <button type="button" onClick={() => setBedSelected(false)} className={`${BACK_LINK} self-start`}>
            ← {selectedWard}
          </button>
          <h2 className={`${TYPE_TITLE} -mt-1`}>
            {selectedBed === null ? "General" : selectedBed}
          </h2>
          <BedNote value={noteValue} onChange={(text) => onSetBedNote?.(selectedWard, selectedBed, text)} />
          <QuickAddRow ward={selectedWard} bed={selectedBed || ""} jobs={jobs} onAddJob={onAddJob} recentPhrases={recentPhrases} setRecentPhrases={setRecentPhrases} />
          <div key={bedData.jobs.length > 0 ? "jobs" : "empty"} className={bedData.jobs.length > 0 ? "animate-fade-in motion-reduce:animate-none" : ""}>
            {bedData.jobs.length === 0 && <p className="text-sm text-gray-400 dark:text-gray-600">No jobs here yet.</p>}
            {bedData.jobs.length > 0 && (
              <JobListWithCompleted jobs={bedData.jobs}>
                {renderCard}
              </JobListWithCompleted>
            )}
          </div>
        </>
      );
    }

    if (selectedWard) {
      const wardData = wards.find((w) => w.ward === selectedWard) ?? { beds: [] };
      const layoutEmpty = hasLayout(wardLayouts, selectedWard) && totalBeds(wardLayouts[selectedWard]) === 0;
      return (
        <>
          <button type="button" onClick={() => setSelectedWard(null)} className={`${BACK_LINK} self-start mb-2`}>
            ← Wards
          </button>
          <div className="flex items-baseline gap-3 mb-2 flex-wrap">
            <h2 className={TYPE_TITLE}>{selectedWard}</h2>
            <button type="button" onClick={() => onSetupWard(selectedWard)} className={`${TYPE_LINK} text-claude-700 dark:text-claude-400`}>
              Manage ward
            </button>
          </div>
          {layoutEmpty && (
            <p className="text-sm text-gray-400 dark:text-gray-600 mb-1">
              No beds on this ward. Add jobs under General, or use Manage ward to set up again.
            </p>
          )}
          <WardBedList
            beds={wardData.beds}
            layout={wardLayouts[selectedWard]}
            bedsWithNotes={bedsWithNotes}
            onBedClick={(bed) => { setSelectedBed(bed); setBedSelected(true); }}
          />
        </>
      );
    }

    return (
      <>
        {wards.length === 0 && (
          <p className="text-sm text-gray-400 dark:text-gray-600 text-center mt-10">No wards yet, add one below.</p>
        )}
        {wards.map((w) => (
          <button key={w.ward} type="button" onClick={() => setSelectedWard(w.ward)} className={TILE}>
            <span className="text-sm font-bold text-gray-900 dark:text-white">{w.ward}</span>
            <CountBadge open={w.open} urgent={w.urgent} />
          </button>
        ))}
        {noWard.jobs.length > 0 && (
          <button type="button" onClick={() => setSelectedWard(NO_WARD)} className={TILE}>
            <span className="text-sm font-bold text-gray-900 dark:text-white">{NO_WARD_LABEL}</span>
            <CountBadge open={noWard.open} urgent={noWard.urgent} />
          </button>
        )}
        <div className="flex gap-2 mt-2">
          <input
            value={newWard}
            onChange={(e) => setNewWard(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submitNewWard();
              }
            }}
            placeholder="New ward name"
            className="flex-1 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-claude-500/30 focus:border-claude-500"
          />
          <button
            type="button"
            onClick={submitNewWard}
            disabled={!newWard.trim()}
            className="shrink-0 px-4 rounded-xl bg-claude-600 disabled:bg-gray-200 dark:disabled:bg-gray-800 text-white disabled:text-gray-400 text-sm font-bold"
          >
            Set up
          </button>
        </div>
      </>
    );
  };

  return (
    <PanelTransition panelKey={panelKey} direction={direction} className={scrollClass} style={scrollPad}>
      {renderBody()}
    </PanelTransition>
  );
}
