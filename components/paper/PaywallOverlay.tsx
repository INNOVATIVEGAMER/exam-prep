'use client'
import { Lock } from 'lucide-react'
import { BuyButton } from '@/components/payment/BuyButton'

interface PaywallOverlayProps {
  paperId: string
  price: number // in paisa
  paperTitle: string
}

export function PaywallOverlay({ paperId, price, paperTitle }: PaywallOverlayProps) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-dashed bg-muted/20">
      {/* Blurred content placeholder */}
      <div className="select-none blur-sm pointer-events-none px-4 py-6 text-sm text-muted-foreground space-y-1.5 aria-hidden">
        <div className="h-3 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-full" />
        <div className="h-3 bg-muted rounded w-5/6" />
        <div className="h-3 bg-muted rounded w-2/3" />
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/80 backdrop-blur-[2px]">
        <div className="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary">
          <Lock className="size-5" />
        </div>
        <div className="text-center space-y-0.5">
          <p className="text-sm font-semibold">Unlock Answers</p>
          <p className="text-xs text-muted-foreground">
            One-time purchase for lifetime access
          </p>
        </div>
        <p className="text-lg font-bold">₹{price / 100}</p>
        <BuyButton
          paperId={paperId}
          price={price}
          paperTitle={paperTitle}
          className="h-8 px-4 text-sm"
        />
      </div>
    </div>
  )
}
