import { useMemo, useState } from "react";
import { PRIORITY } from "../utils/constants";
import {
  bedMismatchesForWard,
  bedRemapKey,
  defaultLayoutImportPrefs,
  buildLayoutImportPlan,
} from "../utils/layoutWire";
import { hasLayout, totalBeds } from "../utils/wardLayouts";
import BedPickerPanel from "./BedPickerPanel";
import WardSetup from "./WardSetup";
import {
  PANEL,
  SCREEN,
  SCREEN_FOOTER,
  SCREEN_SCROLL,
  SELECTED_CHIP,
  safeBottom,
  safeTop,
  PRIMARY_BTN,
} from "../utils/screenLayout";
import { TYPE_BADGE, TYPE_BODY_SM, TYPE_CAPTION, TYPE_DISPLAY, TYPE_LINK, TYPE_UI } from "../utils/typography";

const FIELD =
  "w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-2 text-base text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-claude-500/30 focus:border-claude-500";

function ReviewJobRow({
  job, index, selected, editing, onToggle, onEdit, onPatch, onCloseEdit,
}) {
  const urgent = job.priority === PRIORITY.URGENT;

  return (
    <div
      className={`rounded-xl border transition-colors animate-list-item-enter motion-reduce:animate-none ${
        selected
          ? "bg-gray-50 dark:bg-gray-900/60 border-gray-200 dark:border-gray-800"
          : "bg-transparent border-gray-100 dark:border-gray-900 opacity-50"
      }`}
      style={{ animationDelay: `${index * 45}ms` }}
    >
      <div className="flex items-start gap-2.5 px-3 py-2.5">
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={selected}
          aria-label={selected ? "Exclude from takeover" : "Include in takeover"}
          className={`mt-0.5 w-7 h-7 rounded-md border-2 shrink-0 flex items-center justify-center transition-colors ${
            selected ? "bg-claude-600 border-claude-600" : "border-gray-400 dark:border-gray-600"
          }`}
        >
          {selected && <span className="text-white text-xs">✓</span>}
        </button>

        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className={TYPE_CAPTION}>Edit before adding</span>
                <button type="button" onClick={onCloseEdit} className={`${TYPE_CAPTION} font-semibold text-claude-700 dark:text-claude-400`}>
                  Done
                </button>
              </div>
              <input
                value={job.text}
                onChange={(e) => onPatch({ text: e.target.value })}
                placeholder="Task"
                className={FIELD}
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={job.ward}
                  onChange={(e) => onPatch({ ward: e.target.value })}
                  placeholder="Ward"
                  className={FIELD}
                />
                <input
                  value={job.bed}
                  onChange={(e) => onPatch({ bed: e.target.value })}
                  placeholder="Bed"
                  className={FIELD}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onPatch({ priority: PRIORITY.ROUTINE })}
                  className={`flex-1 py-2 rounded-xl ${TYPE_UI} border transition-colors ${
                    !urgent
                      ? SELECTED_CHIP
                      : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800"
                  }`}
                >
                  Routine
                </button>
                <button
                  type="button"
                  onClick={() => onPatch({ priority: PRIORITY.URGENT })}
                  className={`flex-1 py-2 rounded-xl ${TYPE_UI} border transition-colors ${
                    urgent
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800"
                  }`}
                >
                  Urgent
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={onEdit}
              className="w-full text-left active:opacity-80"
            >
              <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                {job.ward && (
                  <span className={`${TYPE_BADGE} text-claude-800 dark:text-claude-400 bg-claude-100 dark:bg-claude-900/30 px-1.5 py-0.5 rounded`}>
                    {job.ward}
                  </span>
                )}
                {job.bed && (
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                    {job.bed}
                  </span>
                )}
                {urgent && (
                  <span className={`${TYPE_BADGE} text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-1.5 py-0.5 rounded`}>
                    Urgent
                  </span>
                )}
              </div>
              <p className={TYPE_BODY_SM}>{job.text || "Empty task"}</p>
              <p className={`${TYPE_CAPTION} mt-1`}>Tap to edit</p>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function LayoutImportRow({
  ward,
  incomingLayout,
  localLayouts,
  pref,
  mismatches,
  remappingBed,
  bedRemaps,
  onToggleImport,
  onPickConflict,
  onStartRemap,
  onRemap,
  onCancelRemap,
  onEditLayout,
}) {
  const exists = hasLayout(localLayouts, ward);
  const incomingCount = totalBeds(incomingLayout);
  const needsConflict = pref.import && exists && !pref.conflict;
  const canEditLayout = pref.import && (pref.conflict === "theirs" || !exists);

  return (
    <div className={`${PANEL} p-4`}>
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={pref.import}
          onChange={(e) => onToggleImport(e.target.checked)}
          className="mt-1 w-4 h-4 rounded border-gray-300 text-claude-600 focus:ring-claude-500"
        />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-gray-900 dark:text-white">{ward}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {incomingCount} bed{incomingCount === 1 ? "" : "s"} in their layout
            {exists ? " · you already have this ward" : " · new ward"}
          </div>
        </div>
      </label>

      {canEditLayout && (
        <button
          type="button"
          onClick={onEditLayout}
          className={`${TYPE_LINK} text-xs text-claude-700 dark:text-claude-400 mt-2`}
        >
          Edit layout before import
        </button>
      )}

      {pref.import && exists && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-800">
          <p className={`${TYPE_CAPTION} mb-2`}>Which bed layout?</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onPickConflict("theirs")}
              className={`flex-1 py-2 rounded-xl ${TYPE_UI} border transition-colors ${
                pref.conflict === "theirs"
                  ? SELECTED_CHIP
                  : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800"
              }`}
            >
              Use theirs
            </button>
            <button
              type="button"
              onClick={() => onPickConflict("mine")}
              className={`flex-1 py-2 rounded-xl ${TYPE_UI} border transition-colors ${
                pref.conflict === "mine"
                  ? SELECTED_CHIP
                  : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800"
              }`}
            >
              Keep mine
            </button>
          </div>
        </div>
      )}

      {pref.import && pref.conflict === "mine" && mismatches.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-800">
          <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 mb-2">
            {mismatches.length} bed{mismatches.length === 1 ? "" : "s"} not on your board
          </p>
          <div className="flex flex-col gap-2">
            {mismatches.map((job) => {
              const key = bedRemapKey(ward, job.bed);
              const mapped = bedRemaps[key];
              const isRemapping = remappingBed === key;
              return (
                <div key={key} className="rounded-lg bg-amber-50 dark:bg-amber-950/30 px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-gray-800 dark:text-gray-200">
                      {job.bed}
                      {mapped && (
                        <span className="text-claude-700 dark:text-claude-400"> → {mapped}</span>
                      )}
                    </span>
                    {!isRemapping && (
                      <button
                        type="button"
                        onClick={() => onStartRemap(key)}
                        className="text-xs font-bold text-claude-700 dark:text-claude-400 shrink-0"
                      >
                        {mapped ? "Change" : "Pick bed"}
                      </button>
                    )}
                  </div>
                  {isRemapping && (
                    <div className="mt-2">
                      <BedPickerPanel
                        ward={ward}
                        wardLayouts={localLayouts}
                        recentBeds={{}}
                        selectedBed={mapped || ""}
                        onSelect={(bed) => onRemap(key, bed)}
                        onClear={() => onRemap(key, "")}
                        onSetupWard={() => {}}
                        configured={hasLayout(localLayouts, ward)}
                        embedded
                      />
                      <button type="button" onClick={onCancelRemap} className={`${TYPE_CAPTION} mt-2`}>
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {needsConflict && (
        <p className="mt-2 text-xs text-amber-700 dark:text-amber-400">
          Choose whose bed layout to keep before adding.
        </p>
      )}
    </div>
  );
}

export default function ReviewMerge({
  incomingJobs,
  incomingLayouts = {},
  wardLayouts = {},
  onMerge,
  onDiscard,
}) {
  const layoutOnly = incomingJobs.length === 0 && Object.keys(incomingLayouts).length > 0;
  const [jobs, setJobs] = useState(() => incomingJobs.map((j) => ({ ...j })));
  const [incomingLayoutsState, setIncomingLayoutsState] = useState(() => ({ ...incomingLayouts }));
  const [selected, setSelected] = useState(() => new Set(incomingJobs.map((j) => j.id)));
  const [editingId, setEditingId] = useState(null);
  const [editingLayoutWard, setEditingLayoutWard] = useState(null);
  const [layoutPrefs, setLayoutPrefs] = useState(() =>
    defaultLayoutImportPrefs(incomingLayouts, wardLayouts),
  );
  const [bedRemaps, setBedRemaps] = useState({});
  const [remappingBed, setRemappingBed] = useState(null);

  const incomingWardNames = Object.keys(incomingLayoutsState);

  const toggle = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const patchJob = (id, patch) => {
    setJobs((list) => list.map((j) => (j.id === id ? { ...j, ...patch } : j)));
  };

  const chosen = jobs.filter((j) => selected.has(j.id));

  const layoutBlockers = useMemo(() => {
    const blockers = [];
    for (const ward of incomingWardNames) {
      const pref = layoutPrefs[ward];
      if (!pref?.import) continue;
      if (hasLayout(wardLayouts, ward) && !pref.conflict) {
        blockers.push(`${ward}: pick a layout`);
      }
    }
    return blockers;
  }, [incomingWardNames, layoutPrefs, wardLayouts]);

  const unmappedBeds = useMemo(() => {
    let count = 0;
    for (const ward of incomingWardNames) {
      const pref = layoutPrefs[ward];
      if (!pref?.import || pref.conflict !== "mine") continue;
      const mismatches = bedMismatchesForWard(chosen, ward, wardLayouts[ward], bedRemaps);
      count += mismatches.length;
    }
    return count;
  }, [incomingWardNames, layoutPrefs, wardLayouts, chosen, bedRemaps]);

  const canMerge = layoutOnly
    ? incomingWardNames.some((w) => layoutPrefs[w]?.import) && layoutBlockers.length === 0
    : chosen.length > 0 && layoutBlockers.length === 0;

  const handleMerge = () => {
    const trimmed = chosen.map((j) => ({
      ...j,
      text: j.text.trim(),
      ward: (j.ward || "").trim(),
      bed: (j.bed || "").trim(),
    }));
    onMerge({
      jobs: trimmed,
      layoutImport: buildLayoutImportPlan(layoutPrefs, incomingLayoutsState, wardLayouts),
      bedRemaps,
    });
  };

  if (editingLayoutWard) {
    return (
      <WardSetup
        wardName={editingLayoutWard}
        existingLayout={incomingLayoutsState[editingLayoutWard]}
        onSave={(layout) => {
          setIncomingLayoutsState((prev) => ({ ...prev, [editingLayoutWard]: layout }));
          setEditingLayoutWard(null);
        }}
        onCancel={() => setEditingLayoutWard(null)}
      />
    );
  }

  return (
    <div className={`${SCREEN} px-5`}>
      <div className="shrink-0" style={safeTop()}>
        {layoutOnly ? (
          <>
            <div className="mb-2">
              <span className={`${TYPE_BADGE} text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-md`}>
                Ward setup
              </span>
            </div>
            <h1 className={`${TYPE_DISPLAY} mb-1`}>Import bed layout</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Choose which ward layouts to add to your phone. No jobs in this code. You can edit a layout before importing.
            </p>
          </>
        ) : (
          <>
            <div className="mb-2">
              <span className={`${TYPE_BADGE} text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-md`}>
                {jobs.length} job{jobs.length === 1 ? "" : "s"} to take over
              </span>
            </div>
            <h1 className={`${TYPE_DISPLAY} mb-1`}>Review before it lands</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Uncheck anything you don&apos;t want. Tap a job to edit ward, bed, or wording.
            </p>
          </>
        )}
      </div>

      <div className={`${SCREEN_SCROLL} flex flex-col gap-2 pb-3 animate-fade-in motion-reduce:animate-none`}>
        {!layoutOnly && jobs.map((job, index) => (
          <ReviewJobRow
            key={job.id}
            job={job}
            index={index}
            selected={selected.has(job.id)}
            editing={editingId === job.id}
            onToggle={() => toggle(job.id)}
            onEdit={() => setEditingId(job.id)}
            onPatch={(patch) => patchJob(job.id, patch)}
            onCloseEdit={() => setEditingId(null)}
          />
        ))}

        {incomingWardNames.length > 0 && (
          <div className={layoutOnly ? "" : "mt-2 pt-2 border-t border-gray-200 dark:border-gray-800"}>
            {!layoutOnly && (
              <p className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                Bed layouts
              </p>
            )}
            {incomingWardNames.map((ward) => {
              const pref = layoutPrefs[ward] || { import: false, conflict: null };
              const mismatches = pref.import && pref.conflict === "mine"
                ? bedMismatchesForWard(chosen, ward, wardLayouts[ward], bedRemaps)
                : [];
              return (
                <LayoutImportRow
                  key={ward}
                  ward={ward}
                  incomingLayout={incomingLayoutsState[ward]}
                  localLayouts={wardLayouts}
                  pref={pref}
                  mismatches={mismatches}
                  remappingBed={remappingBed}
                  bedRemaps={bedRemaps}
                  onToggleImport={(on) => {
                    setLayoutPrefs((prev) => ({
                      ...prev,
                      [ward]: {
                        import: on,
                        conflict: on
                          ? (hasLayout(wardLayouts, ward) ? prev[ward]?.conflict || null : "theirs")
                          : null,
                      },
                    }));
                  }}
                  onPickConflict={(conflict) => {
                    setLayoutPrefs((prev) => ({
                      ...prev,
                      [ward]: { ...prev[ward], conflict },
                    }));
                  }}
                  onStartRemap={setRemappingBed}
                  onRemap={(key, bed) => {
                    setBedRemaps((prev) => {
                      const next = { ...prev };
                      if (bed) next[key] = bed;
                      else delete next[key];
                      return next;
                    });
                    setRemappingBed(null);
                  }}
                  onCancelRemap={() => setRemappingBed(null)}
                  onEditLayout={() => setEditingLayoutWard(ward)}
                />
              );
            })}
          </div>
        )}
      </div>

      <div className={SCREEN_FOOTER} style={safeBottom()}>
        {unmappedBeds > 0 && (
          <p className="text-xs text-amber-700 dark:text-amber-400 text-center mb-2">
            {unmappedBeds} bed{unmappedBeds === 1 ? "" : "s"} still unmapped. You can add anyway.
          </p>
        )}
        <button
          type="button"
          onClick={handleMerge}
          disabled={!canMerge}
          className={`${PRIMARY_BTN} mb-2`}
        >
          {layoutOnly
            ? "Add to my wards"
            : `Add ${chosen.length || ""} to my list`}
        </button>
        <button type="button" onClick={onDiscard} className="w-full py-2.5 text-sm font-medium text-gray-500 dark:text-gray-400">
          Discard
        </button>
      </div>
    </div>
  );
}
