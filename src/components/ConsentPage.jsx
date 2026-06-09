import { useState } from "react";
import {
  CONSENT_PROCEDURES,
  FREQ,
  CS_CONTEXT_OPTIONS, CS_PATIENT_FACTORS, CS_RISK_SECTIONS,
  CS_COMPARISON_SECTIONS, CS_PP_RISK_SECTIONS, CS_FAQ, CS_PAGES,
  OVD_CONTEXT_OPTIONS, OVD_PATIENT_FACTORS, OVD_RISK_SECTIONS, OVD_FAQ, OVD_PAGES,
  IOL_CONTEXT_OPTIONS, IOL_PATIENT_FACTORS, IOL_RISK_SECTIONS, IOL_FAQ, IOL_PAGES,
  SURG_MISC_PATIENT_FACTORS, SURG_MISC_RISK_SECTIONS, SURG_MISC_FAQ, SURG_MISC_PAGES,
  MED_MISC_PATIENT_FACTORS, MED_MISC_RISK_SECTIONS, MED_MISC_FAQ, MED_MISC_PAGES,
  LAPAROSCOPY_PATIENT_FACTORS, LAPAROSCOPY_RISK_SECTIONS, LAPAROSCOPY_FAQ, LAPAROSCOPY_PAGES,
  HYSTEROSCOPY_CONTEXT_OPTIONS, HYSTEROSCOPY_PATIENT_FACTORS,
  HYSTEROSCOPY_RISK_SECTIONS, HYSTEROSCOPY_FAQ, HYSTEROSCOPY_PAGES,
  ACS_CONTEXT_OPTIONS, ACS_PATIENT_FACTORS,
  ACS_RISK_SECTIONS, ACS_BENEFITS, ACS_FAQ, ACS_PAGES,
  CERTAINTY,
} from "../data/consent";

// Central config lookup — avoids long chains of isCS/isOVD checks
const PROCEDURE_CONFIG = {
  CS: {
    contextOptions: CS_CONTEXT_OPTIONS,
    patientFactors: CS_PATIENT_FACTORS,
    getRiskSections: (_ctx, factors) =>
      factors.has("placenta_praevia") ? CS_PP_RISK_SECTIONS : CS_RISK_SECTIONS,
    comparisonSections: CS_COMPARISON_SECTIONS,
    getPages: (ctx) => CS_PAGES[ctx],
    faq: CS_FAQ,
    getInstrument: () => null,
    sourceLabel: "NICE NG192 · RCOG CA14",
  },
  OVD: {
    contextOptions: OVD_CONTEXT_OPTIONS,
    patientFactors: OVD_PATIENT_FACTORS,
    getRiskSections: () => OVD_RISK_SECTIONS,
    comparisonSections: null,
    getPages: (ctx) => OVD_PAGES[ctx],
    faq: OVD_FAQ,
    getInstrument: (ctx) => ctx,
    sourceLabel: "RCOG GTG26",
  },
  IOL: {
    contextOptions: IOL_CONTEXT_OPTIONS,
    patientFactors: IOL_PATIENT_FACTORS,
    getRiskSections: (_ctx, factors) =>
      IOL_RISK_SECTIONS.filter(s => !s.factorOnly || factors.has(s.factorOnly)),
    comparisonSections: null,
    getPages: (ctx) => IOL_PAGES[ctx],
    faq: IOL_FAQ,
    getInstrument: () => null,
    sourceLabel: "NICE NG207",
  },
  SURG_MISC: {
    contextOptions: null,
    patientFactors: SURG_MISC_PATIENT_FACTORS,
    getRiskSections: () => SURG_MISC_RISK_SECTIONS,
    comparisonSections: null,
    getPages: () => SURG_MISC_PAGES,
    faq: SURG_MISC_FAQ,
    getInstrument: () => null,
    sourceLabel: "RCOG CA10",
  },
  MED_MISC: {
    contextOptions: null,
    patientFactors: MED_MISC_PATIENT_FACTORS,
    getRiskSections: () => MED_MISC_RISK_SECTIONS,
    comparisonSections: null,
    getPages: () => MED_MISC_PAGES,
    faq: MED_MISC_FAQ,
    getInstrument: () => null,
    sourceLabel: "RCOG GTG25",
  },
  LAPAROSCOPY: {
    contextOptions: null,
    patientFactors: LAPAROSCOPY_PATIENT_FACTORS,
    getRiskSections: () => LAPAROSCOPY_RISK_SECTIONS,
    comparisonSections: null,
    getPages: () => LAPAROSCOPY_PAGES,
    faq: LAPAROSCOPY_FAQ,
    getInstrument: () => null,
    sourceLabel: "RCOG CA2",
  },
  HYSTEROSCOPY: {
    contextOptions: HYSTEROSCOPY_CONTEXT_OPTIONS,
    patientFactors: HYSTEROSCOPY_PATIENT_FACTORS,
    getRiskSections: () => HYSTEROSCOPY_RISK_SECTIONS,
    comparisonSections: null,
    getPages: (ctx) => HYSTEROSCOPY_PAGES[ctx],
    faq: HYSTEROSCOPY_FAQ,
    getInstrument: () => null,
    sourceLabel: "RCOG CA1 · GTG59",
  },
  ACS: {
    contextOptions: ACS_CONTEXT_OPTIONS,
    patientFactors: ACS_PATIENT_FACTORS,
    getRiskSections: (ctx) => ACS_RISK_SECTIONS[ctx] ?? [],
    getBenefits: (ctx) => ACS_BENEFITS[ctx] ?? [],
    comparisonSections: null,
    getPages: (ctx) => ACS_PAGES[ctx],
    faq: ACS_FAQ,
    getInstrument: () => null,
    sourceLabel: "RCOG GTG (Stock 2022)",
  },
};

