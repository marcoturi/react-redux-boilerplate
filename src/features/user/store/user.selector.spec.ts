import { UserSelectors } from '.';
import { getMockedState } from '@/core/store/test';

describe('User Selector:', () => {
  it('Should return full name', () => {
    const expectedState = getMockedState({
      functionName: 'getUser',
      data: {
        id: '1',
        name: 'John',
        surname: 'Doe',
      },
    });
    expect(UserSelectors.getUserFullName(expectedState)).toEqual('John Doe');
  });
  it('Should return empty in case of no name', () => {
    const expectedState = getMockedState({
      functionName: 'getUser',
    });
    expect(UserSelectors.getUserFullName(expectedState)).toEqual('');
  });
});
