import { Skeleton } from '@/components/ui/skeleton'

export default function SubjectLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-6">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-4 w-full" />
      <div className="space-y-3 pt-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    </div>
  )
}
