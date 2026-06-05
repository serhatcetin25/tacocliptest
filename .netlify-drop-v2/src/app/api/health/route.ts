import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { withCors } from "@/lib/cors";
import { isRuntimeConfigHealthy, runtimeConfigChecks } from "@/lib/runtime-config";

export function GET(request: NextRequest) {
  const deep = request.nextUrl.searchParams.get("deep") === "1";

  if (!deep) {
    return withCors(NextResponse.json({ status: "ok" }), request);
  }

  const healthy = isRuntimeConfigHealthy();
  return withCors(
    NextResponse.json(
      {
        status: healthy ? "ok" : "degraded",
        checks: runtimeConfigChecks(),
      },
      { status: healthy ? 200 : 503 }
    ),
    request
  );
}
