import { describe, it, expect } from "vitest";
import { iolEntryTier, sortIOLQueue, isSromEscalated, isValidEntry, governingIndication, SROM_KEY } from "./iolPriority";

const p = (o) => ({ id: "x", gestWeeks: 39, gestDays: 0, indications: [], daysWaiting: 0, sromHours: null, ...o });

describe("iolEntryTier — multi-indication takes the most urgent", () => {
  it("no indications, <41wks → Routine (3)", () => expect(iolEntryTier(p({ indications: [] }))).toBe(3));
  it("severe PET → Urgent (0)", () => expect(iolEntryTier(p({ indications: ["severe-pet"] }))).toBe(0));
  it("GDM → Moderate (2)", () => expect(iolEntryTier(p({ indications: ["gdm"] }))).toBe(2));
  it("SROM + PET + GDM → ranked by PET (High, 1)", () =>
    expect(iolEntryTier(p({ indications: [SROM_KEY, "pet", "gdm"], sromHours: 5 }))).toBe(1));
});

describe("SROM hours escalation", () => {
  it("term PROM <24h → Moderate (2)", () => expect(iolEntryTier(p({ indications: [SROM_KEY], sromHours: 10 }))).toBe(2));
  it("term PROM ≥24h → High (1)", () => expect(iolEntryTier(p({ indications: [SROM_KEY], sromHours: 26 }))).toBe(1));
  it("exactly 24h escalates", () => expect(isSromEscalated(p({ indications: [SROM_KEY], sromHours: 24 }))).toBe(true));
});

describe("post-dates derived from gestation", () => {
  it("40+0, no indication → Routine (3), not valid", () => {
    expect(iolEntryTier(p({ gestWeeks: 40, gestDays: 0 }))).toBe(3);
    expect(isValidEntry(p({ gestWeeks: 40, gestDays: 0 }))).toBe(false);
  });
  it("41+3, no indication → Moderate (2) via auto post-dates, valid", () => {
    const e = p({ gestWeeks: 41, gestDays: 3 });
    expect(iolEntryTier(e)).toBe(2);
    expect(isValidEntry(e)).toBe(true);
    expect(governingIndication(e).label).toBe("Post-dates 41+3");
  });
  it("42+0, no indication → High (1) via auto post-dates", () => {
    expect(iolEntryTier(p({ gestWeeks: 42, gestDays: 0 }))).toBe(1);
    expect(governingIndication(p({ gestWeeks: 42, gestDays: 0 })).label).toBe("Post-dates 42+0");
  });
  it("42+0 + GDM → still High (post-dates beats GDM)", () => {
    expect(iolEntryTier(p({ gestWeeks: 42, gestDays: 0, indications: ["gdm"] }))).toBe(1);
  });
  it("41+0 + severe PET → Urgent (PET beats post-dates)", () => {
    expect(iolEntryTier(p({ gestWeeks: 41, gestDays: 0, indications: ["severe-pet"] }))).toBe(0);
  });
});

describe("sortIOLQueue", () => {
  it("tier beats gestation", () => {
    const q = [
      p({ id: "routine38", gestWeeks: 38, indications: ["social"] }),
      p({ id: "urgent37", gestWeeks: 37, indications: ["severe-pet"] }),
    ];
    expect(sortIOLQueue(q)[0].id).toBe("urgent37");
  });
  it("42+0 (auto High) ranks above 41+2 (auto Moderate)", () => {
    const q = [
      p({ id: "pd41", gestWeeks: 41, gestDays: 2 }),
      p({ id: "pd42", gestWeeks: 42, gestDays: 0 }),
    ];
    expect(sortIOLQueue(q).map(x => x.id)).toEqual(["pd42", "pd41"]);
  });
  it("two SROM patients both <24h → longer rupture first", () => {
    const q = [
      p({ id: "g41h5", gestWeeks: 41, gestDays: 0, indications: [SROM_KEY], sromHours: 5 }),
      p({ id: "g38h20", gestWeeks: 38, gestDays: 0, indications: [SROM_KEY], sromHours: 20 }),
    ];
    // both High (41+0 auto post-dates makes g41h5 High too); both SROM → hours first
    expect(sortIOLQueue(q).map(x => x.id)).toEqual(["g38h20", "g41h5"]);
  });
});
