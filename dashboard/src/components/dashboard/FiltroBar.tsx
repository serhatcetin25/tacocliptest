/**
 * Barra de filtros do dashboard.
 * Contém: busca full-text, selects de veículo/região/editoria,
 * intervalo de datas e ordenação.
 *
 * Props:
 *  - filtros: estado atual dos filtros
 *  - facetas: opções disponíveis (vindas da API)
 *  - onChange: callback para atualizar um ou mais filtros
 *  - onReset: limpa todos os filtros
 *  - carregando: desabilita inputs enquanto busca
 */
import { Search, X, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { FacetasResponse, FiltrosMaterias } from "@/types";

interface FiltroBarProps {
  filtros: FiltrosMaterias;
  facetas: FacetasResponse | undefined;
  onChange: (parcial: Partial<FiltrosMaterias>) => void;
  onReset: () => void;
  carregando?: boolean;
}

export function FiltroBar({
  filtros,
  facetas,
  onChange,
  onReset,
  carregando = false,
}: FiltroBarProps) {
  // Controla exibição dos filtros avançados no mobile
  const [expandido, setExpandido] = useState(false);

  const temFiltroAtivo =
    filtros.q !== "" ||
    filtros.veiculo !== "" ||
    filtros.regiao !== "" ||
    filtros.editoria !== "" ||
    filtros.dataInicio !== "" ||
    filtros.dataFim !== "";

  return (
    <div className="tc-card p-4 space-y-3">
      {/* Linha 1: busca + botão de filtros avançados (mobile) */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2
                             -translate-y-1/2 h-4 w-4 text-ink-400" />
          <input
            type="search"
            placeholder="Buscar por palavra-chave…"
            value={filtros.q}
            disabled={carregando}
            onChange={(e) => onChange({ q: e.target.value })}
            className="tc-input pl-9"
            aria-label="Busca full-text"
          />
        </div>

        {/* Botão "Filtros" — só aparece no mobile */}
        <button
          onClick={() => setExpandido((v) => !v)}
          className={cn(
            "tc-btn border border-ink-200 md:hidden",
            expandido ? "bg-brand-50 text-brand-700" : "bg-white text-ink-600"
          )}
          aria-expanded={expandido}
          aria-label="Mostrar filtros"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Linha 2: filtros avançados — sempre visíveis no desktop, toggle no mobile */}
      <div
        className={cn(
          "grid gap-3 md:grid-cols-5",
          expandido ? "grid" : "hidden md:grid"
        )}
      >
        {/* Veículo */}
        <div>
          <label className="tc-label">Veículo</label>
          <select
            value={filtros.veiculo}
            disabled={carregando}
            onChange={(e) => onChange({ veiculo: e.target.value })}
            className="tc-input"
            aria-label="Filtrar por veículo"
          >
            <option value="">Todos</option>
            {facetas?.veiculos.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        {/* Região */}
        <div>
          <label className="tc-label">Região</label>
          <select
            value={filtros.regiao}
            disabled={carregando}
            onChange={(e) => onChange({ regiao: e.target.value })}
            className="tc-input"
            aria-label="Filtrar por região"
          >
            <option value="">Todas</option>
            {facetas?.regioes.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Editoria */}
        <div>
          <label className="tc-label">Editoria</label>
          <select
            value={filtros.editoria}
            disabled={carregando}
            onChange={(e) => onChange({ editoria: e.target.value })}
            className="tc-input"
            aria-label="Filtrar por editoria"
          >
            <option value="">Todas</option>
            {facetas?.editorias.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>

        {/* Data início */}
        <div>
          <label className="tc-label">De</label>
          <input
            type="date"
            value={filtros.dataInicio}
            disabled={carregando}
            onChange={(e) => onChange({ dataInicio: e.target.value })}
            className="tc-input"
            aria-label="Data início"
          />
        </div>

        {/* Data fim */}
        <div>
          <label className="tc-label">Até</label>
          <input
            type="date"
            value={filtros.dataFim}
            disabled={carregando}
            onChange={(e) => onChange({ dataFim: e.target.value })}
            className="tc-input"
            aria-label="Data fim"
          />
        </div>
      </div>

      {/* Linha 3: ordenação + limpar filtros */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="tc-label mb-0">Ordenar:</span>
          <div className="flex rounded-lg border border-ink-200 overflow-hidden text-sm">
            {(["recente", "relevancia"] as const).map((op) => (
              <button
                key={op}
                onClick={() => onChange({ ordem: op })}
                disabled={carregando}
                className={cn(
                  "px-3 py-1.5 font-medium transition-colors",
                  filtros.ordem === op
                    ? "bg-brand-600 text-white"
                    : "bg-white text-ink-600 hover:bg-ink-50"
                )}
              >
                {op === "recente" ? "Mais recente" : "Relevância"}
              </button>
            ))}
          </div>
        </div>

        {/* Limpar filtros — só aparece quando há filtro ativo */}
        {temFiltroAtivo && (
          <button
            onClick={onReset}
            className="tc-btn-ghost text-xs gap-1"
            aria-label="Limpar todos os filtros"
          >
            <X className="h-3.5 w-3.5" />
            Limpar filtros
          </button>
        )}
      </div>
    </div>
  );
}
