import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { msw } from 'msw/vite';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // msw serves the worker script from node_modules (no copy in public/).
    // Mocks run only in development, so keep the worker out of the build.
    { ...msw({ mode: 'worker-only' }), apply: 'serve' },
  ],
  resolve: {
    // Resolve the `paths` aliases (e.g. `@/`) declared in tsconfig
    tsconfigPaths: true,
  },
  server: {
    watch: {
      // E2E runs write here while the dev server is up: changes must not
      // trigger full page reloads mid-test
      ignored: ['**/reports/**', '**/traces/**', '**/screenshots/**'],
    },
  },
  build: {
    // Default target (baseline-widely-available). tsconfig.app.json uses
    // target ES2022 and lib ES2023, which those browsers support.
    rolldownOptions: {
      output: {
        // Groups are matched in order: the first matching group wins.
        codeSplitting: {
          groups: [
            // React core + DOM + router
            {
              name: 'vendor-react',
              test: /[\\/]node_modules[\\/](react|react-dom|react-router[^\\/]*|react-redux|react-error-boundary)[\\/]/,
            },
            // Redux Toolkit (includes RTK Query, immer, reselect)
            {
              name: 'vendor-redux',
              test: /[\\/]node_modules[\\/]@reduxjs[\\/]toolkit[\\/]/,
            },
            // Sentry monitoring (rarely changes; the replay integration is
            // loaded from the Sentry CDN at runtime)
            {
              name: 'vendor-sentry',
              test: /[\\/]node_modules[\\/]@sentry[\\/]/,
            },
            // No group for Radix, lucide and the other UI libraries: a group
            // takes every matching module and loads it on the first page, so
            // Rolldown keeps them with the routes that use them
          ],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/unit.setup.ts'],
    clearMocks: true,
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      // Leave out only entry points, mocks, test helpers and the shadcn components
      // (managed by the CLI): effects, helpers and type guards hold logic
      exclude: [
        'src/main.tsx',
        'src/AppProvider.tsx',
        'src/vite-env.d.ts',
        'src/UI/Base/**',
        'src/mocks/**',
        'src/test/**',
      ],
      // A few points under the current values: fail when coverage drops
      thresholds: {
        statements: 85,
        branches: 70,
        functions: 80,
        lines: 85,
      },
    },
  },
});
