import react from '@vitejs/plugin-react-swc';
import type { UserConfig } from 'vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { configDefaults } from 'vitest/config';
import type { InlineConfig } from 'vitest/node';

interface VitestConfigExport extends UserConfig {
  test: InlineConfig;
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      // @ts-ignore
      '@/': new URL('src/', import.meta.url).pathname,
    },
  },
  test: {
    // Setting pool='forks' is preventing this issue https://github.com/vitest-dev/vitest/issues/3077
    pool: 'forks',
    globals: true,
    root: __dirname,
    environment: 'jsdom',
    setupFiles: ['./scripts/vitest.setup.ts'],
    exclude: [
      ...configDefaults.exclude,
      '**/node_modules/**',
      '**/dist/**',
      '**/**.mocks.spec.ts',
    ],
    coverage: {
      reporter: ['text', 'html'],
      exclude: [
        '_snapshots_',
        '.eslint*',
        '.prettier*',
        'coverage',
        'dist/**',
        '**/test/**',
        'e2e/**',
        'public/**',
        '*.mjs',
        '*.cjs',
        '*/reportWebVitals.ts',
        '*/main.tsx',
        '*/AppProvider.tsx',
        '*/vite-env.d.ts',
        '**/test.tsx',
        '**/routes/index.tsx',
        '**/**.effect.ts', // we don't want to unit test side effects
        '**/**.type.ts',
        '**/helpers/**',
      ],
    },
  },
} as VitestConfigExport);
