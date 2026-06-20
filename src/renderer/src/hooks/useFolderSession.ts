import { useState, useCallback, useRef } from 'react'
import { FolderContent, MediaFile } from '../../../shared/types'

export const HISTORY_STACK_SIZE = 200

function friendlyError(error: unknown): string {
  const code =
    error && typeof error === 'object' && 'code' in error ? (error as { code: string }).code : null
  switch (code) {
    case 'ENOENT':
      return 'File not found — it may have been moved or deleted.'
    case 'EACCES':
      return 'Permission denied — the file or folder is read-only.'
    case 'EBUSY':
      return 'File is in use by another program.'
    case 'EXDEV':
      return 'Cannot move across different drives.'
    default:
      return error instanceof Error ? error.message : 'An unexpected error occurred.'
  }
}

export type ActionHistoryItem = {
  type: 'move' | 'delete' | 'rename'
  originalPath: string
  currentPath: string
  fileIndex: number
  file: MediaFile
  targetFolder?: string
}

export type SessionStats = {
  deletedCount: number
  movedCount: number
  foldersCount: Record<string, number>
}

export type FolderSession = {
  folderContent: FolderContent | null
  currentIndex: number
  sessionStats: SessionStats
  lastError: string | null
  clearError: () => void
  handleNext: () => void
  handlePrev: () => void
  handleSelectFolder: () => Promise<boolean>
  restoreFolder: (path: string, index: number) => Promise<boolean>
  handleUndo: () => Promise<void>
  handleDelete: () => void
  handleMove: (targetFolder: string) => void
  handleRename: (newBaseName: string) => Promise<void>
  handleLoopBack: () => void
}