// ─── shared small components ──────────────────────────────────────────────────

function FreqPill({ freqKey }) {
  const f = FREQ[freqKey];
  if (!f) return null;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${f.bg} ${f.text} ${f.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${f.dot}`} />
      {f.label}
    </span>
  );
}

function SourceTag({ source }) {
  return (
    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">{source}</span>
  );
}

// ─── Step 0: procedure list ───────────────────────────────────────────────────

function ProcedureList({ onSelect }) {
  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-lg mx-auto">
        <div className="px-5 pt-16 pb-6">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Consent</h2>
          <p className="text-sm text-gray-400 mt-1">Procedure risks — verbatim from RCOG & NICE</p>
        </div>

        <div className="px-5">
          <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm divide-y divide-gray-100">
            {[...CONSENT_PROCEDURES].sort((a, b) => a.title.localeCompare(b.title)).map(proc => (
              <button
                key={proc.id}
                onClick={() => onSelect(proc.id)}
                className="flex items-center gap-3 w-full px-4 py-4 min-h-[80px] hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
              >
                <div className={`w-1 h-10 rounded-full shrink-0 ${proc.color.accent}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 leading-snug">{proc.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{proc.subtypes}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide text-right leading-tight max-w-[110px]">{proc.source}</span>
                  <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>

          <p className="text-[10px] text-gray-300 text-center mt-6 px-4 leading-relaxed">
            Montgomery (2015) standard — all risks a reasonable patient would want to know.<br />
            Not a substitute for clinical judgement.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Step 1: context picker ───────────────────────────────────────────────────

function ContextPicker({ procedureId, onSelect, onBack }) {
  const proc = CONSENT_PROCEDURES.find(p => p.id === procedureId);
  const options = PROCEDURE_CONFIG[procedureId]?.contextOptions ?? [];

  return (
    <div className="min-h-screen flex flex-col pb-24">
      <div className="max-w-lg mx-auto w-full flex-1 flex flex-col">
        {/* Header */}
        <div className="px-5 pt-14 pb-2 flex items-center gap-3">
          <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors shrink-0">
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <p className="text-xs text-gray-400 font-medium">{proc?.title}</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-5 pb-10">
          <h3 className="text-2xl font-bold text-gray-900 mb-1">What is the situation?</h3>
          <p className="text-sm text-gray-400 mb-8">This changes which risks apply.</p>

          <div className="space-y-3">
            {options.map(opt => (
              <button
                key={opt.id}
                onClick={() => onSelect(opt.id)}
                className="w-full flex items-center gap-4 px-5 py-5 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 active:scale-[0.99] transition-all text-left shadow-sm"
              >
                <span className={`w-3 h-3 rounded-full shrink-0 ${opt.dot}`} />
                <div>
                  <p className={`text-base font-bold ${opt.color}`}>{opt.label}</p>
                  <p className="text-sm text-gray-400">{opt.description}</p>
                </div>
                <svg className="w-5 h-5 text-gray-300 ml-auto shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step 2: patient factors ──────────────────────────────────────────────────

function PatientFactors({ procedureId, context, factors, onToggle, onContinue, onBack }) {
  const proc = CONSENT_PROCEDURES.find(p => p.id === procedureId);
  const cfg = PROCEDURE_CONFIG[procedureId] ?? {};
  const allFactors = cfg.patientFactors ?? [];
  const contextOpt = cfg.contextOptions?.find(o => o.id === context);
  const contextLabel = contextOpt?.label ?? null;

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="px-5 pt-14 pb-4">
          <div className="flex items-center gap-3 mb-5">
            <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors shrink-0">
              <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <p className="text-xs text-gray-400">{proc?.title}{contextLabel ? <> · <span className="font-semibold text-gray-600">{contextLabel}</span></> : null}</p>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">Any of the following apply?</h3>
          <p className="text-sm text-gray-400">These modify which risks are shown.</p>
        </div>

        <div className="px-5 space-y-3">
          {allFactors.map(f => {
            const active = factors.has(f.id);
            return (
              <button
                key={f.id}
                onClick={() => onToggle(f.id)}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl border transition-all text-left ${
                  active
                    ? "bg-gray-900 border-gray-900 text-white"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  active ? "border-white bg-white" : "border-gray-300"
                }`}>
                  {active && <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />}
                </div>
                <span className="text-sm font-medium">{f.label}</span>
              </button>
            );
          })}
        </div>

        <div className="px-5 mt-8">
          <button
            onClick={onContinue}
            className="w-full py-4 rounded-2xl bg-gray-900 text-white text-sm font-bold hover:bg-gray-800 active:scale-[0.99] transition-all"
          >
            Show consent summary →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Step 3: consent summary ──────────────────────────────────────────────────

function _RiskRow_UNUSED({ risk, instrument, showIfConditions, activeFactors }) {
  const [expanded, setExpanded] = useState(false);

  // For condition-gated risks, only show if any condition active
  if (risk.conditions && risk.conditions.length > 0) {
    const anyActive = risk.conditions.some(c => activeFactors.has(c));
    if (!anyActive) return null;
  }

  const freqKey = instrument
    ? (typeof risk.freq === "object" ? risk.freq[instrument] : risk.freq)
    : risk.freq;

  let displayRate = instrument
    ? (typeof risk.rate === "object" ? risk.rate[instrument] : risk.rate)
    : risk.rate;

  let displayFreqKey = freqKey;
  let extraNote = null;

  // Apply modifiers for CS hysterectomy risk
  if (risk.modifiers) {
    if (activeFactors.has("placenta_praevia") && activeFactors.has("prev_cs_1") && risk.modifiers.placenta_praevia_prev_cs) {
      const m = risk.modifiers.placenta_praevia_prev_cs;
      displayRate = m.rate;
      displayFreqKey = m.freq;
      extraNote = m.note;
    } else if (activeFactors.has("placenta_praevia") && risk.modifiers.placenta_praevia) {
      const m = risk.modifiers.placenta_praevia;
      displayRate = m.rate;
      displayFreqKey = m.freq;
      extraNote = m.note;
    }
  }

  const f = FREQ[displayFreqKey];

  return (
    <div className={`border-b border-gray-50 last:border-0 ${expanded ? "bg-gray-50/50" : ""}`}>
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
      >
        <span className={`w-2 h-2 rounded-full shrink-0 mt-0.5 ${f?.dot ?? "bg-gray-200"}`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 leading-snug">{risk.name}</p>
          {extraNote && <p className="text-[10px] text-orange-600 font-semibold mt-0.5">{extraNote}</p>}
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
          {displayFreqKey && <FreqPill freqKey={displayFreqKey} />}
          {displayRate && <span className="text-[10px] text-gray-400 font-mono">{displayRate}</span>}
        </div>
        <svg className={`w-3.5 h-3.5 text-gray-300 shrink-0 ml-1 transition-transform ${expanded ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      {expanded && risk.plain && (
        <div className="px-4 pb-3 ml-5">
          <p className="text-sm text-gray-600 leading-relaxed">{risk.plain}</p>
          <p className="text-[9px] text-gray-300 mt-1.5 uppercase tracking-wide font-bold">{risk.source}</p>
        </div>
      )}
    </div>
  );
}

function RiskSection({ title, risks, instrument, activeFactors }) {
  const visibleCount = risks.filter(r => {
    if (!r.conditions || r.conditions.length === 0) return true;
    return r.conditions.some(c => activeFactors.has(c));
  }).length;

  if (visibleCount === 0) return null;

  return (
    <div className="mb-4">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">{title}</p>
      <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm">
        {risks.map(r => (
          <RiskRow key={r.id} risk={r} instrument={instrument} activeFactors={activeFactors} />
        ))}
      </div>
    </div>
  );
}

function AlternativesSection({ alternatives }) {
  const [checked, setChecked] = useState(new Set());
  const toggle = id => setChecked(prev => {
    const s = new Set(prev);
    s.has(id) ? s.delete(id) : s.add(id);
    return s;
  });

  return (
    <div className="mb-4">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Alternatives discussed</p>
      <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm divide-y divide-gray-50">
        {alternatives.map(alt => {
          const active = checked.has(alt.id);
          return (
            <button
              key={alt.id}
              onClick={() => toggle(alt.id)}
              className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                active ? "border-gray-900 bg-gray-900" : "border-gray-300"
              }`}>
                {active && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`text-sm ${active ? "text-gray-900 font-medium" : "text-gray-600"}`}>{alt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DocChecklist() {
  const items = [
    { id: "risks",       label: "Risks and benefits explained" },
    { id: "alts",        label: "Alternatives discussed" },
    { id: "questions",   label: "Patient questions answered" },
    { id: "time",        label: "Time given to consider" },
    { id: "interpreter", label: "Interpreter used" },
    { id: "form",        label: "Consent form signed" },
  ];
  const [checked, setChecked] = useState(new Set(["risks", "alts"]));
  const toggle = id => setChecked(prev => {
    const s = new Set(prev);
    s.has(id) ? s.delete(id) : s.add(id);
    return s;
  });

  return (
    <div className="mb-6">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Documentation checklist</p>
      <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm divide-y divide-gray-50">
        {items.map(item => {
          const active = checked.has(item.id);
          return (
            <button
              key={item.id}
              onClick={() => toggle(item.id)}
              className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            >
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                active ? "border-emerald-500 bg-emerald-500" : "border-gray-300"
              }`}>
                {active && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`text-sm ${active ? "text-gray-900 font-medium" : "text-gray-500"}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FAQSection({ faqs }) {
  const [openId, setOpenId] = useState(null);
  return (
    <div className="mb-4">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Common patient questions</p>
      <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm divide-y divide-gray-50">
        {faqs.map((item, i) => {
          const open = openId === i;
          return (
            <div key={i} className={open ? "bg-gray-50/60" : ""}>
              <button
                onClick={() => setOpenId(open ? null : i)}
                className="flex items-center gap-3 w-full px-4 py-3.5 text-left"
              >
                <span className="text-base leading-none text-gray-300 shrink-0">?</span>
                <p className="flex-1 text-sm font-medium text-gray-900">{item.q}</p>
                <svg className={`w-3.5 h-3.5 text-gray-300 shrink-0 transition-transform ${open ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              {open && (
                <div className="px-4 pb-4 ml-7">
                  <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FreqKey() {
  return (
    <div className="rounded-xl bg-gray-50 border border-gray-100 p-3.5 mb-4">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">RCOG frequency scale</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        {Object.entries(FREQ).map(([key, f]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full shrink-0 ${f.dot}`} />
            <span className={`text-[10px] font-semibold ${f.text}`}>{f.label}</span>
            <span className="text-[9px] text-gray-300 ml-auto">
              {key === "VERY_COMMON" && "1/1–10"}
              {key === "COMMON"      && "1/10–100"}
              {key === "UNCOMMON"    && "1/100–1k"}
              {key === "RARE"        && "1/1k–10k"}
              {key === "VERY_RARE"   && "<1/10k"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const CONSENT_TABS_BASE = [
  { id: "what",    label: "What" },
  { id: "why",     label: "Why" },
  { id: "risks",   label: "Risks" },
  { id: "decline", label: "Decline" },
  { id: "faq",     label: "FAQ" },
];

function buildTabs(hasBenefits) {
  if (!hasBenefits) return CONSENT_TABS_BASE;
  const idx = CONSENT_TABS_BASE.findIndex(t => t.id === "risks");
  return [
    ...CONSENT_TABS_BASE.slice(0, idx),
    { id: "benefits", label: "Benefits" },
    ...CONSENT_TABS_BASE.slice(idx),
  ];
}

const CERTAINTY_ORDER = ["HIGH", "MODERATE", "LOW"];

const CERTAINTY_DOT = {
  HIGH:     "bg-emerald-500",
  MODERATE: "bg-emerald-400",
  LOW:      "bg-emerald-200",
};

const CERTAINTY_RATE_COLOR = {
  HIGH:     "text-emerald-600",
  MODERATE: "text-emerald-500",
  LOW:      "text-emerald-400",
};

function BenefitRow({ benefit }) {
  const [expanded, setExpanded] = useState(false);
  const color = CERTAINTY_RATE_COLOR[benefit.certainty] ?? "text-gray-300";
  const dot   = CERTAINTY_DOT[benefit.certainty] ?? "bg-gray-200";
  return (
    <div className={`border-b border-gray-100 last:border-0 ${expanded ? "bg-gray-50/40" : ""}`}>
      <button onClick={() => setExpanded(e => !e)} className="w-full flex items-start gap-3 py-3.5 px-4 text-left">
        <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${dot}`} />
        <div className="flex-1 min-w-0 pr-2">
          <p className="text-[14px] text-gray-900 font-medium leading-snug">{benefit.name}</p>
          {benefit.source && (
            <p className="text-[10px] text-gray-300 font-medium mt-0.5">{benefit.source}</p>
          )}
        </div>
        <div className="shrink-0 text-right max-w-[130px]">
          {benefit.rate && (
            <p className={`text-[12px] font-bold tabular-nums leading-snug ${color}`}>{benefit.rate}</p>
          )}
          {benefit.detail && (
            <p className={`text-[10px] font-semibold tabular-nums leading-snug ${color}`}>{benefit.detail}</p>
          )}
        </div>
      </button>
      {expanded && benefit.plain && (
        <p className="text-[13px] text-gray-500 leading-relaxed pb-3.5 px-4 pl-9">{benefit.plain}</p>
      )}
    </div>
  );
}

function CertaintyGroup({ benefits, certaintyKey }) {
  if (!benefits?.length) return null;
  const c = CERTAINTY[certaintyKey];
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <span className={`w-2 h-2 rounded-full shrink-0 ${CERTAINTY_DOT[certaintyKey]}`} />
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.1em]">
          {c.label} · {benefits.length}
        </p>
      </div>
      <div className="rounded-xl overflow-hidden bg-white border border-gray-100">
        {benefits.map(b => <BenefitRow key={b.id} benefit={b} />)}
      </div>
    </div>
  );
}

function BenefitsPage({ benefits }) {
  if (!benefits?.length) return null;
  const grouped = {};
  for (const b of benefits) {
    const key = b.certainty ?? "LOW";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(b);
  }
  return (
    <div className="pb-4">
      {CERTAINTY_ORDER.map(key => (
        <CertaintyGroup key={key} benefits={grouped[key]} certaintyKey={key} />
      ))}
      <p className="text-[10px] text-gray-300 text-center mt-2 leading-relaxed">
        Certainty ratings follow the GRADE system as used in RCOG GTG (Stock 2022). Tap any row to read the verbatim guideline wording.
      </p>
    </div>
  );
}

function BodyBlock({ text }) {
  return (
    <div className="space-y-3">
      {text.split("\n\n").map((block, i) => {
        const lines = block.split("\n");
        const isList = lines.every(l => l.trimStart().startsWith("•"));
        if (isList) {
          return (
            <ul key={i} className="space-y-1.5 pl-1">
              {lines.map((l, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
                  <span>{l.replace(/^•\s*/, "")}</span>
                </li>
              ))}
            </ul>
          );
        }
        return <p key={i} className="text-sm text-gray-600 leading-relaxed">{block}</p>;
      })}
    </div>
  );
}

function WhatPage({ pages }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-900 leading-snug">{pages.what.heading}</h3>
      <BodyBlock text={pages.what.body} />
    </div>
  );
}

function WhyPage({ pages }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-900 leading-snug">{pages.why.heading}</h3>
      <BodyBlock text={pages.why.body} />
    </div>
  );
}

function DeclinePage({ pages }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-900 leading-snug">{pages.decline.heading}</h3>
      <BodyBlock text={pages.decline.body} />
    </div>
  );
}

// ─── Risk renderers — Direction 1 layout + Direction 3 grouping ──────────────

const FREQ_ORDER = ["VERY_COMMON", "COMMON", "UNCOMMON", "RARE", "VERY_RARE"];

const FREQ_DOT = {
  VERY_COMMON: "bg-red-400",
  COMMON:      "bg-orange-400",
  UNCOMMON:    "bg-yellow-400",
  RARE:        "bg-gray-300",
  VERY_RARE:   "bg-gray-200",
};

const FREQ_RATE_COLOR = {
  VERY_COMMON: "text-red-500",
  COMMON:      "text-orange-500",
  UNCOMMON:    "text-yellow-600",
  RARE:        "text-gray-400",
  VERY_RARE:   "text-gray-300",
};

function inferCategory(sectionId) {
  if (!sectionId) return null;
  const id = sectionId.toLowerCase();
  if (id.includes("fetal") || id.includes("baby") || id.includes("neonatal")) return "fetal";
  if (id.includes("maternal") || id.includes("women") || id.includes("woman")) return "maternal";
  return null;
}

function flattenRisks(sections, instrument, activeFactors) {
  const risks = [];
  for (const section of sections) {
    if (section.type !== "list") continue;
    const category = inferCategory(section.id);
    for (const r of section.risks) {
      if (r.instrumentOnly && instrument !== r.instrumentOnly) continue;
      if (r.conditions?.length > 0 && !r.conditions.some(c => activeFactors.has(c))) continue;
      const freqKey = r.byInstrument ? r.byInstrument[instrument]?.freq : r.freq;
      const rate    = r.byInstrument ? r.byInstrument[instrument]?.rate : r.rate;
      risks.push({ ...r, _freqKey: freqKey, _rate: rate, _category: category });
    }
  }
  return risks;
}

function groupByFreq(risks) {
  const groups = {};
  for (const r of risks) {
    const key = r._freqKey ?? "__none";
    if (!groups[key]) groups[key] = [];
    groups[key].push(r);
  }
  return groups;
}

function FreqRiskRow({ risk }) {
  const [expanded, setExpanded] = useState(false);
  const dot   = FREQ_DOT[risk._freqKey]   ?? "bg-gray-200";
  const color = FREQ_RATE_COLOR[risk._freqKey] ?? "text-gray-300";

  return (
    <div className={`border-b border-gray-100 last:border-0 ${expanded ? "bg-gray-50/40" : ""}`}>
      <button onClick={() => setExpanded(e => !e)} className="w-full flex items-start gap-3 py-3.5 px-4 text-left">
        <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${dot}`} />
        <div className="flex-1 min-w-0 pr-2">
          <p className="text-[14px] text-gray-900 font-medium leading-snug">{risk.name}</p>
          {risk.source && (
            <p className="text-[10px] text-gray-300 font-medium mt-0.5">{risk.source}</p>
          )}
        </div>
        <div className="shrink-0 text-right max-w-[120px]">
          {risk.note && <p className="text-[10px] text-orange-500 font-semibold leading-snug mb-0.5">{risk.note}</p>}
          {risk._rate
            ? <p className={`text-[12px] font-bold tabular-nums leading-snug ${color}`}>{risk._rate}</p>
            : risk._freqKey
              ? <p className={`text-[11px] font-semibold ${color}`}>{FREQ[risk._freqKey]?.label}</p>
              : null
          }
        </div>
      </button>
      {expanded && risk.plain && (
        <p className="text-[13px] text-gray-500 leading-relaxed pb-3.5 px-4 pl-9">{risk.plain}</p>
      )}
    </div>
  );
}

function ComparisonRiskRow({ risk }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={`border-b border-gray-100 last:border-0 ${expanded ? "bg-gray-50/40" : ""}`}>
      <button onClick={() => setExpanded(e => !e)} className="w-full flex items-start gap-3 py-3.5 px-4 text-left">
        <span className="w-2 h-2 rounded-full shrink-0 mt-1.5 bg-gray-200" />
        <p className="flex-1 min-w-0 text-[14px] text-gray-900 font-medium leading-snug pr-2">{risk.name}</p>
        <div className="shrink-0 text-right max-w-[130px] space-y-0.5">
          <p className={`text-[11px] font-bold tabular-nums leading-snug ${risk.cs_higher ? "text-rose-500" : "text-teal-500"}`}>
            CS {risk.cs.replace("About ", "").replace(" on average", "")}
          </p>
          <p className={`text-[11px] font-semibold tabular-nums leading-snug ${risk.cs_higher ? "text-teal-400" : "text-rose-400"}`}>
            VB {risk.vaginal.replace("About ", "").replace(" on average", "")}
          </p>
        </div>
      </button>
      {expanded && risk.plain && (
        <p className="text-[13px] text-gray-500 leading-relaxed pb-3.5 px-4 pl-9">{risk.plain}</p>
      )}
    </div>
  );
}

function FreqGroup({ risks, freqKey }) {
  if (!risks?.length) return null;
  const f = FREQ[freqKey];
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <span className={`w-2 h-2 rounded-full shrink-0 ${FREQ_DOT[freqKey]}`} />
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.1em]">
          {f.label} · {risks.length}
        </p>
      </div>
      <div className="rounded-xl overflow-hidden bg-white border border-gray-100">
        {risks.map(r => <FreqRiskRow key={r.id} risk={r} />)}
      </div>
    </div>
  );
}

function RisksPage({ sections, comparisonSections, instrument, activeFactors }) {
  const [showComparison, setShowComparison] = useState(false);
  const [catTab, setCatTab] = useState("maternal");

  const allRisks = flattenRisks(sections, instrument, activeFactors);

  const hasCats = allRisks.some(r => r._category !== null);
  const maternalRisks = allRisks.filter(r => r._category === "maternal" || r._category === null);
  const fetalRisks    = allRisks.filter(r => r._category === "fetal");
  const showTabs = hasCats && fetalRisks.length > 0;

  const visibleRisks = showTabs
    ? (catTab === "maternal" ? maternalRisks : fetalRisks)
    : allRisks;
  const grouped = groupByFreq(visibleRisks);

  const simpleItems = sections
    .filter(s => s.type === "simple")
    .flatMap(s => s.items.map(item => ({ id: item, name: item, _freqKey: null, _rate: null })));

  return (
    <div className="pb-4">
      {showTabs && (
        <div className="flex gap-1 mb-5 p-1 bg-gray-100 rounded-xl">
          {[
            { id: "maternal", label: `Maternal (${maternalRisks.length})` },
            { id: "fetal",    label: `Fetal (${fetalRisks.length})` },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setCatTab(t.id)}
              className={`flex-1 py-1.5 rounded-lg text-[13px] font-semibold transition-colors ${
                catTab === t.id
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {FREQ_ORDER.map(key => (
        <FreqGroup key={key} risks={grouped[key]} freqKey={key} />
      ))}

      {!showTabs && simpleItems.length > 0 && (
        <div className="mb-7">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.1em] mb-3">Also reported</p>
          <div className="rounded-xl overflow-hidden bg-white border border-gray-100">
            {simpleItems.map(r => (
              <div key={r.id} className="flex items-center gap-3 py-3 px-4 border-b border-gray-100 last:border-0">
                <span className="w-2 h-2 rounded-full shrink-0 bg-gray-200" />
                <p className="text-[14px] text-gray-700 font-medium">{r.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {comparisonSections && (
        <>
          <button
            onClick={() => setShowComparison(v => !v)}
            className="w-full flex items-center justify-between py-3.5 border-t border-gray-100 mt-1"
          >
            <span className="text-[13px] font-semibold text-gray-400">Compare with vaginal birth</span>
            <svg className={`w-3.5 h-3.5 text-gray-300 transition-transform ${showComparison ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          {showComparison && (
            <div className="mt-2 mb-4">
              <p className="text-[11px] text-gray-400 mb-4 leading-snug">NICE NG192 Appendix A (2021) — population averages, not specific to your situation.</p>
              {comparisonSections.flatMap(s => s.risks).map(r => (
                <ComparisonRiskRow key={r.id} risk={r} />
              ))}
            </div>
          )}
        </>
      )}

      <div className="mt-6">
        <FreqKey />
      </div>
    </div>
  );
}

function ConsentSummary({ procedureId, context, factors, onBack, onReset }) {
  const [activeTab, setActiveTab] = useState("what");

  const proc         = CONSENT_PROCEDURES.find(p => p.id === procedureId);
  const cfg          = PROCEDURE_CONFIG[procedureId] ?? {};
  const activeFactors = factors;

  const contextOpt   = cfg.contextOptions?.find(o => o.id === context);
  const contextLabel = contextOpt?.label ?? null;

  const faqs             = cfg.faq ?? [];
  const pages            = cfg.getPages?.(context) ?? {};
  const source           = cfg.sourceLabel ?? "";
  const instrument       = cfg.getInstrument?.(context) ?? null;
  const riskSections     = cfg.getRiskSections?.(context, activeFactors) ?? [];
  const benefits         = cfg.getBenefits?.(context, activeFactors) ?? [];
  const comparisonSections = cfg.comparisonSections ?? null;

  const tabs = buildTabs(benefits.length > 0);
  const currentIdx = tabs.findIndex(t => t.id === activeTab);
  const canPrev = currentIdx > 0;
  const canNext = currentIdx < tabs.length - 1;

  return (
    <div className="min-h-screen pb-28">
      <div className="max-w-lg mx-auto">

        {/* Sticky header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-gray-100">
          <div className="px-5 pt-10 pb-2">
            <div className="flex items-center gap-3 mb-2">
              <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors shrink-0">
                <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-gray-900">{proc?.title}</h3>
                  {contextLabel && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-600">{contextLabel}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap mt-0.5">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide font-bold">{source}</p>
                  {proc?.pdfs?.map(pdf => (
                    <a
                      key={pdf.label}
                      href={pdf.url ?? `/consent-sources/${pdf.file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[10px] text-blue-400 font-semibold hover:text-blue-600 transition-colors"
                    >
                      <svg className="w-2.5 h-2.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      {pdf.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Active factors chips */}
            {activeFactors.size > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {[...(cfg.patientFactors ?? [])]
                  .filter(f => activeFactors.has(f.id))
                  .map(f => (
                    <span key={f.id} className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                      {f.label}
                    </span>
                  ))}
              </div>
            )}
          </div>

          {/* Tab pills */}
          <div className="flex gap-2 overflow-x-auto px-5 pb-3 no-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Page content */}
        <div className="px-5 pt-6">
          {activeTab === "what"     && <WhatPage     pages={pages} />}
          {activeTab === "why"      && <WhyPage      pages={pages} />}
          {activeTab === "benefits" && <BenefitsPage benefits={benefits} />}
          {activeTab === "risks"    && <RisksPage    sections={riskSections} comparisonSections={comparisonSections} instrument={instrument ?? context} activeFactors={activeFactors} />}
          {activeTab === "decline"  && <DeclinePage  pages={pages} />}
          {activeTab === "faq"      && <FAQSection   faqs={faqs} />}
        </div>
      </div>

      {/* Prev / Next bar */}
      <div className="fixed bottom-16 inset-x-0 z-30 bg-white/95 backdrop-blur border-t border-gray-100">
        <div className="max-w-lg mx-auto flex items-center gap-3 px-5 py-3">
          <button
            onClick={() => canPrev && setActiveTab(tabs[currentIdx - 1].id)}
            disabled={!canPrev}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              canPrev ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-gray-50 text-gray-300 cursor-default"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div className="flex-1 flex justify-center gap-1.5">
            {tabs.map((tab, i) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  activeTab === tab.id ? "bg-gray-900 w-4" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          {canNext ? (
            <button
              onClick={() => setActiveTab(tabs[currentIdx + 1].id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gray-900 text-white hover:bg-gray-800 transition-all"
            >
              Next
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={onReset}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gray-900 text-white hover:bg-gray-800 transition-all"
            >
              Done
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── main export ──────────────────────────────────────────────────────────────

export default function ConsentPage() {
  const [step, setStep]           = useState(0);  // 0=list, 1=context, 2=factors, 3=summary
  const [procedureId, setProcId]  = useState(null);
  const [context, setContext]     = useState(null);
  const [factors, setFactors]     = useState(new Set());

  const selectProcedure = id => {
    setProcId(id);
    // skip context step if procedure has no context options
    const hasContext = (PROCEDURE_CONFIG[id]?.contextOptions?.length ?? 0) > 0;
    setStep(hasContext ? 1 : 2);
  };
  const selectContext = ctx => { setContext(ctx); setStep(2); };
  const toggleFactor    = id => setFactors(prev => {
    const s = new Set(prev);
    s.has(id) ? s.delete(id) : s.add(id);
    return s;
  });
  const showSummary = () => setStep(3);

  const reset = () => { setStep(0); setProcId(null); setContext(null); setFactors(new Set()); };

  if (step === 0) return <ProcedureList onSelect={selectProcedure} />;
  if (step === 1) return <ContextPicker procedureId={procedureId} onSelect={selectContext} onBack={reset} />;
  if (step === 2) return (
    <PatientFactors
      procedureId={procedureId}
      context={context}
      factors={factors}
      onToggle={toggleFactor}
      onContinue={showSummary}
      onBack={() => {
        const hasContext = (PROCEDURE_CONFIG[procedureId]?.contextOptions?.length ?? 0) > 0;
        setStep(hasContext ? 1 : 0);
      }}
    />
  );
  if (step === 3) return (
    <ConsentSummary
      procedureId={procedureId}
      context={context}
      factors={factors}
      onBack={() => setStep(2)}
      onReset={reset}
    />
  );
}
