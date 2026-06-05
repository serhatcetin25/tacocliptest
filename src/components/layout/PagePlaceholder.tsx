import type { LucideIcon } from "lucide-react";

interface PagePlaceholderProps {
  titulo: string;
  descricao: string;
  icon: LucideIcon;
}

/**
 * Página placeholder usada enquanto cada módulo não foi implementado.
 * Mostra título, descrição e um aviso de "em construção".
 */
export function PagePlaceholder({ titulo, descricao, icon: Icon }: PagePlaceholderProps) {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink-900">{titulo}</h1>
        <p className="text-sm text-ink-500">{descricao}</p>
      </div>

      <div className="tc-card flex flex-col items-center justify-center gap-3 p-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <Icon className="h-7 w-7" />
        </div>
        <h2 className="text-base font-semibold text-ink-700">Módulo em construção</h2>
        <p className="max-w-sm text-sm text-ink-500">
          Esta área será implementada nas próximas etapas. O esqueleto, a navegação
          e o tema já estão funcionando.
        </p>
      </div>
    </div>
  );
}
