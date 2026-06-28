# Virtual Obstetric Patient — Research Brief (Stage 0)

_A landscape review and build plan for a simulated patient whose internal
physiology responds to clinical interventions, so that decision-support logic
(and, later, training and research) can be stress-tested by consequence:
the patient survives or deteriorates based on the choices made._

**Status:** Stage 0 — research foundation. No physiology has been built yet.
**Scope of this document:** what already exists in the world, what we would
borrow vs build, and exactly which published source justifies each rule.
**Author note:** every numeric rule proposed here is a _candidate_ and must be
signed off by a clinician against the cited source before use.

---

## 1. The idea in one paragraph

A physiology simulation is, at heart, three things: **(a) numbers** that
describe the patient right now (blood volume, heart rate, blood pressure,
uterine tone, rhythm); **(b) rules** for how those numbers change each moment
and in response to treatment; and **(c) a clock** that ticks forward, applying
the rules repeatedly. Treatments (drugs, fluids, blood, procedures, CPR,
defibrillation) change the numbers; an **outcome function** decides the result.
Complexity is emergent — hundreds of individually-simple, individually-readable
rules interacting — which means each rule can be clinically audited on its own.

We do **not** attempt to recreate a whole human. We model the variables that
actually drive obstetric-emergency decisions and outcomes, and deliberately
ignore the rest. "Good enough for obstetric emergencies" is achievable;
"a complete human" is not, and is not needed.

---

## 2. Why this is feasible (the key finding)

The landscape splits cleanly into **what already exists and can be borrowed**
and **the genuine gap we must build**:

| Layer | State of the art | Our approach |
|---|---|---|
| Generic body (heart, lungs, blood, drug handling) | **Solved** — open-source engines (Pulse, BioGears) | Borrow individual equations as reference |
| Bleeding & circulatory response | **Solved, and in simple transparent form** (Zenker-class models) | Lift the simplest adequate model |
| "Words → numbers" clinical staging | Published (shock staging, vital-sign thresholds) | Encode directly, with citations |
| **Obstetric coupling** (uterine tone ↔ bleeding, uterotonic effect) | **The gap** — no open engine models it | **Build it** from obstetric literature |
| Drug timing (uterotonics) | Published pharmacodynamics | Encode delay-then-effect curves |
| Arrest survival windows | Published guidelines + outcome studies | Encode time thresholds |

**Conclusion:** the generic physiology is reusable; the novel, valuable work is
the obstetric layer — and every number that layer needs has a published source.

---

## 3. Resource catalogue — mapped to the rule each justifies

### Tier 1 — Open physiology engines (reference for the generic body)

| Resource | What it provides | How we would use it |
|---|---|---|
| **Pulse Physiology Engine** (Kitware, open source) | Whole-body cardiovascular / respiratory / blood-chemistry simulation with pharmacokinetic–pharmacodynamic (PK/PD) drug models; supports haemorrhage, IV fluids, drug administration | Reference textbook for individual generic relationships (e.g. pressure ↔ volume, basic drug kinetics). **Borrow specific equations, not the whole C++ engine.** Decision: extend-vs-build, see §6. |
| **BioGears** (predecessor; PK/PD tutorial) | Documented open framework specifically demonstrating drug PK/PD in a physiology engine | Reference pattern for how to represent "drug concentration rises, then effect follows" |

- Pulse overview: https://www.kitware.com/introducing-the-pulse-physiology-engine-open-source-computational-models-for-human-medical-simulation/
- BioGears PK/PD tutorial: https://pmc.ncbi.nlm.nih.gov/articles/PMC6363067/

### Tier 2 — Transparent cardiovascular / haemorrhage models (the core we lift)

| Resource | What it provides | Rule(s) it justifies |
|---|---|---|
| **Zenker / "ZenCur" model** & **"A Simple Cardiovascular Model for the Study of Hemorrhagic Shock"** (Curcio, 2020) | A deliberately _simple_ set of equations reproducing mean arterial pressure, heart rate, cardiac output and the body's compensation (baroreflex, transcapillary refill) as a patient bleeds | The engine's circulatory core: **"as blood volume falls, heart rate rises and — past a threshold — blood pressure falls."** Candidate for direct adoption. |
| **"Seven Mathematical Models of Hemorrhagic Shock"** (Curcio, 2021 review) | Side-by-side comparison of seven haemorrhage models of varying complexity | Lets us pick the **simplest model that is good enough**, with justification, rather than guessing |

