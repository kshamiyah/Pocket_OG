import { useEffect, useRef, useState } from "react";
import { PRIORITY, NO_WARD_LABEL } from "../utils/constants";
import { createJob, nextId } from "../utils/jobs";
import { pushMRU } from "../utils/storage";
import { hasLayout, mostRecentBed } from "../utils/wardLayouts";
import { useKeyboardInset } from "../utils/useKeyboardInset";
import { bottomSheetTransform, useBottomSheetSwipe } from "../utils/useBottomSheetSwipe";
import SheetDragHandle, { SheetSafeBottom } from "./SheetDragHandle";
import BedPickerPanel from "./BedPickerPanel";
import ReminderPicker from "./ReminderPicker";
import { PRIMARY_BTN_COMPACT, SELECTED_CHIP } from "../utils/screenLayout";
import { TYPE_DISMISS, TYPE_META, TYPE_SECTION, TYPE_TITLE, TYPE_UI_SM } from "../utils/typography";

const CHIP = "shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors";
const CHIP_ON = "bg-claude-600 text-white border-claude-600";
const CHIP_OFF = "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800";
const TOTAL_STEPS = 3;
const WIZARD_SHEET_HEIGHT = "min(88dvh, 320px)";
const SEG = "flex-1 py-2 rounded-lg text-xs font-semibold border transition-colors";
const JOB_INPUT =
  "w-full h-12 shrink-0 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-3 text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-claude-500/30 focus:border-claude-500";
const PHRASE_CHIP =
  "max-w-full min-w-0 truncate px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800 active:bg-gray-200 dark:active:bg-gray-800";

function NewChipEntry({ placeholder, onCommit }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const ref = useRef(null);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => { setOpen(true); setTimeout(() => ref.current?.focus(), 0); }}
        className={`${CHIP} ${CHIP_OFF} border-dashed`}
      >
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
      className="shrink-0 w-24 bg-gray-100 dark:bg-gray-900 border border-claude-400 rounded-lg px-2 py-1 text-sm font-semibold text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
    />
  );
}

function contextLine(ward, bed) {
  if (!ward) return "No ward";
  if (bed) return `${ward} · ${bed}`;
  return ward;
}

function StepProgress({ step, skipLocation }) {
  const bars = [
    { active: step >= 1, skipped: false },
    { active: skipLocation || step >= 2, skipped: skipLocation && step < 2 },
    { active: step >= 3, skipped: false },
  ];
  return (
    <div className="flex gap-1 mb-2" aria-label={`Step ${step} of ${TOTAL_STEPS}`}>
      {bars.map((bar, i) => (
        <div
          key={i}
          className={`h-0.5 flex-1 rounded-full ${
            bar.active
              ? bar.skipped
                ? "bg-claude-300 dark:bg-claude-800"
                : "bg-claude-600"
              : "bg-gray-200 dark:bg-gray-800"
          }`}
        />
      ))}
    </div>
  );
}

