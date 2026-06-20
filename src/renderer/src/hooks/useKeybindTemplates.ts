import { useState, useCallback } from 'react'

export type KeybindTemplates = {
  templates: Record<string, Record<string, string>>
  setAllTemplates: (record: Record<string, Record<string, string>>) => void
  saveTemplate: (name: string, keybinds: Record<string, string>) => void
  deleteTemplate: (name: string) => void
}

export function useKeybindTemplates(): KeybindTemplates {
  const [templates, setTemplates] = useState<Record<string, Record<string, string>>>({})

  const setAllTemplates = useCallback((record: Record<string, Record<string, string>>) => {
    setTemplates(record)
  }, [])

  const saveTemplate = useCallback((name: string, keybinds: Record<string, string>) => {
    setTemplates((prev) => ({ ...prev, [name]: keybinds }))
  }, [])

  const deleteTemplate = useCallback((name: string) => {
    setTemplates((prev) => {
      const next = { ...prev }
      delete next[name]
      return next
    })
  }, [])

  return { templates, setAllTemplates, saveTemplate, deleteTemplate }
}
