import { describe, it, expect } from "vitest";
import { computeSuggestions } from "./wardSuggestions";

const MIN  = 60 * 1000;
const HOUR = 60 * MIN;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const base = (overrides = {}) => ({
  id: "b1",
  bedNumber: "1",
  parity: "Para 1",
  gestation: "39+0",
  labourStage: "Active first stage",
  modeOfOnset: "Spontaneous",
  riskFlags: [],
  analgesia: "None",
  oxytocinLog: [],
  ves: [],
  ctgLog: [],
  ...overrides,
});

const veAt = (dilation, minsAgo, overrides = {}) => ({
  id: `ve-${minsAgo}`,
  time: new Date(Date.now() - minsAgo * MIN).toISOString(),
  dilation,
  membranes: "Intact",
  contractions: 3,
  station: 0,
  ...overrides,
});

const ctgAt = (classification, minsAgo) => ({
  id: `ctg-${minsAgo}`,
  time: new Date(Date.now() - minsAgo * MIN).toISOString(),
  classification,
  baselineHR: 140,
  variability: "5-25",
  decelerations: "none",
  accelerations: true,
});

const oxyEntry = () => ({
  id: "ox1",
  startTime: new Date().toISOString(),
  lastIncrementTime: new Date().toISOString(),
  dose: 4,
});

// ─── Global guard ─────────────────────────────────────────────────────────────

describe("computeSuggestions — global guard", () => {
  it("returns [] when delivery is set", () => {
    const bed = base({ delivery: { mode: "SVD", time: new Date().toISOString() } });
    expect(computeSuggestions(bed)).toEqual([]);
  });

  it("returns an array for a normal active-stage bed", () => {
    expect(Array.isArray(computeSuggestions(base()))).toBe(true);
  });

  it("each suggestion has required fields", () => {
    const bed = base({ riskFlags: ["VBAC"], oxytocinLog: [oxyEntry()] });
    const suggestions = computeSuggestions(bed);
    for (const s of suggestions) {
      expect(s).toHaveProperty("id");
      expect(s).toHaveProperty("priority");
      expect(s).toHaveProperty("title");
      expect(s).toHaveProperty("body");
      expect(s).toHaveProperty("citation");
      expect(s).toHaveProperty("snoozeMinutes");
    }
  });
});

// ─── Rule 1: arm-consider ────────────────────────────────────────────────────

describe("arm-consider", () => {
  it("fires when active 1st stage, intact membranes, ≥5 cm, ≥3 contractions, no ARM", () => {
    const bed = base({ ves: [veAt(5, 30, { contractions: 3, membranes: "Intact" })] });
    expect(computeSuggestions(bed).map(s => s.id)).toContain("arm-consider");
  });

  it("fires at exactly 5 cm", () => {
    const bed = base({ ves: [veAt(5, 30, { contractions: 3, membranes: "Intact" })] });
    expect(computeSuggestions(bed).map(s => s.id)).toContain("arm-consider");
  });

  it("fires at 8 cm with ≥3 contractions", () => {
    const bed = base({ ves: [veAt(8, 30, { contractions: 5, membranes: "Intact" })] });
    expect(computeSuggestions(bed).map(s => s.id)).toContain("arm-consider");
  });

  it("does NOT fire when membranes are SROM", () => {
    const bed = base({ ves: [veAt(5, 30, { contractions: 3, membranes: "SROM" })] });
    expect(computeSuggestions(bed).map(s => s.id)).not.toContain("arm-consider");
  });

  it("does NOT fire when membranes are AROM", () => {
    const bed = base({ ves: [veAt(6, 30, { contractions: 3, membranes: "AROM" })] });
    expect(computeSuggestions(bed).map(s => s.id)).not.toContain("arm-consider");
  });

  it("does NOT fire when dilation < 5 cm", () => {
    const bed = base({ ves: [veAt(4, 30, { contractions: 4, membranes: "Intact" })] });
    expect(computeSuggestions(bed).map(s => s.id)).not.toContain("arm-consider");
  });

  it("does NOT fire when contractions < 3", () => {
    const bed = base({ ves: [veAt(6, 30, { contractions: 2, membranes: "Intact" })] });
    expect(computeSuggestions(bed).map(s => s.id)).not.toContain("arm-consider");
  });

  it("does NOT fire when ARM already recorded", () => {
    const bed = base({
      armTime: new Date().toISOString(),
      ves: [veAt(6, 30, { contractions: 3, membranes: "Intact" })],
    });
    expect(computeSuggestions(bed).map(s => s.id)).not.toContain("arm-consider");
  });

  it("does NOT fire in latent stage", () => {
    const bed = base({ labourStage: "Latent", ves: [veAt(5, 30, { contractions: 3, membranes: "Intact" })] });
    expect(computeSuggestions(bed).map(s => s.id)).not.toContain("arm-consider");
  });

  it("does NOT fire in passive second stage", () => {
    const bed = base({ labourStage: "Passive second stage", ves: [veAt(10, 30, { contractions: 3, membranes: "Intact" })] });
    expect(computeSuggestions(bed).map(s => s.id)).not.toContain("arm-consider");
  });
});