- Simple CV model (Curcio 2020): https://pmc.ncbi.nlm.nih.gov/articles/PMC7781723/
- Seven models review: https://pmc.ncbi.nlm.nih.gov/articles/PMC8195646/

### Tier 3 — Clinical staging: turning sentences into numbers

| Resource | What it provides | Rule(s) it justifies |
|---|---|---|
| **Hemorrhagic Shock (StatPearls / NCBI)** | Classic blood-loss staging: <15% loss → mild tachycardia, no pressure change; 15–40% → MAP and pulse pressure fall, HR rises proportionally | **Thresholds** for when vitals deteriorate: the trigger points in the "BP crashes" rule |
| **CV Physiology (teaching reference)** | Plain-language quantitative explanations of the HR / pressure / cardiac-output relationships | Encodable form of the compensation relationships; sanity-check for Tier 2 |

- StatPearls Hemorrhagic Shock: https://www.ncbi.nlm.nih.gov/books/NBK470382/
- CV Physiology — Hemorrhagic Shock: https://cvphysiology.com/blood-pressure/bp031

### Tier 4 — Obstetric layer (the gap we build; numbers are published)

| Resource | What it provides | Rule(s) it justifies |
|---|---|---|
| **Uterine Atony overview (ScienceDirect)** & **PPH overview (Medscape)** | Uterine blood flow at term ≈ **700 ml/min**; atony causes ≈ **80%** of PPH; an atonic uterus can bleed at "faucet flow" ≈ **750 ml/min**; haemostasis depends on myometrial contraction compressing the spiral arteries | The **bleeding source rule**: bleed rate is a function of uterine tone — full ~700–750 ml/min when atonic, falling toward zero as tone is restored. This is the obstetric heart of the model. |

- Uterine Atony overview: https://www.sciencedirect.com/topics/medicine-and-dentistry/uterine-atony
- PPH overview (Medscape): https://emedicine.medscape.com/article/275038-overview

### Tier 5 — Drug pharmacodynamics (how treatments move the numbers)

| Resource | What it provides | Rule(s) it justifies |
|---|---|---|
| **Uterotonics pharmacology refresher (UCT)** & **WHO uterotonics (NCBI)** | Oxytocin: onset ~2–5 min IM, half-life ~3–5 min, effect up to ~1 h. Ergometrine: latent 2–5 min, half-life 30–120 min. Carboprost: prostaglandin, slower onset, sustained. | The **drug-effect rules**: each uterotonic raises uterine tone after its onset delay, by an amount and for a duration set by these figures — i.e. "give oxytocin → 2–5 min later, tone improves → bleed rate drops." |

- Uterotonics & tocolytics refresher (UCT, PDF): https://anaesthetics.ukzn.ac.za/wp-content/uploads/2024/11/Uterotonics-and-tocolytics-Ref-2021.pdf
- WHO uterotonics for PPH prevention (NCBI): https://www.ncbi.nlm.nih.gov/books/NBK535990/

### Tier 6 — Cardiac-arrest layer (time-critical windows + outcome anchors)

| Resource | What it provides | Rule(s) it justifies |
|---|---|---|
| **Cardiac Arrest in Pregnancy (AHA / Circulation)** | Defibrillate shockable rhythms within **2 min**; adrenaline within **5 min** for non-shockable; **perimortem caesarean / delivery by 5 min** if no ROSC; standard ACLS drug doses; left uterine displacement aids venous return | The **arrest timing rules** and the penalties for missing each window; mirrors the app's existing 2-min rhythm / 3-min adrenaline / 4–5-min PMCS constants |
| **Survival Outcomes … Maternal In-Hospital Cardiac Arrest (PMC)** | Real maternal in-hospital arrest survival data and process measures | **Anchors the live/die thresholds** to observed outcomes rather than invented probabilities |

