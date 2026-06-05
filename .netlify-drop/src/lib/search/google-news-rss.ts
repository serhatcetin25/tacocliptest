import { extractDomain } from "@/lib/dedupe";
import type {
  SearchParams,
  SearchProvider,
  SearchProviderResult,
  SearchResult,
} from "./types";

function decodeXmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCodePoint(Number(code))
    )
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 16))
    );
}

function pickTag(block: string, tag: string): string | null {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const match = block.match(re);
  if (!match || match[1] === undefined) return null;

  return decodeXmlEntities(
    match[1]
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim()
  )
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export class GoogleNewsRssProvider implements SearchProvider {
  readonly id = "GOOGLE_NEWS_RSS" as const;
  readonly label = "Google Notícias (RSS)";

  isConfigured(): boolean {
    return true;
  }

  private buildUrl(params: SearchParams): string {
    const locale = params.language ?? "pt-BR";
    const [, regionRaw] = locale.split("-");
    const region = regionRaw ?? "BR";
    const ceid = `${region}:${locale}`;
    const query = encodeURIComponent(params.query);

    return `https://news.google.com/rss/search?q=${query}&hl=${locale}&gl=${region}&ceid=${ceid}`;
  }

  async search(params: SearchParams): Promise<SearchProviderResult> {
    const warnings: string[] = [];
    const url = this.buildUrl(params);
    const timeoutMs = params.timeoutMs ?? 12_000;

    let xml: string;
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": "TacoClip/1.0 (clipping interno TACO)" },
        cache: "no-store",
        signal: AbortSignal.timeout(timeoutMs),
      });

      if (!response.ok) {
        warnings.push(`Google News RSS retornou HTTP ${response.status}.`);
        return { provider: this.id, results: [], warnings };
      }

      xml = await response.text();
    } catch (err) {
      warnings.push(
        `Falha de rede ao acessar Google News RSS: ${(err as Error).message}`
      );
      return { provider: this.id, results: [], warnings };
    }

    const results: SearchResult[] = [];
    const items = xml.split(/<item>/i).slice(1);
    const limit = params.limit ?? 25;

    for (const rawItem of items) {
      if (results.length >= limit) break;

      const block = rawItem.split(/<\/item>/i)[0] ?? "";
      const title = pickTag(block, "title");
      const link = pickTag(block, "link");

      if (!title || !link) continue;

      const pubDate = pickTag(block, "pubDate");
      const description = pickTag(block, "description");
      const sourceTag = pickTag(block, "source");

      let publishedAt: Date | null = null;
      if (pubDate) {
        const parsed = new Date(pubDate);
        publishedAt = Number.isNaN(parsed.getTime()) ? null : parsed;
      }

      results.push({
        title,
        link,
        source: sourceTag ?? extractDomain(link),
        snippet: description,
        publishedAt,
        raw: { title, link, pubDate, description, source: sourceTag },
      });
    }

    return { provider: this.id, results, warnings };
  }

  async testConnection(): Promise<{ ok: boolean; message: string }> {
    const result = await this.search({ query: "teste", limit: 1 });
    if (result.results.length > 0 || result.warnings.length === 0) {
      return { ok: true, message: "Google Notícias (RSS) acessível." };
    }
    return {
      ok: false,
      message: result.warnings.join(" ") || "Sem resposta do feed.",
    };
  }
}
