import { Capacitor } from "@capacitor/core";

// WKWebView blocks capacitor:// URLs in iframes (subframe sandbox restriction).
// Fix: fetch the file from the Capacitor server into memory, create a blob URL,
// which iframes can load freely. On web, just use window.open.
export async function openUrl(url) {
  if (Capacitor.isNativePlatform()) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      window.dispatchEvent(new CustomEvent("open-pdf", { detail: { url: blobUrl } }));
    } catch (e) {
      console.error("Failed to load PDF", e);
    }
  } else {
    window.dispatchEvent(new CustomEvent("open-pdf", { detail: { url } }));
  }
}
