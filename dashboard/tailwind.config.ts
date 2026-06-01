import type { Config } from "tailwindcss";

/**
 * Tema TacoClip.
 *
 * As cores ficam centralizadas aqui (e em src/index.css como CSS vars) para que,
 * ao trazer o protótipo HTML/CSS original, você ajuste a identidade visual em UM
 * lugar só. Os tokens "brand" e "ink" refletem o visual do dashboard:
 *  - brand: verde/teal de destaque do TacoClip (botões, links, ativos).
 *  - ink:   tons de cinza-azulado para texto e superfícies.
 *
 * Troque os valores HSL pelos exatos do seu protótipo quando quiser.
 */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Cor de marca (verde TacoClip). Ajuste para o tom exato do protótipo.
        brand: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
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
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(0 0 0 / 0.04), 0 1px 3px 0 rgb(0 0 0 / 0.08)",
      },
    },
  },
  plugins: [],
} satisfies Config;
