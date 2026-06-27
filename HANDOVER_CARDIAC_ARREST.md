# Maternal Cardiac Arrest SOS — Handover

**Branch:** `Cardiac_arrest` (off `emergency`)
**Primary file:** `apps/pocket-og/src/components/CardiacArrestPage.jsx` (all state, logic, UI)
**Wiring:** `apps/pocket-og/src/App.jsx` (SOS picker + overlay + cross-SOS handoff)
**Clinical benchmarks (in repo):**
- `packages/guidelines/src/BJOG - 2019 - Chu - Maternal Collapse in Pregnancy and the Puerperium (1).pdf` (RCOG GTG56)
- `packages/guidelines/src/Maternal Cardiac Arrest QRH OAA V1.1.pdf` (OAA quick-reference handbook)
- Resuscitation Council UK ALS (adult algorithm)
**Live preview:** `Cardiac_arrest` branch auto-deploys via Vercel git integration.

---

## Goal

A new **active** bedside SOS for maternal cardiac arrest, built the same way as
the PPH SOS: it times the resus, drives the CPR cycle, tracks drugs, and — most
importantly — runs the **perimortem caesarean (PMCS) clock**, the single defining
time-critical decision in maternal arrest.

Built as a guided walkthrough, every clinical decision confirmed with the
clinician and benchmarked against GTG56 + the OAA QRH.

---

## Algorithm (GTG56 Appendix 4 + OAA QRH + RCUK ALS)

### Entry / setup
- **Gestation band** drives MLUD + PMCS: ≥20 wk (or uterus at/above umbilicus)
  vs <20 wk vs **delivered/postpartum** (no PMCS, standard CPR).
- **Time since collapse** — "Now" or pick minutes elapsed. The clock is
  **anchored to true arrest time**, not app-open time, so the PMCS countdown
  fires correctly even if CPR has already been running.

### Dual-clock header + PMCS alarm
- Arrest clock (counts up) + **PMCS 4-min countdown bar** (≥20 wk only).
- At 4 min with no ROSC → **full-screen vibrating alarm**: "Start perimortem
  caesarean now — deliver by 5 min, do NOT move the patient, continue CPR."

### Immediate actions (concurrent checklist)
Call 2222 (+ senior obstetrician/anaesthetist/midwife; neonatal if >22 wk) ·
CPR 30:2 centre of chest 100–120/min 5–6 cm · **MLUD to the left** (≥20 wk only) ·
airway/high-flow O₂/early intubation · **IV access ABOVE the diaphragm** (+IO,
500 ml bolus) · attach defibrillator.

### CPR cycle (2-min loop)
- 2-min countdown auto-fires a **rhythm-check interrupt** → shockable vs
  non-shockable branch.
- **Shockable (VF/pVT):** shock confirm (200 J biphasic, shock #); **adrenaline
  1 mg + amiodarone 300 mg after the 3rd shock**; amiodarone 150 mg after 5th.
- **Non-shockable (asystole/PEA):** adrenaline 1 mg immediately.
- **Adrenaline** tracked every **3 min** (due indicator + dose count).

### Reversible causes (4 Hs / 4 Ts / Eclampsia)
Tap-to-expand checklist with obstetric specifics. Antidote action buttons with
doses: **Intralipid 20%** (LA toxicity) and **calcium gluconate/chloride 10 ml
10%** (Mg toxicity / hyperkalaemia). Eclampsia → **magnesium 4 g IV**.
**Hypovolaemia deep-links to the PPH SOS.**

### Box B reference
Magnesium (2 g VT / 4 g eclampsia), atropine (with the current-ALS caveat),
calcium, Intralipid, fluids, thrombolysis/PCI, TXA — collapsible reference.

### Outcome
- **ROSC achieved** → post-resus checklist (MHP if haemorrhage + PPH deep-link,
  surgical haemostasis, ECG/cause, ICU transfer, debrief/MBRRACE) → summary.
- **Resuscitation stopped** → summary.
- **Summary record:** arrest time, duration, shocks, adrenaline doses,
  amiodarone, PMCS performed?, antidotes, reversible causes considered, outcome.

---

## Cross-SOS connection (PPH ↔ Arrest)

- **PPH → Arrest:** the PPH ABC task's "Unstable — check for cardiac arrest" →
  "Yes — call 2222 now" now **launches the full Cardiac Arrest SOS** (was static
  text only). Passes `{ postpartum: true }` so setup **skips gestation** (PMCS/
  MLUD not indicated postpartum) but **still captures time of arrest**.
- **Arrest → PPH:** hypovolaemia cause + post-resus checklist offer "Open PPH
  SOS →".
- **Mechanism:** App-level `emergencyContext` carries the handoff flag between
  the two overlays; `EmergencyPage` gained an `onLaunchCardiacArrest` prop,
  `CardiacArrestPage` a `context` prop.

---

## Commit trail (this branch, off `emergency`)

- `3a1e572` Scaffold — setup + dual clocks + PMCS alarm
- `7cbd621` Immediate-actions concurrent checklist
- `7e15a91` 2-min CPR cycle, rhythm branch, drug tracking
- `aeeaa8d` Reversible causes (4Hs/4Ts/E) with antidotes
- `ab8fa86` Align with OAA QRH (IV above diaphragm, drug doses)
- `41fbacb` ROSC/stop, post-resus checklist, summary + Box B
- `237998b` Connect PPH SOS → Cardiac Arrest SOS (two-way link)

---

## Open items / decisions to revisit

1. **Cross-SOS launch unmounts the source.** Opening PPH from arrest (or vice
   versa) switches overlays — the originating SOS loses its in-progress state.
   Acceptable for now; a future version could preserve both (stacked overlays or
   shared session store).
2. **No session persistence yet.** Unlike the PPH SOS (localStorage recovery),
   the arrest page holds state in memory only — a reload loses it. Consider
   adding the same save/recover pattern.
3. **amiodarone 150 mg after 5th shock kept** (RCUK ALS standard; OAA QRH lists
   only 300 mg) — confirm preference.
4. **Atropine** included in Box B per QRH, with a note that current ALS dropped
   routine atropine for asystole/PEA — confirm whether to keep.
5. **Antepartum vs delivered** — standalone SOS-picker entry still asks gestation
   normally (PMCS applies); only the PPH-launched path is forced postpartum.
6. **Not yet benchmarked line-by-line with the clinician** the way PPH was —
   a bedside walkthrough/simulator pass (like PPH T01–T23) is the natural next
   step.
7. **GTG56 PDF as a guideline reader entry** — the PDF is in the repo but not yet
   wired as a `guidelines/src/*.js` reader entry or CLARK connection.
