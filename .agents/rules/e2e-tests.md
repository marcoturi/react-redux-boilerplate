---
paths:
  - "e2e/**"
  - "cucumber.mjs"
---

# E2E tests (Cucumber 13 and Playwright)

- Scenarios live in `e2e/features/*.feature`, step definitions in `e2e/steps/`, page objects in `e2e/page-objects/`, and hooks, world and config in `e2e/support/`.
- Locate elements through page objects, by `data-testid` or role; add the `data-testid` to the component when it is missing.
- Use web-first assertions that retry (`await expect(locator).toHaveCount(n)`, `toBeVisible()`); never assert once on `count()` or `textContent()`.
- Never use fixed waits (`waitForTimeout`): wait for a locator or a state.
- Prefer Cucumber expressions (`{string}`, `{int}`) to regular expressions, and type the step parameters.
- Each scenario starts from a fresh browser context (`e2e/support/common-hooks.ts`); never depend on another scenario.
- Do not use `any` in the world, hooks or steps.
- Steps run through tsx, which does not type-check: run `pnpm type:check` after changing e2e code.
- Run locally with the dev server up: `pnpm dev` in one terminal and `pnpm e2e:local` in another; `pnpm e2e:debug` runs only `@only` scenarios with `--fail-fast`.
- CI runs `pnpm e2e` with `--retry 5`, which can hide flaky scenarios: fix flakiness instead of relying on retries.
- `reports/`, `traces/` and `screenshots/` are generated output: never commit them.
