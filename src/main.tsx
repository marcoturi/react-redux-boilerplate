import { AppProvider } from './AppProvider';
import { initMocks } from './test';
import '@/UI/Layout/global.css';
import { AppRoutes } from '@/routes';
import '@radix-ui/themes/styles.css';
import * as Sentry from '@sentry/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// React 19 reports render errors through the root callbacks instead of
// window.onerror: forward them to Sentry and keep them in the console.
const handleReactError = Sentry.reactErrorHandler((error, errorInfo) => {
  console.error(error, errorInfo.componentStack);
});

initMocks().then(() => {
  const root = document.getElementById('root');
  if (!root) throw new Error('Root element not found');
  createRoot(root, {
    onUncaughtError: handleReactError,
    onCaughtError: handleReactError,
    onRecoverableError: handleReactError,
  }).render(
    <StrictMode>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </StrictMode>,
  );
});
