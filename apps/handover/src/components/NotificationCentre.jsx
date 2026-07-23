import { useEffect, useRef, useState } from "react";
import { formatReminderLabel } from "../utils/reminders";
import { bottomSheetTransform, useBottomSheetSwipe } from "../utils/useBottomSheetSwipe";
import SheetDragHandle, { SheetSafeBottom } from "./SheetDragHandle";
import { TYPE_BADGE, TYPE_BODY_SM, TYPE_GROUP_HEADER, TYPE_META, TYPE_OVERLINE, TYPE_UI_SM } from "../utils/typography";

const ROW = "w-full text-left px-5 py-3.5 border-b border-gray-100 dark:border-gray-900";
const ACTION_BTN = "px-3 py-1.5 rounded-lg text-xs font-bold border active:scale-[0.98] transition-transform";

function TaskActions({ onSnooze, onMarkDone }) {
  return (
    <div className="flex flex-wrap gap-2 mt-2.5">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onSnooze(); }}
        className={`${ACTION_BTN} border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900`}
      >
        Snooze 15m
      </button>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onMarkDone(); }}
        className={`${ACTION_BTN} border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40`}
      >
        Done
      </button>
    </div>
  );
}

function TaskRow({ job, now, onOpen, onSnooze, onMarkDone, urgentStyle = false }) {
  const label = formatReminderLabel(job.remindAt, now);
  return (
    <div className={`${ROW} ${urgentStyle ? "bg-red-50/40 dark:bg-red-950/20" : ""}`}>
      <button type="button" onClick={() => onOpen(job.id)} className="w-full text-left active:opacity-80">
        <div className="flex items-start gap-2">
          <span
            className={`mt-1.5 w-2 h-2 shrink-0 rounded-full ${urgentStyle ? "bg-red-500" : "bg-claude-600"}`}
            aria-hidden="true"
          />
          <div className="min-w-0 flex-1">
            <p className={`${TYPE_BODY_SM} font-semibold leading-snug line-clamp-2 break-words`}>
              {job.text}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              {job.ward && (
                <span className={`${TYPE_BADGE} text-claude-800 dark:text-claude-400 bg-claude-100 dark:bg-claude-900/30 px-1.5 py-0.5 rounded`}>
                  {job.ward}
                </span>
              )}
              {job.bed && (
                <span className={`${TYPE_UI_SM} normal-case tracking-normal text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded`}>
                  {job.bed}
                </span>
              )}
              {label && (
                <span className={`${TYPE_META} font-semibold text-claude-700 dark:text-claude-400`}>
                  {label}
                </span>
              )}
              {urgentStyle && !label && (
                <span className={`${TYPE_META} font-semibold text-red-700 dark:text-red-400`}>
                  No reminder set
                </span>
              )}
            </div>
          </div>
        </div>
      </button>
      <TaskActions onSnooze={() => onSnooze(job.id)} onMarkDone={() => onMarkDone(job.id)} />
    </div>
  );
}

function UpcomingRow({ job, now, onOpen, onSnooze, onMarkDone }) {
  const label = formatReminderLabel(job.remindAt, now);
  return (
    <div className={ROW}>
      <button type="button" onClick={() => onOpen(job.id)} className="w-full text-left active:opacity-80">
        <div className="min-w-0">
          <p className={`${TYPE_BODY_SM} leading-snug line-clamp-2 break-words`}>
            {job.text}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            {job.ward && (
              <span className={`${TYPE_BADGE} text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 px-1.5 py-0.5 rounded`}>
                {job.ward}
              </span>
            )}
            {job.bed && (
              <span className={`${TYPE_UI_SM} normal-case tracking-normal text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 px-1.5 py-0.5 rounded`}>
                {job.bed}
              </span>
            )}
            {label && (
              <span className={TYPE_META}>
                {label}
              </span>
            )}
          </div>
        </div>
      </button>
      <TaskActions onSnooze={() => onSnooze(job.id)} onMarkDone={() => onMarkDone(job.id)} />
    </div>
  );
}

