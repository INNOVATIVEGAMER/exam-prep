'use client'
import { useEffect, useRef } from 'react'

export function useContentProtection(enabled: boolean) {
  const contentRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!enabled) return

    // Disable right-click context menu
    const onContextMenu = (e: MouseEvent) => e.preventDefault()

    // Block keyboard shortcuts: Ctrl/Cmd+C, P, S, U, A, Shift+I, F12
    // Also block PrintScreen key
    const onKeyDown = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey
      if (
        (ctrl && ['c', 'p', 's', 'u', 'a'].includes(e.key.toLowerCase())) ||
        (ctrl && e.shiftKey && e.key.toLowerCase() === 'i') ||
        e.key === 'F12' ||
        e.key === 'PrintScreen'
      ) {
        e.preventDefault()
      }
    }

    // Disable drag (prevents drag-select-copy)
    const onDragStart = (e: DragEvent) => e.preventDefault()

    // Hide content when user switches away (tab/app switch).
    // On mobile, many "scroll screenshot" tools require the user to briefly
    // switch away or use an assistant — this hides the content during that window.
    const onVisibilityChange = () => {
      if (!contentRef.current) return
      if (document.hidden) {
        contentRef.current.style.visibility = 'hidden'
        contentRef.current.style.opacity = '0'
      } else {
        contentRef.current.style.visibility = ''
        contentRef.current.style.opacity = ''
      }
    }

    document.addEventListener('contextmenu', onContextMenu)
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('dragstart', onDragStart)
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      document.removeEventListener('contextmenu', onContextMenu)
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('dragstart', onDragStart)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [enabled])

  return contentRef
}
