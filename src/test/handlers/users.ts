import { HttpResponse, http } from 'msw';
import type { User } from '@/features/user/store/user.type';
import { config } from '../config';

export const usersHandlers = [
  http.get(`${config.API_URL}/users`, () => {
    try {
      return HttpResponse.json({
        id: 123,
        name: 'Marco',
        surname: 'Turi',
      } satisfies User);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Server Error';
      return HttpResponse.json({ message }, { status: 400 });
    }
  }),
];
