import { HttpNetworkFrame } from 'msw/experimental';

// Shared by both setup files. A request without a handler gets an error
// response from MSW instead of reaching the network. A component may hide that
// behind its error state, so the test fails as well.
const unhandledRequests: string[] = [];

// The `onUnhandledFrame` callback (MSW 3 name of `onUnhandledRequest`). With a
// callback, MSW sends the request to the network unless it throws: throwing
// turns it into an error response.
export function failUnhandledFrame({
  frame,
}: {
  frame: { protocol: string; data: unknown };
}) {
  const request =
    frame instanceof HttpNetworkFrame ? frame.data.request : undefined;
  // In the browser project the page also fetches its own modules (lazy routes)
  // from the Vitest server: let same-origin requests through. The API is on
  // another origin (VITE_API_URL).
  if (request && new URL(request.url).origin === globalThis.location.origin) {
    return;
  }
  const description = request
    ? `${request.method} ${request.url}`
    : frame.protocol;
  unhandledRequests.push(description);
  throw new Error(`No MSW handler for ${description}`);
}

export function expectNoUnhandledRequests() {
  expect(
    unhandledRequests.splice(0),
    'Requests without an MSW handler',
  ).toEqual([]);
}
