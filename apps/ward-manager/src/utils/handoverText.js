// Plain-text ward handover, women in priority order (the board's order).
// Default: SBAR, one short line each for Situation, Background, Assessment and
// Recommendation, with times on the clinical items. "Full detail" adds every
// observation and a timeline of the shift. Both end with the women who left
// the board this shift and the IOL queue.

import { computeAlerts } from "./wardAlerts";
import { clock, fmtAge } from "./time";
import { DONE_LABEL, PERSISTENT_FLAGS, currentOxytocin, doctorLabel, lastVE, membraneStatus, parityWithHistory, riskLabel, sortedVEs, stageLabel, veFindings } from "./bedModel";
import { applyReviews, shortLabel, tidy, triageWard } from "./triage";
import { sortIOLQueue } from "./iolPriority";

const DONE_FIELDS = [...new Set(Object.values(PERSISTENT_FLAGS).map(f => f.field))];
const HOUR = 3600000;
const TIER_TAG = { urgent: "NEEDS YOU", warning: "DUE SOON", watching: "WATCHING", ok: "ON TRACK", delivered: "DELIVERED" };

function isPreterm(g) {
  const m = /^(\d+)\+(\d)$/.exec(g ?? "") || /^(\d+)w$/.exec(g ?? "");
  return m ? parseInt(m[1], 10) < 37 : false;
}

// Urgent and due alerts, plus ones reviewed this shift (so the next doctor
// knows they were seen, and when they come back).
function alertLines(bed, now) {
  return applyReviews(computeAlerts(bed, now), bed, now)
    .filter(a => a.severity === "urgent" || a.severity === "warning" || a.reviewed)
    .map(a => a.reviewed
      ? `~ ${tidy(a.title)} (reviewed ${clock(a.reviewed.at, now)}${a.reviewed.by ? ` by ${a.reviewed.by}` : ""})`
      : `${a.severity === "urgent" ? "!!" : "!"} ${tidy(a.title)}`);
}

// Latest values, each with the time it was taken, plus the highest BP, pulse
// and temperature when they were worse than now, so a lower repeat never
// hides a worrying reading.
function obsLine(obs, now) {
  const at = iso => (iso ? ` ${clock(iso, now)}` : "");
  const w = obs.bpWorst;
  const worseBP = w && (w.sys > parseFloat(obs.bpSystolic) || w.dia > parseFloat(obs.bpDiastolic));
  const worse = (key, cur) => obs[key] && cur != null && obs[key].value > parseFloat(cur) ? obs[key] : null;
  const pw = worse("pulseWorst", obs.pulseValue);
  const tw = worse("tempWorst", obs.tempValue);
  const parts = [
    obs.bpSystolic && obs.bpDiastolic && `BP ${obs.bpSystolic}/${obs.bpDiastolic}${at(obs.bpAt ?? obs.lastBP)}${worseBP ? ` (highest ${w.sys}/${w.dia} at ${clock(w.at, now)})` : ""}`,
    obs.pulseValue && `P ${obs.pulseValue}${at(obs.pulseAt ?? obs.lastPulse)}${pw ? ` (highest ${pw.value} at ${clock(pw.at, now)})` : ""}`,
    obs.rrValue && `RR ${obs.rrValue}${at(obs.rrAt ?? obs.lastRR)}`,
    obs.tempValue && `T ${obs.tempValue}°C${at(obs.tempAt ?? obs.lastTemp)}${tw ? ` (highest ${tw.value} at ${clock(tw.at, now)})` : ""}`,
    obs.bglValue && `BGL ${obs.bglValue}${at(obs.bglAt ?? obs.lastBGL)}`,
    obs.urineOutput != null && `Urine ${obs.urineOutput} mL/hr${at(obs.lastUrineCheck)}`,
  ].filter(Boolean);
  return parts.length ? `Obs: ${parts.join(" | ")}` : null;
}

