import { NextRequest, NextResponse } from "next/server";
import { withCors } from "@/lib/cors";

export const dynamic = "force-dynamic";

export function OPTIONS(request: NextRequest) {
  return withCors(new NextResponse(null, { status: 204 }), request);
}

export function GET(request: NextRequest) {
  return withCors(
    NextResponse.json({
      veiculos: [],
      regioes: [],
      editorias: ["Notícia"],
    }),
    request
  );
}
