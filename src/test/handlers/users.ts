import { HttpResponse, http } from 'msw';
import type { User } from '@/features/user/store/user.type';
import env from '@/shared/config/env';

export const usersHandlers = [
  http.get(`${env.API_URL}/users`, () =>
    HttpResponse.json({
      id: 123,
      name: 'Marco',
      surname: 'Turi',
    } satisfies User),
  ),
];
