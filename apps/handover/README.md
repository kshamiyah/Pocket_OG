# Handover — shift job list

A mobile-first PWA for capturing ward jobs during a shift and handing them over via QR or shareable link. No server, no patient identifiers stored on device beyond ward and bed labels you enter yourself.

Standalone app in the monorepo (not linked from Pocket O&G). Deployed on Vercel as its own project.

## Features

### Portfolios
- Multiple local profiles per device (e.g. shared ward phone)
- Each portfolio keeps its own job list, wards, layouts and preferences

### Job capture
- **Round mode:** ward → bed → task (three taps when layout is set up)
- **Quick mode:** shorthand text (`12 CTG`, `LR4/12 bloods`)
- Per-ward bed layout setup (numbered range, named rooms/bays, or no beds)
- Task chips learned per ward from use
- Sticky urgent flag

### Handover
- Open jobs encoded into a QR code and `?ho=` link (payload v2 includes bed numbers)
- Task text auto-stripped of names and identifiers before encode
- Receive via camera scan or pasted link, with review-before-merge

## Local development

```bash
npm install
npm run dev -w apps/handover    # http://localhost:5173
npm run build -w apps/handover
npm run lint -w apps/handover
```

Unit tests (parse/strip helpers):

```bash
npx vitest run apps/handover/src/utils/*.test.js
```

## Deploy (Vercel)

| Setting | Value |
|---------|--------|
| Root Directory | `apps/handover` |
| Install Command | `cd ../.. && npm install` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

Separate Vercel project from Pocket O&G and Ward Manager.

## Data storage

All data in `localStorage` on the device (`handover_portfolios_v2`). No network requests during normal use. Handover links are self-contained in the URL/QR payload.

## Tech stack

Vite · React 19 · Tailwind CSS · vite-plugin-pwa · jsQR · qrcode

## Important

Job text is a memory aid for the clinical team on shift, not a patient record. Do not enter names, initials or other identifiers. QR payloads can be forwarded; keep task wording generic. This tool does not replace verbal handover or clinical responsibility.
