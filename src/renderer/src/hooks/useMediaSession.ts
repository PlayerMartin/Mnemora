import { useState, useCallback, useRef } from 'react'
import { FolderContent, MediaFile } from '../../../shared/types'

export const HISTORY_STACK_SIZE = 20

export type ActionHistoryItem = {
  type: 'move' | 'delete'
  originalPath: string
  currentPath: string
  fileIndex: number
  file: MediaFile
}

export function useMediaSession() {
  const [folderContent, setFolderContent] = useState<FolderContent | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [history, setHistory] = useState<ActionHistoryItem[]>([])
  const isMovingRef = useRef(false)

  const filesLength = folderContent?.files.length ?? 0

  const handleNext = useCallback(() => {
    setCurrentIndex((i) => (filesLength > 0 ? Math.min(i + 1, filesLength - 1) : i))
  }, [filesLength])

  const handlePrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(i - 1, 0))
  }, [])

  const handleSelectFolder = useCallback(async () => {
    const result = await window.api.selectFolder()
    if (result && result.files.length > 0) {
      setFolderContent(result)
      setCurrentIndex(0)
      setHistory([])
    }
  }, [])

  const performFileAction = useCallback(
    async (actionType: 'move' | 'delete', action: () => Promise<string>) => {
      if (!folderContent || isMovingRef.current) return
      const currentFile = folderContent.files[currentIndex]
      if (!currentFile) return

      isMovingRef.current = true

      try {
        setFolderContent((prev) => {
          if (!prev) return null
          const newFiles = prev.files.filter((_, i) => i !== currentIndex)
          return { ...prev, files: newFiles }
        })

        const prevIndex = currentIndex
        if (currentIndex >= filesLength - 1 && currentIndex > 0) {
          setCurrentIndex((i) => i - 1)
        }

        const targetPath = await action()

        setHistory((prev) => {
          const newHistory = [
            ...prev,
            {
              type: actionType,
              originalPath: currentFile.path,
              currentPath: targetPath,
              fileIndex: prevIndex,
              file: currentFile
            }
          ]
          return newHistory.length > HISTORY_STACK_SIZE
            ? newHistory.slice(newHistory.length - HISTORY_STACK_SIZE)
            : newHistory
        })
      } catch (error) {
        console.error('File action failed:', error)
        setFolderContent(folderContent)
        setCurrentIndex(currentIndex)
      } finally {
        setTimeout(() => {
          isMovingRef.current = false
        }, 100)
      }
    },
    [folderContent, currentIndex, filesLength]
  )

  const handleUndo = useCallback(async () => {
    if (isMovingRef.current || history.length === 0 || !folderContent) return
    isMovingRef.current = true

    const lastAction = history[history.length - 1]

    try {
      await window.api.undoAction(lastAction.originalPath, lastAction.currentPath)

      setFolderContent((prev) => {
        if (!prev) return null
        const newFiles = [...prev.files]
        newFiles.splice(lastAction.fileIndex, 0, lastAction.file)
        return { ...prev, files: newFiles }
      })
      setCurrentIndex(lastAction.fileIndex)
      setHistory((prev) => prev.slice(0, -1))
    } catch (error) {
      console.error('Undo failed:', error)
    } finally {
      setTimeout(() => {
        isMovingRef.current = false
      }, 100)
    }
  }, [history, folderContent])

  const handleDelete = useCallback(() => {
    if (!folderContent?.files[currentIndex]) return
    const fileToMove = folderContent.files[currentIndex]
    performFileAction('delete', () => window.api.deleteFile(fileToMove.path))
  }, [folderContent, currentIndex, performFileAction])

  const handleMove = useCallback(
    (targetFolder: string) => {
      if (!folderContent?.files[currentIndex]) return
      const fileToMove = folderContent.files[currentIndex]
      performFileAction('move', () => window.api.moveFile(fileToMove.path, targetFolder))
    },
    [folderContent, currentIndex, performFileAction]
  )

  return {
    folderContent,
    currentIndex,
    handleNext,
    handlePrev,
    handleSelectFolder,
    handleUndo,
    handleDelete,
    handleMove
  }
}
