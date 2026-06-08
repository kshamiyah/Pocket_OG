import { useState } from "react";
import {
  CONSENT_PROCEDURES,
  FREQ,
  CS_CONTEXT_OPTIONS,
  CS_PATIENT_FACTORS,
  CS_RISK_SECTIONS,
  CS_PP_RISK_SECTIONS,
  CS_FAQ,
  CS_PAGES,
  OVD_CONTEXT_OPTIONS,
  OVD_PATIENT_FACTORS,
  OVD_RISK_SECTIONS,
  OVD_FAQ,
  OVD_PAGES,
} from "../data/consent";

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
            {CONSENT_PROCEDURES.map(proc => (
              <button
                key={proc.id}
                onClick={() => onSelect(proc.id)}
                className="flex items-center gap-3 w-full px-4 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
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
  const options = procedureId === "CS" ? CS_CONTEXT_OPTIONS : OVD_CONTEXT_OPTIONS;

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
  const allFactors = procedureId === "CS" ? CS_PATIENT_FACTORS : OVD_PATIENT_FACTORS;
  const contextLabel = procedureId === "CS"
    ? (context === "elective" ? "Elective" : "Emergency")
    : (context === "ventouse" ? "Ventouse" : "Forceps");

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
              <p className="text-xs text-gray-400">{proc?.title} · <span className="font-semibold text-gray-600">{contextLabel}</span></p>
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

const CONSENT_TABS = [
  { id: "what",    label: "What" },
  { id: "why",     label: "Why" },
  { id: "risks",   label: "Risks" },
  { id: "decline", label: "Decline" },
  { id: "faq",     label: "FAQ" },
];

function WhatPage({ pages }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-900 leading-snug">{pages.what.heading}</h3>
      {pages.what.body.split("\n\n").map((para, i) => (
        <p key={i} className="text-sm text-gray-600 leading-relaxed">{para}</p>
      ))}
    </div>
  );
}

function WhyPage({ pages }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-900 leading-snug">{pages.why.heading}</h3>
      {pages.why.body.split("\n\n").map((para, i) => (
        <p key={i} className="text-sm text-gray-600 leading-relaxed">{para}</p>
      ))}
    </div>
  );
}

function DeclinePage({ pages }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-900 leading-snug">{pages.decline.heading}</h3>
      {pages.decline.body.split("\n\n").map((para, i) => (
        <p key={i} className="text-sm text-gray-600 leading-relaxed">{para}</p>
      ))}
    </div>
  );
}

// ─── Risk renderers — Apple-style, no cards ───────────────────────────────────

const FREQ_RATE_COLOR = {
  VERY_COMMON: "text-red-500",
  COMMON:      "text-orange-500",
  UNCOMMON:    "text-yellow-600",
  RARE:        "text-gray-400",
  VERY_RARE:   "text-gray-300",
};

function ListRiskRow({ risk, instrument, activeFactors }) {
  const [expanded, setExpanded] = useState(false);

  if (risk.instrumentOnly && instrument !== risk.instrumentOnly) return null;
  if (risk.conditions?.length > 0 && !risk.conditions.some(c => activeFactors.has(c))) return null;

  const freqKey  = risk.byInstrument ? risk.byInstrument[instrument]?.freq : risk.freq;
  const rate     = risk.byInstrument ? risk.byInstrument[instrument]?.rate : risk.rate;
  const rateColor = FREQ_RATE_COLOR[freqKey] ?? "text-gray-400";
  const freqLabel = FREQ[freqKey]?.label;

  return (
    <div className="py-4 border-b border-gray-100 last:border-0">
      <button onClick={() => setExpanded(e => !e)} className="w-full text-left">
        <p className="text-[15px] font-semibold text-gray-900 leading-snug tracking-[-0.01em]">{risk.name}</p>
        {risk.note && <p className="text-xs text-orange-500 font-medium mt-0.5">{risk.note}</p>}
        <div className="flex items-baseline gap-2 mt-1.5">
          {rate     && <span className={`text-[22px] font-bold leading-none tracking-tight ${rateColor}`}>{rate}</span>}
          {freqLabel && <span className="text-xs text-gray-400 font-medium">{freqLabel}</span>}
          {!rate && freqLabel && <span className={`text-base font-semibold ${rateColor}`}>{freqLabel}</span>}
        </div>
        {expanded && risk.plain && (
          <p className="text-sm text-gray-500 leading-relaxed mt-3">{risk.plain}</p>
        )}
      </button>
    </div>
  );
}

function ComparisonRiskRow({ risk }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="py-4 border-b border-gray-100 last:border-0">
      <button onClick={() => setExpanded(e => !e)} className="w-full text-left">
        <p className="text-[15px] font-semibold text-gray-900 leading-snug tracking-[-0.01em] mb-2">{risk.name}</p>
        <div className="flex gap-4">
          <div className="flex-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Caesarean</p>
            <p className={`text-base font-bold leading-snug ${risk.cs_higher ? "text-red-500" : "text-teal-500"}`}>{risk.cs}</p>
          </div>
          <div className="w-px bg-gray-100 self-stretch" />
          <div className="flex-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Vaginal</p>
            <p className={`text-base font-bold leading-snug ${risk.cs_higher ? "text-teal-500" : "text-red-500"}`}>{risk.vaginal}</p>
          </div>
        </div>
        {expanded && risk.plain && (
          <p className="text-sm text-gray-500 leading-relaxed mt-3">{risk.plain}</p>
        )}
      </button>
    </div>
  );
}

