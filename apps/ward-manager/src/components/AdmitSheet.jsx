import { useState } from "react";
import Sheet from "../ui/Sheet";
import RiskPicker from "./RiskPicker";
import { Chip, ChipRow, DilationGrid, Label, MultiChipRow, Stepper, WhenPicker } from "../ui/atoms";
import { BTN, BTN_PRIMARY, INPUT, TYPE_META } from "../ui/styles";
import { resolveWhen, whenFromISO } from "../utils/time";
import {
  ANALGESIA, BIRTH_MODES, BIRTH_SHORT, IND_METHODS, IOL_REASONS, LIQUORS, LIQUOR_SHORT, MEMBRANES, ONSETS, PARITIES,
  STAGES, STAGE_SHORT, gestFromDigits, newId, parityNum, parityShort,
} from "../utils/bedModel";


// IOL queue indications that imply a risk flag, so admitting from the queue keeps it.
const IOL_FLAG = { "GDM": "Diabetic-GDM", "Pre-eclampsia": "Hypertensive", "Severe pre-eclampsia": "Hypertensive" };

function parseGest(g) {
  const m = /^(\d+)\+(\d)$/.exec(g ?? "");
  return m ? { w: +m[1], d: +m[2] } : { w: null, d: 0 };
}

/**
 * mode "new": quick admit. mode "iol": admit from the IOL queue (pre-filled).
 * mode "edit": change an existing woman's details.
 */
