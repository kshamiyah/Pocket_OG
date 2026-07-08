import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import HandoverMark from "./HandoverMark";
import { PRIORITY, NO_WARD_LABEL } from "../utils/constants";
import { sortByUrgency } from "../utils/jobs";
import { buildHandoverUrl } from "../utils/payload";
import { SCREEN, SCREEN_FOOTER, safeBottom, safeTop } from "../utils/screenLayout";

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
        className={`w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center transition-colors ${
          selected ? "bg-claude-600 border-claude-600" : "border-gray-300 dark:border-gray-600"
        }`}
        aria-hidden="true"
      >
        {selected && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2.5 6l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-medium leading-snug truncate ${job.done ? "text-gray-400 dark:text-gray-600 line-through" : "text-gray-900 dark:text-white"}`}>
          {job.text}
        </p>
        {location && (
          <p className="text-xs text-gray-400 dark:text-gray-600 truncate mt-0.5">{location}</p>
        )}
      </div>
      {urgent && !job.done && (
        <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-red-600 dark:text-red-400">
          Urgent
        </span>
      )}
      {job.done && (
        <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-gray-600">
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

const WARD_CHIP_ON = "bg-gray-900 dark:bg-white text-white dark:text-gray-950 border-gray-900 dark:border-white";
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
        className={`relative z-10 bg-white dark:bg-gray-950 rounded-t-2xl border-t border-gray-200 dark:border-gray-800 shadow-2xl transition-transform duration-300 ease-out ${
          entered && !closing ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }}
      >
        <div className="mx-auto mt-2 mb-1 h-1 w-10 rounded-full bg-gray-200 dark:bg-gray-800" aria-hidden="true" />
        <div className="px-5 pt-3 pb-2 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600">
            Scan to take over
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {jobCount} job{jobCount === 1 ? "" : "s"} in this code
          </p>
        </div>
        <div className="flex justify-center px-5 py-4">
          <img
            src={qrDataUrl}
            alt="Handover QR code"
            className="w-full max-w-[min(88vw,20rem)] rounded-2xl border border-gray-200 dark:border-gray-800 bg-white p-3"
          />
        </div>
        <button
          type="button"
          onClick={requestClose}
          className="mx-5 w-[calc(100%-2.5rem)] py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-950 text-sm font-bold active:scale-[0.98] transition-all"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default function HandoverScreen({ jobs, onBack, onFinish }) {
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
  const url = jobsToSend.length ? buildHandoverUrl(jobsToSend) : null;

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

  const finish = () => onFinish({
    clear: !keepCopy,
    handedOverIds: jobsToSend.map((j) => j.id),
  });

  return (
    <div className={`${SCREEN}`}>
      <div className="shrink-0 px-5 border-b border-gray-100 dark:border-gray-900" style={safeTop("0.75rem")}>
        <div className="flex items-center gap-3 pb-3">
          <button onClick={onBack} className="text-sm font-bold text-gray-500 dark:text-gray-400" aria-label="Back to home">
            ← Home
          </button>
          <HandoverMark className="font-extrabold text-lg text-gray-900 dark:text-white" />
        </div>

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
              <button type="button" onClick={selectAll} className="text-claude-700 dark:text-claude-400 px-2 py-1">
                {wardFilter ? "All in ward" : "All"}
              </button>
              <button type="button" onClick={clearSelection} className="text-gray-500 dark:text-gray-400 px-2 py-1">
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
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-800">
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">Keep a copy here</div>
                  <div className="text-xs text-gray-400 dark:text-gray-600">Off removes handed-over jobs</div>
                </div>
                <Toggle on={keepCopy} onClick={() => setKeepCopy((v) => !v)} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40 px-5 py-4">
        {jobsToSend.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-600 text-center py-2">
            {pool.length > 0 ? "Select at least one job to generate a code." : "No jobs available."}
          </p>
        ) : (
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setQrExpanded(true)}
              disabled={!qrDataUrl}
              aria-label="Expand QR code"
              className="shrink-0 w-[8.5rem] h-[8.5rem] rounded-xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 flex items-center justify-center overflow-hidden active:scale-[0.98] transition-all disabled:active:scale-100"
            >
              {qrDataUrl && (
                <img src={qrDataUrl} alt="" className="w-full h-full object-contain p-1 pointer-events-none" />
              )}
              {!qrDataUrl && qrError && (
                <p className="text-[11px] text-red-600 dark:text-red-400 text-center px-2 leading-snug">{qrError}</p>
              )}
            </button>
            <div className="min-w-0 flex-1 flex flex-col gap-2">
              <p className="text-sm font-bold text-gray-900 dark:text-white leading-snug">
                Scan or share
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">
                {qrDataUrl ? "Tap the code to enlarge it." : "Show this to whoever is taking over."}
              </p>
              <button
                type="button"
                onClick={share}
                className="mt-1 w-full py-2.5 rounded-xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-sm font-bold text-gray-700 dark:text-gray-300 active:scale-[0.98] transition-all"
              >
                {copied ? "Link copied" : navigator.share ? "Share link" : "Copy link"}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className={`${SCREEN_FOOTER} px-5`} style={safeBottom()}>
        <button
          onClick={finish}
          className="w-full py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-950 text-base font-bold active:scale-95 transition-all"
        >
          Done
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
