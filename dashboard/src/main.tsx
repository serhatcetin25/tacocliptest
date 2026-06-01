/**
 * Ponto de entrada da aplicação.
 * Configura o React Query (cache/fetching) e renderiza o App.
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App } from "./App";
import "./index.css";

// Configuração global do React Query.
// - retry: 1 tentativa extra em caso de falha (não ficar martelando API fora do ar).
// - refetchOnWindowFocus: rebusca quando o usuário volta à aba (dados frescos).
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
});

const root = document.getElementById("root");
if (!root) throw new Error("Elemento #root não encontrado no HTML.");

createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
