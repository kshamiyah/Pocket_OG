// Light / dark preference, applied as a class on <html> (Tailwind darkMode: "class").
// Mirrors Handover's theme handling so both apps behave the same way.

const KEY = "pocketog_suite_theme_v1";
const BG_LIGHT = "#ffffff";
const BG_DARK = "#030712";

export function getThemePref() {
  try { return localStorage.getItem(KEY) || "system"; } catch { return "system"; }
}

export function isDarkResolved(pref = getThemePref()) {
  if (pref === "dark") return true;
  if (pref === "light") return false;
  return typeof window !== "undefined" && !!window.matchMedia?.("(prefers-color-scheme: dark)").matches;
}

export function applyTheme(pref = getThemePref()) {
  const dark = isDarkResolved(pref);
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? BG_DARK : BG_LIGHT);
  return dark;
}

export function setThemePref(pref) {
  try { localStorage.setItem(KEY, pref); } catch { /* ignore */ }
  return applyTheme(pref);
}

/** Follow the OS setting while the preference is "system". Returns an unsubscribe. */
export function watchSystemTheme(onChange) {
  const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
  if (!mq) return () => {};
  const handler = () => { if (getThemePref() === "system") onChange(applyTheme("system")); };
  mq.addEventListener?.("change", handler);
  return () => mq.removeEventListener?.("change", handler);
}
