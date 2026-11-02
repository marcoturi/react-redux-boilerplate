import babel from '@rolldown/plugin-babel';
import { sentryVitePlugin } from '@sentry/bundler-plugins/vite';
import tailwindcss from '@tailwindcss/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import type { Logger } from 'babel-plugin-react-compiler';
import { msw } from 'msw/vite';
import { defineConfig } from 'vitest/config';
import packageJson from './package.json' with { type: 'json' };

// The Sentry plugin reads SENTRY_ORG and SENTRY_PROJECT from the environment
const uploadSourceMaps = Boolean(process.env.SENTRY_AUTH_TOKEN);

const compilerLogger: Logger = {
  logEvent(filename, event) {
    if (event.kind !== 'CompileError' && event.kind !== 'PipelineError') return;
    const reason =
      event.kind === 'CompileError' ? event.detail.reason : event.data;
    console.warn(
      `React Compiler skipped ${filename}:${event.fnLoc?.start.line}: ${reason}`,
    );
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ...(process.env.VITEST
      ? []
      : [
          babel({ presets: [reactCompilerPreset({ logger: compilerLogger })] }),
        ]),
    tailwindcss(),
    { ...msw({ mode: 'worker-only' }), apply: 'serve' },
    ...(uploadSourceMaps
      ? sentryVitePlugin({
          release: { name: packageJson.version },
          sourcemaps: { filesToDeleteAfterUpload: ['./dist/**/*.map'] },
          telemetry: false,
          errorHandler: (err) => {
            throw err;
          },
        })
      : []),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  // Drops the Sentry SDK debug logger from the bundle: `debug: true` in
  // Sentry.init prints nothing while this is false
  define: { __SENTRY_DEBUG__: false },
  build: {
    sourcemap: uploadSourceMaps ? 'hidden' : false,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            // React, React DOM, React Router and React Redux, with their
            // dependencies
            {
              name: 'vendor-react',
              test: /[\\/]node_modules[\\/](react|react-dom|react-router[^\\/]*|react-redux)[\\/]/,
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
    restoreMocks: true,
    projects: [
      {
        test: {
          name: 'unit',
          include: ['src/**/*.spec.ts'],
          // Node's own localStorage, kept in memory
          execArgv: ['--localstorage-file=:memory:'],
          setupFiles: ['./src/test/unit.setup.ts'],
        },
      },
      {
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
