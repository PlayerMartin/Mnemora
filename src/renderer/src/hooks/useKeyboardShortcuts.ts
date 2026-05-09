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
  keybinds: Record<string, string>
  onUnboundKey: (key: string) => void
  handleClearKeybinds: () => void
  handleSelectFolder: () => void
  isDialogOpen: boolean
  isHUDOpen: boolean
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  const handlersRef = useLatest(handlers)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      const { 
        handleNext, handlePrev, toggleHUD, closeHUD, 
        handleMove, handleDelete, handleUndo, 
        keybinds, onUnboundKey, handleClearKeybinds, handleSelectFolder, isDialogOpen, isHUDOpen 
      } = handlersRef.current

      if (isDialogOpen) return

      const key = e.key.toLowerCase()

      if (key === 'escape') {
        if (isHUDOpen) closeHUD()
        return
      }

      if (key === '?' || (key === '/' && e.shiftKey)) {
        toggleHUD()
        return
      }

      switch (key) {
        case 'arrowright':
          e.preventDefault()
          if (!isHUDOpen) handleNext()
          return
        case 'arrowleft':
          e.preventDefault()
          if (!isHUDOpen) handlePrev()
          return
        case 'delete':
          if (!isHUDOpen) handleDelete()
          return
        case 'z':
          if (e.ctrlKey && !isHUDOpen) handleUndo()
          return
        case 'o':
          if (e.ctrlKey) {
            handleSelectFolder()
            return
          }
          break
        case 'c':
          if (e.ctrlKey && e.shiftKey) {
            handleClearKeybinds()
            return
          }
          break
      }

      // Ignore modifiers and control keys for custom keybinds
      if (e.ctrlKey || e.altKey || e.metaKey || key.length > 1) return

      if (keybinds[key]) {
        if (!isHUDOpen) {
          handleMove(keybinds[key])
        }
        return
      }
      onUnboundKey(key)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlersRef])
}
