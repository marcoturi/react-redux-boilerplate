---
paths:
  - "package.json"
  - "pnpm-workspace.yaml"
  - "vite.config.mts"
  - "tsconfig*.json"
  - "biome.json"
  - ".github/workflows/**"
  - ".releaserc"
  - "commitlint.config.cjs"
  - ".husky/**"
  - "renovate.json"
  - ".nvmrc"
---

# Tooling and configuration

- Use pnpm only (`packageManager` in `package.json`). Add dependencies with exact versions: `pnpm add -E <pkg>`, with `-D` for dev dependencies. The shadcn CLI adds dependencies with `^` ranges: pin them after every `shadcn add`. Change the lockfile only in dependency tasks.
- pnpm 12 settings live in `pnpm-workspace.yaml`: pnpm ignores the `pnpm` field of `package.json`, and `.npmrc` holds only registry and auth. A dependency that needs its install script goes in `allowBuilds`. Keep the default `minimumReleaseAge` (versions younger than one day are not installed) and the same delay in `renovate.json`; when a fix cannot wait, add the package to `minimumReleaseAgeExclude` instead of lowering the delay.
- pnpm writes its own version to the lockfile: after changing `packageManager`, run `pnpm install` and commit the lockfile, or `pnpm install --frozen-lockfile` fails in CI.
- Take the Node.js version from `.nvmrc` (26.x) and run `fnm use` or `nvm use` before commands.
- Load Tailwind CSS only through `@tailwindcss/vite`: no PostCSS config and no `tailwind.config.*`.
- When adding a vendor dependency, check the chunk groups in `build.rolldownOptions.output.codeSplitting.groups` (`vite.config.mts`); groups match in order and the first match wins.
- The build uses Vite's default target (`baseline-widely-available`); keep `target` and `lib` of `tsconfig.app.json` within it (ES2022, ES2023 lib).
- The `msw/vite` plugin serves the MSW worker on the dev server only (`apply: 'serve'`): never add `mockServiceWorker.js` to `public/`. `initMocks` checks `import.meta.env.DEV` first, so the build drops MSW: keep that check static.
- Vite resolves the `@/` alias from the tsconfig `paths` (`resolve.tsconfigPaths`); keep the `paths` of the root `tsconfig.json`, `tsconfig.app.json` and `tsconfig.node.json` in sync.
- Add every new tsconfig project to `references` in the root `tsconfig.json`, so that `tsc -b` checks it.
- Biome is the only linter and formatter: do not add ESLint or Prettier. `pnpm lint` and `pnpm check` only report; `lint:fix` and `check:fix` write. Besides the recommended rules it enforces:
  - `useExhaustiveDependencies` as an error, with `useAppDispatch` marked as stable;
  - `noExplicitAny` as an error (recommended rules only warn, and warnings do not fail `pnpm check`);
  - the Tailwind rules `useTailwindSortedClasses`, `noTailwindRawColors` and `noTailwindLegacyUtilities`, reading the theme from `tailwind.stylesheet`, and switched off for `src/UI/Base/**`.
- Fix the code rather than adding `biome-ignore`; when an ignore is unavoidable, state the reason in it.
- Ask before changing `.github/workflows/`, `.releaserc` or `commitlint.config.cjs`. `verify.yml` (check, unit tests with coverage thresholds, build, e2e) runs on every pull request through `ci.yml` and before every release through `release.yml`, which then runs semantic-release on `main`.
