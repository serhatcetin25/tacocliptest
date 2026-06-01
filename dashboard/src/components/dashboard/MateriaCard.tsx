/**
 * Card de uma matéria na lista do dashboard.
 * Exibe: título, resumo, veículo, região, editoria, data e link.
 *
 * Ganchos para Fase 4 (NLP):
 *  - Badge de sentimento (comentado, ativa quando sentimento != null)
 *  - Área de tags (comentada, ativa quando tags.length > 0)
 */
import { ExternalLink, MapPin, Clock, Newspaper } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { corEditoria, tempoRelativo, dataFormatada, truncar } from "@/lib/utils";
import type { Materia } from "@/types";

interface MateriaCardProps {
  materia: Materia;
}

export function MateriaCard({ materia }: MateriaCardProps) {
  return (
    <article
      className="tc-card p-4 flex flex-col gap-3 hover:border-brand-300
                 hover:shadow-md transition-all duration-150"
    >
      {/* Linha superior: veículo + editoria + sentimento (placeholder NLP) */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Veículo */}
        <span className="flex items-center gap-1 text-xs font-semibold
                         text-brand-700 uppercase tracking-wide">
          <Newspaper className="h-3 w-3" />
          {materia.veiculo}
        </span>

        {/* Editoria */}
        {materia.editoria && (
          <Badge className={corEditoria(materia.editoria)}>
            {materia.editoria}
          </Badge>
        )}

        {/* ── GANCHO FASE 4: Sentimento ──────────────────────────────────────
            Descomente quando o NLP estiver ativo e retornando sentimento.
        {materia.sentimento && (
          <Badge className={cn(
            materia.sentimento === "positivo" && "bg-green-100 text-green-700",
            materia.sentimento === "negativo" && "bg-red-100 text-red-700",
            materia.sentimento === "neutro"   && "bg-ink-100 text-ink-600",
          )}>
            {materia.sentimento === "positivo" ? "😊 Positivo"
              : materia.sentimento === "negativo" ? "😟 Negativo"
              : "😐 Neutro"}
          </Badge>
        )}
        ─────────────────────────────────────────────────────────────────── */}

        {/* Data — alinhada à direita */}
        <time
          dateTime={materia.publicadoEm}
          title={dataFormatada(materia.publicadoEm)}
          className="ml-auto flex items-center gap-1 text-xs text-ink-400"
        >
          <Clock className="h-3 w-3" />
          {tempoRelativo(materia.publicadoEm)}
        </time>
      </div>

      {/* Título */}
      <h2 className="text-sm font-semibold leading-snug text-ink-900
                     line-clamp-2 group-hover:text-brand-700">
        <a
          href={materia.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-brand-600 hover:underline"
        >
          {materia.titulo}
        </a>
      </h2>

      {/* Resumo */}
      {materia.resumo && (
        <p className="text-xs leading-relaxed text-ink-500 line-clamp-2">
          {truncar(materia.resumo, 200)}
        </p>
      )}

      {/* Linha inferior: região + link externo */}
      <div className="flex items-center justify-between pt-1">
        {/* Região */}
        {materia.regiao ? (
          <span className="flex items-center gap-1 text-xs text-ink-400">
            <MapPin className="h-3 w-3" />
            {materia.regiao}
          </span>
        ) : (
          <span />
        )}

        {/* ── GANCHO FASE 4: Tags ────────────────────────────────────────────
            Descomente quando tags estiverem sendo geradas pelo NLP.
        {materia.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {materia.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} className="bg-ink-100 text-ink-600">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
        ─────────────────────────────────────────────────────────────────── */}

        {/* Link para a matéria original */}
        <a
          href={materia.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs font-medium text-brand-600
                     hover:text-brand-700 hover:underline"
          aria-label={`Ler matéria completa: ${materia.titulo}`}
        >
          Ler matéria
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </article>
  );
}
