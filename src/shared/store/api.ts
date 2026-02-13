import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import env from '@/shared/config/env';

const baseApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: new URL('/', env.API_URL).href,
  }),
  endpoints: () => ({}),
});

export default baseApi;
