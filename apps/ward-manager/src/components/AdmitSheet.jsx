import { useState } from "react";
import Sheet from "../ui/Sheet";
import RiskPicker from "./RiskPicker";
import SubPage from "../ui/SubPage";
import { useSubPage } from "../ui/useSubPage";
import { IconChevron } from "../ui/icons";
import { Chip, ChipRow, DilationGrid, Label, MultiChipRow, Stepper, WhenPicker } from "../ui/atoms";
import { BTN, BTN_PRIMARY, BTN_SECONDARY, INPUT, TYPE_META } from "../ui/styles";
import { resolveWhen, whenFromISO } from "../utils/time";
import {
  ANALGESIA, BIRTH_MODES, BIRTH_SHORT, IND_METHODS, IOL_REASONS, LIQUORS, LIQUOR_SHORT, MEMBRANES, ONSETS, PARITIES,
  STAGES, STAGE_SHORT, gestFromDigits, newId, parityNum, parityShort, stationLabel,
} from "../utils/bedModel";


// Shorter stage names so the four fit one row on Admit.
const ADMIT_STAGE = { "Latent": "Latent", "Active first stage": "Active", "Passive second stage": "Passive 2nd", "Active second stage": "Pushing" };

const ONSET_SHORT = { Spontaneous: "Spont", Induced: "IOL", PPROM: "PPROM" };
const ANALGESIA_SHORT = { "Remifentanil PCA": "Remi PCA" };

/** "now", "1h ago", "30 min ago", "at 14:05", "at 22:10 yesterday". */
function whenText(w) {
  if (!w) return "now";
  if (w.clock) return `at ${w.clock}${w.daysAgo === 1 ? " yesterday" : w.daysAgo > 1 ? `, ${w.daysAgo} days ago` : ""}`;
  const m = w.minsAgo ?? 0;
  return m === 0 ? "now" : m % 60 === 0 ? `${m / 60}h ago` : `${m} min ago`;
}

/** A one-line summary of a choice's details; tapping it opens them. */
function SummaryLine({ label, text, onClick, warn = false }) {
  return (
    <button type="button" onClick={onClick}
      className={`w-full min-h-10 px-3 rounded-lg border flex items-center gap-2 text-left text-sm active:scale-[0.99] ${warn ? "bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-900" : "bg-gray-50 dark:bg-gray-900/60 border-gray-200 dark:border-gray-800"}`}>
      <span className="font-semibold text-gray-900 dark:text-gray-100 shrink-0">{label}</span>
      <span className={`flex-1 min-w-0 truncate ${warn ? "text-red-700 dark:text-red-400" : "text-gray-700 dark:text-gray-300"}`}>{text}</span>
      <span className="shrink-0 text-xs font-semibold text-claude-700 dark:text-claude-400">Change</span>
      <IconChevron className="w-3.5 h-3.5 text-claude-700 dark:text-claude-400 shrink-0" />
    </button>
  );
}

