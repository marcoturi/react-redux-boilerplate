---
paths:
  - "**/*.{ts,tsx,mts}"
---

# TypeScript

- Never write `any`: use `unknown` and narrow it, or a constrained generic. Biome `noExplicitAny` rejects explicit `any`, and `noImplicitAny` (from `strict`) rejects implicit ones in the app and Vite config.
- Annotate parameters that have no contextual type (callbacks passed around, selector inputs, helpers). The e2e project is not strict, so there the compiler does not report them.
- Catch errors as `unknown` and narrow them with `instanceof Error`.
- Narrow external data (API responses, localStorage, Radix `onValueChange` strings, env values) with a type guard (`value is T`), not with `as`.
- Check object literals with `satisfies T`, not `as T`.
- Derive types from values instead of repeating them: `typeof`, `keyof typeof`, `ReturnType`, `Awaited`, `Parameters`, `as const`.
- Make lookups exhaustive with `Record<Union, V>`; in a `switch` over a union, end with a `default` that assigns the value to `never`.
- Add a generic only when it links input and output types, and constrain it (`K extends keyof T`).
- Write assertion functions (`asserts x is T`) as `function` declarations, not arrow functions.
- Fix wrong or missing library types with module augmentation in a `.d.ts` (e.g. `ImportMetaEnv` in `src/vite-env.d.ts`), not with casts.
- Use `import type` for type-only imports (Biome `useImportType`).
- Import across features through the `@/` alias (maps to `src/`); never use relative imports that climb above the current feature.
- In browser code read environment values only through `src/shared/config/env.ts`; never use `process.env` there.
- Type-check with `pnpm type:check` (`tsc -b`: app, Vite config and e2e projects). `tsc --noEmit` at the root checks nothing, because the root `tsconfig.json` only holds references.
