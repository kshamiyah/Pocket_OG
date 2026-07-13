_Findings from an agent vision pass over new-baseline and structurally-flagged screenshots. Severity: visual-only unless noted._

### V1 · Bed board over-fragments non-standard bed labels — `ward-board` · 375/414 · LOW

- **Flow / state:** By-ward → Walk → open a ward whose beds were created as a numbered range with a **text prefix that contains a space** (fixture: "Delivery Suite", prefix `Room `, giving `Room 1`…`Room 6`).
- **Expected:** The ward's beds group under one section (as `Bay A`, `SR`, and plain-numbered beds do).
- **Observed:** Every bed renders under its own separate **"OTHER"** section header, one bed per section — a long ladder of identical "OTHER" labels.
- **Root cause (for review, not auto-fixed):** `parseBedLabel` in `src/utils/wardLayouts.js` only recognises `A1` / `1A` / `SR1` / `12` shapes; anything else (e.g. a label with a space) falls to `kind: "other"` with `key: other-${bed}`, which is unique per bed, so `groupBedsBySection` starts a new section for each. Any prefix like `Room `, `LDR `, `Bed ` triggers it.
- **Note:** This is induced by the test fixture's choice of a spaced prefix, but it reflects real grouping logic a user can hit. Plain numeric ranges and `SR`-style prefixes group correctly. Flagged for maintainer decision rather than fixed.

### Gesture audit (full interaction pass) — nothing broken

Every gesture flow was driven end-to-end and its result screenshotted and eyeballed at 375 px:

- **Swipe-to-delete + undo:** left-swipe on a job card reveals the red Delete action; deleting drops the job and shows a "Deleted · Undo" toast; Undo restores the exact job. Clean.
- **Mark done + undo:** tapping the check marks the job done (strikethrough); Undo reverts it.
- **Inline edit:** tap-to-edit opens the card; text edit, priority toggle (Routine/Urgent), and a **custom reminder (14:45 via Hour/Min)** all render correctly and persist across reload.
- **Reminder presets:** +30m/+1h/+2h and Clear behave; the picker and Snooze +15m row lay out cleanly.
- **Take over (paste → decode → review → merge):** pasting a handover link (camera-denied fallback) decodes to the review screen with all clinical text intact; unchecking one job and merging adds exactly the chosen jobs with ward/bed/priority preserved, and the unchecked one is correctly excluded.
- **Handover subset + copy link:** selecting a subset and copying the link produces a payload containing exactly those jobs (verified by decoding the clipboard).
- **Ward setup:** adding a numbered range + lettered bays renders the bed-pill grid cleanly (22 beds), remove-section works, and the layout saves and persists.
- **Bed section collapse/expand:** Bay sections collapse/expand and keep their open-job counts; grid labels (A1/B1/SR1) group correctly into Bay A/B/Side rooms (the contrast that confirms V1 above is specifically the spaced-prefix case).
- **Notification → task:** tapping a due task closes the centre and opens that job in edit mode in All jobs.

No overlap, clipping, or layout breakage surfaced in any interaction state, light or dark. The floating FAB sits over scrolling content by design (expected, not flagged).

### General observations (nothing broken)

- Onboarding, hub, shift picker, wards intro, job list (walk/all/expand), bed drill-in, handover (+ options, + ward filter), notifications, add-job sheet, menu, ward setup, end-shift and scan all render cleanly at 375 and 414 px, light and dark.
- Dark mode is consistent across every state captured; contrast looks fine.
- The offline pass renders pixel-identical to online for the states tested (service-worker precache is serving the built assets), supporting the offline-first claim.
- Long job text truncates with an ellipsis as intended (single line), no unintended clipping.
