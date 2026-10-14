import { useState } from "react";
import Sheet from "../ui/Sheet";
import { Chip, ChipRow, DilationGrid, Label, MultiChipRow, Stepper, WhenPicker } from "../ui/atoms";
import { BTN, BTN_PRIMARY, INPUT, TYPE_META } from "../ui/styles";
import { resolveWhen, whenFromISO } from "../utils/time";
import {
  ANALGESIA, IND_METHODS, IOL_REASONS, LIQUORS, LIQUOR_SHORT, MEMBRANES, ONSETS, PARITIES, RISK_FLAGS,
  STAGES, STAGE_SHORT, newId, parityShort,
} from "../utils/bedModel";

const WEEK_CHIPS = [34, 35, 36, 37, 38, 39, 40, 41, 42];

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
  const [weeks, setWeeks] = useState(g0.w);
  const [days, setDays] = useState(g0.d);
  const [otherWeeks, setOtherWeeks] = useState(g0.w != null && !WEEK_CHIPS.includes(g0.w));
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
  const [flags, setFlags] = useState(edit ? bed.riskFlags ?? [] : []);
  const [veDil, setVeDil] = useState(null);
  const [veWhen, setVeWhen] = useState({ minsAgo: 0 });
  const [admWhen, setAdmWhen] = useState({ minsAgo: 0 });
  const [more, setMore] = useState(edit || !!iolEntry);

  const used = new Set(existingNumbers.map(String));
  const free = Array.from({ length: 12 }, (_, i) => String(i + 1)).filter(n => !used.has(n));
  const trimmed = String(num ?? "").trim();
  const clash = trimmed && used.has(trimmed) && !(edit && trimmed === String(bed.bedNumber));
  const ready = trimmed && !clash && parity && weeks && stage;
  const parityOptions = edit && bed.parity && !PARITIES.includes(bed.parity) ? [...PARITIES, bed.parity] : PARITIES;

  const save = () => {
    if (!ready) return;
    const gestation = `${weeks}+${days}`;
    const induced = onset === "Induced";
    const iolISO = induced ? resolveWhen(iolWhen) : null;
    if (edit) {
      onSave({
        bedNumber: trimmed, parity, gestation, labourStage: stage, modeOfOnset: onset, analgesia, riskFlags: flags,
        inductionMethod: induced ? indMethod : null,
        iolReasons: induced ? iolReasons : [],
        inductionStartTime: induced ? iolISO ?? bed.inductionStartTime ?? null : null,
      });
      return;
    }
    const admISO = resolveWhen(admWhen) ?? new Date().toISOString();
    const veISO = veDil != null ? resolveWhen(veWhen) ?? admISO : null;
    const stageTime = veISO ?? admISO;
    const membranes = onset === "PPROM" && memb === "Intact" ? "SROM" : memb;
    const ves = veDil != null ? [{
      id: newId("ve"), time: veISO, dilation: veDil, station: 0, presentation: "Cephalic",
      membranes, membranesTime: membranes !== "Intact" ? stageTime : null,
      liquor: membranes !== "Intact" ? liquor : null, contractions: 3,
    }] : [];
    onSave({
      id: newId("bed"), bedNumber: trimmed, admissionTime: admISO,
      parity, gestation, modeOfOnset: onset,
      inductionMethod: induced ? indMethod : null,
      iolReasons: induced ? iolReasons : [],
      inductionStartTime: iolISO,
      analgesia, riskFlags: flags, labourStage: stage,
      activeFirstStageStartTime: stage === "Active first stage" ? stageTime : null,
      passiveStartTime: stage === "Passive second stage" ? stageTime : null,
      pushingStartTime: stage === "Active second stage" ? stageTime : null,
      armTime: membranes === "AROM" ? stageTime : null,
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
        <div className="flex flex-wrap gap-1.5">
          {free.map(n => <Chip key={n} on={trimmed === n} onClick={() => setNum(n)}>{n}</Chip>)}
          {edit && !free.includes(String(bed.bedNumber)) && <Chip on={trimmed === String(bed.bedNumber)} onClick={() => setNum(bed.bedNumber)}>{bed.bedNumber}</Chip>}
        </div>
        <input value={num} onChange={e => setNum(e.target.value)} placeholder="Or type a bed, e.g. 14 or Pool"
          className={`${INPUT} mt-2`} aria-label="Bed" maxLength={12} />
        <p className={`${TYPE_META} mt-1`}>Bed number only. No patient identifiers are stored.</p>
      </div>

      <div>
        <Label>Parity</Label>
        <ChipRow options={parityOptions} value={parity} onChange={setParity} label={parityShort} />
      </div>

      <div>
        <Label hint="weeks, then days">Gestation</Label>
        {!otherWeeks ? (
          <div className="flex flex-wrap gap-1.5">
            {WEEK_CHIPS.map(w => <Chip key={w} on={weeks === w} onClick={() => setWeeks(w)}>{w}</Chip>)}
            <Chip on={false} onClick={() => { setOtherWeeks(true); setWeeks(w => w ?? 33); }}>Other</Chip>
          </div>
        ) : (
          <Stepper value={weeks ?? 33} onChange={setWeeks} min={22} max={44} format={w => `${w} weeks`} />
        )}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {[0, 1, 2, 3, 4, 5, 6].map(d => <Chip key={d} small on={days === d} onClick={() => setDays(d)}>+{d}</Chip>)}
        </div>
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
              <ChipRow small options={MEMBRANES} value={onset === "PPROM" && memb === "Intact" ? "SROM" : memb} onChange={setMemb} />
              {(memb !== "Intact" || onset === "PPROM") && (
                <div className="mt-2"><ChipRow small options={LIQUORS} value={liquor} onChange={setLiquor} label={o => LIQUOR_SHORT[o]} /></div>
              )}
            </div>
          )}
          <div>
            <Label>Analgesia</Label>
            <ChipRow small options={ANALGESIA} value={analgesia} onChange={setAnalgesia} />
          </div>
          <div>
            <Label>Risk flags</Label>
            <MultiChipRow options={RISK_FLAGS} values={flags} onChange={setFlags} />
            {flags.includes("GBS+") && <p className="text-xs font-semibold text-claude-700 dark:text-claude-400 mt-1.5">GBS+: IV benzylpenicillin in labour (GL787).</p>}
            {flags.some(f => f.startsWith("Diabetic")) && <p className="text-xs font-semibold text-claude-700 dark:text-claude-400 mt-1">Diabetic: hourly BGL (GL983).</p>}
          </div>
          {!edit && (
            <>
              <div>
                <Label hint="if handed over">Last VE (cm)</Label>
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
