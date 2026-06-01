/**
 * Página principal do TacoClip — Dashboard de Clipping.
 *
 * Orquestra:
 *  - Filtros (FiltroBar)
 *  - Estatísticas (StatsBar)
 *  - Lista de matérias (ListaMaterias)
 *  - Paginação
 *
 * Usa os hooks useFiltros (estado na URL) e useMaterias (React Query).
 */
import { useCallback, useEffect, useState } from "react";
import { FiltroBar } from "@/components/dashboard/FiltroBar";
import { ListaMaterias } from "@/components/dashboard/ListaMaterias";
import { Paginacao } from "@/components/dashboard/Paginacao";
import { StatsBar } from "@/components/dashboard/StatsBar";
import { useMaterias, useFacetas } from "@/hooks/useMaterias";
import { FILTROS_PADRAO, type FiltrosMaterias } from "@/types";

/**
 * Hook local que sincroniza filtros com a URL.
 * Usa useState + popstate para re-render quando a URL muda.
 */
function useFiltrosUrl() {
  const lerUrl = useCallback((): FiltrosMaterias => {
    const p = new URLSearchParams(window.location.search);
    return {
      q: p.get("q") ?? FILTROS_PADRAO.q,
      veiculo: p.get("veiculo") ?? FILTROS_PADRAO.veiculo,
      regiao: p.get("regiao") ?? FILTROS_PADRAO.regiao,
      editoria: p.get("editoria") ?? FILTROS_PADRAO.editoria,
      dataInicio: p.get("dataInicio") ?? FILTROS_PADRAO.dataInicio,
      dataFim: p.get("dataFim") ?? FILTROS_PADRAO.dataFim,
      ordem: (p.get("ordem") as FiltrosMaterias["ordem"]) ?? FILTROS_PADRAO.ordem,
      pagina: Number(p.get("pagina") ?? FILTROS_PADRAO.pagina),
      porPagina: Number(p.get("porPagina") ?? FILTROS_PADRAO.porPagina),
    };
  }, []);

  const [filtros, setFiltrosState] = useState<FiltrosMaterias>(lerUrl);

  // Escuta mudanças na URL (popstate) para re-sincronizar
  useEffect(() => {
    const handler = () => setFiltrosState(lerUrl());
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, [lerUrl]);

  const gravarUrl = useCallback(
    (novo: FiltrosMaterias) => {
      const p = new URLSearchParams();
      for (const [k, v] of Object.entries(novo)) {
        const padrao = FILTROS_PADRAO[k as keyof FiltrosMaterias];
        if (String(v) !== String(padrao)) {
          p.set(k, String(v));
        }
      }
      const qs = p.toString() ? `?${p.toString()}` : window.location.pathname;
      window.history.replaceState(null, "", qs);
      setFiltrosState(novo);
    },
    []
  );

  const setFiltros = useCallback(
    (parcial: Partial<FiltrosMaterias>) => {
      setFiltrosState((prev) => {
        const resetPagina = Object.keys(parcial).some((k) => k !== "pagina")
          ? { pagina: 1 }
          : {};
        const novo = { ...prev, ...resetPagina, ...parcial };
        gravarUrl(novo);
        return novo;
      });
    },
    [gravarUrl]
  );

  const resetFiltros = useCallback(() => {
    gravarUrl(FILTROS_PADRAO);
  }, [gravarUrl]);

  return { filtros, setFiltros, resetFiltros };
}

// ─── Componente da página ─────────────────────────────────────────────────────

export function DashboardPage() {
  const { filtros, setFiltros, resetFiltros } = useFiltrosUrl();

  // Dados
  const {
    data: materias,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useMaterias(filtros);

  const { data: facetas } = useFacetas();

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6 max-w-7xl mx-auto w-full">
      {/* Título da página */}
      <div>
        <h1 className="text-xl font-bold text-ink-900">Dashboard de Clipping</h1>
        <p className="text-sm text-ink-500">
          Monitoramento de notícias de Santa Catarina em tempo quase real.
        </p>
      </div>

      {/* Estatísticas */}
      <StatsBar dados={materias} facetas={facetas} />

      {/* Filtros */}
      <FiltroBar
        filtros={filtros}
        facetas={facetas}
        onChange={setFiltros}
        onReset={resetFiltros}
        carregando={isFetching}
      />

      {/* Lista de matérias */}
      <ListaMaterias
        dados={materias}
        carregando={isLoading || isFetching}
        erro={error}
        onRetry={() => void refetch()}
        onLimparFiltros={resetFiltros}
      />

      {/* Paginação */}
      {materias && (
        <Paginacao
          pagina={materias.pagina}
          totalPaginas={materias.totalPaginas}
          total={materias.total}
          onChange={(p) => setFiltros({ pagina: p })}
          carregando={isFetching}
        />
      )}
    </div>
  );
}
