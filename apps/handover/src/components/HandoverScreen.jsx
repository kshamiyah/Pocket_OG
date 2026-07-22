import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import HandoverMark from "./HandoverMark";
import { PRIORITY, NO_WARD_LABEL } from "../utils/constants";
import { sortByUrgency } from "../utils/jobs";
import { buildHandoverUrl } from "../utils/payload";
import { layoutsForJobWards } from "../utils/layoutWire";
import { SCREEN, SCREEN_FOOTER, safeBottom, safeTop, BACK_LINK, PRIMARY_BTN, PRIMARY_BTN_COMPACT, SELECTED_CHIP } from "../utils/screenLayout";
import { bottomSheetTransform, useBottomSheetSwipe } from "../utils/useBottomSheetSwipe";
import SheetDragHandle, { SheetSafeBottom } from "./SheetDragHandle";
import { TYPE_BADGE, TYPE_CAPTION, TYPE_OVERLINE, TYPE_TITLE } from "../utils/typography";

function Toggle({ on, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className={`w-10 h-6 rounded-full relative shrink-0 transition-colors ${on ? "bg-claude-600" : "bg-gray-300 dark:bg-gray-700"}`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${on ? "left-[18px]" : "left-0.5"}`}
      />
    </button>
  );
}

function JobPickerRow({ job, selected, onToggle }) {
  const urgent = job.priority === PRIORITY.URGENT;
  const location = [job.ward, job.bed].filter(Boolean).join(" · ");

  return (
    <button
      type="button"
      onClick={() => onToggle(job.id)}
      aria-pressed={selected}
      className="w-full text-left flex items-center gap-3 py-3 px-4 active:bg-gray-50 dark:active:bg-gray-900/50"
    >
      <span
        className={`w-7 h-7 rounded-md border-2 shrink-0 flex items-center justify-center transition-colors ${
          selected ? "bg-claude-600 border-claude-600" : "border-gray-300 dark:border-gray-600"
        }`}
        aria-hidden="true"
      >
        {selected && (
          <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2.5 6l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-medium leading-snug line-clamp-2 break-words ${job.done ? "text-gray-400 dark:text-gray-600 line-through" : "text-gray-900 dark:text-white"}`}>
          {job.text}
        </p>
        {location && (
          <p className="text-xs text-gray-400 dark:text-gray-600 truncate mt-0.5">{location}</p>
        )}
      </div>
      {urgent && !job.done && (
        <span className={`shrink-0 ${TYPE_BADGE} text-red-600 dark:text-red-400`}>
          Urgent
        </span>
      )}
      {job.done && (
        <span className={`shrink-0 ${TYPE_BADGE} text-gray-400 dark:text-gray-600`}>
          Done
        </span>
      )}
    </button>
  );
}

function jobIdSet(list) {
  return new Set(list.map((j) => j.id));
}

function wardKey(job) {
  return job.ward || NO_WARD_LABEL;
}

const COPY_BTN = "flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors";
const COPY_ON = SELECTED_CHIP;
const COPY_OFF = "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800";
const WARD_CHIP_ON = SELECTED_CHIP;
const WARD_CHIP_OFF = "bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-800";

