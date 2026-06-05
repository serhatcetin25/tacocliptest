/**
 * Provider: Google Custom Search JSON API (Programmable Search Engine).
 *
 * Pesquisa a web inteira via API oficial. Requer GOOGLE_API_KEY e GOOGLE_CSE_ID.
 * Documentação: https://developers.google.com/custom-search/v1/overview
 *
 * Limites do plano grátis: ~100 queries/dia. O controle de cota/cache é feito
 * na camada de serviço (capture-service), não aqui.
 */
import type {
  SearchParams,
  SearchProvider,
  SearchProviderResult,
  SearchResult,
} from "./types";
import { SearchQuotaError } from "./types";
import { extractDomain } from "@/lib/dedupe";

interface CseItem {
  title?: string;
  link?: string;
  snippet?: string;
  displayLink?: string;
  pagemap?: {
    metatags?: Array<Record<string, string>>;
  };
}

interface CseResponse {
  items?: CseItem[];
  error?: { code: number; message: string };
}

export class GoogleCseProvider implements SearchProvider {
  readonly id = "GOOGLE_CSE" as const;
  readonly label = "Google Custom Search (web)";

  private readonly apiKey: string;
  private readonly cseId: string;

  constructor(apiKey = process.env.GOOGLE_API_KEY, cseId = process.env.GOOGLE_CSE_ID) {
    this.apiKey = apiKey ?? "";
    this.cseId = cseId ?? "";
  }

  isConfigured(): boolean {
    return this.apiKey.length > 0 && this.cseId.length > 0;
  }

  private buildUrl(params: SearchParams): string {
    const u = new URL("https://www.googleapis.com/customsearch/v1");
    u.searchParams.set("key", this.apiKey);
    u.searchParams.set("cx", this.cseId);
    u.searchParams.set("q", params.query);
    // Idioma: "pt-BR" -> lr=lang_pt
    const lang = (params.language ?? "pt-BR").split("-")[0];
    if (lang) u.searchParams.set("lr", `lang_${lang}`);
    if (params.dateRestrict) u.searchParams.set("dateRestrict", params.dateRestrict);
    // num: máximo 10 por chamada na API CSE
    u.searchParams.set("num", String(Math.min(params.limit ?? 10, 10)));
    return u.toString();
  }

  async search(params: SearchParams): Promise<SearchProviderResult> {
    const warnings: string[] = [];
    const timeoutMs = params.timeoutMs ?? 12_000;

    if (!this.isConfigured()) {
      warnings.push("Google CSE não configurado (faltam GOOGLE_API_KEY/GOOGLE_CSE_ID).");
      return { provider: this.id, results: [], warnings };
    }

    let data: CseResponse;
    try {
      const res = await fetch(this.buildUrl(params), {
        cache: "no-store",
        signal: AbortSignal.timeout(timeoutMs),
      });

      if (res.status === 429 || res.status === 403) {
        // Cota estourada ou acesso negado — erro tipado para o serviço tratar (backoff).
        throw new SearchQuotaError(
          `Limite/cota do Google CSE atingido (HTTP ${res.status}). Tente novamente mais tarde.`,
          res.status
        );
      }

      data = (await res.json()) as CseResponse;

      if (data.error) {
        if (data.error.code === 429 || data.error.code === 403) {
          throw new SearchQuotaError(data.error.message, data.error.code);
        }
        warnings.push(`Google CSE: ${data.error.message}`);
        return { provider: this.id, results: [], warnings };
      }
    } catch (err) {
      if (err instanceof SearchQuotaError) throw err;
      warnings.push(`Falha ao consultar Google CSE: ${(err as Error).message}`);
      return { provider: this.id, results: [], warnings };
    }

    const results: SearchResult[] = (data.items ?? []).map((item) => {
      const link = item.link ?? "";
      const metatags = item.pagemap?.metatags?.[0];
      const publishedRaw =
        metatags?.["article:published_time"] ??
        metatags?.["og:updated_time"] ??
        null;
      let publishedAt: Date | null = null;
      if (publishedRaw) {
        const d = new Date(publishedRaw);
        publishedAt = Number.isNaN(d.getTime()) ? null : d;
      }
      return {
        title: item.title ?? "(sem título)",
        link,
        source: item.displayLink ?? extractDomain(link),
        snippet: item.snippet ?? null,
        publishedAt,
        raw: item,
      };
    });

    return { provider: this.id, results, warnings };
  }

  async testConnection(): Promise<{ ok: boolean; message: string }> {
    if (!this.isConfigured()) {
      return {
        ok: false,
        message: "Configure GOOGLE_API_KEY e GOOGLE_CSE_ID no arquivo .env.",
      };
    }
    try {
      const r = await this.search({ query: "teste", limit: 1 });
      if (r.warnings.length > 0) return { ok: false, message: r.warnings.join(" ") };
      return { ok: true, message: "Conexão com Google CSE OK." };
    } catch (err) {
      if (err instanceof SearchQuotaError) {
        return { ok: false, message: err.message };
      }
      return { ok: false, message: (err as Error).message };
    }
  }
}