export default function NotificationCentre({
  open, onClose, due, urgent, upcoming, now, onOpenTask, onSnooze, onMarkDone,
}) {
  const [entered, setEntered] = useState(false);
  const [closing, setClosing] = useState(false);
  const closingRef = useRef(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const requestClose = (after) => {
    if (closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    setEntered(false);
    window.setTimeout(() => {
      closingRef.current = false;
      setClosing(false);
      onClose();
      after?.();
    }, 280);
  };

  const openTask = (id) => requestClose(() => onOpenTask(id));

  const handleSnooze = (id) => {
    onSnooze(id);
  };

  const handleDone = (id) => {
    onMarkDone(id);
  };

  const { dragY, dragging, handleProps } = useBottomSheetSwipe(() => requestClose());

  if (!open && !closing) return null;

  const empty = due.length === 0 && urgent.length === 0 && upcoming.length === 0;
  const upcomingSoon = upcoming.filter((j) => {
    const mins = (new Date(j.remindAt).getTime() - now) / 60_000;
    return mins > 0 && mins <= 60;
  }).length;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div
        role="presentation"
        aria-hidden="true"
        onClick={() => requestClose()}
        className={`absolute inset-0 bg-black/25 transition-opacity duration-300 ease-out ${
          entered && !closing ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`relative z-10 ${dragging ? "" : "transition-transform duration-300 ease-out"}`}
        style={{ transform: bottomSheetTransform({ entered, closing, dragY }) }}
      >
        <div className="bg-white dark:bg-gray-950 rounded-t-2xl border-t border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col max-h-[min(70dvh,32rem)]">
          <SheetDragHandle handleProps={handleProps} />
          <div className="shrink-0 px-5 pt-2 pb-3 flex items-center justify-between gap-2">
            <p className={TYPE_OVERLINE}>
              Notifications
            </p>
            <div className="flex flex-wrap items-center gap-2 justify-end">
              {due.length > 0 && (
                <span className={`${TYPE_UI_SM} text-claude-700 dark:text-claude-400`}>
                  {due.length} due
                </span>
              )}
              {upcomingSoon > 0 && (
                <span className={`${TYPE_UI_SM} text-gray-500 dark:text-gray-400`}>
                  {upcomingSoon} in 1h
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto touch-pan-y">
            {empty && (
              <p className="px-5 py-8 text-sm text-center text-gray-400 dark:text-gray-600">
                No timed tasks. Set a reminder on a job, or mark jobs urgent to see them here.
              </p>
            )}

            {due.length > 0 && (
              <div>
                <p className={`${TYPE_GROUP_HEADER} text-claude-700 dark:text-claude-400 bg-claude-50 dark:bg-claude-950/30`}>
                  Due now
                </p>
                {due.map((job) => (
                  <TaskRow
                    key={job.id}
                    job={job}
                    now={now}
                    onOpen={openTask}
                    onSnooze={handleSnooze}
                    onMarkDone={handleDone}
                  />
                ))}
              </div>
            )}

            {urgent.length > 0 && (
              <div>
                <p className={`${TYPE_GROUP_HEADER} text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/30`}>
                  Urgent
                </p>
                {urgent.map((job) => (
                  <TaskRow
                    key={job.id}
                    job={job}
                    now={now}
                    onOpen={openTask}
                    onSnooze={handleSnooze}
                    onMarkDone={handleDone}
                    urgentStyle
                  />
                ))}
              </div>
            )}

            {upcoming.length > 0 && (
              <div>
                <p className={`${TYPE_GROUP_HEADER} text-gray-500 dark:text-gray-500 bg-gray-50 dark:bg-gray-900/40`}>
                  Upcoming
                </p>
                {upcoming.map((job) => (
                  <UpcomingRow
                    key={job.id}
                    job={job}
                    now={now}
                    onOpen={openTask}
                    onSnooze={handleSnooze}
                    onMarkDone={handleDone}
                  />
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => requestClose()}
            className="shrink-0 w-full py-3 text-sm font-medium text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-900"
          >
            Close
          </button>
        </div>
        <SheetSafeBottom />
      </div>
    </div>
  );
}
