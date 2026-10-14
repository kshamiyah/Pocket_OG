import { useState } from "react";
import { fmtAge, hhmm, MIN } from "../utils/time";
import { lastVE, obsStatus, obsTracked, parityShort, stageLabel, currentOxytocin, doctorLabel } from "../utils/bedModel";
import { shortLabel } from "../utils/triage";
import { iolEntryTier } from "../utils/iolPriority";
import {
  CARD, CARD_DUE, CARD_URGENT, ICON_BTN, SEV_BAR, SEV_TEXT, TYPE_DISPLAY, TYPE_META, TYPE_OVERLINE,
  BTN, BTN_PRIMARY, BTN_SECONDARY, CHIP_ON, TYPE_UI_SM, TYPE_CAPTION,
} from "../ui/styles";
import { IconClipboard, IconMoon, IconMore, IconPlus, IconRound, IconSun } from "../ui/icons";

const CARD_FOR = { urgent: CARD_URGENT, warning: CARD_DUE, ok: CARD, delivered: CARD };

function ObsDots({ bed, now }) {
  return (
    <span className="inline-flex gap-2" aria-label="Observations">
      {obsStatus(bed, now).map(o => (
        <span key={o.key} className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-500 dark:text-gray-400">
          <span className={`w-2 h-2 rounded-full border ${o.done ? "bg-emerald-500 border-emerald-500" : "border-gray-400 dark:border-gray-600"}`} />
          {o.letter}
        </span>
      ))}
    </span>
  );
}

