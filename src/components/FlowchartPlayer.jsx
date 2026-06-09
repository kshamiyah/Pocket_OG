import { useState } from "react";

const NODE_STYLES = {
  action:  { badge: "bg-blue-100 text-blue-700",   icon: "→", bar: "bg-blue-500" },
  decision:{ badge: "bg-violet-100 text-violet-700", icon: "?", bar: "bg-violet-500" },
  alert:   { badge: "bg-amber-100 text-amber-700",  icon: "⚠", bar: "bg-amber-400" },
  end:     { badge: "bg-gray-100 text-gray-600",    icon: "✓", bar: "bg-gray-400" },
};

// Special end-node overrides
const END_STYLE_OVERRIDES = {
  "end-unsuccessful": { badge: "bg-red-100 text-red-700", icon: "✕", bar: "bg-red-400" },
  "end-ds":           { badge: "bg-green-100 text-green-700", icon: "✓", bar: "bg-green-500" },
  "end-mlu":          { badge: "bg-teal-100 text-teal-700", icon: "✓", bar: "bg-teal-500" },
};

function getSublabelItems(sublabel) {
  if (Array.isArray(sublabel)) return sublabel.filter(Boolean);
  if (typeof sublabel !== "string") return [];
  return sublabel
    .split("·")
    .map(item => item.trim())
    .filter(Boolean);
}

export default function FlowchartPlayer({ flowchart, theme, onClose, pdfUrl }) {
  const [currentId, setCurrentId] = useState(flowchart.startId);
  const [history, setHistory] = useState([]); // [{ nodeId, label }]

  const node = flowchart.nodes[currentId];
  const styles = END_STYLE_OVERRIDES[currentId] ?? NODE_STYLES[node.type] ?? NODE_STYLES.action;
  const accentTheme = theme ?? { solid: "bg-[#0E4286]", solidHover: "hover:bg-[#0B3872]" };

  const choose = (option) => {
    setHistory(prev => [...prev, { nodeId: currentId, label: option.label }]);
    setCurrentId(option.next);
  };

  const advance = () => {
    setHistory(prev => [...prev, { nodeId: currentId, label: null }]);
    setCurrentId(node.next);
  };

  const goBack = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    setCurrentId(prev.nodeId);
  };

  const restart = () => {
    setHistory([]);
    setCurrentId(flowchart.startId);
  };

  const isEnd = node.type === "end";
  const stepNum = history.length + 1;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Helvetica Neue', sans-serif", paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}>

      {/* Header */}
      <div className="shrink-0 border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <div className={`w-7 h-7 rounded-xl ${accentTheme.solid} flex items-center justify-center shrink-0`}>
          <span className="text-white text-xs font-semibold">Rx</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 leading-tight">{flowchart.title}</p>
          <p className="text-xs text-gray-400">{flowchart.subtitle}</p>
        </div>
        {pdfUrl && (
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors shrink-0 px-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            PDF
          </a>
        )}
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors text-lg leading-none shrink-0"
        >×</button>
      </div>

      {/* Path trail */}
      {history.length > 0 && (
        <div className="shrink-0 px-4 py-2 border-b border-gray-50 overflow-x-auto">
          <div className="flex gap-1.5 items-center min-w-max">
            {history.map((h, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {h.label && (
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs text-gray-500 whitespace-nowrap">
                    {h.label}
                  </span>
                )}
                <span className="text-gray-300 text-xs">›</span>
              </span>
            ))}
            <span className="px-2 py-0.5 rounded-full bg-teal-50 text-xs text-teal-600 font-medium whitespace-nowrap">
              Step {stepNum}
            </span>
          </div>
        </div>
      )}

      {/* Main content — scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-5">
        <div className="max-w-lg mx-auto">

          {/* Node type badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${styles.badge}`}>
              <span>{styles.icon}</span>
              <span className="capitalize">{node.type === "end" ? node.title : node.type}</span>
            </span>
            {!isEnd && (
              <span className="text-xs text-gray-400">Step {stepNum}</span>
            )}
          </div>

          {/* Accent bar */}
          <div className={`h-1 w-12 rounded-full mb-4 ${styles.bar}`} />

          {/* Title */}
          <h2 className="text-xl font-semibold text-gray-900 leading-snug mb-3">{node.title}</h2>

          {/* Main text */}
          {node.text && (
            <p className="text-sm text-gray-700 leading-relaxed mb-3 whitespace-pre-line">{node.text}</p>
          )}

          {/* Items list */}
          {node.items && node.items.length > 0 && (
            <ul className="mb-4 space-y-2">
              {node.items.map((item, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700 leading-snug">
                  <span className="text-teal-400 shrink-0 mt-0.5">›</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Decision options */}
          {node.type === "decision" && node.options && (
            <div className="mt-5 space-y-2.5">
              {node.options.map((opt, i) => {
                const sublabelItems = getSublabelItems(opt.sublabel);

                return (
                  <button
                    key={i}
                    onClick={() => choose(opt)}
                    className="w-full text-left px-4 py-3.5 rounded-2xl border-2 border-gray-200 hover:border-teal-400 hover:bg-teal-50 transition-all group"
                  >
                    <p className="text-sm font-medium text-gray-800 group-hover:text-teal-700 leading-snug">{opt.label}</p>
                    {sublabelItems.length > 1 && (
                      <ul className="mt-1 space-y-1 pl-4 text-xs text-gray-400 group-hover:text-teal-600 list-disc">
                        {sublabelItems.map((item, itemIndex) => (
                          <li key={itemIndex} className="leading-snug marker:text-gray-300 group-hover:marker:text-teal-300">
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                    {sublabelItems.length === 1 && (
                      <p className="text-xs text-gray-400 mt-0.5 group-hover:text-teal-600">{sublabelItems[0]}</p>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Action / alert — continue button */}
          {(node.type === "action" || node.type === "alert") && node.next && (
            <button
              onClick={advance}
              className={`mt-5 w-full py-3.5 rounded-2xl text-sm font-semibold transition-colors ${
                node.type === "alert"
                  ? "bg-amber-500 hover:bg-amber-600 text-white"
                  : `${accentTheme.solid} ${accentTheme.solidHover} text-white`
              }`}
            >
              {node.type === "alert" ? "Understood — continue →" : "Continue →"}
            </button>
          )}

          {/* End node — restart / close */}
          {isEnd && (
            <div className="mt-5 flex gap-2">
              <button
                onClick={restart}
                className="flex-1 py-3.5 rounded-2xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                ↺ Start over
              </button>
              <button
                onClick={onClose}
                className={`flex-1 py-3.5 rounded-2xl text-sm font-semibold ${accentTheme.solid} ${accentTheme.solidHover} text-white transition-colors`}
              >
                Close
              </button>
            </div>
          )}

          {/* Disclaimer */}
          <p className="text-xs text-gray-300 mt-8 text-center leading-relaxed">
            GL861 V6.10 · May 2026 · Always escalate when uncertain
          </p>
        </div>
      </div>

      {/* Sticky bottom nav */}
      <div className="shrink-0 border-t border-gray-100 px-4 py-3 flex justify-between items-center">
        <button
          onClick={goBack}
          disabled={history.length === 0}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <span>←</span> Back
        </button>
        <button
          onClick={restart}
          className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
        >
          ↺ Restart
        </button>
      </div>

    </div>
  );
}
