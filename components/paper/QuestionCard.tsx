'use client'
import { Question } from '@/types'
import { Badge } from '@/components/ui/badge'
import { McqOptions } from '@/components/paper/McqOptions'
import { MarkdownContent } from '@/components/paper/MarkdownContent'
import { BuyButton } from '@/components/payment/BuyButton'
import { useAuth } from '@/hooks/useAuth'
import { Lock } from 'lucide-react'

interface QuestionCardProps {
  questionKey: string
  question: Question
  /** Slot for the answer card rendered below the question */
  answerSlot?: React.ReactNode
  /** Show user email watermark in the header — only for fully unlocked papers */
  showWatermark?: boolean
  /** When true the question itself is hidden and replaced with a paywall card */
  locked?: boolean
  /** Required when locked=true to render the paywall buy button */
  paperId?: string
  price?: number
  paperTitle?: string
}

export function QuestionCard({
  questionKey,
  question,
  answerSlot,
  showWatermark = false,
  locked = false,
  paperId,
  price,
  paperTitle,
}: QuestionCardProps) {
  const { user } = useAuth()

  // Locked question — replace entire card with a compact paywall placeholder
  if (locked) {
    return (
      <div className="rounded-lg border border-dashed bg-muted/20 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="inline-flex items-center justify-center size-7 rounded-full bg-muted text-muted-foreground text-xs font-bold shrink-0">
              {question.number}
            </span>
            <div className="flex items-center gap-1.5">
              <Lock className="size-3.5" />
              <span className="text-sm">Unlock to view this question &amp; answer</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="outline" className="text-xs">
              {question.marks} {question.marks === 1 ? 'mark' : 'marks'}
            </Badge>
            {paperId && price !== undefined && paperTitle && (
              <BuyButton
                paperId={paperId}
                price={price}
                paperTitle={paperTitle}
                className="h-7 px-3 text-xs"
              />
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      {/* Question header */}
      <div className="relative flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center size-7 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">
            {question.number}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {question.co && (
              <Badge variant="outline" className="text-xs">
                {question.co}
              </Badge>
            )}
            {question.bl && (
              <Badge variant="secondary" className="text-xs">
                {question.bl}
              </Badge>
            )}
          </div>
        </div>

        {/* Centered watermark */}
        {showWatermark && user?.email && (
          <span
            aria-hidden="true"
            className="absolute left-1/2 -translate-x-1/2 font-mono text-[11px] text-foreground/25 select-none pointer-events-none whitespace-nowrap"
          >
            {user.email}
          </span>
        )}

        <Badge className="shrink-0 text-xs">
          {question.marks} {question.marks === 1 ? 'mark' : 'marks'}
        </Badge>
      </div>

      {/* Question text */}
      <div className="pl-9">
        <MarkdownContent content={question.text} />
      </div>

      {/* MCQ options */}
      {question.options && question.options.length > 0 && (
        <div className="pl-9">
          <McqOptions options={question.options} />
        </div>
      )}

      {/* Sub-parts */}
      {question.sub_parts && question.sub_parts.length > 0 && (
        <div className="pl-9 space-y-2">
          {question.sub_parts.map((part) => (
            <div key={part.part} className="flex items-start gap-2 text-sm">
              <span className="shrink-0 font-semibold text-muted-foreground w-6">
                ({part.part})
              </span>
              <div className="flex-1 space-y-0.5">
                <MarkdownContent content={part.text} />
                <Badge variant="outline" className="text-xs">
                  {part.marks} {part.marks === 1 ? 'mark' : 'marks'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Answer slot */}
      {answerSlot && <div className="mt-2">{answerSlot}</div>}
    </div>
  )
}
