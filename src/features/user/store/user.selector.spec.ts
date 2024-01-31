import { UserSelectors } from '.';
import { setupStore } from '@/core/store/test';
import { userApi } from '@/features/user/store/user.api';

describe('User Selector:', () => {
  let store;

  beforeEach(() => {
    store = setupStore();
  });

  it('Should return full name', async () => {
    const newData = {
      id: 1,
      name: 'John',
      surname: 'Doe',
    };

    await store.dispatch(
      userApi.util.upsertQueryData('getUser', undefined, newData),
    );
    const finalState = store.getState();

    expect(UserSelectors.getUserFullName(finalState)).toEqual('John D.');
  });
  it('Should return empty in case of no name', () => {
    const finalState = store.getState();
    expect(UserSelectors.getUserFullName(finalState)).toEqual('');
  });
});
