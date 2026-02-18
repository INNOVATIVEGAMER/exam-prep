'use client'
import { Question } from '@/types'
import { Badge } from '@/components/ui/badge'
import { McqOptions } from '@/components/paper/McqOptions'
import { renderMathText } from '@/lib/render-math-text'
import { useAuth } from '@/hooks/useAuth'

interface QuestionCardProps {
  questionKey: string
  question: Question
  /** Slot for the answer card rendered below the question */
  answerSlot?: React.ReactNode
  /** Show user email watermark in the header — only for unlocked papers */
  showWatermark?: boolean
}

export function QuestionCard({
  questionKey,
  question,
  answerSlot,
  showWatermark = false,
}: QuestionCardProps) {
  const { user } = useAuth()

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
      <div className="text-sm leading-relaxed text-foreground pl-9">
        {renderMathText(question.text)}
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
                <div>{renderMathText(part.text)}</div>
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
