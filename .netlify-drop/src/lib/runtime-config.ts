const PLACEHOLDER_SECRET = "replace-with-a-long-random-secret";

export interface RuntimeConfigCheck {
  name: string;
  ok: boolean;
  message: string;
}

function hasProductionSecret(): boolean {
  const secret = process.env.SESSION_SECRET?.trim() ?? "";
  return secret.length >= 32 && secret !== PLACEHOLDER_SECRET;
}

function hasDatabaseUrl(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function runtimeConfigChecks(): RuntimeConfigCheck[] {
  const corsOrigin = process.env.CORS_ORIGIN?.trim();

  return [
    {
      name: "database",
      ok: hasDatabaseUrl(),
      message: hasDatabaseUrl()
        ? "DATABASE_URL configurado."
        : "Defina DATABASE_URL antes de subir em producao.",
    },
    {
      name: "session_secret",
      ok: process.env.NODE_ENV !== "production" || hasProductionSecret(),
      message:
        process.env.NODE_ENV !== "production" || hasProductionSecret()
          ? "SESSION_SECRET adequado para o ambiente."
          : "Defina SESSION_SECRET com pelo menos 32 caracteres aleatorios.",
    },
    {
      name: "cors_origin",
      ok: true,
      message: corsOrigin
        ? "CORS_ORIGIN configurado para acesso externo a API."
        : "CORS_ORIGIN vazio; adequado quando site e API usam o mesmo dominio.",
    },
  ];
}

export function isRuntimeConfigHealthy(): boolean {
  return runtimeConfigChecks().every((check) => check.ok);
}