export default function AddJobForm({
  onClose, jobs, onAddJob,
  stickyWard, setStickyWard, stickyBed, setStickyBed,
  recentWards, setRecentWards, recentBeds, setRecentBeds,
  recentPhrases, setRecentPhrases,
  wardLayouts, onSetupWard,
  startCompact = false,
}) {
  const [step, setStep] = useState(1);
  const [text, setText] = useState("");
  const [urgent, setUrgent] = useState(false);
  const [remindAt, setRemindAt] = useState(null);
  const [bedPickerOpen, setBedPickerOpen] = useState(false);
  const [customTimeOpen, setCustomTimeOpen] = useState(false);
  const [reminderKey, setReminderKey] = useState(0);
  const [entered, setEntered] = useState(false);
  const [closing, setClosing] = useState(false);
  const inputRef = useRef(null);
  const [sheetNode, setSheetNode] = useState(null);
  const preselected = useRef(false);
  const keyboardInset = useKeyboardInset();

  const warmStart = startCompact && Boolean(stickyWard?.trim());
  const skipLocation = warmStart;
  const wardConfigured = hasLayout(wardLayouts, stickyWard);
  const wardChips = [...new Set([...recentWards, ...Object.keys(wardLayouts)])];

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!entered || step !== 1) return undefined;
    const t = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(t);
  }, [entered, step]);

  const requestClose = () => {
    if (closing) return;
    setClosing(true);
    setEntered(false);
    window.setTimeout(onClose, 280);
  };

  const { dragY, dragging, handleProps } = useBottomSheetSwipe(requestClose);

  useEffect(() => {
    if (preselected.current || stickyBed || !stickyWard) return;
    const recent = mostRecentBed(stickyWard, recentBeds);
    if (recent) {
      preselected.current = true;
      setStickyBed(recent);
    }
  }, [stickyWard, stickyBed, recentBeds, setStickyBed]);

  const chooseWard = (ward) => {
    if (ward !== stickyWard) {
      setStickyBed("");
      setBedPickerOpen(false);
    }
    setStickyWard(ward);
    if (ward) setRecentWards(pushMRU(recentWards, ward));
  };

  const chooseBed = (bed) => {
    setStickyBed(bed);
    if (bed && stickyWard) {
      setRecentBeds({ ...recentBeds, [stickyWard]: pushMRU(recentBeds[stickyWard] || [], bed) });
    }
  };

  const resetForAnother = () => {
    setText("");
    setUrgent(false);
    setRemindAt(null);
    setStep(1);
    setBedPickerOpen(false);
    setCustomTimeOpen(false);
    setReminderKey((k) => k + 1);
  };

  const save = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onAddJob(createJob({
      id: nextId(jobs),
      text: trimmed,
      ward: stickyWard,
      bed: stickyBed,
      priority: urgent ? PRIORITY.URGENT : PRIORITY.ROUTINE,
      remindAt,
    }));
    setRecentPhrases(pushMRU(recentPhrases, trimmed));
    if (warmStart) {
      resetForAnother();
      window.setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      requestClose();
    }
  };

  const goNextFromStep1 = () => {
    if (skipLocation) setStep(3);
    else setStep(2);
  };

  const goBack = () => {
    if (customTimeOpen) {
      setCustomTimeOpen(false);
      setReminderKey((k) => k + 1);
      return;
    }
    if (step === 2 && bedPickerOpen) {
      setBedPickerOpen(false);
      return;
    }
    if (step === 3) setStep(skipLocation ? 1 : 2);
    else if (step === 2) {
      setStep(1);
      setBedPickerOpen(false);
    }
  };

  const hideFooter = (step === 2 && bedPickerOpen) || customTimeOpen;

  const lift = keyboardInset > 0 ? -keyboardInset : 0;
  const sheetTransform = bottomSheetTransform({ entered, closing, dragY, lift });
  const sheetSizeStyle = { transform: sheetTransform, height: WIZARD_SHEET_HEIGHT, maxHeight: "92dvh" };
  const step3Context = [text.trim(), contextLine(stickyWard, stickyBed)].filter(Boolean).join(" · ");

  const renderStep1 = () => (
    <>
      {warmStart && (
        <p className={`${TYPE_META} mb-2 truncate`}>
          {contextLine(stickyWard, stickyBed)}
        </p>
      )}
      <p className={TYPE_SECTION}>What needs doing?</p>
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key !== "Enter") return;
          e.preventDefault();
          if (text.trim()) goNextFromStep1();
        }}
        placeholder="e.g. Chase repeat FBC"
        enterKeyHint="next"
        className={JOB_INPUT}
      />
      {recentPhrases.length > 0 && (
        <>
          <p className={`${TYPE_SECTION} mt-4`}>Recent</p>
          <div className="flex flex-wrap gap-1.5">
            {recentPhrases.map((phrase) => (
              <button
                key={phrase}
                type="button"
                onClick={() => {
                  setText(phrase);
                  inputRef.current?.focus();
                }}
                className={PHRASE_CHIP}
              >
                {phrase}
              </button>
            ))}
          </div>
        </>
      )}
    </>
  );

  const renderStep2 = () => (
    <>
      <p className={TYPE_SECTION}>Ward</p>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {wardChips.map((w) => (
          <button
            key={w}
            type="button"
            onClick={() => chooseWard(w)}
            className={`${CHIP} ${stickyWard === w ? CHIP_ON : CHIP_OFF}`}
          >
            {w}
          </button>
        ))}
        <NewChipEntry placeholder="Ward" onCommit={chooseWard} />
        {stickyWard && (
          <button type="button" onClick={() => chooseWard("")} className={`${CHIP} ${CHIP_OFF}`}>
            {NO_WARD_LABEL}
          </button>
        )}
      </div>

      {stickyWard && (
        <>
          <p className={TYPE_SECTION}>Bed (optional)</p>
          <button
            type="button"
            onClick={() => setBedPickerOpen(true)}
            className={`w-full flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left ${TYPE_UI_SM} ${
              stickyBed
                ? "border-claude-500/40 bg-claude-500/5 text-gray-900 dark:text-white"
                : "border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400"
            }`}
          >
            <span className="truncate">{stickyBed || "Pick bed"}</span>
            <span className="text-gray-400 shrink-0">▸</span>
          </button>
        </>
      )}
    </>
  );

  const renderStep3 = () => (
    <>
      <p className={`${TYPE_META} mb-3 truncate`}>{step3Context}</p>

      <p className={TYPE_SECTION}>Urgency</p>
      <div className="flex gap-1.5 mb-3">
        <button
          type="button"
          onClick={() => setUrgent(false)}
          className={`${SEG} ${!urgent ? SELECTED_CHIP : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800"}`}
        >
          Routine
        </button>
        <button
          type="button"
          onClick={() => setUrgent(true)}
          className={`${SEG} ${urgent ? "bg-red-600 text-white border-red-600" : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800"}`}
        >
          Urgent
        </button>
      </div>

      <p className={TYPE_SECTION}>Reminder</p>
      <div className="relative">
        <ReminderPicker
          key={reminderKey}
          variant="wizard"
          compact
          remindAt={remindAt}
          onChange={setRemindAt}
          overlayRoot={sheetNode}
          onCustomTimeOpenChange={setCustomTimeOpen}
        />
      </div>
    </>
  );

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
        className={`relative z-10 flex flex-col overflow-hidden ${dragging ? "" : "transition-transform duration-300 ease-out"}`}
        style={sheetSizeStyle}
      >
        <div ref={setSheetNode} className="relative bg-white dark:bg-gray-950 flex flex-col h-full min-h-0 rounded-t-3xl shadow-2xl overflow-hidden">
          <SheetDragHandle handleProps={handleProps} />
          <div className="flex-1 min-h-0 overflow-hidden px-5 pt-0 pb-1 flex flex-col">
            <div className="flex items-center gap-2 mb-1 shrink-0">
              {step > 1 ? (
                <button type="button" onClick={goBack} className={`${TYPE_DISMISS} min-w-8`}>
                  ←
                </button>
              ) : (
                <span className="min-w-8" aria-hidden="true" />
              )}
              <h1 className={`flex-1 ${TYPE_TITLE}`}>Add a job</h1>
              <button type="button" onClick={requestClose} className={`${TYPE_DISMISS} text-xs`}>
                Done
              </button>
            </div>

            <StepProgress step={step} skipLocation={skipLocation} />

            <div className="flex-1 min-h-0 overflow-hidden relative">
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}

              {step === 2 && bedPickerOpen && stickyWard && (
                <div className="absolute inset-0 z-20 flex flex-col bg-white dark:bg-gray-950 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setBedPickerOpen(false)}
                    className={`shrink-0 self-start ${TYPE_DISMISS} text-xs px-1 py-1 mb-1`}
                  >
                    ← Back
                  </button>
                  <div className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain touch-pan-y pr-0.5">
                    <BedPickerPanel
                      ward={stickyWard}
                      wardLayouts={wardLayouts}
                      recentBeds={recentBeds}
                      selectedBed={stickyBed}
                      onSelect={(bed) => { chooseBed(bed); setBedPickerOpen(false); }}
                      onClear={() => { chooseBed(""); setBedPickerOpen(false); }}
                      onSetupWard={() => onSetupWard(stickyWard)}
                      configured={wardConfigured}
                      embedded
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {!hideFooter && (
          <div
            className="shrink-0 px-5 pt-1.5 pb-2 border-t border-gray-100 dark:border-gray-900"
            style={keyboardInset > 0 ? { paddingBottom: "0.75rem" } : undefined}
          >
            {step === 1 && (
              <button
                type="button"
                onClick={goNextFromStep1}
                disabled={!text.trim()}
                className={PRIMARY_BTN_COMPACT}
              >
                Next
              </button>
            )}
            {step === 2 && (
              <button type="button" onClick={() => setStep(3)} className={PRIMARY_BTN_COMPACT}>
                Next
              </button>
            )}
            {step === 3 && (
              <button type="button" onClick={save} disabled={!text.trim()} className={PRIMARY_BTN_COMPACT}>
                Add job
              </button>
            )}
          </div>
          )}
        </div>
        <SheetSafeBottom />
      </div>
    </div>
  );
}
