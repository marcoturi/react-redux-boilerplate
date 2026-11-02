import { useAppSelector } from '@/shared/store/types';
import { Text } from '@/UI/Elements/Text';
import { UserApi, UserSelectors } from '../store';

export function UserWidget() {
  // Subscribes to the user query; the selector reads its cached data
  UserApi.useGetUserQuery();
  const userFullName = useAppSelector(UserSelectors.selectUserFullName);

  if (!userFullName) return null;

  return <Text>Hello {userFullName}</Text>;
}
