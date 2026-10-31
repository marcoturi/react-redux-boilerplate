import { cn } from '@/shared/helpers/style.utils';

// Sizes of the project type scale: the tokens (font size, line height and
// tracking) are in the @theme block of global.css
const sizes = {
  '6': 'text-2xl',
  '7': 'text-3xl',
} as const;

// No `ref`: its element type would change with `as`
type TextProps = Omit<React.ComponentProps<'span'>, 'ref'> & {
  as?: 'span' | 'p' | 'div' | 'h1' | 'h2';
  size?: keyof typeof sizes;
};

export function Text({
  as: Tag = 'span',
  size,
  className,
  ...props
}: TextProps) {
  return (
    <Tag
      className={cn(size ? sizes[size] : 'leading-normal', className)}
      {...props}
    />
  );
}
