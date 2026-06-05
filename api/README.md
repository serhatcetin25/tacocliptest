# TacoClip API

Nao existe mais uma API Fastify separada para producao.

As rotas usadas pelo sistema estao dentro do app Next principal:

- `/api/health`
- `/api/materias`
- `/api/facetas`
- `/api/auth/logout`

Para deploy, suba a raiz do repositorio como app Next.js.
