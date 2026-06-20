import { ipcMain } from 'electron'
import { PersistedState } from '../../../shared/types'
import { GetPersistedStateUseCase } from '../../use-cases/GetPersistedStateUseCase'
import { SetPersistedValueUseCase } from '../../use-cases/SetPersistedValueUseCase'
import { ElectronStorePersistence } from '../repositories/ElectronStorePersistence'

export function registerStoreHandlers(): void {
  const persistence = new ElectronStorePersistence()
  const getPersistedStateUseCase = new GetPersistedStateUseCase(persistence)
  const setPersistedValueUseCase = new SetPersistedValueUseCase(persistence)

  ipcMain.handle('store:get-all', async () => {
    return getPersistedStateUseCase.execute()
  })

  ipcMain.handle(
    'store:set',
    async (_event, key: keyof PersistedState, value: PersistedState[keyof PersistedState]) => {
      try {
        setPersistedValueUseCase.execute(key, value)
      } catch (error) {
        console.error('IPC Error in store:set:', error)
        throw error
      }
    }
  )
}
