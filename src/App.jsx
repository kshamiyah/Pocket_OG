import { useState, useMemo, useRef, useEffect } from "react";
import { GL952_SECTIONS } from "./data/GL952";
import { GL787_SECTIONS } from "./data/GL787";
import { expandQuery, scoreResult } from "./search/engine";
import WikiCard from "./components/WikiCard";
import NoResults from "./components/NoResults";

const WIKI = [...GL952_SECTIONS, ...GL787_SECTIONS];

const SUGGESTIONS = [
  "postnatal blood pressure",
  "caesarean antibiotics",
  "GBS prophylaxis",
  "magnesium dose",
  "cellulitis",
  "UTI treatment",
  "fitting on ward",
  "gentamicin weight",
];

export default function App() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [expanded, setExpanded] = useState({});
  const inputRef = useRef(null);
  const hasQuery = query.trim().length > 0;

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const { primary, fallback } = useMemo(() => {
    const pool = filter === "ALL" ? WIKI : WIKI.filter(p => p.gl === filter);
    const q = query.trim();
    if (!q) return { primary: [], fallback: [] };

    const terms = expandQuery(q);
    const scored = pool.map(p => ({ ...p, score: scoreResult(p, terms) })).sort((a, b) => b.score - a.score);
    const hits = scored.filter(p => p.score > 0);

    if (hits.length > 0) return { primary: hits, fallback: [] };

    const rawTerms = q.toLowerCase().split(/\s+/);
    const withPartial = pool.map(p => {
      const text = [p.title, p.condition, p.setting, ...p.tags].join(" ").toLowerCase();
      const partialScore = rawTerms.reduce((acc, t) => acc + (text.includes(t.slice(0, 4)) ? 1 : 0), 0);
      return { ...p, score: partialScore };
    }).filter(p => p.score > 0).sort((a, b) => b.score - a.score).slice(0, 3);

    return { primary: [], fallback: withPartial };
  }, [query, filter]);

  const toggle = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  const showNoResults = hasQuery && primary.length === 0;

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 2px; }
      `}</style>

      {/* Hero / idle state */}
      {!hasQuery && (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 pb-24">
          <div className="w-full max-w-xl">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center mb-3 shadow-sm">
                <span className="text-white text-base font-semibold">Rx</span>
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">ClinRef</h1>
              <p className="text-sm text-gray-400 mt-1">RBH Maternity guidelines</p>
            </div>

            {/* Search bar */}
            <div className="relative mb-4">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask a clinical question…"
                value={query}
                onChange={e => { setQuery(e.target.value); setExpanded({}); }}
                className="w-full border border-gray-200 rounded-2xl pl-11 pr-4 py-4 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 shadow-sm transition-all"
              />
            </div>

            {/* Suggestion chips */}
            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-xs text-gray-600 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results state */}
      {hasQuery && (
        <>
          {/* Sticky compact header */}
          <div className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-gray-100">
            <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
              <div className="w-7 h-7 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-semibold">Rx</span>
              </div>
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
                <input
                  type="text"
                  value={query}
                  onChange={e => { setQuery(e.target.value); setExpanded({}); }}
                  className="w-full border border-gray-200 rounded-xl pl-9 pr-8 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                />
                <button
                  onClick={() => { setQuery(""); setExpanded({}); }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
                >×</button>
              </div>
              {/* Filter pills */}
              <div className="flex gap-1 shrink-0">
                {["ALL","GL952","GL787"].map(f => (
                  <button
                    key={f}
                    onClick={() => { setFilter(f); setExpanded({}); }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      filter === f
                        ? f === "GL952" ? "bg-blue-100 text-blue-700"
                          : f === "GL787" ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-900 text-white"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {f === "ALL" ? "All" : f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="max-w-2xl mx-auto px-4 py-5">
            {!showNoResults && (
              <p className="text-xs text-gray-400 mb-4">
                {primary.length} result{primary.length !== 1 ? "s" : ""} for "{query}"
              </p>
            )}

            {showNoResults
              ? <NoResults query={query} fallbacks={fallback} expanded={expanded} onToggle={toggle} />
              : (
                <div className="space-y-3">
                  {primary.map(page => (
                    <WikiCard key={page.id} page={page} isExpanded={!!expanded[page.id]} onToggle={() => toggle(page.id)} />
                  ))}
                </div>
              )
            }

            <div className="mt-10 text-center">
              <p className="text-xs text-gray-300">Content derived verbatim from RBH trust guidelines · Not a substitute for clinical judgement · Always escalate when uncertain</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
