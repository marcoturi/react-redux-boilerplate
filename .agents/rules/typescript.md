---
paths:
  - "**/*.{ts,tsx,mts}"
---

# TypeScript

- Never write `any`: use `unknown` and narrow it, or a constrained generic. Biome `noExplicitAny` (an error in `biome.json`) rejects explicit `any`, and `noImplicitAny` (from `strict`) rejects implicit ones in every project: app, Vite config and e2e.
- Annotate parameters that have no contextual type (callbacks passed around, selector inputs, helpers).
- Catch errors as `unknown` and narrow them with `instanceof Error`.
- Narrow external data (API responses, localStorage, Radix `onValueChange` strings) with a type guard (`value is T`), not with `as`.
- Check object literals with `satisfies T`, not `as T`.
- No `enum`, `namespace` or constructor parameter properties: `erasableSyntaxOnly` is on in every project, so each file is plain JavaScript once the types are stripped. Model a fixed set of values as an `as const` object plus a type of the same name that is the union of its values (`export const SubscriptionType = { … } as const; export type SubscriptionType = (typeof SubscriptionType)[keyof typeof SubscriptionType];`).
- Derive types from values instead of repeating them: `typeof`, `keyof typeof`, `ReturnType`, `Awaited`, `Parameters`, `as const`.
- Make lookups exhaustive with `Record<Union, V>`; in a `switch` over a union, end with a `default` that assigns the value to `never`.
- Add a generic only when it links input and output types, and constrain it (`K extends keyof T`).
- Write assertion functions (`asserts x is T`) as `function` declarations, not arrow functions.
- Fix wrong or missing library types with module augmentation in a `.d.ts`, not with casts.
- Use `import type` for type-only imports (Biome `useImportType`).
- Import files of the same feature, or of the same folder outside `features/` and its subfolders (e.g. `src/shared/store/`, `src/UI/Layout/Header/`, `./Home/HomePage` from `src/routes/`), with relative paths (`./settings.type`, `../store`); import everything else through the `@/` alias (maps to `src/`). Never climb above the current feature or folder with `../`, and never write `/index`: import the folder (`.`, `../store`). The one exception is `../../../package.json` in `src/shared/config/env.ts`: the alias stops at `src/`.
- Use named exports. Default exports are only for route pages (the route `lazy` loader reads them), `vite.config.mts` (Vite requires it) and the existing single-object modules `src/shared/config/env.ts`, `src/shared/store/api.ts` and `src/shared/helpers/local-storage.service.ts`.
- `noUncheckedIndexedAccess` is on in every project: an index access (`list[0]`, `record[key]`) may be `undefined`. Narrow it or use `?.`; do not assert it with `!`.
- Environment variables: declare each `VITE_*` variable in `ImportMetaEnv` (`src/vite-env.d.ts`, where `strictImportMetaEnv` makes an undeclared one a type error), add it to `.env.example`, and read it in browser code only through `src/shared/config/env.ts`. Never use `process.env` there. The one exception is `import.meta.env.DEV` written inline where it gates development-only code, so the build can drop it (see `tooling.md`).
- Type-check with `pnpm type:check` (`tsc -b`: the app with its mocks and test helpers, the Vite config and the e2e project). `tsc --noEmit` at the root checks nothing, because the root `tsconfig.json` has no files: it holds the references and the options the projects share.
