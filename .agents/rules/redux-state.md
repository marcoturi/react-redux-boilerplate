---
paths:
  - "src/features/**/store/**"
  - "src/shared/store/**"
---

# Redux state (Redux Toolkit 2 and RTK Query)

## Store layout

- `src/shared/store/index.ts` holds `rootReducer` (`combineSlices(baseApi, settingsSlice, …)`: the API and each slice mount under their own `reducerPath` or `name`, never under a key written by hand), `RootState` and `setupStore(preloadedState)`. `src/shared/store/types.ts` derives `AppStore` and `AppDispatch` from `setupStore` and creates the typed hooks. Never write these types by hand.
- In `setupStore`, keep `middleware` before `enhancers`, prepend the listener middleware, and concat the Sentry enhancer: it is typed `any`, and prepending it erases the thunk dispatch type. Do not disable or loosen the serializable and immutable checks of `getDefaultMiddleware`.
- Import the `store` singleton only in `src/main.tsx` and `src/AppProvider.tsx`; components use the typed hooks and tests use `setupStore`.
- Each feature keeps its state in `src/features/<feature>/store/`, in files named after its entity in the singular (`subscription.api.ts` in `subscriptions/`):
  - `<entity>.slice.ts`: `createSlice`, reducers hold the domain logic
  - `<entity>.selector.ts`: selectors. Those that read only the feature's own slice are declared in `createSlice({ selectors })`, which types them from the slice state and the slice `name`, and re-exported here (`export const { selectFilters } = settingsSlice.selectors`); selectors that read other slices or the API cache, and memoized ones, are written here
  - `<entity>.api.ts`: RTK Query endpoints injected into `baseApi` (`src/shared/store/api.ts`)
  - `<entity>.thunk.ts`: thunks for logic that is not server data
  - `<entity>.effect.ts`: listeners registered with `startAppListening`
  - `<entity>.type.ts`: feature types and their type guards
  - `index.ts`: barrel exporting namespaces (`export * as SettingsSelectors from './settings.selector'`, `SubscriptionApi`) and, when the feature has thunks, an actions object that joins them to the slice actions (`export const SettingsActions = { ...settingsSlice.actions, loadState }`)
- Register a new slice by adding it to `combineSlices` in `src/shared/store/index.ts`, and import its effect file there.
- Keep store code independent of components: types used by slices or selectors live in `store/`, never in `components/`.

## Actions and reducers

- Model actions as events, not setters (`subscriptionFilterChanged(filter)`): dispatch what happened plus the user input, and let the reducer compute the next state. Never read store state in a component to build a payload.
- Keep reducers and selectors pure: no I/O, no `Date.now()` or random values, no localStorage.
- Never spread or `Object.assign` external data into state: validate persisted or untrusted data (localStorage, external payloads) with a type guard, then assign the known fields.
- Type thunks that need state or dispatch with `createAsyncThunk.withTypes<{ state: RootState; dispatch: AppDispatch }>()`.

## Selectors

- Name selectors `selectX` (`selectUserFullName`).
- Write direct lookups as plain functions. Memoize with `createAppSelector` (`@/shared/store/selectors`, `createSelector.withTypes<RootState>()`) only when the result is a new array or object or the work is expensive: a new reference on every call makes `useAppSelector` re-render on every store change. When an input is an RTK Query `endpoint.select()` selector, annotate the other inputs as `(state: RootState)`, or their types are lost.
- Give result functions an explicit return type.
- For parameterized selection pass arguments to a shared selector, `useAppSelector((s) => selectX(s, id))`. Create a selector per component only with `useMemo` (`useMemo(() => api.endpoints.getX.select(id), [id])`), never on every render.

## Side effects

- Register listeners with `startAppListening` from `@/shared/store/listener`, typed with `RootState` and `AppDispatch`. Use `actionCreator` and let it type the action; do not annotate `PayloadAction` by hand. Read state in an effect through selectors (`SettingsSelectors.selectFilters(getState())`), not through the state path.
- Report failures that the UI does not show (a rejected thunk, a failed write to storage) with `captureError` from `@/shared/helpers/error-tracking.service`, as `settings.effect.ts` does for `loadState.rejected`.

## RTK Query

- Fetch server data with RTK Query, never with thunks that call `fetch`. Keep one `createApi` per base URL, inject endpoints per feature with `baseApi.injectEndpoints`, and use hooks and utils only from the object it returns.
- Give every endpoint its generics, `build.query<Result, Arg>`, with `void` when there is no argument. The generics type the response without checking it: when the API is not trusted, validate it with the endpoint's `responseSchema` (a Standard Schema library, a new dependency), not with a type guard in `transformResponse`.
- Do not pass `overrideExisting`: the default warns about duplicate endpoint names in development, while `'throw'` would also throw when Vite HMR re-runs an API module.
- Declare `tagTypes` in `baseApi` together with the first mutation, and use `providesTags` and `invalidatesTags`; prefer re-fetching through tags to manual cache updates.
- Update the cache by hand only in a mutation's `onQueryStarted`, never from components: optimistic with `updateQueryData` and `patchResult.undo()` on failure (invalidate the tags instead when mutations can overlap), pessimistic by awaiting `queryFulfilled` and then calling `updateQueryData` or `upsertQueryData`. Handle streaming data in `onCacheEntryAdded`.
- Skip conditional queries and selectors with `skipToken`, not `skip: true`. In `selectFromResult` return stable fallbacks (a module-level empty array) and never copy arrays.
- Use `build.infiniteQuery` for paginated lists.
- Do not change the app store setup to make a test pass (see `unit-tests.md`).
