import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { FolderContent, PersistedState } from '../shared/types'

const api = {
  selectFolder: (): Promise<FolderContent | null> => ipcRenderer.invoke('media:select-folder'),
  loadFolder: (path: string): Promise<FolderContent | null> =>
    ipcRenderer.invoke('media:load-folder', path),
  moveFile: (filePath: string, targetFolderName: string): Promise<string> =>
    ipcRenderer.invoke('media:move-file', filePath, targetFolderName),
  deleteFile: (filePath: string): Promise<string> =>
    ipcRenderer.invoke('media:delete-file', filePath),
  undoAction: (originalPath: string, currentPath: string): Promise<void> =>
    ipcRenderer.invoke('media:undo-action', originalPath, currentPath),
  store: {
    getAll: (): Promise<PersistedState> => ipcRenderer.invoke('store:get-all'),
    set: <K extends keyof PersistedState>(key: K, value: PersistedState[K]): Promise<void> =>
      ipcRenderer.invoke('store:set', key, value)
  }
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
