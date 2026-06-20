import { memo, useState, useEffect, useRef } from 'react'

const INVALID_FOLDER_CHARS_REGEX = /[<>:"/\\|?*]/
const RESERVED_KEYS = new Set(['?'])

interface KeybindDialogProps {
  bindKey: string | null
  onBind: (key: string, folder: string) => void
  onCancel: () => void
  initialFolderName?: string | null
  isCapturing?: boolean
  onCaptureKey?: (key: string) => void
}

const KeybindDialog = memo(
  ({
    bindKey,
    onBind,
    onCancel,
    initialFolderName,
    isCapturing,
    onCaptureKey
  }: KeybindDialogProps) => {
    const [folderName, setFolderName] = useState(initialFolderName || '')
    const [error, setError] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
      if (!bindKey) return
      setFolderName(initialFolderName || '')
      setError('')
      setTimeout(() => inputRef.current?.focus(), 50)

      const handleKey = (e: KeyboardEvent): void => {
        if (e.key === 'Escape') onCancel()
      }
      window.addEventListener('keydown', handleKey)
      return () => window.removeEventListener('keydown', handleKey)
    }, [bindKey, initialFolderName, onCancel])

    useEffect(() => {
      if (!isCapturing || bindKey) return

      const handleKey = (e: KeyboardEvent): void => {
        if (e.key === 'Escape') {
          onCancel()
          return
        }
        if (e.ctrlKey || e.altKey || e.metaKey) return
        if (e.key.length !== 1) return
        const char = e.key.toLowerCase()
        if (RESERVED_KEYS.has(char)) return
        e.preventDefault()
        onCaptureKey?.(char)
      }
      window.addEventListener('keydown', handleKey)
      return () => window.removeEventListener('keydown', handleKey)
    }, [isCapturing, bindKey, onCancel, onCaptureKey])

    if (!bindKey && !isCapturing) return null

    if (isCapturing && !bindKey) {
      return (
        <div className="keybind-dialog-overlay" onClick={onCancel}>
          <div className="keybind-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Add Keybind</h3>
            <p>Press the key to bind&hellip;</p>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.85em' }}>
              Single letter or number key. Esc to cancel.
            </p>
            <div className="dialog-actions">
              <button type="button" className="secondary-button" onClick={onCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )
    }

    if (!bindKey) return null

    const validateFolderName = (name: string): boolean => {
      if (INVALID_FOLDER_CHARS_REGEX.test(name)) {
        setError('Folder name contains invalid characters (< > : " / \\ | ? *)')
        return false
      }
      setError('')
      return true
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
      const value = e.target.value
      setFolderName(value)
      validateFolderName(value)
    }

    const handleSubmit = (e: React.SyntheticEvent): void => {
      e.preventDefault()
      const trimmed = folderName.trim()
      if (trimmed && validateFolderName(trimmed)) {
        onBind(bindKey, trimmed)
      } else if (!trimmed) {
        onCancel()
      }
    }

    return (
      <div className="keybind-dialog-overlay" onClick={onCancel}>
        <div className="keybind-dialog" onClick={(e) => e.stopPropagation()}>
          <h3>{initialFolderName ? 'Edit Keybind' : 'Create Keybind'}</h3>
          <p>
            Bind key <span className="key-cap">{bindKey}</span> to folder:
          </p>
          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              value={folderName}
              onChange={handleChange}
              placeholder="e.g. Family"
              maxLength={20}
            />
            {error ? (
              <div
                className="error-message"
                style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}
              >
                {error}
              </div>
            ) : null}
            <div className="dialog-actions">
              <button type="button" className="secondary-button" onClick={onCancel}>
                Cancel
              </button>
              <button
                type="submit"
                className="primary-button"
                disabled={!folderName.trim() || !!error}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }
)

KeybindDialog.displayName = 'KeybindDialog'

export default KeybindDialog
