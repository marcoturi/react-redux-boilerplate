import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { env } from '@/shared/config/env';

export const baseApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: env.API_URL,
  }),
  endpoints: () => ({}),
});
