import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { server } from '../src/test/server';

// jsdom lacks these layout and pointer capture APIs, which the Radix Select
// calls: https://github.com/testing-library/user-event/discussions/1087
HTMLElement.prototype.scrollIntoView = vi.fn();
HTMLElement.prototype.hasPointerCapture = vi.fn();
HTMLElement.prototype.releasePointerCapture = vi.fn();

// MSW's 'error' strategy only logs and fails the request, which a component
// may hide: collect unhandled requests and fail the test in afterEach
const unhandledRequests: string[] = [];

function describeFrame({
  protocol,
  data,
}: {
  protocol: string;
  data: unknown;
}) {
  if (
    typeof data === 'object' &&
    data !== null &&
    'request' in data &&
    data.request instanceof Request
  ) {
    return `${data.request.method} ${data.request.url}`;
  }
  return protocol;
}

beforeAll(() => {
  // MSW 3 name of the v2 onUnhandledRequest option
  server.listen({
    onUnhandledFrame: ({ frame, defaults }) => {
      defaults.error();
      unhandledRequests.push(describeFrame(frame));
    },
  });
});

afterEach(() => {
  server.resetHandlers();
  localStorage.clear();
  cleanup();
  expect(
    unhandledRequests.splice(0),
    'Requests without an MSW handler',
  ).toEqual([]);
});

afterAll(() => {
  server.close();
});
