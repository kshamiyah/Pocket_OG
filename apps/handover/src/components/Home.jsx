import { useRef, useState } from "react";
import { SHIFT_TYPES } from "../utils/constants";
import { summarize } from "../utils/jobs";
import { pushMRU } from "../utils/storage";
import AddJobForm from "./AddJobForm";
import WardDrill from "./WardDrill";
import MasterSheet from "./MasterSheet";
import AllJobsList from "./AllJobsList";
import UndoToast from "./UndoToast";

const DENSITIES = [
  { key: "walk", label: "Walk" },
  { key: "expand", label: "Expand" },
];

export default function Home({
  jobs, setJobs, shiftType, recentWards, setRecentWards, recentBeds, setRecentBeds,
  wardLayouts, onHandover, onScan, onSetupWard, onManageWards,
  selectedWard, setSelectedWard, selectedBed, setSelectedBed, bedSelected, setBedSelected,
}) {
  const [mode, setMode] = useState("byward");
  const [density, setDensity] = useState("walk");
  const [editingId, setEditingId] = useState(null);
  const [stickyWard, setStickyWard] = useState(recentWards[0] || "");
  const [stickyBed, setStickyBed] = useState("");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [undo, setUndo] = useState(null);
  const undoTimer = useRef(null);

  const summary = summarize(jobs);
  const shiftLabel = SHIFT_TYPES.find((s) => s.key === shiftType)?.label ?? "Shift";

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
    setJobs(jobs.map((j) => (j.id === id ? { ...j, done: !j.done } : j)));
    if (job && !job.done) flashUndo("Marked done", jobs);
  };
  const toggleEdit = (id) => setEditingId((cur) => (cur === id ? null : id));
  const setWard = (id, ward) => {
    setJobs(jobs.map((j) => (j.id === id ? { ...j, ward, bed: ward ? j.bed : "" } : j)));
    if (ward) setRecentWards(pushMRU(recentWards, ward));
  };
  const setBed = (id, bed) => {
    const job = jobs.find((j) => j.id === id);
    setJobs(jobs.map((j) => (j.id === id ? { ...j, bed } : j)));
    if (bed && job?.ward) setRecentBeds({ ...recentBeds, [job.ward]: pushMRU(recentBeds[job.ward] || [], bed) });
  };
  const setPriority = (id, priority) => setJobs(jobs.map((j) => (j.id === id ? { ...j, priority } : j)));
  const setText = (id, text) => setJobs(jobs.map((j) => (j.id === id ? { ...j, text } : j)));
  const deleteJob = (id) => {
    setEditingId(null);
    flashUndo("Deleted", jobs);
    setJobs(jobs.filter((j) => j.id !== id));
  };

  const sharedProps = {
    jobs, recentWards, recentBeds, wardLayouts,
    editingId, onToggleDone: toggleDone, onToggleEdit: toggleEdit,
    onSetWard: setWard, onSetBed: setBed, onSetPriority: setPriority, onSetText: setText, onDelete: deleteJob,
  };

  // A bed's own task list already has a QuickAddRow in view — the FAB there
  // would just be a second, disconnected way to do the same thing.
  const inBedFocus = mode === "byward" && density === "walk" && selectedWard && bedSelected;

  const openWizard = () => {
    if (mode === "byward" && density === "walk" && selectedWard) {
      setStickyWard(selectedWard);
      setStickyBed(bedSelected ? (selectedBed || "") : "");
    }
    setWizardOpen(true);
  };

  return (
    <div className="h-screen bg-white dark:bg-gray-950 flex flex-col">
      <div
        className="px-5 flex items-baseline justify-between border-b border-gray-200 dark:border-gray-800"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 1.25rem)", paddingBottom: "0.9rem" }}
      >
        <div className="font-extrabold text-lg text-gray-900 dark:text-white">
          Handover<span className="text-amber-600">.</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="font-mono text-xs tracking-wide text-gray-400 dark:text-gray-500 uppercase">
            {shiftLabel}
          </div>
          <button onClick={onManageWards} aria-label="Manage bed setup" className="text-xs font-bold text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800 rounded-lg px-2.5 py-1.5 active:scale-95 transition-all min-h-[32px]">
            Bed setup
          </button>
          <button onClick={onScan} aria-label="Receive a handover" className="text-xs font-bold text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900 rounded-lg px-2.5 py-1.5 active:scale-95 transition-all min-h-[32px]">
            Receive
          </button>
        </div>
      </div>

      <div className="px-5 pt-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setMode("byward")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
              mode === "byward"
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-950 border-gray-900 dark:border-white"
                : "bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-800"
            }`}
          >
            By ward
          </button>
          <button
            onClick={() => setMode("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
              mode === "all"
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-950 border-gray-900 dark:border-white"
                : "bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-800"
            }`}
          >
            All jobs
          </button>
        </div>

        {mode === "byward" && (
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden text-xs font-bold">
            {DENSITIES.map((d) => (
              <button
                key={d.key}
                onClick={() => setDensity(d.key)}
                className={`px-3 py-1.5 min-h-[32px] ${density === d.key ? "bg-gray-900 dark:bg-white text-white dark:text-gray-950" : "text-gray-500 dark:text-gray-400"}`}
              >
                {d.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {mode === "byward" && density === "walk" && (
        <WardDrill
          wardNames={wardNames} onAddJob={addJob} onSetupWard={onSetupWard}
          selectedWard={selectedWard} setSelectedWard={setSelectedWard}
          selectedBed={selectedBed} setSelectedBed={setSelectedBed}
          bedSelected={bedSelected} setBedSelected={setBedSelected}
          {...sharedProps}
        />
      )}
      {mode === "byward" && density === "expand" && (
        <MasterSheet wardNames={wardNames} onAddJob={addJob} {...sharedProps} />
      )}
      {mode === "all" && <AllJobsList {...sharedProps} />}

      <div
        className="fixed inset-x-0 bottom-0 z-20 px-5 pt-3 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }}
      >
        <button
          onClick={onHandover}
          className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-base font-bold active:scale-[0.98] transition-all min-h-[50px]"
        >
          {summary.open > 0 ? "Handover →" : "End shift"}
        </button>
      </div>

      <UndoToast message={undo?.message} onUndo={undoAction} />

      {!inBedFocus && (
        <button
          onClick={openWizard}
          aria-label="Add job"
          className="fixed right-5 z-30 w-16 h-16 rounded-full bg-amber-600 text-white text-3xl font-bold shadow-lg flex items-center justify-center active:scale-95 transition-all"
          style={{ bottom: "calc(env(safe-area-inset-bottom) + 5.75rem)" }}
        >
          +
        </button>
      )}

      {wizardOpen && (
        <AddJobForm
          onClose={() => setWizardOpen(false)}
          jobs={jobs}
          onAddJob={addJob}
          stickyWard={stickyWard}
          setStickyWard={setStickyWard}
          stickyBed={stickyBed}
          setStickyBed={setStickyBed}
          recentWards={recentWards}
          setRecentWards={setRecentWards}
          recentBeds={recentBeds}
          setRecentBeds={setRecentBeds}
          wardLayouts={wardLayouts}
          onSetupWard={onSetupWard}
        />
      )}
    </div>
  );
}
