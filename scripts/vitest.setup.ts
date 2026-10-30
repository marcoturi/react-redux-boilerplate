import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { server } from '../src/test/server';

// jsdom lacks these layout and pointer capture APIs, which the Radix Select
// calls: https://github.com/testing-library/user-event/discussions/1087
HTMLElement.prototype.scrollIntoView = vi.fn();
HTMLElement.prototype.hasPointerCapture = vi.fn();
HTMLElement.prototype.releasePointerCapture = vi.fn();

beforeAll(() => {
  // MSW 3 name of the v2 onUnhandledRequest option
  server.listen({ onUnhandledFrame: 'error' });
});

afterEach(() => {
  server.resetHandlers();
  localStorage.clear();
  cleanup();
});

afterAll(() => {
  server.close();
});
