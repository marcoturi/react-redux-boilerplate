![React Redux Boilerplate](https://github.com/marcoturi/react-redux-boilerplate/blob/main/doc/images/react_redux_boilerplate.jpg?raw=true)

[![MIT License](https://img.shields.io/github/license/marcoturi/react-redux-boilerplate)](https://github.com/marcoturi/react-redux-boilerplate/blob/main/LICENSE) ![CodeQL](https://img.shields.io/github/actions/workflow/status/marcoturi/react-redux-boilerplate/codeql-analysis.yml?label=CodeQL) ![Release](https://img.shields.io/github/actions/workflow/status/marcoturi/react-redux-boilerplate/release.yml?label=Release)

A production-ready, batteries-included starter template for building long-lived React applications. It provides opinionated guidelines for the key decisions every team faces at scale:

- **Folder structure** -- [Vertical slice architecture](#folder-structure-and-code-organization) for maintainability and easy extraction into a monorepo.
- **State management** -- [Redux Toolkit 2](#state-management-why-redux) for predictable, traceable state with clear separation of concerns.
- **Release automation** -- [Semantic-release](#release-system) for hands-off versioning, changelogs, and tags.
- **Code quality** -- [Biome](#format-and-style) for blazing-fast linting and formatting in a single tool.
- **UI system** -- [Radix + shadcn/ui + Tailwind CSS 4](#ui-components-and-style-system) for accessible, headless, minimal-dependency components.
- **Testing** -- [Vitest + Testing Library](#testing) for unit/integration, [Cucumber + Playwright](#testing) for E2E.
- **Error tracking** -- [Sentry](#error-handling-and-analytics) with Redux state replay for production debugging.

## Features

| Category | Stack |
|---|---|
| Build | [Vite 7](https://vitejs.dev/) + [React 19](https://react.dev/) + [SWC](https://github.com/vitejs/vite-plugin-react-swc) + [pnpm](https://pnpm.io/) + [TypeScript 5.9](https://www.typescriptlang.org) |
| State | [Redux Toolkit 2](https://redux-toolkit.js.org/) (includes RTK Query, Immer, Reselect) |
| UI | [Radix](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/) + [Tailwind CSS 4](https://tailwindcss.com/) |
| Linting & formatting | [Biome](https://biomejs.dev/) |
| Release | [Husky](https://github.com/typicode/husky) + [Commitlint](https://commitlint.js.org/) + [Semantic-release](https://github.com/semantic-release/semantic-release) |
| API mocking | [MSW](https://mswjs.io/) (browser + test, powered by [@mswjs/data](https://github.com/mswjs/data)) |
| Unit & integration tests | [Vitest 4](https://vitest.dev/) + [Testing Library](https://testing-library.com/) |
| E2E tests | [Cucumber](https://cucumber.io/docs/installation/javascript/) + [Playwright](https://playwright.dev/) |
| Monitoring | [Sentry](https://github.com/getsentry/sentry-javascript/tree/master/packages/react) |
| Security | [CodeQL](https://github.com/github/codeql-action) analysis on every push/PR |

## Getting Started

### Prerequisites

| Requirement | Version | Notes |
|---|---|---|
| Node.js | 24.x | Defined in `.nvmrc`. Use [fnm](https://github.com/Schniz/fnm) or [nvm](https://github.com/nvm-sh/nvm): `fnm use` / `nvm use` |
| pnpm | 10.x | `corepack enable` to activate the bundled version |

### Quick start

```bash
npx degit marcoturi/react-redux-boilerplate my-app
cd my-app

pnpm install       # Install dependencies
pnpm create:env    # Create .env from .env.example
pnpm dev           # Start dev server at http://localhost:5173
```

### Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start development server with HMR |
| `pnpm build` | Type-check + production build (output in `dist/`) |
| `pnpm preview` | Preview the production build locally |
| `pnpm test` | Run unit and integration tests (Vitest) |
| `pnpm test:coverage` | Run tests with V8 coverage report |
| `pnpm e2e:local` | Run E2E tests (start dev server first in another terminal) |
| `pnpm e2e:debug` | Run only `@only`-tagged E2E scenarios with `--fail-fast` |
| `pnpm check` | Biome lint/format check + TypeScript type check |
| `pnpm check:fix` | Auto-fix lint/format issues, then type check |
| `pnpm format` | Format all files with Biome |
| `pnpm lint` | Lint all files with Biome |
| `pnpm type:check` | TypeScript type check only (`tsc --noEmit`) |
| `pnpm update:interactive` | Update dependencies interactively |

## Folder Structure and Code Organization

> **TL;DR** -- Embrace [vertical slice architecture](https://www.jimmybogard.com/vertical-slice-architecture/). Each feature owns its components, state, API calls, and tests.

```
src/
├── main.tsx                  → App entry point
├── AppProvider.tsx            → Providers (Suspense, Redux, Radix Theme, ErrorBoundary, Router)
├── assets/                   → Static files (images, fonts, etc.)
├── routes/                   → Route definitions + page components (lazy-loaded via React.lazy)
│   ├── index.tsx             → Route tree
│   ├── Home/
│   └── Subscriptions/
├── shared/
│   ├── config/               → Environment variables, Sentry setup
│   ├── helpers/              → Generic utilities (localStorage, style utils, etc.)
│   └── store/                → Redux store setup, base RTK Query API, typed hooks
├── UI/
│   ├── Elements/             → Reusable UI components (shadcn/ui based)
│   └── Layout/               → Page layouts, Header, global CSS
├── features/                 → Feature slices
│   └── <feature>/
│       ├── store/            → Redux slice, selectors, effects, types, specs
│       ├── components/       → Feature-specific React components
│       ├── hooks/            → Feature-specific React hooks
│       └── services/         → Services consumed by Redux
└── test/                     → MSW handlers, mock DB, test utilities
```

Why vertical slices over alternatives like [Atomic Design](https://atomicdesign.bradfrost.com/chapter-2/) or [Feature-Sliced Design](https://feature-sliced.design/)?

1. **Less navigation** -- Feature code lives in one folder, not scattered across layers.
2. **Easy extraction** -- A feature folder can move to a monorepo package with minimal refactoring (helped by `@/` path aliases).
3. **Parallel development** -- Teams can work on different features without conflicts.
4. **Simpler testing** -- Each feature can be tested in isolation.

### FAQ

**Q: What if the `features/` folder grows too large?**
A: Group related features inside scope folders (e.g., `features/billing/invoices/`). Aim for no more than ~6 folders at the same level.

**Q: I only have a Redux slice with no components. Where does it go?**
A: Still in `features/`. It may grow components later, and a consistent location makes it easy to find.

## State Management: Why Redux?

> **TL;DR** -- Redux keeps state changes predictable and traceable. Combined with Sentry, you get full replay of every user action in production.

Redux Toolkit 2 enforces a clear separation of responsibilities:

| Layer | Responsibility |
|---|---|
| **Components** | Dispatch actions, display data via selectors. Zero business logic. |
| **Selectors & Reducers** | Business and domain logic. Pure functions -- easy to test and compose. |
| **RTK Query / Thunks / Listener Middleware** | Side effects (API calls, async flows, cross-slice reactions). |

![Redux flow](https://github.com/marcoturi/react-redux-boilerplate/blob/main/doc/images/redux_architecture.gif?raw=true)

Newer state management solutions often trade boilerplate for ambiguity about _where_ business logic belongs. Without a clear, project-defined location, domain logic gravitates into UI components -- making them large, hard to test, and hard to maintain.

With Redux, typed hooks (`useAppDispatch`, `useAppSelector`) and pure selectors keep components thin and logic centralized.

## UI Components and Style System

> **TL;DR** -- Pick a headless UI library with few dependencies. Encapsulate it so you can replace it later.

### Radix + shadcn/ui

- **Minimal dependencies** -- Components are copied into your project, not installed as a black-box package.
- **Separation of design and behavior** -- shadcn/ui provides unstyled primitives you own and customize.
- **Accessible by default** -- All components adhere to [WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/) patterns. See [this talk](https://www.youtube.com/watch?v=pcMYcjtWwVI) for details.

Components live in `src/UI/Elements/` and are managed via the [shadcn CLI](https://ui.shadcn.com/docs/cli) (`npx shadcn@latest add <component>`).

### Tailwind CSS 4

[Tailwind CSS 4](https://tailwindcss.com/blog/tailwindcss-v4) is used via the `@tailwindcss/vite` plugin -- no PostCSS config needed. Key benefits:

- **Utility-first** -- Consistent styling with zero CSS files to maintain.
- **Design tokens** -- Theme defined as CSS variables in `src/UI/Layout/global.css` using `@theme inline`.
- **Built-in responsive and a11y** -- First-class responsive utilities and accessibility helpers.
- **Tree-shaken** -- Only used classes end up in the production bundle.

## Testing

### Unit and integration tests

Tests use **Vitest 4** with **Testing Library** and **jsdom**. Test files live next to the code they test with a `.spec.ts` / `.spec.tsx` suffix.

API mocking uses **MSW** with `@mswjs/data` for a realistic, in-memory database that powers both development and tests.

### E2E tests

E2E tests use **Cucumber** (Gherkin syntax) with **Playwright** as the browser automation engine.

```bash
# First time setup
pnpm exec playwright install

# Run (dev server must be running)
pnpm dev &
pnpm e2e:local
```

### Build optimization

Production builds use vendor chunk splitting for optimal caching:

| Chunk | Contents |
|---|---|
| `vendor-react` | React, React DOM, React Router, React Redux |
| `vendor-redux` | Redux Toolkit (RTK Query, Immer, Reselect) |
| `vendor-radix` | Radix UI primitives and themes |
| `vendor-sentry` | Sentry SDK |
| `vendor-ui` | CVA, clsx, tailwind-merge, Lucide icons |

Routes are **lazy-loaded** via `React.lazy()` for automatic code splitting.

## Release System

> **TL;DR** -- Merge to `main` and everything else is automated.

The release pipeline is fully automated with [semantic-release](https://semantic-release.gitbook.io/semantic-release/):

1. Developer merges a PR into `main`.
2. CI runs tests and E2E.
3. semantic-release analyzes commits, determines the version bump, generates the changelog, creates a GitHub release and git tag.

No manual version bumps. No manual changelog edits.

### Toolkit

| Tool | Purpose |
|---|---|
| [Commitlint](https://commitlint.js.org/) | Enforces [Conventional Commits](https://www.conventionalcommits.org/) format (`feat:`, `fix:`, `chore:`, etc.) |
| [Husky](https://github.com/typicode/husky) | Runs commitlint + tests on pre-commit |
| [Semantic-release](https://github.com/semantic-release/semantic-release) | Automates versioning, changelogs, GitHub releases, and git tags |

### Why Conventional Commits?

- **Automated changelogs** -- Commit messages drive what goes into `CHANGELOG.md`.
- **Semantic versioning** -- `feat` = minor, `fix` = patch, `BREAKING CHANGE` = major.
- **Readable history** -- Anyone can scan `git log` and understand the nature of each change at a glance.

## Format and Style

> **TL;DR** -- One tool, one config. [Biome](https://biomejs.dev/) handles linting, formatting, and import sorting.

Biome replaces the traditional ESLint + Prettier combo with a single, Rust-powered tool. It provides:

- 300+ lint rules covering correctness, style, complexity, and suspicious patterns
- Built-in formatter for TypeScript, JSX, JSON, and CSS
- Automatic import sorting and `import type` enforcement
- Sub-second execution on the entire codebase

Configuration lives in [`biome.json`](./biome.json). The pre-commit hook runs `biome check --staged` automatically.

## Error Handling and Analytics

> **TL;DR** -- When Redux is used correctly, every user action is traceable in production.

[Sentry](https://github.com/getsentry/sentry-javascript/tree/master/packages/react) is integrated with the Redux store enhancer, which means:

- **In development** -- Redux DevTools shows every state transition in real time.
- **In production** -- Sentry captures the full sequence of dispatched Redux actions leading up to an error, plus the application state at the moment of the crash.

![Sentry redux actions](https://github.com/marcoturi/react-redux-boilerplate/blob/main/doc/images/redux%20actions.png?raw=true)

This allows you to reproduce issues by replaying the exact action sequence, or even rehydrating the state snapshot:

![Sentry redux state](https://github.com/marcoturi/react-redux-boilerplate/blob/main/doc/images/redux%20state.png?raw=true)

## Recommended Libraries

These are not included in the boilerplate but are recommended additions depending on your needs:

| Need | Recommendation | Notes |
|---|---|---|
| Dates | [date-fns](https://github.com/date-fns/date-fns) | Modular, tree-shakeable. [Moment.js is in maintenance mode](https://momentjs.com/docs/#/-project-status/). |
| Forms | [react-hook-form](https://github.com/react-hook-form/react-hook-form) | Zero dependencies, excellent performance and DX. |

## Contributing

Contributions are welcome! To get started:

1. Clone the repo and install dependencies (`pnpm install`)
2. Create a branch: `git checkout -b feat/your-feature`
3. Make your changes
4. Verify: `pnpm check` (lint, format, types) and `pnpm test`
5. Commit using [Conventional Commits](https://www.conventionalcommits.org/) (enforced by the pre-commit hook)
6. Open a Pull Request

> This project includes an [`AGENTS.md`](./AGENTS.md) file with detailed instructions for AI coding agents.

## License

[MIT](./LICENSE)
