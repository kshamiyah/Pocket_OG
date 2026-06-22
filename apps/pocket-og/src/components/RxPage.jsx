import { useState, useRef, useMemo } from "react";
import { ANTIHYPERTENSIVES } from "../data/rx/antihypertensives";
import { UTEROTONICS } from "../data/rx/uterotonics";
import { ANTIEMETICS } from "../data/rx/antiemetics";
import AlphabetSidebar from "./AlphabetSidebar";

const CATEGORIES = [
  { id: "antihypertensives", label: "Antihypertensives", drugs: ANTIHYPERTENSIVES },
  { id: "uterotonics",       label: "Uterotonics",       drugs: UTEROTONICS },
  { id: "antiemetics",       label: "Antiemetics",       drugs: ANTIEMETICS },
];

const ACCENT = {
  blue:   "bg-blue-500",
  purple: "bg-purple-500",
  amber:  "bg-amber-400",
  orange: "bg-orange-400",
  teal:   "bg-cyan-500",
  pink:   "bg-pink-500",
  green:  "bg-green-500",
  indigo: "bg-indigo-500",
  red:    "bg-red-500",
  rose:   "bg-rose-500",
  violet: "bg-violet-500",
};

const ROUTE_LABEL = { oral: "Oral", iv: "IV", im: "IM", sl: "SL", vag: "Vaginal", rectal: "Rectal" };
const ROUTE_COLOR = {
  oral:   "text-emerald-600",
  iv:     "text-amber-600",
  im:     "text-orange-500",
  sl:     "text-blue-600",
  vag:    "text-purple-600",
  rectal: "text-gray-500",
};

// ── Detail overlay ────────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 pt-6 pb-2">
      {children}
    </p>
  );
}

function DetailCard({ children }) {
  return (
    <div className="mx-4 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      {children}
    </div>
  );
}

function DataRow({ label, value, valueClass = "text-gray-900", border = true }) {
  return (
    <div className={`flex items-center gap-4 px-4 py-3 ${border ? "border-b border-gray-50" : ""}`}>
      <span className="text-sm text-gray-400 w-28 shrink-0">{label}</span>
      <span className={`text-sm font-semibold flex-1 leading-snug ${valueClass}`}>{value}</span>
    </div>
  );
}

function BulletRow({ colorClass, symbol, text, border = true }) {
  return (
    <div className={`flex items-start gap-3 px-4 py-3 ${border ? "border-b border-gray-50" : ""}`}>
      <span className={`text-xs font-bold mt-0.5 shrink-0 ${colorClass}`}>{symbol}</span>
      <span className="text-sm text-gray-700 leading-snug flex-1">{text}</span>
    </div>
  );
}

function DrugDetailView({ drug, onClose }) {
  const accent = ACCENT[drug.color] ?? "bg-gray-400";
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="flex-none px-4 pt-3 pb-3 flex items-center justify-between border-b border-gray-100 bg-white">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-2 h-9 rounded-full shrink-0 ${accent}`} />
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 leading-tight">{drug.name}</p>
            <p className="text-xs text-gray-400">{drug.class}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors shrink-0 ml-3"
        >
          <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-28 bg-gray-50">

        {/* Routes */}
        {drug.routes.map((r, ri) => (
          <div key={ri}>
            <SectionLabel>{r.label}</SectionLabel>
            <DetailCard>
              <DataRow label="Dose" value={r.dose} />
              <DataRow label="Frequency" value={r.frequency} />
              <DataRow label="Max dose" value={r.maxDose} valueClass="text-red-500 font-bold" border={!!r.notes} />
              {r.notes && (
                <p className="px-4 py-3 text-xs text-gray-400 leading-relaxed">{r.notes}</p>
              )}
            </DetailCard>
          </div>
        ))}

        {drug.contraindications?.length > 0 && (
          <>
            <SectionLabel>Contraindications</SectionLabel>
            <DetailCard>
              {drug.contraindications.map((c, i) => (
                <BulletRow key={i} colorClass="text-red-400" symbol="✕" text={c} border={i < drug.contraindications.length - 1} />
              ))}
            </DetailCard>
          </>
        )}

        {drug.cautions?.length > 0 && (
          <>
            <SectionLabel>Cautions</SectionLabel>
            <DetailCard>
              {drug.cautions.map((c, i) => (
                <BulletRow key={i} colorClass="text-amber-500" symbol="!" text={c} border={i < drug.cautions.length - 1} />
              ))}
            </DetailCard>
          </>
        )}

        {drug.pregnancySafety && (
          <>
            <SectionLabel>Pregnancy Safety</SectionLabel>
            <DetailCard>
              <BulletRow colorClass="text-emerald-500" symbol="✓" text={drug.pregnancySafety} border={false} />
            </DetailCard>
          </>
        )}

        {drug.sources?.length > 0 && (
          <>
            <SectionLabel>References</SectionLabel>
            <DetailCard>
              {drug.sources.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors ${i < drug.sources.length - 1 ? "border-b border-gray-50" : ""}`}
                >
                  <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span className="text-sm font-medium text-blue-600 flex-1">{s.label}</span>
                  <svg className="w-3.5 h-3.5 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              ))}
            </DetailCard>
          </>
        )}

        <p className="text-[10px] text-gray-400 text-center px-6 pt-6 pb-2 leading-relaxed">
          For guidance only. Always verify against current BNF and local protocols.
        </p>
      </div>
    </div>
  );
}

