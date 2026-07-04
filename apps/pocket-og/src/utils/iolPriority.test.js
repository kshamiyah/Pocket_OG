import { describe, it, expect } from "vitest";
import { iolEntryTier, sortIOLQueue, isSromEscalated, SROM_KEY } from "./iolPriority";

const p = (o) => ({ id: "x", gestWeeks: 39, gestDays: 0, indications: [], daysWaiting: 0, sromHours: null, ...o });

describe("iolEntryTier — multi-indication takes the most urgent", () => {
  it("no indications → Routine (3)", () => expect(iolEntryTier(p({ indications: [] }))).toBe(3));
  it("severe PET → Urgent (0)", () => expect(iolEntryTier(p({ indications: ["severe-pet"] }))).toBe(0));
  it("GDM → Moderate (2)", () => expect(iolEntryTier(p({ indications: ["gdm"] }))).toBe(2));
  it("SROM + PET + GDM → ranked by PET (High, 1)", () =>
    expect(iolEntryTier(p({ indications: [SROM_KEY, "pet", "gdm"], sromHours: 5 }))).toBe(1));
  it("SROM + severe PET → Urgent (0)", () =>
    expect(iolEntryTier(p({ indications: [SROM_KEY, "severe-pet"], sromHours: 40 }))).toBe(0));
});

describe("SROM hours escalation", () => {
  it("term PROM <24h → Moderate (2)", () => expect(iolEntryTier(p({ indications: [SROM_KEY], sromHours: 10 }))).toBe(2));
  it("term PROM ≥24h → High (1)", () => expect(iolEntryTier(p({ indications: [SROM_KEY], sromHours: 26 }))).toBe(1));
  it("exactly 24h escalates", () => expect(isSromEscalated(p({ indications: [SROM_KEY], sromHours: 24 }))).toBe(true));
  it("no hours given → not escalated (Moderate)", () => expect(iolEntryTier(p({ indications: [SROM_KEY], sromHours: null }))).toBe(2));
});

describe("sortIOLQueue", () => {
  it("tier beats gestation", () => {
    const q = [
      p({ id: "routine42", gestWeeks: 42, indications: ["social"] }),
      p({ id: "urgent37", gestWeeks: 37, indications: ["severe-pet"] }),
    ];
    expect(sortIOLQueue(q)[0].id).toBe("urgent37");
  });
  it("two SROM patients ordered by hours since rupture (longer first)", () => {
    const q = [
      p({ id: "srom10", gestWeeks: 39, indications: [SROM_KEY], sromHours: 10 }),
      p({ id: "srom30", gestWeeks: 38, indications: [SROM_KEY], sromHours: 30 }),
    ];
    // srom30 is ≥24h (High) so it also out-tiers srom10 (Moderate)
    expect(sortIOLQueue(q).map(x => x.id)).toEqual(["srom30", "srom10"]);
  });
  it("two SROM patients both <24h → longer rupture first despite lower gestation", () => {
    const q = [
      p({ id: "g41h5", gestWeeks: 41, indications: [SROM_KEY], sromHours: 5 }),
      p({ id: "g38h20", gestWeeks: 38, indications: [SROM_KEY], sromHours: 20 }),
    ];
    expect(sortIOLQueue(q).map(x => x.id)).toEqual(["g38h20", "g41h5"]);
  });
});
