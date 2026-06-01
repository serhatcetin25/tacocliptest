# TacoClip — Dashboard (Fase 3)

SPA React que consome a API de busca (Fase 2) e exibe o dashboard de clipagem jornalística de Santa Catarina.

## Stack

- **React 18** + **TypeScript** (strict)
- **Vite** (bundler + dev server)
- **Tailwind CSS** (estilização utilitária)
- **React Query** (cache, loading, erro)
- **Lucide React** (ícones)
- **date-fns** (formatação de datas em PT-BR)

## Pré-requisitos

- Node.js 18+
- npm 9+

## Início rápido

```bash
cd dashboard
npm install
npm run dev
```

Abra **http://localhost:5173** no navegador.

> **Sem a API no ar?** Sem problema. Com `VITE_USE_MOCK_FALLBACK=true` (padrão no `.env`), o dashboard carrega dados de exemplo de veículos de SC para você ver o layout completo.

## Variáveis de ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `VITE_API_URL` | URL base da API Fastify (Fase 2) | `http://localhost:3333` |
| `VITE_USE_MOCK_FALLBACK` | Se `true`, usa dados mock quando a API não responde | `true` |

## Estrutura de pastas

```
src/
├── components/
│   ├── dashboard/     # Componentes específicos do dashboard
│   │   ├── FiltroBar.tsx
│   │   ├── ListaMaterias.tsx
│   │   ├── MateriaCard.tsx
│   │   ├── Paginacao.tsx
│   │   └── StatsBar.tsx
│   ├── layout/        # Header, Sidebar
│   └── ui/            # Componentes genéricos (Badge, Spinner, etc.)
├── hooks/             # React hooks customizados
├── lib/               # API client, utilitários, mock data
├── pages/             # Páginas (DashboardPage)
├── types/             # Tipos TypeScript centrais
├── App.tsx
├── main.tsx
└── index.css          # Tailwind + tokens de tema
```

## Scripts

| Comando | O que faz |
|---------|-----------|
| `npm run dev` | Dev server com hot reload (porta 5173) |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Serve o build localmente |
| `npm run typecheck` | Verifica tipos sem emitir |
| `npm run lint` | ESLint |

## Conectando à API real

1. Suba a API Fastify (Fase 2) na porta 3333.
2. No `.env`, mude `VITE_USE_MOCK_FALLBACK=false`.
3. Reinicie o dev server.

O Vite proxy (`/api` → `localhost:3333`) cuida do CORS em desenvolvimento.

## Próximos passos

- **Fase 4 — NLP**: Sentimento, classificação automática e tags (ganchos já preparados nos componentes).
- **Fase 5 — Alertas**: Notificações por e-mail/push quando surgir matéria relevante.
- **Fase 6 — Relatórios**: Exportação PDF/Excel e envio automático.
- **Fase 7 — Auth + Multi-tenant**: Login, permissões, isolamento por cliente/projeto.