- AHA Cardiac Arrest in Pregnancy: https://www.ahajournals.org/doi/full/10.1161/cir.0000000000000300
- Maternal IHCA survival study: https://pmc.ncbi.nlm.nih.gov/articles/PMC8917084/

### Caveat — what to NOT use

Most "PPH models" found online are **prediction / risk-score tools**
(machine-learning models estimating _who will_ bleed). These are a **different
thing** from a physiological simulator and are out of scope. We want the
_mechanistic physiology_ sources (Tiers 2–6), not the predictive ones.

---

## 4. Candidate patient state vector (first draft)

The minimum set of numbers to model PPH ± arrest. Each gets a documented
starting value and update rule, every rule cited to §3.

| Variable | Meaning | Driven by | Source tier |
|---|---|---|---|
| `blood_volume_ml` | Circulating volume | bleeding out, fluids/blood in | 2, 3 |
| `bleed_rate_ml_min` | Current rate of loss | uterine tone (+ trauma/tissue causes) | 4 |
| `uterine_tone` | 0 (atonic) → 1 (firm) | uterotonics, massage, time | 4, 5 |
| `heart_rate` | Pulse | blood volume (compensation) | 2, 3 |
| `map` | Mean arterial pressure | volume + compensation limit | 2, 3 |
| `rhythm` | sinus / VF / VT / PEA / asystole | arrest events, defibrillation | 6 |
| `arrest_elapsed_min` | Time in arrest | clock once arrested | 6 |
| `drug_levels{}` | Active concentration per drug | dose in, decay over half-life | 1, 5 |

**Outcome function (candidate):** death if MAP below a critical line for longer
than a tolerated window (Tier 3), or arrest without ROSC beyond the survival
window (Tier 6); survival/stabilisation if bleeding is controlled and volume
restored before those thresholds. All thresholds clinician-signed.

---

## 5. Architecture (plain terms)

```
        ┌─────────────────────────────────────────────┐
        │  CLOCK  — ticks every N seconds of sim time  │
        └─────────────────────────────────────────────┘
                          │ each tick
                          ▼
   ┌──────────────┐   reads NOW    ┌───────────────────────┐
   │  THE APP /   │ ─────────────► │   OPERATOR            │
   │  protocol    │  recommendation│  performs the action  │
   │  under test  │ ◄───────────── │  (fidelity dial:      │
   └──────────────┘    new state   │   perfect ↔ realistic)│
                                   └───────────┬───────────┘
                                               │ intervention
                                               ▼
                                   ┌───────────────────────┐
                                   │  PATIENT MODEL        │
                                   │  numbers + rules      │
                                   │  (§3 sources)         │
                                   └───────────┬───────────┘
                                               ▼
                                   ┌───────────────────────┐
                                   │  OUTCOME FUNCTION     │
                                   │  survives / deteriorates│
                                   └───────────────────────┘
```

**Operator fidelity dial (the diagnostic trick):** run the same patient with the
recommendation followed _perfectly and promptly_ vs _realistically (delays,
misses)_. If the patient dies even under a perfect operator, the fault is in the
**decision logic**; if she only dies under an imperfect operator, that is about
human robustness, not the protocol. This separates "is the advice survivable?"
from "is it robust to imperfect users?"

---

## 6. Build vs extend — recommendation

| Option | Description | Trade-off |
|---|---|---|
| **Extend Pulse/BioGears** | Bolt an obstetric module onto a validated C++ engine | Inherits realism & credibility; but heavy, C++, steep, and the obstetric layer is still ours to build |
| **Build fresh, lightweight (recommended)** | Own transparent model; borrow specific proven equations (Zenker, shock staging) as reference; author the obstetric layer from Tier 4–5 | Lower generic realism, but fully readable, clinician-auditable, and we own every rule |

**Recommendation:** _build fresh and transparent, borrowing individual
sub-equations from the open engines as reference._ For a clinical tool,
transparency and auditability outweigh maximal biophysical realism. Porting a
whole engine for "transparency" is self-defeating — its realism lives in its
complexity, and a port loses the original's validation.

**Suggested implementation:** Python (readable, scientific ecosystem, mature
numerical tools for the "rate maths"), as a **separate project/repository** from
Pocket O&G. Pocket O&G would be one _consumer_ of the simulator, not its host.

---

