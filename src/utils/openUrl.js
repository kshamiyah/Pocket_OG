// Always use the in-app iframe overlay for PDFs — works on both web and native.
// The overlay is rendered in App.jsx via the "open-pdf" custom event.
export function openUrl(url) {
  window.dispatchEvent(new CustomEvent("open-pdf", { detail: { url } }));
}
