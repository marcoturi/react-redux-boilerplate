import { HttpResponse, http } from 'msw';
import { config } from '../config';

export const usersHandlers = [
  http.get(`${config.API_URL}/users`, () => {
    try {
      return HttpResponse.json({
        id: '123',
        name: 'Marco',
        surname: 'Turi',
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Server Error';
      return HttpResponse.json({ message }, { status: 400 });
    }
  }),
];
