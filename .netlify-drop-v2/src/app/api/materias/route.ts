import { NextRequest, NextResponse } from "next/server";
import { withCors } from "@/lib/cors";
import { searchNews } from "@/lib/search/news-service";

export const dynamic = "force-dynamic";

interface MateriaApi {
  id: string;
  titulo: string;
  resumo: string | null;
  url: string;
  autor: string | null;
  publicadoEm: string;
  veiculo: string;
  regiao: string | null;
  editoria: string | null;
  sentimento: "positivo" | "negativo" | "neutro" | null;
  tags: string[];
}

function numberParam(value: string | null, fallback: number, min: number, max: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(Math.trunc(parsed), min), max);
}

function json(data: unknown, request: NextRequest, status = 200): NextResponse {
  return withCors(NextResponse.json(data, { status }), request);
}

export function OPTIONS(request: NextRequest) {
  return withCors(new NextResponse(null, { status: 204 }), request);
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const query = params.get("q")?.trim() || "Santa Catarina";
  const ordem = params.get("ordem") === "recente" ? "recent" : "relevance";
  const pagina = numberParam(params.get("pagina"), 1, 1, 999);
  const porPagina = numberParam(params.get("porPagina"), 20, 1, 50);
  const veiculo = params.get("veiculo")?.trim().toLowerCase() ?? "";
  const dataInicio = params.get("dataInicio");
  const dataFim = params.get("dataFim");

  const search = await searchNews(query, {
    limit: 100,
    sortBy: ordem,
    timeoutMs: 10_000,
  });

  let materias: MateriaApi[] = search.results.map((item) => ({
    id: item.id,
    titulo: item.title,
    resumo: item.snippet,
    url: item.link,
    autor: null,
    publicadoEm: item.publishedAt ?? search.searchedAt,
    veiculo: item.source,
    regiao: null,
    editoria: "Notícia",
    sentimento: null,
    tags: [item.provider],
  }));

  if (veiculo) {
    materias = materias.filter((materia) =>
      materia.veiculo.toLowerCase().includes(veiculo)
    );
  }

  if (dataInicio) {
    const min = new Date(`${dataInicio}T00:00:00`);
    if (!Number.isNaN(min.getTime())) {
      materias = materias.filter((materia) => new Date(materia.publicadoEm) >= min);
    }
  }

  if (dataFim) {
    const max = new Date(`${dataFim}T23:59:59`);
    if (!Number.isNaN(max.getTime())) {
      materias = materias.filter((materia) => new Date(materia.publicadoEm) <= max);
    }
  }

  const total = materias.length;
  const inicio = (pagina - 1) * porPagina;

  return json(
    {
      data: materias.slice(inicio, inicio + porPagina),
      total,
      pagina,
      porPagina,
      totalPaginas: Math.max(1, Math.ceil(total / porPagina)),
    },
    request
  );
}
