import type { User } from '@/features/user/store/user.type';

export const userMock = {
  id: 123,
  name: 'Marco',
  surname: 'Turi',
} satisfies User;
