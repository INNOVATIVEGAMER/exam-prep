'use client'
import { Lock } from 'lucide-react'
import { BuyButton } from '@/components/payment/BuyButton'

interface LockedQuestionsCardProps {
  /** Question numbers that are locked e.g. ["A2", "A3", ..., "A12"] */
  questionNumbers: string[]
  /** Price in paisa */
  price: number
  paperId: string
  paperTitle: string
}

export function LockedQuestionsCard({
  questionNumbers,
  price,
  paperId,
  paperTitle,
}: LockedQuestionsCardProps) {
  const count = questionNumbers.length
  if (count === 0) return null

  return (
    <div className="rounded-lg border border-dashed bg-muted/20 p-5 space-y-4">
      {/* Header row */}
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary shrink-0 mt-0.5">
          <Lock className="size-4" />
        </div>
        <div className="space-y-0.5">
          <p className="text-sm font-semibold">
            {count} more {count === 1 ? 'question' : 'questions'} locked
          </p>
          <p className="text-xs text-muted-foreground">
            Unlock once for lifetime access — includes full solutions &amp; key points
          </p>
        </div>
        <p className="ml-auto text-base font-bold shrink-0">₹{price / 100}</p>
      </div>

      {/* Question number chips */}
      <div className="flex flex-wrap gap-1.5 pl-11">
        {questionNumbers.map((num) => (
          <span
            key={num}
            className="inline-flex items-center gap-1 rounded-full border bg-background px-2 py-0.5 text-xs text-muted-foreground"
          >
            <Lock className="size-2.5" />
            {num}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div className="pl-11">
        <BuyButton
          paperId={paperId}
          price={price}
          paperTitle={paperTitle}
          className="h-8 px-5 text-sm"
        />
      </div>
    </div>
  )
}
