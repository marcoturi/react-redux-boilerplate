import { version } from '../../../package.json';

const { DEV, MODE, PROD, VITE_API_URL, VITE_API_MOCKING, VITE_SENTRY_DSN } =
  import.meta.env;

// Fail with a clear message instead of a broken base URL
if (!VITE_API_URL) {
  throw new Error('VITE_API_URL is not set: run `pnpm create:env`');
}

const env = {
  VERSION: version,
  SENTRY_DSN: VITE_SENTRY_DSN,
  // Vite mode: `development`, `production`, `test` under Vitest, or --mode
  MODE,
  // The dev server and Vitest
  IS_DEV: DEV,
  // `vite build`, whatever the mode
  IS_PROD: PROD,
  API_URL: VITE_API_URL,
  // Serve the API from the MSW handlers in src/test (development only)
  API_MOCKING: VITE_API_MOCKING === 'true',
};

export default env;
