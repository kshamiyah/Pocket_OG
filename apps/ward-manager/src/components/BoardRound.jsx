import { AlertList } from "./BedSheet";
import { BTN, BTN_OK, BTN_PRIMARY, BTN_SECONDARY, CARD, TYPE_META, TYPE_OVERLINE } from "../ui/styles";
import { IconBack, IconTick } from "../ui/icons";
import { fmtAge, clock } from "../utils/time";
import { LIQUOR_SHORT, capitalise, lastCTG, lastVE, membraneStatus, parityWithHistory, riskShort, stageLabel, veFindings } from "../utils/bedModel";

/** Step through each woman in bed order, confirming or updating as you go. */
export default function BoardRound({ ids, index, beds, triage, updated, now, onIndex, onExit, onVE, onCTGNormal, onMore, onFix, onHandover }) {
  const total = ids.length;
  const done = index >= total;
  const bed = done ? null : beds[ids[index]];
  const t = bed ? triage[bed.id] : null;

  const progress = (
    <div className="flex gap-1" aria-hidden="true">
      {ids.map((id, k) => <span key={id} className={`flex-1 h-1 rounded-full ${k <= index ? "bg-claude-600" : "bg-gray-200 dark:bg-gray-800"}`} />)}
    </div>
  );

  return (
    <div className="fixed inset-0 z-40 bg-white dark:bg-gray-950 flex flex-col" role="dialog" aria-label="Board round"
      style={{ paddingTop: "calc(env(safe-area-inset-top) + 0.75rem)", paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }}>
      <div className="max-w-lg w-full mx-auto px-5 flex-1 min-h-0 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className={TYPE_OVERLINE}>{done ? "Board round" : `Board round · ${index + 1} of ${total}`}</span>
          <button type="button" onClick={onExit} className="min-h-11 px-3 text-sm font-semibold text-claude-700 dark:text-claude-400">Exit</button>
        </div>
        {progress}

        {done ? (
          <>
            <div className={`${CARD} flex-1 flex flex-col items-center justify-center text-center gap-2 px-6`}>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">Round done</p>
              <p className={TYPE_META}>{total} {total === 1 ? "woman" : "women"} reviewed · {updated.size} updated</p>
            </div>
            <button type="button" onClick={onHandover} className={`${BTN} ${BTN_PRIMARY} w-full min-h-[3.25rem] text-base`}>Open handover</button>
            <button type="button" onClick={onExit} className={`${BTN} ${BTN_SECONDARY} w-full`}>Back to board</button>
          </>
        ) : bed && (
          <>
            <div className={`${CARD} flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-3`}>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-3xl font-semibold text-gray-900 dark:text-white">Bed {bed.bedNumber}</span>
                <span className="text-base text-gray-500 dark:text-gray-400">{parityWithHistory(bed)} · {bed.gestation}</span>
              </div>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
                <dt className="text-gray-500 dark:text-gray-400">Stage</dt>
                <dd className="text-gray-900 dark:text-gray-100">{stageLabel(bed)}{bed.labourStage === "Active second stage" && bed.pushingStartTime ? `, ${fmtAge(now - new Date(bed.pushingStartTime).getTime())}` : ""}</dd>
                <dt className="text-gray-500 dark:text-gray-400">Last VE</dt>
                <dd className="text-gray-900 dark:text-gray-100">{(() => { const v = lastVE(bed); return v ? `${veFindings(v)}, ${clock(v.time)} (${fmtAge(now - new Date(v.time).getTime())} ago)` : "None"; })()}</dd>
                <dt className="text-gray-500 dark:text-gray-400">CTG</dt>
                <dd className="text-gray-900 dark:text-gray-100">{(() => { const c = lastCTG(bed); return c ? `${capitalise(c.classification)} at ${clock(c.time)}` : "Not logged"; })()}</dd>
                <dt className="text-gray-500 dark:text-gray-400">Other</dt>
                <dd className="text-gray-900 dark:text-gray-100">{[
                  bed.analgesia !== "None" ? bed.analgesia : null,
                  ...(bed.riskFlags ?? []).map(riskShort),
                  bed.modeOfOnset !== "Spontaneous" ? bed.modeOfOnset : null,
                  (() => { const m = membraneStatus(bed); return m.status ? `${m.status}${m.liquor ? `, ${LIQUOR_SHORT[m.liquor] ?? m.liquor}` : ""}` : null; })(),
                ].filter(Boolean).join(" · ") || "Nothing else"}</dd>
              </dl>
              {t && <AlertList key={bed.id} alerts={t.shown} onFix={id => onFix(bed.id, id)} limit={2} />}
              {t && !t.shown.length && t.next && <p className={TYPE_META}>Next: {t.next.label} {clock(t.next.at)} (in {fmtAge(t.next.at - now)})</p>}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button type="button" onClick={() => onVE(bed.id)} className={`${BTN} ${BTN_SECONDARY}`}>VE</button>
              <button type="button" onClick={() => onCTGNormal(bed.id)} className={`${BTN} ${BTN_OK}`}><IconTick /> CTG</button>
              <button type="button" onClick={() => onMore(bed.id)} className={`${BTN} ${BTN_SECONDARY}`}>More</button>
            </div>
            <div className="grid grid-cols-[auto_1fr] gap-2">
              <button type="button" onClick={() => onIndex(index - 1)} disabled={index === 0} aria-label="Previous woman" className={`${BTN} ${BTN_SECONDARY} w-14`}><IconBack /></button>
              <button type="button" onClick={() => onIndex(index + 1)} className={`${BTN} ${BTN_PRIMARY} min-h-[3.25rem] text-base`}>
                {updated.has(bed.id) ? "Next" : "No change · next"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
