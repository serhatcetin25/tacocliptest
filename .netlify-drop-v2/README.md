# TacoClip

Sistema de clipagem e pesquisa de materias jornalisticas para a TACO.

O caminho recomendado para producao e Netlify, usando o app Next.js da raiz do
repositorio. O diretorio `dashboard/` e uma SPA auxiliar/legada e nao precisa entrar
na publicacao principal.

## Stack

- Next.js 16 App Router
- React 18
- Tailwind CSS
- Prisma + SQLite para dados locais/futuros cadastros
- Google Noticias RSS sem chave obrigatoria
- Google Custom Search opcional via `GOOGLE_API_KEY` e `GOOGLE_CSE_ID`

## Desenvolvimento local

```powershell
npm install
npm run db:setup
npm run dev
```

Abra `http://localhost:3000/clipagens`.

## Variaveis de ambiente

Copie `.env.example` para `.env` em desenvolvimento.

Obrigatorias:

- `DATABASE_URL`: use `file:./dev.db` para SQLite local.
- `SESSION_SECRET`: string aleatoria longa.

Opcionais:

- `CORS_ORIGIN`: deixe vazio no Netlify se o frontend e a API estiverem no mesmo dominio.
- `GOOGLE_API_KEY` e `GOOGLE_CSE_ID`: habilitam Google Custom Search. Sem isso, o RSS gratuito continua funcionando.

## Comandos de qualidade

```powershell
npm run typecheck
npm run build
npm run test
```

## Deploy

Veja [DEPLOYMENT.md](./DEPLOYMENT.md) para publicar no Netlify.
