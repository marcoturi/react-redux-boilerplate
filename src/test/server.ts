import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Node counterpart of browser.ts, started in scripts/vitest.setup.ts: specs
// override a handler with server.use()
export const server = setupServer(...handlers);
