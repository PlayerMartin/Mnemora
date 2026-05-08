import { memo } from 'react'

interface HUDProps {
  isVisible: boolean
  onClose: () => void
}

const SHORTCUT_CONTENT = (
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
      </div>
    </div>
  </div>
)

const HUD = memo(({ isVisible, onClose }: HUDProps) => {
  return (
    <div className={`hud-overlay ${isVisible ? 'visible' : ''}`} onClick={onClose}>
      <div className="hud-content" onClick={(e) => e.stopPropagation()}>
        <div className="hud-header">
          <h2>Keyboard Shortcuts</h2>
          <p>Master the media sorting workflow</p>
        </div>
        {SHORTCUT_CONTENT}
      </div>
    </div>
  )
})

HUD.displayName = 'HUD'

export default HUD
