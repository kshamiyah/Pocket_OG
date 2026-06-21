import { useState, useRef, useMemo } from "react";
import { ANTIHYPERTENSIVES } from "../data/rx/antihypertensives";
import AlphabetSidebar from "./AlphabetSidebar";

const ROUTE_FILTERS = ["All", "Oral", "IV"];

const DRUG_COLORS = {
  blue:   { accent: "bg-blue-500",   badge: "bg-blue-100 text-blue-700" },
  purple: { accent: "bg-purple-500", badge: "bg-purple-100 text-purple-700" },
  amber:  { accent: "bg-amber-500",  badge: "bg-amber-100 text-amber-700" },
  orange: { accent: "bg-orange-500", badge: "bg-orange-100 text-orange-700" },
  teal:   { accent: "bg-teal-500",   badge: "bg-teal-100 text-teal-700" },
};

function RouteTypeBadge({ type }) {
  return type === "iv"
    ? <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider bg-amber-100 text-amber-700">IV</span>
    : <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider bg-emerald-100 text-emerald-700">Oral</span>;
}

function DrugCard({ drug }) {
  const [open, setOpen] = useState(false);
  const col = DRUG_COLORS[drug.color] ?? DRUG_COLORS.blue;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      {/* Collapsed header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left flex items-stretch gap-0 hover:bg-gray-50 active:bg-gray-100 transition-colors"
      >
        {/* Accent bar */}
        <div className={`w-1 shrink-0 ${col.accent}`} />

        <div className="flex-1 min-w-0 px-4 py-3.5">
          {/* Name + class */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900">{drug.name}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{drug.class}</p>
            </div>
            <svg
              className={`w-4 h-4 text-gray-400 shrink-0 mt-0.5 transition-transform ${open ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Route summary rows */}
          <div className="mt-2.5 space-y-1.5">
            {drug.routes.map((r, i) => (
              <div key={i} className="flex items-center gap-2">
                <RouteTypeBadge type={r.type} />
                <span className="text-[11px] text-gray-500 truncate">{r.shortLabel}</span>
                <span className="ml-auto text-[11px] font-bold text-gray-800 shrink-0">max {r.maxDose}</span>
              </div>
            ))}
          </div>
        </div>
      </button>

      {/* Expanded detail */}
      {open && (
        <div className="border-t border-gray-100">
          {/* Route detail cards */}
          <div className="px-4 pt-3 pb-1 space-y-2">
            {drug.routes.map((r, i) => (
              <div key={i} className="rounded-xl border border-gray-100 overflow-hidden">
                {/* Route header */}
                <div className="px-3 py-2 bg-gray-50 flex items-center gap-2">
                  <RouteTypeBadge type={r.type} />
                  <span className="text-xs font-semibold text-gray-700">{r.label}</span>
                </div>
                {/* Route body */}
                <div className="px-3 py-2.5 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest font-bold text-gray-400 mb-0.5">Dose</p>
                    <p className="text-gray-800 font-medium">{r.dose}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest font-bold text-gray-400 mb-0.5">Frequency</p>
                    <p className="text-gray-800 font-medium">{r.frequency}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[9px] uppercase tracking-widest font-bold text-red-400 mb-0.5">Max dose</p>
                    <p className="text-red-600 font-bold">{r.maxDose}</p>
                  </div>
                </div>
                {r.notes && (
                  <p className="px-3 pb-2.5 text-[11px] text-gray-500 leading-relaxed border-t border-gray-100">
                    {r.notes}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Contraindications */}
          {drug.contraindications?.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-50">
              <p className="text-[9px] uppercase tracking-widest font-bold text-red-500 mb-2">Contraindications</p>
              <ul className="space-y-1.5">
                {drug.contraindications.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                    <span className="text-red-400 font-bold shrink-0 mt-px">✕</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Cautions */}
          {drug.cautions?.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-50">
              <p className="text-[9px] uppercase tracking-widest font-bold text-amber-500 mb-2">Cautions</p>
              <ul className="space-y-1.5">
                {drug.cautions.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                    <span className="text-amber-500 font-bold shrink-0 mt-px">!</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Pregnancy safety */}
          {drug.pregnancySafety && (
            <div className="mx-4 mb-3 mt-1 rounded-xl bg-emerald-50 px-3 py-2.5 border-t border-gray-50">
              <p className="text-[9px] uppercase tracking-widest font-bold text-emerald-600 mb-1">Pregnancy safety</p>
              <p className="text-xs text-emerald-800 leading-relaxed">{drug.pregnancySafety}</p>
            </div>
          )}

          {/* Sources / links */}
          {drug.sources?.length > 0 && (
            <div className="px-4 pb-4 flex flex-wrap gap-2 border-t border-gray-50 pt-3">
              {drug.sources.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors text-xs font-medium text-gray-700"
                >
                  <svg className="w-3 h-3 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  {s.label}
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function RxPage() {
  const [routeFilter, setRouteFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const sectionRefs = useRef({});

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return ANTIHYPERTENSIVES.filter(drug => {
      if (q && !drug.name.toLowerCase().includes(q) && !drug.class.toLowerCase().includes(q)) return false;
      if (routeFilter === "Oral") return drug.routes.some(r => r.type === "oral");
      if (routeFilter === "IV") return drug.routes.some(r => r.type === "iv");
      return true;
    });
  }, [routeFilter, searchQuery]);

  const groupedByLetter = useMemo(() => {
    const groups = {};
    filtered.forEach(drug => {
      const letter = drug.name[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(drug);
    });
    return groups;
  }, [filtered]);

  const activeLetters = useMemo(() => new Set(Object.keys(groupedByLetter)), [groupedByLetter]);

  return (
    <div className="min-h-screen pb-28">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="px-5 pt-14 pb-3">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Drug Reference</h2>
          <p className="text-xs text-gray-400 mt-0.5">Quick dose lookup — obstetric use</p>
        </div>

        {/* Category chips */}
        <div className="px-5 pb-1 flex gap-2 overflow-x-auto no-scrollbar">
          <button className="shrink-0 px-4 py-1.5 rounded-full text-xs font-bold bg-black text-white">
            Antihypertensives
          </button>
          <button disabled className="shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-400 cursor-default">
            Antibiotics
          </button>
          <button disabled className="shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-400 cursor-default">
            Anticoagulants
          </button>
        </div>

        {/* Sticky filter bar */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 pl-4 pr-12 pt-3 pb-3 mt-2">
          {/* Route filter */}
          <div className="flex gap-1.5 mb-2.5">
            {ROUTE_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setRouteFilter(f)}
                aria-pressed={routeFilter === f}
                className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                  routeFilter === f ? "bg-black text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search drugs…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-9 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                <svg className="w-2.5 h-2.5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Drug list */}
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-10">No drugs match your filter</p>
        ) : (
          Object.entries(groupedByLetter).sort().map(([letter, drugs]) => (
            <div key={letter}>
              {/* Letter divider */}
              <div
                ref={el => { sectionRefs.current[letter] = el; }}
                style={{ scrollMarginTop: "108px" }}
                className="px-5 pt-5 pb-2 flex items-center gap-2"
              >
                <span className="text-[10px] font-bold text-gray-300 tracking-widest">{letter}</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>
              {/* Drug cards */}
              <div className="px-5 space-y-3">
                {drugs.map(drug => <DrugCard key={drug.id} drug={drug} />)}
              </div>
            </div>
          ))
        )}

        <p className="text-[10px] text-gray-400 text-center px-5 pt-6 pb-2 leading-relaxed">
          For guidance only. Verify against current BNF and local protocols. Not a substitute for clinical judgement.
        </p>

      </div>

      <AlphabetSidebar
        activeLetters={activeLetters}
        onSelect={letter => {
          sectionRefs.current[letter]?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
      />
    </div>
  );
}
