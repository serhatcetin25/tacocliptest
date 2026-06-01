/**
 * Componente de paginação simples.
 * Mostra: "Página X de Y" + botões anterior/próximo.
 */
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginacaoProps {
  pagina: number;
  totalPaginas: number;
  total: number;
  onChange: (novaPagina: number) => void;
  carregando?: boolean;
}

export function Paginacao({
  pagina,
  totalPaginas,
  total,
  onChange,
  carregando = false,
}: PaginacaoProps) {
  if (totalPaginas <= 1) return null;

  return (
    <div className="flex items-center justify-between pt-4">
      <p className="text-xs text-ink-500">
        <span className="font-medium text-ink-700">{total}</span>{" "}
        {total === 1 ? "matéria encontrada" : "matérias encontradas"}
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(pagina - 1)}
          disabled={pagina <= 1 || carregando}
          className={cn("tc-btn-ghost p-2", pagina <= 1 && "opacity-30")}
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <span className="text-sm text-ink-600">
          {pagina} <span className="text-ink-400">de</span> {totalPaginas}
        </span>

        <button
          onClick={() => onChange(pagina + 1)}
          disabled={pagina >= totalPaginas || carregando}
          className={cn("tc-btn-ghost p-2", pagina >= totalPaginas && "opacity-30")}
          aria-label="Próxima página"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
