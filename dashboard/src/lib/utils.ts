/**
 * Utilitários gerais do TacoClip.
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, parseISO, format } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * Combina classes Tailwind de forma segura, resolvendo conflitos.
 * Uso: cn("px-2 py-1", condicao && "bg-red-500", props.className)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formata uma data ISO para "há X minutos/horas/dias" em PT-BR.
 * Ex.: "há 3 horas"
 */
export function tempoRelativo(isoString: string): string {
  try {
    return formatDistanceToNow(parseISO(isoString), {
      addSuffix: true,
      locale: ptBR,
    });
  } catch {
    return isoString;
  }
}

/**
 * Formata uma data ISO para "DD/MM/YYYY HH:mm".
 */
export function dataFormatada(isoString: string): string {
  try {
    return format(parseISO(isoString), "dd/MM/yyyy 'às' HH:mm", {
      locale: ptBR,
    });
  } catch {
    return isoString;
  }
}

/**
 * Trunca um texto em `maxChars` caracteres, adicionando "…" se necessário.
 */
export function truncar(texto: string, maxChars: number): string {
  if (texto.length <= maxChars) return texto;
  return texto.slice(0, maxChars).trimEnd() + "…";
}

/**
 * Mapeia editoria para uma cor de badge (Tailwind classes).
 * Adicione mais editorias conforme necessário.
 */
export function corEditoria(editoria: string | null): string {
  const mapa: Record<string, string> = {
    Política: "bg-blue-100 text-blue-700",
    Economia: "bg-emerald-100 text-emerald-700",
    Cultura: "bg-purple-100 text-purple-700",
    Esportes: "bg-orange-100 text-orange-700",
    Segurança: "bg-red-100 text-red-700",
    Saúde: "bg-teal-100 text-teal-700",
    Geral: "bg-ink-100 text-ink-600",
  };
  return mapa[editoria ?? ""] ?? "bg-ink-100 text-ink-600";
}