// ─── Rule 2: ve-approaching ──────────────────────────────────────────────────

describe("ve-approaching", () => {
  it("fires when active 1st stage, last VE 2.5–3.5 h ago, no oxytocin", () => {
    const bed = base({ ves: [veAt(5, 170)] }); // 2h50m
    expect(computeSuggestions(bed).map(s => s.id)).toContain("ve-approaching");
  });

  it("fires at exactly 2.5 h ago (boundary inclusive)", () => {
    const bed = base({ ves: [veAt(5, 150)] });
    expect(computeSuggestions(bed).map(s => s.id)).toContain("ve-approaching");
  });

  it("does NOT fire when last VE < 2.5 h ago", () => {
    const bed = base({ ves: [veAt(5, 100)] });
    expect(computeSuggestions(bed).map(s => s.id)).not.toContain("ve-approaching");
  });

  it("does NOT fire when last VE ≥ 3.5 h ago (alert window)", () => {
    const bed = base({ ves: [veAt(5, 220)] }); // > 3.5h
    expect(computeSuggestions(bed).map(s => s.id)).not.toContain("ve-approaching");
  });

  it("does NOT fire when oxytocin is running", () => {
    const bed = base({ ves: [veAt(5, 170)], oxytocinLog: [oxyEntry()] });
    expect(computeSuggestions(bed).map(s => s.id)).not.toContain("ve-approaching");
  });

  it("does NOT fire when not in active first stage", () => {
    const bed = base({ labourStage: "Latent", ves: [veAt(2, 170)] });
    expect(computeSuggestions(bed).map(s => s.id)).not.toContain("ve-approaching");
  });

  it("does NOT fire when no VEs at all", () => {
    expect(computeSuggestions(base()).map(s => s.id)).not.toContain("ve-approaching");
  });
});

// ─── Rule 3: ctg-nudge ──────────────────────────────────────────────────────

describe("ctg-nudge", () => {
  it("fires for Epidural when last normal CTG 45–60 min ago", () => {
    const bed = base({ analgesia: "Epidural", ctgLog: [ctgAt("normal", 50)] });
    expect(computeSuggestions(bed).map(s => s.id)).toContain("ctg-nudge");
  });

  it("fires for VBAC risk flag when last normal CTG 45–60 min ago", () => {
    const bed = base({ riskFlags: ["VBAC"], ctgLog: [ctgAt("normal", 55)] });
    expect(computeSuggestions(bed).map(s => s.id)).toContain("ctg-nudge");
  });

  it("fires for Hypertensive flag", () => {
    const bed = base({ riskFlags: ["Hypertensive"], ctgLog: [ctgAt("normal", 50)] });
    expect(computeSuggestions(bed).map(s => s.id)).toContain("ctg-nudge");
  });

  it("fires when oxytocin running", () => {
    const bed = base({ oxytocinLog: [oxyEntry()], ctgLog: [ctgAt("normal", 50)] });
    expect(computeSuggestions(bed).map(s => s.id)).toContain("ctg-nudge");
  });

  it("fires at exactly 45 min ago (boundary inclusive)", () => {
    const bed = base({ analgesia: "Epidural", ctgLog: [ctgAt("normal", 45)] });
    expect(computeSuggestions(bed).map(s => s.id)).toContain("ctg-nudge");
  });

  it("does NOT fire when last CTG < 45 min ago", () => {
    const bed = base({ analgesia: "Epidural", ctgLog: [ctgAt("normal", 40)] });
    expect(computeSuggestions(bed).map(s => s.id)).not.toContain("ctg-nudge");
  });

  it("does NOT fire when last CTG ≥ 60 min ago (alert window)", () => {
    const bed = base({ analgesia: "Epidural", ctgLog: [ctgAt("normal", 65)] });
    expect(computeSuggestions(bed).map(s => s.id)).not.toContain("ctg-nudge");
  });

  it("does NOT fire when no continuous CTG indication", () => {
    const bed = base({ ctgLog: [ctgAt("normal", 50)] });
    expect(computeSuggestions(bed).map(s => s.id)).not.toContain("ctg-nudge");
  });

  it("does NOT fire when last CTG is suspicious (different rule)", () => {
    const bed = base({ analgesia: "Epidural", ctgLog: [ctgAt("suspicious", 50)] });
    expect(computeSuggestions(bed).map(s => s.id)).not.toContain("ctg-nudge");
  });
});

