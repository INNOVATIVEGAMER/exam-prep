'use client'
import { ContentProtection } from '@/components/protection/ContentProtection'

interface PaperAnswerWrapperProps {
  children: React.ReactNode
  /** If true, the paper is still locked (unpurchased) — no protection applied */
  locked: boolean
}

export function PaperAnswerWrapper({ children, locked }: PaperAnswerWrapperProps) {
  if (locked) return <>{children}</>

  return (
    <ContentProtection enabled>
      {children}
    </ContentProtection>
  )
}
