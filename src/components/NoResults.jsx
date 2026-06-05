import WikiCard from "./WikiCard";

export default function NoResults({ query, fallbacks, expanded, onToggle }) {
  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 mb-5">
        <p className="text-sm text-gray-700 font-medium mb-1">Nothing found for "{query}"</p>
        <p className="text-xs text-gray-400 leading-relaxed">
          This may not have a dedicated section in the current guidelines.
          {fallbacks.length > 0 && " Some related sections are shown below."}
        </p>
        <p className="text-xs text-amber-600 mt-3">⚠ If urgent, escalate to your registrar or consultant.</p>
      </div>
      {fallbacks.length > 0 && (
        <>
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Closest matches</p>
          <div className="space-y-3">
            {fallbacks.map(page => (
              <WikiCard key={page.id} page={page} isFallback={true} query={query}
                isExpanded={!!expanded[page.id]}
                onToggle={() => onToggle(page.id)} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
