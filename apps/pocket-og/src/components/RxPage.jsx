import { useState } from "react";
import { ANTIHYPERTENSIVES } from "../data/rx/antihypertensives";

const ROUTE_FILTERS = ["All", "Oral", "IV"];

function RouteTag({ label }) {
  const isIV = label.toLowerCase().includes("iv") || label.toLowerCase().includes("infus") || label.toLowerCase().includes("bolus");
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${
      isIV ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
    }`}>
      {isIV ? "IV" : "Oral"}
    </span>
  );
}

function DrugCard({ drug }) {
  const [open, setOpen] = useState(false);

  const allMaxDoses = drug.routes.map(r => r.maxDose);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      {/* Header row — always visible */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left px-4 py-4 flex items-start gap-3 hover:bg-gray-50 active:bg-gray-100 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-gray-900">{drug.name}</span>
            <span className="text-xs text-gray-400 font-medium">{drug.class}</span>
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {drug.routes.map((r, i) => (
              <RouteTag key={i} label={r.label} />
            ))}
          </div>
          {/* Max doses — quick glance */}
          <div className="mt-2 space-y-0.5">
            {drug.routes.map((r, i) => (
              <p key={i} className="text-xs text-gray-500 leading-snug">
                <span className="text-gray-400">{r.label}: </span>
                <span className="font-semibold text-gray-700">max {r.maxDose}</span>
              </p>
            ))}
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 shrink-0 mt-0.5 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded detail */}
      {open && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-4">

          {/* Routes */}
          {drug.routes.map((r, i) => (
            <div key={i} className="rounded-xl bg-gray-50 px-3 py-3">
              <div className="flex items-center gap-2 mb-2">
                <RouteTag label={r.label} />
                <span className="text-xs font-semibold text-gray-700">{r.label}</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mb-2">
                <div>
                  <p className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">Dose</p>
                  <p className="text-gray-800 font-medium">{r.dose}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">Frequency</p>
                  <p className="text-gray-800 font-medium">{r.frequency}</p>
                </div>
                <div className="col-span-2 mt-1">
                  <p className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">Max dose</p>
                  <p className="text-red-600 font-bold">{r.maxDose}</p>
                </div>
              </div>
              {r.notes && (
                <p className="text-xs text-gray-500 leading-relaxed border-t border-gray-200 pt-2 mt-1">{r.notes}</p>
              )}
            </div>
          ))}

          {/* Contraindications */}
          {drug.contraindications?.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-red-500 mb-1.5">Contraindications</p>
              <ul className="space-y-1">
                {drug.contraindications.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                    <span className="text-red-400 mt-0.5 shrink-0">✕</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Cautions */}
          {drug.cautions?.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-amber-500 mb-1.5">Cautions</p>
              <ul className="space-y-1">
                {drug.cautions.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                    <span className="text-amber-400 mt-0.5 shrink-0">!</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Pregnancy safety note */}
          {drug.pregnancySafety && (
            <div className="rounded-xl bg-emerald-50 px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-wider font-bold text-emerald-600 mb-1">Pregnancy safety</p>
              <p className="text-xs text-emerald-800 leading-relaxed">{drug.pregnancySafety}</p>
            </div>
          )}

          {/* Source */}
          {drug.source && (
            <p className="text-[10px] text-gray-400 pt-1">Source: {drug.source.label}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function RxPage() {
  const [routeFilter, setRouteFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = ANTIHYPERTENSIVES.filter(drug => {
    const q = searchQuery.toLowerCase().trim();
    if (q && !drug.name.toLowerCase().includes(q) && !drug.class.toLowerCase().includes(q)) return false;
    if (routeFilter === "Oral") {
      return drug.routes.some(r => !r.label.toLowerCase().includes("iv") && !r.label.toLowerCase().includes("infus") && !r.label.toLowerCase().includes("bolus"));
    }
    if (routeFilter === "IV") {
      return drug.routes.some(r => r.label.toLowerCase().includes("iv") || r.label.toLowerCase().includes("infus") || r.label.toLowerCase().includes("bolus"));
    }
    return true;
  });

  return (
    <div className="min-h-screen pb-28">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="px-5 pt-14 pb-1">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Drug Reference</h2>
          <p className="text-xs text-gray-400 mt-0.5">Quick dose lookup — obstetric use</p>
        </div>

        {/* Category chips */}
        <div className="px-5 pt-3 pb-1">
          <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-2">Category</p>
          <div className="flex gap-2">
            <button className="px-4 py-1.5 rounded-full text-xs font-semibold bg-black text-white">
              Antihypertensives
            </button>
            <button className="px-4 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-400 cursor-default" disabled>
              Antibiotics (coming soon)
            </button>
          </div>
        </div>

        {/* Sticky filter bar */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-5 pt-3 pb-3">
          {/* Search */}
          <div className="relative mb-2.5">
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
          {/* Route filter pills */}
          <div className="flex gap-1.5">
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
        </div>

        {/* Drug cards */}
        <div className="px-5 pt-4 space-y-3">
          {filtered.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">No drugs match your filter</p>
          ) : (
            filtered.map(drug => <DrugCard key={drug.id} drug={drug} />)
          )}
        </div>

        <p className="text-[10px] text-gray-400 text-center px-5 pt-6 pb-2 leading-relaxed">
          Doses are for guidance only. Always verify against current BNF, local guidelines, and individual patient factors. Not a substitute for clinical judgement.
        </p>

      </div>
    </div>
  );
}
