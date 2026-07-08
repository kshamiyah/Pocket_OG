import { useEffect, useRef, useState } from "react";
import { PRIORITY } from "../utils/constants";
import { formatJobTime } from "../utils/time";
import { formatReminderLabel, reminderStatus, remindAtFromOffset, SNOOZE_MINUTES } from "../utils/reminders";
import ReminderPicker from "./ReminderPicker";

const REVEAL_WIDTH = 76;

export default function JobCard({
  job, editing, hideLocation = false,
  onToggleDone, onToggleEdit, onSetPriority, onSetText, onSetRemindAt, onDelete,
}) {
  const urgent = job.priority === PRIORITY.URGENT;

  const [now, setNow] = useState(() => Date.now());
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const drag = useRef(null);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const timeLabel = formatJobTime(job.createdAt, now);
  const reminder = reminderStatus(job.remindAt, now);
  const reminderLabel = job.remindAt && !job.done ? formatReminderLabel(job.remindAt, now) : null;

  const swipeEnabled = !editing;

  const toggleEdit = () => {
    setDragX(0);
    setDragging(false);
    drag.current = null;
    onToggleEdit(job.id);
  };

  const onPointerDown = (e) => {
    if (!swipeEnabled) return;
    drag.current = { startX: e.clientX, startY: e.clientY, baseX: dragX, locked: false, pointerId: e.pointerId };
  };
  const onPointerMove = (e) => {
    if (!swipeEnabled) return;
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
    if (!swipeEnabled) return;
    const d = drag.current;
    if (!d) return;
    if (d.locked) setDragX((x) => (x < -REVEAL_WIDTH / 2 ? -REVEAL_WIDTH : 0));
    setDragging(false);
    drag.current = null;
  };

  return (
    <div className={`relative rounded-xl ${editing ? "" : "overflow-hidden"}`}>
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
        style={{ transform: `translateX(${dragX}px)`, transition: dragging ? "none" : "transform 150ms ease-out", touchAction: editing ? "auto" : "pan-y" }}
        className={`rounded-xl border px-3 py-2.5 bg-gray-50 dark:bg-gray-900/60 ${
          reminder === "due" && !job.done
            ? "border-claude-500 dark:border-claude-600 ring-1 ring-claude-500/30"
            : urgent && !job.done
              ? "border-red-300 dark:border-red-900"
              : "border-gray-200 dark:border-gray-800"
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

          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
              {!hideLocation && job.ward && (
                <span className="text-[10px] font-bold uppercase tracking-wide text-claude-800 dark:text-claude-400 bg-claude-100 dark:bg-claude-900/30 px-1.5 py-0.5 rounded">
                  {job.ward}
                </span>
              )}
              {!hideLocation && job.bed && (
                <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                  {job.bed}
                </span>
              )}
              {urgent && !job.done && (
                <span className="text-[10px] font-bold uppercase tracking-wide text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-1.5 py-0.5 rounded">
                  Urgent
                </span>
              )}
              {editing ? (
                <button type="button" onClick={toggleEdit} className="ml-auto text-[10px] font-bold text-gray-400 dark:text-gray-600">
                  Done
                </button>
              ) : null}
            </div>

            {editing ? (
              <input
                value={job.text}
                onChange={(e) => onSetText(job.id, e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && toggleEdit()}
                className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 text-base text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-claude-500/30 focus:border-claude-500"
              />
            ) : (
              <button
                type="button"
                onClick={toggleEdit}
                onPointerDown={(e) => e.stopPropagation()}
                className="w-full text-left active:opacity-80"
                aria-label={`Edit job: ${job.text}`}
              >
                <p className={`text-sm leading-snug ${job.done ? "text-gray-400 dark:text-gray-600 line-through" : "text-gray-900 dark:text-gray-100"}`}>
                  {job.text}
                </p>
                {timeLabel && (
                  <p className="mt-0.5 text-[11px] tabular-nums text-gray-400 dark:text-gray-600">
                    {timeLabel}
                  </p>
                )}
                {reminderLabel && (
                  <p className={`mt-0.5 text-[11px] font-bold tabular-nums ${
                    reminder === "due"
                      ? "text-claude-700 dark:text-claude-400"
                      : "text-gray-500 dark:text-gray-500"
                  }`}
                  >
                    {reminderLabel}
                  </p>
                )}
              </button>
            )}
            {editing && timeLabel && (
              <p className="mt-0.5 text-[11px] tabular-nums text-gray-400 dark:text-gray-600">
                Added {timeLabel}
              </p>
            )}

            {editing && (
              <div
                className="mt-2 min-w-0 max-w-full overflow-hidden flex flex-col gap-3 relative z-10"
                onPointerDown={(e) => e.stopPropagation()}
                onPointerUp={(e) => e.stopPropagation()}
                onPointerMove={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                <ReminderPicker
                  remindAt={job.remindAt}
                  onChange={(next) => onSetRemindAt(job.id, next)}
                />
                {job.remindAt && (
                  <button
                    type="button"
                    onClick={() => onSetRemindAt(job.id, remindAtFromOffset(SNOOZE_MINUTES))}
                    className="self-start text-xs font-bold text-claude-700 dark:text-claude-400"
                  >
                    Snooze +{SNOOZE_MINUTES}m
                  </button>
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onSetPriority(job.id, PRIORITY.ROUTINE)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-colors ${
                      !urgent
                        ? "bg-gray-900 dark:bg-white text-white dark:text-gray-950 border-gray-900 dark:border-white"
                        : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800"
                    }`}
                  >
                    Routine
                  </button>
                  <button
                    type="button"
                    onClick={() => onSetPriority(job.id, PRIORITY.URGENT)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-colors ${
                      urgent
                        ? "bg-red-600 text-white border-red-600"
                        : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800"
                    }`}
                  >
                    Urgent
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
