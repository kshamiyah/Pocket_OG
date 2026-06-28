import { describe, it, expect } from "vitest";
import {
  effectiveUterotonicDelaySec,
  effectiveCarboRepeatDelaySec,
  scaleDelayByBleedRate,
  UTEROTONIC_PHARM_DELAY_SEC,
  CARBO_REPEAT_BASE_SEC,
} from "./pph-shared.js";

describe("rate-scaled uterotonic delays", () => {
  it("keeps full delay when bleeding settled", () => {
    expect(effectiveUterotonicDelaySec("oxytocin_inf", 0)).toBe(UTEROTONIC_PHARM_DELAY_SEC.oxytocin_inf);
    expect(effectiveUterotonicDelaySec("oxytocin_bolus", 0.5)).toBe(180);
  });

  it("shortens delay at moderate bleed rate (75%)", () => {
    expect(effectiveUterotonicDelaySec("oxytocin_inf", 5)).toBe(225); // 300 * 0.75
  });

  it("shortens delay at brisk bleed rate (50%)", () => {
    expect(effectiveUterotonicDelaySec("oxytocin_inf", 30)).toBe(150); // 300 * 0.5
    expect(effectiveUterotonicDelaySec("oxytocin_bolus", 25)).toBe(90); // 180 * 0.5
  });

  it("uses 60s floor at catastrophic bleed rate", () => {
    expect(effectiveUterotonicDelaySec("oxytocin_inf", 80)).toBe(60);
    expect(effectiveUterotonicDelaySec("ergometrine", 120)).toBe(60);
  });

  it("scales carboprost repeat with 5 min floor", () => {
    expect(effectiveCarboRepeatDelaySec(0)).toBe(CARBO_REPEAT_BASE_SEC);
    expect(effectiveCarboRepeatDelaySec(30)).toBe(450); // 15 min * 0.5
    expect(effectiveCarboRepeatDelaySec(100)).toBe(300); // 5 min floor
  });

  it("scenario: infusion at brisk rate → ergometrine eligible ~2.5 min not 5", () => {
    const delay = effectiveUterotonicDelaySec("oxytocin_inf", 35);
    expect(delay).toBe(150);
    expect(delay).toBeLessThan(UTEROTONIC_PHARM_DELAY_SEC.oxytocin_inf);
  });
});

describe("scaleDelayByBleedRate", () => {
  it("respects custom floor", () => {
    expect(scaleDelayByBleedRate(900, 60, 300)).toBe(300);
  });
});
