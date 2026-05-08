import { useState, useCallback, memo } from 'react'
import MainViewer from './components/MainViewer'
import HUD from './components/HUD'
import CompletionScreen from './components/CompletionScreen'
import { useMediaSession } from './hooks/useMediaSession'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import './assets/main.css'

const WelcomeScreen = memo(({ onSelect }: { onSelect: () => void }) => (
  <div className="welcome-screen">
    <h1>MediaSorter</h1>
    <p>The efficient way to organize your media galleries with a single keypress.</p>
    <button className="primary-button" onClick={onSelect}>
      Select Source Folder
    </button>
  </div>
))

WelcomeScreen.displayName = 'WelcomeScreen'

function App(): React.JSX.Element {
  const [showHUD, setShowHUD] = useState(false)

  const {
    folderContent,
    currentIndex,
    sessionStats,
    handleNext,
    handlePrev,
    handleSelectFolder,
    handleUndo,
    handleDelete,
    handleMove,
    handleLoopBack
  } = useMediaSession()

  const toggleHUD = useCallback(() => setShowHUD((p) => !p), [])
  const closeHUD = useCallback(() => setShowHUD(false), [])

  useKeyboardShortcuts({
    handleNext,
    handlePrev,
    toggleHUD,
    closeHUD,
    handleMove,
    handleDelete,
    handleUndo
  })

  return (
    <div className="container">
      {folderContent === null ? (
        <WelcomeScreen onSelect={handleSelectFolder} />
      ) : (
        <div className="main-layout">
          <header>
            <div className="folder-info">
              <span className="label">Active Session</span>
              <span className="path" title={folderContent.path}>
                {folderContent.path}
              </span>
            </div>
            <div className="header-right">
              <div className="stats">
                {Math.min(currentIndex + 1, folderContent.files.length)} / {folderContent.files.length}
              </div>
              <div className="hud-hint" onClick={toggleHUD}>
                Press <span className="key-cap">?</span> for help
              </div>
              <button className="secondary-button" onClick={handleSelectFolder}>
                Change
              </button>
            </div>
          </header>

          {currentIndex >= folderContent.files.length ? (
            <CompletionScreen
              stats={sessionStats}
              skippedCount={folderContent.files.length}
              onSelectFolder={handleSelectFolder}
              onLoopBack={handleLoopBack}
            />
          ) : (
            <MainViewer
              key={folderContent.files[currentIndex].path}
              file={folderContent.files[currentIndex]}
              onNext={handleNext}
              onPrev={handlePrev}
            />
          )}
        </div>
      )}

      <HUD isVisible={showHUD} onClose={closeHUD} />
    </div>
  )
}

export default App
