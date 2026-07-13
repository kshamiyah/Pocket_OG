_Findings from an agent vision pass over new-baseline and structurally-flagged screenshots. Severity: visual-only unless noted._

### V1 · Bed board over-fragments non-standard bed labels — `ward-board` · 375/414 · LOW

- **Flow / state:** By-ward → Walk → open a ward whose beds were created as a numbered range with a **text prefix that contains a space** (fixture: "Delivery Suite", prefix `Room `, giving `Room 1`…`Room 6`).
- **Expected:** The ward's beds group under one section (as `Bay A`, `SR`, and plain-numbered beds do).
- **Observed:** Every bed renders under its own separate **"OTHER"** section header, one bed per section — a long ladder of identical "OTHER" labels.
- **Root cause (for review, not auto-fixed):** `parseBedLabel` in `src/utils/wardLayouts.js` only recognises `A1` / `1A` / `SR1` / `12` shapes; anything else (e.g. a label with a space) falls to `kind: "other"` with `key: other-${bed}`, which is unique per bed, so `groupBedsBySection` starts a new section for each. Any prefix like `Room `, `LDR `, `Bed ` triggers it.
- **Note:** This is induced by the test fixture's choice of a spaced prefix, but it reflects real grouping logic a user can hit. Plain numeric ranges and `SR`-style prefixes group correctly. Flagged for maintainer decision rather than fixed.

### General observations (nothing broken)

- Onboarding, hub, shift picker, wards intro, job list (walk/all/expand), bed drill-in, handover (+ options, + ward filter), notifications, add-job sheet, menu, ward setup, end-shift and scan all render cleanly at 375 and 414 px, light and dark.
- Dark mode is consistent across every state captured; contrast looks fine.
- The offline pass renders pixel-identical to online for the states tested (service-worker precache is serving the built assets), supporting the offline-first claim.
- Long job text truncates with an ellipsis as intended (single line), no unintended clipping.
