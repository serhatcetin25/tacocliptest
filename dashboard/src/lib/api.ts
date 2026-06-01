/**
 * Cliente HTTP tipado para a API TacoClip (Fastify - Fase 2).
 *
 * Estratégia de fallback para mock:
 *  1. Tenta bater na API real.
 *  2. Se falhar E VITE_USE_MOCK_FALLBACK=true, retorna dados de exemplo.
 *  3. Se falhar E mock desativado, relança o erro para o React Query tratar.
 *
 * Isso permite desenvolver o front sem o back no ar.
 */
import type {
  FacetasResponse,
  FiltrosMaterias,
  MateriaDetalhe,
  PaginaMaterias,
} from "@/types";
import { filtrarMock, MOCK_FACETAS, MOCK_MATERIAS } from "./mock-data";

// ─── Configuração ─────────────────────────────────────────────────────────────

const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "/api";

const USE_MOCK =
  import.meta.env.VITE_USE_MOCK_FALLBACK === "true";

// ─── Utilitário de fetch ──────────────────────────────────────────────────────

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!res.ok) {
    // Tenta extrair mensagem de erro padronizada da API (formato Fastify)
    let mensagem = `Erro ${res.status}`;
    try {
      const body = (await res.json()) as { message?: string };
      if (body.message) mensagem = body.message;
    } catch {
      // ignora erro de parse
    }
    throw new Error(mensagem);
  }

  return res.json() as Promise<T>;
}

/** Wrapper que aplica o fallback para mock quando a API não está disponível. */
async function comMockFallback<T>(
  fn: () => Promise<T>,
  mockFn: () => T
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (USE_MOCK) {
      console.warn(
        "[TacoClip] API indisponível — usando dados de exemplo (mock).",
        err
      );
      // Simula latência de rede para o loading state aparecer
      await new Promise((r) => setTimeout(r, 400));
      return mockFn();
    }
    throw err;
  }
}

// ─── Funções de acesso à API ──────────────────────────────────────────────────

/**
 * Busca matérias com filtros, full-text e paginação.
 * GET /materias?q=...&veiculo=...&regiao=...&editoria=...&dataInicio=...&dataFim=...&ordem=...&pagina=...&porPagina=...
 */
export async function getMaterias(
  filtros: Partial<FiltrosMaterias>
): Promise<PaginaMaterias> {
  return comMockFallback(
    () => {
      // Monta query string ignorando valores vazios
      const params = new URLSearchParams();
      for (const [k, v] of Object.entries(filtros)) {
        if (v !== "" && v !== undefined && v !== null) {
          params.set(k, String(v));
        }
      }
      return apiFetch<PaginaMaterias>(`/materias?${params.toString()}`);
    },
    () => filtrarMock(filtros)
  );
}

/**
 * Busca detalhe de uma matéria pelo ID.
 * GET /materias/:id
 */
export async function getMateriaById(id: string): Promise<MateriaDetalhe> {
  return comMockFallback(
    () => apiFetch<MateriaDetalhe>(`/materias/${id}`),
    () => {
      const m = MOCK_MATERIAS.find((x) => x.id === id);
      if (!m) throw new Error("Matéria não encontrada");
      return { ...m, veiculoId: m.veiculo, imagemUrl: null };
    }
  );
}

/**
 * Retorna as opções de filtro disponíveis (veículos, regiões, editorias).
 * GET /facetas
 */
export async function getFacetas(): Promise<FacetasResponse> {
  return comMockFallback(
    () => apiFetch<FacetasResponse>("/facetas"),
    () => MOCK_FACETAS
  );
}

/**
 * Verifica se a API está no ar.
 * GET /health
 */
export async function getHealth(): Promise<{ status: string }> {
  return apiFetch<{ status: string }>("/health");
}
