import { server } from '@/mocks/node';
import { expectNoUnhandledRequests, failUnhandledFrame } from './msw-unhandled';

beforeAll(() => {
  server.listen({ onUnhandledFrame: failUnhandledFrame });
});

afterEach(() => {
  server.resetHandlers();
  localStorage.clear();
  expectNoUnhandledRequests();
});

afterAll(() => {
  server.close();
  // A request sent after the last test's afterEach
  expectNoUnhandledRequests();
});
