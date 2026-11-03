// Quick handover card: one woman at a time, tap-only, in the order handover is
// spoken (bed, parity, gestation, stage, VEs, extras). Anything not heard can
// be left for later; the board then shows "Add details" until it is filled in.

import { gestFromDigits, newId } from "./bedModel";
import { resolveWhen } from "./time";

export const QUICK_STEPS = ["bed", "parity", "gest", "stage", "ve", "extras"];

export function emptyCard() {
  return {
    bed: null, parity: null, gestDigits: "", stage: null,
    ves: [], noVE: false, skipped: [],
    iol: { on: false, method: null, hhmm: null },
    rom: { on: false, type: "SROM", liquor: "Clear", hhmm: null },
    oxy: { on: false, dose: null, hhmm: null },
    epidural: false, flags: [],
  };
}

/**
 * "1345" → ISO time today at 13:45, or yesterday if 13:45 has not come yet
 * (a VE at 23:30 handed over at 08:00). Null if not a real time.
 */
export function hhmmToISO(hhmm, now = Date.now()) {
  if (!/^\d{4}$/.test(hhmm ?? "")) return null;
  const h = +hhmm.slice(0, 2), m = +hhmm.slice(2);
  if (h > 23 || m > 59) return null;
  const clock = `${hhmm.slice(0, 2)}:${hhmm.slice(2)}`;
  return resolveWhen({ clock, daysAgo: 0 }, now) ?? resolveWhen({ clock, daysAgo: 1 }, now);
}

/** Keep a typed digit only if the time can still be real (no 25:00, no 13:75). */
export function typeTimeDigit(digits, d) {
  const next = digits + d;
  if (next.length > 4) return digits;
  if (next.length === 1 && +next > 2) return digits;
  if (next.length === 2 && +next > 23) return digits;
  if (next.length === 3 && +next[2] > 5) return digits;
  return next;
}

export const cardGestation = c => {
  const g = gestFromDigits(c.gestDigits);
  return c.gestDigits.length === 3 && g.valid ? `${g.w}+${g.d}` : null;
};

/** VEs as entered, oldest first, with real times. */
export function cardVEs(c, now = Date.now()) {
  return c.ves.map(v => ({ ...v, iso: hhmmToISO(v.hhmm, now) })).filter(v => v.iso)
    .sort((a, b) => new Date(a.iso) - new Date(b.iso));
}

/** A later VE with less dilation than an earlier one is usually a typo. */
export const vesGoDown = (c, now = Date.now()) => cardVEs(c, now).some((v, i, a) => i > 0 && v.dil < a[i - 1].dil);

/** What the card is still missing; she can be saved with these gaps. */
export function cardMissing(c) {
  const m = [];
  if (!c.parity) m.push("parity");
  if (!cardGestation(c)) m.push("gestation");
  if (!c.stage) m.push("stage");
  if (!c.noVE && !c.ves.length) m.push("VE");
  if (c.iol.on && !c.iol.hhmm) m.push("induction start time");
  return m;
}

/**
 * Why "Next bed" cannot save yet, or null. Ruptured membranes and oxytocin
 * start clocks that drive alerts, so they are saved only with their times
 * (or turned off), never with a made-up one.
 */
export function cardBlocker(c) {
  if (!c.bed) return "Pick a bed to start";
  if (c.rom.on && !c.rom.hhmm) return "Add the ROM time, or turn ROM off";
  if (c.oxy.on && (!c.oxy.dose || !c.oxy.hhmm)) return "Add the oxytocin dose and start time, or turn Synto off";
  return null;
}

/** The board record for a card, built the same way as Admit builds one. */
export function bedFromCard(c, now = Date.now(), id = null) {
  const at = new Date(now).toISOString();
  const romISO = c.rom.on ? hhmmToISO(c.rom.hhmm, now) : null;
  const membranes = c.rom.on ? c.rom.type : "Intact";
  const list = cardVEs(c, now);
  // Membranes go on the latest VE, as on Admit; earlier VEs carry dilation only.
  const ves = list.map((v, i) => ({
    id: newId("ve"), time: v.iso, dilation: v.dil,
    ...(i === list.length - 1 ? { membranes, membranesTime: romISO, liquor: romISO ? c.rom.liquor : null } : {}),
  }));
  const latest = ves.at(-1)?.time ?? null;
  // Established labour starts at the first VE of 4 cm or more (as on Admit).
  const firstActive = ves.find(v => v.dilation >= 4)?.time;
  const stageTime = (c.stage === "Active first stage" ? firstActive : null) ?? latest ?? at;
  const oxyISO = c.oxy.on ? hhmmToISO(c.oxy.hhmm, now) : null;
  const iolISO = c.iol.on ? hhmmToISO(c.iol.hhmm, now) : null;
  return {
    id: id ?? newId("bed"), bedNumber: c.bed, admissionTime: at,
    parity: c.parity, prevBirths: [], gestation: cardGestation(c),
    modeOfOnset: c.iol.on ? "Induced" : "Spontaneous",
    inductionMethod: c.iol.on ? c.iol.method : null, iolReasons: [], inductionStartTime: iolISO,
    analgesia: c.epidural ? "Epidural" : "None", riskFlags: c.flags, labourStage: c.stage,
    activeFirstStageStartTime: c.stage === "Active first stage" ? stageTime : null,
    passiveStartTime: c.stage === "Passive second stage" ? stageTime : null,
    pushingStartTime: c.stage === "Active second stage" ? stageTime : null,
    armTime: membranes === "AROM" ? romISO : null,
    membranes, membranesTime: romISO, liquor: romISO ? c.rom.liquor : null,
    // The dose is as handed over now; its start time counts towards the hours
    // on oxytocin. The next increase is timed from now, not from the start.
    oxytocinStartTime: oxyISO,
    oxytocinLog: oxyISO ? [{ id: newId("ox"), startTime: oxyISO, dose: c.oxy.dose, lastIncrementTime: at }] : [],
    ves, ctgLog: [], observations: {},
    // A VE left for later is listed until one is recorded.
    pendingDetails: !c.noVE && !ves.length ? ["VE"] : [],
    addedBy: "quick-handover",
  };
}
