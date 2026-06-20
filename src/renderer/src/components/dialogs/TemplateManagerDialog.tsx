import { memo, useState, useEffect, useRef } from 'react'

const INVALID_NAME_CHARS_REGEX = /[<>:"/\\|?*]/
const PAGE_SIZE = 4

interface TemplateManagerDialogProps {
  isOpen: boolean
  templates: Record<string, Record<string, string>>
  currentKeybinds: Record<string, string>
  onSave: (name: string) => void
  onLoad: (name: string) => void
  onDelete: (name: string) => void
  onClose: () => void
}

const TemplateManagerDialog = memo(
  ({
    isOpen,
    templates,
    currentKeybinds,
    onSave,
    onLoad,
    onDelete,
    onClose
  }: TemplateManagerDialogProps) => {
    const [name, setName] = useState('')
    const [error, setError] = useState('')
    const [confirmOverwrite, setConfirmOverwrite] = useState<string | null>(null)
    const [page, setPage] = useState(0)
    const inputRef = useRef<HTMLInputElement>(null)

    const templateEntries = Object.entries(templates)
    const totalPages = Math.max(1, Math.ceil(templateEntries.length / PAGE_SIZE))
    const pageEntries = templateEntries.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

    const pageEntriesRef = useRef(pageEntries)
    pageEntriesRef.current = pageEntries
    const totalPagesRef = useRef(totalPages)
    totalPagesRef.current = totalPages
    const onLoadRef = useRef(onLoad)
    onLoadRef.current = onLoad
    const onDeleteRef = useRef(onDelete)
    onDeleteRef.current = onDelete
    const onCloseRef = useRef(onClose)
    onCloseRef.current = onClose

    useEffect(() => {
      if (page >= totalPages) setPage(Math.max(0, totalPages - 1))
    }, [page, totalPages])

    useEffect(() => {
      if (!isOpen) return
      setName('')
      setError('')
      setConfirmOverwrite(null)
      setPage(0)
      setTimeout(() => inputRef.current?.focus(), 50)

      const handleKey = (e: KeyboardEvent): void => {
        if (e.key === 'Escape') {
          onCloseRef.current()
          return
        }

        const codeMatch = e.code.match(/^Digit([1-9])$/)
        const digit = codeMatch ? parseInt(codeMatch[1]) : NaN
        if (digit >= 1 && digit <= PAGE_SIZE && digit - 1 < pageEntriesRef.current.length) {
          e.preventDefault()
          const tplName = pageEntriesRef.current[digit - 1][0]
          if (e.ctrlKey && e.shiftKey) {
            onDeleteRef.current(tplName)
          } else if (e.ctrlKey) {
            onLoadRef.current(tplName)
          }
        }

        if (e.ctrlKey && !e.shiftKey && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
          e.preventDefault()
          setPage((p) => {
            if (e.key === 'ArrowRight') return Math.min(p + 1, totalPagesRef.current - 1)
            return Math.max(p - 1, 0)
          })
        }
      }
      window.addEventListener('keydown', handleKey)
      return () => window.removeEventListener('keydown', handleKey)
    }, [isOpen])

    if (!isOpen) return null

    const hasKeybinds = Object.keys(currentKeybinds).length > 0

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
      const value = e.target.value
      setName(value)
      setConfirmOverwrite(null)
      if (INVALID_NAME_CHARS_REGEX.test(value)) {
        setError('Name contains invalid characters')
      } else {
        setError('')
      }
    }

    const handleSave = (e: React.SyntheticEvent): void => {
      e.preventDefault()
      const trimmed = name.trim()
      if (!trimmed || error || !hasKeybinds) return

      if (trimmed in templates && confirmOverwrite !== trimmed) {
        setConfirmOverwrite(trimmed)
        return
      }

      onSave(trimmed)
      setName('')
      setConfirmOverwrite(null)
    }

    return (
      <div className="keybind-dialog-overlay" onClick={onClose}>
        <div
          className="keybind-dialog"
          onClick={(e) => e.stopPropagation()}
          style={{ maxWidth: 480 }}
        >
          <h3>Keybind Templates</h3>

          {templateEntries.length > 0 ? (
            <div style={{ marginBottom: '1.5rem' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'separate',
                  borderSpacing: '0.5rem 0',
                  tableLayout: 'fixed'
                }}
              >
                <colgroup>
                  <col />
                  <col style={{ width: 80 }} />
                  <col style={{ width: 80 }} />
                </colgroup>
                <thead>
                  <tr>
                    <th />
                    <th
                      style={{
                        color: 'var(--text-dim)',
                        fontSize: '0.75em',
                        fontWeight: 'normal',
                        textAlign: 'center',
                        paddingBottom: '0.25rem',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Ctrl + &lt;num&gt;
                    </th>
                    <th
                      style={{
                        color: 'var(--text-dim)',
                        fontSize: '0.75em',
                        fontWeight: 'normal',
                        textAlign: 'center',
                        paddingBottom: '0.25rem',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Ctrl+Shift+&lt;num&gt;
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pageEntries.map(([tplName, tplBinds], i) => (
                    <tr key={tplName} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td
                        style={{
                          padding: '0.5rem 0',
                          color: 'var(--text-main)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <span
                          className="key-cap"
                          style={{ marginRight: '0.5rem', fontSize: '0.8em' }}
                        >
                          {i + 1}
                        </span>
                        {tplName}{' '}
                        <span style={{ color: 'var(--text-dim)', fontSize: '0.85em' }}>
                          ({Object.keys(tplBinds).length})
                        </span>
                      </td>
                      <td style={{ textAlign: 'center', padding: '0.5rem 0.25rem' }}>
                        <button className="secondary-button" onClick={() => onLoad(tplName)}>
                          Load
                        </button>
                      </td>
                      <td style={{ textAlign: 'center', padding: '0.5rem 0.25rem' }}>
                        <button className="secondary-button" onClick={() => onDelete(tplName)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalPages > 1 && (
                <>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginTop: '0.75rem',
                      color: 'var(--text-muted)',
                      fontSize: '0.85em'
                    }}
                  >
                    <button
                      className="secondary-button"
                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.85em' }}
                      disabled={page === 0}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      &larr;
                    </button>
                    <span>
                      {page + 1} / {totalPages}
                    </span>
                    <button
                      className="secondary-button"
                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.85em' }}
                      disabled={page >= totalPages - 1}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      &rarr;
                    </button>
                  </div>
                  <div
                    style={{
                      color: 'var(--text-dim)',
                      fontSize: '0.75em',
                      textAlign: 'center',
                      marginTop: '0.25rem'
                    }}
                  >
                    Ctrl + &larr; / &rarr;
                  </div>
                </>
              )}
            </div>
          ) : (
            <p style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>No saved templates yet.</p>
          )}

          <form onSubmit={handleSave}>
            <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Save current keybinds as template
            </label>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="e.g. Photos"
              maxLength={30}
              disabled={!hasKeybinds}
            />
            {!hasKeybinds && (
              <div
                style={{ color: 'var(--text-dim)', fontSize: '0.85em', marginBottom: '0.75rem' }}
              >
                Add some keybinds first before saving a template.
              </div>
            )}
            {error && (
              <div style={{ color: '#ef4444', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                {error}
              </div>
            )}
            {confirmOverwrite && (
              <div
                style={{
                  color: 'var(--accent-color)',
                  fontSize: '0.875rem',
                  marginBottom: '0.75rem'
                }}
              >
                &quot;{confirmOverwrite}&quot; already exists. Click Save again to overwrite.
              </div>
            )}
            <div className="dialog-actions">
              <button type="button" className="secondary-button" onClick={onClose}>
                Close
              </button>
              <button
                type="submit"
                className="primary-button"
                disabled={!name.trim() || !!error || !hasKeybinds}
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

TemplateManagerDialog.displayName = 'TemplateManagerDialog'

export default TemplateManagerDialog
