import { ErrorBoundary } from 'react-error-boundary';
import { Provider } from 'react-redux';
import type { ClientOnErrorFunction } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import type { createAppRouter } from '@/routes';
import { captureError } from '@/shared/helpers/error-tracking.service';
import { store } from '@/shared/store';
import { ErrorFallback } from '@/UI/Elements/ErrorFallback';

type AppProviderProps = {
  router: ReturnType<typeof createAppRouter>;
};

// Render errors reach Sentry through the createRoot callbacks (main.tsx).
// This reports the route errors React does not see: failed loaders and page
// modules that do not load.
const reportRouteError: ClientOnErrorFunction = (error, { errorInfo }) => {
  if (!errorInfo) captureError(error, 'Route error');
};

export function AppProvider({ router }: AppProviderProps) {
  return (
    <Provider store={store}>
      {/* Last resort for crashes outside the pages */}
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <RouterProvider onError={reportRouteError} router={router} />
      </ErrorBoundary>
    </Provider>
  );
}
