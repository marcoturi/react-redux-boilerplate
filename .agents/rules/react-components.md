---
paths:
  - "src/**/*.tsx"
---

# React components

Applies to hand-written components. `src/UI/Base/**` is upstream shadcn code and follows `shadcn-base.md` instead.

## Responsibilities

- Components only display data and dispatch actions. Business and domain logic live in selectors and reducers (see `redux-state.md`).
- Do not filter, sort, aggregate or compute derived data in a component: add a selector and select its result (or use `selectFromResult` for data from a single query).
- Decide where state lives by who needs it, not by prop depth: app-wide, shared or persisted state goes in Redux; state used by one subtree stays local. Avoid prop drilling with composition (`children`, JSX props), and let components that need store data select it themselves instead of receiving it from a parent.
- Keep UI state (open/closed, hover) and uncommitted form input in local state, and dispatch once when the user commits. Never mirror store or server data into `useState` and sync it with `useEffect`; to start a form draft from store data, reset the form with a `key`.
- Load server data only with the RTK Query hooks of the feature (`SubscriptionApi.useGetSubscriptionsQuery()`); no `fetch` and no data loading in `useEffect`.
- Use `useEffect` only to synchronize with an external system, and return a cleanup. Event-driven work belongs in the handler.
- Read the latest props or state inside an effect with `useEffectEvent`, within its limits (Biome does not check them): call it only from the Effects of the same component or hook, never during render, never pass it to other components or hooks, never list it in dependencies, and never use it to silence the dependency lint.
- Read state with `useAppSelector` and dispatch with `useAppDispatch` from `@/shared/store/types`; never use `useSelector` or `useDispatch` from `react-redux` directly.
- Import feature state through the namespaces of the feature's `store/index.ts` (`SettingsActions`, `SettingsSelectors`, `SubscriptionApi`), never from `*.slice.ts` or `*.api.ts`.
- Render errors reach Sentry only through the `createRoot` callbacks in `src/main.tsx`; do not call Sentry from an `ErrorBoundary` `onError`. Send errors from event handlers and async code to the nearest boundary with `useErrorBoundary().showBoundary` (`react-error-boundary`). Handled errors outside rendering (effects, thunks) go through `captureError` (see `redux-state.md`).
- Show a failed RTK Query request (`isError`) with its own state and a retry, as `SubscriptionList` does: never let it fall through to the empty state.

## Shape and typing

- Write components as plain functions with typed props (`function Name({ title }: NameProps)`); never `React.FC` and never `forwardRef` (`ref` is a regular prop in React 19).
- Never define a component, or call `lazy()`, inside another component: its state resets on every render.
- Type children as `ReactNode`, never `JSX.Element`.
- Extend native elements with `React.ComponentProps<'tag'>`, spread `...props` and merge `className` with `cn()`.
- Model variants that change the accepted props as discriminated unions; prefer one union prop to several mutually exclusive booleans.
- Type DOM handlers with React event types (`ChangeEvent<HTMLInputElement>`); narrow the `string` passed to Radix callbacks (`onValueChange`) with a type guard, not `as`.
- Return `null` to render nothing.
- Use `<Context value={...}>`, not `<Context.Provider>`.
- For DOM setup and teardown (observers, third-party widgets) use a ref callback that returns a cleanup, and keep it stable (module level or `useCallback`): an inline callback is torn down and re-created on every render. To observe several children without a wrapper element, use `<Fragment ref>` (React 19.3).
- Split a component that grows past about 120 lines: one component per data concern, JSX section or conditional branch, with layout separate from content.
- Use named exports; only route pages are default exports, for `lazy()` (see `typescript.md` for `.ts` modules).

## Performance

- There is no React Compiler: do not add `memo`, `useMemo` or `useCallback` without a profiler measurement. Exceptions: values used as dependencies of other hooks, stable ref callbacks, and values a library needs to be stable (`useMemo(() => api.endpoints.getX.select(id), [id])`). `dispatch` is already stable.
- Never suppress `lint/correctness/useExhaustiveDependencies`, which is an error in `biome.json`; fix the dependency list. Biome knows that `useAppDispatch` returns a stable value.
