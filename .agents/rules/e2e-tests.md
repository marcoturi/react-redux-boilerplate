---
paths:
  - "e2e/**"
  - "cucumber.mjs"
---

# E2E tests (Cucumber 13 and Playwright)

- Scenarios live in `e2e/features/*.feature`, step definitions in `e2e/steps/`, page objects in `e2e/page-objects/`, and hooks and world in `e2e/support/`. `BROWSER=firefox` or `BROWSER=webkit` runs the scenarios in another engine (Chromium by default; install the others with `pnpm exec playwright install firefox webkit`), `PWVIDEO=1` records a video of each scenario in `screenshots/`, and `PWDEBUG=1` opens the Playwright inspector and turns off the step timeout.
- Locate elements through page objects, by role (`page.getByRole('navigation').getByRole('link', { name: 'Subscriptions' })`) or by `data-testid` when no role fits; add the `data-testid` to the component when it is missing. Do not put test ids in app data such as the menu items. A page object is a named function of `page` that returns locators as properties (they are lazy) and actions as methods; register it in `createPageObjects` (`e2e/page-objects/index.ts`), from which the world type derives.
- Use web-first assertions that retry (`await expect(locator).toHaveCount(n)`, `toBeVisible()`); never assert once on `count()` or `textContent()`.
- Never use fixed waits (`waitForTimeout`): wait for a locator or a state.
- Write steps with Cucumber expressions (`{string}`, `{int}`), not regular expressions. Type the world once with the generic (`Given<CustomWorld>(…)`, also on `Before` and `After`) instead of `this: CustomWorld`, and type the step parameters.
- Each scenario starts from a fresh browser context (`e2e/support/common-hooks.ts`); never depend on another scenario.
- The world is one class, `CustomWorld extends World<WorldParams>`, where `WorldParams` matches `worldParameters` in `cucumber.mjs`; do not add a separate interface. `page` and `pageObjects` are not optional because the `Before` hook sets them for every scenario that runs its steps. `context` is optional: `After` hooks also run when a `Before` hook was skipped (`@pending`) or failed, so they check it and take the page from `context.pages()`.
- Node runs the steps directly, stripping the types without checking them: import relative files with their `.ts` extension (`../page-objects/index.ts`), and run `pnpm type:check` after changing e2e code.
- CI (`.github/workflows/verify.yml`) starts the dev server, waits until it answers and runs `pnpm e2e` with `--retry 1`. A scenario that passes only on retry is flaky: fix it instead of adding retries. The run uploads `reports/` and the Playwright traces of failed scenarios (`traces/`) as the `reports` artifact.
