'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface StickyUnlockBarProps {
  /** When false (paper is already unlocked), this component renders nothing */
  locked: boolean
}

/**
 * A fixed bottom bar shown on mobile when the paper is locked (user not signed in).
 * Hidden on md+ screens where PaywallOverlay handles the CTA inline.
 */
export function StickyUnlockBar({ locked }: StickyUnlockBarProps) {
  const pathname = usePathname()
  const next = encodeURIComponent(pathname)

  if (!locked) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t p-4 flex items-center justify-between gap-3 md:hidden">
      <div className="flex items-center gap-2 min-w-0">
        <Sparkles className="size-4 text-primary shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">Unlock all answers</p>
          <p className="text-xs text-muted-foreground">Free · just create an account</p>
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        <Button asChild variant="outline" size="sm">
          <Link href={`/login?next=${next}`}>Sign In</Link>
        </Button>
        <Button asChild size="sm">
          <Link href={`/signup?next=${next}`}>Sign Up</Link>
        </Button>
      </div>
    </div>
  )
}
