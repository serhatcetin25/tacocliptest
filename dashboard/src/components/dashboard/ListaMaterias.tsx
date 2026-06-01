/**
 * Lista de matérias com estados de loading, vazio e erro.
 * Recebe os dados já processados pelo hook useMaterias.
 */
import { MateriaCard } from "./MateriaCard";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import type { PaginaMaterias } from "@/types";

interface ListaMateriasProps {
  dados: PaginaMaterias | undefined;
  carregando: boolean;
  erro: Error | null;
  onRetry: () => void;
  onLimparFiltros: () => void;
}

export function ListaMaterias({
  dados,
  carregando,
  erro,
  onRetry,
  onLimparFiltros,
}: ListaMateriasProps) {
  // ── Estado: erro ──────────────────────────────────────────────────────────
  if (erro) {
    return (
      <ErrorState
        mensagem={erro.message}
        onRetry={onRetry}
      />
    );
  }

  // ── Estado: carregando (primeira carga — sem dados anteriores) ────────────
  if (carregando && !dados) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" />
          <p className="text-sm text-ink-500">Buscando matérias…</p>
        </div>
      </div>
    );
  }

  // ── Estado: vazio ─────────────────────────────────────────────────────────
  if (dados && dados.data.length === 0) {
    return (
      <EmptyState
        acao={
          <button onClick={onLimparFiltros} className="tc-btn-primary">
            Limpar filtros
          </button>
        }
      />
    );
  }

  // ── Estado: lista ─────────────────────────────────────────────────────────
  return (
    <div
      // Opacidade reduzida durante refetch (troca de página/filtro)
      className={carregando ? "opacity-60 pointer-events-none" : ""}
      aria-busy={carregando}
    >
      <div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
        {dados?.data.map((materia) => (
          <MateriaCard key={materia.id} materia={materia} />
        ))}
      </div>
    </div>
  );
}
