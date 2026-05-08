import { useState } from 'react'
import { FolderContent } from '../../shared/types'
import MainViewer from './components/MainViewer'
import './assets/main.css'

function App(): React.JSX.Element {
  const [folderContent, setFolderContent] = useState<FolderContent | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleSelectFolder = async () => {
    const result = await window.api.selectFolder()
    if (result && result.files.length > 0) {
      setFolderContent(result)
      setCurrentIndex(0)
    }
  }

  const handleNext = () => {
    if (folderContent && currentIndex < folderContent.files.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  return (
    <div className="container">
      {!folderContent ? (
        <div className="welcome-screen">
          <h1>MediaSorter</h1>
          <p>Select a folder to start sorting your media.</p>
          <button className="primary-button" onClick={handleSelectFolder}>
            Select Source Folder
          </button>
        </div>
      ) : (
        <div className="main-layout">
          <header>
            <div className="folder-info">
              <span className="label">Current Folder:</span>
              <span className="path">{folderContent.path}</span>
            </div>
            <div className="stats">
              {currentIndex + 1} / {folderContent.files.length}
            </div>
            <button className="secondary-button" onClick={handleSelectFolder}>
              Change Folder
            </button>
          </header>

          <MainViewer
            file={folderContent.files[currentIndex]}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        </div>
      )}
    </div>
  )
}

export default App
