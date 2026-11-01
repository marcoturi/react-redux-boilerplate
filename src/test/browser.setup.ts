// Setup of the `browser` project (src/**/*.spec.tsx, Chromium through
// Playwright): components and pages. Requests go through the MSW service
// worker, the same one the dev server uses.
import '@testing-library/jest-dom/vitest';
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
  worker.stop();
  // A request sent after the last test's afterEach
  expectNoUnhandledRequests();
});