/**
 * The important events on a woman's record, oldest first, each with its time:
 * admission, induction, membranes, established labour, oxytocin started or
 * stopped, CTG category changes, second stage, treatments given or declined,
 * alerts reviewed, tasks done, severe readings and the birth.
 */
export function bedTimeline(bed, now = Date.now()) {
  return timelineEvents(bed, now).map(e => `${clock(e.time, now)} ${e.text}`);
}

function timelineEvents(bed, now) {
  const ev = [];
  const add = (time, text) => { if (time && Number.isFinite(new Date(time).getTime())) ev.push({ time, text }); };
  add(bed.admissionTime, "Admitted");
  if (bed.modeOfOnset === "Induced") add(bed.inductionStartTime, `IOL started${bed.inductionMethod ? ` (${bed.inductionMethod})` : ""}`);
  const memb = membraneStatus(bed);
  if (memb.time) add(memb.time, `${memb.status === "AROM" || bed.armTime ? "ARM" : "Membranes ruptured"}${memb.liquor ? `, ${memb.liquor.toLowerCase()} liquor` : ""}`);
  else if (bed.armTime) add(bed.armTime, "ARM");
  add(bed.activeFirstStageStartTime, "Established labour");
  // Oxytocin: starts, restarts and stops (dose steps are in the "Now" line).
  (bed.oxytocinLog ?? []).forEach((e, i, log) => {
    const prev = log[i - 1];
    if (e.stopped) add(e.startTime, `Oxytocin stopped${e.stopReason ? `: ${e.stopReason}` : ""}`);
    else if (!prev || prev.stopped) add(e.startTime, `Oxytocin ${prev ? "restarted" : "started"} ${e.dose} mU/min`);
  });
  // CTG: only when the category changes.
  let lastCat = null;
  for (const c of bed.ctgLog ?? []) {
    if (c.classification && c.classification !== lastCat) {
      add(c.time, lastCat == null ? `CTG ${c.classification}` : `CTG ${lastCat} to ${c.classification}`);
      lastCat = c.classification;
    }
  }
  add(bed.passiveStartTime, "Fully dilated");
  add(bed.pushingStartTime, "Pushing");
  for (const f of DONE_FIELDS) {
    if (bed[f]) add(bed[`${f}At`], `${DONE_LABEL[f] ?? f}${bed[`${f}By`] ? ` (${bed[`${f}By`]})` : ""}`);
    if (bed[`${f}Declined`]) add(bed[`${f}DeclinedAt`], `${(DONE_LABEL[f] ?? f).replace(/ (given|confirmed)$/, "")}: not given (decision)`);
  }
  for (const [id, r] of Object.entries(bed.reviews ?? {})) add(r?.at, `Reviewed: ${shortLabel({ id, title: id })}${r?.by ? ` (${r.by})` : ""}`);
  for (const x of bed.tasks ?? []) if (x.done && x.doneAt) add(x.doneAt, `Done: ${x.text}`);
  const obs = bed.observations ?? {};
  if (obs.bpWorst && (obs.bpWorst.sys >= 160 || obs.bpWorst.dia >= 110)) add(obs.bpWorst.at, `Severe BP ${obs.bpWorst.sys}/${obs.bpWorst.dia}`);
  if (obs.tempWorst && obs.tempWorst.value >= 38) add(obs.tempWorst.at, `Temperature ${obs.tempWorst.value}°C`);
  if (obs.pulseWorst && obs.pulseWorst.value > 120) add(obs.pulseWorst.at, `Pulse ${obs.pulseWorst.value}`);
  if (bed.delivery) add(bed.delivery.time, `${bed.delivery.mode}${bed.delivery.ebl != null ? `, EBL ${bed.delivery.ebl} mL` : ""}`);
  return ev
    .filter(e => new Date(e.time).getTime() <= now + 60000)
    .sort((a, b) => new Date(a.time) - new Date(b.time));
}

