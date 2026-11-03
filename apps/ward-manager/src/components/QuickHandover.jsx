import { useRef, useState } from "react";
import Sheet from "../ui/Sheet";
import RiskPicker from "./RiskPicker";
import { Chip, Label } from "../ui/atoms";
import { BTN, BTN_PRIMARY, BTN_SECONDARY, TYPE_META } from "../ui/styles";
import { IND_METHODS, LIQUORS, LIQUOR_SHORT, STAGES, parityShort } from "../utils/bedModel";
import { getUnitSettings } from "../data/unitSettings";
import { clock } from "../utils/time";
import {
  QUICK_STEPS, bedFromCard, cardBlocker, cardGestation, cardMissing, cardVEs, emptyCard, hhmmToISO, typeTimeDigit, vesGoDown,
} from "../utils/quickHandover";

const ROOMS = ["Pool", "HDU", "Triage", "Theatre", "Recovery"];
const PARITY = [["Para 0", "P0"], ["Para 1", "P1"], ["Para 2", "P2"], ["Para 3", "P3"], ["Para 4+", "P4+"]];
const STAGE_BTN = { "Latent": "Latent", "Active first stage": "Active", "Passive second stage": "Passive 2nd", "Active second stage": "Pushing" };
const STEP_LABEL = { bed: "Bed", parity: "Parity", gest: "Gestation", stage: "Stage", ve: "VEs", extras: "Extras" };
// Common flags as one-tap toggles; the full list is under "More risk factors".
const QUICK_FLAGS = [["GBS+", "GBS+"], ["Pre-eclampsia", "PET"], ["Previous LSCS", "Prev CS"]];

const norm = x => String(x ?? "").trim().toLowerCase();
const hmText = (hhmm, now) => {
  const iso = hhmmToISO(hhmm, now);
  return iso ? clock(iso, now) : `${hhmm.slice(0, 2)}:${hhmm.slice(2)}`;
};

/** Big tap target used throughout the card. */
function Key({ on = false, className = "", ...rest }) {
  return (
    <button type="button" {...rest}
      className={`min-h-12 rounded-xl border text-base font-semibold tabular-nums transition-transform active:scale-[0.96] disabled:opacity-30 disabled:line-through ${on
        ? "bg-claude-600 border-claude-600 text-white"
        : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 shadow-[0_2px_0] shadow-gray-200 dark:shadow-gray-800"} ${className}`} />
  );
}

function Keypad({ onDigit, onClear, onBack }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => <Key key={n} onClick={() => onDigit(String(n))}>{n}</Key>)}
      <Key className="text-sm" onClick={onClear}>Clear</Key>
      <Key onClick={() => onDigit("0")}>0</Key>
      <Key className="text-sm" onClick={onBack} aria-label="Delete last digit">⌫</Key>
    </div>
  );
}

/** "13:45" as it is typed, with the untyped digits greyed. */
function TimeDisplay({ digits }) {
  const d = digits.padEnd(4, "·");
  const c = ch => ch === "·" ? <span className="text-gray-300 dark:text-gray-700">0</span> : ch;
  return <p className="text-4xl font-bold tabular-nums text-center text-gray-900 dark:text-white">{c(d[0])}{c(d[1])}:{c(d[2])}{c(d[3])}</p>;
}

/**
 * A time typed on the keypad: 1 3 4 5 is 13:45. It saves itself on the fourth
 * digit. A time later than now is taken as yesterday.
 */
function TimeEntry({ label, onTime, allowNow = false, now }) {
  const [digits, setDigits] = useState("");
  const type = d => {
    const next = typeTimeDigit(digits, d);
    if (next.length === 4) { setDigits(""); onTime(next); } else setDigits(next);
  };
  const nowHHMM = () => { const x = new Date(now); return `${String(x.getHours()).padStart(2, "0")}${String(x.getMinutes()).padStart(2, "0")}`; };
  return (
    <div className="space-y-2">
      <p className={TYPE_META}>{label} Type 1 3 4 5 for 13:45; a time later than now counts as yesterday.</p>
      <TimeDisplay digits={digits} />
      {allowNow && <Key className="w-full text-sm" onClick={() => onTime(nowHHMM())}>Now</Key>}
      <Keypad onDigit={type} onClear={() => setDigits("")} onBack={() => setDigits(d => d.slice(0, -1))} />
    </div>
  );
}

/**
 * Quick handover: one card per woman, tap-only, in the order handover is said.
 * Each "Next bed" puts her on the board at once, so nothing is lost if the
 * phone locks; gaps show on the board as "Add details".
 */
