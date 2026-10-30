import env from '@/shared/config/env';

export const initMocks = async () => {
  // import.meta.env.DEV first: Vite replaces it with false in production and
  // drops the branch, so MSW stays out of the build
  if (import.meta.env.DEV && env.API_MOCKING) {
    const { worker } = await import('./browser');
    await worker.start();
  }
};
