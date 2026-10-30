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
- Derive types from values instead of repeating them: `typeof`, `keyof typeof`, `ReturnType`, `Awaited`, `Parameters`, `as const`.
- Make lookups exhaustive with `Record<Union, V>`; in a `switch` over a union, end with a `default` that assigns the value to `never`.
- Add a generic only when it links input and output types, and constrain it (`K extends keyof T`).
- Write assertion functions (`asserts x is T`) as `function` declarations, not arrow functions.
- Fix wrong or missing library types with module augmentation in a `.d.ts`, not with casts.
- Use `import type` for type-only imports (Biome `useImportType`).
- Import across features through the `@/` alias (maps to `src/`); never use relative imports that climb above the current feature.
- Use named exports. Default exports are only for route pages (`lazy()` needs them) and for the existing single-object modules `src/shared/config/env.ts`, `src/shared/store/api.ts` and `src/shared/helpers/local-storage.service.ts`.
- Environment variables: declare each `VITE_*` variable in `ImportMetaEnv` (`src/vite-env.d.ts`, where `strictImportMetaEnv` makes an undeclared one a type error), add it to `.env.example`, and read it in browser code only through `src/shared/config/env.ts`. Never use `process.env` there.
- Type-check with `pnpm type:check` (`tsc -b`: the app with `scripts/vitest.setup.ts`, the Vite config and the e2e project). `tsc --noEmit` at the root checks nothing, because the root `tsconfig.json` only holds references.
