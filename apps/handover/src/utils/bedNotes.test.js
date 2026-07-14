import { describe, expect, it } from "vitest";
import { bedNoteKey, getBedNote, setBedNote, hasBedNote, notesForWard } from "./bedNotes";

describe("bedNotes", () => {
  it("builds a stable key for ward + bed", () => {
    expect(bedNoteKey("LDR", "12")).toBe("LDR|12");
    expect(bedNoteKey("LDR", null)).toBe("LDR|");
    expect(bedNoteKey("LDR", "")).toBe("LDR|");
  });

  it("stores and clears notes without touching other beds", () => {
    let notes = {};
    notes = setBedNote(notes, "LDR", "12", "awaiting G&S");
    notes = setBedNote(notes, "LDR", "13", "epidural");
    expect(getBedNote(notes, "LDR", "12")).toBe("awaiting G&S");
    notes = setBedNote(notes, "LDR", "12", "  ");
    expect(hasBedNote(notes, "LDR", "12")).toBe(false);
    expect(getBedNote(notes, "LDR", "13")).toBe("epidural");
  });

  it("lists beds with notes on a ward", () => {
    let notes = setBedNote({}, "LDR", "12", "a");
    notes = setBedNote(notes, "LDR", null, "general");
    notes = setBedNote(notes, "LR4", "1", "other");
    const beds = notesForWard(notes, "LDR");
    expect(beds.has("12")).toBe(true);
    expect(beds.has(null)).toBe(true);
    expect(beds.has("1")).toBe(false);
  });
});
