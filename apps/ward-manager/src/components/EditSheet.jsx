import { useState } from "react";
import Sheet from "../ui/Sheet";
import RiskPicker from "./RiskPicker";
import SubPage from "../ui/SubPage";
import { useSubPage } from "../ui/useSubPage";
import { IconChevron } from "../ui/icons";
import { Chip, ChipRow, Label, MultiChipRow, Stepper, WhenPicker } from "../ui/atoms";
import { BTN, BTN_PRIMARY, INPUT, TYPE_META } from "../ui/styles";
import { resolveWhen, whenFromISO } from "../utils/time";
import {
  ANALGESIA, BIRTH_MODES, BIRTH_SHORT, IND_METHODS, IOL_REASONS, ONSETS, PARITIES,
  STAGES, STAGE_SHORT, gestFromDigits, parityNum, parityShort, setStage as stageUpdate,
} from "../utils/bedModel";

// Shorter stage names so the four fit one row.
const EDIT_STAGE = { "Latent": "Latent", "Active first stage": "Active", "Passive second stage": "Passive 2nd", "Active second stage": "Pushing" };

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
function SummaryLine({ label, text, onClick }) {
  return (
    <button type="button" onClick={onClick}
      className="w-full min-h-10 px-3 rounded-lg border flex items-center gap-2 text-left text-sm active:scale-[0.99] bg-gray-50 dark:bg-gray-900/60 border-gray-200 dark:border-gray-800">
      <span className="font-semibold text-gray-900 dark:text-gray-100 shrink-0">{label}</span>
      <span className="flex-1 min-w-0 truncate text-gray-700 dark:text-gray-300">{text}</span>
      <span className="shrink-0 text-xs font-semibold text-claude-700 dark:text-claude-400">Change</span>
      <IconChevron className="w-3.5 h-3.5 text-claude-700 dark:text-claude-400 shrink-0" />
    </button>
  );
}

// Named rooms offered under "Other" for the bed.
const ROOMS = ["Pool", "HDU", "Triage", "Theatre", "Recovery"];

function parseGest(g) {
  const m = /^(\d+)\+(\d)$/.exec(g ?? "");
  return m ? { w: +m[1], d: +m[2] } : { w: null, d: 0 };
}

/**
 * The detailed view of a woman already on the board. New women come in through
 * the Admit card (QuickHandover); anything it does not ask is added here.
 */
