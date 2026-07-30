# Alongside (concept)

A **patient-facing** concept companion to Pocket O&G. Where Pocket O&G answers
*"what do I do?"* for a clinician, Alongside answers *"is this normal, and what
care can I expect?"* for the patient, in plain English, drawn from the same
national guidance.

This is an **early look-and-feel prototype**, not a clinical product. It is
education and self-advocacy only: there is deliberately **no symptom-triage or
diagnosis engine** (that would move it into medical-device regulation). Every
clinical line is conservative, framed as a decision aid, and traceable to the
guideline it is `basedOn`.

## What's here

Three topics, each showing a different mode of the app:

- **Heavy periods** (NICE NG88) — the *advocacy* mode: what good care looks like
  and how to ask for it.
- **Bleeding after menopause** (RCOG GTG67 + NHS 2-week-wait) — the
  *know-the-signs* mode: the red flag, explained calmly.
- **Your body in pregnancy** (the shared `PHYSIOLOGY` guide) — the *understand*
  mode: what's normal and what to mention.

Each topic has five sections: Understand · What good care looks like (or "usually
normal") · When to get seen · Questions to ask · Words.

## How it relates to the rest of the monorepo

- Separate npm workspace app (`apps/alongside`), own Vite + PWA + Tailwind setup
  and own `vercel.json`, exactly like Handover (now a separate repo).
- Imports `@pocket-og/guidelines` **read-only**, purely for provenance: the
  "Based on NICE NG88" trust chip and the sources footer resolve live from the
  shared registry, so they stay in step with the clinician app. It changes
  nothing in `pocket-og` or the guidelines package.
- Patient-voiced copy lives in `src/content/topics.js`. It is hand-authored, not
  an automatic rewrite of the clinician text.

## Commands (from this directory)

- Dev: `../../node_modules/.bin/vite`
- Build: `../../node_modules/.bin/vite build`
- Preview: `../../node_modules/.bin/vite preview`
- Lint: `../../node_modules/.bin/eslint .`

## Not built yet, and needed before anyone relies on it

Clinical sign-off of every line, plain-language testing with real service users
(especially those most often dismissed), an accessibility pass, and a proper
patient-safety and regulatory review if any triage is ever added.