// ─── Rule 4: ctg-suspicious-soon ────────────────────────────────────────────

describe("ctg-suspicious-soon", () => {
  it("fires when last CTG suspicious 20–30 min ago", () => {
    const bed = base({ ctgLog: [ctgAt("suspicious", 25)] });
    expect(computeSuggestions(bed).map(s => s.id)).toContain("ctg-suspicious-soon");
  });

  it("fires at exactly 20 min ago (boundary inclusive)", () => {
    const bed = base({ ctgLog: [ctgAt("suspicious", 20)] });
    expect(computeSuggestions(bed).map(s => s.id)).toContain("ctg-suspicious-soon");
  });

  it("does NOT fire when suspicious CTG < 20 min ago", () => {
    const bed = base({ ctgLog: [ctgAt("suspicious", 15)] });
    expect(computeSuggestions(bed).map(s => s.id)).not.toContain("ctg-suspicious-soon");
  });

  it("does NOT fire when suspicious CTG ≥ 30 min ago (alert window)", () => {
    const bed = base({ ctgLog: [ctgAt("suspicious", 35)] });
    expect(computeSuggestions(bed).map(s => s.id)).not.toContain("ctg-suspicious-soon");
  });

  it("does NOT fire when last CTG is normal", () => {
    const bed = base({ ctgLog: [ctgAt("normal", 25)] });
    expect(computeSuggestions(bed).map(s => s.id)).not.toContain("ctg-suspicious-soon");
  });

  it("has priority 1 (highest)", () => {
    const bed = base({ ctgLog: [ctgAt("suspicious", 25)] });
    const sugg = computeSuggestions(bed).find(s => s.id === "ctg-suspicious-soon");
    expect(sugg?.priority).toBe(1);
  });

  it("has snoozeMinutes 0 (no snooze allowed)", () => {
    const bed = base({ ctgLog: [ctgAt("suspicious", 25)] });
    const sugg = computeSuggestions(bed).find(s => s.id === "ctg-suspicious-soon");
    expect(sugg?.snoozeMinutes).toBe(0);
  });
});

// ─── Rule 5: vbac-oxytocin ──────────────────────────────────────────────────

describe("vbac-oxytocin", () => {
  it("fires when VBAC flag and oxytocin running", () => {
    const bed = base({ riskFlags: ["VBAC"], oxytocinLog: [oxyEntry()] });
    expect(computeSuggestions(bed).map(s => s.id)).toContain("vbac-oxytocin");
  });

  it("fires when Previous LSCS flag and oxytocin running", () => {
    const bed = base({ riskFlags: ["Previous LSCS"], oxytocinLog: [oxyEntry()] });
    expect(computeSuggestions(bed).map(s => s.id)).toContain("vbac-oxytocin");
  });

  it("does NOT fire when VBAC but no oxytocin", () => {
    const bed = base({ riskFlags: ["VBAC"], oxytocinLog: [] });
    expect(computeSuggestions(bed).map(s => s.id)).not.toContain("vbac-oxytocin");
  });

  it("does NOT fire when oxytocin but no VBAC/LSCS flag", () => {
    const bed = base({ riskFlags: ["GBS+"], oxytocinLog: [oxyEntry()] });
    expect(computeSuggestions(bed).map(s => s.id)).not.toContain("vbac-oxytocin");
  });

  it("has priority 1", () => {
    const bed = base({ riskFlags: ["VBAC"], oxytocinLog: [oxyEntry()] });
    const sugg = computeSuggestions(bed).find(s => s.id === "vbac-oxytocin");
    expect(sugg?.priority).toBe(1);
  });
});

