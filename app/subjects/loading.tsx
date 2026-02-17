import { Skeleton } from '@/components/ui/skeleton'

export default function SubjectsLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-xl" />
        ))}
      </div>
    </div>
  )
}
