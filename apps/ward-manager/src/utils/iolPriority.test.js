import { describe, it, expect } from "vitest";
import { IOL_IND, iolEntryTier, sortIOLQueue } from "./iolPriority";

// ─── helpers ─────────────────────────────────────────────────────────────

const entry = (overrides) => ({
  id: "test",
  initials: "AB",
  gestWeeks: 40,
  gestDays: 0,
  indications: [],
  addedAt: new Date("2026-01-01T08:00:00Z").toISOString(),
  ...overrides,
});

const hoursAgo = (h) => new Date(Date.now() - h * 3600000).toISOString();

// ─── iolEntryTier ────────────────────────────────────────────────────────

describe("iolEntryTier", () => {
  describe("no indications → Routine (3)", () => {
    it("returns 3 for empty indications array", () => {
      expect(iolEntryTier(entry({ indications: [] }))).toBe(3);
    });

    it("returns 3 when indications is undefined", () => {
      expect(iolEntryTier({ gestWeeks: 40 })).toBe(3);
    });
  });

  describe("unknown indication → treated as Routine", () => {
    it("returns 3 for unrecognised indication", () => {
      expect(iolEntryTier(entry({ indications: ["Something unknown"] }))).toBe(3);
    });

    it("known Urgent + unknown → still Urgent (0)", () => {
      expect(iolEntryTier(entry({ indications: ["Severe pre-eclampsia", "Unknown indication"] }))).toBe(0);
    });
  });

  describe("Urgent tier (0)", () => {
    it("Severe pre-eclampsia → 0", () => {
      expect(iolEntryTier(entry({ indications: ["Severe pre-eclampsia"] }))).toBe(0);
    });

    it("PPROM + chorioamnionitis → 0", () => {
      expect(iolEntryTier(entry({ indications: ["PPROM + chorioamnionitis"] }))).toBe(0);
    });

    it("FGR — absent/reversed EDF → 0", () => {
      expect(iolEntryTier(entry({ indications: ["FGR — absent/reversed EDF"] }))).toBe(0);
    });
  });

  describe("High tier (1)", () => {
    it("Pre-eclampsia → 1", () => {
      expect(iolEntryTier(entry({ indications: ["Pre-eclampsia"] }))).toBe(1);
    });

    it("PROM at term >24h → 1", () => {
      expect(iolEntryTier(entry({ indications: ["PROM at term >24h"] }))).toBe(1);
    });

    it("Post-dates 42+0 → 1", () => {
      expect(iolEntryTier(entry({ indications: ["Post-dates 42+0"] }))).toBe(1);
    });

    it("RFM + concerns → 1", () => {
      expect(iolEntryTier(entry({ indications: ["RFM + concerns"] }))).toBe(1);
    });
  });

  describe("Moderate tier (2)", () => {
    it("Post-dates 41+ → 2", () => {
      expect(iolEntryTier(entry({ indications: ["Post-dates 41+"] }))).toBe(2);
    });

    it("GDM → 2", () => {
      expect(iolEntryTier(entry({ indications: ["GDM"] }))).toBe(2);
    });

    it("ICP → 2", () => {
      expect(iolEntryTier(entry({ indications: ["ICP"] }))).toBe(2);
    });

    it("Previous stillbirth → 2", () => {
      expect(iolEntryTier(entry({ indications: ["Previous stillbirth"] }))).toBe(2);
    });

    it("SGA / FGR (stable) → 2", () => {
      expect(iolEntryTier(entry({ indications: ["SGA / FGR (stable)"] }))).toBe(2);
    });
  });

  describe("Routine tier (3)", () => {
    it("Maternal request → 3", () => {
      expect(iolEntryTier(entry({ indications: ["Maternal request"] }))).toBe(3);
    });

    it("Social → 3", () => {
      expect(iolEntryTier(entry({ indications: ["Social"] }))).toBe(3);
    });
  });

  describe("multi-indication — takes highest priority (lowest tier number)", () => {
    it("Urgent + Moderate → 0", () => {
      expect(iolEntryTier(entry({ indications: ["Severe pre-eclampsia", "GDM"] }))).toBe(0);
    });

    it("High + Routine → 1", () => {
      expect(iolEntryTier(entry({ indications: ["Post-dates 42+0", "Maternal request"] }))).toBe(1);
    });

    it("Moderate + Moderate → 2", () => {
      expect(iolEntryTier(entry({ indications: ["GDM", "ICP"] }))).toBe(2);
    });

    it("Routine + Routine → 3", () => {
      expect(iolEntryTier(entry({ indications: ["Maternal request", "Social"] }))).toBe(3);
    });
  });
});

// ─── sortIOLQueue ────────────────────────────────────────────────────────

