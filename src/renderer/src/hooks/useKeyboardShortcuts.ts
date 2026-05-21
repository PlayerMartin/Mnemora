import { useEffect } from 'react'
import { useLatest } from './useLatest'

export type Keymap = Record<string, (e: KeyboardEvent) => void>

type Options = {
  enabled?: boolean
  onUnmatchedKey?: (key: string) => void
}

function getKeymapKey(e: KeyboardEvent): string | null {
  if (e.key === '/' && e.shiftKey) return '?'

  if (e.key.length === 1) {
    const char = e.key.toLowerCase()
    if (e.ctrlKey) {
      return e.shiftKey ? `Ctrl+Shift+${char}` : `Ctrl+${char}`
    }
    if (e.altKey || e.metaKey) return null
    return char
  }

  if (e.ctrlKey || e.altKey || e.metaKey || e.shiftKey) return null

  const SPECIAL = new Set(['Escape', 'ArrowRight', 'ArrowLeft', 'Delete'])
  if (SPECIAL.has(e.key)) return e.key

  return null
}

export function useKeyboardShortcuts(
  keymap: Keymap,
  { enabled = true, onUnmatchedKey }: Options = {}
): void {
  const keymapRef = useLatest(keymap)
  const onUnmatchedKeyRef = useLatest(onUnmatchedKey)

  useEffect(() => {
    if (!enabled) return

    const handler = (e: KeyboardEvent): void => {
      const key = getKeymapKey(e)
      if (!key) return

      const fn = keymapRef.current[key]
      if (fn) {
        fn(e)
        return
      }

      if (onUnmatchedKeyRef.current && !e.ctrlKey && !e.altKey && !e.metaKey && key.length === 1) {
        onUnmatchedKeyRef.current(key)
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [enabled, keymapRef, onUnmatchedKeyRef])
}
