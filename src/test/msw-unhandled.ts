import { HttpNetworkFrame } from 'msw/experimental';

const unhandledRequests: string[] = [];

export function failUnhandledFrame({
  frame,
}: {
  frame: { protocol: string; data: unknown };
}) {
  const request =
    frame instanceof HttpNetworkFrame ? frame.data.request : undefined;
  if (request && new URL(request.url).origin === globalThis.location?.origin) {
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
