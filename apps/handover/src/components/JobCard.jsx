import { useEffect, useRef, useState } from "react";
import { PRIORITY } from "../utils/constants";
import { formatJobTime } from "../utils/time";
import { formatReminderLabel, reminderStatus, remindAtFromOffset, SNOOZE_MINUTES } from "../utils/reminders";
import ReminderPicker from "./ReminderPicker";
import { SELECTED_CHIP } from "../utils/screenLayout";
import { TYPE_BADGE, TYPE_BODY_SM, TYPE_CAPTION, TYPE_META, TYPE_UI, TYPE_UI_SM } from "../utils/typography";

const REVEAL_WIDTH = 76;

function jobMetaLine({ job, hideLocation, hideWard, timeLabel, reminderLabel }) {
  const parts = [];
  if (!hideLocation) {
    if (!hideWard && job.ward) parts.push(job.ward);
    if (job.bed) parts.push(job.bed);
  }
  if (timeLabel) parts.push(timeLabel);
  if (reminderLabel) parts.push(reminderLabel);
  return parts.join(" · ");
}

export default function JobCard({
  job, editing, hideLocation = false, hideWard = false, enterDelay = 0,
  onToggleDone, onToggleEdit, onSetPriority, onSetText, onSetRemindAt, onDelete,
}) {
  const urgent = job.priority === PRIORITY.URGENT;

  const [now, setNow] = useState(() => Date.now());
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [checkPop, setCheckPop] = useState(false);
  const drag = useRef(null);
  const prevDoneRef = useRef(job.done);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (job.done && !prevDoneRef.current) {
      setCheckPop(true);
      const t = window.setTimeout(() => setCheckPop(false), 160);
      prevDoneRef.current = job.done;
      return () => window.clearTimeout(t);
    }
    prevDoneRef.current = job.done;
    return undefined;
  }, [job.done]);

  const timeLabel = formatJobTime(job.createdAt, now);
  const reminder = reminderStatus(job.remindAt, now);
  const reminderLabel = job.remindAt && !job.done ? formatReminderLabel(job.remindAt, now) : null;
  const metaLine = jobMetaLine({ job, hideLocation, hideWard, timeLabel, reminderLabel });

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
    <div
      className={`relative rounded-xl animate-list-item-enter motion-reduce:animate-none ${editing ? "" : "overflow-hidden"}`}
      style={{ animationDelay: enterDelay ? `${enterDelay}ms` : undefined }}
    >
      {dragX < 0 && (
        <button
          onClick={() => onDelete(job.id)}
          aria-label="Delete job"
          className="absolute inset-y-0 right-0 flex items-center justify-center text-white text-xs font-semibold bg-red-600"
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
        {...(swipeEnabled ? {
          onPointerDown,
          onPointerMove,
          onPointerUp: endDrag,
          onPointerCancel: endDrag,
        } : {})}
        style={{ transform: `translateX(${dragX}px)`, transition: dragging ? "none" : "transform 150ms ease-out", touchAction: editing ? "manipulation" : "pan-y" }}
        className={`rounded-xl border px-2.5 py-2 bg-gray-50 dark:bg-gray-900/60 transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none ${
          job.done ? "opacity-55 scale-[0.99]" : "opacity-100 scale-100"
        } ${
          reminder === "due" && !job.done
            ? "border-claude-500 dark:border-claude-600 ring-1 ring-claude-500/30"
            : urgent && !job.done
              ? "border-red-300 dark:border-red-900"
              : "border-gray-200 dark:border-gray-800"
        }`}
      >
        <div className={`flex gap-2 ${editing ? "items-start" : "items-center"}`}>
          <button
            onClick={() => onToggleDone(job.id)}
            aria-label={job.done ? "Mark not done" : "Mark done"}
            className="shrink-0 min-w-10 min-h-10 -ml-1 flex items-center justify-center"
          >
            <span
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-150 ease-out ${
              job.done ? "bg-emerald-600 border-emerald-600" : "border-gray-400 dark:border-gray-600"
            }`}
            >
              {job.done && (
                <span className={`text-white text-[10px] leading-none ${checkPop ? "animate-check-pop motion-reduce:animate-none" : ""}`}>✓</span>
              )}
            </span>
          </button>

          <div className="flex-1 min-w-0 overflow-hidden py-0.5">
            {editing && (
              <div className="flex items-center gap-1 flex-wrap mb-1.5">
                {!hideLocation && !hideWard && job.ward && (
                  <span className={`${TYPE_BADGE} leading-none text-claude-800 dark:text-claude-400 bg-claude-100 dark:bg-claude-900/30 px-1 py-0.5 rounded`}>
                    {job.ward}
                  </span>
                )}
                {!hideLocation && job.bed && (
                  <span className={`${TYPE_UI_SM} leading-none normal-case tracking-normal text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded`}>
                    {job.bed}
                  </span>
                )}
                {urgent && !job.done && (
                  <span className={`${TYPE_BADGE} leading-none text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-1 py-0.5 rounded`}>
                    Urgent
                  </span>
                )}
                <button type="button" onClick={toggleEdit} className={`ml-auto ${TYPE_CAPTION}`}>
                  Done
                </button>
              </div>
            )}

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
                className="w-full text-left active:opacity-80 min-w-0"
                aria-label={`Edit job: ${job.text}`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  {urgent && !job.done && (
                    <span className={`${TYPE_BADGE} leading-none shrink-0 text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-1 py-0.5 rounded`}>
                      Urgent
                    </span>
                  )}
                  <p className={`${TYPE_BODY_SM} leading-snug truncate min-w-0 ${job.done ? "text-gray-400 dark:text-gray-600 line-through" : ""}`}>
                    {job.text}
                  </p>
                </div>
                {metaLine && (
                  <p className={`${TYPE_META} leading-tight mt-0.5 truncate ${reminder === "due" ? "font-semibold text-claude-700 dark:text-claude-400" : ""}`}>
                    {metaLine}
                  </p>
                )}
              </button>
            )}
            {editing && timeLabel && (
              <p className={`mt-0.5 ${TYPE_META}`}>
                Added {timeLabel}
              </p>
            )}

            {editing && (
              <div
                className="mt-2 min-w-0 max-w-full overflow-hidden flex flex-col gap-3 relative z-10 touch-manipulation"
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <ReminderPicker
                  remindAt={job.remindAt}
                  onChange={(next) => onSetRemindAt(job.id, next)}
                />
                {job.remindAt && (
                  <button
                    type="button"
                    onClick={() => onSetRemindAt(job.id, remindAtFromOffset(SNOOZE_MINUTES))}
                    className="self-start text-xs font-semibold text-claude-700 dark:text-claude-400"
                  >
                    Snooze +{SNOOZE_MINUTES}m
                  </button>
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onSetPriority(job.id, PRIORITY.ROUTINE)}
                    className={`flex-1 py-2.5 rounded-xl ${TYPE_UI} border transition-colors ${
                      !urgent
                        ? SELECTED_CHIP
                        : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800"
                    }`}
                  >
                    Routine
                  </button>
                  <button
                    type="button"
                    onClick={() => onSetPriority(job.id, PRIORITY.URGENT)}
                    className={`flex-1 py-2.5 rounded-xl ${TYPE_UI} border transition-colors ${
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
