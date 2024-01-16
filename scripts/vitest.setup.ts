import { handlers } from '../src/test/handlers';
import { setupServer } from 'msw/node';

export const server = setupServer(...handlers);

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
