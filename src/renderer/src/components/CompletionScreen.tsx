import { memo } from 'react'
import { SessionStats } from '../hooks/useMediaSession'

type CompletionScreenProps = {
  stats: SessionStats
  skippedCount: number
  onSelectFolder: () => void
  onLoopBack: () => void
}

const CompletionScreen = memo(({ stats, skippedCount, onSelectFolder, onLoopBack }: CompletionScreenProps) => {
  return (
    <div className="completion-screen">
      <h2>All Done!</h2>
      <p>You have processed all files in this folder.</p>

      <div className="completion-stats">
        <div className="stat-group">
          <h3>Summary</h3>
          <ul>
            <li>Files Sorted: <strong>{stats.movedCount}</strong></li>
            <li>Files Deleted: <strong>{stats.deletedCount}</strong></li>
            <li>Files Skipped: <strong>{skippedCount}</strong></li>
          </ul>
        </div>

        {Object.keys(stats.foldersCount).length > 0 && (
          <div className="stat-group">
            <h3>Sorted by Folder</h3>
            <ul>
              {Object.entries(stats.foldersCount).map(([folder, count]) => (
                <li key={folder}>
                  <span className="folder-name">{folder}: </span>
                  <strong>{count}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="completion-actions">
        {skippedCount > 0 && (
          <button className="secondary-button" onClick={onLoopBack}>
            Loop Back Skipped Files
          </button>
        )}
        <button className="primary-button" onClick={onSelectFolder}>
          Sort Another Folder
        </button>
      </div>
    </div>
  )
})

CompletionScreen.displayName = 'CompletionScreen'

export default CompletionScreen
