// Deep links so a shared URL opens the app straight to the shared content.
// Query-param scheme (SPA-friendly on static hosting):
//   ?g=<guidelineCode>  ?fc=<flowchartId>  ?calc=<scenarioId>  ?consent=<procedureId>

const KEYS = {
  reader: "g",
  flowchart: "fc",
  calculator: "calc",
  consent: "consent",
};

export function shareUrl(type, id) {
  if (typeof window === "undefined") return "";
  const base = `${window.location.origin}${window.location.pathname}`;
  const key = KEYS[type];
  if (!key || !id) return base;
  return `${base}?${key}=${encodeURIComponent(id)}`;
}

// Read a deep link from the current URL, or null. Returns a { type, id } shape
// that matches handleNavigate's contract.
export function readDeepLink() {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  for (const [type, key] of Object.entries(KEYS)) {
    const id = params.get(key);
    if (id) return { type, id };
  }
  return null;
}

// Strip the deep-link params from the address bar after handling, so a refresh
// doesn't re-open and the URL stays tidy.
export function clearDeepLinkParam() {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  let changed = false;
  for (const key of Object.values(KEYS)) {
    if (url.searchParams.has(key)) { url.searchParams.delete(key); changed = true; }
  }
  if (changed) {
    window.history.replaceState({}, "", url.pathname + (url.search || "") + url.hash);
  }
}
