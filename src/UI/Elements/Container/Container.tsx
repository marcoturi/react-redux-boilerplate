import { Container as RadixContainer } from '@radix-ui/themes';
import { cn } from '@/shared/helpers/style.utils';

export function Container({
  className,
  ...props
}: React.ComponentProps<typeof RadixContainer>) {
  return (
    <RadixContainer className={cn('w-11/12 pt-10', className)} {...props} />
  );
}
