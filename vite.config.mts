import react from '@vitejs/plugin-react-swc';
import type { UserConfig } from 'vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import type { InlineConfig } from 'vitest';
import { configDefaults } from 'vitest/config';

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
      '@/': new URL('./src/', import.meta.url).pathname,
    },
  },
  test: {
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
        '*.effect.tsx',
        '*/reportWebVitals.ts',
        '*/main.tsx',
        '*/AppProvider.tsx',
        '*/vite-env.d.ts',
      ],
    },
  },
} as VitestConfigExport);
