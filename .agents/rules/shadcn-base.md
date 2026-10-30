---
paths:
  - "src/UI/Base/**"
  - "components.json"
---

# shadcn/ui components (`src/UI/Base`)

`src/UI/Base/` holds the shadcn/ui components (style `radix-vega`, Radix primitives from `radix-ui`, icons from `lucide-react`). The shadcn CLI 4.23 manages them; it is a devDependency, run as `pnpm exec shadcn`. The CLI fetches component code live from the registry, so pinning the CLI does not pin the components.

The official shadcn agent skill (`skills/shadcn` in github.com/shadcn-ui/ui, installable with `pnpm dlx skills add shadcn/ui`) covers the CLI and the component APIs in depth. Where it disagrees with this rule, this rule wins; in particular, use `pnpm exec shadcn`, never `shadcn@latest`.

## Adding components

- Add components only with the CLI, `pnpm exec shadcn add <component>`. Never copy component code from the docs or GitHub.
- Check what is installed first (`pnpm exec shadcn info --json` or `ls src/UI/Base`); do not re-add an installed component.
- Read `pnpm exec shadcn docs <component>`, including its Composition section, before using or fixing a component.
- After an `add`:
  - read the new files: imports, sub-components, and icons from the `iconLibrary` in `components.json` (lucide);
  - check `git diff package.json`: the CLI installs dependencies with `^` ranges, so pin them to exact versions and check the Vite chunk groups (see `tooling.md`);
  - check `git diff src/UI/Layout/global.css` and restore the order in `global-css.md`;
  - run `pnpm check:fix`.
- Without `--overwrite` the CLI skips files it lists as "overwrite" (e.g. `button.tsx` for `add dialog`). Run `--diff` on them, because the new component may need their updated version.
- Blocks and other non-UI items land flat in `src/UI/Elements/` (e.g. `login-form.tsx`): move them into `src/UI/Elements/<Name>/<Name>.tsx` with an `index.ts`, and rewrite imports hardcoded to `@/components/ui/*` into `@/UI/Base/*`.
- For third-party registries, ask the user which registry to use and inspect the code with `add <item> --view` before installing. Add namespaces with `pnpm exec shadcn registry add @ns=<url>`: names start with `@`, URLs contain `{name}`, and secrets use `${ENV}` references.

## Updating components

- Compare with upstream using `pnpm exec shadcn add <component> --diff <file>` (it implies `--dry-run`) and merge local edits by hand. The CLI already ignores the quote and spacing changes made by Biome; differences like `import type * as React` or the import order are Biome output, not local edits.
- Never pass `--overwrite` without the user's approval.

## Staying close to upstream

- No renames, no moves, no project logic: the CLI finds installed components by file name.
- Put a project-specific look in a new `cva` variant of the component, not in `className` overrides at every call site. The variant is a local edit that every later `--diff` merge must keep. Put compositions in `src/UI/Elements/<Name>/`.
- Leave upstream details alone (e.g. `select.tsx` sizes its own icons).
- If Biome flags upstream code, add an override for `src/UI/Base/**` in `biome.json`; do not edit the component or add `biome-ignore`.

## Configuration

- In `components.json`, do not hand-edit `style`, `aliases`, `rsc` (stays `false`), `menuColor` or `menuAccent`. `baseColor` and `cssVariables` cannot change after initialization.
- Change the icon library, base color or RTL only with `pnpm exec shadcn migrate icons|base-color|rtl`.
- `apply` overwrites every installed component in `src/UI/Base`. Before changing a preset, ask the user: inspect it with `pnpm exec shadcn preset resolve <code>` or `preset decode <code>`, then choose between overwriting (`apply <code>`), theme or font only (`apply <code> --only theme,font`), or keeping the components (`init --preset <code> --force --no-reinstall`).
- Do not remove the `shadcn` devDependency by hand: `global.css` imports `shadcn/tailwind.css`. `shadcn eject` inlines that CSS and drops the dependency; it cannot be undone, so run it only with the user's approval.
- Keep `compilerOptions.paths` in the root `tsconfig.json` in sync with `tsconfig.app.json`: the CLI resolves the aliases through the root file.