// Background: risk factors, onset, analgesia, and treatments given or declined.
function backgroundItems(bed, now) {
  return [
    ...(bed.riskFlags ?? []).map(riskLabel),
    bed.modeOfOnset && bed.modeOfOnset !== "Spontaneous"
      ? `${bed.modeOfOnset}${!bed.delivery && bed.modeOfOnset === "Induced" && bed.inductionMethod ? ` (${bed.inductionMethod})` : ""}` : null,
    bed.analgesia && bed.analgesia !== "None" ? bed.analgesia : null,
    ...DONE_FIELDS.filter(f => bed[f])
      .map(f => `${DONE_LABEL[f] ?? f}${bed[`${f}At`] ? ` ${clock(bed[`${f}At`], now)}` : ""} ✓`),
    ...DONE_FIELDS.filter(f => bed[`${f}Declined`])
      .map(f => `${(DONE_LABEL[f] ?? f).replace(/ (given|confirmed)$/, "")} not given (decision${bed[`${f}DeclinedAt`] ? ` ${clock(bed[`${f}DeclinedAt`], now)}` : ""})`),
  ].filter(Boolean);
}

// Only the observations worth saying out loud: abnormal or the worst this
// admission, each with its time. Otherwise "obs normal" with the last time.
function obsFindings(obs, now) {
  const out = [];
  const w = obs.bpWorst;
  if (w && (w.sys >= 140 || w.dia >= 90)) out.push(`highest BP ${w.sys}/${w.dia} at ${clock(w.at, now)}`);
  const val = k => (obs[k] != null ? parseFloat(obs[k]) : null);
  const pw = obs.pulseWorst;
  if (pw && pw.value > 100) out.push(`highest pulse ${pw.value} at ${clock(pw.at, now)}`);
  const tw = obs.tempWorst;
  if (tw && tw.value >= 37.5) out.push(`highest temp ${tw.value}°C at ${clock(tw.at, now)}`);
  const rr = val("rrValue");
  if (rr != null && (rr > 20 || rr < 12)) out.push(`RR ${rr} at ${clock(obs.rrAt ?? obs.lastRR, now)}`);
  const bgl = val("bglValue");
  if (bgl != null && (bgl < 4 || bgl > 7)) out.push(`BGL ${bgl} at ${clock(obs.bglAt ?? obs.lastBGL, now)}`);
  if (obs.urineOutput != null && obs.urineOutput < 30) out.push(`urine ${obs.urineOutput} mL/hr at ${clock(obs.lastUrineCheck, now)}`);
  if (out.length) return `Obs: ${out.join(", ")}`;
  const times = ["lastPulse", "lastBP", "lastTemp", "lastRR"].map(k => obs[k]).filter(Boolean).sort();
  return times.length ? `Obs normal (last ${clock(times.at(-1), now)})` : null;
}

// Events worth adding to the assessment that the other items do not already
// say: tasks completed, with their times.
const KEY_EVENT = /^Done:/;

