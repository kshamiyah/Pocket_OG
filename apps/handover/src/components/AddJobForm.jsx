import { useEffect, useRef, useState } from "react";
import { PRIORITY, NO_WARD_LABEL } from "../utils/constants";
import { createJob, nextId } from "../utils/jobs";
import { pushMRU } from "../utils/storage";
import { bedsForWard, hasLayout, mostRecentBed } from "../utils/wardLayouts";
import { safeBottom } from "../utils/screenLayout";

const CHIP = "shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors";
const CHIP_ON = "bg-claude-600 text-white border-claude-600";
const CHIP_OFF = "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800";
const LABEL = "text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-2";

// Tiny "type a new one" control shared by the ward and bed rows.
function NewChipEntry({ placeholder, onCommit }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const ref = useRef(null);

  if (!open) {
    return (
      <button onClick={() => { setOpen(true); setTimeout(() => ref.current?.focus(), 0); }} className={`${CHIP} ${CHIP_OFF} border-dashed`}>
        + new
      </button>
    );
  }
  const commit = () => {
    const trimmed = value.trim();
    if (trimmed) onCommit(trimmed);
    setValue("");
    setOpen(false);
  };
  return (
    <input
      ref={ref}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && commit()}
      onBlur={commit}
      placeholder={placeholder}
      className="shrink-0 w-28 bg-gray-100 dark:bg-gray-900 border border-claude-400 rounded-lg px-2.5 py-1.5 text-sm font-bold text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
    />
  );
}

// One page, everything reachable at once: Ward -> Bed -> Job -> Urgency, in
// that order because that's the order a round actually goes (where you are
// is usually already known; what needs doing is the part worth thinking
// about). Ward/bed default to whatever was used last, so a run of jobs for
// the same spot needs nothing but the job text and a tap on Save.
export default function AddJobForm({
  onClose, jobs, onAddJob,
  stickyWard, setStickyWard, stickyBed, setStickyBed,
  recentWards, setRecentWards, recentBeds, setRecentBeds,
  recentPhrases, setRecentPhrases,
  wardLayouts, onSetupWard,
}) {
  const [text, setText] = useState("");
  const [urgent, setUrgent] = useState(false);
  const [entered, setEntered] = useState(false);
  const [closing, setClosing] = useState(false);
  const inputRef = useRef(null);
  const preselected = useRef(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const requestClose = () => {
    if (closing) return;
    setClosing(true);
    setEntered(false);
    window.setTimeout(onClose, 280);
  };

  useEffect(() => {
    if (preselected.current || stickyBed || !stickyWard) return;
    const recent = mostRecentBed(stickyWard, recentBeds);
    if (recent) {
      preselected.current = true;
      setStickyBed(recent);
    }
  }, [stickyWard, stickyBed, recentBeds, setStickyBed]);

  const wardChips = [...new Set([...recentWards, ...Object.keys(wardLayouts)])];
  const bedChips = bedsForWard(stickyWard, wardLayouts, recentBeds);
  const wardConfigured = hasLayout(wardLayouts, stickyWard);

  const chooseWard = (ward) => {
    if (ward !== stickyWard) setStickyBed("");
    setStickyWard(ward);
    if (ward) setRecentWards(pushMRU(recentWards, ward));
  };
  const chooseBed = (bed) => {
    setStickyBed(bed);
    if (bed && stickyWard) setRecentBeds({ ...recentBeds, [stickyWard]: pushMRU(recentBeds[stickyWard] || [], bed) });
  };

  const save = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const job = createJob({ id: nextId(jobs), text: trimmed, ward: stickyWard, bed: stickyBed, priority: urgent ? PRIORITY.URGENT : PRIORITY.ROUTINE });
    onAddJob(job);
    setRecentPhrases(pushMRU(recentPhrases, trimmed));
    setText("");
    setUrgent(false);
    inputRef.current?.focus();
  };

  const fillPhrase = (phrase) => {
    setText(phrase);
    inputRef.current?.focus();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button
        type="button"
        aria-label="Close add job"
        onClick={requestClose}
        className={`absolute inset-0 bg-black/25 transition-opacity duration-300 ease-out ${
          entered && !closing ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`relative z-10 bg-white dark:bg-gray-950 flex flex-col max-h-[92dvh] rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out ${
          entered && !closing ? "translate-y-0" : "translate-y-full"
        }`}
      >
      <div className="flex-1 min-h-0 overflow-y-auto px-6 pt-3 pb-2">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gray-200 dark:bg-gray-800" aria-hidden="true" />
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add a job</h1>
          <button type="button" onClick={requestClose} className="text-xs font-bold text-gray-400 dark:text-gray-600">Done</button>
        </div>

        <p className={LABEL}>Ward</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {wardChips.map((w) => (
            <button key={w} onClick={() => chooseWard(w)} className={`${CHIP} ${stickyWard === w ? CHIP_ON : CHIP_OFF}`}>{w}</button>
          ))}
          <NewChipEntry placeholder="Ward name" onCommit={chooseWard} />
          {stickyWard && <button onClick={() => chooseWard("")} className={`${CHIP} ${CHIP_OFF}`}>{NO_WARD_LABEL}</button>}
        </div>

        {stickyWard && (
          <>
            <p className={LABEL}>Bed</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {bedChips.map((b) => (
                <button key={b} onClick={() => chooseBed(b)} className={`${CHIP} ${stickyBed === b ? CHIP_ON : CHIP_OFF}`}>{b}</button>
              ))}
              <NewChipEntry placeholder="Bed / room" onCommit={chooseBed} />
              {stickyBed && <button onClick={() => chooseBed("")} className={`${CHIP} ${CHIP_OFF}`}>No bed</button>}
            </div>
            <button onClick={() => onSetupWard(stickyWard)} className="text-xs font-bold text-claude-700 dark:text-claude-400 mb-6">
              {wardConfigured ? "Edit beds for this ward" : "Set up beds for this ward"}
            </button>
          </>
        )}

        <p className={LABEL}>Job</p>
        {recentPhrases.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {recentPhrases.map((phrase) => (
              <button key={phrase} type="button" onClick={() => fillPhrase(phrase)} className={`${CHIP} ${CHIP_OFF}`}>
                {phrase}
              </button>
            ))}
          </div>
        )}
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && save()}
          placeholder="e.g. Chase repeat FBC"
          className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl px-4 py-4 text-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-claude-500/30 focus:border-claude-500 mb-6"
        />

        <p className={LABEL}>Urgency</p>
        <div className="flex gap-2">
          <button
            onClick={() => setUrgent(false)}
            className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-colors ${
              !urgent ? "bg-gray-900 dark:bg-white text-white dark:text-gray-950 border-gray-900 dark:border-white" : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800"
            }`}
          >
            Routine
          </button>
          <button
            onClick={() => setUrgent(true)}
            className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-colors ${
              urgent ? "bg-red-600 text-white border-red-600" : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800"
            }`}
          >
            Urgent
          </button>
        </div>
      </div>

      <div className="shrink-0 px-6 pt-2 border-t border-gray-100 dark:border-gray-900" style={safeBottom()}>
        <button
          onClick={save}
          disabled={!text.trim()}
          className="w-full py-4 rounded-2xl bg-claude-600 disabled:bg-gray-200 dark:disabled:bg-gray-800 text-white disabled:text-gray-400 text-base font-bold active:scale-95 transition-all"
        >
          Add job
        </button>
      </div>
      </div>
    </div>
  );
}
