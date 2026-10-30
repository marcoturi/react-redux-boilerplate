/// <reference types="vite/client" />

// Variables from .env (copy .env.example with `pnpm create:env`). Read them
// only through src/shared/config/env.ts.
interface ViteTypeOptions {
  // Reading a variable not declared below is a type error
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_API_MOCKING?: string;
  readonly VITE_SENTRY_DSN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
