import { useState } from "react";
import { buildHierarchy } from "../utils/jobs";
import { NO_WARD_LABEL } from "../utils/constants";
import { groupBedsBySection } from "../utils/wardLayouts";
import JobCard from "./JobCard";
import JobListWithCompleted from "./JobListWithCompleted";
import QuickAddRow from "./QuickAddRow";
import { TYPE_OVERLINE } from "../utils/typography";
import { JOB_LIST_SCROLL, JOB_LIST_SECTION } from "../utils/screenLayout";
import { bedRowTone, sectionCounts } from "../utils/bedDisplay";

const NO_WARD_KEY = "__noward__";

function Chevron({ open }) {
  return <span className={`inline-block transition-transform ${open ? "rotate-90" : ""}`}>›</span>;
}

function bedLabel(bed) {
  return bed === null ? "General" : bed;
}

function BedTileButton({ label, open, tone, counts, onClick }) {
  return (
    <div className={`rounded-lg border overflow-hidden ${tone.shell} ${open ? "ring-2 ring-claude-500/50 border-claude-300 dark:border-claude-800" : ""}`}>
      <button type="button" onClick={onClick} className="w-full flex items-center justify-between px-3 py-2">
        <span className={`${tone.labelSm} flex items-center gap-1.5`}>
          <Chevron open={open} /> {label}
        </span>
        {!tone.empty && (
          <span className="flex items-center gap-1.5">
            {counts.urgent > 0 && <span className="w-1.5 h-1.5 rounded-full bg-red-500" aria-label="Has urgent jobs" />}
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{counts.open}</span>
          </span>
        )}
      </button>
    </div>
  );
}

function BedJobPanel({ ward, bed, bedJobs, jobs, onAddJob, recentPhrases, setRecentPhrases, renderJob }) {
  const label = bedLabel(bed);
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-3 flex flex-col gap-1.5">
      <p className={TYPE_OVERLINE}>{label}</p>
      <QuickAddRow ward={ward} bed={bed || ""} jobs={jobs} onAddJob={onAddJob} recentPhrases={recentPhrases} setRecentPhrases={setRecentPhrases} />
      {bedJobs.length === 0 && <p className="text-xs text-gray-400 dark:text-gray-600">No jobs here yet.</p>}
      {bedJobs.length > 0 && (
        <JobListWithCompleted jobs={bedJobs}>
          {renderJob}
        </JobListWithCompleted>
      )}
    </div>
  );
}

