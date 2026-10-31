import type { RootState } from '@/shared/store/types';
import { userApi } from './user.api';

const selectUserResult = userApi.endpoints.getUser.select();

// A string compares by value: no memoization needed
export const selectUserFullName = (state: RootState): string => {
  const user = selectUserResult(state).data;
  if (!user) return '';
  return user.surname.length > 0
    ? `${user.name} ${user.surname[0]}.`
    : user.name;
};
