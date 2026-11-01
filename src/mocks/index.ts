import env from '@/shared/config/env';

export const initMocks = async () => {
  // import.meta.env.DEV first: Vite replaces it with false in production and
  // drops the branch, so MSW stays out of the build
  if (import.meta.env.DEV && env.API_MOCKING) {
    // Without service workers MSW falls back to in-page interception, but a
    // failed registration (e.g. the worker script is not served) rejects:
    // render without mocks rather than leave a blank page
    try {
      const { worker } = await import('./browser');
      await worker.start();
    } catch (error) {
      console.error(
        `MSW did not start: requests go to ${env.API_URL} without mocks.`,
        error,
      );
    }
  }
};
