import { useState } from "react";
import { CLARK_PROTOCOLS, CLARK_CATEGORIES } from "../data/clark";

// ─── Step type badge ──────────────────────────────────────────────────────────

const TYPE_META = {
  checklist:  { icon: "→", label: "Checklist",  cls: "bg-blue-100 text-blue-700"     },
  calculator: { icon: "∑", label: "Score",       cls: "bg-violet-100 text-violet-700" },
  treatment:  { icon: "Rx",label: "Treatment",   cls: "bg-emerald-100 text-emerald-700" },
  escalation: { icon: "⚠", label: "Escalation", cls: "bg-amber-100 text-amber-700"   },
  end:        { icon: "✓", label: "Complete",    cls: "bg-gray-100 text-gray-600"     },
};

function StepBadge({ type, stepNum }) {
  const meta = TYPE_META[type] ?? TYPE_META.checklist;
  return (
    <div className="flex items-center gap-2">
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${meta.cls}`}>
        <span>{meta.icon}</span>
        <span>{meta.label}</span>
      </span>
      {type !== "end" && <span className="text-xs text-gray-400">Step {stepNum}</span>}
    </div>
  );
}

// ─── Severity badge ───────────────────────────────────────────────────────────

const SEVERITY_CLS = {
  green: "bg-green-100 text-green-700 border-green-200",
  amber: "bg-amber-100 text-amber-700 border-amber-200",
  red:   "bg-red-100 text-red-700 border-red-200",
};

// ─── Checklist node ───────────────────────────────────────────────────────────

function ChecklistNode({ node, stepNum, onContinue }) {
  const [checked, setChecked] = useState({});
  const toggle = (i) => setChecked(prev => ({ ...prev, [i]: !prev[i] }));
  const checkedCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="px-4 py-5 max-w-lg mx-auto">
      <StepBadge type="checklist" stepNum={stepNum} />
      <h2 className="text-xl font-bold text-gray-900 mt-3 mb-1">{node.title}</h2>
      {node.subtitle && <p className="text-sm text-gray-500 mb-4 leading-snug">{node.subtitle}</p>}

      {node.alert && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 flex gap-2.5">
          <span className="text-red-500 shrink-0 mt-0.5">⚠</span>
          <p className="text-sm text-red-700 font-medium leading-snug">{node.alert}</p>
        </div>
      )}

      <ul className="space-y-2 mb-6">
        {node.items.map((item, i) => (
          <li
            key={i}
            onClick={() => toggle(i)}
            className={`flex gap-3 items-start px-4 py-3 rounded-2xl border cursor-pointer select-none transition-all ${
              checked[i]
                ? "bg-emerald-50 border-emerald-200"
                : "bg-white border-gray-100 hover:border-gray-200 active:bg-gray-50"
            }`}
          >
            <div className={`mt-0.5 w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
              checked[i] ? "bg-emerald-500 border-emerald-500" : "border-gray-300"
            }`}>
              {checked[i] && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className={`text-sm leading-snug ${checked[i] ? "text-gray-400 line-through" : "text-gray-800"}`}>
              {item}
            </span>
          </li>
        ))}
      </ul>

      <button
        onClick={onContinue}
        className="w-full py-3.5 rounded-2xl text-sm font-semibold bg-gray-900 hover:bg-black text-white transition-colors"
      >
        {checkedCount > 0
          ? `Continue (${checkedCount}/${node.items.length} checked) →`
          : "Continue →"}
      </button>
      {checkedCount < node.items.length && (
        <p className="text-xs text-gray-400 text-center mt-2">You can continue without checking all items</p>
      )}
    </div>
  );
}

// ─── Calculator (PUQE) node ───────────────────────────────────────────────────

const RESULT_CLS = {
  green: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700" },
  amber: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" },
  red:   { bg: "bg-red-50",   border: "border-red-200",   text: "text-red-700"   },
};

function CalculatorNode({ node, stepNum, scores, setScores, onContinue }) {
  const fields = node.fields ?? [];
  const total = fields.reduce((sum, f) => sum + (scores[f.id] ?? 0), 0);
  const allAnswered = fields.every(f => scores[f.id] !== undefined);
  const result = allAnswered
    ? (node.scoring ?? []).find(s => total >= s.min && total <= s.max)
    : null;
  const rc = result ? (RESULT_CLS[result.color] ?? RESULT_CLS.green) : null;

  return (
    <div className="px-4 py-5 max-w-lg mx-auto">
      <StepBadge type="calculator" stepNum={stepNum} />
      <h2 className="text-xl font-bold text-gray-900 mt-3 mb-1">{node.title}</h2>
      {node.subtitle && <p className="text-sm text-gray-500 mb-1 leading-snug">{node.subtitle}</p>}
      {node.description && <p className="text-xs text-gray-400 mb-5 leading-snug">{node.description}</p>}

      <div className="space-y-6 mb-6">
        {fields.map(field => (
          <div key={field.id}>
            <p className="text-sm font-semibold text-gray-800 mb-2.5 leading-snug">{field.question}</p>
            <div className="space-y-1.5">
              {field.options.map(opt => (
                <button
                  key={opt.score}
                  onClick={() => setScores(prev => ({ ...prev, [field.id]: opt.score }))}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm text-left transition-all border ${
                    scores[field.id] === opt.score
                      ? "bg-gray-900 border-gray-900 text-white font-medium"
                      : "bg-white border-gray-100 hover:border-gray-300 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Running score */}
      <div className="flex items-center justify-between border border-gray-100 rounded-2xl px-4 py-3 mb-3">
        <span className="text-sm text-gray-500">PUQE Total</span>
        <span className="text-2xl font-bold text-gray-900">
          {allAnswered ? total : "—"}
          <span className="text-sm font-normal text-gray-400 ml-1">/ 15</span>
        </span>
      </div>

      {result && rc && (
        <div className={`rounded-2xl px-4 py-3 mb-4 border ${rc.bg} ${rc.border}`}>
          <p className={`text-sm font-bold ${rc.text}`}>{result.label}</p>
          <p className={`text-xs mt-0.5 ${rc.text} opacity-75`}>
            Score {total} · range {result.min}–{result.max}
          </p>
        </div>
      )}

      <button
        onClick={() => result && onContinue(result.next, result.label)}
        disabled={!allAnswered}
        className="w-full py-3.5 rounded-2xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-gray-900 hover:bg-black text-white"
      >
        {allAnswered
          ? `See ${result?.label ?? "management"} →`
          : "Answer all three questions to continue"}
      </button>
    </div>
  );
}

// ─── Treatment node ───────────────────────────────────────────────────────────

function TreatmentNode({ node, stepNum, onContinue }) {
  return (
    <div className="px-4 py-5 max-w-lg mx-auto">
      <StepBadge type="treatment" stepNum={stepNum} />
      {node.badge && (
        <span className={`inline-flex items-center mt-2 mb-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${SEVERITY_CLS[node.badge.color] ?? SEVERITY_CLS.green}`}>
          {node.badge.label}
        </span>
      )}
      <h2 className="text-xl font-bold text-gray-900 mt-1 mb-4">{node.title}</h2>

      <div className="space-y-4 mb-6">
        {(node.sections ?? []).map((section, si) => (
          <div key={si} className="rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">{section.title}</p>
              {section.note && <p className="text-xs text-gray-400 mt-0.5">{section.note}</p>}
            </div>
            {section.alert && (
              <div className="px-4 py-2.5 bg-red-50 border-b border-red-100 flex gap-2">
                <span className="text-red-500 text-xs shrink-0 mt-0.5">⚠</span>
                <p className="text-xs text-red-700 font-medium leading-snug">{section.alert}</p>
              </div>
            )}
            {section.items && (
              <ul className="divide-y divide-gray-50">
                {section.items.map((item, ii) => (
                  <li key={ii} className="flex gap-2.5 px-4 py-2.5">
                    <span className="text-emerald-400 shrink-0 mt-0.5">›</span>
                    <span className="text-sm text-gray-700 leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            )}
            {section.drugs && (
              <div className="divide-y divide-gray-50">
                {section.drugs.map((drug, di) => (
                  <div key={di} className="px-4 py-3">
                    <div className="flex flex-wrap gap-2 items-baseline">
                      <span className="text-sm font-semibold text-gray-900">{drug.drug}</span>
                      <span className="text-sm text-gray-600">{drug.dose}</span>
                    </div>
                    {drug.note && <p className="text-xs text-gray-400 mt-0.5 leading-snug">{drug.note}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={onContinue}
        className="w-full py-3.5 rounded-2xl text-sm font-semibold bg-gray-900 hover:bg-black text-white transition-colors"
      >
        Continue →
      </button>
    </div>
  );
}

// ─── Escalation node ──────────────────────────────────────────────────────────

function EscalationNode({ node, stepNum, onContinue }) {
  return (
    <div className="px-4 py-5 max-w-lg mx-auto">
      <StepBadge type="escalation" stepNum={stepNum} />
      {node.badge && (
        <span className={`inline-flex items-center mt-2 mb-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${SEVERITY_CLS[node.badge.color] ?? SEVERITY_CLS.amber}`}>
          {node.badge.label}
        </span>
      )}
      <h2 className="text-xl font-bold text-gray-900 mt-1 mb-1">{node.title}</h2>
      {node.subtitle && <p className="text-sm text-gray-500 mb-3 leading-snug">{node.subtitle}</p>}

      {node.alert && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
          <p className="text-sm font-bold text-red-700">⚠ {node.alert}</p>
        </div>
      )}

      <ul className="space-y-2 mb-6">
        {(node.items ?? []).map((item, i) => (
          <li key={i} className="flex gap-2.5 px-4 py-3 bg-amber-50 border border-amber-100 rounded-2xl">
            <span className="text-amber-500 shrink-0 mt-0.5 text-sm">›</span>
            <span className="text-sm text-gray-800 leading-snug">{item}</span>
          </li>
        ))}
      </ul>

      {onContinue && (
        <button
          onClick={onContinue}
          className="w-full py-3.5 rounded-2xl text-sm font-semibold bg-gray-900 hover:bg-black text-white transition-colors"
        >
          Continue →
        </button>
      )}
    </div>
  );
}

// ─── End node ─────────────────────────────────────────────────────────────────

function EndNode({ node, onRestart, onClose }) {
  return (
    <div className="px-4 py-5 max-w-lg mx-auto">
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
        ✓ Complete
      </span>
      <h2 className="text-xl font-bold text-gray-900 mt-3 mb-1">{node.title}</h2>
      {node.subtitle && <p className="text-sm text-gray-500 mb-4 leading-snug">{node.subtitle}</p>}

      <ul className="space-y-2 mb-6">
        {(node.items ?? []).map((item, i) => (
          <li key={i} className="flex gap-3 items-start">
            <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-[10px] font-bold text-gray-500">{i + 1}</span>
            </span>
            <span className="text-sm text-gray-700 leading-snug">{item}</span>
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <button
          onClick={onRestart}
          className="flex-1 py-3.5 rounded-2xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          ↺ New patient
        </button>
        <button
          onClick={onClose}
          className="flex-1 py-3.5 rounded-2xl text-sm font-semibold bg-gray-900 hover:bg-black text-white transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
}

// ─── Protocol session runner ──────────────────────────────────────────────────

function ClarkSession({ protocol, onExit }) {
  const [currentId, setCurrentId] = useState(protocol.startId);
  const [history, setHistory] = useState([]);
  const [scores, setScores] = useState({});

  const node = protocol.nodes[currentId];
  const stepNum = history.length + 1;
  const isEnd = node.type === "end";

  const advance = (nextId, label) => {
    setHistory(prev => [...prev, { nodeId: currentId, label: label ?? null }]);
    setCurrentId(nextId);
    setScores({});
  };

  const goBack = () => {
    if (history.length === 0) { onExit(); return; }
    const prev = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    setCurrentId(prev.nodeId);
    setScores({});
  };

  const restart = () => {
    setCurrentId(protocol.startId);
    setHistory([]);
    setScores({});
  };

  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div className="shrink-0 border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button
          onClick={goBack}
          aria-label={history.length === 0 ? "Exit session" : "Go back one step"}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {history.length === 0 ? "Exit" : "Back"}
        </button>
        <div className="flex-1 text-center min-w-0">
          <p className="text-[10px] font-black text-emerald-600 tracking-[0.2em] uppercase">CLARK</p>
          <p className="text-sm font-semibold text-gray-900 leading-tight truncate">{protocol.title}</p>
        </div>
        <button
          onClick={restart}
          aria-label="Restart session from beginning"
          className="text-sm text-gray-400 hover:text-gray-700 transition-colors shrink-0 px-1"
        >
          ↺
        </button>
      </div>

      {/* Path trail */}
      {history.length > 0 && (
        <div className="shrink-0 px-4 py-2 border-b border-gray-50 overflow-x-auto">
          <div className="flex gap-1.5 items-center min-w-max">
            {history.map((h, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {h.label && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-xs text-emerald-600 whitespace-nowrap">
                    {h.label}
                  </span>
                )}
                <span className="text-gray-300 text-xs">›</span>
              </span>
            ))}
            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs text-gray-500 font-medium whitespace-nowrap">
              Step {stepNum}
            </span>
          </div>
        </div>
      )}

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {node.type === "checklist" && (
          <ChecklistNode node={node} stepNum={stepNum} onContinue={() => advance(node.next)} />
        )}
        {node.type === "calculator" && (
          <CalculatorNode
            node={node}
            stepNum={stepNum}
            scores={scores}
            setScores={setScores}
            onContinue={(nextId, label) => advance(nextId, label)}
          />
        )}
        {node.type === "treatment" && (
          <TreatmentNode node={node} stepNum={stepNum} onContinue={() => advance(node.next)} />
        )}
        {node.type === "escalation" && (
          <EscalationNode
            node={node}
            stepNum={stepNum}
            onContinue={node.next ? () => advance(node.next) : null}
          />
        )}
        {node.type === "end" && (
          <EndNode node={node} onRestart={restart} onClose={onExit} />
        )}
      </div>

      {/* Bottom nav */}
      {!isEnd && (
        <div className="shrink-0 border-t border-gray-100 px-4 py-3 flex justify-between items-center">
          <button
            onClick={goBack}
            disabled={history.length === 0}
            aria-label="Go back one step"
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Back
          </button>
          <button
            onClick={restart}
            aria-label="Restart from beginning"
            className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            ↺ Restart
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Home — condition picker ──────────────────────────────────────────────────

function ClarkHome({ onSelect, onClose }) {
  return (
    <div className="flex flex-col h-full">

      {/* Branding header */}
      <div className="shrink-0 px-5 pt-14 pb-5">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-[11px] font-bold text-emerald-400 tracking-[0.2em] uppercase mb-1.5">
              Clinical co-pilot
            </p>
            <h1 className="text-5xl font-black text-white tracking-tight leading-none">CLARK</h1>
            <p className="text-sm text-gray-400 mt-2">Sees patients with you · Step by step</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close CLARK"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors mt-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
          <p className="text-xs text-gray-400 leading-relaxed">
            Choose a presenting complaint. CLARK walks you through history, examination, investigations, scoring, and management — all in one place.
          </p>
        </div>
      </div>

      {/* Conditions list — scrollable */}
      <div className="flex-1 overflow-y-auto px-5 pb-10">
        {CLARK_CATEGORIES.map(category => (
          <div key={category.id} className="mb-7">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">
              {category.label}
            </p>
            <div className="space-y-2">
              {category.protocols.map(proto =>
                proto.available ? (
                  <button
                    key={proto.id}
                    onClick={() => onSelect(CLARK_PROTOCOLS[proto.id])}
                    className="w-full text-left bg-white rounded-2xl px-4 py-4 flex items-center gap-3 hover:bg-gray-50 active:bg-gray-100 transition-colors shadow-sm"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 leading-snug">{proto.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{proto.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                        {proto.guideline}
                      </span>
                      <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ) : (
                  <div
                    key={proto.id}
                    className="w-full text-left bg-white/5 border border-white/8 rounded-2xl px-4 py-3.5 flex items-center gap-3 opacity-50 cursor-default"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-300 leading-snug">{proto.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{proto.subtitle}</p>
                    </div>
                    <span className="text-[10px] font-semibold text-gray-500 bg-white/10 px-2 py-0.5 rounded-full shrink-0">
                      Soon
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        ))}

        <p className="text-xs text-gray-600 text-center leading-relaxed pb-2">
          CLARK is a clinical aid — not a substitute for clinical judgement.<br />
          Always escalate when uncertain.
        </p>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function Clark({ onClose }) {
  const [activeProtocol, setActiveProtocol] = useState(null);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Helvetica Neue', sans-serif" }}
    >
      {activeProtocol ? (
        <div className="flex flex-col h-full bg-white">
          <ClarkSession protocol={activeProtocol} onExit={() => setActiveProtocol(null)} />
        </div>
      ) : (
        <div className="flex flex-col h-full bg-gray-950">
          <ClarkHome onSelect={setActiveProtocol} onClose={onClose} />
        </div>
      )}
    </div>
  );
}
