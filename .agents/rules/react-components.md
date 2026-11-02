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
- From another feature or a route, import a feature's components through its `components/index.ts`, its state through the exports of its `store/index.ts` (the namespaces `SettingsSelectors` and `SubscriptionApi`, the `SettingsActions` object) and its types and constants from `store/<feature>.type.ts`. Components never import `*.slice.ts` or `*.api.ts`; specs may import the API object for `api.util` and `api.endpoints`.
- Render errors reach Sentry only through the `createRoot` callbacks in `src/main.tsx`; do not call Sentry from an `ErrorBoundary` `onError`. Send an error from an event handler or async code to the page's route `ErrorBoundary` by keeping it in state and throwing it during render (`if (error) throw error;`); never use `useErrorBoundary().showBoundary`, which reaches only the last-resort boundary in `AppProvider` and replaces the whole app. Handled errors outside rendering (effects, thunks) go through `captureError` (see `redux-state.md`).
- Show a failed RTK Query request (`isError`) with its own state and a retry, as `SubscriptionList` does: never let it fall through to the empty state. Gate that state on `isError && !data`: a failed refetch keeps the cached `data`, so keep showing it. Gate the skeleton on `!data && isFetching`, not on `isLoading`, which stays false when a retry follows a failed request. The exception is a small widget outside the page content, such as `UserWidget` in the header: when its first request fails it may render nothing, but it still keeps the cached data when a refetch fails.

## Shape and typing

- Write components as plain functions with typed props (`function Name({ title }: NameProps)`, with `type NameProps = { … }`); never `React.FC` and never `forwardRef` (`ref` is a regular prop in React 19).
- Never define a component inside another component: its state resets on every render. Pages load through the route `lazy` property (see `routes.md`), not `React.lazy()`.
- Type children as `ReactNode`, never `JSX.Element`.
- Extend native elements with `React.ComponentProps<'tag'>`, spread `...props` and merge `className` with `cn()`.
- Model variants that change the accepted props as discriminated unions; prefer one union prop to several mutually exclusive booleans.
- Type DOM handlers with React event types (`ChangeEvent<HTMLInputElement>`); narrow the `string` passed to Radix callbacks (`onValueChange`) with a type guard, not `as`.
- Return `null` to render nothing.
- Use `<Context value={...}>`, not `<Context.Provider>`.
- For DOM setup and teardown (observers, third-party widgets) use a ref callback that returns a cleanup, and keep it stable (module level or `useCallback`): an inline callback is torn down and re-created on every render. To observe several children without a wrapper element, use `<Fragment ref>` (React 19.3).
- Split a component that grows past about 120 lines: one component per data concern, JSX section or conditional branch, with layout separate from content.
- Use named exports; only route pages are default exports, for the route `lazy` loader (see `typescript.md` for `.ts` modules).

## Performance

- React Compiler (Babel preset in `vite.config.mts`) memoizes components, hooks and the values computed in them at build time: do not add `memo`, `useMemo` or `useCallback`. Keep them only where a library needs a stable value and you want that explicit (`useMemo(() => api.endpoints.getX.select(id), [id])`), or where a profiler measurement shows the compiler is not enough. `dispatch` is already stable.
- The compiler silently skips a component or hook that breaks the Rules of React, and no lint reports it here (Biome has no compiler rules): keep render pure, never mutate props, state or values after passing them to JSX, and never read or write refs during render.
- Never suppress `lint/correctness/useExhaustiveDependencies`, an error among Biome's recommended rules; fix the dependency list. `biome.json` marks the result of `useAppDispatch` as stable.
