import { useState, useMemo, useRef, useEffect } from "react";
import { SEARCH_INDEX, search } from "./search/engine";
import { FLOWCHARTS } from "./data/flowcharts";
import { GUIDELINES } from "@pocket-og/guidelines";
import { glColors } from "./data/glColors";
import WikiCard from "./components/WikiCard";
import NoResults from "./components/NoResults";
import FlowchartPlayer from "./components/FlowchartPlayer";
import IOLPrioritizer from "./components/IOLPrioritizer";
import FeedbackButton from "./components/FeedbackButton";
import ConsentPage from "./components/ConsentPage";
import CalculatorPage from "./components/CalculatorPage";
import AlphabetSidebar from "./components/AlphabetSidebar";
import GuidelineReader from "./components/GuidelineReader";
import RxPage from "./components/RxPage";

const READER_AVAILABLE = new Set([
  "GL861", "GL952", "GL891", "GL983", "GL880", "GL787", "GL783", "GL895",
  "CG565", "CG621", "CG623", "QS46", "QS22", "GTG57", "GTG63", "GTG67",
  "NG88", "NHSCSP20",
  "GTG52", "GTG69", "NG25", "GTG31", "GTG17", "CG192",
  "NG133",
  "BASHH_PID",
]);

const FILTER_OPTIONS = [
  { value: "ALL",        label: "All guidelines",      pill: "All",           filterFn: null,                                                    active: "bg-gray-900 text-white" },
  { value: "RBH",        label: "RBH guidelines",      pill: "RBH",           filterFn: e => GUIDELINES[e.page.gl]?.source === "RBH",            active: "bg-gray-900 text-white" },
  { value: "RCOG",       label: "RCOG guidelines",     pill: "RCOG",          filterFn: e => GUIDELINES[e.page.gl]?.source === "RCOG",           active: "bg-gray-900 text-white" },
  { value: "NICE",       label: "NICE guidelines",     pill: "NICE",          filterFn: e => GUIDELINES[e.page.gl]?.source === "NICE",           active: "bg-gray-900 text-white" },
  { value: "FLOWCHARTS", label: "Pages with flowcharts", pill: "⬡ Flowcharts", filterFn: e => !!e.page.flowchartId,                             active: "bg-teal-100 text-teal-700" },
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
  { id: "GL861_TIMING",     gl: "GL861" },
  { id: "GL952_TRIAGE",          gl: "GL952" },
  { id: "GL952_ACUTE",           gl: "GL952" },
  { id: "GL952_SEVERE_LW",       gl: "GL952" },
  { id: "GL952_POSTNATAL",       gl: "GL952" },
  { id: "GL952_POSTNATAL_WARD",  gl: "GL952" },
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
  { id: "GTG63_TRIAGE",        gl: "GTG63" },
  { id: "GTG63_DELIVERY",      gl: "GTG63" },
  { id: "GTG63_ANTID",         gl: "GTG63" },
  { id: "NG88_ASSESSMENT",     gl: "NG88" },
  { id: "NG88_TREATMENT",      gl: "NG88" },
  { id: "NG88_SURGICAL",       gl: "NG88" },
  { id: "NG88_FIBROID",        gl: "NG88" },
  { id: "NG88_SECONDARY",      gl: "NG88" },
  { id: "GTG67_MANAGEMENT",      gl: "GTG67" },
  { id: "GTG67_AEH",             gl: "GTG67" },
  { id: "NHSCSP20_SCREENING",    gl: "NHSCSP20" },
  { id: "NHSCSP20_COLPOSCOPY",   gl: "NHSCSP20" },
  { id: "NHSCSP20_TOC",          gl: "NHSCSP20" },
  { id: "NHSCSP20_PREGNANCY",    gl: "NHSCSP20" },
  { id: "GTG52_PPH",             gl: "GTG52" },
  { id: "GTG31_SURVEILLANCE",    gl: "GTG31" },
  { id: "BASHH_PID_TRIAGE",      gl: "BASHH_PID" },
  { id: "BASHH_PID_ANTIBIOTICS", gl: "BASHH_PID" },
];

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
  { gl: "GTG63", label: "Antepartum Haemorrhage" },
  { gl: "NG88",  label: "Heavy Menstrual Bleeding" },
  { gl: "GTG67",    label: "Endometrial Hyperplasia" },
  { gl: "NHSCSP20", label: "Cervical Screening & Colposcopy" },
  { gl: "GTG52",    label: "Postpartum Haemorrhage" },
  { gl: "GTG31",    label: "Small for Gestational Age / FGR" },
  { gl: "BASHH_PID", label: "Pelvic Inflammatory Disease" },
];

