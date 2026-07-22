import { useMemo, useState } from "react";
import { splitOpenDone } from "../utils/jobs";
import JobList from "./JobList";
import { JOB_LIST_SECTION } from "../utils/screenLayout";
import { TYPE_OVERLINE } from "../utils/typography";

function Chevron({ open }) {
  return (
    <span
      aria-hidden
      className={`inline-flex items-center justify-center w-4 h-4 text-sm leading-none text-gray-400 transition-transform origin-center ${open ? "rotate-90" : ""}`}
    >
      ›
    </span>
  );
}

function CompletedSection({ jobs, children }) {
  const [open, setOpen] = useState(false);
  if (jobs.length === 0) return null;

  return (
    <div className="flex flex-col gap-1.5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex gap-2 items-center px-2.5 min-h-10 text-left active:opacity-80"
      >
        <span className="shrink-0 min-w-10 min-h-10 -ml-1 flex items-center justify-center">
          <Chevron open={open} />
        </span>
        <span className={`${TYPE_OVERLINE} leading-none`}>
          Completed ({jobs.length})
        </span>
      </button>
      {open && (
        <JobList jobs={jobs}>
          {children}
        </JobList>
      )}
    </div>
  );
}

/** Open jobs in a FLIP list; completed jobs in a collapsed-by-default section. */
export default function JobListWithCompleted({ jobs, className = "", listClassName = "", children }) {
  const { open, done } = useMemo(() => splitOpenDone(jobs), [jobs]);
  const rootClass = className || JOB_LIST_SECTION;

  if (open.length === 0 && done.length === 0) return null;

  return (
    <div className={rootClass}>
      {open.length > 0 && (
        <JobList jobs={open} className={listClassName}>
          {children}
        </JobList>
      )}
      <CompletedSection jobs={done}>
        {children}
      </CompletedSection>
    </div>
  );
}
