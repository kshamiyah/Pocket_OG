# Handover: iOS build setup (do this on the Mac)

The web app is already Capacitor-ready (`capacitor.config.json` is committed). These
steps generate the native Xcode project and configure it. Run them **on a Mac with
Xcode installed**, from the repo root, once your Apple Developer enrolment is active.

Prerequisites on the Mac:

- Xcode (from the Mac App Store) + one-time `xcode-select --install`
- CocoaPods: `sudo gem install cocoapods` (or `brew install cocoapods`)
- Repo dependencies installed: `npm install` at the repo root

---

## 1. Generate the iOS project

```bash
npm run cap:sync -w apps/handover      # builds the web app first
npm run cap:add:ios -w apps/handover   # creates apps/handover/ios/
```

This creates `apps/handover/ios/App/…` with an Xcode project whose bundle ID is
already `com.drshamiyah.handover` (from `capacitor.config.json`).

## 2. Add the camera permission string (required — Apple rejects without it)

The QR scanner uses the camera. Open the Info settings and add the usage string:

- In Xcode: open `apps/handover/ios/App/App.xcworkspace`, select the **App**
  target → **Info** tab → add a row:
  - **Key:** `Privacy - Camera Usage Description` (`NSCameraUsageDescription`)
  - **Value:** `Handover uses the camera to scan a colleague's handover QR code.`

Or edit `apps/handover/ios/App/App/Info.plist` directly and add:

```xml
<key>NSCameraUsageDescription</key>
<string>Handover uses the camera to scan a colleague's handover QR code.</string>
```

While in `Info.plist`, also add this so the export-compliance question is skipped
on every upload (the app uses no non-exempt encryption):

```xml
<key>ITSAppUsesNonExemptEncryption</key>
<false/>
```

## 3. Set the display name

In Xcode → App target → **General** → **Display Name:** `Handover`
(this is the name under the icon; the store name is set later in App Store Connect).

## 4. App icon + launch screen

- Drop `apps/handover/public/icon-1024.png` (1024×1024, square, opaque, no alpha)
  into the asset catalog (`Assets.xcassets/AppIcon`), **or** run
  `npm run cap:icons -w apps/handover` (also runs automatically before `cap:sync`).
  Xcode generates the smaller sizes from the 1024 asset.
- Capacitor ships a default launch screen; we can theme it to match the app's
  `#fbe9e7` background.

## 5. Signing

Xcode → App target → **Signing & Capabilities** → tick **Automatically manage
signing** → select your Apple Developer team. Xcode creates the certificate and
provisioning profile for you.

## 6. Run on a real device

Plug in an iPhone, pick it in Xcode's device menu, press **Run**. Test:

- QR scanning (camera permission prompt shows your usage string)
- Denying the camera → the scanner shows the fallback message and paste box
- Offline use (airplane mode) still works

## Re-syncing after web changes

Any time the web app changes, re-sync the native project:

```bash
npm run cap:sync -w apps/handover
```

Then rebuild in Xcode.

## 7. Universal links (handover takeover URLs)

Handover links (`https://pocket-handover.vercel.app/?ho=...`) can open directly in the
installed app instead of Safari.

**Personal (free) Apple Developer teams cannot use Associated Domains.** `App.entitlements`
is intentionally empty so the app builds and runs on your iPhone. Handover still works:
use **Take over** and paste the link, or scan the QR.

**Paid Apple Developer Program only** (required for App Store anyway):

1. App IDs → `com.drshamiyah.handover` → enable **Associated Domains**.
2. Copy `App.entitlements.production` over `App.entitlements` (or merge the
   `com.apple.developer.associated-domains` entry).
3. Deploy so `public/.well-known/apple-app-site-association` is live on Vercel
   (`application/json` via `vercel.json`). Verify:

```bash
curl -sI https://pocket-handover.vercel.app/.well-known/apple-app-site-association
```

4. Rebuild and install on a device. Tap a handover link in Messages or Notes; it should
   offer to open in Handover.

Universal links can take a few minutes to propagate after the first install. If a link
still opens Safari, paste the URL on the Take over screen (still works).
