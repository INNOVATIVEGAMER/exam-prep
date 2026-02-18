'use client'
import { McqOption } from '@/types'
import { MarkdownContent } from '@/components/paper/MarkdownContent'

interface McqOptionsProps {
  options: McqOption[]
}

export function McqOptions({ options }: McqOptionsProps) {
  return (
    <ol className="mt-3 space-y-2">
      {options.map((opt) => (
        <li key={opt.key} className="flex items-start gap-2 text-sm">
          <span className="shrink-0 inline-flex items-center justify-center size-5 rounded-full border border-border text-xs font-semibold uppercase mt-0.5">
            {opt.key}
          </span>
          <span className="flex-1">
            <MarkdownContent
              content={opt.text}
              className="inline [&>p]:inline [&>p]:my-0"
            />
          </span>
        </li>
      ))}
    </ol>
  )
}
