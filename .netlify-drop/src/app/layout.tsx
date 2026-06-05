import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TacoClip — Clipagem de Mídia TACO",
  description: "Sistema interno de clipagem e monitoramento de mídia da assessoria TACO.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
