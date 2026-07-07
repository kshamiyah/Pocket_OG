import { useRef, useState } from "react";
import { PRIORITY } from "../utils/constants";

const CHIP = "shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors";
const CHIP_ON = "bg-amber-600 text-white border-amber-600";
const CHIP_OFF = "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800";
const REVEAL_WIDTH = 76;

// hideLocation suppresses the ward/bed badges when the surrounding screen
// already fixes that context (a bed's own task list, an expanded row in the
// master sheet) — editing is still reachable via the small Edit button
// rather than tapping a now-hidden badge.
export default function JobCard({
  job, editing, hideLocation = false,
  onToggleDone, onToggleEdit, onSetWard, onSetBed, onSetPriority, onSetText, onDelete,
  recentWards, recentBeds,
}) {
  const urgent = job.priority === PRIORITY.URGENT;
  const jobBeds = recentBeds[job.ward] || [];

  // Swipe-left-to-reveal-delete, pointer events (not touch-only) so it
  // works with a mouse too. Marking done already has a fast single tap;
  // delete didn't, until now, without opening the editor first.
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const drag = useRef(null);

  const onPointerDown = (e) => {
    drag.current = { startX: e.clientX, startY: e.clientY, baseX: dragX, locked: false, pointerId: e.pointerId };
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (!d.locked) {
      if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy)) return;
      d.locked = true;
      setDragging(true);
      e.currentTarget.setPointerCapture?.(d.pointerId);
    }
    setDragX(Math.max(-REVEAL_WIDTH, Math.min(0, d.baseX + dx)));
  };
  const endDrag = () => {
    const d = drag.current;
    if (!d) return;
    if (d.locked) setDragX((x) => (x < -REVEAL_WIDTH / 2 ? -REVEAL_WIDTH : 0));
    setDragging(false);
    drag.current = null;
  };

  return (
    <div className="relative rounded-xl overflow-hidden">
      {dragX < 0 && (
        <button
          onClick={() => onDelete(job.id)}
          aria-label="Delete job"
          className="absolute inset-y-0 right-0 flex items-center justify-center text-white text-xs font-bold bg-red-600"
          style={{ width: REVEAL_WIDTH }}
        >
          Delete
        </button>
      )}
      {dragX < 0 && (
        <button
          aria-label="Close swipe actions"
          className="absolute inset-0"
          style={{ right: REVEAL_WIDTH }}
          onClick={() => setDragX(0)}
        />
      )}

      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        style={{ transform: `translateX(${dragX}px)`, transition: dragging ? "none" : "transform 150ms ease-out", touchAction: "pan-y" }}
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
              {!hideLocation && (
                <button
                  onClick={() => onToggleEdit(job.id)}
                  className={job.ward
                    ? "text-[10px] font-bold uppercase tracking-wide text-amber-800 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-1.5 py-0.5 rounded"
                    : "text-[10px] font-semibold text-gray-400 dark:text-gray-600 px-1.5 py-0.5 rounded border border-dashed border-gray-300 dark:border-gray-700"}
                >
                  {job.ward || "+ ward"}
                </button>
              )}
              {!hideLocation && job.ward && (
                <button
                  onClick={() => onToggleEdit(job.id)}
                  className={job.bed
                    ? "text-[10px] font-bold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded"
                    : "text-[10px] font-semibold text-gray-400 dark:text-gray-600 px-1.5 py-0.5 rounded border border-dashed border-gray-300 dark:border-gray-700"}
                >
                  {job.bed || "+ bed"}
                </button>
              )}
              {urgent && !job.done && (
                <span className="text-[10px] font-bold uppercase tracking-wide text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-1.5 py-0.5 rounded">
                  Urgent
                </span>
              )}
              {hideLocation && (
                <button onClick={() => onToggleEdit(job.id)} className="ml-auto text-[10px] font-bold text-gray-400 dark:text-gray-600">
                  Edit
                </button>
              )}
            </div>

            {editing ? (
              <input
                value={job.text}
                onChange={(e) => onSetText(job.id, e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
                className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 text-base text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
              />
            ) : (
              <p className={`text-sm leading-snug ${job.done ? "text-gray-400 dark:text-gray-600 line-through" : "text-gray-900 dark:text-gray-100"}`}>
                {job.text}
              </p>
            )}

            {editing && (
              <div className="mt-2 flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  {recentWards.map((w) => (
                    <button key={w} onClick={() => onSetWard(job.id, w)} className={`${CHIP} ${job.ward === w ? CHIP_ON : CHIP_OFF}`}>
                      {w}
                    </button>
                  ))}
                  <button onClick={() => onSetWard(job.id, "")} className={`${CHIP} ${CHIP_OFF}`}>No ward</button>
                  <button
                    onClick={() => onSetPriority(job.id, urgent ? PRIORITY.ROUTINE : PRIORITY.URGENT)}
                    className={`${CHIP} ${urgent ? "bg-red-600 text-white border-red-600" : CHIP_OFF}`}
                  >
                    {urgent ? "Urgent ✓" : "Mark urgent"}
                  </button>
                  <button onClick={() => onDelete(job.id)} className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 dark:text-red-400">
                    Delete
                  </button>
                </div>
                {job.ward && jobBeds.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {jobBeds.map((b) => (
                      <button key={b} onClick={() => onSetBed(job.id, b)} className={`${CHIP} ${job.bed === b ? CHIP_ON : CHIP_OFF}`}>
                        {b}
                      </button>
                    ))}
                    <button onClick={() => onSetBed(job.id, "")} className={`${CHIP} ${CHIP_OFF}`}>No bed</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
