/**
 * Tipos centrais do TacoClip.
 * Espelham exatamente o contrato da API Fastify (Fase 2).
 */

// ─── Entidades ────────────────────────────────────────────────────────────────

export interface Materia {
  id: string;
  titulo: string;
  resumo: string | null;
  url: string;
  autor: string | null;
  publicadoEm: string; // ISO 8601
  veiculo: string;
  regiao: string | null;
  editoria: string | null;
  sentimento: "positivo" | "negativo" | "neutro" | null;
  tags: string[];
}

export interface MateriaDetalhe extends Materia {
  veiculoId: string;
  imagemUrl: string | null;
}

// ─── Respostas da API ─────────────────────────────────────────────────────────

export interface PaginaMaterias {
  data: Materia[];
  total: number;
  pagina: number;
  porPagina: number;
  totalPaginas: number;
}

export interface FacetasResponse {
  veiculos: string[];
  regioes: string[];
  editorias: string[];
}

// ─── Filtros (estado do dashboard) ───────────────────────────────────────────

export interface FiltrosMaterias {
  q: string;
  veiculo: string;
  regiao: string;
  editoria: string;
  dataInicio: string;
  dataFim: string;
  ordem: "recente" | "relevancia";
  pagina: number;
  porPagina: number;
}

export const FILTROS_PADRAO: FiltrosMaterias = {
  q: "",
  veiculo: "",
  regiao: "",
  editoria: "",
  dataInicio: "",
  dataFim: "",
  ordem: "recente",
  pagina: 1,
  porPagina: 20,
};