export default function AdmitSheet({ mode = "new", bed = null, iolEntry = null, existingNumbers = [], onSave, onClose }) {
  const edit = mode === "edit";
  const g0 = edit ? parseGest(bed.gestation) : iolEntry ? { w: iolEntry.gestWeeks, d: iolEntry.gestDays ?? 0 } : { w: null, d: 0 };

  const [num, setNum] = useState(edit ? bed.bedNumber : "");
  const [parity, setParity] = useState(edit ? bed.parity : null);
  const [customParity, setCustomParity] = useState(edit && !!bed.parity && !PARITIES.includes(bed.parity));
  const [prevBirths, setPrevBirths] = useState(edit ? bed.prevBirths ?? [] : []);
  // Gestation is typed as digits on the number keypad: 3, 9, 4 → 39+4.
  const [gestDigits, setGestDigits] = useState(g0.w != null ? `${g0.w}${g0.d ?? 0}` : "");
  const gest = gestFromDigits(gestDigits);
  const weeks = gest.valid ? gest.w : null;
  const days = gest.valid ? gest.d : 0;
  const [stage, setStage] = useState(edit ? bed.labourStage : iolEntry ? "Latent" : null);
  const [onset, setOnset] = useState(edit ? bed.modeOfOnset ?? "Spontaneous" : iolEntry ? "Induced" : "Spontaneous");
  const [indMethod, setIndMethod] = useState(edit ? bed.inductionMethod ?? "Dinoprostone" : "Dinoprostone");
  const [iolReasons, setIolReasons] = useState(edit ? bed.iolReasons ?? [] : iolEntry ? iolEntry.indications ?? [] : []);
  const [iolWhen, setIolWhen] = useState(
    edit && bed.inductionStartTime ? whenFromISO(bed.inductionStartTime)
      : iolEntry?.addedAt ? whenFromISO(iolEntry.addedAt) : { minsAgo: 0 });
  const [memb, setMemb] = useState("Intact");
  const [liquor, setLiquor] = useState("Clear");
  const [analgesia, setAnalgesia] = useState(edit ? bed.analgesia ?? "None" : "None");
  const [flags, setFlags] = useState(edit ? bed.riskFlags ?? []
    : iolEntry ? [...new Set((iolEntry.indications ?? []).map(i => IOL_FLAG[i]).filter(Boolean))] : []);
  const [romWhen, setRomWhen] = useState({ minsAgo: 0 });
  const [veDil, setVeDil] = useState(null);
  const [veWhen, setVeWhen] = useState({ minsAgo: 0 });
  const [admWhen, setAdmWhen] = useState({ minsAgo: 0 });
  const [more, setMore] = useState(edit || !!iolEntry);

  const used = new Set(existingNumbers.map(String));
  const free = Array.from({ length: 12 }, (_, i) => String(i + 1)).filter(n => !used.has(n));
  // One row of quick bed chips (the lowest free numbers); anything else is typed.
  const quick = [...new Set([...(edit ? [String(bed.bedNumber)] : []), ...free])].slice(0, 5);
  const [custom, setCustom] = useState(edit && !quick.includes(String(bed.bedNumber)));
  const trimmed = String(num ?? "").trim();
  const clash = trimmed && used.has(trimmed) && !(edit && trimmed === String(bed.bedNumber));
  const effMemb = onset === "PPROM" && memb === "Intact" ? "SROM" : memb;
  const ruptured = !edit && effMemb !== "Intact";
  const romISO = ruptured ? resolveWhen(romWhen) : null;
  const ready = trimmed && !clash && parity && weeks && stage && (!ruptured || !!romISO);
  const nBirths = Math.min(parityNum(parity) ?? (parity === "Para 3+" ? 3 : 0), 10);
  const births = prevBirths.slice(0, nBirths);
  const setBirth = (i, mode) => {
    const next = Array.from({ length: nBirths }, (_, k) => births[k] ?? null);
    next[i] = next[i] === mode ? null : mode;
    setPrevBirths(next);
    // A caesarean in the history is the "Previous LSCS" risk flag.
    if (mode.endsWith("CS") && next[i] && !flags.includes("Previous LSCS")) setFlags(f => [...f, "Previous LSCS"]);
  };
  const ORD = ["1st", "2nd", "3rd"];

  const save = () => {
    if (!ready) return;
    const gestation = `${weeks}+${days}`;
    const induced = onset === "Induced";
    const iolISO = induced ? resolveWhen(iolWhen) : null;
    if (edit) {
      onSave({
        bedNumber: trimmed, parity, prevBirths: births, gestation, labourStage: stage, modeOfOnset: onset, analgesia, riskFlags: flags,
        inductionMethod: induced ? indMethod : null,
        iolReasons: induced ? iolReasons : [],
        inductionStartTime: induced ? iolISO ?? bed.inductionStartTime ?? null : null,
      });
      return;
    }
    const admISO = resolveWhen(admWhen) ?? new Date().toISOString();
    const veISO = veDil != null ? resolveWhen(veWhen) ?? admISO : null;
    const stageTime = veISO ?? admISO;
    const membranes = effMemb;
    // Station and contractions are left unrecorded rather than guessed.
    const ves = veDil != null ? [{
      id: newId("ve"), time: veISO, dilation: veDil, station: null, presentation: "Cephalic",
      membranes, membranesTime: ruptured ? romISO : null,
      liquor: ruptured ? liquor : null, contractions: null,
    }] : [];
    onSave({
      id: newId("bed"), bedNumber: trimmed, admissionTime: admISO,
      parity, prevBirths: births, gestation, modeOfOnset: onset,
      inductionMethod: induced ? indMethod : null,
      iolReasons: induced ? iolReasons : [],
      inductionStartTime: iolISO,
      analgesia, riskFlags: flags, labourStage: stage,
      activeFirstStageStartTime: stage === "Active first stage" ? stageTime : null,
      passiveStartTime: stage === "Passive second stage" ? stageTime : null,
      pushingStartTime: stage === "Active second stage" ? stageTime : null,
      armTime: membranes === "AROM" ? romISO : null,
      membranes, membranesTime: ruptured ? romISO : null, liquor: ruptured ? liquor : null,
      oxytocinStartTime: null,
      ves, oxytocinLog: [], ctgLog: [], observations: {},
    });
  };

  const title = edit ? `Edit Bed ${bed.bedNumber}` : iolEntry ? `Admit ${iolEntry.initials} from IOL queue` : "Admit";
  return (
    <Sheet open onClose={onClose} title={title}
      sub={edit ? "Change details. VE, CTG and obs history stay as they are." : "Bed, parity, gestation and stage. Everything else is optional."}
      footer={
        <button type="button" onClick={save} disabled={!ready} className={`${BTN} ${BTN_PRIMARY} w-full min-h-[3.25rem] text-base`}>
          {!ready ? (clash ? `Bed ${trimmed} is already on the board` : "Pick bed, parity, gestation and stage")
            : edit ? "Save changes" : `Add Bed ${trimmed} · ${parityShort(parity)} · ${weeks}+${days}`}
        </button>
      }>
      <div>
        <Label hint={free.length ? "free beds" : undefined}>Bed</Label>
        <div className="grid grid-cols-[repeat(5,minmax(0,1fr))_auto] gap-1.5">
          {quick.map(n => <Chip key={n} className="px-0" on={!custom && trimmed === n} onClick={() => { setCustom(false); setNum(n); }}>{n}</Chip>)}
          <Chip on={custom} onClick={() => { if (!custom) setNum(""); setCustom(true); }}>Custom</Chip>
        </div>
        {custom && (
          <input autoFocus value={num} onChange={e => setNum(e.target.value)} placeholder="Type a bed, e.g. 14, Pool or HDU"
            className={`${INPUT} mt-2`} aria-label="Bed" maxLength={12} />
        )}
        <p className={`${TYPE_META} mt-1`}>Bed number only. No patient identifiers are stored.</p>
      </div>

      <div>
        <Label>Parity</Label>
        <div className="flex flex-wrap gap-1.5">
          {PARITIES.map(p => <Chip key={p} on={!customParity && parity === p} onClick={() => { setCustomParity(false); setParity(p); }}>{parityShort(p)}</Chip>)}
          <Chip on={customParity} onClick={() => { if (!customParity) setParity("Para 4"); setCustomParity(true); }}>Custom</Chip>
        </div>
        {customParity && (
          <div className="mt-2">
            <Stepper value={parityNum(parity) ?? 4} onChange={n => setParity(`Para ${n}`)} min={4} max={15} format={n => `P${n}`} />
          </div>
        )}
        {nBirths > 0 && (
          <div className="mt-3 space-y-2">
            <Label hint="optional">Previous births</Label>
            {Array.from({ length: nBirths }, (_, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className={`${TYPE_META} w-8 shrink-0`}>{i < 3 ? ORD[i] : `${i + 1}th`}</span>
                <div className="flex flex-wrap gap-1.5">
                  {BIRTH_MODES.map(m => <Chip key={m} small on={births[i] === m} onClick={() => setBirth(i, m)}>{BIRTH_SHORT[m]}</Chip>)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <Label hint="type 394 for 39+4">Gestation</Label>
        <input id="admit-gestation" type="text" inputMode="numeric" autoComplete="off" aria-label="Gestation"
          value={gest.digits.length === 3 ? `${gest.digits.slice(0, 2)}+${gest.digits[2]}` : gest.digits}
          onChange={e => setGestDigits(gestFromDigits(e.target.value).digits)}
          placeholder="39+4"
          className={`${INPUT} text-2xl font-semibold tabular-nums tracking-wide ${gest.digits.length >= 2 && !gest.valid ? "border-red-400 dark:border-red-700" : ""}`} />
        <p className={`${TYPE_META} mt-1`}>
          {gest.digits.length < 2 ? "Weeks then days, e.g. 3 9 4. Between 22+0 and 43+0."
            : !gest.valid ? "Between 22+0 and 43+0."
            : gest.digits.length === 2 ? `${gest.w}+0. Add a digit for the days.` : `${gest.w}+${gest.d} weeks.`}
        </p>
      </div>

      <div>
        <Label hint={edit ? undefined : "as handed over"}>Stage</Label>
        <ChipRow options={STAGES} value={stage} onChange={setStage} label={s => STAGE_SHORT[s]} />
      </div>

      {!more ? (
        <button type="button" onClick={() => setMore(true)}
          className="w-full min-h-12 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-sm font-semibold text-claude-700 dark:text-claude-400">
          More details (optional): onset, membranes, analgesia, risks, last VE
        </button>
      ) : (
        <>
          <div>
            <Label>Onset</Label>
            <ChipRow small options={ONSETS} value={onset} onChange={setOnset} />
          </div>
          {onset === "Induced" && (
            <>
              <div>
                <Label>Induction method</Label>
                <ChipRow small options={IND_METHODS} value={indMethod} onChange={setIndMethod} />
              </div>
              <div>
                <Label>Indication</Label>
                <MultiChipRow options={[...new Set([...IOL_REASONS, ...iolReasons])]} values={iolReasons} onChange={setIolReasons} />
              </div>
              <WhenPicker label="IOL started" value={iolWhen} onChange={setIolWhen} presets={[0, 60, 120, 240]} />
            </>
          )}
          {!edit && (
            <div>
              <Label>Membranes</Label>
              <ChipRow small options={MEMBRANES} value={effMemb} onChange={setMemb} />
              {ruptured && (
                <div className="mt-2 space-y-3">
                  <ChipRow small options={LIQUORS} value={liquor} onChange={setLiquor} label={o => LIQUOR_SHORT[o]} />
                  <WhenPicker label={`Time of ${effMemb}`} value={romWhen} onChange={setRomWhen} presets={[0, 60, 120, 240]} />
                </div>
              )}
            </div>
          )}
          <div>
            <Label>Analgesia</Label>
            <ChipRow small options={ANALGESIA} value={analgesia} onChange={setAnalgesia} />
          </div>
          <RiskPicker values={flags} onChange={setFlags} />
          {!edit && (
            <>
              <div>
                <Label hint="if handed over">Last VE</Label>
                <DilationGrid value={veDil} onChange={v => setVeDil(veDil === v ? null : v)} />
              </div>
              {veDil != null && <WhenPicker label="Time of that VE" value={veWhen} onChange={setVeWhen} presets={[0, 30, 60, 120, 240]} />}
              <WhenPicker label="Admission time" value={admWhen} onChange={setAdmWhen} presets={[0, 30, 60, 120]} />
            </>
          )}
        </>
      )}
    </Sheet>
  );
}
