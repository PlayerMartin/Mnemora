import { ipcMain } from 'electron';
import { SelectFolderUseCase } from '../../use-cases/SelectFolderUseCase';
import { ElectronMediaRepository } from '../repositories/ElectronMediaRepository';
import { ElectronDialogGateway } from '../gateways/ElectronDialogGateway';

export function registerMediaHandlers() {
  const mediaRepository = new ElectronMediaRepository();
  const dialogGateway = new ElectronDialogGateway();
  const selectFolderUseCase = new SelectFolderUseCase(mediaRepository, dialogGateway);

  ipcMain.handle('media:select-folder', async () => {
    return await selectFolderUseCase.execute();
  });
}