// ─── Rule 6: epidural-topup ──────────────────────────────────────────────────

describe("epidural-topup", () => {
  it("fires when active 2nd stage < 20 min with epidural", () => {
    const bed = base({
      labourStage: "Active second stage",
      analgesia: "Epidural",
      pushingStartTime: new Date(Date.now() - 10 * MIN).toISOString(),
    });
    expect(computeSuggestions(bed).map(s => s.id)).toContain("epidural-topup");
  });

  it("fires for Remifentanil PCA as well", () => {
    const bed = base({
      labourStage: "Active second stage",
      analgesia: "Remifentanil PCA",
      pushingStartTime: new Date(Date.now() - 5 * MIN).toISOString(),
    });
    expect(computeSuggestions(bed).map(s => s.id)).toContain("epidural-topup");
  });

  it("does NOT fire when pushing > 20 min", () => {
    const bed = base({
      labourStage: "Active second stage",
      analgesia: "Epidural",
      pushingStartTime: new Date(Date.now() - 25 * MIN).toISOString(),
    });
    expect(computeSuggestions(bed).map(s => s.id)).not.toContain("epidural-topup");
  });

  it("does NOT fire without epidural/remifentanil", () => {
    const bed = base({
      labourStage: "Active second stage",
      analgesia: "Entonox",
      pushingStartTime: new Date(Date.now() - 5 * MIN).toISOString(),
    });
    expect(computeSuggestions(bed).map(s => s.id)).not.toContain("epidural-topup");
  });

  it("does NOT fire when not in active second stage", () => {
    const bed = base({
      labourStage: "Passive second stage",
      analgesia: "Epidural",
      pushingStartTime: new Date(Date.now() - 5 * MIN).toISOString(),
    });
    expect(computeSuggestions(bed).map(s => s.id)).not.toContain("epidural-topup");
  });
});

// ─── Rule 7: passive-push-time ──────────────────────────────────────────────

describe("passive-push-time", () => {
  it("fires for nullip (Para 0) after 60 min passive", () => {
    const bed = base({
      labourStage: "Passive second stage",
      parity: "Para 0",
      passiveStartTime: new Date(Date.now() - 70 * MIN).toISOString(),
    });
    expect(computeSuggestions(bed).map(s => s.id)).toContain("passive-push-time");
  });

  it("fires for multip (Para 1) after 30 min passive", () => {
    const bed = base({
      labourStage: "Passive second stage",
      parity: "Para 1",
      passiveStartTime: new Date(Date.now() - 40 * MIN).toISOString(),
    });
    expect(computeSuggestions(bed).map(s => s.id)).toContain("passive-push-time");
  });

  it("does NOT fire for nullip before 60 min passive", () => {
    const bed = base({
      labourStage: "Passive second stage",
      parity: "Para 0",
      passiveStartTime: new Date(Date.now() - 45 * MIN).toISOString(),
    });
    expect(computeSuggestions(bed).map(s => s.id)).not.toContain("passive-push-time");
  });

  it("does NOT fire for multip before 30 min passive", () => {
    const bed = base({
      labourStage: "Passive second stage",
      parity: "Para 1",
      passiveStartTime: new Date(Date.now() - 20 * MIN).toISOString(),
    });
    expect(computeSuggestions(bed).map(s => s.id)).not.toContain("passive-push-time");
  });

  it("does NOT fire for nullip past alert edge (≥ 105 min)", () => {
    // alertEdge for nullip = 2h - 15min = 105 min
    const bed = base({
      labourStage: "Passive second stage",
      parity: "Para 0",
      passiveStartTime: new Date(Date.now() - 110 * MIN).toISOString(),
    });
    expect(computeSuggestions(bed).map(s => s.id)).not.toContain("passive-push-time");
  });

  it("does NOT fire for multip past alert edge (≥ 45 min)", () => {
    // alertEdge for multip = 1h - 15min = 45 min
    const bed = base({
      labourStage: "Passive second stage",
      parity: "Para 1",
      passiveStartTime: new Date(Date.now() - 50 * MIN).toISOString(),
    });
    expect(computeSuggestions(bed).map(s => s.id)).not.toContain("passive-push-time");
  });

  it("does NOT fire when not in passive second stage", () => {
    const bed = base({
      labourStage: "Active second stage",
      parity: "Para 0",
      passiveStartTime: new Date(Date.now() - 70 * MIN).toISOString(),
    });
    expect(computeSuggestions(bed).map(s => s.id)).not.toContain("passive-push-time");
  });
});

