/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Palette is driven by CSS variables set in index.css, so light/dark
        // both resolve through the same class names. Alpha modifiers are not
        // used on these tokens.
        paper: "var(--paper)",
        paper2: "var(--paper-2)",
        surface: "var(--surface)",
        surface2: "var(--surface-2)",
        ink: "var(--ink)",
        inksoft: "var(--ink-soft)",
        inkfaint: "var(--ink-faint)",
        line: "var(--line)",
        accent: "var(--accent)",
        accentsoft: "var(--accent-soft)",
        calm: "var(--calm)",
        calmbg: "var(--calm-bg)",
        notice: "var(--notice)",
        noticebg: "var(--notice-bg)",
        urgent: "var(--urgent)",
        urgentbg: "var(--urgent-bg)",
      },
      fontFamily: {
        serif: [
          "'Iowan Old Style'", "'Palatino Linotype'", "'Book Antiqua'",
          "Palatino", "Georgia", "serif",
        ],
        sans: [
          "system-ui", "-apple-system", "'Segoe UI'", "Roboto",
          "'Helvetica Neue'", "sans-serif",
        ],
      },
    },
  },
  plugins: [],
}
