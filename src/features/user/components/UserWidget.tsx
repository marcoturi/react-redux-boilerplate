import { UserApi, UserSelectors } from '@/features/user/store';
import { useAppSelector } from '@/shared/store/types';
import { Text } from '@/UI/Elements/Text';

export function UserWidget() {
  const { isLoading, isError } = UserApi.useGetUserQuery();
  const userFullName = useAppSelector(UserSelectors.selectUserFullName);

  if (isLoading || isError) return null;

  return <Text>Hello {userFullName}</Text>;
}
