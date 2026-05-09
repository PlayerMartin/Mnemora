import { memo, useState, useEffect, useRef } from 'react'

const INVALID_FOLDER_CHARS_REGEX = /[<>:"/\\|?*]/

interface KeybindDialogProps {
  bindKey: string | null
  onBind: (key: string, folder: string) => void
  onCancel: () => void
}

const KeybindDialog = memo(({ bindKey, onBind, onCancel }: KeybindDialogProps) => {
  const [folderName, setFolderName] = useState('')
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (bindKey) {
      setFolderName('')
      setError('')
      // Small timeout to ensure the dialog is rendered before focusing
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [bindKey])

  if (!bindKey) return null

  const validateFolderName = (name: string) => {
    if (INVALID_FOLDER_CHARS_REGEX.test(name)) {
      setError('Folder name contains invalid characters (< > : " / \\ | ? *)')
      return false
    }
    setError('')
    return true
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFolderName(value)
    validateFolderName(value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = folderName.trim()
    if (trimmed && validateFolderName(trimmed)) {
      onBind(bindKey, trimmed)
    } else if (!trimmed) {
      onCancel()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      // Stop the native event from bubbling up to the window listener
      // Otherwise, the HUD shortcut hook will catch it and close the HUD as well
      e.nativeEvent.stopImmediatePropagation()
      e.stopPropagation()
      onCancel()
    }
  }

  return (
    <div className="keybind-dialog-overlay" onClick={onCancel}>
      <div className="keybind-dialog" onClick={(e) => e.stopPropagation()}>
        <h3>Create Keybind</h3>
        <p>
          Bind key <span className="key-cap">{bindKey}</span> to folder:
        </p>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={folderName}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="e.g. Family"
            maxLength={20}
          />
          {error ? <div className="error-message" style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>{error}</div> : null}
          <div className="dialog-actions">
            <button type="button" className="secondary-button" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="primary-button" disabled={!folderName.trim() || !!error}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
})

KeybindDialog.displayName = 'KeybindDialog'

export default KeybindDialog
