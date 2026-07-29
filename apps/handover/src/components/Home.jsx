import { useEffect, useRef, useState } from "react";
import PanelTransition from "./PanelTransition";
import { SHIFT_TYPES } from "../utils/constants";
import { countDueReminders, dueTasks, notificationBadgeCount, remindAtFromOffset, SNOOZE_MINUTES, upcomingTasks, urgentTasksWithoutReminder } from "../utils/reminders";
import { syncOneJobReminder } from "../utils/jobNotifications";
import { pushMRU } from "../utils/storage";
import { setBedNote } from "../utils/bedNotes";
import AddJobForm from "./AddJobForm";
import WardDrill from "./WardDrill";
import AllJobsList from "./AllJobsList";
import UndoToast from "./UndoToast";
import HomeMenu from "./HomeMenu";
import ExchangeSheet from "./ExchangeSheet";
import NotificationCentre from "./NotificationCentre";
import HandoverMark from "./HandoverMark";
import { SCREEN, SELECTED_CHIP } from "../utils/screenLayout";
import { formatDisplayDate } from "../utils/time";
import { TYPE_META, TYPE_TITLE, TYPE_UI_SM } from "../utils/typography";

const ICON_BTN = "w-11 h-11 rounded-full border flex items-center justify-center active:scale-95 transition-all";
const EXCHANGE_BTN = "border-claude-200 dark:border-claude-900 text-claude-700 dark:text-claude-400 bg-white dark:bg-gray-950";
const LIST_BOTTOM_PAD = "calc(env(safe-area-inset-bottom) + 6rem)";

