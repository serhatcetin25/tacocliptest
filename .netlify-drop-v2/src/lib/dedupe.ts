/**
 * Utilitários de deduplicação para a captura de menções.
 *
 * Duas estratégias:
 *  1. URL canonizada: remove parâmetros de rastreamento (utm_*, fbclid, etc.),
 *     normaliza host/protocolo e barra final. Dois links que apontam para a
 *     mesma matéria passam a ter a mesma chave.
 *  2. Similaridade de título: normaliza (minúsculas, sem acento/pontuação) e
 *     compara via distância de Levenshtein normalizada. Títulos quase iguais
 *     (ex.: com sufixo "- G1") são detectados como duplicata.
 */

const TRACKING_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "fbclid",
  "gclid",
  "igshid",
  "mc_cid",
  "mc_eid",
  "ref",
  "ref_src",
];

/** Canoniza uma URL para uso como chave de deduplicação. */
export function canonicalizeUrl(rawUrl: string): string {
  try {
    const url = new URL(rawUrl.trim());

    // Protocolo sempre https para efeito de comparação
    url.protocol = "https:";

    // Host em minúsculas, sem "www."
    url.hostname = url.hostname.toLowerCase().replace(/^www\./, "");

    // Remove parâmetros de rastreamento
    for (const param of TRACKING_PARAMS) {
      url.searchParams.delete(param);
    }

    // Remove hash
    url.hash = "";

    // Remove barra final do path (exceto raiz)
    let pathname = url.pathname;
    if (pathname.length > 1 && pathname.endsWith("/")) {
      pathname = pathname.slice(0, -1);
    }
    url.pathname = pathname;

    // Ordena os params restantes para canonizar
    url.searchParams.sort();

    return url.toString();
  } catch {
    // Se não for URL válida, retorna o texto original normalizado
    return rawUrl.trim().toLowerCase();
  }
}

/** Extrai o domínio (host sem www) de uma URL, ou null se inválida. */
export function extractDomain(rawUrl: string): string | null {
  try {
    return new URL(rawUrl).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

/** Normaliza um título para comparação: minúsculas, sem acento, sem pontuação. */
export function normalizeTitle(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ") // remove pontuação
    .replace(/\s+/g, " ")
    .trim();
}

/** Distância de Levenshtein entre duas strings. */
function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = Array.from({ length: a.length + 1 }, () =>
    new Array<number>(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) matrix[i]![0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0]![j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i]![j] = Math.min(
        matrix[i - 1]![j]! + 1, // deleção
        matrix[i]![j - 1]! + 1, // inserção
        matrix[i - 1]![j - 1]! + cost // substituição
      );
    }
  }

  return matrix[a.length]![b.length]!;
}

/**
 * Similaridade entre dois títulos, de 0 (totalmente diferentes) a 1 (idênticos).
 * Baseada na distância de Levenshtein normalizada pelo comprimento.
 */
export function titleSimilarity(a: string, b: string): number {
  const na = normalizeTitle(a);
  const nb = normalizeTitle(b);
  if (na === nb) return 1;
  const maxLen = Math.max(na.length, nb.length);
  if (maxLen === 0) return 1;
  const dist = levenshtein(na, nb);
  return 1 - dist / maxLen;
}

/** Considera duplicata se a similaridade do título >= limiar (padrão 0.85). */
export function isSimilarTitle(a: string, b: string, threshold = 0.85): boolean {
  return titleSimilarity(a, b) >= threshold;
}
