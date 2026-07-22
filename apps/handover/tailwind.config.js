/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Material deep orange
        claude: {
          50: "#fbe9e7",
          100: "#ffccbc",
          200: "#ffab91",
          300: "#ff8a65",
          400: "#ff7043",
          500: "#ff5722",
          600: "#f4511e",
          700: "#e64a19",
          800: "#d84315",
          900: "#bf360c",
          950: "#4e1407",
        },
      },
      fontFamily: {
        sans: [
          "Geist",
          "-apple-system",
          "BlinkMacSystemFont",
          "'SF Pro Text'",
          "'SF Pro Display'",
          "'Segoe UI'",
          "Roboto",
          "'Helvetica Neue'",
          "sans-serif",
        ],
        mono: [
          "ui-monospace", "'SF Mono'", "Menlo", "Consolas", "monospace",
        ],
      },
    },
  },
  plugins: [],
}
