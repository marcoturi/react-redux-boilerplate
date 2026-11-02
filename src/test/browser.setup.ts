import { worker } from '@/mocks/browser';
import { expectNoUnhandledRequests, failUnhandledFrame } from './msw-unhandled';

beforeAll(async () => {
  await worker.start({ quiet: true, onUnhandledFrame: failUnhandledFrame });
});

afterEach(() => {
  worker.resetHandlers();
  localStorage.clear();
  expectNoUnhandledRequests();
});

afterAll(() => {
  // A request sent after the last test's afterEach
  expectNoUnhandledRequests();
});
