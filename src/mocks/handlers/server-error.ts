import { HttpResponse, http } from 'msw';

// A new handler on every call: a `once` handler stays used after its first
// match, so a shared instance would be skipped by the next test
export const serverErrorOnce = (url: string) =>
  http.get(
    url,
    () => HttpResponse.json({ message: 'Server Error' }, { status: 500 }),
    { once: true },
  );
