/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#f6f4f0",
        surface: "#ffffff",
        "ink-primary": "#1a1a2e",
        "ink-secondary": "#4a4a5e",
        "ink-tertiary": "#8a8a9e",
        "ink-wash": "#e8e5df",
        "accent-indigo": "#4f46e5",
        "accent-teal": "#0a4a4a",
        "accent-amber": "#7a5c00",
        "accent-crimson": "#a61b1b",
      },
      fontFamily: {
        mono: ["'Geist Mono'", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