function QrExpandSheet({ open, onClose, qrDataUrl, jobCount }) {
  const [entered, setEntered] = useState(false);
  const [closing, setClosing] = useState(false);
  const closingRef = useRef(false);

  useEffect(() => {
    if (!open) return undefined;
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, [open]);

  const requestClose = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    setEntered(false);
    window.setTimeout(() => {
      closingRef.current = false;
      setClosing(false);
      onClose();
    }, 280);
  };

  const { dragY, dragging, handleProps } = useBottomSheetSwipe(requestClose);

  if (!open && !closing) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col justify-end">
      <button
        type="button"
        aria-label="Close enlarged QR code"
        onClick={requestClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ease-out ${
          entered && !closing ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`relative z-10 ${dragging ? "" : "transition-transform duration-300 ease-out"}`}
        style={{ transform: bottomSheetTransform({ entered, closing, dragY }) }}
      >
        <div className="bg-white dark:bg-gray-950 rounded-t-2xl border-t border-gray-200 dark:border-gray-800 shadow-2xl max-h-[min(92dvh,100%)] flex flex-col overflow-hidden">
          <SheetDragHandle handleProps={handleProps} />
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden touch-pan-y">
            <div className="px-5 pt-3 pb-2 text-center">
              <p className={TYPE_OVERLINE}>
                Scan to take over
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {jobCount} job{jobCount === 1 ? "" : "s"} in this code
              </p>
            </div>
            <div className="flex justify-center px-5 py-3">
              <img
                src={qrDataUrl}
                alt="Handover QR code"
                className="w-full max-w-[min(72vw,14rem)] max-h-[min(42dvh,14rem)] rounded-2xl border border-gray-200 dark:border-gray-800 bg-white p-3 object-contain animate-qr-reveal motion-reduce:animate-none"
              />
            </div>
          </div>
          <div
            className="shrink-0 px-5 pt-2 border-t border-gray-100 dark:border-gray-900 bg-white dark:bg-gray-950"
            style={safeBottom("0.5rem")}
          >
            <button
              type="button"
              onClick={requestClose}
              className={`w-full ${PRIMARY_BTN_COMPACT}`}
            >
              Close
            </button>
          </div>
        </div>
        <SheetSafeBottom />
      </div>
    </div>
  );
}

