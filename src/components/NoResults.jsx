import WikiCard from "./WikiCard";

export default function NoResults({ query, fallbacks, expanded, onToggle }) {
  return (
    <div>
      <div className="rounded-xl border border-slate-700/40 bg-slate-800/30 p-4 mb-4">
        <p className="text-sm text-slate-300 font-medium mb-1">No exact section found for "{query}"</p>
        <p className="text-xs text-slate-500 leading-relaxed">
          This term may not have a dedicated section in the current guidelines, or it may be covered under a different heading.
          {fallbacks.length > 0 && " Closest matches shown below."}
        </p>
        <p className="text-xs text-amber-400/80 mt-2">⚠ If this is a clinical question that needs an answer urgently, escalate to your registrar or consultant.</p>
      </div>
      {fallbacks.length > 0 && (
        <>
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Closest matches</p>
          <div className="space-y-2.5">
            {fallbacks.map(page => (
              <WikiCard key={page.id} page={page} isFallback={true}
                isExpanded={!!expanded[page.id]}
                onToggle={() => onToggle(page.id)} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
