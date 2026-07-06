import { useMemo, useState } from "react";
import { tasksForWard } from "../utils/learnedTasks";
import { pushMRU } from "../utils/portfolios";
import {
  bedsForWard,
  hasWardLayout,
  wardNeedsBed,
} from "../utils/wardLayouts";

const WARD_CHIP = "shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors";
const WARD_CHIP_ON = "bg-amber-600 text-white border-amber-600";
const WARD_CHIP_OFF = "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800";
const BED_CHIP = "min-w-[2.25rem] px-2 py-2 rounded-lg text-xs font-bold border transition-colors";
const BED_CHIP_ON = "bg-gray-900 dark:bg-white text-white dark:text-gray-950 border-gray-900 dark:border-white";
const BED_CHIP_OFF = "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800";
const TASK_CHIP = "shrink-0 px-3 py-2 rounded-lg text-xs font-semibold border bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-800 active:scale-95 transition-transform";

export default function RoundCapture({
  recentWards,
  setRecentWards,
  wardLayouts,
  recentBeds,
  wardTasks,
  recentPhrases,
  stickyUrgent,
  onToggleUrgent,
  onAdd,
  onRequestWardSetup,
  activeWard,
  onActiveWardChange,
}) {
  const ward = activeWard;
  const setWard = onActiveWardChange;
  const [bed, setBed] = useState("");
  const [customWard, setCustomWard] = useState("");
  const [customBed, setCustomBed] = useState("");
  const [customTask, setCustomTask] = useState("");
  const [showWardInput, setShowWardInput] = useState(false);
  const [showBedInput, setShowBedInput] = useState(false);
  const [needWard, setNeedWard] = useState(false);
  const [needBed, setNeedBed] = useState(false);

  const taskChips = useMemo(
    () => tasksForWard(wardTasks, recentPhrases, ward),
    [wardTasks, recentPhrases, ward]
  );

  const { beds: layoutBeds } = useMemo(
    () => bedsForWard(ward, wardLayouts, recentBeds),
    [ward, wardLayouts, recentBeds]
  );

  const needsBed = ward && wardNeedsBed(ward, wardLayouts);

  const pickWard = (next) => {
    const trimmed = next.trim();
    if (!trimmed) {
      setWard("");
      setBed("");
      setNeedWard(false);
      return;
    }
    if (!hasWardLayout(wardLayouts, trimmed)) {
      onRequestWardSetup(trimmed);
      return;
    }
    setWard(trimmed);
    setBed("");
    setNeedWard(false);
    setRecentWards(pushMRU(recentWards, trimmed));
  };

  const selectBed = (next) => {
    setBed(String(next).trim());
    setNeedBed(false);
    setShowBedInput(false);
    setCustomBed("");
  };

  const nextBed = () => {
    const idx = layoutBeds.indexOf(bed);
    if (idx >= 0 && idx < layoutBeds.length - 1) {
      selectBed(layoutBeds[idx + 1]);
      return;
    }
    const match = String(bed).match(/^(\d+)(.*)$/);
    if (match) selectBed(String(Number(match[1]) + 1) + (match[2] || ""));
  };

  const tryAdd = (taskText) => {
    const task = taskText.trim();
    if (!task) return;
    if (!ward.trim()) {
      setNeedWard(true);
      return;
    }
    if (needsBed && !bed.trim()) {
      setNeedBed(true);
      return;
    }
    onAdd({ ward, bed: needsBed ? bed : "", text: task, urgent: stickyUrgent });
    setCustomTask("");
  };

  const bedCols = layoutBeds.length <= 8 ? 4 : layoutBeds.length <= 16 ? 6 : 8;

  return (
    <div className="flex flex-col gap-2.5">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <div className={`text-[10px] font-bold uppercase tracking-wide ${needWard ? "text-red-600 dark:text-red-400" : "text-gray-400 dark:text-gray-600"}`}>
            Ward
          </div>
          {ward && hasWardLayout(wardLayouts, ward) && (
            <button
              type="button"
              onClick={() => onRequestWardSetup(ward, wardLayouts[ward])}
              className="text-[10px] font-bold text-amber-700 dark:text-amber-400"
            >
              Edit layout
            </button>
          )}
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 items-center">
          {recentWards.map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => pickWard(ward === w ? "" : w)}
              className={`${WARD_CHIP} ${ward === w ? WARD_CHIP_ON : WARD_CHIP_OFF}`}
            >
              {w}
            </button>
          ))}
          {showWardInput ? (
            <input
              type="text"
              value={customWard}
              onChange={(e) => setCustomWard(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && customWard.trim()) pickWard(customWard);
                if (e.key === "Escape") setShowWardInput(false);
              }}
              onBlur={() => {
                if (customWard.trim()) pickWard(customWard);
                else setShowWardInput(false);
              }}
              autoFocus
              placeholder="Ward"
              className="shrink-0 w-24 bg-gray-100 dark:bg-gray-900 border border-amber-400 rounded-lg px-2 py-1.5 text-xs font-bold focus:outline-none"
            />
          ) : (
            <button type="button" onClick={() => setShowWardInput(true)} className={`${WARD_CHIP} ${WARD_CHIP_OFF}`}>
              + Ward
            </button>
          )}
        </div>
      </div>

      {ward && !hasWardLayout(wardLayouts, ward) && (
        <button
          type="button"
          onClick={() => onRequestWardSetup(ward)}
          className="w-full py-3 rounded-xl border border-dashed border-amber-300 dark:border-amber-800 text-sm font-bold text-amber-800 dark:text-amber-300"
        >
          Set up {ward} before adding jobs
        </button>
      )}

      {ward && hasWardLayout(wardLayouts, ward) && needsBed && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className={`text-[10px] font-bold uppercase tracking-wide ${needBed ? "text-red-600 dark:text-red-400" : "text-gray-400 dark:text-gray-600"}`}>
              Bed {bed ? `· ${bed}` : ""}
            </div>
            {bed && layoutBeds.length > 1 && (
              <button type="button" onClick={nextBed} className="text-[10px] font-bold text-amber-700 dark:text-amber-400">
                Next bed →
              </button>
            )}
          </div>
          {layoutBeds.length > 0 && (
            <div className={`grid gap-1 mb-1.5`} style={{ gridTemplateColumns: `repeat(${bedCols}, minmax(0, 1fr))` }}>
              {layoutBeds.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => selectBed(n)}
                  className={`${BED_CHIP} ${bed === n ? BED_CHIP_ON : BED_CHIP_OFF}`}
                >
                  {n}
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-1.5">
            {showBedInput ? (
              <input
                type="text"
                value={customBed}
                onChange={(e) => setCustomBed(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && customBed.trim()) selectBed(customBed);
                  if (e.key === "Escape") setShowBedInput(false);
                }}
                onBlur={() => {
                  if (customBed.trim()) selectBed(customBed);
                  else setShowBedInput(false);
                }}
                autoFocus
                placeholder="One-off bed or bay…"
                className="flex-1 bg-gray-100 dark:bg-gray-900 border border-amber-400 rounded-lg px-2.5 py-1.5 text-xs font-bold focus:outline-none"
              />
            ) : (
              <button
                type="button"
                onClick={() => setShowBedInput(true)}
                className="text-[11px] font-bold text-gray-500 dark:text-gray-400 px-2 py-1"
              >
                Other bed
              </button>
            )}
            {bed && (
              <button type="button" onClick={() => selectBed("")} className="text-[11px] font-bold text-gray-500 dark:text-gray-400 px-2 py-1">
                Clear bed
              </button>
            )}
          </div>
        </div>
      )}

      {ward && hasWardLayout(wardLayouts, ward) && !needsBed && (
        <p className="text-[11px] text-gray-500 dark:text-gray-400 -mt-1">
          This ward has no beds. Tasks attach to the ward only.
        </p>
      )}

      <div>
        <div className="text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-gray-600 mb-1.5">
          Task
        </div>
        {ward && hasWardLayout(wardLayouts, ward) && (
          <>
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 mb-2">
          {taskChips.map((task) => (
            <button
              key={task}
              type="button"
              onClick={() => tryAdd(task)}
              className={TASK_CHIP}
            >
              {task}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={customTask}
            onChange={(e) => setCustomTask(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                tryAdd(customTask);
              }
            }}
            enterKeyHint="next"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder="Or type a task…"
            className="flex-1 min-w-0 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
          />
          <button
            type="button"
            onClick={() => onToggleUrgent()}
            aria-label="Toggle urgent"
            aria-pressed={stickyUrgent}
            className={`shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center text-xs font-bold ${
              stickyUrgent ? "bg-red-600 text-white border-red-600" : "bg-gray-100 dark:bg-gray-900 text-gray-400 border-gray-200 dark:border-gray-800"
            }`}
          >
            !
          </button>
          <button
            type="button"
            onClick={() => tryAdd(customTask)}
            disabled={!customTask.trim()}
            className="shrink-0 w-10 h-10 rounded-xl bg-amber-600 disabled:bg-gray-200 dark:disabled:bg-gray-800 text-white disabled:text-gray-400 font-bold"
          >
            +
          </button>
        </div>
          </>
        )}
      </div>
    </div>
  );
}
