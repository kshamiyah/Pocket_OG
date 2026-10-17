import { useState } from "react";
import { fmtAge, clock, MIN } from "../utils/time";
import { lastVE, obsStatus, obsTracked, parityShort, riskShort, stageLabel, currentOxytocin, doctorLabel, malpresentation } from "../utils/bedModel";
import { shortLabel } from "../utils/triage";
import { iolEntryTier } from "../utils/iolPriority";
import {
  CARD, CARD_DUE, CARD_URGENT, ICON_BTN, TYPE_DISPLAY, TYPE_META, TYPE_OVERLINE,
  BTN, BTN_PRIMARY, BTN_SECONDARY, CHIP_ON, TYPE_UI_SM, TYPE_CAPTION,
} from "../ui/styles";
import { IconClipboard, IconMoon, IconMore, IconPlus, IconRound, IconSun } from "../ui/icons";

// Reviewed but still present: a muted red edge, so it reads as "being watched".
const CARD_WATCH = "rounded-xl border bg-gray-50 dark:bg-gray-900/60 border-red-200 dark:border-red-950 border-dashed";
const CARD_FOR = { urgent: CARD_URGENT, warning: CARD_DUE, watching: CARD_WATCH, ok: CARD, delivered: CARD };

function Tag({ children, tone = "gray" }) {
  const cls = {
    claude: "bg-claude-100 dark:bg-claude-950/40 text-claude-800 dark:text-claude-300",
    amber: "bg-claude-50 dark:bg-claude-950/30 text-claude-700 dark:text-claude-400 ring-1 ring-inset ring-claude-300 dark:ring-claude-800",
    gray: "bg-gray-200/70 dark:bg-gray-800 text-gray-600 dark:text-gray-300",
  }[tone];
  return <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded whitespace-nowrap ${cls}`}>{children}</span>;
}

// Bed number badge, coloured by how much the woman needs you.
const BADGE = {
  urgent: "bg-red-600 text-white",
  warning: "bg-claude-500 text-white",
  watching: "bg-red-100 dark:bg-red-950/50 text-red-800 dark:text-red-300",
  ok: "bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100",
  delivered: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300",
};
// The one thing on the right: what she needs, or what is next.
const PILL = {
  urgent: "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300",
  warning: "bg-claude-50 dark:bg-claude-950/40 text-claude-800 dark:text-claude-300",
  info: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
  watching: "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 ring-1 ring-inset ring-red-200 dark:ring-red-900",
};

export function BedRow({ bed, t, now, onOpen, flash }) {
  const ve = lastVE(bed);
  // The breech tag already shows malpresentation, so the flag is not repeated.
  const flags = (bed.riskFlags ?? []).filter(f => f !== "Non-cephalic");
  const oxy = currentOxytocin(bed);
  const todo = (bed.tasks ?? []).filter(x => !x.done).length;
  const obsDue = obsTracked(bed) ? obsStatus(bed, now).filter(o => !o.done).map(o => o.letter) : [];
  const ago = iso => fmtAge(now - new Date(iso).getTime());

  let side;
  if (t.top) {
    const rest = t.shown.length - 1;
    side = (
      <>
        <span className={`text-xs font-semibold leading-tight px-2 py-1 rounded-lg ${t.top.reviewed ? PILL.watching : PILL[t.top.severity] ?? PILL.info}`}>{shortLabel(t.top)}</span>
        {t.top.reviewed
          ? <span className="text-[11px] text-gray-500 dark:text-gray-400">reviewed {clock(t.top.reviewed.at)}</span>
          : rest > 0 && <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500">+{rest} more</span>}
      </>
    );
  } else if (t.tier === "delivered") {
    side = <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Delivered</span>;
  } else if (t.next) {
    side = (
      <>
        <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">{t.next.label} {clock(t.next.at)}</span>
        <span className="text-[11px] text-gray-500 dark:text-gray-400">in {fmtAge(t.next.at - now)}</span>
      </>
    );
  } else {
    side = <span className="text-xs text-gray-500 dark:text-gray-400">Nothing due</span>;
  }

  // Line 1: where she is in labour, in one clean phrase.
  let status;
  if (bed.delivery) {
    status = <>{bed.delivery.mode} <span className="font-normal text-gray-500 dark:text-gray-400">{clock(bed.delivery.time)}{bed.delivery.ebl != null ? ` · EBL ${bed.delivery.ebl} mL` : ""}</span></>;
  } else if (bed.labourStage === "Active second stage" && bed.pushingStartTime) {
    status = <>Pushing <span className="font-normal text-gray-500 dark:text-gray-400">· {ago(bed.pushingStartTime)}</span></>;
  } else {
    status = <>{stageLabel(bed)}{ve
      ? <> · <span className="tabular-nums">{ve.dilation} cm</span> <span className="font-normal text-gray-500 dark:text-gray-400">{ago(ve.time)}</span></>
      : <span className="font-normal text-gray-500 dark:text-gray-400"> · no VE</span>}</>;
  }

  const longName = String(bed.bedNumber).length > 2;
  return (
    <button type="button" onClick={() => onOpen(bed.id)} data-bed={bed.bedNumber}
      className={`${CARD_FOR[t.tier]} w-full text-left flex items-center gap-3 px-2.5 py-2.5 active:scale-[0.99] transition-transform ${flash ? "animate-row-flash" : ""} ${t.tier === "delivered" ? "opacity-80" : ""}`}>
      <span aria-label={`Bed ${bed.bedNumber}`}
        className={`shrink-0 h-11 min-w-11 px-1.5 rounded-lg flex items-center justify-center font-bold tabular-nums ${longName ? "text-xs" : "text-lg"} ${BADGE[t.tier]}`}>
        {bed.bedNumber}
      </span>
      <span className="flex-1 min-w-0 flex flex-col gap-1">
        <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">{status}</span>
        <span className="flex items-center gap-1 flex-wrap">
          <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mr-0.5 whitespace-nowrap">{parityShort(bed.parity)} · {bed.gestation}</span>
          {/* Facts are neutral; orange and red are kept for things that need doing. */}
          {!bed.delivery && bed.modeOfOnset === "Induced" && <Tag>IOL</Tag>}
          {!bed.delivery && bed.modeOfOnset === "PPROM" && <Tag>PPROM</Tag>}
          {!bed.delivery && malpresentation(bed) && <Tag tone="claude">{malpresentation(bed)}</Tag>}
          {!bed.delivery && oxy && <Tag>Oxy {oxy.dose}{bed.oxytocinHeld ? " held" : ""}</Tag>}
          {obsDue.length > 0 && <Tag tone="amber">Obs due {obsDue.join("")}</Tag>}
          {flags.slice(0, 2).map(f => <Tag key={f}>{riskShort(f)}</Tag>)}
          {flags.length > 2 && <Tag>+{flags.length - 2}</Tag>}
          {todo > 0 && <Tag>{todo} to do</Tag>}
        </span>
      </span>
      <span className="shrink-0 max-w-[38%] flex flex-col items-end gap-1 text-right">{side}</span>
    </button>
  );
}

const SECTION_DOT = { urgent: "bg-red-600", warning: "bg-claude-500", watching: "bg-red-300 dark:bg-red-800", ok: "bg-gray-400 dark:bg-gray-600" };

function Section({ title, count, tone = "ok", children }) {
  return (
    <section className="space-y-1.5">
      <div className="flex items-center gap-2 px-1">
        <span className={`w-2 h-2 rounded-full ${SECTION_DOT[tone]}`} aria-hidden="true" />
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">{title}</span>
        <span className="text-[11px] font-semibold px-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 tabular-nums">{count}</span>
      </div>
      {children}
    </section>
  );
}

export default function Board({
  rows, summary, now, shift, dark, flashId, iolQueue, tab, onTab,
  onOpenBed, onAdmit, onRound, onHandover, onToggleTheme, onMenu, onRules, iolView,
}) {
  const [showDelivered, setShowDelivered] = useState(false);
  const urgent = rows.filter(r => r.t.tier === "urgent");
  const due = rows.filter(r => r.t.tier === "warning");
  const watching = rows.filter(r => r.t.tier === "watching");
  const ok = rows.filter(r => r.t.tier === "ok");
  const delivered = rows.filter(r => r.t.tier === "delivered");

  const msLeft = shift?.shiftEnd ? new Date(shift.shiftEnd).getTime() - now : null;
  const nearEnd = msLeft != null && msLeft > 0 && msLeft <= 30 * MIN;
  const overTime = msLeft != null && msLeft <= 0;
  const iolUrgent = iolQueue.filter(e => iolEntryTier(e) <= 1).length;

  const summaryBits = [
    `${summary.women} not yet delivered`,
    summary.delivered ? `${summary.delivered} delivered` : null,
    summary.urgent ? `${summary.urgent} ${summary.urgent === 1 ? "needs" : "need"} you` : null,
    summary.warning ? `${summary.warning} due soon` : null,
    summary.watching ? `${summary.watching} watching` : null,
    summary.nextAt ? `next ${clock(summary.nextAt)}` : null,
  ].filter(Boolean);

  return (
    <div className="min-h-dvh bg-white dark:bg-gray-950" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 6.5rem)" }}>
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-gray-950/95 backdrop-blur border-b border-gray-200 dark:border-gray-800"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 0.75rem)" }}>
        <div className="max-w-lg mx-auto px-5 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className={TYPE_DISPLAY}>Labour Ward</h1>
              <p className={`${TYPE_META} mt-0.5 truncate`}>
                {shift ? `${shift.shiftType === "night" ? "Night" : "Day"} · ${doctorLabel(shift.doctorName)}` : "PocketSuite"}
                {msLeft != null && <> · <span className={overTime ? "text-red-600 dark:text-red-400 font-semibold" : nearEnd ? "text-claude-700 dark:text-claude-400 font-semibold" : ""}>{overTime ? "overtime" : `${fmtAge(msLeft)} left`}</span></>}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button type="button" onClick={onToggleTheme} className={ICON_BTN} aria-label={dark ? "Switch to day mode" : "Switch to night mode"}>
                {dark ? <IconSun /> : <IconMoon />}
              </button>
              <button type="button" onClick={onHandover} className={ICON_BTN} aria-label="Handover">
                <IconClipboard />
              </button>
              <button type="button" onClick={onMenu} className={ICON_BTN} aria-label="More">
                <IconMore />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3">
            {[["board", "Board"], ["iol", "IOL queue"]].map(([key, label]) => (
              <button key={key} type="button" onClick={() => onTab(key)} aria-pressed={tab === key}
                className={`px-3 py-2.5 min-h-11 rounded-lg ${TYPE_UI_SM} border transition-colors flex items-center gap-1.5 ${tab === key ? CHIP_ON : "bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-800"}`}>
                {label}
                {key === "iol" && iolQueue.length > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none ${tab === key ? "bg-white/25 text-white" : iolUrgent ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400" : "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300"}`}>{iolQueue.length}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-5 pt-3 space-y-4">
        {tab === "iol" ? iolView : (
          <>
            {(nearEnd || overTime) && (
              <button type="button" onClick={onHandover}
                className="w-full text-left px-4 py-2.5 rounded-xl bg-claude-100 dark:bg-claude-950/40 border border-claude-300 dark:border-claude-800 active:scale-[0.99] transition-all">
                <span className="text-xs font-semibold text-claude-900 dark:text-claude-200">
                  {overTime ? "Shift has ended. Open the handover." : `Handover in ${fmtAge(msLeft)}. Tap to open the handover.`}
                </span>
              </button>
            )}

            {rows.length === 0 ? (
              <div className="pt-16 text-center space-y-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">No women on the board yet.</p>
                <button type="button" onClick={onAdmit} className={`${BTN} ${BTN_PRIMARY} mx-auto px-6`}>
                  <IconPlus /> Admit the first woman
                </button>
              </div>
            ) : (
              <>
                <p className={`${TYPE_OVERLINE} px-1`}>{summaryBits.join(" · ")}</p>
                {urgent.length > 0 && (
                  <Section title="Needs you now" tone="urgent" count={urgent.length}>
                    {urgent.map(r => <BedRow key={r.bed.id} {...r} now={now} onOpen={onOpenBed} flash={flashId === r.bed.id} />)}
                  </Section>
                )}
                {due.length > 0 && (
                  <Section title="Due soon" tone="warning" count={due.length}>
                    {due.map(r => <BedRow key={r.bed.id} {...r} now={now} onOpen={onOpenBed} flash={flashId === r.bed.id} />)}
                  </Section>
                )}
                {watching.length > 0 && (
                  <Section title="Reviewed, watching" tone="watching" count={watching.length}>
                    {watching.map(r => <BedRow key={r.bed.id} {...r} now={now} onOpen={onOpenBed} flash={flashId === r.bed.id} />)}
                  </Section>
                )}
                {ok.length > 0 && (
                  <Section title="On track" tone="ok" count={ok.length}>
                    {ok.map(r => <BedRow key={r.bed.id} {...r} now={now} onOpen={onOpenBed} flash={flashId === r.bed.id} />)}
                  </Section>
                )}
                {delivered.length > 0 && (
                  <section className="space-y-1.5">
                    <button type="button" onClick={() => setShowDelivered(s => !s)} aria-expanded={showDelivered}
                      className="w-full text-left px-1 py-1 text-sm font-semibold text-claude-700 dark:text-claude-400">
                      {showDelivered ? "Hide" : "Show"} delivered ({delivered.length})
                    </button>
                    {showDelivered && delivered.map(r => <BedRow key={r.bed.id} {...r} now={now} onOpen={onOpenBed} flash={flashId === r.bed.id} />)}
                  </section>
                )}
                <p className={`${TYPE_CAPTION} text-center leading-relaxed pt-2`}>
                  Decision aid only. Clinical responsibility remains with the treating clinician.<br />
                  <button type="button" onClick={onRules} className="min-h-9 px-2 font-semibold text-claude-700 dark:text-claude-400 underline decoration-dotted underline-offset-2">
                    Rules and sources: NICE NG235 · NG229 · NG25 · NG195 · NG255 · local
                  </button>
                </p>
              </>
            )}
          </>
        )}
      </main>

      {tab === "board" && (
        <div className="fixed inset-x-0 bottom-0 z-30 bg-gradient-to-t from-white via-white/95 to-white/0 dark:from-gray-950 dark:via-gray-950/95 dark:to-gray-950/0 pt-6"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }}>
          <div className="max-w-lg mx-auto px-5 grid grid-cols-2 gap-2">
            <button type="button" onClick={onRound} disabled={summary.women + summary.delivered === 0} className={`${BTN} ${BTN_SECONDARY} min-h-[3.25rem] whitespace-nowrap`}>
              <IconRound /> Board round
            </button>
            <button type="button" onClick={onAdmit} className={`${BTN} ${BTN_PRIMARY} min-h-[3.25rem] text-base`}>
              <IconPlus /> Admit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
