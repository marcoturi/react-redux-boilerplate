import { userApi } from './user.api';
import { createSelector } from '@reduxjs/toolkit';

export const getUserFullName = createSelector(
  (state: any) => userApi.endpoints.getUser.select()(state),
  (res): string => (res.data ? `${res.data.name} ${res.data.surname[0]}.` : ''),
);
