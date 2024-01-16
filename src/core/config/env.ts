import { version } from '../../../package.json';

const env = {
  VERSION: version,
  SENTRY_DSN: undefined, // import.meta.env.VITE_SENTRY_DSN,
  NODE_ENV: import.meta.env.MODE,
  IS_DEV: import.meta.env.MODE === 'development',
  APP_NAME: 'my_app',
  API_URL: import.meta.env.VITE_API_URL,
};

export default env;
