/** @type {import('tailwindcss').Config} */
// Scans Pocket O&G's sources too, because the app renders Pocket O&G components.
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}", "../pocket-og/src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Geist", "-apple-system", "BlinkMacSystemFont", "'SF Pro Text'", "'SF Pro Display'", "'Helvetica Neue'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
