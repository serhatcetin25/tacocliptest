/**
 * Dados de exemplo para desenvolvimento sem API no ar.
 * Ativado quando VITE_USE_MOCK_FALLBACK=true e a API não responde.
 * Cobre os principais veículos de SC para você ver o dashboard populado.
 */
import type { Materia, FacetasResponse, PaginaMaterias } from "@/types";

export const MOCK_MATERIAS: Materia[] = [
  {
    id: "1",
    titulo: "Governo de SC anuncia investimento de R$ 500 milhões em infraestrutura",
    resumo:
      "O governador anunciou nesta segunda-feira um pacote de obras que vai beneficiar 50 municípios catarinenses, com foco em rodovias e saneamento básico.",
    url: "https://nsc.com.br/exemplo-1",
    autor: "Redação NSC",
    publicadoEm: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min atrás
    veiculo: "NSC Total",
    regiao: "Grande Florianópolis",
    editoria: "Política",
    sentimento: null,
    tags: [],
  },
  {
    id: "2",
    titulo: "Joinville registra recorde de exportações no primeiro semestre",
    resumo:
      "A cidade exportou US$ 1,2 bilhão em produtos industrializados entre janeiro e junho, crescimento de 18% em relação ao mesmo período do ano anterior.",
    url: "https://ndmais.com.br/exemplo-2",
    autor: "Fernanda Luz",
    publicadoEm: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1h30
    veiculo: "ND Mais",
    regiao: "Norte Catarinense",
    editoria: "Economia",
    sentimento: null,
    tags: [],
  },
  {
    id: "3",
    titulo: "Blumenau prepara programação especial para o Oktoberfest 2026",
    resumo:
      "A prefeitura confirmou que a festa terá 18 dias de duração e espera receber mais de 700 mil visitantes. Ingressos entram em pré-venda na próxima semana.",
    url: "https://ricmais.com.br/exemplo-3",
    autor: "Carlos Meier",
    publicadoEm: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3h
    veiculo: "RIC Mais",
    regiao: "Vale do Itajaí",
    editoria: "Cultura",
    sentimento: null,
    tags: [],
  },
  {
    id: "4",
    titulo: "Chapecó inaugura novo terminal de cargas no aeroporto regional",
    resumo:
      "O terminal vai ampliar a capacidade de escoamento da produção agroindustrial do Oeste catarinense, reduzindo custos logísticos para exportadores da região.",
    url: "https://diariocatarinense.com.br/exemplo-4",
    autor: "Marcos Bortoluzzi",
    publicadoEm: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5h
    veiculo: "Diário Catarinense",
    regiao: "Oeste Catarinense",
    editoria: "Economia",
    sentimento: null,
    tags: [],
  },
  {
    id: "5",
    titulo: "Florianópolis lidera ranking de qualidade de vida entre capitais do Sul",
    resumo:
      "Pesquisa do IBGE aponta a capital catarinense em primeiro lugar em indicadores de saneamento, educação e segurança pública entre as capitais da região Sul.",
    url: "https://cbn.com.br/exemplo-5",
    autor: "Jornalismo CBN Diário",
    publicadoEm: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8h
    veiculo: "CBN Diário",
    regiao: "Grande Florianópolis",
    editoria: "Geral",
    sentimento: null,
    tags: [],
  },
  {
    id: "6",
    titulo: "Figueirense anuncia contratação de atacante para a Série C",
    resumo:
      "O clube florianopolitano fechou com o centroavante Rodrigo Santos, ex-Criciúma, para reforçar o ataque na disputa pelo acesso à Série B do Campeonato Brasileiro.",
    url: "https://nsc.com.br/exemplo-6",
    autor: "Pedro Alves",
    publicadoEm: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12h
    veiculo: "NSC Total",
    regiao: "Grande Florianópolis",
    editoria: "Esportes",
    sentimento: null,
    tags: [],
  },
  {
    id: "7",
    titulo: "Itajaí registra maior movimento portuário da história em maio",
    resumo:
      "O Porto de Itajaí movimentou 1,1 milhão de toneladas no mês, superando o recorde anterior de 2023. Contêineres de soja e frango lideraram as exportações.",
    url: "https://ndmais.com.br/exemplo-7",
    autor: "Redação ND",
    publicadoEm: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), // 18h
    veiculo: "ND Mais",
    regiao: "Vale do Itajaí",
    editoria: "Economia",
    sentimento: null,
    tags: [],
  },
  {
    id: "8",
    titulo: "SC registra queda de 12% nos acidentes de trânsito no primeiro trimestre",
    resumo:
      "Dados da PRF apontam redução significativa nas rodovias federais catarinenses. Campanha de conscientização e fiscalização eletrônica são apontadas como fatores.",
    url: "https://ricmais.com.br/exemplo-8",
    autor: "Ana Paula Ramos",
    publicadoEm: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 dia
    veiculo: "RIC Mais",
    regiao: "Serra Catarinense",
    editoria: "Segurança",
    sentimento: null,
    tags: [],
  },
];

export const MOCK_FACETAS: FacetasResponse = {
  veiculos: ["NSC Total", "ND Mais", "RIC Mais", "Diário Catarinense", "CBN Diário", "Itapema FM"],
  regioes: [
    "Grande Florianópolis",
    "Norte Catarinense",
    "Vale do Itajaí",
    "Oeste Catarinense",
    "Serra Catarinense",
    "Sul Catarinense",
  ],
  editorias: ["Política", "Economia", "Cultura", "Esportes", "Segurança", "Saúde", "Geral"],
};

/** Simula a resposta paginada da API com filtros aplicados no cliente (só para mock). */
export function filtrarMock(
  filtros: {
    q?: string;
    veiculo?: string;
    regiao?: string;
    editoria?: string;
    pagina?: number;
    porPagina?: number;
  }
): PaginaMaterias {
  let resultado = [...MOCK_MATERIAS];

  if (filtros.q) {
    const termo = filtros.q.toLowerCase();
    resultado = resultado.filter(
      (m) =>
        m.titulo.toLowerCase().includes(termo) ||
        (m.resumo ?? "").toLowerCase().includes(termo)
    );
  }
  if (filtros.veiculo) {
    resultado = resultado.filter((m) => m.veiculo === filtros.veiculo);
  }
  if (filtros.regiao) {
    resultado = resultado.filter((m) => m.regiao === filtros.regiao);
  }
  if (filtros.editoria) {
    resultado = resultado.filter((m) => m.editoria === filtros.editoria);
  }

  const pagina = filtros.pagina ?? 1;
  const porPagina = filtros.porPagina ?? 20;
  const total = resultado.length;
  const inicio = (pagina - 1) * porPagina;

  return {
    data: resultado.slice(inicio, inicio + porPagina),
    total,
    pagina,
    porPagina,
    totalPaginas: Math.max(1, Math.ceil(total / porPagina)),
  };
}
