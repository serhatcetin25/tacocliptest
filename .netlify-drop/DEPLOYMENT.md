# Deploy do TacoClip no Netlify

O jeito mais simples para este projeto e publicar no Netlify. Ele suporta Next.js App Router, SSR e route handlers com o adaptador OpenNext automaticamente. O arquivo `netlify.toml` ja configura:

- build command: `npm run build`
- publish directory: `.next`
- Node.js 22.12.0
- `DATABASE_URL=file:./dev.db` para o Prisma gerar o client durante o build
- `NETLIFY_NEXT_SKEW_PROTECTION=true`

Passos:

1. Suba este repositorio para GitHub.
2. Na Netlify, crie um novo site a partir do repositorio.
3. Confirme as configuracoes detectadas:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Em Environment variables, adicione:
   - `SESSION_SECRET`: gere com `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - `CORS_ORIGIN`: pode ficar vazio se o site usar o mesmo dominio da API.
   - `GOOGLE_API_KEY` e `GOOGLE_CSE_ID`: opcionais.
5. Publique.

Observacao: o sistema foi preparado para busca e leitura, entao funciona bem no Netlify mesmo para poucos usuarios. Se voce precisar de cadastros persistentes no futuro, a gente troca o SQLite por um banco externo.

## Checklist antes de publicar

- `npm run typecheck`
- `npm run build`
- `/api/health` responde `{ "status": "ok" }`
- `/api/health?deep=1` responde `status: ok`
- `/clipagens?q=fanfarra%20da%20ponte` renderiza resultados
- `SESSION_SECRET` nao esta com valor de exemplo
- `CORS_ORIGIN` definido somente se outro dominio for consumir a API
