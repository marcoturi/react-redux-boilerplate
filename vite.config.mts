import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { msw } from 'msw/vite';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // React Compiler memoizes components and hooks at build time. Through
    // Babel: the native compiler option of plugin-react is experimental. Not
    // under Vitest, so coverage measures the source instead of the compiler's
    // cache checks; the dev server, e2e and the build use it.
    ...(process.env.VITEST
      ? []
      : [babel({ presets: [reactCompilerPreset()] })]),
    tailwindcss(),
    // msw serves the worker script from node_modules (no copy in public/).
    // Mocks run only in development, so keep the worker out of the build.
    { ...msw({ mode: 'worker-only' }), apply: 'serve' },
  ],
  resolve: {
    // Resolve the `paths` aliases (e.g. `@/`) declared in tsconfig
    tsconfigPaths: true,
  },
  // Drops the Sentry SDK debug logger from the bundle: `debug: true` in
  // Sentry.init prints nothing while this is false
  define: { __SENTRY_DEBUG__: false },
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
            // React, React DOM, React Router, React Redux and
            // react-error-boundary, with their dependencies
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
    clearMocks: true,
    restoreMocks: true,
    projects: [
      {
        // Store, selectors and helpers: no rendering, fast in jsdom
        extends: true,
        test: {
          name: 'unit',
          include: ['src/**/*.spec.ts'],
          environment: 'jsdom',
          setupFiles: ['./src/test/unit.setup.ts'],
        },
      },
      {
        // Components and pages in a real Chromium, with the MSW service worker
        extends: true,
        test: {
          name: 'browser',
          include: ['src/**/*.spec.tsx'],
          setupFiles: ['./src/test/browser.setup.ts'],
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [{ browser: 'chromium' }],
            // Testing Library already prints the DOM of a failed query
            screenshotFailures: false,
          },
        },
      },
    ],
    coverage: {
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
