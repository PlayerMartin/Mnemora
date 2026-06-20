import { memo, useState, useEffect, useRef } from 'react'
import { expandRenameTemplate } from '../../utils/renameTemplate'

const INVALID_CHARS_REGEX = /[<>:"/\\|?*]/

interface RenameDialogProps {
  isOpen: boolean
  currentName: string
  extension: string
  ctimeMs: number
  onRename: (baseName: string) => void
  onClose: () => void
}

const RenameDialog = memo(
  ({ isOpen, currentName, extension, ctimeMs, onRename, onClose }: RenameDialogProps) => {
    const [name, setName] = useState('')
    const [error, setError] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
      if (!isOpen) return
      setName(currentName)
      setError('')
      setTimeout(() => {
        inputRef.current?.focus()
        inputRef.current?.select()
      }, 50)

      const handleKey = (e: KeyboardEvent): void => {
        if (e.key === 'Escape') onClose()
      }
      window.addEventListener('keydown', handleKey)
      return () => window.removeEventListener('keydown', handleKey)
    }, [isOpen, currentName, onClose])

    if (!isOpen) return null

    const validate = (value: string): boolean => {
      const expanded = expandRenameTemplate(value, ctimeMs)
      if (INVALID_CHARS_REGEX.test(expanded)) {
        setError('Name contains invalid characters')
        return false
      }
      setError('')
      return true
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
      const value = e.target.value
      setName(value)
      validate(value)
    }

    const handleSubmit = (e: React.SyntheticEvent): void => {
      e.preventDefault()
      const trimmed = name.trim()
      if (!trimmed || !validate(trimmed)) return
      const expanded = expandRenameTemplate(trimmed, ctimeMs)
      if (expanded === currentName) {
        onClose()
        return
      }
      onRename(expanded)
    }

    const hasTokens = name.includes('{date}')

    return (
      <div className="keybind-dialog-overlay" onClick={onClose}>
        <div className="keybind-dialog" onClick={(e) => e.stopPropagation()}>
          <h3>Rename File</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <input
                ref={inputRef}
                type="text"
                value={name}
                onChange={handleChange}
                placeholder="e.g. trip-{date}"
                maxLength={200}
                style={{ flex: 1, marginBottom: 0 }}
              />
              <span style={{ color: 'var(--text-dim)', fontSize: '0.9em', whiteSpace: 'nowrap' }}>
                {extension}
              </span>
            </div>
            {error && (
              <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                {error}
              </div>
            )}
            {hasTokens && (
              <div style={{ color: 'var(--text-dim)', fontSize: '0.8em', marginTop: '0.35rem' }}>
                Preview: {expandRenameTemplate(name, ctimeMs)}
                {extension}
              </div>
            )}
            <div className="dialog-actions" style={{ marginTop: '1rem' }}>
              <button type="button" className="secondary-button" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="primary-button" disabled={!name.trim() || !!error}>
                Rename
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }
)

RenameDialog.displayName = 'RenameDialog'

export default RenameDialog
