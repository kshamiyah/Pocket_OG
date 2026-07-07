import { useEffect, useState } from "react";
import { THEME_DARK, THEME_LIGHT, applyTheme, getInitialTheme } from "../utils/theme";
import { Storage } from "../utils/storage";
import { ThemeContext } from "./ThemeContext";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
    Storage.setTheme(theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === THEME_DARK ? THEME_LIGHT : THEME_DARK));
  const dark = theme === THEME_DARK;

  return (
    <ThemeContext.Provider value={{ theme, dark, toggle, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
