import { screen, waitFor } from '@testing-library/react';
import { worker } from '@/mocks/browser';
import { usersFailOnce } from '@/mocks/handlers/users';
import { actAndFlush, renderWithProviders } from '@/test/render';
import { userApi } from '../store/user.api';
import { UserWidget } from './UserWidget';

describe('UserWidget', () => {
  test('Should display the user name', async () => {
    renderWithProviders(<UserWidget />);
    expect(await screen.findByText('Hello Marco T.')).toBeInTheDocument();
  });

  test('Should render nothing when the first request fails', async () => {
    worker.use(usersFailOnce());
    const { container, store } = renderWithProviders(<UserWidget />);

    await waitFor(() =>
      expect(userApi.endpoints.getUser.select()(store.getState()).isError).toBe(
        true,
      ),
    );
    expect(container).toBeEmptyDOMElement();
  });

  test('Should keep the user name when a refetch fails', async () => {
    const { store } = renderWithProviders(<UserWidget />);
    expect(await screen.findByText('Hello Marco T.')).toBeInTheDocument();

    worker.use(usersFailOnce());
    await actAndFlush(() =>
      store.dispatch(
        userApi.endpoints.getUser.initiate(undefined, {
          forceRefetch: true,
          subscribe: false,
        }),
      ),
    );

    expect(userApi.endpoints.getUser.select()(store.getState()).isError).toBe(
      true,
    );
    expect(screen.getByText('Hello Marco T.')).toBeInTheDocument();
  });
});
