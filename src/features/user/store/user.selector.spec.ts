import { setupStore } from '@/shared/store';
import { UserSelectors } from '.';
import { userApi } from './user.api';
import type { User } from './user.type';

describe('User Selector:', () => {
  test('Should return full name', async () => {
    const user = { id: 1, name: 'John', surname: 'Doe' } satisfies User;
    const store = setupStore();
    await store.dispatch(
      userApi.util.upsertQueryData('getUser', undefined, user),
    );

    expect(UserSelectors.selectUserFullName(store.getState())).toBe('John D.');
  });

  test('Should return the name alone without a surname', async () => {
    const user = { id: 1, name: 'John', surname: '' } satisfies User;
    const store = setupStore();
    await store.dispatch(
      userApi.util.upsertQueryData('getUser', undefined, user),
    );

    expect(UserSelectors.selectUserFullName(store.getState())).toBe('John');
  });

  test('Should return empty before the request', () => {
    const store = setupStore();
    expect(UserSelectors.selectUserFullName(store.getState())).toBe('');
  });
});
