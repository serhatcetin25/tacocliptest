# Guia de Deploy — TacoClip (Produção)

Este guia ensina como publicar o **TacoClip** em produção de forma 100% gratuita e com banco de dados permanente (PostgreSQL) usando **Neon** (ou Supabase) e **Vercel** (ou Netlify).

---

## 1. Criando o Banco de Dados PostgreSQL (Neon)

Recomendamos o **Neon.tech** por ser extremamente rápido e fácil de configurar, mas você também pode usar o **Supabase.com**.

1. Crie uma conta em [Neon.tech](https://neon.tech/).
2. Crie um novo projeto (ex: `tacoclip`).
3. Copie a **Connection String** gerada. Ela se parece com isto:
   `postgresql://neondb_owner:senha@ep-nome-projeto.us-east-2.aws.neon.tech/neondb?sslmode=require`
4. Guarde essa URL para os próximos passos.

---

## 2. Preparando o Banco de Dados

Antes de subir a aplicação web, precisamos estruturar o banco de dados e criar o usuário administrador inicial. Você pode fazer isso do seu computador local apontando temporariamente para o banco de produção:

1. No terminal do seu computador (no diretório do projeto `tacoclip`), defina temporariamente a variável do banco de produção:
   - No **PowerShell** (Windows):
     ```powershell
     $env:DATABASE_URL="sua_url_do_neon_aqui"
     ```
   - No **Bash** (Linux/Mac) ou Git Bash:
     ```bash
     export DATABASE_URL="sua_url_do_neon_aqui"
     ```
2. Execute o comando para criar as tabelas no PostgreSQL:
   ```bash
   npx prisma db push
   ```
3. Crie os dados padrões de inicialização (usuário `admin` e cliente padrão `TACO Comunicação`):
   ```bash
   npm run db:seed
   ```
   *Nota: O usuário padrão criado será `admin` com a senha `tacoclip-admin`. Você poderá alterar os dados no banco mais tarde.*

---

## 3. Hospedando a Aplicação (Vercel ou Netlify)

### Opção A: Vercel (Recomendado)
A Vercel é a criadora do Next.js e oferece o deploy mais simples e rápido.

1. Suba este repositório para o seu **GitHub** (pode ser um repositório privado).
2. Acesse [Vercel.com](https://vercel.com/) e crie uma conta gratuita.
3. Clique em **Add New > Project** e selecione o repositório do TacoClip.
4. Em **Environment Variables** (Variáveis de Ambiente), adicione:
   - `DATABASE_URL`: a connection string do seu banco Neon/Supabase.
   - `SESSION_SECRET`: gere uma chave forte rodando no terminal:
     `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
5. Clique em **Deploy**. A aplicação estará no ar em instantes!

### Opção B: Netlify
Se preferir usar o Netlify, o arquivo `netlify.toml` já está configurado.

1. Suba o repositório para o **GitHub**.
2. Acesse [Netlify.com](https://netlify.com/) e crie um site a partir do repositório.
3. Em **Environment variables**, adicione:
   - `DATABASE_URL`: a connection string do seu banco Neon/Supabase.
   - `SESSION_SECRET`: a chave secreta gerada.
4. Publique o site.

---

## 4. Checklist de Produção e Testes

Após o deploy, verifique as seguintes URLs para garantir que tudo está funcionando:

1. **Teste de Saúde (API):**
   - Acesse `https://seu-app.vercel.app/api/health`
     Deve responder: `{"status":"ok"}`
   - Acesse `https://seu-app.vercel.app/api/health?deep=1`
     Deve responder: `{"status":"ok","database":"connected"}` (confirmando que a conexão com o Postgres está funcionando).
2. **Interface do Usuário:**
   - Acesse a URL principal do seu app e faça login com `admin` e senha `tacoclip-admin`.
   - Navegue até **Fila de Revisão** ou **Clipagens** e faça uma busca para testar a captura.
