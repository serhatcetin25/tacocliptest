/// <reference types="vite/client" />

// Tipagem das variáveis de ambiente expostas ao front (prefixo VITE_).
interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_USE_MOCK_FALLBACK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
