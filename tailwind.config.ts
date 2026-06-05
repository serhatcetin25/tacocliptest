import type { Config } from "tailwindcss";

/**
 * Tema TacoClip — claro, profissional.
 * Paleta "brand" (verde TACO) para ações/destaques e "ink" para texto/superfícies.
 */
const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef7f1",
          100: "#d6ebdd",
          200: "#aed7bb",
          300: "#7dbd92",
          400: "#4e9e6c",
          500: "#2f8050",
          600: "#22663f",
          700: "#1b5133",
          800: "#173f29",
          900: "#123322",
        },
        ink: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(0 0 0 / 0.04), 0 1px 3px 0 rgb(0 0 0 / 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
