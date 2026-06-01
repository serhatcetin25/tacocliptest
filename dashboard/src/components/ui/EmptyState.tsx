import { SearchX } from "lucide-react";

interface EmptyStateProps {
  titulo?: string;
  descricao?: string;
  acao?: React.ReactNode;
}

export function EmptyState({
  titulo = "Nenhuma matéria encontrada",
  descricao = "Tente ajustar os filtros ou o termo de busca.",
  acao,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-ink-100">
        <SearchX className="h-8 w-8 text-ink-400" />
      </div>
      <h3 className="mb-1 text-base font-semibold text-ink-700">{titulo}</h3>
      <p className="mb-4 max-w-xs text-sm text-ink-500">{descricao}</p>
      {acao}
    </div>
  );
}