/** One woman in SBAR: four short lines. */
function sbarBlock(bed, t, now) {
  const pt = isPreterm(bed.gestation) ? " (preterm)" : "";
  const lines = [`BED ${bed.bedNumber} · ${parityWithHistory(bed)} · ${bed.gestation ?? "?"}${pt}${t ? ` · ${TIER_TAG[t.tier] ?? ""}` : ""}`];
  const open = applyReviews(computeAlerts(bed, now), bed, now).filter(a => a.severity === "urgent" || a.severity === "warning");

  // S: where she is now, and the main problem.
  let where;
  if (bed.delivery) {
    const dl = bed.delivery;
    const pph = dl.ebl > 1000 ? " (major PPH)" : dl.ebl >= 500 ? " (minor PPH)" : "";
    where = `Delivered: ${dl.mode} ${clock(dl.time, now)}${dl.ebl != null ? `, EBL ${dl.ebl} mL${pph}` : ""}`;
  } else {
    const ve = lastVE(bed);
    const since = bed.labourStage === "Active second stage" ? bed.pushingStartTime
      : bed.labourStage === "Passive second stage" ? bed.passiveStartTime
      : bed.labourStage === "Active first stage" ? bed.activeFirstStageStartTime : null;
    where = `${stageLabel(bed)}${since ? ` since ${clock(since, now)}` : ""}${ve ? `, ${ve.dilation} cm at ${clock(ve.time, now)}` : ", no VE yet"}`;
  }
  // The main problem, unless the situation already says it (a PPH after birth).
  const main = open[0] && !(bed.delivery && open[0].id === "pph") ? `. ${tidy(open[0].title)}` : "";
  lines.push(`S: ${where}${main}`);

  // B: background.
  const bg = backgroundItems(bed, now);
  lines.push(`B: ${bg.length ? bg.join(" · ") : "Nil of note"}`);

  // A: current findings and the shift's key events.
  const a = [];
  if (!bed.delivery) {
    const ctgs = (bed.ctgLog ?? []).slice(-3);
    if (ctgs.length) a.push(`CTG ${ctgs.map(c => `${c.classification} ${clock(c.time, now)}`).join(" > ")}${ctgs.at(-1).comment ? ` (${ctgs.at(-1).comment})` : ""}`);
    // Oxytocin as one item: since when and the dose now, or from when to when.
    const log = bed.oxytocinLog ?? [];
    const oxy = currentOxytocin(bed);
    const lastOxy = log.at(-1);
    const episodeStart = end => {
      let i = end;
      while (i > 0 && !log[i - 1].stopped) i--;
      return log[i]?.startTime;
    };
    if (oxy) {
      a.push(`Oxytocin ${oxy.dose} mU/min${bed.oxytocinHeld ? " (held)" : ""} since ${clock(episodeStart(log.length - 1), now)}, last change ${clock(oxy.lastIncrementTime ?? oxy.startTime, now)}`);
    } else if (lastOxy?.stopped) {
      const from = log.length > 1 ? episodeStart(log.length - 2) : null;
      a.push(`Oxytocin ${from ? `${clock(from, now)} to ` : "stopped "}${clock(lastOxy.startTime, now)}${lastOxy.stopReason ? `, stopped: ${lastOxy.stopReason}` : ""}`);
    }
    const m = membraneStatus(bed);
    if (m.status && m.status !== "Intact") a.push(`${m.status}${m.time ? ` ${clock(m.time, now)}` : ""}${m.liquor ? `, ${m.liquor.toLowerCase()}` : ""}`);
  } else if (bed.delivery.notes) {
    a.push(bed.delivery.notes);
  }
  const of = obsFindings(bed.observations ?? {}, now);
  if (of) a.push(of);
  const events = timelineEvents(bed, now).filter(e => KEY_EVENT.test(e.text));
  if (events.length) a.push(events.slice(-3).map(e => `${e.text} ${clock(e.time, now)}`).join(", "));
  lines.push(`A: ${a.length ? a.join(" · ") : "Nothing new"}`);

  // R: what needs doing.
  const r = [
    ...open.map(x => `${x.severity === "urgent" ? "!!" : "!"} ${shortLabel(x)}`),
    ...applyReviews(computeAlerts(bed, now), bed, now).filter(x => x.reviewed)
      .map(x => `~ ${shortLabel(x)} (reviewed ${clock(x.reviewed.at, now)}${x.reviewed.by ? ` by ${x.reviewed.by}` : ""})`),
    t?.next ? `next ${t.next.label} ${clock(t.next.at, now)}` : null,
    ...(bed.tasks ?? []).filter(x => !x.done).map(x => `to do: ${x.text}`),
  ].filter(Boolean);
  lines.push(`R: ${r.length ? r.join(" · ") : "Continue current plan"}`);
  return lines;
}

