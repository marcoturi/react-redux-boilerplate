import env from '@/shared/config/env';

export const initMocks = async () => {
  if (import.meta.env.DEV && env.API_MOCKING) {
    // Without service workers MSW falls back to in-page interception, but a
    // failed registration (e.g. the worker script is not served) rejects:
    // render without mocks rather than leave a blank page
    try {
      const [{ worker }, { HttpNetworkFrame }] = await Promise.all([
        import('./browser'),
        import('msw/experimental'),
      ]);
      await worker.start({
        // The page itself (a reload on /subscriptions) and the dev server's
        // modules are same-origin requests: let them through quietly, and warn
        // only about API requests without a handler. With a callback the
        // request goes to the network after the warning
        onUnhandledFrame: ({ frame, defaults }) => {
          const isSameOrigin =
            frame instanceof HttpNetworkFrame &&
            new URL(frame.data.request.url).origin === location.origin;
          if (!isSameOrigin) defaults.warn();
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
