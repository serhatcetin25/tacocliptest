import { canonicalizeUrl, normalizeTitle } from "@/lib/dedupe";
import { getEnabledProviders } from "@/lib/search/registry";
import type { SearchResult } from "@/lib/search/types";

export interface NewsItem {
  id: string;
  title: string;
  link: string;
  source: string;
  snippet: string | null;
  publishedAt: string | null;
  provider: string;
  relevance: number;
}

export interface NewsSearchOptions {
  limit?: number;
  language?: string;
  sortBy?: "relevance" | "recent";
  timeoutMs?: number;
}

export interface NewsSearchResult {
  query: string;
  searchedAt: string;
  results: NewsItem[];
  warnings: string[];
  providers: string[];
}

const STOPWORDS = new Set([
  "a",
  "as",
  "ao",
  "aos",
  "da",
  "das",
  "de",
  "do",
  "dos",
  "e",
  "em",
  "na",
  "nas",
  "no",
  "nos",
  "o",
  "os",
  "para",
  "por",
  "um",
  "uma",
]);

const CACHE_TTL_MS = 5 * 60 * 1000;
const CACHE_MAX_ITEMS = 100;
const cache = new Map<string, { expiresAt: number; data: NewsSearchResult }>();

function hashText(value: string): string {
  let hash = 5381;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 33) ^ value.charCodeAt(i);
  }
  return (hash >>> 0).toString(36);
}

function cleanQuery(value: string): string {
  return value.replace(/\s+/g, " ").trim().slice(0, 180);
}

function queryTerms(query: string): string[] {
  return normalizeTitle(query)
    .split(" ")
    .filter((term) => term.length >= 3 && !STOPWORDS.has(term));
}

function buildQueries(query: string): string[] {
  const normalized = cleanQuery(query);
  if (!normalized) return [];

  const hasOperator = /["()\-:]|\b(OR|AND)\b/i.test(normalized);
  if (hasOperator || !normalized.includes(" ")) {
    return [normalized];
  }

  const exact = `"${normalized.replace(/"/g, "")}"`;
  return [exact, normalized];
}

function cacheKey(
  query: string,
  options: Required<Pick<NewsSearchOptions, "limit" | "language" | "sortBy">>
): string {
  return JSON.stringify([query, options.limit, options.language, options.sortBy]);
}

function readCache(key: string): NewsSearchResult | null {
  const entry = cache.get(key);
  if (!entry) return null;

  if (entry.expiresAt <= Date.now()) {
    cache.delete(key);
    return null;
  }

  return entry.data;
}

function writeCache(key: string, data: NewsSearchResult): void {
  if (cache.size >= CACHE_MAX_ITEMS) {
    const oldestKey = cache.keys().next().value as string | undefined;
    if (oldestKey) cache.delete(oldestKey);
  }

  cache.set(key, {
    expiresAt: Date.now() + CACHE_TTL_MS,
    data,
  });
}

function scoreResult(result: SearchResult, query: string, exactQuery: boolean): number {
  const terms = queryTerms(query);
  const title = normalizeTitle(result.title);
  const snippet = normalizeTitle(result.snippet ?? "");
  const haystack = `${title} ${snippet}`;
  const phrase = normalizeTitle(query);

  let score = 0;
  if (exactQuery) score += 12;
  if (phrase && title.includes(phrase)) score += 35;
  if (phrase && snippet.includes(phrase)) score += 18;

  for (const term of terms) {
    if (title.includes(term)) score += 10;
    else if (haystack.includes(term)) score += 5;
  }

  if (terms.length > 0 && terms.every((term) => haystack.includes(term))) {
    score += 20;
  }

  if (result.publishedAt) {
    const ageMs = Date.now() - result.publishedAt.getTime();
    const ageDays = Math.max(0, ageMs / 86_400_000);
    score += Math.max(0, 10 - Math.min(ageDays, 10));
  }

  return score;
}

function normalizeItem(
  result: SearchResult,
  provider: string,
  query: string,
  exactQuery: boolean
): NewsItem {
  const canonical = canonicalizeUrl(result.link);
  return {
    id: hashText(canonical || result.title),
    title: result.title,
    link: result.link,
    source: result.source ?? "Fonte nao informada",
    snippet: result.snippet,
    publishedAt: result.publishedAt?.toISOString() ?? null,
    provider,
    relevance: scoreResult(result, query, exactQuery),
  };
}

export async function searchNews(
  rawQuery: string,
  options: NewsSearchOptions = {}
): Promise<NewsSearchResult> {
  const query = cleanQuery(rawQuery);
  const limit = Math.min(Math.max(options.limit ?? 80, 1), 100);
  const language = options.language ?? "pt-BR";
  const sortBy = options.sortBy ?? "relevance";
  const timeoutMs = options.timeoutMs ?? 12_000;
  const providers = getEnabledProviders();
  const warnings: string[] = [];

  if (!query) {
    return {
      query,
      searchedAt: new Date().toISOString(),
      results: [],
      warnings: [],
      providers: providers.map((provider) => provider.label),
    };
  }

  const key = cacheKey(query, { limit, language, sortBy });
  const cached = readCache(key);
  if (cached) return cached;

  const queries = buildQueries(query);
  const calls = providers.flatMap((provider) =>
    queries.map(async (providerQuery) => {
      try {
        const response = await provider.search({
          query: providerQuery,
          language,
          limit,
          timeoutMs,
        });
        return {
          response,
          providerLabel: provider.label,
          exactQuery: providerQuery.startsWith('"') && providerQuery.endsWith('"'),
        };
      } catch (err) {
        return {
          response: {
            provider: provider.id,
            results: [],
            warnings: [`${provider.label}: ${(err as Error).message}`],
          },
          providerLabel: provider.label,
          exactQuery: providerQuery.startsWith('"') && providerQuery.endsWith('"'),
        };
      }
    })
  );

  const responses = await Promise.all(calls);
  const byUrl = new Map<string, NewsItem>();

  for (const { response, providerLabel, exactQuery } of responses) {
    warnings.push(...response.warnings);

    for (const result of response.results) {
      const canonical = canonicalizeUrl(result.link);
      const item = normalizeItem(result, providerLabel, query, exactQuery);
      const existing = byUrl.get(canonical);

      if (!existing || item.relevance > existing.relevance) {
        byUrl.set(canonical, item);
      }
    }
  }

  const results = [...byUrl.values()].sort((a, b) => {
    if (sortBy === "recent") {
      const da = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const db = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return db - da || b.relevance - a.relevance;
    }
    return b.relevance - a.relevance;
  });

  const data = {
    query,
    searchedAt: new Date().toISOString(),
    results: results.slice(0, limit),
    warnings: [...new Set(warnings)],
    providers: providers.map((provider) => provider.label),
  };

  writeCache(key, data);
  return data;
}
