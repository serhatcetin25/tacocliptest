import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

/**
 * Layout das áreas internas (autenticadas).
 * Sidebar fixa + header + conteúdo com scroll.
 *
 * Quando a autenticação estiver plugada, este layout fará a verificação
 * de sessão no servidor e passará o nome real do usuário ao Header.
 */
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header nomeUsuario="Assessor TACO" />
        <main className="flex-1 overflow-y-auto bg-ink-50 p-6">{children}</main>
      </div>
    </div>
  );
}