export default function EditSheet({ bed, existingNumbers = [], onSave, onClose }) {
  const g0 = parseGest(bed.gestation);

  const [num, setNum] = useState(bed.bedNumber);
  const [parity, setParity] = useState(bed.parity);
  const [customParity, setCustomParity] = useState(!!bed.parity && !PARITIES.includes(bed.parity));
  const [prevBirths, setPrevBirths] = useState(bed.prevBirths ?? []);
  // Gestation is typed as digits on the number keypad: 3, 9, 4 → 39+4.
  const [gestDigits, setGestDigits] = useState(g0.w != null ? `${g0.w}${g0.d ?? 0}` : "");
  const gest = gestFromDigits(gestDigits);
  const weeks = gest.valid ? gest.w : null;
  const days = gest.valid ? gest.d : 0;
  const [stage, setStage] = useState(bed.labourStage);
  // Left unknown on the card: nothing is preselected, so saving another change
  // cannot quietly record her as spontaneous and clear the gap.
  const [onset, setOnset] = useState(bed.modeOfOnset ?? null);
  const [indMethod, setIndMethod] = useState(bed.inductionMethod ?? "Dinoprostone");
  const [iolReasons, setIolReasons] = useState(bed.iolReasons ?? []);
  // Not known (left blank at handover): stays blank until a time is chosen,
  // rather than quietly becoming "now".
  const [iolWhen, setIolWhen] = useState(bed.inductionStartTime ? whenFromISO(bed.inductionStartTime) : bed.modeOfOnset === "Induced" ? null : { minsAgo: 0 });
  const [analgesia, setAnalgesia] = useState(bed.analgesia ?? "None");
  const [flags, setFlags] = useState(bed.riskFlags ?? []);
  // The Admit card records "now"; she may have come in hours before handover.
  const [admWhen, setAdmWhen] = useState(() => whenFromISO(bed.admissionTime));
  const [admOpen, setAdmOpen] = useState(false);
  const detail = useSubPage();

  const used = new Set(existingNumbers.map(String));
  // Bed names compare without case or spaces ("pool" and "Pool" are one room).
  const norm = x => String(x ?? "").trim().toLowerCase();
  const usedNorm = new Set(existingNumbers.map(norm));
  const free = Array.from({ length: 12 }, (_, i) => String(i + 1)).filter(n => !used.has(n));
  // One row of quick bed chips (the lowest free numbers); anything else is typed.
  const quick = [...new Set([String(bed.bedNumber), ...free])].slice(0, 5);
  const [custom, setCustom] = useState(!quick.includes(String(bed.bedNumber)));
  const trimmed = String(num ?? "").trim();
  const clash = trimmed && usedNorm.has(norm(trimmed)) && norm(trimmed) !== norm(bed.bedNumber);
  const admISO = admOpen ? resolveWhen(admWhen) : null;
  const ready = trimmed && !clash && parity && weeks && stage && (!admOpen || !!admISO);
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
    const induced = onset === "Induced";
    const iolISO = induced && iolWhen ? resolveWhen(iolWhen) : null;
    onSave({
      bedNumber: trimmed, parity, prevBirths: births, gestation: `${weeks}+${days}`, modeOfOnset: onset ?? bed.modeOfOnset ?? null, analgesia, riskFlags: flags,
      // A stage change here starts (or clears) the stage clocks, as the stage bar does.
      ...(stage !== bed.labourStage ? stageUpdate(bed, stage, new Date().toISOString()) : { labourStage: stage }),
      inductionMethod: induced ? indMethod : null,
      iolReasons: induced ? iolReasons : [],
      inductionStartTime: induced ? iolISO ?? bed.inductionStartTime ?? null : null,
      ...(admISO ? { admissionTime: admISO } : {}),
    });
  };

  return (
    <Sheet open dense onClose={onClose} title={`Edit Bed ${bed.bedNumber}`} sub="VE, CTG and obs history stay as they are."
      footer={
        <button type="button" onClick={save} disabled={!ready} className={`${BTN} ${BTN_PRIMARY} w-full min-h-[3.25rem] text-base`}>
          {!ready ? (clash ? `Bed ${trimmed} is already on the board` : admOpen && !admISO ? "The admission time is in the future: check it" : "Pick bed, parity, gestation and stage") : "Save changes"}
        </button>
      }>
      <div>
        <Label tight hint={free.length ? "free beds" : undefined}>Bed</Label>
        <div className="grid grid-cols-[repeat(5,minmax(0,1fr))_auto] gap-1.5">
          {quick.map(n => <Chip key={n} small className="px-0 text-sm" on={!custom && trimmed === n} onClick={() => { setCustom(false); setNum(n); }}>{n}</Chip>)}
          <Chip small className="text-sm" on={custom} onClick={() => { if (!custom) setNum(""); setCustom(true); }}>{custom && trimmed ? trimmed : "Other"}</Chip>
        </div>
        {/* Every bed up to 16 (taken ones greyed out), common named rooms, or
            anything typed. */}
        {custom && (
          <div className="mt-2 space-y-2 rounded-xl border border-gray-200 dark:border-gray-800 p-2.5">
            <div className="grid grid-cols-8 gap-1">
              {Array.from({ length: 16 }, (_, i) => String(i + 1)).map(n => {
                const taken = used.has(n) && n !== String(bed.bedNumber);
                return <Chip key={n} small className="px-0 text-sm disabled:opacity-30" disabled={taken} aria-label={taken ? `Bed ${n}, occupied` : `Bed ${n}`}
                  on={trimmed === n} onClick={() => setNum(n)}>{n}</Chip>;
              })}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {ROOMS.map(r => {
                const taken = usedNorm.has(norm(r)) && norm(r) !== norm(bed.bedNumber);
                return <Chip key={r} small className="disabled:opacity-30" disabled={taken} on={trimmed === r} onClick={() => setNum(r)}>{r}</Chip>;
              })}
            </div>
            <input value={num} onChange={e => setNum(e.target.value)}
              placeholder="Or type a bed or room" className={INPUT} aria-label="Bed" maxLength={12} />
          </div>
        )}
      </div>

      <div>
        <Label tight>Parity</Label>
        <div className="flex flex-wrap gap-1.5">
          {PARITIES.map(p => <Chip key={p} small className="text-sm min-w-[3rem]" on={!customParity && parity === p} onClick={() => { setCustomParity(false); setParity(p); }}>{parityShort(p)}</Chip>)}
          <Chip small className="text-sm" on={customParity} onClick={() => { if (!customParity) setParity("Para 4"); setCustomParity(true); }}>{customParity ? parityShort(parity) : "P4+"}</Chip>
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
        <input id="edit-gestation" type="text" inputMode="numeric" autoComplete="off" aria-label="Gestation"
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
        <Label tight>Stage</Label>
        <div className="grid grid-cols-4 gap-1.5">
          {STAGES.map(st => <Chip key={st} small className="px-0 whitespace-nowrap" on={stage === st} onClick={() => setStage(st)}>{EDIT_STAGE[st] ?? STAGE_SHORT[st]}</Chip>)}
        </div>
      </div>

      <div>
        <Label tight>Onset</Label>
        <div className="grid grid-cols-3 gap-1">
          {ONSETS.map(o => <Chip key={o} small className="px-0 whitespace-nowrap !text-[11px]" on={onset === o} onClick={() => setOnset(o)}>{ONSET_SHORT[o] ?? o}</Chip>)}
        </div>
      </div>
      {onset === "Induced" && (
        <SummaryLine label="IOL" onClick={() => detail.open("iol")}
          text={[indMethod, iolWhen ? `started ${whenText(iolWhen)}` : "start time not set", iolReasons.length ? `${iolReasons.length} reason${iolReasons.length > 1 ? "s" : ""}` : null].filter(Boolean).join(" · ")} />
      )}
      {/* Analgesia on the main screen: an epidural changes the passive second
          stage timing and is a CTG indication, so it should not be hidden. */}
      <div>
        <Label tight>Analgesia</Label>
        <div className="grid grid-cols-5 gap-1">
          {ANALGESIA.map(a => <Chip key={a} small className="px-0 whitespace-nowrap !text-[11px]" on={analgesia === a} onClick={() => setAnalgesia(a)}>{ANALGESIA_SHORT[a] ?? a}</Chip>)}
        </div>
      </div>
      {detail.page === "iol" && (
        <SubPage title="Induction" backLabel="Edit" onClose={detail.close} closing={detail.closing} onClosed={detail.closed}>
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
      <RiskPicker line values={flags} onChange={setFlags} backLabel="Edit" />
      {admOpen ? (
        <WhenPicker tight label="Admission time" value={admWhen} onChange={setAdmWhen} presets={[0, 30, 60, 120]} />
      ) : (
        <button type="button" onClick={() => setAdmOpen(true)}
          className="min-h-9 text-sm font-semibold text-claude-700 dark:text-claude-400">
          Change admission time ({whenText(whenFromISO(bed.admissionTime))})
        </button>
      )}
    </Sheet>
  );
}
