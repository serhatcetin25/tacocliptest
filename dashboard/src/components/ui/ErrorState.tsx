import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  mensagem?: string;
  onRetry?: () => void;
}

export function ErrorState({
  mensagem = "Não foi possível carregar as matérias.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
        <AlertTriangle className="h-8 w-8 text-red-400" />
      </div>
      <h3 className="mb-1 text-base font-semibold text-ink-700">Erro ao carregar</h3>
      <p className="mb-4 max-w-xs text-sm text-ink-500">{mensagem}</p>
      {onRetry && (
        <button onClick={onRetry} className="tc-btn-primary">
          Tentar novamente
        </button>
      )}
    </div>
  );
}
