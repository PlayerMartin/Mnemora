import { useEffect } from 'react'
import { useLatest } from './useLatest'

export type ShortcutHandlers = {
  handleNext: () => void
  handlePrev: () => void
  toggleHUD: () => void
  closeHUD: () => void
  handleMove: (folder: string) => void
  handleDelete: () => void
  handleUndo: () => void
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  const handlersRef = useLatest(handlers)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      const { handleNext, handlePrev, toggleHUD, closeHUD, handleMove, handleDelete, handleUndo } =
        handlersRef.current

      switch (e.key.toLowerCase()) {
        case 'arrowright':
          handleNext()
          break
        case 'arrowleft':
          handlePrev()
          break
        case 'delete':
          handleDelete()
          break
        case 'escape':
          closeHUD()
          break
        case 'z':
          if (e.ctrlKey) handleUndo()
          break
        case '?':
          toggleHUD()
          break
        case '/':
          if (e.shiftKey) toggleHUD()
          break
        case 'f':
          handleMove('Family')
          break
        case 'g':
          handleMove('Gallery')
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlersRef])
}
