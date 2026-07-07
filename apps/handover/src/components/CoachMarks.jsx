import { useCallback, useEffect, useLayoutEffect, useState } from "react";

const STEPS = [
  {
    target: "[data-coach='fab']",
    title: "Add a job",
    body: "Tap here any time to capture what needs doing.",
    placement: "above",
  },
  {
    target: "[data-coach='mode-tabs']",
    title: "By ward or all jobs",
    body: "By ward for rounds. All jobs for a flat list.",
    placement: "below",
  },
  {
    target: "[data-coach='density-tabs']",
    title: "Walk or expand",
    body: "Walk goes bed by bed. Expand shows the whole ward on one page.",
    placement: "below",
  },
  {
    target: "[data-coach='exchange-btn']",
    title: "Hand over or take over",
    body: "Open jobs? Tap to hand over. Taking over? Tap to scan the outgoing QR. Wards and profile are under ···.",
    placement: "below",
  },
];

const TOOLTIP_H = 200;

function tooltipStyle(hole, placement) {
  const inset = { left: 20, right: 20 };
  if (!hole) return { top: "35%", ...inset };

  const gap = 12;
  if (placement === "above") {
    const top = hole.top - TOOLTIP_H - gap;
    if (top >= 16) return { top, ...inset };
  }
  return { top: hole.top + hole.height + gap, ...inset };
}

export default function CoachMarks({ onComplete }) {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState(null);

  const measure = useCallback(() => {
    const el = document.querySelector(STEPS[step].target);
    if (!el) {
      setRect(null);
      return;
    }
    const r = el.getBoundingClientRect();
    setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
  }, [step]);

  useLayoutEffect(() => {
    const id = requestAnimationFrame(() => measure());
    const retry = setTimeout(measure, 120);
    return () => {
      cancelAnimationFrame(id);
      clearTimeout(retry);
    };
  }, [measure]);

  useEffect(() => {
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [measure]);

  const current = STEPS[step];
  const isLast = step >= STEPS.length - 1;

  const next = () => {
    if (isLast) onComplete();
    else setStep((s) => s + 1);
  };

  const pad = 10;
  const hole = rect
    ? {
        top: Math.max(8, rect.top - pad),
        left: Math.max(8, rect.left - pad),
        width: rect.width + pad * 2,
        height: rect.height + pad * 2,
      }
    : null;

  const tipStyle = tooltipStyle(hole, current.placement);

  return (
    <div className="fixed inset-0 z-[60] pointer-events-none">
      {hole && (
        <div
          className="absolute rounded-2xl ring-4 ring-claude-500 pointer-events-none"
          style={{
            top: hole.top,
            left: hole.left,
            width: hole.width,
            height: hole.height,
            boxShadow: "0 0 0 9999px rgba(0,0,0,0.58)",
          }}
        />
      )}
      <div
        className="absolute rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 shadow-xl pointer-events-auto"
        style={tipStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs font-bold uppercase tracking-widest text-claude-600 mb-1">
          {step + 1} of {STEPS.length}
        </p>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{current.title}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug mb-4">{current.body}</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onComplete}
            className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-sm font-bold text-gray-600 dark:text-gray-300"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={next}
            className="flex-1 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-950 text-sm font-bold"
          >
            {isLast ? "Done" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
