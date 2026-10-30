---
paths:
  - "src/**/*.tsx"
---

# Styling with Tailwind CSS 4 and shadcn/ui

Applies to code that uses components. `src/UI/Base/**` is exempt: it is upstream code.

## Components

- Prefer an installed or installable shadcn component to custom markup: `Skeleton` instead of `animate-pulse` divs, `Separator` instead of `border-t` divs, `Empty` for empty lists, `Badge`, `Alert`. Add missing ones with the CLI (see `shadcn-base.md`).
- For toasts use `sonner`: mount one `<Toaster />` in `AppProvider` and call `toast()`. Do not add a `next-themes` provider; once a theme toggle exists, pass `theme` to `<Toaster />` from the app's theme state.
- Use the built-in `variant` and `size` props before custom classes.
- On shadcn components use `className` for layout only (margin, width, grid placement), never for colors or typography.
- Compose with the documented slots, using only the ones you need: `CardHeader` (with `CardTitle`, `CardDescription`, `CardAction`), then `CardContent` and `CardFooter` inside `Card`; items inside their group with its label (`SelectGroup` with `SelectLabel`, and the same for DropdownMenu, Menubar, ContextMenu and Command); a Title in every Dialog, Sheet, Drawer and AlertDialog (`sr-only` if it must be hidden).
- Use `asChild` for custom triggers and links (Radix base), never `render`, and do not wrap triggers in extra elements. The same applies to `NavigationMenuLink`, `BreadcrumbLink` and `Badge`.
- Never add `z-*` classes to portalled or overlay components (they use `z-50`); keep page chrome such as the sticky header below 50.
- Import icons from `lucide-react` and pass them as components (`icon={CheckIcon}`), not as string keys. Inside shadcn components (Button, SelectItem, DropdownMenuItem, Alert) do not size icons, and mark Button icons with `data-icon="inline-start"` or `"inline-end"`. Outside components give icons an explicit `size-*` (lucide defaults to 24px).
- Button has no loading prop: render `<Button disabled><Spinner data-icon="inline-start" />…</Button>`.
- Build forms with `Field`, `FieldGroup`, `FieldLabel` and `FieldDescription`, and `FieldSet` with `FieldLegend` for checkbox or radio groups. Mark errors with `data-invalid` on the `Field` and `aria-invalid` on the control, and disabled fields with `data-disabled` plus `disabled`. Use `InputGroup` for buttons inside inputs and `ToggleGroup type="single"` for 2–7 options.

## Tailwind

- Use semantic tokens only (`bg-primary`, `text-muted-foreground`, `border-border`): no palette colors (`bg-blue-500`), hex, `oklch()` or arbitrary colors. New tokens go in `src/UI/Layout/global.css`.
- Do not write `dark:` color overrides: the tokens already switch with the `.dark` class.
- Lay out with `flex` or `grid` and `gap-*`, not `space-x-*` or `space-y-*`. Use `size-*` when width and height are equal, and `truncate` for a one-line ellipsis.
- Build conditional classes with `cn()` from `@/shared/helpers/style.utils`, never with template-literal ternaries.
- Never build class names by interpolation (`` `bg-${color}-500` ``): Tailwind only generates complete class names, so map values to complete strings or `cva` variants.
- Write mobile-first: base classes for small screens, then `sm:`, `md:`, `lg:`. Use container queries (`@container`, `@md:`) when a component's layout depends on its slot rather than the viewport.
- Prefer the scale to arbitrary values. Spacing accepts any multiple of 0.25: `w-62.5` is 250px, `leading-7.5` is 30px, `max-w-284` is 1136px. Use arbitrary values only when no scale value or theme token fits (e.g. `text-[28px]`), and reference variables as `bg-(--x)`, not `bg-[var(--x)]`. Promote a value used more than once to a token in `global.css`.
- Use the Tailwind 4 names: `shadow-sm`, not bare `shadow`; `rounded-sm` to `rounded-4xl`, not bare `rounded`, so the radius follows `--radius`; `outline-hidden` for the old `outline-none`; `inset-s-*` and `inset-e-*`, not `start-*` and `end-*`.
- Style states with variants (`data-*`, `aria-*`, `has-*`, `in-*`, and `data-open:` or `data-checked:` from `shadcn/tailwind.css`) instead of class toggles computed in JavaScript.
- Add `min-w-0` to flex or grid children whose text must truncate.
- Use `focus-visible:` for the focus ring of custom interactive elements.
- Animate with CSS (`tw-animate-css` utilities), not with an animation library, and wrap custom animations in `motion-safe:` or give them a `motion-reduce:` fallback.
- Do not fade readable text with opacity (`text-foreground/50`); use `text-muted-foreground`. Opacity modifiers are fine on backgrounds, borders and rings.
- Give icon-only controls an `aria-label` or an `sr-only` label; mark decorative icons with `aria-hidden`.
- Biome enforces class order (`useTailwindSortedClasses`, fixed by `pnpm check:fix`), semantic colors (`noTailwindRawColors`) and v4 names (`noTailwindLegacyUtilities`); do not reorder classes by hand.

## Project helpers

- Use `Text` (`@/UI/Elements/Text`) for text on the project type scale (`size="6"`, `size="7"`) and `Container` (`@/UI/Elements/Container`) for the page width; extend them instead of repeating their classes.
