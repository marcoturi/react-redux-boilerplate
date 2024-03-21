import { createAction } from '@reduxjs/toolkit';

export function createAsyncAction<P, Result, Error = void>(type: string) {
  return {
    pending: createAction<P>(`${type}/pending`),
    fulfilled: createAction<Result>(`${type}/fulfilled`),
    rejected: createAction<Error>(`${type}/rejected`),
  };
}
