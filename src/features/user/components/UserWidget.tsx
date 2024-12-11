import { Text } from '@/UI/Elements/Text';
import { UserApi, UserSelectors } from '@/features/user/store';
import { useAppSelector } from '@/shared/store/types.ts';

function UserWidget() {
  const { isLoading, isError } = UserApi.useGetUserQuery();
  const userFullName = useAppSelector(UserSelectors.getUserFullName);
  return isLoading || isError ? undefined : <Text>Hello {userFullName}</Text>;
}

export default UserWidget;
