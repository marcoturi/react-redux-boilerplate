import { cn } from '@/shared/helpers/style.utils';

// Type scale carried over from Radix Themes (font size / line height / tracking)
const sizes = {
  '6': 'text-2xl leading-[30px] tracking-[-0.00625em]',
  '7': 'text-[28px] leading-9 tracking-[-0.0075em]',
} as const;

type TextProps = React.HTMLAttributes<HTMLElement> & {
  as?: 'span' | 'p' | 'div';
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
      className={cn('leading-normal', size && sizes[size], className)}
      {...props}
    />
  );
}
