import { createSelector } from '@reduxjs/toolkit';
import { userApi } from './user.api';

export const getUserFullName = createSelector(
  userApi.endpoints.getUser.select(),
  (res): string => (res.data ? `${res.data.name} ${res.data.surname[0]}.` : ''),
);