export default function HandoverScreen({
  jobs, wardLayouts = {}, onBack, onFinish, onBridgeToEndShift, mode = "share",
}) {
  const endShift = mode === "endShift";
  const [includeCompleted, setIncludeCompleted] = useState(false);
  const [keepCopy, setKeepCopy] = useState(true);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [wardFilter, setWardFilter] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [qrError, setQrError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [qrExpanded, setQrExpanded] = useState(false);

  const openJobs = useMemo(() => jobs.filter((j) => !j.done), [jobs]);
  const pool = includeCompleted ? jobs : openJobs;
  const sortedPool = useMemo(() => sortByUrgency(pool), [pool]);

  const wards = useMemo(() => {
    const keys = [...new Set(pool.map(wardKey))];
    return keys.sort((a, b) => {
      if (a === NO_WARD_LABEL) return 1;
      if (b === NO_WARD_LABEL) return -1;
      return a.localeCompare(b);
    });
  }, [pool]);

  const visiblePool = useMemo(() => {
    if (!wardFilter) return sortedPool;
    return sortedPool.filter((j) => wardKey(j) === wardFilter);
  }, [sortedPool, wardFilter]);

  const wardCounts = useMemo(() => {
    const counts = new Map();
    for (const job of pool) {
      const key = wardKey(job);
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    return counts;
  }, [pool]);

  const [selectedIds, setSelectedIds] = useState(() => jobIdSet(openJobs));

  const toggleIncludeCompleted = () => {
    setIncludeCompleted((on) => {
      if (on) {
        const doneIds = jobIdSet(jobs.filter((j) => j.done));
        setSelectedIds((prev) => new Set([...prev].filter((id) => !doneIds.has(id))));
      }
      return !on;
    });
  };

  const jobsToSend = sortedPool.filter((j) => selectedIds.has(j.id));
  const urgentSelected = jobsToSend.filter((j) => !j.done && j.priority === PRIORITY.URGENT).length;

  const remainingOpen = useMemo(() => {
    if (endShift || keepCopy) return openJobs.length;
    return openJobs.filter((j) => !selectedIds.has(j.id)).length;
  }, [endShift, keepCopy, openJobs, selectedIds]);

  const showEndShiftBridge = !endShift && remainingOpen === 0 && jobsToSend.length > 0;
  const layoutsToSend = useMemo(
    () => layoutsForJobWards(wardLayouts, jobsToSend),
    [wardLayouts, jobsToSend],
  );
  const layoutWardNames = Object.keys(layoutsToSend);
  const url = jobsToSend.length ? buildHandoverUrl(jobsToSend, layoutsToSend) : null;

  useEffect(() => {
    if (!url) return undefined;
    let cancelled = false;
    QRCode.toDataURL(url, { errorCorrectionLevel: "M", margin: 1, width: 280 })
      .then((dataUrl) => { if (!cancelled) { setQrDataUrl(dataUrl); setQrError(null); } })
      .catch(() => {
        if (!cancelled) {
          setQrDataUrl(null);
          setQrError("Too much for one QR. Select fewer jobs or share the link.");
        }
      });
    return () => { cancelled = true; };
  }, [url]);

  const toggleJob = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      visiblePool.forEach((j) => next.add(j.id));
      return next;
    });
  };

  const clearSelection = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      visiblePool.forEach((j) => next.delete(j.id));
      return next;
    });
  };

  const share = async () => {
    if (!url) return;
    if (navigator.share) {
      try { await navigator.share({ title: "Handover", text: `${jobsToSend.length} jobs to hand over`, url }); }
      catch { /* user cancelled */ }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch { /* clipboard unavailable */ }
    }
  };

  const finishPayload = () => ({
    handedOverIds: jobsToSend.map((j) => j.id),
    removeFromPhone: !endShift && !keepCopy,
  });

  const finish = () => onFinish(finishPayload());

  const bridgeToEndShift = () => {
    if (!onBridgeToEndShift) return;
    onBridgeToEndShift(finishPayload());
  };

  return (
    <div className={`${SCREEN}`}>
      <div className="shrink-0 px-5 border-b border-gray-100 dark:border-gray-900" style={safeTop("0.75rem")}>
        <div className="flex items-center gap-3 pb-3">
          <button onClick={onBack} className={BACK_LINK} aria-label={endShift ? "Back to end of shift" : "Back to home"}>
            {endShift ? "← Back" : "← Home"}
          </button>
          <div className="min-w-0">
            <HandoverMark className={TYPE_TITLE} />
            {endShift ? (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                Share with whoever is taking over, then finish your shift
              </p>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                Your shift keeps running until you end it
              </p>
            )}
          </div>
        </div>

        {!endShift && pool.length > 0 && (
          <div className="flex gap-2 pb-3">
            <button
              type="button"
              onClick={() => setKeepCopy(true)}
              className={`${COPY_BTN} ${keepCopy ? COPY_ON : COPY_OFF}`}
            >
              Keep on my list
            </button>
            <button
              type="button"
              onClick={() => setKeepCopy(false)}
              className={`${COPY_BTN} ${!keepCopy ? COPY_ON : COPY_OFF}`}
            >
              Remove from my list
            </button>
          </div>
        )}

        <div className="flex items-center justify-between pb-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-bold tabular-nums text-gray-900 dark:text-white">{jobsToSend.length}</span>
            {" of "}
            <span className="font-bold tabular-nums text-gray-900 dark:text-white">{pool.length}</span>
            {" selected"}
            {urgentSelected > 0 && (
              <span className="text-red-600 dark:text-red-400"> · {urgentSelected} urgent</span>
            )}
          </p>
          {pool.length > 0 && (
            <div className="flex items-center gap-2 text-xs font-bold">
              <button type="button" onClick={selectAll} className="text-claude-700 dark:text-claude-400 px-2 py-2 min-h-11">
                {wardFilter ? "All in ward" : "All"}
              </button>
              <button type="button" onClick={clearSelection} className="text-gray-500 dark:text-gray-400 px-2 py-2 min-h-11">
                {wardFilter ? "None in ward" : "None"}
              </button>
            </div>
          )}
        </div>

        {wards.length > 1 && (
          <div className="flex gap-1.5 overflow-x-auto pb-3 touch-pan-x">
            <button
              type="button"
              onClick={() => setWardFilter(null)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                wardFilter === null ? WARD_CHIP_ON : WARD_CHIP_OFF
              }`}
            >
              All wards · {pool.length}
            </button>
            {wards.map((ward) => (
              <button
                key={ward}
                type="button"
                onClick={() => setWardFilter(ward)}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                  wardFilter === ward ? WARD_CHIP_ON : WARD_CHIP_OFF
                }`}
              >
                {ward} · {wardCounts.get(ward) || 0}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden touch-pan-y">
        {pool.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-600 py-12 text-center px-8">
            Nothing to hand over. Add a job first, or open options to include completed jobs.
          </p>
        ) : visiblePool.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-600 py-12 text-center px-8">
            No jobs in this ward.
          </p>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-900">
            {visiblePool.map((job) => (
              <JobPickerRow
                key={job.id}
                job={job}
                selected={selectedIds.has(job.id)}
                onToggle={toggleJob}
              />
            ))}
          </div>
        )}

        <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-900">
          <button
            type="button"
            onClick={() => setOptionsOpen((v) => !v)}
            className="text-xs font-bold text-gray-500 dark:text-gray-400"
          >
            {optionsOpen ? "Hide options" : "Options"}
          </button>
          {optionsOpen && (
            <div className="mt-3 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-900/40">
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">Include completed</div>
                  <div className="text-xs text-gray-400 dark:text-gray-600">Usually left off</div>
                </div>
                <Toggle on={includeCompleted} onClick={toggleIncludeCompleted} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40 px-5 py-3">
        {jobsToSend.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-600 text-center py-2">
            {pool.length > 0 ? "Select at least one job to generate a code." : "No jobs available."}
          </p>
        ) : (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQrExpanded(true)}
              disabled={!qrDataUrl}
              aria-label="Expand QR code"
              className="shrink-0 w-28 h-28 rounded-xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 flex items-center justify-center overflow-hidden active:scale-[0.98] transition-all disabled:active:scale-100"
            >
              {qrDataUrl && (
                <img src={qrDataUrl} alt="" className="w-full h-full object-contain p-1 pointer-events-none animate-qr-reveal motion-reduce:animate-none" />
              )}
              {!qrDataUrl && qrError && (
                <p className={`${TYPE_CAPTION} text-red-600 dark:text-red-400 text-center px-2 leading-snug`}>{qrError}</p>
              )}
            </button>
            <div className="min-w-0 flex-1 flex flex-col gap-2">
              <p className="text-sm font-bold text-gray-900 dark:text-white leading-snug">
                Scan or share
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">
                {qrDataUrl ? "Tap the code to enlarge it." : "Show this to whoever is taking over."}
                {layoutWardNames.length > 0 && (
                  <span className="block mt-1 text-claude-700 dark:text-claude-400">
                    Includes {layoutWardNames.length === 1
                      ? `${layoutWardNames[0]} bed layout`
                      : `${layoutWardNames.length} ward layouts`}
                  </span>
                )}
              </p>
              <button
                type="button"
                onClick={share}
                className="w-full py-2.5 rounded-xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-sm font-bold text-gray-700 dark:text-gray-300 active:scale-[0.98] transition-all"
              >
                {copied ? "Link copied" : navigator.share ? "Share link" : "Copy link"}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className={`${SCREEN_FOOTER} px-5 flex flex-col gap-2`} style={safeBottom()}>
        {showEndShiftBridge && onBridgeToEndShift && (
          <button
            type="button"
            onClick={bridgeToEndShift}
            className="w-full py-3 rounded-xl border border-claude-200 dark:border-claude-900 bg-claude-50 dark:bg-claude-950/30 text-sm font-semibold text-claude-800 dark:text-claude-200 active:scale-[0.98] transition-all"
          >
            Nothing left on your list. End your shift instead?
          </button>
        )}
        <button
          onClick={finish}
          className={PRIMARY_BTN}
        >
          {endShift ? "Finish shift" : "Done"}
        </button>
      </div>

      {qrExpanded && qrDataUrl && (
        <QrExpandSheet
          open={qrExpanded}
          onClose={() => setQrExpanded(false)}
          qrDataUrl={qrDataUrl}
          jobCount={jobsToSend.length}
        />
      )}
    </div>
  );
}