// ── List view ─────────────────────────────────────────────────────────────────

export default function RxPage() {
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [activeCategoryId, setActiveCategoryId] = useState("antihypertensives");
  const [routeFilter, setRouteFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const sectionRefs = useRef({});

  const activeCategory = CATEGORIES.find(c => c.id === activeCategoryId);

  const switchCategory = (id) => {
    setActiveCategoryId(id);
    setRouteFilter("All");
    setSearchQuery("");
    sectionRefs.current = {};
  };

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return activeCategory.drugs.filter(drug => {
      if (q && !drug.name.toLowerCase().includes(q) && !drug.class.toLowerCase().includes(q)) return false;
      if (routeFilter === "Oral") return drug.routes.some(r => r.type === "oral");
      if (routeFilter === "IV/IM") return drug.routes.some(r => r.type !== "oral");
      return true;
    });
  }, [activeCategory, routeFilter, searchQuery]);

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
    <>
      {selectedDrug && (
        <DrugDetailView drug={selectedDrug} onClose={() => setSelectedDrug(null)} />
      )}

      <div className="min-h-screen bg-white pb-28">
        <div className="max-w-lg mx-auto">

          {/* Header */}
          <div className="px-5 pt-14 pb-1">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Drug Reference</h2>
            <p className="text-xs text-gray-400 mt-0.5">Quick dose lookup — obstetric use</p>
          </div>

          {/* Category chips */}
          <div className="flex gap-2 overflow-x-auto px-4 pt-3 pb-1 no-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => switchCategory(cat.id)}
                aria-pressed={activeCategoryId === cat.id}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  activeCategoryId === cat.id ? "bg-black text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sticky filter bar */}
          <div className="sticky top-0 z-20 bg-white border-b border-gray-100 pl-4 pr-12 pt-3 pb-3">
            {/* Route pills */}
            <div className="flex gap-1.5 mb-2.5">
              {["All", "Oral", "IV/IM"].map(f => (
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
                placeholder={`Search ${activeCategory.label.toLowerCase()}…`}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-9 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear"
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
          <div className="px-5 pt-3">
            {filtered.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10">No drugs match &ldquo;{searchQuery}&rdquo;</p>
            ) : (
              Object.entries(groupedByLetter).sort().map(([letter, drugs]) => (
                <div key={letter}>
                  {/* Letter divider */}
                  <div
                    ref={el => { sectionRefs.current[letter] = el; }}
                    style={{ scrollMarginTop: "108px" }}
                    className="pt-4 pb-1 flex items-center gap-2"
                  >
                    <span className="text-[10px] font-bold text-gray-300 tracking-widest">{letter}</span>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>

                  {/* Drug card */}
                  <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm">
                    {drugs.map((drug, i) => {
                      const accent = ACCENT[drug.color] ?? "bg-gray-400";
                      const routeTypes = [...new Set(drug.routes.map(r => r.type))];
                      return (
                        <button
                          key={drug.id}
                          onClick={() => setSelectedDrug(drug)}
                          className={`flex items-center gap-3 w-full px-4 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left ${i > 0 ? "border-t border-gray-50" : ""}`}
                        >
                          <div className={`w-1 h-10 rounded-full shrink-0 ${accent}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 leading-snug">{drug.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{drug.class}</p>
                            <div className="flex gap-2 mt-1">
                              {routeTypes.map(rt => (
                                <span key={rt} className={`text-[10px] font-semibold ${ROUTE_COLOR[rt] ?? "text-gray-500"}`}>
                                  {ROUTE_LABEL[rt] ?? rt.toUpperCase()}
                                </span>
                              ))}
                            </div>
                          </div>
                          <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          <p className="text-[10px] text-gray-400 text-center px-5 pt-6 pb-2 leading-relaxed">
            For guidance only. Verify against current BNF and local protocols.
          </p>
        </div>

        <AlphabetSidebar
          activeLetters={activeLetters}
          onSelect={letter => {
            sectionRefs.current[letter]?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        />
      </div>
    </>
  );
}