export default function QuickHandover({ beds, onSave, onClose }) {
  const [now] = useState(() => Date.now());
  const [card, setCard] = useState(emptyCard);
  const [step, setStep] = useState("bed");
  const [hist, setHist] = useState([]);
  const [veDil, setVeDil] = useState(null);     // dilation picked, waiting for its time
  const [timeFor, setTimeFor] = useState(null); // "iol" | "rom" | "oxy" while its keypad is open
  const [editingId, setEditingId] = useState(null);
  const [added, setAdded] = useState([]);       // [{ id, bed, card }] saved this handover
  const [confirmClose, setConfirmClose] = useState(false);
  const typed = useRef(null);
  const oxyMax = getUnitSettings().oxytocinMax;

  const patch = p => { setCard(c => ({ ...c, ...p })); setConfirmClose(false); };
  const patchIn = (key, p) => setCard(c => ({ ...c, [key]: { ...c[key], ...p } }));
  const done = (c, s) => s === "bed" ? !!c.bed : s === "parity" ? !!c.parity : s === "gest" ? !!cardGestation(c)
    : s === "stage" ? !!c.stage : s === "ve" ? c.noVE || c.ves.length > 0 : true;
  const goTo = s => { setVeDil(null); setTimeFor(null); if (s !== step) { setHist(h => [...h, step]); setStep(s); } };
  // Move to the next question not yet answered or left for later.
  const advance = (c, from = step) => {
    const i = QUICK_STEPS.indexOf(from);
    goTo(QUICK_STEPS.slice(i + 1).find(s => !done(c, s) && !c.skipped.includes(s)) ?? "extras");
  };
  const answer = (p, s = step) => {
    const c = { ...card, ...p, skipped: card.skipped.filter(x => x !== s) };
    setCard(c); setConfirmClose(false); advance(c, s);
  };
  const back = () => {
    setVeDil(null); setTimeFor(null);
    if (hist.length) { setStep(hist.at(-1)); setHist(h => h.slice(0, -1)); }
    else setStep(QUICK_STEPS[Math.max(0, QUICK_STEPS.indexOf(step) - 1)]);
  };
  const later = () => { const c = { ...card, skipped: [...new Set([...card.skipped, step])] }; setCard(c); advance(c); };

  // Beds on the board are taken, except the one being corrected.
  const editingBed = editingId ? beds[editingId]?.bedNumber : null;
  const taken = new Set(Object.values(beds).map(b => norm(b.bedNumber)).filter(n => n !== norm(editingBed)));
  const missing = cardMissing(card);
  const blocker = cardBlocker(card);
  const reset = () => { setCard(emptyCard()); setStep("bed"); setHist([]); setVeDil(null); setTimeFor(null); setEditingId(null); setConfirmClose(false); };

  const save = () => {
    if (blocker) return;
    const bed = bedFromCard(card, Date.now(), editingId);
    onSave(bed, !!editingId);
    setAdded(list => [...list.filter(a => a.id !== bed.id), { id: bed.id, bed: bed.bedNumber, card }]);
    reset();
  };
  const reopen = a => {
    if (card.bed) { setConfirmClose("busy"); return; }
    if (!beds[a.id]) return; // removed from the board since
    setCard(a.card); setEditingId(a.id); setStep("bed"); setHist([]);
  };
  const close = () => (card.bed && !confirmClose ? setConfirmClose(true) : onClose());

  // ── The current question ─────────────────────────────────────────────
  const head = (title, canSkip = true, right = null) => (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 min-w-0">
        <button type="button" onClick={back} disabled={step === "bed" && !hist.length} aria-label="Back to the previous question"
          className="shrink-0 min-h-9 px-3 rounded-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm font-semibold text-gray-700 dark:text-gray-200 disabled:opacity-30">‹ Back</button>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 truncate">{title}</h3>
      </div>
      {right ?? (canSkip && <button type="button" onClick={later} className="shrink-0 min-h-9 px-2 text-sm font-semibold text-gray-500 dark:text-gray-400 underline underline-offset-4">Later</button>)}
    </div>
  );

  let question;
  if (step === "bed") {
    question = (
      <>
        {head("Bed", false)}
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 16 }, (_, i) => String(i + 1)).map(n => (
            <Key key={n} on={card.bed === n} disabled={taken.has(n)} aria-label={taken.has(n) ? `Bed ${n}, on the board` : `Bed ${n}`}
              onClick={() => answer({ bed: n })}>{n}</Key>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {ROOMS.map(r => <Chip key={r} small on={card.bed === r} disabled={taken.has(norm(r))} onClick={() => answer({ bed: r })}>{r}</Chip>)}
        </div>
        <form className="flex gap-2" onSubmit={e => {
          e.preventDefault();
          const v = typed.current?.value.trim();
          if (v && !taken.has(norm(v))) { answer({ bed: v }); typed.current.value = ""; }
        }}>
          <input ref={typed} maxLength={12} placeholder="Or type a bed or room" aria-label="Type a bed or room"
            className="flex-1 min-w-0 h-11 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white" />
          <button type="submit" className={`${BTN} ${BTN_SECONDARY} !min-h-11`}>Use</button>
        </form>
      </>
    );
  } else if (step === "parity") {
    question = (
      <>
        {head("Parity")}
        <div className="grid grid-cols-5 gap-2">
          {PARITY.map(([v, l]) => <Key key={v} on={card.parity === v} onClick={() => answer({ parity: v })}>{l}</Key>)}
        </div>
      </>
    );
  } else if (step === "gest") {
    const d = card.gestDigits.padEnd(3, "·");
    const c = ch => ch === "·" ? <span className="text-gray-300 dark:text-gray-700">0</span> : ch;
    const typeG = x => {
      const next = card.gestDigits + x;
      const g = { ...card, gestDigits: next };
      // Only digits that can still make 22+0 to 43+0 are kept.
      if (next.length > 3 || (next.length === 1 && !"234".includes(next)) || (next.length >= 2 && (+next.slice(0, 2) < 22 || +next.slice(0, 2) > 43))
        || (next.length === 3 && (+next[2] > 6 || (next.startsWith("43") && next[2] !== "0")))) return;
      if (next.length === 3) answer({ gestDigits: next }); else setCard(g);
    };
    question = (
      <>
        {head("Gestation")}
        <p className="text-4xl font-bold tabular-nums text-center text-gray-900 dark:text-white">{c(d[0])}{c(d[1])}+{c(d[2])}</p>
        <p className={`${TYPE_META} text-center`}>Type 3 9 4 for 39+4. Moves on after the third digit.</p>
        <Keypad onDigit={typeG} onClear={() => patch({ gestDigits: "" })} onBack={() => patch({ gestDigits: card.gestDigits.slice(0, -1) })} />
      </>
    );
  } else if (step === "stage") {
    question = (
      <>
        {head("Stage")}
        <div className="grid grid-cols-2 gap-2">
          {STAGES.map(s => <Key key={s} on={card.stage === s} onClick={() => answer({ stage: s })}>{STAGE_BTN[s]}</Key>)}
        </div>
      </>
    );
  } else if (step === "ve") {
    const list = cardVEs(card, now);
    const rows = list.length > 0 && (
      <div className="space-y-1.5">
        {list.map((v, i) => (
          <div key={v.hhmm} className="flex items-center justify-between gap-2 rounded-lg bg-gray-100 dark:bg-gray-900 px-3 py-2">
            <span className="text-sm font-semibold tabular-nums text-gray-900 dark:text-white">{v.dil} cm at {clock(v.iso, now)}{i === list.length - 1 ? " · latest" : ""}</span>
            <button type="button" onClick={() => patch({ ves: card.ves.filter(x => x.hhmm !== v.hhmm) })}
              className="min-h-8 px-2 text-xs font-semibold text-red-600 dark:text-red-400">Remove</button>
          </div>
        ))}
      </div>
    );
    const warn = vesGoDown(card, now) && (
      <p className="rounded-lg px-3 py-2 text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300">Check: dilation is lower than an earlier VE.</p>
    );
    if (veDil != null) {
      question = (
        <>
          {head(`${veDil} cm: what time?`, false, <span />)}
          {rows}
          <TimeEntry label="Time of this VE." allowNow={!card.ves.length} now={now} onTime={hhmm => {
            if (card.ves.some(v => v.hhmm === hhmm)) { setVeDil(null); return; }
            const c = { ...card, noVE: false, ves: [...card.ves, { dil: veDil, hhmm }], skipped: card.skipped.filter(x => x !== "ve") };
            setCard(c); setVeDil(null);
            // The first VE moves straight on; earlier ones are added from here.
            if (!card.ves.length) advance(c);
          }} />
        </>
      );
    } else {
      question = (
        <>
          {head(list.length ? "Add an earlier VE?" : "Latest VE", !list.length)}
          {rows}{warn}
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <Key key={n} onClick={() => setVeDil(n)}>{n}</Key>)}
          </div>
          {list.length
            ? <Key className="w-full text-sm" onClick={() => advance(card)}>Done with VEs</Key>
            : <Key className="w-full text-sm" on={card.noVE} onClick={() => answer({ noVE: true, ves: [] })}>No VE yet</Key>}
        </>
      );
    }
  } else {
    const toggle = (key, on) => {
      patchIn(key, { on });
      // ROM opens its time pad at once; oxytocin waits for the dose, so the
      // dose buttons and the time keypad are never on screen together.
      setTimeFor(on && key === "rom" ? key : null);
    };
    const timeLine = (key, label, required) => {
      const hhmm = card[key].hhmm;
      if (timeFor === key) {
        return <TimeEntry label={`${label}.`} now={now} onTime={t => { patchIn(key, { hhmm: t }); setTimeFor(null); }} />;
      }
      return (
        <button type="button" onClick={() => setTimeFor(key)}
          className={`w-full min-h-10 px-3 rounded-lg border text-left text-sm ${!hhmm && required ? "border-red-300 dark:border-red-900 text-red-700 dark:text-red-400" : "border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300"}`}>
          <b>{label}:</b> {hhmm ? hmText(hhmm, now) : required ? "needed, tap to type" : "not known, tap to type"}
        </button>
      );
    };
    const flagOn = f => card.flags.includes(f);
    question = (
      <>
        {head("Anything else?", false, <span className={TYPE_META}>Optional</span>)}
        {card.ves.length > 0 && (
          <Key className="w-full text-sm" onClick={() => goTo("ve")}>+ Add an earlier VE ({card.ves.length} so far)</Key>
        )}
        <div className="grid grid-cols-4 gap-2">
          <Key className="text-sm" on={card.iol.on} onClick={() => toggle("iol", !card.iol.on)}>IOL</Key>
          <Key className="text-sm" on={card.rom.on} onClick={() => toggle("rom", !card.rom.on)}>ROM</Key>
          <Key className="text-sm" on={card.oxy.on} onClick={() => toggle("oxy", !card.oxy.on)}>Synto</Key>
          <Key className="text-sm" on={card.epidural} onClick={() => patch({ epidural: !card.epidural })}>Epidural</Key>
          {QUICK_FLAGS.map(([f, l]) => (
            <Key key={f} className="text-sm" on={flagOn(f)} onClick={() => patch({ flags: flagOn(f) ? card.flags.filter(x => x !== f) : [...card.flags, f] })}>{l}</Key>
          ))}
        </div>
        {card.iol.on && (
          <div className="space-y-2 rounded-xl border border-gray-200 dark:border-gray-800 p-2.5">
            <Label tight hint="optional">Induction method</Label>
            <div className="flex flex-wrap gap-1.5">
              {IND_METHODS.map(m => <Chip key={m} small on={card.iol.method === m} onClick={() => patchIn("iol", { method: card.iol.method === m ? null : m })}>{m}</Chip>)}
            </div>
            {timeLine("iol", "Induction started", false)}
          </div>
        )}
        {card.rom.on && (
          <div className="space-y-2 rounded-xl border border-gray-200 dark:border-gray-800 p-2.5">
            <div className="flex flex-wrap gap-1.5">
              {["SROM", "AROM"].map(t => <Chip key={t} small on={card.rom.type === t} onClick={() => patchIn("rom", { type: t })}>{t}</Chip>)}
            </div>
            <Label tight>Liquor</Label>
            <div className="flex flex-wrap gap-1.5">
              {LIQUORS.map(l => <Chip key={l} small on={card.rom.liquor === l} onClick={() => patchIn("rom", { liquor: l })}>{LIQUOR_SHORT[l]}</Chip>)}
            </div>
            {timeLine("rom", `${card.rom.type} at`, true)}
          </div>
        )}
        {card.oxy.on && (
          <div className="space-y-2 rounded-xl border border-gray-200 dark:border-gray-800 p-2.5">
            <Label tight hint="mU/min, as handed over">Oxytocin dose now</Label>
            {timeFor !== "oxy" && <div className="grid grid-cols-10 gap-1">
              {Array.from({ length: oxyMax }, (_, i) => i + 1).map(n => (
                <Chip key={n} small className="!px-0" aria-label={`${n} mU/min`} on={card.oxy.dose === n}
                  onClick={() => { patchIn("oxy", { dose: n }); if (!card.oxy.hhmm) setTimeFor("oxy"); }}>{n}</Chip>
              ))}
            </div>}
            {timeFor === "oxy" && <p className="text-sm font-semibold text-gray-900 dark:text-white">{card.oxy.dose} mU/min</p>}
            {timeLine("oxy", "Oxytocin started", true)}
          </div>
        )}
        <RiskPicker line values={card.flags} onChange={flags => patch({ flags })} backLabel="Quick handover" />
      </>
    );
  }

  // ── Summary chips: what has been entered; tap one to go back to it ────
  const latest = cardVEs(card, now).at(-1);
  const chipText = {
    bed: card.bed ? `Bed ${card.bed}` : null,
    parity: card.parity ? parityShort(card.parity) : null,
    gest: cardGestation(card),
    stage: card.stage ? STAGE_BTN[card.stage] : null,
    ve: card.noVE ? "No VE yet" : latest ? `${latest.dil} cm ${clock(latest.iso, now)}${card.ves.length > 1 ? ` (+${card.ves.length - 1})` : ""}` : null,
    extras: [card.iol.on && "IOL", card.rom.on && card.rom.type, card.oxy.on && "Synto", card.epidural && "Epidural", ...card.flags].filter(Boolean).join(" · ") || null,
  };

  return (
    <Sheet open onClose={close} title={editingId ? `Correcting bed ${editingBed}` : "Quick handover"}
      sub={`${added.length} added this handover · tap a chip to go back to it`}
      footer={confirmClose ? (
        <div className="space-y-2">
          <p className={`${TYPE_META} text-center`}>{confirmClose === "busy" ? `Save or discard bed ${card.bed} first.` : `Bed ${card.bed} is not saved yet.`}</p>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => { reset(); if (confirmClose !== "busy") onClose(); }} className={`${BTN} ${BTN_SECONDARY}`}>Discard bed {card.bed}</button>
            <button type="button" disabled={!!blocker} onClick={() => { save(); if (confirmClose !== "busy") onClose(); }} className={`${BTN} ${BTN_PRIMARY}`}>Save bed {card.bed}</button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-[auto_1fr] gap-2">
          <button type="button" onClick={close} className={`${BTN} ${BTN_SECONDARY}`}>Done</button>
          <button type="button" onClick={save} disabled={!!blocker} className={`${BTN} ${BTN_PRIMARY} flex-col !gap-0 min-h-[3.25rem]`}>
            <span className="text-base">{blocker ?? (editingId ? "Save correction" : "Next bed")}</span>
            {!blocker && <span className="text-[11px] font-medium opacity-90">{missing.length ? `Saves bed ${card.bed} with gaps: ${missing.join(", ")}` : `Saves bed ${card.bed}, complete`}</span>}
          </button>
        </div>
      )}>
      <div className="flex flex-wrap gap-1.5">
        {QUICK_STEPS.map(s => {
          const v = chipText[s], later = card.skipped.includes(s) && !v;
          return (
            <button key={s} type="button" onClick={() => goTo(s)} disabled={s !== "bed" && !card.bed}
              className={`min-h-9 px-3 rounded-full border text-sm font-semibold tabular-nums disabled:opacity-40 ${step === s ? "ring-2 ring-claude-500 ring-offset-1 dark:ring-offset-gray-950" : ""} ${v
                ? "bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white"
                : later ? "bg-amber-50 dark:bg-amber-950/40 border-transparent text-amber-800 dark:text-amber-300"
                : "border-dashed border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400"}`}>
              {v ?? (later ? `${STEP_LABEL[s]}: later` : STEP_LABEL[s])}
            </button>
          );
        })}
      </div>
      <div className="space-y-3">{question}</div>
      {added.length > 0 && (
        <div className="space-y-1.5 pt-2">
          <Label tight hint="tap to correct">Added this handover</Label>
          {[...added].reverse().map(a => {
            const b = beds[a.id];
            if (!b) return null;
            const gaps = cardMissing(a.card);
            return (
              <button key={a.id} type="button" onClick={() => reopen(a)}
                className="w-full text-left rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 px-3 py-2 flex items-center gap-3">
                <span className="shrink-0 min-w-10 h-10 px-1.5 rounded-lg bg-claude-600 text-white font-bold grid place-items-center">{b.bedNumber}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-gray-900 dark:text-white truncate">{parityShort(b.parity)} · {b.gestation ?? "gest ?"} · {b.labourStage ? STAGE_BTN[b.labourStage] : "stage ?"}</span>
                  {gaps.length > 0 && <span className="block text-xs font-semibold text-amber-700 dark:text-amber-400">Add {gaps.join(", ")}</span>}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </Sheet>
  );
}
