/**
 * Controle simples de cota diária e cache de resultados em memória.
 *
 * Para um app local de 2 usuários, um controle em memória é suficiente e evita
 * complexidade. Em produção/escala, trocar por persistência (tabela ou Redis).
 *
 * - Cota: conta chamadas por provider por dia (reseta à meia-noite local).
 * - Cache: guarda resultados de uma query por algumas horas para não gastar cota.
 */
import type { SearchProviderResult } from "./types";
import type { SearchProviderId } from "@/lib/enums";

const DAILY_LIMITS: Record<SearchProviderId, number> = {
  GOOGLE_CSE: 100, // plano grátis ~100/dia
  GOOGLE_NEWS_RSS: 10_000, // RSS é gratuito; limite alto só por segurança
};

const CACHE_TTL_MS = 1000 * 60 * 60 * 3; // 3 horas

interface UsageEntry {
  date: string; // YYYY-MM-DD
  count: number;
}

interface CacheEntry {
  expiresAt: number;
  value: SearchProviderResult;
}

const usage = new Map<SearchProviderId, UsageEntry>();
const cache = new Map<string, CacheEntry>();

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Verifica se ainda há cota disponível para o provider hoje. */
export function hasQuota(provider: SearchProviderId): boolean {
  const entry = usage.get(provider);
  if (!entry || entry.date !== today()) return true;
  return entry.count < DAILY_LIMITS[provider];
}

/** Retorna quantas chamadas restam hoje. */
export function remainingQuota(provider: SearchProviderId): number {
  const entry = usage.get(provider);
  if (!entry || entry.date !== today()) return DAILY_LIMITS[provider];
  return Math.max(0, DAILY_LIMITS[provider] - entry.count);
}

/** Registra uma chamada consumida. */
export function consumeQuota(provider: SearchProviderId): void {
  const d = today();
  const entry = usage.get(provider);
  if (!entry || entry.date !== d) {
    usage.set(provider, { date: d, count: 1 });
  } else {
    entry.count += 1;
  }
}

function cacheKey(provider: SearchProviderId, query: string): string {
  return `${provider}::${query.toLowerCase().trim()}`;
}

export function getCached(
  provider: SearchProviderId,
  query: string
): SearchProviderResult | null {
  const entry = cache.get(cacheKey(provider, query));
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(cacheKey(provider, query));
    return null;
  }
  return entry.value;
}

export function setCached(
  provider: SearchProviderId,
  query: string,
  value: SearchProviderResult
): void {
  cache.set(cacheKey(provider, query), {
    expiresAt: Date.now() + CACHE_TTL_MS,
    value,
  });
}
