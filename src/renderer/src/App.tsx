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

function useKeyboardShortcuts(handlers: {
  handleNext: () => void
  handlePrev: () => void
  toggleHUD: () => void
  closeHUD: () => void
  handleMove: (folder: string) => void
  handleDelete: () => void
}) {
  const handlersRef = useRef(handlers)

  useEffect(() => {
    handlersRef.current = handlers
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      const { handleNext, handlePrev, toggleHUD, closeHUD, handleMove, handleDelete } =
        handlersRef.current

      switch (e.key.toLowerCase()) {
        case 'arrowright':
          handleNext()
          break
        case 'arrowleft':
          handlePrev()
          break
        case 'delete':
          handleDelete()
          break
        case 'escape':
          closeHUD()
          break
        case '?':
          toggleHUD()
          break
        case '/':
          if (e.shiftKey) toggleHUD()
          break
        case 'f':
          handleMove('Family')
          break
        case 'g':
          handleMove('Gallery')
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
}

function App(): React.JSX.Element {
  const [folderContent, setFolderContent] = useState<FolderContent | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showHUD, setShowHUD] = useState(false)

  const handleNext = useCallback(() => {
    setCurrentIndex((i) => {
      if (!folderContent) return i
      return Math.min(i + 1, folderContent.files.length - 1)
    })
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

  const isMovingRef = useRef(false)

  const performFileAction = useCallback(
    async (action: () => Promise<unknown>) => {
      if (!folderContent || isMovingRef.current) return
      const currentFile = folderContent.files[currentIndex]
      if (!currentFile) return

      isMovingRef.current = true

      try {
        // Optimistically remove from UI
        setFolderContent((prev) => {
          if (!prev) return null
          const newFiles = prev.files.filter((_, i) => i !== currentIndex)
          return { ...prev, files: newFiles }
        })

        if (currentIndex >= folderContent.files.length - 1 && currentIndex > 0) {
          setCurrentIndex((i) => i - 1)
        }

        await action()
      } catch (error) {
        console.error('File action failed:', error)
        // Revert optimistic update on failure
        setFolderContent(folderContent)
        setCurrentIndex(currentIndex)
      } finally {
        setTimeout(() => {
          isMovingRef.current = false
        }, 100)
      }
    },
    [folderContent, currentIndex]
  )

  const handleDelete = useCallback(() => {
    if (!folderContent || !folderContent.files[currentIndex]) return
    const fileToMove = folderContent.files[currentIndex]
    performFileAction(() => window.api.deleteFile(fileToMove.path))
  }, [folderContent, currentIndex, performFileAction])

  const handleMove = useCallback(
    (targetFolder: string) => {
      if (!folderContent || !folderContent.files[currentIndex]) return
      const fileToMove = folderContent.files[currentIndex]
      performFileAction(() => window.api.moveFile(fileToMove.path, targetFolder))
    },
    [folderContent, currentIndex, performFileAction]
  )

  useKeyboardShortcuts({
    handleNext,
    handlePrev,
    toggleHUD,
    closeHUD,
    handleMove,
    handleDelete
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
