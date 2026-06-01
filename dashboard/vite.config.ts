import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// Configuração do Vite.
// - plugin-react: suporte a React + Fast Refresh.
// - alias "@": aponta para ./src, deixando os imports limpos (ex.: "@/lib/api").
// - server.proxy: em DEV, encaminha chamadas /api para a API Fastify, evitando
//   problemas de CORS durante o desenvolvimento. Em produção usamos VITE_API_URL.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: process.env.VITE_API_PROXY_TARGET ?? "http://localhost:3333",
        changeOrigin: true,
        // remove o prefixo /api antes de bater na API (a API expõe /materias, etc.)
        rewrite: (p) => p.replace(/^\/api/, ""),
      },
    },
  },
});
