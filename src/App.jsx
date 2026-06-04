import { useState, useMemo } from "react";
import { GUIDELINES, GL_COLORS } from "./data/guidelines";
import { GL952_SECTIONS } from "./data/GL952";
import { GL787_SECTIONS } from "./data/GL787";
import { expandQuery, scoreResult } from "./search/engine";
import WikiCard from "./components/WikiCard";
import NoResults from "./components/NoResults";

const WIKI = [...GL952_SECTIONS, ...GL787_SECTIONS];

const SUGGESTIONS = [
  "cellulitis","postnatal blood pressure","caesarean antibiotics","magnesium dose",
  "GBS prophylaxis","penicillin allergy sepsis","gentamicin weight","breastfeeding medication",
  "UTI treatment","fitting on ward"
];

export default function App() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [expanded, setExpanded] = useState({});

  const { primary, fallback } = useMemo(() => {
    const pool = filter === "ALL" ? WIKI : WIKI.filter(p => p.gl === filter);
    const q = query.trim();
    if (!q) return { primary: pool, fallback: [] };

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
  const showNoResults = query.trim() && primary.length === 0;

  return (
    <div className="min-h-screen bg-[#0d1117] text-white" style={{ fontFamily: "'DM Mono', monospace" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@400;500;600;700&display=swap'); *{box-sizing:border-box;} ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:#1a1f2e} ::-webkit-scrollbar-thumb{background:#334155;border-radius:2px}`}</style>

      <div className="sticky top-0 z-20 bg-[#0d1117]/95 backdrop-blur border-b border-slate-800">
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500/30 to-blue-500/20 border border-teal-500/30 flex items-center justify-center">
                <span className="text-teal-400 text-xs font-bold" style={{ fontFamily: "'DM Sans',sans-serif" }}>Rx</span>
              </div>
              <div>
                <h1 className="text-white font-bold text-lg leading-none" style={{ fontFamily: "'DM Sans',sans-serif" }}>ClinRef</h1>
                <p className="text-slate-500 text-xs">RBH Maternity · 2 guidelines</p>
              </div>
            </div>
            <div className="flex gap-1">
              {["ALL","GL952","GL787"].map(f => (
                <button key={f} onClick={() => { setFilter(f); setExpanded({}); }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${filter === f
                    ? f === "GL952" ? "bg-blue-900/60 text-blue-300 border-blue-600/50"
                      : f === "GL787" ? "bg-emerald-900/60 text-emerald-300 border-emerald-600/50"
                      : "bg-slate-700 text-white border-slate-600"
                    : "bg-transparent text-slate-400 border-slate-700 hover:border-slate-500"}`}>
                  {f === "ALL" ? "All" : f}
                </button>
              ))}
            </div>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-base">⌕</span>
            <input type="text" placeholder="e.g. cellulitis, magnesium dose, GBS..."
              value={query} onChange={e => { setQuery(e.target.value); setExpanded({}); }}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-9 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20"
              style={{ fontFamily: "'DM Mono',monospace" }} />
            {query && <button onClick={() => { setQuery(""); setExpanded({}); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xl leading-none">×</button>}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4">
        {!query && (
          <div className="mb-4">
            <p className="text-xs text-slate-600 uppercase tracking-widest mb-2">Try searching</p>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => setQuery(s)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-400 hover:text-teal-300 hover:border-teal-600/40 transition-all">{s}</button>
              ))}
            </div>
          </div>
        )}

        {!query && (
          <div className="flex gap-3 mb-4">
            {Object.entries(GUIDELINES).map(([code, gl]) => (
              <div key={code} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs ${GL_COLORS[code].badge}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${GL_COLORS[code].dot}`}></span>
                <span className="font-medium">{code}</span>
                <span className="opacity-60">— {gl.label}</span>
              </div>
            ))}
          </div>
        )}

        {!showNoResults && (
          <p className="text-xs text-slate-500 mb-3">
            {query ? `${primary.length} result${primary.length !== 1 ? "s" : ""} for "${query}"` : `${primary.length} sections`}
          </p>
        )}

        {showNoResults
          ? <NoResults query={query} fallbacks={fallback} expanded={expanded} onToggle={toggle} />
          : (
            <div className="space-y-2.5">
              {primary.map(page => (
                <WikiCard key={page.id} page={page} isExpanded={!!expanded[page.id]} onToggle={() => toggle(page.id)} />
              ))}
            </div>
          )
        }

        <div className="mt-8 pt-4 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-700">Content derived verbatim from RBH trust guidelines · Not a substitute for clinical judgement · Always escalate when uncertain</p>
        </div>
      </div>
    </div>
  );
}
