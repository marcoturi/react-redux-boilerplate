import { AppProvider } from './AppProvider';
import reportWebVitals from './reportWebVitals';
import { initMocks } from './test';
import '@/UI/Layout/global.css';
import { AppRoutes } from '@/routes';
import '@radix-ui/themes/styles.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'tailwindcss/tailwind.css';

initMocks().then(() => {
  // eslint-disable-next-line unicorn/prefer-query-selector
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </React.StrictMode>,
  );

  reportWebVitals();
});
