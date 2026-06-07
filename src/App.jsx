import { useState, useMemo, useRef, useEffect } from "react";
import { SEARCH_INDEX, search } from "./search/engine";
import { FLOWCHARTS } from "./data/flowcharts";
import WikiCard from "./components/WikiCard";
import NoResults from "./components/NoResults";
import FlowchartPlayer from "./components/FlowchartPlayer";
import FeedbackButton from "./components/FeedbackButton";

const FILTER_OPTIONS = [
  { value: "ALL",         label: "All guidelines",                     pill: "All",          codes: null,               active: "bg-gray-900 text-white" },
  { value: "GL952",       label: "Pre-Eclampsia / PIH / PET",          pill: "PET / PIH",    codes: ["GL952"],          active: "bg-blue-100 text-blue-700" },
  { value: "GL787",       label: "Obstetric Infections & Antibiotics", pill: "Antibiotics",  codes: ["GL787"],          active: "bg-emerald-100 text-emerald-700" },
  { value: "MISCARRIAGE", label: "Miscarriage",                        pill: "Miscarriage",  codes: ["CG565", "CG621"], active: "bg-violet-100 text-violet-700" },
  { value: "CG623",       label: "Ectopic Pregnancy",                  pill: "Ectopic",      codes: ["CG623"],          active: "bg-orange-100 text-orange-700" },
  { value: "GL895",       label: "PPRoM",                              pill: "PPRoM",        codes: ["GL895"],          active: "bg-sky-100 text-sky-700" },
  { value: "GL861",       label: "Induction of Labour & Term PLRoM",   pill: "IOL / PLRoM",  codes: ["GL861"],          active: "bg-teal-100 text-teal-700" },
  { value: "GL783",       label: "Iron Deficiency Anaemia",            pill: "Anaemia",      codes: ["GL783"],          active: "bg-amber-100 text-amber-700" },
  { value: "GL880",       label: "Intrahepatic Cholestasis of Pregnancy", pill: "ICP",       codes: ["GL880"],          active: "bg-yellow-100 text-yellow-700" },
  { value: "GL891",       label: "VTE in Pregnancy & Postnatal",       pill: "VTE",          codes: ["GL891"],          active: "bg-indigo-100 text-indigo-700" },
  { value: "GL983",       label: "Diabetes in Pregnancy",              pill: "Diabetes",     codes: ["GL983"],          active: "bg-pink-100 text-pink-700" },
  { value: "QS46",        label: "Multiple Pregnancy (Twins & Triplets)", pill: "Twins / NICE",     codes: ["QS46"],       active: "bg-cyan-100 text-cyan-700" },
  { value: "QS22",        label: "Antenatal Care",                       pill: "Antenatal / NICE", codes: ["QS22"],       active: "bg-lime-100 text-lime-700" },
  { value: "GTG57",       label: "Reduced Fetal Movements",              pill: "RFM / RCOG",       codes: ["GTG57"],      active: "bg-red-100 text-red-700" },
  { value: "FLOWCHARTS",  label: "Pages with flowcharts",              pill: "⬡ Flowcharts", filterFn: e => !!e.page.flowchartId, active: "bg-teal-100 text-teal-700", resultsOnly: true },
];

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

const FLOWCHART_LINKS = [
  { id: "GL861_IOL",        gl: "GL861" },
  { id: "GL952_TRIAGE",     gl: "GL952" },
  { id: "GL952_ACUTE",      gl: "GL952" },
  { id: "GL952_SEVERE_LW",  gl: "GL952" },
  { id: "GL952_POSTNATAL",  gl: "GL952" },
  { id: "CG565_TRIAGE",     gl: "CG565" },
  { id: "CG621_OUTPATIENT", gl: "CG621" },
  { id: "CG621_INPATIENT",  gl: "CG621" },
  { id: "CG623_MTX",        gl: "CG623" },
  { id: "GL891_ANTENATAL",  gl: "GL891" },
  { id: "GL891_POSTNATAL",  gl: "GL891" },
  { id: "GL983_DKA",        gl: "GL983" },
  { id: "GL880_DELIVERY",   gl: "GL880" },
  { id: "QS46_CARE_PATHWAY",   gl: "QS46" },
  { id: "QS46_TERTIARY",       gl: "QS46" },
  { id: "QS22_APPOINTMENTS",   gl: "QS22" },
  { id: "GTG57_CARE_PATHWAY",  gl: "GTG57" },
  { id: "GTG57_GESTATION",     gl: "GTG57" },
  { id: "GTG57_RECURRENT",     gl: "GTG57" },
];

