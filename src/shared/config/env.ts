import { version } from '../../../package.json';

const { MODE, VITE_API_URL, VITE_API_MOCKING, VITE_SENTRY_DSN } = import.meta
  .env;

// Fail with a clear message instead of a broken base URL
if (!VITE_API_URL) {
  throw new Error('VITE_API_URL is not set: run `pnpm create:env`');
}

const env = {
  VERSION: version,
  SENTRY_DSN: VITE_SENTRY_DSN,
  NODE_ENV: MODE,
  IS_DEV: MODE === 'development',
  API_URL: VITE_API_URL,
  // Serve the API from the MSW handlers in src/test (development only)
  API_MOCKING: VITE_API_MOCKING === 'true',
};

export default env;
