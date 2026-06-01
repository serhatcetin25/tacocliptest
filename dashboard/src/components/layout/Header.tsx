/**
 * Header global do TacoClip.
 * Contém logo, nome do produto e (placeholder) área de usuário/notificações.
 */
import { Bell, User } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between
                       border-b border-ink-200 bg-white px-4 shadow-sm">
      {/* Logo + nome */}
      <div className="flex items-center gap-2">
        <img src="/taco.svg" alt="TacoClip logo" className="h-7 w-7" />
        <span className="text-lg font-bold tracking-tight text-ink-900">
          Taco<span className="text-brand-600">Clip</span>
        </span>
        <span className="ml-2 hidden rounded-full bg-brand-50 px-2 py-0.5
                         text-xs font-medium text-brand-700 sm:inline">
          Santa Catarina
        </span>
      </div>

      {/* Ações do header — placeholders para autenticação (Fase 5) */}
      <div className="flex items-center gap-1">
        {/* Placeholder: alertas/notificações */}
        <button
          className="tc-btn-ghost relative p-2"
          title="Alertas (em breve)"
          aria-label="Alertas"
        >
          <Bell className="h-4 w-4" />
          {/* Badge de notificação — ativar quando alertas estiverem prontos */}
          {/* <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" /> */}
        </button>

        {/* Placeholder: perfil do usuário */}
        <button
          className="tc-btn-ghost p-2"
          title="Perfil (em breve)"
          aria-label="Perfil"
        >
          <User className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