// Full detail: header, background, now, every obs, timeline, alerts, next, to do.
function bedBlock(bed, t, now) {
  const lines = [];
  const pt = isPreterm(bed.gestation) ? " [PRETERM]" : "";
  const tag = t ? `  [${TIER_TAG[t.tier] ?? ""}]` : "";
  lines.push(`BED ${bed.bedNumber}  ${parityWithHistory(bed)}  ${bed.gestation ?? "?"}${pt}  ${stageLabel(bed)}${tag}`);

  // Background that matters whether or not she has delivered. The induction
  // method is history once she has delivered, so it moves to the timeline.
  const background = [
    ...(bed.riskFlags ?? []).map(riskLabel),
    bed.modeOfOnset && bed.modeOfOnset !== "Spontaneous" ? bed.modeOfOnset : null,
    bed.analgesia && bed.analgesia !== "None" ? bed.analgesia : null,
  ].filter(Boolean);
  if (background.length) lines.push(background.join(" · "));

  if (bed.delivery) {
    const dl = bed.delivery;
    const pph = dl.ebl > 1000 ? " (major PPH)" : dl.ebl >= 500 ? " (minor PPH)" : "";
    lines.push(`${dl.mode} · ${clock(dl.time, now)}${dl.ebl != null ? ` · EBL ${dl.ebl} mL${pph}` : " · EBL not recorded"}`);
    if (dl.notes) lines.push(`Notes: ${dl.notes}`);
  } else {
    const ve = lastVE(bed);
    if (ve) {
      const cx = ve.contractions != null ? ` · ${ve.contractions} in 10` : "";
      const trend = sortedVEs(bed).slice(-4);
      const tr = trend.length > 1 ? ` · trend ${trend.map(v => `${v.dilation} cm ${clock(v.time, now)}`).join(" > ")}` : "";
      lines.push(`VE: ${veFindings(ve)} at ${clock(ve.time, now)} (${fmtAge(now - new Date(ve.time).getTime())} ago)${cx}${tr}`);
    } else {
      lines.push("VE: none recorded");
    }
    const { status: memb, time: romTime, liquor } = membraneStatus(bed);
    if (memb && memb !== "Intact") {
      lines.push(`Membranes: ${memb}${romTime ? ` ${clock(romTime, now)} (${fmtAge(now - new Date(romTime).getTime())} ago)` : ""}${liquor ? `, ${liquor.toLowerCase()}` : ""}`);
    } else if (memb === "Intact") {
      lines.push("Membranes: intact");
    }
    if (bed.labourStage === "Active second stage" && bed.pushingStartTime) {
      lines.push(`Pushing since ${clock(bed.pushingStartTime, now)}`);
    } else if (bed.labourStage === "Passive second stage" && bed.passiveStartTime) {
      lines.push(`Fully dilated since ${clock(bed.passiveStartTime, now)}`);
    }
    const oxy = currentOxytocin(bed);
    const lastOxy = (bed.oxytocinLog ?? []).at(-1);
    if (oxy) {
      const log = bed.oxytocinLog ?? [];
      let i = log.length - 1;
      while (i > 0 && !log[i - 1].stopped) i--;
      lines.push(`Oxytocin ${oxy.dose} mU/min${bed.oxytocinHeld ? " (held)" : ""} · started ${clock(log[i].startTime, now)} · last change ${clock(oxy.lastIncrementTime ?? oxy.startTime, now)}`);
    } else if (lastOxy?.stopped) {
      lines.push(`Oxytocin stopped ${clock(lastOxy.startTime, now)}${lastOxy.stopReason ? `: ${lastOxy.stopReason}` : ""}`);
    }
    // CTG trend: the last 3 reviews, oldest first, so a change is visible.
    const ctgs = (bed.ctgLog ?? []).slice(-3);
    if (ctgs.length) {
      const last = ctgs.at(-1);
      lines.push(`CTG: ${ctgs.map(c => `${c.classification} ${clock(c.time, now)}`).join(" > ")}${last.comment ? ` (${last.comment})` : ""}`);
    }
  }

  const ol = obsLine(bed.observations ?? {}, now);
  if (ol) lines.push(ol);

  // What has been given or done, with the time it was recorded.
  const done = [
    ...DONE_FIELDS.filter(f => bed[f])
      .map(f => `${DONE_LABEL[f] ?? f}${bed[`${f}At`] ? ` ${clock(bed[`${f}At`], now)}` : ""} ✓`),
    ...DONE_FIELDS.filter(f => bed[`${f}Declined`])
      .map(f => `${(DONE_LABEL[f] ?? f).replace(/ (given|confirmed)$/, "")} not given (decision${bed[`${f}DeclinedAt`] ? ` ${clock(bed[`${f}DeclinedAt`], now)}` : ""})`),
  ];
  if (done.length) lines.push(done.join(" · "));

  const timeline = bedTimeline(bed, now);
  if (timeline.length) {
    lines.push("Timeline:");
    timeline.slice(-12).forEach(l => lines.push(`  ${l}`));
  }

  alertLines(bed, now).forEach(l => lines.push(l));
  if (t?.next) lines.push(`Next: ${t.next.label} due ${clock(t.next.at, now)}`);
  const tasks = (bed.tasks ?? []).filter(x => !x.done);
  if (tasks.length) lines.push(`To do: ${tasks.map(x => `${x.text}${x.createdAt ? ` (added ${clock(x.createdAt, now)})` : ""}`).join(", ")}`);
  return lines;
}

