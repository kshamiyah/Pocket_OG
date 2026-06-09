import { useState } from "react";
import {
  CALCULATOR_SCENARIOS,
  interpretPUL,
  PUL_CAVEATS,
  interpretEctopicDecision,
  MTX_CONTRAINDICATIONS,
  interpretExpectantStep,
  interpretMtxStep,
  MTX_GENERAL_ADVICE,
} from "../data/calculator";

// ─── Step 0: scenario picker ──────────────────────────────────────────

function ScenarioList({ onSelect }) {
  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-lg mx-auto">
        <div className="px-5 pt-16 pb-6">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Calculator</h2>
          <p className="text-sm text-gray-400 mt-1">β-hCG — verbatim from NICE NG126 & RCOG GTG21</p>
        </div>

        <div className="px-5">
          <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm divide-y divide-gray-100">
            {CALCULATOR_SCENARIOS.map(s => (
              <button
                key={s.id}
                onClick={() => onSelect(s.id)}
                className="flex items-start gap-3 w-full px-4 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
              >
                <div className={`w-1 h-12 rounded-full shrink-0 ${s.color.accent}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 leading-snug">{s.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.subtitle}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-1.5">{s.source}</p>
                </div>
                <svg className="w-4 h-4 text-gray-300 shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>

          <p className="text-[10px] text-gray-300 text-center mt-6 px-4 leading-relaxed">
            All thresholds and interpretation text are taken verbatim from NICE NG126 (last updated August 2023) and RCOG/AEPU Green-top Guideline No. 21 (November 2016). This tool supports — not replaces — clinical judgement.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Shared chrome ────────────────────────────────────────────────────

function StepHeader({ title, subtitle, onBack }) {
  return (
    <div className="px-5 pt-14 pb-2 flex items-center gap-3">
      <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors shrink-0">
        <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div>
        <p className="text-xs text-gray-400 font-medium">{title}</p>
        {subtitle && <p className="text-[10px] text-gray-300 font-medium mt-0.5">{subtitle}</p>}
      </div>
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

// ─── Scenario 1: PUL ──────────────────────────────────────────────────

function PulCalculator({ onBack }) {
  const [hcg1, setHcg1] = useState("");
  const [hcg2, setHcg2] = useState("");
  const [hours, setHours] = useState("48");
  const [result, setResult] = useState(null);

  const submit = () => {
    const a = parseFloat(hcg1);
    const b = parseFloat(hcg2);
    const h = parseFloat(hours);
    if (!a || !b || !h) return;
    setResult(interpretPUL({ hcg1: a, hcg2: b, hoursBetween: h }));
  };

  const reset = () => {
    setHcg1("");
    setHcg2("");
    setHours("48");
    setResult(null);
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-lg mx-auto">
        <StepHeader title="PUL — serial hCG" subtitle="NICE NG126 §1.4.27–1.4.32" onBack={onBack} />

        <div className="px-5 pt-6">
          {!result && (
            <>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">Enter both hCG levels</h3>
              <p className="text-sm text-gray-400 mb-6">Samples must be ≥48 h apart (NG126 §1.4.27).</p>

              <div className="space-y-4">
                <NumberField label="First hCG" value={hcg1} onChange={setHcg1} suffix="IU/L" autoFocus={false} />
                <NumberField label="Second hCG" value={hcg2} onChange={setHcg2} suffix="IU/L" />
                <NumberField label="Hours between samples" value={hours} onChange={setHours} suffix="hours" />
              </div>

              <button
                onClick={submit}
                disabled={!hcg1 || !hcg2 || !hours}
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
        </div>
      </div>
    </div>
  );
}

// ─── Scenario 2: Ectopic decision ─────────────────────────────────────

function EctopicDecisionCalculator({ onBack }) {
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
        <StepHeader title="Tubal ectopic — initial management" subtitle="NICE NG126 §1.6.3–1.6.10 · RCOG GTG21 §5.1" onBack={onBack} />

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
        </div>
      </div>
    </div>
  );
}

// ─── Scenario 3: Expectant surveillance ───────────────────────────────

function ExpectantSurveillanceCalculator({ onBack }) {
  const [day0, setDay0] = useState("");
  const [day2, setDay2] = useState("");
  const [day4, setDay4] = useState("");
  const [day7, setDay7] = useState("");

  const r2 = interpretExpectantStep({ previous: parseFloat(day0), current: parseFloat(day2), dayLabel: "Day 2" });
  const r4 = interpretExpectantStep({ previous: parseFloat(day2), current: parseFloat(day4), dayLabel: "Day 4" });
  const r7 = interpretExpectantStep({ previous: parseFloat(day4), current: parseFloat(day7), dayLabel: "Day 7" });

  const reset = () => { setDay0(""); setDay2(""); setDay4(""); setDay7(""); };

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-lg mx-auto">
        <StepHeader title="Expectant management surveillance" subtitle="NICE NG126 §1.6.5" onBack={onBack} />

        <div className="px-5 pt-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-1">Serial hCG values</h3>
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
        </div>
      </div>
    </div>
  );
}

// ─── Scenario 4: Post-MTX surveillance ────────────────────────────────

function MtxSurveillanceCalculator({ onBack }) {
  const [day1, setDay1] = useState("");
  const [day4, setDay4] = useState("");
  const [day7, setDay7] = useState("");

  const result = interpretMtxStep({
    day1: day1 ? parseFloat(day1) : null,
    day4: day4 ? parseFloat(day4) : null,
    day7: day7 ? parseFloat(day7) : null,
  });

  const reset = () => { setDay1(""); setDay4(""); setDay7(""); };

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-lg mx-auto">
        <StepHeader title="Post-methotrexate surveillance" subtitle="NICE NG126 §1.6.11 · RCOG GTG21 App II" onBack={onBack} />

        <div className="px-5 pt-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-1">hCG after MTX</h3>
          <p className="text-sm text-gray-400 mb-6">Single-dose protocol: methotrexate 50 mg/m² IM on day 1.</p>

          <div className="space-y-4">
            <NumberField label="Day 1 (MTX given)" value={day1} onChange={setDay1} suffix="IU/L" />
            <NumberField label="Day 4" value={day4} onChange={setDay4} suffix="IU/L" />
            <NumberField label="Day 7" value={day7} onChange={setDay7} suffix="IU/L" />
          </div>

          {result && <div className="mt-6"><ResultCard result={result} /></div>}

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
        </div>
      </div>
    </div>
  );
}

// ─── Entry point ──────────────────────────────────────────────────────

export default function CalculatorPage() {
  const [scenarioId, setScenarioId] = useState(null);

  if (!scenarioId) return <ScenarioList onSelect={setScenarioId} />;

  const back = () => setScenarioId(null);

  if (scenarioId === "PUL") return <PulCalculator onBack={back} />;
  if (scenarioId === "ECTOPIC_DECISION") return <EctopicDecisionCalculator onBack={back} />;
  if (scenarioId === "EXPECTANT_SURVEILLANCE") return <ExpectantSurveillanceCalculator onBack={back} />;
  if (scenarioId === "MTX_SURVEILLANCE") return <MtxSurveillanceCalculator onBack={back} />;

  return <ScenarioList onSelect={setScenarioId} />;
}
