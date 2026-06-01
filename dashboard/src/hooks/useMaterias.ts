/**
 * Hook principal de dados: busca matérias com React Query.
 *
 * React Query cuida de:
 *  - Cache (não rebusca se os dados ainda são frescos)
 *  - Loading / error states
 *  - Refetch automático quando a janela volta ao foco
 *  - Deduplicação de requisições simultâneas
 */
import { useQuery } from "@tanstack/react-query";
import { getMaterias, getFacetas } from "@/lib/api";
import type { FiltrosMaterias } from "@/types";

// Chave de cache: muda quando qualquer filtro muda → React Query rebusca.
export function queryKeyMaterias(filtros: Partial<FiltrosMaterias>) {
  return ["materias", filtros] as const;
}

export function useMaterias(filtros: Partial<FiltrosMaterias>) {
  return useQuery({
    queryKey: queryKeyMaterias(filtros),
    queryFn: () => getMaterias(filtros),
    // Mantém dados anteriores visíveis enquanto carrega a próxima página
    placeholderData: (prev) => prev,
    // Considera dados frescos por 2 minutos (coleta é a cada 15-30 min)
    staleTime: 1000 * 60 * 2,
  });
}

export function useFacetas() {
  return useQuery({
    queryKey: ["facetas"] as const,
    queryFn: getFacetas,
    // Facetas mudam raramente — cache por 10 minutos
    staleTime: 1000 * 60 * 10,
  });
}
