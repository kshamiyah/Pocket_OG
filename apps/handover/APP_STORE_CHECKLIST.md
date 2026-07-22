# Handover: App Store submission checklist

Everything needed to take Handover from its current state (a Vercel-hosted PWA)
to a live listing on the **Google Play Store** and **Apple App Store**.

**Recommended order:** ship **Google Play first** (cheaper, no Mac required, TWAs
pass review easily), then **Apple** (needs a Mac + a paid account, more review
friction). You can do both from the same codebase.

**Rough budget:** ~£20 one-off (Play) + £79/yr (Apple) = your only hard costs.
Everything else is time. A Mac is required for the iOS build.

---

## Locked-in reference values

| Value | Setting |
|-------|---------|
| Bundle ID / App ID | `com.drshamiyah.handover` |
| Store name | **Handover** (fallback if taken: Handover: Shift List) |
| Privacy policy URL | `https://pocket-handover.vercel.app/privacy.html` |
| Support / contact email | `k.shamiyah@gmail.com` |
| Production domain | `pocket-handover.vercel.app` |

> The privacy policy URL only goes live once this branch is deployed to the
> handover production project on Vercel.

---

## Phase 0 — Decisions to make first

- [ ] **Pick a distinct store name.** "Handover" alone is generic and almost
      certainly collides with existing apps. Choose something searchable, e.g.
      *Ward Handover*, *Shift Handover*, or *Handover: Shift Job List*. The
      in-app name can stay "Handover".
- [ ] **Choose a publisher identity.** Personal (Khalid Shamiyah) or a company
      (e.g. a Ltd). Apple shows this as the seller; changing it later is painful.
      Note: a personal Apple account shows your legal name publicly unless you
      trade as an entity.
- [ ] **Choose a bundle/package identifier** (reverse-DNS, permanent). e.g.
      `uk.drshamiyah.handover`. Used identically on both stores.
- [ ] **Confirm the production URL** that will be the app's source of truth
      (the current Vercel domain, or a custom domain). Play's TWA and the
      privacy policy both hang off this.
- [ ] **Decide target countries** and a **content/age rating** (this app = 4+/everyone).

---

## Phase 1 — Get the app itself store-ready (code)

### Manifest & identity
- [ ] Add `id` to the web manifest (stable app identity for Play).
- [ ] Add `categories: ["medical", "productivity"]`.
- [ ] Add `lang: "en-GB"` and `dir: "ltr"`.
- [ ] Add `screenshots[]` to the manifest (used by PWABuilder and richer listings).
- [ ] (Optional) Add `shortcuts[]` (e.g. "Start shift", "Scan handover").

### Icons & splash
- [ ] Verify the 512px icon has a proper **maskable safe zone** (content inside
      the inner 80%), or Android will crop it. Current icons are full-bleed —
      check this.
- [ ] Produce an **Android adaptive icon** (foreground + background layers).
- [ ] Produce the **iOS 1024×1024 marketing icon** (no transparency, no rounded
      corners — Apple adds them).
- [ ] Add **iOS launch/splash screens** (handled by Capacitor).

### In-app safety / UX
- [ ] Add a short **"Do not store patient-identifiable data"** notice on first
      run (Handover has no disclaimer today; pocket-og has one to copy the pattern from).
- [ ] Handle **camera-permission-denied** gracefully in the QR scanner (clear
      message + manual link fallback).
- [ ] (Recommended) Wire **Capacitor Local Notifications** so reminders fire as
      real OS notifications. Bonus: a second native capability strengthens the
      Apple 4.2 "not just a website" case.

### Verify
- [ ] Test install, offline use, and the update flow on a real phone.
- [ ] Quick accessibility pass (button labels, tap targets, contrast in dark mode).
- [ ] `npm run build -w apps/handover` is clean; `npm run lint` is clean.

---

## Phase 2 — Legal & policy (both stores)

- [ ] **Privacy policy at a public URL** (mandatory even though the app collects
      nothing). Must state: data stays on-device in localStorage; QR/link
      handover is user-initiated and unencrypted; no analytics; no accounts.
- [ ] **Support URL + support email** (both stores require a contact).
- [ ] (Optional) **Terms of use** page.
- [ ] **Add a LICENSE** file to the repo.
- [ ] **Export-compliance answer:** uses only standard HTTPS/OS crypto → normally
      "exempt". Confirm and record the answer.
