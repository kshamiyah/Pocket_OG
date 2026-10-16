// Plain-text ward handover, ordered by bed number.

import { computeAlerts } from "./wardAlerts";
import { clock, fmtAge } from "./time";
import { DONE_LABEL, PERSISTENT_FLAGS, currentOxytocin, doctorLabel, lastVE, membraneStatus, parityWithHistory, riskLabel, stageLabel, veFindings } from "./bedModel";

const DONE_FIELDS = [...new Set(Object.values(PERSISTENT_FLAGS).map(f => f.field))];
import { applyReviews, tidy } from "./triage";

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
      ? `~ ${tidy(a.title)} (reviewed ${clock(a.reviewed.at)}${a.reviewed.by ? ` by ${a.reviewed.by}` : ""})`
      : `${a.severity === "urgent" ? "!!" : "!"} ${tidy(a.title)}`);
}

export function generateHandover(beds, shift, now = Date.now()) {
  const d = new Date(now);
  const date = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  const bedList = Object.values(beds).sort((a, b) =>
    String(a.bedNumber).localeCompare(String(b.bedNumber), undefined, { numeric: true }));
  const DIV = "-".repeat(38);
  const heading = shift
    ? `${doctorLabel(shift.doctorName).toUpperCase()} · ${String(shift.shiftType ?? "").toUpperCase()} SHIFT`
    : "LABOUR WARD HANDOVER";
  const lines = [heading, `${date}  ${clock(now, now)}`, ""];

  if (!bedList.length) lines.push("No patients on board.");

  for (const bed of bedList) {
    lines.push(DIV);
    const pt = isPreterm(bed.gestation) ? " [PRETERM]" : "";
    lines.push(`BED ${bed.bedNumber}  ${parityWithHistory(bed)}  ${bed.gestation ?? "?"}${pt}  ${stageLabel(bed)}`);

    // Background that matters whether or not she has delivered.
    const background = [
      ...(bed.riskFlags ?? []).map(riskLabel),
      bed.modeOfOnset && bed.modeOfOnset !== "Spontaneous" ? bed.modeOfOnset : null,
      bed.modeOfOnset === "Induced" && bed.inductionMethod ? `${bed.inductionMethod}${bed.inductionStartTime ? ` from ${clock(bed.inductionStartTime, now)}` : ""}` : null,
      bed.analgesia && bed.analgesia !== "None" ? bed.analgesia : null,
    ].filter(Boolean);
    // What has been given or done, with the time where it was recorded.
    const done = DONE_FIELDS.filter(f => bed[f])
      .map(f => `${DONE_LABEL[f] ?? f}${bed[`${f}At`] ? ` ${clock(bed[`${f}At`], now)}` : ""} ✓`);
    const tasks = (bed.tasks ?? []).filter(x => !x.done);

    if (bed.delivery) {
      const dl = bed.delivery;
      const pph = dl.ebl > 1000 ? " (major PPH)" : dl.ebl >= 500 ? " (minor PPH)" : "";
      lines.push(`${dl.mode} · ${clock(dl.time, now)}${dl.ebl != null ? ` · EBL ${dl.ebl} mL${pph}` : " · EBL not recorded"}`);
      if (background.length) lines.push(background.join(" · "));
      if (done.length) lines.push(done.join(" · "));
      if (dl.notes) lines.push(`Notes: ${dl.notes}`);
      alertLines(bed, now).forEach(l => lines.push(l));
      if (tasks.length) lines.push(`To do: ${tasks.map(x => x.text).join(", ")}`);
      lines.push("");
      continue;
    }

    const ve = lastVE(bed);
    if (ve) {
      const cx = ve.contractions != null ? ` · ${ve.contractions} in 10` : "";
      lines.push(`VE: ${veFindings(ve)} at ${clock(ve.time, now)} (${fmtAge(now - new Date(ve.time).getTime())} ago)${cx}`);
    } else {
      lines.push("VE: none recorded");
    }

    // Membranes: from the latest VE that recorded them, else from admission.
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
    if (oxy) lines.push(`Oxytocin ${oxy.dose} mU/min since ${clock(oxy.lastIncrementTime ?? oxy.startTime, now)}${bed.oxytocinHeld ? " (held)" : ""}`);
    else if (lastOxy?.stopped) lines.push(`Oxytocin stopped ${clock(lastOxy.startTime, now)}${lastOxy.stopReason ? `: ${lastOxy.stopReason}` : ""}`);

    const obs = bed.observations ?? {};
    const obsParts = [
      obs.bpSystolic && obs.bpDiastolic && `BP ${obs.bpSystolic}/${obs.bpDiastolic}`,
      obs.pulseValue && `P${obs.pulseValue}`,
      obs.tempValue && `T${obs.tempValue}°C`,
      obs.bglValue && `BGL ${obs.bglValue}`,
    ].filter(Boolean);
    if (obsParts.length) lines.push(obsParts.join(" | "));

    if (background.length) lines.push(background.join(" · "));
    if (done.length) lines.push(done.join(" · "));
    // CTG trend: the last 3 reviews, oldest first, so a change is visible.
    const ctgs = (bed.ctgLog ?? []).slice(-3);
    if (ctgs.length) {
      const last = ctgs.at(-1);
      lines.push(`CTG: ${ctgs.map(c => `${c.classification} ${clock(c.time, now)}`).join(" > ")}${last.comment ? ` (${last.comment})` : ""}`);
    }

    alertLines(bed, now).forEach(l => lines.push(l));

    if (tasks.length) lines.push(`To do: ${tasks.map(x => x.text).join(", ")}`);
    lines.push("");
  }

  if (shift?.shiftStart && shift?.shiftEnd) {
    lines.push(DIV, `Shift: ${clock(shift.shiftStart, now)} to ${clock(shift.shiftEnd, now)}`);
  }
  lines.push(DIV, "PocketSuite · Not a substitute for clinical judgement");
  return lines.join("\n");
}
