import { render, screen } from '@testing-library/react';
import { createMemoryRouter } from 'react-router';
import { captureError } from '@/shared/helpers/error-tracking.service';
import { AppProvider } from './AppProvider';

vi.mock('@/shared/helpers/error-tracking.service');

function Page() {
  return <p>Page</p>;
}

function RouteError() {
  return <p>Route failed</p>;
}

function CrashingPage(): never {
  throw new Error('Render failed');
}

describe('AppProvider', () => {
  test('Should report a loader error', async () => {
    const error = new Error('Loader failed');
    const router = createMemoryRouter([
      {
        path: '/',
        loader: () => {
          throw error;
        },
        Component: Page,
        HydrateFallback: () => null,
        ErrorBoundary: RouteError,
      },
    ]);
    render(<AppProvider router={router} />);

    expect(await screen.findByText('Route failed')).toBeInTheDocument();
    expect(captureError).toHaveBeenCalledExactlyOnceWith(error, 'Route error');
  });

  test('Should leave render errors to the React root callbacks', async () => {
    // React logs the error that the boundary caught
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const router = createMemoryRouter([
      { path: '/', Component: CrashingPage, ErrorBoundary: RouteError },
    ]);
    render(<AppProvider router={router} />);

    expect(await screen.findByText('Route failed')).toBeInTheDocument();
    expect(captureError).not.toHaveBeenCalled();
  });
});
