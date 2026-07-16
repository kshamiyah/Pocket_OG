import { sourceLabel, sourceLine } from "../lib/provenance";

// Small pill shown under a topic title.
export function TrustChip({ codes = [], extra = [] }) {
  const labels = [...codes.map(sourceLabel), ...extra];
  return (
    <span className="inline-flex items-start gap-1.5 rounded-full bg-accentsoft px-3 py-1.5 text-[11px] font-semibold leading-snug text-accent">
      <svg className="mt-px h-3.5 w-3.5 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3 5 6v5c0 4 3 7 7 8 4-1 7-4 7-8V6Z" strokeLinejoin="round" />
        <path d="m9.5 12 2 2 3.5-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>Based on {labels.join(" · ")}</span>
    </span>
  );
}

// Full provenance footer: one line per source, plus the standing disclaimer.
export function ProvenanceFooter({ codes = [], extra = [] }) {
  return (
    <div className="mt-6 border-t border-line pt-4">
      <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-accent">Where this comes from</p>
      <ul className="space-y-1">
        {codes.map(code => <li key={code} className="text-xs text-inksoft">{sourceLine(code)}</li>)}
        {extra.map((e, i) => <li key={`x${i}`} className="text-xs text-inksoft">{e}</li>)}
      </ul>
      <p className="mt-3 text-[11px] leading-snug text-inkfaint">
        Plain-English summaries drawn from the same guidance clinicians use. A decision aid, not medical advice, and never a substitute for your midwife, GP, maternity unit or 111.
      </p>
    </div>
  );
}