function Tag({ children, tone = "gray" }) {
  const cls = tone === "claude"
    ? "bg-claude-100 dark:bg-claude-950/40 text-claude-800 dark:text-claude-300"
    : "bg-gray-200/70 dark:bg-gray-800 text-gray-600 dark:text-gray-300";
  return <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded ${cls}`}>{children}</span>;
}

export function BedRow({ bed, t, now, onOpen, flash }) {
  const ve = lastVE(bed);
  const flags = bed.riskFlags ?? [];
  const oxy = currentOxytocin(bed);
  const todo = (bed.tasks ?? []).filter(x => !x.done).length;

  let side;
  if (t.tier === "delivered") {
    side = <span className={TYPE_META}>Delivered</span>;
  } else if (t.top) {
    const rest = t.shown.length - 1;
    side = (
      <>
        <span className={`text-sm font-semibold leading-tight ${SEV_TEXT[t.top.severity]}`}>{shortLabel(t.top)}</span>
        {rest > 0 && <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500">+{rest} more</span>}
      </>
    );
  } else if (t.next) {
    side = (
      <>
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t.next.label} {hhmm(t.next.at)}</span>
        <span className={TYPE_META}>in {fmtAge(t.next.at - now)}</span>
      </>
    );
  } else {
    side = <span className={TYPE_META}>Nothing due</span>;
  }

  let status;
  if (bed.delivery) {
    status = <span className="text-sm text-gray-700 dark:text-gray-300">{bed.delivery.mode} {hhmm(bed.delivery.time)}{bed.delivery.ebl != null ? ` · EBL ${bed.delivery.ebl} mL` : ""}</span>;
  } else if (bed.labourStage === "Active second stage" && bed.pushingStartTime) {
    status = <><span className="text-sm text-gray-700 dark:text-gray-300">Pushing</span><span className={TYPE_META}>{fmtAge(now - new Date(bed.pushingStartTime).getTime())}</span></>;
  } else {
    status = (
      <>
        <span className="text-sm text-gray-700 dark:text-gray-300">{stageLabel(bed)}</span>
        {ve ? (
          <>
            <span className="text-gray-300 dark:text-gray-700">·</span>
            <span className="text-base font-semibold tabular-nums text-gray-900 dark:text-white">{ve.dilation}<span className="text-xs font-normal text-gray-500"> cm</span></span>
            <span className={TYPE_META}>{fmtAge(now - new Date(ve.time).getTime())} ago</span>
          </>
        ) : <span className={TYPE_META}>· no VE</span>}
      </>
    );
  }

  return (
    <button type="button" onClick={() => onOpen(bed.id)} data-bed={bed.bedNumber}
      className={`${CARD_FOR[t.tier]} w-full text-left flex items-stretch overflow-hidden active:scale-[0.99] transition-transform ${flash ? "animate-row-flash" : ""} ${t.tier === "delivered" ? "opacity-70" : ""}`}>
      <span className={`w-1 shrink-0 ${SEV_BAR[t.tier] ?? "bg-transparent"}`} />
      <span className="flex-1 min-w-0 px-3 py-2.5 flex flex-col gap-0.5">
        <span className="flex items-baseline gap-2 flex-wrap">
          <span className="text-base font-semibold text-gray-900 dark:text-white">Bed {bed.bedNumber}</span>
          <span className={TYPE_META}>{parityShort(bed.parity)} · {bed.gestation}</span>
          {bed.modeOfOnset === "Induced" && <Tag tone="claude">IOL</Tag>}
          {bed.modeOfOnset === "PPROM" && <Tag tone="claude">PPROM</Tag>}
          {flags.slice(0, 2).map(f => <Tag key={f}>{f}</Tag>)}
          {flags.length > 2 && <Tag>+{flags.length - 2}</Tag>}
        </span>
        <span className="flex items-baseline gap-1.5 flex-wrap">{status}</span>
        {!bed.delivery && (obsTracked(bed) || oxy || todo > 0) && (
          <span className="flex items-center gap-3 mt-0.5">
            {obsTracked(bed) && <ObsDots bed={bed} now={now} />}
            {oxy && <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">Oxy {oxy.dose}</span>}
            {todo > 0 && <span className="text-[11px] font-semibold text-claude-700 dark:text-claude-400">{todo} to do</span>}
          </span>
        )}
      </span>
      <span className="shrink-0 max-w-[42%] pr-3 py-2.5 flex flex-col items-end justify-center text-right gap-0.5">{side}</span>
    </button>
  );
}

function Section({ title, count, children }) {
  return (
    <section className="space-y-1.5">
      <div className="flex items-center justify-between px-1">
        <span className={TYPE_OVERLINE}>{title}</span>
        <span className={TYPE_OVERLINE}>{count}</span>
      </div>
      {children}
    </section>
  );
}

export default function Board({
  rows, summary, now, shift, dark, flashId, iolQueue, tab, onTab,
  onOpenBed, onAdmit, onRound, onHandover, onToggleTheme, onMenu, iolView,
}) {
  const [showDelivered, setShowDelivered] = useState(false);
  const urgent = rows.filter(r => r.t.tier === "urgent");
  const due = rows.filter(r => r.t.tier === "warning");
  const ok = rows.filter(r => r.t.tier === "ok");
  const delivered = rows.filter(r => r.t.tier === "delivered");

  const msLeft = shift?.shiftEnd ? new Date(shift.shiftEnd).getTime() - now : null;
  const nearEnd = msLeft != null && msLeft > 0 && msLeft <= 30 * MIN;
  const overTime = msLeft != null && msLeft <= 0;
  const iolUrgent = iolQueue.filter(e => iolEntryTier(e) <= 1).length;

  const summaryBits = [
    `${summary.women} ${summary.women === 1 ? "woman" : "women"}`,
    summary.urgent ? `${summary.urgent} need you` : null,
    summary.warning ? `${summary.warning} due soon` : null,
    summary.nextAt ? `next ${hhmm(summary.nextAt)}` : null,
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
                  <Section title="Needs you now" count={urgent.length}>
                    {urgent.map(r => <BedRow key={r.bed.id} {...r} now={now} onOpen={onOpenBed} flash={flashId === r.bed.id} />)}
                  </Section>
                )}
                {due.length > 0 && (
                  <Section title="Due soon" count={due.length}>
                    {due.map(r => <BedRow key={r.bed.id} {...r} now={now} onOpen={onOpenBed} flash={flashId === r.bed.id} />)}
                  </Section>
                )}
                {ok.length > 0 && (
                  <Section title="On track" count={ok.length}>
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
                  NICE NG235 · NG229 · NG25 · GL983 · GL787
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
            <button type="button" onClick={onRound} disabled={summary.women === 0} className={`${BTN} ${BTN_SECONDARY} min-h-[3.25rem] whitespace-nowrap`}>
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
