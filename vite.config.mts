import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { configDefaults, defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), tailwindcss()],
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          // React core + DOM + router
          if (
            id.includes('/react/') ||
            id.includes('/react-dom/') ||
            id.includes('/react-router') ||
            id.includes('/react-redux/') ||
            id.includes('/react-error-boundary/')
          ) {
            return 'vendor-react';
          }

          // Redux Toolkit (includes RTK Query, immer, reselect)
          if (id.includes('/@reduxjs/toolkit/')) {
            return 'vendor-redux';
          }

          // Radix UI primitives + themes
          if (id.includes('/@radix-ui/')) {
            return 'vendor-radix';
          }

          // Sentry monitoring (loaded async, rarely changes)
          if (id.includes('/@sentry/')) {
            return 'vendor-sentry';
          }

          // UI utilities (CVA, clsx, tailwind-merge, lucide icons)
          if (
            id.includes('/class-variance-authority/') ||
            id.includes('/clsx/') ||
            id.includes('/tailwind-merge/') ||
            id.includes('/lucide-react/')
          ) {
            return 'vendor-ui';
          }
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./scripts/vitest.setup.ts'],
    clearMocks: true,
    restoreMocks: true,
    exclude: [
      ...configDefaults.exclude,
      '**/node_modules/**',
      '**/dist/**',
      '**/*.mocks.spec.ts',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        '_snapshots_',
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
        '**/*.effect.ts',
        '**/*.type.ts',
        '**/helpers/**',
      ],
    },
  },
});
