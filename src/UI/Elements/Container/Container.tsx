import { cn } from '@/shared/helpers/style.utils';

export function Container({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('mx-auto w-11/12 max-w-[1136px] pt-10', className)}
      {...props}
    />
  );
}
