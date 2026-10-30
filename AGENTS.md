# AGENTS.md

## Scope

Production-ready React 19 SPA boilerplate with vertical slice architecture: React 19, Redux Toolkit 2 with RTK Query, React Router 8, Vite 8, TypeScript 7, Tailwind CSS 4, shadcn/ui and Biome. This file holds the repository-wide instructions; the rules for each kind of file are in `.agents/rules/` (see [Rules](#rules)).

## Commands

- Node.js 26.x from `.nvmrc`: run `fnm use` or `nvm use` first. Package manager: pnpm 10 (`corepack enable`).
- Install: `pnpm install`. Create `.env` from `.env.example`: `pnpm create:env`.
- Dev server: `pnpm dev` (http://localhost:5173).
- Lint, format and types: `pnpm check`; auto-fix: `pnpm check:fix`. Only types: `pnpm type:check` (`tsc -b` over the app, the Vite config and e2e).
- Unit and integration tests: `pnpm test`; with coverage and its thresholds: `pnpm test:coverage`.
- Build: `pnpm build` (`tsc -b && vite build`, output in `dist/`).
- E2E: install Chromium once with `pnpm exec playwright install chromium`, start `pnpm dev`, then run `pnpm e2e:local` in another terminal. `pnpm e2e:debug` runs only the `@only` scenarios.
- shadcn/ui components: `pnpm exec shadcn add <component>`, then `pnpm check:fix`.

## Project structure

```
src/
├── main.tsx           → Entry point: MSW in development, settings restore, chunk reload guard, React root with Sentry error handlers
├── AppProvider.tsx    → Providers: Redux, ErrorBoundary, Router
├── routes/            → Route table with the page ErrorBoundary and Suspense (index.tsx), lazy pages (<Name>/<Name>Page.tsx)
├── features/          → Feature slices: <feature>/store/ and <feature>/components/
├── shared/
│   ├── config/        → Environment values (env.ts, typed in src/vite-env.d.ts) and Sentry setup
│   ├── helpers/       → Utilities: localStorage, error tracking, chunk preload errors, cn() re-export
│   └── store/         → Store setup, RTK Query base API, typed hooks, test helpers
├── UI/
│   ├── Base/          → shadcn/ui components, managed by the shadcn CLI
│   ├── Elements/      → Project components (Text, Container, SkeletonList, ErrorFallback) built on Base and Tailwind
│   └── Layout/        → Header and global.css (theme)
└── test/              → MSW handlers, browser worker (development) and Node server (tests)
e2e/                   → Cucumber features, steps, page objects and support code
```

## Architecture

- Components only display data from selectors and dispatch actions; they hold no business logic.
- Business and domain logic lives in reducers and selectors, which stay pure.
- Side effects go in RTK Query endpoints, thunks or listener middleware.
- Each feature is self-contained and exposes its state through the namespaces of `store/index.ts`.

## Rules

Detailed rules live in `.agents/rules/`. `.claude/rules` is a symlink to that folder, so Claude Code loads each rule when it touches a matching file. Other agents must read the rules that match the files they change before editing them.

| Rule                  | Applies to                                                                                                                                                               |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `typescript.md`       | `**/*.{ts,tsx,mts}`                                                                                                                                                      |
| `react-components.md` | `src/**/*.tsx`                                                                                                                                                           |
| `ui-styling.md`       | `src/**/*.tsx`                                                                                                                                                           |
| `routes.md`           | `src/routes/**`                                                                                                                                                          |
| `redux-state.md`      | `src/features/**/store/**`, `src/shared/store/**`                                                                                                                        |
| `shadcn-base.md`      | `src/UI/Base/**`, `components.json`                                                                                                                                      |
| `global-css.md`       | `src/UI/Layout/global.css`                                                                                                                                               |
| `unit-tests.md`       | `src/**/*.spec.{ts,tsx}`, `src/test/**`, `src/shared/store/test.tsx`, `scripts/vitest.setup.ts`                                                                          |
| `e2e-tests.md`        | `e2e/**`, `cucumber.mjs`                                                                                                                                                 |
| `tooling.md`          | `package.json`, `vite.config.mts`, `tsconfig*.json`, `biome.json`, `.github/workflows/**`, `.releaserc`, `commitlint.config.cjs`, `.husky/**`, `renovate.json`, `.nvmrc` |

Official skills complement the rules: Redux Toolkit ships them in `node_modules/@reduxjs/toolkit/skills/`, and shadcn publishes one (`pnpm dlx skills add shadcn/ui`). Where a skill disagrees with a rule, the rule wins.

Edit rules in `.agents/rules/`, never through the `.claude/rules` link. Add a new rule there with a `paths` list in its frontmatter and list it in this table.

## Validation checklist

Before considering a task done:

- [ ] `pnpm check` passes (Biome and `tsc -b`).
- [ ] `pnpm test` passes.
- [ ] `pnpm build` passes.
- [ ] `pnpm e2e:local` passes when routes, user flows or `data-testid` attributes changed.
- [ ] shadcn components were added with the CLI and formatted with `pnpm check:fix`.
- [ ] The lockfile changed only if the task changed dependencies.

## Commits and releases

- Commits follow [Conventional Commits](https://www.conventionalcommits.org/), `type(scope): description`, enforced by commitlint. Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `style`, `test`, `perf`, `ci`, `build`, `revert`.
- Husky hooks: pre-commit runs `pnpm biome check --staged` and `pnpm test`; commit-msg runs commitlint.
- Pull requests to `main` run `.github/workflows/ci.yml`. Every push to `main` runs `.github/workflows/release.yml`. Both run the checks in `verify.yml` (check, unit tests with coverage thresholds, build, e2e). Then the release runs semantic-release, which bumps the version, writes `CHANGELOG.md` and publishes a GitHub release. `fix`, `perf`, `refactor`, `style` and `docs(README)` commits produce a patch release, `feat` a minor one, and a `BREAKING CHANGE` footer a major one.

## Boundaries

- **Always**: run the validation checklist; read environment values through `src/shared/config/env.ts`; keep `src/UI/Base` managed by the shadcn CLI.
- **Ask first**: changes to `.github/workflows/`, `.releaserc`, `commitlint.config.cjs`, the `style` or `aliases` in `components.json`, Sentry data collection in `src/shared/config/sentry.ts`, new dependencies, new top-level folders.
- **Never**: commit `.env` or secrets (the Sentry DSN and API URL come from `VITE_SENTRY_DSN` and `VITE_API_URL`); bump `version` or edit `CHANGELOG.md` by hand; commit generated output (`dist/`, `coverage/`, `reports/`, `traces/`, `screenshots/`); add ESLint or Prettier; skip hooks with `--no-verify`.
