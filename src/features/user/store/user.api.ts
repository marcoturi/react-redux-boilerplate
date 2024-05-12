import { User } from '@/features/user/store/user.type';
import baseApi from '@/shared/store/api';

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