// View 2: everything, nested — wards collapsed by default, expand one to see
// its beds as a grid; expand a bed to see tasks in a full-width panel below.
export default function MasterSheet({
  jobs, wardNames, wardLayouts, recentWards, recentBeds,
  editingId, onToggleDone, onToggleEdit, onSetWard, onSetBed, onSetPriority, onSetText, onSetRemindAt, onDelete,
  onAddJob, recentPhrases, setRecentPhrases, listBottomPad,
}) {
  const [openWards, setOpenWards] = useState(new Set());
  const [openBeds, setOpenBeds] = useState(new Set());
  const [collapsedSections, setCollapsedSections] = useState(new Set());

  const { wards, noWard } = buildHierarchy(jobs, { wardNames, wardLayouts, recentBeds });

  const toggleWard = (key) => setOpenWards((s) => { const n = new Set(s); n.has(key) ? n.delete(key) : n.add(key); return n; });
  const bedKey = (ward, bed) => `${ward}::${bed}`;
  const toggleBed = (ward, bed) => setOpenBeds((s) => { const k = bedKey(ward, bed); const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); return n; });
  const sectionKey = (ward, groupKey) => `${ward}::${groupKey}`;
  const isSectionOpen = (ward, groupKey) => !collapsedSections.has(sectionKey(ward, groupKey));
  const toggleSection = (ward, groupKey) => setCollapsedSections((s) => {
    const k = sectionKey(ward, groupKey);
    const n = new Set(s);
    if (n.has(k)) n.delete(k);
    else n.add(k);
    return n;
  });

  const cardProps = { editingId, onToggleDone, onToggleEdit, onSetWard, onSetBed, onSetPriority, onSetText, onSetRemindAt, onDelete, recentWards, recentBeds };
  const renderJob = (job, hideLocation, index = 0) => (
    <JobCard job={job} hideLocation={hideLocation} editing={editingId === job.id} enterDelay={index * 30} {...cardProps} />
  );

  return (
    <div
      className={JOB_LIST_SCROLL}
      style={{ paddingBottom: listBottomPad ?? "calc(env(safe-area-inset-bottom) + 6rem)" }}
    >
      {wards.length === 0 && noWard.jobs.length === 0 && (
        <p className="text-sm text-gray-400 dark:text-gray-600 text-center mt-10">No jobs yet.</p>
      )}

      {wards.map((w) => {
        const wardOpen = openWards.has(w.ward);
        return (
          <div key={w.ward} className="rounded-xl border border-gray-200 dark:border-gray-800">
            <button onClick={() => toggleWard(w.ward)} className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-900/60 rounded-t-xl">
              <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                <Chevron open={wardOpen} /> {w.ward}
              </span>
              <span className="flex items-center gap-1.5">
                {w.urgent > 0 && <span className="w-2 h-2 rounded-full bg-red-500" aria-label="Has urgent jobs" />}
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{w.open}</span>
              </span>
            </button>
            {wardOpen && (
              <div className="px-3 pb-3 flex flex-col gap-3 pt-1">
                {groupBedsBySection(w.beds, { layout: wardLayouts[w.ward] }).map((group) => {
                  const sectionOpen = group.kind === "general" || isSectionOpen(w.ward, group.key);
                  const counts = sectionCounts(group.beds);
                  return (
                  <div key={group.key} className="flex flex-col gap-1">
                    {group.kind !== "general" ? (
                      <button
                        type="button"
                        onClick={() => toggleSection(w.ward, group.key)}
                        className="w-full flex items-center justify-between gap-2 px-1 pt-1"
                      >
                        <span className="flex items-center gap-1 min-w-0">
                          <Chevron open={sectionOpen} />
                          <span className={`${TYPE_OVERLINE} truncate`}>
                            {group.title}
                          </span>
                        </span>
                        {counts.open > 0 && (
                          <span className="flex items-center gap-1.5 shrink-0">
                            {counts.urgent > 0 && <span className="w-1.5 h-1.5 rounded-full bg-red-500" aria-label="Has urgent jobs" />}
                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{counts.open}</span>
                          </span>
                        )}
                      </button>
                    ) : null}
                    {sectionOpen && (
                    <div className={JOB_LIST_SECTION}>
                      <div className={group.grid ? "grid grid-cols-2 gap-1.5" : "flex flex-col gap-1.5"}>
                        {group.beds.map((b) => {
                          const key = bedKey(w.ward, b.bed);
                          const bOpen = openBeds.has(key);
                          const tone = bedRowTone({ open: b.open, urgent: b.urgent });
                          return (
                            <BedTileButton
                              key={key}
                              label={bedLabel(b.bed)}
                              open={bOpen}
                              tone={tone}
                              counts={{ open: b.open, urgent: b.urgent }}
                              onClick={() => toggleBed(w.ward, b.bed)}
                            />
                          );
                        })}
                      </div>
                      {group.beds
                        .filter((b) => openBeds.has(bedKey(w.ward, b.bed)))
                        .map((b) => (
                          <BedJobPanel
                            key={`panel-${bedKey(w.ward, b.bed)}`}
                            ward={w.ward}
                            bed={b.bed}
                            jobs={jobs}
                            bedJobs={b.jobs}
                            onAddJob={onAddJob}
                            recentPhrases={recentPhrases}
                            setRecentPhrases={setRecentPhrases}
                            renderJob={(job, index) => renderJob(job, true, index)}
                          />
                        ))}
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
        <div className="rounded-xl border border-gray-200 dark:border-gray-800">
          <button onClick={() => toggleWard(NO_WARD_KEY)} className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-900/60 rounded-xl">
            <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
              <Chevron open={openWards.has(NO_WARD_KEY)} /> {NO_WARD_LABEL}
            </span>
            <span className="flex items-center gap-1.5">
              {noWard.urgent > 0 && <span className="w-2 h-2 rounded-full bg-red-500" aria-label="Has urgent jobs" />}
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{noWard.open}</span>
            </span>
          </button>
          {openWards.has(NO_WARD_KEY) && (
            <div className="px-3 pb-3 pt-1">
              <JobListWithCompleted jobs={noWard.jobs}>
                {(job, index) => renderJob(job, false, index)}
              </JobListWithCompleted>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
