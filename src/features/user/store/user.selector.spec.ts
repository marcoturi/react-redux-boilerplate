import { UserSelectors } from '.';
import { userApi } from '@/features/user/store/user.api';
import { setupStore } from '@/shared/store/test';

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