/**
 * opts.removed: [{ at, bed }] women removed from the board (shown if removed
 * this shift and not back on the board). opts.iolQueue: the IOL queue.
 */
export function generateHandover(beds, shift, now = Date.now(), opts = {}) {
  const full = opts.detail === "full";
  const d = new Date(now);
  const date = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  const rows = triageWard(beds, now);
  const DIV = "-".repeat(38);
  const heading = shift
    ? `${doctorLabel(shift.doctorName).toUpperCase()} · ${String(shift.shiftType ?? "").toUpperCase()} SHIFT`
    : "LABOUR WARD HANDOVER";
  const lines = [heading, `${date}  ${clock(now, now)}  · ${full ? "full detail" : "SBAR"}, in priority order`, ""];

  if (!rows.length) lines.push("No patients on board.");

  for (const { bed, t } of rows) {
    lines.push(DIV, ...(full ? bedBlock(bed, t, now) : sbarBlock(bed, t, now)), "");
  }

  // Women who left the board this shift (delivered and moved, transferred).
  const since = shift?.shiftStart ? new Date(shift.shiftStart).getTime() : now - 12 * HOUR;
  const gone = (opts.removed ?? [])
    .filter(r => new Date(r.at).getTime() >= since && !beds[r.bed?.id])
    .sort((a, b) => new Date(a.at) - new Date(b.at));
  if (gone.length) {
    lines.push(DIV, `LEFT THE BOARD THIS SHIFT (${gone.length})`);
    for (const r of gone) {
      const b = r.bed;
      const dl = b.delivery ? ` · ${b.delivery.mode} ${clock(b.delivery.time, now)}${b.delivery.ebl != null ? `, EBL ${b.delivery.ebl} mL` : ""}` : " · not delivered";
      lines.push(`Bed ${b.bedNumber}  ${parityWithHistory(b)}  ${b.gestation ?? "?"}${dl} · removed ${clock(r.at, now)}`);
      if (full) bedTimeline(b, now).slice(-5).forEach(l => lines.push(`  ${l}`));
    }
    lines.push("");
  }

  const queue = sortIOLQueue(opts.iolQueue ?? []);
  if (queue.length) {
    lines.push(DIV, `IOL QUEUE (${queue.length})`);
    for (const e of queue) {
      const waited = e.addedAt ? ` · waiting ${fmtAge(now - new Date(e.addedAt).getTime())} (added ${clock(e.addedAt, now)})` : "";
      lines.push(`${e.initials} ${e.gestWeeks}+${e.gestDays ?? 0} · ${(e.indications ?? []).join(", ")}${waited}`);
    }
    lines.push("");
  }

  if (shift?.shiftStart && shift?.shiftEnd) {
    lines.push(DIV, `Shift: ${clock(shift.shiftStart, now)} to ${clock(shift.shiftEnd, now)}`);
  }
  lines.push(DIV, "PocketSuite · Not a substitute for clinical judgement");
  return lines.join("\n");
}
