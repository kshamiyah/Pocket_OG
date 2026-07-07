# Handover

Standalone shift job-list PWA for ward handover. Capture jobs by ward and bed, hand over via QR or link, no server.

## Features

- **Onboarding:** welcome, profile (name + role), optional ward setup before first shift
- **Shift flow:** home hub (take over / start shift), job list with ward drill-down and bed board
- **Ward layouts:** bays, side rooms, collapsible sections; configurable in ward setup
- **Handover:** QR encode/decode (beds on wire; task text stripped for privacy)
- **Dark mode:** manual toggle (bottom-left FAB); preference stored in `handover_theme_v1`
- **Offline-first:** all data in `localStorage`; installable PWA

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
