import { useState } from "react";
import {
  CONSENT_PROCEDURES,
  FREQ,
  OVD_MATERNAL_RISKS,
  OVD_FETAL_RISKS,
  PLANNED_CS_COMPARISON,
  PLACENTA_PRAEVIA_CS_RISKS,
} from "../data/consent";

function FreqBadge({ freqKey }) {
  const f = FREQ[freqKey];
  if (!f) return null;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${f.bg} ${f.text} ${f.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${f.dot}`} />
      {f.short}
    </span>
  );
}

function SourceBadge({ source, year }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-gray-100 text-gray-500 border border-gray-200 uppercase tracking-wide">
      {source} {year}
    </span>
  );
}

function RiskRow({ risk, instrument }) {
  const data = risk.byInstrument?.[instrument];
  if (!data) return null;
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 leading-snug">{risk.name}</p>
        {risk.note && <p className="text-xs text-gray-400 mt-0.5 leading-snug">{risk.note}</p>}
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <FreqBadge freqKey={data.freq} />
        {data.rate && <span className="text-[11px] text-gray-500 font-mono">{data.rate}</span>}
      </div>
    </div>
  );
}

function OVDPanel() {
  const [instrument, setInstrument] = useState("ventouse");

  return (
    <div className="space-y-5">
      {/* Instrument toggle */}
      <div className="flex gap-2">
        {["ventouse", "forceps"].map(inst => (
          <button
            key={inst}
            onClick={() => setInstrument(inst)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              instrument === inst
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {inst === "ventouse" ? "Ventouse" : "Forceps"}
          </button>
        ))}
      </div>

      {/* Maternal risks */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Maternal risks</p>
        <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm divide-y divide-gray-50">
          {OVD_MATERNAL_RISKS.map(r => (
            <RiskRow key={r.id} risk={r} instrument={instrument} />
          ))}
        </div>
      </div>

      {/* Fetal risks */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Fetal / neonatal risks</p>
        <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm divide-y divide-gray-50">
          {OVD_FETAL_RISKS.map(r => (
            <RiskRow key={r.id} risk={r} instrument={instrument} />
          ))}
        </div>
      </div>

      {/* Frequency key */}
      <FreqKey />

      <SourceNote source="RCOG Consent Advice No. 11" year="2010" />
    </div>
  );
}

function PlannedCSPanel() {
  return (
    <div className="space-y-5">
      {/* Column header */}
      <div className="rounded-xl bg-gray-50 border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto] gap-2 px-4 py-2.5 border-b border-gray-100 bg-gray-100">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Outcome</span>
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wide w-24 text-center">CS</span>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide w-24 text-center">Vaginal</span>
        </div>
        {PLANNED_CS_COMPARISON.map(section => (
          <div key={section.section}>
            <div className="px-4 py-1.5 bg-gray-50 border-b border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{section.section}</p>
            </div>
            {section.rows.map((row, i) => (
              <div
                key={row.id}
                className={`grid grid-cols-[1fr_auto_auto] gap-2 px-4 py-3 items-start bg-white ${i < section.rows.length - 1 ? "border-b border-gray-50" : ""}`}
              >
                <p className="text-sm font-medium text-gray-900 leading-snug">{row.name}</p>
                <div className="w-24 text-center">
                  <p className={`text-[11px] font-semibold leading-snug ${row.cs_higher ? "text-rose-600" : "text-teal-600"}`}>
                    {row.cs.rate}
                  </p>
                  {row.cs.note && <p className="text-[9px] text-gray-400 mt-0.5">{row.cs.note}</p>}
                </div>
                <div className="w-24 text-center">
                  <p className={`text-[11px] font-semibold leading-snug ${row.cs_higher ? "text-teal-600" : "text-rose-600"}`}>
                    {row.vaginal.rate}
                  </p>
                  {row.vaginal.note && <p className="text-[9px] text-gray-400 mt-0.5">{row.vaginal.note}</p>}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <SourceNote source="NICE NG192 Caesarean Birth, Appendix A" year="2021" />
    </div>
  );
}

function PlacentaPraeviaCSPanel() {
  return (
    <div className="space-y-5">
      {PLACENTA_PRAEVIA_CS_RISKS.map(section => (
        <div key={section.section}>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{section.section}</p>
          <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm divide-y divide-gray-50">
            {section.risks.map(r => (
              <div key={r.id} className="flex items-start gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 leading-snug">{r.name}</p>
                  {r.note && <p className="text-xs text-gray-400 mt-0.5 leading-snug">{r.note}</p>}
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <FreqBadge freqKey={r.freq} />
                  {r.rate && <span className="text-[11px] text-gray-500 font-mono">{r.rate}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <FreqKey />
      <SourceNote source="RCOG Consent Advice No. 12" year="2010" />
    </div>
  );
}

function FreqKey() {
  return (
    <div className="rounded-xl bg-gray-50 border border-gray-100 p-3.5">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">RCOG frequency scale</p>
      <div className="space-y-1.5">
        {Object.entries(FREQ).map(([key, f]) => (
          <div key={key} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full shrink-0 ${f.dot}`} />
              <span className={`text-xs font-semibold ${f.text}`}>{f.label}</span>
            </div>
            <span className="text-[10px] text-gray-400">
              {key === "VERY_COMMON" && "1 in 1–10"}
              {key === "COMMON"      && "1 in 10–100"}
              {key === "UNCOMMON"    && "1 in 100–1,000"}
              {key === "RARE"        && "1 in 1,000–10,000"}
              {key === "VERY_RARE"   && "< 1 in 10,000"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SourceNote({ source, year }) {
  return (
    <div className="text-center pb-2">
      <p className="text-[10px] text-gray-400">
        Content verbatim from <span className="font-semibold text-gray-500">{source}</span> ({year})
      </p>
      <p className="text-[10px] text-gray-300 mt-0.5">Not a substitute for clinical judgement</p>
    </div>
  );
}

export default function ConsentPage() {
  const [selectedId, setSelectedId] = useState(null);
  const selected = CONSENT_PROCEDURES.find(p => p.id === selectedId);

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="px-5 pt-16 pb-4">
          {selected ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedId(null)}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors shrink-0"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-gray-900 leading-tight">{selected.title}</h2>
                <p className="text-xs text-gray-400 mt-0.5">{selected.subtitle}</p>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Consent</h2>
              <p className="text-sm text-gray-400 mt-1">Procedure risks — verbatim from RCOG & NICE</p>
            </>
          )}
        </div>

        {/* Procedure picker */}
        {!selected && (
          <div className="px-5 space-y-3">
            {CONSENT_PROCEDURES.map(proc => (
              <button
                key={proc.id}
                onClick={() => setSelectedId(proc.id)}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl border text-left transition-all active:scale-[0.99] ${proc.color.bg} ${proc.color.border} hover:brightness-95`}
              >
                <div className={`w-1 h-10 rounded-full shrink-0 ${proc.color.accent}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold leading-snug ${proc.color.text}`}>{proc.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{proc.subtitle}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <SourceBadge source={proc.source} year={proc.sourceYear} />
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}

            <div className="pt-2 pb-4 text-center">
              <p className="text-[10px] text-gray-300">Montgomery (2015) standard — all risks a reasonable patient would want to know</p>
            </div>
          </div>
        )}

        {/* Selected procedure content */}
        {selected && (
          <div className="px-5">
            <div className="mb-4">
              <SourceBadge source={selected.source} year={selected.sourceYear} />
            </div>
            {selected.id === "OVD"               && <OVDPanel />}
            {selected.id === "PLANNED_CS"         && <PlannedCSPanel />}
            {selected.id === "PLACENTA_PRAEVIA_CS" && <PlacentaPraeviaCSPanel />}
          </div>
        )}

      </div>
    </div>
  );
}
