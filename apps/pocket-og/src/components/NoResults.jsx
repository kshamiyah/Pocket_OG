import WikiCard from "./WikiCard";

export default function NoResults({ query, fallbacks, expanded, onToggle, onOpenFlowchart, onOpenGuideline }) {
  return (
    <div>
      <div className="rounded-3xl bg-gray-50 p-5 mb-5">
        <p className="text-sm text-gray-700 font-medium mb-1">Nothing found for "{query}"</p>
        <p className="text-xs text-gray-400 leading-relaxed">
          This may not have a dedicated section in the current guidelines.
          {fallbacks.length > 0 && " Some related sections are shown below."}
        </p>
        <p className="text-xs text-amber-600 mt-3">⚠ If urgent, escalate to your registrar or consultant.</p>
      </div>
      {fallbacks.length > 0 && (
        <>
          {/* Prominent fuzzy-match warning */}
          <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-4">
            <span className="text-amber-500 text-sm shrink-0 mt-0.5">⚠</span>
            <div>
              <p className="text-sm font-semibold text-amber-800">These are close matches — not exact results</p>
              <p className="text-xs text-amber-600 mt-0.5 leading-snug">
                Content below is the nearest match to "{query}". If you need specific guidance, confirm with your registrar or check the source guideline directly.
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Closest matches</p>
          <div className="space-y-3">
            {fallbacks.map(page => (
              <WikiCard key={page.id} page={page} isFallback={true} query={query}
                isExpanded={!!expanded[page.id]}
                onToggle={() => onToggle(page.id)}
                onOpenFlowchart={onOpenFlowchart}
                onOpenGuideline={onOpenGuideline} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
