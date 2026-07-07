import { Storage } from "./storage";

const THEME_LIGHT = "light";
const THEME_DARK = "dark";
const THEME_COLOR_LIGHT = "#fbe9e7";
const THEME_COLOR_DARK = "#030712";

export function applyTheme(theme) {
  const dark = theme === THEME_DARK;
  document.documentElement.classList.toggle("dark", dark);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", dark ? THEME_COLOR_DARK : THEME_COLOR_LIGHT);
}

export function getInitialTheme() {
  return Storage.getTheme();
}

export function persistTheme(theme) {
  Storage.setTheme(theme);
  applyTheme(theme);
}

export function toggleTheme(current) {
  const next = current === THEME_DARK ? THEME_LIGHT : THEME_DARK;
  persistTheme(next);
  return next;
}

export { THEME_DARK, THEME_LIGHT };
