/**
 * Registro central de providers de busca.
 * Para adicionar uma fonte nova (Bing, NewsAPI...), basta implementar
 * SearchProvider e registrá-la aqui.
 */
import type { SearchProvider } from "./types";
import type { SearchProviderId } from "@/lib/enums";
import { GoogleNewsRssProvider } from "./google-news-rss";
import { GoogleCseProvider } from "./google-cse";

const providers: SearchProvider[] = [
  new GoogleNewsRssProvider(),
  new GoogleCseProvider(),
];

/** Retorna todos os providers registrados. */
export function getAllProviders(): SearchProvider[] {
  return providers;
}

/** Retorna apenas os providers configurados e prontos para uso. */
export function getEnabledProviders(): SearchProvider[] {
  return providers.filter((p) => p.isConfigured());
}

/** Busca um provider pelo id. */
export function getProvider(id: SearchProviderId): SearchProvider | undefined {
  return providers.find((p) => p.id === id);
}
