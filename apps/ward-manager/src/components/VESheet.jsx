import { useState } from "react";
import Sheet from "../ui/Sheet";
import { ChipRow, DilationGrid, Label, WhenPicker } from "../ui/atoms";
import { BTN, BTN_PRIMARY, TYPE_META } from "../ui/styles";
import { clock, resolveWhen, whenFromISO } from "../utils/time";
import { LIQUORS, LIQUOR_SHORT, MEMBRANES, STAGE_SHORT, lastVE, newId, stationLabel, suggestedStage } from "../utils/bedModel";

function prevRuptureTime(bed) {
  const ves = bed.ves ?? [];
  for (let i = ves.length - 1; i >= 0; i--) if (ves[i].membranesTime) return ves[i].membranesTime;
  return bed.membranesTime ?? null; // recorded at admission
}

const toggle = (cur, set) => v => set(cur === v ? null : v);

export default function VESheet({ bed, editVE = null, onSave, onClose }) {
  const last = editVE ? null : lastVE(bed);
  const base = editVE ?? last;
  // Starts at the last examination's dilation, so the new finding is a slide from it.
  const [dil, setDil] = useState(editVE?.dilation ?? last?.dilation ?? null);
  const [when, setWhen] = useState(editVE ? whenFromISO(editVE.time) : { minsAgo: 0 });
  // Station and contractions are findings of this examination, so they are never
  // copied from the last VE. Membranes, liquor and presentation carry over.
  const [station, setStation] = useState(editVE ? editVE.station ?? null : null);
  const [memb, setMemb] = useState(base?.membranes ?? bed.membranes ?? "Intact");
  const [liquor, setLiquor] = useState(base?.liquor ?? bed.liquor ?? "Clear");
  const [cx, setCx] = useState(editVE ? editVE.contractions ?? null : null);
  const [pres, setPres] = useState(base?.presentation ?? "Cephalic");
  const [more, setMore] = useState(!!editVE || !last);
  const [romWhen, setRomWhen] = useState(editVE?.membranesTime ? whenFromISO(editVE.membranesTime) : null);
  const [stageTo, setStageTo] = useState(false);

  const veISO = resolveWhen(when);
  const prevRom = prevRuptureTime(bed);
  const priorMemb = base?.membranes ?? bed.membranes ?? "Intact";
  const newlyRuptured = memb !== "Intact" && !(priorMemb === memb && (editVE ? editVE.membranesTime : prevRom));
  const romISO = memb === "Intact" ? null
    : romWhen ? resolveWhen(romWhen)
    : editVE?.membranesTime ?? (newlyRuptured ? veISO : prevRom ?? veISO);
  const suggestion = !editVE && dil != null ? suggestedStage(bed, dil) : null;
  const canSave = dil != null && !!veISO && (memb === "Intact" || !!romISO);

  const save = () => {
    if (!canSave) return;
    onSave({
      id: editVE?.id ?? newId("ve"),
      time: veISO,
      dilation: dil,
      station,
      presentation: pres,
      membranes: memb,
      membranesTime: romISO,
      liquor: memb === "Intact" ? null : liquor,
      contractions: cx,
    }, suggestion && stageTo ? suggestion : null);
  };

  const carry = [
    memb === "Intact" ? "Membranes intact" : `${memb}${romISO ? ` ${clock(romISO)}` : ""} · ${LIQUOR_SHORT[liquor] ?? liquor}`,
    pres,
  ].filter(Boolean).join(" · ");

  return (
    <Sheet open onClose={onClose}
      title={`${editVE ? "Edit VE" : "VE"} · Bed ${bed.bedNumber}`}
      sub={last ? `Last: ${last.dilation} cm at ${clock(last.time)} · NICE NG235 1.8.19` : "NICE NG235 1.8.19"}
      footer={
        <button type="button" onClick={save} disabled={!canSave} className={`${BTN} ${BTN_PRIMARY} w-full min-h-[3.25rem] text-base`}>
          {dil == null ? "Set the dilation" : `${editVE ? "Save changes" : "Save VE"} · ${dil} cm`}
        </button>
      }>
      <div>
        <Label>Dilation</Label>
        <DilationGrid value={dil} onChange={setDil} lastValue={editVE ? null : last?.dilation ?? null} />
      </div>

      {suggestion && (
        <button type="button" onClick={() => setStageTo(s => !s)} aria-pressed={stageTo}
          className={`w-full text-left rounded-xl border px-3 py-2.5 flex items-center gap-3 transition-colors ${stageTo ? "bg-claude-50 dark:bg-claude-950/40 border-claude-500" : "bg-gray-50 dark:bg-gray-900/60 border-gray-200 dark:border-gray-800"}`}>
          <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center text-[11px] font-bold ${stageTo ? "bg-claude-600 border-claude-600 text-white" : "border-gray-300 dark:border-gray-600"}`}>{stageTo ? "✓" : ""}</span>
          <span className="text-sm text-gray-800 dark:text-gray-200">Also change stage to <b>{STAGE_SHORT[suggestion]}</b></span>
        </button>
      )}

      <div>
        <Label hint="optional">Station</Label>
        <ChipRow small options={[-3, -2, -1, 0, 1, 2, 3]} value={station} onChange={toggle(station, setStation)} label={stationLabel} />
      </div>
      <div>
        <Label hint={cx >= 5 ? "5 or more in 10: reduce frequency (NG235 1.8.55, NG229 1.4.14)" : "optional"}>Contractions in 10 min</Label>
        <ChipRow small options={[1, 2, 3, 4, 5, 6, 7, 8]} value={cx} onChange={toggle(cx, setCx)} />
      </div>

      {!more ? (
        <div className="rounded-xl bg-gray-100 dark:bg-gray-900 px-3 py-2.5 flex items-center justify-between gap-3">
          <p className="text-sm text-gray-700 dark:text-gray-300 min-w-0">Same as last: <span className="font-semibold text-gray-900 dark:text-white">{carry}</span></p>
          <button type="button" onClick={() => setMore(true)} className="shrink-0 text-sm font-semibold text-claude-700 dark:text-claude-400 underline underline-offset-2">Change</button>
        </div>
      ) : (
        <>
          <div>
            <Label>Membranes</Label>
            <ChipRow small options={MEMBRANES} value={memb} onChange={setMemb} />
          </div>
          {memb !== "Intact" && (
            <>
              <div>
                <Label>Liquor</Label>
                <ChipRow small options={LIQUORS} value={liquor} onChange={setLiquor} label={o => LIQUOR_SHORT[o]} />
              </div>
              {(newlyRuptured || romWhen || editVE) && (
                <WhenPicker label={`Time of ${memb}`} value={romWhen ?? { minsAgo: when.minsAgo ?? 0 }} onChange={setRomWhen} />
              )}
            </>
          )}
          <div>
            <Label>Presentation</Label>
            <ChipRow small options={["Cephalic", "Breech", "Other"]} value={pres} onChange={setPres} />
          </div>
        </>
      )}

      <WhenPicker label="Time of VE" value={when} onChange={setWhen} />
      {editVE && <p className={TYPE_META}>Editing the VE from {clock(editVE.time)}.</p>}
    </Sheet>
  );
}