// ─── Rule 8: iol-latent-progress ────────────────────────────────────────────

describe("iol-latent-progress", () => {
  it("fires when induced, latent, > 6 h since admission", () => {
    const bed = base({
      modeOfOnset: "Induced",
      labourStage: "Latent",
      admissionTime: new Date(Date.now() - 7 * HOUR).toISOString(),
    });
    expect(computeSuggestions(bed).map(s => s.id)).toContain("iol-latent-progress");
  });

  it("fires at exactly 6 h (boundary inclusive)", () => {
    const bed = base({
      modeOfOnset: "Induced",
      labourStage: "Latent",
      admissionTime: new Date(Date.now() - 6 * HOUR).toISOString(),
    });
    expect(computeSuggestions(bed).map(s => s.id)).toContain("iol-latent-progress");
  });

  it("does NOT fire when < 6 h since admission", () => {
    const bed = base({
      modeOfOnset: "Induced",
      labourStage: "Latent",
      admissionTime: new Date(Date.now() - 4 * HOUR).toISOString(),
    });
    expect(computeSuggestions(bed).map(s => s.id)).not.toContain("iol-latent-progress");
  });

  it("does NOT fire when spontaneous onset", () => {
    const bed = base({
      modeOfOnset: "Spontaneous",
      labourStage: "Latent",
      admissionTime: new Date(Date.now() - 7 * HOUR).toISOString(),
    });
    expect(computeSuggestions(bed).map(s => s.id)).not.toContain("iol-latent-progress");
  });

  it("does NOT fire when not latent stage", () => {
    const bed = base({
      modeOfOnset: "Induced",
      labourStage: "Active first stage",
      admissionTime: new Date(Date.now() - 7 * HOUR).toISOString(),
    });
    expect(computeSuggestions(bed).map(s => s.id)).not.toContain("iol-latent-progress");
  });

  it("does NOT fire without admissionTime", () => {
    const bed = base({ modeOfOnset: "Induced", labourStage: "Latent", admissionTime: null });
    expect(computeSuggestions(bed).map(s => s.id)).not.toContain("iol-latent-progress");
  });
});

// ─── Ordering ────────────────────────────────────────────────────────────────

describe("computeSuggestions — ordering", () => {
  it("sorts priority 1 before priority 2", () => {
    const bed = base({
      riskFlags: ["VBAC"],
      oxytocinLog: [oxyEntry()],
      ves: [veAt(5, 170)],
    });
    const suggestions = computeSuggestions(bed);
    const priorities = suggestions.map(s => s.priority);
    for (let i = 1; i < priorities.length; i++) {
      expect(priorities[i]).toBeGreaterThanOrEqual(priorities[i - 1]);
    }
  });

  it("returns only priority-1 suggestions when all are priority 1", () => {
    const bed = base({ riskFlags: ["VBAC"], oxytocinLog: [oxyEntry()] });
    const suggestions = computeSuggestions(bed);
    const vbacSugg = suggestions.find(s => s.id === "vbac-oxytocin");
    expect(vbacSugg?.priority).toBe(1);
  });
});
