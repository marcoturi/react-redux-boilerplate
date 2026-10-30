---
paths:
  - "src/**/*.spec.{ts,tsx}"
  - "src/test/**"
  - "scripts/vitest.setup.ts"
---

# Unit and integration tests (Vitest 5, Testing Library, MSW 3)

- Put tests next to the code they test, as `<file>.spec.ts` or `<file>.spec.tsx`. Mock data files end in `.mocks.spec.ts` and are excluded from test runs.
- Vitest globals (`describe`, `it`, `expect`, `vi`) need no import.
- Prefer integration tests that render components with `renderWithProviders` from `@/shared/store/test`. It creates a fresh store and a `MemoryRouter` for each test; pass `route` for URL-dependent UI. Never import the app's singleton `store`.
- Unit-test only complex reducers and selectors: call `reducer(state, action)` directly, or build the state with `setupStore(preloadedState)`, dispatched actions and `await store.dispatch(api.util.upsertQueryData(...))`. Do not cast partial objects `as RootState`.
- `scripts/vitest.setup.ts` fails a test on any request without a handler (`onUnhandledRequest: 'error'`) and clears localStorage after each test.
- Mock the network only with MSW: shared handlers in `src/test/handlers/`, one-off responses with `server.use(...)` inside the test. Never mock hooks, selectors or `fetch`.
- Type handler responses and mock data with the domain types (`satisfies User`, enum members), so mocks cannot drift from the API types.
- Query by role, label or text (`getByRole` first); use `getByTestId` only as a last resort. The `data-testid` attributes are mainly for e2e.
- Wait for the UI with `findBy*` rather than `waitFor(() => getBy*)`; inside `waitFor` keep one assertion and no side effects. Never wait with timeouts.
- Call `userEvent.setup()` before `render`, and await every `user.*` call and every dispatched thunk.
- With fake timers use `vi.useFakeTimers({ shouldAdvanceTime: true })` and `userEvent.setup({ advanceTimers: vi.advanceTimersByTime })`, otherwise `findBy*` and user events hang. To fix only the date, `vi.setSystemTime()` alone is enough. Never assert on the real current date.
- Make each test create its own data; never depend on test order or on state left by another test.
- Type store variables as `AppStore` (`@/shared/store/types`) instead of suppressing `noImplicitAnyLet`.
- Investigate a flaky test with `pnpm vitest run <file> -t "<name>"` and `--sequence.shuffle`; do not add retries.
- Run `pnpm test` before finishing; `pnpm test:coverage` reports coverage for `src/`.
