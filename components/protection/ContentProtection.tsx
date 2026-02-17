'use client'
import { useContentProtection } from '@/hooks/useContentProtection'

interface ContentProtectionProps {
  children: React.ReactNode
  enabled?: boolean
}

export function ContentProtection({ children, enabled = true }: ContentProtectionProps) {
  useContentProtection(enabled)

  return (
    <div
      className={enabled ? 'select-none' : undefined}
      style={enabled ? { WebkitUserSelect: 'none', userSelect: 'none' } : undefined}
    >
      {enabled && (
        <div className="print-blocked-message text-center py-20">
          <p className="text-lg font-medium">Printing is not allowed.</p>
          <p className="text-muted-foreground mt-2">
            Visit ExamPrep to access your purchased papers.
          </p>
        </div>
      )}
      <div className={enabled ? 'content-protected' : undefined}>
        {children}
      </div>
    </div>
  )
}
