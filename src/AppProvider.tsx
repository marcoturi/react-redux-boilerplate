import { Button, Theme } from '@radix-ui/themes';
import { type ReactNode, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { store } from '@/shared/store';

function ErrorFallback() {
  return (
    <div role="alert">
      <h2>Ooops, something went wrong :( </h2>
      <Button onClick={() => window.location.assign(window.location.origin)}>
        Refresh
      </Button>
    </div>
  );
}

type AppProviderProps = {
  children: ReactNode;
};

export function AppProvider({ children }: AppProviderProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Provider store={store}>
        <Theme
          accentColor="mint"
          grayColor="gray"
          panelBackground="solid"
          scaling="100%"
          radius="full"
        >
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Router>{children}</Router>
          </ErrorBoundary>
        </Theme>
      </Provider>
    </Suspense>
  );
}