export function useFolderSession(): FolderSession {
  const [folderContent, setFolderContent] = useState<FolderContent | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [history, setHistory] = useState<ActionHistoryItem[]>([])
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    deletedCount: 0,
    movedCount: 0,
    foldersCount: {}
  })
  const [lastError, setLastError] = useState<string | null>(null)
  const isMovingRef = useRef(false)

  const clearError = useCallback(() => setLastError(null), [])

  const filesLength = folderContent?.files.length ?? 0

  const handleNext = useCallback(() => {
    setCurrentIndex((i) => (filesLength > 0 ? Math.min(i + 1, filesLength) : i))
  }, [filesLength])

  const handlePrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(i - 1, 0))
  }, [])

  const handleSelectFolder = useCallback(async () => {
    const result = await window.api.selectFolder()
    if (result) {
      setFolderContent(result)
      setCurrentIndex(0)
      setHistory([])
      setSessionStats({ deletedCount: 0, movedCount: 0, foldersCount: {} })
      return true
    }
    return false
  }, [])

  const restoreFolder = useCallback(async (path: string, index: number) => {
    const result = await window.api.loadFolder(path)
    if (result) {
      setFolderContent(result)
      setCurrentIndex(Math.min(index, result.files.length))
      setHistory([])
      setSessionStats({ deletedCount: 0, movedCount: 0, foldersCount: {} })
      return true
    }
    return false
  }, [])

  const performFileAction = useCallback(
    async (actionType: 'move' | 'delete', action: () => Promise<string>, targetFolder?: string) => {
      if (!folderContent || isMovingRef.current) return
      setLastError(null)
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
        const targetPath = await action()

        setHistory((prev) => {
          const newHistory = [
            ...prev,
            {
              type: actionType,
              originalPath: currentFile.path,
              currentPath: targetPath,
              fileIndex: prevIndex,
              file: currentFile,
              targetFolder
            }
          ]
          return newHistory.length > HISTORY_STACK_SIZE
            ? newHistory.slice(newHistory.length - HISTORY_STACK_SIZE)
            : newHistory
        })

        setSessionStats((prev) => {
          const newStats = { ...prev, foldersCount: { ...prev.foldersCount } }
          if (actionType === 'delete') {
            newStats.deletedCount += 1
          } else {
            newStats.movedCount += 1
            if (targetFolder) {
              newStats.foldersCount[targetFolder] = (newStats.foldersCount[targetFolder] || 0) + 1
            }
          }
          return newStats
        })
      } catch (error) {
        setLastError(friendlyError(error))
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

  const handleUndo = useCallback(async () => {
    if (isMovingRef.current || history.length === 0 || !folderContent) return
    setLastError(null)
    isMovingRef.current = true

    const lastAction = history[history.length - 1]

    try {
      await window.api.undoAction(lastAction.originalPath, lastAction.currentPath)

      if (lastAction.type === 'rename') {
        setFolderContent((prev) => {
          if (!prev) return null
          const newFiles = [...prev.files]
          newFiles[lastAction.fileIndex] = lastAction.file
          return { ...prev, files: newFiles }
        })
        setCurrentIndex(lastAction.fileIndex)
        setHistory((prev) => prev.slice(0, -1))
      } else {
        setFolderContent((prev) => {
          if (!prev) return null
          const newFiles = [...prev.files]
          newFiles.splice(lastAction.fileIndex, 0, lastAction.file)
          return { ...prev, files: newFiles }
        })
        setCurrentIndex(lastAction.fileIndex)
        setHistory((prev) => prev.slice(0, -1))

        setSessionStats((prev) => {
          const newStats = { ...prev, foldersCount: { ...prev.foldersCount } }
          if (lastAction.type === 'delete') {
            newStats.deletedCount = Math.max(0, newStats.deletedCount - 1)
          } else {
            newStats.movedCount = Math.max(0, newStats.movedCount - 1)
            if (lastAction.targetFolder && newStats.foldersCount[lastAction.targetFolder]) {
              newStats.foldersCount[lastAction.targetFolder] -= 1
              if (newStats.foldersCount[lastAction.targetFolder] <= 0) {
                delete newStats.foldersCount[lastAction.targetFolder]
              }
            }
          }
          return newStats
        })
      }
    } catch (error) {
      setLastError(friendlyError(error))
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
      performFileAction(
        'move',
        () => window.api.moveFile(fileToMove.path, targetFolder),
        targetFolder
      )
    },
    [folderContent, currentIndex, performFileAction]
  )

  const handleRename = useCallback(
    async (newBaseName: string) => {
      if (!folderContent || isMovingRef.current) return
      setLastError(null)
      const currentFile = folderContent.files[currentIndex]
      if (!currentFile) return

      isMovingRef.current = true

      try {
        const newPath = await window.api.renameFile(currentFile.path, newBaseName)
        const newName = newPath.split(/[\\/]/).pop()!

        setFolderContent((prev) => {
          if (!prev) return null
          const newFiles = [...prev.files]
          newFiles[currentIndex] = { ...currentFile, name: newName, path: newPath, id: newPath }
          return { ...prev, files: newFiles }
        })

        setHistory((prev) => {
          const newHistory = [
            ...prev,
            {
              type: 'rename' as const,
              originalPath: currentFile.path,
              currentPath: newPath,
              fileIndex: currentIndex,
              file: currentFile
            }
          ]
          return newHistory.length > HISTORY_STACK_SIZE
            ? newHistory.slice(newHistory.length - HISTORY_STACK_SIZE)
            : newHistory
        })
      } catch (error) {
        setLastError(friendlyError(error))
      } finally {
        setTimeout(() => {
          isMovingRef.current = false
        }, 100)
      }
    },
    [folderContent, currentIndex]
  )

  const handleLoopBack = useCallback(() => {
    setCurrentIndex(0)
  }, [])

  return {
    folderContent,
    currentIndex,
    sessionStats,
    lastError,
    clearError,
    handleNext,
    handlePrev,
    handleSelectFolder,
    restoreFolder,
    handleUndo,
    handleDelete,
    handleMove,
    handleRename,
    handleLoopBack
  }
}
