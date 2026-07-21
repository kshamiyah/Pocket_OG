# Review and publish

Generated scenarios are never shipped straight to users. The human sign-off
(Khalid playing and approving) is the clinical gate and the only mandatory step.

## Draft staging

A freshly authored case is marked `draft: true` on the case object.

- Draft cases are **playable** in the app (so they can be reviewed by being
  played) and show a "DRAFT · awaiting sign-off" banner.
- Draft cases are **excluded from the shipped library** (the home-screen entry
  and any default listing filter out `draft: true`), so nothing unreviewed
  reaches a trainee.
- This mirrors the existing `draft: true` convention on `trials.js`.

(If the `draft` handling is not yet wired in `SimPlayer.jsx` / the home entry,
that is a small UI change and must wait for Khalid, since he may have local UI
edits. Until then, keep drafts in a clearly separated block at the top of
`SIM_CASES` and tell Khalid which ids are drafts.)

## How to present a batch for review

For each case, give Khalid, in the chat:

1. **A playable link**: start the preview (`../../node_modules/.bin/vite preview
   --port 4173` from `apps/pocket-og`) and hand over `http://localhost:4173/?sim=<id>`.
2. **A one-screen crib**:
   - the difficulty level and which dials you turned,
   - each decision and its correct answer,
   - the source each answer is bound to (gl · section),
   - anything you were unsure about.
3. Present **one at a time** unless asked otherwise; it reads better than a wall
   of three.

Do not paste the raw JSON and ask him to proofread it. He reviews by playing.

## The three outcomes

- **Approve** → remove `draft: true`, keep the case in `SIM_CASES`, run the
  self-check once more, commit.
- **Alter** → apply the change to that case only, re-run the self-check, re-show.
- **Reject** → delete the case entirely. Never leave a rejected draft behind.

## Publishing

- "Publish" means: `draft` flag removed, case committed to the working branch
  (default `lesson`, or whatever Khalid names). Going live is his normal deploy.
- Approved cases can stack on one branch across a session; do not open a PR
  unless asked.
- Never commit a case that fails `simCheck.test.js` or `simStyleCheck.test.js`.

## Coverage awareness

Before generating, check what already exists in `simCases.js` (by `gl`,
`setting` and `difficulty`) and prefer filling gaps over duplicating. A useful
answer to "I need PPH questions" is a spread across the 4 Ts and severities and
a range of levels, not three atony cases at level 2.
