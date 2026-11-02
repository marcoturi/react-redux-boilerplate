/// <reference types="vite/client" />

interface ViteTypeOptions {
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_API_MOCKING?: string;
  readonly VITE_SENTRY_DSN?: string;
}