- [ ] **Information-governance note (NHS context):** confirm you're comfortable
      that a personal tool storing no PID doesn't need trust IG sign-off. Keep a
      note of the reasoning. (Not an app-store requirement, but do it before
      (healthcare professionals use it on shift.)

---

## Phase 3a — Google Play (TWA via Bubblewrap) 🤖

Works on Linux/this environment — no Mac needed.

- [ ] Create a **Google Play Console** account (**$25 one-off**).
- [ ] Install **Bubblewrap** (`@bubblewrap/cli`) or use **PWABuilder.com**.
- [ ] `bubblewrap init` against the production manifest URL → generates the
      Android project.
- [ ] Generate and **safely back up the signing (upload) keystore** — losing it
      means you can never update the app.
- [ ] Host **Digital Asset Links** at `/.well-known/assetlinks.json` on the
      production domain (removes the browser URL bar). Add to the Vercel app.
- [ ] `bubblewrap build` → produces the signed **`.aab`**.
- [ ] In Play Console, create the app and complete:
  - [ ] Store listing (name, short + full description, screenshots — phone + optional tablet)
  - [ ] **Feature graphic** 1024×500
  - [ ] App icon 512×512
  - [ ] **Data safety** form (declare: no data collected/shared)
  - [ ] **Content rating** questionnaire
  - [ ] **Target audience** & ads declaration (no ads)
  - [ ] Privacy policy URL
- [ ] Upload the `.aab` to **Internal testing**, install via the test link, verify.
- [ ] Promote to **Closed** → **Production**; submit for review.
- [ ] Review is usually hours–days. Address any feedback.

---

## Phase 3b — Apple App Store (Capacitor) 🍎

**Requires a Mac with Xcode.**

- [ ] Enrol in the **Apple Developer Program** (**$99/yr**).
- [ ] Add **Capacitor** to the handover app and add the **iOS platform**
      (`@capacitor/core`, `@capacitor/cli`, `npx cap add ios`).
- [ ] Point Capacitor at the built `dist` and set the **bundle ID** to match Phase 0.
- [ ] Register the **bundle ID** (App ID) in the Apple Developer portal.
- [ ] Add required **Info.plist usage strings**, especially
      **`NSCameraUsageDescription`** with a clear reason
      ("Scan a handover QR code from another healthcare professional"). A vague/missing string = rejection.
- [ ] Add app icons + launch screen in Xcode.
- [ ] Create **signing certificate + provisioning profile** (Xcode automatic
      signing is fine).
- [ ] **Archive** in Xcode and upload to **App Store Connect** (via Xcode or Transporter).
- [ ] In App Store Connect, create the app record and complete:
  - [ ] Name, subtitle, description, **keywords**, promotional text
  - [ ] **Screenshots** for required device sizes (6.7" and 6.5" iPhone minimum)
  - [ ] 1024px marketing icon
  - [ ] **App Privacy** "nutrition label" (declare: no data collected)
  - [ ] **Age rating** questionnaire
  - [ ] Support URL, marketing URL, privacy policy URL
  - [ ] Export-compliance answer
- [ ] Test via **TestFlight** on a real device.
- [ ] **Submit for review.** Be ready for **Guideline 4.2 (minimum functionality)**
      pushback — in the review notes, explain the native camera QR scanning,
      offline localStorage operation, and local notifications so the reviewer
      sees it's more than a wrapped website.
- [ ] Address feedback; release.

---

## Phase 4 — After it's live

- [ ] Set an **update process**: rebuild the wrapper when the PWA changes
      (bump version/build numbers each release on both stores).
- [ ] (Optional) Add lightweight **crash/error monitoring**.
- [ ] Watch reviews and respond.

---

## The critical path (shortest route to "live")

1. Pick a distinct name + bundle ID + privacy policy URL. *(Phase 0 + 2)*
2. Manifest/icon polish + on-device test. *(Phase 1)*
3. Bubblewrap → `.aab` → Play Console → ship. *(Phase 3a)* ← **Play can be live first.**
4. On a Mac: Capacitor → Xcode → App Store Connect → ship. *(Phase 3b)*

The only items that genuinely block you and aren't just time: the **two developer
accounts**, a **Mac for iOS**, and the **signing keys** (back them up).
