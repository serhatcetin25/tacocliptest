import type { NextRequest, NextResponse } from "next/server";

function configuredOrigins(): string[] {
  return (process.env.CORS_ORIGIN ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function resolveCorsOrigin(request?: NextRequest): string | null {
  const origins = configuredOrigins();

  if (origins.length === 0) {
    return process.env.NODE_ENV === "production" ? null : "*";
  }

  if (origins.includes("*")) return "*";

  const requestOrigin = request?.headers.get("origin");
  if (requestOrigin && origins.includes(requestOrigin)) {
    return requestOrigin;
  }

  return origins[0] ?? null;
}

export function withCors(response: NextResponse, request?: NextRequest): NextResponse {
  const origin = resolveCorsOrigin(request);

  if (origin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Vary", "Origin");
  }

  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}
