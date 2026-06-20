import { PersistedState } from '../../../shared/types'

export interface PersistenceRepository {
  get<K extends keyof PersistedState>(key: K): PersistedState[K]
  set<K extends keyof PersistedState>(key: K, value: PersistedState[K]): void
  getAll(): PersistedState
}
