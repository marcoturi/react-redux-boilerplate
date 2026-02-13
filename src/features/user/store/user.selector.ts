import { createSelector } from '@reduxjs/toolkit';
import { userApi } from './user.api';

export const getUserFullName = createSelector(
  userApi.endpoints.getUser.select(),
  (res): string => {
    if (!res.data) return '';
    const { name, surname } = res.data;
    return surname.length > 0 ? `${name} ${surname[0]}.` : name;
  },
);
