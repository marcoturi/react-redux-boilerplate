import env from '@/shared/config/env';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: new URL('/', env.API_URL).href,
  }),
  endpoints: () => ({}),
});

export default baseApi;
