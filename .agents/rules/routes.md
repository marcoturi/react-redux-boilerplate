---
paths:
  - "src/routes/**"
---

# Routes and pages

- The app uses React Router 8 in declarative mode (`BrowserRouter`, `useRoutes`). Import router APIs from `react-router`; `react-router-dom` no longer exists, and DOM-only APIs such as `RouterProvider` come from `react-router/dom`.
- A page is `src/routes/<Name>/<Name>Page.tsx` with a default export, lazy-loaded with `lazy()` at module level in `src/routes/index.tsx` and registered in the `routes` array there. Add a `menuItems` entry in the same file when the page needs a menu link. Unknown URLs render `NotFoundPage` (`path: '*'`).
- Pages render inside an `ErrorBoundary`, reset when `location.pathname` changes, and a `<Suspense>` boundary, both in `src/routes/index.tsx`: a crash or a failed chunk replaces only the page and the header stays mounted. The `ErrorBoundary` in `src/AppProvider.tsx` is only the last resort for crashes outside the pages (header, providers): do not add other app-wide boundaries.
- The skeleton fallback shows on the first load. On client navigation React keeps the previous page until the new chunk arrives, because the router wraps navigation in a transition.
- Never choose which `lazy` component to render, or call `use()`, based on a Redux value: store updates cannot be transitions, so they would show the fallback. Let the route decide what suspends.
- `src/main.tsx` reloads the page on `vite:preloadError`, which fires when a new deploy removed chunks that an open tab still references.
- Pages compose feature components inside `Container` (`@/UI/Elements/Container`) and contain no logic.
- Set the page title by rendering one `<title>` in the page (React 19 hoists it to `<head>`) with a single string child (`` {`Results ${n}`} ``, not `Results {n}`); do not add react-helmet. Assert `document.title` in e2e when it matters.
- Give the page root a `data-testid` when e2e tests need to find it (e.g. `home-page`).
- Put the page spec next to it (`<Name>Page.spec.tsx`), rendered with `renderWithProviders`; use its `route` option for URL-dependent UI.
