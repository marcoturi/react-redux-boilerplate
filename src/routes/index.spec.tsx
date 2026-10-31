import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppRoutes } from '@/routes';
import { renderWithProviders } from '@/shared/store/test';

// The home page crashes in these tests, to exercise the page error boundary
vi.mock('@/routes/Home/HomePage', () => ({
  default: function CrashingPage(): never {
    throw new Error('Page crashed');
  },
}));

describe('AppRoutes', () => {
  test('Should render the not found page for unknown URLs', async () => {
    renderWithProviders(<AppRoutes />, { route: '/missing' });
    expect(
      await screen.findByRole('heading', { name: /page not found/i }),
    ).toBeInTheDocument();
  });

  test('Should render one navigation, the main landmark and the current page', async () => {
    renderWithProviders(<AppRoutes />, { route: '/subscriptions' });

    expect(
      await screen.findByRole('heading', { name: 'Subscriptions', level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('navigation')).toHaveLength(1);
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Subscriptions' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute(
      'aria-current',
    );
    expect(document.title).toBe('Subscriptions | React Boilerplate');
  });

  test('Should replace only the crashed page and recover on navigation', async () => {
    // React logs the error that the boundary caught
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const user = userEvent.setup();
    renderWithProviders(<AppRoutes />, { route: '/' });

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /something went wrong/i,
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Subscriptions' }));
    expect(
      await screen.findByRole('heading', { name: 'Subscriptions', level: 1 }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument();
  });
});
