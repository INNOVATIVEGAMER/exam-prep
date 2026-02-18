'use client'

import 'katex/dist/katex.min.css'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'

interface MarkdownContentProps {
  content?: string
  /** Additional CSS classes on the wrapper div */
  className?: string
}

/**
 * Renders Markdown + LaTeX math content.
 *
 * Supports:
 * - Inline math: $...$
 * - Block math:  $$...$$
 * - GFM tables, strikethrough, task lists
 * - Fenced code blocks with language highlighting
 * - Bold, italic, headings, lists, links
 */
export function MarkdownContent({ content = '', className = '' }: MarkdownContentProps) {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // Style tables to match the app's design system
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto my-3">
              <table
                className="w-full text-sm border-collapse border border-border rounded-md"
                {...props}
              >
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead className="bg-muted/50" {...props}>
              {children}
            </thead>
          ),
          th: ({ children, ...props }) => (
            <th
              className="border border-border px-3 py-1.5 text-left font-semibold text-xs"
              {...props}
            >
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td className="border border-border px-3 py-1.5 text-xs" {...props}>
              {children}
            </td>
          ),
          // Style code blocks
          pre: ({ children, ...props }) => (
            <pre
              className="bg-muted/50 rounded-md p-3 my-2 overflow-x-auto text-xs font-mono"
              {...props}
            >
              {children}
            </pre>
          ),
          code: ({ children, className: codeClassName, ...props }) => {
            // Inline code (no className means it's not inside a pre/fenced block)
            const isInline = !codeClassName
            if (isInline) {
              return (
                <code
                  className="bg-muted/60 rounded px-1 py-0.5 text-xs font-mono"
                  {...props}
                >
                  {children}
                </code>
              )
            }
            return (
              <code className={codeClassName} {...props}>
                {children}
              </code>
            )
          },
          // Style headings within solutions (keep them small since they're nested)
          h1: ({ children, ...props }) => (
            <h4 className="font-bold text-sm mt-3 mb-1" {...props}>
              {children}
            </h4>
          ),
          h2: ({ children, ...props }) => (
            <h4 className="font-bold text-sm mt-3 mb-1" {...props}>
              {children}
            </h4>
          ),
          h3: ({ children, ...props }) => (
            <h4 className="font-bold text-sm mt-3 mb-1" {...props}>
              {children}
            </h4>
          ),
          h4: ({ children, ...props }) => (
            <h5 className="font-semibold text-sm mt-2 mb-1" {...props}>
              {children}
            </h5>
          ),
          // Style lists
          ul: ({ children, ...props }) => (
            <ul className="list-disc list-outside ml-5 my-1 space-y-0.5" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="list-decimal list-outside ml-5 my-1 space-y-0.5" {...props}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="text-sm leading-relaxed" {...props}>
              {children}
            </li>
          ),
          // Paragraphs
          p: ({ children, ...props }) => (
            <p className="text-sm leading-relaxed my-1" {...props}>
              {children}
            </p>
          ),
          // Strong/bold
          strong: ({ children, ...props }) => (
            <strong className="font-semibold" {...props}>
              {children}
            </strong>
          ),
          // Blockquotes (useful for notes/highlights)
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="border-l-2 border-primary/30 pl-3 my-2 text-muted-foreground italic"
              {...props}
            >
              {children}
            </blockquote>
          ),
          // Horizontal rules
          hr: ({ ...props }) => (
            <hr className="my-3 border-border" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
