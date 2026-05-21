import { useState, useCallback } from 'react'

export type Keybinds = {
  keybinds: Record<string, string>
  addKeybind: (key: string, folder: string) => void
  removeKeybind: (key: string) => void
  clearKeybinds: () => void
}

export function useKeybinds(): Keybinds {
  const [keybinds, setKeybinds] = useState<Record<string, string>>({})

  const addKeybind = useCallback((key: string, folder: string) => {
    setKeybinds((prev) => ({ ...prev, [key]: folder }))
  }, [])

  const removeKeybind = useCallback((key: string) => {
    setKeybinds((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }, [])

  const clearKeybinds = useCallback(() => {
    setKeybinds({})
  }, [])

  return { keybinds, addKeybind, removeKeybind, clearKeybinds }
}
