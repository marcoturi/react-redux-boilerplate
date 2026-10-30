import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import env from '@/shared/config/env';

const baseApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: env.API_URL,
  }),
  endpoints: () => ({}),
});

export default baseApi;
