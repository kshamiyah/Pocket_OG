import { useState, useEffect } from "react";
import { IOL_TIERS } from "../utils/iolPriority";

// ─── On-Call Simulator (prototype skeleton) ──────────────────────────────────
// A "flight simulator" for the labour-ward night shift. The clock runs in
// compressed real time; a pager fires a scripted scenario that walks through the
// SAME node schema the flowcharts use (action / decision / alert / end). Choices
// score points and mutate the live board — dithering lets other patients drift.
// One scripted scenario is wired here to prove the loop; later these become data
// files exactly like the flowcharts, replayed by this same engine.

const TIER = Object.fromEntries(IOL_TIERS.map(t => [t.key, t]));

const SHIFT_START = 22 * 60;          // 22:00, in minutes
const MIN_PER_TICK = 5;               // sim minutes advanced each tick
const TICK_MS = 1500;                 // real ms per tick
const PAGE_AT = 10;                   // fire the scripted page 10 sim-min in

const fmtClock = (mins) => {
  const t = (SHIFT_START + mins) % (24 * 60);
  return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
};

// Starting board — three antenatal admissions already queued for IOL.
const INITIAL_BOARD = [
  { id: "bed2", bed: "Bed 2", who: "41+3 · post-dates", tier: "moderate", note: "Awaiting IOL slot", escalateAt: 90, escalateTo: "high", escalateNote: "Now 41+4 — creeping up the queue" },
  { id: "bed4", bed: "Bed 4", who: "39+2 · SROM 6h ago", tier: "moderate", note: "For IOL — awaiting review", flash: true },
  { id: "bed6", bed: "Bed 6", who: "38+0 · GDM", tier: "moderate", note: "Diet-controlled, stable" },
];

// The scripted scenario — Bed 4 tips into chorioamnionitis.
const SCENARIO = {
  ref: "bed4",
  pager: "BLEEP — Bed 4: “She's spiked a temp of 38.4, maternal HR 118, offensive liquor, and the CTG baseline is now 175 with reduced variability.”",
  startId: "assess",
  nodes: {
    assess: {
      type: "alert",
      title: "Bed 4 — 39+2, SROM 6h, now febrile & tachycardic",
      text: "Maternal pyrexia + tachycardia + fetal tachycardia + offensive liquor after ruptured membranes. This is chorioamnionitis until proven otherwise — a time-critical intrauterine infection.",
      items: [
        "Temp 38.4 °C · HR 118 · BP 104/62 · RR 20",
        "Fetal baseline 175, reduced variability",
        "Liquor now offensive",
      ],
      next: "firstmove",
    },
    firstmove: {
      type: "decision",
      title: "First move?",
      text: "Membranes ruptured 6 hours, now septic picture. What do you do first?",
      options: [
        {
          label: "Sepsis Six + IV broad-spectrum antibiotics now, call the reg, plan to expedite delivery",
          tone: "good", score: 25, next: "ctg",
          rationale: "Correct. Chorioamnionitis is a delivery indication — antibiotics + expedited birth, don't wait. IV access, cultures, lactate, fluids, antibiotics within the hour (Sepsis Six; GTG 64B).",
        },
        {
          label: "IV paracetamol for the fever, reassess in an hour",
          tone: "bad", score: -20, next: "deteriorate", effect: "escalate",
          rationale: "Treating the number, not the cause. Antipyretics mask a deteriorating septic patient; the hour you buy is the hour she and the fetus can't spare.",
        },
        {
          label: "Send blood cultures, hold antibiotics until the results are back",
          tone: "warn", score: -10, next: "ctg", effect: "escalate",
          rationale: "Cultures first is right, but never delay antibiotics for them in sepsis — give empirically within the hour, cultures alongside.",
        },
      ],
    },
    deteriorate: {
      type: "alert",
      title: "20 minutes later — she's worse",
      text: "The paracetamol has done nothing. Temp now 39.1, HR 132, BP 88/50, she's rigoring. You're now managing established maternal sepsis instead of catching it early.",
      next: "rescue",
    },
    rescue: {
      type: "decision",
      title: "Now what?",
      options: [
        {
          label: "Sepsis Six now — IV antibiotics, fluids, senior + anaesthetics, expedite delivery",
          tone: "good", score: 12, next: "ctg",
          rationale: "The right call — just later and with less reserve than if it had been the first move.",
        },
        {
          label: "Another fluid bolus and keep watching",
          tone: "bad", score: -15, next: "arrest",
          rationale: "Fluids alone don't treat the source. Undrained infection + no antibiotics = continued decline.",
        },
      ],
    },
    ctg: {
      type: "decision",
      title: "Antibiotics running. Delivery — how?",
      text: "Chorioamnionitis means she needs to be delivered. The CTG is abnormal (baseline 175, reduced variability) but not terminal. Cervix 4 cm, cephalic.",
      options: [
        {
          label: "Expedite vaginally — ARM already done, start syntocinon, continuous CTG, aim for birth",
          tone: "good", score: 20, next: "good-end",
          rationale: "Reasonable: 4 cm and cephalic with a suspicious (not pathological) CTG — augment towards a vaginal birth under continuous monitoring, with a low threshold to convert.",
        },
        {
          label: "Category-1 caesarean straight away",
          tone: "warn", score: 5, next: "cs-end",
          rationale: "Not wrong — but a Cat-1 for a suspicious CTG at 4 cm may be premature. Justified if the CTG becomes pathological or she can't be stabilised.",
        },
        {
          label: "Hold off delivery, continue antibiotics and reassess in 4 hours",
          tone: "bad", score: -20, next: "arrest",
          rationale: "Antibiotics don't cure chorioamnionitis while the fetus stays in an infected uterus. The definitive treatment is delivery — delaying it risks fetal and maternal collapse.",
        },
      ],
    },
    "good-end": {
      type: "end",
      title: "Baby delivered — mother stabilising",
      text: "Live birth under continuous monitoring; both to antibiotics and observation. You recognised chorioamnionitis early, treated the sepsis, and expedited delivery — textbook.",
      grade: "clean",
    },
    "cs-end": {
      type: "end",
      title: "Delivered by caesarean — good outcome",
      text: "Baby out, mother stable on antibiotics. Sound outcome, though a trial of expedited vaginal birth was reasonable first given the cervix and a CTG that was suspicious rather than pathological.",
      grade: "ok",
    },
    arrest: {
      type: "end",
      title: "Peri-arrest call — MET team",
      text: "Delayed source control let sepsis outrun you. She's transferred to theatre peri-arrest and ITU is involved. A hard debrief — but exactly the kind of near-miss this simulator exists to rehearse safely.",
      grade: "bad",
    },
  },
};

