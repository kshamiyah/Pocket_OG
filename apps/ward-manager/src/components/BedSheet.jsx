import Sheet from "../ui/Sheet";
import { Chip, Label } from "../ui/atoms";
import { ALERT_BOX, BTN, BTN_CONCERN, BTN_OK, BTN_SECONDARY, SEV_TEXT, TYPE_META } from "../ui/styles";
import { IconTick, IconChevron } from "../ui/icons";
import { fmtAge, clock } from "../utils/time";
import {
  STAGES, STAGE_SHORT, LIQUOR_SHORT, capitalise, currentOxytocin, fixLabel, lastCTG, lastVE, obsStatus, obsTracked,
  parityShort, stageLabel, veFindings, membraneStatus,
} from "../utils/bedModel";
import { tidy } from "../utils/triage";

export function AlertList({ alerts, onFix }) {
  if (!alerts.length) return null;
  return (
    <div className="space-y-1.5">
      {alerts.map(a => {
        const fix = fixLabel(a.id);
        return (
          <div key={a.id} className={`rounded-xl border px-3 py-2.5 flex items-center gap-3 ${ALERT_BOX[a.severity]}`}>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold leading-snug ${SEV_TEXT[a.severity]}`}>{tidy(a.title)}</p>
              <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mt-0.5">{a.citation}</p>
            </div>
            {fix && onFix && (
              <button type="button" onClick={() => onFix(a.id)}
                className="shrink-0 min-h-9 px-3 rounded-lg border bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-700 dark:text-gray-200 active:scale-95">
                {fix}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Fact({ k, children }) {
  return (
    <>
      <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 pt-0.5">{k}</dt>
      <dd className="text-sm text-gray-900 dark:text-gray-100">{children}</dd>
    </>
  );
}

export default function BedSheet({ bed, t, now, onClose, onCTGNormal, onCTGConcern, onVE, onObs, onFix, onStage, onDelivered, onOxy, onRecord, onRemove }) {
  if (!bed) return null;
  const ve = lastVE(bed);
  const ctg = lastCTG(bed);
  const oxy = currentOxytocin(bed);
  const sub = [parityShort(bed.parity), bed.gestation, stageLabel(bed), ...(bed.riskFlags ?? []), bed.analgesia !== "None" ? bed.analgesia : null]
    .filter(Boolean).join(" · ");

  if (bed.delivery) {
    const d = bed.delivery;
    return (
      <Sheet open onClose={onClose} title={`Bed ${bed.bedNumber}`} sub={sub}>
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
  return (
    <Sheet open onClose={onClose} title={`Bed ${bed.bedNumber}`} sub={sub}>
      {t.shown.length ? <AlertList alerts={t.shown} onFix={onFix} /> : (
        <div className="rounded-xl border px-3 py-2.5 bg-gray-50 dark:bg-gray-900/60 border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Nothing due.{t.next ? <> Next: <span className="font-semibold">{t.next.label} {clock(t.next.at)}</span> (in {fmtAge(t.next.at - now)})</> : null}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        {ctg && ctg.classification !== "normal"
          ? <button type="button" onClick={onCTGNormal} className={`${BTN} ${BTN_OK} min-h-14 text-base`}>CTG review</button>
          : <button type="button" onClick={onCTGNormal} className={`${BTN} ${BTN_OK} min-h-14 text-base`}><IconTick /> CTG normal</button>}
        <button type="button" onClick={onCTGConcern} className={`${BTN} ${BTN_CONCERN} min-h-14 text-base`}>CTG concern</button>
        <button type="button" onClick={onVE} className={`${BTN} ${BTN_SECONDARY} min-h-14 text-base`}>VE</button>
        <button type="button" onClick={onObs} className={`${BTN} ${BTN_SECONDARY} min-h-14 text-base`}><IconTick /> Obs done</button>
      </div>

      <div>
        <Label hint="tap to change">Stage</Label>
        <div className="flex flex-wrap gap-1.5">
          {STAGES.map(s => <Chip key={s} small on={bed.labourStage === s} onClick={() => onStage(s)}>{STAGE_SHORT[s]}</Chip>)}
          <Chip small onClick={onDelivered}>Delivered</Chip>
        </div>
      </div>

      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
        <Fact k="Last VE">{ve ? `${veFindings(ve)} · ${clock(ve.time)} (${fmtAge(now - new Date(ve.time).getTime())} ago)` : "None recorded"}</Fact>
        <Fact k="Last CTG">{ctg ? `${capitalise(ctg.classification)} · ${clock(ctg.time)} (${fmtAge(now - new Date(ctg.time).getTime())} ago)` : "Not logged"}</Fact>
        {obsTracked(bed) && <Fact k="Obs">{obs.map(o => `${o.letter} ${o.done ? "✓" : "due"}`).join("   ")}</Fact>}
        <Fact k="Membranes">{(() => { const m = membraneStatus(bed); return m.status ? `${m.status}${m.time ? ` ${clock(m.time)}` : ""}${m.liquor ? ` · ${LIQUOR_SHORT[m.liquor] ?? m.liquor}` : ""}` : "Not recorded"; })()}</Fact>
        {oxy && <Fact k="Oxytocin">{oxy.dose} mU/min since {clock(oxy.lastIncrementTime ?? oxy.startTime)}</Fact>}
        {bed.modeOfOnset === "Induced" && <Fact k="IOL">{[bed.inductionMethod, bed.inductionStartTime ? `started ${clock(bed.inductionStartTime)}` : null].filter(Boolean).join(" · ") || "Induced"}</Fact>}
      </dl>

      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={onOxy} className={`${BTN} ${BTN_SECONDARY}`}>Oxytocin</button>
        <button type="button" onClick={onRecord} className={`${BTN} ${BTN_SECONDARY}`}>Full record <IconChevron /></button>
      </div>
      <p className={`${TYPE_META} text-center`}>Full record: VE and CTG history, obs values, tasks, details.</p>
    </Sheet>
  );
}