function RiskSectionBlock({ section, instrument, activeFactors }) {
  const hasVisible = section.type === "list"
    ? section.risks.some(r => {
        if (r.instrumentOnly && instrument !== r.instrumentOnly) return false;
        if (r.conditions?.length > 0 && !r.conditions.some(c => activeFactors.has(c))) return false;
        return true;
      })
    : true;

  if (!hasVisible) return null;

  return (
    <div className="mb-8">
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.12em] mb-1">{section.heading}</p>
      {section.note && (
        <p className="text-xs text-amber-600 mb-3 leading-snug">{section.note}</p>
      )}

      {section.type === "list" && (
        <div>
          {section.risks.map(r => (
            <ListRiskRow key={r.id} risk={r} instrument={instrument} activeFactors={activeFactors} />
          ))}
        </div>
      )}

      {section.type === "comparison" && (
        <div>
          {section.risks.map(r => <ComparisonRiskRow key={r.id} risk={r} />)}
        </div>
      )}

      {section.type === "simple" && (
        <div>
          {section.items.map((item, i) => (
            <div key={i} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
              <span className="w-1 h-1 rounded-full bg-gray-300 shrink-0" />
              <p className="text-[15px] text-gray-700 font-medium">{item}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RisksPage({ sections, instrument, activeFactors }) {
  return (
    <div className="pb-4">
      {sections.map(s => (
        <RiskSectionBlock key={s.id} section={s} instrument={instrument} activeFactors={activeFactors} />
      ))}
      <FreqKey />
    </div>
  );
}

function ConsentSummary({ procedureId, context, factors, onBack, onReset }) {
  const [activeTab, setActiveTab] = useState("what");

  const proc    = CONSENT_PROCEDURES.find(p => p.id === procedureId);
  const isCS    = procedureId === "CS";
  const isOVD   = procedureId === "OVD";

  const contextLabel = isCS
    ? (context === "elective" ? "Elective" : "Emergency")
    : (context === "ventouse" ? "Ventouse" : "Forceps");

  const faqs      = isCS  ? CS_FAQ          : OVD_FAQ;
  const pages     = isCS  ? CS_PAGES[context] : OVD_PAGES[context];
  const source    = isCS  ? "NICE NG192 · RCOG Consent Advice No. 12"
                           : "RCOG Consent Advice No. 11 (2010)";
  const instrument    = isOVD ? context : null;
  const activeFactors = factors;
  const hasPP         = isCS && activeFactors.has("placenta_praevia");
  const riskSections  = isCS
    ? (hasPP ? CS_PP_RISK_SECTIONS : CS_RISK_SECTIONS)
    : OVD_RISK_SECTIONS;

  const currentIdx = CONSENT_TABS.findIndex(t => t.id === activeTab);
  const canPrev = currentIdx > 0;
  const canNext = currentIdx < CONSENT_TABS.length - 1;

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
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    context === "emergency" ? "bg-red-100 text-red-700" :
                    context === "forceps"   ? "bg-indigo-100 text-indigo-700" :
                    "bg-emerald-100 text-emerald-700"
                  }`}>{contextLabel}</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wide font-bold">{source}</p>
              </div>
            </div>

            {/* Active factors chips */}
            {activeFactors.size > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {[...(isCS ? CS_PATIENT_FACTORS : OVD_PATIENT_FACTORS)]
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
            {CONSENT_TABS.map(tab => (
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
          {activeTab === "what"    && <WhatPage    pages={pages} />}
          {activeTab === "why"     && <WhyPage     pages={pages} />}
          {activeTab === "risks"   && <RisksPage   sections={riskSections} instrument={instrument} activeFactors={activeFactors} />}
          {activeTab === "decline" && <DeclinePage pages={pages} />}
          {activeTab === "faq"     && <FAQSection  faqs={faqs} />}
        </div>
      </div>

      {/* Prev / Next bar */}
      <div className="fixed bottom-16 inset-x-0 z-30 bg-white/95 backdrop-blur border-t border-gray-100">
        <div className="max-w-lg mx-auto flex items-center gap-3 px-5 py-3">
          <button
            onClick={() => canPrev && setActiveTab(CONSENT_TABS[currentIdx - 1].id)}
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
            {CONSENT_TABS.map((tab, i) => (
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
              onClick={() => setActiveTab(CONSENT_TABS[currentIdx + 1].id)}
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

  const selectProcedure = id => { setProcId(id); setStep(1); };
  const selectContext   = ctx => { setContext(ctx); setStep(2); };
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
      onBack={() => setStep(1)}
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
