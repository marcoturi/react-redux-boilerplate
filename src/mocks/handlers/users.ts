import { HttpResponse, http } from 'msw';
import { userMock } from '@/mocks/data/users';
import env from '@/shared/config/env';

export const usersHandlers = [
  http.get(`${env.API_URL}/users`, () => HttpResponse.json(userMock)),
];
