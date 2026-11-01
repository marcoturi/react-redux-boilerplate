import { act, screen } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { server } from '@/mocks/node';
import env from '@/shared/config/env';
import { renderWithProviders } from '@/test/render';
import { userApi } from '../store/user.api';
import { UserWidget } from './UserWidget';

describe('UserWidget', () => {
  test('Should display the user name', async () => {
    renderWithProviders(<UserWidget />);
    expect(await screen.findByText('Hello Marco T.')).toBeInTheDocument();
  });

  test('Should keep the user name when a refetch fails', async () => {
    const { store } = renderWithProviders(<UserWidget />);
    expect(await screen.findByText('Hello Marco T.')).toBeInTheDocument();

    server.use(
      http.get(
        `${env.API_URL}/users`,
        () => HttpResponse.json({ message: 'Server Error' }, { status: 500 }),
        { once: true },
      ),
    );
    await act(async () => {
      await store.dispatch(
        userApi.endpoints.getUser.initiate(undefined, {
          forceRefetch: true,
          subscribe: false,
        }),
      );
      // RTK Query batches the rejection and notifies the UI on the next frame
      await new Promise((resolve) => requestAnimationFrame(resolve));
    });

    expect(userApi.endpoints.getUser.select()(store.getState()).isError).toBe(
      true,
    );
    expect(screen.getByText('Hello Marco T.')).toBeInTheDocument();
  });
});
