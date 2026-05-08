import { memo } from 'react'
import { MediaFile } from '../../../shared/types'

interface MainViewerProps {
  file: MediaFile
  onNext: () => void
  onPrev: () => void
}

const MainViewer = memo(function MainViewer({ file, onNext, onPrev }: MainViewerProps) {
  const mediaUrl = `media:///${file.path.replace(/\\/g, '/')}`

  return (
    <div className="main-viewer">
      <div className="media-container">
        {file.type === 'image' ? (
          <img src={mediaUrl} alt={file.name} />
        ) : file.type === 'video' ? (
          <video src={mediaUrl} controls autoPlay />
        ) : file.type === 'audio' ? (
          <div className="audio-player">
            <div className="audio-icon">🎵</div>
            <audio src={mediaUrl} controls autoPlay />
            <div className="audio-info">{file.name}</div>
          </div>
        ) : null}
      </div>

      <div className="viewer-footer">
        <button onClick={onPrev} className="control-btn" title="Previous (Left Arrow)">
          <span>←</span> Previous
        </button>
        <div className="file-name" title={file.path}>
          {file.name}
        </div>
        <button onClick={onNext} className="control-btn" title="Next (Right Arrow)">
          Next <span>→</span>
        </button>
      </div>
    </div>
  )
})

export default MainViewer
