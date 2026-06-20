import { MediaRepository } from '../domain/repositories/MediaRepository'
import { retryOnBusy } from './retryOnBusy'

export class UndoActionUseCase {
  constructor(private readonly mediaRepository: MediaRepository) {}

  async execute(originalPath: string, currentPath: string): Promise<void> {
    return retryOnBusy(() => this.mediaRepository.undoAction(originalPath, currentPath))
  }
}
