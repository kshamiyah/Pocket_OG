import { useState } from "react";
import { CAPTURE_MODE, PRIORITY } from "../utils/constants";
import { createJob, nextId } from "../utils/jobs";
import { recordTaskUsage } from "../utils/learnedTasks";
import { recordBedUsage, saveWardLayout } from "../utils/wardLayouts";
import { pushMRU } from "../utils/portfolios";
import RoundCapture from "./RoundCapture";
import QuickCapture from "./QuickCapture";
import WardSetup from "./WardSetup";

const MODE_BTN = "flex-1 py-1.5 text-[11px] font-bold transition-colors";
const MODE_ON = "bg-gray-900 dark:bg-white text-white dark:text-gray-950";
const MODE_OFF = "text-gray-500 dark:text-gray-400";

export default function JobCapture({
  jobs,
  setJobs,
  captureMode,
  setCaptureMode,
  recentWards,
  setRecentWards,
  recentPhrases,
  setRecentPhrases,
  wardTasks,
  setWardTasks,
  wardLayouts,
  setWardLayouts,
  recentBeds,
  setRecentBeds,
}) {
  const [stickyUrgent, setStickyUrgent] = useState(false);
  const [activeWard, setActiveWard] = useState(recentWards[0] || "");
  const [setupWard, setSetupWard] = useState(null);
  const [setupExisting, setSetupExisting] = useState(null);

  const addJob = ({ ward, bed, text, urgent }) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const job = createJob({
      id: nextId(jobs),
      text: trimmed,
      ward,
      bed,
      priority: urgent ? PRIORITY.URGENT : PRIORITY.ROUTINE,
    });

    setJobs([...jobs, job]);

    const learned = recordTaskUsage({
      wardTasks,
      recentPhrases,
      ward,
      task: trimmed,
    });
    setWardTasks(learned.wardTasks);
    setRecentPhrases(learned.recentPhrases);

    if (bed) {
      setRecentBeds(recordBedUsage(recentBeds, ward, bed));
    }
  };

  const openWardSetup = (wardName, existing = null) => {
    setSetupWard(wardName);
    setSetupExisting(existing);
  };

  const completeWardSetup = (layout) => {
    if (!setupWard) return;
    setWardLayouts(saveWardLayout(wardLayouts, setupWard, layout));
    setRecentWards(pushMRU(recentWards, setupWard));
    setActiveWard(setupWard);
    setSetupWard(null);
    setSetupExisting(null);
  };

  const cancelWardSetup = () => {
    setSetupWard(null);
    setSetupExisting(null);
  };

  const requestWardSetup = (wardName, existing = null) => {
    openWardSetup(wardName, existing ?? wardLayouts[wardName] ?? null);
  };

  if (setupWard) {
    return (
      <WardSetup
        wardName={setupWard}
        existingLayout={setupExisting}
        onSave={completeWardSetup}
        onCancel={cancelWardSetup}
      />
    );
  }

  return (
    <div
      className="border-t border-gray-200 dark:border-gray-800 px-5 pt-2.5 bg-white dark:bg-gray-950"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }}
    >
      <div className="flex rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden mb-3">
        <button
          type="button"
          onClick={() => setCaptureMode(CAPTURE_MODE.ROUND)}
          className={`${MODE_BTN} ${captureMode === CAPTURE_MODE.ROUND ? MODE_ON : MODE_OFF}`}
        >
          Round
        </button>
        <button
          type="button"
          onClick={() => setCaptureMode(CAPTURE_MODE.QUICK)}
          className={`${MODE_BTN} ${captureMode === CAPTURE_MODE.QUICK ? MODE_ON : MODE_OFF}`}
        >
          Quick
        </button>
      </div>

      {captureMode === CAPTURE_MODE.ROUND ? (
        <RoundCapture
          recentWards={recentWards}
          setRecentWards={setRecentWards}
          wardLayouts={wardLayouts}
          recentBeds={recentBeds}
          wardTasks={wardTasks}
          recentPhrases={recentPhrases}
          stickyUrgent={stickyUrgent}
          onToggleUrgent={() => setStickyUrgent((v) => !v)}
          onAdd={addJob}
          onRequestWardSetup={requestWardSetup}
          activeWard={activeWard}
          onActiveWardChange={setActiveWard}
        />
      ) : (
        <QuickCapture
          jobs={jobs}
          recentWards={recentWards}
          setRecentWards={setRecentWards}
          recentPhrases={recentPhrases}
          wardLayouts={wardLayouts}
          onRequestWardSetup={requestWardSetup}
          stickyUrgent={stickyUrgent}
          onToggleUrgent={() => setStickyUrgent((v) => !v)}
          onAdd={addJob}
        />
      )}
    </div>
  );
}
