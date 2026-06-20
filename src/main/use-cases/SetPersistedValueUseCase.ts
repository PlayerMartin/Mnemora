import { PersistedState } from '../../shared/types'
import { PersistenceRepository } from '../domain/repositories/PersistenceRepository'

export class SetPersistedValueUseCase {
  constructor(private readonly persistence: PersistenceRepository) {}

  execute<K extends keyof PersistedState>(key: K, value: PersistedState[K]): void {
    this.persistence.set(key, value)
  }
}
