---
paths:
  - "package.json"
  - "pnpm-workspace.yaml"
  - "vite.config.mts"
  - "tsconfig*.json"
  - "e2e/tsconfig*.json"
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
- pnpm 12 settings live in `pnpm-workspace.yaml`: pnpm ignores the `pnpm` field of `package.json`, and `.npmrc` holds only registry and auth. A dependency that needs its install script goes in `allowBuilds` (none does today). `trustPolicy: no-downgrade` fails the install when a version has less trust evidence than an earlier one; for a false positive add that exact version to `trustPolicyExclude`, never turn the policy off. Keep `minimumReleaseAge: 1440` written in `pnpm-workspace.yaml` (versions younger than one day are not installed): only an explicit value is strict, pnpm's built-in default falls back to a younger version when no version in the range is old enough. Keep it and the same delay in `renovate.json`; when a fix cannot wait, add the package to `minimumReleaseAgeExclude` instead of lowering the delay.
- pnpm writes its own version to the lockfile: after changing `packageManager`, run `pnpm install` and commit the lockfile, or `pnpm install --frozen-lockfile` fails in CI.
- Take the Node.js version from `.nvmrc` (26.x) and run `fnm use` or `nvm use` before commands. Keep `engines` in `package.json` on the same majors (`^26.0.0`, `^12.0.0`) and `@types/node` on the Node.js major (`allowedVersions` in `renovate.json`).
- Load Tailwind CSS only through `@tailwindcss/vite`: no PostCSS config and no `tailwind.config.*`.
- React Compiler runs through Babel: `babel({ presets: [reactCompilerPreset()] })` from `@rolldown/plugin-babel`, after `react()` in `vite.config.mts`, with `@babel/core` and `babel-plugin-react-compiler`. It is left out under Vitest (`process.env.VITEST`), so coverage measures the source rather than the compiler's cache checks; the dev server, e2e and the build run compiled code. Do not switch to `react({ compiler: true })`, which plugin-react marks experimental. Keep `@rolldown/plugin-babel` within the range that `@vitejs/plugin-react` accepts as a peer (`pnpm peers check`).
- When adding a vendor dependency, check the chunk groups in `build.rolldownOptions.output.codeSplitting.groups` (`vite.config.mts`); groups match in order and the first match wins. A group gathers every matching module and loads it with the first page: add one only for code needed at startup (React, Redux, Sentry), never for UI libraries that some routes use (Radix, lucide).
- The build uses Vite's default target (`baseline-widely-available`); keep `target` (root `tsconfig.json`) and the `lib` of `tsconfig.app.json` within it (ES2022, ES2023 lib).
- The `msw/vite` plugin serves the MSW worker on the dev server only (`apply: 'serve'`): never add `mockServiceWorker.js` to `public/`. `initMocks` (`src/mocks/index.ts`) checks `import.meta.env.DEV` first, so the build drops MSW and the mock data: keep that check static, and never import `src/mocks/` or `src/test/` from app code other than that call in `main.tsx`.
- Vite resolves the `@/` alias from the tsconfig `paths` (`resolve.tsconfigPaths`); `paths` lives only in the root `tsconfig.json`, which the projects extend.
- A new tsconfig project extends the root `tsconfig.json`, which holds the options the projects share (target, lint flags, `paths`), sets only what differs, and goes in the root `references`, so that `tsc -b` checks it.
- Biome is the only linter and formatter: do not add ESLint or Prettier. `pnpm lint` and `pnpm check` only report; `lint:fix` and `check:fix` write. Besides the recommended rules it turns on others (see `biome.json`), notably:
  - `useExhaustiveDependencies` as an error, with `useAppDispatch` marked as stable;
  - `noExplicitAny` as an error (recommended rules only warn, and warnings do not fail `pnpm check`);
  - the Tailwind rules `useTailwindSortedClasses`, `noTailwindRawColors` and `noTailwindLegacyUtilities`, reading the theme from `tailwind.stylesheet`, and switched off for `src/UI/Base/**`.
- Fix the code rather than adding `biome-ignore`; when an ignore is unavoidable, state the reason in it.
- Ask before changing `.github/workflows/`, `.releaserc` or `commitlint.config.cjs`. `verify.yml` (check, unit and component tests with coverage thresholds, build, e2e) runs on every pull request to `main` through `ci.yml` and before every release through `release.yml`, which then runs semantic-release on `main`. CI installs only Chromium's headless shell (`playwright install --with-deps --only-shell chromium`) before the tests: Vitest browser mode and the e2e scenarios both run in it, headless.
- semantic-release parses commits with the `conventionalcommits` preset (`.releaserc`, both the commit analyzer and the release notes), the same convention commitlint checks, so `feat!:` and a `BREAKING CHANGE` or `BREAKING-CHANGE` footer make a major release: do not override the preset's `parserOpts`. The release notes list the same types that make a release (`presetConfig.types` of the notes generator): keep that list and the analyzer's `releaseRules` in sync. Its release notes writer (v8) renders only preset v9, while commitlint brings v10: `packageExtensions` in `pnpm-workspace.yaml` gives the two plugins v9. Remove that block once `@semantic-release/release-notes-generator` ships writer v9.
- Reference GitHub Actions by major tag only (`actions/checkout@v7`): no minor or patch tags (`@v7.1.1`) and no commit SHAs. `renovate.json` turns off digest pinning for them.
