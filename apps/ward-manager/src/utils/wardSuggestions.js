// Suggestion engine — proactive "sidekick" guidance that fires BEFORE alerts do.
// Suggestions are positive next-action nudges, not problem flags.
// All thresholds are set below the alert thresholds in wardAlerts.js.

const MIN  = 60 * 1000;
const HOUR = 60 * MIN;

function fmtAge(ms) {
  const m = Math.floor(ms / MIN);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60), rm = m % 60;
  return rm > 0 ? `${h}h ${rm}m` : `${h}h`;
}

function parseGestWeeks(str) {
  if (!str) return null;
  const plus = str.match(/^(\d+)\+(\d)$/);
  if (plus) return parseInt(plus[1]) + parseInt(plus[2]) / 7;
  const w = str.match(/^(\d+)w$/);
  if (w) return parseInt(w[1]);
  return null;
}

// priority 1 = high (show at top), 2 = medium, 3 = low
export function computeSuggestions(bed, now = Date.now()) {
  if (bed.delivery) return [];

  const suggestions = [];
  const B       = bed.bedNumber;
  const ves     = [...(bed.ves ?? [])].sort((a, b) => new Date(a.time) - new Date(b.time));
  const lastVE  = ves.at(-1) ?? null;
  const ctgLog  = bed.ctgLog ?? [];
  const lastCTG = ctgLog.at(-1) ?? null;
  const flags   = bed.riskFlags ?? [];

  const isNullip    = bed.parity === "Para 0";
  const hasEpidural = bed.analgesia === "Epidural" || bed.analgesia === "Remifentanil PCA";
  const hasOxytocin = (bed.oxytocinLog?.length ?? 0) > 0;
  const isVBAC      = flags.includes("VBAC") || flags.includes("Previous LSCS");
  const isDiabetic  = flags.some(f => f.startsWith("Diabetic"));
  const isHypert    = flags.includes("Hypertensive");
  const gestWks     = parseGestWeeks(bed.gestation);
  const isPreterm   = gestWks !== null && gestWks < 37;
  const hasMec      = lastVE?.liquor === "Thin meconium" || lastVE?.liquor === "Thick meconium";

  const needsContinuousCTG = !!(
    isVBAC || isDiabetic || isHypert ||
    flags.includes("GBS+") || flags.includes("GBS pending") ||
    isPreterm || hasEpidural || bed.modeOfOnset === "PPROM" ||
    hasOxytocin || hasMec
  );

  // ─── 1. ARM consideration ────────────────────────────────────────────────
  // Fires when: active 1st stage, membranes intact, ≥5cm, ≥3 contractions, no ARM yet
  // Alert: none for this scenario — this is genuinely additive
  if (
    bed.labourStage === "Active first stage" &&
    !bed.armTime &&
    lastVE?.membranes === "Intact" &&
    lastVE?.dilation  >= 5 &&
    typeof lastVE.contractions === "number" && lastVE.contractions >= 3
  ) {
    suggestions.push({
      id: "arm-consider",
      priority: 2,
      title: "Consider ARM",
      body: `Membranes still intact at Bed ${B} — ${lastVE.dilation}cm with ${lastVE.contractions} contractions, might be a good moment to discuss ARM.`,
      citation: "NG235 §1.5.2",
      action: null,
      snoozeMinutes: 60,
    });
  }

  // ─── 2. VE approaching ──────────────────────────────────────────────────
  // Fires: active 1st stage, last VE 2.5–3.5h ago (alert fires at 3.5h warning, 4h urgent)
  // Skipped when oxytocin running (different VE rhythm already covered by alert)
  if (
    bed.labourStage === "Active first stage" &&
    lastVE && !hasOxytocin
  ) {
    const ms = now - new Date(lastVE.time).getTime();
    if (ms >= 2.5 * HOUR && ms < 3.5 * HOUR) {
      suggestions.push({
        id: "ve-approaching",
        priority: 2,
        title: "VE due soon",
        body: `Bed ${B} is coming up on ${fmtAge(ms)} since the last VE — worth planning a check before the 4-hour mark.`,
        citation: "NG235 §1.7",
        action: { kind: "open-sheet", sheet: "ve" },
        snoozeMinutes: 30,
      });
    }
  }

  // ─── 3. CTG review nudge ────────────────────────────────────────────────
  // Fires: needs continuous CTG, last normal CTG 45–60min ago (alert fires at 60min)
  if (needsContinuousCTG && lastCTG && lastCTG.classification === "normal") {
    const ms = now - new Date(lastCTG.time).getTime();
    if (ms >= 45 * MIN && ms < 60 * MIN) {
      const context = hasOxytocin ? "especially with Synto running"
                    : isVBAC      ? "given VBAC in labour"
                    : isHypert    ? "with hypertension"
                    : "worth staying on top of it";
      suggestions.push({
        id: "ctg-nudge",
        priority: 2,
        title: "CTG review due",
        body: `CTG at Bed ${B} hasn't had a fresh look in ${fmtAge(ms)} — ${context}.`,
        citation: "NG229 §1.4",
        action: { kind: "open-sheet", sheet: "ctg" },
        snoozeMinutes: 15,
      });
    }
  }

  // ─── 4. Suspicious CTG approaching 30min ────────────────────────────────
  // Fires: last CTG suspicious, 20–30min ago (urgent alert fires at 30min)
  if (lastCTG?.classification === "suspicious") {
    const ms = now - new Date(lastCTG.time).getTime();
    if (ms >= 20 * MIN && ms < 30 * MIN) {
      suggestions.push({
        id: "ctg-suspicious-soon",
        priority: 1,
        title: "Suspicious CTG — reassess soon",
        body: `Bed ${B} has had a suspicious CTG for ${fmtAge(ms)} — starting to approach the 30-minute mark. Worth getting a senior eye on it now.`,
        citation: "NG229 §1.5.2",
        action: { kind: "open-sheet", sheet: "ctg" },
        snoozeMinutes: 0,
      });
    }
  }

  // ─── 5. VBAC + oxytocin caution ─────────────────────────────────────────
  // Fires: VBAC/prev LSCS flag + oxytocin running — consultant awareness nudge
  if (isVBAC && hasOxytocin) {
    suggestions.push({
      id: "vbac-oxytocin",
      priority: 1,
      title: "VBAC on Synto — consultant aware?",
      body: `Synto running on a VBAC at Bed ${B} — has the consultant been looped in?`,
      citation: "NG235 §1.16.9",
      action: { kind: "open-tab", tab: "tasks" },
      snoozeMinutes: 120,
    });
  }

  // ─── 6. Epidural top-up before pushing ──────────────────────────────────
  // Fires: just entered active 2nd stage (<20min), epidural in place
  if (
    bed.labourStage === "Active second stage" &&
    hasEpidural && bed.pushingStartTime
  ) {
    const ms = now - new Date(bed.pushingStartTime).getTime();
    if (ms < 20 * MIN) {
      suggestions.push({
        id: "epidural-topup",
        priority: 2,
        title: "Epidural top-up?",
        body: `Bed ${B} has just moved to active pushing with an epidural — good moment to check if a top-up is needed before she starts.`,
        citation: "NG235 §1.13",
        action: null,
        snoozeMinutes: 0,
      });
    }
  }

  // ─── 7. Passive stage — time to push ────────────────────────────────────
  // Fires: passive 2nd stage past half its limit, before the alert window (limit - 15min)
  if (bed.labourStage === "Passive second stage" && bed.passiveStartTime) {
    const halfLimit  = isNullip ? HOUR : 30 * MIN;
    const alertEdge  = isNullip ? (2 * HOUR - 15 * MIN) : (HOUR - 15 * MIN);
    const ms = now - new Date(bed.passiveStartTime).getTime();
    if (ms >= halfLimit && ms < alertEdge) {
      suggestions.push({
        id: "passive-push-time",
        priority: 2,
        title: "Passive stage — time to push?",
        body: `Bed ${B} has been in passive second stage for ${fmtAge(ms)} — ${
          isNullip
            ? "might be getting close to time to start active pushing"
            : "worth checking if she's ready to push"
        }.`,
        citation: "NG235 §1.6.3",
        action: null,
        snoozeMinutes: 20,
      });
    }
  }

  // ─── 8. IOL latent phase — progress check ───────────────────────────────
  // Fires: induced, latent stage, >6h since admission (latent-reassess alert fires at 4h generally)
  if (
    bed.modeOfOnset === "Induced" &&
    bed.labourStage === "Latent" &&
    bed.admissionTime
  ) {
    const ms = now - new Date(bed.admissionTime).getTime();
    if (ms >= 6 * HOUR) {
      suggestions.push({
        id: "iol-latent-progress",
        priority: 2,
        title: "IOL progress check",
        body: `Bed ${B} has been in the latent phase for ${fmtAge(ms)} since induction started — worth a check to see how the cervix is responding.`,
        citation: "NG207 §1.11",
        action: { kind: "open-sheet", sheet: "ve" },
        snoozeMinutes: 60,
      });
    }
  }

  return suggestions.sort((a, b) => a.priority - b.priority);
}
