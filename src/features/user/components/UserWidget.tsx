import { useSelector } from 'react-redux';
import { UserApi, UserSelectors } from '@/features/user/store';
import { Text } from '@/UI/Elements/Text';

function UserWidget() {
  const { isLoading, isError } = UserApi.useGetUserQuery();
  const userFullName = useSelector(UserSelectors.getUserFullName);
  return isLoading || isError ? undefined : <Text>Hello {userFullName}</Text>;
}

export default UserWidget;
