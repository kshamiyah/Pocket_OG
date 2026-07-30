# Handover: early-access landing page — build brief

A self-contained brief for building the waitlist / early-access landing page for
the **Handover** app. You should be able to implement this without further context.

---

## Goal

Handover is a native iOS app (currently in TestFlight beta) that is a shift job
list for hospital ward staff: capture jobs by ward and bed, walk the ward bed by
bed, then hand the list to the next shift via a QR code or link. It stores
everything on-device, no server, no accounts.

Build a single, mobile-first landing page whose only job is to convert a curious
doctor into a captured email for **invite-only beta access**. The launch is
deliberately exclusive: testers are invited in **small weekly waves** via
TestFlight. Keep the scarcity **honest** (no fake "3 spots left" live counters,
this is a clinician's professional brand).

---

## Where it lives / hosting

- Build it as a **standalone static page** in the existing handover project:
  `public/early-access.html`.
- It deploys with the handover Vercel project and will be served at
  `/early-access.html` (and can be routed to `/early-access`).
- It will be fronted by a custom subdomain: **`handover.drshamiyah.com`**
  (added as a domain on the Vercel project, CNAME pointed at Vercel). DNS wiring
  is handled separately, not part of this build.
- Do **not** modify the app itself or its root route. This is an additional
  standalone page only.

## Tech approach

- Plain, self-contained HTML + inline CSS, no framework, no external requests.
- **Use `public/privacy.html` as the canonical style template** so
  the page feels like the same product. Match its structure, CSS variables, and
  light/dark handling.
- Fully responsive, mobile-first (the audience is on phones). No horizontal
  scroll. Images `max-width: 100%`.

## Brand / design system

- Background pink `#fbe9e7`; primary accent orange `#f4511e`. Dark mode:
  background `#030712`, accent `#fb7a4e` (mirror the variables in `privacy.html`,
  which already implements `prefers-color-scheme`).
- Font: match `privacy.html` (system font stack is fine). Optionally load the
  app's Geist font to match exactly, but do not add an external font request;
  self-host if used.
- The app mark (two exchange arrows) as inline SVG:

```html
<svg viewBox="0 0 64 64" aria-hidden="true">
  <rect width="64" height="64" rx="16" fill="#fbe9e7"/>
  <g fill="none" stroke="#f4511e" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" transform="translate(16.4 16.4) scale(1.3)">
    <path d="M7 7h10l-3-3" />
    <path d="M17 17H7l3 3" />
  </g>
</svg>
```

## Page structure and copy

Top to bottom (all copy is final unless marked):

1. **Hero**
   - The arrow mark + wordmark "Handover".
   - Tagline: **From takeover to handover.**
   - One line: **The shift job list that hands over with a single scan.**
   - One iPhone screenshot beside/under the text (see Assets).

2. **What it is (three short points)**
   - Capture jobs by ward and bed as you go.
   - Walk the ward bed by bed with a clear board.
   - Hand over to the next shift with one QR scan.

3. **Exclusivity line**
   - **Invite-only beta for UK ward doctors. New testers are invited in small
     waves each week.**

4. **The signup form** (the primary call to action, see next section)
   - Heading: **Request early access.**

5. **Trust / safety line** (small, below the form)
   - **Non-identifying data only. A decision-support tool, not a patient record.**

6. **Footer**
   - "Built by Dr Khalid Shamiyah" linking to https://drshamiyah.com/
   - Link to the privacy policy: `/privacy.html`.

## The signup form

- Fields:
  - **Email** (required, type=email)
  - **Role** (required, select): FY1/FY2, IMT/CT, Registrar, Consultant, Nurse,
    Midwife, Other
  - **Hospital / trust** (required, text)
- Single submit button: **Request early access.**
- **Backend: TBD by Khalid.** Implement whichever is chosen:
  - **Formspree** (the app already uses this pattern): POST the fields to the
    Formspree endpoint; on success show the confirmation state. Read the endpoint
    from a placeholder constant clearly marked `TODO: set Formspree endpoint`.
  - **Tally**: embed the Tally form instead of a custom form, styled to match.
- On success, replace the form with a confirmation:
  **"You're on the list. We invite new testers in small weekly waves, look out
  for a TestFlight email."**
- Handle errors gracefully with an inline message; never lose the user's input.
- No third-party analytics or trackers.

## Exclusivity / scarcity rules

- Keep it honest: describe real weekly waves. Do **not** implement a fake live
  "spots remaining" counter.
- A static line like "Limited places each week" is fine.

## Out of scope for v1

- **Referral / "skip the queue" mechanic.** This needs a real backend to track
  queue positions and referral counts. Plan it as v2; do not build it now.

## Assets required (from Khalid)

- **1 to 3 iPhone screenshots** of the app for the hero (ideally the bed board,
  a job list, and the handover QR screen). Until supplied, use placeholder image
  boxes at phone aspect ratio (approx 9:19.5).

## Deployment notes

- The page goes live only once it is on the branch the handover Vercel project
  deploys to **production** (confirm which branch with Khalid before merging).
- The `handover.drshamiyah.com` subdomain is added in Vercel project settings +
  a CNAME DNS record; handled separately.

## Acceptance criteria

- Single self-contained `early-access.html`, no external network requests.
- Visually consistent with `privacy.html` and the app (pink/orange, mark, dark
  mode working in both directions).
- Fully responsive, no horizontal scroll on a 360px-wide phone.
- Working form with the three fields, a success state, and graceful errors.
- Trust/safety line and privacy-policy link present.
- No fake scarcity, no analytics, no referral mechanic.

## Open decisions still needed from Khalid

1. **Form backend:** Tally or Formspree (+ the endpoint / embed link).
2. **Audience scope:** copy currently says "UK ward doctors" broadly; narrow to a
   trust or specialty if desired.
3. **Screenshots** for the hero.
