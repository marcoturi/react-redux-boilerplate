---
paths:
  - "src/**/*.spec.{ts,tsx}"
  - "src/test/**"
  - "src/shared/store/test.tsx"
  - "scripts/vitest.setup.ts"
---

# Unit and integration tests (Vitest 5, Testing Library, MSW 3)

- Put tests next to the code they test, as `<file>.spec.ts` or `<file>.spec.tsx`. Mock data lives in `src/test/mocks/<feature>.ts`, shared by the MSW handlers and the specs.
- Vitest globals (`describe`, `test`, `expect`, `vi`) need no import. Write `test`, not `it` (Biome `useConsistentTestIt`).
- Prefer integration tests that render components with `renderWithProviders` from `@/shared/store/test`. It creates a fresh store and a `MemoryRouter` for each test; pass `route` for URL-dependent UI. Never import the app's singleton `store`.
- Unit-test only complex reducers and selectors: call `reducer(state, action)` directly, or build the state with `setupStore(preloadedState)`, dispatched actions and `await store.dispatch(api.util.upsertQueryData(...))`. Do not cast partial objects `as RootState`.
- `scripts/vitest.setup.ts` fails a test that sent a request without a handler, even when the code hides the failed request (`onUnhandledFrame`, the MSW 3 name of `onUnhandledRequest`, collects them and `afterEach` asserts there are none), and clears localStorage after each test.
- Mock the network only with MSW: shared handlers in `src/test/handlers/` (URLs built from `env.API_URL`), one-off responses with `server.use(...)` inside the test, importing `server` from `@/test/server` (`{ once: true }` to fail only the first request). Put a one-off handler that several specs need in the feature's handler file as a factory (`subscriptionsFailOnce()`): a `once` handler stays used after its first match, so a shared instance would be skipped. Never mock hooks, selectors or `fetch`; mock a module only at the edge of the app (Sentry, `captureError`).
- Read persisted settings with `readStoredSetting(key)` from `@/test/storage`.
- Cover failures, not only the happy path: an API error through `server.use`, corrupt or missing localStorage data.
- Type handler responses and mock data with the domain types (`satisfies User`, enum members), so mocks cannot drift from the API types.
- Query by role, label or text (`getByRole` first); use `getByTestId` only as a last resort. The `data-testid` attributes are mainly for e2e.
- Wait for the UI with `findBy*` rather than `waitFor(() => getBy*)`; inside `waitFor` keep one assertion and no side effects. Never wait with timeouts.
- Call `userEvent.setup()` before `render`, and await every `user.*` call and every dispatched thunk.
- In a test that uses fake timers together with `findBy*` or `userEvent`, use `vi.useFakeTimers({ shouldAdvanceTime: true })` and `userEvent.setup({ advanceTimers: vi.advanceTimersByTime })`, otherwise they hang; plain `vi.useFakeTimers()` is fine for code without them. To fix only the date, `vi.setSystemTime()` alone is enough. Never assert on the real current date.
- Make each test create its own data; never depend on test order or on state left by another test.
- Type store variables as `AppStore` (`@/shared/store/types`) instead of suppressing `noImplicitAnyLet`.
- Investigate a flaky test with `pnpm vitest run <file> -t "<name>"` and `--sequence.shuffle`; do not add retries.
- Run `pnpm test` before finishing. `pnpm test:coverage` measures `src/` except entry points, test helpers and `src/UI/Base`, and fails under the thresholds in `vite.config.mts`, as CI does: add tests rather than lowering them.
