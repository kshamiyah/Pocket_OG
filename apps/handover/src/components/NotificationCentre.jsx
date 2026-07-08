import { useEffect, useRef, useState } from "react";
import { formatReminderLabel } from "../utils/reminders";

const ROW = "w-full text-left px-5 py-3.5 border-b border-gray-100 dark:border-gray-900 active:bg-gray-50 dark:active:bg-gray-900/60";

function TaskRow({ job, now, onOpen }) {
  const label = formatReminderLabel(job.remindAt, now);
  return (
    <button type="button" onClick={() => onOpen(job.id)} className={ROW}>
      <div className="flex items-start gap-2">
        <span className="mt-1.5 w-2 h-2 shrink-0 rounded-full bg-claude-600" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-gray-900 dark:text-white leading-snug truncate">
            {job.text}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            {job.ward && (
              <span className="text-[10px] font-bold uppercase tracking-wide text-claude-800 dark:text-claude-400 bg-claude-100 dark:bg-claude-900/30 px-1.5 py-0.5 rounded">
                {job.ward}
              </span>
            )}
            {job.bed && (
              <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                {job.bed}
              </span>
            )}
            {label && (
              <span className="text-[11px] font-bold tabular-nums text-claude-700 dark:text-claude-400">
                {label}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

function UpcomingRow({ job, now, onOpen }) {
  const label = formatReminderLabel(job.remindAt, now);
  return (
    <button type="button" onClick={() => onOpen(job.id)} className={ROW}>
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white leading-snug truncate">
          {job.text}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          {job.ward && (
            <span className="text-[10px] font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 px-1.5 py-0.5 rounded">
              {job.ward}
            </span>
          )}
          {job.bed && (
            <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 px-1.5 py-0.5 rounded">
              {job.bed}
            </span>
          )}
          {label && (
            <span className="text-[11px] tabular-nums text-gray-500 dark:text-gray-500">
              {label}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

export default function NotificationCentre({
  open, onClose, due, upcoming, now, onOpenTask,
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

  if (!open && !closing) return null;

  const empty = due.length === 0 && upcoming.length === 0;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button
        type="button"
        aria-label="Close notifications"
        onClick={() => requestClose()}
        className={`absolute inset-0 bg-black/25 transition-opacity duration-300 ease-out ${
          entered && !closing ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`relative z-10 bg-white dark:bg-gray-950 rounded-t-2xl border-t border-gray-200 dark:border-gray-800 shadow-2xl transition-transform duration-300 ease-out flex flex-col max-h-[min(70dvh,32rem)] ${
          entered && !closing ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.5rem)" }}
      >
        <div className="mx-auto mt-2 mb-1 h-1 w-10 rounded-full bg-gray-200 dark:bg-gray-800 shrink-0" aria-hidden="true" />
        <div className="shrink-0 px-5 pt-2 pb-3 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600">
            Notifications
          </p>
          {due.length > 0 && (
            <span className="text-xs font-bold text-claude-700 dark:text-claude-400">
              {due.length} due
            </span>
          )}
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto touch-pan-y">
          {empty && (
            <p className="px-5 py-8 text-sm text-center text-gray-400 dark:text-gray-600">
              No timed tasks. Set a reminder on a job to see it here.
            </p>
          )}

          {due.length > 0 && (
            <div>
              <p className="px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-claude-700 dark:text-claude-400 bg-claude-50 dark:bg-claude-950/30">
                Due now
              </p>
              {due.map((job) => (
                <TaskRow key={job.id} job={job} now={now} onOpen={openTask} />
              ))}
            </div>
          )}

          {upcoming.length > 0 && (
            <div>
              <p className="px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-500 bg-gray-50 dark:bg-gray-900/40">
                Upcoming
              </p>
              {upcoming.map((job) => (
                <UpcomingRow key={job.id} job={job} now={now} onOpen={openTask} />
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
    </div>
  );
}
