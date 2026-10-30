import { cn } from '@/shared/helpers/style.utils';
import { Skeleton } from '@/UI/Base/skeleton';

function SkeletonCard({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex items-center gap-4', className)} {...props}>
      <Skeleton className="size-12 rounded-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-62.5" />
        <Skeleton className="h-4 w-50" />
      </div>
    </div>
  );
}

function SkeletonList(props: React.ComponentProps<'div'>) {
  return (
    <div {...props}>
      <SkeletonCard className="py-5" />
      <SkeletonCard className="py-5" />
      <SkeletonCard className="py-5" />
    </div>
  );
}

export { SkeletonCard, SkeletonList };
