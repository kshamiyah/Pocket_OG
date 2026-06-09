import { Capacitor } from "@capacitor/core";

// On native, PDFs must open inside the app WebView (capacitor:// scheme can't
// be passed to SFSafariViewController). We dispatch a custom event that App.jsx
// catches and renders an iframe overlay.
export function openUrl(url) {
  if (Capacitor.isNativePlatform()) {
    window.dispatchEvent(new CustomEvent("open-pdf", { detail: { url } }));
  } else {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}
