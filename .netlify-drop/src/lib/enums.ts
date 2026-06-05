/**
 * Valores permitidos para campos "enum" (SQLite não tem enum nativo no Prisma).
 * Validados com Zod nas bordas.
 */

export const MEDIA_TYPES = [
  "ONLINE",
  "IMPRESSO",
  "RADIO",
  "TV",
  "PORTAL",
  "REDE_SOCIAL",
] as const;
export type MediaType = (typeof MEDIA_TYPES)[number];

export const MEDIA_TYPE_LABELS: Record<MediaType, string> = {
  ONLINE: "Online",
  IMPRESSO: "Impresso",
  RADIO: "Rádio",
  TV: "TV",
  PORTAL: "Portal",
  REDE_SOCIAL: "Rede Social",
};

export const SENTIMENTS = ["POSITIVO", "NEUTRO", "NEGATIVO"] as const;
export type Sentiment = (typeof SENTIMENTS)[number];

export const SENTIMENT_LABELS: Record<Sentiment, string> = {
  POSITIVO: "Positivo",
  NEUTRO: "Neutro",
  NEGATIVO: "Negativo",
};

export const DRAFT_STATUS = [
  "PENDENTE",
  "APROVADO",
  "DESCARTADO",
  "DUPLICADO",
] as const;
export type DraftStatus = (typeof DRAFT_STATUS)[number];

export const SEARCH_PROVIDERS = ["GOOGLE_CSE", "GOOGLE_NEWS_RSS"] as const;
export type SearchProviderId = (typeof SEARCH_PROVIDERS)[number];
