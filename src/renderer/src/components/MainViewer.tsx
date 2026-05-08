import { MediaFile } from '../../../shared/types'

interface MainViewerProps {
  file: MediaFile
  onNext: () => void
  onPrev: () => void
}

export default function MainViewer({ file, onNext, onPrev }: MainViewerProps) {
  const mediaUrl = `media:///${file.path.replace(/\\/g, '/')}`

  return (
    <div className="main-viewer">
      <div className="media-container">
        {file.type === 'image' && <img src={mediaUrl} alt={file.name} />}
        {file.type === 'video' && (
          <video src={mediaUrl} controls autoPlay />
        )}
        {file.type === 'audio' && (
          <div className="audio-player">
            <div className="audio-icon">🎵</div>
            <audio src={mediaUrl} controls autoPlay />
            <div className="audio-info">{file.name}</div>
          </div>
        )}
      </div>

      <div className="viewer-controls">
        <button onClick={onPrev} className="control-btn">← Previous</button>
        <div className="file-counter">
          {file.name}
        </div>
        <button onClick={onNext} className="control-btn">Next →</button>
      </div>
    </div>
  )
}
