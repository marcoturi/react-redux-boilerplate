import { Skeleton } from '@/UI/Base/skeleton';

function SkeletonCard() {
  return (
    <div className="flex items-center gap-4 py-5">
      <Skeleton className="size-12 rounded-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-62.5" />
        <Skeleton className="h-4 w-50" />
      </div>
    </div>
  );
}

export function SkeletonList(props: React.ComponentProps<'div'>) {
  return (
    <div role="status" {...props}>
      <span className="sr-only">Loading…</span>
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}
