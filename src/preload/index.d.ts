import { ElectronAPI } from '@electron-toolkit/preload'
import { FolderContent } from '../shared/types'

interface MediaApi {
  selectFolder: () => Promise<FolderContent | null>
  moveFile: (filePath: string, targetFolderName: string) => Promise<string>
  deleteFile: (filePath: string) => Promise<void>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: MediaApi
  }
}
