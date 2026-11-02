import { HttpResponse, http } from 'msw';

export const serverErrorOnce = (url: string) =>
  http.get(
    url,
    () => HttpResponse.json({ message: 'Server Error' }, { status: 500 }),
    { once: true },
  );
