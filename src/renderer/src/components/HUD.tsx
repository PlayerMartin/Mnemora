import { memo } from 'react'

interface HUDProps {
  isVisible: boolean
  onClose: () => void
  keybinds: Record<string, string>
}

const HUD = memo(({ isVisible, onClose, keybinds }: HUDProps) => {
  return (
    <div className={`hud-overlay ${isVisible ? 'visible' : ''}`} onClick={onClose}>
      <div className="hud-content" onClick={(e) => e.stopPropagation()}>
        <div className="hud-header">
          <h2>Keyboard Shortcuts</h2>
          <p>Master the media sorting workflow</p>
        </div>

        <div className="hud-sections">
          <div className="hud-section">
            <h3>Navigation</h3>
            <div className="keybind-list">
              <div className="keybind-item">
                <span className="key-cap">→</span>
                <span className="key-action">Skip current file</span>
              </div>
              <div className="keybind-item">
                <span className="key-cap">←</span>
                <span className="key-action">Previous file</span>
              </div>
              <div className="keybind-item">
                <span className="key-cap">?</span>
                <span className="key-action">Toggle this HUD</span>
              </div>
            </div>
          </div>

          <div className="hud-section">
            <h3>Actions</h3>
            <div className="keybind-list">
              <div className="keybind-item">
                <span className="key-cap">Del</span>
                <span className="key-action">Move to Trash</span>
              </div>
              <div className="keybind-item">
                <span className="key-cap">Ctrl</span>
                <span className="key-cap">Z</span>
                <span className="key-action">Undo last action</span>
              </div>
              <div className="keybind-item">
                <span className="key-cap">Ctrl</span>
                <span className="key-cap">O</span>
                <span className="key-action">Select source folder</span>
              </div>
              <div className="keybind-item">
                <span className="key-cap">Ctrl</span>
                <span className="key-cap">Shift</span>
                <span className="key-cap">C</span>
                <span className="key-action">Reset all keybinds</span>
              </div>
            </div>
          </div>

          <div className="hud-section" style={{ gridColumn: '1 / -1' }}>
            <h3>Custom Keybinds</h3>
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
