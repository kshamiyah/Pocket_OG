# Handover: App Store Connect listing

Copy-paste source for the App Store submission. Values respect Apple's character
limits. Store name is a recommendation, change it everywhere if you prefer another.

---

## Name & identifiers

| Field | Value | Limit |
|-------|-------|-------|
| App name | **Handover** | 30 chars |
| Subtitle | **Shift job list, handed over** | 30 chars |
| Bundle ID | `com.drshamiyah.handover` | — |
| Primary category | Medical | — |
| Secondary category | Productivity | — |

> App Store names must be globally unique. "Handover" is a common word and may
> already be taken. Fallbacks if so: *Handover: Shift List*, *Ward Handover*,
> *Shift Handover*.

---

## Promotional text (170 chars, editable any time without review)

> Capture ward jobs as you go, then hand the list to the next healthcare
> professional on shift with one QR scan. Fully offline. Nothing leaves your phone.

---

## Description (full)

> Handover is a shift job list for healthcare professionals, built for the pace of
> a hospital ward.
>
> Capture jobs by ward and bed as you go. Walk the ward bed by bed with a clear
> board in front of you. Mark jobs routine or urgent, set reminders, and tick
> them off as you work. At the end of the shift, hand the list to whoever is taking
> over with a QR code they scan, or a link you share, no typing it all out again.
>
> WHY YOU'LL USE IT
> - Fast capture: add a job in a couple of taps, by ward and bed
> - Bed board: see every outstanding job for a ward, bed by bed
> - Urgent vs routine, with timestamps so nothing gets stale
> - Reminders for time-critical jobs, with a due list
> - Private bed notes, kept on your device and never handed over
> - QR or link handover: pass on exactly the jobs you choose
> - Works fully offline, no signal needed on the ward
>
> PRIVATE BY DESIGN
> Everything stays on your device. No account, no server, no cloud, no tracking.
> Nothing you type is ever sent anywhere unless you choose to hand it over to
> another healthcare professional.
>
> A NOTE ON SAFE USE
> Handover is a task list for healthcare professionals, not a patient record.
> Use non-identifying shorthand only. It supports, and does not replace, verbal
> handover and clinical responsibility.

---

## Keywords (100 chars total, comma-separated, no spaces)

```
shift,jobs,ward,healthcare,professional,oncall,rounds,hospital,nhs,clinical,todo,checklist,bleep,qr
```

> Don't repeat the app name ("handover"), Apple already indexes it.

---

## URLs

| Field | Value |
|-------|-------|
| Privacy Policy URL | `https://pocket-handover.vercel.app/privacy.html` |
| Support URL | `https://pocket-handover.vercel.app/` (or a support page) |
| Marketing URL (optional) | `https://pocket-handover.vercel.app/` |

---

## App Privacy questionnaire (must match the privacy policy exactly)

App Store Connect → App Privacy. Answer:

- **Do you or your third-party partners collect data from this app?** → **No**
  → result: **"Data Not Collected"**

Rationale (true for this app): no server, no accounts, no analytics, no ad SDKs,
no third-party SDKs that gather data. All data is stored on-device in
localStorage. The QR/link handover is user-initiated sharing, not data collection
by the developer, so it does not count as collection here.

> This must line up with the privacy policy. Since the policy says "we collect
> nothing", "Data Not Collected" is the consistent answer. A mismatch is the most
> common 5.1.1 rejection.

---

## Age rating

Run the age-rating questionnaire with **all categories = None**. In particular:

- Medical/Treatment Information → **None** (this is a task list, it does not give
  medical advice, diagnoses or treatment information)

Expected result: **4+**.

---

## App Review notes (paste into the "Notes" field, pre-empts rejection)

> This app is a shift job list for healthcare professionals on the ward. No account
> or login is required, and it works fully offline.
>
> HOW TO TEST
> 1. Launch the app. Enter any name and role on the welcome screen.
> 2. Start a shift, then add a few jobs by ward and bed.
> 3. Native camera use: tap Take Over / Scan to open the QR scanner. It uses the
>    camera only to read a handover QR code from another device. You may also
>    paste a handover link instead of scanning.
> 4. Tap Hand Over to generate a QR code / link that passes the selected jobs to
>    the next shift.
>
> All data is stored locally on the device (localStorage). Nothing is transmitted
> to any server. There is no backend.

---

## Export compliance

The app uses no non-exempt encryption (only standard HTTPS/OS features; the
handover payload is base64-encoded, not encrypted).

- Answer **"No"** to the "Does your app use encryption?" export question, **or**
  add this to `ios/App/App/Info.plist` to skip the prompt on every upload:

```xml
<key>ITSAppUsesNonExemptEncryption</key>
<false/>
```

---

## Screenshots (still needed)

Required for at least the 6.7" iPhone size (1290 × 2796). Capture on a real device
or simulator once the iOS build runs. Suggested set of 5:

1. Bed board for a ward (the core view)
2. Adding a job (quick capture)
3. The job list with urgent + routine
4. The handover QR screen
5. Reminders / due list

> These are the one remaining asset that needs the app running on a device. We can
> refine copy and order once you have raw captures.
