import { userApi } from './user.api';
import { createSelector } from '@reduxjs/toolkit';

export const getUserFullName = createSelector(
  userApi.endpoints.getUser.select(),
  (res): string => (res.data ? `${res.data.name} ${res.data.surname[0]}.` : ''),
);
