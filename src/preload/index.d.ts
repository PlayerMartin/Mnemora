import { ElectronAPI } from '@electron-toolkit/preload'
import { FolderContent } from '../shared/types'

interface MediaApi {
  selectFolder: () => Promise<FolderContent | null>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: MediaApi
  }
}
