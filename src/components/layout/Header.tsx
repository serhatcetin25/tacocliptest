import { LogOut, UserCircle2 } from "lucide-react";

interface HeaderProps {
  nomeUsuario?: string;
}

/**
 * Header do app: nome do usuário logado + botão sair.
 * O botão sair vira funcional quando a autenticação estiver plugada.
 */
export function Header({ nomeUsuario = "Convidado" }: HeaderProps) {
  return (
    <header className="flex h-14 items-center justify-end gap-3 border-b border-ink-200 bg-white px-4">
      <div className="flex items-center gap-2 text-sm text-ink-600">
        <UserCircle2 className="h-5 w-5 text-ink-400" />
        <span className="font-medium text-ink-800">{nomeUsuario}</span>
      </div>
      <form action="/api/auth/logout" method="post">
        <button type="submit" className="tc-btn-ghost text-sm" title="Sair">
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </form>
    </header>
  );
}
