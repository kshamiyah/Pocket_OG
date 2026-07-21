# Latest feed harvester

Scheduled pipeline that drafts new stories for the app's **Latest** tab and
opens a PR for review. It never publishes directly; you are the quality gate.

## How it runs

`.github/workflows/latest-harvest.yml` runs `harvest.mjs` every 2 days (and on
manual dispatch). If it finds anything relevant it opens a PR touching
`apps/pocket-og/public/latest.json` and this folder's `seen.json`. Review the
items in the PR, edit wording or cross-links, delete any you don't want, then
merge. Merging deploys via Vercel; installed apps pick up the new feed on their
next online visit.

## The funnel (where relevance comes from)

1. **Trusted sources in** (`sources.mjs`): a locked PubMed query over a journal
   shortlist filtered on **entry date** (so a short window catches papers when
   they appear online, not months later at print), the keyless gov.uk search API
   for MHRA safety notices and **NHS England maternity** publications/news, and
   the NICE / RCOG / MBRRACE listing pages.
2. **Deep excerpts**: links from those listings (plus NICE `Update-information`
   pages when we only have an overview URL) are fetched so the model can see the
   actual delta, not just that an update exists. Up to eight deep-fetch slots are
   reserved for **RCOG news articles** so NICE links do not crowd them out.
3. **Dedupe** against everything already surfaced (`latest.json` ids + urls, plus
   `seen.json`), so nothing returns a second time.
4. **Triage** (`harvest.mjs`): Claude scores each candidate against an explicit
   UK-O&G-trainee rubric. It drafts `what_changed` for the PR reviewer and a
   two-sentence `why` for the app (gist + ward hook): topic before guideline code,
   briefing tone not changelog prose. `what_changed` is not merged into the feed.
   Items with filler copy, duplicate why/delta, or listing-hub URLs are dropped. Guideline
   amendments must name a concrete delta in `what_changed`; news and `report` items only need
   a clear what-happened sentence grounded in the source.
   Capped at `LATEST_MAX_ITEMS` (default 10) with a research sub-cap
   (`LATEST_RESEARCH_SUBCAP`, default 3).
5. **Human review** in the PR: the real filter.

The model never asserts clinical facts of its own; it must ground `what_changed`
in the deep excerpts / candidates, links to primary sources, and the drafted
lines get your review before merge.

## Setup

Add repository secrets:

- `ANTHROPIC_API_KEY` (required)
- `ANTHROPIC_MODEL` (optional; defaults to `claude-opus-4-8`)
- `PUBMED_API_KEY` (optional; raises NCBI rate limits)

## Teaching it your taste

`decisions.jsonl` is an optional feedback log the triage prompt reads as
few-shot examples. Append one JSON object per line as you accept or reject items,
e.g.

```json
{"title": "US cervical screening self-sampling recommendation", "decision": "reject", "reason": "NHSCSP governs UK screening; US guidance doesn't change practice"}
{"title": "RCOG placenta praevia/PAS green-top update", "decision": "accept", "reason": "UK body, practice-changing, supersedes an app guide"}
```

Over time this turns "relevant" from a guess into your demonstrated taste.

## Run locally

```sh
cd scripts/latest
npm install
ANTHROPIC_API_KEY=sk-... node harvest.mjs
```

It writes proposed changes to `latest.json` / `seen.json` and a `pr-body.md`
summary; revert those files if you're only testing.
