import { memo, useState, useEffect, useRef } from 'react'

const INVALID_FOLDER_CHARS_REGEX = /[<>:"/\\|?*]/

interface KeybindDialogProps {
  bindKey: string | null
  onBind: (key: string, folder: string) => void
  onCancel: () => void
  initialFolderName?: string | null
}

const KeybindDialog = memo(
  ({ bindKey, onBind, onCancel, initialFolderName }: KeybindDialogProps) => {
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
