import { memo } from 'react'

interface ViewHeaderProps {
  folderPath: string
  currentIndex: number
  totalFiles: number
  onToggleHUD: () => void
  onChangeFolder: () => void
  error: string | null
  onDismissError: () => void
}

const ViewHeader = memo(
  ({
    folderPath,
    currentIndex,
    totalFiles,
    onToggleHUD,
    onChangeFolder,
    error,
    onDismissError
  }: ViewHeaderProps) => {
    return (
      <header>
        {error && (
          <div className="error-bar" onClick={onDismissError}>
            <span>⚠ {error}</span>
            <span className="error-dismiss">✕</span>
          </div>
        )}
        <div className="folder-info">
          <span className="label">Active Session</span>
          <span className="path" title={folderPath}>
            {folderPath}
          </span>
        </div>
        <div className="header-right">
          <div className="stats">
            {Math.min(currentIndex + 1, totalFiles)} / {totalFiles}
          </div>
          <div className="hud-hint" onClick={onToggleHUD}>
            Press <span className="key-cap">?</span> for help
          </div>
          <button className="secondary-button" onClick={onChangeFolder}>
            Change
          </button>
        </div>
      </header>
    )
  }
)

ViewHeader.displayName = 'ViewHeader'

export default ViewHeader
