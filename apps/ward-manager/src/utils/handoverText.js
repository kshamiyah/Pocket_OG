// Plain-text ward handover, ordered by bed number.

import { computeAlerts } from "./wardAlerts";
import { fmtAge, hhmm } from "./time";
import { doctorLabel, lastVE, parityShort, stageLabel, stationLabel } from "./bedModel";
import { tidy } from "./triage";

function isPreterm(g) {
  const m = /^(\d+)\+(\d)$/.exec(g ?? "") || /^(\d+)w$/.exec(g ?? "");
  return m ? parseInt(m[1], 10) < 37 : false;
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
  const lines = [heading, `${date}  ${hhmm(now)}`, ""];

  if (!bedList.length) lines.push("No patients on board.");

  for (const bed of bedList) {
    lines.push(DIV);
    const pt = isPreterm(bed.gestation) ? " [PRETERM]" : "";
    lines.push(`BED ${bed.bedNumber}  ${parityShort(bed.parity)}  ${bed.gestation ?? "?"}${pt}  ${stageLabel(bed)}`);

    if (bed.delivery) {
      const dl = bed.delivery;
      const pph = dl.ebl >= 1000 ? " (major PPH)" : dl.ebl >= 500 ? " (PPH 500+)" : "";
      lines.push(`${dl.mode} · ${hhmm(dl.time)}${dl.ebl != null ? ` · EBL ${dl.ebl} mL${pph}` : ""}`);
      const done = [
        bed.neonatalTeamAlerted && "Neonatal ✓",
        bed.corticosteroidsConfirmed && "Steroids ✓",
        bed.mgso4Given && "MgSO4 ✓",
      ].filter(Boolean);
      if (done.length) lines.push(done.join(" · "));
      if (dl.notes) lines.push(`Notes: ${dl.notes}`);
      lines.push("");
      continue;
    }

    const ve = lastVE(bed);
    if (ve) {
      const cx = ve.contractions != null ? ` · ${ve.contractions}cx/10` : "";
      lines.push(`VE: ${ve.dilation}cm / ${stationLabel(ve.station)} / ${ve.presentation ?? "Ceph"} at ${hhmm(ve.time)} (${fmtAge(now - new Date(ve.time).getTime())} ago)${cx}`);
    } else {
      lines.push("VE: none recorded");
    }
    if (bed.labourStage === "Active second stage" && bed.pushingStartTime) {
      lines.push(`Pushing since ${hhmm(bed.pushingStartTime)}`);
    }

    const obs = bed.observations ?? {};
    const obsParts = [
      obs.bpSystolic && obs.bpDiastolic && `BP ${obs.bpSystolic}/${obs.bpDiastolic}`,
      obs.pulseValue && `P${obs.pulseValue}`,
      obs.tempValue && `T${obs.tempValue}°C`,
      obs.bglValue && `BGL ${obs.bglValue}`,
      bed.analgesia && bed.analgesia !== "None" && bed.analgesia,
    ].filter(Boolean);
    if (obsParts.length) lines.push(obsParts.join(" | "));

    const ctg = (bed.ctgLog ?? []).at(-1);
    const flagParts = [
      ...(bed.riskFlags ?? []),
      bed.gbsAntibioticsStarted && "IAP ✓",
      bed.tocolysisOffered && "Tocolysis offered ✓",
      ctg && `CTG ${ctg.classification} ${hhmm(ctg.time)}`,
    ].filter(Boolean);
    if (flagParts.length) lines.push(flagParts.join(" · "));

    computeAlerts(bed, now)
      .filter(a => a.severity === "urgent" || a.severity === "warning")
      .forEach(a => lines.push(`${a.severity === "urgent" ? "!!" : "!"} ${tidy(a.title)}`));

    const tasks = (bed.tasks ?? []).filter(x => !x.done);
    if (tasks.length) lines.push(`To do: ${tasks.map(x => x.text).join(", ")}`);
    lines.push("");
  }

  if (shift?.shiftStart && shift?.shiftEnd) {
    lines.push(DIV, `Shift: ${hhmm(shift.shiftStart)} to ${hhmm(shift.shiftEnd)}`);
  }
  lines.push(DIV, "PocketSuite · Not a substitute for clinical judgement");
  return lines.join("\n");
}
