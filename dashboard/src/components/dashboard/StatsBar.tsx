/**
 * Barra de estatísticas rápidas no topo do dashboard.
 * Mostra contadores resumidos. No MVP usa dados da busca atual;
 * na Fase 4 pode puxar de um endpoint /stats dedicado.
 */
import { Newspaper, Globe, Building2, Clock } from "lucide-react";
import type { FacetasResponse, PaginaMaterias } from "@/types";

interface StatsBarProps {
  dados: PaginaMaterias | undefined;
  facetas: FacetasResponse | undefined;
}

export function StatsBar({ dados, facetas }: StatsBarProps) {
  const stats = [
    {
      icon: Newspaper,
      label: "Matérias",
      valor: dados?.total ?? "—",
    },
    {
      icon: Building2,
      label: "Veículos",
      valor: facetas?.veiculos.length ?? "—",
    },
    {
      icon: Globe,
      label: "Regiões",
      valor: facetas?.regioes.length ?? "—",
    },
    {
      icon: Clock,
      label: "Última coleta",
      valor: "~15 min", // Placeholder — conectar ao endpoint /health ou /stats
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="tc-card flex items-center gap-3 px-4 py-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg
                          bg-brand-50 text-brand-600">
            <s.icon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-lg font-bold text-ink-900">{s.valor}</p>
            <p className="text-xs text-ink-500">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
