/**
 * This function is used to mock the state of the store to test the selectors.
 * However, is quite fragile, and it's better to use the real store.
 * https://github.com/reduxjs/redux-toolkit/discussions/4016
 */
export function getMockedState({
  functionName,
  parameters,
  data,
}: {
  functionName: string;
  parameters?: any;
  data?: any;
}) {
  const state: any = {};
  if (data) {
    state.data = data;
  }
  return {
    api: {
      queries: {
        [`${functionName}(${
          parameters ? JSON.stringify(parameters) : 'undefined'
        })`]: state,
      },
    },
  } as any;
}
