/**
 * Contrato da camada de busca (padrão Strategy/Provider).
 *
 * Cada fonte de notícias (Google CSE, Google Notícias RSS, futuramente Bing,
 * NewsAPI...) implementa a interface SearchProvider. O resto do sistema só
 * conhece essa interface — adicionar uma fonte nova não exige reescrever nada.
 */
import type { SearchProviderId } from "@/lib/enums";

/** Parâmetros de uma busca. */
export interface SearchParams {
  /** Consulta montada a partir dos termos do cliente (aspas, -excluir, site: suportados). */
  query: string;
  /** Idioma preferencial (ex.: "pt-BR"). */
  language?: string;
  /** Restrição de período recente, no formato do Google (ex.: "d7" = últimos 7 dias). */
  dateRestrict?: string;
  /** Quantidade máxima de resultados desejada. */
  limit?: number;
  /** Tempo maximo de espera por fonte externa, em milissegundos. */
  timeoutMs?: number;
}

/** Resultado normalizado, independente da fonte. */
export interface SearchResult {
  title: string;
  link: string;
  /** Domínio/veículo de origem (ex.: "g1.globo.com"). */
  source: string | null;
  snippet: string | null;
  publishedAt: Date | null;
  /** Payload original da fonte, para auditoria. */
  raw: unknown;
}

/** Resposta de uma execução de busca. */
export interface SearchProviderResult {
  provider: SearchProviderId;
  results: SearchResult[];
  /** Erros não fatais (ex.: feed parcial) para log. */
  warnings: string[];
}

/** Interface que toda fonte de busca deve implementar. */
export interface SearchProvider {
  readonly id: SearchProviderId;
  readonly label: string;
  /** Indica se o provider está configurado e pronto (ex.: tem API key). */
  isConfigured(): boolean;
  /** Executa a busca. Deve tratar erros internamente e nunca lançar para o caller sem contexto. */
  search(params: SearchParams): Promise<SearchProviderResult>;
  /** Testa a conexão/credenciais (usado pela tela de Configurações). */
  testConnection(): Promise<{ ok: boolean; message: string }>;
}

/** Erro tipado para problemas de quota/limite (HTTP 429/403). */
export class SearchQuotaError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number
  ) {
    super(message);
    this.name = "SearchQuotaError";
  }
}
