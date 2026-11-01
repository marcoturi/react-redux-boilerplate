---
paths:
  - "src/routes/**"
---

# Routes and pages

- The app is a client-side SPA on React Router 8 in data mode: `createRoutes(store)` in `src/routes/index.tsx` returns the route objects, `createAppRouter(store)` passes them to `createBrowserRouter` (wrapped by Sentry), and `src/main.tsx` creates the router once, after the mocks and the settings are ready, and gives it to `<RouterProvider>` in `src/AppProvider.tsx`. There is no server rendering and no framework mode. Import router APIs from `react-router`; `react-router-dom` no longer exists, and DOM-only APIs such as `RouterProvider` come from `react-router/dom`.
- A page is `src/routes/<Name>/<Name>Page.tsx` with a default export, registered as a child route in `createRoutes` with `lazy: { Component: page(() => import('./<Name>/<Name>Page')) }`. Add a `menuItems` entry in the same file when the page needs a menu link. Unknown URLs render `NotFoundPage` (`path: '*'`).
- Start a page's server data in the route `loader`, which the router runs when the navigation starts, in parallel with the page download: dispatch the feature's prefetch thunk (`SubscriptionApi.prefetchSubscriptions()`, built on `api.util.prefetch`) to the `store` that `createRoutes` receives, and return `null`. Do not await the request and do not return data from the loader: the page reads it with the feature's query hook and shows its own loading and error states (see `react-components.md`). Never import the `store` singleton in routes.
- Keep loaders static in the route object, not inside `lazy`: a loader in the lazy module would wait for the page download.
- Pages render inside a pathless route with `ErrorBoundary: ErrorFallback`, under `AppLayout` (header and `<main>`): a crash, a page chunk that fails to load or a failed loader replaces only the page, the header stays, and the error clears on the next navigation. The `ErrorBoundary` in `src/AppProvider.tsx` is only the last resort for crashes outside the routes: do not add other app-wide boundaries.
- Render errors reach Sentry through the `createRoot` callbacks in `src/main.tsx`; `onError` on `RouterProvider` reports only the errors React does not see (loaders, page modules), so nothing is reported twice.
- The first load shows `HydrateFallback` (the page skeleton). On client navigation the router keeps the previous page until the next page module is ready, and `AppLayout` shows a progress bar while `useNavigation().state` is `'loading'`.
- `src/main.tsx` reloads the page on `vite:preloadError`, which fires when a new deploy removed chunks that an open tab still references.
- Pages compose feature components inside `Container` (`@/UI/Elements/Container`) and contain no logic.
- Set the page title by rendering one `<title>` in the page (React 19 hoists it to `<head>`) with a single string child (`` {`Results ${n}`} ``, not `Results {n}`); do not add react-helmet. Assert `document.title` in e2e when it matters.
- Give the page root a `data-testid` when e2e tests need to find it (e.g. `home-page`).
- Put the page spec next to it (`<Name>Page.spec.tsx`), rendered with `renderWithProviders`; use its `route` option for URL-dependent UI. Test the route tree, loaders included, with `renderRoutes(createRoutes, { route })` from `@/test/render`, as `src/routes/index.spec.tsx` does.
