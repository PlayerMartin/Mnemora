import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { SessionStats, useFolderSession } from './useFolderSession'
import { useKeybinds } from './useKeybinds'
import { useKeybindTemplates } from './useKeybindTemplates'
import { useKeyboardShortcuts, Keymap } from './useKeyboardShortcuts'
import { FolderContent } from 'src/shared/types'
import { STATIC_KEYBINDS } from '../config/keybinds'

export type ResumableSession = { folderPath: string; currentIndex: number } | null

export type MediaWorkflow = {
  showHUD: boolean
  toggleHUD: () => void
  closeHUD: () => void
  bindingKey: string | null
  editingFolder: string | null
  isCapturingKey: boolean
  handleBind: (key: string, folder: string) => void
  handleCancelBind: () => void
  startAddKeybind: () => void
  handleKeyCaptured: (key: string) => void
  handleEditKeybind: (key: string) => void
  handleRemoveKeybind: (key: string) => void
  folderContent: FolderContent | null
  currentIndex: number
  sessionStats: SessionStats
  handleNext: () => void
  handlePrev: () => void
  handleSelectFolder: () => Promise<void>
  handleResume: () => Promise<void>
  handleLoopBack: () => void
  keybinds: Record<string, string>
  resumableSession: ResumableSession
  showTemplates: boolean
  openTemplates: () => void
  closeTemplates: () => void
  templates: Record<string, Record<string, string>>
  handleSaveTemplate: (name: string) => void
  handleLoadTemplate: (name: string) => void
  handleDeleteTemplate: (name: string) => void
}

export function useMediaWorkflow(): MediaWorkflow {
  const [showHUD, setShowHUD] = useState(false)
  const [bindingKey, setBindingKey] = useState<string | null>(null)
  const [editingFolder, setEditingFolder] = useState<string | null>(null)
  const [resumableSession, setResumableSession] = useState<ResumableSession>(null)
  const [showTemplates, setShowTemplates] = useState(false)
  const [isCapturingKey, setIsCapturingKey] = useState(false)
  const hydratedRef = useRef(false)

  const toggleHUD = useCallback(() => setShowHUD((p) => !p), [])
  const closeHUD = useCallback(() => setShowHUD(false), [])
  const openTemplates = useCallback(() => setShowTemplates(true), [])
  const closeTemplates = useCallback(() => setShowTemplates(false), [])

  const folderSession = useFolderSession()
  const { keybinds, addKeybind, removeKeybind, clearKeybinds, setAllKeybinds } = useKeybinds()
  const { templates, setAllTemplates, saveTemplate, deleteTemplate } = useKeybindTemplates()

  // Hydrate from persisted store on mount
  useEffect(() => {
    window.api.store.getAll().then((s) => {
      setAllKeybinds(s.keybinds)
      setAllTemplates(s.keybindTemplates)
      if (s.session.folderPath) {
        setResumableSession({
          folderPath: s.session.folderPath,
          currentIndex: s.session.currentIndex
        })
      }
      hydratedRef.current = true
    })
  }, [setAllKeybinds, setAllTemplates])

  // Persist keybinds on change
  useEffect(() => {
    if (!hydratedRef.current) return
    window.api.store.set('keybinds', keybinds)
  }, [keybinds])

  // Persist templates on change
  useEffect(() => {
    if (!hydratedRef.current) return
    window.api.store.set('keybindTemplates', templates)
  }, [templates])

  // Persist session on change (debounced)
  useEffect(() => {
    if (!hydratedRef.current) return
    const timer = setTimeout(() => {
      window.api.store.set('session', {
        folderPath: folderSession.folderContent?.path ?? null,
        currentIndex: folderSession.currentIndex
      })
    }, 250)
    return () => clearTimeout(timer)
  }, [folderSession.folderContent?.path, folderSession.currentIndex])

  const handleSelectFolder = useCallback(async () => {
    await folderSession.handleSelectFolder()
  }, [folderSession])

  const handleResume = useCallback(async () => {
    if (!resumableSession) return
    const ok = await folderSession.restoreFolder(
      resumableSession.folderPath,
      resumableSession.currentIndex
    )
    if (!ok) {
      setResumableSession(null)
      window.api.store.set('session', { folderPath: null, currentIndex: 0 })
    }
  }, [resumableSession, folderSession])

  const handleSaveTemplate = useCallback(
    (name: string) => {
      saveTemplate(name, keybinds)
    },
    [saveTemplate, keybinds]
  )

  const handleLoadTemplate = useCallback(
    (name: string) => {
      const tpl = templates[name]
      if (tpl) setAllKeybinds({ ...keybinds, ...tpl })
    },
    [templates, keybinds, setAllKeybinds]
  )

  const handleDeleteTemplate = useCallback(
    (name: string) => {
      deleteTemplate(name)
    },
    [deleteTemplate]
  )

  const startAddKeybind = useCallback(() => {
    setIsCapturingKey(true)
  }, [])

  const handleKeyCaptured = useCallback(
    (key: string) => {
      setBindingKey(key)
      if (keybinds[key]) setEditingFolder(keybinds[key])
      setIsCapturingKey(false)
    },
    [keybinds]
  )

  const handleEditKeybind = useCallback(
    (key: string) => {
      setEditingFolder(keybinds[key])
      setBindingKey(key)
    },
    [keybinds]
  )

  const handleRemoveKeybind = useCallback(
    (key: string) => {
      removeKeybind(key)
    },
    [removeKeybind]
  )

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
      ),
      'Ctrl+t': openTemplates
    }),
    [
      showHUD,
      keybinds,
      folderSession,
      toggleHUD,
      closeHUD,
      clearKeybinds,
      removeKeybind,
      openTemplates
    ]
  )

  useKeyboardShortcuts(keymap, {
    enabled: !bindingKey && !showTemplates && !isCapturingKey,
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
    setIsCapturingKey(false)
  }, [])

  return {
    showHUD,
    toggleHUD,
    closeHUD,
    bindingKey,
    editingFolder,
    isCapturingKey,
    handleBind,
    handleCancelBind,
    startAddKeybind,
    handleKeyCaptured,
    handleEditKeybind,
    handleRemoveKeybind,
    folderContent: folderSession.folderContent,
    currentIndex: folderSession.currentIndex,
    sessionStats: folderSession.sessionStats,
    handleNext: folderSession.handleNext,
    handlePrev: folderSession.handlePrev,
    handleSelectFolder,
    handleResume,
    handleLoopBack: folderSession.handleLoopBack,
    keybinds,
    resumableSession,
    showTemplates,
    openTemplates,
    closeTemplates,
    templates,
    handleSaveTemplate,
    handleLoadTemplate,
    handleDeleteTemplate
  }
}

function devWarnIfStaticKeybindUndefined(keymap: Keymap): void {
  if (import.meta.env.DEV) {
    const definedKeys = STATIC_KEYBINDS.flatMap((d) => d.keys).filter(Boolean)
    for (const key of definedKeys) {
      if (!(key in keymap)) {
        console.warn(`Missing handler for static keybind: ${key}`)
      }
    }
  }
}
