import { memo } from 'react'
import { STATIC_KEYBINDS, SECTION_ORDER, SECTION_LABELS } from '../../config/keybinds'

interface HUDProps {
  isVisible: boolean
  onClose: () => void
  keybinds: Record<string, string>
  onOpenTemplates: () => void
}

const HUD = memo(({ isVisible, onClose, keybinds, onOpenTemplates }: HUDProps) => {
  return (
    <div className={`hud-overlay ${isVisible ? 'visible' : ''}`} onClick={onClose}>
      <div className="hud-content" onClick={(e) => e.stopPropagation()}>
        <div className="hud-header">
          <h2>Keyboard Shortcuts</h2>
          <p>Master the media sorting workflow</p>
        </div>
        <div className="hud-sections">
          {SECTION_ORDER.map((section) => (
            <div className="hud-section" key={section}>
              <h3>{SECTION_LABELS[section]}</h3>
              <div className="keybind-list">
                {STATIC_KEYBINDS.filter((k) => k.section === section).map((k) => (
                  <div className="keybind-item" key={k.id}>
                    {k.display.map((cap, i) => (
                      <span className="key-cap" key={i}>
                        {cap}
                      </span>
                    ))}
                    <span className="key-action">{k.description}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="hud-section" style={{ gridColumn: '1 / -1' }}>
            <h3>
              Custom Keybinds{' '}
              <button
                className="secondary-button"
                style={{ fontSize: '0.75em', padding: '0.25rem 0.5rem', marginLeft: '0.5rem' }}
                onClick={onOpenTemplates}
              >
                Manage Templates
              </button>
            </h3>
            <div
              className="keybind-list"
              style={
                Object.keys(keybinds).length > 0
                  ? {
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      columnGap: '1.5rem',
                      rowGap: '0.75rem'
                    }
                  : undefined
              }
            >
              {Object.keys(keybinds).length === 0 ? (
                <div className="keybind-item">
                  <span
                    className="key-action"
                    style={{ fontStyle: 'italic', color: 'var(--text-dim)' }}
                  >
                    Press any unbound key to create a new folder shortcut.
                  </span>
                </div>
              ) : (
                Object.entries(keybinds).map(([key, folder]) => (
                  <div className="keybind-item" key={key}>
                    <span className="key-cap">{key}</span>
                    <span className="key-action">Move to /{folder}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

HUD.displayName = 'HUD'

export default HUD
