import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { server } from '../src/test/server';

declare let window: Window & typeof globalThis;

// Needed for testing Radix Select component
// https://github.com/testing-library/user-event/discussions/1087
window.PointerEvent = class PointerEvent extends Event {};
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  server.resetHandlers();
  localStorage.clear();
  cleanup();
});

afterAll(() => {
  server.close();
});
