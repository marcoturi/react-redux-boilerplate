import { HttpResponse, http } from 'msw';
import { userMock } from '@/mocks/data/users';
import { env } from '@/shared/config/env';
import { serverErrorOnce } from './server-error';

const usersUrl = `${env.API_URL}/users`;

export const usersHandlers = [
  http.get(usersUrl, () => HttpResponse.json(userMock)),
];

export const usersFailOnce = () => serverErrorOnce(usersUrl);
