import { describe, expect, it } from "vitest";
import { stripHandover } from "./stripHandover";

describe("stripHandover", () => {
  it("removes titles and names", () => {
    expect(stripHandover("CTG review for Mrs Smith")).toBe("CTG review");
  });

  it("removes redundant bed prefix when bed is known", () => {
    expect(stripHandover("12 CTG review", { bed: "12" })).toBe("CTG review");
  });

  it("removes NHS numbers", () => {
    expect(stripHandover("Chase bloods 943 476 2871")).toBe("Chase bloods");
  });

  it("falls back to original if stripping would leave nothing", () => {
    expect(stripHandover("Mrs Smith")).toBe("Mrs Smith");
  });
});
