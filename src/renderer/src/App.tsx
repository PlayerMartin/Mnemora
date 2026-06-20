import { useMediaWorkflow } from './hooks/useMediaWorkflow'
import WelcomeScreen from './components/screens/WelcomeScreen'
import CompletionScreen from './components/screens/CompletionScreen'
import ViewHeader from './components/layout/ViewHeader'
import MainViewer from './components/media/MainViewer'
import HUD from './components/layout/HUD'
import KeybindDialog from './components/dialogs/KeybindDialog'
import './assets/main.css'

function App(): React.JSX.Element {
  const {
    showHUD,
    toggleHUD,
    closeHUD,
    bindingKey,
    editingFolder,
    handleBind,
    handleCancelBind,
    folderContent,
    currentIndex,
    sessionStats,
    handleNext,
    handlePrev,
    handleSelectFolder,
    handleResume,
    handleLoopBack,
    keybinds,
    resumableSession
  } = useMediaWorkflow()

  if (!folderContent) {
    return (
      <div className="container">
        <WelcomeScreen
          onSelect={handleSelectFolder}
          resumeFolderPath={resumableSession?.folderPath}
          onResume={handleResume}
        />
      </div>
    )
  }

  return (
    <div className="container">
      <div className="main-layout">
        <ViewHeader
          folderPath={folderContent.path}
          currentIndex={currentIndex}
          totalFiles={folderContent.files.length}
          onToggleHUD={toggleHUD}
          onChangeFolder={handleSelectFolder}
        />

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

      <HUD isVisible={showHUD} onClose={closeHUD} keybinds={keybinds} />
      <KeybindDialog
        bindKey={bindingKey}
        onBind={handleBind}
        onCancel={handleCancelBind}
        initialFolderName={editingFolder}
      />
    </div>
  )
}

export default App
