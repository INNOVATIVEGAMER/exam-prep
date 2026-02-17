import { MathRenderer } from '@/components/paper/MathRenderer'

/**
 * Parses a string containing `$$...$$` (block) and `$...$` (inline) math
 * into an array of React nodes. Plain text segments are returned as strings.
 *
 * Processing order matters: block math is extracted first so that `$$` tokens
 * don't interfere with the inline `$` regex.
 */
export function renderMathText(text: string): React.ReactNode[] {
  // Split on $$...$$ segments — capture group keeps the delimiter in the array
  const blockSegments = text.split(/((?:\$\$)[\s\S]+?(?:\$\$))/g)

  const result: React.ReactNode[] = []

  blockSegments.forEach((seg, blockIdx) => {
    if (seg.startsWith('$$') && seg.endsWith('$$') && seg.length > 4) {
      const math = seg.slice(2, -2)
      result.push(
        <MathRenderer key={`block-${blockIdx}`} math={math} block />
      )
      return
    }

    // Process inline math within non-block segments
    const inlineRe = /\$((?:[^$\\]|\\.)+?)\$/g
    let lastIdx = 0
    let match: RegExpExecArray | null

    while ((match = inlineRe.exec(seg)) !== null) {
      if (match.index > lastIdx) {
        result.push(seg.slice(lastIdx, match.index))
      }
      result.push(
        <MathRenderer
          key={`inline-${blockIdx}-${match.index}`}
          math={match[1]}
        />
      )
      lastIdx = match.index + match[0].length
    }

    if (lastIdx < seg.length) {
      result.push(seg.slice(lastIdx))
    }
  })

  return result
}