const FC_GL_COLOR = {
  GL861: { badge: "bg-teal-50 text-teal-700 border-teal-100",       icon: "text-teal-400",   accent: "bg-teal-400" },
  GL952: { badge: "bg-blue-50 text-blue-700 border-blue-100",       icon: "text-blue-400",   accent: "bg-blue-400" },
  CG565: { badge: "bg-violet-50 text-violet-700 border-violet-100", icon: "text-violet-400", accent: "bg-violet-400" },
  CG621: { badge: "bg-rose-50 text-rose-700 border-rose-100",       icon: "text-rose-400",   accent: "bg-rose-400" },
  CG623: { badge: "bg-orange-50 text-orange-700 border-orange-100", icon: "text-orange-400", accent: "bg-orange-400" },
  GL891: { badge: "bg-indigo-50 text-indigo-700 border-indigo-100", icon: "text-indigo-400", accent: "bg-indigo-400" },
  GL983: { badge: "bg-pink-50 text-pink-700 border-pink-100",       icon: "text-pink-400",   accent: "bg-pink-400" },
  GL880: { badge: "bg-yellow-50 text-yellow-700 border-yellow-100", icon: "text-yellow-500", accent: "bg-yellow-400" },
  QS46: { badge: "bg-cyan-50 text-cyan-700 border-cyan-100",       icon: "text-cyan-400",   accent: "bg-cyan-400" },
  QS22:  { badge: "bg-lime-50 text-lime-700 border-lime-100",      icon: "text-lime-500",   accent: "bg-lime-400" },
  GTG57: { badge: "bg-red-50 text-red-700 border-red-100",         icon: "text-red-500",    accent: "bg-red-500" },
};

const FLOWCHART_GROUPS = [
  { gl: "GL952", label: "Pre-Eclampsia / Hypertension" },
  { gl: "GL861", label: "Induction of Labour" },
  { gl: "CG565", label: "First Trimester Miscarriage" },
  { gl: "CG621", label: "Medical Management of Miscarriage" },
  { gl: "CG623", label: "Ectopic Pregnancy" },
  { gl: "GL891", label: "VTE in Pregnancy & Postnatal" },
  { gl: "GL983", label: "Diabetes in Pregnancy" },
  { gl: "GL880", label: "Intrahepatic Cholestasis" },
  { gl: "QS46",  label: "Multiple Pregnancy (Twins & Triplets)" },
  { gl: "QS22",  label: "Antenatal Care" },
  { gl: "GTG57", label: "Reduced Fetal Movements" },
];

