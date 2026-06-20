import { useMediaWorkflow } from './hooks/useMediaWorkflow'
import WelcomeScreen from './components/screens/WelcomeScreen'
import CompletionScreen from './components/screens/CompletionScreen'
import ViewHeader from './components/layout/ViewHeader'
import MainViewer from './components/media/MainViewer'
import HUD from './components/layout/HUD'
import KeybindDialog from './components/dialogs/KeybindDialog'
import TemplateManagerDialog from './components/dialogs/TemplateManagerDialog'
import './assets/main.css'

function App(): React.JSX.Element {
  const {
    showHUD,
    toggleHUD,
    closeHUD,
    bindingKey,
    editingFolder,
    isCapturingKey,
    handleBind,
    handleCancelBind,
    startAddKeybind,
    handleKeyCaptured,
    handleEditKeybind,
    handleRemoveKeybind,
    folderContent,
    currentIndex,
    sessionStats,
    handleNext,
    handlePrev,
    handleSelectFolder,
    handleResume,
    handleLoopBack,
    keybinds,
    resumableSession,
    showTemplates,
    openTemplates,
    closeTemplates,
    templates,
    handleSaveTemplate,
    handleLoadTemplate,
    handleDeleteTemplate
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

      <HUD
        isVisible={showHUD}
        onClose={closeHUD}
        keybinds={keybinds}
        onOpenTemplates={openTemplates}
        onAddKeybind={startAddKeybind}
        onEditKeybind={handleEditKeybind}
        onRemoveKeybind={handleRemoveKeybind}
      />
      <KeybindDialog
        bindKey={bindingKey}
        onBind={handleBind}
        onCancel={handleCancelBind}
        initialFolderName={editingFolder}
        isCapturing={isCapturingKey}
        onCaptureKey={handleKeyCaptured}
      />
      <TemplateManagerDialog
        isOpen={showTemplates}
        templates={templates}
        currentKeybinds={keybinds}
        onSave={handleSaveTemplate}
        onLoad={handleLoadTemplate}
        onDelete={handleDeleteTemplate}
        onClose={closeTemplates}
      />
    </div>
  )
}

export default App
