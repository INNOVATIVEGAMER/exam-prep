import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-md">
        <h2 className="text-xl font-semibold">Page not found</h2>
        <p className="text-muted-foreground text-sm">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </main>
  )
}
