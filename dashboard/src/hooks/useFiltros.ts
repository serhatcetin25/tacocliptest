/**
 * Hook que gerencia o estado dos filtros do dashboard.
 *
 * Mantém os filtros na URL (query string) para que:
 *  - O usuário possa copiar/compartilhar a busca.
 *  - O botão "voltar" do navegador funcione.
 *
 * Usa a API nativa URLSearchParams — sem dependência extra.
 */
import { useCallback, useMemo } from "react";
import { FILTROS_PADRAO, type FiltrosMaterias } from "@/types";

function lerUrl(): FiltrosMaterias {
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
}

function gravarUrl(filtros: FiltrosMaterias) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(filtros)) {
    const padrao = FILTROS_PADRAO[k as keyof FiltrosMaterias];
    // Só grava na URL se diferente do padrão (URL limpa)
    if (String(v) !== String(padrao)) {
      p.set(k, String(v));
    }
  }
  const nova = p.toString() ? `?${p.toString()}` : window.location.pathname;
  window.history.replaceState(null, "", nova);
}

export function useFiltros() {
  // Lê da URL a cada render (simples e suficiente para SPA sem router)
  const filtros = useMemo(() => lerUrl(), []);

  const setFiltros = useCallback(
    (parcial: Partial<FiltrosMaterias>) => {
      const atual = lerUrl();
      // Ao mudar qualquer filtro que não seja página, volta pra página 1
      const resetPagina =
        Object.keys(parcial).some((k) => k !== "pagina") ? { pagina: 1 } : {};
      const novo = { ...atual, ...resetPagina, ...parcial };
      gravarUrl(novo);
      // Força re-render disparando um evento de popstate
      window.dispatchEvent(new PopStateEvent("popstate"));
    },
    []
  );

  const resetFiltros = useCallback(() => {
    gravarUrl(FILTROS_PADRAO);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, []);

  return { filtros, setFiltros, resetFiltros };
}