export default function Home({
  jobs, setJobs, shiftType, shiftStartedAt, recentWards, setRecentWards, recentBeds, setRecentBeds,
  recentPhrases, setRecentPhrases,
  wardLayouts, bedNotes, setBedNotes, onScan, onShareJobs, onEndShift, onSetupWard, onManageWards, onEditProfile, onAbout,
  selectedWard, setSelectedWard, selectedBed, setSelectedBed, bedSelected, setBedSelected,
  focusJobId, onFocusJobHandled, notifCallbacks,
}) {
  const [mode, setMode] = useState("byward");
  const [editingId, setEditingId] = useState(null);
  const [stickyWard, setStickyWard] = useState(recentWards[0] || "");
  const [stickyBed, setStickyBed] = useState("");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuSession, setMenuSession] = useState(0);
  const [exchangeOpen, setExchangeOpen] = useState(false);
  const [exchangeSession, setExchangeSession] = useState(0);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsSession, setNotificationsSession] = useState(0);
  const [undo, setUndo] = useState(null);
  const undoTimer = useRef(null);

  const shiftLabel = SHIFT_TYPES.find((s) => s.key === shiftType)?.label ?? "Shift";
  const shiftDate = formatDisplayDate(shiftStartedAt ?? new Date());
  const shiftMeta = `${shiftLabel} · ${shiftDate}`;

  const wardNames = [...new Set([
    ...Object.keys(wardLayouts),
    ...recentWards,
    ...jobs.map((j) => j.ward).filter(Boolean),
  ])];

  const flashUndo = (message, previousJobs) => {
    if (undoTimer.current) clearTimeout(undoTimer.current);
    setUndo({ message, jobs: previousJobs });
    undoTimer.current = setTimeout(() => setUndo(null), 4000);
  };
  const undoAction = () => {
    if (!undo) return;
    if (undoTimer.current) clearTimeout(undoTimer.current);
    setJobs(undo.jobs);
    setUndo(null);
  };

  const addJob = (job) => setJobs([...jobs, job]);
  const toggleDone = (id) => {
    const job = jobs.find((j) => j.id === id);
    setJobs(jobs.map((j) => {
      if (j.id !== id) return j;
      const nextDone = !j.done;
      return { ...j, done: nextDone, ...(nextDone ? { remindAt: null } : {}) };
    }));
    if (job && !job.done) flashUndo("Marked done", jobs);
  };
  const toggleEdit = (id) => setEditingId((cur) => (cur === id ? null : id));
  const setWard = (id, ward) => {
    setJobs(jobs.map((j) => (j.id === id ? { ...j, ward, bed: ward ? j.bed : "" } : j)));
    if (ward) setRecentWards(pushMRU(recentWards, ward));
  };
  const registerWard = (ward) => {
    const trimmed = ward.trim();
    if (!trimmed) return;
    setRecentWards(pushMRU(recentWards, trimmed));
    setSelectedWard(null);
    setSelectedBed(null);
    setBedSelected(false);
    onSetupWard(trimmed);
  };
  const setBed = (id, bed) => {
    const job = jobs.find((j) => j.id === id);
    setJobs(jobs.map((j) => (j.id === id ? { ...j, bed } : j)));
    if (bed && job?.ward) setRecentBeds({ ...recentBeds, [job.ward]: pushMRU(recentBeds[job.ward] || [], bed) });
  };
  const setPriority = (id, priority) => setJobs(jobs.map((j) => (j.id === id ? { ...j, priority } : j)));
  const setText = (id, text) => setJobs(jobs.map((j) => (j.id === id ? { ...j, text } : j)));
  const setRemindAt = (id, remindAt) => {
    setJobs(jobs.map((j) => (j.id === id ? { ...j, remindAt: remindAt || null } : j)));
  };
  const updateBedNote = (ward, bed, text) => {
    setBedNotes(setBedNote(bedNotes, ward, bed, text));
  };
  const deleteJob = (id) => {
    setEditingId(null);
    flashUndo("Deleted", jobs);
    setJobs(jobs.filter((j) => j.id !== id));
  };

  const sharedProps = {
    jobs, recentWards, recentBeds, wardLayouts,
    editingId, onToggleDone: toggleDone, onToggleEdit: toggleEdit,
    onSetWard: setWard, onSetBed: setBed, onSetPriority: setPriority, onSetText: setText,
    onSetRemindAt: setRemindAt, onDelete: deleteJob,
  };

  const [reminderTick, setReminderTick] = useState(() => Date.now());
  useEffect(() => {
    if (!jobs.some((j) => j.remindAt && !j.done)) return undefined;
    const id = window.setInterval(() => setReminderTick(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, [jobs]);
  const dueReminders = countDueReminders(jobs, reminderTick);
  const badgeCount = notificationBadgeCount(jobs, reminderTick);
  const dueTaskList = dueTasks(jobs, reminderTick);
  const upcomingTaskList = upcomingTasks(jobs, reminderTick);
  const urgentTaskList = urgentTasksWithoutReminder(jobs);

  const openNotifications = () => {
    setNotificationsSession((n) => n + 1);
    setNotificationsOpen(true);
  };

  const openTaskFromNotifications = (id) => {
    setMode("all");
    setEditingId(id);
  };

  useEffect(() => {
    if (focusJobId == null) return undefined;
    const job = jobs.find((j) => j.id === focusJobId || j.id === Number(focusJobId));
    const id = window.setTimeout(() => {
      if (job) {
        setMode("all");
        setEditingId(job.id);
      }
      onFocusJobHandled?.();
    }, 0);
    return () => window.clearTimeout(id);
  }, [focusJobId, jobs, onFocusJobHandled]);

  const snoozeTask = (id) => {
    const job = jobs.find((j) => j.id === id);
    if (!job || job.done) return;
    const remindAt = remindAtFromOffset(SNOOZE_MINUTES, reminderTick);
    const updated = { ...job, remindAt };
    setJobs(jobs.map((j) => (j.id === id ? updated : j)));
    syncOneJobReminder(updated, notifCallbacks);
  };

  const markTaskDone = (id) => {
    toggleDone(id);
  };

  const openWizard = () => {
    if (mode === "byward" && selectedWard) {
      setStickyWard(selectedWard);
      setStickyBed(bedSelected ? (selectedBed || "") : "");
    }
    setWizardOpen(true);
  };

  const openExchange = () => {
    setExchangeSession((n) => n + 1);
    setExchangeOpen(true);
  };

  const exchangeLabel = "Exchange";

  return (
    <div className={`fixed inset-0 z-0 ${SCREEN}`}>
      <div
        className="shrink-0 px-5 flex items-center justify-between border-b border-gray-200 dark:border-gray-800"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 0.75rem)", paddingBottom: "0.75rem" }}
      >
        <div>
          <HandoverMark className={`${TYPE_TITLE} leading-none`} />
          <div className={`${TYPE_META} mt-1`}>
            {shiftMeta}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openExchange}
            data-coach="exchange-btn"
            aria-label={exchangeLabel}
            className={`${ICON_BTN} ${EXCHANGE_BTN}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 7h10l-3-3" />
              <path d="M17 17H7l3 3" />
            </svg>
          </button>
          <button
            type="button"
            onClick={openNotifications}
            aria-label={badgeCount > 0 ? `${badgeCount} notification${badgeCount === 1 ? "" : "s"}` : "Notifications"}
            className={`${ICON_BTN} relative border-claude-200 dark:border-claude-900 text-claude-700 dark:text-claude-400`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {badgeCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[1.125rem] h-[1.125rem] px-0.5 rounded-full bg-claude-600 text-white text-xs font-bold flex items-center justify-center tabular-nums">
                {badgeCount > 9 ? "9+" : badgeCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => { setMenuSession((n) => n + 1); setMenuOpen(true); }}
            data-coach="menu-btn"
            aria-label="More options"
            className={`${ICON_BTN} border-claude-200 dark:border-claude-900 text-claude-700 dark:text-claude-400`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <circle cx="5" cy="12" r="1.8" />
              <circle cx="12" cy="12" r="1.8" />
              <circle cx="19" cy="12" r="1.8" />
            </svg>
          </button>
        </div>
      </div>

      <div className="shrink-0 px-5 pt-3">
        <div className="flex items-center gap-1.5" data-coach="mode-tabs">
          <button
            onClick={() => setMode("byward")}
            className={`px-3 py-2.5 min-h-11 rounded-lg ${TYPE_UI_SM} border transition-colors ${
              mode === "byward"
                ? SELECTED_CHIP
                : "bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-800"
            }`}
          >
            By ward
          </button>
          <button
            onClick={() => setMode("all")}
            className={`px-3 py-2.5 min-h-11 rounded-lg ${TYPE_UI_SM} border transition-colors ${
              mode === "all"
                ? SELECTED_CHIP
                : "bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-800"
            }`}
          >
            All jobs
          </button>
        </div>
      </div>

      {dueReminders > 0 && (
        <button
          type="button"
          onClick={openNotifications}
          className="shrink-0 mx-5 mt-2 mb-1 px-4 py-2 rounded-xl bg-claude-100 dark:bg-claude-950/40 border border-claude-300 dark:border-claude-800 w-[calc(100%-2.5rem)] text-left active:scale-[0.99] transition-all"
        >
          <span className={`${TYPE_UI_SM} text-claude-900 dark:text-claude-200`}>
            {dueReminders} task{dueReminders === 1 ? "" : "s"} due
          </span>
        </button>
      )}

      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        <PanelTransition panelKey={mode} direction="fade" className="flex-1 min-h-0 flex flex-col">
          {mode === "byward" ? (
            <WardDrill
              listBottomPad={LIST_BOTTOM_PAD}
              wardNames={wardNames}
              onAddJob={addJob}
              onRegisterWard={registerWard}
              onSetupWard={onSetupWard}
              recentPhrases={recentPhrases}
              setRecentPhrases={setRecentPhrases}
              selectedWard={selectedWard}
              setSelectedWard={setSelectedWard}
              selectedBed={selectedBed}
              setSelectedBed={setSelectedBed}
              bedSelected={bedSelected}
              setBedSelected={setBedSelected}
              bedNotes={bedNotes}
              onSetBedNote={updateBedNote}
              {...sharedProps}
            />
          ) : (
            <AllJobsList listBottomPad={LIST_BOTTOM_PAD} {...sharedProps} />
          )}
        </PanelTransition>
      </div>

      <UndoToast message={undo?.message} onUndo={undoAction} />

      <button
        onClick={openWizard}
        data-coach="fab"
        aria-label="Add job"
        className="fixed right-5 z-30 w-14 h-14 rounded-full bg-claude-600 text-white text-2xl font-bold shadow-lg flex items-center justify-center active:scale-95 transition-all"
        style={{ bottom: "calc(env(safe-area-inset-bottom) + 1.25rem)" }}
      >
        +
      </button>

      {wizardOpen && (
        <AddJobForm
          onClose={() => setWizardOpen(false)}
          jobs={jobs}
          onAddJob={addJob}
          startCompact={mode === "byward" && Boolean(selectedWard)}
          locationLocked={mode === "byward" && Boolean(selectedWard) && bedSelected}
          stickyWard={stickyWard}
          setStickyWard={setStickyWard}
          stickyBed={stickyBed}
          setStickyBed={setStickyBed}
          recentWards={recentWards}
          setRecentWards={setRecentWards}
          recentBeds={recentBeds}
          setRecentBeds={setRecentBeds}
          recentPhrases={recentPhrases}
          setRecentPhrases={setRecentPhrases}
          wardLayouts={wardLayouts}
          onSetupWard={onSetupWard}
        />
      )}

      <ExchangeSheet
        key={`exchange-${exchangeSession}`}
        open={exchangeOpen}
        onClose={() => setExchangeOpen(false)}
        onScan={onScan}
        onShareJobs={onShareJobs}
        onEndShift={onEndShift}
      />

      <HomeMenu
        key={`menu-${menuSession}`}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        shiftLabel={shiftLabel}
        onManageWards={onManageWards}
        onEditProfile={onEditProfile}
        onAbout={onAbout}
      />

      <NotificationCentre
        key={`notifications-${notificationsSession}`}
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        due={dueTaskList}
        urgent={urgentTaskList}
        upcoming={upcomingTaskList}
        now={reminderTick}
        onOpenTask={openTaskFromNotifications}
        onSnooze={snoozeTask}
        onMarkDone={markTaskDone}
      />
    </div>
  );
}
