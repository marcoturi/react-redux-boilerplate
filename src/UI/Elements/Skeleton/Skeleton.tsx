import { cn } from '@/shared/helpers/style.utils';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('bg-primary/10 animate-pulse rounded-md', className)}
      {...props}
    />
  );
}

function SkeletonCard({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center space-x-4', className)}
      {...props}
    >
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

function SkeletonList({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props}>
      <SkeletonCard className="py-5" />
      <SkeletonCard className="py-5" />
      <SkeletonCard className="py-5" />
    </div>
  );
}

export { Skeleton, SkeletonCard, SkeletonList };