describe("sortIOLQueue", () => {
  it("returns empty array for empty input", () => {
    expect(sortIOLQueue([])).toEqual([]);
  });

  it("returns single-entry array unchanged in content", () => {
    const q = [entry({ indications: ["GDM"] })];
    expect(sortIOLQueue(q)).toHaveLength(1);
  });

  it("does not mutate the original array", () => {
    const q = [
      entry({ id: "a", indications: ["GDM"] }),
      entry({ id: "b", indications: ["Severe pre-eclampsia"] }),
    ];
    const original = [...q];
    sortIOLQueue(q);
    expect(q[0].id).toBe(original[0].id);
    expect(q[1].id).toBe(original[1].id);
  });

  describe("tier ordering — higher priority always comes first", () => {
    it("Urgent before High", () => {
      const q = [
        entry({ id: "high", indications: ["Post-dates 42+0"] }),
        entry({ id: "urgent", indications: ["Severe pre-eclampsia"] }),
      ];
      const sorted = sortIOLQueue(q);
      expect(sorted[0].id).toBe("urgent");
      expect(sorted[1].id).toBe("high");
    });

    it("Urgent before Moderate before Routine", () => {
      const q = [
        entry({ id: "routine", indications: ["Social"] }),
        entry({ id: "moderate", indications: ["GDM"] }),
        entry({ id: "urgent", indications: ["PPROM + chorioamnionitis"] }),
      ];
      const sorted = sortIOLQueue(q);
      expect(sorted[0].id).toBe("urgent");
      expect(sorted[1].id).toBe("moderate");
      expect(sorted[2].id).toBe("routine");
    });

    it("Urgent 39+0 ranks above Routine 42+0 — tier beats gestation", () => {
      const q = [
        entry({ id: "routine-highgest", gestWeeks: 42, gestDays: 0, indications: ["Social"] }),
        entry({ id: "urgent-lowgest",   gestWeeks: 39, gestDays: 0, indications: ["Severe pre-eclampsia"] }),
      ];
      const sorted = sortIOLQueue(q);
      expect(sorted[0].id).toBe("urgent-lowgest");
    });
  });

  describe("tie-breaking by gestation — higher gestation first within same tier", () => {
    it("42+0 before 41+3 within High tier", () => {
      const q = [
        entry({ id: "lower", gestWeeks: 41, gestDays: 3, indications: ["Post-dates 42+0"] }),
        entry({ id: "higher", gestWeeks: 42, gestDays: 0, indications: ["Pre-eclampsia"] }),
      ];
      const sorted = sortIOLQueue(q);
      expect(sorted[0].id).toBe("higher");
    });

    it("41+6 before 41+0 within Moderate tier", () => {
      const q = [
        entry({ id: "lower", gestWeeks: 41, gestDays: 0, indications: ["GDM"] }),
        entry({ id: "higher", gestWeeks: 41, gestDays: 6, indications: ["ICP"] }),
      ];
      const sorted = sortIOLQueue(q);
      expect(sorted[0].id).toBe("higher");
    });

    it("gestDays defaulted to 0 when missing", () => {
      const q = [
        entry({ id: "with-days", gestWeeks: 41, gestDays: 1, indications: ["GDM"] }),
        entry({ id: "no-days",   gestWeeks: 41,              indications: ["ICP"] }),
      ];
      const sorted = sortIOLQueue(q);
      expect(sorted[0].id).toBe("with-days");
    });
  });

  describe("tie-breaking by wait time — longer wait first within same tier + gestation", () => {
    it("added earlier comes first", () => {
      const q = [
        entry({ id: "recent", gestWeeks: 41, gestDays: 0, indications: ["GDM"], addedAt: hoursAgo(1) }),
        entry({ id: "older",  gestWeeks: 41, gestDays: 0, indications: ["ICP"], addedAt: hoursAgo(3) }),
      ];
      const sorted = sortIOLQueue(q);
      expect(sorted[0].id).toBe("older");
    });
  });

  describe("multi-indication promotes tier for sorting", () => {
    it("GDM+Severe-PET entry ranks above pure High entry", () => {
      const q = [
        entry({ id: "high-only",  indications: ["Post-dates 42+0"] }),
        entry({ id: "urgent-mix", indications: ["GDM", "Severe pre-eclampsia"] }),
      ];
      const sorted = sortIOLQueue(q);
      expect(sorted[0].id).toBe("urgent-mix");
    });
  });

  describe("IOL_IND catalogue — all 14 indications are defined", () => {
    it("has exactly 14 indications", () => {
      expect(IOL_IND).toHaveLength(14);
    });

    it("tiers are only 0–3", () => {
      IOL_IND.forEach(ind => {
        expect(ind.tier).toBeGreaterThanOrEqual(0);
        expect(ind.tier).toBeLessThanOrEqual(3);
      });
    });

    it("all Urgent indications (tier 0) have a cite", () => {
      IOL_IND.filter(i => i.tier === 0).forEach(ind => {
        expect(ind.cite).toBeTruthy();
      });
    });
  });
});
