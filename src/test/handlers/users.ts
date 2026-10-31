import { HttpResponse, http } from 'msw';
import env from '@/shared/config/env';
import { userMock } from '@/test/mocks/users';

export const usersHandlers = [
  http.get(`${env.API_URL}/users`, () => HttpResponse.json(userMock)),
];
