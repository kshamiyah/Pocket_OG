import { useState } from "react";
import Sheet from "../ui/Sheet";
import { Label } from "../ui/atoms";
import { ALERT_BOX, BTN, BTN_SECONDARY, SEV_TEXT } from "../ui/styles";
import { IconChevron, IconInfo } from "../ui/icons";
import { fmtAge, clock } from "../utils/time";
import {
  ACTION_ALERTS, DECLINABLE, STAGES, STAGE_SHORT, LIQUOR_SHORT, capitalise, currentOxytocin, fixLabel, lastCTG, lastVE, obsStatus, obsTracked,
  parityWithHistory, riskShort, stageLabel, membraneStatus,
} from "../utils/bedModel";
import { shortLabel, tidy } from "../utils/triage";
import { useRules } from "../ui/rulesContext";
import { RULE_FOR_ALERT } from "../data/ruleCatalogue";

/**
 * Alerts, most urgent first. With `limit`, only the first few are shown in
 * full when the sheet opens; the rest are named on one line that expands, so
 * nothing is hidden without a trace.
 */
export function AlertList({ alerts, onFix, limit = null, compact = false }) {
  const { openRule } = useRules();
  const [expanded, setExpanded] = useState(false);
  if (!alerts.length) return null;
  const collapsed = limit != null && !expanded && alerts.length > limit + 1;
  const visible = collapsed ? alerts.slice(0, limit) : alerts;
  const rest = alerts.slice(limit ?? alerts.length);
  const restUrgent = rest.filter(a => a.severity === "urgent").length;
  return (
    <div className="space-y-1.5">
      {visible.map(a => {
        const fix = a.reviewed ? null : fixLabel(a.id);
        return (
          <div key={a.id} className={`rounded-xl border px-3 ${compact ? "py-2" : "py-2.5"} flex items-center gap-2.5 ${ALERT_BOX[a.severity]}`}>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold leading-snug ${SEV_TEXT[a.severity]}`}>{tidy(a.title)}</p>
              {a.reviewed && (
                <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mt-0.5">
                  Reviewed {clock(a.reviewed.at)}{a.reviewed.by ? ` by ${a.reviewed.by}` : ""} · returns {clock(a.reviewed.until)} if still present
                </p>
              )}
              {compact ? null : openRule && RULE_FOR_ALERT[a.id] ? (
                <button type="button" onClick={() => openRule(a.id)} aria-label={`Source for this alert: ${a.citation}`}
                  className="text-left text-[11px] font-semibold text-claude-700 dark:text-claude-400 mt-0.5 underline decoration-dotted underline-offset-2 active:opacity-70">
                  {a.citation}
                </button>
              ) : (
                <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mt-0.5">{a.citation}</p>
              )}
            </div>
            {compact && openRule && RULE_FOR_ALERT[a.id] && (
              <button type="button" onClick={() => openRule(a.id)} aria-label={`Why: ${a.citation}`}
                className="shrink-0 w-8 h-8 -mr-1 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 active:scale-95">
                <IconInfo className="w-4 h-4" />
              </button>
            )}
            {fix && onFix && (
              <div className="shrink-0 flex flex-col gap-1">
                <button type="button" onClick={() => onFix(a.id)}
                  className={`min-h-9 px-3 rounded-lg border text-xs font-bold active:scale-95 ${ACTION_ALERTS[a.id] ? "bg-red-600 border-red-600 text-white" : "bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200"}`}>
                  {fix}
                </button>
                {DECLINABLE.has(a.id) && (
                  <button type="button" onClick={() => onFix(a.id, "decline")}
                    className="min-h-8 px-3 rounded-lg border bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-500 dark:text-gray-400 active:scale-95">
                    Not given
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
      {collapsed && (
        <button type="button" onClick={() => setExpanded(true)} aria-expanded="false"
          className="w-full min-h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 flex items-center gap-2 text-left">
          <span className={`shrink-0 text-xs font-bold ${restUrgent ? "text-red-600 dark:text-red-400" : "text-gray-700 dark:text-gray-300"}`}>
            +{rest.length} more{restUrgent ? ` (${restUrgent} urgent)` : ""}
          </span>
          <span className="flex-1 min-w-0 truncate text-xs text-gray-500 dark:text-gray-400">{rest.map(shortLabel).join(" · ")}</span>
          <IconChevron className="w-3.5 h-3.5 shrink-0 rotate-90 text-gray-500" />
        </button>
      )}
      {limit != null && expanded && alerts.length > limit + 1 && (
        <button type="button" onClick={() => setExpanded(false)} aria-expanded="true"
          className="w-full min-h-9 text-xs font-semibold text-claude-700 dark:text-claude-400">Show fewer</button>
      )}
    </div>
  );
}


// Tile tone from the alerts that concern it: red needs you, amber is due.
const TONE = {
  red: "bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-900 text-red-700 dark:text-red-300",
  amber: "bg-claude-50 dark:bg-claude-950/40 border-claude-300 dark:border-claude-800 text-claude-800 dark:text-claude-300",
  ok: "bg-gray-50 dark:bg-gray-900/60 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100",
};
const TILE_ALERTS = {
  ve: { red: ["ve-overdue", "ve-never", "slow-progress", "oxytocin-poor-progress"], amber: ["ve-due", "arm-reassess", "active-phase-limit"] },
  ctg: { red: ["ctg-pathological", "ctg-suspicious-overdue", "oxytocin-stop-pathological"], amber: ["ctg-suspicious", "ctg-review-due", "ctg-not-documented"] },
  obs: { red: ["bp-severe", "bp-low", "temp-38", "rr-low", "bgl-low", "bgl-high", "bgl-due", "bgl-never"], amber: ["tachycardia", "oliguria", "bp-elevated", "temp-375", "temp-low", "rr-high", "pulse-due", "pulse-never", "bp-due", "bp-never", "temp-due", "temp-never", "rr-due", "rr-never"] },
  oxy: { red: ["hyperstim", "oxytocin-max", "oxytocin-stop-pathological"], amber: ["oxytocin-increment"] },
  memb: { red: ["mec-thick", "liquor-blood", "prom-48h", "prom-24h", "prom-18h"], amber: ["mec-thin", "liquor-absent", "prom-16h", "gbs-pending-rupture"] },
};
function toneFor(kind, alerts) {
  const ids = new Set(alerts.map(a => a.id));
  // An urgent obs-due (hypertensive BP) counts as red.
  if (TILE_ALERTS[kind].red.some(id => ids.has(id)) || alerts.some(a => a.severity === "urgent" && TILE_ALERTS[kind].amber.includes(a.id))) return "red";
  return TILE_ALERTS[kind].amber.some(id => ids.has(id)) ? "amber" : "ok";
}

/** A status tile that is also the button for its action. */
function Tile({ label, value, meta, tone, onClick, ariaLabel }) {
  return (
    <button type="button" onClick={onClick} aria-label={ariaLabel}
      className={`min-w-0 min-h-[4.75rem] rounded-xl border px-2.5 py-2 flex flex-col items-start justify-between text-left active:scale-[0.98] transition-transform ${TONE[tone]}`}>
      <span className="text-[10px] font-semibold uppercase tracking-wide opacity-70">{label}</span>
      <span className="text-base font-semibold leading-tight tabular-nums truncate w-full">{value}</span>
      <span className="text-[11px] leading-tight opacity-80 truncate w-full">{meta}</span>
    </button>
  );
}

const STAGE_BAR = { "Latent": "Latent", "Active first stage": "Active", "Passive second stage": "Passive", "Active second stage": "Pushing" };

export default function BedSheet({ bed, t, now, onClose, onEdit, onCTGConcern, onVE, onObs, onFix, onStage, onDelivered, onOxy, onRecord, onRemove }) {
  if (!bed) return null;
  const ve = lastVE(bed);
  const ctg = lastCTG(bed);
  const oxy = currentOxytocin(bed);
  const iol = bed.modeOfOnset === "Induced" ? `IOL${bed.inductionMethod ? ` (${bed.inductionMethod})` : ""}` : null;
  // Membranes sit in the line under the bed number, so the 4th tile can always be oxytocin.
  const m0 = membraneStatus(bed);
  const membText = !m0.status || bed.delivery ? null : m0.status === "Intact" ? "Membranes intact"
    : [`${m0.status}${m0.time ? ` ${fmtAge(now - new Date(m0.time).getTime())}` : ""}`, m0.liquor ? (LIQUOR_SHORT[m0.liquor] ?? m0.liquor) : null].filter(Boolean).join(", ");
  const sub = [parityWithHistory(bed), bed.gestation, stageLabel(bed), iol, membText, ...(bed.riskFlags ?? []).map(riskShort), bed.analgesia !== "None" ? bed.analgesia : null]
    .filter(Boolean).join(" · ");

  const editBtn = onEdit && (
    <button type="button" onClick={onEdit}
      className="shrink-0 min-h-9 px-3 rounded-full bg-gray-100 dark:bg-gray-900 text-sm font-semibold text-claude-700 dark:text-claude-400 active:scale-95">Edit</button>
  );

  if (bed.delivery) {
    const d = bed.delivery;
    return (
      <Sheet open onClose={onClose} title={`Bed ${bed.bedNumber}`} sub={sub} action={editBtn}>
        {t.shown.length > 0 && <AlertList alerts={t.shown} onFix={onFix} limit={2} compact />}
        <div className="rounded-xl border px-3 py-2.5 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800">
          <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-400">{d.mode} at {clock(d.time)}</p>
          <p className="text-xs text-emerald-700 dark:text-emerald-400/80">{d.ebl != null ? `EBL ${d.ebl} mL` : "EBL not recorded"}{d.notes ? ` · ${d.notes}` : ""}</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={onDelivered} className={`${BTN} ${BTN_SECONDARY}`}>Edit delivery</button>
          <button type="button" onClick={onRecord} className={`${BTN} ${BTN_SECONDARY}`}>Full record</button>
        </div>
        <button type="button" onClick={onRemove} className={`${BTN} ${BTN_SECONDARY} w-full`}>Remove from board</button>
      </Sheet>
    );
  }

  const obs = obsStatus(bed, now);
  const ago = iso => fmtAge(now - new Date(iso).getTime());
  const obsDue = obs.filter(o => !o.done);
  // An abnormal value outranks "done": the tile names it until a newer value replaces it.
  const obsAbnormal = t.alerts.find(a => TILE_ALERTS.obs.red.includes(a.id) && !a.id.startsWith("bgl-d") && !a.id.startsWith("bgl-n"))
    ?? t.alerts.find(a => ["tachycardia", "rr-high", "bp-elevated", "temp-375", "temp-low", "oliguria"].includes(a.id));
  const CTG_WORD = { normal: "Normal", suspicious: "Susp.", pathological: "Path." };
  return (
    <Sheet open onClose={onClose} title={`Bed ${bed.bedNumber}`} sub={sub} action={editBtn}>
      {/* Status at a glance; each tile is the button for its action. */}
      <div className="grid grid-cols-4 gap-1.5">
        <Tile label="VE" tone={toneFor("ve", t.alerts)} onClick={onVE} ariaLabel="Log a VE"
          value={ve ? `${ve.dilation} cm` : "None"} meta={ve ? `${ago(ve.time)} ago` : "tap to log"} />
        <Tile label="CTG" tone={toneFor("ctg", t.alerts)} onClick={onCTGConcern} ariaLabel="CTG review"
          value={ctg ? CTG_WORD[ctg.classification] ?? capitalise(ctg.classification) : "None"} meta={ctg ? `${ago(ctg.time)} ago` : "not logged"} />
        <Tile label="Obs" tone={toneFor("obs", t.alerts)} onClick={onObs} ariaLabel="Record obs"
          value={obsAbnormal ? "Check" : !obsTracked(bed) ? "—" : obsDue.length ? `${obsDue.length} due` : "Done"}
          meta={obsAbnormal ? shortLabel(obsAbnormal) : obsTracked(bed) ? obs.map(o => `${o.letter}${o.done ? "✓" : "·"}`).join(" ") : "tap to record"} />
        {/* Always oxytocin, so starting it is always in the same place. */}
        <Tile label="Oxytocin" tone={toneFor("oxy", t.alerts)} onClick={onOxy} ariaLabel={oxy ? "Oxytocin" : "Start oxytocin"}
          value={oxy ? `${oxy.dose} mU` : "Off"}
          meta={oxy ? (bed.oxytocinHeld ? "held" : `since ${clock(oxy.lastIncrementTime ?? oxy.startTime)}`) : "tap to start"} />
      </div>

      {ctg?.comment && (
        <p className="text-xs text-gray-600 dark:text-gray-400 px-1 -mt-1 truncate"><span className="font-semibold">CTG {clock(ctg.time)}:</span> {ctg.comment}</p>
      )}

      {t.shown.length ? <AlertList alerts={t.shown} onFix={onFix} limit={2} compact /> : (
        <p className="text-sm text-gray-600 dark:text-gray-400 px-1">
          Nothing due.{t.next ? <> Next: <span className="font-semibold text-gray-900 dark:text-gray-100">{t.next.label} {clock(t.next.at)}</span> (in {fmtAge(t.next.at - now)})</> : null}
        </p>
      )}

      <div>
        <Label tight>Stage</Label>
        <div className="grid grid-cols-5 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden divide-x divide-gray-200 dark:divide-gray-800">
          {STAGES.map(st => (
            <button key={st} type="button" onClick={() => onStage(st)} aria-pressed={bed.labourStage === st}
              className={`min-h-10 text-xs font-semibold ${bed.labourStage === st ? "bg-claude-600 text-white" : "bg-gray-50 dark:bg-gray-900/60 text-gray-600 dark:text-gray-300"}`}>{STAGE_BAR[st] ?? STAGE_SHORT[st]}</button>
          ))}
          <button type="button" onClick={onDelivered} className="min-h-10 text-xs font-semibold bg-gray-50 dark:bg-gray-900/60 text-gray-600 dark:text-gray-300">Delivered</button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 pt-1">
        <span />
        <button type="button" onClick={onRecord} className="min-h-10 px-1 text-sm font-semibold text-claude-700 dark:text-claude-400 inline-flex items-center gap-0.5">Full record <IconChevron className="w-3.5 h-3.5" /></button>
      </div>
    </Sheet>
  );
}