// IOL queue indications that imply a risk flag, so admitting from the queue keeps it.
// IOL indications that carry a risk flag onto the board. Pre-eclampsia must
// arrive as Pre-eclampsia (not plain hypertension) so the MgSO4 rules run.
const IOL_FLAG = { "GDM": "Diabetic-GDM", "Pre-eclampsia": "Pre-eclampsia", "Severe pre-eclampsia": "Pre-eclampsia" };

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
  // The admission VE, entered on its own page like the risks: the same findings
  // as the VE form, so it becomes her first VE and starts the 4-hour clock.
  const [veDil, setVeDil] = useState(null);
  const [veStation, setVeStation] = useState(null);
  const [veCx, setVeCx] = useState(null);
  const [vePres, setVePres] = useState("Cephalic");
  const [veWhen, setVeWhen] = useState({ minsAgo: 0 });
  // VEs done before she reached the board (elsewhere, or earlier in labour):
  // dilation and time each, so progress and the delay rules start from them.
  const [earlier, setEarlier] = useState([]);
  const setEarlierAt = (id, patch) => setEarlier(list => list.map(e => (e.id === id ? { ...e, ...patch } : e)));
  const [admWhen, setAdmWhen] = useState({ minsAgo: 0 });
  // Admission time defaults to now; the picker only appears if asked for.
  const [admEarlier, setAdmEarlier] = useState(false);
  const detail = useSubPage();

  const suggestedAdmitStage = veDil == null ? null : veDil >= 10 ? "Passive second stage" : veDil >= 4 ? "Active first stage" : null;
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
    const membranes = effMemb;
    // Earlier VEs: membranes intact unless they were already ruptured then.
    const before = earlier
      .map(e => ({ ...e, iso: e.dil != null ? resolveWhen(e.when) : null }))
      .filter(e => e.iso)
      .map(e => ({
        id: newId("ve"), time: e.iso, dilation: e.dil,
        membranes: ruptured && romISO && e.iso >= romISO ? membranes : "Intact",
      }));
    const ves = [...before, ...(veDil != null ? [{
      id: newId("ve"), time: veISO, dilation: veDil, station: veStation, presentation: vePres,
      membranes, membranesTime: ruptured ? romISO : null,
      liquor: ruptured ? liquor : null, contractions: veCx,
    }] : [])].sort((a, b) => new Date(a.time) - new Date(b.time));
    // Established labour starts at the first VE of 4 cm or more, so a woman
    // who has been labouring for hours is not timed from her arrival.
    const firstActive = ves.find(v => v.dilation >= 4)?.time;
    const stageTime = (stage === "Active first stage" ? firstActive : null) ?? veISO ?? admISO;
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
    <Sheet open dense onClose={onClose} title={title}
      sub={edit ? "VE, CTG and obs history stay as they are." : "No names or identifiers."}
      footer={
        <button type="button" onClick={save} disabled={!ready} className={`${BTN} ${BTN_PRIMARY} w-full min-h-[3.25rem] text-base`}>
          {!ready ? (clash ? `Bed ${trimmed} is already on the board` : "Pick bed, parity, gestation and stage")
            : edit ? "Save changes" : `Add Bed ${trimmed} · ${parityShort(parity)} · ${weeks}+${days}`}
        </button>
      }>
      <div>
        <Label tight hint={free.length ? "free beds" : undefined}>Bed</Label>
        <div className="grid grid-cols-[repeat(5,minmax(0,1fr))_auto] gap-1.5">
          {quick.map(n => <Chip key={n} small className="px-0 text-sm" on={!custom && trimmed === n} onClick={() => { setCustom(false); setNum(n); }}>{n}</Chip>)}
          <Chip small className="text-sm" on={custom} onClick={() => { if (!custom) setNum(""); setCustom(true); }}>Custom</Chip>
        </div>
        {custom && (
          <input autoFocus value={num} onChange={e => setNum(e.target.value)} placeholder="Type a bed, e.g. 14, Pool or HDU"
            className={`${INPUT} mt-2`} aria-label="Bed" maxLength={12} />
        )}
      </div>

      <div>
        <Label tight>Parity</Label>
        <div className="flex flex-wrap gap-1.5">
          {PARITIES.map(p => <Chip key={p} small className="text-sm min-w-[3rem]" on={!customParity && parity === p} onClick={() => { setCustomParity(false); setParity(p); }}>{parityShort(p)}</Chip>)}
          <Chip small className="text-sm" on={customParity} onClick={() => { if (!customParity) setParity("Para 4"); setCustomParity(true); }}>Custom</Chip>
        </div>
        {customParity && (
          <div className="mt-2">
            <Stepper value={parityNum(parity) ?? 4} onChange={n => setParity(`Para ${n}`)} min={4} max={15} format={n => `P${n}`} />
          </div>
        )}
        {nBirths > 0 && (
          <div className="mt-2 space-y-1.5">
            <Label tight hint="optional">Previous births</Label>
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
        <Label tight hint="type 394 for 39+4">Gestation</Label>
        <input id="admit-gestation" type="text" inputMode="numeric" autoComplete="off" aria-label="Gestation"
          value={gest.digits.length === 3 ? `${gest.digits.slice(0, 2)}+${gest.digits[2]}` : gest.digits}
          onChange={e => setGestDigits(gestFromDigits(e.target.value).digits)}
          placeholder="39+4"
          className={`${INPUT} !h-10 text-lg font-semibold tabular-nums tracking-wide ${gest.digits.length >= 2 && !gest.valid ? "border-red-400 dark:border-red-700" : ""}`} />
        {/* Only speak up when the entry is unfinished; the hint above covers the rest. */}
        {gest.digits.length > 0 && gest.digits.length < 3 && (
          <p className={`${TYPE_META} mt-1`}>{gest.digits.length === 1 ? "Between 22+0 and 43+0." : `${gest.w}+0 unless you add the days.`}</p>
        )}
      </div>

      <div>
        <Label tight hint={edit ? undefined : "as handed over"}>Stage</Label>
        <div className="grid grid-cols-4 gap-1.5">
          {STAGES.map(st => <Chip key={st} small className="px-0 whitespace-nowrap" on={stage === st} onClick={() => setStage(st)}>{ADMIT_STAGE[st] ?? STAGE_SHORT[st]}</Chip>)}
        </div>
        {/* From the admission VE: 4 cm or more with regular contractions is
            established labour (NG235 1.8.1); full dilatation is the second stage.
            A suggestion only: the stage chosen above is what counts. */}
        {!edit && suggestedAdmitStage && stage !== suggestedAdmitStage && (
          <button type="button" onClick={() => setStage(suggestedAdmitStage)}
            className="mt-1.5 w-full min-h-10 px-3 rounded-lg border border-dashed border-claude-300 dark:border-claude-800 text-left text-sm text-claude-800 dark:text-claude-300">
            <b>Suggested: {ADMIT_STAGE[suggestedAdmitStage]}</b>
            <span className="text-gray-600 dark:text-gray-400"> · {veDil >= 10 ? "fully dilated on the VE" : `${veDil} cm on the VE; established if contracting regularly (NG235 1.8.1)`}. Tap to use.</span>
          </button>
        )}
      </div>

      {/* Onset and membranes side by side, so the main form fits one screen. */}
      <div className={`grid gap-3 ${edit ? "grid-cols-1" : "grid-cols-2"}`}>
        <div>
          <Label tight>Onset</Label>
          <div className="grid grid-cols-3 gap-1">
            {ONSETS.map(o => <Chip key={o} small className="px-0 whitespace-nowrap !text-[11px]" on={onset === o} onClick={() => setOnset(o)}>{ONSET_SHORT[o] ?? o}</Chip>)}
          </div>
        </div>
        {!edit && (
          <div>
            <Label tight>Membranes</Label>
            <div className="grid grid-cols-3 gap-1">
              {MEMBRANES.map(m => <Chip key={m} small className="px-0 whitespace-nowrap !text-[11px]" on={effMemb === m} onClick={() => setMemb(m)}>{m}</Chip>)}
            </div>
          </div>
        )}
      </div>
      {/* One summary line per choice that needs detail, in the same order as the
          chips above. Tap a line to change the detail on a page that slides in. */}
      {(onset === "Induced" || ruptured) && (
        <div className="space-y-1.5">
          {onset === "Induced" && (
            <SummaryLine label="IOL" onClick={() => detail.open("iol")}
              text={[indMethod, `started ${whenText(iolWhen)}`, iolReasons.length ? `${iolReasons.length} reason${iolReasons.length > 1 ? "s" : ""}` : null].filter(Boolean).join(" · ")} />
          )}
          {ruptured && (
            <SummaryLine label={effMemb} onClick={() => detail.open("rom")} warn={!romISO}
              text={`${LIQUOR_SHORT[liquor] ?? liquor} · ${romISO ? whenText(romWhen) : "time is in the future"}`} />
          )}
        </div>
      )}
      {/* Analgesia on the main screen: an epidural changes the passive second
          stage timing and is a CTG indication, so it should not be hidden. */}
      <div>
        <Label tight>Analgesia</Label>
        <div className="grid grid-cols-5 gap-1">
          {ANALGESIA.map(a => <Chip key={a} small className="px-0 whitespace-nowrap !text-[11px]" on={analgesia === a} onClick={() => setAnalgesia(a)}>{ANALGESIA_SHORT[a] ?? a}</Chip>)}
        </div>
      </div>
      {!edit && (
        <SummaryLine label="VE" onClick={() => detail.open("ve")}
          text={veDil == null ? "not recorded · tap to add" : [
            `${veDil} cm`, veStation != null && `station ${stationLabel(veStation)}`, veCx != null && `${veCx} in 10`,
            vePres, whenText(veWhen),
            earlier.some(e => e.dil != null) && `+${earlier.filter(e => e.dil != null).length} earlier`,
          ].filter(Boolean).join(" · ")} />
      )}
      {detail.page === "ve" && (
        <SubPage title="VE on admission" backLabel="Admit" onClose={detail.close} closing={detail.closing} onClosed={detail.closed}>
          <div>
            <Label>Dilation</Label>
            <DilationGrid value={veDil} onChange={v => setVeDil(veDil === v ? null : v)} />
          </div>
          <div>
            <Label hint="optional">Station</Label>
            <ChipRow small options={[-3, -2, -1, 0, 1, 2, 3]} value={veStation} onChange={v => setVeStation(veStation === v ? null : v)} label={stationLabel} />
          </div>
          <div>
            <Label hint="optional">Contractions in 10 min</Label>
            <ChipRow small options={[1, 2, 3, 4, 5, 6, 7, 8]} value={veCx} onChange={v => setVeCx(veCx === v ? null : v)} />
          </div>
          <div>
            <Label>Presentation</Label>
            <ChipRow small options={["Cephalic", "Breech", "Other"]} value={vePres} onChange={setVePres} />
          </div>
          <WhenPicker label="Time of the VE" value={veWhen} onChange={setVeWhen} presets={[0, 15, 30, 60, 120]} />
          <div className="space-y-2">
            <Label hint="optional">Earlier VEs</Label>
            {earlier.map((e, k) => (
              <div key={e.id} className="rounded-xl border border-gray-200 dark:border-gray-800 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">Earlier VE {k + 1}</span>
                  <button type="button" onClick={() => setEarlier(list => list.filter(x => x.id !== e.id))}
                    className="min-h-9 px-2 text-xs font-semibold text-red-600 dark:text-red-400">Remove</button>
                </div>
                <DilationGrid value={e.dil} onChange={v => setEarlierAt(e.id, { dil: e.dil === v ? null : v })} />
                <WhenPicker tight label="When" value={e.when} onChange={w => setEarlierAt(e.id, { when: w })} presets={[60, 120, 240, 360, 480]} />
              </div>
            ))}
            <button type="button" onClick={() => setEarlier(list => [...list, { id: newId("prev"), dil: null, when: { minsAgo: 240 } }])}
              className={`${BTN} ${BTN_SECONDARY} w-full`}>+ Add an earlier VE</button>
          </div>
          <p className={TYPE_META}>Membranes are set on the Admit screen. The latest VE starts the 4-hour clock; earlier ones show her progress, and established labour is timed from the first at 4 cm or more.</p>
        </SubPage>
      )}
      {detail.page === "iol" && (
        <SubPage title="Induction" backLabel={edit ? "Edit" : "Admit"} onClose={detail.close} closing={detail.closing} onClosed={detail.closed}>
          <div>
            <Label>Method</Label>
            <ChipRow small options={IND_METHODS} value={indMethod} onChange={setIndMethod} />
          </div>
          <WhenPicker label="Induction started" value={iolWhen} onChange={setIolWhen} presets={[0, 60, 120, 240]} />
          <div>
            <Label hint="optional">Indication</Label>
            <MultiChipRow options={[...new Set([...IOL_REASONS, ...iolReasons])]} values={iolReasons} onChange={setIolReasons} />
          </div>
        </SubPage>
      )}
      {detail.page === "rom" && (
        <SubPage title={effMemb === "AROM" ? "Amniotomy (AROM)" : "Membranes ruptured (SROM)"} backLabel="Admit"
          onClose={detail.close} closing={detail.closing} onClosed={detail.closed}>
          <div>
            <Label>Liquor</Label>
            <ChipRow small options={LIQUORS} value={liquor} onChange={setLiquor} label={o => LIQUOR_SHORT[o]} />
          </div>
          <WhenPicker label={`Time of ${effMemb}`} value={romWhen} onChange={setRomWhen} presets={[0, 60, 120, 240]} />
        </SubPage>
      )}
      <RiskPicker line values={flags} onChange={setFlags} backLabel={edit ? "Edit" : "Admit"} />
      {!edit && (admEarlier ? (
        <WhenPicker tight label="Admission time" value={admWhen} onChange={setAdmWhen} presets={[0, 30, 60, 120]} />
      ) : (
        <button type="button" onClick={() => setAdmEarlier(true)}
          className="min-h-9 text-sm font-semibold text-claude-700 dark:text-claude-400">
          + Admitted earlier? Set admission time
        </button>
      ))}
    </Sheet>
  );
}
