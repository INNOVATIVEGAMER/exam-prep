'use client'
import { Answer } from '@/types'
import { PaywallOverlay } from '@/components/paper/PaywallOverlay'
import { MarkdownContent } from '@/components/paper/MarkdownContent'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2 } from 'lucide-react'

interface AnswerCardProps {
  answer: Answer | null
  /** Whether the paper/answer set is locked (not purchased) */
  locked: boolean
  /** Price shown in paywall — in paisa */
  price: number
  /** Paper ID passed to BuyButton for order creation */
  paperId: string
  /** Paper title shown in Razorpay checkout description */
  paperTitle: string
}

export function AnswerCard({ answer, locked, price, paperId, paperTitle }: AnswerCardProps) {
  if (locked || answer === null) {
    return <PaywallOverlay paperId={paperId} price={price} paperTitle={paperTitle} />
  }

  return (
    <div className="rounded-lg border border-green-200 bg-green-50/50 p-4 space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
        Answer
      </p>

      {/* Correct option for MCQ */}
      {answer.correct_option && (
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-4 text-green-600 shrink-0" />
          <span className="text-sm font-medium">
            Correct option:{' '}
            <Badge variant="secondary" className="uppercase">
              {answer.correct_option}
            </Badge>
          </span>
        </div>
      )}

      {/* Solution text — rendered as Markdown + KaTeX math */}
      <MarkdownContent content={answer.solution} className="text-foreground" />

      {/* Key points */}
      {answer.key_points && answer.key_points.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Key Points
          </p>
          <ul className="space-y-1">
            {answer.key_points.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-1.5 size-1.5 rounded-full bg-primary shrink-0" />
                <MarkdownContent
                  content={point}
                  className="inline [&>p]:inline [&>p]:my-0"
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
