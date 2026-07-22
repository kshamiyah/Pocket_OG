import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { SELECTED_CHIP } from "../utils/screenLayout";
import { TYPE_BODY_SM, TYPE_EYEBROW, TYPE_TITLE, TYPE_UI } from "../utils/typography";

const STEPS = [
  {
    target: "[data-coach='fab']",
    title: "Add a job",
    body: "Tap here any time to capture what needs doing.",
    placement: "above",
    shape: "circle",
    pad: 8,
  },
  {
    target: "[data-coach='mode-tabs']",
    title: "By ward or all jobs",
    body: "By ward for rounds. All jobs for a flat list.",
    placement: "below",
    shape: "rounded",
    pad: 8,
  },
  {
    target: "[data-coach='exchange-btn']",
    title: "Exchange",
    body: "Take over a colleague's jobs, hand over yours mid-shift, or end your shift.",
    placement: "below",
    shape: "circle",
    pad: 8,
  },
];

const TOOLTIP_H = 200;

function buildHole(raw, { pad, shape }) {
  if (!raw) return null;

  if (shape === "circle") {
    const size = Math.max(raw.width, raw.height) + pad * 2;
    const cx = raw.left + raw.width / 2;
    const cy = raw.top + raw.height / 2;
    return {
      top: cy - size / 2,
      left: cx - size / 2,
      width: size,
      height: size,
      round: "rounded-full",
    };
  }

  return {
    top: raw.top - pad,
    left: raw.left - pad,
    width: raw.width + pad * 2,
    height: raw.height + pad * 2,
    round: "rounded-2xl",
  };
}

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
  const overlayRef = useRef(null);
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState(null);

  const measure = useCallback(() => {
    const root = overlayRef.current;
    const el = document.querySelector(STEPS[step].target);
    if (!root || !el) {
      setRect(null);
      return;
    }
    const r = el.getBoundingClientRect();
    const rootR = root.getBoundingClientRect();
    setRect({
      top: r.top - rootR.top,
      left: r.left - rootR.left,
      width: r.width,
      height: r.height,
    });
  }, [step]);

  useLayoutEffect(() => {
    measure();
    const el = document.querySelector(STEPS[step].target);
    if (!el) return undefined;

    const ro = new ResizeObserver(measure);
    ro.observe(el);

    const retry = window.setTimeout(measure, 80);
    return () => {
      ro.disconnect();
      window.clearTimeout(retry);
    };
  }, [measure, step]);

  useLayoutEffect(() => {
    window.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("scroll", measure);
    return () => {
      window.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("scroll", measure);
    };
  }, [measure]);

  const current = STEPS[step];
  const isLast = step >= STEPS.length - 1;
  const hole = buildHole(rect, current);

  const next = () => {
    if (isLast) onComplete();
    else {
      setRect(null);
      setStep((s) => s + 1);
    }
  };

  const tipStyle = tooltipStyle(hole, current.placement);

  return (
    <div ref={overlayRef} className="absolute inset-0 z-[60] pointer-events-none">
      {hole && (
        <div
          className={`absolute ${hole.round} ring-4 ring-claude-500 pointer-events-none`}
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
        key={step}
        className="absolute rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 shadow-xl pointer-events-auto animate-fade-in-up motion-reduce:animate-none"
        style={tipStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <p className={`${TYPE_EYEBROW} mb-1`}>
          {step + 1} of {STEPS.length}
        </p>
        <h2 className={`${TYPE_TITLE} mb-1`}>{current.title}</h2>
        <p className={`${TYPE_BODY_SM} text-gray-600 dark:text-gray-400 mb-4`}>{current.body}</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onComplete}
            className={`flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-800 ${TYPE_UI} text-gray-600 dark:text-gray-300`}
          >
            Skip
          </button>
          <button
            type="button"
            onClick={next}
            className={`flex-1 py-3 rounded-xl ${TYPE_UI} border transition-colors ${SELECTED_CHIP}`}
          >
            {isLast ? "Done" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
