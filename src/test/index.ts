import { config } from '@/test/config';

export const initMocks = async () => {
  if (config.API_MOCKING === 'true' && process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
    const { worker } = await import('./browser');
    await worker.start();
  }
};
