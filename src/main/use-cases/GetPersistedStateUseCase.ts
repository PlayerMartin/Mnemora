import { PersistedState } from '../../shared/types'
import { PersistenceRepository } from '../domain/repositories/PersistenceRepository'

export class GetPersistedStateUseCase {
  constructor(private readonly persistence: PersistenceRepository) {}

  execute(): PersistedState {
    return this.persistence.getAll()
  }
}
