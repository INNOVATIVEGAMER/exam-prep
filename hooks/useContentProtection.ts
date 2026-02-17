'use client'
import { useEffect } from 'react'

export function useContentProtection(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return

    // Disable right-click context menu
    const onContextMenu = (e: MouseEvent) => e.preventDefault()

    // Block keyboard shortcuts: Ctrl/Cmd+C, P, S, U, A, Shift+I, F12
    const onKeyDown = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey
      if (
        (ctrl && ['c', 'p', 's', 'u', 'a'].includes(e.key.toLowerCase())) ||
        (ctrl && e.shiftKey && e.key.toLowerCase() === 'i') ||
        e.key === 'F12'
      ) {
        e.preventDefault()
      }
    }

    // Disable drag (prevents drag-select-copy)
    const onDragStart = (e: DragEvent) => e.preventDefault()

    document.addEventListener('contextmenu', onContextMenu)
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('dragstart', onDragStart)

    return () => {
      document.removeEventListener('contextmenu', onContextMenu)
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('dragstart', onDragStart)
    }
  }, [enabled])
}
