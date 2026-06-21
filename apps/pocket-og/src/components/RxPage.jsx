import { useState, useRef, useMemo } from "react";
import { ANTIHYPERTENSIVES } from "../data/rx/antihypertensives";
import AlphabetSidebar from "./AlphabetSidebar";

const SEP = "rgba(60,60,67,0.18)";
const LABEL = "#1C1C1E";
const SECONDARY = "#8E8E93";
const GROUPED_BG = "#F2F2F7";
const IOS_BLUE = "#007AFF";
const IOS_RED = "#FF3B30";
const IOS_ORANGE = "#FF9500";
const IOS_GREEN = "#34C759";

function DrugIcon({ drug }) {
  return (
    <div
      className="w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0"
      style={{ background: drug.iconColor }}
    >
      <span className="text-white text-[18px] font-semibold select-none">{drug.name[0]}</span>
    </div>
  );
}

function SectionHeader({ children }) {
  return (
    <p className="px-4 pt-8 pb-1.5 text-[13px] font-semibold uppercase tracking-wider" style={{ color: SECONDARY }}>
      {children}
    </p>
  );
}

function Card({ children }) {
  return (
    <div
      className="mx-4 bg-white rounded-2xl overflow-hidden"
      style={{ boxShadow: `0 0 0 0.5px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.05)` }}
    >
      {children}
    </div>
  );
}

function DataRow({ label, value, valueColor, border = true }) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3.5 ${border ? "border-b" : ""}`}
      style={{ borderColor: SEP }}
    >
      <span className="text-[15px] flex-1" style={{ color: LABEL }}>{label}</span>
      <span className="text-[15px] font-medium text-right max-w-[55%] leading-snug" style={{ color: valueColor ?? SECONDARY }}>
        {value}
      </span>
    </div>
  );
}

function BulletRow({ color, symbol, text, border = true }) {
  return (
    <div
      className={`flex items-start gap-3 px-4 py-3.5 ${border ? "border-b" : ""}`}
      style={{ borderColor: SEP }}
    >
      <div
        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-px"
        style={{ background: color }}
      >
        <span className="text-white text-[10px] font-bold leading-none">{symbol}</span>
      </div>
      <span className="text-[15px] flex-1 leading-snug" style={{ color: LABEL }}>{text}</span>
    </div>
  );
}

function LinkRow({ label, href, border = true }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-3 px-4 py-3.5 active:bg-gray-50 ${border ? "border-b" : ""}`}
      style={{ borderColor: SEP }}
    >
      <span className="text-[15px] flex-1" style={{ color: IOS_BLUE }}>{label}</span>
      <svg className="w-3.5 h-3.5 shrink-0" style={{ color: "#C7C7CC" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  );
}

