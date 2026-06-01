/**
 * App root do TacoClip.
 * Layout: Header fixo + Sidebar + conteúdo principal (DashboardPage).
 * Quando houver rotas (detalhe de matéria, relatórios, etc.), adicionar
 * react-router aqui. Por ora, SPA de página única.
 */
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardPage } from "@/pages/DashboardPage";

export function App() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Header fixo no topo */}
      <Header />

      {/* Corpo: sidebar + conteúdo */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        {/* Área principal com scroll */}
        <main className="flex-1 overflow-y-auto bg-ink-50">
          <DashboardPage />
        </main>
      </div>
    </div>
  );
}
