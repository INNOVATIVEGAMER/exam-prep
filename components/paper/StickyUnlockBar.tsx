'use client'
import { BuyButton } from '@/components/payment/BuyButton'
import { Lock } from 'lucide-react'

interface StickyUnlockBarProps {
  paperId: string
  price: number // in paisa
  paperTitle: string
  /** When false (paper is already unlocked), this component renders nothing */
  locked: boolean
}

/**
 * A fixed bottom bar shown on mobile when the paper is locked.
 * Hidden on md+ screens where the PaywallOverlay handles the CTA inline.
 */
export function StickyUnlockBar({ paperId, price, paperTitle, locked }: StickyUnlockBarProps) {
  if (!locked) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t p-4 flex items-center justify-between gap-3 md:hidden">
      <div className="flex items-center gap-2 min-w-0">
        <Lock className="size-4 text-muted-foreground shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">Unlock Answers</p>
          <p className="text-xs text-muted-foreground">₹{price / 100} · one-time</p>
        </div>
      </div>
      <BuyButton
        paperId={paperId}
        price={price}
        paperTitle={paperTitle}
        className="shrink-0"
      />
    </div>
  )
}
