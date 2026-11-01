import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Node counterpart of browser.ts, started in src/test/unit.setup.ts for the
// `.spec.ts` files: they override a handler with server.use()
export const server = setupServer(...handlers);
