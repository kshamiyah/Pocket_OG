// Quick handover card: one woman at a time, tap-only, in the order handover is
// spoken (bed, parity, gestation, stage, onset, VEs, extras). Anything not heard can
// be left for later; the board then shows "Add details" until it is filled in.

import { gestFromDigits, newId } from "./bedModel";
import { resolveWhen } from "./time";

export const PUSHING = "Active second stage";

export const QUICK_STEPS = ["bed", "parity", "gest", "stage", "onset", "ve", "extras"];

export function emptyCard() {
  return {
    bed: null, parity: null, gestDigits: "", stage: null, pushHHMM: null, onset: null, iolReasons: [],
    ves: [], noVE: false, skipped: [],
    iol: { on: false, method: null, hhmm: null },
    rom: { on: false, type: "SROM", liquor: "Clear", hhmm: null },
    oxy: { on: false, dose: null, hhmm: null },
    epidural: false, flags: [],
  };
}

// IOL queue indications that carry a risk flag onto the board. Pre-eclampsia must
// arrive as Pre-eclampsia (not plain hypertension) so the MgSO4 rules run.
const IOL_FLAG = { "GDM": "Diabetic-GDM", "Pre-eclampsia": "Pre-eclampsia", "Severe pre-eclampsia": "Pre-eclampsia" };

/** The card for a woman admitted from the IOL queue, with what the queue knows. */
export function cardFromIOLEntry(entry, now = Date.now()) {
  const added = entry.addedAt ? new Date(entry.addedAt) : null;
  // A typed time can only mean the last 24 hours. Added earlier than that, the
  // start time stays blank (and is listed) rather than landing on the wrong day.
  const recent = added && now - added.getTime() < 24 * 3600000 && added.getTime() <= now;
  const hhmm = recent ? `${String(added.getHours()).padStart(2, "0")}${String(added.getMinutes()).padStart(2, "0")}` : null;
  const empty = emptyCard();
  return {
    ...empty,
    gestDigits: entry.gestWeeks != null ? `${entry.gestWeeks}${entry.gestDays ?? 0}` : "",
    stage: "Latent", onset: "Induced",
    iol: { on: true, method: null, hhmm },
    iolReasons: entry.indications ?? [],
    flags: [...new Set((entry.indications ?? []).map(i => IOL_FLAG[i]).filter(Boolean))],
  };
}

/** How labour started, as the card holds it: null until it has been answered. */
export const cardOnset = c => (c.iol.on ? "Induced" : c.onset ?? null);

/**
 * The card changes for an onset choice. PPROM means her waters have gone, so ROM
 * turns on and asks for its time; moving away from PPROM turns off a ROM with no
 * time yet, so it cannot block the save.
 */
export function onsetPatch(c, onset) {
  const rom = onset === "PPROM"
    ? { ...c.rom, on: true, type: "SROM" }
    : c.onset === "PPROM" && !c.rom.hhmm ? { ...c.rom, on: false } : c.rom;
  return { onset, iol: { ...c.iol, on: onset === "Induced" }, rom };
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
  if (!cardOnset(c)) m.push("onset");
  if (!c.noVE && !c.ves.length) m.push("VE");
  if (c.iol.on && !c.iol.hhmm) m.push("induction start time");
  return m;
}

/**
 * Why "Next bed" cannot save yet, or null. Pushing, ruptured membranes and oxytocin
 * start clocks that drive alerts, so they are saved only with their times
 * (or turned off), never with a made-up one.
 */
export function cardBlocker(c) {
  if (!c.bed) return "Pick a bed to start";
  if (c.stage === PUSHING && !c.pushHHMM) return "Add when pushing started, or change the stage";
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
    modeOfOnset: cardOnset(c),
    inductionMethod: c.iol.on ? c.iol.method : null, iolReasons: c.iol.on ? c.iolReasons ?? [] : [], inductionStartTime: iolISO,
    analgesia: c.epidural ? "Epidural" : "None", riskFlags: c.flags, labourStage: c.stage,
    activeFirstStageStartTime: c.stage === "Active first stage" ? stageTime : null,
    // Pushing runs from when she started, which the VE cannot tell us; a 10 cm VE
    // is when she was found fully dilated.
    passiveStartTime: c.stage === "Passive second stage" ? stageTime
      : c.stage === PUSHING ? ves.find(v => v.dilation >= 10)?.time ?? null : null,
    pushingStartTime: c.stage === PUSHING ? hhmmToISO(c.pushHHMM, now) : null,
    armTime: membranes === "AROM" ? romISO : null,
    membranes, membranesTime: romISO, liquor: romISO ? c.rom.liquor : null,
    // The dose is as handed over now; its start time counts towards the hours
    // on oxytocin. The next increase is timed from now, not from the start.
    oxytocinStartTime: oxyISO,
    oxytocinLog: oxyISO ? [{ id: newId("ox"), startTime: oxyISO, dose: c.oxy.dose, lastIncrementTime: at }] : [],
    ves, ctgLog: [], observations: {},
    // A VE or onset left for later is listed until it is recorded.
    pendingDetails: [...(!c.noVE && !ves.length ? ["VE"] : []), ...(!cardOnset(c) ? ["onset"] : [])],
    addedBy: "quick-handover",
  };
}
