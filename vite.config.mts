import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { msw } from 'msw/vite';
import { defineConfig } from 'vitest/config';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ...(process.env.VITEST
      ? []
      : [babel({ presets: [reactCompilerPreset()] })]),
    tailwindcss(),
    { ...msw({ mode: 'worker-only' }), apply: 'serve' },
  ],
  resolve: {
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
    rolldownOptions: {
      output: {
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
            {
              name: 'vendor-sentry',
              test: /[\\/]node_modules[\\/]@sentry[\\/]/,
            },
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
        extends: true,
        test: {
          name: 'unit',
          include: ['src/**/*.spec.ts'],
          // Node's own localStorage, kept in memory
          execArgv: ['--localstorage-file=:memory:'],
          setupFiles: ['./src/test/unit.setup.ts'],
        },
      },
      {
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
      exclude: [
        'src/main.tsx',
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
