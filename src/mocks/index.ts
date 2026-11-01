import env from '@/shared/config/env';

// The page itself (a reload on /subscriptions) and the dev server's modules
// are same-origin requests: let them through quietly, and warn only about API
// requests without a handler
const isSameOrigin = (data: unknown) =>
  typeof data === 'object' &&
  data !== null &&
  'request' in data &&
  data.request instanceof Request &&
  new URL(data.request.url).origin === location.origin;

export const initMocks = async () => {
  // import.meta.env.DEV first: Vite replaces it with false in production and
  // drops the branch, so MSW stays out of the build
  if (import.meta.env.DEV && env.API_MOCKING) {
    // Without service workers MSW falls back to in-page interception, but a
    // failed registration (e.g. the worker script is not served) rejects:
    // render without mocks rather than leave a blank page
    try {
      const { worker } = await import('./browser');
      await worker.start({
        // With a callback the request goes to the network after the warning
        onUnhandledFrame: ({ frame, defaults }) => {
          if (!isSameOrigin(frame.data)) defaults.warn();
        },
      });
    } catch (error) {
      console.error(
        `MSW did not start: requests go to ${env.API_URL} without mocks.`,
        error,
      );
    }
  }
};
