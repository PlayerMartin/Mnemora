import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { FolderContent } from '../shared/types'

const api = {
  selectFolder: (): Promise<FolderContent | null> => ipcRenderer.invoke('media:select-folder'),
  moveFile: (filePath: string, targetFolderName: string): Promise<string> =>
    ipcRenderer.invoke('media:move-file', filePath, targetFolderName),
  deleteFile: (filePath: string): Promise<void> => ipcRenderer.invoke('media:delete-file', filePath)
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
