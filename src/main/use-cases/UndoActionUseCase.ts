import { MediaRepository } from '../domain/repositories/MediaRepository'

export class UndoActionUseCase {
  constructor(private readonly mediaRepository: MediaRepository) {}

  async execute(originalPath: string, currentPath: string): Promise<void> {
    await this.mediaRepository.undoAction(originalPath, currentPath)
  }
}
