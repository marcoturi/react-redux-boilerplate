# AGENTS.md

## Project overview

Production-ready React 19 boilerplate using vertical slice architecture. The stack is React 19 + Redux Toolkit 2 + Vite 8 + TypeScript 7 + Tailwind CSS 4 + Biome.

## Setup commands

- **Node version**: 26.x (defined in `.nvmrc`). Use `fnm use` or `nvm use` before running commands.
- **Package manager**: pnpm 10.x (`corepack enable` if needed).
- **Install deps**: `pnpm install`
- **Create env**: `pnpm create:env`
- **Dev server**: `pnpm dev` (starts at `http://localhost:5173`)
- **Build**: `pnpm build` (runs `tsc -b && vite build`)

## Testing

- **Unit/integration tests**: `pnpm test` (Vitest 5 + Testing Library + jsdom)
- **With coverage**: `pnpm test:coverage`
- **E2E tests**: `pnpm e2e:local` (requires dev server running in another terminal)
- **E2E uses**: Cucumber + Playwright. Install browsers first: `pnpm exec playwright install`
- Test files live next to the code they test with `.spec.ts` / `.spec.tsx` suffix.
- Mock data files use `.mocks.spec.ts` suffix and are excluded from test runs.
- MSW (Mock Service Worker) handles API mocking in both tests and development. The worker script is served by the `msw/vite` plugin from `node_modules`: do not add `mockServiceWorker.js` to `public/`.
- Vitest globals (`describe`, `it`, `expect`, `vi`) are available without imports.
- Always run `pnpm test` and `pnpm build` before submitting changes.

## Linting, formatting, and type checking

- **Single tool**: [Biome](https://biomejs.dev/) handles both linting and formatting. No ESLint or Prettier.
- **Check all**: `pnpm check` (runs `biome check && tsc -b`)
- **Auto-fix**: `pnpm check:fix` (runs `biome check --write && tsc -b`)
- **Format only**: `pnpm format`
- **Lint only**: `pnpm lint`
- **Type check only**: `pnpm type:check`
- Pre-commit hook (Husky) runs `pnpm biome check --staged` and `pnpm test` automatically.

## Code style

- TypeScript strict mode with `noImplicitAny: false`.
- Single quotes, semicolons, trailing commas, 2-space indent, LF line endings, 80 char line width.
- Use `import type` for type-only imports (enforced by Biome `useImportType`).
- Prefer `for...of` over `.forEach()` (enforced by Biome `noForEach`).
- Use `const` over `let` when possible. Never use `var`.
- Use `unknown` instead of `any` for error catches and untyped values.
- Use `import.meta.env` instead of `process.env` in browser/Vite code.
- Use `null` (not `undefined`) as the return value for components that render nothing.
- Absolute imports via `@/` alias (maps to `src/`). Never use relative imports that go above the current feature.

## Architecture and folder structure

This project follows vertical slice architecture. Each feature is self-contained.

```
src/
├── main.tsx                → App entry point
├── AppProvider.tsx          → Providers: Suspense, Redux, Radix Theme, ErrorBoundary, Router
├── routes/                  → Route definitions and page components (lazy-loaded)
├── features/                → Feature slices (each with store/, components/, hooks/)
│   ├── user/
│   ├── subscriptions/
│   └── settings/
├── shared/
│   ├── config/              → Environment variables, Sentry config
│   ├── helpers/             → Utilities (localStorage, error tracking, style utils)
│   └── store/               → Redux store setup, base API, types
├── UI/
│   ├── Base/                → shadcn/ui components, managed by the shadcn CLI
│   ├── Elements/            → Project UI components built on Base and Radix Themes
│   └── Layout/              → Page layouts (Header, global CSS)
└── test/                    → MSW handlers, test config
```

### Key conventions

- **Components**: Only dispatch Redux actions and display data via selectors. No business logic.
- **Selectors/Reducers**: Contain business and domain logic. Keep them pure and testable.
- **Side effects**: Use RTK Query, thunks, or listener middleware.
- **Routes**: Lazy-loaded with `React.lazy()`. The `AppProvider` wraps everything in `<Suspense>`.
- **UI components**: Based on shadcn/ui (Radix primitives). Config in `components.json`, theme in `global.css`.

## State management (Redux Toolkit)

- Store is configured in `src/shared/store/index.ts`.
- API layer uses RTK Query (`src/shared/store/api.ts`).
- Feature slices export actions, selectors, and API hooks from their `store/index.ts` barrel.
- Typed hooks: use `useAppDispatch` and `useAppSelector` from `src/shared/store/types.ts`.
- Sentry Redux enhancer is configured in `src/shared/config/sentry.ts`.

## UI and styling

- **Tailwind CSS 4** via `@tailwindcss/vite` plugin (no PostCSS pipeline needed).
- **Theme**: Defined in CSS variables in `src/UI/Layout/global.css` using `@theme inline`.
- **shadcn/ui components**: Style `radix-vega`, in `src/UI/Base/` as kebab-case files (`src/UI/Base/button.tsx`). Add or update them only with the CLI (`pnpm exec shadcn add <component>`, `--diff` to compare with upstream), then run `pnpm check:fix`. Keep them close to upstream: never move or rename them, or the CLI loses track of them.
- **Project UI components**: Compositions and wrappers (e.g. `SkeletonList`, `Text`, `Container`) go in `src/UI/Elements/<Name>/<Name>.tsx` with an `index.ts` barrel.
- **Style utility**: `cn()` from the `cn` package. shadcn components import it directly; `src/shared/helpers/style.utils.ts` re-exports it as the `utils` alias.
- **CLI paths**: `components.json` aliases resolve through `compilerOptions.paths` in the root `tsconfig.json`; keep it in sync with `tsconfig.app.json`.

## Commits and releases

- Commits must follow [Conventional Commits](https://www.conventionalcommits.org/) (enforced by commitlint).
- Format: `type(scope): description` (e.g., `feat(subscriptions): add filter component`).
- Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `style`, `test`, `perf`, `ci`, `build`, `revert`.
- Releases are automated via semantic-release on merge to `main`.
- Do not manually bump version or edit CHANGELOG.md.

## Build output

- Production build outputs to `dist/`.
- Vendor chunk splitting is configured in `vite.config.mts` (`build.rolldownOptions.output.codeSplitting.groups`):
  - `vendor-react`: React, React DOM, React Router, React Redux
  - `vendor-redux`: Redux Toolkit (RTK Query, Immer, Reselect)
  - `vendor-radix`: All Radix UI packages
  - `vendor-sentry`: Sentry monitoring
  - `vendor-ui`: CVA, cn, Lucide icons

## Environment variables

- Defined in `.env` (created via `pnpm create:env` from `.env.example`).
- Accessed via `import.meta.env.VITE_*` in browser code.
- Centralized in `src/shared/config/env.ts`. Always import from there, not directly from `import.meta.env`.

## CI/CD

- GitHub Actions workflow in `.github/workflows/release.yml`.
- Pipeline: install -> check (Biome + types) -> build -> test -> e2e -> semantic-release.
- Uses `pnpm/action-setup@v6` and `.nvmrc` for Node version.

## Security considerations

- Never commit `.env` files or secrets.
- Sentry DSN should be set via `VITE_SENTRY_DSN` environment variable, not hardcoded.
- API URLs should be set via `VITE_API_URL` environment variable.