function DrugDetailView({ drug, onBack }) {
  return (
    <div className="min-h-screen pb-28" style={{ background: GROUPED_BG }}>

      {/* iOS nav bar */}
      <div
        className="sticky top-0 z-20 border-b backdrop-blur-md"
        style={{ background: "rgba(242,242,247,0.92)", borderColor: SEP }}
      >
        <div className="flex items-center px-2 py-2.5">
          <button
            onClick={onBack}
            className="flex items-center gap-0.5 px-2 py-1 rounded-lg active:bg-black/5 transition-colors"
            style={{ color: IOS_BLUE }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-[17px]">Drugs</span>
          </button>
        </div>
      </div>

      {/* Large title + icon */}
      <div className="px-4 pt-5 pb-1 flex items-center gap-4">
        <DrugIcon drug={drug} />
        <div>
          <h1 className="text-[28px] font-bold tracking-tight leading-tight" style={{ color: LABEL }}>
            {drug.name}
          </h1>
          <p className="text-[15px]" style={{ color: SECONDARY }}>{drug.class}</p>
        </div>
      </div>

      {/* Routes */}
      {drug.routes.map((r, ri) => (
        <div key={ri}>
          <SectionHeader>{r.label}</SectionHeader>
          <Card>
            <DataRow label="Dose" value={r.dose} />
            <DataRow label="Frequency" value={r.frequency} />
            <DataRow label="Max dose" value={r.maxDose} valueColor={IOS_RED} border={!!r.notes} />
            {r.notes && (
              <div className="px-4 py-3">
                <p className="text-[13px] leading-relaxed" style={{ color: SECONDARY }}>{r.notes}</p>
              </div>
            )}
          </Card>
        </div>
      ))}

      {/* Contraindications */}
      {drug.contraindications?.length > 0 && (
        <>
          <SectionHeader>Contraindications</SectionHeader>
          <Card>
            {drug.contraindications.map((c, i) => (
              <BulletRow key={i} color={IOS_RED} symbol="✕" text={c} border={i < drug.contraindications.length - 1} />
            ))}
          </Card>
        </>
      )}

      {/* Cautions */}
      {drug.cautions?.length > 0 && (
        <>
          <SectionHeader>Cautions</SectionHeader>
          <Card>
            {drug.cautions.map((c, i) => (
              <BulletRow key={i} color={IOS_ORANGE} symbol="!" text={c} border={i < drug.cautions.length - 1} />
            ))}
          </Card>
        </>
      )}

      {/* Pregnancy safety */}
      {drug.pregnancySafety && (
        <>
          <SectionHeader>Pregnancy Safety</SectionHeader>
          <Card>
            <BulletRow color={IOS_GREEN} symbol="✓" text={drug.pregnancySafety} border={false} />
          </Card>
        </>
      )}

      {/* References */}
      {drug.sources?.length > 0 && (
        <>
          <SectionHeader>References</SectionHeader>
          <Card>
            {drug.sources.map((s, i) => (
              <LinkRow key={i} label={s.label} href={s.href} border={i < drug.sources.length - 1} />
            ))}
          </Card>
        </>
      )}

      <p className="text-center px-8 pt-8 pb-2 text-[12px] leading-relaxed" style={{ color: SECONDARY }}>
        For guidance only. Always verify against current BNF and local protocols. Not a substitute for clinical judgement.
      </p>
    </div>
  );
}

export default function RxPage() {
  const [selectedDrug, setSelectedDrug] = useState(null);
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

  if (selectedDrug) {
    return <DrugDetailView drug={selectedDrug} onBack={() => setSelectedDrug(null)} />;
  }

  return (
    <div className="min-h-screen pb-28" style={{ background: GROUPED_BG }}>

      {/* Large title */}
      <div className="px-4 pt-14 pb-3">
        <h1 className="text-[34px] font-bold tracking-tight" style={{ color: LABEL }}>Drugs</h1>
      </div>

      {/* iOS segmented control */}
      <div className="mx-4 mb-3 rounded-[11px] p-1 flex" style={{ background: "#E5E5EA" }}>
        {["All", "Oral", "IV"].map(f => (
          <button
            key={f}
            onClick={() => setRouteFilter(f)}
            className="flex-1 py-1.5 rounded-[9px] text-[13px] font-semibold transition-all"
            style={{
              color: routeFilter === f ? LABEL : SECONDARY,
              background: routeFilter === f ? "#FFFFFF" : "transparent",
              boxShadow: routeFilter === f ? "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)" : "none",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* iOS search bar */}
      <div className="mx-4 mb-4">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ background: "rgba(118,118,128,0.12)" }}
        >
          <svg className="w-4 h-4 shrink-0" style={{ color: SECONDARY }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-[17px] outline-none"
            style={{ color: LABEL }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="shrink-0">
              <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: SECONDARY }}>
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Drug list */}
      {filtered.length === 0 ? (
        <p className="text-center py-12 text-[15px]" style={{ color: SECONDARY }}>
          No results for &ldquo;{searchQuery}&rdquo;
        </p>
      ) : (
        Object.entries(groupedByLetter).sort().map(([letter, drugs]) => (
          <div key={letter}>
            <div
              ref={el => { sectionRefs.current[letter] = el; }}
              style={{ scrollMarginTop: "60px" }}
              className="px-4 pt-7 pb-1.5"
            >
              <span className="text-[13px] font-semibold uppercase tracking-wider" style={{ color: SECONDARY }}>
                {letter}
              </span>
            </div>

            <div
              className="mx-4 bg-white rounded-2xl overflow-hidden"
              style={{ boxShadow: "0 0 0 0.5px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.05)" }}
            >
              {drugs.map((drug, i) => {
                const hasOral = drug.routes.some(r => r.type === "oral");
                const hasIV = drug.routes.some(r => r.type === "iv");
                return (
                  <button
                    key={drug.id}
                    onClick={() => setSelectedDrug(drug)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left active:bg-gray-50 transition-colors ${i < drugs.length - 1 ? "border-b" : ""}`}
                    style={{ borderColor: SEP }}
                  >
                    <DrugIcon drug={drug} />
                    <div className="flex-1 min-w-0 py-0.5">
                      <p className="text-[17px] font-medium leading-snug" style={{ color: LABEL }}>
                        {drug.name}
                      </p>
                      <p className="text-[13px] leading-snug mt-0.5" style={{ color: SECONDARY }}>
                        {drug.class}
                      </p>
                      <div className="flex gap-2.5 mt-1">
                        {hasOral && (
                          <span className="text-[11px] font-semibold" style={{ color: IOS_GREEN }}>Oral</span>
                        )}
                        {hasIV && (
                          <span className="text-[11px] font-semibold" style={{ color: IOS_ORANGE }}>IV</span>
                        )}
                      </div>
                    </div>
                    <svg className="w-4 h-4 shrink-0" style={{ color: "#C7C7CC" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                );
              })}
            </div>
          </div>
        ))
      )}

      <div className="h-6" />

      <AlphabetSidebar
        activeLetters={activeLetters}
        onSelect={letter => {
          sectionRefs.current[letter]?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
      />
    </div>
  );
}
