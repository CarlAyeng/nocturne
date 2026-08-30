import { cn } from '../../utils/cn'

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton rounded-xl', className)} aria-hidden="true" />
}

/** A card-shaped loading placeholder used on shelves. */
export function CardSkeleton() {
  return (
    <div className="w-full">
      <Skeleton className="aspect-square w-full rounded-2xl" />
      <Skeleton className="mt-3 h-4 w-3/4" />
      <Skeleton className="mt-2 h-3 w-1/2" />
    </div>
  )
}

/** A generic page skeleton used as a Suspense fallback for lazy routes. */
export function PageSkeleton() {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <Skeleton className="h-9 w-64" />
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
