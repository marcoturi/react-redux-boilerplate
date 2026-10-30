---
paths:
  - "src/UI/Layout/global.css"
---

# Theme and global CSS

`src/UI/Layout/global.css` is the only stylesheet. Tailwind CSS 4 is configured in CSS through `@tailwindcss/vite`: there is no `tailwind.config.*`. Biome reads this file (`tailwind.stylesheet` in `biome.json`) to know the theme.

- Keep `source("../..")` on `@import "tailwindcss"`, so Tailwind scans only `src/`. Without it, class names written in docs and rules (`.agents/`, README) end up in the CSS.
- Keep this order for the blocks that exist: imports (`tailwindcss`, `tw-animate-css`, `shadcn/tailwind.css`), `@custom-variant`, `@theme`, `@theme inline`, `:root`, `.dark`, a single `@layer base`, then `@utility`.
- Add a color as `--x` (plus `--x-foreground` when text sits on it) in both `:root` and `.dark`, written in OKLCH, and map it in `@theme inline` as `--color-x: var(--x)`.
- Reference variables as `var(--x)`; never wrap them again in `hsl()` or `oklch()`. In CSS use `var()`, `--spacing(n)` and `--alpha()`, never `theme()`, which is deprecated.
- Change the radius only through `--radius`: the `--radius-*` scale derives from it, so components use `rounded-sm` to `rounded-4xl` (bare `rounded` and `rounded-xs` do not follow it).
- Put static tokens (font sizes with line height and tracking, container widths) in `@theme`; put tokens that reference other variables (e.g. `--font-sans: var(--font-x)`) in `@theme inline`.
- Name custom tokens with the scale suffixes (`--text-2xs`, `--text-5xl`, `--container-3xl`) so `cn` can merge their classes: with an invented name such as `--text-title`, `cn('text-title', 'text-muted-foreground')` drops one of the two.
- Define reusable classes with `@utility`, not with `@apply` chains; use `@apply` only for the resets in `@layer base`. Prefer a component in `src/UI/Elements/` to a multi-property `@utility`.
- Keep `:root` and `.dark` outside `@layer base`, and never nest `@theme` inside `.dark`.
- Do not add other CSS files or `tailwindcss-animate`: animations come from `tw-animate-css`.
- Dark mode is the `.dark` class. The variant `&:is(.dark *)` matches the descendants of `.dark`, not `<html>` itself. When a theme toggle is added, an inline script in the `<head>` of `index.html` sets `dark` on `<html>` before React loads, reading the localStorage key the app writes (`@@MYAPP_SETTINGS_<key>`, JSON-encoded); also add `color-scheme: dark` to `.dark`.
