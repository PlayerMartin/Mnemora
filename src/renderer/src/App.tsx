import { useState, useCallback, memo } from 'react'
import MainViewer from './components/MainViewer'
import HUD from './components/HUD'
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
    handleNext,
    handlePrev,
    handleSelectFolder,
    handleUndo,
    handleDelete,
    handleMove
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
                {currentIndex + 1} / {folderContent.files.length}
              </div>
              <div className="hud-hint" onClick={toggleHUD}>
                Press <span className="key-cap">?</span> for help
              </div>
              <button className="secondary-button" onClick={handleSelectFolder}>
                Change
              </button>
            </div>
          </header>

          {folderContent.files.length > 0 ? (
            <MainViewer
              key={folderContent.files[currentIndex].path}
              file={folderContent.files[currentIndex]}
              onNext={handleNext}
              onPrev={handlePrev}
            />
          ) : (
            <div className="completion-screen">
              <h2>All Done!</h2>
              <p>You have sorted all files in this folder.</p>
              <button className="primary-button" onClick={handleSelectFolder}>
                Sort Another Folder
              </button>
            </div>
          )}
        </div>
      )}

      <HUD isVisible={showHUD} onClose={closeHUD} />
    </div>
  )
}

export default App
