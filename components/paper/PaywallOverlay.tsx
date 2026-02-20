'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PaywallOverlay() {
  const pathname = usePathname()
  const next = encodeURIComponent(pathname)

  return (
    <div className="relative overflow-hidden rounded-lg border border-dashed bg-muted/20">
      {/* Invisible spacer */}
      <div className="px-4 py-24" aria-hidden="true" />

      {/* Auth gate overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/80 backdrop-blur-[2px]">
        <div className="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary">
          <Sparkles className="size-5" />
        </div>
        <div className="text-center space-y-0.5">
          <p className="text-sm font-semibold">Free answer inside</p>
          <p className="text-xs text-muted-foreground">
            Create a free account to unlock all answers &amp; solutions
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-1">
          <Button asChild size="sm">
            <Link href={`/signup?next=${next}`}>Sign Up Free</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/login?next=${next}`}>Sign In</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
