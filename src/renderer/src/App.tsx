import { useState, useEffect, useCallback, useRef, memo } from 'react'
import { FolderContent } from '../../shared/types'
import MainViewer from './components/MainViewer'
import HUD from './components/HUD'
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
  const [folderContent, setFolderContent] = useState<FolderContent | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showHUD, setShowHUD] = useState(false)

  const handleNext = useCallback(() => {
    if (!folderContent) return
    setCurrentIndex((i) => Math.min(i + 1, folderContent.files.length - 1))
  }, [folderContent])

  const handlePrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(i - 1, 0))
  }, [])

  const toggleHUD = useCallback(() => setShowHUD((p) => !p), [])
  const closeHUD = useCallback(() => setShowHUD(false), [])

  const handleSelectFolder = useCallback(async () => {
    const result = await window.api.selectFolder()
    if (result && result.files.length > 0) {
      setFolderContent(result)
      setCurrentIndex(0)
    }
  }, [])

  const handlersRef = useRef({ handleNext, handlePrev, toggleHUD, closeHUD })
  handlersRef.current = { handleNext, handlePrev, toggleHUD, closeHUD }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { handleNext, handlePrev, toggleHUD, closeHUD } = handlersRef.current

      switch (e.key) {
        case 'ArrowRight':
          handleNext()
          break
        case 'ArrowLeft':
          handlePrev()
          break
        case 'Escape':
          closeHUD()
          break
        case '?':
          toggleHUD()
          break
        case '/':
          if (e.shiftKey) toggleHUD()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

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

          <MainViewer
            file={folderContent.files[currentIndex]}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        </div>
      )}

      <HUD isVisible={showHUD} onClose={closeHUD} />
    </div>
  )
}

export default App
