import type { User } from '@/features/user/store/user.type';
import baseApi from '@/shared/store/api';

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUser: build.query<User, void>({
      query: () => 'users',
    }),
  }),
});

export const { useGetUserQuery } = userApi;