const NODE_STYLE = {
  action: { badge: "bg-blue-100 text-blue-700", icon: "→", bar: "bg-blue-500" },
  decision: { badge: "bg-violet-100 text-violet-700", icon: "?", bar: "bg-violet-500" },
  alert: { badge: "bg-amber-100 text-amber-700", icon: "⚠", bar: "bg-amber-400" },
  end: { badge: "bg-gray-100 text-gray-600", icon: "✓", bar: "bg-gray-400" },
};
const TONE = {
  good: "border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50",
  warn: "border-amber-200 hover:border-amber-400 hover:bg-amber-50",
  bad: "border-rose-200 hover:border-rose-400 hover:bg-rose-50",
};

export default function OnCallSim({ onClose }) {
  const [phase, setPhase] = useState("brief");   // brief | shift | debrief
  const [clock, setClock] = useState(0);
  const [board, setBoard] = useState(INITIAL_BOARD);
  const [nodeId, setNodeId] = useState(null);     // active scenario node, or null
  const [pageSeen, setPageSeen] = useState(false);
  const [log, setLog] = useState([]);             // [{ time, label, score, rationale, tone }]

  // Shift clock — ticks in compressed real time while on the board.
  useEffect(() => {
    if (phase !== "shift") return;
    const iv = setInterval(() => {
      setClock(c => {
        const next = c + MIN_PER_TICK;
        // Ambient escalation of untouched patients.
        setBoard(bd => bd.map(p =>
          p.escalateAt && next >= p.escalateAt && p.tier !== p.escalateTo
            ? { ...p, tier: p.escalateTo, note: p.escalateNote }
            : p
        ));
        return next;
      });
    }, TICK_MS);
    return () => clearInterval(iv);
  }, [phase]);

  // Fire the scripted page once the clock passes PAGE_AT (deferred so we never
  // call setState synchronously inside the effect body).
  useEffect(() => {
    if (phase === "shift" && !pageSeen && nodeId === null && clock >= PAGE_AT) {
      const id = setTimeout(() => { setNodeId(SCENARIO.startId); setPageSeen(true); }, 0);
      return () => clearTimeout(id);
    }
  }, [clock, phase, pageSeen, nodeId]);

  const node = nodeId ? SCENARIO.nodes[nodeId] : null;
  const score = log.reduce((s, e) => s + e.score, 0);

  const choose = (opt) => {
    setLog(l => [...l, { time: fmtClock(clock), label: opt.label, score: opt.score, rationale: opt.rationale, tone: opt.tone }]);
    if (opt.effect === "escalate") {
      setBoard(bd => bd.map(p => p.id === SCENARIO.ref
        ? { ...p, tier: "urgent", note: "Maternal sepsis — deteriorating", flash: true } : p));
    }
    setNodeId(opt.next);
  };

  const advance = () => setNodeId(node.next);

  const closeScenario = () => {
    // Resolve the scripted patient off the board on a good/ok ending.
    if (node?.grade === "clean" || node?.grade === "ok") {
      setBoard(bd => bd.map(p => p.id === SCENARIO.ref
        ? { ...p, tier: "routine", note: "Delivered — postnatal", flash: false } : p));
    }
    setNodeId(null);
  };

  // ─── Brief screen ──────────────────────────────────────────────────────────
  if (phase === "brief") {
    return (
      <Shell onClose={onClose} title="On-Call Simulator" subtitle="Night shift · labour ward">
        <div className="max-w-lg mx-auto px-5 py-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-100 text-violet-700 text-[11px] font-bold mb-5">PROTOTYPE</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">You're the reg on for the night.</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            The board starts with three antenatal admissions. The clock runs in compressed real time — while you're busy with one patient, the others keep ticking. When your bleep goes off, work the problem: every choice is scored against the guidance and the board reacts to what you do.
          </p>
          <ul className="space-y-2 mb-8">
            {["Recognise sick patients early", "Prioritise under load", "Fail safely — then read the debrief"].map(t => (
              <li key={t} className="flex gap-2 text-sm text-gray-700"><span className="text-violet-400">›</span>{t}</li>
            ))}
          </ul>
          <button onClick={() => setPhase("shift")}
            className="w-full py-3.5 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors">
            Start the shift →
          </button>
          <p className="text-[11px] text-gray-400 text-center mt-4 leading-relaxed">
            Training simulation only. Scenarios are illustrative and simplified — never a substitute for local protocol or senior review.
          </p>
        </div>
      </Shell>
    );
  }

  // ─── Debrief screen ─────────────────────────────────────────────────────────
  if (phase === "debrief") {
    const band = score >= 40 ? { label: "Strong shift", color: "text-emerald-600" }
      : score >= 15 ? { label: "Safe, with lessons", color: "text-amber-600" }
      : { label: "Learn from this one", color: "text-rose-600" };
    return (
      <Shell onClose={onClose} title="Debrief" subtitle={`Handover · ${fmtClock(clock)}`}>
        <div className="max-w-lg mx-auto px-5 py-6">
          <div className="rounded-2xl border border-gray-100 shadow-sm p-5 mb-6 text-center">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Shift score</p>
            <p className="text-5xl font-bold text-gray-900 mt-1">{score}</p>
            <p className={`text-sm font-semibold mt-1 ${band.color}`}>{band.label}</p>
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Your decisions</p>
          <div className="space-y-3 mb-8">
            {log.length === 0 && <p className="text-sm text-gray-400">No decisions logged.</p>}
            {log.map((e, i) => (
              <div key={i} className="rounded-2xl border border-gray-100 p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium text-gray-800 leading-snug">{e.label}</p>
                  <span className={`shrink-0 text-xs font-bold ${e.score >= 0 ? "text-emerald-600" : "text-rose-600"}`}>{e.score >= 0 ? `+${e.score}` : e.score}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed mt-2">{e.rationale}</p>
                <p className="text-[10px] text-gray-300 mt-2">{e.time}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setPhase("brief"); setClock(0); setBoard(INITIAL_BOARD); setNodeId(null); setPageSeen(false); setLog([]); }}
              className="flex-1 py-3.5 rounded-2xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors">↺ Run again</button>
            <button onClick={onClose}
              className="flex-1 py-3.5 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors">Done</button>
          </div>
        </div>
      </Shell>
    );
  }

  // ─── Scenario overlay (over the board) ──────────────────────────────────────
  if (node) {
    const st = NODE_STYLE[node.type];
    const isEnd = node.type === "end";
    return (
      <Shell onClose={onClose} title="On-Call Simulator" subtitle={SCENARIO.pager ? "Active bleep" : ""} clock={fmtClock(clock)} score={score}>
        <div className="max-w-lg mx-auto px-5 py-6">
          {nodeId === SCENARIO.startId && (
            <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 mb-5">
              <p className="text-[11px] font-bold text-rose-500 uppercase tracking-wide mb-1">📟 Bleep</p>
              <p className="text-sm text-rose-800 leading-relaxed">{SCENARIO.pager}</p>
            </div>
          )}
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${st.badge}`}>
            <span>{st.icon}</span><span className="capitalize">{node.type}</span>
          </span>
          <div className={`h-1 w-12 rounded-full my-4 ${st.bar}`} />
          <h2 className="text-xl font-semibold text-gray-900 leading-snug mb-3">{node.title}</h2>
          {node.text && <p className="text-sm text-gray-700 leading-relaxed mb-3">{node.text}</p>}
          {node.items && (
            <ul className="mb-4 space-y-2">
              {node.items.map((it, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700 leading-snug"><span className="text-violet-400 shrink-0 mt-0.5">›</span><span>{it}</span></li>
              ))}
            </ul>
          )}
          {node.type === "decision" && (
            <div className="mt-5 space-y-2.5">
              {node.options.map((opt, i) => (
                <button key={i} onClick={() => choose(opt)}
                  className={`w-full text-left px-4 py-3.5 rounded-2xl border-2 transition-all ${TONE[opt.tone] ?? "border-gray-200 hover:border-violet-400 hover:bg-violet-50"}`}>
                  <p className="text-sm font-medium text-gray-800 leading-snug">{opt.label}</p>
                </button>
              ))}
            </div>
          )}
          {(node.type === "action" || node.type === "alert") && node.next && (
            <button onClick={advance}
              className="mt-5 w-full py-3.5 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors">
              Continue →
            </button>
          )}
          {isEnd && (
            <div className="mt-6 flex gap-2">
              <button onClick={closeScenario}
                className="flex-1 py-3.5 rounded-2xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors">← Back to board</button>
              <button onClick={() => { closeScenario(); setPhase("debrief"); }}
                className="flex-1 py-3.5 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors">Hand over →</button>
            </div>
          )}
        </div>
      </Shell>
    );
  }

  // ─── Board view ─────────────────────────────────────────────────────────────
  return (
    <Shell onClose={onClose} title="On-Call Simulator" subtitle="Labour ward board" clock={fmtClock(clock)} score={score}>
      <div className="max-w-lg mx-auto px-5 py-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Your patients</p>
          {!pageSeen && <span className="text-[11px] text-gray-400 animate-pulse">watching for bleeps…</span>}
        </div>
        <div className="space-y-2.5 mb-8">
          {board.map(p => {
            const t = TIER[p.tier] ?? TIER.routine;
            return (
              <div key={p.id} className={`rounded-2xl border p-4 flex items-center gap-3 ${p.flash && p.tier === "urgent" ? "border-rose-300 bg-rose-50" : "border-gray-100"}`}>
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${t.dot} ${p.tier === "urgent" ? "animate-pulse" : ""}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">{p.bed}</p>
                    <span className="text-xs text-gray-400">{p.who}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{p.note}</p>
                </div>
                <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${t.badge}`}>{t.label}</span>
              </div>
            );
          })}
        </div>
        {pageSeen && (
          <button onClick={() => setPhase("debrief")}
            className="w-full py-3.5 rounded-2xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors">
            Hand over — end shift
          </button>
        )}
        <p className="text-[11px] text-gray-400 text-center mt-4">Clock runs in compressed time — {MIN_PER_TICK} min every few seconds.</p>
      </div>
    </Shell>
  );
}

// Full-screen chrome shared by every phase.
function Shell({ children, onClose, title, subtitle, clock, score }) {
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col" style={{ fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <div className="shrink-0 border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 leading-tight">{title}</p>
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>
        {clock != null && (
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <p className="text-[10px] text-gray-400 leading-none">clock</p>
              <p className="text-sm font-bold text-gray-900 tabular-nums">{clock}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 leading-none">score</p>
              <p className={`text-sm font-bold tabular-nums ${score >= 0 ? "text-emerald-600" : "text-rose-600"}`}>{score}</p>
            </div>
          </div>
        )}
        <button onClick={onClose} aria-label="Close simulator"
          className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors text-lg leading-none shrink-0">×</button>
      </div>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
