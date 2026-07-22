import { useLayoutEffect, useRef } from "react";
import { JOB_LIST } from "../utils/screenLayout";
import { usePrefersReducedMotion } from "../utils/usePrefersReducedMotion";

const FLIP_MS = 280;

function readTops(container) {
  const map = new Map();
  container.querySelectorAll("[data-flip-item]").forEach((el) => {
    map.set(el.dataset.jobId, el.getBoundingClientRect().top);
  });
  return map;
}

/** FLIP-reorders job cards when sort order changes (e.g. mark done). */
export default function JobList({ jobs, className = "", children }) {
  const containerRef = useRef(null);
  const prevTopsRef = useRef(new Map());
  const reducedMotion = usePrefersReducedMotion();
  const orderKey = jobs.map((j) => `${j.id}:${j.done ? 1 : 0}`).join("|");
  const rootClass = className ? `${JOB_LIST} ${className}` : JOB_LIST;

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const nextTops = readTops(container);
    const prevTops = prevTopsRef.current;

    if (!reducedMotion && prevTops.size > 0) {
      container.querySelectorAll("[data-flip-item]").forEach((el) => {
        const id = el.dataset.jobId;
        const oldTop = prevTops.get(id);
        const newTop = nextTops.get(id);
        if (oldTop === undefined || newTop === undefined) return;
        const delta = oldTop - newTop;
        if (Math.abs(delta) < 1) return;

        el.style.transform = `translateY(${delta}px)`;
        el.style.transition = "transform 0s";

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            el.style.transition = `transform ${FLIP_MS}ms ease-out`;
            el.style.transform = "";
          });
        });
      });
    }

    prevTopsRef.current = nextTops;
    return undefined;
  }, [orderKey, reducedMotion]);

  return (
    <div ref={containerRef} className={rootClass}>
      {jobs.map((job, index) => (
        <div
          key={job.id}
          data-flip-item
          data-job-id={String(job.id)}
          className="motion-reduce:!transition-none"
        >
          {children(job, index)}
        </div>
      ))}
    </div>
  );
}
