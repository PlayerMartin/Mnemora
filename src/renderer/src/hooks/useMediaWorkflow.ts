import { useState, useCallback, useMemo } from 'react'
import { SessionStats, useFolderSession } from './useFolderSession'
import { useKeybinds } from './useKeybinds'
import { useKeyboardShortcuts, Keymap } from './useKeyboardShortcuts'
import { FolderContent } from 'src/shared/types'
import { STATIC_KEYBINDS } from '../config/keybinds'

export type MediaWorkflow = {
  showHUD: boolean
  toggleHUD: () => void
  closeHUD: () => void
  bindingKey: string | null
  editingFolder: string | null
  handleBind: (key: string, folder: string) => void
  handleCancelBind: () => void
  folderContent: FolderContent | null
  currentIndex: number
  sessionStats: SessionStats
  handleNext: () => void
  handlePrev: () => void
  handleSelectFolder: () => Promise<void>
  handleLoopBack: () => void
  keybinds: Record<string, string>
}

export function useMediaWorkflow(): MediaWorkflow {
  const [showHUD, setShowHUD] = useState(false)
  const [bindingKey, setBindingKey] = useState<string | null>(null)
  const [editingFolder, setEditingFolder] = useState<string | null>(null)

  const toggleHUD = useCallback(() => setShowHUD((p) => !p), [])
  const closeHUD = useCallback(() => setShowHUD(false), [])

  const folderSession = useFolderSession()
  const { keybinds, addKeybind, removeKeybind, clearKeybinds } = useKeybinds()

  const handleSelectFolder = useCallback(async () => {
    const selected = await folderSession.handleSelectFolder()
    if (selected) clearKeybinds()
  }, [folderSession, clearKeybinds])

  const keymap: Keymap = useMemo(
    () => ({
      ArrowRight: (e) => {
        e.preventDefault()
        if (!showHUD) folderSession.handleNext()
      },
      ArrowLeft: (e) => {
        e.preventDefault()
        if (!showHUD) folderSession.handlePrev()
      },
      Delete: () => {
        if (!showHUD) folderSession.handleDelete()
      },
      '?': toggleHUD,
      Escape: closeHUD,
      'Ctrl+z': () => {
        if (!showHUD) folderSession.handleUndo()
      },
      'Ctrl+o': folderSession.handleSelectFolder,
      'Ctrl+Shift+c': clearKeybinds,
      ...Object.fromEntries(
        Object.entries(keybinds).map(([k, f]) => [
          k,
          () => {
            if (!showHUD) folderSession.handleMove(f)
          }
        ])
      ),
      ...Object.fromEntries(
        Object.entries(keybinds).map(([k, f]) => [
          `Ctrl+${k}`,
          () => {
            setEditingFolder(f)
            setBindingKey(k)
          }
        ])
      ),
      ...Object.fromEntries(
        Object.entries(keybinds).map(([k]) => [`Ctrl+Shift+${k}`, () => removeKeybind(k)])
      )
    }),
    [showHUD, keybinds, folderSession, toggleHUD, closeHUD, clearKeybinds, removeKeybind]
  )

  useKeyboardShortcuts(keymap, {
    enabled: !bindingKey,
    onUnmatchedKey: setBindingKey
  })

  devWarnIfStaticKeybindUndefined(keymap)

  const handleBind = useCallback(
    (key: string, folder: string) => {
      addKeybind(key, folder)
      setBindingKey(null)
      setEditingFolder(null)
    },
    [addKeybind]
  )

  const handleCancelBind = useCallback(() => {
    setBindingKey(null)
    setEditingFolder(null)
  }, [])

  return {
    showHUD,
    toggleHUD,
    closeHUD,
    bindingKey,
    editingFolder,
    handleBind,
    handleCancelBind,
    folderContent: folderSession.folderContent,
    currentIndex: folderSession.currentIndex,
    sessionStats: folderSession.sessionStats,
    handleNext: folderSession.handleNext,
    handlePrev: folderSession.handlePrev,
    handleSelectFolder,
    handleLoopBack: folderSession.handleLoopBack,
    keybinds
  }
}

function devWarnIfStaticKeybindUndefined(keymap: Keymap): void {
  if (import.meta.env.DEV) {
    const definedKeys = STATIC_KEYBINDS.flatMap(d => d.keys).filter(Boolean)
    for (const key of definedKeys) {
      if (!(key in keymap)) {
        console.warn(`Missing handler for static keybind: ${key}`)
      }
    }
  }
}
