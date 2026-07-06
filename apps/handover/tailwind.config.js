/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "media",
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system", "BlinkMacSystemFont", "'SF Pro Text'", "'SF Pro Display'",
          "'Segoe UI'", "Roboto", "'Helvetica Neue'", "sans-serif",
        ],
        mono: [
          "ui-monospace", "'SF Mono'", "Menlo", "Consolas", "monospace",
        ],
      },
    },
  },
  plugins: [],
}
