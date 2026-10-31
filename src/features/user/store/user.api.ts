import baseApi from '@/shared/store/api';
import type { User } from './user.type';

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUser: build.query<User, void>({
      query: () => 'users',
    }),
  }),
});

export const { useGetUserQuery } = userApi;
