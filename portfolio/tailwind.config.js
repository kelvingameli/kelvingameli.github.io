/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/index.source.html", "./assets/js/**/*.js"],
  theme: {
    extend: {
      colors: {
        surface: "#020617",
        background: "#020617",
        primary: "#2563eb",
        secondary: "#10b981",
        "accent-cyan": "#22d3ee",
        "on-surface": "#f8fafc",
        "on-surface-variant": "#94a3b8",
        "surface-container": "#0f172a",
        outline: "#1e293b",
        "outline-variant": "#334155",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
        full: "9999px",
      },
      spacing: {
        "margin-mobile": "20px",
        gutter: "24px",
        unit: "8px",
        "section-gap": "120px",
        "container-max": "1280px",
      },
      fontFamily: {
        display: ["Manrope", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
