import { Skeleton } from '@/components/ui/skeleton'

export default function PaperLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-8">
      <Skeleton className="h-6 w-32" />
      <div className="space-y-3">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    </div>
  )
}
