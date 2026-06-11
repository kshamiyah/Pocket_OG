# Pocket O&G — Monorepo

Clinical tools for RBH Maternity, built with React + Vite + Tailwind CSS.

## Apps

| App | Path | Description |
|-----|------|-------------|
| **Pocket O&G** | `apps/pocket-og` | Guideline reference — full-text search across trust protocols and NICE guidelines, with interactive decision flowcharts |
| **Ward Manager** | `apps/ward-manager` | Labour ward board — real-time patient tracking, clinical alert engine (NICE NG235 + NG229), VE/CTG/obs logging |

## Repo structure

```
apps/
  pocket-og/        # Guideline reference app
  ward-manager/     # Labour ward manager app
package.json        # npm workspaces root
```

## Development

```bash
# Install all workspace dependencies
npm install

# Run the guideline app
npm run dev -w apps/pocket-og

# Run the ward manager
npm run dev -w apps/ward-manager

# Run ward manager clinical rule tests
npm test -w apps/ward-manager
```

## Tech stack

Vite · React 19 · Tailwind CSS · Vitest · Vercel

## Important

All clinical content is derived from RBH trust guidelines and NICE publications. These tools are for reference only and are not a substitute for clinical judgement. Always escalate to a senior when uncertain.