## 7. Validation & regulatory (non-negotiable)

1. **Every number is sourced or clinician-signed.** A textbook sentence
   ("tachycardia is an early sign of blood loss") must become a cited number
   ("≈ +10 bpm per 500 ml lost"); that translation is where error enters, so it
   requires explicit sign-off.
2. **Face validity → behavioural validity.** First confirm the model behaves
   sensibly to a clinician's eye; then compare its trajectories against the
   literature curves (Tier 2) and, where possible, real outcome patterns
   (Tier 6, MBRRACE).
3. **Regulatory line.** A research / training / software-testing tool is in
   scope. The moment output is used to guide real patient care it becomes a
   medical-device question. Keep this boundary explicit from day one.

---

## 8. Staged roadmap

- **Stage 0 — this brief.** Landscape + sourced rule map. _(done on delivery)_
- **Stage 1 — PPH sandbox.** Three numbers (blood volume, bleed rate, uterine
  tone) + one drug (oxytocin) + the clock. Watch volume fall and recover.
  Every rule labelled and cited. Purely to prove the loop.
- **Stage 2 — circulation + outcome.** Add HR/MAP (Zenker), shock staging
  thresholds, and the survive/deteriorate function.
- **Stage 3 — full uterotonic ladder + causes** (the four T's).
- **Stage 4 — arrest layer** (rhythm, CPR, defibrillation, adrenaline, PMCS
  windows) and joint PPH+arrest.
- **Stage 5 — operator fidelity dial + batch runs** (thousands of randomized
  patients → find the decision paths that kill).
- **Stage 6 — connect to Pocket O&G** as a test harness; later, training UI.

---

## 9. Risks

- **False authority.** A polished "survival rate" can mask invented physiology.
  Mitigation: source/sign every number; label unverified values clearly.
- **Attribution noise.** A death could be model error, operator error, or app
  error. Mitigation: operator fidelity dial; pair with the precise step-by-step
  harness for pinpoint diagnosis.
- **Obstetric physiology is genuinely under-modelled** — the build is real work,
  not a weekend. Mitigation: stage tightly, start with PPH we understand.
- **Scope creep.** Mitigation: one emergency to high quality before widening.

---

## 10. Sources

1. Pulse Physiology Engine (Kitware): https://www.kitware.com/introducing-the-pulse-physiology-engine-open-source-computational-models-for-human-medical-simulation/
2. BioGears PK/PD tutorial (McDaniel et al., PMC): https://pmc.ncbi.nlm.nih.gov/articles/PMC6363067/
3. A Simple Cardiovascular Model for the Study of Hemorrhagic Shock (Curcio, 2020, PMC): https://pmc.ncbi.nlm.nih.gov/articles/PMC7781723/
4. Seven Mathematical Models of Hemorrhagic Shock (Curcio, 2021, PMC): https://pmc.ncbi.nlm.nih.gov/articles/PMC8195646/
5. Hemorrhagic Shock (StatPearls / NCBI Bookshelf): https://www.ncbi.nlm.nih.gov/books/NBK470382/
6. CV Physiology — Hemorrhagic Shock: https://cvphysiology.com/blood-pressure/bp031
7. Uterine Atony overview (ScienceDirect Topics): https://www.sciencedirect.com/topics/medicine-and-dentistry/uterine-atony
8. Postpartum Hemorrhage overview (Medscape): https://emedicine.medscape.com/article/275038-overview
9. Uterotonics & tocolytics refresher (UCT, PDF): https://anaesthetics.ukzn.ac.za/wp-content/uploads/2024/11/Uterotonics-and-tocolytics-Ref-2021.pdf
10. WHO Uterotonics for the Prevention of PPH (NCBI Bookshelf): https://www.ncbi.nlm.nih.gov/books/NBK535990/
11. Cardiac Arrest in Pregnancy (AHA / Circulation): https://www.ahajournals.org/doi/full/10.1161/cir.0000000000000300
12. Survival Outcomes in Maternal In-Hospital Cardiac Arrest (PMC): https://pmc.ncbi.nlm.nih.gov/articles/PMC8917084/

_All numeric values cited above are candidates for encoding and require clinical
sign-off against the primary source before use in the simulator._
