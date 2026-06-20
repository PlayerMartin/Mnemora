import ElectronStore from 'electron-store'
import { PersistedState } from '../../../shared/types'
import { PersistenceRepository } from '../../domain/repositories/PersistenceRepository'

const defaults: PersistedState = {
  session: { folderPath: null, currentIndex: 0 },
  keybinds: {},
  keybindTemplates: {}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Store = ((ElectronStore as any).default ?? ElectronStore) as typeof ElectronStore

export class ElectronStorePersistence implements PersistenceRepository {
  private readonly store = new Store<PersistedState>({ defaults })

  get<K extends keyof PersistedState>(key: K): PersistedState[K] {
    return this.store.get(key)
  }

  set<K extends keyof PersistedState>(key: K, value: PersistedState[K]): void {
    this.store.set(key, value)
  }

  getAll(): PersistedState {
    return this.store.store
  }
}
