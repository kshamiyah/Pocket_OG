// WKWebView blocks capacitor:// URLs in iframe subframes.
// Fix: always fetch the file into a blob URL — works on both web and native,
// no Capacitor API needed.
export async function openUrl(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    window.dispatchEvent(new CustomEvent("open-pdf", { detail: { url: blobUrl } }));
  } catch {
    // Fallback for any fetch failure
    window.open(url, "_blank", "noopener,noreferrer");
  }
}