export default function App() {
  const [inputValue, setInputValue] = useState(""); // what the user is typing
  const [query, setQuery] = useState("");            // what actually drives search (set on Enter)
  const [filter, setFilter] = useState("ALL");
  const [expanded, setExpanded] = useState({});
  const [activeFlowchartId, setActiveFlowchartId] = useState(null);
  const [showIOLPrioritizer, setShowIOLPrioritizer] = useState(false);
  const [activeTab, setActiveTab] = useState("search");
  const [glSourceFilter, setGlSourceFilter] = useState("ALL");
  const [fcSourceFilter, setFcSourceFilter] = useState("ALL");
  const [glSearchQuery, setGlSearchQuery] = useState("");
  const [fcSearchQuery, setFcSearchQuery] = useState("");
  const [activeGuidelineGl, setActiveGuidelineGl] = useState(null);
  const [activeCalcScenario, setActiveCalcScenario] = useState(null);
  const [calcNavKey, setCalcNavKey] = useState(0);
  const [activeConsentProcedure, setActiveConsentProcedure] = useState(null);
  const [consentNavKey, setConsentNavKey] = useState(0);
  const inputRef = useRef(null);
  const resultsInputRef = useRef(null);
  const glSectionRefs = useRef({});
  const fcSectionRefs = useRef({});

  const handleNavigate = ({ type, id }) => {
    if (type === "calculator") {
      setActiveFlowchartId(null);
      setActiveCalcScenario(id);
      setCalcNavKey(k => k + 1);
      setActiveTab("calculator");
    } else if (type === "flowchart") {
      setActiveFlowchartId(id);
    } else if (type === "consent") {
      setActiveFlowchartId(null);
      setActiveConsentProcedure(id);
      setConsentNavKey(k => k + 1);
      setActiveTab("consent");
    } else if (type === "iol-prioritizer") {
      setShowIOLPrioritizer(true);
    } else if (type === "reader") {
      setActiveGuidelineGl(id);
    }
  };
  const hasQuery = query.trim().length > 0;

  const filteredGuidelines = useMemo(() => {
    const q = glSearchQuery.toLowerCase().trim();
    return Object.values(GUIDELINES)
      .filter(gl => glSourceFilter === "ALL" || gl.source === glSourceFilter)
      .filter(gl => !q || gl.label.toLowerCase().includes(q) || gl.code.toLowerCase().includes(q))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [glSourceFilter, glSearchQuery]);

  const glGroupedByLetter = useMemo(() => {
    const groups = {};
    filteredGuidelines.forEach(gl => {
      const letter = gl.label[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(gl);
    });
    return groups;
  }, [filteredGuidelines]);

  const glActiveLetters = useMemo(() => new Set(Object.keys(glGroupedByLetter)), [glGroupedByLetter]);

  const filteredFlowchartGroups = useMemo(() => {
    const q = fcSearchQuery.toLowerCase().trim();
    return FLOWCHART_GROUPS.filter(group => {
      if (fcSourceFilter !== "ALL" && GUIDELINES[group.gl]?.source !== fcSourceFilter) return false;
      if (!q) return true;
      if (group.label.toLowerCase().includes(q) || group.gl.toLowerCase().includes(q)) return true;
      return FLOWCHART_LINKS.filter(fc => fc.gl === group.gl)
        .some(fc => FLOWCHARTS[fc.id]?.title?.toLowerCase().includes(q));
    });
  }, [fcSearchQuery, fcSourceFilter]);

  const fcGroupedByLetter = useMemo(() => {
    const groups = {};
    filteredFlowchartGroups.forEach(group => {
      const letter = group.label[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(group);
    });
    return groups;
  }, [filteredFlowchartGroups]);

  const fcActiveLetters = useMemo(() => new Set(Object.keys(fcGroupedByLetter)), [fcGroupedByLetter]);

  // Focus idle input on mount
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  // When transitioning to results view, blur the home input to dismiss keyboard
  useEffect(() => {
    if (hasQuery && inputRef.current) {
      inputRef.current.blur();
    }
  }, [hasQuery]);

  const submitSearch = (val) => {
    const v = (val ?? inputValue).trim();
    if (v) {
      setQuery(v);
      setExpanded({});
      document.activeElement?.blur();
    }
  };

  const clearSearch = () => {
    setInputValue("");
    setQuery("");
    setFilter("ALL");
    setExpanded({});
  };

  const activeOption = FILTER_OPTIONS.find(o => o.value === filter);
  const { primary, fallback } = useMemo(() => {
    const pool = activeOption?.filterFn ? SEARCH_INDEX.filter(activeOption.filterFn) : SEARCH_INDEX;
    return search(query, pool);
  }, [query, filter]);

  const toggle = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  const showNoResults = hasQuery && primary.length === 0;

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Helvetica Neue', sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; }
        html, body { -ms-overflow-style: none; scrollbar-width: none; }
        html::-webkit-scrollbar, body::-webkit-scrollbar { display: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 2px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        :focus-visible { outline: 2px solid #3b82f6; outline-offset: 2px; border-radius: 4px; }
      `}</style>

      {/* Feedback button — always visible */}
      <FeedbackButton query={query} filter={filter} />

      {/* IOL Prioritizer overlay */}
      {showIOLPrioritizer && <IOLPrioritizer onClose={() => setShowIOLPrioritizer(false)} />}

      {/* Guideline reader overlay */}
      {activeGuidelineGl && (
        <GuidelineReader
          gl={activeGuidelineGl}
          onClose={() => setActiveGuidelineGl(null)}
          onNavigate={handleNavigate}
        />
      )}

      {/* Flowchart overlay */}
      {activeFlowchartId && FLOWCHARTS[activeFlowchartId] && (() => {
        const fcGl = FLOWCHART_LINKS.find(fc => fc.id === activeFlowchartId)?.gl;
        const g = fcGl && GUIDELINES[fcGl];
        return (
          <FlowchartPlayer
            flowchart={FLOWCHARTS[activeFlowchartId]}
            gl={fcGl}
            theme={glColors(fcGl)}
            onClose={() => setActiveFlowchartId(null)}
            pdfUrl={g?.pdf ? (g.pdfUrl || g.pdfPath || `/guidelines/${fcGl}.pdf`) : null}
            onNavigate={handleNavigate}
          />
        );
      })()}

      {/* Search tab — home / results */}
      {activeTab === "search" && (
        <>
          {/* Hero / idle state */}
          {!hasQuery && (
            <div className="flex flex-col items-center justify-center min-h-screen px-5 pb-24">
              <div className="w-full max-w-lg">

                {/* Hero */}
                <div className="text-center mb-10">
                  <h1 className="text-[36px] sm:text-[50px] font-[800] tracking-[0.04em] text-black">Pocket O&G</h1>
                  <p className="mt-3 text-base leading-relaxed text-gray-400">
                    Local and national guidelines.<br />Whenever and wherever you need them.
                  </p>
                  <p className="mt-2 text-sm font-medium text-gray-400">Built by Khalid Shamiyah</p>
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
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-10 pr-12 py-3.5 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                  />
                  <button
                    onClick={() => submitSearch()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-xl bg-black hover:bg-gray-800 active:scale-95 transition-all"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                </div>

                {/* Suggestion chips */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {SUGGESTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => { setInputValue(s); submitSearch(s); }}
                      className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-xs text-gray-600 transition-colors"
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
          <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md">
            {/* Search row */}
            <div className="max-w-lg mx-auto px-4 pt-3 pb-2">
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
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                >
                  <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
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
                  aria-pressed={filter === f.value}
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
          <div className="max-w-lg mx-auto px-4 py-5 pb-24">
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
              <p className="text-xs text-gray-400">Content derived verbatim from RBH trust guidelines · Not a substitute for clinical judgement · Always escalate when uncertain</p>
              <p className="text-xs text-gray-400 mt-1">Built by Khalid Shamiyah</p>
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

            <div className="px-5 pt-14 pb-1">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Flowcharts</h2>
              <p className="text-xs text-gray-400 mt-0.5">Interactive clinical decision pathways</p>
            </div>

            {/* Sticky: source filter + search */}
            <div className="sticky top-0 z-20 bg-white border-b border-gray-100 pl-4 pr-12 pt-3 pb-3">
              <div className="flex gap-1.5 mb-2.5">
                {["ALL", "RBH", "RCOG", "NICE"].map(src => (
                  <button
                    key={src}
                    onClick={() => setFcSourceFilter(src)}
                    aria-pressed={fcSourceFilter === src}
                    className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                      fcSourceFilter === src ? "bg-black text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {src}
                  </button>
                ))}
              </div>
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Filter flowcharts…"
                  value={fcSearchQuery}
                  onChange={e => setFcSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-9 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                />
                {fcSearchQuery && (
                  <button
                    onClick={() => setFcSearchQuery("")}
                    aria-label="Clear filter"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                  >
                    <svg className="w-2.5 h-2.5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {filteredFlowchartGroups.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10">No flowcharts match &ldquo;{fcSearchQuery}&rdquo;</p>
            ) : (
              Object.entries(fcGroupedByLetter).sort().map(([letter, groups]) => (
                <div key={letter}>
                  <div
                    ref={el => { fcSectionRefs.current[letter] = el; }}
                    style={{ scrollMarginTop: "108px" }}
                    className="px-5 pt-4 pb-1 flex items-center gap-2"
                  >
                    <span className="text-[10px] font-bold text-gray-300 tracking-widest">{letter}</span>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>
                  {groups.map(group => {
                    const groupLinks = FLOWCHART_LINKS.filter(fc => fc.gl === group.gl);
                    if (!groupLinks.length) return null;
                    const col = glColors(group.gl);
                    return (
                      <div key={group.gl} className="mb-4 px-5">
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
                          {group.gl === "GL861" && (
                            <button
                              onClick={() => setShowIOLPrioritizer(true)}
                              className="flex items-center gap-3 w-full px-4 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left border-t border-gray-50"
                            >
                              <div className={`w-1 h-8 rounded-full shrink-0 ${col.accent}`} />
                              <p className="flex-1 text-sm font-medium text-gray-900">IOL Priority List</p>
                              <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
            )}

          </div>

          <AlphabetSidebar
            activeLetters={fcActiveLetters}
            onSelect={letter => {
              fcSectionRefs.current[letter]?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          />
        </div>
      )}

      {/* Consent tab */}
      {activeTab === "consent" && (
        <ConsentPage
          key={consentNavKey}
          initialProcedure={activeConsentProcedure}
          onNavigate={handleNavigate}
        />
      )}

      {/* Calculator tab */}
      {activeTab === "calculator" && (
        <CalculatorPage
          key={calcNavKey}
          initialScenario={activeCalcScenario}
          onNavigate={handleNavigate}
        />
      )}

      {/* Rx tab */}
      {activeTab === "rx" && <RxPage />}

      {/* Guidelines tab */}
      {activeTab === "guidelines" && (
        <div className="min-h-screen pb-24">
          <div className="max-w-lg mx-auto">
            <div className="px-5 pt-14 pb-1">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Guidelines</h2>
              <p className="text-xs text-gray-400 mt-0.5">National and local guidelines</p>
            </div>

            {/* Sticky: source filter + search */}
            <div className="sticky top-0 z-20 bg-white border-b border-gray-100 pl-4 pr-12 pt-3 pb-3">
              <div className="flex gap-1.5 mb-2.5">
                {["ALL", "RBH", "RCOG", "NICE"].map(src => (
                  <button
                    key={src}
                    onClick={() => setGlSourceFilter(src)}
                    aria-pressed={glSourceFilter === src}
                    className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                      glSourceFilter === src ? "bg-black text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {src}
                  </button>
                ))}
              </div>
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Filter guidelines…"
                  value={glSearchQuery}
                  onChange={e => setGlSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-9 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                />
                {glSearchQuery && (
                  <button
                    onClick={() => setGlSearchQuery("")}
                    aria-label="Clear filter"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                  >
                    <svg className="w-2.5 h-2.5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div className="px-5 pt-3">
              {filteredGuidelines.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-10">No guidelines match &ldquo;{glSearchQuery}&rdquo;</p>
              ) : (
                <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm">
                  {Object.entries(glGroupedByLetter).sort().map(([letter, items]) => (
                    <div key={letter}>
                      <div
                        ref={el => { glSectionRefs.current[letter] = el; }}
                        style={{ scrollMarginTop: "108px" }}
                        className="px-4 py-1.5 bg-gray-50 border-b border-gray-100"
                      >
                        <span className="text-[10px] font-bold text-gray-400 tracking-widest">{letter}</span>
                      </div>
                      {items.map((gl, i) => {
                        const col = glColors(gl.code);
                        const canRead = READER_AVAILABLE.has(gl.code);
                        const El = canRead ? "button" : gl.pdf ? "a" : "div";
                        const elProps = canRead
                          ? { onClick: () => setActiveGuidelineGl(gl.code) }
                          : gl.pdf
                          ? { href: gl.pdfUrl || gl.pdfPath || `/guidelines/${gl.code}.pdf`, target: "_blank", rel: "noopener noreferrer" }
                          : {};
                        return (
                          <El
                            key={gl.code}
                            {...elProps}
                            className={`flex items-center gap-3 px-4 py-4 min-h-[80px] w-full text-left ${canRead || gl.pdf ? "hover:bg-gray-50 active:bg-gray-100 transition-colors" : ""} ${i > 0 ? "border-t border-gray-50" : ""}`}
                          >
                            <div className={`w-1 h-10 rounded-full shrink-0 ${col.accent}`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 leading-snug">{gl.label}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{gl.code} · {gl.version} · {gl.date}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {gl.pdf && (
                                <a
                                  href={gl.pdfUrl || gl.pdfPath || `/guidelines/${gl.code}.pdf`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={e => e.stopPropagation()}
                                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors text-xs font-medium text-gray-600"
                                >
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                  PDF
                                </a>
                              )}
                              {canRead && (
                                <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                              )}
                            </div>
                          </El>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <AlphabetSidebar
            activeLetters={glActiveLetters}
            onSelect={letter => {
              glSectionRefs.current[letter]?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          />
        </div>
      )}

      {/* Tab bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-gray-100"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="flex max-w-lg mx-auto">
          {[
            { id: "search",     label: "Search",  icon: <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" /> },
            { id: "guidelines", label: "Guides",  icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> },
            { id: "flowcharts", label: "Flow",    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l8.5 5v10L12 22 3.5 17V7L12 2z" /> },
            { id: "consent",    label: "Consent", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /> },
            { id: "calculator", label: "Calc",    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m-6 5h6m-6 5h6M5 5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" /> },
            { id: "rx",         label: "Rx",      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              aria-pressed={activeTab === tab.id}
              className={`flex-1 flex flex-col items-center gap-0.5 py-3 transition-colors ${
                activeTab === tab.id ? "text-black" : "text-gray-400"
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                {tab.icon}
              </svg>
              <span className={`text-xs ${activeTab === tab.id ? "font-semibold" : "font-medium"}`}>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
