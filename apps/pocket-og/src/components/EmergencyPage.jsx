import { useState, useEffect } from "react";
import { PPH_EMERGENCY } from "../data/emergency";

const ESCALATE_COLORS = {
  minor:   "bg-orange-600 active:bg-orange-700",
  major:   "bg-red-700 active:bg-red-800",
  massive: null,
};

function fmt(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m`;
  return `${m}m ${String(s).padStart(2, "0")}s`;
}

function Section({ title, badge, sublabel, children }) {
  return (
    <div className="mx-4 mb-4">
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-sm font-bold text-gray-800">{title}</span>
        {badge !== undefined && (
          <span className="text-xs font-semibold bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{badge}</span>
        )}
        {sublabel && <span className="text-xs text-gray-400">{sublabel}</span>}
      </div>
      {children}
    </div>
  );
}

function ChecklistItem({ item, checked, onToggle }) {
  const done = checked.has(item.id);
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-start gap-3 rounded-xl px-4 py-3.5 text-left transition-all ${
        done ? "bg-green-50 border border-green-200" : "bg-white border border-gray-100 shadow-sm"
      }`}
    >
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
        done ? "bg-green-500 border-green-500" : "border-gray-300"
      }`}>
        {done && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className={`text-sm leading-snug ${done ? "text-gray-400 line-through" : "text-gray-900 font-medium"}`}>
        {item.text}
      </span>
    </button>
  );
}

function DrugCard({ drug, carboprostCount, setCarboprostCount, txaBirthTime, setTxaBirthTime, txaElapsedSec, txaRemainingS, txaWindowPct, txaExpired, txaUrgent, txaWarning }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-4 py-3.5">
        <p className="text-sm font-bold text-gray-900">{drug.name}</p>
        <p className="text-base font-semibold text-red-700 mt-0.5">{drug.dose}</p>
        {drug.route && <p className="text-xs text-gray-500 mt-0.5">{drug.route}</p>}
        {drug.note && (
          <p className="text-xs text-amber-800 bg-amber-50 rounded-lg px-2.5 py-1.5 mt-2 leading-snug">{drug.note}</p>
        )}
      </div>

      {drug.countable && (
        <div className={`px-4 py-3 border-t ${carboprostCount >= drug.maxDoses ? "bg-red-50 border-red-200" : carboprostCount >= 6 ? "bg-amber-50 border-amber-200" : "bg-gray-50 border-gray-100"}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-600">Doses given</p>
              <p className={`text-xs mt-0.5 font-medium ${
                carboprostCount >= drug.maxDoses ? "text-red-600" :
                carboprostCount >= 6 ? "text-amber-700" : "text-gray-400"
              }`}>
                {carboprostCount >= drug.maxDoses
                  ? "⚠ MAXIMUM REACHED — do not give more"
                  : carboprostCount >= 6
                  ? `⚠ ${drug.maxDoses - carboprostCount} dose${drug.maxDoses - carboprostCount === 1 ? "" : "s"} remaining`
                  : `Max ${drug.maxDoses} doses`
                }
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCarboprostCount(c => Math.max(0, c - 1))}
                disabled={carboprostCount === 0}
                className="w-10 h-10 rounded-xl bg-gray-200 hover:bg-gray-300 active:bg-gray-400 disabled:opacity-30 flex items-center justify-center text-xl font-bold text-gray-700 transition-colors"
              >
                −
              </button>
              <span className={`text-2xl font-bold w-8 text-center tabular-nums ${
                carboprostCount >= drug.maxDoses ? "text-red-600" :
                carboprostCount >= 6 ? "text-amber-600" : "text-gray-900"
              }`}>
                {carboprostCount}
              </span>
              <button
                onClick={() => setCarboprostCount(c => Math.min(drug.maxDoses, c + 1))}
                disabled={carboprostCount >= drug.maxDoses}
                className="w-10 h-10 rounded-xl bg-red-100 hover:bg-red-200 active:bg-red-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-xl font-bold text-red-700 transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}

      {drug.timerEnabled && (
        <div className={`px-4 py-3.5 border-t ${
          txaExpired ? "bg-red-50 border-red-200" :
          txaUrgent ? "bg-orange-50 border-orange-200" :
          txaWarning ? "bg-amber-50 border-amber-200" :
          "bg-gray-50 border-gray-100"
        }`}>
          {txaBirthTime === null ? (
            <button
              onClick={() => setTxaBirthTime(new Date())}
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-semibold transition-colors"
            >
              Set birth time — start TXA 3-hour window
            </button>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-xs font-bold text-gray-600">TXA 3-hour window</p>
                  {txaExpired ? (
                    <p className="text-sm font-bold text-red-600 mt-0.5">Window expired</p>
                  ) : (
                    <p className={`text-sm font-bold mt-0.5 ${txaUrgent ? "text-red-600" : txaWarning ? "text-amber-600" : "text-green-600"}`}>
                      {fmt(txaRemainingS)} remaining
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400">Elapsed</p>
                  <p className="text-base font-bold text-gray-700 tabular-nums">{fmt(txaElapsedSec)}</p>
                </div>
              </div>
              <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    txaExpired ? "bg-red-600" :
                    txaUrgent ? "bg-red-500" :
                    txaWarning ? "bg-amber-500" : "bg-green-500"
                  }`}
                  style={{ width: `${txaWindowPct}%` }}
                />
              </div>
              <div className="flex justify-between mt-1 mb-1">
                <span className="text-[10px] text-gray-400">Birth</span>
                <span className="text-[10px] text-gray-400">3 hours</span>
              </div>
              <button
                onClick={() => setTxaBirthTime(null)}
                className="text-xs text-gray-400 underline underline-offset-2"
              >
                Reset timer
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function EmergencyPage({ onClose }) {
  const [activeLevel, setActiveLevel] = useState("minor");
  const [checked, setChecked] = useState(new Set());
  const [carboprostCount, setCarboprostCount] = useState(0);
  const [txaBirthTime, setTxaBirthTime] = useState(null);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const level = PPH_EMERGENCY.levels.find(l => l.id === activeLevel);
  const nextLevel = level.escalatesTo
    ? PPH_EMERGENCY.levels.find(l => l.id === level.escalatesTo)
    : null;

  const toggleCheck = (id) =>
    setChecked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const checkedCount = level.checklist.filter(c => checked.has(c.id)).length;

  const txaElapsedSec = txaBirthTime ? Math.floor((now - txaBirthTime) / 1000) : null;
  const txaRemainingS = txaElapsedSec !== null ? Math.max(0, 3 * 3600 - txaElapsedSec) : null;
  const txaWindowPct = txaElapsedSec !== null ? Math.min(100, (txaElapsedSec / (3 * 3600)) * 100) : 0;
  const txaExpired   = txaRemainingS === 0;
  const txaUrgent    = txaRemainingS !== null && txaRemainingS < 3600;
  const txaWarning   = txaRemainingS !== null && txaRemainingS < 5400;

  const resetSession = () => {
    setActiveLevel("minor");
    setChecked(new Set());
    setCarboprostCount(0);
    setTxaBirthTime(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-gray-50 flex flex-col"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif" }}
    >
      {/* ── Header ────────────────────────────────────────── */}
      <div
        className="bg-red-800 text-white flex-shrink-0"
        style={{ paddingTop: "max(12px, env(safe-area-inset-top))" }}
      >
        <div className="px-4 pt-2 pb-1 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-bold tracking-widest uppercase text-red-300">
                Emergency Protocol
              </span>
              <span className="text-[10px] font-bold bg-red-700 text-red-200 px-2 py-0.5 rounded">
                GTG52
              </span>
            </div>
            <h1 className="text-xl font-bold text-white leading-tight">
              Postpartum Haemorrhage
            </h1>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={resetSession}
              className="text-xs text-red-200 px-2.5 py-1.5 rounded-lg bg-red-700/60 hover:bg-red-700 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-red-700/60 hover:bg-red-700 text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Level tabs */}
        <div className="flex px-3 py-2 gap-2">
          {PPH_EMERGENCY.levels.map(l => (
            <button
              key={l.id}
              onClick={() => setActiveLevel(l.id)}
              className={`flex-1 py-2 px-1 rounded-xl text-center transition-all ${
                activeLevel === l.id
                  ? "bg-white/25 ring-1 ring-white/40"
                  : "bg-red-900/30 hover:bg-red-900/50"
              }`}
            >
              <div className={`text-xs font-bold ${activeLevel === l.id ? "text-white" : "text-red-300"}`}>
                {l.label}
              </div>
              <div className={`text-[10px] ${activeLevel === l.id ? "text-red-100" : "text-red-400"}`}>
                {l.sublabel}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Scrollable content ────────────────────────────── */}
      <div className="flex-1 overflow-y-auto pb-32">

        {/* MBRRACE alert */}
        <div className="mx-4 mt-4 mb-3 bg-rose-50 border border-rose-200 rounded-2xl p-4">
          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-rose-600 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-white text-[10px] font-black">M</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-rose-500 tracking-wider uppercase mb-1">
                MBRRACE
              </p>
              <p className="text-sm text-rose-900 leading-relaxed">{level.mbrrace}</p>
            </div>
          </div>
        </div>

        {/* Call for Help */}
        <Section title="Call for Help">
          <div className="space-y-1.5">
            {level.call.map((person, i) => (
              <div key={i} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
                <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-red-700">{i + 1}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{person}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Checklist */}
        <Section
          title="Checklist"
          badge={`${checkedCount} / ${level.checklist.length}`}
        >
          <div className="space-y-1.5">
            {level.checklist.map(item => (
              <ChecklistItem
                key={item.id}
                item={item}
                checked={checked}
                onToggle={() => toggleCheck(item.id)}
              />
            ))}
          </div>
          {checkedCount === level.checklist.length && (
            <p className="mt-3 text-center text-xs font-semibold text-green-600 bg-green-50 rounded-xl py-2">
              All steps complete
            </p>
          )}
        </Section>

        {/* Drugs */}
        <Section title="Drugs">
          <div className="space-y-3">
            {level.drugs.map(drug => (
              <DrugCard
                key={drug.id}
                drug={drug}
                carboprostCount={carboprostCount}
                setCarboprostCount={setCarboprostCount}
                txaBirthTime={txaBirthTime}
                setTxaBirthTime={setTxaBirthTime}
                txaElapsedSec={txaElapsedSec}
                txaRemainingS={txaRemainingS}
                txaWindowPct={txaWindowPct}
                txaExpired={txaExpired}
                txaUrgent={txaUrgent}
                txaWarning={txaWarning}
              />
            ))}
          </div>
        </Section>

        {/* Blood products */}
        {level.bloodProducts && (
          <Section title="Blood Products">
            <div className="space-y-2">
              {level.bloodProducts.map((bp, i) => (
                <div key={i} className="bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 flex gap-3 items-start">
                  <div className="w-1.5 h-full min-h-[2.5rem] rounded-full bg-red-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">{bp.product}</p>
                    <p className="text-sm text-red-700 font-medium mt-0.5">{bp.dose}</p>
                    {bp.note && <p className="text-xs text-gray-500 mt-0.5 leading-snug">{bp.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Surgical options */}
        {level.surgical && (
          <Section title="Surgical Options" sublabel="in order of invasiveness">
            <div className="space-y-2">
              {level.surgical.map((s, i) => (
                <div key={i} className="bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-red-700 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-white">{i + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 leading-snug">{s.step}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-snug">{s.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Post-event care */}
        {level.postEvent && (
          <Section title="Post-Event Care">
            <div className="space-y-2">
              {level.postEvent.map((item, i) => (
                <div key={i} className="bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 flex gap-3 items-start">
                  <svg className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                  <p className="text-sm text-gray-700 leading-snug">{item}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

      </div>

      {/* ── Sticky bottom — Escalate ──────────────────────── */}
      <div
        className="fixed inset-x-0 bottom-0 bg-white border-t border-gray-200 px-4 py-3"
        style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
      >
        {nextLevel ? (
          <button
            onClick={() => setActiveLevel(nextLevel.id)}
            className={`w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${ESCALATE_COLORS[activeLevel]}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            Escalate → {nextLevel.label} PPH &nbsp;
            <span className="font-normal opacity-80">({nextLevel.sublabel})</span>
          </button>
        ) : (
          <div className="flex items-center justify-center gap-2 py-2">
            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span className="text-sm font-semibold text-red-700">Maximum escalation level</span>
          </div>
        )}
      </div>

    </div>
  );
}
