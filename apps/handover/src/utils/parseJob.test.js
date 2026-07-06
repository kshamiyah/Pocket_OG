import { describe, expect, it } from "vitest";
import { parseJobInput } from "./parseJob";

describe("parseJobInput", () => {
  it("parses ward/bed/task slash form", () => {
    expect(parseJobInput("LR4/12 review CTG", {})).toEqual({
      ward: "LR4",
      bed: "12",
      text: "review CTG",
    });
  });

  it("parses bed then task with sticky ward", () => {
    expect(parseJobInput("12 CTG review", { stickyWard: "LDR" })).toEqual({
      ward: "LDR",
      bed: "12",
      text: "CTG review",
    });
  });

  it("parses colon ward with sticky bed", () => {
    expect(parseJobInput("Antenatal: glucose check", { stickyBed: "3" })).toEqual({
      ward: "Antenatal",
      bed: "3",
      text: "glucose check",
    });
  });

  it("returns null for blank input", () => {
    expect(parseJobInput("   ", { stickyWard: "LR4" })).toBeNull();
  });
});
