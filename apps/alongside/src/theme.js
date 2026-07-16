import { useCallback, useEffect, useState } from "react";

const KEY = "alongside_theme_v1";

// Small class-based theme toggle, matching the house convention (localStorage
// key `alongside_theme_v1`, `.dark` on <html>). The initial class is set by the
// inline script in index.html to avoid a flash.
export function useTheme() {
  const [dark, setDark] = useState(() => {
    if (typeof document === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", dark);
    try { localStorage.setItem(KEY, dark ? "dark" : "light"); } catch { /* ignore */ }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", dark ? "#171218" : "#faf6f5");
  }, [dark]);

  const toggle = useCallback(() => setDark(d => !d), []);
  return { dark, toggle };
}
