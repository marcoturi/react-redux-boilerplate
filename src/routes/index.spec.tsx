import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { subscriptionApi } from '@/features/subscriptions/store/subscription.api';
import { renderRoutes } from '@/test/render';
import { createRoutes } from '.';

// The home page crashes in these tests, to exercise the page error boundary
vi.mock('./Home/HomePage', () => ({
  default: function CrashingPage(): never {
    throw new Error('Page crashed');
  },
}));

// The user widget crashes on demand, to exercise the layout error boundary
const crash = vi.hoisted(() => ({ userWidget: false }));
vi.mock('@/features/user/components', async (importOriginal) => {
  const { UserWidget } =
    await importOriginal<typeof import('@/features/user/components')>();
  return {
    UserWidget: () => {
      if (crash.userWidget) throw new Error('Widget crashed');
      return <UserWidget />;
    },
  };
});

describe('App routes', () => {
  test('Should render the not found page for unknown URLs', async () => {
    renderRoutes(createRoutes, { route: '/missing' });
    expect(
      await screen.findByRole('heading', { name: /page not found/i }),
    ).toBeInTheDocument();
  });

  test('Should render one navigation, the main landmark and the current page', async () => {
    renderRoutes(createRoutes, { route: '/subscriptions' });

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

  test('Should start the subscriptions request before the page loads', async () => {
    const { store } = renderRoutes(createRoutes, { route: '/subscriptions' });

    // The page module is still loading: only the loader can have started it
    expect(
      screen.queryByRole('heading', { name: 'Subscriptions', level: 1 }),
    ).not.toBeInTheDocument();
    expect(
      subscriptionApi.endpoints.getSubscriptions.select()(store.getState())
        .isLoading,
    ).toBe(true);

    expect(await screen.findAllByRole('heading', { level: 2 })).toHaveLength(3);
  });

  test('Should replace only the crashed page and recover on navigation', async () => {
    // React logs the error that the boundary caught
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const user = userEvent.setup();
    renderRoutes(createRoutes, { route: '/' });

    expect(await screen.findByRole('alert')).toMatchTextContent(
      /something went wrong/i,
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Subscriptions' }));
    expect(
      await screen.findByRole('heading', { name: 'Subscriptions', level: 1 }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument();
  });

  test('Should show the layout fallback when the header crashes', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    crash.userWidget = true;
    onTestFinished(() => {
      crash.userWidget = false;
    });
    renderRoutes(createRoutes, { route: '/missing' });

    expect(await screen.findByRole('alert')).toMatchTextContent(
      /something went wrong/i,
    );
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });
});
