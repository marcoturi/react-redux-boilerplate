import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Started by initMocks on the dev server, and by src/test/browser.setup.ts
// for the `.spec.tsx` files: they override a handler with worker.use()
export const worker = setupWorker(...handlers);
