import { useMemo, useState } from "react";
import { SORT_MODE, NO_WARD_LABEL } from "../utils/constants";
import { groupByWard, summarize } from "../utils/jobs";
import JobCard from "./JobCard";
import JobListWithCompleted from "./JobListWithCompleted";
import PanelTransition from "./PanelTransition";
import { SEGMENT_TAB, SEGMENT_ON, JOB_LIST_SCROLL, JOB_LIST_SECTION } from "../utils/screenLayout";
import { TYPE_META, TYPE_OVERLINE, TYPE_UI_SM } from "../utils/typography";

// The flat, urgency-first master view — same jobs as WardDrill/MasterSheet,
// no location grouping by default, for the moments a whole-patch glance
// matters more than walking the building (triage, pre-handover check).
export default function AllJobsList({
  jobs, recentWards, recentBeds, wardLayouts,
  editingId, onToggleDone, onToggleEdit, onSetWard, onSetBed, onSetPriority, onSetText, onSetRemindAt, onDelete,
  listBottomPad,
}) {
  const [sortMode, setSortMode] = useState(SORT_MODE.URGENCY);
  const summary = useMemo(() => summarize(jobs), [jobs]);

  const cardProps = {
    editingId, onToggleDone, onToggleEdit, onSetWard, onSetBed, onSetPriority, onSetText, onSetRemindAt, onDelete,
    recentWards, recentBeds, wardLayouts,
  };
  const renderCard = (job, index = 0) => (
    <JobCard
      job={job}
      hideWard={sortMode === SORT_MODE.WARD}
      editing={editingId === job.id}
      enterDelay={index * 30}
      {...cardProps}
    />
  );

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="shrink-0 px-5 pt-3 flex items-center justify-between">
        <div className={`${TYPE_META} uppercase`}>
          {summary.open} OPEN · {summary.urgent} URGENT · {summary.done} DONE
        </div>
        <div className={`flex rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden ${TYPE_UI_SM}`}>
          <button onClick={() => setSortMode(SORT_MODE.URGENCY)} className={`${SEGMENT_TAB} ${sortMode === SORT_MODE.URGENCY ? SEGMENT_ON : "text-gray-500 dark:text-gray-400"}`}>
            Urgency
          </button>
          <button onClick={() => setSortMode(SORT_MODE.WARD)} className={`${SEGMENT_TAB} ${sortMode === SORT_MODE.WARD ? SEGMENT_ON : "text-gray-500 dark:text-gray-400"}`}>
            Ward
          </button>
        </div>
      </div>

      <PanelTransition panelKey={sortMode} direction="fade" className="flex-1 min-h-0 flex flex-col">
        <div
          className={JOB_LIST_SCROLL}
          style={{ paddingBottom: listBottomPad ?? "calc(env(safe-area-inset-bottom) + 6rem)" }}
        >
          {jobs.length === 0 && (
            <p className="text-sm text-gray-400 dark:text-gray-600 text-center mt-10">
              No jobs yet. Tap + to add your first one.
            </p>
          )}

          {jobs.length > 0 && sortMode === SORT_MODE.URGENCY && (
            <JobListWithCompleted key="urgency-list" jobs={jobs} listClassName="animate-fade-in motion-reduce:animate-none">
              {renderCard}
            </JobListWithCompleted>
          )}

          {jobs.length > 0 && sortMode === SORT_MODE.WARD &&
            groupByWard(jobs).map(([ward, list]) => (
              <div key={ward} className={JOB_LIST_SECTION}>
                <div className={`${TYPE_OVERLINE} mt-1`}>
                  {ward === NO_WARD_LABEL ? NO_WARD_LABEL : ward} · {list.length}
                </div>
                <JobListWithCompleted jobs={list}>
                  {renderCard}
                </JobListWithCompleted>
              </div>
            ))}
        </div>
      </PanelTransition>
    </div>
  );
}
