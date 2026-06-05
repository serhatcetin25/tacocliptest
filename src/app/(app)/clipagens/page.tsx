import Link from "next/link";
import {
  AlertCircle,
  Clock3,
  ExternalLink,
  Newspaper,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { formatarData } from "@/lib/utils";
import { searchNews, type NewsSearchResult } from "@/lib/search/news-service";

export const dynamic = "force-dynamic";

interface ClipagensPageProps {
  searchParams?: Promise<{
    q?: string | string[];
    ordem?: string | string[];
  }>;
}

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function formatarDataHora(value: string | null): string {
  if (!value) return "Data não informada";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Data não informada";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

async function buscarMaterias(
  query: string,
  ordem: "relevance" | "recent"
): Promise<NewsSearchResult> {
  if (!query) {
    return {
      query,
      searchedAt: new Date().toISOString(),
      results: [],
      warnings: [],
      providers: [],
    };
  }

  return searchNews(query, {
    limit: 80,
    sortBy: ordem,
    timeoutMs: 10_000,
  });
}

export default async function ClipagensPage({ searchParams }: ClipagensPageProps) {
  const resolvedSearchParams = await searchParams;
  const query = firstParam(resolvedSearchParams?.q).trim();
  const ordemParam = firstParam(resolvedSearchParams?.ordem);
  const ordem = ordemParam === "recente" ? "recent" : "relevance";
  const resultado = await buscarMaterias(query, ordem);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      <section className="space-y-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-ink-900">Clipagens</h1>
          <p className="text-sm text-ink-500">
            Pesquisa de matérias em fontes abertas de notícias.
          </p>
        </div>

        <form action="/clipagens" className="tc-card p-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_180px_auto]">
            <label className="relative block">
              <span className="sr-only">Termo de busca</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                name="q"
                type="search"
                defaultValue={query}
                placeholder="Ex.: fanfarra da ponte"
                className="tc-input h-11 pl-9"
                autoFocus
              />
            </label>

            <label className="relative block">
              <span className="sr-only">Ordenação</span>
              <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <select
                name="ordem"
                defaultValue={ordem === "recent" ? "recente" : "relevancia"}
                className="tc-input h-11 pl-9"
              >
                <option value="relevancia">Relevância</option>
                <option value="recente">Mais recentes</option>
              </select>
            </label>

            <div className="flex gap-2">
              <button type="submit" className="tc-btn-primary h-11 flex-1 px-5 lg:flex-none">
                <Search className="h-4 w-4" />
                Pesquisar
              </button>
              {query && (
                <Link href="/clipagens" className="tc-btn-ghost h-11 border border-ink-200 px-3">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Limpar</span>
                </Link>
              )}
            </div>
          </div>
        </form>
      </section>

      {!query && (
        <section className="grid gap-3 md:grid-cols-3">
          {["fanfarra da ponte", "Santa Catarina", "TACO Comunicação"].map((termo) => (
            <Link
              key={termo}
              href={`/clipagens?q=${encodeURIComponent(termo)}`}
              className="tc-card p-4 text-sm font-medium text-ink-700 transition-colors hover:border-brand-300 hover:text-brand-700"
            >
              {termo}
            </Link>
          ))}
        </section>
      )}

      {query && (
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 border-b border-ink-200 pb-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-ink-900">
                {resultado.results.length === 1
                  ? "1 matéria encontrada"
                  : `${resultado.results.length} matérias encontradas`}
              </p>
              <p className="text-xs text-ink-500">
                Busca por “{resultado.query}” em {formatarData(resultado.searchedAt)}
              </p>
            </div>
            {resultado.providers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {resultado.providers.map((provider) => (
                  <span
                    key={provider}
                    className="rounded-full border border-ink-200 bg-white px-2.5 py-1 text-xs font-medium text-ink-600"
                  >
                    {provider}
                  </span>
                ))}
              </div>
            )}
          </div>

          {resultado.warnings.length > 0 && (
            <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{resultado.warnings.join(" ")}</p>
            </div>
          )}

          {resultado.results.length === 0 ? (
            <div className="tc-card flex flex-col items-center justify-center gap-2 p-10 text-center">
              <Newspaper className="h-8 w-8 text-ink-300" />
              <h2 className="text-base font-semibold text-ink-800">
                Nenhuma matéria encontrada
              </h2>
              <p className="max-w-md text-sm text-ink-500">
                Tente uma variação do termo, nome da cidade, entidade ou veículo.
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {resultado.results.map((materia) => (
                <article
                  key={materia.id}
                  className="tc-card p-4 transition-colors hover:border-brand-300"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 font-semibold uppercase text-brand-700">
                      <Newspaper className="h-3.5 w-3.5" />
                      {materia.source}
                    </span>
                    <span className="inline-flex items-center gap-1 text-ink-400">
                      <Clock3 className="h-3.5 w-3.5" />
                      {formatarDataHora(materia.publishedAt)}
                    </span>
                  </div>

                  <h2 className="mt-2 text-base font-semibold leading-snug text-ink-900">
                    <a
                      href={materia.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-brand-700 hover:underline"
                    >
                      {materia.title}
                    </a>
                  </h2>

                  {materia.snippet && (
                    <p className="mt-2 text-sm leading-relaxed text-ink-600">
                      {materia.snippet}
                    </p>
                  )}

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-ink-100 px-2.5 py-1 text-xs font-medium text-ink-600">
                      {materia.provider}
                    </span>
                    <a
                      href={materia.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:underline"
                    >
                      Abrir matéria
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
