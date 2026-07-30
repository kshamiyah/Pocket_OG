# Handover

Shift job-list app for ward handover. Capture jobs by ward and bed, hand over via QR or link. PWA + native iOS (Capacitor). No server.

## Features

- **Onboarding:** welcome, profile (name + role), optional ward setup before first shift
- **Shift flow:** home hub (take over / start shift), job list with ward drill-down and bed board
- **Ward layouts:** bays, beds, side rooms, collapsible sections
- **Jobs:** edit, timestamps, routine/urgent, swipe to delete, reminders
- **Bed notes (private):** never included in handover payload
- **Handover:** QR or link; payload v2 includes ward layouts
- **Dark mode:** manual toggle; stored in `handover_theme_v1`
- **Offline-first:** all data in `localStorage`; installable PWA

## Commands

```bash
npm install
npm run dev          # dev server
npm run build        # production build
npm run lint         # ESLint
npm run preview      # preview dist (port 4173)
```

### iOS (Capacitor)

```bash
npm run cap:sync     # build web app + sync to ios/
npm run cap:open     # open Xcode
```

See [ios-setup.md](./ios-setup.md) for TestFlight and associated domains.

### Landing page / waitlist

Static page at [`public/early-access.html`](./public/early-access.html). Deployed at `/early-access` (see `vercel.json`). Formspree endpoint is configured in that file.

Regenerate carousel screenshots:

```bash
npm run build
cd test-corpus && node landing-screenshots.mjs
```

## Deploy (Vercel)

- **Root directory:** repository root (this folder is the whole project)
- **Install:** `npm install`
- **Build:** `npm run build`
- **Output:** `dist`
- **Production domain:** `pocket-handover.vercel.app` (or custom `handover.drshamiyah.com`)

Reconnect Vercel to this repository after migrating from the Pocket_OG monorepo.

## Privacy

Handover payloads are **not encrypted**. Use non-identifying clinical shorthand only. Bed notes stay on device. See [public/privacy.html](./public/privacy.html).

## localStorage keys

| Key | Purpose |
|-----|---------|
| `handover_profile_v1` | Name and role |
| `handover_shift_v1` | Active shift |
| `handover_jobs_v1` | Job list |
| `handover_ward_layouts_v1` | Per-ward bed layout |
| `handover_theme_v1` | `light` or `dark` |

## Testing

See [test-corpus/README.md](./test-corpus/README.md).

## PWA note

`registerType: 'autoUpdate'` — after deploy, close and reopen the app twice for updates to show.
