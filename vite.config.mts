import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { msw } from 'msw/vite';
import { configDefaults, defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  // msw serves the worker script from node_modules (no copy in public/)
  plugins: [react(), tailwindcss(), msw({ mode: 'worker-only' })],
  resolve: {
    // Resolve the `paths` aliases (e.g. `@/`) declared in tsconfig
    tsconfigPaths: true,
  },
  build: {
    target: 'esnext',
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
            // Radix UI primitives + themes
            {
              name: 'vendor-radix',
              test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            },
            // Sentry monitoring (loaded async, rarely changes)
            {
              name: 'vendor-sentry',
              test: /[\\/]node_modules[\\/]@sentry[\\/]/,
            },
            // UI utilities (CVA, clsx, tailwind-merge, lucide icons)
            {
              name: 'vendor-ui',
              test: /[\\/]node_modules[\\/](class-variance-authority|clsx|tailwind-merge|lucide-react)[\\/]/,
            },
          ],
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
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/main.tsx',
        'src/AppProvider.tsx',
        'src/vite-env.d.ts',
        '**/test/**',
        '**/test.tsx',
        '**/routes/index.tsx',
        '**/*.effect.ts',
        '**/*.type.ts',
        '**/helpers/**',
      ],
    },
  },
});
