import { cn } from 'cn';

export function Container({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('mx-auto w-11/12 max-w-284 pt-10', className)}
      {...props}
    />
  );
}
