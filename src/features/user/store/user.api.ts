import baseApi from '@/core/store/api';
import { User } from '@/features/user/store/user.type';

export const userApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['User'] })
  .injectEndpoints({
    endpoints: (build) => ({
      getUser: build.query<User, void>({
        query: () => 'users',
      }),
    }),
    overrideExisting: false,
  });

export const { useGetUserQuery } = userApi;
