/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#070b14",
        foreground: "#e6eef8",
      },
    },
  },
  plugins: [],
};
