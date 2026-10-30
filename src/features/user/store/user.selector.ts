import { createAppSelector } from '@/shared/store/selectors';
import { userApi } from './user.api';

export const selectUserFullName = createAppSelector(
  userApi.endpoints.getUser.select(),
  (res): string => {
    if (!res.data) return '';
    const { name, surname } = res.data;
    return surname.length > 0 ? `${name} ${surname[0]}.` : name;
  },
);
