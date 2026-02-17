'use client'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-md">
        <h2 className="text-xl font-semibold">Something went wrong</h2>
        <p className="text-muted-foreground text-sm">
          An unexpected error occurred. Please try again.
        </p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </main>
  )
}
