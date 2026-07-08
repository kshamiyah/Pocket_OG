# Handover

Standalone shift job-list PWA for ward handover. Capture jobs by ward and bed, hand over via QR or link, no server.

## Features

- **Onboarding:** welcome, profile (name + role), optional ward setup before first shift
- **Shift flow:** home hub (take over / start shift), job list with ward drill-down and bed board
- **Ward layouts:** bays, side rooms, collapsible sections; configurable in ward setup
- **Jobs:** tap to edit; timestamps (clock + relative age); routine/urgent; swipe to delete
- **Reminders:** +30m / +1h / +2h presets or custom time (hour + minute); due banner and notification centre (bell icon)
- **Handover:** pick which jobs to pass on; filter by ward; QR or share link; tap QR to expand; optional keep-copy (removes only handed-over jobs)
- **Dark mode:** manual toggle in the menu (···); preference stored in `handover_theme_v1`
- **Offline-first:** all data in `localStorage`; installable PWA

## Privacy

Handover payloads are **not encrypted**. Ward, bed, and task text travel on the wire verbatim (base64 in the QR or link). Keep job text to **non-identifying clinical shorthand** (no names, DOB, or hospital numbers). Prefer showing the QR in person rather than sharing the link in chat.

## Commands

From repo root:

```bash
npm run dev -w apps/handover      # dev server
npm run build -w apps/handover    # production build
npm run lint -w apps/handover     # ESLint
```

From `apps/handover`:

```bash
npm run dev
npm run build
npm run lint
```

Preview production build: `npm run preview` (default port 4173).

## Deploy (Vercel)

- **Root directory:** `apps/handover`
- **Install:** `cd ../.. && npm install` (see `vercel.json`)
- **Build:** `npm run build`
- **Output:** `dist`

## localStorage keys

| Key | Purpose |
|-----|---------|
| `handover_profile_v1` | Name and role |
| `handover_shift_v1` | Active shift |
| `handover_jobs_v1` | Job list |
| `handover_ward_layouts_v1` | Per-ward bay/bed layout |
| `handover_recent_wards_v1` | MRU ward chips |
| `handover_recent_beds_v1` | MRU beds per ward |
| `handover_recent_phrases_v1` | MRU job text suggestions |
| `handover_coach_done_v1` | First-run coach marks |
| `handover_theme_v1` | `light` or `dark` |

## PWA note

`registerType: 'autoUpdate'` — after deploy, close and reopen the app twice for updates to show.
