import { ipcMain } from 'electron'
import { SelectFolderUseCase } from '../../use-cases/SelectFolderUseCase'
import { MoveFileUseCase } from '../../use-cases/MoveFileUseCase'
import { DeleteFileUseCase } from '../../use-cases/DeleteFileUseCase'
import { UndoActionUseCase } from '../../use-cases/UndoActionUseCase'
import { ElectronMediaRepository } from '../repositories/ElectronMediaRepository'
import { ElectronDialogGateway } from '../gateways/ElectronDialogGateway'

export function registerMediaHandlers(): void {
  const mediaRepository = new ElectronMediaRepository()
  const dialogGateway = new ElectronDialogGateway()
  const selectFolderUseCase = new SelectFolderUseCase(mediaRepository, dialogGateway)
  const moveFileUseCase = new MoveFileUseCase(mediaRepository)
  const deleteFileUseCase = new DeleteFileUseCase(mediaRepository)
  const undoActionUseCase = new UndoActionUseCase(mediaRepository)

  ipcMain.handle('media:select-folder', async () => {
    return await selectFolderUseCase.execute()
  })

  ipcMain.handle('media:move-file', async (_event, filePath: string, targetFolderName: string) => {
    try {
      return await moveFileUseCase.execute(filePath, targetFolderName)
    } catch (error) {
      console.error('IPC Error in media:move-file:', error)
      throw error
    }
  })

  ipcMain.handle('media:delete-file', async (_event, filePath: string) => {
    try {
      return await deleteFileUseCase.execute(filePath)
    } catch (error) {
      console.error('IPC Error in media:delete-file:', error)
      throw error
    }
  })

  ipcMain.handle('media:undo-action', async (_event, originalPath: string, currentPath: string) => {
    try {
      return await undoActionUseCase.execute(originalPath, currentPath)
    } catch (error) {
      console.error('IPC Error in media:undo-action:', error)
      throw error
    }
  })
}
