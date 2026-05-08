import { dialog } from 'electron'
import { DialogGateway } from '../../domain/gateways/DialogGateway'

export class ElectronDialogGateway implements DialogGateway {
  async selectDirectory(): Promise<string | null> {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory']
    })

    if (result.canceled || result.filePaths.length === 0) {
      return null
    }

    return result.filePaths[0]
  }
}
