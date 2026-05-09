import { useState, useCallback, memo, useMemo } from 'react'
import MainViewer from './components/MainViewer'
import HUD from './components/HUD'
import CompletionScreen from './components/CompletionScreen'
import KeybindDialog from './components/KeybindDialog'
import { useMediaSession } from './hooks/useMediaSession'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import './assets/main.css'

const WelcomeScreen = memo(({ onSelect }: { onSelect: () => void }) => {
  const messages = [
    "Back up your files — trust me! (￣▽￣)b",
    "(•̀ᴗ•́)و Back. Up. Your. Files. Seriously, do it!",
    "(￢_￢) You backed up today, right? ...Right?",
    "щ(ಠ益ಠщ) NO BACKUP?! Friend, please—",
    "(•ω•) A little backup goes a long way, trust me~",
    "(ﾟヮﾟ) Fun fact: backups save lives. Well, files. Same thing!"
  ]

  const randomMessage = useMemo(
    () => messages[Math.floor(Math.random() * messages.length)],
    []
  )

  return (
    <div className="welcome-screen">
      <h1>Mnemora</h1>
      <p>The efficient way to organize your media galleries with a single keypress.</p>
      <em style={{ opacity: 0.5, fontSize: '0.85em' }}>{randomMessage}</em>
      <button className="primary-button" onClick={onSelect}>
        Select Source Folder
      </button>
    </div>
  )
})

WelcomeScreen.displayName = 'WelcomeScreen'

function App(): React.JSX.Element {
  const [showHUD, setShowHUD] = useState(false)
  const [bindingKey, setBindingKey] = useState<string | null>(null)

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
    handleLoopBack,
    keybinds,
    addKeybind,
    clearKeybinds
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
    handleUndo,
    keybinds,
    onUnboundKey: (key) => setBindingKey(key),
    handleClearKeybinds: clearKeybinds,
    handleSelectFolder: handleSelectFolder,
    isDialogOpen: bindingKey !== null,
    isHUDOpen: showHUD
  })

  const handleBind = useCallback(
    (key: string, folder: string) => {
      addKeybind(key, folder)
      setBindingKey(null)
    },
    [addKeybind]
  )

  const handleCancelBind = useCallback(() => {
    setBindingKey(null)
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

      <HUD isVisible={showHUD} onClose={closeHUD} keybinds={keybinds} />
      <KeybindDialog bindKey={bindingKey} onBind={handleBind} onCancel={handleCancelBind} />
    </div>
  )
}

export default App
