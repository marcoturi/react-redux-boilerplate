import { Text as RadixText } from '@radix-ui/themes';
import { cn } from '@/shared/helpers/style.utils';

type TextProps = React.ComponentProps<typeof RadixText>;

export function Text(props: TextProps) {
  const additionalClasses =
    props.as === 'p' ? 'leading-7 [&:not(:first-child)]:mt-6' : '';

  return (
    <RadixText {...props} className={cn(props.className, additionalClasses)} />
  );
}
