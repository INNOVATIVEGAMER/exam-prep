'use client'
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'

interface MathRendererProps {
  math: string
  block?: boolean
}

export function MathRenderer({ math, block = false }: MathRendererProps) {
  if (block) return <BlockMath math={math} />
  return <InlineMath math={math} />
}
