---
paths:
  - "package.json"
  - "vite.config.mts"
  - "tsconfig*.json"
  - "biome.json"
  - ".github/workflows/**"
---

# Tooling and configuration

- Use pnpm only (`packageManager` in `package.json`). Add dependencies with exact versions: `pnpm add -E <pkg>`, with `-D` for dev dependencies. The shadcn CLI adds dependencies with `^` ranges: pin them after every `shadcn add`. Change the lockfile only in dependency tasks.
- Take the Node.js version from `.nvmrc` (26.x) and run `fnm use` or `nvm use` before commands.
- Load Tailwind CSS only through `@tailwindcss/vite`: no PostCSS config and no `tailwind.config.*`.
- When adding a vendor dependency, check the chunk groups in `build.rolldownOptions.output.codeSplitting.groups` (`vite.config.mts`); groups match in order and the first match wins.
- The `msw/vite` plugin serves the MSW worker: never add `mockServiceWorker.js` to `public/`.
- Vite resolves the `@/` alias from the tsconfig `paths` (`resolve.tsconfigPaths`); keep the root `tsconfig.json` and `tsconfig.app.json` in sync.
- Add every new tsconfig project to `references` in the root `tsconfig.json`, so that `tsc -b` checks it.
- Biome is the only linter and formatter: do not add ESLint or Prettier. Besides the recommended rules it enforces:
  - `useExhaustiveDependencies` as an error, with `useAppDispatch` marked as stable;
  - `noExplicitAny`;
  - the Tailwind rules `useTailwindSortedClasses`, `noTailwindRawColors` and `noTailwindLegacyUtilities`, reading the theme from `tailwind.stylesheet`, and switched off for `src/UI/Base/**`.
- Fix the code rather than adding `biome-ignore`; when an ignore is unavoidable, state the reason in it.
- Ask before changing `.github/workflows/`, `.releaserc` or `commitlint.config.cjs`. The release pipeline runs check, build, unit tests, e2e and semantic-release on every push to `main`.
