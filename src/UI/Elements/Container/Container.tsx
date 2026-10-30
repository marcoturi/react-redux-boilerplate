import { Container as RadixContainer } from '@radix-ui/themes';
import { cn } from '@/shared/helpers/style.utils';

export function Container({
  className,
  ...props
}: React.ComponentProps<typeof RadixContainer>) {
  // Radix centers only the inner box: mx-auto centers the narrowed outer one
  return (
    <RadixContainer
      className={cn('mx-auto w-11/12 pt-10', className)}
      {...props}
    />
  );
}
