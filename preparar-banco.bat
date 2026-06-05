@echo off
chcp 65001 > nul
echo ========================================================
echo   TacoClip — Inicialização do Banco Neon (Produção)
echo ========================================================
echo.
echo Lendo as configurações do seu arquivo .env...
echo.

:: Executa a criação das tabelas no Postgres
echo Executando: npx prisma db push...
call npx prisma db push
if %errorlevel% neq 0 (
    echo.
    echo [ERRO] Ocorreu uma falha ao enviar a estrutura para o banco.
    echo Verifique sua conexão e se a URL no arquivo .env está correta.
    echo.
    pause
    exit /b %errorlevel%
)

echo.
echo ========================================================
echo   Estrutura de tabelas criada com sucesso no Neon!
echo ========================================================
echo.

:: Executa o seed para cadastrar o admin
echo Executando: npm run db:seed...
call npm run db:seed
if %errorlevel% neq 0 (
    echo.
    echo [ERRO] Falha ao cadastrar o administrador padrão.
    echo.
    pause
    exit /b %errorlevel%
)

echo.
echo ========================================================
echo   Administrador cadastrado com sucesso!
echo   Usuário: admin
echo   Senha: tacoclip-admin
echo ========================================================
echo.
echo Banco de dados Neon 100%% configurado e pronto!
echo.
pause