export default function App() {
  const [inputValue, setInputValue] = useState(""); // what the user is typing
  const [query, setQuery] = useState("");            // what actually drives search (set on Enter)
  const [filter, setFilter] = useState("ALL");
  const [expanded, setExpanded] = useState({});
  const [activeFlowchartId, setActiveFlowchartId] = useState(null);
  const [activeTab, setActiveTab] = useState("search");
  const inputRef = useRef(null);
  const resultsInputRef = useRef(null);
  const hasQuery = query.trim().length > 0;

  // Focus idle input on mount
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  // When transitioning to results view, transfer focus to results input
  useEffect(() => {
    if (hasQuery && resultsInputRef.current) {
      resultsInputRef.current.focus();
    }
  }, [hasQuery]);

  const submitSearch = (val) => {
    const v = (val ?? inputValue).trim();
    if (v) { setQuery(v); setExpanded({}); }
  };

  const clearSearch = () => {
    setInputValue("");
    setQuery("");
    setFilter("ALL");
    setExpanded({});
  };

  const activeOption = FILTER_OPTIONS.find(o => o.value === filter);
  const { primary, fallback } = useMemo(() => {
    const pool = activeOption?.filterFn
      ? SEARCH_INDEX.filter(activeOption.filterFn)
      : activeOption?.codes
        ? SEARCH_INDEX.filter(e => activeOption.codes.includes(e.page.gl))
        : SEARCH_INDEX;
    return search(query, pool);
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
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Feedback button — always visible */}
      <FeedbackButton query={query} filter={filter} />

      {/* Flowchart overlay */}
      {activeFlowchartId && FLOWCHARTS[activeFlowchartId] && (
        <FlowchartPlayer
          flowchart={FLOWCHARTS[activeFlowchartId]}
          onClose={() => setActiveFlowchartId(null)}
        />
      )}

      {/* Search tab — home / results */}
      {activeTab === "search" && (
        <>
          {/* Hero / idle state */}
          {!hasQuery && (
            <div className="flex flex-col items-center justify-center min-h-screen px-5 pb-24">
              <div className="w-full max-w-lg">

                {/* Hero */}
                <div className="text-center mb-10">
                  <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Pocket O&G</h1>
                  <p className="text-base text-gray-400 mt-3 leading-relaxed">
                    RBH Maternity guidelines,<br />whenever you need them.
                  </p>
                  <p className="text-xs text-gray-300 mt-2">Built by Khalid Shamiyah</p>
                </div>

                {/* Search */}
                <div className="relative mb-5">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Ask a clinical question…"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && submitSearch()}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-11 pr-14 py-4 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                  />
                  <button
                    onClick={() => submitSearch()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                </div>

                {/* Guideline filter pills */}
                <div className="flex gap-2 overflow-x-auto -mx-5 px-5 pb-1 no-scrollbar">
                  {FILTER_OPTIONS.filter(o => !o.resultsOnly).map(o => (
                    <button
                      key={o.value}
                      onClick={() => setFilter(o.value)}
                      className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        filter === o.value
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {o.pill}
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
          <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md">
            {/* Search row */}
            <div className="max-w-2xl mx-auto px-4 pt-3 pb-2">
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
                <input
                  ref={resultsInputRef}
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && submitSearch()}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-11 pr-10 py-2.5 text-sm text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                />
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-gray-300 hover:bg-gray-400 transition-colors"
                >
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            {/* Filter pills row */}
            <div className="flex gap-2 overflow-x-auto px-4 pb-3 no-scrollbar border-b border-gray-100">
              {FILTER_OPTIONS.map(f => (
                <button
                  key={f.value}
                  onClick={() => { setFilter(f.value); setExpanded({}); }}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                    filter === f.value ? f.active : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {f.pill}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="max-w-2xl mx-auto px-4 py-5 pb-24">
            {!showNoResults && (
              <p className="text-sm text-gray-500 mb-4">
                <span className="font-semibold text-gray-900">{primary.length}</span>{" "}
                result{primary.length !== 1 ? "s" : ""} for{" "}
                <span className="font-semibold text-gray-900">"{query}"</span>
                {filter !== "ALL" && <span className="text-gray-400"> · {activeOption?.label}</span>}
              </p>
            )}

            {showNoResults
              ? <NoResults query={query} fallbacks={fallback} expanded={expanded} onToggle={toggle} onOpenFlowchart={setActiveFlowchartId} />
              : (
                <div className="space-y-3">
                  {primary.map(page => (
                    <WikiCard key={page.id} page={page} query={query} isExpanded={!!expanded[page.id]} onToggle={() => toggle(page.id)} onOpenFlowchart={setActiveFlowchartId} />
                  ))}
                </div>
              )
            }

            <div className="mt-10 text-center">
              <p className="text-xs text-gray-300">Content derived verbatim from RBH trust guidelines · Not a substitute for clinical judgement · Always escalate when uncertain</p>
              <p className="text-xs text-gray-300 mt-1">Built by Khalid Shamiyah</p>
            </div>
          </div>
        </>
      )}
        </>
      )}

      {/* Flowcharts tab */}
      {activeTab === "flowcharts" && (
        <div className="min-h-screen pb-24">
          <div className="max-w-lg mx-auto">

            <div className="px-5 pt-16 pb-8">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Flowcharts</h2>
              <p className="text-sm text-gray-400 mt-1">Interactive clinical decision pathways</p>
            </div>

            {FLOWCHART_GROUPS.map(group => {
              const groupLinks = FLOWCHART_LINKS.filter(fc => fc.gl === group.gl);
              if (!groupLinks.length) return null;
              const col = FC_GL_COLOR[group.gl];
              return (
                <div key={group.gl} className="mb-8 px-5">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className={`text-xs font-bold tracking-wide ${col.icon}`}>{group.gl}</span>
                    <span className="text-xs text-gray-400">{group.label}</span>
                  </div>
                  <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm">
                    {groupLinks.map((fc, i) => {
                      const chart = FLOWCHARTS[fc.id];
                      return (
                        <button
                          key={fc.id}
                          onClick={() => setActiveFlowchartId(fc.id)}
                          className={`flex items-center gap-3 w-full px-4 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left ${
                            i > 0 ? "border-t border-gray-50" : ""
                          }`}
                        >
                          <div className={`w-1 h-8 rounded-full shrink-0 ${col.accent}`} />
                          <p className="flex-1 text-sm font-medium text-gray-900">{chart.title}</p>
                          <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

          </div>
        </div>
      )}

      {/* Tab bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-gray-100">
        <div className="flex max-w-lg mx-auto">
          <button
            onClick={() => setActiveTab("search")}
            className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
              activeTab === "search" ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <span className="text-xs font-medium">Search</span>
          </button>
          <button
            onClick={() => setActiveTab("flowcharts")}
            className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
              activeTab === "flowcharts" ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l8.5 5v10L12 22 3.5 17V7L12 2z" />
            </svg>
            <span className="text-xs font-medium">Flowcharts</span>
          </button>
        </div>
      </div>

    </div>
  );
}
