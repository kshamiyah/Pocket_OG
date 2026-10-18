import { useState } from "react";
import { BTN, BTN_PRIMARY, BTN_SECONDARY, CARD, TYPE_DISPLAY, TYPE_EYEBROW, TYPE_META } from "../ui/styles";
import { doctorLabel, lastVE, parityShort, stageLabel } from "../utils/bedModel";

export default function HandoverIn({ beds, doctorName, onTakeOver, onClear }) {
  // Clearing deletes every woman on this phone, so it takes a second tap.
  const [confirm, setConfirm] = useState(false);
  const bedList = Object.values(beds).sort((a, b) => String(a.bedNumber).localeCompare(String(b.bedNumber), undefined, { numeric: true }));
  return (
    <div className="min-h-dvh bg-white dark:bg-gray-950 flex flex-col"
      style={{ paddingTop: "calc(env(safe-area-inset-top) + 2rem)", paddingBottom: "calc(env(safe-area-inset-bottom) + 1.25rem)" }}>
      <div className="max-w-lg w-full mx-auto px-6 flex-1 flex flex-col gap-5">
        <div>
          <span className={`${TYPE_EYEBROW} block mb-2`}>{doctorLabel(doctorName)}</span>
          <h1 className={TYPE_DISPLAY}>Taking over</h1>
          <p className={`${TYPE_META} mt-1`}>{bedList.length} {bedList.length === 1 ? "woman" : "women"} on the board from the last shift. A board round is the quickest way to check each one.</p>
        </div>
        <div className="space-y-1.5">
          {bedList.map(bed => {
            const ve = lastVE(bed);
            return (
              <div key={bed.id} className={`${CARD} px-3 py-2.5 flex items-center justify-between gap-3`}>
                <div className="min-w-0">
                  <span className="text-base font-semibold text-gray-900 dark:text-white">Bed {bed.bedNumber}</span>
                  <span className={`${TYPE_META} ml-2`}>{parityShort(bed.parity)} · {bed.gestation}</span>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${bed.delivery ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400" : "bg-gray-200/70 dark:bg-gray-800 text-gray-600 dark:text-gray-300"}`}>
                  {stageLabel(bed)}{!bed.delivery && ve ? ` · ${ve.dilation} cm` : ""}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-auto space-y-2">
          <button type="button" onClick={onTakeOver} className={`${BTN} ${BTN_PRIMARY} w-full min-h-[3.25rem] text-base`}>Take over the board</button>
          {!confirm ? (
            <button type="button" onClick={() => setConfirm(true)} className={`${BTN} ${BTN_SECONDARY} w-full`}>Clear the board and start fresh</button>
          ) : (
            <div className="space-y-2">
              <p className={`${TYPE_META} text-center font-semibold text-red-700 dark:text-red-400`}>This deletes every woman on the board from this phone. It cannot be undone.</p>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setConfirm(false)} className={`${BTN} ${BTN_SECONDARY}`}>Keep the board</button>
                <button type="button" onClick={onClear} className={`${BTN} bg-red-600 text-white`}>Delete all</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
