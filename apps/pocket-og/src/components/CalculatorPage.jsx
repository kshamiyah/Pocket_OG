import { useState, useMemo, useRef } from "react";
import SeeAlso from "./SeeAlso";
import ShareButton from "./ShareButton";
import { shareUrl as deepLinkUrl } from "../utils/deepLink";
import { CALCULATOR_CONNECTIONS } from "../data/connections";
import AlphabetSidebar from "./AlphabetSidebar";
import { sourceColors, sourceFromLabel } from "../data/glColors";
import {
  CALCULATOR_SCENARIOS,
  interpretPUL,
  PUL_CAVEATS,
  symptomOverride,
  pulTvsTriage,
  interpretEctopicDecision,
  MTX_CONTRAINDICATIONS,
  interpretExpectantStep,
  interpretMtxStep,
  MTX_GENERAL_ADVICE,
  VTE_RISK_FACTORS,
  VTE_ADMISSION_NOTES,
  interpretVteAntenatal,
  interpretVtePostnatal,
  lmwhDoseForWeight,
  LMWH_HIGH_PROPHYLACTIC_50_TO_90,
  LMWH_CONTRAINDICATIONS,
} from "../data/calculator";

// ─── Step 0: scenario picker ──────────────────────────────────────────

function ScenarioList({ onSelect, onOpenIOLPrioritizer }) {
  const [searchQuery, setSearchQuery] = useState("");
  const sectionRefs = useRef({});

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return [...CALCULATOR_SCENARIOS]
      .filter(s => !q || s.title.toLowerCase().includes(q) || s.subtitle?.toLowerCase().includes(q))
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [searchQuery]);

  const groupedByLetter = useMemo(() => {
    const groups = {};
    filtered.forEach(s => {
      const letter = s.title[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(s);
    });
    return groups;
  }, [filtered]);

  const activeLetters = useMemo(() => new Set(Object.keys(groupedByLetter)), [groupedByLetter]);

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-lg mx-auto">
        <div className="px-5 pt-14 pb-1">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Calculator</h2>
          <p className="text-xs text-gray-400 mt-0.5">Decision-support calculators — verbatim from NICE & RCOG</p>
        </div>

        {/* Sticky search bar */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 pl-4 pr-8 pt-3 pb-3">
          <div className="relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              placeholder="Filter calculators…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-9 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center rounded-full bg-gray-300 hover:bg-gray-400 transition-colors"
              >
                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="px-5 pt-3">
          {onOpenIOLPrioritizer && (
            <button
              onClick={onOpenIOLPrioritizer}
              className="flex items-start gap-3 w-full px-4 py-4 mb-3 rounded-2xl bg-white border border-gray-100 shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
            >
              <div className={`w-1 h-12 rounded-full shrink-0 ${sourceColors("RBH").accent}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 leading-snug">IOL Priority List</p>
                <p className="text-xs text-gray-400 mt-0.5">Rank and queue patients for induction of labour</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-1.5">GL861 · Tool</p>
              </div>
              <svg className="w-4 h-4 text-gray-300 shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
          {filtered.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">No calculators match &ldquo;{searchQuery}&rdquo;</p>
          ) : (
            <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm">
              {Object.entries(groupedByLetter).sort().map(([letter, items]) => (
                <div key={letter}>
                  <div
                    ref={el => { sectionRefs.current[letter] = el; }}
                    style={{ scrollMarginTop: "64px" }}
                    className="px-4 py-1.5 bg-gray-50 border-b border-gray-100"
                  >
                    <span className="text-[10px] font-bold text-gray-400 tracking-widest">{letter}</span>
                  </div>
                  {items.map(s => (
                    <button
                      key={s.id}
                      onClick={() => onSelect(s.id)}
                      className="flex items-start gap-3 w-full px-4 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left border-t border-gray-50"
                    >
                      <div className={`w-1 h-12 rounded-full shrink-0 ${sourceColors(sourceFromLabel(s.source)).accent}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 leading-snug">{s.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{s.subtitle}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-1.5">{s.source}</p>
                        {s.pdfs?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2" onClick={e => e.stopPropagation()}>
                            {s.pdfs.map(pdf => (
                              <a
                                key={pdf.label}
                                href={pdf.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 hover:bg-gray-200 text-[10px] font-semibold text-gray-500 transition-colors"
                              >
                                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                {pdf.label}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                      <svg className="w-4 h-4 text-gray-300 shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}

          <p className="text-[10px] text-gray-300 text-center mt-6 px-4 leading-relaxed">
            Calculator outputs are decision aids only. Clinical responsibility remains with the treating clinician. Thresholds are derived from national guidelines — verify against your local protocols and current published guidance before applying in practice.
          </p>
        </div>
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

// ─── Shared chrome ────────────────────────────────────────────────────

function StepHeader({ title, subtitle, onBack, pdfs, shareId }) {
  return (
    <div className="px-5 pt-14 pb-2 flex items-start gap-3">
      <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors shrink-0 mt-0.5">
        <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 font-medium">{title}</p>
        {subtitle && <p className="text-[10px] text-gray-300 font-medium mt-0.5">{subtitle}</p>}
        {pdfs?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {pdfs.map(pdf => (
              <a
                key={pdf.label}
                href={pdf.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 hover:bg-gray-200 text-[10px] font-semibold text-gray-500 transition-colors"
              >
                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                {pdf.label}
              </a>
            ))}
          </div>
        )}
      </div>
      <ShareButton
        title={title}
        text={`${title}${subtitle ? ` (${subtitle})` : ""} — calculator via Pocket O&G`}
        url={shareId ? deepLinkUrl("calculator", shareId) : undefined}
        label="Share calculator"
        dark
      />
    </div>
  );
}

function NumberField({ label, value, onChange, suffix, autoFocus }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-gray-500 mb-1.5">{label}</span>
      <div className="relative">
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={e => onChange(e.target.value)}
          autoFocus={autoFocus}
          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 focus:outline-none focus:border-gray-400 transition-colors"
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium pointer-events-none">{suffix}</span>
        )}
      </div>
    </label>
  );
}

function YesNoField({ label, value, onChange }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 mb-1.5">{label}</p>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onChange(true)}
          className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
            value === true ? "bg-gray-900 border-gray-900 text-white" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          Yes
        </button>
        <button
          onClick={() => onChange(false)}
          className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
            value === false ? "bg-gray-900 border-gray-900 text-white" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          No
        </button>
      </div>
    </div>
  );
}

function ResultCard({ result }) {
  if (!result) return null;
  return (
    <div className={`rounded-2xl border ${result.border} ${result.bg} p-5 mb-3`}>
      <div className="flex items-start gap-3">
        <div className={`w-2 h-2 rounded-full ${result.color.replace("text-", "bg-")} mt-2 shrink-0`} />
        <div className="flex-1 min-w-0">
          <p className={`text-base font-bold ${result.color} leading-tight`}>{result.title}</p>
          {result.summary && <p className="text-xs text-gray-500 font-medium mt-1">{result.summary}</p>}
        </div>
      </div>
      {result.detail && (
        <p className="text-sm text-gray-700 leading-relaxed mt-3 pl-5">{result.detail}</p>
      )}
      {result.actions && result.actions.length > 0 && (
        <ul className="mt-3 pl-5 space-y-1.5">
          {result.actions.map((a, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700 leading-relaxed">
              <span className="text-gray-400 mt-1 shrink-0">›</span>
              <span>{a}</span>
            </li>
          ))}
        </ul>
      )}
      {result.citation && (
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-4 pl-5">{result.citation}</p>
      )}
    </div>
  );
}

// ─── Guided / Quick entry mode — shared across the symptom-gated ectopic
// calculators (PUL, expectant surveillance, post-MTX surveillance). Each
// scope remembers its own last-picked mode.
const CALC_MODE_KEYS = {
  pul: "pocketog_pul_mode",
  expectant: "pocketog_expectant_mode",
  mtx: "pocketog_mtx_mode",
};
function getCalcMode(scope) {
  try { return localStorage.getItem(CALC_MODE_KEYS[scope]) === "quick" ? "quick" : "guided"; }
  catch { return "guided"; }
}
function setCalcModeStored(scope, mode) {
  try { localStorage.setItem(CALC_MODE_KEYS[scope], mode); } catch { /* storage unavailable — ignore */ }
}

function ModeToggle({ mode, onChange }) {
  return (
    <div className="inline-flex bg-gray-100 rounded-xl p-0.5 text-xs font-semibold mb-6">
      {[
        { id: "guided", label: "Guided" },
        { id: "quick", label: "Quick entry" },
      ].map(v => (
        <button
          key={v.id}
          onClick={() => onChange(v.id)}
          aria-pressed={mode === v.id}
          className={`px-4 py-1.5 rounded-lg transition-colors ${
            mode === v.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
          }`}
        >
          {v.label}
        </button>
      ))}
    </div>
  );
}

// Collapsible amber "read before you rely on this" strip shown in Quick
// entry in place of the symptom-check gate.
function QuickAdvisory({ open, onToggle, note, caveats }) {
  return (
    <>
      <button
        onClick={onToggle}
        className="w-full mt-6 flex items-center justify-between rounded-2xl bg-amber-50 border border-amber-100 p-4 text-left"
      >
        <span className="text-xs font-bold text-amber-700">Before you rely on this — read first</span>
        <svg className={`w-4 h-4 text-amber-500 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 mt-2">
          <p className="text-xs text-gray-600 leading-relaxed mb-2">{note}</p>
          {caveats?.length > 0 && (
            <ul className="space-y-1.5">
              {caveats.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-600 leading-relaxed">
                  <span className="text-gray-300 mt-0.5 shrink-0">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
}

// ─── Scenario 1: PUL ──────────────────────────────────────────────────

function PulCalculator({ onBack, pdfs, onNavigate }) {
  const [mode, setMode] = useState(() => getCalcMode("pul"));
  const [haemodynamicInstability, setHaemodynamicInstability] = useState(null);
  const [worseningPain, setWorseningPain] = useState(null);
  const [heavyBleeding, setHeavyBleeding] = useState(null);
  const [tvsDone, setTvsDone] = useState(null);
  const [iupSeen, setIupSeen] = useState(null);
  const [adnexalMassOrFreeFluid, setAdnexalMassOrFreeFluid] = useState(null);
  const [hcg1, setHcg1] = useState("");
  const [hcg2, setHcg2] = useState("");
  const [hours, setHours] = useState("48");
  const [result, setResult] = useState(null);
  const [caveatsOpen, setCaveatsOpen] = useState(false);

  const changeMode = (m) => {
    setMode(m);
    setCalcModeStored("pul", m);
  };

  const symptomsAnswered =
    haemodynamicInstability !== null && worseningPain !== null && heavyBleeding !== null;
  const tvsAnswered =
    tvsDone !== null && (tvsDone === false || (iupSeen !== null && adnexalMassOrFreeFluid !== null));
  const needHcg = symptomsAnswered && tvsAnswered &&
    !haemodynamicInstability && !worseningPain && !heavyBleeding &&
    tvsDone && !iupSeen && !adnexalMassOrFreeFluid;

  const submitGuided = () => {
    const sym = symptomOverride({ worseningPain, heavyBleeding, haemodynamicInstability });
    if (sym) { setResult(sym); return; }
    const tvs = pulTvsTriage({ tvsDone, iupSeen, adnexalMassOrFreeFluid });
    if (tvs) { setResult(tvs); return; }
    const a = parseFloat(hcg1);
    const b = parseFloat(hcg2);
    const h = parseFloat(hours);
    if (!a || !b || !h) return;
    setResult(interpretPUL({ hcg1: a, hcg2: b, hoursBetween: h }));
  };

  const submitQuick = () => {
    const a = parseFloat(hcg1);
    const b = parseFloat(hcg2);
    const h = parseFloat(hours);
    if (!a || !b || !h) return;
    setResult(interpretPUL({ hcg1: a, hcg2: b, hoursBetween: h }));
  };

  const reset = () => {
    setHaemodynamicInstability(null);
    setWorseningPain(null);
    setHeavyBleeding(null);
    setTvsDone(null);
    setIupSeen(null);
    setAdnexalMassOrFreeFluid(null);
    setHcg1("");
    setHcg2("");
    setHours("48");
    setResult(null);
    setCaveatsOpen(false);
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-lg mx-auto">
        <StepHeader title="PUL — serial hCG" subtitle="NICE NG126 §1.4.27–1.4.32" onBack={onBack} pdfs={pdfs} shareId="PUL" />

        <div className="px-5 pt-6">
          {!result && <ModeToggle mode={mode} onChange={changeMode} />}

          {!result && mode === "quick" && (
            <>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">Enter both hCG levels</h3>
              <p className="text-sm text-gray-400 mb-6">Samples must be ≥48 h apart (NG126 §1.4.27).</p>

              <div className="space-y-4">
                <NumberField label="First hCG" value={hcg1} onChange={setHcg1} suffix="IU/L" autoFocus={false} />
                <NumberField label="Second hCG" value={hcg2} onChange={setHcg2} suffix="IU/L" />
                <NumberField label="Hours between samples" value={hours} onChange={setHours} suffix="hours" />
              </div>

              <button
                onClick={submitQuick}
                disabled={!hcg1 || !hcg2 || !hours}
                className="w-full mt-6 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3.5 rounded-2xl transition-colors"
              >
                Calculate
              </button>

              <QuickAdvisory
                open={caveatsOpen}
                onToggle={() => setCaveatsOpen(o => !o)}
                note="This assumes you've already excluded red-flag symptoms (haemodynamic instability, worsening pain, heavy bleeding) and that a TVS was performed and non-diagnostic (no IUP, no adnexal mass/free fluid). If not — switch to Guided."
                caveats={PUL_CAVEATS}
              />
            </>
          )}

          {!result && mode === "guided" && (
            <>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">Clinical picture first</h3>
              <p className="text-sm text-gray-400 mb-6">NG126 §1.4.25: symptoms outrank biochemistry.</p>

              <div className="space-y-3 mb-6">
                <YesNoField label="Haemodynamic instability?" value={haemodynamicInstability} onChange={setHaemodynamicInstability} />
                <YesNoField label="New or worsening pain?" value={worseningPain} onChange={setWorseningPain} />
                <YesNoField label="Heavy vaginal bleeding?" value={heavyBleeding} onChange={setHeavyBleeding} />
              </div>

              {symptomsAnswered && !haemodynamicInstability && !worseningPain && !heavyBleeding && (
                <>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">Transvaginal ultrasound</h3>
                  <p className="text-sm text-gray-400 mb-6">NG126 §1.4.7: TVS is the first-line diagnostic test.</p>

                  <div className="space-y-3 mb-6">
                    <YesNoField label="TVS already performed?" value={tvsDone} onChange={setTvsDone} />
                    {tvsDone && (
                      <>
                        <YesNoField label="Intrauterine pregnancy seen on TVS?" value={iupSeen} onChange={setIupSeen} />
                        <YesNoField label="Adnexal mass or free fluid on TVS?" value={adnexalMassOrFreeFluid} onChange={setAdnexalMassOrFreeFluid} />
                      </>
                    )}
                  </div>
                </>
              )}

              {needHcg && (
                <>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">Enter both hCG levels</h3>
                  <p className="text-sm text-gray-400 mb-6">Samples must be ≥48 h apart (NG126 §1.4.27).</p>

                  <div className="space-y-4">
                    <NumberField label="First hCG" value={hcg1} onChange={setHcg1} suffix="IU/L" autoFocus={false} />
                    <NumberField label="Second hCG" value={hcg2} onChange={setHcg2} suffix="IU/L" />
                    <NumberField label="Hours between samples" value={hours} onChange={setHours} suffix="hours" />
                  </div>
                </>
              )}

              <button
                onClick={submitGuided}
                disabled={
                  !symptomsAnswered ||
                  (symptomsAnswered && !haemodynamicInstability && !worseningPain && !heavyBleeding && !tvsAnswered) ||
                  (needHcg && (!hcg1 || !hcg2 || !hours))
                }
                className="w-full mt-6 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3.5 rounded-2xl transition-colors"
              >
                Calculate
              </button>

              <div className="mt-6 rounded-2xl bg-gray-50 border border-gray-100 p-4">
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-2">Important — verbatim from NG126</p>
                <ul className="space-y-1.5">
                  {PUL_CAVEATS.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-600 leading-relaxed">
                      <span className="text-gray-300 mt-0.5 shrink-0">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {result && (
            <>
              <ResultCard result={result} />
              <button
                onClick={reset}
                className="w-full mt-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-2xl transition-colors text-sm"
              >
                New calculation
              </button>
            </>
          )}

          <div className="mt-6">
            <SeeAlso links={CALCULATOR_CONNECTIONS.PUL} onNavigate={onNavigate} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Scenario 2: Ectopic decision ─────────────────────────────────────

function EctopicDecisionCalculator({ onBack, pdfs, onNavigate }) {
  const [hcg, setHcg] = useState("");
  const [massSize, setMassSize] = useState("");
  const [significantPain, setSignificantPain] = useState(null);
  const [fetalHeartbeat, setFetalHeartbeat] = useState(null);
  const [iupExcluded, setIupExcluded] = useState(null);
  const [canReturnFollowUp, setCanReturnFollowUp] = useState(null);
  const [result, setResult] = useState(null);

  const allAnswered =
    hcg && massSize &&
    significantPain !== null && fetalHeartbeat !== null &&
    iupExcluded !== null && canReturnFollowUp !== null;

  const submit = () => {
    if (!allAnswered) return;
    setResult(
      interpretEctopicDecision({
        hcg: parseFloat(hcg),
        massSize: parseFloat(massSize),
        significantPain,
        fetalHeartbeat,
        iupExcluded,
        canReturnFollowUp,
      }),
    );
  };

  const reset = () => {
    setHcg(""); setMassSize("");
    setSignificantPain(null); setFetalHeartbeat(null);
    setIupExcluded(null); setCanReturnFollowUp(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-lg mx-auto">
        <StepHeader title="Tubal ectopic — initial management" subtitle="NICE NG126 §1.6.3–1.6.10 · RCOG GTG21 §5.1" onBack={onBack} pdfs={pdfs} shareId="ECTOPIC_DECISION" />

        <div className="px-5 pt-6">
          {!result && (
            <>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">Clinical findings</h3>
              <p className="text-sm text-gray-400 mb-6">Requires ultrasound-confirmed tubal ectopic pregnancy.</p>

              <div className="space-y-4">
                <NumberField label="Serum β-hCG" value={hcg} onChange={setHcg} suffix="IU/L" />
                <NumberField label="Adnexal mass size" value={massSize} onChange={setMassSize} suffix="mm" />
                <YesNoField label="Significant pain?" value={significantPain} onChange={setSignificantPain} />
                <YesNoField label="Fetal heartbeat visible on ultrasound?" value={fetalHeartbeat} onChange={setFetalHeartbeat} />
                <YesNoField label="Intrauterine pregnancy excluded on ultrasound?" value={iupExcluded} onChange={setIupExcluded} />
                <YesNoField label="Able to return for follow-up?" value={canReturnFollowUp} onChange={setCanReturnFollowUp} />
              </div>

              <button
                onClick={submit}
                disabled={!allAnswered}
                className="w-full mt-6 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3.5 rounded-2xl transition-colors"
              >
                Determine pathway
              </button>
            </>
          )}

          {result && (
            <>
              {result.pathways.map(p => (
                <ResultCard
                  key={p.id}
                  result={{
                    title: p.title,
                    color: p.color,
                    bg: p.bg,
                    border: p.border,
                    summary: p.rationale.join(" · "),
                    detail: p.detail,
                    actions: p.actions,
                    citation: p.citation,
                  }}
                />
              ))}

              <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 mt-2">
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-2">Methotrexate contraindications — RCOG GTG21 App III</p>
                <ul className="grid grid-cols-1 gap-1">
                  {MTX_CONTRAINDICATIONS.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-600 leading-snug">
                      <span className="text-gray-300 mt-0.5 shrink-0">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={reset}
                className="w-full mt-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-2xl transition-colors text-sm"
              >
                New calculation
              </button>
            </>
          )}

          <div className="mt-6">
            <SeeAlso links={CALCULATOR_CONNECTIONS.ECTOPIC_DECISION} onNavigate={onNavigate} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Scenario 3: Expectant surveillance ───────────────────────────────

function ExpectantSurveillanceCalculator({ onBack, pdfs, onNavigate }) {
  const [mode, setMode] = useState(() => getCalcMode("expectant"));
  const [haemodynamicInstability, setHaemodynamicInstability] = useState(null);
  const [worseningPain, setWorseningPain] = useState(null);
  const [heavyBleeding, setHeavyBleeding] = useState(null);
  const [day0, setDay0] = useState("");
  const [day2, setDay2] = useState("");
  const [day4, setDay4] = useState("");
  const [day7, setDay7] = useState("");
  const [caveatsOpen, setCaveatsOpen] = useState(false);

  const changeMode = (m) => {
    setMode(m);
    setCalcModeStored("expectant", m);
  };

  const symptomsAnswered = mode === "guided" &&
    haemodynamicInstability !== null && worseningPain !== null && heavyBleeding !== null;
  const override = symptomsAnswered
    ? symptomOverride({ worseningPain, heavyBleeding, haemodynamicInstability })
    : null;
  const clear = mode === "quick" || (symptomsAnswered && !override);

  const r2 = clear ? interpretExpectantStep({ previous: parseFloat(day0), current: parseFloat(day2), dayLabel: "Day 2" }) : null;
  const r4 = clear ? interpretExpectantStep({ previous: parseFloat(day2), current: parseFloat(day4), dayLabel: "Day 4" }) : null;
  const r7 = clear ? interpretExpectantStep({ previous: parseFloat(day4), current: parseFloat(day7), dayLabel: "Day 7" }) : null;

  const reset = () => {
    setHaemodynamicInstability(null);
    setWorseningPain(null);
    setHeavyBleeding(null);
    setDay0(""); setDay2(""); setDay4(""); setDay7("");
    setCaveatsOpen(false);
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-lg mx-auto">
        <StepHeader title="Expectant management surveillance" subtitle="NICE NG126 §1.6.5" onBack={onBack} pdfs={pdfs} shareId="EXPECTANT_SURVEILLANCE" />

        <div className="px-5 pt-6">
          <ModeToggle mode={mode} onChange={changeMode} />

          {mode === "guided" && (
            <>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">Symptom check first</h3>
              <p className="text-sm text-gray-400 mb-6">NG126 §1.4.25: symptoms outrank biochemistry.</p>

              <div className="space-y-3 mb-6">
                <YesNoField label="Haemodynamic instability?" value={haemodynamicInstability} onChange={setHaemodynamicInstability} />
                <YesNoField label="New or worsening pain?" value={worseningPain} onChange={setWorseningPain} />
                <YesNoField label="Heavy vaginal bleeding?" value={heavyBleeding} onChange={setHeavyBleeding} />
              </div>

              {override && <ResultCard result={override} />}
            </>
          )}

          {clear && (
            <>
              <h3 className="text-2xl font-bold text-gray-900 mb-1 mt-2">Serial hCG values</h3>
              <p className="text-sm text-gray-400 mb-6">Enter as results return. Each step compares to the previous value.</p>

              <div className="space-y-4">
                <NumberField label="Day 0 (baseline)" value={day0} onChange={setDay0} suffix="IU/L" />
                <NumberField label="Day 2" value={day2} onChange={setDay2} suffix="IU/L" />
                {r2 && <ResultCard result={r2} />}
                <NumberField label="Day 4" value={day4} onChange={setDay4} suffix="IU/L" />
                {r4 && <ResultCard result={r4} />}
                <NumberField label="Day 7" value={day7} onChange={setDay7} suffix="IU/L" />
                {r7 && <ResultCard result={r7} />}
              </div>

              {mode === "quick" && (
                <QuickAdvisory
                  open={caveatsOpen}
                  onToggle={() => setCaveatsOpen(o => !o)}
                  note="This assumes you've already excluded red-flag symptoms (haemodynamic instability, worsening pain, heavy bleeding). NG126 §1.4.25: symptoms outrank biochemistry — review the woman's condition if any symptoms change. If not already excluded — switch to Guided."
                />
              )}
            </>
          )}

          <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 mt-6">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-2">NICE NG126 §1.6.5 — verbatim</p>
            <p className="text-xs text-gray-600 leading-relaxed">
              For women with a tubal ectopic pregnancy being managed expectantly, repeat hCG levels on days 2, 4 and 7 after the original test.
              If hCG levels drop by 15% or more from the previous value on days 2, 4 and 7, then repeat weekly until a negative result (less than 20 IU/L) is obtained.
              If hCG levels do not fall by 15%, stay the same or rise from the previous value, review the woman's clinical condition and seek senior advice to help decide further management.
            </p>
          </div>

          <button onClick={reset} className="w-full mt-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-2xl transition-colors text-sm">
            Reset
          </button>

          <div className="mt-6">
            <SeeAlso links={CALCULATOR_CONNECTIONS.EXPECTANT_SURVEILLANCE} onNavigate={onNavigate} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Scenario 4: Post-MTX surveillance ────────────────────────────────

function MtxSurveillanceCalculator({ onBack, pdfs, onNavigate }) {
  const [mode, setMode] = useState(() => getCalcMode("mtx"));
  const [haemodynamicInstability, setHaemodynamicInstability] = useState(null);
  const [worseningPain, setWorseningPain] = useState(null);
  const [heavyBleeding, setHeavyBleeding] = useState(null);
  const [day1, setDay1] = useState("");
  const [day4, setDay4] = useState("");
  const [day7, setDay7] = useState("");
  const [caveatsOpen, setCaveatsOpen] = useState(false);

  const changeMode = (m) => {
    setMode(m);
    setCalcModeStored("mtx", m);
  };

  const symptomsAnswered = mode === "guided" &&
    haemodynamicInstability !== null && worseningPain !== null && heavyBleeding !== null;
  const override = symptomsAnswered
    ? symptomOverride({ worseningPain, heavyBleeding, haemodynamicInstability })
    : null;
  const clear = mode === "quick" || (symptomsAnswered && !override);

  const result = clear ? interpretMtxStep({
    day1: day1 ? parseFloat(day1) : null,
    day4: day4 ? parseFloat(day4) : null,
    day7: day7 ? parseFloat(day7) : null,
  }) : null;

  const reset = () => {
    setHaemodynamicInstability(null);
    setWorseningPain(null);
    setHeavyBleeding(null);
    setDay1(""); setDay4(""); setDay7("");
    setCaveatsOpen(false);
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-lg mx-auto">
        <StepHeader title="Post-methotrexate surveillance" subtitle="NICE NG126 §1.6.11 · RCOG GTG21 App II" onBack={onBack} pdfs={pdfs} shareId="MTX_SURVEILLANCE" />

        <div className="px-5 pt-6">
          <ModeToggle mode={mode} onChange={changeMode} />

          {mode === "guided" && (
            <>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">Symptom check first</h3>
              <p className="text-sm text-gray-400 mb-6">Pain/bleeding override hCG trend (NG126 §1.4.25).</p>

              <div className="space-y-3 mb-6">
                <YesNoField label="Haemodynamic instability?" value={haemodynamicInstability} onChange={setHaemodynamicInstability} />
                <YesNoField label="New or worsening pain?" value={worseningPain} onChange={setWorseningPain} />
                <YesNoField label="Heavy vaginal bleeding?" value={heavyBleeding} onChange={setHeavyBleeding} />
              </div>

              {override && <ResultCard result={override} />}
            </>
          )}

          {clear && (
            <>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">hCG after MTX</h3>
              <p className="text-sm text-gray-400 mb-6">Single-dose protocol: methotrexate 50 mg/m² IM on day 1.</p>

              <div className="space-y-4">
                <NumberField label="Day 1 (MTX given)" value={day1} onChange={setDay1} suffix="IU/L" />
                <NumberField label="Day 4" value={day4} onChange={setDay4} suffix="IU/L" />
                <NumberField label="Day 7" value={day7} onChange={setDay7} suffix="IU/L" />
              </div>

              {result && <div className="mt-6"><ResultCard result={result} /></div>}

              {mode === "quick" && (
                <QuickAdvisory
                  open={caveatsOpen}
                  onToggle={() => setCaveatsOpen(o => !o)}
                  note="This assumes you've already excluded red-flag symptoms (haemodynamic instability, worsening pain, heavy bleeding). NG126 §1.4.25: symptoms outrank biochemistry — review the woman's condition if any symptoms change. If not already excluded — switch to Guided."
                />
              )}
            </>
          )}

          <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 mt-3">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-2">General MTX advice</p>
            <ul className="space-y-1.5">
              {MTX_GENERAL_ADVICE.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-600 leading-relaxed">
                  <span className="text-gray-300 mt-0.5 shrink-0">•</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>

          <button onClick={reset} className="w-full mt-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-2xl transition-colors text-sm">
            Reset
          </button>

          <div className="mt-6">
            <SeeAlso links={CALCULATOR_CONNECTIONS.MTX_SURVEILLANCE} onNavigate={onNavigate} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Scenario 5: VTE risk score (GTG37a) ──────────────────────────────

function VteRiskCalculator({ onBack, pdfs, onNavigate }) {
  const [phase, setPhase] = useState(null); // "antenatal" | "postnatal"
  const [ticked, setTicked] = useState(new Set());
  const [weight, setWeight] = useState("");
  const [showResult, setShowResult] = useState(false);

  if (!phase) {
    return (
      <div className="min-h-screen pb-24">
        <div className="max-w-lg mx-auto">
          <StepHeader title="VTE risk score" subtitle="RCOG GTG37a Appendix III" onBack={onBack} pdfs={pdfs} shareId="VTE_RISK" />
          <div className="px-5 pt-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-1">When are you assessing?</h3>
            <p className="text-sm text-gray-400 mb-6">GTG37a uses different thresholds for antenatal and postnatal assessment.</p>

            <div className="space-y-3">
              <button
                onClick={() => setPhase("antenatal")}
                className="w-full flex items-start gap-4 px-5 py-5 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 active:scale-[0.99] transition-all text-left shadow-sm"
              >
                <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                <div>
                  <p className="text-base font-bold text-amber-700">Antenatal</p>
                  <p className="text-sm text-gray-500 mt-0.5">Booking, hospital admission, or any change in clinical status. Threshold: ≥4 = first trimester LMWH; 3 = from 28 weeks.</p>
                </div>
              </button>
              <button
                onClick={() => setPhase("postnatal")}
                className="w-full flex items-start gap-4 px-5 py-5 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 active:scale-[0.99] transition-all text-left shadow-sm"
              >
                <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                <div>
                  <p className="text-base font-bold text-rose-700">Postnatal</p>
                  <p className="text-sm text-gray-500 mt-0.5">Delivery suite assessment. Threshold: ≥2 = at least 10 days of LMWH; ≥4 (high-risk categories) = 6 weeks.</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const visible = VTE_RISK_FACTORS.filter(f => f.phases.includes(phase));
  const groups = ["Pre-existing", "Obstetric", "Transient"];

  const toggle = (factor) => {
    const next = new Set(ticked);
    if (next.has(factor.id)) {
      next.delete(factor.id);
    } else {
      next.add(factor.id);
      // Mutually exclusive items (e.g. BMI bands)
      if (factor.exclusiveWith) {
        factor.exclusiveWith.forEach(id => next.delete(id));
      }
    }
    setTicked(next);
  };

  const total = visible
    .filter(f => ticked.has(f.id))
    .reduce((sum, f) => sum + f.score, 0);

  const result = phase === "antenatal" ? interpretVteAntenatal(total) : interpretVtePostnatal(total);
  const dose = lmwhDoseForWeight(parseFloat(weight));

  const reset = () => {
    setPhase(null); setTicked(new Set()); setWeight(""); setShowResult(false);
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-lg mx-auto">
        <StepHeader
          title={`VTE risk score — ${phase}`}
          subtitle="RCOG GTG37a Appendix III"
          onBack={() => setPhase(null)}
        />

        <div className="px-5 pt-6">
          {!showResult && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900">Tick all that apply</h3>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Score</p>
                  <p className="text-2xl font-bold text-gray-900 tabular-nums">{total}</p>
                </div>
              </div>

              {groups.map(group => {
                const items = visible.filter(f => f.group === group);
                if (items.length === 0) return null;
                return (
                  <div key={group} className="mb-5">
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-2">{group} risk factors</p>
                    <div className="rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm divide-y divide-gray-100">
                      {items.map(f => {
                        const checked = ticked.has(f.id);
                        return (
                          <button
                            key={f.id}
                            onClick={() => toggle(f)}
                            className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${checked ? "bg-indigo-50" : "hover:bg-gray-50"}`}
                          >
                            <span className={`w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center mt-0.5 transition-colors ${checked ? "bg-indigo-600 border-indigo-600" : "border-gray-300 bg-white"}`}>
                              {checked && (
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-900 leading-snug">{f.label}</p>
                              {f.note && <p className="text-xs text-gray-400 mt-0.5 leading-snug">{f.note}</p>}
                            </div>
                            <span className="text-xs font-bold text-gray-400 tabular-nums shrink-0">+{f.score}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 mb-4">
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-2">Admission-based recommendations</p>
                <ul className="space-y-1.5">
                  {VTE_ADMISSION_NOTES.map((n, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-600 leading-relaxed">
                      <span className="text-gray-300 mt-0.5 shrink-0">•</span>
                      <span>{n}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => setShowResult(true)}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3.5 rounded-2xl transition-colors"
              >
                Show recommendation
              </button>
            </>
          )}

          {showResult && (
            <>
              <div className="flex items-baseline justify-between mb-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Total score</p>
                <p className="text-3xl font-bold text-gray-900 tabular-nums">{total}</p>
              </div>

              <ResultCard result={result} />

              {(result.category === "HIGH" || result.category === "INTERMEDIATE" || result.category === "INTERMEDIATE_28W") && (
                <>
                  <div className="mt-2 mb-4">
                    <NumberField label="Booking or current weight (for LMWH dose — GTG37a Table 3)" value={weight} onChange={setWeight} suffix="kg" />
                  </div>

                  {dose && (
                    <div className="rounded-2xl bg-indigo-50 border border-indigo-200 p-4 mb-3">
                      <p className="text-[11px] font-bold text-indigo-700 uppercase tracking-wide mb-3">LMWH prophylactic dose — GTG37a Table 3</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between gap-2">
                          <span className="text-gray-600">Enoxaparin</span>
                          <span className="font-semibold text-gray-900 text-right">{dose.enoxaparin}</span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="text-gray-600">Dalteparin</span>
                          <span className="font-semibold text-gray-900 text-right">{dose.dalteparin}</span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="text-gray-600">Tinzaparin</span>
                          <span className="font-semibold text-gray-900 text-right">{dose.tinzaparin}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-2 leading-relaxed">
                          * may be given in 2 divided doses. High prophylactic dose for women weighing 50–90 kg: enoxaparin {LMWH_HIGH_PROPHYLACTIC_50_TO_90.enoxaparin}, dalteparin {LMWH_HIGH_PROPHYLACTIC_50_TO_90.dalteparin}, tinzaparin {LMWH_HIGH_PROPHYLACTIC_50_TO_90.tinzaparin}.
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 mb-3">
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-2">Contraindications / cautions to LMWH — GTG37a App III</p>
                <ul className="space-y-1.5">
                  {LMWH_CONTRAINDICATIONS.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-600 leading-relaxed">
                      <span className="text-gray-300 mt-0.5 shrink-0">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => setShowResult(false)}
                className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-2xl transition-colors text-sm mb-2"
              >
                Back to risk factors
              </button>
              <button
                onClick={reset}
                className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-2xl transition-colors text-sm"
              >
                New assessment
              </button>
            </>
          )}

          <div className="mt-6">
            <SeeAlso links={CALCULATOR_CONNECTIONS.VTE_RISK} onNavigate={onNavigate} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Scenario: PUQE Score ─────────────────────────────────────────────

const PUQE_QUESTIONS = [
  {
    key: "nausea",
    label: "In the last 24 hours, for how long have you felt nauseated or sick to your stomach?",
    options: [
      { value: 1, label: "≤ 1 hour" },
      { value: 2, label: "1–3 hours" },
      { value: 3, label: "3–6 hours" },
      { value: 4, label: "6–9 hours" },
      { value: 5, label: "> 9 hours" },
    ],
  },
  {
    key: "vomiting",
    label: "In the last 24 hours, how many times have you vomited?",
    options: [
      { value: 1, label: "Not at all" },
      { value: 2, label: "1–2 times" },
      { value: 3, label: "3–4 times" },
      { value: 4, label: "5–6 times" },
      { value: 5, label: "> 6 times" },
    ],
  },
  {
    key: "retching",
    label: "In the last 24 hours, how many times have you had retching without bringing anything up?",
    options: [
      { value: 1, label: "Not at all" },
      { value: 2, label: "1–2 times" },
      { value: 3, label: "3–4 times" },
      { value: 4, label: "5–6 times" },
      { value: 5, label: "> 6 times" },
    ],
  },
];

function puqeResult(score) {
  if (score <= 6)  return { title: "Mild NVP", summary: `Score ${score} / 15`, detail: "Self-care and lifestyle measures are appropriate. Small frequent meals, ginger, pyridoxine (vitamin B6) 10–25 mg TDS. Review if symptoms worsen.", actions: ["Avoid triggers (fatty / spicy food, strong smells)", "Ginger (capsules, biscuits, tea) — modest evidence", "Pyridoxine (vitamin B6) 10–25 mg TDS", "Rest; acupressure wristband if preferred"], citation: "RCOG GTG69", color: "text-green-700", bg: "bg-green-50", border: "border-green-200" };
  if (score <= 12) return { title: "Moderate NVP", summary: `Score ${score} / 15`, detail: "Day care or ambulatory review recommended. Consider first-line antiemetics. Admit if unable to tolerate oral fluids or antiemetics.", actions: ["First-line: cyclizine 50 mg PO/IV/IM TDS, promethazine 12.5–25 mg QDS, or prochlorperazine 5–10 mg TDS", "Ensure adequate hydration — consider oral rehydration sachets", "Review weight; check urine ketones", "Admit if: ketones 2+, weight loss > 5%, unable to keep fluids down"], citation: "RCOG GTG69", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" };
  return { title: "Severe NVP / Hyperemesis Gravidarum", summary: `Score ${score} / 15`, detail: "Inpatient admission strongly recommended. Give Pabrinex (IV thiamine) BEFORE any glucose-containing fluids. Assess for Wernicke's encephalopathy.", actions: ["ADMIT — IV fluids (Hartmann's first choice), antiemetics IV", "Pabrinex (thiamine) 2 pairs IV in 100 ml NaCl over 30 min — BEFORE dextrose", "Second-line antiemetics: ondansetron 4–8 mg IV/PO, metoclopramide 10 mg IV TDS (max 5 days)", "Consider ondansetron, refractory cases: hydrocortisone 100 mg IV BD", "VTE risk assessment — prescribe LMWH if admitted", "Monitor electrolytes (K+, Na+, phosphate) every 24 hours"], citation: "RCOG GTG69", color: "text-red-700", bg: "bg-red-50", border: "border-red-200" };
}

function PuqeCalculator({ onBack, pdfs }) {
  const [answers, setAnswers] = useState({});

  const allAnswered = PUQE_QUESTIONS.every(q => answers[q.key] !== undefined);
  const score = allAnswered ? PUQE_QUESTIONS.reduce((sum, q) => sum + answers[q.key], 0) : null;
  const result = score !== null ? puqeResult(score) : null;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <StepHeader title="PUQE Score" subtitle="GTG69 · Nausea & Vomiting of Pregnancy" onBack={onBack} pdfs={pdfs} shareId="PUQE" />
      <div className="flex-1 overflow-y-auto pb-10">
        <div className="px-4 space-y-6 pt-4">

          {PUQE_QUESTIONS.map(q => (
            <div key={q.key}>
              <p className="text-sm font-semibold text-gray-700 leading-snug mb-3">{q.label}</p>
              <div className="grid grid-cols-1 gap-2">
                {q.options.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setAnswers(a => ({ ...a, [q.key]: opt.value }))}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm text-left transition-colors ${
                      answers[q.key] === opt.value
                        ? "bg-gray-900 border-gray-900 text-white"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 text-xs font-bold ${
                      answers[q.key] === opt.value ? "border-white text-white" : "border-gray-300 text-gray-400"
                    }`}>{opt.value}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {result && (
            <div className={`rounded-2xl border ${result.border} ${result.bg} p-5`}>
              <p className={`text-base font-bold ${result.color}`}>{result.title}</p>
              <p className="text-xs text-gray-500 font-medium mt-0.5">{result.summary}</p>
              <p className="text-sm text-gray-700 leading-relaxed mt-3">{result.detail}</p>
              <ul className="mt-3 space-y-1.5">
                {result.actions.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700 leading-relaxed">
                    <span className="text-gray-400 mt-1 shrink-0">›</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-4">{result.citation}</p>
            </div>
          )}

          {!allAnswered && (
            <p className="text-xs text-gray-400 text-center pb-4">Answer all 3 questions to see your score</p>
          )}

          <p className="text-[10px] text-gray-300 text-center leading-relaxed pb-4">
            PUQE is a screening tool — clinical assessment (weight, ketones, electrolytes) always takes precedence. A low PUQE with significant weight loss or electrolyte disturbance still warrants admission.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Entry point ──────────────────────────────────────────────────────

export default function CalculatorPage({ initialScenario, onNavigate, onOpenIOLPrioritizer }) {
  const [scenarioId, setScenarioId] = useState(initialScenario ?? null);

  if (!scenarioId) return <ScenarioList onSelect={setScenarioId} onOpenIOLPrioritizer={onOpenIOLPrioritizer} />;

  const back = () => setScenarioId(null);
  const pdfs = CALCULATOR_SCENARIOS.find(s => s.id === scenarioId)?.pdfs ?? [];

  if (scenarioId === "PUL") return <PulCalculator onBack={back} pdfs={pdfs} onNavigate={onNavigate} />;
  if (scenarioId === "ECTOPIC_DECISION") return <EctopicDecisionCalculator onBack={back} pdfs={pdfs} onNavigate={onNavigate} />;
  if (scenarioId === "EXPECTANT_SURVEILLANCE") return <ExpectantSurveillanceCalculator onBack={back} pdfs={pdfs} onNavigate={onNavigate} />;
  if (scenarioId === "MTX_SURVEILLANCE") return <MtxSurveillanceCalculator onBack={back} pdfs={pdfs} onNavigate={onNavigate} />;
  if (scenarioId === "VTE_RISK") return <VteRiskCalculator onBack={back} pdfs={pdfs} onNavigate={onNavigate} />;
  if (scenarioId === "PUQE") return <PuqeCalculator onBack={back} pdfs={pdfs} onNavigate={onNavigate} />;

  return <ScenarioList onSelect={setScenarioId} onOpenIOLPrioritizer={onOpenIOLPrioritizer} />;
}
