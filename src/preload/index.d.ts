import { ElectronAPI } from '@electron-toolkit/preload'
import { FolderContent, PersistedState } from '../shared/types'

interface MediaApi {
  selectFolder: () => Promise<FolderContent | null>
  moveFile: (filePath: string, targetFolderName: string) => Promise<string>
  deleteFile: (filePath: string) => Promise<string>
  undoAction: (originalPath: string, currentPath: string) => Promise<void>
  store: {
    getAll: () => Promise<PersistedState>
    set: <K extends keyof PersistedState>(key: K, value: PersistedState[K]) => Promise<void>
  }
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: MediaApi
  }
}
